import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import { fatLossWorkouts } from '../data/fatLossWorkouts';
import { muscleGainWorkouts } from '../data/muscleGainWorkouts';
import { stayFitWorkouts } from '../data/stayFitWorkouts';
import { useAuth } from '../context/AuthContext';
import { Button, Card, Badge, AnimatedCounter } from '../components/ui';
import { PageContainer } from '../components/PageContainer';

const Workout = () => {
  const { user } = useAuth();
  const [selectedGoal, setSelectedGoal] = useState('fatLoss');
  const [selectedLevel, setSelectedLevel] = useState('beginner');
  const [workoutPlan, setWorkoutPlan] = useState([]);
  const [completedDays, setCompletedDays] = useState({});
  const [planKey, setPlanKey] = useState(0);
  const [serverCycleStart, setServerCycleStart] = useState(null);

  const allWorkouts = {
    fatLoss: fatLossWorkouts,
    muscleGain: muscleGainWorkouts,
    stayFit: stayFitWorkouts,
  };

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

  const [togglingDay, setTogglingDay] = useState(null);

  const getCycleStartDate = useCallback(() => {
    if (serverCycleStart) {
      const s = new Date(serverCycleStart);
      s.setHours(0, 0, 0, 0);
      return s;
    }
    const raw = user?.planStartDate || user?.createdAt;
    const d = raw ? new Date(raw) : new Date();
    d.setHours(0, 0, 0, 0);

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const elapsed = Math.floor((today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    const offset = elapsed >= 0 ? Math.floor(elapsed / 7) * 7 : 0;
    d.setDate(d.getDate() + offset);
    return d;
  }, [serverCycleStart, user?.planStartDate, user?.createdAt]);

  const getDayInfo = useCallback((dayNum) => {
    const cycleStart = getCycleStartDate();
    const date = new Date(cycleStart);
    date.setDate(cycleStart.getDate() + (dayNum - 1));

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    let status = 'past';
    if (diffDays === 0) status = 'today';
    else if (diffDays > 0) status = 'future';

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
      date,
      dateString: date.toISOString(),
      formattedDate,
    };
  }, [getCycleStartDate]);

  const getWeekStorageKey = useCallback(() => {
    const cycleStart = getCycleStartDate();
    const cycleStartStr = cycleStart.toISOString().split('T')[0];
    const userId = user?._id || user?.id || 'guest';
    return `workout_${userId}_${selectedGoal}_${selectedLevel}_cycle_${cycleStartStr}_${planKey}`;
  }, [getCycleStartDate, user?._id, user?.id, selectedGoal, selectedLevel, planKey]);

  const loadCompletedDays = useCallback(() => {
    const storageKey = getWeekStorageKey();
    const saved = localStorage.getItem(storageKey);
    setCompletedDays(saved ? JSON.parse(saved) : {});
  }, [getWeekStorageKey]);

  useEffect(() => {
    loadWorkoutPlan();
    loadCompletedDays();
  }, [selectedGoal, selectedLevel, planKey, loadCompletedDays]);

  const loadWorkoutPlan = () => {
    const plan = allWorkouts[selectedGoal]?.[selectedLevel] || [];
    setWorkoutPlan(plan);
  };

  // Sync with server week status
  useEffect(() => {
    const syncWeekStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/workout/week-status`, { headers: authHeaders });
        if (res.data?.cycleStart) {
          setServerCycleStart(res.data.cycleStart);
        }
        if (res.data?.completedDays) {
          setCompletedDays((prev) => {
            const merged = { ...prev, ...res.data.completedDays };
            const storageKey = getWeekStorageKey();
            try {
              localStorage.setItem(storageKey, JSON.stringify(merged));
            } catch (e) {}
            return merged;
          });
        }
      } catch (err) {
        console.warn('Could not sync workout status with server:', err.message);
      }
    };
    syncWeekStatus();
  }, [selectedGoal, selectedLevel, planKey, getWeekStorageKey]);

  const toggleDayCompletion = async (dayNum) => {
    const dayInfo = getDayInfo(dayNum);
    // Gate: future days are locked and strictly non-interactive
    if (dayInfo.isLocked) {
      return;
    }

    if (togglingDay === dayNum) return;
    setTogglingDay(dayNum);

    const wasCompleted = !!completedDays[dayNum];
    const newCompleted = !wasCompleted;

    // Optimistic UI update
    const updated = {
      ...completedDays,
      [dayNum]: newCompleted,
    };
    setCompletedDays(updated);
    const storageKey = getWeekStorageKey();
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {}

    const workout = workoutPlan.find((w) => w.day === dayNum) || {
      name: `Day ${dayNum} Workout`,
      duration: '40 min',
      caloriesBurned: 280,
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
          workout: {
            name: workout.name,
            type: workout.type,
            duration: workout.duration || '40 min',
            caloriesBurned: workout.caloriesBurned || 280,
          },
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

  const regeneratePlan = async () => {
    setPlanKey((prev) => prev + 1);
    setCompletedDays({});
    try {
      const storageKey = getWeekStorageKey();
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
        setServerCycleStart(res.data.planStartDate);
      }
    } catch (err) {
      console.warn('Could not reset workout cycle on backend:', err.message);
    }
  };

  const getCompletedCount = () => {
    return Object.values(completedDays).filter(Boolean).length;
  };

  const getCompletionPercentage = () => {
    const completed = getCompletedCount();
    return Math.round((completed / 7) * 100);
  };

  return (
    <PageContainer className="py-10 sm:py-12 lg:py-16 space-y-10 sm:space-y-12">
      {/* ─── HEADER ────────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="brand" size="sm">
              Adaptive Routines
            </Badge>
            <span className="text-xs text-slate-400">• Home & Gym Supported</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Your 7-Day Workout Plan 💪
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Structured cycles balancing strength, functional cardio, and recovery days.
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
        {/* Goal Selector Tabs */}
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

        {/* Level Selector Tabs */}
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

      {/* ─── WEEKLY COMPLETION STRIP ───────────────────────────────────── */}
      <Card className="p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Weekly Routine Completion
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {getCompletedCount()} of 7 daily workout routines completed
            </p>
          </div>
          <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400">
            <AnimatedCounter value={getCompletionPercentage()} suffix="%" />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200/80 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-600 h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${getCompletionPercentage()}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>

        {/* 7 Day Pills */}
        <div className="grid grid-cols-7 gap-2 pt-2">
          {[1, 2, 3, 4, 5, 6, 7].map((day) => {
            const isDone = completedDays[day];
            const dayInfo = getDayInfo(day);
            return (
              <button
                key={day}
                type="button"
                disabled={dayInfo.isLocked}
                onClick={() => !dayInfo.isLocked && toggleDayCompletion(day)}
                title={
                  dayInfo.isLocked
                    ? `Locked (Unlocks on ${dayInfo.formattedDate})`
                    : dayInfo.isToday
                    ? `Today (${dayInfo.formattedDate}) - Click to toggle`
                    : `${dayInfo.formattedDate} - Click to toggle`
                }
                className={`py-2 rounded-xl text-center text-xs font-bold transition-all border ${
                  dayInfo.isLocked
                    ? 'bg-slate-100/40 dark:bg-slate-800/30 border-dashed border-slate-200 dark:border-white/5 text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-60'
                    : isDone
                    ? 'bg-emerald-500 text-white border-emerald-400 shadow-sm shadow-emerald-500/30'
                    : dayInfo.isToday
                    ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border-cyan-500/50 hover:bg-cyan-500/25'
                    : 'bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-cyan-500/40'
                }`}
              >
                <span>D{day}</span>
                {isDone ? (
                  <Check className="w-3.5 h-3.5 mx-auto mt-0.5" />
                ) : dayInfo.isLocked ? (
                  <Lock className="w-3 h-3 mx-auto mt-0.5 text-slate-400 dark:text-slate-500" />
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

      {/* ─── 7-DAY WORKOUT CARDS ───────────────────────────────────────── */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {workoutPlan.map((day, idx) => {
          const TypeIcon = typeIcons[day.type] || Dumbbell;
          const isCompleted = completedDays[day.day];
          const dayInfo = getDayInfo(day.day);

          return (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.06 }}
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
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        dayInfo.isLocked
                          ? 'bg-slate-200/60 dark:bg-slate-800 text-slate-400'
                          : 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'
                      }`}>
                        {dayInfo.isLocked ? <Lock className="w-5 h-5 text-slate-400" /> : <TypeIcon className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-slate-400">
                            Day {day.day} • {dayInfo.formattedDate}
                          </span>
                          <Badge variant={dayInfo.isLocked ? 'neutral' : (typeBadges[day.type] || 'brand')} size="sm">
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
                        aria-label={isCompleted ? `Mark Day ${day.day} incomplete` : `Mark Day ${day.day} complete`}
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

                  {/* Day Meta (Duration & Calorie Estimate) */}
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
                    {day.isRestDay ? (
                      <div className="py-6 text-center text-slate-500 dark:text-slate-400 space-y-2">
                        <p className="text-2xl">🧘</p>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                          Active Recovery Day
                        </p>
                        <p className="text-xs max-w-xs mx-auto">
                          Hydrate well, do light stretching, or take a peaceful 30-minute walk.
                        </p>
                      </div>
                    ) : (
                      day.exercises?.map((ex, exIdx) => (
                        <div
                          key={exIdx}
                          className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-white/5 space-y-1"
                        >
                          <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                            <span>{ex.name}</span>
                            <span className="text-cyan-600 dark:text-cyan-400 text-[11px]">
                              {ex.sets} × {ex.reps}
                            </span>
                          </div>
                          {ex.notes && (
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                              {ex.notes}
                            </p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Footer status */}
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
                      {isCompleted ? 'Completed ✓' : dayInfo.isToday ? "Complete Today's Workout" : 'Mark Day Complete'}
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </PageContainer>
  );
};

export default Workout;
