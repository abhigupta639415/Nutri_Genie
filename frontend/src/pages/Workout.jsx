import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dumbbell,
  Heart,
  Flame,
  TrendingUp,
  RefreshCw,
  CheckCircle2,
  Circle,
  Calendar,
  Clock,
  Target,
  Zap,
  Check,
  Lock,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Smile,
} from 'lucide-react';
import { fatLossWorkouts } from '../data/fatLossWorkouts';
import { muscleGainWorkouts } from '../data/muscleGainWorkouts';
import { stayFitWorkouts } from '../data/stayFitWorkouts';
import { useAuth } from '../context/AuthContext';
import { Button, Card, Badge, AnimatedCounter, Skeleton } from '../components/ui';
import { PageContainer } from '../components/PageContainer';

const Workout = () => {
  const { user } = useAuth();
  const [selectedGoal, setSelectedGoal] = useState('fatLoss');
  const [selectedLevel, setSelectedLevel] = useState('beginner');
  const [workoutPlan, setWorkoutPlan] = useState([]);
  const [completedDays, setCompletedDays] = useState({});
  const [planKey, setPlanKey] = useState(0);
  const [serverStartDate, setServerStartDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [togglingDay, setTogglingDay] = useState(null);

  // Synchronized multi-week plan duration
  const [planDurationWeeks, setPlanDurationWeeks] = useState(4);
  const [planDurationDays, setPlanDurationDays] = useState(28);
  const [selectedWeek, setSelectedWeek] = useState(1);

  const allWorkouts = useMemo(() => ({
    fatLoss: fatLossWorkouts,
    muscleGain: muscleGainWorkouts,
    stayFit: stayFitWorkouts,
  }), []);

  const goalOptions = [
    { value: 'fatLoss', label: 'Fat Loss', icon: Flame, color: 'from-amber-500 to-rose-600' },
    { value: 'muscleGain', label: 'Muscle Gain', icon: Dumbbell, color: 'from-cyan-500 to-indigo-600' },
    { value: 'stayFit', label: 'Stay Fit & Toned', icon: Heart, color: 'from-emerald-500 to-teal-600' },
  ];

  const levelOptions = [
    { value: 'beginner', label: 'Beginner', badge: 'accent' },
    { value: 'intermediate', label: 'Intermediate', badge: 'brand' },
    { value: 'advanced', label: 'Advanced', badge: 'purple' },
  ];

  const typeBadges = {
    yoga: 'purple',
    cardio: 'warning',
    hiit: 'danger',
    strength: 'brand',
    rest: 'neutral',
  };

  const typeIcons = {
    yoga: Heart,
    cardio: Zap,
    hiit: Flame,
    strength: Dumbbell,
    rest: Calendar,
  };

  // Base plan anchor date
  const getPlanAnchorDate = useCallback(() => {
    if (serverStartDate) {
      const s = new Date(serverStartDate);
      s.setHours(0, 0, 0, 0);
      return s;
    }
    const raw = user?.planStartDate || user?.createdAt;
    const d = raw ? new Date(raw) : new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, [serverStartDate, user?.planStartDate, user?.createdAt]);

  // Determine calendar date and locked status for any absolute day (1..N)
  const getDayInfo = useCallback(
    (dayNum) => {
      const anchor = getPlanAnchorDate();
      const date = new Date(anchor);
      date.setDate(anchor.getDate() + (dayNum - 1));
      date.setHours(0, 0, 0, 0);

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      today.setHours(0, 0, 0, 0);

      const diffTime = date.getTime() - today.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      let status = 'past';
      if (diffDays === 0) status = 'today';
      else if (diffDays > 0) status = 'future';

      const isSunday = date.getDay() === 0;

      const formattedDate = date.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      });

      return {
        status,
        isLocked: status === 'future',
        isToday: status === 'today',
        isPast: status === 'past',
        isSunday,
        date,
        dateString: date.toISOString(),
        formattedDate,
      };
    },
    [getPlanAnchorDate]
  );

  // Storage key for user completed days cache
  const getStorageKey = useCallback(() => {
    const anchor = getPlanAnchorDate();
    const anchorStr = anchor.toISOString().split('T')[0];
    const userId = user?._id || user?.id || 'guest';
    return `workout_${userId}_${selectedGoal}_${selectedLevel}_${planDurationDays}_${anchorStr}_${planKey}`;
  }, [getPlanAnchorDate, user?._id, user?.id, selectedGoal, selectedLevel, planDurationDays, planKey]);

  // Client-side fallback generator matching backend logic
  const generateClientFallbackPlan = useCallback(
    (targetWeeks, targetDays, anchorDate) => {
      const routinesObj = allWorkouts[selectedGoal]?.[selectedLevel] || allWorkouts.fatLoss.beginner;
      // Filter active workouts (excluding any hardcoded day 7 rest from legacy files)
      const activeTemplates = routinesObj.filter((r) => !r.isRestDay && r.type !== 'rest');
      const templatesToUse = activeTemplates.length > 0 ? activeTemplates : routinesObj;

      const totalD = targetDays || targetWeeks * 7 || 28;
      const totalW = targetWeeks || Math.ceil(totalD / 7) || 4;
      const days = [];
      let routineIdx = 0;

      for (let i = 0; i < totalD; i++) {
        const dayNum = i + 1;
        const weekNum = Math.floor(i / 7) + 1;
        const d = new Date(anchorDate);
        d.setDate(anchorDate.getDate() + i);
        d.setHours(0, 0, 0, 0);

        const isSunday = d.getDay() === 0;

        if (isSunday) {
          days.push({
            day: dayNum,
            week: weekNum,
            date: d,
            name: 'Active Recovery & Rest',
            type: 'rest',
            isRestDay: true,
            duration: '0 min',
            caloriesBurned: 0,
            exercises: [],
          });
        } else {
          const tpl = templatesToUse[routineIdx % templatesToUse.length];
          routineIdx++;
          days.push({
            day: dayNum,
            week: weekNum,
            date: d,
            name: tpl.name,
            type: tpl.type || 'strength',
            isRestDay: false,
            duration: tpl.duration || '40 min',
            caloriesBurned: tpl.caloriesBurned || 280,
            exercises: tpl.exercises || [],
          });
        }
      }

      return { days, totalWeeks: totalW, totalDays: totalD };
    },
    [allWorkouts, selectedGoal, selectedLevel]
  );

  // Fetch plan from backend with sync to diet plan duration
  const loadPlan = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

    // Check stored duration preset from diet plan if available
    const userId = user?._id || user?.id || 'guest';
    const storedDurationDays = localStorage.getItem(`nutrigenie_plan_duration_${userId}`);
    const durationParam = storedDurationDays ? `&days=${storedDurationDays}` : '';

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/workout/plan?goal=${selectedGoal}&level=${selectedLevel}${durationParam}`,
        { headers: authHeaders }
      );

      if (res.data?.days && res.data.days.length > 0) {
        setWorkoutPlan(res.data.days);
        if (res.data.planDurationWeeks) setPlanDurationWeeks(res.data.planDurationWeeks);
        if (res.data.planDurationDays) setPlanDurationDays(res.data.planDurationDays);
        if (res.data.startDate) setServerStartDate(res.data.startDate);
      } else {
        throw new Error('No workout days returned from server');
      }
    } catch (err) {
      console.warn('Backend plan fetch failed, generating client fallback:', err.message);
      const anchor = getPlanAnchorDate();
      const fallbackDays = parseInt(storedDurationDays, 10) || user?.planDurationDays || 28;
      const fallbackWeeks = Math.ceil(fallbackDays / 7) || 4;
      const generated = generateClientFallbackPlan(fallbackWeeks, fallbackDays, anchor);
      setWorkoutPlan(generated.days);
      setPlanDurationWeeks(generated.totalWeeks);
      setPlanDurationDays(generated.totalDays);
    } finally {
      setLoading(false);
    }
  }, [selectedGoal, selectedLevel, user, getPlanAnchorDate, generateClientFallbackPlan]);

  // Sync week completion status and set active week
  const syncStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/workout/week-status`, {
        headers: authHeaders,
      });

      if (res.data?.startDate || res.data?.planStartDate) {
        setServerStartDate(res.data.startDate || res.data.planStartDate);
      }
      if (res.data?.planDurationWeeks) {
        setPlanDurationWeeks(res.data.planDurationWeeks);
      }
      if (res.data?.planDurationDays) {
        setPlanDurationDays(res.data.planDurationDays);
      }
      if (res.data?.currentWeek) {
        setSelectedWeek((prev) => (prev === 1 ? res.data.currentWeek : prev));
      }
      if (res.data?.completedDays) {
        setCompletedDays((prev) => {
          const merged = { ...prev, ...res.data.completedDays };
          try {
            const key = getStorageKey();
            localStorage.setItem(key, JSON.stringify(merged));
          } catch (e) {}
          return merged;
        });
      }
    } catch (err) {
      console.warn('Could not sync workout status with server:', err.message);
    }
  }, [getStorageKey]);

  // Initial load and reaction to goal/level changes
  useEffect(() => {
    try {
      const key = getStorageKey();
      const saved = localStorage.getItem(key);
      if (saved) setCompletedDays(JSON.parse(saved));
    } catch (e) {}

    loadPlan();
    syncStatus();
  }, [loadPlan, syncStatus, getStorageKey]);

  // Toggle day completion
  const toggleDayCompletion = async (dayNum) => {
    const dayInfo = getDayInfo(dayNum);
    if (dayInfo.isLocked) return;

    if (togglingDay === dayNum) return;
    setTogglingDay(dayNum);

    const wasCompleted = !!completedDays[dayNum];
    const newCompleted = !wasCompleted;

    const updated = {
      ...completedDays,
      [dayNum]: newCompleted,
    };
    setCompletedDays(updated);
    const storageKey = getStorageKey();
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {}

    const targetDayData = workoutPlan.find((w) => w.day === dayNum);
    const workoutPayload = {
      name: targetDayData?.name || `Day ${dayNum} Workout`,
      type: targetDayData?.type || 'strength',
      duration: targetDayData?.duration || '40 min',
      caloriesBurned: targetDayData?.caloriesBurned || 280,
    };

    try {
      const token = localStorage.getItem('token');
      const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/workout/toggle`,
        {
          day: dayNum,
          date: dayInfo.dateString,
          completed: newCompleted,
          workout: workoutPayload,
        },
        { headers: authHeaders }
      );
    } catch (err) {
      console.error('Failed to sync workout toggle with backend:', err);
      // Rollback on server error
      const rollback = {
        ...completedDays,
        [dayNum]: wasCompleted,
      };
      setCompletedDays(rollback);
      try {
        localStorage.setItem(storageKey, JSON.stringify(rollback));
      } catch (e) {}
    } finally {
      setTogglingDay(null);
    }
  };

  // Reset cycle to Day 1 starting today
  const regeneratePlan = async () => {
    setPlanKey((prev) => prev + 1);
    setCompletedDays({});
    setSelectedWeek(1);
    try {
      const storageKey = getStorageKey();
      localStorage.removeItem(storageKey);
    } catch (e) {}

    try {
      const token = localStorage.getItem('token');
      const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/workout/reset`,
        {},
        { headers: authHeaders }
      );
      if (res.data?.planStartDate) {
        setServerStartDate(res.data.planStartDate);
      }
    } catch (err) {
      console.warn('Could not reset workout cycle on backend:', err.message);
    }

    await loadPlan();
  };

  // Compute total weeks
  const totalWeeks = useMemo(() => {
    return planDurationWeeks || Math.ceil(planDurationDays / 7) || 4;
  }, [planDurationWeeks, planDurationDays]);

  // Days in current selected week
  const currentWeekDays = useMemo(() => {
    if (!workoutPlan || workoutPlan.length === 0) return [];
    const startDay = (selectedWeek - 1) * 7 + 1;
    const endDay = Math.min(selectedWeek * 7, planDurationDays);
    return workoutPlan.filter((d) => d.day >= startDay && d.day <= endDay);
  }, [workoutPlan, selectedWeek, planDurationDays]);

  // Completed days in current selected week
  const weekCompletedCount = useMemo(() => {
    return currentWeekDays.filter((d) => completedDays[d.day]).length;
  }, [currentWeekDays, completedDays]);

  // Overall completed count across entire multi-week plan
  const overallCompletedCount = useMemo(() => {
    return Object.values(completedDays).filter(Boolean).length;
  }, [completedDays]);

  const weekCompletionPercentage = useMemo(() => {
    if (currentWeekDays.length === 0) return 0;
    return Math.round((weekCompletedCount / currentWeekDays.length) * 100);
  }, [weekCompletedCount, currentWeekDays.length]);

  return (
    <PageContainer className="py-10 sm:py-12 lg:py-16 space-y-10 sm:space-y-12">
      {/* ─── HEADER ────────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="brand" size="sm">
              Adaptive Multi-Week Plan
            </Badge>
            <Badge variant="accent" size="sm">
              {planDurationWeeks}-Week Journey
            </Badge>
            <span className="text-xs text-slate-400 hidden sm:inline">
              • Calendar Sundays Dedicated to Recovery
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Your {planDurationWeeks}-Week Workout Plan 💪
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Progressive splits synchronized with your meal plan duration, featuring dynamic Sunday recovery.
          </p>
        </div>

        <Button
          variant="secondary"
          size="md"
          onClick={regeneratePlan}
          leftIcon={RefreshCw}
        >
          Reset Workout Cycle
        </Button>
      </div>

      {/* ─── GOAL & LEVEL SELECTORS ────────────────────────────────────── */}
      <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
        {/* Goal Selector */}
        <Card className="p-6 sm:p-8">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-500" />
            <span>Target Fitness Focus</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {goalOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedGoal === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSelectedGoal(option.value)}
                  className={`relative p-3.5 rounded-2xl text-center flex flex-col items-center justify-center gap-2 transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-700 dark:text-cyan-300 shadow-sm'
                      : 'border-slate-200/80 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isSelected
                        ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold">{option.label}</span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Level Selector */}
        <Card className="p-6 sm:p-8">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-500" />
            <span>Experience & Intensity</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {levelOptions.map((option) => {
              const isSelected = selectedLevel === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSelectedLevel(option.value)}
                  className={`p-3.5 rounded-2xl text-center flex flex-col items-center justify-center gap-2 transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-700 dark:text-indigo-300 shadow-sm'
                      : 'border-slate-200/80 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="text-sm font-bold">{option.label}</span>
                  <Badge variant={option.badge} size="sm">
                    {option.value === 'beginner' ? '30m' : option.value === 'intermediate' ? '45m' : '60m'}
                  </Badge>
                </button>
              );
            })}
          </div>
        </Card>
      </div>

      {/* ─── WEEK NAVIGATION BAR ───────────────────────────────────────── */}
      <Card className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSelectedWeek((prev) => Math.max(1, prev - 1))}
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
              Days {(selectedWeek - 1) * 7 + 1} – {Math.min(selectedWeek * 7, planDurationDays)} of {planDurationDays}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSelectedWeek((prev) => Math.min(totalWeeks, prev + 1))}
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
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                w === selectedWeek
                  ? 'bg-cyan-500 text-white shadow-sm shadow-cyan-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 border border-slate-200/60 dark:border-white/5'
              }`}
            >
              Week {w}
            </button>
          ))}
        </div>
      </Card>

      {/* ─── WEEKLY COMPLETION STRIP ───────────────────────────────────── */}
      <Card className="p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Week {selectedWeek} Completion
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {weekCompletedCount} of {currentWeekDays.length} routines completed this week • {overallCompletedCount} of {planDurationDays} overall
            </p>
          </div>
          <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400">
            <AnimatedCounter value={weekCompletionPercentage} suffix="%" />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200/80 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-600 h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${weekCompletionPercentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>

        {/* Selected Week's Day Pills */}
        <div className="grid grid-cols-7 gap-2 pt-2">
          {currentWeekDays.map((day) => {
            const isDone = completedDays[day.day];
            const dayInfo = getDayInfo(day.day);
            const isRest = day.isRestDay || day.type === 'rest' || dayInfo.isSunday;

            return (
              <button
                key={day.day}
                type="button"
                disabled={dayInfo.isLocked}
                onClick={() => !dayInfo.isLocked && toggleDayCompletion(day.day)}
                title={
                  dayInfo.isLocked
                    ? `Locked (Unlocks on ${dayInfo.formattedDate})`
                    : dayInfo.isToday
                    ? `Today (${dayInfo.formattedDate}) - Click to toggle`
                    : isRest
                    ? `Sunday Rest (${dayInfo.formattedDate})`
                    : `${dayInfo.formattedDate} - Click to toggle`
                }
                className={`py-2 px-1 rounded-xl text-center text-xs font-bold transition-all border ${
                  dayInfo.isLocked
                    ? 'bg-slate-100/40 dark:bg-slate-800/30 border-dashed border-slate-200 dark:border-white/5 text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-60'
                    : isDone
                    ? 'bg-emerald-500 text-white border-emerald-400 shadow-sm shadow-emerald-500/30'
                    : dayInfo.isToday
                    ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border-cyan-500/50 hover:bg-cyan-500/25'
                    : isRest
                    ? 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/30 hover:bg-teal-500/20'
                    : 'bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-cyan-500/40'
                }`}
              >
                <span>D{day.day}</span>
                {isDone ? (
                  <Check className="w-3.5 h-3.5 mx-auto mt-0.5" />
                ) : dayInfo.isLocked ? (
                  <Lock className="w-3 h-3 mx-auto mt-0.5 text-slate-400 dark:text-slate-500" />
                ) : isRest ? (
                  <span className="block text-[8px] font-black uppercase text-teal-600 dark:text-teal-400 mt-0.5">
                    Rest
                  </span>
                ) : dayInfo.isToday ? (
                  <span className="block text-[9px] font-black uppercase text-cyan-600 dark:text-cyan-400 mt-0.5">
                    Today
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </Card>

      {/* ─── LOADING STATE ─────────────────────────────────────────────── */}
      {loading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-72 rounded-2xl" />
          ))}
        </div>
      )}

      {/* ─── WORKOUT CARDS FOR SELECTED WEEK ───────────────────────────── */}
      {!loading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {currentWeekDays.map((day, idx) => {
            const isCompleted = completedDays[day.day];
            const dayInfo = getDayInfo(day.day);
            const isRest = day.isRestDay || day.type === 'rest' || dayInfo.isSunday;
            const TypeIcon = isRest ? Calendar : typeIcons[day.type] || Dumbbell;

            // ─── REST DAY CARD ─────────────────────────────────────────────
            if (isRest) {
              return (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                >
                  <Card
                    className={`h-full flex flex-col justify-between overflow-hidden border transition-all ${
                      dayInfo.isLocked
                        ? 'opacity-65 bg-slate-50/50 dark:bg-slate-900/30 border-dashed border-slate-300 dark:border-white/10 select-none'
                        : isCompleted
                        ? 'border-emerald-500/40 ring-1 ring-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/15'
                        : dayInfo.isToday
                        ? 'border-teal-500/50 ring-1 ring-teal-500/30 bg-teal-50/20 dark:bg-teal-950/10 shadow-md shadow-teal-500/5'
                        : 'border-teal-500/20 dark:border-teal-500/15 bg-teal-50/10 dark:bg-teal-950/5 hover:border-teal-500/40'
                    }`}
                  >
                    <div>
                      {/* Day Header Banner */}
                      <div className="p-6 pb-5 border-b border-slate-200/80 dark:border-white/10 flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                              dayInfo.isLocked
                                ? 'bg-slate-200/60 dark:bg-slate-800 text-slate-400'
                                : 'bg-teal-500/10 text-teal-600 dark:text-teal-400'
                            }`}
                          >
                            {dayInfo.isLocked ? (
                              <Lock className="w-5 h-5 text-slate-400" />
                            ) : (
                              <Smile className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-bold text-slate-400">
                                Day {day.day} • {dayInfo.formattedDate}
                              </span>
                              <Badge variant="accent" size="sm">
                                REST & RECOVERY
                              </Badge>
                              {dayInfo.isToday && (
                                <Badge variant="brand" size="sm">
                                  TODAY
                                </Badge>
                              )}
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mt-0.5">
                              Sunday Recovery Day
                            </h3>
                          </div>
                        </div>

                        {dayInfo.isLocked ? (
                          <div
                            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-400 cursor-not-allowed shrink-0"
                            title={`Unlocks on ${dayInfo.formattedDate}`}
                          >
                            <Lock className="w-5 h-5" />
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => toggleDayCompletion(day.day)}
                            aria-label={
                              isCompleted
                                ? `Mark Day ${day.day} incomplete`
                                : `Mark Day ${day.day} complete`
                            }
                            className={`p-2 rounded-xl transition-colors shrink-0 ${
                              isCompleted
                                ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-teal-500'
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : (
                              <Circle className="w-5 h-5" />
                            )}
                          </button>
                        )}
                      </div>

                      {/* Day Meta */}
                      <div className="px-6 py-3 bg-teal-500/5 dark:bg-teal-950/20 flex items-center justify-between text-xs text-teal-700 dark:text-teal-300 font-medium">
                        <span className="flex items-center gap-1.5">
                          <Heart className="w-3.5 h-3.5 text-teal-500" />
                          Restorative Active Rest
                        </span>
                        <span className="flex items-center gap-1.5 text-slate-400">
                          0 Heavy Sets Scheduled
                        </span>
                      </div>

                      {/* Recovery Content */}
                      <div className="p-6 space-y-4">
                        <div className="p-4 rounded-xl bg-teal-500/10 dark:bg-teal-950/30 border border-teal-500/20 space-y-2">
                          <div className="flex items-center gap-2 text-teal-800 dark:text-teal-200 font-bold text-xs">
                            <Sparkles className="w-4 h-4 text-teal-500" />
                            <span>Sunday Muscle Repair Protocol</span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                            Sundays are reserved for muscle protein synthesis, central nervous system recharge, and tissue regeneration. No lifting or strenuous cardio today!
                          </p>
                        </div>

                        <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                          <div className="flex items-center gap-2">
                            <span className="text-base">💧</span>
                            <span>Hydrate thoroughly (2.5 – 3 liters of water)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-base">🚶</span>
                            <span>Optional: 20-30 min gentle nature stroll</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-base">🧘</span>
                            <span>Light full-body mobility and deep breathing</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-base">💤</span>
                            <span>Target 8 hours of uninterrupted deep sleep</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer Status */}
                    <div className="p-6 pt-0">
                      {dayInfo.isLocked ? (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={true}
                          leftIcon={Lock}
                          className="w-full justify-center text-xs font-bold opacity-60 cursor-not-allowed border-slate-300 dark:border-white/10 text-slate-400"
                        >
                          Unlocks on {dayInfo.formattedDate}
                        </Button>
                      ) : (
                        <Button
                          variant={isCompleted ? 'accent' : 'outline'}
                          size="sm"
                          onClick={() => toggleDayCompletion(day.day)}
                          leftIcon={isCompleted ? Check : Heart}
                          className="w-full justify-center text-xs font-bold"
                        >
                          {isCompleted
                            ? 'Rest Day Observed ✓'
                            : dayInfo.isToday
                            ? "Log Today's Rest"
                            : 'Mark Rest Day Observed'}
                        </Button>
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            }

            // ─── ACTIVE TRAINING DAY CARD ──────────────────────────────────
            return (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <Card
                  className={`h-full flex flex-col justify-between overflow-hidden border transition-all ${
                    dayInfo.isLocked
                      ? 'opacity-65 bg-slate-50/50 dark:bg-slate-900/30 border-dashed border-slate-300 dark:border-white/10 select-none'
                      : isCompleted
                      ? 'border-emerald-500/40 ring-1 ring-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/15'
                      : dayInfo.isToday
                      ? 'border-cyan-500/50 ring-1 ring-cyan-500/30 hover:border-cyan-500 shadow-md shadow-cyan-500/5'
                      : 'hover:border-cyan-500/40'
                  }`}
                >
                  <div>
                    {/* Day Header Banner */}
                    <div className="p-6 pb-5 border-b border-slate-200/80 dark:border-white/10 flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            dayInfo.isLocked
                              ? 'bg-slate-200/60 dark:bg-slate-800 text-slate-400'
                              : 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'
                          }`}
                        >
                          {dayInfo.isLocked ? (
                            <Lock className="w-5 h-5 text-slate-400" />
                          ) : (
                            <TypeIcon className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold text-slate-400">
                              Day {day.day} • {dayInfo.formattedDate}
                            </span>
                            <Badge
                              variant={
                                dayInfo.isLocked ? 'neutral' : typeBadges[day.type] || 'brand'
                              }
                              size="sm"
                            >
                              {day.type?.toUpperCase()}
                            </Badge>
                            {dayInfo.isToday && (
                              <Badge variant="brand" size="sm">
                                TODAY
                              </Badge>
                            )}
                          </div>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mt-0.5">
                            {day.name}
                          </h3>
                        </div>
                      </div>

                      {dayInfo.isLocked ? (
                        <div
                          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-400 cursor-not-allowed shrink-0"
                          title={`Unlocks on ${dayInfo.formattedDate}`}
                        >
                          <Lock className="w-5 h-5" />
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => toggleDayCompletion(day.day)}
                          aria-label={
                            isCompleted
                              ? `Mark Day ${day.day} incomplete`
                              : `Mark Day ${day.day} complete`
                          }
                          className={`p-2 rounded-xl transition-colors shrink-0 ${
                            isCompleted
                              ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-cyan-500'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <Circle className="w-5 h-5" />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Day Meta */}
                    <div className="px-6 py-3 bg-slate-100/60 dark:bg-slate-800/40 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {day.duration || '40 min'}
                      </span>
                      <span className="flex items-center gap-1.5 font-medium">
                        <Flame className="w-3.5 h-3.5 text-amber-500" />
                        ~{day.caloriesBurned || 280} kcal
                      </span>
                    </div>

                    {/* Exercise List */}
                    <div className="p-6 space-y-3.5">
                      {day.exercises?.map((ex, exIdx) => (
                        <div
                          key={exIdx}
                          className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-white/5 space-y-1"
                        >
                          <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                            <span>{ex.name}</span>
                            <span className="text-cyan-600 dark:text-cyan-400 text-[11px]">
                              {ex.sets && ex.reps && ex.sets !== '-'
                                ? `${ex.sets} × ${ex.reps}`
                                : ex.duration || 'Full Set'}
                            </span>
                          </div>
                          {ex.notes && (
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                              {ex.notes}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer Status */}
                  <div className="p-6 pt-0">
                    {dayInfo.isLocked ? (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={true}
                        leftIcon={Lock}
                        className="w-full justify-center text-xs font-bold opacity-60 cursor-not-allowed border-slate-300 dark:border-white/10 text-slate-400"
                      >
                        Unlocks on {dayInfo.formattedDate}
                      </Button>
                    ) : (
                      <Button
                        variant={isCompleted ? 'accent' : dayInfo.isToday ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => toggleDayCompletion(day.day)}
                        leftIcon={isCompleted ? Check : Circle}
                        className="w-full justify-center text-xs font-bold"
                      >
                        {isCompleted
                          ? 'Completed ✓'
                          : dayInfo.isToday
                          ? "Complete Today's Workout"
                          : 'Mark Day Complete'}
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </PageContainer>
  );
};

export default Workout;
