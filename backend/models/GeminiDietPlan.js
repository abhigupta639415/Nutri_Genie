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
    type: mongoose.Schema.Types.Mixed, // Allows dynamic meal keys like pre_workout, etc.
    default: {}
  },
  totalCalories: { type: Number, default: 0 },
}, { _id: false, strict: false });

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
  },
  // Hash of all settings — if it changes, plan must be regenerated
  settingsHash: {
    type: String,
    required: true,
  },
  generationSource: {
    type: String,
    enum: ['gemini', 'fallback', 'nutritionist_engine'],
    default: 'gemini',
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  completedMeals: {
    type: [String],
    default: [],
  },
  planDurationWeeks: {
    type: Number,
    required: true,
  },
  planDurationDays: {
    type: Number,
    default: 28,
  },
  durationUnit: {
    type: String,
    enum: ['weeks', 'days'],
    default: 'weeks',
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
