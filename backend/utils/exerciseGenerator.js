const exercises = require('./exerciseData');

/**
 * Generate personalized workout plan
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
 * Map activity level to difficulty
 */
const getDifficultyLevel = (activityLevel) => {
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
  getDifficultyLevel
};
