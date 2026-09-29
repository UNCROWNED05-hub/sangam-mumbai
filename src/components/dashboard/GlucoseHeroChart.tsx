import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHealthStore } from '../../store/useHealthStore';
import { soundFx } from '../../utils/sound';
import { classifyGlucose, formatClockTime } from '../../utils/formatters';
import { Sparkles, Info, Calendar } from 'lucide-react';
import { GlucoseReading } from '../../types';

export const GlucoseHeroChart: React.FC = () => {
  const { readings, user } = useHealthStore();
  const [activeRange, setActiveRange] = useState<'24h' | '12h' | '7d'>('24h');
  const [hoveredPoint, setHoveredPoint] = useState<{
    reading: GlucoseReading;
    x: number;
    y: number;
  } | null>(null);

  // SVG dimensions
  const width = 800;
  const height = 300;
  const paddingX = 45;
  const paddingY = 40;

  // Min and max bounds for y-axis
  const minY = 50;
  const maxY = 220;

  // Compute coordinates for readings
  const sorted = [...readings].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const getX = (index: number, total: number) => {
    if (total <= 1) return width / 2;
    return paddingX + (index / (total - 1)) * (width - paddingX * 2);
  };

  const getY = (val: number) => {
    const clamped = Math.max(minY, Math.min(maxY, val));
    return height - paddingY - ((clamped - minY) / (maxY - minY)) * (height - paddingY * 2);
  };

  const points = sorted.map((r, i) => ({
    reading: r,
    x: getX(i, sorted.length),
    y: getY(r.value),
  }));

  // Build smooth bezier SVG path
  const buildSmoothPath = (pts: Array<{ x: number; y: number }>) => {
    if (pts.length === 0) return '';
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;

    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const midX = (p0.x + p1.x) / 2;
      path += ` C ${midX} ${p0.y}, ${midX} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return path;
  };

  const linePath = buildSmoothPath(points);
  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`
    : '';

  // Target range band (e.g. 70 to 140 mg/dL)
  const targetTopY = getY(user.targetRangeMax);
  const targetBottomY = getY(user.targetRangeMin);
  const targetBandHeight = targetBottomY - targetTopY;

  return (
    <div className="glass-panel rounded-2xl p-5 md:p-6 border border-white/[0.08] relative overflow-hidden shadow-glass">
      {/* Background ambient radial glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-display text-white tracking-tight">
              Metabolic Glucose Trajectory
            </h2>
            <span className="flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-migo-purple/20 text-migo-purple-light border border-migo-purple/30">
              <Sparkles className="w-3 h-3" />
              Continuous Telemetry
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Dynamic progressive curve revealing intra-day glycemic fluctuations and meal correlations.
          </p>
        </div>

        {/* Range filter buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/60 border border-white/[0.08] self-start sm:self-auto">
          {(['12h', '24h', '7d'] as const).map((r) => (
            <button
              key={r}
              onClick={() => {
                setActiveRange(r);
                soundFx.playTap(900);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                activeRange === r
                  ? 'bg-migo-purple text-white shadow-neon-purple'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Chart Container */}
      <div className="relative w-full aspect-[16/7] min-h-[260px] max-h-[360px]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible select-none"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Area gradient */}
            <linearGradient id="glucoseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.00" />
            </linearGradient>

            {/* Target band pattern */}
            <linearGradient id="targetBandGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.04" />
            </linearGradient>

            {/* Line stroke gradient */}
            <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>

            <filter id="glowLine" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Staggered Grid Lines */}
          {[60, 100, 140, 180, 220].map((val, idx) => {
            const y = getY(val);
            return (
              <g key={val}>
                <motion.line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.07)"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08, duration: 0.5 }}
                />
                <text
                  x={paddingX - 10}
                  y={y + 4}
                  fill="rgba(148, 163, 184, 0.6)"
                  fontSize="11"
                  textAnchor="end"
                  fontFamily="sans-serif"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Target Range Band (70 - 140 mg/dL) */}
          <rect
            x={paddingX}
            y={targetTopY}
            width={width - paddingX * 2}
            height={targetBandHeight}
            fill="url(#targetBandGradient)"
            stroke="rgba(16, 185, 129, 0.25)"
            strokeDasharray="2 2"
            rx="4"
          />

          <text
            x={width - paddingX - 8}
            y={targetTopY + 14}
            fill="rgba(52, 211, 153, 0.8)"
            fontSize="10"
            textAnchor="end"
            fontWeight="600"
          >
            TARGET RANGE ({user.targetRangeMin}-{user.targetRangeMax})
          </text>

          {/* Area Fill */}
          <motion.path
            d={areaPath}
            fill="url(#glucoseGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
          />

          {/* Progressive Line Path with pathLength animation */}
          <motion.path
            d={linePath}
            fill="none"
            stroke="url(#strokeGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.8, ease: [0.23, 1, 0.32, 1] }}
            filter="url(#glowLine)"
          />

          {/* Interactive Data Points */}
          {points.map((pt, i) => {
            const { status } = classifyGlucose(pt.reading.value, user.targetRangeMin, user.targetRangeMax);
            const isHovered = hoveredPoint?.reading.id === pt.reading.id;

            return (
              <g
                key={pt.reading.id}
                className="cursor-pointer"
                onMouseEnter={() => {
                  setHoveredPoint(pt);
                  soundFx.playGlucoseTone(pt.reading.value);
                }}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                {/* Outer Pulse Ring */}
                <motion.circle
                  cx={pt.x}
                  cy={pt.y}
                  r="12"
                  fill={status === 'optimal' ? '#10b981' : '#f59e0b'}
                  opacity={isHovered ? 0.35 : 0.15}
                  animate={{
                    r: isHovered ? [12, 18, 12] : [8, 13, 8],
                  }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />

                {/* Point Center */}
                <motion.circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 6.5 : 4.5}
                  fill="#ffffff"
                  stroke={status === 'optimal' ? '#10b981' : '#8b5cf6'}
                  strokeWidth="2.5"
                  whileHover={{ scale: 1.4 }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.1, type: 'spring' }}
                />

                {/* Meal Indicator icon above point if meal exists */}
                {pt.reading.meal && (
                  <text
                    x={pt.x}
                    y={pt.y - 12}
                    textAnchor="middle"
                    fontSize="13"
                    className="select-none pointer-events-none"
                  >
                    {pt.reading.meal.icon || '🍽️'}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Spring Tooltip Popover */}
        <AnimatePresence>
          {hoveredPoint && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.95 }}
              transition={{ type: 'spring', damping: 20, stiffness: 350 }}
              style={{
                left: `${(hoveredPoint.x / width) * 100}%`,
                top: `${(hoveredPoint.y / height) * 100}%`,
                transform: 'translate(-50%, -125%)',
              }}
              className="absolute z-30 pointer-events-none w-56 glass-panel-glow p-3.5 rounded-xl border border-migo-purple/40 shadow-2xl backdrop-blur-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 mb-2">
                <span className="text-[11px] text-slate-300 font-mono">
                  {formatClockTime(hoveredPoint.reading.timestamp)}
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    classifyGlucose(hoveredPoint.reading.value).bgClass
                  }`}
                >
                  {classifyGlucose(hoveredPoint.reading.value).label}
                </span>
              </div>

              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-white font-display">
                  {hoveredPoint.reading.value}
                </span>
                <span className="text-xs text-migo-purple-light font-medium">{user.unit}</span>
                <span className="ml-auto text-xs text-slate-300 font-medium">
                  {hoveredPoint.reading.heartRate && `❤️ ${hoveredPoint.reading.heartRate} bpm`}
                </span>
              </div>

              {hoveredPoint.reading.meal && (
                <div className="mt-2 text-xs bg-white/[0.04] p-2 rounded-lg border border-white/[0.06]">
                  <div className="font-semibold text-slate-200 truncate">
                    {hoveredPoint.reading.meal.name}
                  </div>
                  <div className="text-[10px] text-cyan-300 mt-0.5">
                    {hoveredPoint.reading.meal.carbs}g Carbs • {hoveredPoint.reading.meal.calories} kcal
                  </div>
                </div>
              )}

              {hoveredPoint.reading.note && (
                <p className="mt-1.5 text-[11px] text-slate-300 italic line-clamp-2">
                  "{hoveredPoint.reading.note}"
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Legend & Summary Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/[0.06] text-xs text-slate-400 mt-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span>Optimal (70-140)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span>Elevated (141-180)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <span>High (&gt;180)</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-migo-purple-light">
          <Info className="w-3.5 h-3.5" />
          <span>Sonification active: Hover nodes to audition pitch frequencies</span>
        </div>
      </div>
    </div>
  );
};
