import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { AppShell } from '../app/AppShell';
import { Landing } from '../landing/Landing';
import { Map, Sparkles, Clock, CloudSun } from 'lucide-react';

interface UnifiedHomeProps {
  initialMode?: 'app' | 'landing';
}

export const UnifiedHome: React.FC<UnifiedHomeProps> = ({ initialMode = 'app' }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'app' | 'landing'>(() => {
    const modeParam = searchParams.get('mode');
    if (modeParam === 'landing') return 'landing';
    if (modeParam === 'app') return 'app';
    return initialMode;
  });

  const [mumbaiTime, setMumbaiTime] = useState('');

  // Live IST Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      setMumbaiTime(now.toLocaleTimeString('en-US', options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Keep query param in sync
  const handleSetMode = (mode: 'app' | 'landing') => {
    setViewMode(mode);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (mode === 'landing') {
          next.set('mode', 'landing');
        } else {
          next.delete('mode');
        }
        return next;
      },
      { replace: true }
    );
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#FFFDF7] dark:bg-[#0C0E14] text-gray-900 dark:text-gray-100">
      {/* Bespoke Bombay Top Header Bar */}
      <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[99995] flex items-center gap-2 p-1.5 rounded-2xl bg-white/95 dark:bg-[#0F111A]/95 backdrop-blur-md border-2 border-black/80 dark:border-white/20 shadow-[4px_4px_0px_#000] select-none max-w-[96vw]">
        {/* Mumbai Live Info Ticker (Desktop) */}
        <div className="hidden md:flex items-center gap-2.5 px-3 py-1 border-r-2 border-black/10 dark:border-white/10 text-[11px] font-mono font-bold text-gray-700 dark:text-gray-300">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-black dark:text-white font-extrabold uppercase">MUMBAI MMR</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <Clock className="w-3 h-3 text-amber-500" />
            <span>{mumbaiTime || 'IST'}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <CloudSun className="w-3.5 h-3.5 text-amber-500" />
            <span>31°C Arabian Breeze</span>
          </div>
        </div>

        {/* Switcher Buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => handleSetMode('app')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'app'
                ? 'bg-amber-400 text-black border-2 border-black shadow-[2px_2px_0px_#000]'
                : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-black/5'
            }`}
          >
            <Map className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Live Mumbai App</span>
          </button>

          <button
            type="button"
            onClick={() => handleSetMode('landing')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'landing'
                ? 'bg-amber-400 text-black border-2 border-black shadow-[2px_2px_0px_#000]'
                : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-black/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Landing Story</span>
          </button>
        </div>
      </div>

      {/* Render Active View */}
      <AnimatePresence mode="wait">
        {viewMode === 'app' ? (
          <motion.div
            key="app-shell"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full"
          >
            <AppShell onSwitchToStory={() => handleSetMode('landing')} />
          </motion.div>
        ) : (
          <motion.div
            key="landing-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full overflow-y-auto"
          >
            <Landing onSwitchToApp={() => handleSetMode('app')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
