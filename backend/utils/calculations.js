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

  return tdee + (adjustments[goal] || 0);
};

/**
 * Calculate macronutrient breakdown
 * @param {number} targetCalories - Target daily calories
 * @param {string} goal - User's fitness goal
 * @returns {object} Protein, carbs, and fats in grams
 */
const calculateMacros = (targetCalories, goal) => {
  let proteinPercent, carbsPercent, fatsPercent;

  switch (goal) {
    case 'weight_loss':
      proteinPercent = 0.40;
      carbsPercent = 0.30;
      fatsPercent = 0.30;
      break;
    case 'muscle_gain':
      proteinPercent = 0.30;
      carbsPercent = 0.40;
      fatsPercent = 0.30;
      break;
    case 'weight_gain':
      proteinPercent = 0.25;
      carbsPercent = 0.50;
      fatsPercent = 0.25;
      break;
    default: // maintenance
      proteinPercent = 0.30;
      carbsPercent = 0.40;
      fatsPercent = 0.30;
  }

  return {
    protein: Math.round((targetCalories * proteinPercent) / 4), // 4 cal per gram
    carbs: Math.round((targetCalories * carbsPercent) / 4),     // 4 cal per gram
    fats: Math.round((targetCalories * fatsPercent) / 9)        // 9 cal per gram
  };
};

module.exports = {
  calculateBMR,
  calculateTDEE,
  calculateBMI,
  calculateTargetCalories,
  calculateMacros
};
