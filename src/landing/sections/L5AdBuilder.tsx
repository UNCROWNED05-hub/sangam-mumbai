import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { StaticMap } from '../../ui/StaticMap';
import { Odometer } from '../../ui/Odometer';
import { Store, Sparkles, MapPin, ArrowRight, ShieldCheck, DollarSign } from 'lucide-react';

export const L5AdBuilder: React.FC = () => {
  const navigate = useNavigate();
  const [venueType, setVenueType] = useState<'Cafe' | 'Turf' | 'Studio' | 'Bookshop'>('Cafe');
  const [budget, setBudget] = useState(650);
  const [radiusKm, setRadiusKm] = useState(2.2);

  // Approximate people reached based on budget & radius
  const estimatedReach = Math.round(budget * 2.8 * (radiusKm * 0.8));

  const venueEmojis = {
    Cafe: '☕',
    Turf: '⚽',
    Studio: '🎨',
    Bookshop: '📚',
  };

  return (
    <section className="relative w-full py-24 sm:py-32 px-4 sm:px-8 max-w-7xl mx-auto z-10 select-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Copy & Controls */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-lagoon">
              For Local Venues & Hosts
            </span>
            <h2 className="font-display font-black text-3xl sm:text-5xl text-ink dark:text-white mt-2 leading-tight">
              Be on the map when people pick where to go.
            </h2>
            <p className="text-sm sm:text-base text-ink-soft dark:text-ink-muted mt-3 leading-relaxed">
              When groups look for a badminton court, specialty coffee, or outdoor yoga, put your
              venue directly on their radar.
            </p>
          </div>

          {/* Three Key Value Props */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { title: 'Locals nearby', sub: 'High intent footfall' },
              { title: 'Flexible budget', sub: 'Start with ₹200/day' },
              { title: 'Self-serve', sub: 'No sales calls needed' },
            ].map((prop, i) => (
              <div
                key={i}
                className="p-3 rounded-2xl bg-paper/80 dark:bg-night/80 border border-black/10 dark:border-white/10"
              >
                <p className="font-bold text-xs text-ink dark:text-white">{prop.title}</p>
                <p className="text-[10px] text-ink-muted mt-0.5">{prop.sub}</p>
              </div>
            ))}
          </div>

          {/* Interactive Ad Builder Panel */}
          <div className="p-5 sm:p-6 rounded-3xl bg-paper/90 dark:bg-night/90 border border-black/10 dark:border-white/10 shadow-soft space-y-5">
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-sm text-ink dark:text-white">
                Live Reach Simulator
              </span>
              <span className="text-[10px] font-bold text-lagoon px-2 py-0.5 rounded-full bg-lagoon/15">
                Instant Activation
              </span>
            </div>

            {/* Venue Type Chips */}
            <div>
              <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-2">
                Venue Type
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['Cafe', 'Turf', 'Studio', 'Bookshop'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setVenueType(t)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                      venueType === t
                        ? 'bg-marigold text-ink border-transparent shadow-xs'
                        : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-ink dark:text-white hover:bg-black/10'
                    }`}
                  >
                    <span>{venueEmojis[t]}</span>
                    <span>{t}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Budget Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[11px] font-bold text-ink-muted uppercase tracking-wider">
                  Daily Budget
                </label>
                <span className="text-sm font-black text-marigold">₹{budget}/day</span>
              </div>
              <input
                type="range"
                min={200}
                max={5000}
                step={50}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full accent-marigold cursor-pointer"
              />
            </div>

            {/* Radius Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[11px] font-bold text-ink-muted uppercase tracking-wider">
                  Target Radius
                </label>
                <span className="text-sm font-black text-lagoon">{radiusKm.toFixed(1)} km</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={5.0}
                step={0.1}
                value={radiusKm}
                onChange={(e) => setRadiusKm(Number(e.target.value))}
                className="w-full accent-lagoon cursor-pointer"
              />
            </div>

            {/* Reach counter & CTA */}
            <div className="pt-2 border-t border-black/5 dark:border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="text-[10px] text-ink-muted uppercase font-bold">Estimated Impressions</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-xs font-bold text-ink dark:text-white">~</span>
                  <Odometer value={estimatedReach} className="font-display font-black text-2xl text-ink dark:text-white" />
                  <span className="text-xs text-ink-muted">people nearby</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/partners')}
                className="px-5 py-3 rounded-full bg-ink dark:bg-white text-white dark:text-ink font-display font-extrabold text-xs shadow-soft hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <span>Create Partner Ad</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Preview Map */}
        <div className="lg:col-span-6 relative">
          <div className="relative w-full h-[440px] rounded-3xl overflow-hidden border border-black/10 dark:border-white/10 shadow-2xl">
            <StaticMap
              highlightArea={{
                x: 300,
                y: 225,
                radius: radiusKm * 28,
              }}
              pins={[
                {
                  x: 300,
                  y: 225,
                  emoji: venueEmojis[venueType],
                  label: 'Your Venue',
                  isSponsored: true,
                },
              ]}
              className="w-full h-full"
            />

            {/* Expanding radius halo */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                animate={{
                  width: `${radiusKm * 85}px`,
                  height: `${radiusKm * 85}px`,
                }}
                transition={{ type: 'spring', damping: 25 }}
                className="rounded-full bg-marigold/20 border-2 border-dashed border-marigold/60 flex items-center justify-center animate-pulse"
              />

              {/* Sponsored Pin at Center */}
              <div className="absolute z-10 p-3 rounded-2xl bg-ink text-white border-2 border-marigold shadow-2xl flex items-center gap-2">
                <span className="text-2xl">{venueEmojis[venueType]}</span>
                <div>
                  <div className="flex items-center gap-1 text-[9px] font-black uppercase text-marigold">
                    <Sparkles className="w-3 h-3" />
                    <span>Sponsored</span>
                  </div>
                  <p className="font-display font-bold text-xs text-white">Your Venue Name</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
