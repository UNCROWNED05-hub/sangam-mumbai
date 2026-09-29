import React from 'react';
import { motion } from 'motion/react';

interface OdometerProps {
  value: number;
  className?: string;
}

export const Odometer: React.FC<OdometerProps> = ({ value, className = '' }) => {
  const formatted = value.toLocaleString('en-US'); // e.g. "12,804"

  return (
    <div className={`inline-flex items-center overflow-hidden h-[1.3em] font-mono tabular-nums select-none ${className}`}>
      {formatted.split('').map((char, index) => {
        if (char === ',') {
          return (
            <span key={`comma-${index}`} className="opacity-60 px-0.5">
              ,
            </span>
          );
        }

        const digit = parseInt(char, 10);
        return (
          <div key={`digit-${index}-${formatted.length}`} className="relative w-[0.62em] h-full overflow-hidden">
            <motion.div
              initial={false}
              animate={{ y: `-${digit * 10}%` }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-0 left-0 flex flex-col items-center w-full"
            >
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <span key={n} className="h-[1.3em] flex items-center justify-center font-bold">
                  {n}
                </span>
              ))}
            </motion.div>
          </div>
        );
      })}
    </div>
  );
};
