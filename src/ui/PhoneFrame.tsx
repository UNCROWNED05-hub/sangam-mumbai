import React from 'react';

interface PhoneFrameProps {
  children: React.ReactNode;
  className?: string;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`relative mx-auto w-[310px] sm:w-[340px] md:w-[370px] h-[640px] sm:h-[680px] rounded-phone bg-night border-[10px] border-ink/90 shadow-ambient overflow-hidden flex flex-col select-none ring-1 ring-white/20 ${className}`}
    >
      {/* Top Status Bar & Punch-Hole Camera */}
      <div className="absolute top-0 left-0 right-0 h-8 px-6 flex items-center justify-between z-40 text-[11px] font-semibold text-white/80 pointer-events-none">
        <span>12:30</span>
        {/* Punch-hole camera */}
        <div className="w-3.5 h-3.5 rounded-full bg-black ring-1 ring-white/10" />
        <div className="flex items-center gap-1.5 text-[10px]">
          <span>5G</span>
          <span>98%</span>
        </div>
      </div>

      {/* Screen Body */}
      <div className="flex-1 w-full h-full pt-8 pb-5 overflow-hidden relative flex flex-col bg-paper dark:bg-night text-ink dark:text-white">
        {children}
      </div>

      {/* Bottom Android Gesture Bar */}
      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 rounded-full bg-white/40 pointer-events-none z-40" />

      {/* Gloss Specular Highlight */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent pointer-events-none rounded-phone" />
    </div>
  );
};
