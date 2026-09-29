import React from 'react';
import { getSkyAtProgress } from '../lib/sky';

interface ScrollRailProps {
  progress?: number;
}

export const ScrollRail: React.FC<ScrollRailProps> = ({ progress = 0 }) => {
  const { clock } = getSkyAtProgress(progress);
  const dotTop = Math.min(136, Math.max(0, progress * 136));

  return (
    <aside
      className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-center select-none pointer-events-none"
      aria-label="Scroll clock and time progress"
    >
      <div className="relative w-[2px] h-[140px] bg-current opacity-20 rounded-full">
        {/* Moving dot */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-current opacity-90 transition-all duration-75"
          style={{ top: `${dotTop}px` }}
        />
      </div>

      <span className="mt-3 text-[11px] font-mono font-bold tracking-tight opacity-75 tabular-nums">
        {clock}
      </span>
    </aside>
  );
};
