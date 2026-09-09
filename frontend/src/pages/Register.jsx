import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Lock,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Button, Card } from '../components/ui';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    gender: 'male',
    weight: '',
    height: '',
    goal: 'maintenance',
    activityLevel: 'moderate',
    dietaryPreference: 'vegetarian',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const data = {
      ...formData,
      age: parseInt(formData.age, 10),
      weight: parseFloat(formData.weight),
      height: parseFloat(formData.height),
    };

    try {
      const result = await register(data);
      navigate('/verify-email', {
        state: {
          email: result?.email || data.email,
        },
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-12 relative">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="max-w-2xl w-full"
      >
        <Card className="p-8 sm:p-10 shadow-2xl border-slate-200/80 dark:border-white/10">
          {/* Header */}
          <div className="text-center mb-8 space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-indigo-600 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/25 text-white mb-4">
              <Sparkles className="w-7 h-7 animate-pulse" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Create Your Profile
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Personalize NutriGenie with your body metrics and dietary lifestyle
            </p>
          </div>

          {/* Error message with shake animation */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1, x: [-8, 8, -6, 6, -3, 3, 0] }}
              transition={{ duration: 0.4 }}
              className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-rose-700 dark:text-rose-300 leading-snug">
                {error}
              </p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Account Info Section */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 pb-1 border-b border-slate-200/80 dark:border-white/10">
                1. Account Credentials
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Priya Sharma"
                      className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="priya@example.com"
                      className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Create a strong password (min 6 characters)"
                    className="w-full pl-10 pr-11 py-2.5 text-sm rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Bio-Metrics Section */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 pb-1 border-b border-slate-200/80 dark:border-white/10">
                2. Body Metrics
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Age (yrs)
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    min="10"
                    max="100"
                    placeholder="26"
                    className="w-full px-3 py-2.5 text-sm rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 text-sm rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    required
                    min="30"
                    max="250"
                    placeholder="70"
                    className="w-full px-3 py-2.5 text-sm rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    required
                    min="100"
                    max="250"
                    placeholder="172"
                    className="w-full px-3 py-2.5 text-sm rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Lifestyle & Goals Section */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 pb-1 border-b border-slate-200/80 dark:border-white/10">
                3. Lifestyle & Diet
              </h3>
              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Primary Goal
                  </label>
                  <select
                    name="goal"
                    value={formData.goal}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 text-sm rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
                  >
                    <option value="weight_loss">Weight Loss (Fat Loss)</option>
                    <option value="muscle_gain">Muscle Gain</option>
                    <option value="maintenance">Maintenance & Energy</option>
                    <option value="weight_gain">Weight Gain</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Activity Level
                  </label>
                  <select
                    name="activityLevel"
                    value={formData.activityLevel}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 text-sm rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
                  >
                    <option value="sedentary">Sedentary (Desk Job)</option>
                    <option value="light">Light (1-2 days/wk)</option>
                    <option value="moderate">Moderate (3-5 days/wk)</option>
                    <option value="active">Active (6-7 days/wk)</option>
                    <option value="very_active">Very Active (Athlete)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Dietary Preference
                  </label>
                  <select
                    name="dietaryPreference"
                    value={formData.dietaryPreference}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 text-sm rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
                  >
                    <option value="vegetarian">Pure Vegetarian</option>
                    <option value="eggetarian">Eggetarian</option>
                    <option value="non_vegetarian">Non-Vegetarian</option>
                    <option value="jain">Jain (No Root Veg)</option>
                    <option value="vegan">Vegan</option>
                  </select>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              rightIcon={ArrowRight}
              className="w-full justify-center text-sm font-bold shadow-lg shadow-cyan-500/25 mt-4"
            >
              Continue to Email Verification
            </Button>
          </form>

          {/* Footer link */}
          <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-white/10 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-bold text-cyan-600 dark:text-cyan-400 hover:underline"
              >
                Sign in here →
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;