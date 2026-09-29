import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { soundFx } from '../../utils/sound';

interface CalendarDateSelectorProps {
  selectedRange: '7d' | '14d' | '30d' | 'custom';
  onSelectRange: (range: '7d' | '14d' | '30d' | 'custom') => void;
}

export const CalendarDateSelector: React.FC<CalendarDateSelectorProps> = ({
  selectedRange,
  onSelectRange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState('September 2026');
  const [selectedDay, setSelectedDay] = useState(29);

  // Simulated days of September with daily average glucose
  const daysInMonth = Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    // mock glucose values between 98 and 140
    const avg = 100 + ((day * 7) % 38);
    const inRange = avg <= 135;
    return { day, avg, inRange };
  });

  const handleSelectDay = (day: number) => {
    soundFx.playTap(850 + day * 10);
    setSelectedDay(day);
    onSelectRange('custom');
    setTimeout(() => setIsOpen(false), 300);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        {/* Calendar Trigger Button */}
        <motion.button
          onClick={() => {
            soundFx.playTap(800);
            setIsOpen(!isOpen);
          }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all ${
            isOpen || selectedRange === 'custom'
              ? 'bg-migo-purple text-white border-migo-purple shadow-neon-purple'
              : 'glass-panel text-slate-300 border-white/[0.08] hover:text-white'
          }`}
          data-interactive="true"
        >
          <CalendarIcon className="w-3.5 h-3.5 text-migo-purple-light" />
          <span>{selectedRange === 'custom' ? `Sep ${selectedDay}, 2026` : 'Calendar Filter'}</span>
        </motion.button>
      </div>

      {/* Animated Calendar Popover Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.94 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="absolute top-12 right-0 z-50 w-72 glass-panel-glow rounded-3xl p-5 border border-migo-purple/40 shadow-2xl backdrop-blur-2xl"
          >
            {/* Calendar Month Header */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black font-display text-white tracking-wider">
                {currentMonth}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => soundFx.playTap(400)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08]"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => soundFx.playTap(400)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08]"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Days of Week */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-2">
              <span>Su</span>
              <span>Mo</span>
              <span>Tu</span>
              <span>We</span>
              <span>Th</span>
              <span>Fr</span>
              <span>Sa</span>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1">
              {daysInMonth.map(({ day, avg, inRange }) => {
                const isSelected = selectedDay === day;
                return (
                  <motion.button
                    key={day}
                    type="button"
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleSelectDay(day)}
                    className={`h-8 rounded-lg text-xs font-bold flex flex-col items-center justify-center relative transition-all ${
                      isSelected
                        ? 'bg-migo-purple text-white shadow-neon-purple'
                        : 'hover:bg-white/[0.08] text-slate-200'
                    }`}
                  >
                    <span>{day}</span>
                    {/* Micro dot indicator for glucose status */}
                    <span
                      className={`w-1 h-1 rounded-full ${
                        inRange ? 'bg-emerald-400' : 'bg-amber-400'
                      }`}
                    />
                  </motion.button>
                );
              })}
            </div>

            {/* Calendar Legend */}
            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Optimal TIR (&gt;80%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Elevated
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
