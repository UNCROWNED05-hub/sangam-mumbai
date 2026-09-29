import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plan } from '../data/plans';
import { getPerson } from '../data/people';
import { Check, MapPin } from 'lucide-react';

interface PlanBubbleProps {
  plan: Plan;
  onClick?: (e?: React.MouseEvent) => void;
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

  // Neo-brutalist tactile styling
  const getBubbleStyles = () => {
    if (isJoined) {
      return 'bg-emerald-500 text-white border-2 border-black shadow-[3px_3px_0px_#000]';
    }
    if (isMine) {
      return 'bg-rose-500 text-white border-2 border-black shadow-[3px_3px_0px_#000]';
    }
    if (plan.sponsored) {
      return 'bg-black text-amber-400 border-2 border-amber-400 shadow-[3px_3px_0px_#000]';
    }
    if (isHappeningNow) {
      return 'bg-amber-400 text-black border-2 border-black shadow-[3px_3px_0px_#000]';
    }
    return 'bg-white text-gray-950 dark:bg-[#121420] dark:text-white border-2 border-black/80 dark:border-white/30 shadow-[3px_3px_0px_#000]';
  };

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
        <span className="absolute inset-0 rounded-full bg-amber-400 opacity-60 animate-ping -z-10" />
      )}

      {/* Main Pill Bubble */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.1, y: -4 }}
        whileTap={{ scale: 0.93 }}
        onClick={onClick}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-black text-xs transition-all cursor-pointer ${getBubbleStyles()} ${
          isSelected ? 'ring-4 ring-amber-400 ring-offset-2' : ''
        }`}
      >
        <span className="text-base leading-none">{plan.emoji}</span>
        <span className="tabular-nums font-mono text-[11px] leading-none font-black">
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
            className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-60 p-3.5 rounded-2xl bg-[#FFFDF7] dark:bg-[#0F111A] border-2 border-black shadow-[5px_5px_0px_#000] z-50 pointer-events-none text-gray-900 dark:text-white"
          >
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider mb-1">
              <span className="text-rose-500 font-mono">
                {plan.startsInMin <= 0 ? '● LIVE NOW' : `IN ${plan.startsInMin}M`}
              </span>
              <span className="bg-amber-400 text-black px-2 py-0.5 rounded-md font-mono">
                {plan.place.area}
              </span>
            </div>

            <h4 className="text-xs font-black text-gray-950 dark:text-white leading-snug line-clamp-2">
              {plan.title}
            </h4>

            <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-600 dark:text-gray-300 font-medium">
              <MapPin className="w-3 h-3 text-amber-500 flex-shrink-0" />
              <span className="truncate">{plan.place.name}</span>
            </div>

            {/* Avatars Going */}
            <div className="flex items-center justify-between mt-2 pt-2 border-t-2 border-black/10 dark:border-white/10 text-[11px]">
              <div className="flex -space-x-1.5 overflow-hidden">
                {goers.map((g) => (
                  <div
                    key={g.id}
                    className="w-5 h-5 rounded-full border border-black text-[9px] font-bold flex items-center justify-center text-white"
                    style={{
                      background: `linear-gradient(135deg, ${g.avatarGradient[0]}, ${g.avatarGradient[1]})`,
                    }}
                  >
                    {g.initials}
                  </div>
                ))}
              </div>
              <span className="text-gray-600 dark:text-gray-400 text-[10px] font-bold">
                {plan.goingIds.length} going • {plan.capacity - plan.goingIds.length} spots left
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
