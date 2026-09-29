import React from 'react';
import { motion } from 'framer-motion';
import { useHealthStore } from '../../store/useHealthStore';
import { soundFx } from '../../utils/sound';
import {
  Activity,
  BarChart3,
  Clock,
  Sparkles,
  User,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Wifi,
  WifiOff,
  Flame
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, user, setUser, isOffline, toggleOffline, turboMode, setTurboMode } = useHealthStore();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Activity className="w-4 h-4" /> },
    { id: 'timeline', label: 'Timeline', icon: <Clock className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'scrollystory', label: 'Story View', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <User className="w-4 h-4" /> },
  ] as const;

  const handleToggleSound = () => {
    setUser({ soundEnabled: !user.soundEnabled });
    if (!user.soundEnabled) {
      soundFx.playTap(900);
    }
  };

  const handleToggleTheme = () => {
    const next = user.theme === 'dark' ? 'light' : 'dark';
    setUser({ theme: next });
    soundFx.playTap(850);
  };

  return (
    <header className="sticky top-4 z-40 w-full max-w-7xl mx-auto px-3 sm:px-6">
      <div className="glass-panel-glow rounded-2xl px-4 py-3 flex items-center justify-between border border-white/[0.08] shadow-glass backdrop-blur-xl">
        {/* Brand Logo */}
        <div
          className="flex items-center gap-2.5 cursor-pointer group"
          onClick={() => setActiveTab('dashboard')}
          data-interactive="true"
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.92 }}
            className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-neon-purple transition-all ${
              turboMode
                ? 'bg-gradient-to-tr from-amber-500 to-yellow-300'
                : 'bg-gradient-to-tr from-migo-purple via-indigo-600 to-migo-cyan'
            }`}
          >
            {turboMode ? (
              <Flame className="w-5 h-5 text-slate-950 animate-bounce" />
            ) : (
              <Activity className="w-5 h-5 text-white" />
            )}
          </motion.div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-lg text-white tracking-tight leading-none group-hover:text-migo-purple-light transition-colors">
                Migo<span className="text-migo-cyan">X</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.08] text-migo-purple-light font-bold">
                PRO
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium hidden sm:block">
              Metabolic Intelligence
            </span>
          </div>
        </div>

        {/* Central Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-900/60 rounded-xl border border-white/[0.06]">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all select-none ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
                data-interactive="true"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 rounded-lg bg-migo-purple shadow-neon-purple -z-10"
                    transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                  />
                )}
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Utility Actions */}
        <div className="flex items-center gap-2">
          {/* Turbo Mode Indicator */}
          {turboMode && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={() => setTurboMode(false)}
              className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold flex items-center gap-1 animate-pulse"
              title="Turbo Mode active! Click to reset."
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>TURBO</span>
            </motion.button>
          )}

          {/* Offline Sync Simulator Pill */}
          <button
            onClick={toggleOffline}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isOffline
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
            }`}
            title={isOffline ? 'Offline mode (mock storage). Click to sync.' : 'Online Live Stream'}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isOffline ? 'bg-amber-400' : 'bg-emerald-400 animate-ping'
              }`}
            />
            {isOffline ? (
              <span className="hidden sm:inline">Offline Cache</span>
            ) : (
              <span className="hidden sm:inline">Live Stream</span>
            )}
          </button>

          {/* Sound Sonification Toggle */}
          <button
            onClick={handleToggleSound}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
            title={user.soundEnabled ? 'Mute Sonification' : 'Enable Sonification'}
            aria-label="Toggle sound"
          >
            {user.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-migo-purple-light" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={handleToggleTheme}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
            title="Toggle Light/Dark Theme"
            aria-label="Toggle theme"
          >
            {user.theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-400" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation bar at bottom on small screens */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-40 glass-panel-glow rounded-2xl p-1.5 border border-white/[0.1] shadow-2xl flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold transition-all ${
                isActive
                  ? 'text-migo-purple-light bg-white/[0.08]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
