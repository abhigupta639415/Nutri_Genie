const mongoose = require('mongoose');
const User = require('../models/User');
const Progress = require('../models/Progress');
const { calculateBMR, calculateTDEE, calculateBMI, calculateTargetCalories, calculateMacros } = require('../utils/calculations');
const GeminiDietPlan = require('../models/GeminiDietPlan');
const { generateWeeklyMealPlan, getAlternativeMeals: getDietGeneratorAlternatives } = require('../utils/dietGenerator');

/**
 * Robust helper: Find the user's diet plan in MongoDB.
 * Checks by planId (if provided), by authenticated user ID (ObjectId and String),
 * and falls back to raw collection query to prevent type-casting mismatches.
 */
const findUserDietPlan = async (user, planId = null) => {
  const authenticatedUserId = user?._id ? user._id.toString() : null;
  if (!authenticatedUserId) return { plan: null };

  let plan = null;

  // 1. If planId is provided and is a valid ObjectId, look up by planId first
  if (planId && mongoose.Types.ObjectId.isValid(planId)) {
    plan = await GeminiDietPlan.findById(planId);
    if (plan) {
      if (plan.userId.toString() !== authenticatedUserId) {
        return { error: 'FORBIDDEN', message: 'Not authorized to access this diet plan' };
      }
      return { plan };
    }
  }

  // 2. Look up by authenticated user ID (handles both ObjectId and String representations)
  plan = await GeminiDietPlan.findOne({
    $or: [
      { userId: user._id },
      { userId: authenticatedUserId }
    ]
  });
  if (plan) return { plan };

  // 3. Fallback: query native collection to bypass any Mongoose casting discrepancies
  try {
    const rawPlan = await GeminiDietPlan.collection.findOne({
      $or: [
        { userId: user._id },
        { userId: authenticatedUserId },
        ...(planId && mongoose.Types.ObjectId.isValid(planId) ? [{ _id: new mongoose.Types.ObjectId(planId) }] : [])
      ]
    });
    if (rawPlan) {
      plan = await GeminiDietPlan.findById(rawPlan._id);
      if (plan) return { plan };
    }
  } catch (rawErr) {
    console.warn('[Diet] Raw collection query fallback error:', rawErr.message);
  }

  return { plan: null };
};

