import { GlucoseStatus, GlucoseTrend } from '../types';

export function classifyGlucose(value: number, targetMin = 70, targetMax = 140): {
  status: GlucoseStatus;
  label: string;
  color: string;
  bgClass: string;
  borderClass: string;
} {
  if (value < 70) {
    return {
      status: 'low',
      label: 'Low / Hypo',
      color: '#f43f5e',
      bgClass: 'bg-rose-500/10 text-rose-400',
      borderClass: 'border-rose-500/30',
    };
  }
  if (value <= targetMax) {
    return {
      status: 'optimal',
      label: 'In Target Range',
      color: '#10b981',
      bgClass: 'bg-emerald-500/10 text-emerald-400',
      borderClass: 'border-emerald-500/30',
    };
  }
  if (value <= 180) {
    return {
      status: 'elevated',
      label: 'Slightly Elevated',
      color: '#f59e0b',
      bgClass: 'bg-amber-500/10 text-amber-400',
      borderClass: 'border-amber-500/30',
    };
  }
  return {
    status: 'high',
    label: 'High Glucose',
    color: '#e11d48',
    bgClass: 'bg-red-500/15 text-red-400',
    borderClass: 'border-red-500/40',
  };
}

export function formatGlucoseValue(value: number, unit: 'mg/dL' | 'mmol/L'): string {
  if (unit === 'mmol/L') {
    return (value / 18.0182).toFixed(1);
  }
  return Math.round(value).toString();
}

export function formatTimeAgo(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export function formatClockTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function getTrendSymbol(trend: GlucoseTrend): { symbol: string; angle: number; desc: string } {
  switch (trend) {
    case 'rising_rapidly':
      return { symbol: '↑↑', angle: -90, desc: 'Rising sharply (>2 mg/dL/min)' };
    case 'rising':
      return { symbol: '↗', angle: -45, desc: 'Rising slowly' };
    case 'stable':
      return { symbol: '→', angle: 0, desc: 'Steady metabolic balance' };
    case 'falling':
      return { symbol: '↘', angle: 45, desc: 'Dropping gradually' };
    case 'falling_rapidly':
      return { symbol: '↓↓', angle: 90, desc: 'Dropping quickly' };
  }
}
