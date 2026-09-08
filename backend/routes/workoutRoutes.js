const express = require('express');
const router = express.Router();
const { getWorkoutPlan, toggleWorkout, getWorkoutWeekStatus } = require('../controllers/workoutController');
const { protect } = require('../middleware/auth');

router.get('/plan', protect, getWorkoutPlan);
router.post('/toggle', protect, toggleWorkout);
router.get('/week-status', protect, getWorkoutWeekStatus);

module.exports = router;
