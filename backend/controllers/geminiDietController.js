const crypto = require('crypto');
const GeminiDietPlan = require('../models/GeminiDietPlan');
const { calculateBMR, calculateTDEE, calculateBMI, calculateTargetCalories, calculateMacros } = require('../utils/calculations');

// ─── Helper: build a deterministic hash of all settings ───────────────────
const buildSettingsHash = (user, planDurationWeeks) => {
  const data = [
    user.goal,
    user.activityLevel,
    user.dietaryPreference,
    user.weight,
    user.height,
    user.age,
    user.gender,
    planDurationWeeks,
  ].join('|');
  return crypto.createHash('sha256').update(data).digest('hex').slice(0, 16);
};

// ─── Helper: diet tips by goal ────────────────────────────────────────────
const getDietTips = (goal) => {
  const tips = {
    weight_loss: [
      'Stay in a caloric deficit of ~500 cal/day for steady loss',
      'Drink 8-10 glasses of water daily',
      'Eat protein-rich foods to preserve muscle',
      'Avoid sugary drinks and processed foods',
      'Include fiber-rich vegetables in every meal',
    ],
    weight_gain: [
      'Eat in a caloric surplus of ~500 cal/day',
      'Focus on nutrient-dense foods, not junk',
      'Include healthy fats like nuts, ghee, and avocado',
      'Eat frequent meals — 5 to 6 times a day',
      'Add protein shakes between meals if needed',
    ],
    muscle_gain: [
      'Consume 1.6-2.2g protein per kg body weight',
      'Time your meals around workouts',
      'Include complex carbs for sustained energy',
      'Stay consistent with meal timing',
      'Get 7-9 hours of sleep for recovery',
    ],
    maintenance: [
      'Balance your macronutrients across meals',
      'Eat a variety of foods for micronutrient coverage',
      'Stay hydrated throughout the day',
      "Listen to your body's hunger cues",
      'Maintain a regular eating schedule',
    ],
  };
  return tips[goal] || tips.maintenance;
};

// ─── Helper: format dietary preference for prompt ─────────────────────────
const formatDietaryPreference = (pref) => {
  const map = {
    vegetarian: 'Strict Vegetarian (no meat, no fish, no eggs — dairy OK)',
    non_vegetarian: 'Non-Vegetarian (chicken, fish, eggs, mutton allowed)',
    vegan: 'Strict Vegan (no meat, no fish, no eggs, no dairy, no honey)',
    diabetic_friendly: 'Diabetic-Friendly (low glycemic index, no sugar, millets preferred, small portions)',
  };
  return map[pref] || map.vegetarian;
};

const formatGoal = (goal) => {
  const map = {
    weight_loss: 'Weight Loss',
    weight_gain: 'Weight Gain',
    muscle_gain: 'Muscle Gain',
    maintenance: 'Maintenance',
  };
  return map[goal] || 'Maintenance';
};

// ─── Helper: call Gemini REST API ─────────────────────────────────────────
const callGemini = async (prompt) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured in .env');
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 65536,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    console.error('Gemini API error response:', errBody);
    throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
    throw new Error('Gemini returned an empty or invalid response');
  }

  let text = data.candidates[0].content.parts[0].text;

  // Strip markdown code fences if present
  text = text.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();

  return text;
};

