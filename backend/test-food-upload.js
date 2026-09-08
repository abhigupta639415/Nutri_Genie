const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function testFoodUpload() {
  console.log('🧪 Testing Food Upload API...\n');
  
  // Create a simple test image (Apple emoji as PNG)
  const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
  const testImagePath = path.join(__dirname, 'test-image.png');
  
  // Write test image to file
  fs.writeFileSync(testImagePath, Buffer.from(testImageBase64, 'base64'));
  
  try {
    const form = new FormData();
    form.append('image', fs.createReadStream(testImagePath));
    
    console.log('📤 Uploading test image to ${process.env.REACT_APP_API_URL}/api/food/analyze...\n');
    
    const response = await axios.post('${process.env.REACT_APP_API_URL}/api/food/analyze', form, {
      headers: {
        ...form.getHeaders()
      },
      timeout: 30000 // 30 second timeout
    });
    
    console.log('✅ SUCCESS! API is working!\n');
    console.log('📊 Response:');
    console.log(JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ ERROR: Cannot connect to backend server!');
      console.error('\n💡 Solution: Start the backend server first:');
      console.error('   cd backend');
      console.error('   npm run dev');
    } else if (error.response) {
      console.error('❌ API Error:', error.response.status);
      console.error('Message:', error.response.data);
    } else {
      console.error('❌ Error:', error.message);
    }
  } finally {
    // Cleanup test file
    if (fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath);
    }
  }
}

testFoodUpload();
