import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BRAND } from '../../config/brand';

export const L9Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="relative w-full pt-20 pb-6 px-6 sm:px-10 border-t border-line z-20 overflow-hidden bg-white/30 dark:bg-night/30 backdrop-blur-md">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* 4 Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          {/* Column 1: Product */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-ink-muted font-mono">
              Product
            </h4>
            <ul className="space-y-2 text-ink-soft">
              <li>
                <a href="#how-it-works" className="hover:text-ink dark:hover:text-white transition-colors">
                  How it works
                </a>
              </li>
              <li>
                <a href="#why" className="hover:text-ink dark:hover:text-white transition-colors">
                  Why it feels different
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/partners')}
                  className="hover:text-ink dark:hover:text-white transition-colors text-left"
                >
                  For places & venues
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Get It */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-ink-muted font-mono">
              Get the App
            </h4>
            <ul className="space-y-2 text-ink-soft">
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/app')}
                  className="hover:text-ink dark:hover:text-white transition-colors text-left"
                >
                  Web App (Instant)
                </button>
              </li>
              <li>
                <span className="hover:text-ink dark:hover:text-white cursor-pointer">
                  Android Build
                </span>
              </li>
              <li>
                <span className="hover:text-ink dark:hover:text-white cursor-pointer">
                  iOS TestFlight
                </span>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust & Safety */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-ink-muted font-mono">
              Trust & Community
            </h4>
            <ul className="space-y-2 text-ink-soft">
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/safety')}
                  className="hover:text-ink dark:hover:text-white transition-colors text-left"
                >
                  Safety Guidelines
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/guidelines')}
                  className="hover:text-ink dark:hover:text-white transition-colors text-left"
                >
                  Community Code
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/child-safety')}
                  className="hover:text-ink dark:hover:text-white transition-colors text-left"
                >
                  Child Protection
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/content-policy')}
                  className="hover:text-ink dark:hover:text-white transition-colors text-left"
                >
                  Content Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Contact */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-ink-muted font-mono">
              Legal
            </h4>
            <ul className="space-y-2 text-ink-soft">
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/privacy')}
                  className="hover:text-ink dark:hover:text-white transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/terms')}
                  className="hover:text-ink dark:hover:text-white transition-colors text-left"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <a href="mailto:hello@sangam.live" className="hover:text-ink dark:hover:text-white transition-colors">
                  Contact Founders
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Tagline & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-ink-muted pt-8 border-t border-line gap-2">
          <span className="font-medium">Made for free evenings.</span>
          <span>© 2026 {BRAND.name}. All rights reserved. Zero feeds.</span>
        </div>

        {/* Giant clipped wordmark at bottom */}
        <div className="pt-4 overflow-hidden select-none pointer-events-none opacity-15 dark:opacity-20 text-center -mb-16">
          <span className="font-display font-black text-[22vw] leading-none tracking-tighter text-current block">
            {BRAND.name.toLowerCase()}
          </span>
        </div>
      </div>
    </footer>
  );
};
