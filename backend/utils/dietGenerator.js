const indianFoods = require('./indianFoodData');

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Meal slot distribution ratios standard in clinical Indian dietetics
const MEAL_SLOT_RATIOS = {
  breakfast: { cal: 0.25, protein: 0.25, carbs: 0.25, fats: 0.25 },
  lunch:     { cal: 0.35, protein: 0.35, carbs: 0.35, fats: 0.35 },
  dinner:    { cal: 0.30, protein: 0.30, carbs: 0.30, fats: 0.30 },
  snacks:    { cal: 0.10, protein: 0.10, carbs: 0.10, fats: 0.10 },
};

/**
 * Calculate target calories and macronutrient breakdown for a specific meal slot
 */
const calculateSlotTargets = (targetDailyCal, targetMacros, mealType) => {
  const ratio = MEAL_SLOT_RATIOS[mealType] || MEAL_SLOT_RATIOS.lunch;
  return {
    calories: Math.round(targetDailyCal * ratio.cal),
    protein:  Math.round((targetMacros?.protein || 100) * ratio.protein),
    carbs:    Math.round((targetMacros?.carbs || 180) * ratio.carbs),
    fats:     Math.round((targetMacros?.fats || 45) * ratio.fats),
  };
};

/**
 * Multi-Factor Nutritionist Fitness Function
 * Scores a meal candidate against target macros, fitness goals, and guardrails.
 * Higher score = better clinical & culinary fit.
 */
const scoreMealCandidate = (dish, slotTargets, goal, dietaryPreference, dayState, recentDishes) => {
  let score = 100;

  // 1. Calorie fit (penalty for large deviations)
  const calDiffRatio = Math.abs(dish.calories - slotTargets.calories) / Math.max(1, slotTargets.calories);
  score -= calDiffRatio * 45;

  // 2. Macro-Aware Logic: Goal-Specific Weighting
  const tags = dish.tags || [];
  const proteinGap = slotTargets.protein - dish.protein;

  if (goal === 'muscle_gain' || goal === 'weight_loss') {
    // Protein adequacy is heavily weighted for lean muscle preservation and hypertrophy
    if (dish.protein >= slotTargets.protein * 0.85) {
      score += 35; // Significant bonus for hitting slot protein threshold
    }
    if (tags.includes('high_protein') || tags.includes('lean_protein')) {
      score += 20;
    }
    if (proteinGap > 0) {
      // Strong penalty if protein falls significantly below threshold
      score -= Math.min(40, proteinGap * 2.5);
    }
  } else {
    // Maintenance or standard healthy eating
    score -= Math.min(25, Math.abs(proteinGap) * 1.5);
  }

  // 3. Dietary Preference Specific Bonuses & Penalties
  if (dietaryPreference === 'diabetic_friendly') {
    if (tags.includes('low_gi') || tags.includes('millets') || tags.includes('fiber_rich')) {
      score += 30;
    }
    if (tags.includes('heavy_carb')) {
      score -= 50;
    }
    // Penalize carbs exceeding slot target by >20%
    if (dish.carbs > slotTargets.carbs * 1.2) {
      score -= 30;
    }
  }

  if (dietaryPreference === 'vegan') {
    if (tags.includes('vegan_protein') || tags.includes('complete_protein')) {
      score += 25;
    }
  }

  // 4. Clinical Guardrails: Prevent dual heavy-carb / heavy-fried meals on the same day
  if (dayState.hasHeavyBreakfast && slotTargets.mealType === 'dinner') {
    if (tags.includes('heavy_carb')) {
      score -= 200; // Strictly disallow paratha/naan/fried at both breakfast and dinner
    }
    if (tags.includes('light') || tags.includes('digestive') || tags.includes('low_carb')) {
      score += 25; // Reward lighter restorative dinners
    }
  }

  // 5. Anti-Repetition Recency Penalties
  // recentDishes: array of dish names served recently in this slot
  const slotHistory = recentDishes[slotTargets.mealType] || [];
  const lastIndex = slotHistory.lastIndexOf(dish.name);

  if (lastIndex !== -1) {
    const daysAgo = slotHistory.length - lastIndex;
    if (daysAgo <= 1) {
      score -= 500; // Disallow yesterday's exact dish
    } else if (daysAgo === 2) {
      score -= 250; // Severe penalty for 2 days ago
    } else if (daysAgo === 3) {
      score -= 100; // Moderate penalty for 3 days ago
    } else {
      score -= 30; // Small dampener for recent weeks
    }
  }

  // Also prevent same dish anywhere in the last 24 hours across slots
  if (dayState.todayMeals && dayState.todayMeals.includes(dish.name)) {
    score -= 400;
  }

  return score;
};

