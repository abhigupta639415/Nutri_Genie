import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { getMealsByPreference } from '../data/mealDatabase';
import { Coffee, Sun, Moon as MoonIcon, Apple, Check, Target, Flame, ChevronLeft, ChevronRight, Award, Zap, CheckCircle, Calendar, Clock, Settings, Sparkles } from 'lucide-react';

// ─── Category-Based Food Image System ──────────────────────────────────────
// Each category gets a unique, curated Unsplash photo for better visual matching
const foodCategoryImages = {
  dosa_crepe:      'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400&h=300&fit=crop',
  idli_vada:       'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=300&fit=crop',
  paratha_bread:   'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400&h=300&fit=crop',
  poha_flattened:  'https://images.unsplash.com/photo-1613292443284-8d10ef9383fe?w=400&h=300&fit=crop',
  upma_semolina:   'https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&h=300&fit=crop',
  paneer_dish:     'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop',
  dal_lentils:     'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
  rice_biryani:    'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop',
  curry_sabzi:     'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
  naan_kulcha:     'https://images.unsplash.com/photo-1566843972142-a7fcb70de4a3?w=400&h=300&fit=crop',
  egg_dish:        'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=300&fit=crop',
  salad_fresh:     'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop',
  soup_stew:       'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop',
  fruit_fresh:     'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&h=300&fit=crop',
  nuts_seeds:      'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop',
  yogurt_dairy:    'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop',
  sandwich_wrap:   'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop',
  oats_cereal:     'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=400&h=300&fit=crop',
  pasta_noodles:   'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop',
  chaat_snack:     'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop',
  dhokla_steamed:  'https://images.unsplash.com/photo-1626082910972-91e78935c13e?w=400&h=300&fit=crop',
  smoothie_drink:  'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400&h=300&fit=crop',
  corn_roasted:    'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&h=300&fit=crop',
  khichdi_comfort: 'https://images.unsplash.com/photo-1645696141596-79c1c49730ca?w=400&h=300&fit=crop',
  tofu_soy:        'https://images.unsplash.com/photo-1546069901-eacef0df6022?w=400&h=300&fit=crop',
  quinoa_grain:    'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
  cookie_biscuit:  'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop',
  banana_fruit:    'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop',
  sweet_halwa:     'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop',
};

const defaultMealImages = {
  breakfast: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&h=300&fit=crop',
  lunch:     'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
  dinner:    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
  snacks:    'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop',
};

// Smart food categorization — matches meal names to image categories
const categorizeMeal = (mealName) => {
  const n = mealName.toLowerCase();
  if (/dosa|uttapam|pesarattu|cheela|chilla/.test(n)) return 'dosa_crepe';
  if (/idli|vada|medu/.test(n)) return 'idli_vada';
  if (/paratha|puri|roti|chapati|thepla|bhatura|stuffed roti/.test(n)) return 'paratha_bread';
  if (/poha/.test(n)) return 'poha_flattened';
  if (/upma|vermicelli/.test(n)) return 'upma_semolina';
  if (/paneer/.test(n)) return 'paneer_dish';
  if (/\bdal\b|lentil|sambar|kadhi|rajma|chole|chana masala/.test(n)) return 'dal_lentils';
  if (/biryani|pulao|rice|jeera rice|fried rice/.test(n)) return 'rice_biryani';
  if (/naan|kulcha/.test(n)) return 'naan_kulcha';
  if (/egg|omelette|bhurji/.test(n)) return 'egg_dish';
  if (/salad|sprout/.test(n)) return 'salad_fresh';
  if (/soup/.test(n)) return 'soup_stew';
  if (/banana/.test(n)) return 'banana_fruit';
  if (/fruit|apple|chaat/.test(n)) return 'fruit_fresh';
  if (/nut|almond|walnut|cashew|peanut|seed|trail mix|makhana/.test(n)) return 'nuts_seeds';
  if (/yogurt|curd|raita|buttermilk/.test(n)) return 'yogurt_dairy';
  if (/sandwich|wrap|bread/.test(n)) return 'sandwich_wrap';
  if (/oats|corn flakes|cereal/.test(n)) return 'oats_cereal';
  if (/pasta|noodle/.test(n)) return 'pasta_noodles';
  if (/bhel|bhel puri/.test(n)) return 'chaat_snack';
  if (/dhokla/.test(n)) return 'dhokla_steamed';
  if (/smoothie/.test(n)) return 'smoothie_drink';
  if (/corn/.test(n)) return 'corn_roasted';
  if (/khichdi/.test(n)) return 'khichdi_comfort';
  if (/tofu|soya/.test(n)) return 'tofu_soy';
  if (/quinoa|millet/.test(n)) return 'quinoa_grain';
  if (/cookie|biscuit|crackers/.test(n)) return 'cookie_biscuit';
  if (/halwa|suji/.test(n)) return 'sweet_halwa';
  if (/sabudana/.test(n)) return 'chaat_snack';
  if (/cutlet|pakora/.test(n)) return 'chaat_snack';
  if (/kofta|korma|curry|masala|aloo|gobi|bhindi|mushroom|dum/.test(n)) return 'curry_sabzi';
  return null;
};

