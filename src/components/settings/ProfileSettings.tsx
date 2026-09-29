import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHealthStore } from '../../store/useHealthStore';
import { soundFx } from '../../utils/sound';
import {
  User,
  Sliders,
  Volume2,
  VolumeX,
  Eye,
  Sun,
  Moon,
  MousePointer,
  RotateCcw,
  LogOut,
  ChevronDown,
  Shield,
  Heart,
  Check,
  AlertTriangle
} from 'lucide-react';

export const ProfileSettings: React.FC = () => {
  const { user, setUser, resetToDefaults } = useHealthStore();
  const [openCategory, setOpenCategory] = useState<string | null>('biomarkers');
  const [showResetModal, setShowResetModal] = useState(false);
  const [savedBanner, setSavedBanner] = useState(false);

  const toggleCategory = (cat: string) => {
    soundFx.playTap(700);
    setOpenCategory((prev) => (prev === cat ? null : cat));
  };

  const handleToggleTheme = () => {
    const nextTheme = user.theme === 'dark' ? 'light' : 'dark';
    setUser({ theme: nextTheme });
    soundFx.playTap(900);
  };

  const handleToggleSound = () => {
    setUser({ soundEnabled: !user.soundEnabled });
    if (!user.soundEnabled) {
      soundFx.playTap(800);
    }
  };

  const handleToggleMotion = () => {
    setUser({ reducedMotion: !user.reducedMotion });
    soundFx.playTap(600);
  };

  const handleToggleCursor = () => {
    setUser({ customCursor: !user.customCursor });
    soundFx.playTap(600);
  };

  const handleAvatarChange = () => {
    const seeds = ['metabolic-aria', 'sol-pulse', 'cyber-nova', 'bio-kinetic', 'quantum-vital'];
    const currentIdx = seeds.indexOf(user.avatarSeed);
    const nextSeed = seeds[(currentIdx + 1) % seeds.length];
    setUser({ avatarSeed: nextSeed });
    soundFx.playTap(1000);
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 1500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Profile Header Card with Animated Avatar */}
      <div className="glass-panel-glow rounded-3xl p-6 md:p-8 border border-white/[0.08] shadow-glass relative overflow-hidden flex flex-col sm:flex-row items-center gap-6">
        {/* Ambient background aura */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Animated Avatar Upload Dropzone & Generator */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative group cursor-pointer" onClick={handleAvatarChange}>
            <motion.div
              whileHover={{ scale: 1.08, rotate: 3 }}
              whileTap={{ scale: 0.95 }}
              className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-migo-purple via-indigo-500 to-migo-cyan p-1 shadow-neon-purple flex items-center justify-center relative overflow-hidden"
            >
              <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center text-4xl select-none">
                {user.avatarSeed.includes('aria') ? '🧬' : user.avatarSeed.includes('sol') ? '⚡' : user.avatarSeed.includes('nova') ? '✨' : '🔮'}
              </div>
            </motion.div>
            <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-migo-purple text-white text-[10px] font-bold shadow-md">
              Cycle
            </span>
          </div>

          <label className="cursor-pointer flex flex-col items-center justify-center px-4 py-3 rounded-2xl border-2 border-dashed border-white/[0.15] hover:border-migo-purple/50 bg-white/[0.02] hover:bg-white/[0.05] transition-all text-center group">
            <span className="text-xs font-bold text-white group-hover:text-migo-purple-light transition-colors">
              Upload Custom Photo
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">PNG, JPG or WebP (max 5MB)</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  soundFx.playSuccess();
                  setUser({ avatarSeed: file.name.slice(0, 12) });
                  setSavedBanner(true);
                  setTimeout(() => setSavedBanner(false), 2000);
                }
              }}
            />
          </label>
        </div>

        <div className="text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-2xl font-bold font-display text-white tracking-tight">
              {user.name}
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
              Active CGM Telemetry
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">{user.email}</p>
          <p className="text-xs text-migo-purple-light mt-2 flex items-center justify-center sm:justify-start gap-1">
            <span>Avatar Signature: <strong className="font-mono text-white">{user.avatarSeed}</strong></span>
          </p>
        </div>

        <button
          onClick={() => setShowResetModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-500/20 border border-rose-500/20 transition-all self-center sm:self-start"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Sandbox</span>
        </button>
      </div>

      {savedBanner && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold text-center"
        >
          Preferences updated in real-time!
        </motion.div>
      )}

      {/* Accordion Categories */}
      <div className="space-y-3">
        {/* Category 1: Biomarker Target Limits */}
        <div className="glass-panel rounded-2xl border border-white/[0.08] overflow-hidden">
          <button
            onClick={() => toggleCategory('biomarkers')}
            className="w-full p-5 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-migo-purple/15 text-migo-purple-light">
                <Sliders className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-white">Target Glycemic Envelope</h3>
                <p className="text-xs text-slate-400">Configure optimal thresholds for clinical TIR</p>
              </div>
            </div>
            <motion.div animate={{ rotate: openCategory === 'biomarkers' ? 180 : 0 }}>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </motion.div>
          </button>

          <AnimatePresence>
            {openCategory === 'biomarkers' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="px-5 pb-5 pt-1 border-t border-white/[0.06] space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Fasting Lower Bound ({user.unit})
                    </label>
                    <input
                      type="number"
                      value={user.targetRangeMin}
                      onChange={(e) =>
                        setUser({ targetRangeMin: parseInt(e.target.value, 10) || 70 })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 text-sm text-white border border-white/[0.1] focus:border-migo-purple"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Post-Prandial Ceiling ({user.unit})
                    </label>
                    <input
                      type="number"
                      value={user.targetRangeMax}
                      onChange={(e) =>
                        setUser({ targetRangeMax: parseInt(e.target.value, 10) || 140 })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 text-sm text-white border border-white/[0.1] focus:border-migo-purple"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">Preferred Metric Unit:</span>
                  {(['mg/dL', 'mmol/L'] as const).map((u) => (
                    <button
                      key={u}
                      onClick={() => setUser({ unit: u })}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        user.unit === u
                          ? 'bg-migo-purple text-white shadow-neon-purple'
                          : 'bg-white/[0.05] text-slate-400 hover:text-white'
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Category 2: Sensory & Audio Feedback */}
        <div className="glass-panel rounded-2xl border border-white/[0.08] overflow-hidden">
          <button
            onClick={() => toggleCategory('sensory')}
            className="w-full p-5 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400">
                <Volume2 className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-white">Audio & Haptic Feedback</h3>
                <p className="text-xs text-slate-400">Web Audio sonification and tactile feedback</p>
              </div>
            </div>
            <motion.div animate={{ rotate: openCategory === 'sensory' ? 180 : 0 }}>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </motion.div>
          </button>

          <AnimatePresence>
            {openCategory === 'sensory' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="px-5 pb-5 pt-1 border-t border-white/[0.06] space-y-4"
              >
                {/* Sound Toggle */}
                <div className="flex items-center justify-between py-2">
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Synthesized Glucose Sonification
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Play harmonic pitch matching glucose values on hover and data points
                    </span>
                  </div>
                  {/* Custom Toggle Switch with Thumb Animation */}
                  <button
                    type="button"
                    onClick={handleToggleSound}
                    className={`w-12 h-6 rounded-full p-0.5 transition-colors relative cursor-pointer ${
                      user.soundEnabled ? 'bg-migo-purple' : 'bg-slate-700'
                    }`}
                  >
                    <motion.div
                      layout
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="w-5 h-5 rounded-full bg-white shadow-md"
                      style={{ float: user.soundEnabled ? 'right' : 'left' }}
                    />
                  </button>
                </div>

                {/* Haptics */}
                <div className="flex items-center justify-between py-2 border-t border-white/[0.04]">
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Tactile Vibration Haptics
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Micro-vibration pulses when tapping numpads and quick action dials
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUser({ hapticsEnabled: !user.hapticsEnabled })}
                    className={`w-12 h-6 rounded-full p-0.5 transition-colors relative cursor-pointer ${
                      user.hapticsEnabled ? 'bg-migo-purple' : 'bg-slate-700'
                    }`}
                  >
                    <motion.div
                      layout
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="w-5 h-5 rounded-full bg-white shadow-md"
                      style={{ float: user.hapticsEnabled ? 'right' : 'left' }}
                    />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Category 3: Visual & Cursor Physics */}
        <div className="glass-panel rounded-2xl border border-white/[0.08] overflow-hidden">
          <button
            onClick={() => toggleCategory('visual')}
            className="w-full p-5 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-amber-500/15 text-amber-400">
                <MousePointer className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-white">Visual Engine & Magnetic Cursor</h3>
                <p className="text-xs text-slate-400">Theme, motion easing, and magnetic orb physics</p>
              </div>
            </div>
            <motion.div animate={{ rotate: openCategory === 'visual' ? 180 : 0 }}>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </motion.div>
          </button>

          <AnimatePresence>
            {openCategory === 'visual' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="px-5 pb-5 pt-1 border-t border-white/[0.06] space-y-4"
              >
                {/* Theme Toggle */}
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    {user.theme === 'dark' ? <Moon className="w-4 h-4 text-purple-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
                    <div>
                      <span className="text-xs font-bold text-white block">Theme Mode</span>
                      <span className="text-[11px] text-slate-400">Current: {user.theme.toUpperCase()}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleToggleTheme}
                    className="px-3.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-bold text-white border border-white/[0.08]"
                  >
                    Switch to {user.theme === 'dark' ? 'Light' : 'Dark'}
                  </button>
                </div>

                {/* Custom Cursor Toggle */}
                <div className="flex items-center justify-between py-2 border-t border-white/[0.04]">
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Magnetic Glowing Orb Cursor
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Physics-based spring trailing cursor with proximity morphing
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleToggleCursor}
                    className={`w-12 h-6 rounded-full p-0.5 transition-colors relative cursor-pointer ${
                      user.customCursor ? 'bg-migo-purple' : 'bg-slate-700'
                    }`}
                  >
                    <motion.div
                      layout
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="w-5 h-5 rounded-full bg-white shadow-md"
                      style={{ float: user.customCursor ? 'right' : 'left' }}
                    />
                  </button>
                </div>

                {/* Reduced Motion Toggle */}
                <div className="flex items-center justify-between py-2 border-t border-white/[0.04]">
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Prefers Reduced Motion
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Respect vestibular comfort and disable heavy scroll animations
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleToggleMotion}
                    className={`w-12 h-6 rounded-full p-0.5 transition-colors relative cursor-pointer ${
                      user.reducedMotion ? 'bg-migo-purple' : 'bg-slate-700'
                    }`}
                  >
                    <motion.div
                      layout
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="w-5 h-5 rounded-full bg-white shadow-md"
                      style={{ float: user.reducedMotion ? 'right' : 'left' }}
                    />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Confirmation Modal for Reset/Logout */}
      <AnimatePresence>
        {showResetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowResetModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-md glass-panel-glow rounded-3xl p-6 border border-rose-500/30 shadow-2xl z-10 text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-500/30">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-bold text-white font-display">
                Reset Simulated Telemetry?
              </h3>
              <p className="text-xs text-slate-300 mt-2">
                This will restore all initial fake readings, daily summaries, and default biomarkers.
              </p>

              <div className="flex items-center justify-center gap-3 mt-6">
                <button
                  onClick={() => setShowResetModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-xs font-semibold text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    resetToDefaults();
                    setShowResetModal(false);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-xs font-bold text-white shadow-lg transition-all"
                >
                  Confirm Reset
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