/**
 * Select the optimal meal for a given slot considering nutrition, variety, and guardrails
 */
const selectNutritionistMeal = (pool, slotTargets, goal, dietaryPreference, dayState, recentDishes) => {
  if (!pool || pool.length === 0) {
    return {
      name: 'Balanced Indian Meal',
      calories: slotTargets.calories,
      protein: slotTargets.protein,
      carbs: slotTargets.carbs,
      fats: slotTargets.fats,
      serving: '1 plate',
      region: 'Pan-Indian',
      tags: ['balanced'],
    };
  }

  // Score all candidates in the pool
  const scored = pool.map(dish => {
    const score = scoreMealCandidate(dish, slotTargets, goal, dietaryPreference, dayState, recentDishes);
    return { dish, score };
  });

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  // Take the highest scoring dish; if multiple are close (within 5 points), pick dynamically for subtle variety
  const topCandidate = scored[0];
  const closeCandidates = scored.filter(s => s.score >= topCandidate.score - 6);
  const picked = closeCandidates[Math.floor(Math.random() * closeCandidates.length)].dish;

  // Track in recent dishes
  if (!recentDishes[slotTargets.mealType]) {
    recentDishes[slotTargets.mealType] = [];
  }
  recentDishes[slotTargets.mealType].push(picked.name);
  // Keep history buffer manageable (last 8 entries)
  if (recentDishes[slotTargets.mealType].length > 8) {
    recentDishes[slotTargets.mealType].shift();
  }

  // Dietitian Portion Scaling: calibrate calories and macros to slot targets
  const rawCal = picked.calories || slotTargets.calories;
  const scaleFactor = Math.min(1.6, Math.max(0.7, slotTargets.calories / Math.max(1, rawCal)));

  const scaledCalories = Math.round(rawCal * scaleFactor);
  const scaledProtein = Math.round((picked.protein || 0) * scaleFactor);
  const scaledCarbs = Math.round((picked.carbs || 0) * scaleFactor);
  const scaledFats = Math.round((picked.fats || 0) * scaleFactor);

  let scaledServing = picked.serving || '1 portion';
  if (scaleFactor >= 1.25) {
    scaledServing += ` (${Math.round(scaleFactor * 10) / 10}x portion)`;
  } else if (scaleFactor <= 0.8) {
    scaledServing += ` (${Math.round(scaleFactor * 10) / 10}x portion)`;
  }

  return {
    ...picked,
    calories: scaledCalories,
    protein: scaledProtein,
    carbs: scaledCarbs,
    fats: scaledFats,
    serving: scaledServing,
  };
};

/**
 * Generate a single day's plan with 4 slots and nutritionist guardrail state
 */
