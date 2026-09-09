const { generateWorkoutPlan, generateMultiWeekWorkoutPlan, getDifficultyLevel, normalizeGoal } = require('../utils/exerciseGenerator');
const Progress = require('../models/Progress');
const User = require('../models/User');
const GeminiDietPlan = require('../models/GeminiDietPlan');
const WorkoutPlan = require('../models/WorkoutPlan');

// @desc    Get personalized multi-week workout plan synced with diet plan duration & calendar Sundays
// @route   GET /api/workout/plan
// @access  Private
const getWorkoutPlan = async (req, res) => {
  try {
    const userGoal = req.user.goal;
    const userActivity = req.user.activityLevel;
    const { goal, level, weeks, days, forceRegen } = req.query;

    // Check if active GeminiDietPlan exists to sync plan duration and start date
    const activeDietPlan = await GeminiDietPlan.findOne({ userId: req.user._id }).sort({ createdAt: -1 });

    const durationWeeks = Number(weeks) || activeDietPlan?.planDurationWeeks || req.user.planDurationWeeks || 4;
    const durationDays = Number(days) || activeDietPlan?.planDurationDays || req.user.planDurationDays || (durationWeeks * 7);
    const startDate = activeDietPlan?.startDate || req.user.planStartDate || req.user.createdAt || new Date();

    const selectedGoal = normalizeGoal(goal || (userGoal === 'weight_loss' ? 'fatLoss' : userGoal === 'muscle_gain' || userGoal === 'weight_gain' ? 'muscleGain' : 'stayFit'));
    const selectedLevel = getDifficultyLevel(level || userActivity);

    // Look for existing saved WorkoutPlan or generate new
    let workoutPlanDoc = null;
    if (forceRegen !== 'true') {
      workoutPlanDoc = await WorkoutPlan.findOne({
        userId: req.user._id,
        goal: selectedGoal,
        level: selectedLevel,
        planDurationDays: durationDays
      });

      // If existing plan's start date is significantly different from anchor, regenerate to keep calendar Sundays accurate
      if (workoutPlanDoc && workoutPlanDoc.startDate) {
        const planStart = new Date(workoutPlanDoc.startDate);
        const anchorStart = new Date(startDate);
        planStart.setHours(0, 0, 0, 0);
        anchorStart.setHours(0, 0, 0, 0);
        if (planStart.getTime() !== anchorStart.getTime()) {
          workoutPlanDoc = null;
        }
      }
    }

    if (!workoutPlanDoc) {
      const generated = generateMultiWeekWorkoutPlan({
        goal: selectedGoal,
        level: selectedLevel,
        durationWeeks,
        durationDays,
        startDate
      });

      workoutPlanDoc = await WorkoutPlan.findOneAndUpdate(
        {
          userId: req.user._id,
          goal: selectedGoal,
          level: selectedLevel,
          planDurationDays: durationDays
        },
        {
          userId: req.user._id,
          goal: selectedGoal,
          level: selectedLevel,
          planDurationWeeks: generated.planDurationWeeks,
          planDurationDays: generated.planDurationDays,
          startDate: generated.startDate,
          days: generated.days
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    res.json({
      success: true,
      plan: workoutPlanDoc,
      days: workoutPlanDoc.days,
      planDurationWeeks: workoutPlanDoc.planDurationWeeks,
      planDurationDays: workoutPlanDoc.planDurationDays,
      startDate: workoutPlanDoc.startDate,
      goal: workoutPlanDoc.goal,
      level: workoutPlanDoc.level,
      guidelines: getWorkoutGuidelines(userGoal),
      safetyTips: getSafetyTips()
    });
  } catch (error) {
    console.error('Error in getWorkoutPlan:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Toggle workout completion for a specific day and sync with Progress
// @route   POST /api/workout/toggle
// @access  Private
const toggleWorkout = async (req, res) => {
  try {
    const { day, date, completed, workout } = req.body;

    // Determine target calendar date
    const targetDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Guard against future day check-offs
    const now = new Date();
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    if (startOfDay > todayEnd) {
      return res.status(400).json({
        success: false,
        message: 'Cannot mark future workouts as complete.',
        code: 'FUTURE_DAY'
      });
    }

    // Find existing progress doc for user on this calendar day
    let progress = await Progress.findOne({
      userId: req.user._id,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    const workoutName = workout?.name || `Day ${day} Workout`;
    let durationNum = 0;
    if (typeof workout?.duration === 'number') {
      durationNum = workout.duration;
    } else if (typeof workout?.duration === 'string') {
      durationNum = parseInt(workout.duration, 10) || 0;
    }
    const caloriesNum = Number(workout?.caloriesBurned) || 0;

    if (completed) {
      if (progress) {
        // Ensure not duplicate
        const exists = progress.workoutsCompleted.some(
          (w) => w.name === workoutName || (day !== undefined && w.day === Number(day))
        );
        if (!exists) {
          progress.workoutsCompleted.push({
            name: workoutName,
            duration: durationNum,
            caloriesBurned: caloriesNum,
            day: Number(day)
          });
          progress.caloriesBurned = (progress.caloriesBurned || 0) + caloriesNum;
          await progress.save();
        }
      } else {
        // Create new progress doc for that day with fallback to stored weight
        const userWeight = req.user.weight || 70;
        progress = await Progress.create({
          userId: req.user._id,
          date: targetDate,
          weight: userWeight,
          caloriesConsumed: 0,
          caloriesBurned: caloriesNum,
          waterIntake: 0,
          sleepHours: 0,
          mood: 'okay',
          workoutsCompleted: [{
            name: workoutName,
            duration: durationNum,
            caloriesBurned: caloriesNum,
            day: Number(day)
          }],
          mealsLogged: []
        });
      }
    } else {
      // Untoggling: remove matching entry
      if (progress) {
        const itemToRemove = progress.workoutsCompleted.find(
          (w) => w.name === workoutName || (day !== undefined && w.day === Number(day))
        );
        if (itemToRemove) {
          progress.caloriesBurned = Math.max(0, (progress.caloriesBurned || 0) - (itemToRemove.caloriesBurned || 0));
        }
        progress.workoutsCompleted = progress.workoutsCompleted.filter(
          (w) => w.name !== workoutName && (!day || w.day !== Number(day))
        );
        await progress.save();
      }
    }

    res.json({
      success: true,
      completed,
      workoutsCompleted: progress ? progress.workoutsCompleted : [],
      progress
    });
  } catch (error) {
    console.error('Error in toggleWorkout:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get multi-week workout cycle completion status based on user plan anchor date
// @route   GET /api/workout/week-status
// @access  Private
const getWorkoutWeekStatus = async (req, res) => {
  try {
    const activeDietPlan = await GeminiDietPlan.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
    const userStartDate = activeDietPlan?.startDate || req.user.planStartDate || req.user.createdAt || new Date();
    const durationWeeks = activeDietPlan?.planDurationWeeks || req.user.planDurationWeeks || 4;
    const durationDays = activeDietPlan?.planDurationDays || req.user.planDurationDays || (durationWeeks * 7);

    const anchor = new Date(userStartDate);
    anchor.setHours(0, 0, 0, 0);

    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    // Calculate elapsed calendar days from anchor to today
    const totalDiffDays = Math.floor((today.getTime() - anchor.getTime()) / (1000 * 60 * 60 * 24));

    // Determine current absolute day number (1..durationDays) and current week (1..durationWeeks)
    const currentDayNum = Math.max(1, Math.min(durationDays, totalDiffDays + 1));
    const currentWeekNum = Math.min(durationWeeks, Math.floor((currentDayNum - 1) / 7) + 1);

    // Multi-week plan bounds
    const planEnd = new Date(anchor);
    planEnd.setDate(anchor.getDate() + durationDays);
    planEnd.setHours(23, 59, 59, 999);

    // Cycle bounds for active 7-day window (backward compatibility)
    const cycleOffset = totalDiffDays >= 0 ? Math.floor(totalDiffDays / 7) * 7 : 0;
    const cycleStart = new Date(anchor);
    cycleStart.setDate(anchor.getDate() + cycleOffset);
    cycleStart.setHours(0, 0, 0, 0);

    const cycleEnd = new Date(cycleStart);
    cycleEnd.setDate(cycleStart.getDate() + 6);
    cycleEnd.setHours(23, 59, 59, 999);

    const progressList = await Progress.find({
      userId: req.user._id,
      date: { $gte: anchor, $lte: planEnd }
    });

    const completedDays = {};
    progressList.forEach((p) => {
      if (p.workoutsCompleted && p.workoutsCompleted.length > 0) {
        p.workoutsCompleted.forEach((w) => {
          if (w.day && w.day >= 1 && w.day <= durationDays) {
            completedDays[w.day] = true;
          }
        });
      }
    });

    res.json({
      success: true,
      startDate: anchor,
      planStartDate: anchor,
      planDurationWeeks: durationWeeks,
      planDurationDays: durationDays,
      currentDayNumber: currentDayNum,
      currentWeek: currentWeekNum,
      completedDays,
      // Backward compatibility fields
      weekStart: cycleStart,
      weekEnd: cycleEnd,
      cycleStart,
      cycleEnd
    });
  } catch (error) {
    console.error('Error in getWorkoutWeekStatus:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reset user workout cycle to Day 1 starting today
// @route   POST /api/workout/reset
// @access  Private
const resetWorkoutCycle = async (req, res) => {
  try {
    const now = new Date();
    await User.findByIdAndUpdate(req.user._id, { planStartDate: now });
    // Also clear cached WorkoutPlan so that calendar Sundays and day sequences recalculate from today
    await WorkoutPlan.deleteMany({ userId: req.user._id });
    res.json({
      success: true,
      message: 'Workout cycle reset to Day 1 starting today.',
      planStartDate: now
    });
  } catch (error) {
    console.error('Error in resetWorkoutCycle:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Workout guidelines
const getWorkoutGuidelines = (goal) => {
  const guidelines = {
    weight_loss: {
      frequency: '5-6 days per week',
      focus: 'Cardio and HIIT with Sunday active recovery',
      duration: '30-45 minutes per session',
      intensity: 'Moderate to high'
    },
    weight_gain: {
      frequency: '4-5 days per week',
      focus: 'Strength training with adequate rest',
      duration: '45-60 minutes per session',
      intensity: 'Moderate to high'
    },
    muscle_gain: {
      frequency: '4-6 days per week',
      focus: 'Progressive overload strength training',
      duration: '60-75 minutes per session',
      intensity: 'High'
    },
    maintenance: {
      frequency: '3-5 days per week',
      focus: 'Mixed cardio, strength, and mobility',
      duration: '30-45 minutes per session',
      intensity: 'Moderate'
    }
  };

  return guidelines[goal] || guidelines.maintenance;
};

// Safety tips
const getSafetyTips = () => {
  return [
    'Always warm up for 5-10 minutes before exercising',
    'Stay hydrated throughout your workout',
    'Listen to your body and honor Sunday recovery days',
    'Use proper form to prevent injuries',
    'Cool down and stretch after workouts',
    'Consult a doctor before starting any new exercise program'
  ];
};

module.exports = {
  getWorkoutPlan,
  toggleWorkout,
  getWorkoutWeekStatus,
  resetWorkoutCycle
};
