import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight, RotateCcw } from 'lucide-react';
import { Button, Card } from '../components/ui';

const ResetPassword = () => {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tokenMissing, setTokenMissing] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  // Extract token from URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenParam = params.get('token');
    if (!tokenParam || !tokenParam.trim()) {
      setTokenMissing(true);
      setError('No password reset token found. Please check the link in your email or request a new one.');
    } else {
      setToken(tokenParam.trim());
    }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('Reset token is missing. Please request a new password reset link.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please verify both fields.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await resetPassword(token, newPassword);
      setSuccess(true);
      // Automatically redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login', {
          state: { resetSuccessMessage: 'Password successfully reset! Please sign in with your new password.' }
        });
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Password reset link is invalid or has expired. Please request a new one.'
      );
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
          {/* Header */}
          <div className="text-center mb-8 space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-indigo-600 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/25 text-white mb-4">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Set New Password
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Please enter your new password below.
            </p>
          </div>

          {/* Success Screen */}
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4 space-y-6"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-500">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Password Reset Complete!
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Your password has been updated successfully. Redirecting you to login...
                </p>
              </div>
              <Button
                variant="primary"
                size="lg"
                onClick={() =>
                  navigate('/login', {
                    state: { resetSuccessMessage: 'Password successfully reset! Please sign in with your new password.' }
                  })
                }
                rightIcon={ArrowRight}
                className="w-full justify-center text-sm font-bold shadow-lg shadow-cyan-500/25"
              >
                Go to Login Now
              </Button>
            </motion.div>
          ) : (
            <>
              {/* Error Banner with shake animation */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1, x: [-8, 8, -6, 6, -3, 3, 0] }}
                  transition={{ duration: 0.4 }}
                  className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex flex-col gap-3"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-rose-700 dark:text-rose-300 leading-snug">
                      {error}
                    </p>
                  </div>

                  {/* If token is invalid, expired, or missing, show button to request new link */}
                  <div className="pt-2 border-t border-rose-500/20 text-right">
                    <Link
                      to="/forgot-password"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 dark:text-rose-300 hover:underline"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Request a new link
                    </Link>
                  </div>
                </motion.div>
              )}

              {/* Form */}
              {!tokenMissing && (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* New Password */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          if (error) setError('');
                        }}
                        required
                        minLength={6}
                        placeholder="At least 6 characters"
                        className="w-full pl-10 pr-11 py-3 text-sm rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all font-medium"
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

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (error) setError('');
                        }}
                        required
                        minLength={6}
                        placeholder="Re-enter your password"
                        className="w-full pl-10 pr-11 py-3 text-sm rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={loading}
                    rightIcon={ArrowRight}
                    className="w-full justify-center text-sm font-bold shadow-lg shadow-cyan-500/25 mt-2"
                  >
                    Reset Password
                  </Button>
                </form>
              )}

              {/* Footer navigation */}
              <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-white/10 text-center">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                >
                  ← Back to Login
                </Link>
              </div>
            </>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
