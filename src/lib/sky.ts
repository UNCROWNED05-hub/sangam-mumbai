export interface SkyKeyframe {
  progress: number; // 0 to 1
  clock: string;
  topColor: string;
  bottomColor: string;
  isDark: boolean;
  orbType: 'sun' | 'moon';
  starOpacity: number;
}

export const SKY_KEYFRAMES: SkyKeyframe[] = [
  { progress: 0.0, clock: '6:10 am', topColor: '#CFE0FF', bottomColor: '#FFD6E0', isDark: false, orbType: 'sun', starOpacity: 0 },
  { progress: 0.2, clock: '12:30 pm', topColor: '#EAF4FF', bottomColor: '#FFF3C4', isDark: false, orbType: 'sun', starOpacity: 0 },
  { progress: 0.45, clock: '6:48 pm', topColor: '#FFD08A', bottomColor: '#FF8FA3', isDark: false, orbType: 'sun', starOpacity: 0.1 },
  { progress: 0.65, clock: '9:00 pm', topColor: '#4B3FA6', bottomColor: '#E8607A', isDark: true, orbType: 'moon', starOpacity: 0.65 },
  { progress: 0.85, clock: '11:50 pm', topColor: '#0B0E2A', bottomColor: '#1A1F5A', isDark: true, orbType: 'moon', starOpacity: 1.0 },
  { progress: 0.95, clock: '5:30 am', topColor: '#2B2F73', bottomColor: '#8E9BE0', isDark: true, orbType: 'sun', starOpacity: 0.4 },
  { progress: 1.0, clock: '6:10 am', topColor: '#CFE0FF', bottomColor: '#FFD6E0', isDark: false, orbType: 'sun', starOpacity: 0 },
];

// Helper to interpolate between hex colors
function parseHex(hex: string) {
  const clean = hex.replace('#', '');
  return {
    r: parseInt(clean.substring(0, 2), 16),
    g: parseInt(clean.substring(2, 4), 16),
    b: parseInt(clean.substring(4, 6), 16),
  };
}

function lerpHex(aHex: string, bHex: string, t: number) {
  const a = parseHex(aHex);
  const b = parseHex(bHex);
  const r = Math.round(a.r + (b.r - a.r) * t);
  const g = Math.round(a.g + (b.g - a.g) * t);
  const bVal = Math.round(a.b + (b.b - a.b) * t);
  return `rgb(${r}, ${g}, ${bVal})`;
}

export function getSkyAtProgress(progress: number): {
  topColor: string;
  bottomColor: string;
  clock: string;
  isDark: boolean;
  orbType: 'sun' | 'moon';
  starOpacity: number;
} {
  const p = Math.max(0, Math.min(1, progress));

  for (let i = 0; i < SKY_KEYFRAMES.length - 1; i++) {
    const k1 = SKY_KEYFRAMES[i];
    const k2 = SKY_KEYFRAMES[i + 1];

    if (p >= k1.progress && p <= k2.progress) {
      const segmentRatio = (p - k1.progress) / (k2.progress - k1.progress);
      return {
        topColor: lerpHex(k1.topColor, k2.topColor, segmentRatio),
        bottomColor: lerpHex(k1.bottomColor, k2.bottomColor, segmentRatio),
        clock: segmentRatio < 0.5 ? k1.clock : k2.clock,
        isDark: segmentRatio < 0.5 ? k1.isDark : k2.isDark,
        orbType: segmentRatio < 0.5 ? k1.orbType : k2.orbType,
        starOpacity: k1.starOpacity + (k2.starOpacity - k1.starOpacity) * segmentRatio,
      };
    }
  }

  return SKY_KEYFRAMES[0];
}
