# 🚀 NutriGenie Quick Start Guide

Get NutriGenie up and running in minutes!

## 📋 Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js (v14+) installed - Check: `node --version`
- ✅ MongoDB installed or MongoDB Atlas account
- ✅ npm or yarn installed - Check: `npm --version`

## 🎯 Quick Setup (5 Minutes)

### Step 1: Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your settings (use any text editor)
# Minimum required:
# PORT=3001
# MONGODB_URI=mongodb://localhost:27017/nutrigenie
# JWT_SECRET=your_secret_key_here
# NODE_ENV=development

# Start MongoDB (if running locally)
# On Mac: brew services start mongodb-community
# On Windows: net start MongoDB
# On Linux: sudo systemctl start mongod

# Or use MongoDB Atlas (free tier):
# 1. Go to mongodb.com/cloud/atlas
# 2. Create free cluster
# 3. Get connection string
# 4. Add to MONGODB_URI in .env

# Start backend server
npm run dev
```

**Backend should now be running at ${process.env.REACT_APP_API_URL}** ✅

### Step 2: Frontend Setup

Open a new terminal window:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

**Frontend should open automatically at ${process.env.REACT_APP_API_URL}** ✅

## 🎉 You're Ready!

1. **Visit** ${process.env.REACT_APP_API_URL}
2. **Click** "Get Started" or "Register"
3. **Fill in** your details:
   - Name, email, password
   - Age, gender, weight, height
   - Fitness goal (weight loss, gain, etc.)
   - Activity level
   - Dietary preference (vegetarian, non-veg, vegan)
4. **Click** "Create Account"
5. **Explore** your personalized:
   - Dashboard
   - Diet Plan
   - Workout Plan
   - Progress Tracker
   - NutriBot Chat

## 🔧 Troubleshooting

### Backend won't start?
- **MongoDB not running?** Start MongoDB service
- **Port 3001 in use?** Change PORT in .env
- **Dependencies error?** Delete `node_modules` and run `npm install` again

### Frontend won't start?
- **Port 3001 in use?** It will ask to use another port (say yes)
- **Dependencies error?** Delete `node_modules` and run `npm install` again
- **Can't connect to backend?** Ensure backend is running on port 3001

### Can't login after registration?
- Check backend console for errors
- Verify MongoDB is running and connected
- Try a different email address

## 📱 Test the Application

### Sample User Journey
1. **Register** a new account
2. **View Dashboard** - See your BMI, BMR, TDEE
3. **Check Diet Plan** - View personalized Indian meals
4. **Browse Workouts** - Switch between Home/Gym
5. **Chat with NutriBot** - Ask: "How can I lose weight?"
6. **Track Progress** - (After a few days of logging)

### Quick Test Credentials
Create a test user with:
- Email: test@nutrigenie.com
- Password: test123
- Age: 25, Gender: Male
- Weight: 70kg, Height: 170cm
- Goal: Weight Loss
- Activity: Moderate
- Diet: Vegetarian

## 🌐 Access URLs

- **Frontend**: ${process.env.REACT_APP_API_URL}
- **Backend API**: ${process.env.REACT_APP_API_URL}
- **API Documentation**: ${process.env.REACT_APP_API_URL} (shows available endpoints)

## 📊 Sample API Test

Test backend is working:
```bash
curl ${process.env.REACT_APP_API_URL}
```

Should return API information.

## 🎨 Features to Try

1. **Dark Mode** - Toggle sun/moon icon in navbar
2. **Diet Plan** - See Indian meals with macros
3. **Workout Plans** - Switch between home/gym
4. **Progress Charts** - (Need to log some progress first)
5. **NutriBot Chat** - Ask fitness questions
6. **Profile Update** - Change your goals anytime

## 🚀 Next Steps

- Log your daily meals and workouts
- Track progress for a week
- Chat with NutriBot for tips
- Explore all features
- Share feedback!

## 💡 Pro Tips

- **Bookmark** ${process.env.REACT_APP_API_URL} for easy access
- **Keep backend running** in one terminal
- **Frontend in another** terminal
- **MongoDB must be running** at all times
- **Check console** for any errors

## 🆘 Need Help?

- Check main README.md for detailed docs
- Backend README: `backend/README.md`
- Frontend README: `frontend/README.md`
- Open an issue on GitHub

---

**Enjoy NutriGenie! 🧘‍♀️**

Start your fitness journey today!
