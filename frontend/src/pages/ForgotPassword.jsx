import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { KeyRound, Mail, AlertCircle, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button, Card } from '../components/ui';

const COOLDOWN_SECONDS = 60;

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const { forgotPassword } = useAuth();

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.trim()) {
      setError('Please provide a valid email address.');
      return;
    }

    if (cooldown > 0) {
      setError(`Please wait ${cooldown} seconds before submitting another request.`);
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await forgotPassword(email.trim());
      // Show generic security best practice message
      setSuccessMessage(
        res?.message || 'If this email exists, a reset link has been sent.'
      );
      setCooldown(COOLDOWN_SECONDS);
    } catch (err) {
      if (err.response?.status === 429) {
        const wait = err.response.data?.waitSeconds || 60;
        setCooldown(wait);
        setError(err.response.data?.message || `Please wait ${wait} seconds before requesting another reset link.`);
      } else {
        // Even on unexpected error, avoid leaking user info
        setError(err.response?.data?.message || 'Unable to process request right now. Please try again later.');
      }
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
        className="max-w-md w-full"
      >
        <Card className="p-8 sm:p-10 shadow-2xl border-slate-200/80 dark:border-white/10">
          {/* Logo / Header Icon */}
          <div className="text-center mb-8 space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-indigo-600 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/25 text-white mb-4">
              <KeyRound className="w-7 h-7" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Forgot Password?
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Enter your registered email address and we'll send you a link to reset your password.
            </p>
          </div>

          {/* Success Banner */}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 leading-snug">
                  {successMessage}
                </p>
                <p className="text-xs text-emerald-600/90 dark:text-emerald-400/90 leading-relaxed">
                  Be sure to check your inbox and spam/junk folder. The reset link expires in 1 hour.
                </p>
              </div>
            </motion.div>
          )}

          {/* Error Banner with shake animation */}
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  required
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all font-medium"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading || cooldown > 0}
              isLoading={loading}
              rightIcon={ArrowRight}
              className="w-full justify-center text-sm font-bold shadow-lg shadow-cyan-500/25 mt-2"
            >
              {cooldown > 0 ? `Resend Link in ${cooldown}s` : 'Send Reset Link'}
            </Button>
          </form>

          {/* Back to Login Link */}
          <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-white/10 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
