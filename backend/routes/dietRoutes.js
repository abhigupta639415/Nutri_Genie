const express = require('express');
const router = express.Router();
const { getDietPlan, getAlternatives } = require('../controllers/dietController');
const { generateDietPlan, getCachedPlan } = require('../controllers/geminiDietController');
const { protect } = require('../middleware/auth');

// Gemini-powered diet plan generation
router.post('/generate', protect, generateDietPlan);
router.get('/cached', protect, getCachedPlan);

// Legacy endpoints (still used by Dashboard for quick metrics)
router.get('/plan', protect, getDietPlan);
router.get('/alternatives/:mealType', protect, getAlternatives);

module.exports = router;
