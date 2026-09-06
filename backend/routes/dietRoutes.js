const express = require('express');
const router = express.Router();
const { getDietPlan, getAlternatives, updateProgress, resetProgress, getProgressStats } = require('../controllers/dietController');
const { generateDietPlan, getCachedPlan } = require('../controllers/geminiDietController');
const { protect } = require('../middleware/auth');

// Gemini-powered diet plan generation
router.post('/generate', protect, generateDietPlan);
router.get('/cached', protect, getCachedPlan);

// Progress tracking
router.post('/progress', protect, updateProgress);
router.post('/reset', protect, resetProgress);
router.get('/progress-stats', protect, getProgressStats);

// Legacy endpoints (still used by Dashboard for quick metrics)
router.get('/plan', protect, getDietPlan);
router.get('/alternatives/:mealType', protect, getAlternatives);


module.exports = router;