// ─── Helper: build the Gemini prompt ──────────────────────────────────────
const buildPrompt = (user, planDurationWeeks, targetCalories, macros) => {
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return `You are an expert Indian nutritionist and meal planner. Generate a detailed, personalized ${planDurationWeeks}-week Indian meal plan.

USER PROFILE:
- Goal: ${formatGoal(user.goal)}
- Weight: ${user.weight} kg
- Height: ${user.height} cm
- Age: ${user.age} years
- Gender: ${user.gender}
- Activity Level: ${user.activityLevel}
- Dietary Preference: ${formatDietaryPreference(user.dietaryPreference)}
- Target Daily Calories: ${targetCalories} kcal
- Daily Macros: Protein ${macros.protein}g, Carbs ${macros.carbs}g, Fats ${macros.fats}g

RULES:
1. Generate EXACTLY ${planDurationWeeks} weeks. Each week has EXACTLY 7 days.
2. Each day has 4 meals: breakfast, lunch, dinner, snacks.
3. STRICTLY follow the dietary preference — ${user.dietaryPreference === 'vegetarian' ? 'NO meat, fish, or eggs' : user.dietaryPreference === 'vegan' ? 'NO meat, fish, eggs, dairy, honey, or ghee' : user.dietaryPreference === 'diabetic_friendly' ? 'use millets (ragi, bajra, jowar), avoid sugar, white rice, maida — prefer low-GI foods' : 'chicken, fish, eggs, mutton are allowed along with vegetarian options'}.
4. Each meal MUST have: name (string), calories (number), protein (number), carbs (number), fats (number).
5. Daily total calories should be close to ${targetCalories} kcal (±100).
6. Use authentic Indian dishes and recipes. Include regional variety (South Indian, North Indian, Bengali, etc.).
7. Make each week varied — avoid repeating the exact same meal on the same day across weeks.
8. For ${user.goal === 'weight_loss' ? 'weight loss, prefer lighter dinner options and high-protein meals' : user.goal === 'muscle_gain' ? 'muscle gain, include high-protein foods in every meal' : user.goal === 'weight_gain' ? 'weight gain, include calorie-dense nutritious foods' : 'maintenance, balance all macronutrients'}.
9. Snacks should be light and healthy (100-200 calories).

RESPONSE FORMAT — Return ONLY valid JSON, no other text:
{
  "weeks": [
    {
      "weekNumber": 1,
      "days": [
        {
          "dayNumber": 1,
          "dayName": "${dayNames[0]}",
          "meals": {
            "breakfast": { "name": "Meal name with description", "calories": 350, "protein": 12, "carbs": 45, "fats": 8 },
            "lunch": { "name": "Meal name with description", "calories": 550, "protein": 22, "carbs": 65, "fats": 12 },
            "dinner": { "name": "Meal name with description", "calories": 420, "protein": 18, "carbs": 50, "fats": 10 },
            "snacks": { "name": "Healthy snack", "calories": 150, "protein": 5, "carbs": 20, "fats": 4 }
          },
          "totalCalories": 1470
        }
      ]
    }
  ]
}

Generate the complete ${planDurationWeeks}-week plan now. Every week must have all 7 days (${dayNames.join(', ')}).`;
};

// ─── Helper: validate & fix Gemini response ───────────────────────────────
const validateAndFixPlan = (parsed, planDurationWeeks) => {
  if (!parsed || !parsed.weeks || !Array.isArray(parsed.weeks)) {
    throw new Error('Invalid plan structure: missing weeks array');
  }

  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snacks'];

  // Ensure correct number of weeks
  const weeks = parsed.weeks.slice(0, planDurationWeeks);

  // If Gemini returned fewer weeks than requested, duplicate the last week
  while (weeks.length < planDurationWeeks) {
    const lastWeek = weeks[weeks.length - 1];
    weeks.push({
      ...JSON.parse(JSON.stringify(lastWeek)),
      weekNumber: weeks.length + 1,
    });
  }

  // Validate each week/day/meal
  weeks.forEach((week, wi) => {
    week.weekNumber = wi + 1;

    if (!week.days || !Array.isArray(week.days)) {
      week.days = [];
    }

    // Ensure 7 days per week
    while (week.days.length < 7) {
      const dayIdx = week.days.length;
      week.days.push({
        dayNumber: dayIdx + 1,
        dayName: dayNames[dayIdx],
        meals: {
          breakfast: { name: 'Poha with Peanuts', calories: 300, protein: 8, carbs: 45, fats: 5 },
          lunch: { name: 'Dal Rice with Sabzi', calories: 500, protein: 16, carbs: 65, fats: 8 },
          dinner: { name: 'Roti with Mixed Veg Curry', calories: 400, protein: 12, carbs: 55, fats: 8 },
          snacks: { name: 'Mixed Nuts & Fruits', calories: 150, protein: 5, carbs: 18, fats: 8 },
        },
        totalCalories: 1350,
      });
    }

    week.days = week.days.slice(0, 7);

    week.days.forEach((day, di) => {
      day.dayNumber = di + 1;
      day.dayName = dayNames[di] || `Day ${di + 1}`;

      if (!day.meals) day.meals = {};

      // Ensure each meal type exists with valid numbers
      mealTypes.forEach(mt => {
        if (!day.meals[mt]) {
          day.meals[mt] = { name: 'Healthy Indian Meal', calories: 300, protein: 10, carbs: 40, fats: 8 };
        }
        const meal = day.meals[mt];
        meal.calories = Number(meal.calories) || 300;
        meal.protein = Number(meal.protein) || 10;
        meal.carbs = Number(meal.carbs) || 40;
        meal.fats = Number(meal.fats) || 8;
      });

      // Recalculate total
      day.totalCalories = mealTypes.reduce((sum, mt) => sum + (day.meals[mt]?.calories || 0), 0);
    });
  });

  return { weeks };
};

