import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Coffee, Sun, Moon as MoonIcon, Apple, Check, Target, Flame, ChevronLeft, ChevronRight, Award, Zap, CheckCircle, Calendar, Clock, Settings, Sparkles, RefreshCw } from 'lucide-react';

import { resolveMealImage, SLOT_DEFAULTS } from '../utils/mealImageResolver';

const getMealImage = (mealType, mealName) => {
  return resolveMealImage(mealName, mealType);
};

const mealEmojis = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
  snacks: '🍎',
};

// ─── Duration Presets ───────────────────────────────────────────────────────
const DURATION_PRESETS = [
  { label: '1 Week', weeks: 1, days: 7, unit: 'weeks', icon: '⚡' },
  { label: '2 Weeks', weeks: 2, days: 14, unit: 'weeks', icon: '🔥' },
  { label: '4 Weeks', weeks: 4, days: 28, unit: 'weeks', icon: '💪' },
  { label: '8 Weeks', weeks: 8, days: 56, unit: 'weeks', icon: '🏋️' },
  { label: '12 Weeks', weeks: 12, days: 84, unit: 'weeks', icon: '👑' },
  { label: '30 Days', weeks: 5, days: 30, unit: 'days', icon: '📅' },
];

// ─── Main Component ─────────────────────────────────────────────────────────
const DietPlan = () => {
  const { user } = useAuth();
  const [dietData, setDietData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [showDurationPicker, setShowDurationPicker] = useState(false);
  const [customDaysInput, setCustomDaysInput] = useState('');

  const [planDurationWeeks, setPlanDurationWeeks] = useState(4);
  const [planDurationDays, setPlanDurationDays] = useState(28);
  const [durationUnit, setDurationUnit] = useState('weeks');

  // ── Progress state — single source of truth synced from backend ─────────
  // completedMeals: Set<string>  e.g. Set { 'day1-breakfast', 'day2-lunch' }
  const [completedMeals, setCompletedMeals] = useState(new Set());
  // togglingMeals: Set<string>  — prevents double-clicks while API is in flight
  const [togglingMeals, setTogglingMeals] = useState(new Set());

  // Per-user duration storage key (localStorage — only for plan duration, NOT completion)
  const getDurationKey = useCallback(() => {
    const userId = user?._id || user?.id || 'guest';
    return `nutrigenie_plan_duration_${userId}`;
  }, [user]);

  // ── Helper: update completedMeals from an array or Set ──────────────────
  const syncCompletedMeals = useCallback((mealsArrayOrSet) => {
    if (Array.isArray(mealsArrayOrSet)) {
      setCompletedMeals(new Set(mealsArrayOrSet));
    } else if (mealsArrayOrSet instanceof Set) {
      setCompletedMeals(new Set(mealsArrayOrSet));
    }
  }, []);

  // ── Sync completedMeals whenever dietData loads/changes ─────────────────
  useEffect(() => {
    if (!dietData) return;
    const list = Array.isArray(dietData.completedMealsList)
      ? dietData.completedMealsList
      : (Array.isArray(dietData.completedMeals)
          ? dietData.completedMeals
          : (Array.isArray(dietData.plan?.completedMeals) ? dietData.plan.completedMeals : []));
    syncCompletedMeals(list);
  }, [dietData, syncCompletedMeals]);

  // ─── Fetch / Generate Diet Plan ────────────────────────────────────────────
  // Priority:
  //  1. Cached plan matching current settings (if !forceRegen)
  //  2. POST /api/diet/generate  → backend tries Gemini, then existing plan, then fallback
  //  3. If backend 500s, try one more GET /api/diet/cached for any stored plan
  //  4. Only set error if absolutely nothing worked
  const fetchDietPlan = useCallback(async (forceRegen = false, targetWeeks = null, targetDays = null, targetUnit = null) => {
    setLoading(true);
    setError(null);

    try {
      const weeks = targetWeeks || user?.planDurationWeeks || 4;
      const days = targetDays || (targetWeeks ? targetWeeks * 7 : (user?.planDurationDays || 28));
      const unit = targetUnit || user?.durationUnit || 'weeks';

      // ── Step 1: Check cache (skip on forceRegen) ─────────────────────────
      if (!forceRegen) {
        try {
          const cachedRes = await axios.get(
            `http://localhost:3001/api/diet/cached?weeks=${weeks}&days=${days}&unit=${unit}`
          );
          if (cachedRes.data.hasCachedPlan && cachedRes.data.plan && cachedRes.data.plan.weeks?.length > 0) {
            setDietData(cachedRes.data);
            const activeWeeks = cachedRes.data.planDurationWeeks || weeks;
            const activeDays = cachedRes.data.planDurationDays || (activeWeeks * 7);
            setPlanDurationWeeks(activeWeeks);
            setPlanDurationDays(activeDays);
            setDurationUnit(cachedRes.data.durationUnit || unit);
            // completedMeals synced by useEffect watching dietData
            setLoading(false);
            return;
          }
        } catch (cacheErr) {
          console.warn('[DietPlan] Cache check failed, continuing to generate:', cacheErr.message);
        }
      }

      // ── Step 2: Generate (backend handles Gemini → saved plan → fallback) ──
      setGenerating(true);
      try {
        const genRes = await axios.post('http://localhost:3001/api/diet/generate', {
          planDurationWeeks: weeks,
          planDurationDays: days,
          durationUnit: unit,
          foodPreferences: user?.foodPreferences || '',
          allergies: user?.allergies || '',
          forceRegenerate: forceRegen,
        });

        if (genRes.data && genRes.data.plan && genRes.data.plan.weeks?.length > 0) {
          setDietData(genRes.data);
          const activeWeeks = genRes.data.planDurationWeeks || weeks;
          const activeDays = genRes.data.planDurationDays || (activeWeeks * 7);
          setPlanDurationWeeks(activeWeeks);
          setPlanDurationDays(activeDays);
          setDurationUnit(genRes.data.durationUnit || unit);
          if (user) localStorage.setItem(getDurationKey(), String(activeDays));
          return;
        }
      } catch (genErr) {
        console.error('[DietPlan] Generate endpoint failed:', genErr.message);

        // ── Step 3: Fallback — load any stored plan regardless of hash ─────
        try {
          const fallbackCacheRes = await axios.get(
            `http://localhost:3001/api/diet/cached?weeks=${weeks}&days=${days}&unit=${unit}`
          );
          if (fallbackCacheRes.data && (fallbackCacheRes.data.hasCachedPlan || fallbackCacheRes.data.plan)) {
            const planData = fallbackCacheRes.data;
            if (planData.plan && planData.plan.weeks?.length > 0) {
              setDietData(planData);
              const activeWeeks = planData.planDurationWeeks || weeks;
              const activeDays = planData.planDurationDays || (activeWeeks * 7);
              setPlanDurationWeeks(activeWeeks);
              setPlanDurationDays(activeDays);
              setDurationUnit(planData.durationUnit || unit);
              return;
            }
          }
        } catch (fallbackErr) {
          console.error('[DietPlan] Fallback cache load also failed:', fallbackErr.message);
        }

        // ── Step 4: All paths exhausted — show error ──────────────────────
        setError(
          genErr.response?.data?.message ||
          genErr.message ||
          'Failed to generate your diet plan. Please check your connection and try again.'
        );
      }

    } catch (err) {
      console.error('[DietPlan] Unexpected error in fetchDietPlan:', err);
      setError(err.message || 'An unexpected error occurred. Please refresh and try again.');
    } finally {
      setLoading(false);
      setGenerating(false);
    }
  }, [user, getDurationKey]);

  // Re-fetch when user profile changes
  useEffect(() => {
    if (user) {
      fetchDietPlan();
    }
  }, [user?.goal, user?.activityLevel, user?.dietaryPreference, user?.planDurationWeeks, user?.planDurationDays, fetchDietPlan]);

  // Duration change handler
  const changeDuration = async (preset) => {
    setShowDurationPicker(false);
    setSelectedWeek(1);
    await fetchDietPlan(true, preset.weeks, preset.days, preset.unit);
  };

  const handleCustomDurationSubmit = async () => {
    const val = parseInt(customDaysInput, 10);
    if (val > 0 && val <= 90) {
      const weeks = Math.max(1, Math.min(12, Math.ceil(val / 7)));
      setShowDurationPicker(false);
      setSelectedWeek(1);
      await fetchDietPlan(true, weeks, val, 'days');
    }
  };

  // ── Meal extraction from plan ──
  const getMealForDay = (day, mealType) => {
    if (!dietData?.plan?.weeks || dietData.plan.weeks.length === 0) {
      return { name: 'Healthy Meal', calories: 350, protein: 15, carbs: 45, fats: 10 };
    }

    const weekIndex = Math.floor((day - 1) / 7);
    const dayIndex = (day - 1) % 7;

    const weekObj = dietData.plan.weeks[weekIndex] || dietData.plan.weeks[weekIndex % dietData.plan.weeks.length];
    const dayObj = weekObj?.days?.[dayIndex] || weekObj?.days?.[0];

    if (dayObj?.meals?.[mealType]) {
      return dayObj.meals[mealType];
    }

    return { name: 'Healthy Meal', calories: 350, protein: 15, carbs: 45, fats: 10 };
  };

  // ── Get the actual meal types available for a given day (from plan structure) ──
  const getMealTypesForDay = (day) => {
    if (!dietData?.plan?.weeks?.length) return ['breakfast', 'lunch', 'dinner', 'snacks'];
    const weekIndex = Math.floor((day - 1) / 7);
    const dayIndex = (day - 1) % 7;
    const weekObj = dietData.plan.weeks[weekIndex] || dietData.plan.weeks[weekIndex % dietData.plan.weeks.length];
    const dayObj = weekObj?.days?.[dayIndex];
    if (dayObj?.meals) return Object.keys(dayObj.meals);
    return ['breakfast', 'lunch', 'dinner', 'snacks'];
  };

  const getDayNameForDay = (day) => {
    let dateStr = '';
    if (dietData?.startDate) {
      const startDate = new Date(dietData.startDate);
      const targetDate = new Date(startDate);
      targetDate.setDate(startDate.getDate() + (day - 1));

      const isToday = new Date().toDateString() === targetDate.toDateString();
      dateStr = `${isToday ? 'Today · ' : ''}${targetDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}`;
    }

    if (!dietData?.plan?.weeks) return dateStr || `Day ${day}`;

    const weekIndex = Math.floor((day - 1) / 7);
    const dayIndex = (day - 1) % 7;
    const weekObj = dietData.plan.weeks[weekIndex] || dietData.plan.weeks[weekIndex % dietData.plan.weeks.length];
    const dayObj = weekObj?.days?.[dayIndex];
    return dateStr || (dayObj?.dayName || `Day ${day}`);
  };

  // ── Meal completion helpers ──────────────────────────────────────────────
  const isMealCompleted = (day, mealType) => completedMeals.has(`day${day}-${mealType}`);
  const isMealToggling = (day, mealType) => togglingMeals.has(`day${day}-${mealType}`);

  // ── Core toggle: optimistic update → API → sync response or revert ──────
  const toggleMealComplete = async (day, mealType) => {
    const key = `day${day}-${mealType}`;

    // Prevent double-click while this meal is in flight
    if (togglingMeals.has(key)) return;

    // Mark as toggling
    setTogglingMeals(prev => { const s = new Set(prev); s.add(key); return s; });

    // Optimistic update
    const wasCompleted = completedMeals.has(key);
    setCompletedMeals(prev => {
      const s = new Set(prev);
      if (wasCompleted) s.delete(key);
      else s.add(key);
      return s;
    });

    const canonicalPlanId =
      dietData?.planId ||
      dietData?.id ||
      dietData?._id ||
      dietData?.plan?.id ||
      dietData?.plan?._id ||
      null;

    console.log("MEAL PROGRESS REQUEST", {
      planId: canonicalPlanId,
      dayId: day,
      mealId: mealType,
      completed: !wasCompleted,
    });

    try {
      const res = await axios.post("http://localhost:3001/api/diet/progress", {
        planId: canonicalPlanId,
        dayId: day,
        mealId: mealType,
        key,
        completed: !wasCompleted,
      });

      // Sync the authoritative completedMeals array from the server
      const serverList = res.data?.completedMealsList || (Array.isArray(res.data?.completedMeals) ? res.data.completedMeals : null);
      if (serverList) {
        syncCompletedMeals(serverList);
        setDietData(prev => prev ? { ...prev, completedMeals: serverList } : prev);
      }
    } catch (err) {
      console.error('[DietPlan] Failed to toggle meal completion:', err.response?.data?.message || err.message);
      // Revert optimistic update on error
      setCompletedMeals(prev => {
        const s = new Set(prev);
        if (wasCompleted) s.add(key);
        else s.delete(key);
        return s;
      });
      // Show error toast
      alert(`Failed to save: ${err.response?.data?.message || err.message || 'Connection error. Please try again.'}`);
    } finally {
      setTogglingMeals(prev => { const s = new Set(prev); s.delete(key); return s; });
    }
  };

  // ── Progress Calculations — derived from completedMeals Set ─────────────
  // These compute on every render, so they are always in sync with local state.

  const getDayProgress = (day) => {
    const mealTypes = getMealTypesForDay(day);
    if (mealTypes.length === 0) return 0;
    const done = mealTypes.filter(mt => isMealCompleted(day, mt)).length;
    return (done / mealTypes.length) * 100;
  };

  const getOverallProgress = () => {
    if (planDurationDays === 0) return 0;
    let total = 0, done = 0;
    for (let day = 1; day <= planDurationDays; day++) {
      const mealTypes = getMealTypesForDay(day);
      total += mealTypes.length;
      done += mealTypes.filter(mt => isMealCompleted(day, mt)).length;
    }
    return total > 0 ? Math.round((done / total) * 100) : 0;
  };

  const getDaysCompleted = () => {
    let count = 0;
    for (let day = 1; day <= planDurationDays; day++) {
      if (getDayProgress(day) === 100) count++;
    }
    return count;
  };

  const getTotalMealsTracked = () => completedMeals.size;

  // ── Reset progress ──────────────────────────────────────────────────────
  const handleReset = async () => {
    if (!window.confirm('Are you sure you want to reset your progress? Your meal plan will stay the same, but all completed meals will be cleared.')) return;
    try {
      const res = await axios.post('http://localhost:3001/api/diet/reset');
      syncCompletedMeals([]);
      if (dietData) {
        setDietData(prev => prev ? { ...prev, startDate: res.data.startDate, completedMeals: [] } : prev);
      }
    } catch (err) {
      console.error('[DietPlan] Failed to reset progress:', err);
      alert('Failed to reset progress. Please try again.');
    }
  };

  // ── Derived values for render ────────────────────────────────────────────
  const totalWeeks = planDurationWeeks || Math.ceil(planDurationDays / 7);
  const weekDays = Array.from({ length: 7 }, (_, i) => (selectedWeek - 1) * 7 + i + 1).filter(d => d <= planDurationDays);
  const overallProgress = getOverallProgress();
  const totalMealsTracked = getTotalMealsTracked();
  const daysCompleted = getDaysCompleted();

  const mealIcons = {
    breakfast: <Coffee className="w-4 h-4" />,
    lunch: <Sun className="w-4 h-4" />,
    dinner: <MoonIcon className="w-4 h-4" />,
    snacks: <Apple className="w-4 h-4" />,
  };



  // ── Loading / Generating state ──
  if (loading || generating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-slate-700"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-cyan-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-r-purple-500 border-b-transparent border-l-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <h3 className="mt-6 text-white text-xl font-bold">
            Generating your personalized diet plan...
          </h3>
          <p className="mt-2 text-slate-400 text-sm">
            Gemini AI is crafting your dynamic {planDurationWeeks}-week meal plan based on your {user?.goal?.replace('_', ' ') || 'fitness'} goals and {user?.dietaryPreference?.replace('_', ' ') || 'dietary'} preferences ✨
          </p>
        </div>
      </div>
    );
  }

  // ── Error state with Retry ──
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="glass-dark p-8 rounded-3xl border border-red-500/30 text-center max-w-md shadow-2xl">
          <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h3 className="text-2xl font-black text-white mb-2">Unable to load diet plan</h3>
          <p className="text-slate-300 text-sm mb-2">
            Gemini AI is temporarily unavailable and no saved plan was found.
          </p>
          {error && error.length < 200 && (
            <p className="text-slate-500 text-xs mb-6 font-mono bg-slate-800/50 rounded-lg p-2">{error}</p>
          )}
          <p className="text-slate-400 text-xs mb-6">
            Clicking "Retry" will attempt Gemini again, then automatically use our local meal database if Gemini is still unavailable.
          </p>
          <button
            onClick={() => fetchDietPlan(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/30 transition-all transform hover:scale-105"
          >
            <RefreshCw className="w-4 h-4" />
            Retry (Auto-Fallback)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pb-12 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-green-500 rounded-full mix-blend-multiply filter blur-[120px] opacity-[0.07] animate-blob"></div>
        <div className="absolute top-40 right-10 w-[500px] h-[500px] bg-orange-500 rounded-full mix-blend-multiply filter blur-[120px] opacity-[0.07] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-[500px] h-[500px] bg-yellow-500 rounded-full mix-blend-multiply filter blur-[120px] opacity-[0.07] animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ═══════════════ HEADER ═══════════════ */}
        <div className="pt-8 pb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <span className="text-2xl">🍽️</span>
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">
                    Your Meal Plan
                  </h1>
                </div>
              </div>
              <p className="text-slate-400 text-base sm:text-lg ml-0 sm:ml-15">
                AI-generated personalized meal plan by Gemini ✨
              </p>
              <div className="flex flex-wrap gap-2 mt-2 ml-0 sm:ml-15">
                {user?.dietaryPreference && (
                  <span className="px-3 py-1 bg-green-500/15 text-green-400 rounded-full text-xs font-bold border border-green-500/20">
                    {user.dietaryPreference === 'non_vegetarian' ? '🍗 Non-Veg' : user.dietaryPreference === 'vegan' ? '🌱 Vegan' : user.dietaryPreference === 'diabetic_friendly' ? '💊 Diabetic' : '🥬 Vegetarian'}
                  </span>
                )}
                {user?.goal && (
                  <span className="px-3 py-1 bg-cyan-500/15 text-cyan-400 rounded-full text-xs font-bold border border-cyan-500/20">
                    {user.goal === 'weight_loss' ? '🔥 Weight Loss' : user.goal === 'weight_gain' ? '💪 Weight Gain' : user.goal === 'muscle_gain' ? '🏋️ Muscle Gain' : '⚖️ Maintenance'}
                  </span>
                )}
                <span className="px-3 py-1 bg-purple-500/15 text-purple-400 rounded-full text-xs font-bold border border-purple-500/20 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {dietData?.generationSource === 'fallback' ? 'Smart Fallback' : 'Gemini Generated'}
                </span>
              </div>
            </div>

            {/* Duration Badge & Changer */}
            <div className="relative">
              <button
                onClick={() => setShowDurationPicker(!showDurationPicker)}
                className="glass-dark px-6 py-4 rounded-2xl border border-white/10 shadow-2xl hover:border-cyan-500/30 transition-all group cursor-pointer flex items-center gap-4"
              >
                <div className="text-center">
                  <div className="text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">Plan Duration</div>
                  <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    {durationUnit === 'days' && planDurationDays === 30 ? '30 Days' : `${planDurationWeeks} ${planDurationWeeks === 1 ? 'Week' : 'Weeks'}`}
                  </div>
                  <div className="text-slate-500 text-xs font-semibold">
                    {planDurationDays} days total · tap to customize
                  </div>
                </div>
                <Settings className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 group-hover:rotate-90 transition-all duration-300" />
              </button>

              {/* Duration Picker Dropdown */}
              {showDurationPicker && (
                <div className="absolute right-0 top-full mt-3 z-50 glass-dark rounded-2xl border border-white/10 shadow-2xl p-4 min-w-[280px] animate-fade-in">
                  <div className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    Customize Plan Duration
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {DURATION_PRESETS.map((preset) => (
                      <button
                        key={preset.label}
                        onClick={() => changeDuration(preset)}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all text-left ${
                          planDurationWeeks === preset.weeks && durationUnit === preset.unit
                            ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-white'
                            : 'hover:bg-white/5 text-slate-400 hover:text-white border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{preset.icon}</span>
                          <span className="font-semibold">{preset.label}</span>
                        </div>
                        <span className="text-xs text-slate-500">{preset.days} days</span>
                      </button>
                    ))}
                  </div>

                  {/* Custom Duration Input */}
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <label className="text-xs text-slate-500 font-semibold mb-1 block">Custom Days (1–90)</label>
                    <div className="flex gap-2 mb-4">
                      <input
                        type="number"
                        min="1"
                        max="90"
                        placeholder="e.g. 45"
                        value={customDaysInput}
                        onChange={(e) => setCustomDaysInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleCustomDurationSubmit();
                        }}
                        className="flex-1 px-3 py-2 bg-slate-800/50 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500/50"
                      />
                      <button
                        onClick={handleCustomDurationSubmit}
                        className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all"
                      >
                        Set
                      </button>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="pt-3 border-t border-white/10 space-y-2">
                      <button
                        onClick={handleReset}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800/50 text-white rounded-xl text-sm font-bold hover:bg-red-500/20 hover:text-red-400 transition-all border border-transparent hover:border-red-500/30"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Reset Progress
                      </button>
                      <button
                        onClick={() => fetchDietPlan(true)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800/50 text-white rounded-xl text-sm font-bold hover:bg-cyan-500/20 hover:text-cyan-400 transition-all border border-transparent hover:border-cyan-500/30"
                      >
                        <Sparkles className="w-4 h-4" />
                        Regenerate Plan
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ═══════════════ PROGRESS OVERVIEW ═══════════════ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {/* Overall Progress */}
          <div className="glass-dark p-4 sm:p-6 rounded-2xl border border-white/10 shadow-xl hover:shadow-cyan-500/10 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <Target className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="text-2xl">🎯</span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white">{overallProgress}%</div>
            <div className="text-slate-500 text-xs sm:text-sm mt-1 font-semibold">Overall Progress</div>
            <div className="mt-3 bg-slate-700/50 rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-500 to-purple-500 h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${overallProgress}%` }}></div>
            </div>
          </div>

          {/* Days Completed */}
          <div className="glass-dark p-4 sm:p-6 rounded-2xl border border-white/10 shadow-xl hover:shadow-green-500/10 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-green-400 group-hover:scale-110 transition-transform" />
              <span className="text-2xl">📅</span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white">{getDaysCompleted()}<span className="text-lg text-slate-500">/{planDurationDays}</span></div>
            <div className="text-slate-500 text-xs sm:text-sm mt-1 font-semibold">Days Completed</div>
          </div>

          {/* Daily Calories */}
          <div className="glass-dark p-4 sm:p-6 rounded-2xl border border-white/10 shadow-xl hover:shadow-orange-500/10 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <Flame className="w-8 h-8 sm:w-10 sm:h-10 text-orange-400 group-hover:scale-110 transition-transform" />
              <span className="text-2xl">🔥</span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white">{dietData?.metrics?.targetCalories || 2000}</div>
            <div className="text-slate-500 text-xs sm:text-sm mt-1 font-semibold">Daily Calories</div>
          </div>

          {/* Meals Tracked */}
          <div className="glass-dark p-4 sm:p-6 rounded-2xl border border-white/10 shadow-xl hover:shadow-yellow-500/10 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <Award className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400 group-hover:scale-110 transition-transform" />
              <span className="text-2xl">🏆</span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white">{totalMealsTracked}</div>
            <div className="text-slate-500 text-xs sm:text-sm mt-1 font-semibold">Meals Tracked</div>
          </div>
        </div>

        {/* ═══════════════ WEEK SELECTOR ═══════════════ */}
        <div className="glass-dark p-4 sm:p-6 rounded-2xl border border-white/10 mb-8 shadow-xl">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedWeek(Math.max(1, selectedWeek - 1))}
              disabled={selectedWeek === 1}
              className="p-2 sm:p-3 bg-slate-700/50 rounded-xl hover:bg-slate-600/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-110"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
            </button>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-black text-white mb-1">Week {selectedWeek}</div>
              <div className="text-slate-500 text-xs sm:text-sm font-semibold">
                Days {(selectedWeek - 1) * 7 + 1} – {Math.min(selectedWeek * 7, planDurationDays)} of {planDurationDays}
              </div>
            </div>
            <button
              onClick={() => setSelectedWeek(Math.min(totalWeeks, selectedWeek + 1))}
              disabled={selectedWeek >= totalWeeks}
              className="p-2 sm:p-3 bg-slate-700/50 rounded-xl hover:bg-slate-600/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-110"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
            </button>
          </div>

          {/* Dynamic Week Dots / Buttons */}
          <div className="flex justify-center gap-2 mt-5 flex-wrap">
            {Array.from({ length: totalWeeks }, (_, i) => i + 1).map(week => (
              <button
                key={week}
                onClick={() => setSelectedWeek(week)}
                className={`transition-all duration-300 font-bold text-xs ${
                  week === selectedWeek
                    ? 'px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-full shadow-lg shadow-cyan-500/20'
                    : 'px-3 py-1.5 bg-slate-800/80 text-slate-400 rounded-full hover:bg-slate-700 hover:text-white'
                }`}
              >
                Week {week}
              </button>
            ))}
          </div>
        </div>

        {/* ═══════════════ DAILY MEAL CARDS ═══════════════ */}
        <div className="space-y-6">
          {weekDays.map((day, index) => {
            const dayProgress = getDayProgress(day);
            const isFullyComplete = dayProgress === 100;
            const dayName = getDayNameForDay(day);

            return (
              <div
                key={day}
                className="glass-dark rounded-2xl border border-white/10 overflow-hidden shadow-xl"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                {/* Day Header */}
                <div className={`bg-gradient-to-r ${isFullyComplete ? 'from-green-600 via-emerald-600 to-teal-600' : 'from-cyan-600 via-purple-600 to-pink-600'} p-4 sm:p-6`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center">
                        {isFullyComplete ? (
                          <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                        ) : (
                          <span className="text-xl sm:text-2xl font-black text-white">{day}</span>
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-black text-white">
                          Day {day} <span className="text-white/80 text-base font-medium">· {dayName}</span>
                        </h3>
                        <p className="text-white/70 text-xs sm:text-sm font-medium">
                          {isFullyComplete ? '✨ All meals completed!' : 'Track your meals for today'}
                        </p>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl sm:text-4xl font-black text-white">{Math.round(dayProgress)}%</div>
                      <div className="text-white/60 text-xs font-semibold hidden sm:block">Complete</div>
                    </div>
                  </div>
                  <div className="mt-3 sm:mt-4 bg-white/20 rounded-full h-2 sm:h-2.5 overflow-hidden">
                    <div className="bg-white h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${dayProgress}%` }}></div>
                  </div>
                </div>

                {/* Meals Grid */}
                <div className="p-3 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {getMealTypesForDay(day).map((mealType) => {
                    const meal = getMealForDay(day, mealType);
                    const isCompleted = isMealCompleted(day, mealType);
                    const isToggling = isMealToggling(day, mealType);
                    const imageUrl = meal.image || getMealImage(mealType, meal.name);

                    return (
                      <div
                        key={mealType}
                        className={`relative bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-300 ${
                          isToggling ? 'opacity-70 cursor-wait' : 'cursor-pointer hover:shadow-xl group'
                        } ${
                          isCompleted ? 'ring-3 ring-green-500/40' : 'hover:shadow-cyan-500/10'
                        }`}
                        onClick={() => toggleMealComplete(day, mealType)}
                      >

                        {/* Image */}
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <img
                            src={imageUrl}
                            alt={meal.name}
                            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${isCompleted ? 'opacity-60 saturate-50' : ''}`}
                            loading="lazy"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = SLOT_DEFAULTS[mealType] || SLOT_DEFAULTS.lunch;
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>

                          {/* Checkbox */}
                          <div className="absolute top-2.5 right-2.5">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
                              isCompleted ? 'bg-green-500 scale-110' : 'bg-white/80 backdrop-blur-sm border-2 border-white/50 group-hover:bg-white'
                            }`}>
                              {isCompleted && <Check className="w-5 h-5 text-white" />}
                            </div>
                          </div>

                          {/* Meal Type Badge */}
                          <div className="absolute top-2.5 left-2.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/10">
                            <span className="text-sm">{mealEmojis[mealType]}</span>
                            <span className="text-[11px] font-bold text-white capitalize tracking-wide">{mealType}</span>
                          </div>

                          {/* Completed Overlay */}
                          {isCompleted && (
                            <div className="absolute inset-0 bg-green-500/10 flex items-center justify-center">
                              <div className="w-16 h-16 bg-green-500/90 rounded-full flex items-center justify-center shadow-2xl">
                                <Check className="w-9 h-9 text-white" />
                              </div>
                            </div>
                          )}

                          {/* Nutrition Badges */}
                          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center gap-2">
                            <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                              <Flame className="w-3.5 h-3.5 text-orange-400" />
                              <span className="text-xs font-bold text-white">{meal.calories} cal</span>
                            </div>
                            <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                              <Zap className="w-3.5 h-3.5 text-yellow-400" />
                              <span className="text-xs font-bold text-white">{meal.protein}g</span>
                            </div>
                          </div>
                        </div>

                        {/* Caption */}
                        <div className="p-3 sm:p-3.5">
                          <h4 className={`font-bold text-[13px] leading-snug text-gray-900 mb-2 line-clamp-2 ${isCompleted ? 'line-through opacity-50' : ''}`}>
                            {meal.name}
                          </h4>
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-gray-400 font-medium">Day {day}</span>
                            <span className={`text-[11px] font-bold ${isCompleted ? 'text-green-500' : 'text-gray-400'}`}>
                              {isCompleted ? '✓ Done' : 'Tap to mark'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* ═══════════════ NUTRITION TIPS ═══════════════ */}
        {dietData?.tips && (
          <div className="glass-dark p-6 sm:p-8 rounded-2xl border border-white/10 shadow-xl mt-8">
            <h3 className="text-xl sm:text-2xl font-black text-white mb-5 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              Personalized Nutrition Tips
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {dietData.tips.map((tip, index) => (
                <div key={index} className="flex items-start gap-3 p-3 sm:p-4 bg-slate-800/50 rounded-xl border border-white/5 hover:border-cyan-500/20 transition-all">
                  <div className="w-7 h-7 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white font-bold text-xs">{index + 1}</span>
                  </div>
                  <span className="text-slate-300 text-sm leading-relaxed">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════ GOAL ACHIEVEMENT BANNER ═══════════════ */}
        {getDaysCompleted() === planDurationDays && planDurationDays > 0 && (
          <div className="glass-dark p-8 rounded-2xl border-2 border-green-500 shadow-2xl shadow-green-500/20 mt-8 text-center">
            <div className="text-6xl mb-4">🎉🏆🎉</div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">Congratulations!</h2>
            <p className="text-lg sm:text-xl text-green-400 font-semibold mb-4">
              You've completed all {planDurationDays} days of your meal plan!
            </p>
            <p className="text-slate-300">
              Amazing dedication! You're one step closer to your fitness goals. Keep going! 💪
            </p>
          </div>
        )}
      </div>

      {/* Click-away overlay for duration picker */}
      {showDurationPicker && (
        <div className="fixed inset-0 z-40" onClick={() => setShowDurationPicker(false)}></div>
      )}
    </div>
  );
};

export default DietPlan;
