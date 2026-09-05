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
const { register, login, getProfile, updateProfile, verifyEmail, resendVerificationCode } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerificationCode);

module.exports = router;