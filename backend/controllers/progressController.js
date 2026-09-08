const Progress = require('../models/Progress');
const User = require('../models/User');

// @desc    Log daily progress (upserts if today's entry already exists)
// @route   POST /api/progress
// @access  Private
const logProgress = async (req, res) => {
  try {
    const { caloriesConsumed, caloriesBurned, weight, waterIntake, sleepHours, mood, workoutsCompleted, mealsLogged } = req.body;

    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    // Look for an existing progress entry for today
    let progress = await Progress.findOne({
      userId: req.user._id,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    if (progress) {
      // Update existing entry for today
      if (caloriesConsumed !== undefined) progress.caloriesConsumed = Number(caloriesConsumed);
      if (caloriesBurned !== undefined) progress.caloriesBurned = Number(caloriesBurned);
      if (weight !== undefined) progress.weight = Number(weight);
      if (waterIntake !== undefined) progress.waterIntake = Number(waterIntake);
      if (sleepHours !== undefined) progress.sleepHours = Number(sleepHours);
      if (mood) progress.mood = mood;
      if (workoutsCompleted) progress.workoutsCompleted = workoutsCompleted;
      if (mealsLogged) progress.mealsLogged = mealsLogged;
      progress.date = now;
      await progress.save();
    } else {
      // Create new entry for today
      progress = await Progress.create({
        userId: req.user._id,
        date: now,
        caloriesConsumed: Number(caloriesConsumed) || 0,
        caloriesBurned: Number(caloriesBurned) || 0,
        weight: Number(weight),
        waterIntake: Number(waterIntake) || 0,
        sleepHours: Number(sleepHours) || 0,
        mood: mood || 'okay',
        workoutsCompleted: workoutsCompleted || [],
        mealsLogged: mealsLogged || []
      });
    }

    // Atomically update req.user's weight on the User document itself
    if (weight !== undefined && !isNaN(weight) && Number(weight) > 0) {
      await User.findByIdAndUpdate(req.user._id, { weight: Number(weight) });
    }

    res.status(200).json(progress);
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

    // Check if today already has an entry
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const todayEntry = await Progress.findOne({
      userId: req.user._id,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    if (progressData.length === 0) {
      return res.json({
        message: 'No progress data available',
        todayEntry: todayEntry || null,
        summary: {
          period,
          totalDays: 0,
          averageCaloriesConsumed: 0,
          averageCaloriesBurned: 0,
          weightChange: 0,
          currentWeight: req.user?.weight || 0,
          startWeight: req.user?.weight || 0,
          averageWaterIntake: 0,
          averageSleepHours: 0,
          totalWorkouts: 0,
          streak: 0
        },
        chartData: []
      });
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
      todayEntry: todayEntry || null,
      chartData: progressData.map(p => ({
        _id: p._id,
        date: p.date,
        caloriesConsumed: p.caloriesConsumed,
        caloriesBurned: p.caloriesBurned,
        weight: p.weight,
        waterIntake: p.waterIntake,
        sleepHours: p.sleepHours,
        mood: p.mood
      }))
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get today's progress entry if already logged
// @route   GET /api/progress/today
// @access  Private
const getTodayProgress = async (req, res) => {
  try {
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const todayEntry = await Progress.findOne({
      userId: req.user._id,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    res.json(todayEntry || null);
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
  getProgressSummary,
  getTodayProgress
};
