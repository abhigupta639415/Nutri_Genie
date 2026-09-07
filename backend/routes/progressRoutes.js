const express = require('express');
const router = express.Router();
const { logProgress, getProgress, getProgressSummary, getTodayProgress } = require('../controllers/progressController');
const { protect } = require('../middleware/auth');

router.post('/', protect, logProgress);
router.get('/', protect, getProgress);
router.get('/today', protect, getTodayProgress);
router.get('/summary', protect, getProgressSummary);

module.exports = router;
