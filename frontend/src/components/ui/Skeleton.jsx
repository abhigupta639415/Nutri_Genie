import React from 'react';

export const Skeleton = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
  ...props
}) => {
  const variantStyles = {
    circular: 'rounded-full',
    text: 'rounded-md h-4 my-1',
    rectangular: 'rounded-2xl',
  };

  return (
    <div
      className={`relative overflow-hidden bg-slate-200/70 dark:bg-slate-800/60 ${
        variantStyles[variant] || variantStyles.rectangular
      } ${className}`}
      style={{ width, height }}
      {...props}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 dark:via-white/10 to-transparent" />
    </div>
  );
};

export default Skeleton;
