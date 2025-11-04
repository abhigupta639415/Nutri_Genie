import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp, Activity, Flame, Droplet, Moon } from 'lucide-react';

const Progress = () => {
  const [progressData, setProgressData] = useState(null);
  const [period, setPeriod] = useState('week');
  const [loading, setLoading] = useState(true);

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
