import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MailCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

const RESEND_COOLDOWN_SECONDS = 30;

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyEmail, resendVerificationCode } = useAuth();

  const emailFromState = location.state?.email || '';
  const [email, setEmail] = useState(emailFromState);
  const [code, setCode] = useState('');
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
      setError(err.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError('Enter your email address first.');
      return;
    }
    setError('');
    setInfo('');
    setResending(true);

    try {
      await resendVerificationCode(email);
      setInfo('A new code has been sent to your email.');
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not resend code. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-12 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      <div className="max-w-md w-full relative z-10 animate-fade-in">
        <div className="glass-dark rounded-3xl shadow-2xl p-8 md:p-10 border border-white/20">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-cyan-500/30 transform hover:scale-110 hover:rotate-6 transition-all duration-300">
                <MailCheck className="w-10 h-10 text-white" />
              </div>
            </div>
            <h2 className="text-4xl font-black text-white mb-3">Verify Your Email</h2>
            <p className="text-slate-400 text-lg">
              Enter the 6-digit code we sent to{' '}
              {emailFromState ? (
                <span className="text-cyan-400 font-semibold">{emailFromState}</span>
              ) : (
                'your email'
              )}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 backdrop-blur-sm border border-red-500/50 rounded-xl flex items-start space-x-3 animate-slide-up">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-300 font-semibold">{error}</p>
            </div>
          )}

          {info && (
            <div className="mb-6 p-4 bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/50 rounded-xl flex items-start space-x-3 animate-slide-up">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-emerald-300 font-semibold">{info}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!emailFromState && (
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-3">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-slate-500 font-semibold transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-3">
                Verification Code
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength="6"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                required
                placeholder="123456"
                className="w-full px-4 py-4 bg-slate-800/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-slate-500 font-black text-center text-3xl tracking-[0.5em] transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="group w-full py-4 px-6 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">{loading ? 'Verifying...' : 'Verify Email'}</span>
            </button>
          </form>

          <div className="mt-8 text-center space-y-3">
            <p className="text-slate-400">
              Didn't get the code?{' '}
              <button
                type="button"
                onClick={handleResend}
                disabled={resending || cooldown > 0}
                className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors duration-300 hover:underline disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
              >
                {cooldown > 0 ? `Resend in ${cooldown}s` : resending ? 'Sending...' : 'Resend code'}
              </button>
            </p>
            <p className="text-slate-500 text-sm">
              <Link to="/login" className="hover:text-cyan-400 transition-colors">
                Back to login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;