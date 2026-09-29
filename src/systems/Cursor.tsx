import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  opacity: number;
}

export const Cursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const ringInnerRef = useRef<HTMLDivElement | null>(null);

  const [active, setActive] = useState(false);
  const [cursorState, setCursorState] = useState<{
    type: 'default' | 'link' | 'join' | 'open' | 'drag' | 'fly';
    label: string;
    isPressed: boolean;
  }>({
    type: 'default',
    label: '',
    isPressed: false,
  });

  const [particles, setParticles] = useState<Particle[]>([]);
  const particleIdRef = useRef(0);

  // Mutable animation state for 60/120fps RAF loop
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const ringVelocity = useRef({ vx: 0, vy: 0 });
  const lastTimeRef = useRef(0);
  const lastParticleTimeRef = useRef(0);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detect if primary device has touch only (no mouse)
    const isTouchOnly = 'ontouchstart' in window && !window.matchMedia('(any-hover: hover)').matches;
    if (isTouchOnly) return;

    let activated = false;

    const handlePointerMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      mousePos.current.x = x;
      mousePos.current.y = y;

      if (!activated) {
        activated = true;
        ringPos.current.x = x;
        ringPos.current.y = y;
        document.documentElement.classList.add('has-cursor');
        setActive(true);
      }

      // Direct placement of sharp center dot (zero latency)
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }

      // Velocity trail particles
      const now = performance.now();
      const dx = x - ringPos.current.x;
      const dy = y - ringPos.current.y;
      const dist = Math.hypot(dx, dy);

      if (now - lastParticleTimeRef.current > 50 && dist > 12) {
        lastParticleTimeRef.current = now;
        particleIdRef.current += 1;
        const colors = ['#FFB800', '#FF2D6C', '#00C9A7', '#FFDF00'];
        const p: Particle = {
          id: particleIdRef.current,
          x: x + (Math.random() - 0.5) * 8,
          y: y + (Math.random() - 0.5) * 8,
          vx: -dx * 0.08,
          vy: -dy * 0.08,
          color: colors[particleIdRef.current % colors.length],
          size: 4 + Math.random() * 3,
          opacity: 1,
        };
        setParticles((prev) => [...prev.slice(-14), p]);
      }
    };

    // RAF Loop for smooth physics-based follower ring
    const updatePhysics = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const dt = Math.min(32, timestamp - lastTimeRef.current) / 16.666;
      lastTimeRef.current = timestamp;

      // Spring lerp towards target mouse position
      const spring = 0.22;
      const dx = mousePos.current.x - ringPos.current.x;
      const dy = mousePos.current.y - ringPos.current.y;

      ringPos.current.x += dx * spring * dt;
      ringPos.current.y += dy * spring * dt;

      ringVelocity.current.vx = dx;
      ringVelocity.current.vy = dy;

      const speed = Math.hypot(dx, dy);
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      const stretch = Math.min(1.45, 1 + speed * 0.012);
      const squash = 1 / Math.sqrt(stretch);

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      if (ringInnerRef.current) {
        ringInnerRef.current.style.transform = `rotate(${angle}deg) scale(${stretch}, ${squash})`;
      }

      rafId.current = requestAnimationFrame(updatePhysics);
    };

    rafId.current = requestAnimationFrame(updatePhysics);

    const handlePointerOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorEl = target.closest('[data-cursor]') as HTMLElement | null;
      if (cursorEl) {
        const type = (cursorEl.getAttribute('data-cursor') || 'default') as any;
        const label =
          type === 'open'
            ? 'EXPLORE'
            : type === 'join'
            ? 'JOIN CIRCLE'
            : type === 'fly'
            ? 'FLY TO'
            : type === 'drag'
            ? 'DRAG'
            : '';
        setCursorState((s) => ({ ...s, type, label }));
      } else if (target.closest('.plan-marker-root, .plan-bubble')) {
        setCursorState((s) => ({ ...s, type: 'join', label: 'EXPLORE' }));
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

    // Click particle burst
    const handleClick = (e: MouseEvent) => {
      const colors = ['#FFB800', '#FF2D6C', '#00C9A7', '#FFF'];
      const newBurst: Particle[] = Array.from({ length: 9 }, (_, i) => {
        const angle = (i * (Math.PI * 2)) / 9 + Math.random() * 0.3;
        const speed = 2.5 + Math.random() * 3.5;
        particleIdRef.current += 1;
        return {
          id: particleIdRef.current,
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: colors[i % colors.length],
          size: 5,
          opacity: 1,
        };
      });

      setParticles((prev) => [...prev, ...newBurst]);
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => !newBurst.includes(p)));
      }, 550);
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('mouseover', handlePointerOver, { passive: true });
    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('click', handleClick);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseover', handlePointerOver);
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  if (!active) return null;

  // Custom Ring Appearance per Hover Target
  const getRingClasses = () => {
    switch (cursorState.type) {
      case 'link':
        return 'w-12 h-12 bg-amber-400/25 border-2 border-amber-400 backdrop-blur-[1px] scale-110';
      case 'join':
        return 'w-24 h-24 bg-amber-400 border-2 border-black text-black font-black shadow-[3px_3px_0px_#000] scale-105';
      case 'open':
        return 'w-24 h-24 bg-black text-white dark:bg-white dark:text-black font-black border-2 border-amber-400 shadow-xl';
      case 'fly':
        return 'w-20 h-20 bg-teal-500 text-white font-bold border-2 border-white shadow-lg';
      case 'drag':
        return 'w-16 h-16 bg-rose-500/80 text-white font-bold border-2 border-white';
      default:
        return 'w-9 h-9 border-2 border-amber-400/80 bg-amber-400/10 shadow-[0_0_12px_rgba(255,184,0,0.35)]';
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden select-none">
      {/* Physics Trailing Outer Follower Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 will-change-transform pointer-events-none"
        style={{
          transform: 'translate3d(-100px, -100px, 0)',
        }}
      >
        <div
          ref={ringInnerRef}
          className={`-ml-1/2 -mt-1/2 rounded-full flex items-center justify-center transition-[background-color,border-color,width,height] duration-200 ${getRingClasses()} ${
            cursorState.isPressed ? 'scale-75' : ''
          }`}
          style={{
            transformOrigin: 'center center',
            transform: 'translate(-50%, -50%)',
          }}
        >
          {cursorState.label && (
            <span className="text-[10px] font-black tracking-widest uppercase select-none px-2 text-center leading-none">
              {cursorState.label}
            </span>
          )}
        </div>
      </div>

      {/* Immediate Zero-Latency Center Reticle Dot */}
      {cursorState.type !== 'join' && cursorState.type !== 'open' && (
        <div
          ref={dotRef}
          className="fixed top-0 left-0 -ml-[5px] -mt-[5px] w-2.5 h-2.5 rounded-full bg-amber-400 border border-black shadow-[0_0_10px_#FFB800] will-change-transform pointer-events-none"
          style={{
            transform: 'translate3d(-100px, -100px, 0)',
          }}
        />
      )}

      {/* Trailing Luminous Particle Sparks */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="fixed rounded-full pointer-events-none animate-ping"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            boxShadow: `0 0 8px ${p.color}`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  );
};
