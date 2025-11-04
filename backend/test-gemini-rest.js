require('dotenv').config();

async function testGeminiAPI() {
  console.log('🧪 Testing Gemini API with REST...\n');
  
  // Check if API key exists
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ Error: GEMINI_API_KEY not found in .env file');
    return;
  }
  
  console.log('✅ API Key found in .env');
  console.log(`📝 API Key: ${process.env.GEMINI_API_KEY.substring(0, 20)}...`);
  
  try {
    console.log('\n🔄 Sending test request to Gemini API...\n');
    
    // Call Gemini API directly using REST (trying gemini-2.0-flash model)
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    
    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'Say "Hello! The API is working!" in one sentence.'
          }]
        }]
      })
    });

    if (!apiResponse.ok) {
      const errorData = await apiResponse.text();
      throw new Error(`Gemini API error: ${apiResponse.status} ${apiResponse.statusText}\n${errorData}`);
    }

    const data = await apiResponse.json();
    const text = data.candidates[0].content.parts[0].text;
    
    console.log('✅ SUCCESS! Gemini API is working!\n');
    console.log('📬 Response from Gemini:');
    console.log('─'.repeat(50));
    console.log(text);
    console.log('─'.repeat(50));
    console.log('\n🎉 Your Gemini API key is configured correctly!\n');
    console.log('✨ Your chatbot is now ready to use!\n');
    
  } catch (error) {
    console.error('\n❌ ERROR: Gemini API test failed!\n');
    console.error('Error details:', error.message);
    
    if (error.message.includes('API_KEY_INVALID') || error.message.includes('invalid') || error.message.includes('403')) {
      console.error('\n💡 Solution: Your API key appears to be invalid.');
      console.error('   1. Go to: https://aistudio.google.com/app/apikey');
      console.error('   2. Create a new API key');
      console.error('   3. Replace the key in your .env file');
    } else if (error.message.includes('quota') || error.message.includes('limit') || error.message.includes('429')) {
      console.error('\n💡 Solution: Rate limit exceeded. Wait a minute and try again.');
    } else if (error.message.includes('404')) {
      console.error('\n💡 Solution: Model not found. The API configuration may have changed.');
    } else {
      console.error('\n💡 Solution: Check your internet connection and try again.');
    }
  }
}

testGeminiAPI();
