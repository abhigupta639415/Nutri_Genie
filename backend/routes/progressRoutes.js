const express = require('express');
const router = express.Router();
const { logProgress, getProgress, getProgressSummary } = require('../controllers/progressController');
const { protect } = require('../middleware/auth');

router.post('/', protect, logProgress);
router.get('/', protect, getProgress);
router.get('/summary', protect, getProgressSummary);

module.exports = router;
