import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plan } from '../data/plans';
import { PEOPLE, getPerson } from '../data/people';
import { Check, Sparkles } from 'lucide-react';
import { CURRENT_USER } from '../data/people';

interface PlanBubbleProps {
  plan: Plan;
  onClick?: () => void;
  isJoined?: boolean;
  isMine?: boolean;
  isSelected?: boolean;
  className?: string;
  enableExpandOnHover?: boolean;
}

export const PlanBubble: React.FC<PlanBubbleProps> = ({
  plan,
  onClick,
  isJoined = false,
  isMine = false,
  isSelected = false,
  className = '',
  enableExpandOnHover = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isHappeningNow = plan.startsInMin <= 15 && plan.startsInMin >= -60;

  // Determine state styling per Section 5.2
  const getBubbleStyles = () => {
    if (isJoined) {
      return 'bg-lagoon text-white border-2 border-white shadow-soft';
    }
    if (isMine) {
      return 'bg-bougainvillea text-white border-2 border-white shadow-soft';
    }
    if (plan.sponsored) {
      return 'bg-ink text-white border-2 border-marigold shadow-marigold-glow';
    }
    if (isHappeningNow) {
      return 'bg-marigold text-ink border-2 border-white shadow-marigold-glow';
    }
    return 'bg-white dark:bg-night text-ink dark:text-white border border-line shadow-soft';
  };

  const host = getPerson(plan.hostId);
  const goers = plan.goingIds.map((id) => getPerson(id)).slice(0, 3);

  return (
    <div
      className={`relative select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-cursor={isJoined ? 'open' : 'join'}
    >
      {/* Outer Glow Pulse for Happening Now */}
      {isHappeningNow && !isJoined && (
        <span className="absolute inset-0 rounded-full bg-marigold opacity-40 animate-ping -z-10" />
      )}

      {/* Main Pill Bubble */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.08, y: -4 }}
        whileTap={{ scale: 0.94 }}
        onClick={onClick}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs transition-all ${getBubbleStyles()} ${
          isSelected ? 'ring-4 ring-marigold ring-offset-2 ring-offset-transparent' : ''
        }`}
      >
        <span className="font-emoji text-sm leading-none">{plan.emoji}</span>
        <span className="tabular-nums font-mono text-[11px] leading-none">
          {plan.goingIds.length}
        </span>
        {isJoined && <Check className="w-3.5 h-3.5 stroke-[3] ml-0.5" />}
      </motion.button>

      {/* Spring Hover Mini Card */}
      <AnimatePresence>
        {enableExpandOnHover && isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
            className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-56 p-3 rounded-2xl bg-paper dark:bg-night border border-line shadow-ambient z-50 pointer-events-none"
          >
            <div className="flex items-center justify-between text-[11px] font-bold text-ink-muted mb-1">
              <span>{plan.startsInMin <= 0 ? 'Happening now' : `In ${plan.startsInMin}m`}</span>
              <span className="text-lagoon font-mono">{plan.place.area}</span>
            </div>

            <h4 className="text-xs font-bold text-ink dark:text-white leading-snug line-clamp-1">
              {plan.title}
            </h4>

            {/* Avatars Going */}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-line text-[11px]">
              <div className="flex -space-x-1.5 overflow-hidden">
                {goers.map((g) => (
                  <div
                    key={g.id}
                    className="w-5 h-5 rounded-full border border-white text-[9px] font-bold flex items-center justify-center text-white"
                    style={{
                      background: `linear-gradient(135deg, ${g.avatarGradient[0]}, ${g.avatarGradient[1]})`,
                    }}
                  >
                    {g.initials}
                  </div>
                ))}
              </div>
              <span className="text-ink-soft text-[10px] font-medium">
                {plan.goingIds.length} going • {plan.capacity - plan.goingIds.length} spots
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
