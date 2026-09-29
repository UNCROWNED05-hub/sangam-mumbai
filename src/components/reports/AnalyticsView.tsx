import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useHealthStore } from '../../store/useHealthStore';
import { soundFx } from '../../utils/sound';
import { Download, Share2, BarChart2, PieChart, Activity } from 'lucide-react';
import { AIInsights } from './AIInsights';
import { AnimatedCounter } from '../ui/AnimatedCounter';
import { CalendarDateSelector } from './CalendarDateSelector';
import { ShareReportModal } from './ShareReportModal';

export const AnalyticsView: React.FC = () => {
  const { weeklySummaries, readings, dailySummary, user } = useHealthStore();
  const [selectedRange, setSelectedRange] = useState<'7d' | '14d' | '30d' | 'custom'>('7d');
  const [isExporting, setIsExporting] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Time in range calculation
  const inRange = dailySummary.inRange;
  const highPercent = 100 - inRange > 0 ? Math.floor((100 - inRange) * 0.75) : 0;
  const lowPercent = 100 - inRange - highPercent;

  // Donut circumference
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const inRangeOffset = circumference - (inRange / 100) * circumference;

  const handleExportData = () => {
    soundFx.playSuccess();
    setIsExporting(true);

    const payload = {
      exportTimestamp: new Date().toISOString(),
      user: { name: user.name, targetRange: `${user.targetRangeMin}-${user.targetRangeMax}` },
      summary: dailySummary,
      readings,
      weeklyData: weeklySummaries,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `migox-metabolic-report-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);

    setTimeout(() => setIsExporting(false), 1200);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Date Selector, Calendar Popover & Pulsating Share/Export Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel rounded-2xl p-5 border border-white/[0.08]">
        <div>
          <h2 className="text-xl font-bold font-display text-white tracking-tight flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-migo-purple-light" />
            Comprehensive Metabolic Analytics
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Aggregated continuous sensor statistics and circadian trends
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Calendar Date Selector with Animated Popover */}
          <CalendarDateSelector
            selectedRange={selectedRange}
            onSelectRange={setSelectedRange}
          />

          {/* Quick Range Chips */}
          <div className="flex items-center gap-1 p-1 bg-slate-900/80 rounded-xl border border-white/[0.08]">
            {(['7d', '14d', '30d'] as const).map((r) => (
              <button
                key={r}
                onClick={() => {
                  setSelectedRange(r);
                  soundFx.playTap(900);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedRange === r
                    ? 'bg-migo-purple text-white shadow-neon-purple'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Share Telemetry Button */}
          <button
            onClick={() => {
              soundFx.playTap(850);
              setIsShareModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass-panel-subtle hover:bg-white/[0.08] text-white text-xs font-bold border border-white/[0.1] active:scale-95 transition-all"
            data-interactive="true"
          >
            <Share2 className="w-3.5 h-3.5 text-migo-cyan" />
            <span>Share</span>
          </button>

          {/* Export Button with Pulsating Animation */}
          <motion.button
            onClick={handleExportData}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              boxShadow: [
                '0 0 0 0 rgba(139, 92, 246, 0.4)',
                '0 0 0 10px rgba(139, 92, 246, 0)',
              ],
            }}
            transition={{
              boxShadow: { repeat: Infinity, duration: 2.2 },
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-migo-purple to-indigo-600 text-white text-xs font-bold shadow-neon-purple hover:brightness-110 active:scale-95 transition-all"
            data-interactive="true"
            data-cursor-cta="Export"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Exporting...' : 'Export Telemetry'}</span>
          </motion.button>
        </div>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* CHART 1: Time in Range Multi-Segment Donut */}
        <div className="glass-panel-glow rounded-2xl p-6 border border-white/[0.08] shadow-glass flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <PieChart className="w-4 h-4 text-emerald-400" />
              Time-In-Range Split
            </span>
            <span className="text-xs font-mono text-emerald-400 font-bold">Goal &gt; 75%</span>
          </div>

          <div className="relative flex items-center justify-center my-4">
            <svg width="170" height="170" className="rotate-[-90deg]">
              <circle
                cx="85"
                cy="85"
                r={radius}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="14"
                fill="none"
              />
              {/* Optimal Ring (Emerald) */}
              <motion.circle
                cx="85"
                cy="85"
                r={radius}
                stroke="#10b981"
                strokeWidth="14"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: inRangeOffset }}
                transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <AnimatedCounter value={inRange} className="text-3xl font-extrabold text-white" />
              <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                % in target
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs pt-4 border-t border-white/[0.06]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-slate-300">Optimal (70-140)</span>
              </div>
              <strong className="text-white font-mono">{inRange}%</strong>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="text-slate-300">High (&gt;140)</span>
              </div>
              <strong className="text-white font-mono">{highPercent}%</strong>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <span className="text-slate-300">Low (&lt;70)</span>
              </div>
              <strong className="text-white font-mono">{lowPercent}%</strong>
            </div>
          </div>
        </div>

        {/* CHART 2: 7-Day Day-by-Day Comparative Bar Chart */}
        <div className="glass-panel-glow rounded-2xl p-6 border border-white/[0.08] shadow-glass lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-cyan-400" />
                7-Day Average Glucose Trajectory
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Daily means with in-range percentage performance
              </p>
            </div>
            <span className="text-xs text-cyan-400 font-mono font-bold">
              Avg: {Math.round(weeklySummaries.reduce((a, b) => a + b.average, 0) / weeklySummaries.length)} {user.unit}
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-44 w-full flex items-end justify-between gap-3 pt-6 pb-2 px-2">
            {weeklySummaries.map((day, idx) => {
              const dayName = new Date(day.date).toLocaleDateString([], { weekday: 'short' });
              const barHeightPercent = Math.min(100, Math.max(20, ((day.average - 60) / 140) * 100));

              return (
                <div key={day.date} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <span className="text-[10px] font-mono font-bold text-slate-300 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {day.average}
                  </span>

                  {/* Animated Bar with Gradient */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${barHeightPercent}%` }}
                    transition={{ delay: idx * 0.08, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                    className="w-full max-w-[36px] rounded-t-xl bg-gradient-to-t from-migo-purple via-indigo-500 to-migo-cyan group-hover:to-emerald-400 group-hover:shadow-neon-cyan transition-all relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-white/40" />
                  </motion.div>

                  <span className="text-[11px] font-semibold text-slate-400 group-hover:text-white mt-2 transition-colors">
                    {dayName}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    {day.inRange}%
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-white/[0.06] mt-2">
            <span>Clinical Target: 70 - 140 {user.unit}</span>
            <span className="text-emerald-400 font-medium">94% weekly compliance</span>
          </div>
        </div>
      </div>

      {/* AI Insights & Predictive Recommendations */}
      <AIInsights />

      {/* Share Report Encrypted Modal */}
      <ShareReportModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
};
