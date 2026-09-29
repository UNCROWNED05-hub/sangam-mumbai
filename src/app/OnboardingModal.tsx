import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../store/useAppStore';
import { CURRENT_USER } from '../data/people';
import { BRAND } from '../config/brand';
import {
  Navigation,
  Sparkles,
  ArrowRight,
  Check,
  Compass,
  Smile,
  ShieldCheck,
} from 'lucide-react';

const INTEREST_CHIPS = [
  'Badminton 🏸',
  'Specialty Coffee ☕',
  'Board Games 🎲',
  'Sunset Walks 🌅',
  'Acoustic Music 🎸',
  'Football ⚽',
  'Weekend Hikes 🥾',
  'Book Clubs 📚',
  'Street Food 🍜',
  'Cycling 🚴',
  'Yoga & Wellness 🧘',
  'Photography 📷',
];

const AVATAR_PALETTES = [
  ['#FFC21A', '#FF3D7F'],
  ['#10B5A5', '#4B3FA6'],
  ['#3B82F6', '#10B5A5'],
  ['#8B5CF6', '#EC4899'],
  ['#F59E0B', '#EF4444'],
];

export const OnboardingModal: React.FC = () => {
  const { onboardingDone, setOnboardingDone } = useAppStore();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [locating, setLocating] = useState(false);
  const [locationAllowed, setLocationAllowed] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Badminton 🏸',
    'Specialty Coffee ☕',
    'Sunset Walks 🌅',
  ]);
  const [userName, setUserName] = useState(CURRENT_USER.name);
  const [avatarIndex, setAvatarIndex] = useState(0);

  if (onboardingDone) return null;

  const handleAllowLocation = () => {
    setLocating(true);
    setTimeout(() => {
      setLocating(false);
      setLocationAllowed(true);
      setTimeout(() => setStep(2), 600);
    }, 900);
  };

  const handleToggleInterest = (chip: string) => {
    if (selectedInterests.includes(chip)) {
      setSelectedInterests(selectedInterests.filter((c) => c !== chip));
    } else {
      setSelectedInterests([...selectedInterests, chip]);
    }
  };

  const handleFinish = () => {
    setOnboardingDone(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/80 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 280 }}
        className="w-full max-w-md bg-paper dark:bg-night rounded-3xl border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col p-6 sm:p-8 space-y-6"
      >
        {/* Top header with Skip button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-marigold flex items-center justify-center font-display font-extrabold text-ink text-sm">
              S
            </span>
            <span className="font-display font-bold text-sm tracking-tight text-ink dark:text-white">
              Welcome to {BRAND.name}
            </span>
          </div>

          <button
            onClick={() => setOnboardingDone(true)}
            className="text-xs font-semibold text-ink-muted hover:text-ink dark:hover:text-white transition-colors"
          >
            Skip for now
          </button>
        </div>

        {/* Step 1: Location with Radar */}
        {step === 1 && (
          <div className="space-y-6 text-center">
            {/* Animated radar circle */}
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-lagoon/15 animate-ping" />
              <div className="absolute inset-2 rounded-full bg-lagoon/20 animate-pulse" />
              <div className="relative w-16 h-16 rounded-full bg-lagoon text-white flex items-center justify-center shadow-lg">
                <Navigation className="w-8 h-8" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-display font-black text-xl text-ink dark:text-white">
                Find spontaneous plans happening around you
              </h3>
              <p className="text-xs text-ink-soft dark:text-ink-muted leading-relaxed">
                {BRAND.name} is a live map of real-world gatherings. Enable location to explore
                Bandra, Marine Drive, and nearby hangouts.
              </p>
            </div>

            <button
              onClick={handleAllowLocation}
              disabled={locating}
              className="w-full py-3.5 px-6 rounded-full bg-marigold text-ink font-display font-extrabold text-sm shadow-soft hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {locating ? (
                <span>Locating nearby plans...</span>
              ) : locationAllowed ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Located in Mumbai!</span>
                </>
              ) : (
                <>
                  <Compass className="w-4 h-4" />
                  <span>Enable Location</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Step 2: Choose Interests */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="text-left space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-marigold">
                Step 2 of 3
              </span>
              <h3 className="font-display font-black text-xl text-ink dark:text-white">
                What do you love doing?
              </h3>
              <p className="text-xs text-ink-soft dark:text-ink-muted">
                Pick 3 or more to highlight relevant circles on your map.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto custom-scrollbar p-1">
              {INTEREST_CHIPS.map((chip) => {
                const isSelected = selectedInterests.includes(chip);
                return (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => handleToggleInterest(chip)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                      isSelected
                        ? 'bg-marigold text-ink border-transparent shadow-xs font-bold'
                        : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-ink dark:text-white hover:bg-black/10'
                    }`}
                  >
                    {chip}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setStep(3)}
              className="w-full py-3.5 px-6 rounded-full bg-marigold text-ink font-display font-extrabold text-sm shadow-soft hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 3: Name & Avatar */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="text-left space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-marigold">
                Step 3 of 3
              </span>
              <h3 className="font-display font-black text-xl text-ink dark:text-white">
                Set up your presence
              </h3>
              <p className="text-xs text-ink-soft dark:text-ink-muted">
                How other members will see you when you join a circle.
              </p>
            </div>

            <div className="flex items-center gap-4 p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-white font-extrabold text-lg shadow-md ring-2 ring-white dark:ring-night"
                style={{
                  background: `linear-gradient(135deg, ${AVATAR_PALETTES[avatarIndex][0]}, ${AVATAR_PALETTES[avatarIndex][1]})`,
                }}
              >
                {userName.slice(0, 2).toUpperCase()}
              </div>

              <div className="flex-1">
                <label className="text-[10px] font-bold text-ink-muted uppercase">Your Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-transparent font-bold text-sm text-ink dark:text-white focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-ink-muted uppercase tracking-wider mb-2">
                Choose color vibe
              </label>
              <div className="flex gap-2.5">
                {AVATAR_PALETTES.map((palette, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatarIndex(idx)}
                    className={`w-8 h-8 rounded-full shadow-xs transition-transform ${
                      avatarIndex === idx ? 'scale-125 ring-2 ring-marigold' : 'hover:scale-110'
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${palette[0]}, ${palette[1]})`,
                    }}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-3.5 px-6 rounded-full bg-bougainvillea text-white font-display font-extrabold text-base shadow-soft hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-marigold" />
              <span>Explore the Live Map</span>
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
