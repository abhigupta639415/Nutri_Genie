// Exercise database with details
const exercises = {
  yoga: {
    beginner: [
      { name: 'Surya Namaskar', duration: 15, caloriesPerMin: 4, difficulty: 'beginner', location: 'home', description: 'Sun salutation - 12 poses' },
      { name: 'Basic Pranayama', duration: 10, caloriesPerMin: 2, difficulty: 'beginner', location: 'home', description: 'Breathing exercises' }
    ],
    intermediate: [
      { name: 'Power Yoga', duration: 30, caloriesPerMin: 5, difficulty: 'intermediate', location: 'home', description: 'Dynamic yoga flow' },
      { name: 'Warrior Pose Series', duration: 20, caloriesPerMin: 4, difficulty: 'intermediate', location: 'home', description: 'Virabhadrasana I, II, III' }
    ],
    advanced: [
      { name: 'Advanced Vinyasa Flow', duration: 45, caloriesPerMin: 6, difficulty: 'advanced', location: 'home', description: 'Continuous flow yoga' }
    ]
  },
  cardio: {
    beginner: [
      { name: 'Brisk Walking', duration: 30, caloriesPerMin: 4, difficulty: 'beginner', location: 'home', description: 'Moderate pace walking' },
      { name: 'Jumping Jacks', duration: 10, caloriesPerMin: 8, difficulty: 'beginner', location: 'home', description: 'Full body cardio' }
    ],
    intermediate: [
      { name: 'Running', duration: 30, caloriesPerMin: 10, difficulty: 'intermediate', location: 'home', description: 'Outdoor or treadmill running' },
      { name: 'Skipping Rope', duration: 20, caloriesPerMin: 12, difficulty: 'intermediate', location: 'home', description: 'Jump rope workout' }
    ],
    advanced: [
      { name: 'Sprint Intervals', duration: 25, caloriesPerMin: 15, difficulty: 'advanced', location: 'home', description: 'High intensity sprinting' }
    ]
  },
  hiit: {
    beginner: [
      { name: 'Basic HIIT', duration: 15, caloriesPerMin: 10, difficulty: 'beginner', location: 'home', description: '30 sec work, 30 sec rest' }
    ],
    intermediate: [
      { name: 'Tabata Training', duration: 20, caloriesPerMin: 12, difficulty: 'intermediate', location: 'home', description: '20 sec work, 10 sec rest' }
    ],
    advanced: [
      { name: 'Advanced HIIT', duration: 30, caloriesPerMin: 14, difficulty: 'advanced', location: 'home', description: 'High intensity intervals' }
    ]
  },
  strength: {
    beginner: [
      { name: 'Bodyweight Squats', duration: 15, caloriesPerMin: 5, difficulty: 'beginner', location: 'home', description: '3 sets of 12' },
      { name: 'Plank Hold', duration: 10, caloriesPerMin: 3, difficulty: 'beginner', location: 'home', description: 'Core strengthening' }
    ],
    intermediate: [
      { name: 'Pushups', duration: 15, caloriesPerMin: 6, difficulty: 'intermediate', location: 'home', description: '3 sets of 15' },
      { name: 'Dumbbell Training', duration: 30, caloriesPerMin: 5, difficulty: 'intermediate', location: 'gym', description: 'Weights routine' }
    ],
    advanced: [
      { name: 'Heavy Lifting', duration: 45, caloriesPerMin: 6, difficulty: 'advanced', location: 'gym', description: 'Compound movements' }
    ]
  }
};

module.exports = exercises;
