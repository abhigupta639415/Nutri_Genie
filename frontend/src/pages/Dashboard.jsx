import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Target,
  TrendingUp,
  Flame,
  Calendar,
  Settings,
  Save,
  ChevronDown,
  ChevronUp,
  Utensils,
  Dumbbell,
  CheckSquare,
  Bot,
  Lightbulb,
  Check,
  ArrowRight,
  Pencil,
  X,
} from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, Badge, AnimatedCounter, Skeleton } from '../components/ui';
import { PageContainer } from '../components/PageContainer';

const goalMap = {
  weight_loss: 'Weight Loss',
  weight_gain: 'Weight Gain',
  muscle_gain: 'Muscle Gain',
  maintenance: 'Maintenance',
};

const activityMap = {
  sedentary: 'Sedentary',
  light: 'Light (1-2x/wk)',
  moderate: 'Moderate (3-5x/wk)',
  active: 'Active (Daily)',
  very_active: 'Very Active (Athlete)',
};

const Dashboard = () => {
  const { user, updateProfile } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState({
    goal: '',
    activityLevel: '',
    dietaryPreference: '',
    foodPreferences: '',
    allergies: '',
  });
  const [selectedDuration, setSelectedDuration] = useState('weeks-4');
  const [customDays, setCustomDays] = useState('');

  // Inline weight editing state
  const [isEditingWeight, setIsEditingWeight] = useState(false);
  const [weightInput, setWeightInput] = useState('');
  const [savingWeight, setSavingWeight] = useState(false);
  const [weightError, setWeightError] = useState('');

  const getWeightCaption = () => {
    const userId = user?._id || user?.id;
    const localUpdated = userId ? localStorage.getItem(`nutrigenie_weight_last_updated_${userId}`) : null;
    const dateToUse = localUpdated || (user?.updatedAt && user?.createdAt && (new Date(user.updatedAt).getTime() - new Date(user.createdAt).getTime() > 2000) ? user.updatedAt : null);

    if (dateToUse) {
      const d = new Date(dateToUse);
      return `Last updated ${d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`;
    }
    return 'Recorded at onboarding';
  };

  const handleStartEditWeight = () => {
    setWeightInput(user?.weight ? String(user.weight) : '');
    setWeightError('');
    setIsEditingWeight(true);
  };

  const handleCancelEditWeight = () => {
    setIsEditingWeight(false);
    setWeightError('');
  };

  const handleSaveWeight = async (e) => {
    if (e) e.preventDefault();
    const val = parseFloat(weightInput);
    if (isNaN(val) || val < 20 || val > 300) {
      setWeightError('Enter weight between 20 and 300 kg');
      return;
    }

    setSavingWeight(true);
    setWeightError('');
    try {
      await updateProfile({ weight: val });
      const userId = user?._id || user?.id;
      if (userId) {
        localStorage.setItem(`nutrigenie_weight_last_updated_${userId}`, new Date().toISOString());
      }
      // Refetch /api/diet/plan and summary so all derived metrics update immediately
      await fetchDashboardData();
      setIsEditingWeight(false);
    } catch (err) {
      console.error('Failed to update weight:', err);
      setWeightError(err.response?.data?.message || 'Failed to update weight');
    } finally {
      setSavingWeight(false);
    }
  };

  // Per-user duration key
  const getDurationKey = useCallback(() => {
    const userId = user?._id || user?.id || 'guest';
    return `nutrigenie_plan_duration_${userId}`;
  }, [user]);

  // Initialize settings from user profile
  useEffect(() => {
    if (user) {
      setSettingsForm({
        goal: user.goal || 'maintenance',
        activityLevel: user.activityLevel || 'moderate',
        dietaryPreference: user.dietaryPreference || 'vegetarian',
        foodPreferences: user.foodPreferences || '',
        allergies: user.allergies || '',
      });
      if (user.durationUnit === 'days' && user.planDurationDays === 30) {
        setSelectedDuration('days-30');
      } else if (user.planDurationWeeks) {
        setSelectedDuration(`weeks-${user.planDurationWeeks}`);
      } else {
        setSelectedDuration('weeks-4');
      }
    }
  }, [user, getDurationKey]);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      const [dietResponse, progressResponse] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/api/diet/plan`),
        axios.get(`${process.env.REACT_APP_API_URL}/api/progress/summary?period=week`),
      ]);

      setStats({
        diet: dietResponse.data,
        progress: progressResponse.data,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Save settings handler
  const handleSaveSettings = async () => {
    if (!settingsForm.goal || !settingsForm.activityLevel || !settingsForm.dietaryPreference) {
      setSaveError('Please select a valid fitness goal, activity level, and dietary preference.');
      return;
    }

    setSaving(true);
    setSaveSuccess(false);
    setSaveError(null);
    try {
      let weeks = 4;
      let days = 28;
      let durationUnit = 'weeks';

      if (selectedDuration.startsWith('weeks-')) {
        weeks = parseInt(selectedDuration.split('-')[1], 10);
        days = weeks * 7;
        durationUnit = 'weeks';
      } else if (selectedDuration === 'days-30') {
        days = 30;
        weeks = Math.ceil(30 / 7);
        durationUnit = 'days';
      } else if (selectedDuration === 'custom' && customDays) {
        days = Math.max(1, Math.min(90, parseInt(customDays, 10) || 30));
        weeks = Math.max(1, Math.min(12, Math.ceil(days / 7)));
        durationUnit = 'days';
      }

      await updateProfile({
        goal: settingsForm.goal,
        activityLevel: settingsForm.activityLevel,
        dietaryPreference: settingsForm.dietaryPreference,
        foodPreferences: settingsForm.foodPreferences,
        allergies: settingsForm.allergies,
        planDurationWeeks: weeks,
        planDurationDays: days,
        durationUnit,
      });

      localStorage.setItem(getDurationKey(), String(days));

      // Trigger Gemini diet plan generation dynamically
      const genRes = await axios.post(`${process.env.REACT_APP_API_URL}/api/diet/generate`, {
        planDurationWeeks: weeks,
        planDurationDays: days,
        durationUnit,
        foodPreferences: settingsForm.foodPreferences,
        allergies: settingsForm.allergies,
        forceRegenerate: true,
      });

      if (genRes.data?.metrics && genRes.data?.macros) {
        setStats((prev) => ({
          ...prev,
          diet: {
            ...prev?.diet,
            metrics: genRes.data.metrics,
            macros: genRes.data.macros,
            planDurationWeeks: genRes.data.planDurationWeeks,
            planDurationDays: genRes.data.planDurationDays,
            mealPlan: genRes.data.plan,
          },
        }));
      }

      await fetchDashboardData();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 5000);
    } catch (error) {
      console.error('Error saving settings and generating plan:', error);
      const errMsg = error.response?.data?.message || error.message || 'Please try again.';
      setSaveError(errMsg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageContainer className="py-10 sm:py-12 lg:py-16 space-y-10 sm:space-y-12">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
          <Skeleton className="h-56" />
          <Skeleton className="h-56" />
        </div>
      </PageContainer>
    );
  }

  const targetCal = stats?.diet?.metrics?.targetCalories || 0;
  const bmiVal = stats?.diet?.metrics?.bmi?.value || 0;
  const bmiCategory = stats?.diet?.metrics?.bmi?.category || 'Healthy';

  return (
    <PageContainer className="py-10 sm:py-12 lg:py-16 space-y-10 sm:space-y-12">
      {/* ─── GREETING BANNER ───────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 sm:pb-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="brand" size="sm">
              Today's Overview
            </Badge>
            <span className="text-xs text-slate-400">
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'long',
                day: 'numeric',
                month: 'short',
              })}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Welcome back, {user?.name || 'Friend'}! 👋
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1">
            Here is your daily nutrition and training trajectory.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/diet">
            <Button variant="primary" size="md" rightIcon={Utensils}>
              View Diet Plan
            </Button>
          </Link>
          <Link to="/workout">
            <Button variant="secondary" size="md" rightIcon={Dumbbell}>
              Today's Workout
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* ─── TOP METRIC CARDS ──────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {/* Metric 1: Weight */}
        <Card hoverEffect className="p-6 sm:p-7">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Current Weight
              </span>
              {!isEditingWeight && (
                <button
                  type="button"
                  onClick={handleStartEditWeight}
                  title="Edit current weight"
                  aria-label="Edit current weight"
                  className="p-1 rounded-md text-slate-400 hover:text-cyan-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>

          {isEditingWeight ? (
            <form onSubmit={handleSaveWeight} className="space-y-2 py-0.5">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  min="20"
                  max="300"
                  autoFocus
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  className="w-24 px-2 py-1 text-lg font-black rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-white/20 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <span className="text-sm font-bold text-slate-500">kg</span>
                <button
                  type="submit"
                  disabled={savingWeight}
                  title="Save weight"
                  aria-label="Save weight"
                  className="p-1.5 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleCancelEditWeight}
                  disabled={savingWeight}
                  title="Cancel"
                  aria-label="Cancel"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {weightError && (
                <p className="text-[10px] text-rose-500 font-medium">{weightError}</p>
              )}
            </form>
          ) : (
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              <AnimatedCounter value={user?.weight || 0} decimals={1} suffix=" kg" />
            </div>
          )}

          <p className="text-[11px] text-slate-400 mt-1 font-medium">{getWeightCaption()}</p>
        </Card>

        {/* Metric 2: BMI */}
        <Card hoverEffect className="p-6 sm:p-7">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Body Mass Index
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {bmiVal ? <AnimatedCounter value={bmiVal} decimals={1} /> : 'N/A'}
          </div>
          <div className="mt-1">
            <Badge variant={bmiCategory.toLowerCase().includes('normal') || bmiCategory.toLowerCase().includes('healthy') ? 'accent' : 'warning'} size="sm">
              {bmiCategory}
            </Badge>
          </div>
        </Card>

        {/* Metric 3: Target Calories */}
        <Card hoverEffect className="p-6 sm:p-7">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Target Calories
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            <AnimatedCounter value={targetCal} decimals={0} suffix=" kcal" />
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">Daily energy budget</p>
        </Card>

        {/* Metric 4: Goal */}
        <Card hoverEffect className="p-6 sm:p-7">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Active Goal
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white truncate">
            {goalMap[user?.goal] || 'Healthy Habit'}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium truncate">
            {activityMap[user?.activityLevel] || 'Active Routine'}
          </p>
        </Card>
      </div>

      {/* ─── CUSTOMIZE YOUR PLAN ACCORDION ─────────────────────────────── */}
      <Card className="overflow-hidden border-cyan-500/30">
        <button
          type="button"
          onClick={() => setShowSettings(!showSettings)}
          className="w-full p-6 sm:p-8 text-left flex items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Customize Your Plan
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Adjust your goal, activity level, dietary preference, and duration presets
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {saveSuccess && (
              <Badge variant="accent" size="sm" icon={Check}>
                Saved & Generated!
              </Badge>
            )}
            <div className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white">
              {showSettings ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </div>
        </button>

        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="border-t border-slate-200/80 dark:border-white/10 p-6 sm:p-8 space-y-8"
            >
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                {/* Goal */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    🎯 Fitness Goal
                  </label>
                  <select
                    value={settingsForm.goal}
                    onChange={(e) => setSettingsForm((prev) => ({ ...prev, goal: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="weight_loss">🔥 Weight Loss (Fat Loss)</option>
                    <option value="weight_gain">💪 Weight Gain</option>
                    <option value="muscle_gain">🏋️ Muscle Gain</option>
                    <option value="maintenance">⚖️ Maintenance</option>
                  </select>
                </div>

                {/* Activity Level */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    🏃 Activity Level
                  </label>
                  <select
                    value={settingsForm.activityLevel}
                    onChange={(e) => setSettingsForm((prev) => ({ ...prev, activityLevel: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="sedentary">🪑 Sedentary (Desk Job)</option>
                    <option value="light">🚶 Light (1-2x/week)</option>
                    <option value="moderate">🏃 Moderate (3-5x/week)</option>
                    <option value="active">💪 Active (Daily workout)</option>
                    <option value="very_active">🔥 Very Active (Athlete)</option>
                  </select>
                </div>

                {/* Dietary Preference */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    🥗 Diet Preference
                  </label>
                  <select
                    value={settingsForm.dietaryPreference}
                    onChange={(e) => setSettingsForm((prev) => ({ ...prev, dietaryPreference: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="vegetarian">🥬 Pure Vegetarian</option>
                    <option value="eggetarian">🍳 Eggetarian</option>
                    <option value="non_vegetarian">🍗 Non-Vegetarian</option>
                    <option value="jain">🙏 Jain (No Root Veg)</option>
                    <option value="vegan">🌱 Vegan</option>
                    <option value="diabetic_friendly">💊 Diabetic Friendly</option>
                  </select>
                </div>

                {/* Plan Duration */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    📅 Plan Duration
                  </label>
                  <select
                    value={selectedDuration}
                    onChange={(e) => setSelectedDuration(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="weeks-1">⚡ 1 Week (7 days)</option>
                    <option value="weeks-2">🔥 2 Weeks (14 days)</option>
                    <option value="weeks-4">💪 4 Weeks (28 days)</option>
                    <option value="weeks-8">🏋️ 8 Weeks (56 days)</option>
                    <option value="weeks-12">👑 12 Weeks (84 days)</option>
                    <option value="days-30">📅 30 Days (1 Month)</option>
                    <option value="custom">⚙️ Custom Duration</option>
                  </select>
                </div>
              </div>

              {/* Custom Duration Input */}
              {selectedDuration === 'custom' && (
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Custom Duration (1–90 Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    placeholder="e.g. 45"
                    value={customDays}
                    onChange={(e) => setCustomDays(e.target.value)}
                    className="w-full sm:w-64 px-3 py-2 text-sm rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              )}

              {/* Food Preferences & Allergies */}
              <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    🍛 Food Preferences (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. North Indian, Sattu, Paneer, Sprouted Moong"
                    value={settingsForm.foodPreferences}
                    onChange={(e) => setSettingsForm((prev) => ({ ...prev, foodPreferences: e.target.value }))}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    ⚠️ Allergies / Restrictions (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Peanuts, Dairy, Gluten"
                    value={settingsForm.allergies}
                    onChange={(e) => setSettingsForm((prev) => ({ ...prev, allergies: e.target.value }))}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
                  />
                </div>
              </div>

              {/* Action and Error */}
              {saveError && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-medium">
                  {saveError}
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Saving will recalculate your energy metrics and regenerate your custom meal slots.
                </p>
                <Button
                  onClick={handleSaveSettings}
                  isLoading={saving}
                  variant="primary"
                  size="md"
                  leftIcon={Save}
                  className="w-full sm:w-auto"
                >
                  Save & Regenerate Plan
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* ─── METABOLIC RATE & MACROS CARDS ─────────────────────────────── */}
      <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
        {/* Metabolic Rate */}
        <Card className="p-6 sm:p-8">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500" />
              <span>Metabolic Energy Budget</span>
            </CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Scientifically calculated based on the Mifflin-St Jeor formula
            </p>
          </CardHeader>
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-white/5">
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Basal Metabolic Rate (BMR)
                </p>
                <p className="text-xs text-slate-400">Calories burned at complete rest</p>
              </div>
              <span className="text-xl font-extrabold text-cyan-600 dark:text-cyan-400">
                <AnimatedCounter value={stats?.diet?.metrics?.bmr || 0} suffix=" kcal" />
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-white/5">
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Total Daily Energy (TDEE)
                </p>
                <p className="text-xs text-slate-400">Maintenance calories with your activity</p>
              </div>
              <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
                <AnimatedCounter value={stats?.diet?.metrics?.tdee || 0} suffix=" kcal" />
              </span>
            </div>
          </div>
        </Card>

        {/* Daily Macros Target */}
        <Card className="p-6 sm:p-8">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-cyan-500" />
              <span>Daily Macronutrient Targets</span>
            </CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Optimized for {goalMap[user?.goal] || 'your body composition'}
            </p>
          </CardHeader>
          <div className="grid grid-cols-3 gap-4 pt-3">
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center">
              <p className="text-xs font-bold text-rose-600 dark:text-rose-400">Protein</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                <AnimatedCounter value={stats?.diet?.macros?.protein || 0} suffix="g" />
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Muscle repair</p>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
              <p className="text-xs font-bold text-amber-600 dark:text-amber-400">Carbs</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                <AnimatedCounter value={stats?.diet?.macros?.carbs || 0} suffix="g" />
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Daily fuel</p>
            </div>

            <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-center">
              <p className="text-xs font-bold text-cyan-600 dark:text-cyan-400">Healthy Fats</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                <AnimatedCounter value={stats?.diet?.macros?.fats || 0} suffix="g" />
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Hormone balance</p>
            </div>
          </div>
        </Card>
      </div>

      {/* ─── WEEKLY PROGRESS STATS SUMMARY ─────────────────────────────── */}
      {stats?.progress?.summary && (
        <Card className="p-6 sm:p-8">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              <span>Weekly Progress Summary</span>
            </CardTitle>
          </CardHeader>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 pt-3">
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-white/5 text-center">
              <Calendar className="w-5 h-5 text-cyan-500 mx-auto mb-2" />
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                <AnimatedCounter value={stats.progress.summary.totalDays || 0} />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Days Tracked</p>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-white/5 text-center">
              <Flame className="w-5 h-5 text-amber-500 mx-auto mb-2" />
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                <AnimatedCounter value={stats.progress.summary.averageCaloriesConsumed || 0} />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Avg Calories / Day</p>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-white/5 text-center">
              <Dumbbell className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                <AnimatedCounter value={stats.progress.summary.totalWorkouts || 0} />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Workouts</p>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-white/5 text-center">
              <Activity className="w-5 h-5 text-indigo-500 mx-auto mb-2" />
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {stats.progress.summary.weightChange > 0 ? '+' : ''}
                <AnimatedCounter value={stats.progress.summary.weightChange || 0} decimals={1} suffix=" kg" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Weight Shift</p>
            </div>
          </div>
        </Card>
      )}

      {/* ─── QUICK ACTIONS GRID ────────────────────────────────────────── */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        <Link to="/diet">
          <Card hoverEffect glow="cyan" className="p-6 sm:p-7 h-full flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-teal-500 text-white flex items-center justify-center mb-4 shadow-md shadow-cyan-500/20">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Indian Diet Plan
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                View weekly meal slots and mark today's meals complete
              </p>
            </div>
            <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 mt-4 flex items-center gap-1">
              Open Diet Plan <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Card>
        </Link>

        <Link to="/workout">
          <Card hoverEffect glow="accent" className="p-6 sm:p-7 h-full flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center mb-4 shadow-md shadow-emerald-500/20">
                <Dumbbell className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Workout Routines
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Targeted 7-day routine tailored to your fitness level
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-4 flex items-center gap-1">
              Start Workout <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Card>
        </Link>

        <Link to="/todos">
          <Card hoverEffect glow="purple" className="p-6 sm:p-7 h-full flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center mb-4 shadow-md shadow-indigo-500/20">
                <CheckSquare className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Daily Habits & Tasks
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Check off hydration, workout sets, and vitamin routines
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-4 flex items-center gap-1">
              View Tasks <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Card>
        </Link>

        <Link to="/chatbot">
          <Card hoverEffect glow="cyan" className="p-6 sm:p-7 h-full flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-indigo-600 text-white flex items-center justify-center mb-4 shadow-md shadow-cyan-500/20">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                NutriBot Assistant
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Instant nutrition guidance and Indian diet coaching
              </p>
            </div>
            <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 mt-4 flex items-center gap-1">
              Ask AI <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Card>
        </Link>
      </div>

      {/* ─── TIPS SECTION ──────────────────────────────────────────────── */}
      {stats?.diet?.tips && stats.diet.tips.length > 0 && (
        <Card className="p-6 sm:p-8 border-amber-500/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Personalized Recommendations
            </h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            {stats.diet.tips.map((tip, index) => (
              <div
                key={index}
                className="p-3.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-white/5 flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300"
              >
                <span className="text-emerald-500 font-bold shrink-0 mt-0.5">✓</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </PageContainer>
  );
};

export default Dashboard;
