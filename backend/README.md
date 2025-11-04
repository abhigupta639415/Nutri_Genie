# NutriGenie Backend API

AI-powered diet and fitness recommendation backend built with Node.js, Express, and MongoDB.

## 🚀 Features

- **User Authentication**: JWT-based secure authentication
- **AI Diet Plans**: Personalized Indian meal plans based on user profile
- **Workout Recommendations**: Custom exercise routines for different goals
- **Progress Tracking**: Log and visualize fitness progress
- **NutriBot**: AI chatbot for diet and fitness queries
- **BMR/TDEE Calculations**: Scientific metabolic rate calculations
- **Indian Food Database**: Comprehensive nutritional data for Indian dishes

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## 🛠️ Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:
```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/nutrigenie
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

4. Start MongoDB (if running locally):
```bash
mongod
```

5. Run the server:
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)
- `PUT /api/auth/profile` - Update user profile (Protected)

### Diet Plans
- `GET /api/diet/plan` - Get personalized diet plan (Protected)
- `GET /api/diet/alternatives/:mealType` - Get alternative meals (Protected)

### Workout Plans
- `GET /api/workout/plan` - Get personalized workout plan (Protected)

### Progress Tracking
- `POST /api/progress` - Log daily progress (Protected)
- `GET /api/progress` - Get progress history (Protected)
- `GET /api/progress/summary` - Get progress summary (Protected)

### Chatbot
- `POST /api/chatbot/chat` - Chat with NutriBot (Protected)

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## 📊 Data Models

### User Schema
```javascript
{
  name: String,
  email: String,
  password: String (hashed),
  age: Number,
  gender: String,
  weight: Number,
  height: Number,
  goal: String,
  activityLevel: String,
  dietaryPreference: String
}
```

### Progress Schema
```javascript
{
  userId: ObjectId,
  date: Date,
  caloriesConsumed: Number,
  caloriesBurned: Number,
  weight: Number,
  waterIntake: Number,
  sleepHours: Number,
  mood: String,
  workoutsCompleted: Array,
  mealsLogged: Array
}
```

## 🧮 Calculations

- **BMR**: Mifflin-St Jeor Equation
- **TDEE**: BMR × Activity Multiplier
- **BMI**: weight(kg) / height(m)²
- **Target Calories**: TDEE ± Goal Adjustment
- **Macros**: Based on goal and target calories

## 🍛 Dietary Preferences

- Vegetarian
- Non-Vegetarian
- Vegan
- Diabetic-Friendly

## 🎯 Fitness Goals

- Weight Loss
- Weight Gain
- Muscle Gain
- Maintenance

## 📱 Activity Levels

- Sedentary
- Light
- Moderate
- Active
- Very Active

## 🔧 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + bcryptjs
- **Validation**: express-validator

## 📄 License

MIT
