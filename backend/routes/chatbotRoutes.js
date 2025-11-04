const express = require('express');
const router = express.Router();
const { getChatbotResponse } = require('../controllers/chatbotController');
const { protect } = require('../middleware/auth');

router.post('/chat', protect, getChatbotResponse);

module.exports = router;
