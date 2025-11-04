import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dumbbell, Clock, Flame, TrendingUp, Home, Building2 } from 'lucide-react';

const Workout = () => {
  const [workoutData, setWorkoutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState('home');

  useEffect(() => {
    fetchWorkoutPlan();
  }, [location]);

  const fetchWorkoutPlan = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3001/api/workout/plan?location=${location}`);
      setWorkoutData(response.data);
    } catch (error) {
      console.error('Error fetching workout plan:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="mt-4 text-slate-300 text-lg font-semibold">Creating your workout plan...</p>
        </div>
      </div>
    );
  }

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  };

  const typeColors = {
    yoga: 'from-purple-500 to-pink-500',
    cardio: 'from-red-500 to-orange-500',
    hiit: 'from-orange-500 to-yellow-500',
    strength: 'from-blue-500 to-cyan-500'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-3">
            Your Workout Plan 💪
          </h1>
          <p className="text-slate-300 text-lg">
            Personalized exercises based on your fitness level and goals
          </p>
        </div>

        {/* Location Toggle */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex glass-dark rounded-xl border border-white/10 shadow-2xl p-1">
            <button
              onClick={() => setLocation('home')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all ${
                location === 'home'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                  : 'text-slate-400 hover:bg-white/5'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="font-semibold">Home Workout</span>
            </button>
            <button
              onClick={() => setLocation('gym')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all ${
                location === 'gym'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                  : 'text-slate-400 hover:bg-white/5'
              }`}
            >
              <Building2 className="w-5 h-5" />
              <span className="font-semibold">Gym Workout</span>
            </button>
          </div>
        </div>

        {/* Workout Summary */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="glass-dark p-6 rounded-2xl border border-white/10 shadow-2xl hover:scale-105 transition-all">
            <Dumbbell className="w-10 h-10 mb-3 text-cyan-400" />
            <div className="text-4xl font-black text-white">{workoutData?.plan?.exercises?.length || 0}</div>
            <div className="text-slate-400 font-semibold">Total Exercises</div>
          </div>

          <div className="glass-dark p-6 rounded-2xl border border-white/10 shadow-2xl hover:scale-105 transition-all">
            <Clock className="w-10 h-10 mb-3 text-orange-400" />
            <div className="text-4xl font-black text-white">{workoutData?.plan?.totalDuration || 0}</div>
            <div className="text-slate-400 font-semibold">Minutes Total</div>
          </div>

          <div className="glass-dark p-6 rounded-2xl border border-white/10 shadow-2xl hover:scale-105 transition-all">
            <Flame className="w-10 h-10 mb-3 text-red-400" />
            <div className="text-4xl font-black text-white">{workoutData?.plan?.totalCaloriesBurned || 0}</div>
            <div className="text-slate-400 font-semibold">Calories Burned</div>
          </div>
        </div>

        {/* Exercise Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {workoutData?.plan?.exercises?.map((exercise, index) => (
            <div key={index} className="glass-dark rounded-2xl border border-white/10 shadow-2xl overflow-hidden hover:scale-105 transition-all">
              <div className={`bg-gradient-to-r ${typeColors[exercise.type] || 'from-gray-500 to-gray-700'} p-6 text-white`}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-2xl font-bold">{exercise.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${difficultyColors[exercise.difficulty]}`}>
                    {exercise.difficulty}
                  </span>
                </div>
                <p className="text-sm opacity-90 capitalize">{exercise.type} Exercise</p>
              </div>

              <div className="p-6">
                <p className="text-slate-300 mb-4">{exercise.description}</p>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-slate-800/50 rounded-xl border border-white/10">
                    <Clock className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                    <div className="text-2xl font-black text-white">{exercise.duration}</div>
                    <div className="text-xs text-slate-400 font-semibold">minutes</div>
                  </div>

                  <div className="text-center p-3 bg-slate-800/50 rounded-xl border border-white/10">
                    <Flame className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                    <div className="text-2xl font-black text-white">{exercise.caloriesBurned}</div>
                    <div className="text-xs text-slate-400 font-semibold">calories</div>
                  </div>

                  <div className="text-center p-3 bg-slate-800/50 rounded-xl border border-white/10">
                    <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
                    <div className="text-2xl font-black text-white">{exercise.caloriesPerMin}</div>
                    <div className="text-xs text-slate-400 font-semibold">cal/min</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Guidelines */}
        {workoutData?.guidelines && (
          <div className="glass-dark p-6 rounded-2xl border border-white/10 shadow-2xl mb-8">
            <h3 className="text-2xl font-black text-white mb-6">📋 Workout Guidelines</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-800/50 rounded-xl border border-white/10">
                <div className="text-sm text-slate-400 font-semibold">Frequency</div>
                <div className="text-xl font-black text-white">{workoutData.guidelines.frequency}</div>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-xl border border-white/10">
                <div className="text-sm text-slate-400 font-semibold">Focus Area</div>
                <div className="text-xl font-black text-white">{workoutData.guidelines.focus}</div>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-xl border border-white/10">
                <div className="text-sm text-slate-400 font-semibold">Duration</div>
                <div className="text-xl font-black text-white">{workoutData.guidelines.duration}</div>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-xl border border-white/10">
                <div className="text-sm text-slate-400 font-semibold">Intensity</div>
                <div className="text-xl font-black text-white">{workoutData.guidelines.intensity}</div>
              </div>
            </div>
          </div>
        )}

        {/* Safety Tips */}
        {workoutData?.safetyTips && (
          <div className="glass-dark p-6 rounded-2xl border-2 border-yellow-500/50 shadow-2xl shadow-yellow-500/20">
            <h3 className="text-2xl font-black text-white mb-6">⚠️ Safety Tips</h3>
            <ul className="space-y-2">
              {workoutData.safetyTips.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-yellow-400 mr-3 text-xl">•</span>
                  <span className="text-slate-300">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommendation */}
        {workoutData?.plan?.recommendation && (
          <div className="mt-8 glass-dark p-8 rounded-2xl border-2 border-green-500/50 shadow-2xl shadow-green-500/20 text-center">
            <p className="text-xl font-bold text-white">{workoutData.plan.recommendation}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Workout;