// @desc    Get personalized diet metrics and plan
// @route   GET /api/diet/plan
// @access  Private
const getDietPlan = async (req, res) => {
  try {
    const user = req.user;
    const { weight, height, age, gender, goal, activityLevel, dietaryPreference } = user;

    // Calculate fresh metrics
    const bmr = calculateBMR(weight, height, age, gender);
    const tdee = calculateTDEE(bmr, activityLevel);
    const targetCalories = calculateTargetCalories(tdee, goal);
    const macros = calculateMacros(targetCalories, goal, weight);
    const bmi = calculateBMI(weight, height);

    // Look for user's Gemini-generated plan
    const { plan: geminiPlan } = await findUserDietPlan(user);

    if (geminiPlan) {
      const planObj = geminiPlan.plan && geminiPlan.plan.toObject ? geminiPlan.plan.toObject() : (geminiPlan.plan || {});
      planObj.id = geminiPlan._id.toString();
      planObj._id = geminiPlan._id.toString();
      planObj.userId = geminiPlan.userId.toString();

      return res.json({
        planId: geminiPlan._id.toString(),
        id: geminiPlan._id.toString(),
        _id: geminiPlan._id.toString(),
        userId: geminiPlan.userId.toString(),
        metrics: { bmr, tdee, targetCalories, bmi },
        macros,
        planDurationWeeks: geminiPlan.planDurationWeeks,
        planDurationDays: geminiPlan.planDurationDays || (geminiPlan.planDurationWeeks * 7),
        durationUnit: geminiPlan.durationUnit || 'weeks',
        mealPlan: planObj,
        plan: planObj,
        completedMeals: geminiPlan.completedMeals || [],
        tips: geminiPlan.tips || getDietTips(goal, dietaryPreference),
        source: 'gemini',
        startDate: geminiPlan.startDate || user.planStartDate || new Date(),
        planStartDate: geminiPlan.startDate || user.planStartDate || new Date(),
        generatedAt: geminiPlan.generatedAt,
      });
    }

    // If not yet generated via Gemini, generate an authentic nutritionist plan using dietGenerator
    const planDurationWeeks = user.planDurationWeeks || 4;
    const planDurationDays = user.planDurationDays || (planDurationWeeks * 7);
    const weeklyPlan = generateWeeklyMealPlan(targetCalories, macros, dietaryPreference || 'vegetarian', planDurationDays, { goal });
    const initialStartDate = user.planStartDate || new Date();

    try {
      const savedPlan = await GeminiDietPlan.create({
        userId: user._id,
        settingsHash: 'initial_' + user._id,
        generationSource: 'nutritionist_engine',
        startDate: initialStartDate,
        completedMeals: [],
        planDurationWeeks,
        planDurationDays,
        durationUnit: user.durationUnit || 'weeks',
        plan: weeklyPlan,
        metrics: { bmr, tdee, targetCalories, bmi },
        macros,
        tips: getDietTips(goal, dietaryPreference),
        generatedAt: new Date(),
      });

      if (!user.planStartDate) {
        await User.findByIdAndUpdate(user._id, { planStartDate: initialStartDate });
      }

      return res.json({
        planId: savedPlan._id.toString(),
        id: savedPlan._id.toString(),
        _id: savedPlan._id.toString(),
        userId: user._id.toString(),
        metrics: { bmr, tdee, targetCalories, bmi },
        macros,
        planDurationWeeks,
        planDurationDays,
        durationUnit: user.durationUnit || 'weeks',
        mealPlan: weeklyPlan,
        plan: weeklyPlan,
        completedMeals: [],
        tips: getDietTips(goal, dietaryPreference),
        source: 'nutritionist_engine',
        startDate: savedPlan.startDate,
        planStartDate: savedPlan.startDate,
        generatedAt: savedPlan.generatedAt,
      });
    } catch (saveErr) {
      console.warn('[Diet] Could not save initial nutritionist plan to MongoDB:', saveErr.message);
      return res.json({
        metrics: { bmr, tdee, targetCalories, bmi },
        macros,
        planDurationWeeks,
        planDurationDays,
        durationUnit: user.durationUnit || 'weeks',
        mealPlan: weeklyPlan,
        plan: weeklyPlan,
        completedMeals: [],
        tips: getDietTips(goal, dietaryPreference),
        source: 'nutritionist_engine',
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get alternative meals
// @route   GET /api/diet/alternatives/:mealType
// @access  Private
const getAlternatives = async (req, res) => {
  try {
    const user = req.user;
    const { mealType } = req.params;
    const { currentMeal } = req.query;
    const collected = [];

    const { plan: geminiPlan } = await findUserDietPlan(user);

    if (geminiPlan && geminiPlan.plan && geminiPlan.plan.weeks) {
      // Collect distinct meals from the Gemini plan for that mealType
      for (const week of geminiPlan.plan.weeks) {
        for (const day of week.days || []) {
          const m = day.meals?.[mealType];
          if (m && m.name && m.name !== currentMeal && !collected.some(c => c.name === m.name)) {
            collected.push(m);
          }
        }
      }
    }

    if (collected.length < 3) {
      const dbAlts = getDietGeneratorAlternatives(mealType, user.dietaryPreference || 'vegetarian', currentMeal);
      for (const alt of dbAlts) {
        if (!collected.some(c => c.name === alt.name)) {
          collected.push(alt);
        }
      }
    }

    return res.json(collected.slice(0, 3));
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
      'Avoid sugary drinks and processed foods',
    ],
    weight_gain: [
      'Eat in a caloric surplus',
      'Focus on nutrient-dense foods',
      'Include healthy fats like nuts and ghee',
      'Eat frequent meals throughout the day',
    ],
    muscle_gain: [
      'Consume 1.6-2.2g protein per kg body weight',
      'Time your meals around workouts',
      'Include complex carbs for energy',
      'Stay consistent with meal timing',
    ],
    maintenance: [
      'Balance your macronutrients',
      'Eat a variety of foods',
      'Stay hydrated',
      "Listen to your body's hunger cues",
    ],
  };

  return tips[goal] || tips.maintenance;
};

/**
 * Helper: get the meal types for a specific plan day.
 * Falls back to the standard 4 if the day structure cannot be resolved.
 */
const getMealTypesForDay = (plan, dayNum) => {
  const weekIndex = Math.floor((dayNum - 1) / 7);
  const dayIndex = (dayNum - 1) % 7;
  const weeksArr = plan?.plan?.weeks || [];
  const weekObj = weeksArr[weekIndex] || weeksArr[weekIndex % (weeksArr.length || 1)];
  const dayObj = weekObj?.days?.[dayIndex];
  if (dayObj?.meals) return Object.keys(dayObj.meals);
  return ['breakfast', 'lunch', 'dinner', 'snacks'];
};

/**
 * Calculate progress stats from a completed set and the plan document.
 * Returns: { totalMeals, completedMealsCount, overallProgress, completedDays, totalDays }
 */
const calculateProgressStats = (plan, completedSet) => {
  const totalDays = plan.planDurationDays || (plan.planDurationWeeks * 7);
  let totalMeals = 0;
  let completedDaysCount = 0;

  for (let dayNum = 1; dayNum <= totalDays; dayNum++) {
    const dayMealTypes = getMealTypesForDay(plan, dayNum);
    const dayTotal = dayMealTypes.length;
    totalMeals += dayTotal;

    const dayCompletedCount = dayMealTypes.filter(mt => completedSet.has(`day${dayNum}-${mt}`)).length;
    if (dayCompletedCount === dayTotal && dayTotal > 0) completedDaysCount++;
  }

  const completedMealsCount = completedSet.size;
  const overallProgress = totalMeals > 0 ? Math.round((completedMealsCount / totalMeals) * 100) : 0;

  return { totalMeals, completedMealsCount, overallProgress, completedDays: completedDaysCount, totalDays };
};

/**
 * Calculate real adherence numbers from daily Progress records for this user within the active plan duration.
 */
const calculateAdherenceFromProgress = async (user, plan = null) => {
  const planDurationDays = plan?.planDurationDays || (plan?.planDurationWeeks ? plan.planDurationWeeks * 7 : (user?.planDurationDays || (user?.planDurationWeeks ? user.planDurationWeeks * 7 : 28)));
  const totalMeals = planDurationDays * 4;

  const planStartDate = plan?.startDate || user?.planStartDate || new Date();
  const startOfPlanDate = new Date(planStartDate);
  startOfPlanDate.setHours(0, 0, 0, 0);

  const endOfPlanDate = new Date(startOfPlanDate);
  endOfPlanDate.setDate(endOfPlanDate.getDate() + planDurationDays);
  endOfPlanDate.setHours(23, 59, 59, 999);

  const progressRecords = await Progress.find({
    userId: user._id,
    date: { $gte: startOfPlanDate, $lte: endOfPlanDate }
  });

  let completedMealsCount = 0;
  let completedDays = 0;
  const standardSlots = ['breakfast', 'lunch', 'dinner', 'snacks'];

  for (const doc of progressRecords) {
    if (Array.isArray(doc.mealsLogged) && doc.mealsLogged.length > 0) {
      const loggedSlots = new Set();
      for (const m of doc.mealsLogged) {
        if (m && m.mealType) {
          loggedSlots.add(m.mealType.toLowerCase().trim());
        }
      }
      completedMealsCount += loggedSlots.size;
      const allFour = standardSlots.every(s => loggedSlots.has(s)) || loggedSlots.size >= 4;
      if (allFour) {
        completedDays++;
      }
    }
  }

  const overallProgress = totalMeals > 0 ? Math.round((completedMealsCount / totalMeals) * 100) : 0;

  return {
    totalMeals,
    completedMealsCount,
    completedDays,
    totalDays: planDurationDays,
    overallProgress,
    planDurationDays,
    planDurationWeeks: Math.ceil(planDurationDays / 7)
  };
};

// @desc    Toggle progress for a meal and return updated progress stats
// @route   POST /api/diet/progress
// @access  Private
const updateProgress = async (req, res) => {
  try {
    const user = req.user;
    const { key, planId, dayId, mealId, completed: requestedCompleted } = req.body;

    const canonicalKey = key || (mealId && /^day\d+-\w+$/.test(mealId) ? mealId : (dayId && mealId ? `day${dayId}-${mealId}` : null));

    if (!canonicalKey) {
      return res.status(400).json({
        success: false,
        message: 'Meal key is required',
        code: 'MISSING_KEY',
      });
    }

    // Validate key format: must be day<N>-<mealType>
    if (!/^day\d+-\w+$/.test(canonicalKey)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid meal key format. Expected: day<N>-<mealType>',
        code: 'INVALID_KEY_FORMAT',
      });
    }

    console.log("MEAL PROGRESS SAVE", {
      authenticatedUserId: user?._id?.toString(),
      planId,
      dayId,
      mealId,
      completed: requestedCompleted,
    });

    const { plan, error, message } = await findUserDietPlan(user, planId);

    console.log("DIET PLAN FOUND", {
      planId: plan?._id?.toString(),
      userId: plan?.userId?.toString(),
    });

    if (error === 'FORBIDDEN') {
      return res.status(403).json({
        success: false,
        message: message || 'Not authorized to modify this diet plan',
        code: 'FORBIDDEN',
      });
    }

    let currentPlan = plan;

    if (!currentPlan) {
      console.log('[Diet] updateProgress - No diet plan found. Generating initial nutritionist plan for user:', user?._id?.toString());
      const bmr = calculateBMR(user.weight || 70, user.height || 170, user.age || 25, user.gender || 'male');
      const tdee = calculateTDEE(bmr, user.activityLevel || 'moderate');
      const targetCalories = calculateTargetCalories(tdee, user.goal || 'maintenance');
      const macros = calculateMacros(targetCalories, user.goal || 'maintenance', user.weight || 70);
      const bmi = calculateBMI(user.weight || 70, user.height || 170);
      const planDurationWeeks = user.planDurationWeeks || 4;
      const planDurationDays = user.planDurationDays || (planDurationWeeks * 7);
      const weeklyPlan = generateWeeklyMealPlan(targetCalories, macros, user.dietaryPreference || 'vegetarian', planDurationDays, { goal: user.goal });

      try {
        currentPlan = await GeminiDietPlan.create({
          userId: user._id,
          settingsHash: 'initial_' + user._id,
          generationSource: 'nutritionist_engine',
          startDate: new Date(),
          completedMeals: [],
          planDurationWeeks,
          planDurationDays,
          durationUnit: user.durationUnit || 'weeks',
          plan: weeklyPlan,
          metrics: { bmr, tdee, targetCalories, bmi },
          macros,
          tips: getDietTips(user.goal, user.dietaryPreference),
          generatedAt: new Date(),
        });
      } catch (createErr) {
        console.warn('[Diet] Could not create fallback plan during progress save:', createErr.message);
      }
    }

    if (!currentPlan) {
      // Optimistic 200 response even if DB couldn't create a plan
      const isNowCompleted = typeof requestedCompleted === 'boolean' ? requestedCompleted : true;
      return res.json({
        success: true,
        mealCompleted: isNowCompleted,
        completedMeals: isNowCompleted ? 1 : 0,
        completedMealsList: isNowCompleted ? [canonicalKey] : [],
        totalMeals: 28 * 4,
        completedDays: 0,
        totalDays: 28,
        dayProgress: isNowCompleted ? 25 : 0,
        overallProgress: 1,
      });
    }

    // Calculate specific day progress and validate that only today is markable
    const dayNum = parseInt(dayId, 10) || (canonicalKey.match(/day(\d+)/)?.[1] ? parseInt(canonicalKey.match(/day(\d+)/)[1], 10) : 1);
    const planStartDate = currentPlan.startDate || user.planStartDate || new Date();
    const anchor = new Date(planStartDate);
    anchor.setHours(0, 0, 0, 0);

    const clientNow = req.body.clientDate ? new Date(req.body.clientDate) : new Date();
    const today = new Date(clientNow);
    today.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((today.getTime() - anchor.getTime()) / (1000 * 60 * 60 * 24));
    const currentDayNum = Math.max(1, diffDays + 1);

    if (dayNum > currentDayNum) {
      return res.status(400).json({
        success: false,
        message: `Day ${dayNum} is locked. You can only log meals for today (Day ${currentDayNum}).`,
        code: 'FUTURE_DAY',
      });
    }

    if (dayNum < currentDayNum) {
      return res.status(400).json({
        success: false,
        message: `Day ${dayNum} is in the past and is read-only.`,
        code: 'PAST_DAY',
      });
    }

    // Toggle the meal completion
    const completed = new Set(currentPlan.completedMeals || []);
    const wasCompleted = completed.has(canonicalKey);

    let isNowCompleted;
    if (typeof requestedCompleted === 'boolean') {
      isNowCompleted = requestedCompleted;
    } else {
      isNowCompleted = !wasCompleted;
    }

    if (isNowCompleted) {
      completed.add(canonicalKey);
    } else {
      completed.delete(canonicalKey);
    }

    const completedMealsArray = Array.from(completed);

    // Persist to GeminiDietPlan completedMeals array
    await GeminiDietPlan.findByIdAndUpdate(
      currentPlan._id,
      { $set: { completedMeals: completedMealsArray } },
      { new: true }
    );

    // Resolve meal slot, dish name, and calories
    const mealType = (req.body.mealType || req.body.mealId || canonicalKey.split('-')[1] || 'meal').toLowerCase();
    let mealName = req.body.mealName;
    let calories = req.body.calories ? Number(req.body.calories) : 0;

    if (!mealName && currentPlan?.plan?.weeks) {
      const weekIndex = Math.floor((dayNum - 1) / 7);
      const dayIndex = (dayNum - 1) % 7;
      const weeksArr = currentPlan.plan.weeks || [];
      const weekObj = weeksArr[weekIndex] || weeksArr[weekIndex % (weeksArr.length || 1)];
      const dayObj = weekObj?.days?.[dayIndex];
      const m = dayObj?.meals?.[mealType];
      if (m) {
        mealName = m.name;
        if (!calories && m.calories) calories = Number(m.calories);
      }
    }

    // Persist meal completion into today's daily Progress document
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    let progress = await Progress.findOne({
      userId: user._id,
      date: { $gte: startOfToday, $lte: endOfToday }
    });

    if (!progress) {
      progress = new Progress({
        userId: user._id,
        date: now,
        weight: user.weight || 70,
        caloriesConsumed: 0,
        caloriesBurned: 0,
        waterIntake: 0,
        sleepHours: 0,
        mood: 'okay',
        workoutsCompleted: [],
        mealsLogged: []
      });
    }

    if (!Array.isArray(progress.mealsLogged)) {
      progress.mealsLogged = [];
    }

    const itemsArray = mealName ? [mealName] : [mealType];

    if (isNowCompleted) {
      const existingIdx = progress.mealsLogged.findIndex(
        m => m.mealType && m.mealType.toLowerCase() === mealType
      );
      if (existingIdx >= 0) {
        progress.mealsLogged[existingIdx].items = itemsArray;
        if (calories) progress.mealsLogged[existingIdx].calories = calories;
      } else {
        progress.mealsLogged.push({
          mealType,
          items: itemsArray,
          calories: calories || 0
        });
      }
    } else {
      progress.mealsLogged = progress.mealsLogged.filter(
        m => !m.mealType || m.mealType.toLowerCase() !== mealType
      );
    }

    await progress.save();

    // Calculate full progress stats from daily Progress documents
    const adherenceStats = await calculateAdherenceFromProgress(user, currentPlan);

    const dayMealTypes = getMealTypesForDay(currentPlan, dayNum);
    const dayTotal = dayMealTypes.length;
    const dayCompletedCount = dayMealTypes.filter(mt => completed.has(`day${dayNum}-${mt}`)).length;
    const dayProgress = dayTotal > 0 ? Math.round((dayCompletedCount / dayTotal) * 100) : 0;

    return res.json({
      success: true,
      mealCompleted: isNowCompleted,
      completedMeals: adherenceStats.completedMealsCount,
      completedMealsList: completedMealsArray,
      completedMealsCount: adherenceStats.completedMealsCount,
      totalMeals: adherenceStats.totalMeals,
      completedDays: adherenceStats.completedDays,
      totalDays: adherenceStats.totalDays,
      dayProgress,
      overallProgress: adherenceStats.overallProgress,
      planId: currentPlan._id.toString(),
      id: currentPlan._id.toString(),
    });
  } catch (error) {
    console.error('[Diet] updateProgress error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message,
      code: 'SERVER_ERROR',
    });
  }
};

// @desc    Reset progress (clear all completed meals, reset startDate)
// @route   POST /api/diet/reset
// @access  Private
const resetProgress = async (req, res) => {
  try {
    const user = req.user;
    const { plan } = await findUserDietPlan(user);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'No diet plan found',
        code: 'DIET_PLAN_NOT_FOUND',
      });
    }

    const newStartDate = new Date();
    await GeminiDietPlan.findByIdAndUpdate(
      plan._id,
      { $set: { completedMeals: [], startDate: newStartDate } },
      { new: true }
    );

    await User.findByIdAndUpdate(user._id, { planStartDate: newStartDate });

    // Clear mealsLogged on today's Progress doc as well so adherence resets cleanly
    const startOfToday = new Date(newStartDate);
    startOfToday.setHours(0, 0, 0, 0);
    await Progress.updateMany(
      { userId: user._id, date: { $gte: startOfToday } },
      { $set: { mealsLogged: [] } }
    );

    const stats = await calculateAdherenceFromProgress(user, plan);

    res.json({
      success: true,
      message: 'Progress reset successfully',
      completedMeals: 0,
      completedMealsList: [],
      startDate: newStartDate,
      planStartDate: newStartDate,
      totalMeals: stats.totalMeals,
      completedMealsCount: 0,
      completedDays: 0,
      totalDays: stats.totalDays,
      overallProgress: 0,
      planId: plan._id.toString(),
      id: plan._id.toString(),
    });
  } catch (error) {
    console.error('[Diet] resetProgress error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message,
      code: 'SERVER_ERROR',
    });
  }
};

// @desc    Get current diet progress stats without toggling anything
// @route   GET /api/diet/progress-stats
// @access  Private
const getProgressStats = async (req, res) => {
  try {
    const user = req.user;
    const { plan } = await findUserDietPlan(user);
    const stats = await calculateAdherenceFromProgress(user, plan);

    return res.json({
      hasPlan: !!plan,
      planId: plan ? plan._id.toString() : null,
      id: plan ? plan._id.toString() : null,
      _id: plan ? plan._id.toString() : null,
      completedMeals: stats.completedMealsCount,
      completedMealsList: plan?.completedMeals || [],
      completedMealsCount: stats.completedMealsCount,
      totalMeals: stats.totalMeals,
      completedDays: stats.completedDays,
      totalDays: stats.totalDays,
      overallProgress: stats.overallProgress,
      planDurationDays: stats.planDurationDays,
      planDurationWeeks: stats.planDurationWeeks,
    });
  } catch (error) {
    console.error('[Diet] getProgressStats error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message,
      code: 'SERVER_ERROR',
    });
  }
};

module.exports = {
  getDietPlan,
  getAlternatives,
  updateProgress,
  resetProgress,
  getProgressStats,
};
