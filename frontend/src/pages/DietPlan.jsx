import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Coffee, Sun, Moon as MoonIcon, Apple, TrendingUp, Activity, Calendar, Check, Target, Flame, ChevronLeft, ChevronRight, Award, Zap, CheckCircle } from 'lucide-react';

const DietPlan = () => {
  const [dietData, setDietData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [completedMeals, setCompletedMeals] = useState({});

  useEffect(() => {
    fetchDietPlan();
    loadCompletedMeals();
  }, []);

  useEffect(() => {
    saveCompletedMeals();
  }, [completedMeals]);

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

  const loadCompletedMeals = () => {
    const saved = localStorage.getItem('nutrigenie_completed_meals');
    if (saved) {
      setCompletedMeals(JSON.parse(saved));
    }
  };

  const saveCompletedMeals = () => {
    localStorage.setItem('nutrigenie_completed_meals', JSON.stringify(completedMeals));
  };

  const toggleMealComplete = (day, mealType) => {
    const key = `day${day}-${mealType}`;
    setCompletedMeals(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const isMealCompleted = (day, mealType) => {
    return completedMeals[`day${day}-${mealType}`] || false;
  };

  const getDayProgress = (day) => {
    const meals = ['breakfast', 'lunch', 'dinner', 'snacks'];
    const completed = meals.filter(meal => isMealCompleted(day, meal)).length;
    return (completed / meals.length) * 100;
  };

  const getOverallProgress = () => {
    let totalMeals = 0;
    let completedCount = 0;
    for (let day = 1; day <= 30; day++) {
      ['breakfast', 'lunch', 'dinner', 'snacks'].forEach(meal => {
        totalMeals++;
        if (isMealCompleted(day, meal)) completedCount++;
      });
    }
    return Math.round((completedCount / totalMeals) * 100);
  };

  const getDaysCompleted = () => {
    let daysCompleted = 0;
    for (let day = 1; day <= 30; day++) {
      if (getDayProgress(day) === 100) daysCompleted++;
    }
    return daysCompleted;
  };

  const mealIcons = {
    breakfast: <Coffee className="w-5 h-5" />,
    lunch: <Sun className="w-5 h-5" />,
    dinner: <MoonIcon className="w-5 h-5" />,
    snacks: <Apple className="w-5 h-5" />
  };

  const mealColors = {
    breakfast: 'from-yellow-500 to-orange-500',
    lunch: 'from-orange-500 to-red-500',
    dinner: 'from-purple-500 to-indigo-500',
    snacks: 'from-green-500 to-teal-500'
  };

  const indianMealImages = {
    breakfast: [
      'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1568051243851-f9b136146e32?w=400&h=300&fit=crop'
    ],
    lunch: [
      'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop'
    ],
    dinner: [
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop'
    ],
    snacks: [
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1626082910972-91e78935c13e?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1562440499-64c9a74f0fd0?w=400&h=300&fit=crop'
    ]
  };

  const getMealImage = (mealType, day) => {
    const images = indianMealImages[mealType];
    return images[(day - 1) % images.length];
  };

  // Varied Indian Meals Database (10 variations per meal type, repeats every 3 days)
  const mealVariations = {
    breakfast: [
      { name: 'Masala Dosa with Sambar & Coconut Chutney', calories: 350, protein: 8 },
      { name: 'Aloo Paratha with Curd & Pickle', calories: 420, protein: 12 },
      { name: 'Idli Sambar with Tomato Chutney', calories: 280, protein: 9 },
      { name: 'Poha with Peanuts & Lemon', calories: 310, protein: 7 },
      { name: 'Upma with Vegetables & Curry Leaves', calories: 300, protein: 8 },
      { name: 'Paneer Sandwich with Green Chutney', calories: 380, protein: 15 },
      { name: 'Methi Thepla with Curd', calories: 340, protein: 10 },
      { name: 'Besan Chilla with Mint Chutney', calories: 290, protein: 12 },
      { name: 'Uttapam with Mixed Vegetables', calories: 320, protein: 9 },
      { name: 'Oats Upma with Vegetables', calories: 270, protein: 8 }
    ],
    lunch: [
      { name: 'Dal Tadka, Jeera Rice, Roti, Mixed Veg Curry', calories: 550, protein: 18 },
      { name: 'Rajma Masala, Brown Rice, Salad, Raita', calories: 580, protein: 20 },
      { name: 'Chole Bhature with Onion & Pickle', calories: 650, protein: 16 },
      { name: 'Vegetable Biryani with Raita & Papad', calories: 520, protein: 14 },
      { name: 'Paneer Butter Masala, Naan, Dal Fry', calories: 620, protein: 22 },
      { name: 'Sambar Rice with Appalam & Curd', calories: 480, protein: 12 },
      { name: 'Kadhi Pakora with Steamed Rice', calories: 510, protein: 13 },
      { name: 'Mix Veg Curry, Chapati (3), Dal, Salad', calories: 530, protein: 17 },
      { name: 'Palak Paneer, Roti (2), Jeera Rice', calories: 570, protein: 21 },
      { name: 'Aloo Gobi, Dal Makhani, Rice, Roti', calories: 540, protein: 16 }
    ],
    dinner: [
      { name: 'Khichdi with Curd & Papad', calories: 400, protein: 12 },
      { name: 'Chapati (2) with Dal & Bhindi Masala', calories: 420, protein: 14 },
      { name: 'Vegetable Pulao with Raita', calories: 450, protein: 11 },
      { name: 'Moong Dal Cheela with Green Chutney', calories: 320, protein: 15 },
      { name: 'Mixed Veg Curry with Roti (2) & Salad', calories: 380, protein: 13 },
      { name: 'Paneer Tikka with Mint Chutney & Salad', calories: 350, protein: 20 },
      { name: 'Vegetable Soup with Whole Wheat Bread', calories: 310, protein: 9 },
      { name: 'Roti (2), Dal Tadka, Lauki Curry', calories: 390, protein: 13 },
      { name: 'Grilled Paneer Sandwich with Soup', calories: 360, protein: 16 },
      { name: 'Vegetable Khichdi with Curd', calories: 410, protein: 12 }
    ],
    snacks: [
      { name: 'Sprouted Moong Salad with Lemon', calories: 150, protein: 8 },
      { name: 'Roasted Chana (Chickpeas) - 1 cup', calories: 180, protein: 10 },
      { name: 'Fruit Chaat with Chaat Masala', calories: 120, protein: 3 },
      { name: 'Mixed Nuts (Almonds, Walnuts, Cashews)', calories: 200, protein: 7 },
      { name: 'Vegetable Cutlet (2) with Chutney', calories: 170, protein: 5 },
      { name: 'Dhokla (2 pieces) with Green Chutney', calories: 160, protein: 6 },
      { name: 'Roasted Makhana (Fox Nuts) - 1 bowl', calories: 130, protein: 4 },
      { name: 'Cucumber Raita with Jeera', calories: 100, protein: 4 },
      { name: 'Banana with Peanut Butter', calories: 190, protein: 6 },
      { name: 'Masala Buttermilk with Roasted Papad', calories: 110, protein: 5 }
    ]
  };

  const getMealForDay = (day, mealType) => {
    const variations = mealVariations[mealType];
    // Repeat every 3 days for variety
    const index = Math.floor((day - 1) / 3) % variations.length;
    return variations[index];
  };

  const weekDays = Array.from({ length: 7 }, (_, i) => (selectedWeek - 1) * 7 + i + 1).filter(d => d <= 30);
  const daysToGoal = 30 - getDaysCompleted();
  const totalWeeks = 5;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="mt-4 text-slate-300 text-lg font-semibold">Generating your personalized 30-day diet plan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-5xl md:text-6xl font-black text-white mb-3">
                30-Day Meal Plan 🍽️
              </h1>
              <p className="text-slate-300 text-lg">
                Track your daily meals and achieve your fitness goals
              </p>
            </div>
            <div className="glass-dark px-8 py-5 rounded-2xl border border-white/10 shadow-2xl">
              <div className="text-center">
                <div className="text-cyan-400 text-sm font-bold mb-2">Days to Goal</div>
                <div className="text-5xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  {daysToGoal}
                </div>
                <div className="text-slate-400 text-xs mt-1 font-semibold">days remaining</div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8 animate-slide-up">
          <div className="glass-dark p-6 rounded-2xl border border-white/10 shadow-2xl hover:shadow-cyan-500/20 transition-all transform hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <Target className="w-10 h-10 text-cyan-400" />
              <div className="text-3xl">🎯</div>
            </div>
            <div className="text-4xl font-black text-white">{getOverallProgress()}%</div>
            <div className="text-slate-400 text-sm mt-1 font-semibold">Overall Progress</div>
            <div className="mt-3 bg-slate-700/50 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-purple-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${getOverallProgress()}%` }}
              ></div>
            </div>
          </div>

          <div className="glass-dark p-6 rounded-2xl border border-white/10 shadow-2xl hover:shadow-green-500/20 transition-all transform hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <Calendar className="w-10 h-10 text-green-400" />
              <div className="text-3xl">📅</div>
            </div>
            <div className="text-4xl font-black text-white">{getDaysCompleted()}/30</div>
            <div className="text-slate-400 text-sm mt-1 font-semibold">Days Completed</div>
          </div>

          <div className="glass-dark p-6 rounded-2xl border border-white/10 shadow-2xl hover:shadow-orange-500/20 transition-all transform hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <Flame className="w-10 h-10 text-orange-400" />
              <div className="text-3xl">🔥</div>
            </div>
            <div className="text-4xl font-black text-white">{dietData?.metrics?.targetCalories || 2000}</div>
            <div className="text-slate-400 text-sm mt-1 font-semibold">Daily Calories</div>
          </div>

          <div className="glass-dark p-6 rounded-2xl border border-white/10 shadow-2xl hover:shadow-yellow-500/20 transition-all transform hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <Award className="w-10 h-10 text-yellow-400" />
              <div className="text-3xl">🏆</div>
            </div>
            <div className="text-4xl font-black text-white">{Object.keys(completedMeals).length}</div>
            <div className="text-slate-400 text-sm mt-1 font-semibold">Meals Tracked</div>
          </div>
        </div>

        {/* Week Selector */}
        <div className="glass-dark p-6 rounded-2xl border border-white/10 mb-8 shadow-2xl">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedWeek(Math.max(1, selectedWeek - 1))}
              disabled={selectedWeek === 1}
              className="p-3 bg-slate-700/50 rounded-xl hover:bg-slate-600/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all transform hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6 text-cyan-400" />
            </button>
            <div className="text-center">
              <div className="text-3xl font-black text-white mb-1">Week {selectedWeek}</div>
              <div className="text-slate-400 text-sm font-semibold">
                Days {(selectedWeek - 1) * 7 + 1} - {Math.min(selectedWeek * 7, 30)}
              </div>
            </div>
            <button
              onClick={() => setSelectedWeek(Math.min(totalWeeks, selectedWeek + 1))}
              disabled={selectedWeek >= totalWeeks}
              className="p-3 bg-slate-700/50 rounded-xl hover:bg-slate-600/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all transform hover:scale-110"
            >
              <ChevronRight className="w-6 h-6 text-cyan-400" />
            </button>
          </div>

          {/* Week Progress Dots */}
          <div className="flex justify-center gap-3 mt-6">
            {Array.from({ length: totalWeeks }, (_, i) => i + 1).map(week => (
              <button
                key={week}
                onClick={() => setSelectedWeek(week)}
                className={`transition-all duration-300 ${
                  week === selectedWeek
                    ? 'w-12 h-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full'
                    : 'w-3 h-3 bg-slate-600 rounded-full hover:bg-slate-500'
                }`}
              />
            ))}
          </div>
        </div>

        {/* 30-Day Meal Tracker */}
        <div className="space-y-6">
          {weekDays.map((day, index) => {
            const dayProgress = getDayProgress(day);
            const isFullyComplete = dayProgress === 100;

            return (
              <div
                key={day}
                className="glass-dark rounded-2xl border border-white/10 overflow-hidden shadow-2xl animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Day Header */}
                <div className={`bg-gradient-to-r ${isFullyComplete ? 'from-green-600 via-emerald-600 to-teal-600' : 'from-cyan-600 via-purple-600 to-pink-600'} p-6`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                        {isFullyComplete ? (
                          <CheckCircle className="w-10 h-10 text-white" />
                        ) : (
                          <span className="text-3xl font-black text-white">{day}</span>
                        )}
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-white">Day {day}</h3>
                        <p className="text-cyan-100 text-sm font-semibold">
                          {isFullyComplete ? '✨ All meals completed!' : 'Track your meals for today'}
                        </p>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-5xl font-black text-white">{Math.round(dayProgress)}%</div>
                      <div className="text-cyan-100 text-xs font-semibold">Complete</div>
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="mt-4 bg-white/20 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-white h-full rounded-full transition-all duration-500"
                      style={{ width: `${dayProgress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Meals Grid */}
                <div className="p-6 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {['breakfast', 'lunch', 'dinner', 'snacks'].map((mealType) => {
                    const meal = getMealForDay(day, mealType);
                    const isCompleted = isMealCompleted(day, mealType);

                    return (
                      <div
                        key={mealType}
                        className={`relative bg-slate-800/50 rounded-xl overflow-hidden border-2 transition-all duration-300 transform hover:scale-105 cursor-pointer ${
                          isCompleted 
                            ? 'border-green-500 shadow-xl shadow-green-500/30' 
                            : 'border-white/10 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/20'
                        }`}
                        onClick={() => toggleMealComplete(day, mealType)}
                      >
                        {/* Meal Image */}
                        <div className="relative h-40 overflow-hidden">
                          <img
                            src={getMealImage(mealType, day)}
                            alt={mealType}
                            className={`w-full h-full object-cover transition-all duration-300 ${isCompleted ? 'opacity-60' : 'opacity-100'}`}
                          />
                          <div className={`absolute inset-0 bg-gradient-to-t ${mealColors[mealType]} ${isCompleted ? 'opacity-40' : 'opacity-60'}`}></div>
                          
                          {/* Checkbox */}
                          <div className="absolute top-3 right-3 z-10">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
                                isCompleted
                                  ? 'bg-green-500 scale-110 shadow-green-500/50'
                                  : 'bg-white/30 backdrop-blur-sm border-2 border-white hover:bg-white/50'
                              }`}
                            >
                              {isCompleted && <Check className="w-6 h-6 text-white" />}
                            </div>
                          </div>

                          {/* Meal Type Badge */}
                          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full flex items-center gap-2 shadow-lg">
                            {mealIcons[mealType]}
                            <span className="text-xs font-bold text-gray-900 capitalize">{mealType}</span>
                          </div>

                          {/* Completed Overlay */}
                          {isCompleted && (
                            <div className="absolute inset-0 bg-green-500/20 backdrop-blur-[1px] flex items-center justify-center">
                              <div className="text-6xl animate-bounce">✓</div>
                            </div>
                          )}
                        </div>

                        {/* Meal Info */}
                        <div className="p-4">
                          <h4 className={`font-bold text-sm mb-3 line-clamp-2 ${isCompleted ? 'text-green-400' : 'text-white'}`}>
                            {meal.name}
                          </h4>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-slate-700/50 p-2 rounded-lg">
                              <div className="text-xs text-slate-400">Calories</div>
                              <div className="text-lg font-bold text-orange-400">{meal.calories}</div>
                            </div>
                            <div className="bg-slate-700/50 p-2 rounded-lg">
                              <div className="text-xs text-slate-400">Protein</div>
                              <div className="text-lg font-bold text-red-400">{meal.protein}g</div>
                            </div>
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

        {/* Nutrition Tips */}
        {dietData?.tips && (
          <div className="glass-dark p-8 rounded-2xl border border-white/10 shadow-2xl mt-8 animate-fade-in">
            <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                💡
              </div>
              Nutrition Tips
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {dietData.tips.map((tip, index) => (
                <div 
                  key={index} 
                  className="flex items-start space-x-3 p-4 bg-slate-800/50 rounded-xl border border-white/10 hover:border-cyan-500/30 transition-all"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">{index + 1}</span>
                  </div>
                  <span className="text-slate-300 leading-relaxed">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Goal Achievement Banner */}
        {getDaysCompleted() === 30 && (
          <div className="glass-dark p-8 rounded-2xl border-2 border-green-500 shadow-2xl shadow-green-500/30 mt-8 text-center animate-fade-in">
            <div className="text-6xl mb-4">🎉🏆🎉</div>
            <h2 className="text-4xl font-black text-white mb-3">Congratulations!</h2>
            <p className="text-xl text-green-400 font-semibold mb-4">
              You've completed all 30 days of your meal plan!
            </p>
            <p className="text-slate-300">
              Amazing dedication! You're one step closer to your fitness goals. Keep going! 💪
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DietPlan;
