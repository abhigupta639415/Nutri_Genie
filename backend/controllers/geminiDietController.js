const crypto = require('crypto');
const GeminiDietPlan = require('../models/GeminiDietPlan');
const User = require('../models/User');
const { calculateBMR, calculateTDEE, calculateBMI, calculateTargetCalories, calculateMacros } = require('../utils/calculations');
const { generateFallbackPlan } = require('../utils/fallbackGenerator');

// ─── Helper: build a deterministic hash of all settings ───────────────────
const buildSettingsHash = (user, planDurationWeeks, additional = {}) => {
  const data = [
    user.goal,
    user.activityLevel,
    user.dietaryPreference,
    user.weight,
    user.height,
    user.age,
    user.gender,
    planDurationWeeks,
    additional.planDurationDays || user.planDurationDays || (planDurationWeeks * 7),
    additional.durationUnit || user.durationUnit || 'weeks',
    additional.foodPreferences !== undefined ? additional.foodPreferences : (user.foodPreferences || ''),
    additional.allergies !== undefined ? additional.allergies : (user.allergies || ''),
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
    non_vegetarian: 'Non-Vegetarian (chicken, fish, eggs, mutton allowed alongside vegetarian dishes)',
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

// ─── Helper: call Gemini REST API with robust model fallback ──────────────
const callGemini = async (prompt) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured in .env file');
  }

  // Active models supported by Google's API for this key, prioritized by speed and stability
  const modelsToTry = [
    'gemini-3.5-flash-lite',
    'gemini-3.1-flash-lite',
    'gemini-3.6-flash',
    'gemini-3.5-flash',
  ];

  let lastError = null;

  for (const model of modelsToTry) {
    const modelStart = Date.now();
    try {
      console.log(`[Diet] Sending request to Gemini (model: ${model})...`);
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(35000), // 35-second guard per model attempt
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            responseMimeType: 'application/json',
          },
        }),
      });

      if (!response.ok) {
        const errBody = await response.text();
        console.error(`[Diet] Model ${model} returned error status ${response.status} ${response.statusText}:`, errBody.substring(0, 300));
        lastError = new Error(`Gemini API error (${model}: ${response.status} ${response.statusText})`);
        continue;
      }

      const data = await response.json();
      const parts = data.candidates?.[0]?.content?.parts || [];
      if (parts.length === 0) {
        lastError = new Error(`Gemini model ${model} returned empty content parts`);
        continue;
      }

      let text = '';
      for (const part of parts) {
        if (part.text) text += part.text;
      }

      text = text.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();
      console.log(`[Diet] Gemini response received in ${Date.now() - modelStart}ms (${text.length} chars) from model ${model}`);
      return text;
    } catch (err) {
      console.error(`[Diet] Exception when querying model ${model} (${Date.now() - modelStart}ms):`, err.message);
      lastError = err;
    }
  }

  throw lastError || new Error('Failed to generate diet plan using Gemini API. Please try again.');
};

