const express = require('express');
const router = express.Router();
const { getWorkoutPlan } = require('../controllers/workoutController');
const { protect } = require('../middleware/auth');

router.get('/plan', protect, getWorkoutPlan);

module.exports = router;
