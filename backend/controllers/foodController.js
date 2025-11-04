const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');

// Initialize Gemini AI with Vision
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc    Analyze food image using Gemini Vision
// @route   POST /api/food/analyze
// @access  Public
const analyzeFoodImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    // Read the uploaded image file
    const imageBuffer = fs.readFileSync(req.file.path);
    const base64Image = imageBuffer.toString('base64');

    // Get Gemini model with vision capabilities
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Create the prompt for food analysis
    const prompt = `You are a nutrition expert. Analyze this food image and identify the food item.
    
Provide the response in EXACTLY this JSON format (no markdown, no extra text):
{
  "foodName": "name of the food",
  "nutrients": {
    "calories": 0,
    "protein": 0,
    "carbs": 0,
    "fats": 0
  },
  "benefits": ["benefit 1", "benefit 2", "benefit 3", "benefit 4", "benefit 5"],
  "additionalInfo": "additional information"
}

Important:
- Use numbers (not strings) for all nutrient values
- Provide nutritional values per 100g
- Include 3-5 health benefits
- Return ONLY the JSON object, nothing else`;

    // Prepare the image for Gemini
    const imageParts = [
      {
        inlineData: {
          data: base64Image,
          mimeType: req.file.mimetype
        }
      }
    ];

    // Generate content with the image and prompt
    const result = await model.generateContent([prompt, ...imageParts]);
    const response = result.response;
    let text = response.text();

    // Clean up the response - remove markdown code blocks and extra text
    console.log('Raw AI response:', text.substring(0, 200));
    
    text = text.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();
    
    // Try to extract JSON if it's embedded in text
    if (!text.startsWith('{')) {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        text = jsonMatch[0];
      }
    }

    // Parse the JSON response
    let analysisResult;
    try {
      analysisResult = JSON.parse(text);
      
      // Validate the structure
      if (!analysisResult.foodName || !analysisResult.nutrients) {
        throw new Error('Invalid response structure');
      }
      
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Cleaned response:', text);
      
      // Return a friendly error with the raw response for debugging
      throw new Error(`Failed to parse AI response: ${parseError.message}. Response was: ${text.substring(0, 100)}`);
    }

    // Delete the uploaded file after processing
    fs.unlinkSync(req.file.path);

    // Send the analysis result
    res.json(analysisResult);

  } catch (error) {
    console.error('Food analysis error:', error);
    
    // Clean up uploaded file in case of error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      message: 'Failed to analyze food image',
      error: error.message
    });
  }
};

module.exports = {
  analyzeFoodImage
};
