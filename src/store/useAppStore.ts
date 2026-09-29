import { create } from 'zustand';
import { Plan, INITIAL_PLANS, PlanCategory } from '../data/plans';
import { INITIAL_CHATS, ChatMessage, AUTO_REPLY_POOL } from '../data/chats';
import { INITIAL_TRIPS, Trip } from '../data/trips';
import { INITIAL_NOTIFICATIONS, NotificationItem } from '../data/notifications';
import { CURRENT_USER } from '../data/people';

export interface ToastItem {
  id: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  undoPlanId?: string;
}

interface AppState {
  plans: Plan[];
  selectedPlanId: string | null;
  activeTab: 'map' | 'plans' | 'chats' | 'trips' | 'you';
  joinedPlanIds: string[];
  myHostedPlanIds: string[];
  activeFilter: PlanCategory | 'All';
  searchQuery: string;
  timeScrubberMinutes: number; // 0 = now, up to 2160 (36h)
  isInvisible: boolean;
  theme: 'auto' | 'day' | 'night';
  effectiveTheme: 'light' | 'dark';
  isPremium: boolean;
  onboardingDone: boolean;
  chats: Record<string, ChatMessage[]>;
  trips: Trip[];
  notifications: NotificationItem[];
  livePeopleOutCount: number;
  composerOpen: boolean;
  planSheetOpen: boolean;
  chatOpenPlanId: string | null;
  activeTripId: string | null;
  toasts: ToastItem[];

  // Actions
  selectPlan: (id: string | null, openSheet?: boolean) => void;
  joinPlan: (planId: string, bringFriend?: boolean) => void;
  leavePlan: (planId: string) => void;
  createPlan: (newPlan: Partial<Plan> & { title: string; emoji: string; category: PlanCategory }) => Plan;
  sendMessage: (planId: string, text: string) => void;
  addReaction: (planId: string, messageId: string, emoji: string) => void;
  votePoll: (planId: string, messageId: string, optionIndex: number) => void;
  setActiveTab: (tab: AppState['activeTab']) => void;
  setFilter: (category: PlanCategory | 'All') => void;
  setSearchQuery: (query: string) => void;
  setTimeScrubber: (minutes: number) => void;
  toggleInvisible: () => void;
  setTheme: (theme: AppState['theme']) => void;
  setPremium: (isPremium: boolean) => void;
  setOnboardingDone: (done: boolean) => void;
  setComposerOpen: (open: boolean) => void;
  setPlanSheetOpen: (open: boolean) => void;
  openChatForPlan: (planId: string | null) => void;
  setActiveTrip: (tripId: string | null) => void;
  toggleChecklistItem: (tripId: string, itemIndex: number) => void;
  addToast: (message: string, actionLabel?: string, onAction?: () => void, undoPlanId?: string) => void;
  dismissToast: (id: string) => void;
  markAllNotificationsRead: () => void;
  driftLiveCounter: (delta: number) => void;
  resetDemoData: () => void;
}

