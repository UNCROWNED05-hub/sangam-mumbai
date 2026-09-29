import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../store/useAppStore';
import { X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast, leavePlan } = useAppStore();

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[99990] flex flex-col items-center gap-2 pointer-events-none w-full max-w-sm px-4">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 25, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 450, damping: 32 }}
            className="w-full p-3.5 rounded-2xl bg-ink dark:bg-night text-white border border-white/10 shadow-ambient flex items-center justify-between gap-3 pointer-events-auto select-none"
          >
            <span className="text-xs font-semibold leading-snug">{toast.message}</span>

            <div className="flex items-center gap-2 flex-shrink-0">
              {toast.actionLabel && toast.onAction && (
                <button
                  type="button"
                  onClick={() => {
                    toast.onAction?.();
                    dismissToast(toast.id);
                  }}
                  className="px-2.5 py-1 rounded-xl bg-marigold text-ink font-bold text-xs hover:brightness-105 active:scale-95 transition-all"
                >
                  {toast.actionLabel}
                </button>
              )}

              {toast.undoPlanId && (
                <button
                  type="button"
                  onClick={() => {
                    leavePlan(toast.undoPlanId!);
                    dismissToast(toast.id);
                  }}
                  className="px-2 py-1 text-xs text-white/70 hover:text-white underline font-medium transition-colors"
                >
                  Undo
                </button>
              )}

              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                className="p-1 text-white/50 hover:text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
