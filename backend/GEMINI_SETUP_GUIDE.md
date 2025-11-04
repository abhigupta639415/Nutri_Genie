# 🤖 Google Gemini AI Integration - Setup Guide

## ✅ Installation Complete!

The Gemini AI integration has been successfully installed in your chatbot!

---

## 🔑 Step 1: Get Your FREE Gemini API Key

### **Get API Key (100% Free):**

1. **Go to Google AI Studio:**
   ```
   https://makersuite.google.com/app/apikey
   ```
   OR
   ```
   https://aistudio.google.com/app/apikey
   ```

2. **Sign in** with your Google account

3. **Click "Create API Key"**

4. **Copy the API key** (looks like: `AIzaSyC...`)

### **Free Tier Limits:**
- ✅ **60 requests per minute**
- ✅ **1,500 requests per day**
- ✅ **100% FREE** - No credit card required!
- ✅ Perfect for NutriGenie chatbot

---

## 🔧 Step 2: Add API Key to .env File

### **Open your .env file:**
```bash
cd /Users/ankityadav/innotech/NutriGenie/backend
nano .env
```

### **Add this line at the end:**
```env
GEMINI_API_KEY=your_api_key_here
```

### **Example .env file:**
```env
# Server Configuration
PORT=3001
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/nutrigenie

# JWT
JWT_SECRET=your_jwt_secret_here

# Google Gemini API (ADD THIS LINE)
GEMINI_API_KEY=AIzaSyC_your_actual_key_here
```

### **Save the file:**
- Press `Ctrl + X`
- Press `Y` to confirm
- Press `Enter`

---

## 🚀 Step 3: Restart Backend

```bash
# Kill existing backend
kill -9 $(lsof -ti :3001)

# Start backend
npm start
```

---

## ✅ Step 4: Test the Chatbot

### **Option 1: Using curl**
```bash
curl -X POST http://localhost:3001/api/chatbot/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is a good breakfast for weight loss?"}'
```

### **Option 2: Using the Frontend**
1. Start frontend: `cd ../frontend && npm start`
2. Go to: `http://localhost:3000/chatbot`
3. Type a message like: "Give me a diet plan for muscle gain"
4. You should get an AI-powered response! 🎉

---

## 🎯 What Changed

### **Before (Rule-Based):**
```javascript
// Old: Simple if-else rules
if (message.includes('diet')) {
  response = 'Static diet advice...';
}
```

### **After (AI-Powered):**
```javascript
// New: Google Gemini AI (using gemini-2.0-flash)
// Using REST API for better compatibility
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
const result = await fetch(apiUrl, {...});
// Smart, contextual responses!
```

---

## 💡 Features of AI-Powered Chatbot

### **Capabilities:**
- ✅ **Natural Conversations** - Understands context
- ✅ **Personalized Advice** - Tailored responses
- ✅ **Indian Cuisine Focus** - Knows Indian foods
- ✅ **Fitness Expertise** - Diet + Workout advice
- ✅ **Motivational Support** - Encouraging messages
- ✅ **Smart Memory** - Remembers conversation context

### **Example Questions:**
- "What's a good vegetarian protein source?"
- "Create a 7-day meal plan for weight loss"
- "Best exercises for abs at home?"
- "How many calories should I eat?"
- "Give me motivation to workout"
- "What are macros and why do they matter?"

---

## 🔒 Security Best Practices

### **Keep API Key Secure:**
```bash
# ✅ DO: Keep in .env file (already in .gitignore)
GEMINI_API_KEY=your_key

# ❌ DON'T: Commit to GitHub
# ❌ DON'T: Share publicly
# ❌ DON'T: Hardcode in source files
```

### **Regenerate Key if Exposed:**
- Go to: https://makersuite.google.com/app/apikey
- Delete old key
- Create new key
- Update .env file

---

## 🐛 Troubleshooting

### **Error: "Gemini API key is not configured"**
**Solution:**
```bash
# Check if .env has the key
cat .env | grep GEMINI

# If not found, add it
echo "GEMINI_API_KEY=your_key_here" >> .env

# Restart backend
npm start
```

### **Error: "API key not valid"**
**Solution:**
- Get a new API key from Google AI Studio
- Make sure you copied the entire key
- No spaces before/after the key in .env

### **Error: "Rate limit exceeded"**
**Solution:**
- Free tier: 60 requests/min, 1500/day
- Wait a minute and try again
- Consider upgrading if needed (still free for most use)

