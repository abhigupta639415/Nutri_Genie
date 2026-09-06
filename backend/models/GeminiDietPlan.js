const mongoose = require('mongoose');

// Schema for a single meal
const mealSchema = new mongoose.Schema({
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fats: { type: Number, default: 0 },
}, { _id: false });

// Schema for a single day
const daySchema = new mongoose.Schema({
  dayNumber: { type: Number, required: true },
  dayName: { type: String, required: true },
  meals: {
    breakfast: { type: mealSchema, required: true },
    lunch: { type: mealSchema, required: true },
    dinner: { type: mealSchema, required: true },
    snacks: { type: mealSchema, required: true },
  },
  totalCalories: { type: Number, default: 0 },
}, { _id: false });

// Schema for a single week
const weekSchema = new mongoose.Schema({
  weekNumber: { type: Number, required: true },
  days: [daySchema],
}, { _id: false });

// Main cached diet plan schema
const geminiDietPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  // Hash of all settings — if it changes, plan must be regenerated
  settingsHash: {
    type: String,
    required: true,
  },
  planDurationWeeks: {
    type: Number,
    required: true,
  },
  // The Gemini-generated plan
  plan: {
    weeks: [weekSchema],
  },
  // Nutritional metrics (computed from user profile)
  metrics: {
    bmr: Number,
    tdee: Number,
    targetCalories: Number,
    bmi: {
      value: Number,
      category: String,
    },
  },
  macros: {
    protein: Number,
    carbs: Number,
    fats: Number,
  },
  tips: [String],
  generatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Only keep one plan per user (latest overwrites previous)
geminiDietPlanSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model('GeminiDietPlan', geminiDietPlanSchema);
