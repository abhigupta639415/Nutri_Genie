const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  duration: { type: String, default: '10 min' },
  sets: { type: String, default: '3' },
  reps: { type: String, default: '10' },
  notes: { type: String, default: '' }
}, { _id: false });

const workoutDaySchema = new mongoose.Schema({
  day: { type: Number, required: true },
  week: { type: Number, required: true },
  date: { type: Date, required: true },
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ['cardio', 'strength', 'hiit', 'yoga', 'rest'],
    default: 'strength'
  },
  isRestDay: { type: Boolean, default: false },
  duration: { type: String, default: '40 min' },
  caloriesBurned: { type: Number, default: 250 },
  exercises: [exerciseSchema]
}, { _id: false });

const workoutPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  goal: {
    type: String,
    enum: ['fatLoss', 'muscleGain', 'stayFit', 'weight_loss', 'weight_gain', 'muscle_gain', 'maintenance'],
    required: true
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  planDurationWeeks: {
    type: Number,
    required: true,
    default: 4
  },
  planDurationDays: {
    type: Number,
    required: true,
    default: 28
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  days: [workoutDaySchema]
}, {
  timestamps: true
});

workoutPlanSchema.index({ userId: 1, goal: 1, level: 1, planDurationDays: 1 });

module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema);
