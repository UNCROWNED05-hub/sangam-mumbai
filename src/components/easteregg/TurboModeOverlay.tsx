import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHealthStore } from '../../store/useHealthStore';
import { Flame, Sparkles, X, Zap } from 'lucide-react';
import { soundFx } from '../../utils/sound';

export const TurboModeOverlay: React.FC = () => {
  const { turboMode, setTurboMode } = useHealthStore();

  if (!turboMode) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -30, scale: 0.9 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
      >
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/90 via-yellow-500/90 to-amber-600/90 text-slate-950 font-bold shadow-2xl backdrop-blur-xl border border-yellow-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-slate-950 text-amber-400">
              <Flame className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-black tracking-wider uppercase">
                <span>Konami Code Unlocked!</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-950 text-white text-[10px]">
                  TURBO
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-900 leading-tight mt-0.5">
                Golden Biosensor Matrix & Hyper-Responsive Audio activated.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playTap(400);
              setTurboMode(false);
            }}
            className="p-1.5 rounded-lg bg-slate-950/20 hover:bg-slate-950/40 text-slate-950 transition-colors"
            aria-label="Dismiss Turbo Mode"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
