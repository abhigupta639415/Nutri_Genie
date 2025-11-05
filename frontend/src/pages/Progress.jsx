import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp, Activity, Flame, Droplet, Moon, Plus, Smile, Save } from 'lucide-react';

const Progress = () => {
  const [progressData, setProgressData] = useState(null);
  const [period, setPeriod] = useState('week');
  const [loading, setLoading] = useState(true);
  const [showLogForm, setShowLogForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    caloriesConsumed: '',
    caloriesBurned: '',
    weight: '',
    waterIntake: '',
    sleepHours: '',
    mood: 'okay'
  });

  useEffect(() => {
    fetchProgress();
  }, [period]);

  const fetchProgress = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3001/api/progress/summary?period=${period}`);
      setProgressData(response.data);
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitProgress = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3001/api/progress', {
        caloriesConsumed: parseInt(formData.caloriesConsumed) || 0,
        caloriesBurned: parseInt(formData.caloriesBurned) || 0,
        weight: parseFloat(formData.weight),
        waterIntake: parseFloat(formData.waterIntake) || 0,
        sleepHours: parseFloat(formData.sleepHours) || 0,
        mood: formData.mood
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Reset form and refresh data
      setFormData({
        caloriesConsumed: '',
        caloriesBurned: '',
        weight: '',
        waterIntake: '',
        sleepHours: '',
        mood: 'okay'
      });
      setShowLogForm(false);
      fetchProgress();
      alert('Progress logged successfully! 🎉');
    } catch (error) {
      console.error('Error logging progress:', error);
      alert('Failed to log progress. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="mt-4 text-slate-300 text-lg font-semibold">Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center animate-fade-in">
          <div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-3">
              Progress Tracker 📊
            </h1>
            <p className="text-slate-300 text-lg">
              Monitor your fitness journey with detailed analytics
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex space-x-2">
            <button
              onClick={() => setShowLogForm(!showLogForm)}
              className="px-5 py-3 rounded-xl font-bold transition-all bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30 hover:shadow-green-500/50 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Log Progress
            </button>
            {['week', 'month'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-5 py-3 rounded-xl font-bold transition-all ${
                  period === p
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/30'
                    : 'glass-dark text-slate-300 border border-white/10 hover:border-cyan-500/50'
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Log Progress Form */}
        {showLogForm && (
          <div className="mb-8 glass-dark p-8 rounded-2xl border border-green-500/30 shadow-2xl animate-fade-in">
            <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3">
              <Activity className="w-8 h-8 text-green-400" />
              Log Today's Progress
            </h2>
            <form onSubmit={handleSubmitProgress} className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-slate-300 font-semibold mb-2">
                  <Flame className="w-4 h-4 inline mr-2 text-orange-400" />
                  Calories Consumed
                </label>
                <input
                  type="number"
                  name="caloriesConsumed"
                  value={formData.caloriesConsumed}
                  onChange={handleInputChange}
                  placeholder="e.g., 2000"
                  className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-2">
                  <Activity className="w-4 h-4 inline mr-2 text-green-400" />
                  Calories Burned
                </label>
                <input
                  type="number"
                  name="caloriesBurned"
                  value={formData.caloriesBurned}
                  onChange={handleInputChange}
                  placeholder="e.g., 500"
                  className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-2">
                  <TrendingUp className="w-4 h-4 inline mr-2 text-blue-400" />
                  Current Weight (kg) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  placeholder="e.g., 70.5"
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-2">
                  <Droplet className="w-4 h-4 inline mr-2 text-cyan-400" />
                  Water Intake (liters)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="waterIntake"
                  value={formData.waterIntake}
                  onChange={handleInputChange}
                  placeholder="e.g., 2.5"
                  className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-2">
                  <Moon className="w-4 h-4 inline mr-2 text-purple-400" />
                  Sleep Hours
                </label>
                <input
                  type="number"
                  step="0.5"
                  name="sleepHours"
                  value={formData.sleepHours}
                  onChange={handleInputChange}
                  placeholder="e.g., 7.5"
                  className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-2">
                  <Smile className="w-4 h-4 inline mr-2 text-yellow-400" />
                  Mood
                </label>
                <select
                  name="mood"
                  value={formData.mood}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition"
                >
                  <option value="excellent">😄 Excellent</option>
                  <option value="good">😊 Good</option>
                  <option value="okay">😐 Okay</option>
                  <option value="tired">😴 Tired</option>
                  <option value="stressed">😰 Stressed</option>
                </select>
              </div>

              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  disabled={saving || !formData.weight}
                  className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-green-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Progress
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowLogForm(false)}
                  className="px-8 py-4 glass-dark text-slate-300 rounded-xl font-bold hover:bg-slate-700 transition-all border border-white/10"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Summary Cards */}
        {progressData?.summary && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className="glass-dark p-6 rounded-2xl border border-white/10 shadow-2xl hover:scale-105 transition-all">
              <Calendar className="w-8 h-8 text-cyan-400 mb-3" />
              <div className="text-3xl font-black text-white">{progressData.summary.totalDays}</div>
              <div className="text-sm text-slate-400 font-semibold">Days Tracked</div>
            </div>

            <div className="glass-dark p-6 rounded-2xl border border-white/10 shadow-2xl hover:scale-105 transition-all">
              <Flame className="w-8 h-8 text-orange-400 mb-3" />
              <div className="text-3xl font-black text-white">{progressData.summary.averageCaloriesConsumed}</div>
              <div className="text-sm text-slate-400 font-semibold">Avg Cal/Day</div>
            </div>

            <div className="glass-dark p-6 rounded-2xl border border-white/10 shadow-2xl hover:scale-105 transition-all">
              <Activity className="w-8 h-8 text-green-400 mb-3" />
              <div className="text-3xl font-black text-white">{progressData.summary.averageCaloriesBurned}</div>
              <div className="text-sm text-slate-400 font-semibold">Avg Burned</div>
            </div>

            <div className="glass-dark p-6 rounded-2xl border border-white/10 shadow-2xl hover:scale-105 transition-all">
              <TrendingUp className="w-8 h-8 text-blue-400 mb-3" />
              <div className="text-3xl font-black text-white">
                {progressData.summary.weightChange > 0 ? '+' : ''}
                {progressData.summary.weightChange?.toFixed(1)}kg
              </div>
              <div className="text-sm text-slate-400 font-semibold">Weight Change</div>
            </div>

            <div className="glass-dark p-6 rounded-2xl border border-white/10 shadow-2xl hover:scale-105 transition-all">
              <Droplet className="w-8 h-8 text-cyan-400 mb-3" />
              <div className="text-3xl font-black text-white">{progressData.summary.averageWaterIntake}</div>
              <div className="text-sm text-slate-400 font-semibold">Avg Water (L)</div>
            </div>

            <div className="glass-dark p-6 rounded-2xl border border-white/10 shadow-2xl hover:scale-105 transition-all">
              <Moon className="w-8 h-8 text-purple-400 mb-3" />
              <div className="text-3xl font-black text-white">{progressData.summary.averageSleepHours}</div>
              <div className="text-sm text-slate-400 font-semibold">Avg Sleep (hrs)</div>
            </div>
          </div>
        )}

        {/* Weight Progress Chart */}
        {progressData?.chartData && progressData.chartData.length > 0 && (
          <div className="glass-dark p-6 rounded-2xl border border-white/10 shadow-2xl mb-8">
            <h3 className="text-2xl font-black text-white mb-6">Weight Progress 📈</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progressData.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  stroke="#9CA3AF"
                />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                  labelFormatter={(date) => new Date(date).toLocaleDateString('en-IN')}
                />
                <Legend />
                <Line type="monotone" dataKey="weight" stroke="#06b6d4" strokeWidth={3} name="Weight (kg)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Calories Chart */}
        {progressData?.chartData && progressData.chartData.length > 0 && (
          <div className="glass-dark p-6 rounded-2xl border border-white/10 shadow-2xl mb-8">
            <h3 className="text-2xl font-black text-white mb-6">Calorie Intake vs Burn 🔥</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={progressData.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  stroke="#9CA3AF"
                />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                  labelFormatter={(date) => new Date(date).toLocaleDateString('en-IN')}
                />
                <Legend />
                <Bar dataKey="caloriesConsumed" fill="#f97316" name="Calories Consumed" />
                <Bar dataKey="caloriesBurned" fill="#10b981" name="Calories Burned" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Lifestyle Metrics */}
        {progressData?.chartData && progressData.chartData.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-dark p-6 rounded-2xl border border-white/10 shadow-2xl">
              <h3 className="text-2xl font-black text-white mb-6">Water Intake 💧</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={progressData.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => new Date(date).toLocaleDateString('en-IN', { day: '2-digit' })}
                    stroke="#9CA3AF"
                  />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="waterIntake" stroke="#06b6d4" strokeWidth={2} name="Water (L)" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="glass-dark p-6 rounded-2xl border border-white/10 shadow-2xl">
              <h3 className="text-2xl font-black text-white mb-6">Sleep Hours 😴</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={progressData.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => new Date(date).toLocaleDateString('en-IN', { day: '2-digit' })}
                    stroke="#9CA3AF"
                  />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="sleepHours" stroke="#a855f7" strokeWidth={2} name="Sleep (hrs)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* No Data Message */}
        {(!progressData?.chartData || progressData.chartData.length === 0) && (
          <div className="glass-dark p-12 rounded-2xl border border-white/10 shadow-2xl text-center">
            <Activity className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-2xl font-black text-white mb-3">No Progress Data Yet</h3>
            <p className="text-slate-400 text-lg">
              Start tracking your daily progress to see your analytics here
            </p>
          </div>
        )}

        {/* Motivation */}
        {progressData?.summary && progressData.summary.totalWorkouts > 0 && (
          <div className="mt-8 glass-dark p-8 rounded-2xl border-2 border-cyan-500/50 shadow-2xl shadow-cyan-500/20 text-center">
            <h3 className="text-3xl font-black text-white mb-3">🎉 Great Progress!</h3>
            <p className="text-xl text-slate-300">
              You've completed <span className="text-cyan-400 font-bold">{progressData.summary.totalWorkouts}</span> workouts this {period}. Keep it up! 💪
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress;
