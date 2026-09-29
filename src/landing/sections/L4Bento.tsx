import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import {
  Compass,
  ShieldCheck,
  MapPin,
  MessageSquare,
  EyeOff,
  Ticket,
  Sparkles,
  Check,
} from 'lucide-react';

export const L4Bento: React.FC = () => {
  const [ghostModeActive, setGhostModeActive] = useState(false);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [mapWiped, setMapWiped] = useState(false);

  return (
    <section className="relative w-full py-24 sm:py-32 px-4 sm:px-8 max-w-7xl mx-auto z-10 select-none">
      {/* Section Header */}
      <div className="max-w-2xl mb-12 sm:mb-16">
        <span className="text-xs font-black uppercase tracking-widest text-marigold">
          Zero Algorithms
        </span>
        <h2 className="font-display font-black text-3xl sm:text-5xl text-ink dark:text-white mt-2 leading-tight">
          Why Sangam feels nothing like social media.
        </h2>
        <p className="text-sm sm:text-base text-ink-soft dark:text-ink-muted mt-3 leading-relaxed">
          No infinite scrolling. No vanity follower counts. Just people in your neighborhood
          showing up for activities they love.
        </p>
      </div>

      {/* Bento Grid (6 Varied Tiles) */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
        {/* Tile 1: No Feed, No Followers (Col span 3) */}
        <div
          onMouseEnter={() => setMapWiped(true)}
          onMouseLeave={() => setMapWiped(false)}
          className="md:col-span-3 lg:col-span-4 p-6 sm:p-8 rounded-3xl bg-paper/85 dark:bg-night/85 backdrop-blur-md border border-black/10 dark:border-white/10 shadow-soft flex flex-col justify-between overflow-hidden relative group min-h-[260px]"
        >
          <div className="relative z-10 space-y-2 max-w-md">
            <span className="px-2.5 py-1 rounded-full bg-bougainvillea/15 text-bougainvillea text-[11px] font-black uppercase tracking-wider">
              No endless feed
            </span>
            <h3 className="font-display font-extrabold text-xl sm:text-2xl text-ink dark:text-white">
              The map wipes the algorithm away
            </h3>
            <p className="text-xs sm:text-sm text-ink-muted">
              Feeds trap you on the couch for two hours. Sangam gets you out of the door in 5 minutes.
            </p>
          </div>

          {/* Micro-demo: Blurred feed covered by map wipe */}
          <div className="relative h-28 rounded-2xl overflow-hidden mt-6 border border-black/10 dark:border-white/10 flex items-center">
            {/* Blurred feed simulation */}
            <div className="absolute inset-0 bg-black/5 dark:bg-white/5 p-3 flex flex-col gap-2 blur-xs">
              <div className="w-2/3 h-3 rounded-full bg-black/20 dark:bg-white/20" />
              <div className="w-full h-8 rounded-xl bg-black/10 dark:bg-white/10" />
              <div className="w-1/2 h-3 rounded-full bg-black/15 dark:bg-white/15" />
            </div>

            {/* Map wipe overlay */}
            <motion.div
              animate={{ x: mapWiped ? '0%' : '50%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="absolute inset-0 bg-gradient-to-r from-marigold/90 via-lagoon/90 to-bougainvillea/90 flex items-center justify-center text-ink font-display font-extrabold text-xs sm:text-sm shadow-xl"
            >
              <Compass className="w-5 h-5 mr-2 animate-spin-slow text-ink" />
              <span>Live Mumbai Map • 12 Active Circles Nearby</span>
            </motion.div>
          </div>
        </div>

        {/* Tile 2: Real Names, Real Faces (Col span 2) */}
        <div
          onClick={() => setCardFlipped(!cardFlipped)}
          className="md:col-span-3 lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-paper/85 dark:bg-night/85 backdrop-blur-md border border-black/10 dark:border-white/10 shadow-soft flex flex-col justify-between cursor-pointer group min-h-[260px]"
        >
          <div className="space-y-1.5">
            <span className="px-2.5 py-1 rounded-full bg-lagoon/15 text-lagoon text-[11px] font-black uppercase tracking-wider">
              Verified Profiles
            </span>
            <h3 className="font-display font-extrabold text-xl text-ink dark:text-white">
              Real humans only
            </h3>
            <p className="text-xs text-ink-muted">
              Tap to see ID & phone verification badge.
            </p>
          </div>

          {/* Micro-demo: Flipping badge */}
          <div className="pt-6 flex justify-center">
            <motion.div
              animate={{ rotateY: cardFlipped ? 180 : 0 }}
              transition={{ duration: 0.5 }}
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-lagoon to-ink text-white flex flex-col items-center justify-center p-2 shadow-md relative"
            >
              {cardFlipped ? (
                <div className="transform -scale-x-100 flex flex-col items-center">
                  <ShieldCheck className="w-8 h-8 text-marigold" />
                  <span className="text-[10px] font-black mt-1">Verified</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <span className="font-display font-black text-xl">AM</span>
                  <span className="text-[9px] text-white/80">Aarav M.</span>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Tile 3: Always Public Places (Col span 2) */}
        <div className="md:col-span-3 lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-paper/85 dark:bg-night/85 backdrop-blur-md border border-black/10 dark:border-white/10 shadow-soft flex flex-col justify-between min-h-[240px]">
          <div className="space-y-1.5">
            <span className="px-2.5 py-1 rounded-full bg-marigold/20 text-ink dark:text-marigold text-[11px] font-black uppercase tracking-wider">
              Safety First
            </span>
            <h3 className="font-display font-extrabold text-xl text-ink dark:text-white">
              Always public spots
            </h3>
            <p className="text-xs text-ink-muted">
              Every plan is hosted at a verified park, cafe, promenade, or court.
            </p>
          </div>

          <div className="pt-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-bougainvillea/15 text-bougainvillea flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-xs text-ink dark:text-white">Bandra Bandstand</p>
              <p className="text-[10px] text-ink-muted">Public Promenade • High footfall</p>
            </div>
          </div>
        </div>

        {/* Tile 4: Chat opens on first tap (Col span 2) */}
        <div className="md:col-span-3 lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-paper/85 dark:bg-night/85 backdrop-blur-md border border-black/10 dark:border-white/10 shadow-soft flex flex-col justify-between min-h-[240px]">
          <div className="space-y-1.5">
            <span className="px-2.5 py-1 rounded-full bg-ink/10 dark:bg-white/10 text-ink dark:text-white text-[11px] font-black uppercase tracking-wider">
              Instant Chat
            </span>
            <h3 className="font-display font-extrabold text-xl text-ink dark:text-white">
              Say hi before leaving
            </h3>
            <p className="text-xs text-ink-muted">
              Group chat unlocks the second you hit join.
            </p>
          </div>

          <div className="pt-4 p-3 rounded-2xl bg-black/5 dark:bg-white/5 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-lagoon">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Court 2 Badminton Chat</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-ink-muted italic">
              <span className="w-1.5 h-1.5 rounded-full bg-lagoon animate-ping" />
              <span>Rohan: Bringing 3 extra shuttles!</span>
            </div>
          </div>
        </div>

        {/* Tile 5: Go invisible any time (Col span 2) */}
        <div className="md:col-span-3 lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-paper/85 dark:bg-night/85 backdrop-blur-md border border-black/10 dark:border-white/10 shadow-soft flex flex-col justify-between min-h-[240px]">
          <div className="space-y-1.5">
            <span className="px-2.5 py-1 rounded-full bg-marigold/20 text-ink dark:text-marigold text-[11px] font-black uppercase tracking-wider">
              Privacy Control
            </span>
            <h3 className="font-display font-extrabold text-xl text-ink dark:text-white">
              Go invisible any time
            </h3>
            <p className="text-xs text-ink-muted">
              One toggle turns your presence into a hollow ghost.
            </p>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <EyeOff className="w-5 h-5 text-marigold" />
              <span className="text-xs font-bold text-ink dark:text-white">Ghost Mode</span>
            </div>
            <button
              onClick={() => setGhostModeActive(!ghostModeActive)}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${
                ghostModeActive ? 'bg-marigold' : 'bg-black/20 dark:bg-white/20'
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                  ghostModeActive ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
