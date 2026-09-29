import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAppStore } from '../store/useAppStore';
import { Clock, RotateCcw, Sparkles } from 'lucide-react';

interface TimeScrubberProps {
  className?: string;
}

export const TimeScrubber: React.FC<TimeScrubberProps> = ({ className = '' }) => {
  const { timeScrubberMinutes, setTimeScrubber } = useAppStore();
  const [activeChip, setActiveChip] = useState<'now' | 'tonight' | 'tomorrow' | 'weekend'>('now');

  // Format time label based on current time + scrubber offset
  const formattedTimeLabel = () => {
    if (timeScrubberMinutes === 0) {
      return 'Now (Realtime)';
    }

    const targetDate = new Date(Date.now() + timeScrubberMinutes * 60 * 1000);
    const dayStr = targetDate.toLocaleDateString([], { weekday: 'short' });
    const timeStr = targetDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

    if (timeScrubberMinutes < 360) {
      return `Tonight • ${timeStr}`;
    } else if (timeScrubberMinutes < 1440) {
      return `Tomorrow • ${timeStr}`;
    }
    return `${dayStr} • ${timeStr}`;
  };

  const handleChipClick = (chip: 'now' | 'tonight' | 'tomorrow' | 'weekend') => {
    setActiveChip(chip);
    if (chip === 'now') {
      setTimeScrubber(0);
    } else if (chip === 'tonight') {
      // Offset to tonight ~8:30 pm
      const now = new Date();
      const tonight = new Date();
      tonight.setHours(20, 30, 0, 0);
      let diffMins = Math.round((tonight.getTime() - now.getTime()) / (60 * 1000));
      if (diffMins < 30) diffMins += 24 * 60;
      setTimeScrubber(Math.min(2160, Math.max(60, diffMins)));
    } else if (chip === 'tomorrow') {
      setTimeScrubber(720); // +12 hours
    } else if (chip === 'weekend') {
      setTimeScrubber(1440); // +24 hours
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setTimeScrubber(Math.min(2160, timeScrubberMinutes + 30));
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setTimeScrubber(Math.max(0, timeScrubberMinutes - 30));
    }
  };

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="Time scrubber"
      className={`p-2.5 sm:p-3 rounded-3xl bg-paper/90 dark:bg-night/90 backdrop-blur-md border border-black/10 dark:border-white/10 shadow-ambient flex flex-col gap-2 pointer-events-auto select-none focus:outline-hidden focus:ring-2 focus:ring-marigold ${className}`}
    >
      {/* Top Header: Chips + Label */}
      <div className="flex items-center justify-between gap-3">
        {/* Quick Chips */}
        <div className="flex items-center gap-1">
          {[
            { id: 'now' as const, label: 'Now' },
            { id: 'tonight' as const, label: 'Tonight' },
            { id: 'tomorrow' as const, label: 'Tomorrow' },
            { id: 'weekend' as const, label: 'Weekend' },
          ].map((chip) => {
            const isSelected = activeChip === chip.id && (chip.id !== 'now' || timeScrubberMinutes === 0);
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => handleChipClick(chip.id)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                  isSelected
                    ? 'bg-marigold text-ink shadow-xs'
                    : 'bg-black/5 dark:bg-white/5 text-ink-soft dark:text-ink-muted hover:bg-black/10 hover:text-ink dark:hover:text-white'
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        {/* Formatted Time Label with Reset */}
        <div className="flex items-center gap-1.5 text-xs font-bold text-ink dark:text-white">
          <Clock className="w-3.5 h-3.5 text-marigold" />
          <span className="font-mono text-[11px]">{formattedTimeLabel()}</span>
          {timeScrubberMinutes > 0 && (
            <button
              onClick={() => handleChipClick('now')}
              title="Reset to realtime now"
              className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-ink-muted hover:text-ink transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Draggable Slider Bar across next 36 hours */}
      <div className="relative flex items-center px-1">
        <input
          type="range"
          min={0}
          max={2160}
          step={15}
          value={timeScrubberMinutes}
          onChange={(e) => {
            const val = Number(e.target.value);
            setTimeScrubber(val);
            if (val === 0) setActiveChip('now');
            else if (val <= 360) setActiveChip('tonight');
            else if (val <= 1000) setActiveChip('tomorrow');
            else setActiveChip('weekend');
          }}
          className="w-full accent-marigold cursor-pointer h-1.5 bg-black/10 dark:bg-white/10 rounded-full"
        />
      </div>
    </div>
  );
};
