import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plan } from '../data/plans';
import { getPerson } from '../data/people';
import { Avatar } from '../ui/Avatar';
import { AvatarStack } from '../ui/AvatarStack';
import { MapPin, Clock, Sparkles, Plus, Users } from 'lucide-react';

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
      <div className="flex items-center justify-between pb-3 px-1">
        <div className="flex items-center gap-2">
          <h3 className="font-display font-bold text-sm text-ink dark:text-white uppercase tracking-wider">
            Live Nearby
          </h3>
          <span className="text-xs font-black px-2 py-0.5 rounded-full bg-marigold/20 text-ink dark:text-marigold">
            {plans.length}
          </span>
        </div>
        <span className="text-[11px] text-ink-muted">Hover to locate</span>
      </div>

      {plans.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-black/10 dark:border-white/10 rounded-2xl bg-white/40 dark:bg-night/40 backdrop-blur-xs">
          <div className="w-12 h-12 rounded-full bg-marigold/20 flex items-center justify-center text-2xl mb-3">
            📍
          </div>
          <h4 className="font-display font-bold text-base text-ink dark:text-white">
            Nothing here yet
          </h4>
          <p className="text-xs text-ink-soft dark:text-ink-muted mt-1 max-w-[200px]">
            Be the first to gather people nearby. It takes 20 seconds.
          </p>
          <button
            onClick={onOpenComposer}
            className="mt-4 px-4 py-2 rounded-full bg-marigold text-ink font-bold text-xs shadow-soft hover:brightness-105 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Post first plan
          </button>
        </div>
      ) : (
        <div className="space-y-2.5 pb-20">
          <AnimatePresence>
            {plans.map((plan) => {
              const host = getPerson(plan.hostId);
              const spotsLeft = plan.capacity - plan.goingIds.length;
              const isSelected = selectedPlanId === plan.id;
              const isHovered = hoveredPlanId === plan.id;

              // Urgency calculation
              let urgencyChip: { label: string; bg: string; text: string } | null = null;
              if (plan.startsInMin <= 15 && plan.startsInMin >= 0) {
                urgencyChip = {
                  label: `Starts in ${plan.startsInMin}m`,
                  bg: 'bg-marigold/20 border-marigold/40',
                  text: 'text-ink dark:text-marigold',
                };
              } else if (spotsLeft === 1) {
                urgencyChip = {
                  label: '1 spot left',
                  bg: 'bg-bougainvillea/15 border-bougainvillea/30',
                  text: 'text-bougainvillea',
                };
              } else if (spotsLeft <= 0) {
                urgencyChip = {
                  label: 'Full: waitlist',
                  bg: 'bg-black/10 dark:bg-white/10 border-black/20 dark:border-white/20',
                  text: 'text-ink-muted',
                };
              }

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
                  className={`group relative p-3.5 rounded-2xl cursor-pointer transition-all duration-200 border ${
                    isSelected
                      ? 'bg-white dark:bg-night border-marigold shadow-soft ring-2 ring-marigold/40 scale-[1.01]'
                      : isHovered
                      ? 'bg-white dark:bg-night border-black/15 dark:border-white/20 shadow-md -translate-y-0.5'
                      : 'bg-white/80 dark:bg-night/70 hover:bg-white dark:hover:bg-night border-black/5 dark:border-white/10 shadow-xs'
                  } backdrop-blur-md`}
                >
                  {/* Top line: Emoji + Title + Urgency */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                        {plan.emoji}
                      </span>
                      <h4 className="font-display font-bold text-sm text-ink dark:text-white truncate">
                        {plan.title}
                      </h4>
                    </div>

                    {urgencyChip && (
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${urgencyChip.bg} ${urgencyChip.text} flex-shrink-0`}
                      >
                        {urgencyChip.label}
                      </span>
                    )}
                  </div>

                  {/* Location & Time info */}
                  <div className="mt-2 flex items-center gap-3 text-xs text-ink-soft dark:text-ink-muted">
                    <div className="flex items-center gap-1 truncate max-w-[170px]">
                      <MapPin className="w-3 h-3 flex-shrink-0 text-lagoon" />
                      <span className="truncate">{plan.place.name}</span>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Clock className="w-3 h-3 text-ink-muted" />
                      <span>{plan.startsInMin > 0 ? `In ${plan.startsInMin}m` : 'Now'}</span>
                    </div>
                  </div>

                  {/* Footer: Host & Avatars */}
                  <div className="mt-3 pt-2.5 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Avatar
                        person={host}
                        size="xs"
                        showVerifiedRing
                        showOnlineBadge
                      />
                      <span className="text-xs font-semibold text-ink-soft dark:text-ink-muted truncate max-w-[90px]">
                        {host.name.split(' ')[0]}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <AvatarStack userIds={plan.goingIds} max={3} size="xs" />
                      <span className="text-xs font-bold text-ink dark:text-white flex items-center gap-0.5">
                        <Users className="w-3 h-3 text-ink-muted" />
                        {plan.goingIds.length}/{plan.capacity}
                      </span>
                    </div>
                  </div>

                  {/* Sponsored tag if applicable */}
                  {plan.sponsored && (
                    <div className="mt-1.5 flex items-center gap-1 text-[10px] font-bold text-marigold uppercase tracking-wider">
                      <Sparkles className="w-3 h-3 text-marigold" />
                      <span>Featured by {plan.sponsorName || 'Venue'}</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
