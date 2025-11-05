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

  // Comprehensive Indian Food Image Database
  const foodImageDatabase = {
    // Breakfast items - Prioritize longer, more specific keywords
    'masala dosa': 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=300&fit=crop',
    'dosa': 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=300&fit=crop',
    'rava dosa': 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=300&fit=crop',
    'ragi dosa': 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=300&fit=crop',
    'rava idli': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=300&fit=crop',
    'idli': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=300&fit=crop',
    'aloo paratha': 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400&h=300&fit=crop',
    'stuffed paratha': 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400&h=300&fit=crop',
    'methi thepla': 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop',
    'paratha': 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400&h=300&fit=crop',
    'poha': 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop',
    'oats upma': 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=400&h=300&fit=crop',
    'quinoa upma': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
    'upma': 'https://images.unsplash.com/photo-1645696141596-79c1c49730ca?w=400&h=300&fit=crop',
    'paneer sandwich': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop',
    'sprouts sandwich': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop',
    'sandwich': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop',
    'thepla': 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop',
    'besan chilla': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop',
    'moong dal cheela': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop',
    'chilla': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop',
    'cheela': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop',
    'uttapam': 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=300&fit=crop',
    'oats pancakes': 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop',
    'oats': 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=400&h=300&fit=crop',
    'sabudana khichdi': 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop',
    'sabudana': 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop',
    'vermicelli upma': 'https://images.unsplash.com/photo-1645696141596-79c1c49730ca?w=400&h=300&fit=crop',
    'vermicelli': 'https://images.unsplash.com/photo-1645696141596-79c1c49730ca?w=400&h=300&fit=crop',
    'puri bhaji': 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400&h=300&fit=crop',
    'puri': 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400&h=300&fit=crop',
    'egg bhurji': 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=300&fit=crop',
    'omelette': 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=300&fit=crop',
    'egg': 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=300&fit=crop',
    'pancake': 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop',
    'bread pakora': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',
    'bread': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',
    'toast': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',
    'medu vada': 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop',
    'vada': 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop',
    'corn flakes': 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=400&h=300&fit=crop',
    'cornflakes': 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=400&h=300&fit=crop',
    'sprouts': 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop',
    'pesarattu': 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=300&fit=crop',
    'suji halwa': 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop',
    
    // Lunch/Dinner items
    'dal tadka': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
    'rajma masala': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
    'chole bhature': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
    'paneer butter masala': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop',
    'palak paneer': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop',
    'matar paneer': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop',
    'paneer tikka': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop',
    'kadhi pakora': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
    'dal makhani': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
    'dal': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
    'sambar rice': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=300&fit=crop',
    'jeera rice': 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400&h=300&fit=crop',
    'brown rice': 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400&h=300&fit=crop',
    'rice': 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400&h=300&fit=crop',
    'rajma': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
    'chole': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
    'veg pulao': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop',
    'vegetable pulao': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop',
    'pulao': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop',
    'paneer': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop',
    'curry': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
    'chapati': 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400&h=300&fit=crop',
    'roti': 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400&h=300&fit=crop',
    'butter naan': 'https://images.unsplash.com/photo-1566843972142-a7fcb70de4a3?w=400&h=300&fit=crop',
    'naan': 'https://images.unsplash.com/photo-1566843972142-a7fcb70de4a3?w=400&h=300&fit=crop',
    'sambar': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=300&fit=crop',
    'kadhi': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
    'palak': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop',
    'aloo': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
    'matar': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop',
    'bhindi': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
    'vegetable khichdi': 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400&h=300&fit=crop',
    'khichdi': 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400&h=300&fit=crop',
    'raita': 'https://images.unsplash.com/photo-1623992854795-f54b0220d243?w=400&h=300&fit=crop',
    'salad': 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop',
    'vegetable soup': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop',
    'soup': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop',
    'veg thali': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
    'thali': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
    'bhatura': 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400&h=300&fit=crop',
    'tofu curry': 'https://images.unsplash.com/photo-1546069901-eacef0df6022?w=400&h=300&fit=crop',
    'tofu': 'https://images.unsplash.com/photo-1546069901-eacef0df6022?w=400&h=300&fit=crop',
    'quinoa salad': 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop',
    'quinoa': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
    'wheat pasta': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop',
    'pasta': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop',
    'aloo gobi': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
    'baingan bharta': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
    'mushroom curry': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
    'mushroom': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
    'dum aloo': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
    'kofta curry': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
    'kofta': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
    'paneer bhurji': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop',
    'aloo matar': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
    'egg curry': 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=300&fit=crop',
    'veg fried rice': 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400&h=300&fit=crop',
    'fried rice': 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400&h=300&fit=crop',
    'manchurian': 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400&h=300&fit=crop',
    'soya chunk': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
    'soya': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
    'lauki': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
    'methi malai paneer': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop',
    'grilled paneer': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop',
    'vegetable korma': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
    'korma': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
    'bhindi masala': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
    'chana masala': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
    'moong dal': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
    'toor dal': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
    'chana dal': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
    'mixed dal': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
    'dal fry': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
    'palak dal': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
    'paneer wrap': 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop',
    'wrap': 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop',
    'millet khichdi': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
    'millet': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
    'vegetable noodle': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop',
    'noodle': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop',
    'grilled veg sandwich': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop',
    'grilled tofu': 'https://images.unsplash.com/photo-1546069901-eacef0df6022?w=400&h=300&fit=crop',
    'stuffed roti': 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400&h=300&fit=crop',
    'egg white omelette': 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=300&fit=crop',
    
    // Snacks
    'sprouted moong': 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop',
    'roasted chana': 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop',
    'fruit chaat': 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&h=300&fit=crop',
    'mixed nuts': 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop',
    'chana': 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop',
    'fruit': 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&h=300&fit=crop',
    'nuts': 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop',
    'cutlet': 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop',
    'dhokla': 'https://images.unsplash.com/photo-1626082910972-91e78935c13e?w=400&h=300&fit=crop',
    'makhana': 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop',
    'banana': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop',
    'buttermilk': 'https://images.unsplash.com/photo-1523473827533-2a64d0d36748?w=400&h=300&fit=crop',
    'apple': 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&h=300&fit=crop',
    'roasted peanuts': 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop',
    'peanuts': 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop',
    'greek yogurt': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop',
    'yogurt': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop',
    'boiled egg': 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=300&fit=crop',
    'roasted corn': 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&h=300&fit=crop',
    'steamed corn': 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&h=300&fit=crop',
    'corn': 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&h=300&fit=crop',
    'chips': 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=300&fit=crop',
    'crackers': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',
    'smoothie': 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400&h=300&fit=crop',
    'cookies': 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop',
    'bar': 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=400&h=300&fit=crop',
    'bhel': 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop'
  };

  // Default fallback images for each meal type
  const defaultImages = {
    breakfast: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&h=300&fit=crop',
    lunch: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
    dinner: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
    snacks: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop'
  };

  const getMealImage = (mealType, day) => {
    const meal = getMealForDay(day, mealType);
    const mealName = meal.name.toLowerCase();
    
    // Sort keywords by length (longest first) for better matching
    const sortedKeywords = Object.entries(foodImageDatabase)
      .sort((a, b) => b[0].length - a[0].length);
    
    // Find first matching keyword (will be the longest due to sorting)
    for (const [keyword, imageUrl] of sortedKeywords) {
      if (mealName.includes(keyword)) {
        return imageUrl;
      }
    }
    
    // If no match found, return default image for meal type
    return defaultImages[mealType];
  };

  // Varied Indian Meals Database (30 unique variations per meal type for 30 days)
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
      { name: 'Oats Upma with Vegetables', calories: 270, protein: 8 },
      { name: 'Rava Idli with Coconut Chutney', calories: 295, protein: 7 },
      { name: 'Sabudana Khichdi with Peanuts', calories: 330, protein: 6 },
      { name: 'Moong Dal Cheela with Tomato Chutney', calories: 285, protein: 11 },
      { name: 'Vermicelli Upma with Vegetables', calories: 305, protein: 7 },
      { name: 'Ragi Dosa with Sambar', calories: 275, protein: 8 },
      { name: 'Puri Bhaji with Aloo Sabzi', calories: 450, protein: 9 },
      { name: 'Egg Bhurji with Toast (2 slices)', calories: 320, protein: 18 },
      { name: 'Oats Pancakes with Honey', calories: 290, protein: 9 },
      { name: 'Pesarattu with Ginger Chutney', calories: 310, protein: 10 },
      { name: 'Suji Halwa with Milk', calories: 340, protein: 8 },
      { name: 'Bread Pakora (2) with Chutney', calories: 360, protein: 8 },
      { name: 'Quinoa Upma with Vegetables', calories: 280, protein: 9 },
      { name: 'Stuffed Paratha with Raita', calories: 410, protein: 11 },
      { name: 'Rawa Dosa with Potato Filling', calories: 325, protein: 7 },
      { name: 'Vegetable Poha with Curry Leaves', calories: 295, protein: 6 },
      { name: 'Omelette with Whole Wheat Toast', calories: 315, protein: 17 },
      { name: 'Medu Vada (2) with Sambar', calories: 340, protein: 8 },
      { name: 'Corn Flakes with Milk & Fruits', calories: 265, protein: 8 },
      { name: 'Mixed Vegetable Paratha with Curd', calories: 395, protein: 10 },
      { name: 'Sprouts Sandwich with Mint Chutney', calories: 305, protein: 12 }
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
      { name: 'Aloo Gobi, Dal Makhani, Rice, Roti', calories: 540, protein: 16 },
      { name: 'Matar Paneer, Pulao, Raita', calories: 590, protein: 19 },
      { name: 'Baingan Bharta, Chapati (3), Dal', calories: 505, protein: 15 },
      { name: 'Veg Pulao, Boondi Raita, Papad', calories: 495, protein: 12 },
      { name: 'Chana Masala, Jeera Rice, Roti (2)', calories: 560, protein: 18 },
      { name: 'Mushroom Curry, Brown Rice, Salad', calories: 485, protein: 14 },
      { name: 'Paneer Tikka Masala, Butter Naan, Dal', calories: 635, protein: 23 },
      { name: 'Vegetable Korma, Pulao, Cucumber Raita', calories: 555, protein: 15 },
      { name: 'Bhindi Masala, Roti (3), Moong Dal', calories: 520, protein: 16 },
      { name: 'Dum Aloo, Jeera Rice, Mixed Dal', calories: 575, protein: 17 },
      { name: 'Tofu Curry, Brown Rice, Salad', calories: 510, protein: 20 },
      { name: 'Kofta Curry, Naan, Dal Fry', calories: 610, protein: 18 },
      { name: 'Veg Thali: Dal, Sabzi, Roti, Rice', calories: 545, protein: 19 },
      { name: 'Paneer Bhurji, Roti (2), Raita', calories: 525, protein: 22 },
      { name: 'Aloo Matar, Chapati (3), Dal', calories: 500, protein: 14 },
      { name: 'Egg Curry, Rice, Salad', calories: 535, protein: 21 },
      { name: 'Veg Fried Rice with Manchurian', calories: 580, protein: 13 },
      { name: 'Soya Chunk Curry, Roti (2), Rice', calories: 555, protein: 24 },
      { name: 'Lauki Kofta Curry, Pulao, Raita', calories: 530, protein: 16 },
      { name: 'Methi Malai Paneer, Naan, Dal', calories: 600, protein: 20 },
      { name: 'Veg Biryani Bowl with Raita & Salad', calories: 515, protein: 15 }
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
      { name: 'Vegetable Khichdi with Curd', calories: 410, protein: 12 },
      { name: 'Roti (2) with Palak Dal & Salad', calories: 375, protein: 14 },
      { name: 'Quinoa Salad with Grilled Vegetables', calories: 340, protein: 11 },
      { name: 'Chapati (2), Rajma, Cucumber Salad', calories: 425, protein: 15 },
      { name: 'Veg Clear Soup with Multigrain Bread', calories: 295, protein: 8 },
      { name: 'Roti (2), Aloo Curry, Sprouts Salad', calories: 395, protein: 12 },
      { name: 'Paneer Salad Bowl with Hummus', calories: 370, protein: 18 },
      { name: 'Khichdi with Mixed Vegetables', calories: 385, protein: 11 },
      { name: 'Roti (2), Chana Dal, Beetroot Salad', calories: 405, protein: 14 },
      { name: 'Grilled Veg Sandwich with Tomato Soup', calories: 355, protein: 10 },
      { name: 'Brown Rice, Dal, Stir-fried Veggies', calories: 415, protein: 13 },
      { name: 'Stuffed Roti (2) with Curd', calories: 430, protein: 12 },
      { name: 'Vegetable Noodle Soup Bowl', calories: 325, protein: 9 },
      { name: 'Roti (2), Moong Dal, Cabbage Sabzi', calories: 380, protein: 13 },
      { name: 'Paneer Wrap with Green Salad', calories: 395, protein: 17 },
      { name: 'Millet Khichdi with Buttermilk', calories: 365, protein: 10 },
      { name: 'Roti (2), Mix Dal, Carrot Salad', calories: 400, protein: 14 },
      { name: 'Egg White Omelette with Salad', calories: 280, protein: 18 },
      { name: 'Wheat Pasta with Vegetables', calories: 420, protein: 12 },
      { name: 'Roti (2), Toor Dal, Pumpkin Curry', calories: 390, protein: 13 },
      { name: 'Grilled Tofu Salad with Quinoa', calories: 345, protein: 16 }
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
      { name: 'Masala Buttermilk with Roasted Papad', calories: 110, protein: 5 },
      { name: 'Apple Slices with Almond Butter', calories: 175, protein: 5 },
      { name: 'Roasted Peanuts - 1/2 cup', calories: 165, protein: 7 },
      { name: 'Greek Yogurt with Berries', calories: 140, protein: 10 },
      { name: 'Boiled Egg (2) with Salt & Pepper', calories: 155, protein: 13 },
      { name: 'Vegetable Soup - 1 bowl', calories: 95, protein: 3 },
      { name: 'Roasted Corn with Lime & Chili', calories: 125, protein: 4 },
      { name: 'Paneer Cubes (50g) with Mint Chutney', calories: 145, protein: 9 },
      { name: 'Trail Mix (Nuts & Dried Fruits)', calories: 185, protein: 6 },
      { name: 'Wheat Crackers with Hummus', calories: 155, protein: 5 },
      { name: 'Steamed Corn Chaat', calories: 135, protein: 4 },
      { name: 'Baked Sweet Potato Chips', calories: 140, protein: 2 },
      { name: 'Carrot & Cucumber Sticks with Dip', calories: 90, protein: 3 },
      { name: 'Multigrain Cookies (2) with Tea', calories: 160, protein: 4 },
      { name: 'Roasted Sunflower Seeds', calories: 170, protein: 6 },
      { name: 'Fruit Smoothie with Oats', calories: 195, protein: 5 },
      { name: 'Boiled Black Chana Chaat', calories: 145, protein: 8 },
      { name: 'Rice Cakes with Avocado', calories: 150, protein: 4 },
      { name: 'Protein Bar (Homemade)', calories: 180, protein: 8 },
      { name: 'Bhel Puri (Light)', calories: 135, protein: 4 },
      { name: 'Green Tea with Marie Biscuits (2)', calories: 100, protein: 2 }
    ]
  };

  const getMealForDay = (day, mealType) => {
    const variations = mealVariations[mealType];
    // Each day gets a unique meal (day 1 = index 0, day 2 = index 1, etc.)
    const index = (day - 1) % variations.length;
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

                {/* Meals Grid - Instagram Feed Style */}
                <div className="p-6 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                  {['breakfast', 'lunch', 'dinner', 'snacks'].map((mealType) => {
                    const meal = getMealForDay(day, mealType);
                    const isCompleted = isMealCompleted(day, mealType);

                    return (
                      <div
                        key={mealType}
                        className={`relative bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl cursor-pointer ${
                          isCompleted 
                            ? 'ring-4 ring-green-500/50' 
                            : 'hover:shadow-cyan-500/20'
                        }`}
                        onClick={() => toggleMealComplete(day, mealType)}
                      >
                        {/* Instagram-style Image Container */}
                        <div className="relative aspect-square overflow-hidden">
                          <img
                            src={getMealImage(mealType, day)}
                            alt={mealType}
                            className={`w-full h-full object-cover transition-all duration-300 ${isCompleted ? 'opacity-70' : 'opacity-100'}`}
                          />
                          
                          {/* Gradient Overlay */}
                          <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent`}></div>
                          
                          {/* Checkbox - Instagram Story Style */}
                          <div className="absolute top-3 right-3 z-10">
                            <div
                              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${
                                isCompleted
                                  ? 'bg-green-500 scale-110'
                                  : 'bg-white/80 backdrop-blur-md border-2 border-white/50 hover:bg-white'
                              }`}
                            >
                              {isCompleted && <Check className="w-6 h-6 text-white font-bold" />}
                            </div>
                          </div>

                          {/* Meal Type Badge - Instagram Style */}
                          <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 shadow-lg border border-white/20">
                            <div className="text-white">{mealIcons[mealType]}</div>
                            <span className="text-xs font-bold text-white capitalize tracking-wide">{mealType}</span>
                          </div>

                          {/* Completed Overlay */}
                          {isCompleted && (
                            <div className="absolute inset-0 bg-green-500/10 backdrop-blur-[2px] flex items-center justify-center">
                              <div className="w-20 h-20 bg-green-500/90 rounded-full flex items-center justify-center shadow-2xl">
                                <Check className="w-12 h-12 text-white" />
                              </div>
                            </div>
                          )}
                          
                          {/* Bottom Info Overlay - Instagram Style */}
                          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                <Flame className="w-4 h-4 text-orange-400" />
                                <span className="text-sm font-bold">{meal.calories}</span>
                              </div>
                              <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                <Zap className="w-4 h-4 text-yellow-400" />
                                <span className="text-sm font-bold">{meal.protein}g</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Instagram-style Caption */}
                        <div className="p-4 bg-white">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-xs font-bold">D{day}</span>
                            </div>
                            <div className="flex-1">
                              <h4 className={`font-bold text-sm leading-snug text-gray-900 mb-1 ${isCompleted ? 'line-through opacity-60' : ''}`}>
                                {meal.name}
                              </h4>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span>Day {day}</span>
                                <span>•</span>
                                <span className="capitalize">{mealType}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Instagram-style Action Bar */}
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-4">
                              <button className={`transition-colors ${isCompleted ? 'text-green-500' : 'text-gray-400 hover:text-red-500'}`}>
                                {isCompleted ? '❤️' : '🤍'}
                              </button>
                              <button className="text-gray-400 hover:text-cyan-500 transition-colors">
                                💬
                              </button>
                            </div>
                            <div className={`text-xs font-semibold ${isCompleted ? 'text-green-500' : 'text-gray-400'}`}>
                              {isCompleted ? 'Completed ✓' : 'Mark as done'}
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
