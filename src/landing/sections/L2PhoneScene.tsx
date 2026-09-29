import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PhoneFrame } from '../../ui/PhoneFrame';
import { StaticMap } from '../../ui/StaticMap';
import { AvatarStack } from '../../ui/AvatarStack';
import { PEOPLE, CURRENT_USER } from '../../data/people';
import { Check, Send } from 'lucide-react';
import confetti from 'canvas-confetti';

gsap.registerPlugin(ScrollTrigger);

export const L2PhoneScene: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const phoneWrapperRef = useRef<HTMLDivElement | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [joinedInPhone, setJoinedInPhone] = useState(false);
  const [phoneTilt, setPhoneTilt] = useState({ x: 0, y: 0 });

  // Mouse tilt on the phone
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setPhoneTilt({ x: x * 10, y: y * -10 });
  };

  const handleMouseLeave = () => {
    setPhoneTilt({ x: 0, y: 0 });
  };

  // ScrollTrigger to pin phone scene and advance step index 0, 1, 2
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || window.innerWidth < 1024) return;

    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: '+=240%',
      pin: true,
      scrub: 0.6,
      anticipatePin: 1,
      onUpdate: (self) => {
        const p = self.progress;
        if (p < 0.33) {
          setActiveStep(0);
          setJoinedInPhone(false);
        } else if (p < 0.68) {
          setActiveStep(1);
          if (p > 0.52 && !joinedInPhone) {
            setJoinedInPhone(true);
            confetti({ particleCount: 30, spread: 45, origin: { x: 0.7, y: 0.6 } });
          }
        } else {
          setActiveStep(2);
        }
      },
    });

    return () => st.kill();
  }, [joinedInPhone]);

  const steps = [
    {
      num: '01',
      title: 'Open the map.',
      desc: 'Bubbles are plans happening near you today. See what is kicking off right now or later this evening.',
    },
    {
      num: '02',
      title: 'Pick one.',
      desc: "Check who's in, where it's happening, then hit join. Real names, verified faces, zero followers.",
    },
    {
      num: '03',
      title: 'Say hi first.',
      desc: 'The group chat opens immediately so you can coordinate, ask questions, or just say see you at 7.',
    },
  ];

  // StaticMap pins for phone demo
  const demoPins = [
    { x: 260, y: 160, emoji: '🏸', label: '4' },
    { x: 380, y: 120, emoji: '☕', label: '6', isSponsored: true },
    { x: 290, y: 240, emoji: '🎲', label: '3' },
    { x: 340, y: 310, emoji: '🎸', label: '8' },
    { x: 440, y: 220, emoji: '🏃', label: '5' },
    { x: 220, y: 280, emoji: '🧘', label: '7' },
  ];

  const planMembers = joinedInPhone
    ? [CURRENT_USER, PEOPLE[1], PEOPLE[2], PEOPLE[3], PEOPLE[4], PEOPLE[5]]
    : [PEOPLE[1], PEOPLE[2], PEOPLE[3], PEOPLE[4]];

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen w-full flex items-center justify-center py-20 px-6 sm:px-10 z-20"
    >
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: 3-Step Narrative Copy */}
        <div className="lg:col-span-6 space-y-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-marigold block mb-2 font-mono">
              Simple. Direct. Public.
            </span>
            <h2 className="text-4xl sm:text-6xl font-black font-display text-ink dark:text-white leading-[0.95] tracking-tight">
              Map, tap, go.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-ink-soft max-w-md">
              No invite. No approval. You see who’s going before you tap.
            </p>
          </div>

          {/* Stepper with animated vertical progress indicator */}
          <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-line">
            {/* Animated filling bar */}
            <motion.div
              className="absolute left-3 top-2 w-[2px] bg-marigold origin-top transition-all duration-300"
              style={{
                height: `${((activeStep + 1) / steps.length) * 90}%`,
              }}
            />

            {steps.map((st, idx) => {
              const isActive = activeStep === idx;
              return (
                <div
                  key={st.num}
                  onClick={() => setActiveStep(idx)}
                  className={`relative cursor-pointer transition-all ${
                    isActive ? 'opacity-100 translate-x-1' : 'opacity-40 hover:opacity-70'
                  }`}
                >
                  <span
                    className={`absolute -left-[30px] top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                      isActive ? 'bg-marigold text-ink ring-4 ring-marigold/20' : 'bg-line text-ink-muted'
                    }`}
                  >
                    {idx + 1}
                  </span>

                  <h3 className="text-xl font-bold font-display text-ink dark:text-white">
                    {st.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-ink-soft mt-1 leading-relaxed max-w-sm">
                    {st.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Reactive Phone Frame with Real React Screens */}
        <div className="lg:col-span-6 flex justify-center perspective-1000">
          <motion.div
            ref={phoneWrapperRef}
            animate={{
              rotateY: phoneTilt.x,
              rotateX: phoneTilt.y,
              y: [0, -6, 0],
            }}
            transition={{
              rotateY: { type: 'spring', stiffness: 200, damping: 25 },
              rotateX: { type: 'spring', stiffness: 200, damping: 25 },
              y: { repeat: Infinity, duration: 6, ease: 'easeInOut' },
            }}
            className="w-full flex justify-center"
          >
            <PhoneFrame>
              {/* Screen A: Map with bubbles (Step 0) */}
              {activeStep === 0 && (
                <motion.div
                  key="screen-a"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full relative"
                >
                  <StaticMap pins={demoPins} />
                  <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-white/90 dark:bg-night/90 backdrop-blur-md border border-line text-center shadow-soft">
                    <span className="text-xs font-bold text-ink dark:text-white">
                      6 plans around Bandra right now
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Screen B: Plan Sheet Slide-up & Tap to Join (Step 1) */}
              {activeStep === 1 && (
                <motion.div
                  key="screen-b"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full relative flex flex-col justify-end"
                >
                  <StaticMap pins={demoPins} />

                  {/* Plan Card sliding up */}
                  <motion.div
                    initial={{ y: 200 }}
                    animate={{ y: 0 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 36 }}
                    className="relative z-10 p-5 rounded-t-3xl bg-white dark:bg-night border-t border-line shadow-ambient space-y-3"
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold text-ink-muted">
                      <span className="text-marigold font-mono">Starts in 10m</span>
                      <span>Public Court</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-emoji">🏸</span>
                      <div>
                        <h4 className="text-sm font-bold text-ink dark:text-white leading-tight">
                          Badminton doubles, need two more
                        </h4>
                        <span className="text-[10px] text-ink-soft">Hosted by Rohan V.</span>
                      </div>
                    </div>

                    {/* Member Stack */}
                    <div className="flex items-center justify-between pt-1">
                      <AvatarStack people={planMembers} size="sm" />
                      <span className="text-xs font-bold text-ink-soft">
                        {joinedInPhone ? '5 going' : '4 going'}
                      </span>
                    </div>

                    {/* Animated Join Button */}
                    <button
                      type="button"
                      onClick={() => setJoinedInPhone(!joinedInPhone)}
                      className={`w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                        joinedInPhone
                          ? 'bg-lagoon text-white shadow-soft'
                          : 'bg-marigold text-ink shadow-pill hover:bg-marigold-hover'
                      }`}
                    >
                      {joinedInPhone ? (
                        <>
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>Joined • Chat is open</span>
                        </>
                      ) : (
                        <span>Join — 4 going</span>
                      )}
                    </button>
                  </motion.div>
                </motion.div>
              )}

              {/* Screen C: Live Group Chat (Step 2) */}
              {activeStep === 2 && (
                <motion.div
                  key="screen-c"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full flex flex-col justify-between p-4 bg-paper dark:bg-night"
                >
                  {/* Chat Header */}
                  <div className="flex items-center gap-2 pb-3 border-b border-line">
                    <span className="text-xl font-emoji">🏸</span>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-ink dark:text-white truncate">
                        Badminton doubles
                      </h4>
                      <span className="text-[10px] text-lagoon font-semibold">5 online now</span>
                    </div>
                  </div>

                  {/* Messages Flow */}
                  <div className="space-y-2.5 my-auto text-xs">
                    <div className="p-2.5 rounded-2xl rounded-tl-sm bg-line/20 text-ink dark:text-white max-w-[85%] self-start">
                      <span className="text-[9px] font-bold block text-ink-muted">Rohan V.</span>
                      Court 2 confirmed! Bringing 3 spare shuttles.
                    </div>

                    <div className="p-2.5 rounded-2xl rounded-tl-sm bg-line/20 text-ink dark:text-white max-w-[85%] self-start">
                      <span className="text-[9px] font-bold block text-ink-muted">Varun K.</span>
                      Just reached the gate. Wearing blue jersey.
                    </div>

                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="p-2.5 rounded-2xl rounded-tr-sm bg-marigold text-ink font-semibold max-w-[85%] ml-auto text-right"
                    >
                      See you at 7! Walking in now.
                    </motion.div>

                    {/* Typing dots */}
                    <div className="flex items-center gap-1 p-2 rounded-full bg-line/10 w-fit">
                      <span className="w-1.5 h-1.5 rounded-full bg-ink-muted animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-ink-muted animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-ink-muted animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>

                  {/* Fake Chat Composer */}
                  <div className="flex items-center gap-2 pt-2 border-t border-line">
                    <input
                      type="text"
                      readOnly
                      placeholder="Message plan group..."
                      className="flex-1 px-3 py-1.5 rounded-xl bg-line/10 text-xs text-ink dark:text-white outline-none"
                    />
                    <div className="p-2 rounded-xl bg-marigold text-ink">
                      <Send className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </motion.div>
              )}
            </PhoneFrame>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
