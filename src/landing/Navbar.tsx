import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BRAND } from '../config/brand';
import { useMagnetic } from '../systems/useMagnetic';
import { useRouteTransition } from '../systems/RouteTransition';
import { Menu, X, ArrowRight } from 'lucide-react';

interface NavbarProps {
  onNavigateToSection?: (sectionId: string) => void;
  onSwitchToApp?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigateToSection, onSwitchToApp }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('How it works');
  const lastScrollY = useRef(0);
  const ctaRef = useRef<HTMLButtonElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);

  const { openApp } = useRouteTransition();
  useMagnetic(ctaRef, { strength: 0.35, radius: 90 });
  useMagnetic(logoRef, { strength: 0.2, radius: 70 });

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 120 && currentScrollY > lastScrollY.current + 8) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY.current - 12) {
        setIsVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'How it works', id: 'how-it-works' },
    { label: 'Why', id: 'why' },
    { label: 'Places', id: 'places' },
    { label: 'FAQ', id: 'faq' },
  ];

  const handleLinkClick = (link: typeof navLinks[0]) => {
    setActiveLink(link.label);
    setMobileMenuOpen(false);
    if (onNavigateToSection) {
      onNavigateToSection(link.id);
    } else {
      const el = document.getElementById(link.id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-4xl transition-transform duration-300 ${
          isVisible ? 'translate-y-0' : '-translate-y-[150%]'
        }`}
      >
        <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 rounded-full bg-white/70 dark:bg-night/70 backdrop-blur-md border border-line shadow-soft select-none">
          {/* Wordmark with animated pin */}
          <div
            ref={logoRef}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 cursor-pointer group"
            data-cursor="link"
          >
            <span className="w-5 h-5 text-marigold group-hover:scale-110 transition-transform">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
            </span>
            <span className="font-display font-extrabold text-lg text-ink dark:text-white tracking-tight">
              {BRAND.name.toLowerCase()}
            </span>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activeLink === link.label;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleLinkClick(link)}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    isActive ? 'text-ink dark:text-white' : 'text-ink-soft hover:text-ink dark:hover:text-white'
                  }`}
                  data-cursor="link"
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 rounded-full bg-ink/5 dark:bg-white/10 -z-10"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Primary CTA button: Open the map */}
          <div className="flex items-center gap-2">
            <button
              ref={ctaRef}
              type="button"
              onClick={(e) => {
                if (onSwitchToApp) onSwitchToApp();
                else openApp(e.clientX, e.clientY);
              }}
              className="px-4 py-2 rounded-full bg-marigold hover:bg-marigold-hover text-ink font-bold text-xs shadow-pill active:scale-95 transition-all flex items-center gap-1.5"
              data-cursor="open"
            >
              <span>Open the map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-full text-ink dark:text-white hover:bg-black/5 dark:hover:bg-white/5"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen Mobile Menu Sheet */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[99992] bg-paper dark:bg-night p-6 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between border-b border-line pb-4">
              <span className="font-display font-extrabold text-xl text-ink dark:text-white">
                {BRAND.name.toLowerCase()}
              </span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col gap-6 my-auto text-left">
              {navLinks.map((link, idx) => (
                <motion.button
                  key={link.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  onClick={() => handleLinkClick(link)}
                  className="font-display text-3xl font-black text-ink dark:text-white text-left hover:text-marigold transition-colors"
                >
                  {link.label}
                </motion.button>
              ))}
            </div>

            <button
              type="button"
              onClick={(e) => {
                setMobileMenuOpen(false);
                openApp(e.clientX, e.clientY);
              }}
              className="w-full py-4 rounded-2xl bg-marigold text-ink font-bold text-center text-sm shadow-pill"
            >
              Open the map
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