// Helper to safely load from local storage
function safeLoad<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`sangam_${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

// Helper to safely save to local storage
function safeSave<T>(key: string, val: T): void {
  try {
    localStorage.setItem(`sangam_${key}`, JSON.stringify(val));
  } catch {
    // Ignore storage quota or access errors
  }
}

const getAutoTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18 ? 'light' : 'dark';
};

export const useAppStore = create<AppState>((set, get) => ({
  plans: safeLoad<Plan[]>('plans', INITIAL_PLANS),
  selectedPlanId: 'p_badminton_1',
  activeTab: 'map',
  joinedPlanIds: safeLoad<string[]>('joined', ['p_badminton_1']),
  myHostedPlanIds: safeLoad<string[]>('hosted', ['p_my_plan']),
  activeFilter: 'All',
  searchQuery: '',
  timeScrubberMinutes: 0,
  isInvisible: safeLoad<boolean>('invisible', false),
  theme: safeLoad<'auto' | 'day' | 'night'>('theme', 'auto'),
  effectiveTheme: getAutoTheme(),
  isPremium: safeLoad<boolean>('premium', false),
  onboardingDone: safeLoad<boolean>('onboarding', true),
  chats: safeLoad<Record<string, ChatMessage[]>>('chats', INITIAL_CHATS),
  trips: safeLoad<Trip[]>('trips', INITIAL_TRIPS),
  notifications: safeLoad<NotificationItem[]>('notifications', INITIAL_NOTIFICATIONS),
  livePeopleOutCount: 12804,
  composerOpen: false,
  planSheetOpen: false,
  chatOpenPlanId: null,
  activeTripId: null,
  toasts: [],

  selectPlan: (id, openSheet = true) => {
    set({
      selectedPlanId: id,
      planSheetOpen: openSheet && Boolean(id),
    });
  },

  joinPlan: (planId, bringFriend = false) => {
    const { plans, joinedPlanIds, addToast } = get();
    if (joinedPlanIds.includes(planId)) return;

    const updatedJoined = [...joinedPlanIds, planId];
    safeSave('joined', updatedJoined);

    const updatedPlans = plans.map((p) => {
      if (p.id === planId) {
        const spotsToAdd = bringFriend ? 2 : 1;
        const going = Array.from(new Set([...p.goingIds, CURRENT_USER.id]));
        return { ...p, goingIds: going };
      }
      return p;
    });

    safeSave('plans', updatedPlans);

    // Also add system message to plan chat
    const chats = { ...get().chats };
    const planMessages = chats[planId] ? [...chats[planId]] : [];
    planMessages.push({
      id: `sys_${Date.now()}`,
      senderId: 'system',
      senderName: 'System',
      text: `${CURRENT_USER.name} joined the plan`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSystem: true,
    });
    chats[planId] = planMessages;
    safeSave('chats', chats);

    set({
      joinedPlanIds: updatedJoined,
      plans: updatedPlans,
      chats,
    });

    addToast(
      "You're in. Chat is open.",
      'Open chat',
      () => {
        set({ chatOpenPlanId: planId, activeTab: 'chats' });
      },
      planId
    );
  },

  leavePlan: (planId) => {
    const { plans, joinedPlanIds, addToast } = get();
    const updatedJoined = joinedPlanIds.filter((id) => id !== planId);
    safeSave('joined', updatedJoined);

    const updatedPlans = plans.map((p) => {
      if (p.id === planId) {
        return { ...p, goingIds: p.goingIds.filter((uid) => uid !== CURRENT_USER.id) };
      }
      return p;
    });
    safeSave('plans', updatedPlans);

    set({
      joinedPlanIds: updatedJoined,
      plans: updatedPlans,
    });

    addToast('You left the plan.');
  },

  createPlan: (newPlanData) => {
    const id = `p_${Date.now()}`;
    const newPlan: Plan = {
      id,
      title: newPlanData.title,
      emoji: newPlanData.emoji || '⚡',
      category: newPlanData.category || 'Sports',
      hostId: CURRENT_USER.id,
      startsInMin: newPlanData.startsInMin ?? 30,
      durationMin: newPlanData.durationMin ?? 90,
      place: newPlanData.place || {
        name: 'Near Bandra Bandstand',
        area: 'Bandra West',
        lngLat: [72.8210, 19.0430],
        isPublic: true,
      },
      capacity: newPlanData.capacity ?? 6,
      goingIds: [CURRENT_USER.id],
      vibeTags: newPlanData.vibeTags || ['Friendly', 'Public place'],
      description: newPlanData.description || 'Spontaneous plan posted on Sangam map. Join in!',
    };

    const updatedPlans = [newPlan, ...get().plans];
    const updatedHosted = [...get().myHostedPlanIds, id];
    const updatedJoined = [...get().joinedPlanIds, id];

    safeSave('plans', updatedPlans);
    safeSave('hosted', updatedHosted);
    safeSave('joined', updatedJoined);

    // Initial greeting in chat
    const chats = { ...get().chats };
    chats[id] = [
      {
        id: `m_${Date.now()}`,
        senderId: CURRENT_USER.id,
        senderName: CURRENT_USER.name,
        text: `Hey everyone! Plan is live at ${newPlan.place.name}. See you all soon!`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
    safeSave('chats', chats);

    set({
      plans: updatedPlans,
      myHostedPlanIds: updatedHosted,
      joinedPlanIds: updatedJoined,
      chats,
      selectedPlanId: id,
      planSheetOpen: true,
      composerOpen: false,
    });

    get().addToast('Posted to the map.');
    return newPlan;
  },

  sendMessage: (planId, text) => {
    if (!text.trim()) return;
    const chats = { ...get().chats };
    const list = chats[planId] ? [...chats[planId]] : [];
    const newMsg: ChatMessage = {
      id: `m_${Date.now()}`,
      senderId: CURRENT_USER.id,
      senderName: CURRENT_USER.name,
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    list.push(newMsg);
    chats[planId] = list;
    safeSave('chats', chats);
    set({ chats });

    // Scripted auto-reply 1200ms - 2200ms later
    setTimeout(() => {
      const plan = get().plans.find((p) => p.id === planId);
      const otherGoers = plan ? plan.goingIds.filter((uid) => uid !== CURRENT_USER.id) : [];
      const replySender = otherGoers[0] || 'u_riya';
      const replyMsg: ChatMessage = {
        id: `reply_${Date.now()}`,
        senderId: replySender,
        senderName: replySender === 'u_rohan' ? 'Rohan V.' : replySender === 'u_riya' ? 'Riya K.' : 'Kabir S.',
        text: AUTO_REPLY_POOL[Math.floor(Math.random() * AUTO_REPLY_POOL.length)],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const freshChats = { ...get().chats };
      const freshList = freshChats[planId] ? [...freshChats[planId]] : [];
      freshList.push(replyMsg);
      freshChats[planId] = freshList;
      safeSave('chats', freshChats);
      set({ chats: freshChats });
    }, 1400);
  },

  addReaction: (planId, messageId, emoji) => {
    const chats = { ...get().chats };
    const list = chats[planId] || [];
    const updated = list.map((m) => {
      if (m.id === messageId) {
        const reactions = m.reactions ? [...m.reactions] : [];
        const existing = reactions.find((r) => r.emoji === emoji);
        if (existing) {
          existing.count += existing.byMe ? -1 : 1;
          existing.byMe = !existing.byMe;
        } else {
          reactions.push({ emoji, count: 1, byMe: true });
        }
        return { ...m, reactions: reactions.filter((r) => r.count > 0) };
      }
      return m;
    });
    chats[planId] = updated;
    set({ chats });
  },

  votePoll: (planId, messageId, optionIndex) => {
    const chats = { ...get().chats };
    const list = chats[planId] || [];
    const updated = list.map((m) => {
      if (m.id === messageId && m.poll) {
        const options = m.poll.options.map((opt, idx) => {
          if (idx === optionIndex) {
            return {
              ...opt,
              votes: opt.votedByMe ? opt.votes - 1 : opt.votes + 1,
              votedByMe: !opt.votedByMe,
            };
          }
          return opt;
        });
        return { ...m, poll: { ...m.poll, options } };
      }
      return m;
    });
    chats[planId] = updated;
    set({ chats });
  },

  setActiveTab: (activeTab) => set({ activeTab }),
  setFilter: (activeFilter) => set({ activeFilter }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setTimeScrubber: (timeScrubberMinutes) => set({ timeScrubberMinutes }),
  toggleInvisible: () => {
    const next = !get().isInvisible;
    safeSave('invisible', next);
    set({ isInvisible: next });
    get().addToast(next ? 'Invisible mode active. Your dot is hidden.' : 'You are visible on the map.');
  },
  setTheme: (theme) => {
    safeSave('theme', theme);
    const effective = theme === 'auto' ? getAutoTheme() : theme === 'night' ? 'dark' : 'light';
    set({ theme, effectiveTheme: effective });
    document.documentElement.setAttribute('data-theme', effective);
  },
  setPremium: (isPremium) => {
    safeSave('premium', isPremium);
    set({ isPremium });
  },
  setOnboardingDone: (onboardingDone) => {
    safeSave('onboarding', onboardingDone);
    set({ onboardingDone });
  },
  setComposerOpen: (composerOpen) => set({ composerOpen }),
  setPlanSheetOpen: (planSheetOpen) => set({ planSheetOpen }),
  openChatForPlan: (chatOpenPlanId) => set({ chatOpenPlanId }),
  setActiveTrip: (activeTripId) => set({ activeTripId }),
  toggleChecklistItem: (tripId, itemIndex) => {
    const trips = get().trips.map((t) => {
      if (t.id === tripId) {
        const checklist = t.packingChecklist.map((item, idx) =>
          idx === itemIndex ? { ...item, done: !item.done } : item
        );
        return { ...t, packingChecklist: checklist };
      }
      return t;
    });
    safeSave('trips', trips);
    set({ trips });
  },
  addToast: (message, actionLabel, onAction, undoPlanId) => {
    const id = `t_${Date.now()}`;
    const newToast: ToastItem = { id, message, actionLabel, onAction, undoPlanId };
    set((s) => ({ toasts: [...s.toasts.slice(-2), newToast] }));
    setTimeout(() => {
      get().dismissToast(id);
    }, 5000);
  },
  dismissToast: (id) => {
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
  },
  markAllNotificationsRead: () => {
    const updated = get().notifications.map((n) => ({ ...n, unread: false }));
    safeSave('notifications', updated);
    set({ notifications: updated });
  },
  driftLiveCounter: (delta) => {
    set((s) => ({ livePeopleOutCount: Math.max(10000, s.livePeopleOutCount + delta) }));
  },
  resetDemoData: () => {
    try {
      localStorage.clear();
    } catch {
      // ignore
    }
    set({
      plans: INITIAL_PLANS,
      selectedPlanId: 'p_badminton_1',
      joinedPlanIds: ['p_badminton_1'],
      myHostedPlanIds: ['p_my_plan'],
      isInvisible: false,
      theme: 'auto',
      effectiveTheme: getAutoTheme(),
      isPremium: false,
      chats: INITIAL_CHATS,
      trips: INITIAL_TRIPS,
      notifications: INITIAL_NOTIFICATIONS,
      livePeopleOutCount: 12804,
    });
    get().addToast('Demo data reset to clean initial state.');
  },
}));
