const { calculateBMR, calculateTDEE, calculateBMI, calculateTargetCalories, calculateMacros } = require('../utils/calculations');
const { generateMealPlan, getAlternativeMeals } = require('../utils/dietGenerator');

// @desc    Get personalized diet plan
// @route   POST /api/diet/plan
// @access  Private
const getDietPlan = async (req, res) => {
  try {
    const { weight, height, age, gender, goal, activityLevel, dietaryPreference } = req.user;

    // Calculate BMR and TDEE
    const bmr = calculateBMR(weight, height, age, gender);
    const tdee = calculateTDEE(bmr, activityLevel);
    const targetCalories = calculateTargetCalories(tdee, goal);
    const macros = calculateMacros(targetCalories, goal);
    const bmi = calculateBMI(weight, height);

    // Generate meal plan
    const mealPlan = generateMealPlan(targetCalories, macros, dietaryPreference);

    res.json({
      metrics: {
        bmr,
        tdee,
        targetCalories,
        bmi
      },
      macros,
      mealPlan,
      tips: getDietTips(goal, dietaryPreference)
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get alternative meals
// @route   GET /api/diet/alternatives/:mealType
// @access  Private
const getAlternatives = async (req, res) => {
  try {
    const { mealType } = req.params;
    const { currentMeal } = req.query;
    const { dietaryPreference } = req.user;

    const alternatives = getAlternativeMeals(mealType, dietaryPreference, currentMeal);
    res.json(alternatives);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Diet tips based on goal
const getDietTips = (goal, dietaryPreference) => {
  const tips = {
    weight_loss: [
      'Stay in a caloric deficit',
      'Drink 8-10 glasses of water daily',
      'Eat protein-rich foods to preserve muscle',
      'Avoid sugary drinks and processed foods'
    ],
    weight_gain: [
      'Eat in a caloric surplus',
      'Focus on nutrient-dense foods',
      'Include healthy fats like nuts and ghee',
      'Eat frequent meals throughout the day'
    ],
    muscle_gain: [
      'Consume 1.6-2.2g protein per kg body weight',
      'Time your meals around workouts',
      'Include complex carbs for energy',
      'Stay consistent with meal timing'
    ],
    maintenance: [
      'Balance your macronutrients',
      'Eat a variety of foods',
      'Stay hydrated',
      'Listen to your body\'s hunger cues'
    ]
  };

  return tips[goal] || tips.maintenance;
};

module.exports = {
  getDietPlan,
  getAlternatives
};
