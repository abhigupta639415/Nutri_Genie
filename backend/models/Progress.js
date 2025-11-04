const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  caloriesConsumed: {
    type: Number,
    default: 0,
    min: 0
  },
  caloriesBurned: {
    type: Number,
    default: 0,
    min: 0
  },
  weight: {
    type: Number,
    required: true,
    min: 20
  },
  waterIntake: {
    type: Number,
    default: 0,
    min: 0
  },
  sleepHours: {
    type: Number,
    default: 0,
    min: 0,
    max: 24
  },
  mood: {
    type: String,
    enum: ['excellent', 'good', 'okay', 'tired', 'stressed'],
    default: 'okay'
  },
  workoutsCompleted: [{
    name: String,
    duration: Number,
    caloriesBurned: Number
  }],
  mealsLogged: [{
    mealType: String,
    items: [String],
    calories: Number
  }]
}, {
  timestamps: true
});

// Index for faster queries
progressSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Progress', progressSchema);