// ─── Helper: build the Gemini prompt ──────────────────────────────────────
const buildPrompt = (user, planDurationWeeks, targetCalories, macros, additional = {}) => {
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const foodPrefs = additional.foodPreferences || user.foodPreferences || '';
  const allergies = additional.allergies || user.allergies || '';
  const totalDays = additional.planDurationDays || (planDurationWeeks * 7);

  return `You are an expert Indian nutritionist and meal planner. Generate a detailed, personalized ${planDurationWeeks}-week Indian meal plan.

USER PROFILE & CUSTOMIZATION:
- Goal: ${formatGoal(user.goal)}
- Weight: ${user.weight} kg
- Height: ${user.height} cm
- Age: ${user.age} years
- Gender: ${user.gender || 'Not specified'}
- Activity Level: ${user.activityLevel}
- Dietary Preference: ${formatDietaryPreference(user.dietaryPreference)}
${foodPrefs ? `- Specific Food Preferences: ${foodPrefs}` : ''}
${allergies ? `- Allergies / Dietary Restrictions: ${allergies}` : ''}
- Target Daily Calories: ${targetCalories} kcal
- Target Daily Macros: Protein ${macros.protein}g (~${macros.protein * 4} kcal), Carbs ${macros.carbs}g (~${macros.carbs * 4} kcal), Fats ${macros.fats}g (~${macros.fats * 9} kcal)
- Requested Plan Duration: ${planDurationWeeks} weeks (${totalDays} days)

STRICT REQUIREMENTS:
1. Generate EXACTLY ${planDurationWeeks} weeks in the "weeks" array (Week 1 through Week ${planDurationWeeks}).
2. Each week MUST contain EXACTLY 7 days (${dayNames.join(', ')}).
3. Each day MUST contain EXACTLY 4 meals: breakfast, lunch, dinner, snacks.
4. STRICTLY respect the dietary preference (${user.dietaryPreference}):
   ${user.dietaryPreference === 'vegetarian' ? '- STRICT VEGETARIAN: NO meat, poultry, fish, seafood, or eggs. Dairy is permitted.' : ''}
   ${user.dietaryPreference === 'non_vegetarian' ? '- NON-VEGETARIAN: Include chicken, fish, eggs, mutton along with vegetarian dishes.' : ''}
   ${user.dietaryPreference === 'vegan' ? '- STRICT VEGAN: NO meat, poultry, fish, eggs, dairy, ghee, or honey.' : ''}
   ${user.dietaryPreference === 'diabetic_friendly' ? '- DIABETIC-FRIENDLY: Low glycemic index, millets (ragi, bajra, jowar), zero added sugars, high fiber.' : ''}
5. ALLERGEN RESTRICTION:
   ${allergies ? `CRITICAL: The user has specified the following allergies/restrictions: "${allergies}". NEVER include "${allergies}" or any dishes/ingredients derived from them in any meal!` : '- No specific allergies specified.'}
6. CUISINE / REGIONAL PREFERENCE:
   ${foodPrefs ? `CUISINE FOCUS: Heavily tailor dishes to user preference: "${foodPrefs}". Use authentic dishes and staples consistent with "${foodPrefs}".` : '- General nutritious Indian cuisine.'}
7. Each meal MUST have:
   - "name": String (concise authentic descriptive Indian dish name, e.g. "Besan Chilla with Mint Chutney", "Rajma Masala with Steamed Basmati Rice", "Palak Paneer with 2 Rotis", "Dal Makhani with Jeera Rice")
   - "calories": Number
   - "protein": Number (grams)
   - "carbs": Number (grams)
   - "fats": Number (grams)
8. Daily total calories should approximately match ${targetCalories} kcal (±100).
9. MANDATORY MULTI-WEEK DIVERSITY:
   - Week 1, Week 2, Week 3, and Week 4 MUST have completely different meals.
   - Do NOT repeat the same dishes on the same days across weeks.
   - Ensure rich variety across regional cuisines, grains (poha, oats, ragi, brown rice, whole wheat), and vegetables/lentils each week.
10. MANDATORY DESCRIPTIVE DISH NAMES:
   - Use specific, recognizable authentic Indian dish names (e.g. "Moong Dal Cheela with Green Chutney", "Aloo Paratha with Curd & Pickle", "Chole Bhature with Pickled Onions", "Methi Thepla with Mint Chutney", "Sprouted Moong Salad", "Roasted Chana with Lemon", "Roasted Makhana with Chaat Masala", "Baked Sweet Potato Chaat", "Vegetable Biryani with Raita", "Fish Curry with Steamed Rice", "Butter Chicken with Naan", "Idli Sambar with Coconut Chutney", "Masala Dosa with Tomato Chutney", "Upma with Vegetables").
   - NEVER use generic or vague names like "Curry", "Lentil Soup", "Mixed Vegetables", "Healthy Indian Meal", or "Fruit Snack".
11. Align nutritional composition with the user's fitness goal: ${formatGoal(user.goal)}.
12. Snacks should be light, nutritious and healthy (100-200 calories).

RESPONSE FORMAT — Return ONLY a valid JSON object matching this schema, no other text or explanation:
{
  "weeks": [
    {
      "weekNumber": 1,
      "days": [
        {
          "dayNumber": 1,
          "dayName": "${dayNames[0]}",
          "meals": {
            "breakfast": { "name": "Meal name with brief description", "calories": 350, "protein": 12, "carbs": 45, "fats": 8 },
            "lunch": { "name": "Meal name with brief description", "calories": 550, "protein": 22, "carbs": 65, "fats": 12 },
            "dinner": { "name": "Meal name with brief description", "calories": 420, "protein": 18, "carbs": 50, "fats": 10 },
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
const validateAndFixPlan = (
  parsed,
  planDurationWeeks,
  targetCalories = 2000,
  macros = { protein: 120, carbs: 230, fats: 65 },
  dietaryPreference = 'vegetarian',
  allergies = '',
  foodPreferences = ''
) => {
  if (!parsed || !parsed.weeks || !Array.isArray(parsed.weeks)) {
    throw new Error('Invalid plan structure: missing weeks array');
  }

  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snacks'];

  // Slice to requested weeks
  const weeks = parsed.weeks.slice(0, planDurationWeeks);

  // If Gemini returned fewer weeks than requested, generate distinct supplemental weeks instead of cloning Week 1
  if (weeks.length < planDurationWeeks) {
    console.log(`[Diet] Gemini returned ${weeks.length} weeks out of ${planDurationWeeks} requested. Generating distinct supplemental weeks...`);
    try {
      // Collect already used meal names to prevent any cross-week duplication
      const usedMealNames = new Set();
      weeks.forEach(w => {
        (w.days || []).forEach(d => {
          if (d.meals) {
            Object.values(d.meals).forEach(m => {
              if (m && m.name) usedMealNames.add(m.name.toLowerCase().trim());
            });
          }
        });
      });

      const fallback = generateFallbackPlan(planDurationWeeks + 1, targetCalories, macros, dietaryPreference, allergies, foodPreferences);
      const poolDb = require('../utils/mealDatabase').getMealsByPreference(dietaryPreference);

      while (weeks.length < planDurationWeeks) {
        const nextWeekIdx = weeks.length;
        const fallbackWeek = fallback.weeks[nextWeekIdx] || fallback.weeks[nextWeekIdx % fallback.weeks.length];
        const newWeek = JSON.parse(JSON.stringify(fallbackWeek));
        newWeek.weekNumber = nextWeekIdx + 1;

        // Check each day's meals against usedMealNames and swap any duplicate
        (newWeek.days || []).forEach(d => {
          mealTypes.forEach(mt => {
            const m = d.meals?.[mt];
            if (m && usedMealNames.has(m.name.toLowerCase().trim())) {
              const slotPool = poolDb[mt] || [];
              const alternate = slotPool.find(item => !usedMealNames.has(item.name.toLowerCase().trim()));
              if (alternate) {
                m.name = alternate.name;
              }
            }
            if (m && m.name) {
              usedMealNames.add(m.name.toLowerCase().trim());
            }
          });
        });

        weeks.push(newWeek);
      }
    } catch (fbErr) {
      console.warn(`[Diet] Supplemental week generation failed: ${fbErr.message} — falling back to varied cloning`);
      while (weeks.length < planDurationWeeks) {
        const sourceIndex = (weeks.length) % (parsed.weeks.length || 1);
        const sourceWeek = parsed.weeks[sourceIndex] || weeks[weeks.length - 1];
        weeks.push({
          ...JSON.parse(JSON.stringify(sourceWeek)),
          weekNumber: weeks.length + 1,
        });
      }
    }
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
          breakfast: { name: 'Upma with Vegetables & Curry Leaves', calories: 300, protein: 8, carbs: 45, fats: 5 },
          lunch: { name: 'Dal Tadka with Jeera Rice & Salad', calories: 500, protein: 16, carbs: 65, fats: 8 },
          dinner: { name: 'Roti with Mixed Veg Curry', calories: 400, protein: 12, carbs: 55, fats: 8 },
          snacks: { name: 'Roasted Chana & Fruits', calories: 150, protein: 5, carbs: 18, fats: 8 },
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
        meal.calories = Math.round(Number(meal.calories) || 300);
        meal.protein = Math.round(Number(meal.protein) || 10);
        meal.carbs = Math.round(Number(meal.carbs) || 40);
        meal.fats = Math.round(Number(meal.fats) || 8);
      });

      // Recalculate total
      day.totalCalories = mealTypes.reduce((sum, mt) => sum + (day.meals[mt]?.calories || 0), 0);
    });
  });

  return { weeks };
};

// ═══════════════════════════════════════════════════════════════════════════
// CONTROLLER: Generate Diet Plan via Gemini (with automatic fallback)
// POST /api/diet/generate
//
// Priority order:
//  1. New Gemini plan (if Gemini succeeds)
//  2. Existing saved plan (if Gemini fails and a valid plan is already saved)
//  3. Dynamically generated fallback from mealDatabase.js
//  4. Error response (only if BOTH Gemini AND fallback genuinely fail)
// ═══════════════════════════════════════════════════════════════════════════
const generateDietPlan = async (req, res) => {
  const user = req.user;
  let weeks, days, durationUnit;

  try {
    const {
      planDurationWeeks: reqWeeks,
      planDurationDays: reqDays,
      durationUnit: reqUnit,
      foodPreferences,
      allergies,
      forceRegenerate = false,
    } = req.body;

    // ── 1. Resolve duration ─────────────────────────────────────────────────
    durationUnit = reqUnit || (reqDays && !reqWeeks ? 'days' : 'weeks');

    if (reqWeeks) {
      weeks = Math.max(1, Math.min(12, parseInt(reqWeeks, 10) || 4));
      days = reqDays ? Math.max(1, Math.min(90, parseInt(reqDays, 10))) : weeks * 7;
    } else if (reqDays) {
      days = Math.max(1, Math.min(90, parseInt(reqDays, 10) || 28));
      weeks = Math.max(1, Math.min(12, Math.ceil(days / 7)));
    } else if (user.planDurationWeeks) {
      weeks = Math.max(1, Math.min(12, user.planDurationWeeks));
      days = user.planDurationDays || (weeks * 7);
      durationUnit = user.durationUnit || 'weeks';
    } else {
      weeks = 4;
      days = 28;
      durationUnit = 'weeks';
    }

    // ── 2. Persist user preference updates ────────────────────────────────
    const updates = {};
    if (reqWeeks && user.planDurationWeeks !== weeks) updates.planDurationWeeks = weeks;
    if (reqDays && user.planDurationDays !== days) updates.planDurationDays = days;
    if (reqUnit && user.durationUnit !== durationUnit) updates.durationUnit = durationUnit;
    if (foodPreferences !== undefined && user.foodPreferences !== foodPreferences) updates.foodPreferences = foodPreferences;
    if (allergies !== undefined && user.allergies !== allergies) updates.allergies = allergies;
    if (Object.keys(updates).length > 0) {
      Object.assign(user, updates);
      await User.findByIdAndUpdate(user._id, updates);
    }

    console.log(`[Diet] Generation started for user: ${user._id}`);

    // ── 3. Calculate nutritional metrics ─────────────────────────────────
    const bmr = calculateBMR(user.weight, user.height, user.age, user.gender);
    const tdee = calculateTDEE(bmr, user.activityLevel);
    const targetCalories = calculateTargetCalories(tdee, user.goal);
    const macros = calculateMacros(targetCalories, user.goal, user.weight);
    const bmi = calculateBMI(user.weight, user.height);

    const effectiveFoodPreferences = foodPreferences !== undefined ? foodPreferences : (user.foodPreferences || '');
    const effectiveAllergies = allergies !== undefined ? allergies : (user.allergies || '');

    const additionalData = {
      planDurationDays: days,
      durationUnit,
      foodPreferences: effectiveFoodPreferences,
      allergies: effectiveAllergies,
    };

    console.log(`[Diet] Calculated targets: BMR=${bmr}, TDEE=${tdee}, Target=${targetCalories} kcal, Protein=${macros.protein}g, Carbs=${macros.carbs}g, Fats=${macros.fats}g`);
    console.log(`[Diet] Duration=${weeks}w (${days}d), FoodPrefs="${effectiveFoodPreferences}", Allergies="${effectiveAllergies}"`);

    // ── 4. Check cache (skip on forceRegenerate) ──────────────────────────
    const settingsHash = buildSettingsHash(user, weeks, additionalData);

    if (!forceRegenerate) {
      const cached = await GeminiDietPlan.findOne({ userId: user._id });
      if (cached && cached.settingsHash === settingsHash && cached.plan && cached.plan.weeks && cached.plan.weeks.length > 0) {
        console.log(`[Diet] Returning cached plan (${weeks}w) for user ${user._id}`);
        return res.json({
          source: 'cache',
          planId: cached._id,
          generationSource: cached.generationSource || 'gemini',
          startDate: cached.startDate || user.planStartDate || new Date(),
          planStartDate: cached.startDate || user.planStartDate || new Date(),
          completedMeals: cached.completedMeals || [],
          planDurationWeeks: cached.planDurationWeeks,
          planDurationDays: cached.planDurationDays || (cached.planDurationWeeks * 7),
          durationUnit: cached.durationUnit || 'weeks',
          plan: cached.plan,
          metrics: cached.metrics,
          macros: cached.macros,
          tips: cached.tips,
          generatedAt: cached.generatedAt,
        });
      }
    }

    const metrics = { bmr, tdee, targetCalories, bmi };
    const tips = getDietTips(user.goal);

    // ── 5. Try Gemini ─────────────────────────────────────────────────────
    let validatedPlan = null;
    let generationSource = 'gemini';

    try {
      const prompt = buildPrompt(user, weeks, targetCalories, macros, additionalData);
      const rawText = await callGemini(prompt);

      console.log(`[Diet] Parsing Gemini response`);
      let parsed;
      try {
        parsed = JSON.parse(rawText);
      } catch (_parseErr) {
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Gemini returned un-parseable response (not valid JSON)');
        }
      }

      console.log(`[Diet] Validating Gemini response`);
      validatedPlan = validateAndFixPlan(
        parsed,
        weeks,
        targetCalories,
        macros,
        user.dietaryPreference,
        effectiveAllergies,
        effectiveFoodPreferences
      );
      console.log(`[Diet] Gemini plan valid — ${validatedPlan.weeks.length} weeks`);

    } catch (geminiErr) {
      console.warn(`[Diet] Gemini failed: ${geminiErr.message} — checking for existing saved plan first`);

      // ── 6a. Gemini failed — try existing saved plan ────────────────────
      if (!forceRegenerate) {
        const existing = await GeminiDietPlan.findOne({
          $or: [
            { userId: user._id },
            { userId: user._id.toString() }
          ]
        });
        if (existing && existing.plan && existing.plan.weeks && existing.plan.weeks.length > 0) {
          console.log(`[Diet] Returning existing saved plan for user ${user._id} (Gemini failed, saved plan available)`);
          const planObj = existing.plan && existing.plan.toObject ? existing.plan.toObject() : (existing.plan || {});
          planObj.id = existing._id.toString();
          planObj._id = existing._id.toString();
          planObj.userId = existing.userId.toString();

          return res.json({
            source: 'saved',
            planId: existing._id.toString(),
            id: existing._id.toString(),
            _id: existing._id.toString(),
            userId: existing.userId.toString(),
            generationSource: existing.generationSource || 'gemini',
            startDate: existing.startDate || user.planStartDate || new Date(),
            planStartDate: existing.startDate || user.planStartDate || new Date(),
            completedMeals: existing.completedMeals || [],
            planDurationWeeks: existing.planDurationWeeks,
            planDurationDays: existing.planDurationDays || (existing.planDurationWeeks * 7),
            durationUnit: existing.durationUnit || 'weeks',
            plan: planObj,
            metrics: existing.metrics || metrics,
            macros: existing.macros || macros,
            tips: existing.tips || tips,
            generatedAt: existing.generatedAt,
          });
        }
      }

      // ── 6b. No saved plan — use mealDatabase.js fallback ──────────────
      console.log(`[Diet] Generating fallback plan via mealDatabase.js`);
      generationSource = 'fallback';
      try {
        validatedPlan = generateFallbackPlan(
          weeks,
          targetCalories,
          macros,
          user.dietaryPreference,
          effectiveAllergies,
          effectiveFoodPreferences,
        );
        console.log(`[Diet] Fallback plan generated — ${validatedPlan.weeks.length} weeks`);
      } catch (fallbackErr) {
        console.error(`[Diet] Fallback generator also failed: ${fallbackErr.message}`);
        // Only now do we propagate an error to the client
        return res.status(500).json({
          message: 'Unable to generate your diet plan. Both Gemini and the local fallback generator failed.',
          error: fallbackErr.message,
        });
      }
    }

    // ── 7. Preserve startDate for non-force-regenerate ────────────────────
    let startDate = new Date();
    if (!forceRegenerate) {
      const existingForDate = await GeminiDietPlan.findOne({
        $or: [
          { userId: user._id },
          { userId: user._id.toString() }
        ]
      }, 'startDate');
      if (existingForDate && existingForDate.startDate) {
        startDate = existingForDate.startDate;
      } else if (user.planStartDate) {
        startDate = user.planStartDate;
      }
    }

    if (forceRegenerate || !user.planStartDate) {
      await User.findByIdAndUpdate(user._id, { planStartDate: startDate });
    }

    // ── 8. Save to DB (upsert) — use $set for ALL fields to avoid conflicts ─
    console.log(`[Diet] Saving generated plan (source: ${generationSource})`);
    const savedPlan = await GeminiDietPlan.findOneAndUpdate(
      { userId: user._id },
      {
        $set: {
          userId: user._id,
          settingsHash,
          generationSource,
          startDate,
          completedMeals: [],
          planDurationWeeks: weeks,
          planDurationDays: days,
          durationUnit,
          plan: validatedPlan,
          metrics,
          macros,
          tips,
          generatedAt: new Date(),
        },
      },
      { upsert: true, new: true }
    );

    console.log(`[Diet] Plan saved (source=${generationSource}, ${weeks}w, ${days}d) for user ${user._id}`);

    const planObj = savedPlan.plan && savedPlan.plan.toObject ? savedPlan.plan.toObject() : (savedPlan.plan || validatedPlan);
    planObj.id = savedPlan._id.toString();
    planObj._id = savedPlan._id.toString();
    planObj.userId = savedPlan.userId.toString();

    return res.json({
      source: "generated",
      planId: savedPlan._id.toString(),
      id: savedPlan._id.toString(),
      _id: savedPlan._id.toString(),
      userId: savedPlan.userId.toString(),
      generationSource,
      startDate,
      planStartDate: startDate,
      completedMeals: [],
      planDurationWeeks: weeks,
      planDurationDays: days,
      durationUnit,
      plan: planObj,
      metrics,
      macros,
      tips,
      generatedAt: new Date(),
    });

  } catch (error) {
    // Outer catch — unexpected errors (DB errors, auth errors, etc.)
    console.error('[Diet] Unexpected error in generateDietPlan:', error.message);

    // Last-ditch: try to return fallback even here
    if (weeks && days) {
      try {
        console.log(`[Diet] Outer catch — attempting emergency fallback`);
        const bmr2 = calculateBMR(user.weight, user.height, user.age, user.gender);
        const tdee2 = calculateTDEE(bmr2, user.activityLevel);
        const targetCalories2 = calculateTargetCalories(tdee2, user.goal);
        const macros2 = calculateMacros(targetCalories2, user.goal, user.weight);
        const emergencyPlan = generateFallbackPlan(
          weeks, targetCalories2, macros2,
          user.dietaryPreference || 'vegetarian',
          user.allergies || '',
          user.foodPreferences || '',
        );

        let savedFallback = null;
        try {
          savedFallback = await GeminiDietPlan.findOneAndUpdate(
            { userId: user._id },
            {
              $set: {
                userId: user._id,
                settingsHash: buildSettingsHash(user, weeks, { planDurationDays: days, durationUnit }),
                generationSource: 'fallback',
                startDate: new Date(),
                completedMeals: [],
                planDurationWeeks: weeks,
                planDurationDays: days,
                durationUnit: durationUnit || 'weeks',
                plan: emergencyPlan,
                metrics: { bmr: bmr2, tdee: tdee2, targetCalories: targetCalories2 },
                macros: macros2,
                tips: getDietTips(user.goal),
                generatedAt: new Date(),
              }
            },
            { upsert: true, new: true }
          );
        } catch (dbErr) {
          console.warn('[Diet] Emergency fallback DB save failed:', dbErr.message);
        }

        const fallbackPlanObj = emergencyPlan;
        const fallbackId = savedFallback?._id ? savedFallback._id.toString() : null;
        if (fallbackId) {
          fallbackPlanObj.id = fallbackId;
          fallbackPlanObj._id = fallbackId;
          fallbackPlanObj.userId = user._id.toString();
        }

        return res.json({
          source: "generated",
          planId: fallbackId,
          id: fallbackId,
          _id: fallbackId,
          userId: user._id.toString(),
          generationSource: 'fallback',
          startDate: new Date(),
          completedMeals: [],
          planDurationWeeks: weeks,
          planDurationDays: days,
          durationUnit: durationUnit || 'weeks',
          plan: fallbackPlanObj,
          metrics: { bmr: bmr2, tdee: tdee2, targetCalories: targetCalories2 },
          macros: macros2,
          tips: getDietTips(user.goal),
          generatedAt: new Date(),
        });
      } catch (emergencyErr) {
        console.error('[Diet] Emergency fallback failed too:', emergencyErr.message);
      }
    }

    res.status(500).json({
      message: 'Failed to generate diet plan. Please try again later.',
      error: error.message,
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
    const queryWeeks = req.query.weeks ? parseInt(req.query.weeks, 10) : null;
    const queryDays = req.query.days ? parseInt(req.query.days, 10) : null;

    let weeks;
    let days;
    let durationUnit = req.query.unit || (queryDays && !queryWeeks ? 'days' : 'weeks');

    if (queryWeeks) {
      weeks = Math.max(1, Math.min(12, queryWeeks));
      days = queryDays ? Math.max(1, Math.min(90, queryDays)) : weeks * 7;
    } else if (queryDays) {
      days = Math.max(1, Math.min(90, queryDays));
      weeks = Math.max(1, Math.min(12, Math.ceil(days / 7)));
    } else if (user.planDurationWeeks) {
      weeks = Math.max(1, Math.min(12, user.planDurationWeeks));
      days = user.planDurationDays || (weeks * 7);
      durationUnit = user.durationUnit || 'weeks';
    } else {
      weeks = 4;
      days = 28;
      durationUnit = 'weeks';
    }

    const additionalData = {
      planDurationDays: days,
      durationUnit,
      foodPreferences: user.foodPreferences || '',
      allergies: user.allergies || '',
    };

    const settingsHash = buildSettingsHash(user, weeks, additionalData);
    const cached = await GeminiDietPlan.findOne({
      $or: [
        { userId: user._id },
        { userId: user._id.toString() }
      ]
    });

    if (cached && cached.plan && cached.plan.weeks && cached.plan.weeks.length > 0) {
      const planObj = cached.plan && cached.plan.toObject ? cached.plan.toObject() : (cached.plan || {});
      planObj.id = cached._id.toString();
      planObj._id = cached._id.toString();
      planObj.userId = cached.userId.toString();

      return res.json({
        hasCachedPlan: true,
        planId: cached._id.toString(),
        id: cached._id.toString(),
        _id: cached._id.toString(),
        userId: cached.userId.toString(),
        generationSource: cached.generationSource,
        startDate: cached.startDate || user.planStartDate || new Date(),
        planStartDate: cached.startDate || user.planStartDate || new Date(),
        completedMeals: cached.completedMeals || [],
        planDurationWeeks: cached.planDurationWeeks,
        planDurationDays: cached.planDurationDays || (cached.planDurationWeeks * 7),
        durationUnit: cached.durationUnit || 'weeks',
        plan: planObj,
        metrics: cached.metrics,
        macros: cached.macros,
        tips: cached.tips,
        generatedAt: cached.generatedAt,
      });
    }

    // Fresh metrics so frontend can display calorie/macro targets
    const bmr = calculateBMR(user.weight, user.height, user.age, user.gender);
    const tdee = calculateTDEE(bmr, user.activityLevel);
    const targetCalories = calculateTargetCalories(tdee, user.goal);
    const macros = calculateMacros(targetCalories, user.goal, user.weight);
    const bmi = calculateBMI(user.weight, user.height);

    res.json({
      hasCachedPlan: false,
      planDurationWeeks: weeks,
      planDurationDays: days,
      durationUnit,
      metrics: { bmr, tdee, targetCalories, bmi },
      macros,
    });

  } catch (error) {
    console.error('[Diet] Cached plan check error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  generateDietPlan,
  getCachedPlan,
  buildSettingsHash,
  buildPrompt,
  validateAndFixPlan,
  callGemini,
};
