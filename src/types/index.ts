export type GlucoseTrend = 'rising_rapidly' | 'rising' | 'stable' | 'falling' | 'falling_rapidly';

export type GlucoseStatus = 'low' | 'optimal' | 'elevated' | 'high';

export interface MealItem {
  id: string;
  name: string;
  carbs: number;
  protein: number;
  fat: number;
  calories: number;
  photo?: string;
  icon?: string;
  glycemicIndex: 'low' | 'medium' | 'high';
}

export interface GlucoseReading {
  id: string;
  value: number; // in mg/dL (e.g. 110)
  timestamp: string; // ISO string
  trend: GlucoseTrend;
  note?: string;
  meal?: MealItem;
  medicationDose?: {
    name: string;
    units: number;
    type: 'rapid' | 'long_acting' | 'oral';
  };
  exerciseMinutes?: number;
  heartRate?: number;
}

export interface DailySummary {
  date: string;
  average: number;
  min: number;
  max: number;
  inRange: number; // percentage (e.g. 84)
  meals: number;
  exercise: number; // minutes
  gmi: number; // Glucose Management Indicator (estimated A1c e.g. 5.9%)
  hypoEvents: number;
  hyperEvents: number;
}

export type TimeOfDay = 'dawn' | 'noon' | 'sunset' | 'midnight' | 'realtime';

export interface UserProfile {
  name: string;
  email: string;
  avatarSeed: string;
  targetRangeMin: number;
  targetRangeMax: number;
  unit: 'mg/dL' | 'mmol/L';
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  reducedMotion: boolean;
  theme: 'dark' | 'light';
  customCursor: boolean;
  ambientAwareness: boolean;
}

export interface HealthInsight {
  id: string;
  title: string;
  category: 'nutrition' | 'circadian' | 'activity' | 'trend';
  score: number;
  description: string;
  actionableTip: string;
  impact: 'positive' | 'warning' | 'neutral';
  timestamp: string;
}
