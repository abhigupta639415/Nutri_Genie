/**
 * Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
 * @param {number} weight - Weight in kg
 * @param {number} height - Height in cm
 * @param {number} age - Age in years
 * @param {string} gender - 'male' or 'female'
 * @returns {number} BMR value
 */
const calculateBMR = (weight, height, age, gender) => {
  let bmr;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }
  return Math.round(bmr);
};

/**
 * Calculate TDEE (Total Daily Energy Expenditure)
 * @param {number} bmr - Basal Metabolic Rate
 * @param {string} activityLevel - Activity level
 * @returns {number} TDEE value
 */
const calculateTDEE = (bmr, activityLevel) => {
  const activityMultipliers = {
    sedentary: 1.2,        // Little or no exercise
    light: 1.375,          // Exercise 1-3 times/week
    moderate: 1.55,        // Exercise 4-5 times/week
    active: 1.725,         // Daily exercise or intense exercise 3-4 times/week
    very_active: 1.9       // Intense exercise 6-7 times/week
  };

  const multiplier = activityMultipliers[activityLevel] || 1.2;
  return Math.round(bmr * multiplier);
};

/**
 * Calculate BMI (Body Mass Index)
 * @param {number} weight - Weight in kg
 * @param {number} height - Height in cm
 * @returns {object} BMI value and category
 */
const calculateBMI = (weight, height) => {
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  
  let category;
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi < 25) category = 'Normal weight';
  else if (bmi < 30) category = 'Overweight';
  else category = 'Obese';

  return {
    value: Math.round(bmi * 10) / 10,
    category
  };
};

/**
 * Calculate target calories based on goal
 * @param {number} tdee - Total Daily Energy Expenditure
 * @param {string} goal - User's fitness goal
 * @returns {number} Target calories
 */
const calculateTargetCalories = (tdee, goal) => {
  const adjustments = {
    weight_loss: -500,      // 500 calorie deficit
    weight_gain: 500,       // 500 calorie surplus
    muscle_gain: 300,       // 300 calorie surplus
    maintenance: 0
  };

  const target = tdee + (adjustments[goal] || 0);
  // Ensure safe minimum daily calories
  return Math.max(1200, Math.round(target));
};

/**
 * Calculate macronutrient breakdown based on body weight and target calories
 * - Protein: 1.2 - 1.8 g / kg body weight based on fitness goal
 * - Fat: 25% of total calories (essential hormonal & cellular function)
 * - Carbs: remaining calories / 4 cal per gram
 * Validates that Protein*4 + Carbs*4 + Fat*9 ≈ Target Calories
 * 
 * @param {number} targetCalories - Target daily calories
 * @param {string} goal - User's fitness goal
 * @param {number} [weight=70] - User's body weight in kg
 * @returns {object} Protein, carbs, and fats in grams
 */
const calculateMacros = (targetCalories, goal, weight = 70) => {
  const numericWeight = Number(weight) > 0 ? Number(weight) : 70;

  // Protein target (grams per kg body weight)
  // - weight_loss: 1.6 g/kg (spares lean muscle tissue during caloric deficit)
  // - muscle_gain: 1.6 g/kg (recommended hypertrophy baseline: 1.6-1.8 g/kg)
  // - weight_gain: 1.5 g/kg
  // - maintenance: 1.4 g/kg
  let proteinPerKg;
  switch (goal) {
    case 'weight_loss':
      proteinPerKg = 1.6;
      break;
    case 'muscle_gain':
      proteinPerKg = 1.6;
      break;
    case 'weight_gain':
      proteinPerKg = 1.5;
      break;
    case 'maintenance':
    default:
      proteinPerKg = 1.4;
      break;
  }

  // 1. Protein grams and calories
  let protein = Math.round(numericWeight * proteinPerKg);
  // Cap protein if it exceeds 35% of total calories on lower calorie targets
  const maxProteinGrams = Math.round((targetCalories * 0.35) / 4);
  if (protein > maxProteinGrams && targetCalories < 1800) {
    protein = maxProteinGrams;
  }
  const proteinCalories = protein * 4;

  // 2. Fat grams and calories: 25% of target calories
  const fatCalories = targetCalories * 0.25;
  const fats = Math.round(fatCalories / 9);
  const actualFatCalories = fats * 9;

  // 3. Carbohydrate grams: derived from remaining calories
  const remainingCalories = Math.max(0, targetCalories - proteinCalories - actualFatCalories);
  let carbs = Math.round(remainingCalories / 4);

  // 4. Macro Calibration: ensure P*4 + C*4 + F*9 closely matches targetCalories
  const totalMacroCalories = (protein * 4) + (carbs * 4) + (fats * 9);
  const calDiff = targetCalories - totalMacroCalories;
  if (Math.abs(calDiff) >= 4) {
    carbs += Math.round(calDiff / 4);
  }

  return {
    protein: Math.max(10, protein),
    carbs: Math.max(20, carbs),
    fats: Math.max(10, fats),
  };
};

module.exports = {
  calculateBMR,
  calculateTDEE,
  calculateBMI,
  calculateTargetCalories,
  calculateMacros
};
