import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  id: number;
}

export const Cursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const [cursorState, setCursorState] = useState<{
    type: 'default' | 'link' | 'drag' | 'join' | 'open' | 'pause';
    label: string;
    isPressed: boolean;
  }>({
    type: 'default',
    label: '',
    isPressed: false,
  });

  const [particles, setParticles] = useState<Particle[]>([]);
  const particleIdRef = useRef(0);
  const [active, setActive] = useState(false);

  useEffect(() => {
    // Only mount on fine pointer with hover
    if (typeof window === 'undefined') return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.documentElement.classList.add('has-cursor');
    setActive(true);

    // quickTo setters
    const setDotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power2.out' });
    const setDotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power2.out' });
    const setRingX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' });
    const setRingY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' });

    let lastX = 0;
    let lastY = 0;

    const handlePointerMove = (e: PointerEvent) => {
      const { clientX: x, clientY: y } = e;
      setDotX(x);
      setDotY(y);
      setRingX(x);
      setRingY(y);

      // Velocity & angle calculation for velocity stretch
      const dx = x - lastX;
      const dy = y - lastY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      if (dist > 3) {
        const stretch = Math.min(1.35, 1 + dist * 0.015);
        gsap.to(ring, {
          rotation: angle,
          scaleX: stretch,
          scaleY: 1 / Math.sqrt(stretch),
          duration: 0.15,
          overwrite: 'auto',
        });
      } else {
        gsap.to(ring, {
          scaleX: 1,
          scaleY: 1,
          duration: 0.25,
          overwrite: 'auto',
        });
      }

      lastX = x;
      lastY = y;
    };

    const handlePointerOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorEl = target.closest('[data-cursor]') as HTMLElement | null;
      if (cursorEl) {
        const type = (cursorEl.getAttribute('data-cursor') || 'default') as
          | 'default'
          | 'link'
          | 'drag'
          | 'join'
          | 'open'
          | 'pause';
        const label =
          type === 'drag'
            ? 'drag'
            : type === 'join'
            ? 'join'
            : type === 'open'
            ? 'open'
            : type === 'pause'
            ? 'pause'
            : '';
        setCursorState((s) => ({ ...s, type, label }));
      } else if (target.closest('button, a, [role="button"], input[type="submit"]')) {
        setCursorState((s) => ({ ...s, type: 'link', label: '' }));
      } else {
        setCursorState((s) => ({ ...s, type: 'default', label: '' }));
      }
    };

    const handlePointerDown = () => {
      setCursorState((s) => ({ ...s, isPressed: true }));
    };

    const handlePointerUp = () => {
      setCursorState((s) => ({ ...s, isPressed: false }));
    };

    // Click burst particles on interactive elements
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target || !target.closest('button, a, [role="button"], [data-cursor]')) return;

      const colors = ['#FFC21A', '#FF3D7F', '#10B5A5', '#FFFFFF'];
      const newBurst: Particle[] = Array.from({ length: 8 }, () => {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 4;
        particleIdRef.current += 1;
        return {
          id: particleIdRef.current,
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: colors[Math.floor(Math.random() * colors.length)],
        };
      });

      setParticles((prev) => [...prev, ...newBurst]);

      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => !newBurst.includes(p)));
      }, 500);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerover', handlePointerOver, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('click', handleClick);

    return () => {
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerover', handlePointerOver);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  if (!active) return null;

  // Compute ring styling by cursor type
  const getRingDimensions = () => {
    switch (cursorState.type) {
      case 'link':
        return 'w-14 h-14 bg-marigold/25 border-transparent';
      case 'drag':
        return 'w-20 h-20 bg-marigold border-transparent text-ink font-semibold';
      case 'join':
        return 'w-24 h-24 bg-marigold border-transparent text-ink font-bold shadow-marigold-glow';
      case 'open':
        return 'w-20 h-20 bg-ink dark:bg-white text-white dark:text-ink font-bold border-transparent';
      case 'pause':
        return 'w-18 h-18 border-2 border-marigold bg-marigold/10 text-white font-bold';
      default:
        return 'w-8 h-8 border border-current bg-transparent';
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden select-none">
      {/* Follower Ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 -ml-4 -mt-4 rounded-full flex items-center justify-center transition-[background-color,border-color,width,height] duration-200 text-xs ${getRingDimensions()} ${
          cursorState.isPressed ? 'scale-85' : 'scale-100'
        }`}
        style={{
          transform: 'translate3d(-100px, -100px, 0)',
        }}
      >
        {cursorState.label && (
          <span className="text-[11px] font-bold tracking-tight uppercase select-none pointer-events-none">
            {cursorState.label}
          </span>
        )}
      </div>

      {/* Center 6px Sharp Dot */}
      {cursorState.type !== 'link' && cursorState.type !== 'join' && cursorState.type !== 'drag' && (
        <div
          ref={dotRef}
          className="fixed top-0 left-0 -ml-[3px] -mt-[3px] w-1.5 h-1.5 rounded-full bg-current shadow-sm"
          style={{
            transform: 'translate3d(-100px, -100px, 0)',
          }}
        />
      )}

      {/* Particle Click Burst */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="fixed rounded-full pointer-events-none animate-ping"
          style={{
            left: p.x,
            top: p.y,
            width: 4,
            height: 4,
            backgroundColor: p.color,
            animationDuration: '500ms',
          }}
        />
      ))}
    </div>
  );
};
