import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { useHealthStore } from '../../store/useHealthStore';

export const CustomCursor: React.FC = () => {
  const customCursorEnabled = useHealthStore((s) => s.user.customCursor);
  const reducedMotion = useHealthStore((s) => s.user.reducedMotion);

  const [cursorText, setCursorText] = useState('');
  const [cursorVariant, setCursorVariant] = useState<'default' | 'pointer' | 'text' | 'grab' | 'cta' | 'hidden'>('default');
  const [trail, setTrail] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Motion values for smooth 60fps+ tracking
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Magnetic spring physics for follower
  const springConfig = { damping: 28, stiffness: 350, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const trailIdRef = useRef(0);

  useEffect(() => {
    // Check if device supports touch only
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true);
      return;
    }

    if (!customCursorEnabled || reducedMotion) {
      document.body.classList.remove('custom-cursor-active');
      return;
    }

    document.body.classList.add('custom-cursor-active');

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      // Add to particle trail (every few frames)
      if (Math.random() > 0.4) {
        trailIdRef.current += 1;
        setTrail((prev) => [
          ...prev.slice(-6),
          { x: e.clientX, y: e.clientY, id: trailIdRef.current },
        ]);
      }

      // Check target element for custom interactions
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest('button, a, input, select, textarea, [data-interactive="true"]');
      const cta = target.closest('[data-cursor-cta]');
      const draggable = target.closest('[data-draggable="true"]');
      const isText = target.closest('p, h1, h2, h3, span, blockquote') && !interactive;

      if (cta) {
        setCursorVariant('cta');
        setCursorText(cta.getAttribute('data-cursor-cta') || 'Explore');
      } else if (draggable) {
        setCursorVariant('grab');
        setCursorText('');
      } else if (interactive) {
        setCursorVariant('pointer');
        setCursorText('');
      } else if (isText) {
        setCursorVariant('text');
        setCursorText('');
      } else {
        setCursorVariant('default');
        setCursorText('');
      }
    };

    const handleMouseLeave = () => {
      setCursorVariant('hidden');
    };

    const handleMouseEnter = () => {
      setCursorVariant('default');
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [customCursorEnabled, reducedMotion, mouseX, mouseY]);

  if (isTouchDevice || !customCursorEnabled || reducedMotion) {
    return null;
  }

  // Variant dimensions & styling
  const getCursorStyles = () => {
    switch (cursorVariant) {
      case 'pointer':
        return {
          width: 52,
          height: 52,
          backgroundColor: 'rgba(139, 92, 246, 0.25)',
          borderColor: 'rgba(139, 92, 246, 0.9)',
          borderWidth: 2,
        };
      case 'cta':
        return {
          width: 90,
          height: 38,
          borderRadius: 24,
          backgroundColor: 'rgba(139, 92, 246, 0.9)',
          borderColor: 'rgba(255, 255, 255, 0.8)',
          borderWidth: 1,
        };
      case 'grab':
        return {
          width: 44,
          height: 44,
          backgroundColor: 'rgba(6, 182, 212, 0.3)',
          borderColor: 'rgba(6, 182, 212, 0.9)',
          borderWidth: 2,
        };
      case 'text':
        return {
          width: 4,
          height: 24,
          borderRadius: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderColor: 'transparent',
          borderWidth: 0,
        };
      case 'hidden':
        return {
          opacity: 0,
          scale: 0,
        };
      default:
        return {
          width: 32,
          height: 32,
          backgroundColor: 'rgba(139, 92, 246, 0.15)',
          borderColor: 'rgba(139, 92, 246, 0.6)',
          borderWidth: 1.5,
        };
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden">
      {/* Particle trail with physics decay */}
      {trail.map((t, index) => {
        const opacity = (index + 1) / trail.length * 0.35;
        const scale = (index + 1) / trail.length * 0.6;
        return (
          <motion.div
            key={t.id}
            initial={{ opacity, scale }}
            animate={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="absolute rounded-full bg-migo-purple-light pointer-events-none blur-[1px]"
            style={{
              left: t.x - 3,
              top: t.y - 3,
              width: 6,
              height: 6,
            }}
          />
        );
      })}

      {/* Secondary Lagging Orb (Follower) */}
      <motion.div
        className="absolute rounded-full pointer-events-none border border-migo-purple/30 backdrop-blur-[1px] flex items-center justify-center transition-colors duration-200"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={getCursorStyles()}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        {cursorText && (
          <span className="text-[11px] font-semibold text-white tracking-wider uppercase px-2 select-none">
            {cursorText}
          </span>
        )}
      </motion.div>

      {/* Primary Sharp Focal Center Dot */}
      <motion.div
        className="absolute w-2 h-2 rounded-full bg-white shadow-[0_0_10px_#8b5cf6] pointer-events-none"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: cursorVariant === 'pointer' ? 0.5 : cursorVariant === 'text' ? 0 : 1,
        }}
      />
    </div>
  );
};
