#!/bin/bash

# Google Gemini API Setup Script for NutriGenie
echo "🤖 Google Gemini AI Setup for NutriGenie Chatbot"
echo "================================================"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Creating .env from .env.example..."
    cp .env.example .env
fi

echo "📝 To complete setup, you need a FREE Google Gemini API key"
echo ""
echo "🔗 Get your key here: https://makersuite.google.com/app/apikey"
echo ""
echo "Steps:"
echo "1. Go to the link above"
echo "2. Sign in with Google"
echo "3. Click 'Create API Key'"
echo "4. Copy the key"
echo ""
read -p "📋 Paste your Gemini API key here: " api_key

# Validate input
if [ -z "$api_key" ]; then
    echo "❌ No API key provided. Exiting..."
    exit 1
fi

# Check if GEMINI_API_KEY already exists in .env
if grep -q "GEMINI_API_KEY" .env; then
    echo "⚠️  GEMINI_API_KEY already exists in .env"
    read -p "Do you want to replace it? (y/n): " replace
    if [ "$replace" = "y" ] || [ "$replace" = "Y" ]; then
        # Replace existing key
        sed -i '' "s/GEMINI_API_KEY=.*/GEMINI_API_KEY=$api_key/" .env
        echo "✅ API key updated in .env!"
    else
        echo "ℹ️  Keeping existing API key"
    fi
else
    # Add new key
    echo "" >> .env
    echo "# Google Gemini API" >> .env
    echo "GEMINI_API_KEY=$api_key" >> .env
    echo "✅ API key added to .env!"
fi

echo ""
echo "🎉 Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Restart your backend: npm start"
echo "2. Test the chatbot at: http://localhost:3000/chatbot"
echo ""
echo "📚 For more info, check GEMINI_SETUP_GUIDE.md"
