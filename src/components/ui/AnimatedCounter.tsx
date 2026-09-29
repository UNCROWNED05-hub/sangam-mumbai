import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  decimals?: number;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1.2,
  className = '',
  decimals = 0,
}) => {
  const spring = useSpring(0, {
    stiffness: 85,
    damping: 18,
    duration: duration * 1000,
  });

  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  useEffect(() => {
    return spring.on('change', (latest) => {
      setDisplayValue(Number(latest.toFixed(decimals)));
    });
  }, [spring, decimals]);

  return (
    <motion.span className={`inline-block tabular-nums font-display ${className}`}>
      {decimals > 0 ? displayValue.toFixed(decimals) : displayValue}
    </motion.span>
  );
};
