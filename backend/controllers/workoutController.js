const { generateWorkoutPlan } = require('../utils/exerciseGenerator');

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
  getWorkoutPlan
};
