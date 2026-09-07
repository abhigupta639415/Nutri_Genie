const jwt = require('jsonwebtoken');
const User = require('../models/User');
const emailService = require('../services/email.service');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Generate a 6-digit verification code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const VERIFICATION_CODE_TTL_MS = 10 * 60 * 1000; // 10 minutes

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, age, gender, weight, height, goal, activityLevel, dietaryPreference } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const verificationCode = generateVerificationCode();

    // Create user (unverified — no token is issued until they confirm their email)
    const user = await User.create({
      name,
      email,
      password,
      age,
      gender,
      weight,
      height,
      goal,
      activityLevel,
      dietaryPreference,
      verificationToken: verificationCode,
      verificationTokenExpires: Date.now() + VERIFICATION_CODE_TTL_MS
    });

    if (user) {
      res.status(201).json({
        message: 'Registration successful. Please check your email for a verification code.',
        email: user.email
      });

      // Send the code by email. Fire-and-forget so a slow mail server
      // doesn't hold up the response; failures are logged, not thrown.
      emailService.sendverificationEmail(user.email, user.name, verificationCode)
        .catch((error) => {
          console.error('Verification email failed:', error);
        });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Verify a user's email with the 6-digit code
// @route   POST /api/auth/verify-email
// @access  Public
const verifyEmail = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    if (!user.verificationToken || user.verificationToken !== verificationCode) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    if (user.verificationTokenExpires && user.verificationTokenExpires < Date.now()) {
      return res.status(400).json({ message: 'Verification code has expired. Please request a new one.' });
    }

    // Mark the user as verified and clear the code
    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    await user.save();

    // Welcome email now that they're actually verified (fire-and-forget)
    emailService.sendRegisterationEmail(user.email, user.name)
      .catch((error) => {
        console.error('Welcome email failed:', error);
      });

    // Verification succeeded — this is the point where they actually get logged in
    res.json({
      message: 'Email verified successfully',
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Resend a fresh verification code
// @route   POST /api/auth/resend-verification
// @access  Public
const resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    const verificationCode = generateVerificationCode();
    user.verificationToken = verificationCode;
    user.verificationTokenExpires = Date.now() + VERIFICATION_CODE_TTL_MS;
    await user.save();

    await emailService.sendverificationEmail(user.email, user.name, verificationCode);

    res.json({ message: 'A new verification code has been sent to your email.' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

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

    emailService.sendLoginEmail(user.email, user.name)
      .catch((error) => {
        console.error('Login email failed:', error);
      });

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
      user.weight = req.body.weight || user.weight;
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
  verifyEmail,
  resendVerificationCode
};