# 🧘‍♀️ NutriGenie - AI-Powered Fitness & Diet Platform

NutriGenie is a comprehensive MERN stack web application that provides personalized diet and fitness recommendations tailored for Indian users. It combines modern nutritional science, Indian food culture, and AI-driven fitness analytics.

![NutriGenie](https://img.shields.io/badge/Stack-MERN-green) ![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Features

### 🍽️ Diet Management
- **AI-Powered Meal Plans** - Personalized Indian meal plans based on BMR/TDEE calculations
- **Macronutrient Tracking** - Detailed protein, carbs, and fats breakdown
- **Dietary Preferences** - Support for Vegetarian, Non-Vegetarian, Vegan, and Diabetic-friendly diets
- **Real Indian Food Data** - Comprehensive database of Indian dishes with nutritional information

### 💪 Fitness & Workouts
- **Custom Workout Plans** - Personalized routines based on fitness level and goals
- **Multiple Exercise Types** - Yoga, HIIT, Cardio, and Strength training
- **Home & Gym Options** - Workouts for both home and gym environments
- **Calorie Burn Tracking** - Calculate calories burned per exercise

### 📊 Progress Analytics
- **Visual Charts** - Weight progress, calorie tracking, and lifestyle metrics
- **Weekly/Monthly Reports** - Comprehensive progress summaries
- **Goal Tracking** - Monitor weight loss, gain, or maintenance goals
- **Workout Streaks** - Track consistency and build habits

### 🤖 AI Assistant (NutriBot)
- **24/7 Chatbot Support** - Instant answers to diet and fitness queries
- **Smart Recommendations** - Context-aware advice based on user goals
- **Motivational Support** - Daily encouragement and tips

### 🎨 Modern UI/UX
- **Responsive Design** - Works seamlessly on mobile, tablet, and desktop
- **Dark Mode** - Full dark theme support
- **Smooth Animations** - Beautiful transitions and interactions
- **Accessibility** - Following best practices for inclusive design

## 🏗️ Architecture

```
/NutriGenie
├── /backend          # Node.js + Express + MongoDB
│   ├── /config       # Database configuration
│   ├── /controllers  # Route controllers
│   ├── /models       # Mongoose schemas
│   ├── /routes       # API routes
│   ├── /middleware   # Auth & validation
│   ├── /utils        # Helper functions & data
│   └── server.js     # Entry point
│
└── /frontend         # React + Tailwind CSS
    ├── /public       # Static files
    └── /src
        ├── /components   # Reusable components
        ├── /context      # React context (Auth, Theme)
        ├── /pages        # Page components
        ├── App.jsx       # Main app component
        └── index.js      # Entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/nutrigenie
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
```

4. Start MongoDB (if running locally):
```bash
mongod
```

5. Start the backend server:
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

Backend will run at `${process.env.REACT_APP_API_URL}`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

Frontend will open at `${process.env.REACT_APP_API_URL}`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)
- `PUT /api/auth/profile` - Update profile (Protected)

### Diet Plans
- `GET /api/diet/plan` - Get personalized diet plan (Protected)
- `GET /api/diet/alternatives/:mealType` - Get alternative meals (Protected)

### Workouts
- `GET /api/workout/plan?location=home` - Get workout plan (Protected)

### Progress Tracking
- `POST /api/progress` - Log daily progress (Protected)
- `GET /api/progress?days=30` - Get progress history (Protected)
- `GET /api/progress/summary?period=week` - Get summary (Protected)

### Chatbot
- `POST /api/chatbot/chat` - Chat with NutriBot (Protected)

## 🧮 Core Calculations

### BMR (Basal Metabolic Rate)
Using Mifflin-St Jeor Equation:
- **Male**: BMR = 10W + 6.25H - 5A + 5
- **Female**: BMR = 10W + 6.25H - 5A - 161

Where: W = weight (kg), H = height (cm), A = age (years)

### TDEE (Total Daily Energy Expenditure)
TDEE = BMR × Activity Multiplier

Activity Multipliers:
- Sedentary: 1.2
- Light: 1.375
- Moderate: 1.55
- Active: 1.725
- Very Active: 1.9

### Target Calories
- **Weight Loss**: TDEE - 500 cal
- **Weight Gain**: TDEE + 500 cal
- **Muscle Gain**: TDEE + 300 cal
- **Maintenance**: TDEE

## 🎯 User Goals

- **Weight Loss** - Caloric deficit with high protein
- **Weight Gain** - Caloric surplus with balanced macros
- **Muscle Gain** - Moderate surplus with high protein
- **Maintenance** - Balanced nutrition at TDEE

## 🍛 Dietary Preferences

- **Vegetarian** - No meat or fish
- **Non-Vegetarian** - Includes all food groups
- **Vegan** - Plant-based only
- **Diabetic-Friendly** - Low GI, controlled carbs

## 🎨 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI library
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **Lucide React** - Icons

## 📱 Screenshots

*(Add screenshots of your app here)*

## 🚀 Deployment

### Backend (Render/Railway)
1. Push code to GitHub
2. Connect repository to Render/Railway
3. Add environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Build the app: `npm run build`
2. Deploy the `build` folder
3. Configure environment variables
4. Set up domain (optional)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Created with ❤️ for a healthier India

## 🙏 Acknowledgments

- ICMR for Indian nutritional guidelines
- FSSAI for food safety standards
- Community feedback and testing

---

**NutriGenie** - Your Personal AI Fitness Companion 🧘‍♀️

For support or queries, please open an issue on GitHub.
