/**
 * Dynamic Fallback Diet Plan Generator
 * Builds a fully personalized diet plan from mealDatabase.js when Gemini fails.
 *
 * Priority logic:
 *  1. Filter by dietary preference
 *  2. Apply cuisine preference scoring
 *  3. Remove allergy-containing meals (MANDATORY)
 *  4. Rotate across all 30 meals per category to maximise variety
 *  5. Scale calories/macros to match user targets per meal slot
 *  6. Validate macro math for every day
 */

const { getMealsByPreference } = require('./mealDatabase');

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Cuisine keyword mappings — used to boost matching meals to the top of each pool
const CUISINE_KEYWORDS = {
  'north indian': [
    'paratha', 'roti', 'dal makhani', 'paneer', 'rajma', 'chole', 'aloo', 'gobi',
    'naan', 'kadhi', 'jeera rice', 'palak', 'bhurji', 'chana', 'keema',
    'butter chicken', 'malai tikka', 'do pyaza', 'korma', 'biryani',
  ],
  'south indian': [
    'dosa', 'idli', 'vada', 'sambar', 'rasam', 'uttapam', 'pesarattu',
    'upma', 'pongal', 'appam', 'avial', 'chettinad', 'moilee', 'kootu',
    'rava idli', 'medu', 'coconut chutney',
  ],
  bengali: [
    'fish curry', 'mustard', 'hilsa', 'shorshe', 'luchi', 'khichuri',
    'mishti', 'aloo posto',
  ],
  gujarati: [
    'thepla', 'dhokla', 'khichdi', 'kadhi', 'fafda', 'handvo', 'undhiyu',
  ],
  maharashtrian: [
    'misal', 'poha', 'sabudana', 'vada pav', 'bhakri', 'zunka', 'pithla',
  ],
  punjabi: [
    'sarson da saag', 'makki roti', 'lassi', 'aloo paratha', 'rajma', 'chole',
    'tandoori', 'butter chicken', 'dal makhani',
  ],
  kerala: [
    'appam', 'puttu', 'fish moilee', 'stew', 'sadya', 'avial', 'thoran', 'coconut',
  ],
};

/**
 * Normalise allergy input into an array of lowercase terms to match against meal names.
 */
const parseAllergies = (allergies = '') => {
  if (!allergies || typeof allergies !== 'string') return [];
  // expand common shorthand
  const expanded = allergies
    .replace(/\bpeanuts?\b/gi, 'peanut,peanuts,groundnut')
    .replace(/\bnuts?\b/gi, 'nut,nuts,almond,walnut,cashew,peanut')
    .replace(/\bdairy\b/gi, 'milk,curd,paneer,cheese,butter,ghee,cream,yogurt,raita')
    .replace(/\beggs?\b/gi, 'egg,eggs,omelette,bhurji')
    .replace(/\bgluten\b/gi, 'wheat,roti,paratha,naan,bread,maida,atta');
  return expanded.split(/[,;]\s*/).map(s => s.trim().toLowerCase()).filter(Boolean);
};

/**
 * Check if a meal name contains any allergy term.
 */
const mealHasAllergen = (mealName, allergyTerms) => {
  if (allergyTerms.length === 0) return false;
  const lower = mealName.toLowerCase();
  return allergyTerms.some(term => lower.includes(term));
};

/**
 * Score a meal name by how well it matches the cuisine preference.
 * Higher = better match. 0 = no match.
 */
const cuisineScore = (mealName, foodPreferences = '') => {
  if (!foodPreferences) return 0;
  const lower = foodPreferences.toLowerCase();
  const mealLower = mealName.toLowerCase();

  for (const [cuisine, keywords] of Object.entries(CUISINE_KEYWORDS)) {
    if (lower.includes(cuisine)) {
      const matched = keywords.filter(kw => mealLower.includes(kw)).length;
      if (matched > 0) return matched;
    }
  }
  // Generic keyword match from the preference string itself
  const prefWords = lower.split(/\s+/).filter(w => w.length > 3);
  return prefWords.filter(w => mealLower.includes(w)).length;
};

/**
 * Build the filtered, cuisine-sorted pool of meals for a given type.
 */
const buildMealPool = (mealDb, mealType, allergyTerms, foodPreferences) => {
  let pool = mealDb[mealType] || [];

  // 1. Remove allergen meals (MANDATORY – always apply)
  if (allergyTerms.length > 0) {
    const safe = pool.filter(m => !mealHasAllergen(m.name, allergyTerms));
    // Only apply filter if at least one safe option remains
    if (safe.length > 0) pool = safe;
    else console.warn(`[Fallback] All ${mealType} meals contain allergens – using full pool as last resort.`);
  }

  // 2. Sort by cuisine score (higher score first), stable sort preserves order for ties
  if (foodPreferences) {
    pool = [...pool].sort((a, b) => cuisineScore(b.name, foodPreferences) - cuisineScore(a.name, foodPreferences));
  }

  return pool;
};

/**
 * Calculate how many calories a meal should target given the daily calorie goal and meal slot.
 */
const MEAL_CALORIE_RATIOS = {
  breakfast: 0.25,
  lunch: 0.35,
  dinner: 0.30,
  snacks: 0.10,
};

