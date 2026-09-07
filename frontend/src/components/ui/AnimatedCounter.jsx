import React, { useEffect, useRef } from 'react';
import { useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

export const AnimatedCounter = ({
  value = 0,
  duration = 1.2,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
}) => {
  const numericValue = typeof value === 'number' ? value : parseFloat(value) || 0;
  const prefersReducedMotion = useReducedMotion();
  const motionVal = useMotionValue(prefersReducedMotion ? numericValue : 0);
  const springVal = useSpring(motionVal, {
    damping: 30,
    stiffness: 100,
  });

  const spanRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion) {
      if (spanRef.current) {
        spanRef.current.textContent = `${prefix}${numericValue.toFixed(decimals)}${suffix}`;
      }
      return;
    }

    motionVal.set(numericValue);
  }, [numericValue, prefersReducedMotion, motionVal, prefix, suffix, decimals]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const unsubscribe = springVal.on('change', (latest) => {
      if (spanRef.current) {
        spanRef.current.textContent = `${prefix}${latest.toFixed(decimals)}${suffix}`;
      }
    });

    return () => unsubscribe();
  }, [springVal, decimals, prefix, suffix, prefersReducedMotion]);

  return (
    <span ref={spanRef} className={className}>
      {prefix}
      {numericValue.toFixed(decimals)}
      {suffix}
    </span>
  );
};

export default AnimatedCounter;
