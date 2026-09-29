import React from 'react';
import { motion } from 'framer-motion';
import { useHealthStore } from '../../store/useHealthStore';
import { TimeOfDay } from '../../types';

export const AmbientCircadianBg: React.FC = () => {
  const timeOfDay = useHealthStore((s) => s.timeOfDay);
  const turboMode = useHealthStore((s) => s.turboMode);

  // Compute effective time of day if 'realtime'
  const getEffectiveTime = (): 'dawn' | 'noon' | 'sunset' | 'midnight' => {
    if (timeOfDay !== 'realtime') return timeOfDay as 'dawn' | 'noon' | 'sunset' | 'midnight';
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return 'dawn';
    if (hour >= 11 && hour < 17) return 'noon';
    if (hour >= 17 && hour < 21) return 'sunset';
    return 'midnight';
  };

  const effective = getEffectiveTime();

  // Gradient aura colors by time
  const getGradientTheme = () => {
    if (turboMode) {
      return {
        radial1: 'rgba(234, 179, 8, 0.25)', // Gold
        radial2: 'rgba(249, 115, 22, 0.20)', // Amber Orange
        accentBeam: 'rgba(234, 179, 8, 0.15)',
      };
    }
    switch (effective) {
      case 'dawn':
        return {
          radial1: 'rgba(244, 63, 94, 0.18)', // Rose
          radial2: 'rgba(168, 85, 247, 0.22)', // Violet
          accentBeam: 'rgba(251, 146, 60, 0.12)', // Peach
        };
      case 'noon':
        return {
          radial1: 'rgba(6, 182, 212, 0.22)', // Cyan
          radial2: 'rgba(59, 130, 246, 0.20)', // Blue
          accentBeam: 'rgba(16, 185, 129, 0.14)', // Emerald
        };
      case 'sunset':
        return {
          radial1: 'rgba(245, 158, 11, 0.22)', // Amber
          radial2: 'rgba(217, 70, 239, 0.20)', // Magenta
          accentBeam: 'rgba(244, 63, 94, 0.15)', // Coral
        };
      case 'midnight':
      default:
        return {
          radial1: 'rgba(139, 92, 246, 0.20)', // Deep Purple
          radial2: 'rgba(30, 58, 138, 0.35)', // Dark Navy
          accentBeam: 'rgba(99, 102, 241, 0.15)', // Indigo
        };
    }
  };

  const theme = getGradientTheme();

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 transition-colors duration-1000">
      {/* Background base mesh */}
      <div className="absolute inset-0 bg-migo-bg transition-colors duration-1000" />

      {/* Subtle Dot Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40" />

      {/* Floating Ambient Mesh Orb 1 (Top Left) */}
      <motion.div
        animate={{
          x: [0, 60, -40, 0],
          y: [0, -50, 40, 0],
          scale: [1, 1.25, 0.95, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          background: `radial-gradient(circle, ${theme.radial1} 0%, transparent 70%)`,
        }}
        className="absolute -top-[15%] -left-[10%] w-[65vw] h-[65vw] rounded-full blur-[90px] opacity-75"
      />

      {/* Floating Ambient Mesh Orb 2 (Right Mid) */}
      <motion.div
        animate={{
          x: [0, -70, 50, 0],
          y: [0, 60, -50, 0],
          scale: [1, 1.15, 1.2, 1],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          background: `radial-gradient(circle, ${theme.radial2} 0%, transparent 70%)`,
        }}
        className="absolute top-[25%] -right-[15%] w-[60vw] h-[60vw] rounded-full blur-[100px] opacity-70"
      />

      {/* Bottom Subtle Glow */}
      <motion.div
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          background: `radial-gradient(circle, ${theme.accentBeam} 0%, transparent 80%)`,
        }}
        className="absolute -bottom-[20%] left-[20%] w-[70vw] h-[50vw] rounded-full blur-[120px]"
      />
    </div>
  );
};
