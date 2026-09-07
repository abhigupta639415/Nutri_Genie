import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#090D16] px-4 transition-colors">
        <div className="text-center max-w-sm">
          {/* Glowing brand loader */}
          <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-indigo-600 p-[2px] opacity-80"
            >
              <div className="w-full h-full bg-white dark:bg-[#090D16] rounded-3xl" />
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 text-white"
            >
              <Sparkles className="w-7 h-7 animate-pulse" />
            </motion.div>
          </div>

          <h3 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">
            NutriGenie
          </h3>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 font-medium">
            Syncing your health metrics...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
