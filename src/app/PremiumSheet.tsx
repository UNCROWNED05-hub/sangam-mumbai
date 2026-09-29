import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../store/useAppStore';
import { BRAND } from '../config/brand';
import { Odometer } from '../ui/Odometer';
import confetti from 'canvas-confetti';
import {
  Crown,
  Check,
  X,
  Sparkles,
  Zap,
  Shield,
  Layers,
  Loader2,
} from 'lucide-react';

interface PremiumSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PremiumSheet: React.FC<PremiumSheetProps> = ({ isOpen, onClose }) => {
  const { isPremium, setPremium, addToast } = useAppStore();
  const [tier, setTier] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const prices = {
    weekly: 99,
    monthly: 249,
    yearly: 1499,
  };

  const priceValue = prices[tier];

  const handleSubscribe = async () => {
    setProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setProcessing(false);
    setSuccess(true);
    setPremium(true);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        colors: ['#FFC21A', '#FF3D7F', '#10B5A5'],
      });
    } catch {
      // Ignore
    }

    addToast(`Welcome to ${BRAND.name} Club! Crown unlocked.`);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/75 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 280 }}
        className="w-full max-w-md bg-paper dark:bg-night rounded-3xl border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col p-6 sm:p-7 space-y-5"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-marigold flex items-center justify-center text-ink">
              <Crown className="w-4 h-4 fill-ink" />
            </div>
            <h3 className="font-display font-black text-lg text-ink dark:text-white">
              {BRAND.name} Club
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center hover:bg-black/10 transition-colors"
          >
            <X className="w-4 h-4 text-ink dark:text-white" />
          </button>
        </div>

        {/* Hero description */}
        <div>
          <h4 className="font-display font-extrabold text-2xl text-ink dark:text-white">
            Level up your local social circle
          </h4>
          <p className="text-xs text-ink-soft dark:text-ink-muted mt-1 leading-relaxed">
            Get your spontaneous plans seen first, bypass waitlists, and enjoy priority community status.
          </p>
        </div>

        {/* Segmented Duration Picker with sliding thumb */}
        <div className="p-1 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 grid grid-cols-3 relative">
          {(['weekly', 'monthly', 'yearly'] as const).map((t) => {
            const isSelected = tier === t;
            return (
              <button
                key={t}
                onClick={() => setTier(t)}
                className={`relative py-2 rounded-xl text-xs font-bold capitalize transition-colors z-10 ${
                  isSelected ? 'text-ink dark:text-night font-extrabold' : 'text-ink-muted hover:text-ink dark:hover:text-white'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="premiumSegmentThumb"
                    className="absolute inset-0 bg-marigold rounded-xl shadow-xs"
                    transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                  />
                )}
                <span className="relative z-10">{t}</span>
              </button>
            );
          })}
        </div>

        {/* Animated Price display using Odometer */}
        <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-baseline justify-center gap-1.5">
          <span className="font-display font-bold text-lg text-ink-muted">₹</span>
          <Odometer value={priceValue} className="font-display font-black text-4xl text-ink dark:text-white" />
          <span className="text-xs text-ink-muted font-bold">
            / {tier === 'weekly' ? 'week' : tier === 'monthly' ? 'month' : 'year'}
          </span>
        </div>

        {/* Perks list */}
        <div className="space-y-2.5">
          {[
            { icon: Zap, text: 'Boost your plan to 3x map radius and top visibility' },
            { icon: Shield, text: 'Unlimited RSVPs and skip waitlists on popular plans' },
            { icon: Layers, text: 'Advanced filters (vibe, neighborhood clusters, time scrubber)' },
            { icon: Crown, text: 'Golden crown badge next to your profile and chat messages' },
          ].map((perk, i) => {
            const Icon = perk.icon;
            return (
              <div key={i} className="flex items-start gap-2.5 text-xs text-ink dark:text-white">
                <Icon className="w-4 h-4 text-marigold flex-shrink-0 mt-0.5" />
                <span className="leading-snug">{perk.text}</span>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="pt-2">
          {success ? (
            <div className="py-3 px-6 rounded-full bg-lagoon text-white font-display font-bold text-center flex items-center justify-center gap-2 shadow-soft">
              <Check className="w-5 h-5 stroke-[3]" />
              <span>Crown Unlocked!</span>
            </div>
          ) : (
            <button
              onClick={handleSubscribe}
              disabled={processing}
              className="w-full py-3.5 px-6 rounded-full bg-marigold text-ink font-display font-extrabold text-base shadow-soft hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Activating membership...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Join Sangam Club • ₹{priceValue}</span>
                </>
              )}
            </button>
          )}

          <p className="text-[10px] text-ink-muted text-center mt-2">
            Simulated demonstration payment. No real credit card or charges.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
