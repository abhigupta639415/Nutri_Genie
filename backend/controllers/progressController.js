const Progress = require('../models/Progress');

// @desc    Log daily progress
// @route   POST /api/progress
// @access  Private
const logProgress = async (req, res) => {
  try {
    const { caloriesConsumed, caloriesBurned, weight, waterIntake, sleepHours, mood, workoutsCompleted, mealsLogged } = req.body;

    const progress = await Progress.create({
      userId: req.user._id,
      date: new Date(),
      caloriesConsumed,
      caloriesBurned,
      weight,
      waterIntake,
      sleepHours,
      mood,
      workoutsCompleted,
      mealsLogged
    });

    res.status(201).json(progress);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get progress history
// @route   GET /api/progress
// @access  Private
const getProgress = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const progressData = await Progress.find({
      userId: req.user._id,
      date: { $gte: startDate }
    }).sort({ date: -1 });

    res.json(progressData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get progress summary
// @route   GET /api/progress/summary
// @access  Private
const getProgressSummary = async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    
    let days;
    switch (period) {
      case 'week':
        days = 7;
        break;
      case 'month':
        days = 30;
        break;
      case 'year':
        days = 365;
        break;
      default:
        days = 7;
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const progressData = await Progress.find({
      userId: req.user._id,
      date: { $gte: startDate }
    }).sort({ date: 1 });

    if (progressData.length === 0) {
      return res.json({ message: 'No progress data available' });
    }

    // Calculate summary statistics
    const summary = {
      period,
      totalDays: progressData.length,
      averageCaloriesConsumed: Math.round(progressData.reduce((sum, p) => sum + p.caloriesConsumed, 0) / progressData.length),
      averageCaloriesBurned: Math.round(progressData.reduce((sum, p) => sum + p.caloriesBurned, 0) / progressData.length),
      weightChange: progressData[progressData.length - 1].weight - progressData[0].weight,
      currentWeight: progressData[progressData.length - 1].weight,
      startWeight: progressData[0].weight,
      averageWaterIntake: Math.round(progressData.reduce((sum, p) => sum + (p.waterIntake || 0), 0) / progressData.length),
      averageSleepHours: Math.round((progressData.reduce((sum, p) => sum + (p.sleepHours || 0), 0) / progressData.length) * 10) / 10,
      totalWorkouts: progressData.reduce((sum, p) => sum + (p.workoutsCompleted?.length || 0), 0),
      streak: calculateStreak(progressData)
    };

    res.json({
      summary,
      chartData: progressData.map(p => ({
        date: p.date,
        caloriesConsumed: p.caloriesConsumed,
        caloriesBurned: p.caloriesBurned,
        weight: p.weight,
        waterIntake: p.waterIntake,
        sleepHours: p.sleepHours
      }))
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Calculate workout streak
const calculateStreak = (progressData) => {
  let streak = 0;
  for (let i = progressData.length - 1; i >= 0; i--) {
    if (progressData[i].workoutsCompleted && progressData[i].workoutsCompleted.length > 0) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
};

module.exports = {
  logProgress,
  getProgress,
  getProgressSummary
};
