import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Activity, Utensils, Pill, FileText, Sparkles } from 'lucide-react';
import { useHealthStore } from '../../store/useHealthStore';
import { soundFx } from '../../utils/sound';

export const QuickActionFAB: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const openLogModal = useHealthStore((s) => s.openLogModal);

  const toggleOpen = () => {
    soundFx.playTap(isOpen ? 450 : 850);
    setIsOpen(!isOpen);
  };

  const handleAction = (category: 'glucose' | 'meal' | 'medication' | 'note') => {
    soundFx.playTap(950);
    setIsOpen(false);
    openLogModal(category);
  };

  const actions = [
    {
      id: 'glucose' as const,
      label: 'Log Glucose',
      icon: <Activity className="w-4 h-4 text-emerald-300" />,
      color: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
    },
    {
      id: 'meal' as const,
      label: 'Log Meal',
      icon: <Utensils className="w-4 h-4 text-cyan-300" />,
      color: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300',
    },
    {
      id: 'medication' as const,
      label: 'Take Rx Dose',
      icon: <Pill className="w-4 h-4 text-purple-300" />,
      color: 'bg-purple-500/20 border-purple-500/40 text-purple-300',
    },
    {
      id: 'note' as const,
      label: 'Quick Note',
      icon: <FileText className="w-4 h-4 text-amber-300" />,
      color: 'bg-amber-500/20 border-amber-500/40 text-amber-300',
    },
  ];

  return (
    <div className="fixed bottom-20 md:bottom-8 right-6 z-40 flex flex-col items-end">
      {/* Morphing Speed-dial items */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-end gap-2.5 mb-3"
          >
            {actions.map((act, idx) => (
              <motion.button
                key={act.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: idx * 0.04 }}
                whileHover={{ scale: 1.05, x: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAction(act.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl glass-panel-glow border shadow-lg backdrop-blur-xl ${act.color} text-xs font-bold transition-all`}
                data-interactive="true"
              >
                <span>{act.label}</span>
                <span className="p-1 rounded-xl bg-white/[0.1]">{act.icon}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Morphing Button */}
      <motion.button
        onClick={toggleOpen}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.90 }}
        className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-migo-purple via-indigo-600 to-migo-cyan text-white shadow-neon-purple flex items-center justify-center relative overflow-hidden group select-none cursor-pointer"
        data-interactive="true"
        data-cursor-cta={isOpen ? 'Close' : 'Quick Log'}
        aria-label="Toggle quick log menu"
      >
        {/* Subtle rotate indicator */}
        <motion.div
          animate={{ rotate: isOpen ? 135 : 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        >
          <Plus className="w-6 h-6 text-white stroke-[2.5]" />
        </motion.div>

        {/* Ambient Ring Glow */}
        <div className="absolute inset-0 rounded-2xl border-2 border-white/20 pointer-events-none" />
      </motion.button>
    </div>
  );
};
