import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { StaticMap } from '../../ui/StaticMap';
import { BRAND } from '../../config/brand';
import { Avatar } from '../../ui/Avatar';
import { PEOPLE } from '../../data/people';

gsap.registerPlugin(ScrollTrigger);

export const L3ClockScene: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [clockAngle, setClockAngle] = useState(204); // 6:48pm is ~204 deg
  const [activeRowIndex, setActiveRowIndex] = useState(0);

  const feedRows = [
    { time: '6:48 pm', text: 'Free evening. You open the feed.' },
    { time: '7:30 pm', text: 'Forty minutes in. Somebody else’s dinner.' },
    { time: '8:40 pm', text: 'Saved three reels. Going to none.' },
    { time: '10:05 pm', text: 'Screen dims. Same couch.' },
    { time: '11:50 pm', text: 'Nobody showed up.' },
  ];

  const sangamRows = [
    { time: '6:48 pm', text: 'Free evening. You open the map.' },
    { time: '7:30 pm', text: 'Four plans within a ten-minute walk. You join badminton.' },
    { time: '8:40 pm', text: 'The court. Four strangers, one shuttle.' },
    { time: '10:05 pm', text: 'Chai after. Numbers swapped.' },
    { time: '11:50 pm', text: 'Four of you showed up.' },
  ];

  // Pinned clock scrub
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || window.innerWidth < 1024) return;

    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: '+=200%',
      pin: true,
      scrub: 0.8,
      anticipatePin: 1,
      onUpdate: (self) => {
        const p = self.progress;
        // Sweep clock hands from 6:48 pm (~204 deg) to 11:50 pm (~355 deg)
        const angle = 204 + p * 151;
        setClockAngle(angle);

        // Active row index (0 to 4)
        const rIndex = Math.min(4, Math.floor(p * 5));
        setActiveRowIndex(rIndex);
      },
    });

    return () => st.kill();
  }, []);

  // Converging route coordinates on StaticMap
  const convergingRoute = [
    { x: 220, y: 160 },
    { x: 280, y: 210 },
    { x: 330, y: 220 },
    { x: 350, y: 220 }, // the badminton court
  ];

  const courtAvatars = [PEOPLE[0], PEOPLE[1], PEOPLE[2], PEOPLE[3]];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full flex flex-col justify-between py-16 px-6 sm:px-10 z-20"
    >
      <div className="w-full max-w-6xl mx-auto flex-1 flex flex-col justify-center space-y-12">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-bougainvillea block mb-1 font-mono">
            Two Versions of Tonight
          </span>
          <h2 className="text-4xl sm:text-5xl font-black font-display text-ink dark:text-white tracking-tight">
            How will you spend tonight?
          </h2>
        </div>

        {/* Centered Clock Dial + Dual Column Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Column: On a Feed */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="font-display font-extrabold text-lg text-ink-muted flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              On a feed
            </h3>

            <div className="space-y-3">
              {feedRows.map((row, idx) => {
                const isPassed = activeRowIndex >= idx;
                const isCurrent = activeRowIndex === idx;

                return (
                  <motion.div
                    key={row.time}
                    animate={{
                      opacity: isPassed ? (idx === 4 ? 0.4 : 0.6) : 0.2,
                      scale: isCurrent ? 1.02 : 1,
                    }}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      idx === 4 && isPassed
                        ? 'border-slate-500/30 bg-slate-900/10 dark:bg-black/30'
                        : 'border-line bg-white/30 dark:bg-night/30'
                    }`}
                  >
                    <span className="text-[11px] font-mono font-bold text-ink-muted block mb-0.5">
                      {row.time}
                    </span>
                    <p className={`text-xs sm:text-sm ${idx === 4 ? 'font-bold line-through text-ink-muted' : 'text-ink-soft'}`}>
                      {row.text}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Center Column: Interactive Sweeping Clock & Mini Converging Map */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center my-4 lg:my-0 space-y-4">
            {/* SVG Clock Dial */}
            <div className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-full border-4 border-line bg-white/60 dark:bg-night/60 backdrop-blur-md shadow-ambient flex items-center justify-center">
              <svg className="w-full h-full p-4" viewBox="0 0 100 100">
                {/* Clock face ticks */}
                {Array.from({ length: 12 }).map((_, i) => (
                  <line
                    key={i}
                    x1="50"
                    y1="8"
                    x2="50"
                    y2="14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    transform={`rotate(${i * 30} 50 50)`}
                    className="text-ink-muted"
                  />
                ))}

                {/* Clock Center Hub */}
                <circle cx="50" cy="50" r="3.5" fill="#FFC21A" />

                {/* Hour Hand */}
                <line
                  x1="50"
                  y1="50"
                  x2="50"
                  y2="28"
                  stroke="#FFC21A"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  transform={`rotate(${clockAngle} 50 50)`}
                />

                {/* Minute Hand */}
                <line
                  x1="50"
                  y1="50"
                  x2="50"
                  y2="18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  transform={`rotate(${clockAngle * 12} 50 50)`}
                  className="text-ink dark:text-white"
                />
              </svg>

              <span className="absolute bottom-4 text-[10px] font-mono font-bold text-ink-muted uppercase">
                Tonight
              </span>
            </div>

            {/* StaticMap preview with converging dotted route */}
            <div className="w-full h-32 rounded-2xl overflow-hidden border border-line shadow-soft relative">
              <StaticMap dottedRoute={convergingRoute} />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white/80 dark:bg-night/80 text-[10px] font-bold text-lagoon">
                Court 2 • Converging
              </div>
            </div>
          </div>

          {/* Right Column: On Sangam */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="font-display font-extrabold text-lg text-lagoon flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-lagoon animate-ping" />
              On {BRAND.name}
            </h3>

            <div className="space-y-3">
              {sangamRows.map((row, idx) => {
                const isPassed = activeRowIndex >= idx;
                const isCurrent = activeRowIndex === idx;

                return (
                  <motion.div
                    key={row.time}
                    animate={{
                      opacity: isPassed ? 1 : 0.25,
                      scale: isCurrent ? 1.03 : 1,
                    }}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      idx === 4 && isPassed
                        ? 'border-lagoon bg-lagoon/15 shadow-soft'
                        : isCurrent
                        ? 'border-marigold bg-marigold/10'
                        : 'border-line bg-white/50 dark:bg-night/50'
                    }`}
                  >
                    <span className="text-[11px] font-mono font-bold text-lagoon block mb-0.5">
                      {row.time}
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-ink dark:text-white">
                      {row.text}
                    </p>

                    {/* Final row: 4 avatars popping in */}
                    {idx === 4 && isPassed && (
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-lagoon/30">
                        <div className="flex -space-x-2">
                          {courtAvatars.map((person) => (
                            <Avatar key={person.id} person={person} size="sm" showVerified={false} />
                          ))}
                        </div>
                        <span className="text-[11px] font-bold text-lagoon">
                          Real people in real places.
                        </span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Finale Line */}
        <div className="text-center pt-8 border-t border-line">
          <p className="text-2xl sm:text-4xl lg:text-5xl font-black font-display text-ink dark:text-white tracking-tight max-w-3xl mx-auto leading-tight">
            “Only one of these was an evening you were in.”
          </p>
        </div>
      </div>
    </section>
  );
};
