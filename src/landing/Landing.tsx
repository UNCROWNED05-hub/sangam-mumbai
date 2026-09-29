import React, { useState, useEffect } from 'react';
import { SmoothScroll } from '../systems/SmoothScroll';
import { Sky } from '../systems/Sky';
import { ScrollRail } from '../systems/ScrollRail';
import { Navbar } from './Navbar';
import { Preloader } from '../systems/Preloader';
import { L1Hero } from './sections/L1Hero';
import { L2PhoneScene } from './sections/L2PhoneScene';
import { L3ClockScene } from './sections/L3ClockScene';
import { L4Bento } from './sections/L4Bento';
import { L5AdBuilder } from './sections/L5AdBuilder';
import { L6Stories } from './sections/L6Stories';
import { L7FAQ } from './sections/L7FAQ';
import { L8EmojiPile } from './sections/L8EmojiPile';
import { L9Footer } from './sections/L9Footer';

interface LandingProps {
  onSwitchToApp?: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onSwitchToApp }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [preloaderDone, setPreloaderDone] = useState(false);

  // Track global scroll progress (0 to 1) for the sky system and scroll rail
  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;
      const progress = Math.max(0, Math.min(1, window.scrollY / maxScroll));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <SmoothScroll>
      {/* Preloader sequence (plays once per session) */}
      <Preloader onComplete={() => setPreloaderDone(true)} />

      {/* Dynamic Sky Background with Sun/Moon Orb & Stars */}
      <Sky progress={scrollProgress} />

      {/* Floating Glass Pill Navigation */}
      <Navbar onSwitchToApp={onSwitchToApp} />

      {/* Desktop Scroll Clock Rail */}
      <ScrollRail progress={scrollProgress} />

      {/* Landing Page Content Container */}
      <div className="relative w-full z-10 flex flex-col overflow-x-hidden">
        {/* L1. Hero: Live pitched map, 12 bubbles, live counter, city ticker */}
        <L1Hero />

        {/* L2. Three Taps: Pinned phone scene with real React screens on StaticMap */}
        <L2PhoneScene />

        {/* L3. Two Versions of Tonight: Sweeping clock dial, dual comparison, converging map */}
        <L3ClockScene />

        {/* L4. Why it feels different: 6 interactive bento micro-demos */}
        <L4Bento />

        {/* L5. For Places: Interactive Ad builder with budget & radius slider */}
        <L5AdBuilder />

        {/* L6. Community Stories: Dual counter-scrolling marquees */}
        <L6Stories />

        {/* L7. FAQ: Accordion with 5 original questions & answers */}
        <L7FAQ />

        {/* L8. Go Outside: Matter.js physics emoji pile with 60 activity emoji */}
        <L8EmojiPile />

        {/* L9. Footer: 4 columns, working links, clipped wordmark */}
        <L9Footer />
      </div>
    </SmoothScroll>
  );
};
