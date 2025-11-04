require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGeminiAPI() {
  console.log('🧪 Testing Gemini API...\n');
  
  // Check if API key exists
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ Error: GEMINI_API_KEY not found in .env file');
    return;
  }
  
  console.log('✅ API Key found in .env');
  console.log(`📝 API Key: ${process.env.GEMINI_API_KEY.substring(0, 20)}...`);
  
  try {
    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Try the specific model identifier from the API
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    console.log('\n🔄 Sending test request to Gemini API...\n');
    
    // Test with a simple prompt
    const result = await model.generateContent('Say "Hello! The API is working!" in one sentence.');
    const response = result.response;
    const text = response.text();
    
    console.log('✅ SUCCESS! Gemini API is working!\n');
    console.log('📬 Response from Gemini:');
    console.log('─'.repeat(50));
    console.log(text);
    console.log('─'.repeat(50));
    console.log('\n🎉 Your Gemini API key is configured correctly!\n');
    
  } catch (error) {
    console.error('\n❌ ERROR: Gemini API test failed!\n');
    console.error('Error details:', error.message);
    
    if (error.message.includes('API_KEY_INVALID') || error.message.includes('invalid')) {
      console.error('\n💡 Solution: Your API key appears to be invalid.');
      console.error('   1. Go to: https://aistudio.google.com/app/apikey');
      console.error('   2. Create a new API key');
      console.error('   3. Replace the key in your .env file');
    } else if (error.message.includes('quota') || error.message.includes('limit')) {
      console.error('\n💡 Solution: Rate limit exceeded. Wait a minute and try again.');
    } else {
      console.error('\n💡 Solution: Check your internet connection and try again.');
    }
  }
}

testGeminiAPI();
