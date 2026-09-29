import { create } from 'zustand';
import { GlucoseReading, DailySummary, HealthInsight, UserProfile, TimeOfDay } from '../types';
import { INITIAL_USER, INITIAL_READINGS, INITIAL_DAILY_SUMMARY, WEEKLY_SUMMARIES, HEALTH_INSIGHTS } from '../data/mockData';
import { soundFx } from '../utils/sound';

interface HealthState {
  user: UserProfile;
  readings: GlucoseReading[];
  dailySummary: DailySummary;
  weeklySummaries: DailySummary[];
  insights: HealthInsight[];
  activeTab: 'dashboard' | 'timeline' | 'analytics' | 'scrollystory' | 'settings';
  timeOfDay: TimeOfDay;
  isLogModalOpen: boolean;
  activeLogCategory: 'glucose' | 'meal' | 'medication' | 'note';
  isOffline: boolean;
  turboMode: boolean;
  pullRefreshActive: boolean;

  // Actions
  setUser: (partial: Partial<UserProfile>) => void;
  addReading: (newReading: Partial<GlucoseReading> & { value: number }) => void;
  deleteReading: (id: string) => void;
  setActiveTab: (tab: HealthState['activeTab']) => void;
  setTimeOfDay: (time: TimeOfDay) => void;
  openLogModal: (category?: HealthState['activeLogCategory']) => void;
  closeLogModal: () => void;
  toggleOffline: () => void;
  setTurboMode: (active: boolean) => void;
  triggerPullToRefresh: () => Promise<void>;
  resetToDefaults: () => void;
}

export const useHealthStore = create<HealthState>((set, get) => ({
  user: INITIAL_USER,
  readings: INITIAL_READINGS,
  dailySummary: INITIAL_DAILY_SUMMARY,
  weeklySummaries: WEEKLY_SUMMARIES,
  insights: HEALTH_INSIGHTS,
  activeTab: 'dashboard',
  timeOfDay: 'realtime',
  isLogModalOpen: false,
  activeLogCategory: 'glucose',
  isOffline: false,
  turboMode: false,
  pullRefreshActive: false,

  setUser: (partial) => {
    set((state) => {
      const updated = { ...state.user, ...partial };
      if (partial.soundEnabled !== undefined) {
        soundFx.setEnabled(partial.soundEnabled);
      }
      if (partial.theme !== undefined) {
        if (partial.theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      return { user: updated };
    });
  },

  addReading: (newReading) => {
    const id = 'r_' + Date.now();
    const timestamp = new Date().toISOString();
    const completeReading: GlucoseReading = {
      id,
      timestamp,
      value: newReading.value,
      trend: newReading.trend || 'stable',
      note: newReading.note,
      meal: newReading.meal,
      medicationDose: newReading.medicationDose,
      exerciseMinutes: newReading.exerciseMinutes,
      heartRate: newReading.heartRate || Math.floor(65 + Math.random() * 20),
    };

    set((state) => {
      const updatedReadings = [...state.readings, completeReading];
      
      // Recalculate summary metrics
      const values = updatedReadings.map((r) => r.value);
      const average = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
      const min = Math.min(...values);
      const max = Math.max(...values);
      const inRangeCount = values.filter((v) => v >= state.user.targetRangeMin && v <= state.user.targetRangeMax).length;
      const inRange = Math.round((inRangeCount / values.length) * 100);
      const mealsCount = updatedReadings.filter((r) => r.meal).length;

      const updatedSummary: DailySummary = {
        ...state.dailySummary,
        average,
        min,
        max,
        inRange,
        meals: mealsCount,
      };

      return {
        readings: updatedReadings,
        dailySummary: updatedSummary,
      };
    });

    soundFx.playSuccess();
  },

  deleteReading: (id) => {
    set((state) => {
      const updatedReadings = state.readings.filter((r) => r.id !== id);
      soundFx.playTap(350);
      return { readings: updatedReadings };
    });
  },

  setActiveTab: (tab) => {
    soundFx.playTap(900);
    set({ activeTab: tab });
  },

  setTimeOfDay: (time) => {
    soundFx.playTap(700);
    set({ timeOfDay: time });
  },

  openLogModal: (category = 'glucose') => {
    soundFx.playTap(850);
    set({ isLogModalOpen: true, activeLogCategory: category });
  },

  closeLogModal: () => {
    soundFx.playTap(450);
    set({ isLogModalOpen: false });
  },

  toggleOffline: () => {
    set((state) => {
      soundFx.playTap(state.isOffline ? 600 : 300);
      return { isOffline: !state.isOffline };
    });
  },

  setTurboMode: (active) => {
    if (active) {
      soundFx.playFanfare();
    }
    set({ turboMode: active });
  },

  triggerPullToRefresh: async () => {
    set({ pullRefreshActive: true });
    soundFx.playTap(750);
    await new Promise((resolve) => setTimeout(resolve, 1400));
    set({ pullRefreshActive: false });
    soundFx.playSuccess();
  },

  resetToDefaults: () => {
    set({
      readings: INITIAL_READINGS,
      dailySummary: INITIAL_DAILY_SUMMARY,
      user: INITIAL_USER,
    });
    soundFx.playTap(500);
  },
}));
