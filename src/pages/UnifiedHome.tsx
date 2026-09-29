import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { AppShell } from '../app/AppShell';
import { Landing } from '../landing/Landing';
import { Map, Sparkles } from 'lucide-react';

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
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Persistent Top Switcher on the Single Localhost */}
      <div className="fixed top-3.5 left-1/2 -translate-x-1/2 z-[99995] flex items-center p-1 rounded-full bg-paper/90 dark:bg-night/90 backdrop-blur-md border border-black/10 dark:border-white/10 shadow-lg select-none">
        <button
          type="button"
          onClick={() => handleSetMode('app')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            viewMode === 'app'
              ? 'bg-marigold text-ink shadow-xs'
              : 'text-ink-muted hover:text-ink dark:hover:text-white'
          }`}
        >
          <Map className="w-3.5 h-3.5" />
          <span>Live Map App</span>
        </button>

        <button
          type="button"
          onClick={() => handleSetMode('landing')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            viewMode === 'landing'
              ? 'bg-marigold text-ink shadow-xs'
              : 'text-ink-muted hover:text-ink dark:hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Landing Story</span>
        </button>
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
