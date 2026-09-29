import React from 'react';

interface StaticMapProps {
  className?: string;
  pins?: Array<{ x: number; y: number; emoji?: string; label?: string; isSponsored?: boolean; isJoined?: boolean }>;
  highlightArea?: { x: number; y: number; radius: number };
  dottedRoute?: Array<{ x: number; y: number }>;
}

export const StaticMap: React.FC<StaticMapProps> = ({
  className = '',
  pins = [],
  highlightArea,
  dottedRoute,
}) => {
  return (
    <div className={`relative w-full h-full overflow-hidden select-none bg-[#EBF0F8] dark:bg-[#141838] ${className}`}>
      <svg
        viewBox="0 0 600 450"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Water gradient */}
          <linearGradient id="seaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C4E0F9" className="dark:stop-color-[#0C122C]" />
            <stop offset="100%" stopColor="#A8D2F5" className="dark:stop-color-[#080D22]" />
          </linearGradient>

          {/* Park green */}
          <linearGradient id="parkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D5E8D4" className="dark:stop-color-[#1A332C]" />
            <stop offset="100%" stopColor="#C1DFC0" className="dark:stop-color-[#142923]" />
          </linearGradient>
        </defs>

        {/* Ocean Body (Arabian Sea to the West) */}
        <rect width="600" height="450" fill="url(#seaGrad)" />

        {/* Coastal Landmass (Mumbai Coast Outline) */}
        <path
          d="M 160 0 C 180 80, 140 140, 200 200 C 230 230, 210 280, 260 320 C 310 360, 290 410, 320 450 L 600 450 L 600 0 Z"
          fill="#F7F9FC"
          className="dark:fill-[#1A1F45]"
        />

        {/* Secondary bay / inlet */}
        <path
          d="M 320 450 C 340 380, 390 340, 420 280 C 450 220, 520 180, 560 120 L 600 120 L 600 450 Z"
          fill="#EEF3FA"
          className="dark:fill-[#15193B]"
        />

        {/* Park patches (Shivaji Park, Hanging gardens, Aarey) */}
        <circle cx="270" cy="180" r="32" fill="url(#parkGrad)" />
        <ellipse cx="380" cy="90" rx="45" ry="30" fill="url(#parkGrad)" />
        <path d="M 440 20 C 480 30, 520 60, 540 110 L 460 120 Z" fill="url(#parkGrad)" />

        {/* Road Grid with Diagonals */}
        <g stroke="rgba(20, 22, 58, 0.12)" className="dark:stroke-[rgba(255,255,255,0.08)]" strokeWidth="2.5" fill="none">
          {/* Main Arterials */}
          <path d="M 190 20 Q 230 180, 290 320 T 360 450" strokeWidth="4" />
          <path d="M 270 0 Q 320 150, 420 300 T 520 450" strokeWidth="3.5" />
          <path d="M 150 140 C 260 160, 380 140, 600 130" strokeWidth="3" />
          <path d="M 220 250 C 340 260, 460 270, 600 240" strokeWidth="3" />

          {/* Local Streets */}
          <line x1="200" y1="60" x2="600" y2="60" strokeDasharray="6 3" />
          <line x1="220" y1="100" x2="600" y2="100" />
          <line x1="260" y1="210" x2="600" y2="210" />
          <line x1="290" y1="350" x2="600" y2="350" />
          <line x1="310" y1="390" x2="600" y2="390" />
          <line x1="320" y1="0" x2="320" y2="450" strokeDasharray="8 4" />
          <line x1="420" y1="0" x2="420" y2="450" />
          <line x1="500" y1="0" x2="500" y2="450" />
        </g>

        {/* Highlight Radius (for Venue Ad Builder) */}
        {highlightArea && (
          <circle
            cx={highlightArea.x}
            cy={highlightArea.y}
            r={highlightArea.radius}
            fill="rgba(255, 194, 26, 0.22)"
            stroke="#FFC21A"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
        )}

        {/* Dotted Route (for Two Versions of Tonight) */}
        {dottedRoute && dottedRoute.length > 1 && (
          <path
            d={`M ${dottedRoute.map((pt) => `${pt.x} ${pt.y}`).join(' L ')}`}
            fill="none"
            stroke="#10B5A5"
            strokeWidth="3"
            strokeDasharray="6 4"
          />
        )}
      </svg>

      {/* HTML overlay pins for crisp rendering */}
      {pins.map((pin, i) => (
        <div
          key={i}
          className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 hover:scale-125 cursor-pointer pointer-events-auto"
          style={{ left: `${(pin.x / 600) * 100}%`, top: `${(pin.y / 450) * 100}%` }}
        >
          <div
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-black shadow-[2px_2px_0px_#000] border-2 border-black ${
              pin.isSponsored
                ? 'bg-black text-amber-400 border-amber-400'
                : pin.isJoined
                ? 'bg-emerald-500 text-white'
                : 'bg-white text-black'
            }`}
          >
            {pin.emoji && <span className="font-emoji text-sm">{pin.emoji}</span>}
            {pin.label && <span>{pin.label}</span>}
          </div>
        </div>
      ))}
    </div>
  );
};