// ═══════════════════════════════════════════════════════════════════════════
// CONTROLLER: Generate Diet Plan via Gemini
// POST /api/diet/generate
// ═══════════════════════════════════════════════════════════════════════════
const generateDietPlan = async (req, res) => {
  try {
    const user = req.user;
    const { planDurationWeeks = 4 } = req.body;

    // Clamp duration to 1-12 weeks
    const weeks = Math.max(1, Math.min(12, parseInt(planDurationWeeks, 10) || 4));

    // Compute metrics
    const bmr = calculateBMR(user.weight, user.height, user.age, user.gender);
    const tdee = calculateTDEE(bmr, user.activityLevel);
    const targetCalories = calculateTargetCalories(tdee, user.goal);
    const macros = calculateMacros(targetCalories, user.goal);
    const bmi = calculateBMI(user.weight, user.height);

    // Build settings hash
    const settingsHash = buildSettingsHash(user, weeks);

    // Check cache first
    const cached = await GeminiDietPlan.findOne({ userId: user._id });
    if (cached && cached.settingsHash === settingsHash) {
      console.log('Returning cached Gemini diet plan');
      return res.json({
        source: 'cache',
        planDurationWeeks: cached.planDurationWeeks,
        plan: cached.plan,
        metrics: cached.metrics,
        macros: cached.macros,
        tips: cached.tips,
        generatedAt: cached.generatedAt,
      });
    }

    console.log(`Generating new Gemini diet plan: ${weeks} weeks, ${user.dietaryPreference}, ${user.goal}`);

    // Build prompt and call Gemini
    const prompt = buildPrompt(user, weeks, targetCalories, macros);
    const rawText = await callGemini(prompt);

    // Parse JSON response
    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (parseErr) {
      // Try to extract JSON from the response
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        console.error('Failed to parse Gemini response:', rawText.substring(0, 500));
        throw new Error('Gemini returned invalid JSON. Please try again.');
      }
    }

    // Validate and fix the plan structure
    const validatedPlan = validateAndFixPlan(parsed, weeks);

    const metrics = { bmr, tdee, targetCalories, bmi };
    const tips = getDietTips(user.goal);

    // Upsert into MongoDB (one plan per user)
    await GeminiDietPlan.findOneAndUpdate(
      { userId: user._id },
      {
        userId: user._id,
        settingsHash,
        planDurationWeeks: weeks,
        plan: validatedPlan,
        metrics,
        macros,
        tips,
        generatedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    res.json({
      source: 'generated',
      planDurationWeeks: weeks,
      plan: validatedPlan,
      metrics,
      macros,
      tips,
      generatedAt: new Date(),
    });

  } catch (error) {
    console.error('Diet plan generation error:', error);
    res.status(500).json({
      message: 'Failed to generate diet plan',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Please try again later',
    });
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// CONTROLLER: Get Cached Plan (quick check)
// GET /api/diet/cached
// ═══════════════════════════════════════════════════════════════════════════
const getCachedPlan = async (req, res) => {
  try {
    const user = req.user;
    const planDurationWeeks = parseInt(req.query.weeks, 10) || 4;
    const weeks = Math.max(1, Math.min(12, planDurationWeeks));

    const settingsHash = buildSettingsHash(user, weeks);
    const cached = await GeminiDietPlan.findOne({ userId: user._id });

    if (cached && cached.settingsHash === settingsHash) {
      return res.json({
        hasCachedPlan: true,
        planDurationWeeks: cached.planDurationWeeks,
        plan: cached.plan,
        metrics: cached.metrics,
        macros: cached.macros,
        tips: cached.tips,
        generatedAt: cached.generatedAt,
      });
    }

    // Also compute fresh metrics so the frontend can show them while generating
    const bmr = calculateBMR(user.weight, user.height, user.age, user.gender);
    const tdee = calculateTDEE(bmr, user.activityLevel);
    const targetCalories = calculateTargetCalories(tdee, user.goal);
    const macros = calculateMacros(targetCalories, user.goal);
    const bmi = calculateBMI(user.weight, user.height);

    res.json({
      hasCachedPlan: false,
      metrics: { bmr, tdee, targetCalories, bmi },
      macros,
    });

  } catch (error) {
    console.error('Cached plan check error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  generateDietPlan,
  getCachedPlan,
};
