import React from 'react';
import { motion } from 'framer-motion';
import { useHealthStore } from '../../store/useHealthStore';
import { Sparkles, ArrowUpRight, TrendingUp, Clock, Zap, CheckCircle2 } from 'lucide-react';
import { soundFx } from '../../utils/sound';

export const AIInsights: React.FC = () => {
  const insights = useHealthStore((s) => s.insights);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold font-display text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-migo-purple-light" />
            Metabolic Intelligence & Predictive Insights
          </h3>
          <p className="text-xs text-slate-400">
            Machine learning telemetry trained on multi-sensor biomarker data
          </p>
        </div>

        <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
          96% Confidence
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, idx) => {
          const isPositive = insight.impact === 'positive';

          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.12, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              whileHover={{ y: -4, scale: 1.01 }}
              onMouseEnter={() => soundFx.playTap(1100)}
              className="p-5 rounded-2xl glass-panel-glow border border-white/[0.08] hover:border-migo-purple/40 relative overflow-hidden group shadow-sm hover:shadow-card-hover transition-all"
              data-interactive="true"
            >
              {/* Category indicator badge */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-migo-purple/20 text-migo-purple-light border border-migo-purple/30">
                  {insight.category}
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono">{insight.timestamp}</span>
                  <span className="text-xs font-bold text-emerald-400 font-mono">
                    Score: {insight.score}/100
                  </span>
                </div>
              </div>

              {/* Title */}
              <h4 className="text-sm font-bold text-white group-hover:text-migo-purple-light transition-colors leading-snug">
                {insight.title}
              </h4>

              {/* Description */}
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {insight.description}
              </p>

              {/* Actionable Tip */}
              <div className="mt-3.5 pt-3 border-t border-white/[0.06] flex items-start gap-2 bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.04]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs font-medium text-emerald-300 leading-normal">
                  <strong className="text-white font-semibold">Recommended Action:</strong>{' '}
                  {insight.actionableTip}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
