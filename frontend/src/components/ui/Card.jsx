import React from 'react';
import { motion } from 'framer-motion';

export const Card = React.forwardRef(
  (
    {
      children,
      className = '',
      hoverEffect = false,
      glow = false,
      variant = 'glass',
      onClick,
      ...props
    },
    ref
  ) => {
    const Component = hoverEffect ? motion.div : 'div';

    const glowClasses = {
      cyan: 'hover:shadow-glow-brand hover:border-cyan-500/30',
      accent: 'hover:shadow-glow-accent hover:border-emerald-500/30',
      purple: 'hover:shadow-glow-purple hover:border-indigo-500/30',
      true: 'hover:shadow-glow-brand hover:border-cyan-500/30',
    };

    const glowClass = glow ? glowClasses[glow] || glowClasses.true : '';

    const motionProps = hoverEffect
      ? {
          whileHover: { y: -3, transition: { duration: 0.2 } },
          whileTap: onClick ? { scale: 0.99 } : undefined,
        }
      : {};

    return (
      <Component
        ref={ref}
        onClick={onClick}
        {...motionProps}
        className={`relative rounded-2xl md:rounded-3xl border transition-all duration-200 ${
          variant === 'glass'
            ? 'glass-panel'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 shadow-sm'
        } ${glowClass} ${onClick ? 'cursor-pointer' : ''} ${className}`}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
Card.displayName = 'Card';

export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`p-6 sm:p-7 md:p-8 pb-3 ${className}`} {...props}>
    {children}
  </div>
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = ({ children, className = '', as: Tag = 'h3', ...props }) => (
  <Tag className={`text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white ${className}`} {...props}>
    {children}
  </Tag>
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = ({ children, className = '', ...props }) => (
  <p className={`text-sm md:text-base text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed ${className}`} {...props}>
    {children}
  </p>
);
CardDescription.displayName = 'CardDescription';

export const CardContent = ({ children, className = '', ...props }) => (
  <div className={`p-6 sm:p-7 md:p-8 ${className}`} {...props}>
    {children}
  </div>
);
CardContent.displayName = 'CardContent';

export const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`p-6 sm:p-7 md:p-8 pt-0 flex items-center ${className}`} {...props}>
    {children}
  </div>
);
CardFooter.displayName = 'CardFooter';

export default Card;
