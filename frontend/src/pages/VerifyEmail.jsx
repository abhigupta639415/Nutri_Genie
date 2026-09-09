import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { MailCheck, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button, Card } from '../components/ui';

const RESEND_COOLDOWN_SECONDS = 30;

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyEmail, resendVerificationCode } = useAuth();

  const emailFromState = location.state?.email || '';
  const emailWarningFromState = location.state?.emailWarning || '';
  const devCodeFromState = location.state?.devVerificationCode || '';

  const [email, setEmail] = useState(emailFromState);
  const [code, setCode] = useState(devCodeFromState);
  const [warning, setWarning] = useState(emailWarningFromState);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);

    try {
      await verifyEmail(email, code);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please check the 6-digit code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }
    setError('');
    setInfo('');
    setResending(true);

    try {
      const res = await resendVerificationCode(email);
      setInfo(res?.message || 'A new 6-digit verification code has been dispatched to your email.');
      if (res?.emailWarning) setWarning(res.emailWarning);
      if (res?.devVerificationCode) setCode(res.devVerificationCode);
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not resend code. Please try again later.');
    } finally {
      setResending(false);
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
        <Card className="p-8 sm:p-10 shadow-2xl border-slate-200/80 dark:border-white/10 text-center">
          {/* Icon Header */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-indigo-600 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/25 text-white mb-5">
            <MailCheck className="w-8 h-8" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
            Verify Your Email
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            Enter the 6-digit verification code sent to{' '}
            {emailFromState ? (
              <span className="font-semibold text-cyan-600 dark:text-cyan-400 block sm:inline">
                {emailFromState}
              </span>
            ) : (
              'your inbox'
            )}
          </p>

          {/* Feedback banners */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1, x: [-8, 8, -6, 6, -3, 3, 0] }}
              transition={{ duration: 0.4 }}
              className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start text-left gap-3"
            >
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-rose-700 dark:text-rose-300 leading-snug">
                {error}
              </p>
            </motion.div>
          )}

          {info && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start text-left gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300 leading-snug">
                {info}
              </p>
            </motion.div>
          )}

          {warning && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start text-left gap-3"
            >
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-xs font-medium text-amber-700 dark:text-amber-300 leading-snug space-y-1">
                <p className="font-bold">Email Notice:</p>
                <p>{warning}</p>
              </div>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {!emailFromState && (
              <div className="text-left">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 text-sm rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Security Code
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                required
                autoFocus
                placeholder="••••••"
                className="w-full px-4 py-4 text-center text-3xl font-black tracking-[0.4em] sm:tracking-[0.5em] rounded-2xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-inner"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading || code.length !== 6}
              isLoading={loading}
              rightIcon={ArrowRight}
              className="w-full justify-center text-sm font-bold shadow-lg shadow-cyan-500/25"
            >
              Verify & Enter NutriGenie
            </Button>
          </form>

          {/* Resend Actions */}
          <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-white/10 space-y-3">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Didn't receive the verification email?{' '}
              <button
                type="button"
                onClick={handleResend}
                disabled={resending || cooldown > 0}
                className="font-bold text-cyan-600 dark:text-cyan-400 hover:underline disabled:opacity-50 disabled:no-underline cursor-pointer"
              >
                {cooldown > 0
                  ? `Resend in ${cooldown}s`
                  : resending
                  ? 'Sending...'
                  : 'Resend code'}
              </button>
            </p>

            <div>
              <Link
                to="/login"
                className="text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                ← Back to Login
              </Link>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;