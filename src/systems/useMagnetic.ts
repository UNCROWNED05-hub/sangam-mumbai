import { useEffect, RefObject } from 'react';
import { gsap } from 'gsap';

interface MagneticOptions {
  strength?: number;
  radius?: number;
  maxDisplacement?: number;
}

export function useMagnetic(
  ref: RefObject<HTMLElement | null>,
  options: MagneticOptions = {}
) {
  const { strength = 0.35, radius = 90, maxDisplacement = 12 } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === 'undefined') return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const quickX = gsap.quickTo(el, 'x', { duration: 0.3, ease: 'power3.out' });
    const quickY = gsap.quickTo(el, 'y', { duration: 0.3, ease: 'power3.out' });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < radius) {
        const pullFactor = (1 - dist / radius) * strength;
        const targetX = Math.max(-maxDisplacement, Math.min(maxDisplacement, dx * pullFactor));
        const targetY = Math.max(-maxDisplacement, Math.min(maxDisplacement, dy * pullFactor));
        quickX(targetX);
        quickY(targetY);
      } else {
        quickX(0);
        quickY(0);
      }
    };

    const handleMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.4)',
        overwrite: 'auto',
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [ref, strength, radius, maxDisplacement]);
}
