import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  Camera,
  Upload,
  X,
  Apple,
  Flame,
  Zap,
  Droplet,
  Heart,
  Info,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { Button, Card, Badge, AnimatedCounter } from '../components/ui';

const FoodAnalyzer = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const processFile = (file) => {
    if (file) {
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

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
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
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze image. Please try again with a clearer photo.');
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* ─── HEADER ────────────────────────────────────────────────────── */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2">
          <Badge variant="brand" size="sm">
            AI Computer Vision
          </Badge>
          <Badge variant="accent" size="sm">
            Indian Cuisine Model
          </Badge>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Smart Food Analyzer 📸
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
          Upload or take a photo of your meal to calculate calories, macronutrients, and health benefits automatically.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* ─── UPLOAD / SCAN AREA (Left 5 cols) ────────────────────────── */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Camera className="w-5 h-5 text-cyan-500" />
              <span>Capture / Upload Dish</span>
            </h2>

            {!previewUrl ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('foodFileInput')?.click()}
                className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3 ${
                  isDragOver
                    ? 'border-cyan-500 bg-cyan-500/10'
                    : 'border-slate-300 dark:border-white/15 hover:border-cyan-500/50 hover:bg-slate-50 dark:hover:bg-white/5'
                }`}
              >
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shadow-inner">
                  <Upload className="w-8 h-8 animate-bounce" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Drop your meal photo here
                  </p>
                  <p className="text-xs text-slate-400 mt-1">or browse your device gallery</p>
                </div>
                <Badge variant="neutral" size="sm">
                  JPG, PNG, WEBP (Max 5MB)
                </Badge>
                <input
                  id="foodFileInput"
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-4">
                {/* Image preview with scanning laser overlay */}
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-900">
                  <img
                    src={previewUrl}
                    alt="Selected food preview"
                    className="w-full h-full object-cover"
                  />

                  {/* Laser scanning line animation when analyzing */}
                  {analyzing && (
                    <>
                      <div className="absolute inset-0 bg-cyan-500/10 backdrop-brightness-110" />
                      <motion.div
                        initial={{ top: '0%' }}
                        animate={{ top: ['0%', '95%', '0%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_rgba(6,182,212,0.8)] z-10"
                      />
                      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                        <span className="px-3.5 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md text-xs font-bold text-cyan-300 border border-cyan-400/30 animate-pulse">
                          Scanning Plate Telemetry...
                        </span>
                      </div>
                    </>
                  )}

                  {!analyzing && (
                    <button
                      type="button"
                      onClick={resetAnalyzer}
                      aria-label="Remove image"
                      className="absolute top-3 right-3 p-1.5 rounded-xl bg-slate-950/70 backdrop-blur-md text-white hover:bg-rose-600 transition-colors shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Analyze Trigger */}
                <Button
                  variant="primary"
                  size="lg"
                  onClick={analyzeFood}
                  isLoading={analyzing}
                  disabled={analyzing}
                  leftIcon={Sparkles}
                  className="w-full justify-center text-sm font-bold shadow-lg shadow-cyan-500/25"
                >
                  {analyzing ? 'Analyzing Nutrition with AI...' : 'Analyze Food Plate'}
                </Button>
              </div>
            )}

            {error && (
              <div className="mt-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-medium">
                {error}
              </div>
            )}
          </Card>
        </div>

        {/* ─── ANALYSIS RESULTS (Right 7 cols) ─────────────────────────── */}
        <div className="lg:col-span-7">
          {!result ? (
            <Card className="p-8 sm:p-12 text-center h-[420px] flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800/80 text-slate-400 flex items-center justify-center mb-4 shadow-inner">
                <Apple className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                Nutritional Breakdown
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                Take or upload a picture of any breakfast, lunch, or dinner plate to reveal verified calories, macros, and benefits.
              </p>
            </Card>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Detected Dish Title Card */}
              <Card className="p-6 bg-gradient-to-r from-cyan-500/10 via-teal-500/10 to-indigo-500/10 border-cyan-500/30">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                      Identified Food
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white capitalize">
                      {result.foodName}
                    </h2>
                  </div>
                  <Badge variant="accent" size="md" icon={CheckCircle2}>
                    Analyzed
                  </Badge>
                </div>
              </Card>

              {/* Nutritional Macro Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Card className="p-4 text-center">
                  <Flame className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                  <span className="text-xs text-slate-400 font-semibold block">Calories</span>
                  <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
                    <AnimatedCounter value={result.nutrients?.calories || 0} />
                  </p>
                  <span className="text-[10px] text-slate-400">kcal / 100g</span>
                </Card>

                <Card className="p-4 text-center">
                  <Zap className="w-4 h-4 text-rose-500 mx-auto mb-1" />
                  <span className="text-xs text-slate-400 font-semibold block">Protein</span>
                  <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
                    <AnimatedCounter value={result.nutrients?.protein || 0} suffix="g" />
                  </p>
                  <span className="text-[10px] text-slate-400">grams</span>
                </Card>

                <Card className="p-4 text-center">
                  <TrendingUp className="w-4 h-4 text-cyan-500 mx-auto mb-1" />
                  <span className="text-xs text-slate-400 font-semibold block">Carbs</span>
                  <p className="text-2xl font-black text-cyan-600 dark:text-cyan-400 mt-1">
                    <AnimatedCounter value={result.nutrients?.carbs || 0} suffix="g" />
                  </p>
                  <span className="text-[10px] text-slate-400">grams</span>
                </Card>

                <Card className="p-4 text-center">
                  <Droplet className="w-4 h-4 text-indigo-500 mx-auto mb-1" />
                  <span className="text-xs text-slate-400 font-semibold block">Fats</span>
                  <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                    <AnimatedCounter value={result.nutrients?.fats || 0} suffix="g" />
                  </p>
                  <span className="text-[10px] text-slate-400">grams</span>
                </Card>
              </div>

              {/* Health Benefits */}
              {result.benefits && result.benefits.length > 0 && (
                <Card className="p-6">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                    <Heart className="w-4 h-4 text-emerald-500" />
                    <span>Health & Dietary Benefits</span>
                  </h3>
                  <div className="space-y-2">
                    {result.benefits.map((b, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-white/5 flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Additional Information */}
              {result.additionalInfo && (
                <Card className="p-5 border-cyan-500/20 bg-cyan-500/5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-300 mb-1 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5" />
                    <span>Nutritionist Notes</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {result.additionalInfo}
                  </p>
                </Card>
              )}

              <Button
                variant="secondary"
                size="md"
                onClick={resetAnalyzer}
                leftIcon={RefreshCw}
                className="w-full justify-center"
              >
                Scan Another Food Item
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodAnalyzer;