### **Chatbot responds but with fallback message**
**Solution:**
```bash
# Check backend logs
npm start

# Look for errors in console
# Make sure .env is loaded correctly
```

---

## 📊 API Usage Monitoring

### **Check Your Usage:**
1. Go to: https://makersuite.google.com/app/apikey
2. Click on your API key
3. View usage statistics
4. Monitor daily requests

### **Free Tier Limits:**
- **Per Minute:** 60 requests ✅
- **Per Day:** 1,500 requests ✅
- **Per Month:** Unlimited (within daily limit) ✅

For NutriGenie chatbot, this is more than enough!

---

## 🎨 Customization Options

### **Modify Bot Personality:**

Edit `/backend/controllers/chatbotController.js` line 30:

```javascript
const systemPrompt = `You are NutriBot, an expert AI fitness and nutrition assistant.

Your expertise:
- Diet planning and nutrition advice
- Workout routines and exercise guidance
- Indian cuisine and healthy recipes
- Weight loss and muscle gain strategies

Guidelines:
- Be encouraging and motivational
- Use emojis occasionally
- Keep responses concise
- Focus on Indian diet when relevant

User's question: ${message}

Provide a helpful response:`;
```

### **Change Response Style:**
```javascript
// More casual
Guidelines: "Be super friendly and casual, like a gym buddy"

// More professional
Guidelines: "Be professional and scientific, cite research"

// More motivational
Guidelines: "Be extremely motivational, use lots of emojis and encouragement"
```

---

## 📈 Upgrade Options (If Needed)

### **Current: Free Tier**
- 60 requests/min
- 1,500 requests/day
- Perfect for development and small apps

### **If You Need More:**
- Google Cloud offers higher limits
- Pay-as-you-go pricing
- But free tier is usually sufficient!

---

## ✨ Example Conversations

### **Diet Planning:**
```
User: "I want to lose 5kg in 2 months. What should I eat?"
Bot: "Great goal! Here's a sustainable plan for losing 5kg in 2 months:

🎯 Calorie Target: Create a 500-calorie daily deficit
📊 Expected Loss: 0.5kg per week (healthy rate)

🍽️ Daily Meal Plan:
BREAKFAST (300-350 cal)
- Oats upma with vegetables
- OR Moong dal chilla with mint chutney

LUNCH (400-450 cal)
- 2 rotis + dal + vegetable curry + salad
- Brown rice portion if preferred

SNACK (150-200 cal)
- Fruit (apple, orange, or berries)
- OR Roasted chana

DINNER (350-400 cal)
- Grilled paneer + soup + salad
- OR Light khichdi with curd

💡 Tips:
- Drink 8-10 glasses water daily
- Walk 30 minutes after dinner
- Sleep 7-8 hours
- Track progress weekly

Would you like a detailed 7-day meal plan?"
```

### **Workout Advice:**
```
User: "Best home workout for beginners?"
Bot: "Perfect! Here's a beginner-friendly home workout plan:

🏠 NO EQUIPMENT NEEDED

📅 WEEK 1-2: Foundation Building (3 days/week)
- Warm-up: 5 min (jumping jacks, arm circles)
- Squats: 3 sets of 10 reps
- Push-ups (knee): 3 sets of 8 reps
- Plank: 3 sets of 20 seconds
- Lunges: 3 sets of 8 each leg
- Cool down: 5 min stretching

⏱️ Total Time: 25-30 minutes

✅ Rest days between workouts
✅ Focus on FORM over speed
✅ Gradually increase reps

Want me to create Week 3-4 progression?"
```

---

## 🎉 Success Checklist

- ✅ Gemini package installed (`@google/generative-ai`)
- ✅ Chatbot controller updated
- ✅ API key obtained from Google AI Studio
- ✅ API key added to .env file
- ✅ Backend restarted
- ✅ Chatbot tested and working

---

## 📞 Support

### **If you need help:**
1. Check backend console for errors
2. Verify API key in .env
3. Test API key at Google AI Studio
4. Check network connection
5. Restart backend server

### **Resources:**
- Google AI Studio: https://aistudio.google.com
- Gemini API Docs: https://ai.google.dev/docs
- NutriGenie GitHub Issues: (your repo)

---

## 🚀 You're All Set!

Your NutriGenie chatbot now has **powerful AI capabilities** powered by Google Gemini!

**Next Steps:**
1. Get your free API key
2. Add to .env file
3. Restart backend
4. Test the chatbot
5. Enjoy smart conversations! 🎉

---

**Updated:** Oct 31, 2025
**Integration:** Google Gemini AI
**Status:** Ready to Use! ✨