const generateDayMealPlan = (targetCalories, macros, dietaryPreference, goal, recentDishes, dayNumber, dayName) => {
  const foodCategory = indianFoods[dietaryPreference] || indianFoods.vegetarian;

  const dayState = {
    hasHeavyBreakfast: false,
    todayMeals: [],
  };

  // 1. Breakfast
  const bTargets = { ...calculateSlotTargets(targetCalories, macros, 'breakfast'), mealType: 'breakfast' };
  const breakfast = selectNutritionistMeal(foodCategory.breakfast, bTargets, goal, dietaryPreference, dayState, recentDishes);
  dayState.todayMeals.push(breakfast.name);
  if (breakfast.tags && breakfast.tags.includes('heavy_carb')) {
    dayState.hasHeavyBreakfast = true;
  }

  // 2. Lunch
  const lTargets = { ...calculateSlotTargets(targetCalories, macros, 'lunch'), mealType: 'lunch' };
  const lunch = selectNutritionistMeal(foodCategory.lunch, lTargets, goal, dietaryPreference, dayState, recentDishes);
  dayState.todayMeals.push(lunch.name);

  // 3. Dinner (applies guardrail if heavy breakfast occurred)
  const dTargets = { ...calculateSlotTargets(targetCalories, macros, 'dinner'), mealType: 'dinner' };
  const dinner = selectNutritionistMeal(foodCategory.dinner, dTargets, goal, dietaryPreference, dayState, recentDishes);
  dayState.todayMeals.push(dinner.name);

  // 4. Snacks (light, wholesome)
  const sTargets = { ...calculateSlotTargets(targetCalories, macros, 'snacks'), mealType: 'snacks' };
  const snacks = selectNutritionistMeal(foodCategory.snacks, sTargets, goal, dietaryPreference, dayState, recentDishes);
  dayState.todayMeals.push(snacks.name);

  // Daily totals
  const totalCalories = breakfast.calories + lunch.calories + dinner.calories + snacks.calories;
  const totalProtein  = breakfast.protein  + lunch.protein  + dinner.protein  + snacks.protein;
  const totalCarbs    = breakfast.carbs    + lunch.carbs    + dinner.carbs    + snacks.carbs;
  const totalFats     = breakfast.fats     + lunch.fats     + dinner.fats     + snacks.fats;

  return {
    dayNumber,
    day: dayNumber,
    dayName: dayName || `Day ${dayNumber}`,
    meals: {
      breakfast,
      lunch,
      dinner,
      snacks,
    },
    totalCalories,
    totalProtein,
    totalCarbs,
    totalFats,
  };
};

/**
 * Generate full multi-week / multi-day meal plan with genuine daily variety
 * Output format matches both frontend DietPlan.jsx and Dashboard.jsx
 */
const generateWeeklyMealPlan = (targetCalories, macros, dietaryPreference = 'vegetarian', numDays = 28, options = {}) => {
  const goal = options.goal || 'maintenance';
  const totalDays = Math.max(1, Math.min(90, parseInt(numDays, 10) || 28));
  const numWeeks = Math.max(1, Math.ceil(totalDays / 7));

  // Sliding history tracker to prevent repeats across slots
  const recentDishes = {
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  };

  const weeks = [];

  for (let w = 1; w <= numWeeks; w++) {
    const week = {
      weekNumber: w,
      days: [],
    };

    for (let d = 1; d <= 7; d++) {
      const overallDayNum = (w - 1) * 7 + d;
      if (overallDayNum > totalDays) break;

      const dayName = DAY_NAMES[(d - 1) % 7];
      const dayPlan = generateDayMealPlan(
        targetCalories,
        macros,
        dietaryPreference,
        goal,
        recentDishes,
        d, // dayNumber within week (1-7)
        dayName
      );

      // Also set overall day index for convenient lookup
      dayPlan.overallDay = overallDayNum;
      week.days.push(dayPlan);
    }

    if (week.days.length > 0) {
      weeks.push(week);
    }
  }

  return {
    weeks,
    totalDays,
    planDurationWeeks: numWeeks,
    planDurationDays: totalDays,
    dietaryPreference,
    goal,
  };
};

/**
 * Single-day plan generator (backward compatible with original API)
 */
const generateMealPlan = (targetCalories, macros, dietaryPreference = 'vegetarian', goal = 'maintenance') => {
  const recentDishes = { breakfast: [], lunch: [], dinner: [], snacks: [] };
  const singleDay = generateDayMealPlan(targetCalories, macros, dietaryPreference, goal, recentDishes, 1, 'Today');
  
  return {
    ...singleDay.meals,
    totalCalories: singleDay.totalCalories,
    totalProtein:  singleDay.totalProtein,
    totalCarbs:    singleDay.totalCarbs,
    totalFats:     singleDay.totalFats,
  };
};

/**
 * Generate culturally and nutritionally appropriate alternative meal suggestions
 */
const getAlternativeMeals = (mealType, dietaryPreference, currentMeal) => {
  const foodCategory = indianFoods[dietaryPreference] || indianFoods.vegetarian;
  const meals = foodCategory[mealType] || [];

  return meals
    .filter(meal => meal.name !== currentMeal)
    .slice(0, 3)
    .map(meal => ({
      name: meal.name,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fats: meal.fats,
      serving: meal.serving,
      region: meal.region,
    }));
};

module.exports = {
  generateMealPlan,
  generateWeeklyMealPlan,
  generateDayMealPlan,
  getAlternativeMeals,
};

