import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<'dropping' | 'shockwave' | 'done'>('dropping');

  useEffect(() => {
    // Check if user already saw preloader in this session or ?nopreload
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('nopreload') || sessionStorage.getItem('sangam_preloaded')) {
        onComplete();
        return;
      }
      sessionStorage.setItem('sangam_preloaded', 'true');
    }

    // Sequence: 0ms drop, 700ms shockwave, 1500ms done
    const timer1 = setTimeout(() => {
      setStage('shockwave');
    }, 650);

    const timer2 = setTimeout(() => {
      setStage('done');
      onComplete();
    }, 1500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  if (stage === 'done') return null;

  return (
    <AnimatePresence>
      <motion.div
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 z-[99998] bg-ink flex items-center justify-center overflow-hidden"
      >
        <div className="relative flex flex-col items-center">
          {/* Dropping Pin with Squash & Stretch */}
          <motion.div
            initial={{ y: -240, scaleY: 1.4, scaleX: 0.8 }}
            animate={
              stage === 'dropping'
                ? {
                    y: 0,
                    scaleY: [1.4, 0.6, 1.1, 1],
                    scaleX: [0.8, 1.4, 0.9, 1],
                  }
                : { y: 0, scale: 1 }
            }
            transition={{
              duration: 0.65,
              ease: [0.25, 1, 0.5, 1],
            }}
            className="w-12 h-12 text-marigold"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full drop-shadow-md">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </motion.div>

          {/* Expanding Shockwave Ring on Landing */}
          {stage === 'shockwave' && (
            <motion.div
              initial={{ scale: 0.2, opacity: 0.9 }}
              animate={{ scale: 28, opacity: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="absolute w-24 h-24 rounded-full border-4 border-marigold pointer-events-none"
            />
          )}

          {/* Wordmark peek */}
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="mt-4 font-display font-black text-2xl text-white tracking-tight"
          >
            sangam
          </motion.span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
