const exercises = require('./exerciseData');
const { workoutRoutines } = require('./workoutData');

/**
 * Generate personalized single-day workout plan (retained for backward compatibility)
 */
const generateWorkoutPlan = (goal, activityLevel, location = 'home') => {
  let difficulty = getDifficultyLevel(activityLevel);
  let workoutTypes = getWorkoutTypes(goal);
  
  const workoutPlan = [];
  
  workoutTypes.forEach(type => {
    if (exercises[type] && exercises[type][difficulty]) {
      const exerciseList = exercises[type][difficulty].filter(ex => 
        location === 'both' || ex.location === location || ex.location === 'home'
      );
      
      if (exerciseList.length > 0) {
        const exercise = exerciseList[Math.floor(Math.random() * exerciseList.length)];
        workoutPlan.push({
          ...exercise,
          type,
          caloriesBurned: exercise.duration * exercise.caloriesPerMin
        });
      }
    }
  });

  const totalDuration = workoutPlan.reduce((sum, ex) => sum + ex.duration, 0);
  const totalCalories = workoutPlan.reduce((sum, ex) => sum + ex.caloriesBurned, 0);

  return {
    exercises: workoutPlan,
    totalDuration,
    totalCaloriesBurned: Math.round(totalCalories),
    recommendation: getWorkoutRecommendation(goal)
  };
};

/**
 * Normalize goal string to fatLoss | muscleGain | stayFit
 */
const normalizeGoal = (goal) => {
  if (!goal) return 'fatLoss';
  if (goal === 'weight_loss' || goal === 'fatLoss') return 'fatLoss';
  if (goal === 'muscle_gain' || goal === 'weight_gain' || goal === 'muscleGain') return 'muscleGain';
  if (goal === 'maintenance' || goal === 'stayFit') return 'stayFit';
  return 'fatLoss';
};

/**
 * Map activity level to difficulty
 */
const getDifficultyLevel = (activityLevel) => {
  if (['beginner', 'intermediate', 'advanced'].includes(activityLevel)) {
    return activityLevel;
  }
  const mapping = {
    sedentary: 'beginner',
    light: 'beginner',
    moderate: 'intermediate',
    active: 'intermediate',
    very_active: 'advanced'
  };
  return mapping[activityLevel] || 'beginner';
};

/**
 * Generate multi-week workout plan matching diet plan duration.
 * Dynamically marks EVERY calendar Sunday as a dedicated Rest Day (no exercises assigned).
 * Cycles active routines across all non-Sunday days.
 */
const generateMultiWeekWorkoutPlan = ({
  goal = 'fatLoss',
  level = 'beginner',
  durationWeeks = 4,
  durationDays = 28,
  startDate = new Date()
} = {}) => {
  const normalizedGoal = normalizeGoal(goal);
  const normalizedLevel = getDifficultyLevel(level);

  const goalRoutines = workoutRoutines[normalizedGoal] || workoutRoutines.fatLoss;
  const activeTemplates = goalRoutines[normalizedLevel] || goalRoutines.beginner;

  const totalDays = Number(durationDays) || (Number(durationWeeks) * 7) || 28;
  const totalWeeks = Number(durationWeeks) || Math.ceil(totalDays / 7) || 4;

  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const days = [];
  let routineIndex = 0;

  for (let i = 0; i < totalDays; i++) {
    const dayNum = i + 1;
    const weekNum = Math.floor(i / 7) + 1;

    const calendarDate = new Date(start);
    calendarDate.setDate(start.getDate() + i);
    calendarDate.setHours(0, 0, 0, 0);

    // 0 is Sunday in JavaScript Date.prototype.getDay()
    const isSunday = calendarDate.getDay() === 0;

    if (isSunday) {
      days.push({
        day: dayNum,
        week: weekNum,
        date: calendarDate,
        name: 'Active Recovery & Rest',
        type: 'rest',
        isRestDay: true,
        duration: '0 min',
        caloriesBurned: 0,
        exercises: [] // Strictly empty: no heavy exercises or cardio on calendar Sundays
      });
    } else {
      const template = activeTemplates[routineIndex % activeTemplates.length];
      routineIndex++;

      days.push({
        day: dayNum,
        week: weekNum,
        date: calendarDate,
        name: template.name,
        type: template.type,
        isRestDay: false,
        duration: template.duration || '40 min',
        caloriesBurned: template.caloriesBurned || 280,
        exercises: template.exercises || []
      });
    }
  }

  return {
    goal: normalizedGoal,
    level: normalizedLevel,
    planDurationWeeks: totalWeeks,
    planDurationDays: totalDays,
    startDate: start,
    days
  };
};

/**
 * Get workout types based on goal
 */
const getWorkoutTypes = (goal) => {
  const workoutMapping = {
    weight_loss: ['cardio', 'hiit', 'yoga'],
    weight_gain: ['strength', 'cardio'],
    muscle_gain: ['strength', 'hiit'],
    maintenance: ['yoga', 'cardio', 'strength']
  };
  return workoutMapping[goal] || ['yoga', 'cardio'];
};

/**
 * Get workout recommendation text
 */
const getWorkoutRecommendation = (goal) => {
  const recommendations = {
    weight_loss: 'Focus on cardio and HIIT for maximum calorie burn. Consistency is key!',
    weight_gain: 'Combine strength training with proper nutrition. Progressive overload is important.',
    muscle_gain: 'Prioritize compound movements and maintain high protein intake.',
    maintenance: 'Balance cardio and strength training. Stay active and enjoy the process!'
  };
  return recommendations[goal] || 'Stay consistent with your workouts!';
};

module.exports = {
  generateWorkoutPlan,
  generateMultiWeekWorkoutPlan,
  getDifficultyLevel,
  normalizeGoal
};
