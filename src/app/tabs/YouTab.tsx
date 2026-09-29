import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAppStore } from '../../store/useAppStore';
import { CURRENT_USER } from '../../data/people';
import { BRAND } from '../../config/brand';
import {
  User,
  Crown,
  EyeOff,
  Copy,
  Check,
  Moon,
  Sun,
  Laptop,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Bell,
  Heart,
  Share2,
} from 'lucide-react';

interface YouTabProps {
  onOpenPremium: () => void;
}

export const YouTab: React.FC<YouTabProps> = ({ onOpenPremium }) => {
  const {
    joinedPlanIds,
    myHostedPlanIds,
    isInvisible,
    toggleInvisible,
    theme,
    setTheme,
    isPremium,
    resetDemoData,
    addToast,
  } = useAppStore();

  const [copiedReferral, setCopiedReferral] = useState(false);
  const [notifyOnNewPlans, setNotifyOnNewPlans] = useState(true);
  const [notifyOnJoins, setNotifyOnJoins] = useState(true);

  const referralCode = 'SANGAM-AARAV-MUM';

  const handleCopyReferral = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Hey, join spontaneous circles on Sangam with my invite: ${window.location.origin}/app?ref=${referralCode}`
      );
      setCopiedReferral(true);
      addToast('Referral invite copied!');
      setTimeout(() => setCopiedReferral(false), 2000);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all demo data to initial factory state?')) {
      resetDemoData();
      addToast('Demo data restored.');
    }
  };

  return (
    <div
      data-lenis-prevent
      className="flex-1 overflow-y-auto p-4 sm:p-8 pt-24 sm:pt-28 max-w-2xl mx-auto w-full space-y-6 pb-20"
    >
      {/* Profile Header */}
      <div className="p-5 sm:p-6 rounded-3xl bg-paper dark:bg-night border border-black/10 dark:border-white/10 shadow-soft flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center font-display font-extrabold text-white text-xl shadow-md ring-4 ring-white dark:ring-night"
              style={{
                background: `linear-gradient(135deg, ${CURRENT_USER.avatarGradient[0]}, ${CURRENT_USER.avatarGradient[1]})`,
              }}
            >
              {CURRENT_USER.initials}
            </div>
            {isPremium && (
              <span
                title="Club Member"
                className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-marigold text-ink flex items-center justify-center shadow-xs border-2 border-white dark:border-night"
              >
                <Crown className="w-3.5 h-3.5 fill-ink" />
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-display font-extrabold text-xl text-ink dark:text-white">
                {CURRENT_USER.name}
              </h2>
              <span title="Verified Member" className="text-lagoon">
                <ShieldCheck className="w-5 h-5" />
              </span>
            </div>
            <p className="text-xs text-ink-muted mt-0.5">
              Bandra West, Mumbai • Member since Aug 2024
            </p>
          </div>
        </div>

        {/* Stats Pills */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="text-center px-3 py-1.5 rounded-2xl bg-black/5 dark:bg-white/5">
            <p className="font-display font-black text-base text-ink dark:text-white">
              {joinedPlanIds.length}
            </p>
            <p className="text-[10px] font-bold text-ink-muted uppercase">Joined</p>
          </div>
          <div className="text-center px-3 py-1.5 rounded-2xl bg-black/5 dark:bg-white/5">
            <p className="font-display font-black text-base text-ink dark:text-white">
              {myHostedPlanIds.length + CURRENT_USER.plansHosted}
            </p>
            <p className="text-[10px] font-bold text-ink-muted uppercase">Hosted</p>
          </div>
        </div>
      </div>

      {/* Invisible / Ghost Mode */}
      <div className="p-4 sm:p-5 rounded-3xl bg-paper dark:bg-night border border-black/10 dark:border-white/10 shadow-soft flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
              isInvisible ? 'bg-marigold text-ink' : 'bg-black/5 dark:bg-white/5 text-ink-muted'
            }`}
          >
            <EyeOff className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-display font-bold text-sm text-ink dark:text-white">
              Invisible Ghost Mode
            </h4>
            <p className="text-xs text-ink-muted">
              {isInvisible
                ? "You're hidden on the map. Your dot is a hollow ghost."
                : 'Your live radar dot is visible to nearby circles.'}
            </p>
          </div>
        </div>

        <button
          onClick={toggleInvisible}
          className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${
            isInvisible ? 'bg-marigold' : 'bg-black/20 dark:bg-white/20'
          }`}
        >
          <motion.span
            layout
            className={`block w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
              isInvisible ? 'translate-x-6' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>

      {/* Premium Club Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-ink to-night text-white border border-marigold/30 shadow-ambient space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 translate-x-4 -translate-y-4 opacity-10 pointer-events-none">
          <Crown className="w-32 h-32 text-marigold" />
        </div>

        <div className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-marigold fill-marigold" />
          <span className="text-xs font-black uppercase tracking-wider text-marigold">
            {isPremium ? 'Active Membership' : 'Upgrade to Club'}
          </span>
        </div>

        <div>
          <h3 className="font-display font-extrabold text-xl text-white">
            {isPremium ? 'Sangam Club Active' : 'Boost your plans to 3x reach'}
          </h3>
          <p className="text-xs text-white/70 max-w-sm mt-0.5">
            {isPremium
              ? 'Enjoy priority visibility, unlimited RSVPs, and golden badge.'
              : 'Unlimited joins, priority map placement, and exclusive members badge.'}
          </p>
        </div>

        <button
          onClick={onOpenPremium}
          className="mt-2 px-5 py-2.5 rounded-full bg-marigold text-ink font-display font-extrabold text-xs shadow-soft hover:brightness-105 active:scale-95 transition-all inline-flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isPremium ? 'Manage Membership' : 'Upgrade from ₹99/wk'}</span>
        </button>
      </div>

      {/* Referral Code Box */}
      <div className="p-4 sm:p-5 rounded-3xl bg-paper dark:bg-night border border-black/10 dark:border-white/10 shadow-soft space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-bougainvillea" />
            <h4 className="font-display font-bold text-sm text-ink dark:text-white">
              Invite Friends
            </h4>
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-bougainvillea/15 text-bougainvillea">
            1 of 3 invited
          </span>
        </div>

        <p className="text-xs text-ink-muted">
          Invite 3 friends to join any circle, get 1 month of Sangam Club free.
        </p>

        {/* Progress bar */}
        <div className="w-full h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
          <div className="h-full bg-bougainvillea rounded-full" style={{ width: '33%' }} />
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
          <code className="font-mono text-xs font-bold text-ink dark:text-white pl-2">
            {referralCode}
          </code>
          <button
            onClick={handleCopyReferral}
            className="px-3 py-1.5 rounded-xl bg-ink text-white dark:bg-white dark:text-ink font-bold text-xs flex items-center gap-1 hover:brightness-110 active:scale-95 transition-all"
          >
            {copiedReferral ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedReferral ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Settings: Theme, Notifications, Reset */}
      <div className="p-4 sm:p-5 rounded-3xl bg-paper dark:bg-night border border-black/10 dark:border-white/10 shadow-soft space-y-4">
        <h4 className="font-display font-bold text-sm text-ink dark:text-white uppercase tracking-wider">
          Preferences
        </h4>

        {/* Theme Picker */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-ink dark:text-white">Appearance</p>
            <p className="text-[11px] text-ink-muted">Switches map styles and interface</p>
          </div>

          <div className="p-1 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center gap-1">
            {[
              { id: 'auto' as const, label: 'Auto', icon: Laptop },
              { id: 'day' as const, label: 'Day', icon: Sun },
              { id: 'night' as const, label: 'Night', icon: Moon },
            ].map((t) => {
              const Icon = t.icon;
              const isSelected = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                    isSelected
                      ? 'bg-marigold text-ink shadow-xs'
                      : 'text-ink-muted hover:text-ink dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Notifications Toggles */}
        <div className="pt-2 border-t border-black/5 dark:border-white/5 space-y-2.5">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-xs font-semibold text-ink dark:text-white">
              Notify when someone joins your plan
            </span>
            <input
              type="checkbox"
              checked={notifyOnJoins}
              onChange={(e) => setNotifyOnJoins(e.target.checked)}
              className="accent-marigold"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-xs font-semibold text-ink dark:text-white">
              Notify for spontaneous plans starting within 30m
            </span>
            <input
              type="checkbox"
              checked={notifyOnNewPlans}
              onChange={(e) => setNotifyOnNewPlans(e.target.checked)}
              className="accent-marigold"
            />
          </label>
        </div>

        {/* Reset Demo Data Button */}
        <div className="pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
          <span className="text-xs text-ink-muted">Reset all simulated data & storage</span>
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-xl border border-black/10 dark:border-white/10 text-xs font-bold text-ink-muted hover:text-bougainvillea hover:border-bougainvillea transition-colors flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
