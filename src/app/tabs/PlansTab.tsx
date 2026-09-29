import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../../store/useAppStore';
import { CURRENT_USER } from '../../data/people';
import { getPerson } from '../../data/people';
import { Avatar } from '../../ui/Avatar';
import { AvatarStack } from '../../ui/AvatarStack';
import { MapPin, Clock, Users, Calendar, ArrowRight, Trash2 } from 'lucide-react';

interface PlansTabProps {
  onSelectPlan: (planId: string) => void;
  onOpenComposer: () => void;
}

export const PlansTab: React.FC<PlansTabProps> = ({ onSelectPlan, onOpenComposer }) => {
  const { plans, joinedPlanIds, myHostedPlanIds, leavePlan, addToast } = useAppStore();
  const [subTab, setSubTab] = useState<'upcoming' | 'hosting' | 'past'>('upcoming');

  const upcomingPlans = plans.filter(
    (p) => joinedPlanIds.includes(p.id) && p.hostId !== CURRENT_USER.id
  );
  const hostedPlans = plans.filter(
    (p) => myHostedPlanIds.includes(p.id) || p.hostId === CURRENT_USER.id
  );
  const pastPlans = plans.filter((p) => p.startsInMin < -30).slice(0, 4);

  const currentList =
    subTab === 'upcoming'
      ? upcomingPlans
      : subTab === 'hosting'
      ? hostedPlans
      : pastPlans;

  return (
    <div
      data-lenis-prevent
      className="flex-1 overflow-y-auto p-4 sm:p-8 pt-24 sm:pt-28 max-w-4xl mx-auto w-full space-y-6"
    >
      {/* Title & Subtabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-extrabold text-2xl text-ink dark:text-white">
            Your Schedule
          </h2>
          <p className="text-xs text-ink-soft dark:text-ink-muted mt-0.5">
            Manage circles you are attending or hosting across the city.
          </p>
        </div>

        {/* Animated Subtab Underline */}
        <div className="flex items-center gap-1 border-b border-black/10 dark:border-white/10 pb-1">
          {(['upcoming', 'hosting', 'past'] as const).map((tab) => {
            const isCurrent = subTab === tab;
            const count =
              tab === 'upcoming'
                ? upcomingPlans.length
                : tab === 'hosting'
                ? hostedPlans.length
                : pastPlans.length;

            return (
              <button
                key={tab}
                onClick={() => setSubTab(tab)}
                className={`relative px-3.5 py-1.5 text-xs font-bold capitalize transition-colors flex items-center gap-1.5 ${
                  isCurrent
                    ? 'text-ink dark:text-white'
                    : 'text-ink-muted hover:text-ink dark:hover:text-white'
                }`}
              >
                <span>{tab}</span>
                <span className="text-[10px] font-black opacity-75">({count})</span>
                {isCurrent && (
                  <motion.div
                    layoutId="plansSubtabUnderline"
                    className="absolute -bottom-1 inset-x-0 h-0.5 bg-marigold rounded-full"
                    transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Plans List */}
      {currentList.length === 0 ? (
        <div className="py-16 text-center border-2 border-dashed border-black/10 dark:border-white/10 rounded-3xl p-6 bg-black/2 dark:bg-white/2 space-y-3">
          <div className="text-3xl">🗓️</div>
          <h3 className="font-display font-bold text-base text-ink dark:text-white">
            No {subTab} plans found
          </h3>
          <p className="text-xs text-ink-muted max-w-xs mx-auto">
            {subTab === 'hosting'
              ? 'You have not created any plans yet. Drop a pin to gather friends.'
              : 'Explore the live map to join local morning runs, board games, or coffee meetups.'}
          </p>
          <button
            onClick={onOpenComposer}
            className="px-4 py-2 rounded-full bg-marigold text-ink font-bold text-xs shadow-soft hover:brightness-105 active:scale-95 transition-all inline-block mt-2"
          >
            Create a Plan
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-16">
          <AnimatePresence>
            {currentList.map((plan) => {
              const host = getPerson(plan.hostId);
              const isHost = plan.hostId === CURRENT_USER.id;

              return (
                <motion.div
                  key={plan.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-4 sm:p-5 rounded-3xl bg-paper dark:bg-night border border-black/10 dark:border-white/10 shadow-soft hover:border-marigold/60 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-3xl">{plan.emoji}</span>
                        <div>
                          <span
                            className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              isHost
                                ? 'bg-bougainvillea/20 text-bougainvillea'
                                : 'bg-lagoon/20 text-lagoon'
                            }`}
                          >
                            {isHost ? 'Hosting' : 'Attending'} • {plan.category}
                          </span>
                          <h3 className="font-display font-bold text-base text-ink dark:text-white leading-tight mt-0.5">
                            {plan.title}
                          </h3>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs text-ink-soft dark:text-ink-muted">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-bougainvillea flex-shrink-0" />
                        <span className="truncate">{plan.place.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-marigold flex-shrink-0" />
                        <span>
                          {plan.startsInMin <= 0 ? 'Happening now' : `In ${plan.startsInMin} minutes`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-lagoon flex-shrink-0" />
                        <span>
                          {plan.goingIds.length} of {plan.capacity} spots filled
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer actions */}
                  <div className="pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AvatarStack userIds={plan.goingIds} max={3} size="xs" />
                    </div>

                    <div className="flex items-center gap-2">
                      {!isHost && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            leavePlan(plan.id);
                          }}
                          title="Leave plan"
                          className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-ink-muted hover:text-bougainvillea transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => onSelectPlan(plan.id)}
                        className="px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/10 text-ink dark:text-white font-bold text-xs hover:bg-marigold hover:text-ink transition-colors flex items-center gap-1"
                      >
                        <span>Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
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
