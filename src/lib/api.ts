import { INITIAL_PLANS, Plan } from '../data/plans';
import { PEOPLE, CURRENT_USER, Person } from '../data/people';
import { INITIAL_CHATS, ChatMessage } from '../data/chats';
import { INITIAL_TRIPS, Trip } from '../data/trips';
import { CITIES, CitySummary } from '../data/cities';
import { INITIAL_NOTIFICATIONS, NotificationItem } from '../data/notifications';
import { defaultRng } from './rng';

const delay = (minMs = 250, maxMs = 700) =>
  new Promise((res) => setTimeout(res, minMs + Math.floor(defaultRng() * (maxMs - minMs))));

export const api = {
  getPlans: async (): Promise<Plan[]> => {
    await delay(250, 500);
    return [...INITIAL_PLANS];
  },

  getPlanById: async (id: string): Promise<Plan | null> => {
    await delay(150, 400);
    return INITIAL_PLANS.find((p) => p.id === id) || null;
  },

  getPeople: async (): Promise<Person[]> => {
    await delay(200, 400);
    return [...PEOPLE];
  },

  getCurrentUser: async (): Promise<Person> => {
    await delay(100, 250);
    return { ...CURRENT_USER };
  },

  getChats: async (planId: string): Promise<ChatMessage[]> => {
    await delay(150, 400);
    return [...(INITIAL_CHATS[planId] || [])];
  },

  getTrips: async (): Promise<Trip[]> => {
    await delay(250, 550);
    return [...INITIAL_TRIPS];
  },

  getCities: async (): Promise<CitySummary[]> => {
    await delay(100, 300);
    return [...CITIES];
  },

  getNotifications: async (): Promise<NotificationItem[]> => {
    await delay(150, 350);
    return [...INITIAL_NOTIFICATIONS];
  },
};
