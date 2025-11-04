// Using direct REST API instead of SDK for better compatibility

// AI-powered chatbot using Google Gemini
const getChatbotResponse = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ 
        message: 'Please provide a message',
        timestamp: new Date()
      });
    }

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        message: 'Gemini API key is not configured. Please add GEMINI_API_KEY to your .env file.',
        timestamp: new Date()
      });
    }

    // Create a fitness-focused prompt
    const systemPrompt = `You are NutriBot, an expert AI fitness and nutrition assistant for NutriGenie app. 

Your expertise:
- Diet planning and nutrition advice
- Workout routines and exercise guidance
- Indian cuisine and healthy recipes
- Weight loss and muscle gain strategies
- Fitness motivation and wellness tips
- BMI, BMR, TDEE calculations

Guidelines:
- Provide accurate, science-based fitness and nutrition information
- Focus on Indian diet and cuisine when relevant
- Be encouraging and motivational
- Keep responses concise but informative
- Use emojis occasionally to be friendly
- If asked about medical conditions, advise consulting a doctor

User's question: ${message}

Provide a helpful, friendly response:`;

    // Call Gemini API directly using REST (using gemini-2.0-flash model)
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    
    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: systemPrompt
          }]
        }]
      })
    });

    if (!apiResponse.ok) {
      throw new Error(`Gemini API error: ${apiResponse.status} ${apiResponse.statusText}`);
    }

    const data = await apiResponse.json();
    const botReply = data.candidates[0].content.parts[0].text;

    res.json({
      message: botReply,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Gemini API Error:', error);
    
    // Fallback response if API fails
    const fallbackResponse = `I'm having trouble connecting right now. Here's what I can help with:

✅ Diet and nutrition advice
✅ Workout recommendations
✅ Indian meal planning
✅ Fitness motivation
✅ Weight loss/gain strategies

Please try asking your question again, or check if the Gemini API key is properly configured.`;
    
    res.json({
      message: fallbackResponse,
      timestamp: new Date(),
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getChatbotResponse
};