const getMealImage = (mealType, mealName) => {
  const category = categorizeMeal(mealName);
  if (category && foodCategoryImages[category]) return foodCategoryImages[category];
  return defaultMealImages[mealType];
};

// Food emoji for each meal type
const mealEmojis = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
  snacks: '🍎',
};

// Meals are now loaded from ../data/mealDatabase.js based on user's dietary preference
// ─── Duration Presets ───────────────────────────────────────────────────────
const DURATION_PRESETS = [
  { label: '1 Week', days: 7, icon: '⚡' },
  { label: '2 Weeks', days: 14, icon: '🔥' },
  { label: '1 Month', days: 30, icon: '💪' },
  { label: '2 Months', days: 60, icon: '🏆' },
  { label: '3 Months', days: 90, icon: '👑' },
];

// ─── Main Component ─────────────────────────────────────────────────────────
const DietPlan = () => {
  const { user } = useAuth();
  const [dietData, setDietData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [completedMeals, setCompletedMeals] = useState({});
  const [showDurationPicker, setShowDurationPicker] = useState(false);

  // ── Plan Duration (per-user, from localStorage) ──
  const getDurationKey = useCallback(() => {
    const userId = user?._id || user?.id || 'guest';
    return `nutrigenie_plan_duration_${userId}`;
  }, [user]);

  const [planDuration, setPlanDuration] = useState(() => {
    try {
      const saved = localStorage.getItem('nutrigenie_plan_duration_guest');
      return saved ? parseInt(saved, 10) : 30;
    } catch { return 30; }
  });

  // Re-read duration when user loads
  useEffect(() => {
    if (user) {
      try {
        const saved = localStorage.getItem(getDurationKey());
        if (saved) setPlanDuration(parseInt(saved, 10));
      } catch { /* keep default */ }
    }
  }, [user, getDurationKey]);

  // Persist duration changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(getDurationKey(), String(planDuration));
    }
  }, [planDuration, user, getDurationKey]);

  // ── Per-user completed meals persistence ──
  const getStorageKey = useCallback(() => {
    const userId = user?._id || user?.id || 'guest';
    return `nutrigenie_completed_meals_${userId}`;
  }, [user]);

  const loadCompletedMeals = useCallback(() => {
    try {
      const saved = localStorage.getItem(getStorageKey());
      if (saved) {
        setCompletedMeals(JSON.parse(saved));
      } else {
        setCompletedMeals({});
      }
    } catch (e) {
      console.error('Error loading completed meals:', e);
      setCompletedMeals({});
    }
  }, [getStorageKey]);

  // Re-fetch diet plan when user profile changes (goal, activity, etc.)
  useEffect(() => { fetchDietPlan(); }, [user?.goal, user?.activityLevel, user?.dietaryPreference]);

  useEffect(() => {
    if (user) loadCompletedMeals();
  }, [user, loadCompletedMeals]);

  useEffect(() => {
    if (user && Object.keys(completedMeals).length > 0) {
      localStorage.setItem(getStorageKey(), JSON.stringify(completedMeals));
    }
  }, [completedMeals, getStorageKey, user]);

  const fetchDietPlan = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/diet/plan');
      setDietData(response.data);
    } catch (error) {
      console.error('Error fetching diet plan:', error);
    } finally {
      setLoading(false);
    }
  };

  // ── Meal tracking helpers (use planDuration) ──
  const toggleMealComplete = (day, mealType) => {
    const key = `day${day}-${mealType}`;
    setCompletedMeals(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isMealCompleted = (day, mealType) => completedMeals[`day${day}-${mealType}`] || false;

  const getDayProgress = (day) => {
    const meals = ['breakfast', 'lunch', 'dinner', 'snacks'];
    const completed = meals.filter(m => isMealCompleted(day, m)).length;
    return (completed / meals.length) * 100;
  };

  const getOverallProgress = () => {
    let total = 0, done = 0;
    for (let day = 1; day <= planDuration; day++) {
      ['breakfast', 'lunch', 'dinner', 'snacks'].forEach(m => { total++; if (isMealCompleted(day, m)) done++; });
    }
    return total > 0 ? Math.round((done / total) * 100) : 0;
  };

  const getDaysCompleted = () => {
    let count = 0;
    for (let day = 1; day <= planDuration; day++) {
      if (getDayProgress(day) === 100) count++;
    }
    return count;
  };

  // Get meals based on user's dietary preference (reactively updates when user changes)
  const mealVariations = useMemo(() => {
    return getMealsByPreference(user?.dietaryPreference);
  }, [user?.dietaryPreference]);

  const getMealForDay = (day, mealType) => {
    const variations = mealVariations[mealType];
    return variations[(day - 1) % variations.length];
  };

  const totalWeeks = Math.ceil(planDuration / 7);
  const weekDays = Array.from({ length: 7 }, (_, i) => (selectedWeek - 1) * 7 + i + 1).filter(d => d <= planDuration);
  const daysToGoal = planDuration - getDaysCompleted();
  const overallProgress = getOverallProgress();
  const totalMealsTracked = Object.values(completedMeals).filter(Boolean).length;

  const changeDuration = (days) => {
    setPlanDuration(days);
    setSelectedWeek(1);
    setShowDurationPicker(false);
  };

  // ── Meal card icons ──
  const mealIcons = {
    breakfast: <Coffee className="w-4 h-4" />,
    lunch: <Sun className="w-4 h-4" />,
    dinner: <MoonIcon className="w-4 h-4" />,
    snacks: <Apple className="w-4 h-4" />,
  };

  // ── Loading state ──
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-slate-700"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-cyan-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-r-purple-500 border-b-transparent border-l-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="mt-6 text-slate-300 text-lg font-semibold">Generating your personalized meal plan...</p>
          <p className="mt-2 text-slate-500 text-sm">Crafting the perfect nutrition journey for you ✨</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pb-12 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-green-500 rounded-full mix-blend-multiply filter blur-[120px] opacity-[0.07] animate-blob"></div>
        <div className="absolute top-40 right-10 w-[500px] h-[500px] bg-orange-500 rounded-full mix-blend-multiply filter blur-[120px] opacity-[0.07] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-[500px] h-[500px] bg-yellow-500 rounded-full mix-blend-multiply filter blur-[120px] opacity-[0.07] animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ═══════════════ HEADER ═══════════════ */}
        <div className="pt-8 pb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <span className="text-2xl">🍽️</span>
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">
                    Your Meal Plan
                  </h1>
                </div>
              </div>
              <p className="text-slate-400 text-base sm:text-lg ml-0 sm:ml-15">
                Track your daily meals and achieve your fitness goals
              </p>
              <div className="flex flex-wrap gap-2 mt-2 ml-0 sm:ml-15">
                {user?.dietaryPreference && (
                  <span className="px-3 py-1 bg-green-500/15 text-green-400 rounded-full text-xs font-bold border border-green-500/20">
                    {user.dietaryPreference === 'non_vegetarian' ? '🍗 Non-Veg' : user.dietaryPreference === 'vegan' ? '🌱 Vegan' : user.dietaryPreference === 'diabetic_friendly' ? '💊 Diabetic' : '🥬 Vegetarian'}
                  </span>
                )}
                {user?.goal && (
                  <span className="px-3 py-1 bg-cyan-500/15 text-cyan-400 rounded-full text-xs font-bold border border-cyan-500/20">
                    {user.goal === 'weight_loss' ? '🔥 Weight Loss' : user.goal === 'weight_gain' ? '💪 Weight Gain' : user.goal === 'muscle_gain' ? '🏋️ Muscle Gain' : '⚖️ Maintenance'}
                  </span>
                )}
              </div>
            </div>

            {/* Duration Badge & Changer */}
            <div className="relative">
              <button
                onClick={() => setShowDurationPicker(!showDurationPicker)}
                className="glass-dark px-6 py-4 rounded-2xl border border-white/10 shadow-2xl hover:border-cyan-500/30 transition-all group cursor-pointer flex items-center gap-4"
              >
                <div className="text-center">
                  <div className="text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">Plan Duration</div>
                  <div className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    {planDuration}
                  </div>
                  <div className="text-slate-500 text-xs font-semibold">days</div>
                </div>
                <Settings className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 group-hover:rotate-90 transition-all duration-300" />
              </button>

              {/* Duration Picker Dropdown */}
              {showDurationPicker && (
                <div className="absolute right-0 top-full mt-3 z-50 glass-dark rounded-2xl border border-white/10 shadow-2xl p-4 min-w-[280px] animate-fade-in">
                  <div className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    Choose Plan Duration
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {DURATION_PRESETS.map((preset) => (
                      <button
                        key={preset.days}
                        onClick={() => changeDuration(preset.days)}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all text-left ${
                          planDuration === preset.days
                            ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-white'
                            : 'hover:bg-white/5 text-slate-400 hover:text-white border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{preset.icon}</span>
                          <span className="font-semibold">{preset.label}</span>
                        </div>
                        <span className="text-xs text-slate-500">{preset.days} days</span>
                      </button>
                    ))}
                  </div>
                  {/* Custom Duration Input */}
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <label className="text-xs text-slate-500 font-semibold mb-1 block">Custom Duration</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="1"
                        max="365"
                        placeholder="e.g. 45"
                        className="flex-1 px-3 py-2 bg-slate-800/50 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500/50"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const val = parseInt(e.target.value, 10);
                            if (val > 0 && val <= 365) changeDuration(val);
                          }
                        }}
                      />
                      <button
                        onClick={(e) => {
                          const input = e.target.previousElementSibling;
                          const val = parseInt(input.value, 10);
                          if (val > 0 && val <= 365) changeDuration(val);
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all"
                      >
                        Set
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ═══════════════ PROGRESS OVERVIEW ═══════════════ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {/* Overall Progress */}
          <div className="glass-dark p-4 sm:p-6 rounded-2xl border border-white/10 shadow-xl hover:shadow-cyan-500/10 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <Target className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="text-2xl">🎯</span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white">{overallProgress}%</div>
            <div className="text-slate-500 text-xs sm:text-sm mt-1 font-semibold">Overall Progress</div>
            <div className="mt-3 bg-slate-700/50 rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-500 to-purple-500 h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${overallProgress}%` }}></div>
            </div>
          </div>

          {/* Days Completed */}
          <div className="glass-dark p-4 sm:p-6 rounded-2xl border border-white/10 shadow-xl hover:shadow-green-500/10 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-green-400 group-hover:scale-110 transition-transform" />
              <span className="text-2xl">📅</span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white">{getDaysCompleted()}<span className="text-lg text-slate-500">/{planDuration}</span></div>
            <div className="text-slate-500 text-xs sm:text-sm mt-1 font-semibold">Days Completed</div>
          </div>

          {/* Daily Calories */}
          <div className="glass-dark p-4 sm:p-6 rounded-2xl border border-white/10 shadow-xl hover:shadow-orange-500/10 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <Flame className="w-8 h-8 sm:w-10 sm:h-10 text-orange-400 group-hover:scale-110 transition-transform" />
              <span className="text-2xl">🔥</span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white">{dietData?.metrics?.targetCalories || 2000}</div>
            <div className="text-slate-500 text-xs sm:text-sm mt-1 font-semibold">Daily Calories</div>
          </div>

          {/* Meals Tracked */}
          <div className="glass-dark p-4 sm:p-6 rounded-2xl border border-white/10 shadow-xl hover:shadow-yellow-500/10 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <Award className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400 group-hover:scale-110 transition-transform" />
              <span className="text-2xl">🏆</span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white">{totalMealsTracked}</div>
            <div className="text-slate-500 text-xs sm:text-sm mt-1 font-semibold">Meals Tracked</div>
          </div>
        </div>

        {/* ═══════════════ WEEK SELECTOR ═══════════════ */}
        <div className="glass-dark p-4 sm:p-6 rounded-2xl border border-white/10 mb-8 shadow-xl">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedWeek(Math.max(1, selectedWeek - 1))}
              disabled={selectedWeek === 1}
              className="p-2 sm:p-3 bg-slate-700/50 rounded-xl hover:bg-slate-600/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-110"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
            </button>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-black text-white mb-1">Week {selectedWeek}</div>
              <div className="text-slate-500 text-xs sm:text-sm font-semibold">
                Days {(selectedWeek - 1) * 7 + 1} – {Math.min(selectedWeek * 7, planDuration)}
              </div>
            </div>
            <button
              onClick={() => setSelectedWeek(Math.min(totalWeeks, selectedWeek + 1))}
              disabled={selectedWeek >= totalWeeks}
              className="p-2 sm:p-3 bg-slate-700/50 rounded-xl hover:bg-slate-600/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-110"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
            </button>
          </div>

          {/* Week Dots (show max 10, then switch to compact) */}
          <div className="flex justify-center gap-2 mt-5 flex-wrap">
            {totalWeeks <= 13 ? (
              Array.from({ length: totalWeeks }, (_, i) => i + 1).map(week => (
                <button
                  key={week}
                  onClick={() => setSelectedWeek(week)}
                  className={`transition-all duration-300 ${
                    week === selectedWeek
                      ? 'w-10 h-2.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full'
                      : 'w-2.5 h-2.5 bg-slate-600 rounded-full hover:bg-slate-500'
                  }`}
                  title={`Week ${week}`}
                />
              ))
            ) : (
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <span className="font-semibold">Week {selectedWeek} of {totalWeeks}</span>
                <span className="text-slate-600">|</span>
                <input
                  type="range"
                  min="1"
                  max={totalWeeks}
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(parseInt(e.target.value, 10))}
                  className="w-40 accent-cyan-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* ═══════════════ DAILY MEAL CARDS ═══════════════ */}
        <div className="space-y-6">
          {weekDays.map((day, index) => {
            const dayProgress = getDayProgress(day);
            const isFullyComplete = dayProgress === 100;

            return (
              <div
                key={day}
                className="glass-dark rounded-2xl border border-white/10 overflow-hidden shadow-xl"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                {/* Day Header */}
                <div className={`bg-gradient-to-r ${isFullyComplete ? 'from-green-600 via-emerald-600 to-teal-600' : 'from-cyan-600 via-purple-600 to-pink-600'} p-4 sm:p-6`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center">
                        {isFullyComplete ? (
                          <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                        ) : (
                          <span className="text-xl sm:text-2xl font-black text-white">{day}</span>
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-black text-white">Day {day}</h3>
                        <p className="text-white/70 text-xs sm:text-sm font-medium">
                          {isFullyComplete ? '✨ All meals completed!' : 'Track your meals for today'}
                        </p>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl sm:text-4xl font-black text-white">{Math.round(dayProgress)}%</div>
                      <div className="text-white/60 text-xs font-semibold hidden sm:block">Complete</div>
                    </div>
                  </div>
                  <div className="mt-3 sm:mt-4 bg-white/20 rounded-full h-2 sm:h-2.5 overflow-hidden">
                    <div className="bg-white h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${dayProgress}%` }}></div>
                  </div>
                </div>

                {/* Meals Grid — 1 col mobile / 2 col tablet / 4 col desktop */}
                <div className="p-3 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {['breakfast', 'lunch', 'dinner', 'snacks'].map((mealType) => {
                    const meal = getMealForDay(day, mealType);
                    const isCompleted = isMealCompleted(day, mealType);
                    const imageUrl = getMealImage(mealType, meal.name);

                    return (
                      <div
                        key={mealType}
                        className={`relative bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl cursor-pointer group ${
                          isCompleted ? 'ring-3 ring-green-500/40' : 'hover:shadow-cyan-500/10'
                        }`}
                        onClick={() => toggleMealComplete(day, mealType)}
                      >
                        {/* Image */}
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <img
                            src={imageUrl}
                            alt={meal.name}
                            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${isCompleted ? 'opacity-60 saturate-50' : ''}`}
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>

                          {/* Checkbox */}
                          <div className="absolute top-2.5 right-2.5">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
                              isCompleted ? 'bg-green-500 scale-110' : 'bg-white/80 backdrop-blur-sm border-2 border-white/50 group-hover:bg-white'
                            }`}>
                              {isCompleted && <Check className="w-5 h-5 text-white" />}
                            </div>
                          </div>

                          {/* Meal Type Badge */}
                          <div className="absolute top-2.5 left-2.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/10">
                            <span className="text-sm">{mealEmojis[mealType]}</span>
                            <span className="text-[11px] font-bold text-white capitalize tracking-wide">{mealType}</span>
                          </div>

                          {/* Completed Overlay */}
                          {isCompleted && (
                            <div className="absolute inset-0 bg-green-500/10 flex items-center justify-center">
                              <div className="w-16 h-16 bg-green-500/90 rounded-full flex items-center justify-center shadow-2xl">
                                <Check className="w-9 h-9 text-white" />
                              </div>
                            </div>
                          )}

                          {/* Nutrition Badges */}
                          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center gap-2">
                            <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                              <Flame className="w-3.5 h-3.5 text-orange-400" />
                              <span className="text-xs font-bold text-white">{meal.calories} cal</span>
                            </div>
                            <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                              <Zap className="w-3.5 h-3.5 text-yellow-400" />
                              <span className="text-xs font-bold text-white">{meal.protein}g</span>
                            </div>
                          </div>
                        </div>

                        {/* Caption */}
                        <div className="p-3 sm:p-3.5">
                          <h4 className={`font-bold text-[13px] leading-snug text-gray-900 mb-2 line-clamp-2 ${isCompleted ? 'line-through opacity-50' : ''}`}>
                            {meal.name}
                          </h4>
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-gray-400 font-medium">Day {day}</span>
                            <span className={`text-[11px] font-bold ${isCompleted ? 'text-green-500' : 'text-gray-400'}`}>
                              {isCompleted ? '✓ Done' : 'Tap to mark'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* ═══════════════ NUTRITION TIPS ═══════════════ */}
        {dietData?.tips && (
          <div className="glass-dark p-6 sm:p-8 rounded-2xl border border-white/10 shadow-xl mt-8">
            <h3 className="text-xl sm:text-2xl font-black text-white mb-5 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              Nutrition Tips
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {dietData.tips.map((tip, index) => (
                <div key={index} className="flex items-start gap-3 p-3 sm:p-4 bg-slate-800/50 rounded-xl border border-white/5 hover:border-cyan-500/20 transition-all">
                  <div className="w-7 h-7 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white font-bold text-xs">{index + 1}</span>
                  </div>
                  <span className="text-slate-300 text-sm leading-relaxed">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════ GOAL ACHIEVEMENT BANNER ═══════════════ */}
        {getDaysCompleted() === planDuration && planDuration > 0 && (
          <div className="glass-dark p-8 rounded-2xl border-2 border-green-500 shadow-2xl shadow-green-500/20 mt-8 text-center">
            <div className="text-6xl mb-4">🎉🏆🎉</div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">Congratulations!</h2>
            <p className="text-lg sm:text-xl text-green-400 font-semibold mb-4">
              You've completed all {planDuration} days of your meal plan!
            </p>
            <p className="text-slate-300">
              Amazing dedication! You're one step closer to your fitness goals. Keep going! 💪
            </p>
          </div>
        )}
      </div>

      {/* Click-away overlay for duration picker */}
      {showDurationPicker && (
        <div className="fixed inset-0 z-40" onClick={() => setShowDurationPicker(false)}></div>
      )}
    </div>
  );
};

export default DietPlan;
