import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { BRAND } from '../config/brand';
import {
  ArrowLeft,
  Store,
  Sparkles,
  TrendingUp,
  Users,
  CheckCircle,
  Plus,
  ShieldCheck,
  Compass,
} from 'lucide-react';

export const PartnersPage: React.FC = () => {
  const navigate = useNavigate();
  const [createdAd, setCreatedAd] = useState(false);
  const [campaignTitle, setCampaignTitle] = useState('Weekend Sunset Boardgames & Chai');
  const [dailyBudget, setDailyBudget] = useState(450);

  const handleLaunchCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    setCreatedAd(true);
    setTimeout(() => {
      alert('Your sponsored venue pin is active on Sangam map for Mumbai members!');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-paper dark:bg-night text-ink dark:text-white flex flex-col">
      {/* Header */}
      <header className="p-4 sm:p-6 border-b border-black/10 dark:border-white/10 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="font-display font-extrabold text-lg">
            {BRAND.name.toLowerCase()} for venues & partners
          </span>
        </div>

        <button
          onClick={() => navigate('/app')}
          className="px-4 py-2 rounded-full bg-marigold text-ink font-display font-extrabold text-xs shadow-soft hover:brightness-105 active:scale-95 transition-all"
        >
          Open App Map
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-6 sm:p-10 space-y-10">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-lagoon">
            Partner Portal
          </span>
          <h1 className="font-display font-black text-3xl sm:text-5xl mt-1.5 leading-tight">
            Put your space at the heart of local meetups.
          </h1>
          <p className="text-sm sm:text-base text-ink-soft dark:text-ink-muted mt-2 max-w-2xl leading-relaxed">
            Over 12,000 members in Mumbai use Sangam every day to find cafes, sports turfs, and
            studios to host group gatherings.
          </p>
        </div>

        {/* Live Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-1">
            <span className="text-xs text-ink-muted uppercase font-bold">Local Footfall Driven</span>
            <p className="font-display font-black text-3xl text-marigold">48,200+</p>
            <p className="text-[11px] text-ink-muted">In-person visits this month</p>
          </div>

          <div className="p-5 rounded-3xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-1">
            <span className="text-xs text-ink-muted uppercase font-bold">Average Circle Size</span>
            <p className="font-display font-black text-3xl text-lagoon">6.4</p>
            <p className="text-[11px] text-ink-muted">People per reservation table</p>
          </div>

          <div className="p-5 rounded-3xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-1">
            <span className="text-xs text-ink-muted uppercase font-bold">Venue Retention</span>
            <p className="font-display font-black text-3xl text-bougainvillea">88%</p>
            <p className="text-[11px] text-ink-muted">Repeat circles every weekend</p>
          </div>
        </div>

        {/* Campaign Launcher Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-paper dark:bg-night border border-black/10 dark:border-white/10 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5 text-marigold" />
              <h3 className="font-display font-extrabold text-xl text-ink dark:text-white">
                Launch a Sponsored Gathering Pin
              </h3>
            </div>
            <span className="text-xs font-bold text-lagoon px-2.5 py-1 rounded-full bg-lagoon/15">
              Live Preview
            </span>
          </div>

          <form onSubmit={handleLaunchCampaign} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-ink-muted uppercase tracking-wider mb-1.5">
                Campaign / Gathering Name
              </label>
              <input
                type="text"
                value={campaignTitle}
                onChange={(e) => setCampaignTitle(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm font-semibold text-ink dark:text-white focus:outline-hidden focus:border-marigold"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-ink-muted uppercase tracking-wider">
                  Daily Budget
                </label>
                <span className="font-display font-black text-sm text-marigold">
                  ₹{dailyBudget}/day
                </span>
              </div>
              <input
                type="range"
                min={200}
                max={3000}
                step={50}
                value={dailyBudget}
                onChange={(e) => setDailyBudget(Number(e.target.value))}
                className="w-full accent-marigold cursor-pointer"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <p className="text-xs text-ink-muted">
                ~{Math.round(dailyBudget * 2.8)} nearby members will discover your venue daily.
              </p>
              <button
                type="submit"
                className="px-6 py-3 rounded-full bg-marigold text-ink font-display font-extrabold text-sm shadow-soft hover:brightness-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{createdAd ? 'Active on Map ✓' : 'Activate Campaign'}</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
