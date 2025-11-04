// Indian food database with nutritional information
const indianFoods = {
  vegetarian: {
    breakfast: [
      { name: 'Poha', calories: 250, protein: 6, carbs: 45, fats: 5, serving: '1 bowl' },
      { name: 'Upma', calories: 220, protein: 5, carbs: 40, fats: 4, serving: '1 bowl' },
      { name: 'Idli (3 pcs) with Sambar', calories: 200, protein: 8, carbs: 38, fats: 2, serving: '3 idlis' },
      { name: 'Dosa with Chutney', calories: 280, protein: 7, carbs: 48, fats: 6, serving: '1 dosa' },
      { name: 'Paratha with Curd', calories: 300, protein: 8, carbs: 42, fats: 10, serving: '2 parathas' },
      { name: 'Oats Porridge', calories: 180, protein: 6, carbs: 32, fats: 3, serving: '1 bowl' },
      { name: 'Besan Chilla', calories: 200, protein: 10, carbs: 25, fats: 6, serving: '2 chillas' }
    ],
    lunch: [
      { name: 'Dal Rice', calories: 350, protein: 12, carbs: 65, fats: 5, serving: '1 plate' },
      { name: 'Rajma Chawal', calories: 400, protein: 15, carbs: 70, fats: 6, serving: '1 plate' },
      { name: 'Chole Bhature', calories: 550, protein: 15, carbs: 85, fats: 15, serving: '2 bhature' },
      { name: 'Veg Pulao with Raita', calories: 380, protein: 10, carbs: 68, fats: 8, serving: '1 plate' },
      { name: 'Paneer Butter Masala with Roti', calories: 450, protein: 18, carbs: 52, fats: 16, serving: '1 plate' },
      { name: 'Khichdi with Kadhi', calories: 320, protein: 11, carbs: 58, fats: 6, serving: '1 plate' },
      { name: 'Veg Biryani', calories: 420, protein: 12, carbs: 72, fats: 10, serving: '1 plate' }
    ],
    dinner: [
      { name: 'Roti with Sabzi', calories: 300, protein: 10, carbs: 50, fats: 7, serving: '3 rotis' },
      { name: 'Palak Paneer with Roti', calories: 380, protein: 16, carbs: 45, fats: 14, serving: '1 plate' },
      { name: 'Dal Tadka with Jeera Rice', calories: 360, protein: 13, carbs: 62, fats: 6, serving: '1 plate' },
      { name: 'Aloo Gobi with Roti', calories: 320, protein: 9, carbs: 55, fats: 8, serving: '1 plate' },
      { name: 'Mix Veg Curry with Roti', calories: 340, protein: 11, carbs: 58, fats: 7, serving: '1 plate' }
    ],
    snacks: [
      { name: 'Sprouts Chaat', calories: 150, protein: 8, carbs: 25, fats: 2, serving: '1 bowl' },
      { name: 'Fruit Salad', calories: 120, protein: 2, carbs: 30, fats: 1, serving: '1 bowl' },
      { name: 'Roasted Makhana', calories: 100, protein: 3, carbs: 18, fats: 2, serving: '1 cup' },
      { name: 'Dhokla', calories: 160, protein: 5, carbs: 28, fats: 3, serving: '2 pieces' },
      { name: 'Masala Chai with Biscuits', calories: 140, protein: 3, carbs: 24, fats: 4, serving: '1 cup + 2 biscuits' }
    ]
  },
  non_vegetarian: {
    breakfast: [
      { name: 'Egg Bhurji with Toast', calories: 280, protein: 18, carbs: 30, fats: 10, serving: '2 eggs' },
      { name: 'Boiled Eggs with Upma', calories: 300, protein: 20, carbs: 38, fats: 8, serving: '2 eggs' },
      { name: 'Chicken Keema Paratha', calories: 400, protein: 25, carbs: 45, fats: 12, serving: '2 parathas' }
    ],
    lunch: [
      { name: 'Chicken Curry with Rice', calories: 500, protein: 35, carbs: 60, fats: 12, serving: '1 plate' },
      { name: 'Fish Curry with Rice', calories: 450, protein: 32, carbs: 58, fats: 10, serving: '1 plate' },
      { name: 'Egg Biryani', calories: 480, protein: 22, carbs: 68, fats: 14, serving: '1 plate' },
      { name: 'Chicken Tikka with Roti', calories: 420, protein: 38, carbs: 42, fats: 10, serving: '1 plate' }
    ],
    dinner: [
      { name: 'Grilled Chicken with Salad', calories: 350, protein: 40, carbs: 20, fats: 12, serving: '1 plate' },
      { name: 'Fish Fry with Roti', calories: 380, protein: 35, carbs: 38, fats: 10, serving: '1 plate' },
      { name: 'Chicken Soup with Bread', calories: 280, protein: 25, carbs: 30, fats: 6, serving: '1 bowl' }
    ],
    snacks: [
      { name: 'Boiled Eggs', calories: 140, protein: 12, carbs: 2, fats: 10, serving: '2 eggs' },
      { name: 'Chicken Salad', calories: 200, protein: 25, carbs: 10, fats: 8, serving: '1 bowl' }
    ]
  },
  vegan: {
    breakfast: [
      { name: 'Oats with Almond Milk', calories: 200, protein: 8, carbs: 35, fats: 5, serving: '1 bowl' },
      { name: 'Ragi Dosa', calories: 180, protein: 6, carbs: 35, fats: 3, serving: '1 dosa' },
      { name: 'Quinoa Upma', calories: 220, protein: 9, carbs: 38, fats: 4, serving: '1 bowl' }
    ],
    lunch: [
      { name: 'Tofu Curry with Brown Rice', calories: 380, protein: 18, carbs: 58, fats: 8, serving: '1 plate' },
      { name: 'Chickpea Curry with Roti', calories: 360, protein: 14, carbs: 62, fats: 6, serving: '1 plate' },
      { name: 'Lentil Khichdi', calories: 300, protein: 12, carbs: 54, fats: 4, serving: '1 plate' }
    ],
    dinner: [
      { name: 'Soya Chunks Curry with Roti', calories: 340, protein: 20, carbs: 48, fats: 7, serving: '1 plate' },
      { name: 'Mixed Dal with Quinoa', calories: 320, protein: 15, carbs: 52, fats: 5, serving: '1 plate' }
    ],
    snacks: [
      { name: 'Mixed Nuts', calories: 180, protein: 6, carbs: 8, fats: 15, serving: '30g' },
      { name: 'Hummus with Carrot Sticks', calories: 140, protein: 5, carbs: 18, fats: 6, serving: '1 serving' }
    ]
  },
  diabetic_friendly: {
    breakfast: [
      { name: 'Moong Dal Chilla', calories: 180, protein: 10, carbs: 24, fats: 4, serving: '2 chillas' },
      { name: 'Oats with Nuts', calories: 200, protein: 8, carbs: 28, fats: 6, serving: '1 bowl' },
      { name: 'Methi Paratha with Curd', calories: 220, protein: 9, carbs: 32, fats: 6, serving: '2 parathas' }
    ],
    lunch: [
      { name: 'Brown Rice with Dal', calories: 320, protein: 12, carbs: 55, fats: 4, serving: '1 plate' },
      { name: 'Multigrain Roti with Palak', calories: 280, protein: 11, carbs: 45, fats: 6, serving: '1 plate' },
      { name: 'Quinoa Pulao', calories: 300, protein: 10, carbs: 48, fats: 7, serving: '1 plate' }
    ],
    dinner: [
      { name: 'Grilled Fish with Vegetables', calories: 280, protein: 30, carbs: 20, fats: 8, serving: '1 plate' },
      { name: 'Soup with Multigrain Bread', calories: 220, protein: 10, carbs: 35, fats: 5, serving: '1 bowl' }
    ],
    snacks: [
      { name: 'Cucumber Salad', calories: 50, protein: 2, carbs: 10, fats: 1, serving: '1 bowl' },
      { name: 'Roasted Chana', calories: 120, protein: 6, carbs: 20, fats: 2, serving: '30g' }
    ]
  }
};

module.exports = indianFoods;
