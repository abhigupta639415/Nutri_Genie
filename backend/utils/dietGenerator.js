const indianFoods = require('./indianFoodData');

/**
 * Generate personalized meal plan based on user profile
 */
const generateMealPlan = (targetCalories, macros, dietaryPreference) => {
  const foodCategory = indianFoods[dietaryPreference] || indianFoods.vegetarian;
  
  // Calculate calories per meal
  const breakfastCals = targetCalories * 0.25;
  const lunchCals = targetCalories * 0.35;
  const dinnerCals = targetCalories * 0.30;
  const snacksCals = targetCalories * 0.10;

  const mealPlan = {
    breakfast: selectMeal(foodCategory.breakfast, breakfastCals),
    lunch: selectMeal(foodCategory.lunch, lunchCals),
    dinner: selectMeal(foodCategory.dinner, dinnerCals),
    snacks: selectMeal(foodCategory.snacks, snacksCals),
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFats: 0
  };

  // Calculate totals
  ['breakfast', 'lunch', 'dinner', 'snacks'].forEach(mealType => {
    if (mealPlan[mealType]) {
      mealPlan.totalCalories += mealPlan[mealType].calories;
      mealPlan.totalProtein += mealPlan[mealType].protein;
      mealPlan.totalCarbs += mealPlan[mealType].carbs;
      mealPlan.totalFats += mealPlan[mealType].fats;
    }
  });

  return mealPlan;
};

/**
 * Select meal closest to target calories
 */
const selectMeal = (mealOptions, targetCalories) => {
  if (!mealOptions || mealOptions.length === 0) return null;
  
  let closestMeal = mealOptions[0];
  let minDiff = Math.abs(mealOptions[0].calories - targetCalories);

  mealOptions.forEach(meal => {
    const diff = Math.abs(meal.calories - targetCalories);
    if (diff < minDiff) {
      minDiff = diff;
      closestMeal = meal;
    }
  });

  return closestMeal;
};

/**
 * Generate alternative meal suggestions
 */
const getAlternativeMeals = (mealType, dietaryPreference, currentMeal) => {
  const foodCategory = indianFoods[dietaryPreference] || indianFoods.vegetarian;
  const meals = foodCategory[mealType] || [];
  
  return meals.filter(meal => meal.name !== currentMeal).slice(0, 3);
};

module.exports = {
  generateMealPlan,
  getAlternativeMeals
};
