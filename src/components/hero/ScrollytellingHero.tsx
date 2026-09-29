import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { soundFx } from '../../utils/sound';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  Heart,
  ChevronDown,
  Layers,
  Compass,
  CheckCircle2,
  TrendingUp,
  Cpu
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ScrollytellingHeroProps {
  onEnterDashboard: () => void;
}

export const ScrollytellingHero: React.FC<ScrollytellingHeroProps> = ({ onEnterDashboard }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const section1Ref = useRef<HTMLDivElement | null>(null);
  const section2Ref = useRef<HTMLDivElement | null>(null);
  const section3Ref = useRef<HTMLDivElement | null>(null);

  const [activeStoryStep, setActiveStoryStep] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  // GSAP ScrollTrigger Sequence for Scrollytelling
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Animate SVG Path Drawing on scroll
      if (pathRef.current) {
        const length = pathRef.current.getTotalLength();
        gsap.set(pathRef.current, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });

        gsap.to(pathRef.current, {
          strokeDashoffset: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1.5,
          },
        });
      }

      // 2. Parallax layers with varying speeds
      gsap.to('.parallax-layer-slow', {
        y: -60,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.to('.parallax-layer-medium', {
        y: -140,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.to('.parallax-layer-fast', {
        y: -220,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const storySteps = [
    {
      title: 'Continuous Biosensor Telemetry',
      subtitle: 'Sub-millimeter enzyme micro-needles capturing 1,440 data points every 24 hours with 8.9% MARD precision.',
      metric: '100% Signal Integrity',
      icon: <Activity className="w-5 h-5 text-emerald-400" />,
      color: '#10b981',
      delta: '118 mg/dL Baseline',
    },
    {
      title: 'Predictive Neural Glycemic Curves',
      subtitle: 'Forecasting post-prandial glycemic excursions 45 minutes ahead of food digestion using deep recurrent models.',
      metric: '98.4% Accuracy',
      icon: <Zap className="w-5 h-5 text-migo-purple-light" />,
      color: '#8b5cf6',
      delta: 'Prevents 100% Spikes',
    },
    {
      title: 'Autonomous Circadian Alignment',
      subtitle: 'Harmonizing dietary carbs, physical GLUT4 movement, and deep REM recovery into metabolic synergy.',
      metric: 'Metabolic Score: 96',
      icon: <Heart className="w-5 h-5 text-cyan-400" />,
      color: '#06b6d4',
      delta: 'Optimal Homeostasis',
    }
  ];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative space-y-12 my-4"
    >
      {/* SECTION 1: HERO OVERVIEW & 3D TILT MOCKUP */}
      <div className="relative min-h-[90vh] flex flex-col justify-between py-12 px-6 md:px-10 overflow-hidden rounded-3xl glass-panel-glow border border-white/[0.08] shadow-glass">
        {/* Parallax Layer: Slow Deep Ambient Orbs */}
        <div className="parallax-layer-slow absolute -top-16 -right-16 w-[480px] h-[480px] bg-purple-600/15 rounded-full blur-[110px] pointer-events-none" />
        <div className="parallax-layer-medium absolute -bottom-20 -left-20 w-[420px] h-[420px] bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none" />

        {/* Top Tag Header */}
        <div className="flex items-center justify-between relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.1] backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-semibold text-slate-200">
              MigoX 3.0 • Continuous Metabolic Intelligence
            </span>
          </motion.div>

          <button
            onClick={() => {
              soundFx.playTap(900);
              onEnterDashboard();
            }}
            className="text-xs text-migo-purple-light hover:text-white transition-colors underline font-medium"
          >
            Jump Directly to Live Telemetry →
          </button>
        </div>

        {/* Main Stage Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto relative z-10 py-6">
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display text-white tracking-tight leading-[1.1]">
                A 100x Leap in <br />
                <span className="bg-gradient-to-r from-migo-purple via-indigo-400 to-migo-cyan bg-clip-text text-transparent">
                  Metabolic Biology
                </span>
              </h1>
              <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
                Experience continuous, autonomous metabolic intelligence.
                Engineered with real-time sound sonification, zero-jank 120 FPS transitions, and predictive glycemic guidance.
              </p>
            </motion.div>

            {/* Interactive Chapter Selector */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Interactive Chapters (Click to scrub narrative)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {storySteps.map((step, idx) => {
                  const isActive = activeStoryStep === idx;
                  return (
                    <motion.button
                      key={step.title}
                      type="button"
                      onClick={() => {
                        setActiveStoryStep(idx);
                        soundFx.playTap(700 + idx * 120);
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-3 rounded-2xl text-left border transition-all ${
                        isActive
                          ? 'bg-migo-purple/20 border-migo-purple shadow-neon-purple'
                          : 'glass-panel-subtle border-white/[0.08] hover:border-white/[0.2]'
                      }`}
                      data-interactive="true"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="p-1 rounded-lg bg-white/[0.08]">{step.icon}</div>
                        <span className="text-xs font-bold text-white truncate">{step.title}</span>
                      </div>
                      <span className="text-[11px] font-mono text-emerald-400 font-bold block">
                        {step.metric}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              <motion.div
                key={activeStoryStep}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-xl bg-slate-900/70 border border-white/[0.08] text-xs text-slate-300 flex items-center justify-between"
              >
                <span>{storySteps[activeStoryStep].subtitle}</span>
                <span className="text-[11px] font-mono text-migo-purple-light font-bold px-2 py-0.5 rounded bg-migo-purple/20 ml-2 whitespace-nowrap">
                  {storySteps[activeStoryStep].delta}
                </span>
              </motion.div>
            </div>

            {/* Launch CTA */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <motion.button
                onClick={() => {
                  soundFx.playSuccess();
                  onEnterDashboard();
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-migo-purple via-indigo-600 to-migo-cyan text-white font-bold text-base shadow-neon-purple flex items-center gap-3 transition-all cursor-pointer group"
                data-interactive="true"
                data-cursor-cta="Enter App"
              >
                <span>Open Live Dashboard</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </motion.button>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Full Offline Sandbox • Zero Setup Required</span>
              </div>
            </div>
          </div>

          {/* Right 3D Sensor Card */}
          <div className="lg:col-span-5 flex justify-center perspective-1000">
            <motion.div
              style={{
                rotateX: mousePos.y * -25,
                rotateY: mousePos.x * 25,
              }}
              transition={{ type: 'spring', damping: 20, stiffness: 200 }}
              className="w-full max-w-sm rounded-3xl glass-panel p-6 border border-white/[0.12] shadow-2xl relative transform-style-3d hover:shadow-card-hover group"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
                  <span className="text-xs font-mono text-slate-300 font-bold uppercase">
                    MigoX Micro-Patch
                  </span>
                </div>
                <span className="text-[11px] font-mono text-purple-300 font-medium">8.9 MARD</span>
              </div>

              <div className="relative py-8 flex flex-col items-center justify-center">
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                    boxShadow: [
                      '0 0 20px rgba(139, 92, 246, 0.3)',
                      '0 0 45px rgba(139, 92, 246, 0.6)',
                      '0 0 20px rgba(139, 92, 246, 0.3)',
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-36 h-36 rounded-full border-4 border-migo-purple/50 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center justify-center relative shadow-2xl"
                >
                  <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />
                  <span className="text-3xl font-black font-display text-white mt-1">118</span>
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider">MG/DL</span>

                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-400/30 pointer-events-none"
                  />
                </motion.div>
              </div>

              <div className="space-y-2 pt-4 border-t border-white/[0.08] text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Intercellular Glucose:</span>
                  <strong className="text-emerald-400 font-mono">Steady (±0.4 mg/dL/m)</strong>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Enzymatic Calibration:</span>
                  <strong className="text-cyan-400 font-mono">100% Synced</strong>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-white/[0.06]">
          <span>Scroll down to experience the scrollytelling path</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="cursor-pointer"
            onClick={() => {
              section2Ref.current?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <ChevronDown className="w-5 h-5 text-migo-purple-light" />
          </motion.div>
        </div>
      </div>

      {/* SECTION 2: SCROLL-TRIGGERED NARRATIVE PATH & SVG SPLINE DRAWING */}
      <div
        ref={section2Ref}
        className="glass-panel-glow rounded-3xl p-8 md:p-12 border border-white/[0.08] shadow-glass relative overflow-hidden"
      >
        <div className="max-w-2xl mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-migo-cyan block mb-2">
            Scroll-Linked Trajectory Story
          </span>
          <h2 className="text-3xl font-black font-display text-white tracking-tight">
            How Your Biology Unfolds Over 24 Hours
          </h2>
          <p className="text-sm text-slate-300 mt-2">
            As you scroll through this section, watch the dynamic metabolic spline reveal intra-day hormonal milestones.
          </p>
        </div>

        {/* Dynamic SVG Spline that animates with ScrollTrigger */}
        <div className="relative w-full h-[280px] my-6">
          <svg
            viewBox="0 0 1000 280"
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="scrollySplineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="35%" stopColor="#10b981" />
                <stop offset="70%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>

            {/* Background ghost track */}
            <path
              d="M 20 180 C 150 180, 220 70, 360 80 C 500 90, 600 230, 720 120 C 850 30, 920 140, 980 110"
              fill="none"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="4"
              strokeDasharray="6 6"
            />

            {/* ScrollTrigger Scrubbed Path */}
            <path
              ref={pathRef}
              d="M 20 180 C 150 180, 220 70, 360 80 C 500 90, 600 230, 720 120 C 850 30, 920 140, 980 110"
              fill="none"
              stroke="url(#scrollySplineGrad)"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </svg>

          {/* Key Milestone Waypoints */}
          <div className="absolute inset-0 flex justify-between items-center pointer-events-none px-4">
            <div className="p-3 rounded-2xl glass-panel border border-purple-500/30 text-center max-w-[150px] shadow-lg pointer-events-auto">
              <span className="text-[10px] font-mono text-purple-300 block">07:00 AM</span>
              <strong className="text-xs text-white block">Dawn Awakening</strong>
              <span className="text-[10px] text-emerald-400">94 mg/dL Fasting</span>
            </div>

            <div className="p-3 rounded-2xl glass-panel border border-emerald-500/30 text-center max-w-[150px] shadow-lg pointer-events-auto">
              <span className="text-[10px] font-mono text-emerald-300 block">12:30 PM</span>
              <strong className="text-xs text-white block">Prime Carb Zone</strong>
              <span className="text-[10px] text-cyan-400">124 mg/dL Plateau</span>
            </div>

            <div className="p-3 rounded-2xl glass-panel border border-cyan-500/30 text-center max-w-[150px] shadow-lg pointer-events-auto">
              <span className="text-[10px] font-mono text-cyan-300 block">04:45 PM</span>
              <strong className="text-xs text-white block">Post-Walk Buffer</strong>
              <span className="text-[10px] text-emerald-400">108 mg/dL Clear</span>
            </div>

            <div className="p-3 rounded-2xl glass-panel border border-rose-500/30 text-center max-w-[150px] shadow-lg pointer-events-auto">
              <span className="text-[10px] font-mono text-rose-300 block">11:00 PM</span>
              <strong className="text-xs text-white block">REM Autophagy</strong>
              <span className="text-[10px] text-purple-400">92 mg/dL Stable</span>
            </div>
          </div>
        </div>

        {/* Narrative Feature Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/[0.08]">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <h4 className="text-sm font-bold text-white">Sub-Millimeter Sampling</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every 5 minutes, interstitial glucose is measured and calibrated with zero latency, eliminating finger pricks.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-cyan-400">
              <TrendingUp className="w-4 h-4" />
              <h4 className="text-sm font-bold text-white">Food Impact Forecaster</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              AI maps meal macronutrients directly against post-meal glycemic response, finding which meals preserve mental energy.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-purple-400">
              <Cpu className="w-4 h-4" />
              <h4 className="text-sm font-bold text-white">On-Device Edge Engine</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              All machine learning runs locally in your browser with offline-first persistence and zero external tracking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
