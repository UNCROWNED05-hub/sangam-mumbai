import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAppStore } from '../../store/useAppStore';
import { CURRENT_USER } from '../../data/people';
import { MessageSquare, Users, Sparkles, ChevronRight, Hash } from 'lucide-react';

interface ChatsTabProps {
  onOpenChat: (planId: string) => void;
}

const CITY_LOUNGES = [
  { id: 'city_mumbai', title: 'Mumbai Everyone', emoji: '🌊', members: 4280, desc: 'City-wide open chat, late night food runs, and vibes' },
  { id: 'city_bandra', title: 'Bandra & Khar Locals', emoji: '☕', members: 1640, desc: 'Promenade updates, cafe recs, and sports' },
  { id: 'city_hikers', title: 'Sahyadri & Weekend Hikers', emoji: '⛰️', members: 890, desc: 'Trails, weather checks, carpools' },
  { id: 'city_foodies', title: 'Street Food & Irani Cafes', emoji: '🥟', members: 1250, desc: 'Bun maska, chaat, and weekend breakfasts' },
];

export const ChatsTab: React.FC<ChatsTabProps> = ({ onOpenChat }) => {
  const { plans, joinedPlanIds, chats } = useAppStore();
  const [subTab, setSubTab] = useState<'circles' | 'lounges'>('circles');

  const joinedPlans = plans.filter((p) => joinedPlanIds.includes(p.id));

  return (
    <div
      data-lenis-prevent
      className="flex-1 overflow-y-auto p-4 sm:p-8 pt-24 sm:pt-28 max-w-3xl mx-auto w-full space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-extrabold text-2xl text-ink dark:text-white">
            Conversations
          </h2>
          <p className="text-xs text-ink-soft dark:text-ink-muted mt-0.5">
            Coordinate meetups and chat with local Mumbai circles.
          </p>
        </div>

        {/* Tab switch */}
        <div className="p-1 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center gap-1">
          <button
            onClick={() => setSubTab('circles')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              subTab === 'circles'
                ? 'bg-marigold text-ink shadow-xs'
                : 'text-ink-muted hover:text-ink dark:hover:text-white'
            }`}
          >
            Joined Circles ({joinedPlans.length})
          </button>
          <button
            onClick={() => setSubTab('lounges')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              subTab === 'lounges'
                ? 'bg-marigold text-ink shadow-xs'
                : 'text-ink-muted hover:text-ink dark:hover:text-white'
            }`}
          >
            City Lounges (4)
          </button>
        </div>
      </div>

      {subTab === 'circles' ? (
        joinedPlans.length === 0 ? (
          <div className="py-16 text-center border-2 border-dashed border-black/10 dark:border-white/10 rounded-3xl p-6 bg-black/2 dark:bg-white/2 space-y-3">
            <div className="text-3xl">💬</div>
            <h3 className="font-display font-bold text-base text-ink dark:text-white">
              No circle chats yet
            </h3>
            <p className="text-xs text-ink-muted max-w-xs mx-auto">
              Join any plan on the map to unlock its group chat and meet the crew.
            </p>
          </div>
        ) : (
          <div className="space-y-3 pb-16">
            {joinedPlans.map((plan) => {
              const threadMessages = chats[plan.id] || [];
              const lastMsg = threadMessages[threadMessages.length - 1];

              return (
                <div
                  key={plan.id}
                  onClick={() => onOpenChat(plan.id)}
                  className="p-4 rounded-3xl bg-paper dark:bg-night border border-black/10 dark:border-white/10 shadow-xs hover:border-lagoon hover:shadow-soft cursor-pointer transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">
                      {plan.emoji}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-display font-bold text-sm text-ink dark:text-white truncate">
                          {plan.title}
                        </h4>
                        <span className="text-[10px] font-bold text-lagoon px-2 py-0.5 rounded-full bg-lagoon/15 flex-shrink-0">
                          {plan.goingIds.length} members
                        </span>
                      </div>
                      <p className="text-xs text-ink-muted truncate mt-0.5">
                        {lastMsg
                          ? `${lastMsg.senderName.split(' ')[0]}: ${lastMsg.text}`
                          : 'No messages yet. Say hi!'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[10px] text-ink-muted">
                      {lastMsg ? lastMsg.time : 'Active'}
                    </span>
                    <ChevronRight className="w-4 h-4 text-ink-muted group-hover:text-lagoon group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        <div className="space-y-3 pb-16">
          {CITY_LOUNGES.map((lounge) => {
            return (
              <div
                key={lounge.id}
                onClick={() => onOpenChat(lounge.id)}
                className="p-4 rounded-3xl bg-paper dark:bg-night border border-black/10 dark:border-white/10 shadow-xs hover:border-marigold hover:shadow-soft cursor-pointer transition-all flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">
                    {lounge.emoji}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-display font-bold text-sm text-ink dark:text-white truncate">
                        {lounge.title}
                      </h4>
                      <span className="text-[10px] font-bold text-marigold px-2 py-0.5 rounded-full bg-marigold/15 flex-shrink-0 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {lounge.members.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-ink-muted truncate mt-0.5">{lounge.desc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs font-bold text-marigold">Join room →</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
