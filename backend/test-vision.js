require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

async function testVisionAPI() {
  console.log('🔍 Testing Gemini Vision API...\n');
  
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ Error: GEMINI_API_KEY not found in .env file');
    return;
  }
  
  console.log('✅ API Key found');
  
  // Models to try for vision (from available list)
  const modelsToTry = [
    'gemini-2.0-flash',
    'gemini-2.5-flash',
    'gemini-pro-latest',
    'gemini-flash-latest'
  ];
  
  // Create a simple test image (1x1 white pixel PNG)
  const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
  
  for (const modelName of modelsToTry) {
    try {
      console.log(`\n🔄 Testing ${modelName}...`);
      
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: modelName });
      
      const imageParts = [
        {
          inlineData: {
            data: testImageBase64,
            mimeType: 'image/png'
          }
        }
      ];
      
      const prompt = 'What do you see in this image?';
      const result = await model.generateContent([prompt, ...imageParts]);
      const response = result.response;
      const text = response.text();
      
      console.log(`✅ ${modelName} WORKS!`);
      console.log(`Response: ${text.substring(0, 100)}...`);
      console.log(`\n🎉 Use this model: ${modelName}`);
      break;
      
    } catch (error) {
      console.log(`❌ ${modelName} failed: ${error.message}`);
    }
  }
}

testVisionAPI();
