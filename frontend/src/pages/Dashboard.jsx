import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Activity, Target, TrendingUp, Flame, Droplet, Moon, Calendar } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [dietResponse, progressResponse] = await Promise.all([
        axios.get('http://localhost:3001/api/diet/plan'),
        axios.get('http://localhost:3001/api/progress/summary?period=week')
      ]);

      setStats({
        diet: dietResponse.data,
        progress: progressResponse.data
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="mt-4 text-slate-300 text-lg font-semibold">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const goalMap = {
    weight_loss: 'Weight Loss',
    weight_gain: 'Weight Gain',
    muscle_gain: 'Muscle Gain',
    maintenance: 'Maintenance'
  };

  const activityMap = {
    sedentary: 'Sedentary',
    light: 'Light',
    moderate: 'Moderate',
    active: 'Active',
    very_active: 'Very Active'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-3">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-slate-300 text-lg">
            Here's your fitness overview for today
          </p>
        </div>

        {/* Profile Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-slide-up">
          <div className="glass-dark p-6 rounded-2xl border border-white/10 shadow-2xl hover:shadow-cyan-500/20 transition-all transform hover:scale-105">
            <div className="text-cyan-400 mb-3">
              <Activity className="w-8 h-8" />
            </div>
            <div className="text-3xl font-black text-white">{user?.weight} kg</div>
            <div className="text-sm text-slate-400 font-semibold">Current Weight</div>
          </div>

          <div className="glass-dark p-6 rounded-2xl border border-white/10 shadow-2xl hover:shadow-blue-500/20 transition-all transform hover:scale-105">
            <div className="text-blue-400 mb-3">
              <Target className="w-8 h-8" />
            </div>
            <div className="text-3xl font-black text-white">
              {stats?.diet?.metrics?.bmi?.value || 'N/A'}
            </div>
            <div className="text-sm text-slate-400 font-semibold">BMI</div>
          </div>

          <div className="glass-dark p-6 rounded-2xl border border-white/10 shadow-2xl hover:shadow-orange-500/20 transition-all transform hover:scale-105">
            <div className="text-orange-400 mb-3">
              <Flame className="w-8 h-8" />
            </div>
            <div className="text-3xl font-black text-white">
              {stats?.diet?.metrics?.targetCalories || 0}
            </div>
            <div className="text-sm text-slate-400 font-semibold">Target Cal/Day</div>
          </div>

          <div className="glass-dark p-6 rounded-2xl border border-white/10 shadow-2xl hover:shadow-green-500/20 transition-all transform hover:scale-105">
            <div className="text-green-400 mb-3">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div className="text-3xl font-black text-white">
              {goalMap[user?.goal] || 'N/A'}
            </div>
            <div className="text-sm text-slate-400 font-semibold">Your Goal</div>
          </div>
        </div>

        {/* Metabolic Info */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="glass-dark p-6 rounded-2xl border border-white/10 shadow-2xl">
            <h3 className="text-2xl font-black text-white mb-6">Your Metabolic Rate 🔥</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded-xl">
                <span className="text-slate-300 font-semibold">BMR (Basal Metabolic Rate)</span>
                <span className="text-3xl font-black text-cyan-400">{stats?.diet?.metrics?.bmr || 0} cal</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded-xl">
                <span className="text-slate-300 font-semibold">TDEE (Total Daily Energy)</span>
                <span className="text-3xl font-black text-purple-400">{stats?.diet?.metrics?.tdee || 0} cal</span>
              </div>
            </div>
          </div>

          <div className="glass-dark p-6 rounded-2xl border border-white/10 shadow-2xl">
            <h3 className="text-2xl font-black text-white mb-6">Daily Macros Target 🎯</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded-xl">
                <span className="text-slate-300 font-semibold">Protein</span>
                <span className="text-2xl font-black text-red-400">{stats?.diet?.macros?.protein || 0}g</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded-xl">
                <span className="text-slate-300 font-semibold">Carbs</span>
                <span className="text-2xl font-black text-yellow-400">{stats?.diet?.macros?.carbs || 0}g</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded-xl">
                <span className="text-slate-300 font-semibold">Fats</span>
                <span className="text-2xl font-black text-blue-400">{stats?.diet?.macros?.fats || 0}g</span>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Progress */}
        {stats?.progress?.summary && (
          <div className="glass-dark p-6 rounded-2xl border border-white/10 shadow-2xl mb-8">
            <h3 className="text-2xl font-black text-white mb-6">Weekly Progress Summary 📊</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-slate-800/50 rounded-xl border border-white/10">
                <Calendar className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                <div className="text-3xl font-black text-white">
                  {stats.progress.summary.totalDays}
                </div>
                <div className="text-sm text-slate-400 font-semibold">Days Tracked</div>
              </div>

              <div className="text-center p-4 bg-slate-800/50 rounded-xl border border-white/10">
                <Flame className="w-8 h-8 text-orange-400 mx-auto mb-3" />
                <div className="text-3xl font-black text-white">
                  {stats.progress.summary.averageCaloriesConsumed}
                </div>
                <div className="text-sm text-slate-400 font-semibold">Avg Calories/Day</div>
              </div>

              <div className="text-center p-4 bg-slate-800/50 rounded-xl border border-white/10">
                <Activity className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <div className="text-3xl font-black text-white">
                  {stats.progress.summary.totalWorkouts}
                </div>
                <div className="text-sm text-slate-400 font-semibold">Total Workouts</div>
              </div>

              <div className="text-center p-4 bg-slate-800/50 rounded-xl border border-white/10">
                <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <div className="text-3xl font-black text-white">
                  {stats.progress.summary.weightChange > 0 ? '+' : ''}
                  {stats.progress.summary.weightChange?.toFixed(1)} kg
                </div>
                <div className="text-sm text-slate-400 font-semibold">Weight Change</div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <a href="/diet" className="glass-dark p-6 rounded-2xl border border-white/10 shadow-2xl hover:shadow-orange-500/30 hover:scale-105 hover:border-orange-500/50 transition-all group cursor-pointer">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
              <Flame className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-black text-white mb-2">View Diet Plan</h3>
            <p className="text-slate-400">Get your personalized Indian meal plan</p>
          </a>

          <a href="/workout" className="glass-dark p-6 rounded-2xl border border-white/10 shadow-2xl hover:shadow-green-500/30 hover:scale-105 hover:border-green-500/50 transition-all group cursor-pointer">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-black text-white mb-2">Start Workout</h3>
            <p className="text-slate-400">Access your custom exercise routine</p>
          </a>

          <a href="/todos" className="glass-dark p-6 rounded-2xl border border-white/10 shadow-2xl hover:shadow-blue-500/30 hover:scale-105 hover:border-blue-500/50 transition-all group cursor-pointer">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
              <span className="text-4xl">✅</span>
            </div>
            <h3 className="text-xl font-black text-white mb-2">My Tasks</h3>
            <p className="text-slate-400">Track your daily fitness tasks</p>
          </a>

          <a href="/chatbot" className="glass-dark p-6 rounded-2xl border border-white/10 shadow-2xl hover:shadow-purple-500/30 hover:scale-105 hover:border-purple-500/50 transition-all group cursor-pointer">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
              <span className="text-4xl">🤖</span>
            </div>
            <h3 className="text-xl font-black text-white mb-2">Ask NutriBot</h3>
            <p className="text-slate-400">Get instant fitness and diet advice</p>
          </a>
        </div>

        {/* Tips Section */}
        {stats?.diet?.tips && (
          <div className="mt-8 glass-dark p-6 rounded-2xl border border-white/10 shadow-2xl">
            <h3 className="text-2xl font-black text-white mb-6">💡 Tips for Your Goal</h3>
            <ul className="space-y-2">
              {stats.diet.tips.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-cyan-400 mr-3 text-xl">✓</span>
                  <span className="text-slate-300">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
