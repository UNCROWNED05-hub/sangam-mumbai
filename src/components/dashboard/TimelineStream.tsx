import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHealthStore } from '../../store/useHealthStore';
import { classifyGlucose, formatClockTime, formatTimeAgo, getTrendSymbol } from '../../utils/formatters';
import { soundFx } from '../../utils/sound';
import { Trash2, Plus, Filter, Heart, Utensils, Pill, Zap, MessageSquare } from 'lucide-react';
import { GlucoseReading } from '../../types';

export const TimelineStream: React.FC = () => {
  const { readings, deleteReading, openLogModal, user } = useHealthStore();
  const [filter, setFilter] = useState<'all' | 'meals' | 'meds' | 'exercise'>('all');

  const filteredReadings = [...readings]
    .reverse()
    .filter((r) => {
      if (filter === 'meals') return Boolean(r.meal);
      if (filter === 'meds') return Boolean(r.medicationDose);
      if (filter === 'exercise') return Boolean(r.exerciseMinutes);
      return true;
    });

  return (
    <div className="glass-panel rounded-2xl p-5 md:p-6 border border-white/[0.08] shadow-glass">
      {/* Header and Filter chips */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-lg font-bold font-display text-white tracking-tight flex items-center gap-2">
            Chronological Telemetry Stream
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              {filteredReadings.length} events
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Swipe items left or click the trash icon to remove.
          </p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1 p-1 bg-slate-900/60 rounded-xl border border-white/[0.06]">
            {(
              [
                { id: 'all', label: 'All Events' },
                { id: 'meals', label: 'Meals' },
                { id: 'meds', label: 'Meds' },
                { id: 'exercise', label: 'Workouts' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setFilter(tab.id);
                  soundFx.playTap(900);
                }}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  filter === tab.id
                    ? 'bg-migo-purple text-white shadow-neon-purple'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => openLogModal('glucose')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-migo-purple to-migo-cyan text-white text-xs font-bold shadow-neon-purple hover:brightness-110 active:scale-95 transition-all"
            data-interactive="true"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Quick Log</span>
          </button>
        </div>
      </div>

      {/* Timeline List */}
      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-[2px] before:bg-gradient-to-b before:from-migo-purple before:via-migo-cyan/40 before:to-transparent">
        <AnimatePresence initial={false}>
          {filteredReadings.map((reading) => {
            const { status, label, color, bgClass, borderClass } = classifyGlucose(
              reading.value,
              user.targetRangeMin,
              user.targetRangeMax
            );
            const trend = getTrendSymbol(reading.trend);

            return (
              <motion.div
                key={reading.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: -100, transition: { duration: 0.3 } }}
                drag="x"
                dragConstraints={{ left: -100, right: 0 }}
                dragElastic={0.15}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -80) {
                    deleteReading(reading.id);
                  }
                }}
                className="relative group touch-pan-y"
              >
                {/* Node circle on timeline */}
                <div
                  className="absolute -left-[27px] top-4 w-4 h-4 rounded-full border-2 border-slate-900 flex items-center justify-center transition-transform group-hover:scale-125"
                  style={{ backgroundColor: color }}
                />

                {/* Entry Card */}
                <div className={`p-4 rounded-xl glass-panel-subtle border ${borderClass} hover:border-migo-purple/40 hover:bg-white/[0.04] transition-all duration-300 shadow-sm hover:shadow-lg`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Glucose Value Pill */}
                      <div className="flex flex-col">
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black font-display text-white">
                            {reading.value}
                          </span>
                          <span className="text-xs font-semibold text-slate-400">{user.unit}</span>
                          <span
                            className="ml-1 text-sm font-bold text-slate-300"
                            title={trend.desc}
                          >
                            {trend.symbol}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider w-fit mt-0.5 ${bgClass}`}
                        >
                          {label}
                        </span>
                      </div>
                    </div>

                    {/* Time & Delete Button */}
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <span className="text-xs font-medium text-slate-300 block font-mono">
                          {formatClockTime(reading.timestamp)}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {formatTimeAgo(reading.timestamp)}
                        </span>
                      </div>

                      <button
                        onClick={() => deleteReading(reading.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                        title="Delete reading"
                        aria-label="Delete reading"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Meal Badge / Detail */}
                  {reading.meal && (
                    <motion.div
                      whileHover={{ scale: 1.01, y: -1 }}
                      className="mt-3 p-2.5 rounded-lg bg-slate-900/60 border border-white/[0.06] flex items-center justify-between gap-3 cursor-default"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-xl p-1 rounded-md bg-white/[0.05]">
                          {reading.meal.icon || '🥑'}
                        </span>
                        <div className="min-w-0">
                          <span className="text-xs font-semibold text-slate-200 block truncate">
                            {reading.meal.name}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Glycemic Index: <strong className="text-cyan-400 uppercase">{reading.meal.glycemicIndex}</strong>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-right flex-shrink-0 text-xs">
                        <div>
                          <strong className="text-cyan-300 font-mono">{reading.meal.carbs}g</strong>
                          <span className="text-[10px] text-slate-500 block">carbs</span>
                        </div>
                        <div>
                          <strong className="text-purple-300 font-mono">{reading.meal.calories}</strong>
                          <span className="text-[10px] text-slate-500 block">kcal</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Medication dose */}
                  {reading.medicationDose && (
                    <div className="mt-2.5 flex items-center gap-2 text-xs text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1.5 rounded-lg w-fit">
                      <Pill className="w-3.5 h-3.5 text-purple-400" />
                      <span>{reading.medicationDose.name}: <strong>{reading.medicationDose.units}mg</strong></span>
                    </div>
                  )}

                  {/* Notes & Heart Rate */}
                  <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                    {reading.note && (
                      <p className="flex items-center gap-1.5 text-slate-300 italic">
                        <MessageSquare className="w-3 h-3 text-slate-500" />
                        "{reading.note}"
                      </p>
                    )}
                    {reading.heartRate && (
                      <span className="ml-auto flex items-center gap-1 text-[11px] text-rose-300 font-mono">
                        <Heart className="w-3 h-3 text-rose-400 fill-rose-400/30" />
                        {reading.heartRate} bpm
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredReadings.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <p className="text-sm font-medium">No events found matching this filter.</p>
            <button
              onClick={() => setFilter('all')}
              className="mt-2 text-xs text-migo-purple-light hover:underline"
            >
              Reset filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
