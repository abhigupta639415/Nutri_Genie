// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Please provide a name'],
//     trim: true
//   },
//   email: {
//     type: String,
//     required: [true, 'Please provide an email'],
//     unique: true,
//     lowercase: true,
//     match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
//   },
//   password: {
//     type: String,
//     required: [true, 'Please provide a password'],
//     minlength: 6,
//     select: false
//   },
//   age: {
//     type: Number,
//     required: true,
//     min: 10,
//     max: 100
//   },
//   gender: {
//     type: String,
//     required: true,
//     enum: ['male', 'female', 'other']
//   },
//   weight: {
//     type: Number,
//     required: true,
//     min: 20
//   },
//   height: {
//     type: Number,
//     required: true,
//     min: 100
//   },
//   goal: {
//     type: String,
//     required: true,
//     enum: ['weight_loss', 'weight_gain', 'maintenance', 'muscle_gain']
//   },
//   activityLevel: {
//     type: String,
//     required: true,
//     enum: ['sedentary', 'light', 'moderate', 'active', 'very_active']
//   },
//   dietaryPreference: {
//     type: String,
//     required: true,
//     enum: ['vegetarian', 'non_vegetarian', 'vegan', 'diabetic_friendly']
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   verificationToken: {
//     type: String,
//     default: null
//   },
//   isVerified: {
//     type: Boolean,
//     default: false
//   }
  
// }, {
//   timestamps: true
// });

// // Hash password before saving
// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) {
//     return next();
//   }
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// // Compare password method
// userSchema.methods.comparePassword = async function(enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// module.exports = mongoose.model('User', userSchema);


const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  age: {
    type: Number,
    required: true,
    min: 10,
    max: 100
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female', 'other']
  },
  weight: {
    type: Number,
    required: true,
    min: 20
  },
  height: {
    type: Number,
    required: true,
    min: 100
  },
  goal: {
    type: String,
    required: true,
    enum: ['weight_loss', 'weight_gain', 'maintenance', 'muscle_gain']
  },
  activityLevel: {
    type: String,
    required: true,
    enum: ['sedentary', 'light', 'moderate', 'active', 'very_active']
  },
  dietaryPreference: {
    type: String,
    required: true,
    enum: ['vegetarian', 'non_vegetarian', 'vegan', 'diabetic_friendly']
  },
  planDurationWeeks: {
    type: Number,
    default: 4,
    min: 1,
    max: 12
  },
  planDurationDays: {
    type: Number,
    default: 28,
    min: 1,
    max: 90
  },
  durationUnit: {
    type: String,
    enum: ['weeks', 'days'],
    default: 'weeks'
  },
  foodPreferences: {
    type: String,
    default: ''
  },
  allergies: {
    type: String,
    default: ''
  },
  mealsPerDay: {
    type: Number,
    default: 4
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  verificationToken: {
    type: String,
    default: null
  },
  // NEW: codes expire so a stale/leaked code can't be used indefinitely
  verificationTokenExpires: {
    type: Date,
    default: null
  },
  isVerified: {
    type: Boolean,
    default: false
  }

}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);