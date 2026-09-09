// const express = require('express');
// const router = express.Router();
// const { register, login, getProfile, updateProfile, verifyEmail } = require('../controllers/authController');
// const { protect } = require('../middleware/auth');

// router.post('/register', register);
// router.post('/login', login);
// router.get('/profile', protect, getProfile);
// router.put('/profile', protect, updateProfile);
// router.post('/verify-email', verifyEmail);

// module.exports = router;


const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getProfile,
  updateProfile,
  sendOtp,
  verifyOtp,
  verifyEmail,
  resendVerificationCode,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

// Real Email OTP Endpoints
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

// Password Reset Endpoints
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Backwards-compatible aliases
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerificationCode);

module.exports = router;