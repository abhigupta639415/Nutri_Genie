import React from 'react';

const variantClasses = {
  brand:
    'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/20 dark:border-cyan-500/30',
  accent:
    'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20 dark:border-emerald-500/30',
  purple:
    'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20 dark:border-indigo-500/30',
  violet:
    'bg-[#7C6FF0]/15 text-[#6355DE] dark:text-[#A5B4FC] border-[#7C6FF0]/25 dark:border-[#7C6FF0]/35',
  nutrition:
    'bg-[#34D399]/15 text-emerald-800 dark:text-[#34D399] border-[#34D399]/25 dark:border-[#34D399]/35',
  warning:
    'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20 dark:border-amber-500/30',
  danger:
    'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20 dark:border-rose-500/30',
  neutral:
    'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20 dark:border-slate-500/30',
};

const dotClasses = {
  brand: 'bg-cyan-500',
  accent: 'bg-emerald-500',
  purple: 'bg-indigo-500',
  violet: 'bg-[#7C6FF0]',
  nutrition: 'bg-[#34D399]',
  warning: 'bg-amber-500',
  danger: 'bg-rose-500',
  neutral: 'bg-slate-400',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs font-semibold gap-1',
  md: 'px-3 py-1 text-xs sm:text-sm font-semibold gap-1.5',
};

export const Badge = ({
  children,
  variant = 'brand',
  size = 'md',
  dot = false,
  icon: Icon,
  className = '',
  ...props
}) => {
  return (
    <span
      className={`inline-flex items-center rounded-full border backdrop-blur-sm transition-colors ${
        variantClasses[variant] || variantClasses.brand
      } ${sizeClasses[size] || sizeClasses.md} ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 animate-pulse ${
            dotClasses[variant] || dotClasses.brand
          }`}
        />
      )}
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
