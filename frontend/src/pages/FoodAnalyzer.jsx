import React, { useState } from 'react';
import axios from 'axios';
import { Camera, Upload, X, Loader, Apple, Flame, Zap, Droplet, Heart, Info, CheckCircle, TrendingUp, Sparkles } from 'lucide-react';

const FoodAnalyzer = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size should be less than 5MB');
        return;
      }
      
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const analyzeFood = async () => {
    if (!selectedImage) return;

    setAnalyzing(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      const response = await axios.post('http://localhost:3001/api/food/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze image. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const resetAnalyzer = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mb-8 text-center animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-12 h-12 text-cyan-400 animate-pulse" />
            <h1 className="text-5xl md:text-6xl font-black text-white">
              Food Analyzer
            </h1>
            <Apple className="w-12 h-12 text-green-400 animate-pulse" />
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Upload a photo of any food item and get instant nutritional information, benefits, and insights powered by AI
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="glass-dark p-8 rounded-2xl border border-white/10 shadow-2xl animate-slide-up">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Camera className="w-7 h-7 text-cyan-400" />
              Upload Food Image
            </h2>

            {!previewUrl ? (
              <div
                className="border-3 border-dashed border-cyan-500/50 rounded-2xl p-12 text-center hover:border-cyan-400 hover:bg-slate-800/30 transition-all cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById('fileInput').click()}
              >
                <Upload className="w-16 h-16 text-cyan-400 mx-auto mb-4 animate-bounce" />
                <p className="text-white text-lg font-semibold mb-2">
                  Drop your food image here
                </p>
                <p className="text-slate-400 text-sm mb-4">
                  or click to browse
                </p>
                <p className="text-slate-500 text-xs">
                  Supports: JPG, PNG, WEBP (Max 5MB)
                </p>
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden group">
                  <img
                    src={previewUrl}
                    alt="Selected food"
                    className="w-full h-96 object-cover"
                  />
                  <button
                    onClick={resetAnalyzer}
                    className="absolute top-4 right-4 w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all shadow-lg opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>

                <button
                  onClick={analyzeFood}
                  disabled={analyzing}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-xl ${
                    analyzing
                      ? 'bg-slate-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 transform hover:scale-105'
                  } text-white`}
                >
                  {analyzing ? (
                    <span className="flex items-center justify-center gap-3">
                      <Loader className="w-6 h-6 animate-spin" />
                      Analyzing Food...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-3">
                      <Sparkles className="w-6 h-6" />
                      Analyze Nutrition
                    </span>
                  )}
                </button>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/50 rounded-xl">
                <p className="text-red-400 text-sm font-semibold">{error}</p>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="glass-dark p-8 rounded-2xl border border-white/10 shadow-2xl animate-slide-up animation-delay-200">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Info className="w-7 h-7 text-green-400" />
              Nutritional Information
            </h2>

            {!result ? (
              <div className="h-96 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
                  <Apple className="w-12 h-12 text-slate-600" />
                </div>
                <p className="text-slate-400 text-lg">
                  Upload a food image to see nutritional details
                </p>
              </div>
            ) : (
              <div className="space-y-6 animate-fade-in">
                {/* Food Name */}
                <div className="bg-gradient-to-r from-cyan-600 to-purple-600 p-6 rounded-2xl">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="w-6 h-6 text-white" />
                    <h3 className="text-xl font-black text-white">Detected Food</h3>
                  </div>
                  <p className="text-3xl font-black text-white capitalize">
                    {result.foodName}
                  </p>
                </div>

                {/* Nutritional Values */}
                <div>
                  <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-400" />
                    Nutritional Values (per 100g)
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-orange-500/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Flame className="w-5 h-5 text-orange-400" />
                        <span className="text-slate-400 text-sm">Calories</span>
                      </div>
                      <p className="text-3xl font-black text-orange-400">
                        {result.nutrients.calories}
                      </p>
                      <p className="text-xs text-slate-500">kcal</p>
                    </div>

                    <div className="bg-slate-800/50 p-4 rounded-xl border border-red-500/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-5 h-5 text-red-400" />
                        <span className="text-slate-400 text-sm">Protein</span>
                      </div>
                      <p className="text-3xl font-black text-red-400">
                        {result.nutrients.protein}
                      </p>
                      <p className="text-xs text-slate-500">grams</p>
                    </div>

                    <div className="bg-slate-800/50 p-4 rounded-xl border border-yellow-500/30">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-yellow-400" />
                        <span className="text-slate-400 text-sm">Carbs</span>
                      </div>
                      <p className="text-3xl font-black text-yellow-400">
                        {result.nutrients.carbs}
                      </p>
                      <p className="text-xs text-slate-500">grams</p>
                    </div>

                    <div className="bg-slate-800/50 p-4 rounded-xl border border-blue-500/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Droplet className="w-5 h-5 text-blue-400" />
                        <span className="text-slate-400 text-sm">Fats</span>
                      </div>
                      <p className="text-3xl font-black text-blue-400">
                        {result.nutrients.fats}
                      </p>
                      <p className="text-xs text-slate-500">grams</p>
                    </div>
                  </div>
                </div>

                {/* Health Benefits */}
                {result.benefits && result.benefits.length > 0 && (
                  <div>
                    <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Heart className="w-5 h-5 text-green-400" />
                      Health Benefits
                    </h4>
                    <div className="space-y-3">
                      {result.benefits.map((benefit, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-xl border border-green-500/20 hover:border-green-500/40 transition-all"
                        >
                          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-5 h-5 text-white" />
                          </div>
                          <p className="text-slate-300 leading-relaxed">{benefit}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Info */}
                {result.additionalInfo && (
                  <div className="bg-slate-800/50 p-5 rounded-xl border border-cyan-500/20">
                    <h4 className="text-sm font-bold text-cyan-400 mb-2">Additional Information</h4>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {result.additionalInfo}
                    </p>
                  </div>
                )}

                {/* Reset Button */}
                <button
                  onClick={resetAnalyzer}
                  className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all"
                >
                  Analyze Another Food
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="glass-dark p-6 rounded-2xl border border-white/10 shadow-xl">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mb-4">
              <Camera className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">AI-Powered Analysis</h3>
            <p className="text-slate-400 text-sm">
              Advanced AI technology identifies food items and provides accurate nutritional data
            </p>
          </div>

          <div className="glass-dark p-6 rounded-2xl border border-white/10 shadow-xl">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Health Benefits</h3>
            <p className="text-slate-400 text-sm">
              Discover the health benefits and nutritional advantages of any food item
            </p>
          </div>

          <div className="glass-dark p-6 rounded-2xl border border-white/10 shadow-xl">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Instant Results</h3>
            <p className="text-slate-400 text-sm">
              Get detailed nutritional information and insights within seconds
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodAnalyzer;
