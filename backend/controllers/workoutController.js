const { generateWorkoutPlan } = require('../utils/exerciseGenerator');
const Progress = require('../models/Progress');
const User = require('../models/User');

// @desc    Get personalized workout plan
// @route   GET /api/workout/plan
// @access  Private
const getWorkoutPlan = async (req, res) => {
  try {
    const { goal, activityLevel } = req.user;
    const { location } = req.query;

    const workoutPlan = generateWorkoutPlan(goal, activityLevel, location || 'home');
    
    res.json({
      plan: workoutPlan,
      guidelines: getWorkoutGuidelines(goal),
      safetyTips: getSafetyTips()
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
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

// @desc    Get current week's workout completion status
// @route   GET /api/workout/week-status
// @access  Private
const getWorkoutWeekStatus = async (req, res) => {
  try {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const currentIsoDay = dayOfWeek === 0 ? 7 : dayOfWeek;

    const monday = new Date(now);
    monday.setDate(now.getDate() - (currentIsoDay - 1));
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    const progressList = await Progress.find({
      userId: req.user._id,
      date: { $gte: monday, $lte: sunday }
    });

    const completedDays = {};
    progressList.forEach((p) => {
      if (p.workoutsCompleted && p.workoutsCompleted.length > 0) {
        p.workoutsCompleted.forEach((w) => {
          if (w.day && w.day >= 1 && w.day <= 7) {
            completedDays[w.day] = true;
          }
        });
        const pDate = new Date(p.date);
        const pDayOfWeek = pDate.getDay();
        const isoDay = pDayOfWeek === 0 ? 7 : pDayOfWeek;
        completedDays[isoDay] = true;
      }
    });

    res.json({
      success: true,
      weekStart: monday,
      weekEnd: sunday,
      completedDays
    });
  } catch (error) {
    console.error('Error in getWorkoutWeekStatus:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Workout guidelines
const getWorkoutGuidelines = (goal) => {
  const guidelines = {
    weight_loss: {
      frequency: '5-6 days per week',
      focus: 'Cardio and HIIT',
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
      focus: 'Mixed cardio and strength',
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
    'Listen to your body and rest when needed',
    'Use proper form to prevent injuries',
    'Cool down and stretch after workouts',
    'Consult a doctor before starting any new exercise program'
  ];
};

module.exports = {
  getWorkoutPlan,
  toggleWorkout,
  getWorkoutWeekStatus
};
