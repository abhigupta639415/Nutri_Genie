const jwt = require('jsonwebtoken');
const User = require('../models/User');
const emailService = require('../services/email.service');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Generate a 6-digit numeric OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
const OTP_RATE_LIMIT_MS = 60 * 1000;  // 60 seconds rate limit per email

// @desc    Register new user & dispatch OTP email
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, age, gender, weight, height, goal, activityLevel, dietaryPreference } = req.body;

    // Check if user exists
    const normalizedEmail = email ? email.toLowerCase().trim() : '';
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const otp = generateOTP();
    const now = new Date();
    const otpExpiry = new Date(now.getTime() + OTP_EXPIRY_MS);

    // Create user (unverified — no token is issued until they confirm their email)
    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      age,
      gender,
      weight,
      initialWeight: weight,
      height,
      goal,
      activityLevel,
      dietaryPreference,
      planStartDate: now,
      otp,
      otpExpiry,
      otpLastSentAt: now,
      verificationToken: otp,
      verificationTokenExpires: otpExpiry,
      isVerified: false
    });

    if (user) {
      // Send real OTP via Brevo transactional email API
      const emailResult = await emailService.sendOTPEmail(user.email, user.name, otp);

      if (!emailResult.success) {
        console.error(`[AUTH] Failed to deliver initial OTP email to ${user.email}:`, {
          code: emailResult.code,
          error: emailResult.error,
          details: emailResult.details
        });
      }

      res.status(201).json({
        success: true,
        message: emailResult.success
          ? 'Registration successful. Please check your email for the 6-digit verification code.'
          : `Registration successful, but email delivery failed: ${emailResult.error}`,
        email: user.email,
        emailSent: emailResult.success,
        emailError: emailResult.success ? null : emailResult.error
      });
    }
  } catch (error) {
    console.error('Error in register:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Send / Resend a 6-digit OTP with 60-second rate-limiting
// @route   POST /api/auth/send-otp
// @access  Public
const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide an email address' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found with this email' });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: 'Email is already verified' });
    }

    // Rate-limit: max 1 request per 60 seconds
    if (user.otpLastSentAt) {
      const elapsedMs = Date.now() - new Date(user.otpLastSentAt).getTime();
      if (elapsedMs < OTP_RATE_LIMIT_MS) {
        const waitSeconds = Math.ceil((OTP_RATE_LIMIT_MS - elapsedMs) / 1000);
        return res.status(429).json({
          success: false,
          message: `Please wait ${waitSeconds} seconds before requesting a new OTP.`,
          waitSeconds
        });
      }
    }

    const otp = generateOTP();
    const now = new Date();
    const otpExpiry = new Date(now.getTime() + OTP_EXPIRY_MS);

    // 1. Database Write: save OTP & expiry to MongoDB
    try {
      await User.findByIdAndUpdate(
        user._id,
        {
          $set: {
            otp,
            otpExpiry,
            otpLastSentAt: now,
            verificationToken: otp,
            verificationTokenExpires: otpExpiry
          }
        },
        { runValidators: false }
      );
      // Sync local in-memory user instance
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      user.otpLastSentAt = now;
      user.verificationToken = otp;
      user.verificationTokenExpires = otpExpiry;
    } catch (dbError) {
      console.error('[AUTH send-otp] Database write failed when saving OTP:', dbError);
      return res.status(500).json({
        success: false,
        code: 'DATABASE_ERROR',
        message: `Database error storing OTP: ${dbError.message}`
      });
    }

    // 2. Email Dispatch: deliver OTP email via Brevo REST API (HTTPS)
    try {
      const emailResult = await emailService.sendOTPEmail(user.email, user.name, otp);

      if (!emailResult.success) {
        console.error(`[AUTH send-otp] Brevo delivery failed for ${user.email}:`, {
          code: emailResult.code,
          error: emailResult.error,
          details: emailResult.details
        });
        return res.status(500).json({
          success: false,
          code: emailResult.code || 'EMAIL_SEND_FAILED',
          message: emailResult.error || 'Failed to deliver OTP email via Brevo API.'
        });
      }
    } catch (emailDispatchError) {
      console.error(`[AUTH send-otp] Unexpected exception during email dispatch to ${user.email}:`, emailDispatchError);
      return res.status(500).json({
        success: false,
        code: emailDispatchError.code || 'EMAIL_DISPATCH_EXCEPTION',
        message: emailDispatchError.message || 'Failed to dispatch verification email.'
      });
    }

    console.log(`[AUTH send-otp] OTP successfully generated and emailed to ${user.email}`);
    res.json({
      success: true,
      message: 'A fresh 6-digit OTP has been sent to your email.'
    });
  } catch (error) {
    console.error('[AUTH send-otp] Global handler caught error:', error);
    res.status(500).json({
      success: false,
      code: error.code || 'INTERNAL_SERVER_ERROR',
      message: error.message || 'Internal server error occurred.'
    });
  }
};

// @desc    Verify 6-digit OTP and mark user as verified
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = async (req, res) => {
  try {
    const { email, otp, verificationCode } = req.body;
    const submittedOtp = (otp || verificationCode || '').toString().trim();

    if (!email || !submittedOtp) {
      return res.status(400).json({ message: 'Please provide both email and 6-digit OTP' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    const storedOtp = user.otp || user.verificationToken;
    if (!storedOtp) {
      return res.status(400).json({ message: 'No OTP request found. Please request a new OTP.' });
    }

    if (storedOtp !== submittedOtp) {
      return res.status(400).json({ message: 'Invalid OTP code. Please check your email and try again.' });
    }

    const expiry = user.otpExpiry || user.verificationTokenExpires;
    if (expiry && new Date(expiry).getTime() < Date.now()) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    // Mark as verified and clear OTP fields (Requirement 6)
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    user.otpLastSentAt = null;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    await user.save();

    // Welcome email (fire-and-forget)


    res.json({
      success: true,
      message: 'Email verified successfully',
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Error in verifyOtp:', error);
    res.status(500).json({ message: error.message });
  }
};

// Backwards-compatible aliases
const verifyEmail = verifyOtp;
const resendVerificationCode = sendOtp;

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Block unverified accounts — send back enough info for the frontend
    // to route the user straight to the verify-email screen
    if (!user.isVerified) {
      return res.status(403).json({
        message: 'Please verify your email before logging in.',
        needsVerification: true,
        email: user.email
      });
    }


    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.age = req.body.age || user.age;
      if (req.body.weight !== undefined) {
        if (!user.initialWeight) {
          user.initialWeight = user.weight || req.body.weight;
        }
        user.weight = req.body.weight;
      }
      user.height = req.body.height || user.height;
      user.goal = req.body.goal || user.goal;
      user.activityLevel = req.body.activityLevel || user.activityLevel;
      user.dietaryPreference = req.body.dietaryPreference || user.dietaryPreference;
      if (req.body.planDurationWeeks !== undefined) user.planDurationWeeks = req.body.planDurationWeeks;
      if (req.body.planDurationDays !== undefined) user.planDurationDays = req.body.planDurationDays;
      if (req.body.durationUnit !== undefined) user.durationUnit = req.body.durationUnit;
      if (req.body.foodPreferences !== undefined) user.foodPreferences = req.body.foodPreferences;
      if (req.body.allergies !== undefined) user.allergies = req.body.allergies;
      if (req.body.mealsPerDay !== undefined) user.mealsPerDay = req.body.mealsPerDay;
      if (req.body.planStartDate !== undefined) user.planStartDate = req.body.planStartDate;

      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  sendOtp,
  verifyOtp,
  verifyEmail,
  resendVerificationCode
};