const express = require('express');
const router = express.Router();
const { getDietPlan, getAlternatives } = require('../controllers/dietController');
const { protect } = require('../middleware/auth');

router.get('/plan', protect, getDietPlan);
router.get('/alternatives/:mealType', protect, getAlternatives);

module.exports = router;