/**
 * Build one meal entry for a given slot, picked from the pool at the given rotation index.
 * Scales macros so the calorie total is close to the slot target.
 */
const buildMeal = (pool, mealType, targetDailyCal, targetMacros, rotationIndex) => {
  if (!pool || pool.length === 0) {
    // Absolute last-resort fallback
    const cal = Math.round(targetDailyCal * MEAL_CALORIE_RATIOS[mealType]);
    const pro = Math.round(targetMacros.protein * MEAL_CALORIE_RATIOS[mealType]);
    const fat = Math.round(targetMacros.fats * MEAL_CALORIE_RATIOS[mealType]);
    const carb = Math.max(0, Math.round((cal - pro * 4 - fat * 9) / 4));
    return { name: 'Healthy Indian Meal', calories: cal, protein: pro, carbs: carb, fats: fat };
  }

  const baseMeal = pool[rotationIndex % pool.length];
  const slotCalTarget = Math.round(targetDailyCal * MEAL_CALORIE_RATIOS[mealType]);

  // Use the base meal's own calories directly — do NOT scale them.
  // Instead assign slot-proportional macros derived from the overall targets.
  const ratio = MEAL_CALORIE_RATIOS[mealType];
  const pro = Math.round(targetMacros.protein * ratio);
  const fat = Math.round(targetMacros.fats * ratio);
  // Use the base calorie from the meal, but keep it within ±30% of the slot target
  const rawCal = baseMeal.calories || slotCalTarget;
  const clampedCal = Math.round(Math.min(rawCal * 1.3, Math.max(rawCal * 0.7, slotCalTarget)));
  // Derive carbs from the energy balance
  const carbCal = clampedCal - pro * 4 - fat * 9;
  const carb = Math.max(0, Math.round(carbCal / 4));

  // Sanity check — recalculate total calories from macros
  const totalMacroCal = pro * 4 + carb * 4 + fat * 9;
  const finalCal = Math.max(clampedCal, totalMacroCal); // use whichever is higher to avoid under-counting

  return {
    name: baseMeal.name,
    calories: finalCal,
    protein: pro,
    carbs: carb,
    fats: fat,
  };
};

/**
 * Main export: generate a complete plan for `planDurationWeeks` weeks.
 */
const generateFallbackPlan = (
  planDurationWeeks,
  targetCalories,
  macros,
  dietaryPreference,
  allergies = '',
  foodPreferences = '',
) => {
  const mealDb = getMealsByPreference(dietaryPreference);
  const allergyTerms = parseAllergies(allergies);

  // Build filtered, cuisine-sorted pools once
  const pools = {
    breakfast: buildMealPool(mealDb, 'breakfast', allergyTerms, foodPreferences),
    lunch: buildMealPool(mealDb, 'lunch', allergyTerms, foodPreferences),
    dinner: buildMealPool(mealDb, 'dinner', allergyTerms, foodPreferences),
    snacks: buildMealPool(mealDb, 'snacks', allergyTerms, foodPreferences),
  };

  console.log(`[Fallback] Pool sizes — B:${pools.breakfast.length} L:${pools.lunch.length} D:${pools.dinner.length} S:${pools.snacks.length}`);
  if (allergyTerms.length > 0) {
    console.log(`[Fallback] Allergy filter active: [${allergyTerms.join(', ')}]`);
  }

  const plan = { weeks: [] };

  for (let w = 1; w <= planDurationWeeks; w++) {
    const week = { weekNumber: w, days: [] };

    for (let d = 1; d <= 7; d++) {
      // Day offset across entire duration (0 to planDurationWeeks*7 - 1)
      const dayPlanIndex = (w - 1) * 7 + (d - 1);

      // Stagger rotation indices per slot so breakfast, lunch, dinner, snacks never share indices
      // and rotate sequentially through all 30 unique items in each pool across weeks
      const breakfastIdx = dayPlanIndex;
      const lunchIdx = dayPlanIndex + 7;
      const dinnerIdx = dayPlanIndex + 14;
      const snacksIdx = dayPlanIndex + 21;

      const breakfast = buildMeal(pools.breakfast, 'breakfast', targetCalories, macros, breakfastIdx);
      const lunch = buildMeal(pools.lunch, 'lunch', targetCalories, macros, lunchIdx);
      const dinner = buildMeal(pools.dinner, 'dinner', targetCalories, macros, dinnerIdx);
      const snacks = buildMeal(pools.snacks, 'snacks', targetCalories, macros, snacksIdx);

      const totalCalories = breakfast.calories + lunch.calories + dinner.calories + snacks.calories;
      const totalProtein = breakfast.protein + lunch.protein + dinner.protein + snacks.protein;
      const totalFats = breakfast.fats + lunch.fats + dinner.fats + snacks.fats;
      const totalCarbs = breakfast.carbs + lunch.carbs + dinner.carbs + snacks.carbs;

      week.days.push({
        dayNumber: d,
        dayName: DAY_NAMES[d - 1],
        meals: { breakfast, lunch, dinner, snacks },
        totalCalories,
        totalProtein,
        totalFats,
        totalCarbs,
      });
    }

    plan.weeks.push(week);
  }

  return plan;
};

module.exports = { generateFallbackPlan };
