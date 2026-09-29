import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Flame, Utensils, Zap, RotateCw, TrendingUp, Heart, CheckCircle2 } from 'lucide-react';
import { useHealthStore } from '../../store/useHealthStore';
import { AnimatedCounter } from '../ui/AnimatedCounter';
import { CircularProgress } from '../ui/CircularProgress';
import { soundFx } from '../../utils/sound';

export const MetricCards: React.FC = () => {
  const { dailySummary, readings, user } = useHealthStore();
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const toggleFlip = (cardKey: string) => {
    soundFx.playTap(950);
    setFlippedCards((prev) => ({
      ...prev,
      [cardKey]: !prev[cardKey],
    }));
  };

  const latestReading = readings[readings.length - 1] || { value: 118, trend: 'stable' };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 w-full">
      {/* CARD 1: Time in Range (with Circular Ring) */}
      <div
        className="perspective-1000 h-[220px] cursor-pointer group"
        onClick={() => toggleFlip('tir')}
        onMouseEnter={() => soundFx.playTap(1200)}
        data-interactive="true"
      >
        <motion.div
          className="relative w-full h-full transform-style-3d transition-transform duration-700 rounded-2xl"
          animate={{ rotateY: flippedCards['tir'] ? 180 : 0 }}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* FRONT */}
          <div className="absolute inset-0 backface-hidden glass-panel-glow rounded-2xl p-5 flex flex-col justify-between overflow-hidden border border-emerald-500/20 shadow-neon-emerald">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
                  <Activity className="w-4 h-4" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Time in Range</span>
              </div>
              <button
                className="text-slate-400 hover:text-white transition-colors p-1"
                aria-label="Flip card"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center justify-between my-auto">
              <div>
                <div className="flex items-baseline gap-1">
                  <AnimatedCounter value={dailySummary.inRange} className="text-4xl font-extrabold text-white" />
                  <span className="text-xl font-bold text-emerald-400">%</span>
                </div>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Target {user.targetRangeMin}-{user.targetRangeMax} {user.unit}</span>
                </p>
              </div>

              <div className="scale-75 origin-right">
                <CircularProgress
                  percentage={dailySummary.inRange}
                  size={95}
                  strokeWidth={8}
                  primaryColor="#10b981"
                  secondaryColor="#06b6d4"
                  label={`${dailySummary.inRange}%`}
                />
              </div>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-white/[0.06]">
              <span className="text-emerald-400 font-medium">Optimal Stability</span>
              <span className="text-slate-400 hover:text-white">Tap to inspect details →</span>
            </div>
          </div>

          {/* BACK */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 glass-panel rounded-2xl p-5 flex flex-col justify-between overflow-hidden border border-emerald-500/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">TIR Deep Telemetry</span>
              <RotateCw className="w-3.5 h-3.5 text-slate-400" />
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-white/[0.06]">
                <span className="text-slate-400">Hypo Events (&lt;70):</span>
                <span className="font-semibold text-emerald-400">{dailySummary.hypoEvents} (0%)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.06]">
                <span className="text-slate-400">Hyper Events (&gt;180):</span>
                <span className="font-semibold text-slate-200">{dailySummary.hyperEvents}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.06]">
                <span className="text-slate-400">Est. A1c (GMI):</span>
                <span className="font-semibold text-purple-400">{dailySummary.gmi}%</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Standard Deviation:</span>
                <span className="font-semibold text-cyan-400">±12.4 mg/dL</span>
              </div>
            </div>

            <span className="text-[10px] text-slate-400 text-center">Tap to flip back</span>
          </div>
        </motion.div>
      </div>

      {/* CARD 2: Glucose Telemetry & Live Delta */}
      <div
        className="perspective-1000 h-[220px] cursor-pointer group"
        onClick={() => toggleFlip('telemetry')}
        onMouseEnter={() => soundFx.playTap(1200)}
        data-interactive="true"
      >
        <motion.div
          className="relative w-full h-full transform-style-3d transition-transform duration-700 rounded-2xl"
          animate={{ rotateY: flippedCards['telemetry'] ? 180 : 0 }}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* FRONT */}
          <div className="absolute inset-0 backface-hidden glass-panel-glow rounded-2xl p-5 flex flex-col justify-between overflow-hidden border border-purple-500/20 shadow-neon-purple">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-purple-500/15 text-purple-400">
                  <Zap className="w-4 h-4" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Live Glucose</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[10px] font-mono text-emerald-400 font-medium">LIVE</span>
              </div>
            </div>

            <div className="my-auto">
              <div className="flex items-baseline gap-2">
                <AnimatedCounter value={latestReading.value} className="text-4xl font-extrabold text-white" />
                <span className="text-sm font-semibold text-purple-300">{user.unit}</span>
                <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Steady
                </span>
              </div>
              <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
                <span>Avg: <strong className="text-white">{dailySummary.average}</strong></span>
                <span>•</span>
                <span>Low: <strong className="text-emerald-400">{dailySummary.min}</strong></span>
                <span>•</span>
                <span>High: <strong className="text-amber-400">{dailySummary.max}</strong></span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-white/[0.06]">
              <span className="text-purple-300 font-medium">2.4 mg/dL lower than yesterday</span>
              <span className="text-slate-400 hover:text-white">Details →</span>
            </div>
          </div>

          {/* BACK */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 glass-panel rounded-2xl p-5 flex flex-col justify-between overflow-hidden border border-purple-500/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Sensor & Telemetry</span>
              <RotateCw className="w-3.5 h-3.5 text-slate-400" />
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-white/[0.06]">
                <span className="text-slate-400">Sensor Life Remaining:</span>
                <span className="font-semibold text-white">9 Days (94%)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.06]">
                <span className="text-slate-400">Bluetooth Sync:</span>
                <span className="font-semibold text-emerald-400">Active (5s rate)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.06]">
                <span className="text-slate-400">Heart Rate Sync:</span>
                <span className="font-semibold text-rose-400">68 bpm</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">MARD Accuracy:</span>
                <span className="font-semibold text-cyan-400">8.9% (Clinical Grade)</span>
              </div>
            </div>

            <span className="text-[10px] text-slate-400 text-center">Tap to flip back</span>
          </div>
        </motion.div>
      </div>

      {/* CARD 3: Nutrition & Fuel Impact */}
      <div
        className="perspective-1000 h-[220px] cursor-pointer group"
        onClick={() => toggleFlip('nutrition')}
        onMouseEnter={() => soundFx.playTap(1200)}
        data-interactive="true"
      >
        <motion.div
          className="relative w-full h-full transform-style-3d transition-transform duration-700 rounded-2xl"
          animate={{ rotateY: flippedCards['nutrition'] ? 180 : 0 }}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* FRONT */}
          <div className="absolute inset-0 backface-hidden glass-panel-glow rounded-2xl p-5 flex flex-col justify-between overflow-hidden border border-cyan-500/20 shadow-neon-cyan">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400">
                  <Utensils className="w-4 h-4" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Nutritional Fuel</span>
              </div>
              <RotateCw className="w-3.5 h-3.5 text-slate-400" />
            </div>

            <div className="my-auto">
              <div className="flex items-baseline gap-2">
                <AnimatedCounter value={dailySummary.meals} className="text-4xl font-extrabold text-white" />
                <span className="text-sm font-semibold text-slate-300">Meals Logged</span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 bg-white/[0.08] h-2 rounded-full overflow-hidden flex">
                  <div className="bg-cyan-400 h-full w-[45%]" title="Carbs 45%" />
                  <div className="bg-purple-400 h-full w-[30%]" title="Protein 30%" />
                  <div className="bg-amber-400 h-full w-[25%]" title="Fats 25%" />
                </div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span className="text-cyan-300">116g C</span>
                <span className="text-purple-300">82g P</span>
                <span className="text-amber-300">44g F</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-white/[0.06]">
              <span className="text-cyan-300 font-medium">Glycemic Buffer: High</span>
              <span className="text-slate-400 hover:text-white">Macros →</span>
            </div>
          </div>

          {/* BACK */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 glass-panel rounded-2xl p-5 flex flex-col justify-between overflow-hidden border border-cyan-500/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Macro Dynamics</span>
              <RotateCw className="w-3.5 h-3.5 text-slate-400" />
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-white/[0.06]">
                <span className="text-slate-400">Total Net Calories:</span>
                <span className="font-semibold text-white">1,540 kcal</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.06]">
                <span className="text-slate-400">Dietary Fiber:</span>
                <span className="font-semibold text-emerald-400">32g (Goal met!)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.06]">
                <span className="text-slate-400">Avg Glucose Spike:</span>
                <span className="font-semibold text-cyan-400">22 mg/dL</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Last Meal Impact:</span>
                <span className="font-semibold text-emerald-400">Smooth decline</span>
              </div>
            </div>

            <span className="text-[10px] text-slate-400 text-center">Tap to flip back</span>
          </div>
        </motion.div>
      </div>

      {/* CARD 4: Metabolic Burn & Movement */}
      <div
        className="perspective-1000 h-[220px] cursor-pointer group"
        onClick={() => toggleFlip('movement')}
        onMouseEnter={() => soundFx.playTap(1200)}
        data-interactive="true"
      >
        <motion.div
          className="relative w-full h-full transform-style-3d transition-transform duration-700 rounded-2xl"
          animate={{ rotateY: flippedCards['movement'] ? 180 : 0 }}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* FRONT */}
          <div className="absolute inset-0 backface-hidden glass-panel-glow rounded-2xl p-5 flex flex-col justify-between overflow-hidden border border-rose-500/20 shadow-neon-purple">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-rose-500/15 text-rose-400">
                  <Flame className="w-4 h-4" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Clearance</span>
              </div>
              <RotateCw className="w-3.5 h-3.5 text-slate-400" />
            </div>

            <div className="my-auto">
              <div className="flex items-baseline gap-1">
                <AnimatedCounter value={dailySummary.exercise} className="text-4xl font-extrabold text-white" />
                <span className="text-base font-semibold text-rose-400">min</span>
              </div>
              <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                <span>Resting HR: <strong className="text-white">58 bpm</strong></span>
              </p>
              <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1">
                <span>+32% GLUT4 glucose clearance</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-white/[0.06]">
              <span className="text-rose-400 font-medium">Daily Active Goal Met</span>
              <span className="text-slate-400 hover:text-white">Fitness →</span>
            </div>
          </div>

          {/* BACK */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 glass-panel rounded-2xl p-5 flex flex-col justify-between overflow-hidden border border-rose-500/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Activity Biomarkers</span>
              <RotateCw className="w-3.5 h-3.5 text-slate-400" />
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-white/[0.06]">
                <span className="text-slate-400">Active Burn:</span>
                <span className="font-semibold text-white">420 kcal</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.06]">
                <span className="text-slate-400">Post-Meal Walks:</span>
                <span className="font-semibold text-emerald-400">2 sessions (25m)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.06]">
                <span className="text-slate-400">VO2 Max Estimate:</span>
                <span className="font-semibold text-purple-400">46 mL/kg/min</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">HRV Recovery:</span>
                <span className="font-semibold text-cyan-400">76ms (Well Rested)</span>
              </div>
            </div>

            <span className="text-[10px] text-slate-400 text-center">Tap to flip back</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
