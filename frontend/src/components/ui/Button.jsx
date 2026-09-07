import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const variantClasses = {
  primary:
    'bg-[#7C6FF0] text-white hover:bg-[#6858e8] shadow-md shadow-[#7C6FF0]/25 hover:shadow-lg hover:shadow-[#7C6FF0]/35 border border-[#7C6FF0]/30',
  violet:
    'bg-[#7C6FF0] text-white hover:bg-[#6858e8] shadow-md shadow-[#7C6FF0]/25 hover:shadow-lg hover:shadow-[#7C6FF0]/35 border border-[#7C6FF0]/30',
  nutrition:
    'bg-[#10B981] text-white hover:bg-[#059669] shadow-md shadow-[#10B981]/25 hover:shadow-lg hover:shadow-[#10B981]/35 border border-[#10B981]/30',
  accent:
    'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-400 hover:to-teal-500 shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 border border-emerald-400/20',
  secondary:
    'bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-[#161B2E] dark:text-slate-100 dark:hover:bg-[#1f2640] border border-slate-200 dark:border-white/[0.08] shadow-sm',
  outline:
    'border border-cyan-500/50 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/10 dark:hover:bg-cyan-500/15',
  ghost:
    'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5',
  danger:
    'bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-400 hover:to-rose-500 shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/30 border border-red-400/20',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs font-semibold rounded-lg gap-1.5',
  md: 'px-4 py-2.5 text-sm font-semibold rounded-xl gap-2',
  lg: 'px-6 py-3.5 text-base font-bold rounded-2xl gap-2.5',
};

const Button = React.forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      className = '',
      disabled = false,
      type = 'button',
      onClick,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={isDisabled}
        onClick={onClick}
        whileHover={isDisabled ? {} : { scale: 1.02, y: -1 }}
        whileTap={isDisabled ? {} : { scale: 0.98, y: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className={`inline-flex items-center justify-center font-sans tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none ${
          variantClasses[variant] || variantClasses.primary
        } ${sizeClasses[size] || sizeClasses.md} ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
            <span>{children}</span>
          </>
        ) : (
          <>
            {LeftIcon && <LeftIcon className="w-4 h-4 shrink-0" aria-hidden="true" />}
            <span>{children}</span>
            {RightIcon && <RightIcon className="w-4 h-4 shrink-0" aria-hidden="true" />}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
