import React from 'react';
import { motion } from 'framer-motion';
import { soundFx } from '../../utils/sound';
import { Delete } from 'lucide-react';

interface GlucoseNumpadProps {
  value: string;
  onChange: (val: string) => void;
  unit: string;
}

export const GlucoseNumpad: React.FC<GlucoseNumpadProps> = ({ value, onChange, unit }) => {
  const handleDigit = (digit: string) => {
    soundFx.playTap(700 + parseInt(digit || '5') * 35);
    if (value === '0') {
      onChange(digit);
    } else if (value.length < 3) {
      onChange(value + digit);
    }
  };

  const handleBackspace = () => {
    soundFx.playTap(400);
    if (value.length <= 1) {
      onChange('0');
    } else {
      onChange(value.slice(0, -1));
    }
  };

  const handlePresetDelta = (delta: number) => {
    soundFx.playTap(850);
    const current = parseInt(value, 10) || 100;
    const next = Math.max(40, Math.min(400, current + delta));
    onChange(next.toString());
  };

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'DEL'];

  return (
    <div className="w-full max-w-xs mx-auto">
      {/* Display Value Screen */}
      <div className="text-center py-4 px-6 rounded-2xl bg-slate-900/80 border border-white/[0.08] shadow-inner mb-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-migo-purple to-transparent" />
        <span className="text-5xl font-black font-display text-white tracking-tight tabular-nums">
          {value || '0'}
        </span>
        <span className="text-sm font-semibold text-migo-purple-light ml-2">{unit}</span>
      </div>

      {/* Quick Adjust Pills */}
      <div className="flex items-center justify-center gap-2 mb-4">
        {[-10, -5, +5, +10].map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => handlePresetDelta(d)}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white/[0.05] hover:bg-white/[0.12] text-slate-300 hover:text-white border border-white/[0.08] active:scale-95 transition-all"
          >
            {d > 0 ? `+${d}` : d}
          </button>
        ))}
      </div>

      {/* Tactile Keypad Grid */}
      <div className="grid grid-cols-3 gap-2.5">
        {keys.map((k) => {
          const isDel = k === 'DEL';
          const isClear = k === 'C';

          return (
            <motion.button
              key={k}
              type="button"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.90 }}
              onClick={() => {
                if (isDel) handleBackspace();
                else if (isClear) {
                  soundFx.playTap(350);
                  onChange('0');
                } else {
                  handleDigit(k);
                }
              }}
              className={`h-13 py-3 rounded-xl font-display font-bold text-lg transition-all flex items-center justify-center select-none shadow-sm ${
                isDel || isClear
                  ? 'bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/20'
                  : 'glass-panel-subtle text-white hover:border-migo-purple/50 hover:bg-white/[0.08] active:bg-migo-purple/30 border border-white/[0.08]'
              }`}
              data-interactive="true"
            >
              {isDel ? <Delete className="w-5 h-5" /> : k}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
