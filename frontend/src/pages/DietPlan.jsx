import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  Check,
  Target,
  Flame,
  ChevronLeft,
  ChevronRight,
  Award,
  Zap,
  Calendar,
  Settings,
  Sparkles,
  RefreshCw,
  RotateCcw,
  Lock,
} from 'lucide-react';

import { resolveMealImage, SLOT_DEFAULTS } from '../utils/mealImageResolver';
import { Button, Card, Badge, Skeleton, AnimatedCounter } from '../components/ui';
import { PageContainer } from '../components/PageContainer';

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

  // Completed meals tracking
  const [completedMeals, setCompletedMeals] = useState(new Set());
  const [togglingMeals, setTogglingMeals] = useState(new Set());

  // Per-user duration storage key
  const getDurationKey = useCallback(() => {
    const userId = user?._id || user?.id || 'guest';
    return `nutrigenie_plan_duration_${userId}`;
  }, [user]);

  // Per-user completed meals storage key
  const getMealsStorageKey = useCallback(() => {
    const userId = user?._id || user?.id || 'guest';
    return `nutrigenie_completed_meals_${userId}`;
  }, [user]);

  // Read stored meals immediately on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(getMealsStorageKey());
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCompletedMeals(new Set(parsed));
        }
      }
    } catch (e) {}
  }, [getMealsStorageKey]);

  const syncCompletedMeals = useCallback((mealsArrayOrSet) => {
    const arr = Array.isArray(mealsArrayOrSet) ? mealsArrayOrSet : Array.from(mealsArrayOrSet || []);
    setCompletedMeals((prev) => {
      const merged = new Set([...prev, ...arr]);
      try {
        localStorage.setItem(getMealsStorageKey(), JSON.stringify(Array.from(merged)));
      } catch (e) {}
      return merged;
    });
  }, [getMealsStorageKey]);

  useEffect(() => {
    if (!dietData) return;
    const list = Array.isArray(dietData.completedMealsList)
      ? dietData.completedMealsList
      : Array.isArray(dietData.completedMeals)
      ? dietData.completedMeals
      : Array.isArray(dietData.plan?.completedMeals)
      ? dietData.plan.completedMeals
      : [];
    if (list.length > 0) {
      syncCompletedMeals(list);
    }
  }, [dietData, syncCompletedMeals]);

  const fetchDietPlan = useCallback(
    async (forceRegen = false, targetWeeks = null, targetDays = null, targetUnit = null) => {
      setLoading(true);
      setError(null);

      try {
        const weeks = targetWeeks || user?.planDurationWeeks || 4;
        const days = targetDays || (targetWeeks ? targetWeeks * 7 : user?.planDurationDays || 28);
        const unit = targetUnit || user?.durationUnit || 'weeks';

        if (!forceRegen) {
          try {
            const cachedRes = await axios.get(
              `http://localhost:3001/api/diet/cached?weeks=${weeks}&days=${days}&unit=${unit}`
            );
            if (
              cachedRes.data.hasCachedPlan &&
              cachedRes.data.plan &&
              cachedRes.data.plan.weeks?.length > 0
            ) {
              setDietData(cachedRes.data);
              const activeWeeks = cachedRes.data.planDurationWeeks || weeks;
              const activeDays = cachedRes.data.planDurationDays || activeWeeks * 7;
              setPlanDurationWeeks(activeWeeks);
              setPlanDurationDays(activeDays);
              setDurationUnit(cachedRes.data.durationUnit || unit);
              setLoading(false);
              return;
            }
          } catch (cacheErr) {
            console.warn('[DietPlan] Cache check failed, continuing to generate:', cacheErr.message);
          }
        }

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

          if (genRes.data && genRes.data.plan) {
            setDietData(genRes.data);
            const activeWeeks = genRes.data.planDurationWeeks || weeks;
            const activeDays = genRes.data.planDurationDays || activeWeeks * 7;
            setPlanDurationWeeks(activeWeeks);
            setPlanDurationDays(activeDays);
            setDurationUnit(genRes.data.durationUnit || unit);
            setLoading(false);
            setGenerating(false);
            return;
          }
        } catch (genErr) {
          console.warn('[DietPlan] Generation failed, trying fallback to any cached plan:', genErr.message);
        }

        try {
          const fallbackRes = await axios.get('http://localhost:3001/api/diet/cached');
          if (fallbackRes.data.hasCachedPlan && fallbackRes.data.plan) {
            setDietData(fallbackRes.data);
            const activeWeeks = fallbackRes.data.planDurationWeeks || 4;
            setPlanDurationWeeks(activeWeeks);
            setPlanDurationDays(fallbackRes.data.planDurationDays || activeWeeks * 7);
            setDurationUnit(fallbackRes.data.durationUnit || 'weeks');
            setLoading(false);
            setGenerating(false);
            return;
          }
        } catch (fbErr) {
          console.error('[DietPlan] Fallback fetch also failed:', fbErr.message);
        }

        setError('Unable to load or generate meal plan. Please try again.');
      } catch (err) {
        console.error('[DietPlan] Unexpected error:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load meal plan.');
      } finally {
        setLoading(false);
        setGenerating(false);
      }
    },
    [user]
  );

  useEffect(() => {
    fetchDietPlan();
  }, [fetchDietPlan]);

  const changeDuration = async (preset) => {
    setShowDurationPicker(false);
    setPlanDurationWeeks(preset.weeks);
    setPlanDurationDays(preset.days);
    setDurationUnit(preset.unit);
    setSelectedWeek(1);
    localStorage.setItem(getDurationKey(), String(preset.days));
    await fetchDietPlan(false, preset.weeks, preset.days, preset.unit);
  };

  const handleCustomDurationSubmit = async () => {
    const days = parseInt(customDaysInput, 10);
    if (!days || days < 1 || days > 90) {
      alert('Please enter a valid duration between 1 and 90 days.');
      return;
    }
    const weeks = Math.max(1, Math.min(12, Math.ceil(days / 7)));
    setShowDurationPicker(false);
    setPlanDurationWeeks(weeks);
    setPlanDurationDays(days);
    setDurationUnit('days');
    setSelectedWeek(1);
    localStorage.setItem(getDurationKey(), String(days));
    await fetchDietPlan(false, weeks, days, 'days');
  };

  const getMealForDay = (day, mealType) => {
    const plan = dietData?.plan || dietData?.mealPlan;
    if (!plan) return null;

    if (plan.weeks && plan.weeks.length > 0) {
      const weekIndex = Math.floor((day - 1) / 7);
      const dayInWeek = ((day - 1) % 7) + 1;
      const week = plan.weeks[weekIndex] || plan.weeks[weekIndex % plan.weeks.length] || plan.weeks[0];
      if (week && Array.isArray(week.days)) {
        const dayData =
          week.days.find((d) => d.day === dayInWeek || d.dayNumber === dayInWeek) ||
          week.days[dayInWeek - 1] ||
          week.days[0];
        if (dayData && dayData.meals && dayData.meals[mealType]) {
          return dayData.meals[mealType];
        }
      }
    }

    if (plan[mealType]) return plan[mealType];

    return {
      name: `${mealType.charAt(0).toUpperCase() + mealType.slice(1)} Dish`,
      calories: 400,
      protein: 20,
      carbs: 45,
      fats: 15,
      description: 'Healthy wholesome Indian balanced meal',
    };
  };

  const getMealTypesForDay = (day) => {
    return ['breakfast', 'lunch', 'dinner', 'snacks'];
  };

  const rawStartDate = dietData?.startDate || dietData?.planStartDate || user?.planStartDate;
  const planStartDate = useMemo(() => {
    return rawStartDate ? new Date(rawStartDate) : new Date();
  }, [rawStartDate]);

  const getDayCalendarDate = useCallback(
    (dayNumber) => {
      const base = new Date(planStartDate);
      base.setHours(0, 0, 0, 0);
      const d = new Date(base);
      d.setDate(base.getDate() + (dayNumber - 1));
      return d;
    },
    [planStartDate]
  );

  const getDayStatus = useCallback(
    (dayNumber) => {
      const dayDate = getDayCalendarDate(dayNumber);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const targetTime = dayDate.getTime();
      const todayTime = today.getTime();

      if (targetTime === todayTime) {
        return { status: 'today', date: dayDate };
      }
      if (targetTime > todayTime) {
        return { status: 'future', date: dayDate };
      }
      return { status: 'past', date: dayDate };
    },
    [getDayCalendarDate]
  );

  const isMealCompleted = (day, mealType) => {
    return completedMeals.has(`day${day}-${mealType}`);
  };

  const isMealToggling = (day, mealType) => {
    return togglingMeals.has(`day${day}-${mealType}`);
  };

  const toggleMealComplete = async (day, mealType) => {
    const { status: dayStatus } = getDayStatus(day);
    if (dayStatus !== 'today') {
      // Interactivity gated: only today is markable
      return;
    }

    const key = `day${day}-${mealType}`;
    if (togglingMeals.has(key)) return;

    setTogglingMeals((prev) => new Set(prev).add(key));
    const wasCompleted = completedMeals.has(key);

    setCompletedMeals((prev) => {
      const s = new Set(prev);
      if (wasCompleted) s.delete(key);
      else s.add(key);
      try {
        localStorage.setItem(getMealsStorageKey(), JSON.stringify(Array.from(s)));
      } catch (e) {}
      return s;
    });

    try {
      const res = await axios.post('http://localhost:3001/api/diet/toggle-meal', {
        key,
        mealId: mealType,
        dayId: day,
        completed: !wasCompleted,
        clientDate: new Date().toISOString(),
      });

      const serverList = Array.isArray(res.data.completedMealsList)
        ? res.data.completedMealsList
        : Array.isArray(res.data.completedMeals)
        ? res.data.completedMeals
        : null;

      if (serverList) {
        syncCompletedMeals(serverList);
        setDietData((prev) => (prev ? { ...prev, completedMeals: serverList } : prev));
      }
    } catch (err) {
      console.warn('[DietPlan] Background sync for meal completion warning:', err.message);
    } finally {
      setTogglingMeals((prev) => {
        const s = new Set(prev);
        s.delete(key);
        return s;
      });
    }
  };

  const getDayProgress = (day) => {
    const mealTypes = getMealTypesForDay(day);
    if (mealTypes.length === 0) return 0;
    const done = mealTypes.filter((mt) => isMealCompleted(day, mt)).length;
    return (done / mealTypes.length) * 100;
  };

  const getOverallProgress = () => {
    if (planDurationDays === 0) return 0;
    let total = 0;
    let done = 0;
    for (let day = 1; day <= planDurationDays; day++) {
      const mealTypes = getMealTypesForDay(day);
      total += mealTypes.length;
      done += mealTypes.filter((mt) => isMealCompleted(day, mt)).length;
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

  const handleReset = async () => {
    if (
      !window.confirm(
        'Are you sure you want to reset your meal progress? Your custom meal plan will remain intact.'
      )
    )
      return;
    setCompletedMeals(new Set());
    try {
      localStorage.removeItem(getMealsStorageKey());
    } catch (e) {}
    try {
      const res = await axios.post('http://localhost:3001/api/diet/reset');
      if (res.data?.startDate) {
        setDietData((prev) =>
          prev ? { ...prev, startDate: res.data.startDate, planStartDate: res.data.startDate, completedMeals: [] } : prev
        );
      }
    } catch (err) {
      console.warn('[DietPlan] Reset background sync warning:', err.message);
    }
  };

  const totalWeeks = planDurationWeeks || Math.ceil(planDurationDays / 7);
  const weekDays = Array.from(
    { length: 7 },
    (_, i) => (selectedWeek - 1) * 7 + i + 1
  ).filter((d) => d <= planDurationDays);
  const overallProgress = getOverallProgress();
  const daysCompleted = getDaysCompleted();

  if (loading || generating) {
    return (
      <PageContainer className="py-16 text-center space-y-8">
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-indigo-600 p-[2px]"
          >
            <div className="w-full h-full bg-white dark:bg-[#090D16] rounded-3xl" />
          </motion.div>
          <Sparkles className="w-8 h-8 text-cyan-500 animate-pulse" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {generating ? 'Crafting Your Indian Meal Plan...' : 'Loading Your Diet Hub...'}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            Gemini AI is balancing macros and authentic recipes for your {planDurationWeeks}-week journey.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 pt-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <Card className="p-8 border-rose-500/30">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-4">
            <RefreshCw className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Unable to Load Plan
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
            {error}
          </p>
          <Button
            onClick={() => fetchDietPlan(true)}
            variant="primary"
            size="md"
            leftIcon={RefreshCw}
            className="w-full justify-center"
          >
            Retry Generation
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <PageContainer className="py-10 sm:py-12 lg:py-16 space-y-10 sm:space-y-12">
      {/* ─── HEADER ────────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="brand" size="sm">
              AI Nutrition Engine
            </Badge>
            <Badge variant="accent" size="sm">
              {user?.dietaryPreference?.replace('_', ' ') || 'Vegetarian'}
            </Badge>
            <span className="text-xs text-slate-400 hidden sm:inline">
              • {dietData?.generationSource === 'fallback' ? 'Smart Database' : 'Gemini 1.5 Pro'}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Your Indian Meal Plan 🍽️
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Nutritional breakdown customized to your taste, metabolic rate, and daily target.
          </p>
        </div>

        {/* Duration Control & Customization */}
        <div className="flex flex-wrap items-center gap-3 relative">
          <button
            type="button"
            onClick={() => setShowDurationPicker(!showDurationPicker)}
            className="glass-panel px-4 py-2.5 rounded-2xl flex items-center gap-3 border border-slate-200/80 dark:border-white/10 hover:border-cyan-500/40 transition-colors cursor-pointer"
          >
            <div className="text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Duration
              </span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                {durationUnit === 'days' && planDurationDays === 30
                  ? '30 Days'
                  : `${planDurationWeeks} Weeks`}
              </span>
            </div>
            <Settings className="w-4 h-4 text-slate-400" />
          </button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => fetchDietPlan(true)}
            leftIcon={Sparkles}
          >
            Regenerate
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            leftIcon={RotateCcw}
            className="text-xs"
          >
            Reset
          </Button>

          {/* Duration dropdown */}
          <AnimatePresence>
            {showDurationPicker && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 z-50 w-72 glass-panel dark:bg-slate-900/95 rounded-2xl p-4 shadow-2xl border border-slate-200 dark:border-white/10 space-y-2"
              >
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Select Duration Preset
                </p>
                {DURATION_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => changeDuration(p)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      planDurationWeeks === p.weeks && durationUnit === p.unit
                        ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                  >
                    <span>
                      {p.icon} {p.label}
                    </span>
                    <span className="text-[10px] text-slate-400">{p.days} days</span>
                  </button>
                ))}

                <div className="pt-2 border-t border-slate-200 dark:border-white/10 mt-2">
                  <span className="text-[11px] font-medium text-slate-500 block mb-1">
                    Custom Days (1-90)
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="1"
                      max="90"
                      placeholder="e.g. 45"
                      value={customDaysInput}
                      onChange={(e) => setCustomDaysInput(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                    />
                    <Button size="sm" onClick={handleCustomDurationSubmit}>
                      Set
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ─── PROGRESS GAUGES ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        <Card className="p-6 sm:p-7">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Plan Adherence
            </span>
            <Target className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            <AnimatedCounter value={overallProgress} suffix="%" />
          </div>
          <div className="mt-2.5 w-full bg-slate-200/80 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </Card>

        <Card className="p-6 sm:p-7">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Days Completed
            </span>
            <Calendar className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            <AnimatedCounter value={daysCompleted} />
            <span className="text-sm font-semibold text-slate-400"> / {planDurationDays}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">100% meal mark-off</p>
        </Card>

        <Card className="p-6 sm:p-7">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Daily Target
            </span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            <AnimatedCounter value={dietData?.metrics?.targetCalories || 1800} suffix=" kcal" />
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">Calculated calorie budget</p>
        </Card>

        <Card className="p-6 sm:p-7">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Meals Logged
            </span>
            <Award className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            <AnimatedCounter value={completedMeals.size} />
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">Individual slot check-offs</p>
        </Card>
      </div>

      {/* ─── WEEK SELECTOR BAR ─────────────────────────────────────────── */}
      <Card className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSelectedWeek(Math.max(1, selectedWeek - 1))}
            disabled={selectedWeek === 1}
            aria-label="Previous week"
            className="p-2 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          </button>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Week {selectedWeek} of {totalWeeks}
            </h2>
            <p className="text-xs text-slate-400">
              Days {(selectedWeek - 1) * 7 + 1} – {Math.min(selectedWeek * 7, planDurationDays)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSelectedWeek(Math.min(totalWeeks, selectedWeek + 1))}
            disabled={selectedWeek >= totalWeeks}
            aria-label="Next week"
            className="p-2 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          </button>
        </div>

        {/* Week Pill Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {Array.from({ length: totalWeeks }, (_, i) => i + 1).map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => setSelectedWeek(w)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                w === selectedWeek
                  ? 'bg-cyan-500 text-white shadow-sm shadow-cyan-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              W{w}
            </button>
          ))}
        </div>
      </Card>

      {/* ─── DAILY MEALS LIST ──────────────────────────────────────────── */}
      <div className="space-y-8 sm:space-y-10">
        {weekDays.map((day) => {
          const dayProgress = getDayProgress(day);
          const isFullyComplete = dayProgress === 100;
          const { status: dayStatus, date: dayCalendarDate } = getDayStatus(day);
          const isToday = dayStatus === 'today';
          const isFuture = dayStatus === 'future';
          const isPast = dayStatus === 'past';

          const formattedDate = dayCalendarDate.toLocaleDateString('en-IN', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
          });

          return (
            <motion.div
              key={day}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden">
                {/* Day Header Banner */}
                <div
                  className={`p-5 sm:p-6 flex items-center justify-between ${
                    isFullyComplete
                      ? 'bg-emerald-500/10 border-b border-emerald-500/20'
                      : isFuture
                      ? 'bg-slate-100/30 dark:bg-slate-800/20 border-b border-slate-200/50 dark:border-white/5 opacity-85'
                      : 'bg-slate-100/60 dark:bg-slate-800/40 border-b border-slate-200/80 dark:border-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${
                        isFullyComplete
                          ? 'bg-emerald-500 text-white'
                          : isFuture
                          ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                          : 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400'
                      }`}
                    >
                      {isFullyComplete ? (
                        <Check className="w-5 h-5" />
                      ) : isFuture ? (
                        <Lock className="w-4 h-4" />
                      ) : (
                        `D${day}`
                      )}
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>Day {day}</span>
                        <span className="text-xs font-medium text-slate-400">• {formattedDate}</span>
                        {isToday && (
                          <Badge variant="accent" size="sm">
                            Today
                          </Badge>
                        )}
                        {isFuture && (
                          <Badge variant="secondary" size="sm" className="opacity-75">
                            Upcoming
                          </Badge>
                        )}
                        {isPast && (
                          <Badge variant="secondary" size="sm" className="opacity-60">
                            Past
                          </Badge>
                        )}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {isToday
                          ? isFullyComplete
                            ? '✨ All meal slots completed!'
                            : 'Tap on meal cards below to log'
                          : isFuture
                          ? `🔒 Unlocks on ${formattedDate}`
                          : isFullyComplete
                          ? '✨ All meal slots completed'
                          : 'Past day • Read-only'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {Math.round(dayProgress)}%
                    </span>
                    <div className="w-20 hidden sm:block bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${dayProgress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* 4 Meal Slots Grid */}
                <div className="p-6 sm:p-7 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                  {getMealTypesForDay(day).map((mealType) => {
                    const meal = getMealForDay(day, mealType);
                    const isCompleted = isMealCompleted(day, mealType);
                    const isToggling = isMealToggling(day, mealType);
                    const imageUrl = meal?.image || getMealImage(mealType, meal?.name);

                    // Dynamic styling based on today vs future vs past
                    let cardClasses = 'group relative rounded-2xl overflow-hidden border transition-all ';
                    if (isFuture) {
                      cardClasses +=
                        'opacity-55 grayscale-[25%] bg-slate-50/50 dark:bg-slate-900/40 border-dashed border-slate-300 dark:border-white/10 cursor-not-allowed select-none';
                    } else if (isPast) {
                      cardClasses += isCompleted
                        ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-500/30 cursor-default select-none'
                        : 'bg-slate-50/70 dark:bg-slate-900/60 border-slate-200/70 dark:border-white/10 cursor-default select-none';
                    } else {
                      // isToday
                      cardClasses += isCompleted
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/40 ring-1 ring-emerald-500/30 cursor-pointer'
                        : 'bg-white dark:bg-slate-900/80 border-slate-200/80 dark:border-white/10 hover:border-cyan-500/40 shadow-sm cursor-pointer';
                    }

                    if (isToggling) cardClasses += ' opacity-60 cursor-wait';

                    return (
                      <motion.div
                        key={mealType}
                        whileHover={isToday ? { y: -3 } : undefined}
                        whileTap={isToday ? { scale: 0.98 } : undefined}
                        onClick={isToday ? () => toggleMealComplete(day, mealType) : undefined}
                        className={cardClasses}
                      >
                        {/* Food Image Container */}
                        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                          <img
                            src={imageUrl}
                            alt={meal?.name}
                            className={`w-full h-full object-cover transition-transform duration-500 ${
                              isToday ? 'group-hover:scale-105' : ''
                            } ${isCompleted ? 'saturate-75 opacity-70' : ''}`}
                            loading="lazy"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = SLOT_DEFAULTS[mealType] || SLOT_DEFAULTS.lunch;
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                          {/* Future locked overlay */}
                          {isFuture && (
                            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
                              <span className="px-2.5 py-1 rounded-full bg-slate-900/80 text-white text-[11px] font-bold flex items-center gap-1.5 border border-white/10 shadow-lg">
                                <Lock className="w-3 h-3 text-amber-400" />
                                Locked
                              </span>
                            </div>
                          )}

                          {/* Meal Type Pill */}
                          <div className="absolute top-2.5 left-2.5">
                            <span className="px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-md text-[11px] font-bold text-white flex items-center gap-1 border border-white/15">
                              <span>{mealEmojis[mealType]}</span>
                              <span className="capitalize">{mealType}</span>
                            </span>
                          </div>

                          {/* Completion Checkmark Badge */}
                          <div className="absolute top-2.5 right-2.5">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all shadow-md ${
                                isCompleted
                                  ? 'bg-emerald-500 text-white'
                                  : isFuture
                                  ? 'bg-slate-900/60 text-slate-500 border border-white/10'
                                  : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-400 group-hover:text-cyan-500 border border-slate-200 dark:border-white/20'
                              }`}
                            >
                              <Check className="w-4 h-4" />
                            </div>
                          </div>

                          {/* Calorie & Protein Chips */}
                          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center gap-1.5 text-[11px] font-bold text-white">
                            <span className="px-2 py-0.5 rounded-md bg-slate-950/60 backdrop-blur-sm flex items-center gap-1">
                              <Flame className="w-3 h-3 text-amber-400" />
                              {meal?.calories || 400} kcal
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-slate-950/60 backdrop-blur-sm flex items-center gap-1">
                              <Zap className="w-3 h-3 text-cyan-400" />
                              {meal?.protein || 20}g P
                            </span>
                          </div>
                        </div>

                        {/* Meal Details */}
                        <div className="p-4 sm:p-5 space-y-2">
                          <h4
                            className={`text-xs sm:text-sm font-bold leading-snug line-clamp-2 ${
                              isCompleted
                                ? 'line-through text-slate-400 dark:text-slate-500'
                                : isToday
                                ? 'text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400'
                                : 'text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {meal?.name}
                          </h4>

                          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                            <span>Carbs: {meal?.carbs || 45}g</span>
                            <span
                              className={`font-semibold ${
                                isCompleted
                                  ? 'text-emerald-500'
                                  : isFuture
                                  ? 'text-amber-500/90 dark:text-amber-400/90'
                                  : isToday
                                  ? 'text-cyan-600 dark:text-cyan-400'
                                  : 'text-slate-400'
                              }`}
                            >
                              {isCompleted
                                ? '✓ Completed'
                                : isFuture
                                ? `Unlocks on ${dayCalendarDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}`
                                : isToday
                                ? 'Tap to log'
                                : 'Not logged'}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Click-away overlay for duration popup */}
      {showDurationPicker && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDurationPicker(false)}
          aria-hidden="true"
        />
      )}
    </PageContainer>
  );
};

export default DietPlan;
