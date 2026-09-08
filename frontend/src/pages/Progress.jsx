import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Calendar,
  TrendingUp,
  Activity,
  Flame,
  Droplet,
  Moon,
  Plus,
  Save,
  Edit3,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button, Card, CardHeader, CardTitle, Badge, Modal, EmptyState, AnimatedCounter, Skeleton } from '../components/ui';
import { PageContainer } from '../components/PageContainer';

// Custom Recharts Tooltip matching design system
const CustomChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const formattedDate = new Date(label).toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });

    return (
      <div className="glass-panel dark:bg-slate-900/95 p-3 rounded-xl border border-slate-200 dark:border-white/10 shadow-xl text-xs space-y-1">
        <p className="font-bold text-slate-700 dark:text-slate-300 pb-1 border-b border-slate-200 dark:border-white/10">
          {formattedDate}
        </p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="font-medium text-slate-600 dark:text-slate-400">{entry.name}:</span>
            </span>
            <span className="font-bold text-slate-900 dark:text-white">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const Progress = () => {
  const { user, updateProfile } = useAuth();
  const [progressData, setProgressData] = useState(null);
  const [dietStats, setDietStats] = useState(null);
  const [period, setPeriod] = useState('week');
  const [loading, setLoading] = useState(true);
  const [showLogForm, setShowLogForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [todayEntry, setTodayEntry] = useState(null);
  const [formData, setFormData] = useState({
    caloriesConsumed: '',
    caloriesBurned: '',
    weight: '',
    waterIntake: '',
    sleepHours: '',
    mood: 'okay',
  });

  useEffect(() => {
    fetchProgress();
  }, [period]);

  const fetchProgress = async () => {
    setLoading(true);
    try {
      const [progRes, dietRes] = await Promise.all([
        axios.get(`http://localhost:3001/api/progress/summary?period=${period}`),
        axios.get(`http://localhost:3001/api/diet/progress-stats`).catch(() => null),
      ]);
      setProgressData(progRes.data);
      if (dietRes && dietRes.data) {
        setDietStats(dietRes.data);
      }

      if (progRes.data?.todayEntry) {
        const today = progRes.data.todayEntry;
        setTodayEntry(today);
        setFormData({
          caloriesConsumed: today.caloriesConsumed ?? '',
          caloriesBurned: today.caloriesBurned ?? '',
          weight: today.weight ?? '',
          waterIntake: today.waterIntake ?? '',
          sleepHours: today.sleepHours ?? '',
          mood: today.mood || 'okay',
        });
      } else {
        setTodayEntry(null);
        setFormData((prev) => ({
          ...prev,
          weight: user?.weight ? String(user.weight) : prev.weight || '',
        }));
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitProgress = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const newWeight = parseFloat(formData.weight);

      await axios.post(
        'http://localhost:3001/api/progress',
        {
          caloriesConsumed: parseInt(formData.caloriesConsumed, 10) || 0,
          caloriesBurned: parseInt(formData.caloriesBurned, 10) || 0,
          weight: newWeight,
          waterIntake: parseFloat(formData.waterIntake) || 0,
          sleepHours: parseFloat(formData.sleepHours) || 0,
          mood: formData.mood,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Atomically sync updated weight to AuthContext so Dashboard and all derived metrics update immediately
      if (!isNaN(newWeight) && newWeight > 0) {
        try {
          await updateProfile({ weight: newWeight });
          const userId = user?._id || user?.id;
          if (userId) {
            localStorage.setItem(`nutrigenie_weight_last_updated_${userId}`, new Date().toISOString());
          }
        } catch (profileErr) {
          console.warn('Failed to update user profile weight:', profileErr);
        }
      }

      setShowLogForm(false);
      await fetchProgress();
    } catch (error) {
      console.error('Error logging progress:', error);
      alert('Failed to log progress. Please verify inputs.');
    } finally {
      setSaving(false);
    }
  };

  if (loading && !progressData) {
    return (
      <PageContainer className="py-10 sm:py-12 lg:py-16 space-y-10 sm:space-y-12">
        <div className="space-y-3">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-6 lg:gap-8">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-80" />
      </PageContainer>
    );
  }

  const hasChartData = progressData?.chartData && progressData.chartData.length > 0;

  return (
    <PageContainer className="py-10 sm:py-12 lg:py-16 space-y-10 sm:space-y-12">
      {/* ─── HEADER ────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="brand" size="sm">
              Health Analytics
            </Badge>
            <span className="text-xs text-slate-400">• Real-Time Bio-Metrics</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Progress Tracker 📊
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Evaluate your calorie deficit, weight trajectory, and lifestyle consistency.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Period Toggle */}
          <div className="glass-panel p-1 rounded-2xl flex items-center border border-slate-200/80 dark:border-white/10">
            {['week', 'month'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  period === p
                    ? 'bg-cyan-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {p === 'week' ? 'Past 7 Days' : 'Past 30 Days'}
              </button>
            ))}
          </div>

          <Button
            variant="accent"
            size="md"
            onClick={() => setShowLogForm(true)}
            leftIcon={todayEntry ? Edit3 : Plus}
          >
            {todayEntry ? "Edit Today's Entry" : "Log Today"}
          </Button>
        </div>
      </div>

      {/* ─── DIET PROGRESS BANNER ───────────────────────────────────────── */}
      {dietStats && dietStats.totalMeals > 0 && (
        <Card className="p-6 sm:p-8 border-cyan-500/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/25">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Diet Plan Adherence
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {dietStats.completedMealsCount} of {dietStats.totalMeals} meals logged (
                  {dietStats.completedDays} full days completed)
                </p>
              </div>
            </div>

            <div className="w-full md:w-80 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-500 dark:text-slate-400">Adherence</span>
                <span className="text-cyan-600 dark:text-cyan-400">
                  {dietStats.overallProgress}%
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${dietStats.overallProgress}%` }}
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* ─── SUMMARY METRICS CARDS ─────────────────────────────────────── */}
      {progressData?.summary && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          <Card className="p-5 sm:p-6 text-center">
            <Calendar className="w-5 h-5 text-cyan-500 mx-auto mb-1.5" />
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              <AnimatedCounter value={progressData.summary.totalDays || 0} />
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Days Tracked</p>
          </Card>

          <Card className="p-5 sm:p-6 text-center">
            <Flame className="w-5 h-5 text-amber-500 mx-auto mb-1.5" />
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              <AnimatedCounter value={progressData.summary.averageCaloriesConsumed || 0} />
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Avg Cal / Day</p>
          </Card>

          <Card className="p-5 sm:p-6 text-center">
            <Activity className="w-5 h-5 text-emerald-500 mx-auto mb-1.5" />
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              <AnimatedCounter value={progressData.summary.averageCaloriesBurned || 0} />
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Avg Burned</p>
          </Card>

          <Card className="p-5 sm:p-6 text-center">
            <TrendingUp className="w-5 h-5 text-indigo-500 mx-auto mb-1.5" />
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {progressData.summary.weightChange > 0 ? '+' : ''}
              <AnimatedCounter
                value={progressData.summary.weightChange || 0}
                decimals={1}
                suffix="kg"
              />
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Weight Shift</p>
          </Card>

          <Card className="p-5 sm:p-6 text-center">
            <Droplet className="w-5 h-5 text-cyan-400 mx-auto mb-1.5" />
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              <AnimatedCounter
                value={progressData.summary.averageWaterIntake || 0}
                decimals={1}
                suffix="L"
              />
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Avg Water</p>
          </Card>

          <Card className="p-5 sm:p-6 text-center">
            <Moon className="w-5 h-5 text-purple-400 mx-auto mb-1.5" />
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              <AnimatedCounter
                value={progressData.summary.averageSleepHours || 0}
                decimals={1}
                suffix="h"
              />
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Avg Sleep</p>
          </Card>
        </div>
      )}

      {/* ─── CHARTS CENTERPIECE ────────────────────────────────────────── */}
      {hasChartData ? (
        <div className="space-y-8 sm:space-y-10">
          {/* Weight Line Chart */}
          <Card className="p-6 sm:p-8">
            <CardHeader className="p-0 pb-6 flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-cyan-500" />
                  <span>Weight Trajectory</span>
                </CardTitle>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Visualizing body mass changes over your selected timeframe
                </p>
              </div>
              <Badge variant="brand" size="sm">
                Target Trend
              </Badge>
            </CardHeader>

            <div className="h-80 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(d) =>
                      new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
                    }
                    stroke="#94a3b8"
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} domain={['auto', 'auto']} />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    name="Weight (kg)"
                    stroke="#06b6d4"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#06b6d4' }}
                    activeDot={{ r: 7 }}
                    isAnimationActive={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Calorie Intake vs Burn Chart */}
          <Card className="p-6 sm:p-8">
            <CardHeader className="p-0 pb-6 flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-500" />
                  <span>Calorie Inflow vs Outflow</span>
                </CardTitle>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Daily consumed calories vs workout energy expenditure
                </p>
              </div>
              <Badge variant="warning" size="sm">
                Energy Balance
              </Badge>
            </CardHeader>

            <div className="h-80 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={progressData.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(d) =>
                      new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
                    }
                    stroke="#94a3b8"
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar
                    dataKey="caloriesConsumed"
                    name="Calories Consumed"
                    fill="#f59e0b"
                    radius={[6, 6, 0, 0]}
                    isAnimationActive={true}
                  />
                  <Bar
                    dataKey="caloriesBurned"
                    name="Calories Burned"
                    fill="#10b981"
                    radius={[6, 6, 0, 0]}
                    isAnimationActive={true}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Water & Sleep Side-by-Side */}
          <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
            <Card className="p-6 sm:p-8">
              <CardTitle className="text-base flex items-center gap-2 mb-4">
                <Droplet className="w-4 h-4 text-cyan-400" />
                <span>Hydration Tracking (Liters)</span>
              </CardTitle>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progressData.chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(d) =>
                        new Date(d).toLocaleDateString('en-IN', { day: '2-digit' })
                      }
                      stroke="#94a3b8"
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} />
                    <Tooltip content={<CustomChartTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="waterIntake"
                      name="Water (L)"
                      stroke="#06b6d4"
                      strokeWidth={2.5}
                      dot={{ r: 3 }}
                      isAnimationActive={true}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-6 sm:p-8">
              <CardTitle className="text-base flex items-center gap-2 mb-4">
                <Moon className="w-4 h-4 text-purple-400" />
                <span>Sleep Cycles (Hours)</span>
              </CardTitle>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progressData.chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(d) =>
                        new Date(d).toLocaleDateString('en-IN', { day: '2-digit' })
                      }
                      stroke="#94a3b8"
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} />
                    <Tooltip content={<CustomChartTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="sleepHours"
                      name="Sleep (hrs)"
                      stroke="#818cf8"
                      strokeWidth={2.5}
                      dot={{ r: 3 }}
                      isAnimationActive={true}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Activity}
          title="No Progress Entries Yet"
          description="Log your daily weight, calories consumed, water, and sleep to generate interactive analytics."
          action={
            <Button variant="primary" size="md" onClick={() => setShowLogForm(true)} leftIcon={Plus}>
              Log First Entry
            </Button>
          }
        />
      )}

      {/* ─── LOG PROGRESS MODAL ────────────────────────────────────────── */}
      <Modal
        isOpen={showLogForm}
        onClose={() => setShowLogForm(false)}
        title={todayEntry ? "Edit Today's Health Metrics" : "Log Today's Health Metrics"}
        description={todayEntry ? "Update your logged metrics for today." : "Record your weight, nutrition, hydration, and recovery."}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmitProgress} className="space-y-4 pt-2">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Weight (kg) *
              </label>
              <input
                type="number"
                step="0.1"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                required
                placeholder="e.g. 70.5"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Water Intake (Liters)
              </label>
              <input
                type="number"
                step="0.1"
                name="waterIntake"
                value={formData.waterIntake}
                onChange={handleInputChange}
                placeholder="e.g. 2.5"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Calories Consumed (kcal)
              </label>
              <input
                type="number"
                name="caloriesConsumed"
                value={formData.caloriesConsumed}
                onChange={handleInputChange}
                placeholder="e.g. 1850"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Calories Burned (Exercise)
              </label>
              <input
                type="number"
                name="caloriesBurned"
                value={formData.caloriesBurned}
                onChange={handleInputChange}
                placeholder="e.g. 350"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Sleep Duration (Hours)
              </label>
              <input
                type="number"
                step="0.5"
                name="sleepHours"
                value={formData.sleepHours}
                onChange={handleInputChange}
                placeholder="e.g. 7.5"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Today's Energy & Mood
              </label>
              <select
                name="mood"
                value={formData.mood}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="excellent">😄 High Energy & Great</option>
                <option value="good">😊 Good & On Track</option>
                <option value="okay">😐 Normal / Okay</option>
                <option value="tired">😴 Fatigued / Sore</option>
                <option value="stressed">😰 Stressed / Busy</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-white/10">
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => setShowLogForm(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={saving}
              leftIcon={Save}
            >
              {todayEntry ? 'Update Metrics' : 'Save Metrics'}
            </Button>
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
};

export default Progress;
