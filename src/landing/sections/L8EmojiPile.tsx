import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { useRouteTransition } from '../../systems/RouteTransition';
import { ArrowRight, Smartphone } from 'lucide-react';
import { BRAND } from '../../config/brand';

export const L8EmojiPile: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { openApp } = useRouteTransition();
  const [hasDropped, setHasDropped] = useState(false);

  // 60 Activity emoji
  const emojiList = [
    '🏸', '⚽', '🏃', '🚴', '☕', '🎨', '🎲', '🎸', '🧘', '📸',
    '🥾', '💃', '🌊', '📖', '🏓', '🍕', '🍵', '🏏', '🧗', '🛹',
    '🎾', '🥑', '⛺', '🎭', '🥊', '🏀', '🎤', '🏕️', '🥟', '🥪',
    '🏸', '⚽', '🏃', '🚴', '☕', '🎨', '🎲', '🎸', '🧘', '📸',
    '🥾', '💃', '🌊', '📖', '🏓', '🍕', '🍵', '🏏', '🧗', '🛹',
    '🎾', '🥑', '⛺', '🎭', '🥊', '🏀', '🎤', '🏕️', '🥟', '🥪',
  ];

  const [bodies, setBodies] = useState<
    Array<{ id: number; emoji: string; x: number; y: number; angle: number }>
  >([]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof window === 'undefined') return;

    // Trigger drop when section is in view
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasDropped) {
          setHasDropped(true);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasDropped]);

  useEffect(() => {
    if (!hasDropped || !containerRef.current) return;

    const el = containerRef.current;
    const width = el.clientWidth;
    const height = el.clientHeight || 420;

    const { Engine, World, Bodies, Mouse, MouseConstraint, Runner } = Matter;
    const engine = Engine.create({ gravity: { x: 0, y: 1 } });
    const world = engine.world;

    // Boundaries
    const ground = Bodies.rectangle(width / 2, height + 30, width * 2, 60, { isStatic: true });
    const wallLeft = Bodies.rectangle(-30, height / 2, 60, height * 2, { isStatic: true });
    const wallRight = Bodies.rectangle(width + 30, height / 2, 60, height * 2, { isStatic: true });

    World.add(world, [ground, wallLeft, wallRight]);

    // Create 60 emoji physics bodies
    const emojiBodies = emojiList.map((emoji, idx) => {
      const radius = 22;
      const x = Math.random() * (width - 120) + 60;
      const y = -50 - idx * 25; // staggered drop from above
      const body = Bodies.circle(x, y, radius, {
        restitution: 0.45,
        friction: 0.2,
        density: 0.002,
      });
      (body as any).emoji = emoji;
      return body;
    });

    World.add(world, emojiBodies);

    // Mouse drag constraint
    const mouse = Mouse.create(el);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });

    World.add(world, mouseConstraint);

    const runner = Runner.create();
    Runner.run(runner, engine);

    // Sync bodies to React DOM state for 60fps positioning
    let animId: number;
    const syncPositions = () => {
      setBodies(
        emojiBodies.map((b) => ({
          id: b.id,
          emoji: (b as any).emoji,
          x: b.position.x,
          y: b.position.y,
          angle: b.angle,
        }))
      );
      animId = requestAnimationFrame(syncPositions);
    };

    animId = requestAnimationFrame(syncPositions);

    return () => {
      cancelAnimationFrame(animId);
      Runner.stop(runner);
      World.clear(world, false);
      Engine.clear(engine);
    };
  }, [hasDropped]);

  return (
    <section className="relative w-full py-28 px-6 sm:px-10 z-20 overflow-hidden text-center">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Massive Headline (clamp to ~14vw) */}
        <h2 className="text-[12vw] sm:text-[14vw] font-black font-display text-ink dark:text-white leading-[0.88] tracking-tighter select-none">
          Go outside.
        </h2>

        <p className="text-base sm:text-xl text-ink-soft max-w-lg mx-auto font-medium">
          Your free evening is waiting on the map. No algorithms deciding who you get to meet.
        </p>

        {/* Physics Emoji Pile Canvas / DOM Container */}
        <div
          ref={containerRef}
          className="relative w-full h-[320px] sm:h-[380px] rounded-3xl border border-line bg-white/20 dark:bg-night/20 backdrop-blur-sm overflow-hidden select-none"
          data-cursor="drag"
        >
          <div className="absolute top-3 left-1/2 -translate-x-1/2 text-[11px] font-bold text-ink-muted uppercase pointer-events-none">
            Drag or toss the activities
          </div>

          {/* Render Emoji as DOM elements from Matter bodies */}
          {bodies.map((b) => (
            <div
              key={b.id}
              className="absolute -ml-5 -mt-5 w-10 h-10 flex items-center justify-center font-emoji text-2xl select-none pointer-events-none cursor-grab active:cursor-grabbing"
              style={{
                transform: `translate3d(${b.x}px, ${b.y}px, 0) rotate(${b.angle}rad)`,
              }}
            >
              {b.emoji}
            </div>
          ))}
        </div>

        {/* Final Launch CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            type="button"
            onClick={(e) => openApp(e.clientX, e.clientY)}
            className="px-8 py-4 rounded-full bg-marigold hover:bg-marigold-hover text-ink font-extrabold text-base shadow-pill active:scale-95 transition-all flex items-center gap-2"
            data-cursor="open"
          >
            <span>Open the map</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
