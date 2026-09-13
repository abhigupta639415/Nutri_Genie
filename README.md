# 🧘‍♀️ NutriGenie — AI-Powered Fitness & Diet Platform

NutriGenie is a full-stack MERN web application that delivers personalized diet and fitness recommendations tailored for Indian users. It combines modern nutritional science, Indian food culture, and Google Gemini AI to deliver a complete health companion experience.

![Stack](https://img.shields.io/badge/Stack-MERN-green?style=flat-square)
![AI](https://img.shields.io/badge/AI-Google%20Gemini-blue?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-lightgrey?style=flat-square)
![Node](https://img.shields.io/badge/Node.js-v14%2B-brightgreen?style=flat-square)

---

## ✨ Features

### 🍽️ Diet Management
- **AI-Powered Meal Plans** — Personalized Indian meal plans generated via Google Gemini, based on BMR/TDEE calculations
- **Macronutrient Tracking** — Detailed protein, carbs, and fats breakdown per meal
- **Dietary Preferences** — Vegetarian, Non-Vegetarian, Vegan, and Diabetic-Friendly support
- **Real Indian Food Data** — Comprehensive database of Indian dishes with nutritional information
- **Meal Alternatives** — Get alternative meals for any meal type on the fly

### 📸 Food Analyzer
- **AI Food Recognition** — Upload a photo of your food and get instant nutritional analysis using Google Gemini Vision
- **Image Upload Support** — Accepts JPEG, PNG, GIF, WebP (up to 5 MB)
- **Detailed Breakdown** — Calories, macros, and health insights for any dish

### 💪 Fitness & Workouts
- **Custom Workout Plans** — Personalized routines based on fitness level and goals
- **Multiple Exercise Types** — Yoga, HIIT, Cardio, and Strength training
- **Home & Gym Options** — Workout plans for both home and gym environments
- **Calorie Burn Tracking** — Estimated calories burned per exercise session

### 📊 Progress Analytics
- **Visual Charts** — Weight progress, calorie tracking, and lifestyle metrics with Recharts
- **Weekly/Monthly Reports** — Comprehensive progress summaries
- **Goal Tracking** — Monitor weight loss, gain, or maintenance targets
- **Workout Streaks** — Build consistency and healthy habits

### ✅ Todos & Task Manager
- **Fitness To-Do Lists** — Track fitness tasks and daily goals alongside your health journey

### 🤖 AI Assistant (NutriBot)
- **24/7 Chatbot Support** — Instant answers to diet and fitness queries powered by Gemini AI
- **Smart Recommendations** — Context-aware advice based on user goals
- **Motivational Support** — Daily encouragement and personalized tips

### 🔐 Authentication & Security
- **JWT Authentication** — Secure token-based auth
- **Email Verification** — OTP-based email verification via Brevo (formerly Sendinblue)
- **Forgot Password Flow** — Secure password reset via email OTP
- **bcrypt Password Hashing** — Industry-standard password security

### 🎨 Modern UI/UX
- **Responsive Design** — Works seamlessly on mobile, tablet, and desktop
- **Dark Mode** — Full dark theme support with toggle
- **Framer Motion Animations** — Smooth, polished transitions and interactions
- **Accessible Design** — Following best practices for inclusive design

---

## 🏗️ Project Structure

```
NutriGenie/
├── backend/                    # Node.js + Express + MongoDB API
│   ├── config/                 # Database connection (MongoDB)
│   ├── controllers/            # Route handler logic
│   ├── middleware/             # JWT auth middleware
│   ├── models/                 # Mongoose schemas (User, Progress, Todo, WorkoutPlan, GeminiDietPlan)
│   ├── routes/                 # API route definitions
│   ├── services/               # Email service (Brevo)
│   ├── utils/                  # Helper functions & Indian food data
│   └── server.js               # Express app entry point
│
└── frontend/                   # React 18 + Tailwind CSS SPA
    └── src/
        ├── components/         # Reusable UI components
        ├── context/            # React Context (Auth, Theme)
        ├── data/               # Static data assets
        ├── pages/              # Page-level components
        │   ├── Landing.jsx
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── Dashboard.jsx
        │   ├── DietPlan.jsx
        │   ├── Workout.jsx
        │   ├── Progress.jsx
        │   ├── FoodAnalyzer.jsx
        │   ├── Chatbot.jsx
        │   ├── Todos.jsx
        │   ├── ForgotPassword.jsx
        │   ├── ResetPassword.jsx
        │   └── VerifyEmail.jsx
        ├── utils/              # Utility helpers
        ├── App.jsx             # Root component & routing
        └── index.js            # React entry point
```

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Version |
|---|---|
| Node.js | v14 or higher |
| MongoDB | Local or Atlas |
| npm | Latest stable |

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/nutrigenie.git
cd nutrigenie
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/nutrigenie
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Brevo (Email Service)
BREVO_API_KEY=your_brevo_api_key
FROM_EMAIL=noreply@yourdomain.com
```

Start MongoDB locally (if not using Atlas):

```bash
# macOS (Homebrew)
brew services start mongodb-community

# Windows
net start MongoDB

# Linux
sudo systemctl start mongod
```

Start the backend server:

```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

> Backend runs at `http://localhost:3001`

---

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend/`:

```env
REACT_APP_API_URL=http://localhost:3001
```

Start the development server:

```bash
npm start
```

> Frontend opens at `http://localhost:3000`

---

## 📚 API Reference

All protected routes require an `Authorization: Bearer <token>` header.

### 🔐 Authentication — `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/register` | ❌ | Register a new user |
| `POST` | `/login` | ❌ | Login and receive JWT |
| `GET` | `/profile` | ✅ | Get current user profile |
| `PUT` | `/profile` | ✅ | Update user profile |
| `POST` | `/send-otp` | ❌ | Send email OTP for verification |
| `POST` | `/verify-otp` | ❌ | Verify OTP code |
| `POST` | `/verify-email` | ❌ | Verify email (alias) |
| `POST` | `/resend-verification` | ❌ | Resend verification code |
| `POST` | `/forgot-password` | ❌ | Initiate password reset |
| `POST` | `/reset-password` | ❌ | Complete password reset |

### 🍽️ Diet Plans — `/api/diet`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/plan` | ✅ | Get personalized AI diet plan |
| `GET` | `/alternatives/:mealType` | ✅ | Get alternative meals for a meal type |

### 💪 Workouts — `/api/workout`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/plan?location=home` | ✅ | Get workout plan (home or gym) |

### 📊 Progress — `/api/progress`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/` | ✅ | Log daily progress |
| `GET` | `/?days=30` | ✅ | Get progress history |
| `GET` | `/summary?period=week` | ✅ | Get weekly/monthly summary |

### 🤖 Chatbot — `/api/chatbot`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/chat` | ✅ | Send a message to NutriBot |

### ✅ Todos — `/api/todos`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/` | ✅ | Get all todos |
| `POST` | `/` | ✅ | Create a new todo |
| `PUT` | `/:id` | ✅ | Update a todo |
| `DELETE` | `/:id` | ✅ | Delete a todo |

### 📸 Food Analyzer — `/api/food`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/analyze` | ❌ | Analyze a food image (multipart/form-data, field: `image`) |

---

## 🧮 Nutritional Calculations

### BMR — Mifflin-St Jeor Equation

**Male:** `BMR = 10W + 6.25H - 5A + 5`

**Female:** `BMR = 10W + 6.25H - 5A - 161`

*Where: W = weight (kg), H = height (cm), A = age (years)*

### TDEE — Total Daily Energy Expenditure

`TDEE = BMR × Activity Multiplier`

| Activity Level | Multiplier |
|---|---|
| Sedentary | 1.2 |
| Light | 1.375 |
| Moderate | 1.55 |
| Active | 1.725 |
| Very Active | 1.9 |

### Target Calories by Goal

| Goal | Adjustment |
|---|---|
| Weight Loss | TDEE − 500 kcal |
| Maintenance | TDEE |
| Muscle Gain | TDEE + 300 kcal |
| Weight Gain | TDEE + 500 kcal |

---

## 🎨 Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB | NoSQL database |
| Mongoose | ODM / schema modeling |
| JWT | Authentication tokens |
| bcryptjs | Password hashing |
| @google/generative-ai | Gemini AI integration |
| @getbrevo/brevo | Transactional email (OTP, password reset) |
| Multer | Image upload handling |
| express-validator | Input validation |

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI library |
| React Router v6 | Client-side routing |
| Tailwind CSS | Utility-first styling |
| Framer Motion | Animations & transitions |
| Recharts | Data visualization / charts |
| Axios | HTTP client |
| Lucide React | Icon library |

---

## 🌐 Deployment

### Backend (Render / Railway)

1. Push code to GitHub
2. Connect your repository to [Render](https://render.com) or [Railway](https://railway.app)
3. Add environment variables from your `.env` file
4. Set start command: `node server.js`
5. Deploy!

### Frontend (Vercel / Netlify)

```bash
cd frontend
npm run build
```

1. Deploy the `build/` folder to [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
2. Set `REACT_APP_API_URL` to your deployed backend URL
3. Configure redirects for SPA routing (Netlify: add `_redirects` with `/* /index.html 200`)

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

Created with ❤️ for a healthier India.

## 🙏 Acknowledgments

- [ICMR](https://www.icmr.gov.in/) — Indian nutritional guidelines
- [FSSAI](https://fssai.gov.in/) — Food safety standards
- [Google Gemini](https://deepmind.google/technologies/gemini/) — AI intelligence
- [Brevo](https://www.brevo.com/) — Email delivery

---

**NutriGenie** — Your Personal AI Fitness Companion 🧘‍♀️

For support or queries, please open an issue on GitHub.
