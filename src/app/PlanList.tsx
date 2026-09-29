import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plan } from '../data/plans';
import { getPerson } from '../data/people';
import { Avatar } from '../ui/Avatar';
import { AvatarStack } from '../ui/AvatarStack';
import { MapPin, Clock, Plus, Users, Flame } from 'lucide-react';

interface PlanListProps {
  plans: Plan[];
  selectedPlanId: string | null;
  hoveredPlanId: string | null;
  onHoverPlan: (id: string | null) => void;
  onSelectPlan: (id: string) => void;
  onOpenComposer: () => void;
  className?: string;
}

export const PlanList: React.FC<PlanListProps> = ({
  plans,
  selectedPlanId,
  hoveredPlanId,
  onHoverPlan,
  onSelectPlan,
  onOpenComposer,
  className = '',
}) => {
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Scroll hovered plan into view if triggered from map
  useEffect(() => {
    if (hoveredPlanId && itemRefs.current.has(hoveredPlanId)) {
      const el = itemRefs.current.get(hoveredPlanId);
      el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [hoveredPlanId]);

  return (
    <div
      data-lenis-prevent
      className={`flex flex-col h-full overflow-y-auto overscroll-contain pr-1 custom-scrollbar ${className}`}
    >
      {/* Header Stamp */}
      <div className="flex items-center justify-between pb-3 px-1">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          <h3 className="font-display font-black text-sm text-gray-900 dark:text-white uppercase tracking-wider">
            Mumbai Circles
          </h3>
          <span className="text-xs font-mono font-black px-2 py-0.5 rounded-md bg-amber-400 text-black border border-black shadow-[1.5px_1.5px_0px_#000]">
            {plans.length} LIVE
          </span>
        </div>
        <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest">
          TAP TO ZOOM
        </span>
      </div>

      {plans.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-black/20 dark:border-white/20 rounded-3xl bg-[#FFFDF7]/90 dark:bg-[#0F111A]/90 backdrop-blur-xs">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center text-2xl mb-3">
            📍
          </div>
          <h4 className="font-display font-black text-base text-gray-900 dark:text-white">
            No circles in this sector
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 max-w-[200px] font-medium">
            Be the first to gather people nearby in Mumbai.
          </p>
          <button
            onClick={onOpenComposer}
            className="mt-4 px-4 py-2.5 rounded-xl bg-amber-400 text-black font-black text-xs border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Host Mumbai Plan</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3 pb-24">
          <AnimatePresence>
            {plans.map((plan) => {
              const host = getPerson(plan.hostId);
              const spotsLeft = plan.capacity - plan.goingIds.length;
              const isSelected = selectedPlanId === plan.id;
              const isHovered = hoveredPlanId === plan.id;

              return (
                <motion.div
                  key={plan.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  ref={(el) => {
                    if (el) itemRefs.current.set(plan.id, el);
                    else itemRefs.current.delete(plan.id);
                  }}
                  onMouseEnter={() => onHoverPlan(plan.id)}
                  onMouseLeave={() => onHoverPlan(null)}
                  onClick={() => onSelectPlan(plan.id)}
                  data-cursor="join"
                  className={`group relative p-3.5 rounded-2xl cursor-pointer transition-all duration-200 border-2 ${
                    isSelected
                      ? 'bg-amber-100/90 dark:bg-amber-950/40 border-black dark:border-amber-400 shadow-[4px_4px_0px_#000] scale-[1.01]'
                      : isHovered
                      ? 'bg-white dark:bg-[#141624] border-black dark:border-white shadow-[4px_4px_0px_#000] -translate-y-0.5'
                      : 'bg-white/95 dark:bg-[#0F111A]/95 hover:bg-white border-black/80 dark:border-white/20 shadow-[2.5px_2.5px_0px_#000]'
                  } backdrop-blur-md`}
                >
                  {/* Top Bar: Area Badge + Time */}
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="text-[10px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-black text-white dark:bg-white dark:text-black">
                      {plan.place.area}
                    </span>

                    <div className="flex items-center gap-1 text-[11px] font-bold">
                      {plan.startsInMin <= 0 ? (
                        <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1 font-mono font-black">
                          <Flame className="w-3 h-3 fill-current" />
                          <span>LIVE NOW</span>
                        </span>
                      ) : (
                        <span className="text-gray-600 dark:text-gray-300 font-mono">
                          IN {plan.startsInMin}M
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Emoji */}
                  <div className="flex items-start gap-2.5">
                    <span className="text-2xl flex-shrink-0 group-hover:scale-115 transition-transform duration-200">
                      {plan.emoji}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-display font-black text-sm text-gray-950 dark:text-white leading-snug line-clamp-2">
                        {plan.title}
                      </h4>
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-600 dark:text-gray-300">
                        <MapPin className="w-3 h-3 text-amber-500 flex-shrink-0" />
                        <span className="truncate font-medium">{plan.place.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Vibe Tags */}
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {plan.vibeTags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/10 text-gray-700 dark:text-gray-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer: Host & Count */}
                  <div className="mt-3 pt-2.5 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Avatar person={host} size="xs" showVerifiedRing />
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate max-w-[100px]">
                        {host.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <AvatarStack userIds={plan.goingIds} max={3} size="xs" />
                      <span className="text-xs font-black text-black dark:text-white font-mono bg-amber-400 px-2 py-0.5 rounded-md border border-black shadow-[1px_1px_0px_#000]">
                        {plan.goingIds.length}/{plan.capacity}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
