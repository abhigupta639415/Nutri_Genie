import React, { useState, useEffect } from 'react';
import { 
  Dumbbell, Heart, Flame, TrendingUp, RefreshCw, ChevronDown, 
  CheckCircle2, Circle, Calendar, Clock, Target, Zap 
} from 'lucide-react';
import { fatLossWorkouts } from '../data/fatLossWorkouts';
import { muscleGainWorkouts } from '../data/muscleGainWorkouts';
import { stayFitWorkouts } from '../data/stayFitWorkouts';

const Workout = () => {
  const [selectedGoal, setSelectedGoal] = useState('fatLoss');
  const [selectedLevel, setSelectedLevel] = useState('beginner');
  const [workoutPlan, setWorkoutPlan] = useState([]);
  const [completedDays, setCompletedDays] = useState({});
  const [planKey, setPlanKey] = useState(0);

  const allWorkouts = {
    fatLoss: fatLossWorkouts,
    muscleGain: muscleGainWorkouts,
    stayFit: stayFitWorkouts
  };

  const goalOptions = [
    { value: 'fatLoss', label: 'Fat Loss', icon: Flame, color: 'from-red-500 to-orange-500' },
    { value: 'muscleGain', label: 'Muscle Gain', icon: Dumbbell, color: 'from-blue-500 to-cyan-500' },
    { value: 'stayFit', label: 'Stay Fit', icon: Heart, color: 'from-green-500 to-emerald-500' }
  ];

  const levelOptions = [
    { value: 'beginner', label: 'Beginner', color: 'bg-green-500' },
    { value: 'intermediate', label: 'Intermediate', color: 'bg-yellow-500' },
    { value: 'advanced', label: 'Advanced', color: 'bg-red-500' }
  ];

  const typeColors = {
    yoga: 'from-purple-500 to-pink-500',
    cardio: 'from-red-500 to-orange-500',
    hiit: 'from-orange-500 to-yellow-500',
    strength: 'from-blue-500 to-cyan-500',
    rest: 'from-slate-500 to-slate-600'
  };

  const typeIcons = {
    yoga: Heart,
    cardio: Zap,
    hiit: Flame,
    strength: Dumbbell,
    rest: Calendar
  };

  useEffect(() => {
    loadWorkoutPlan();
    loadCompletedDays();
  }, [selectedGoal, selectedLevel, planKey]);

  const loadWorkoutPlan = () => {
    const plan = allWorkouts[selectedGoal][selectedLevel];
    setWorkoutPlan(plan);
  };

  const loadCompletedDays = () => {
    const storageKey = `workout_${selectedGoal}_${selectedLevel}_${planKey}`;
    const saved = localStorage.getItem(storageKey);
    setCompletedDays(saved ? JSON.parse(saved) : {});
  };

  const toggleDayCompletion = (dayNum) => {
    const storageKey = `workout_${selectedGoal}_${selectedLevel}_${planKey}`;
    const updated = {
      ...completedDays,
      [dayNum]: !completedDays[dayNum]
    };
    setCompletedDays(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const regeneratePlan = () => {
    setPlanKey(prev => prev + 1);
    setCompletedDays({});
  };

  const getCompletionPercentage = () => {
    const completed = Object.values(completedDays).filter(Boolean).length;
    return Math.round((completed / 7) * 100);
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
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-3">
            Your 7-Day Workout Plan 💪
          </h1>
          <p className="text-slate-300 text-lg">
            Personalized workout routines tailored to your goals and fitness level
          </p>
        </div>

        {/* Goal and Level Selection */}
        <div className="mb-8 space-y-6">
          {/* Goal Selection */}
          <div className="glass-dark p-6 rounded-2xl border border-white/10 shadow-2xl">
            <label className="block text-white font-bold text-lg mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-cyan-400" />
              Select Your Goal
            </label>
            <div className="grid md:grid-cols-3 gap-4">
              {goalOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => setSelectedGoal(option.value)}
                    className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                      selectedGoal === option.value
                        ? `bg-gradient-to-r ${option.color} border-white/50 shadow-2xl scale-105`
                        : 'bg-slate-800/50 border-white/10 hover:border-white/30 hover:scale-102'
                    }`}
                  >
                    <Icon className={`w-12 h-12 mx-auto mb-3 ${selectedGoal === option.value ? 'text-white' : 'text-slate-400'}`} />
                    <div className={`text-xl font-bold ${selectedGoal === option.value ? 'text-white' : 'text-slate-300'}`}>
                      {option.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Level Selection */}
          <div className="glass-dark p-6 rounded-2xl border border-white/10 shadow-2xl">
            <label className="block text-white font-bold text-lg mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-purple-400" />
              Select Your Fitness Level
            </label>
            <div className="grid md:grid-cols-3 gap-4">
              {levelOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedLevel(option.value)}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                    selectedLevel === option.value
                      ? `${option.color} border-white/50 shadow-2xl scale-105`
                      : 'bg-slate-800/50 border-white/10 hover:border-white/30 hover:scale-102'
                  }`}
                >
                  <div className={`text-xl font-bold ${selectedLevel === option.value ? 'text-white' : 'text-slate-300'}`}>
                    {option.label}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="mb-8 glass-dark p-6 rounded-2xl border border-white/10 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-black text-white">Weekly Progress</h3>
              <p className="text-slate-400">Keep track of your completed workouts</p>
            </div>
            <button
              onClick={regeneratePlan}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <RefreshCw className="w-5 h-5" />
              Regenerate Plan
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm text-slate-300 mb-2">
              <span>Completion</span>
              <span className="font-bold text-cyan-400">{getCompletionPercentage()}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-purple-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${getCompletionPercentage()}%` }}
              ></div>
            </div>
          </div>

          {/* Week Overview */}
          <div className="grid grid-cols-7 gap-2">
            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
              <div
                key={day}
                className={`aspect-square rounded-lg flex items-center justify-center font-bold transition-all ${
                  completedDays[day]
                    ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white'
                    : 'bg-slate-700 text-slate-400'
                }`}
              >
                {day}
              </div>
            ))}
          </div>
        </div>

        {/* 7-Day Workout Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workoutPlan.map((day) => {
            const TypeIcon = typeIcons[day.type];
            const isCompleted = completedDays[day.day];
            
            return (
              <div
                key={day.day}
                className={`glass-dark rounded-2xl border shadow-2xl overflow-hidden transition-all duration-300 hover:scale-105 ${
                  isCompleted ? 'border-green-500/50' : 'border-white/10'
                } ${day.isRestDay ? 'opacity-75' : ''}`}
              >
                {/* Card Header */}
                <div className={`bg-gradient-to-r ${typeColors[day.type]} p-6 text-white relative`}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-sm font-semibold opacity-90">Day {day.day}</div>
                      <h3 className="text-2xl font-black">{day.name}</h3>
                    </div>
                    <button
                      onClick={() => toggleDayCompletion(day.day)}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all"
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <Circle className="w-6 h-6" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-sm opacity-90 capitalize">
                    <TypeIcon className="w-4 h-4" />
                    <span>{day.type} Workout</span>
                  </div>
                </div>

                {/* Rest Day Badge */}
                {day.isRestDay && (
                  <div className="bg-yellow-500/20 border-y border-yellow-500/30 px-6 py-2">
                    <p className="text-yellow-400 font-semibold text-sm flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Rest & Recovery Day
                    </p>
                  </div>
                )}

                {/* Exercises List */}
                <div className="p-6">
                  <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wide">Exercises</h4>
                  <div className="space-y-3">
                    {day.exercises.map((exercise, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-800/50 rounded-xl p-4 border border-white/10 hover:border-cyan-500/50 transition-all"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="font-semibold text-white text-sm">{exercise.name}</div>
                          <div className="flex items-center gap-1 text-xs text-cyan-400">
                            <Clock className="w-3 h-3" />
                            {exercise.duration}
                          </div>
                        </div>
                        <div className="flex gap-4 text-xs text-slate-400">
                          {exercise.sets !== '-' && (
                            <span className="flex items-center gap-1">
                              <span className="font-semibold text-slate-300">{exercise.sets}</span> sets
                            </span>
                          )}
                          {exercise.reps !== '-' && (
                            <span className="flex items-center gap-1">
                              <span className="font-semibold text-slate-300">{exercise.reps}</span> reps
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tips Section */}
        <div className="mt-8 glass-dark p-8 rounded-2xl border-2 border-cyan-500/50 shadow-2xl">
          <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
            <Zap className="w-8 h-8 text-cyan-400" />
            Pro Tips
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-slate-300">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
              <div>
                <div className="font-bold text-white mb-1">Stay Consistent</div>
                <div className="text-sm">Complete all 7 days for best results and track your progress daily</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
              <div>
                <div className="font-bold text-white mb-1">Warm-Up First</div>
                <div className="text-sm">Always spend 5-10 minutes warming up before starting your workout</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
              <div>
                <div className="font-bold text-white mb-1">Listen to Your Body</div>
                <div className="text-sm">Take extra rest if needed and don't push through pain</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
              <div>
                <div className="font-bold text-white mb-1">Stay Hydrated</div>
                <div className="text-sm">Drink plenty of water before, during, and after your workouts</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.2); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .glass-dark {
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(12px);
        }
      `}</style>
    </div>
  );
};

export default Workout;
