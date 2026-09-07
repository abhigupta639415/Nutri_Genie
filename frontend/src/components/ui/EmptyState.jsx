import React from 'react';
import { motion } from 'framer-motion';

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`glass-panel rounded-3xl p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-md mx-auto ${className}`}
    >
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-5 shadow-inner">
          <Icon className="w-8 h-8" aria-hidden="true" />
        </div>
      )}
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </motion.div>
  );
};

export default EmptyState;
