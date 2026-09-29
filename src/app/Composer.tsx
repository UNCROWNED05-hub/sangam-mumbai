import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plan, PlanCategory, PLAN_CATEGORIES } from '../data/plans';
import { CITY } from '../config/city';
import { useAppStore } from '../store/useAppStore';
import { CURRENT_USER } from '../data/people';
import {
  X,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Clock,
  Users,
  ShieldCheck,
  Sparkles,
  Check,
  CheckCircle2,
  Crosshair,
} from 'lucide-react';

interface ComposerProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanCreated: (plan: Plan) => void;
  onTogglePlaceMode: (active: boolean) => void;
  selectedLocation: { lngLat: [number, number]; placeName: string };
}

const POPULAR_EMOJIS = [
  '⚡', '🏸', '☕', '🏃', '🎸', '🎲', '🧘', '🍕', '📚', '🌅',
  '🎨', '🚴', '🥾', '🏏', '🎤', '🎬', '🍦', '🍜', '⛺', '🏊',
];

const VIBE_OPTIONS = [
  'Friendly',
  'Beginners welcome',
  'Chai afterwards',
  'Casual pace',
  'Bring extra gear',
  'Pet friendly',
  'All skill levels',
  'Public place',
];

export const Composer: React.FC<ComposerProps> = ({
  isOpen,
  onClose,
  onPlanCreated,
  onTogglePlaceMode,
  selectedLocation,
}) => {
  const { createPlan, addToast } = useAppStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [title, setTitle] = useState('');
  const [emoji, setEmoji] = useState('🏸');
  const [category, setCategory] = useState<PlanCategory>('Sports');
  const [timeOption, setTimeOption] = useState<'30m' | '60m' | 'tonight' | 'tomorrow'>('60m');
  const [durationMin, setDurationMin] = useState(90);
  const [isPublicPlace, setIsPublicPlace] = useState(true);
  const [capacity, setCapacity] = useState(6);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedVibes, setSelectedVibes] = useState<string[]>(['Friendly', 'Public place']);
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleNext = () => {
    if (step === 3) {
      onTogglePlaceMode(false);
    }
    if (step < 5) setStep((s) => (s + 1) as any);
  };

  const handleBack = () => {
    if (step === 4) {
      // Re-enable place mode if backing into step 3
      onTogglePlaceMode(true);
    } else {
      onTogglePlaceMode(false);
    }
    if (step > 1) setStep((s) => (s - 1) as any);
  };

  const handleStep3Enter = () => {
    onTogglePlaceMode(true);
  };

  const handleToggleVibe = (tag: string) => {
    if (selectedVibes.includes(tag)) {
      setSelectedVibes(selectedVibes.filter((t) => t !== tag));
    } else {
      setSelectedVibes([...selectedVibes, tag]);
    }
  };

  const handlePost = () => {
    let startsInMin = 60;
    if (timeOption === '30m') startsInMin = 30;
    else if (timeOption === '60m') startsInMin = 60;
    else if (timeOption === 'tonight') startsInMin = 180;
    else if (timeOption === 'tomorrow') startsInMin = 720;

    const newPlan = createPlan({
      title: title.trim() || 'Spontaneous Hangout',
      emoji,
      category,
      startsInMin,
      durationMin,
      place: {
        name: selectedLocation.placeName || 'Near Bandra Bandstand',
        area: 'Bandra West',
        lngLat: selectedLocation.lngLat,
        isPublic: true,
      },
      capacity,
      vibeTags: selectedVibes,
      description:
        description.trim() ||
        `Spontaneous ${category.toLowerCase()} plan posted on Sangam. Come join the circle!`,
    });

    onTogglePlaceMode(false);
    onPlanCreated(newPlan);
    addToast('Posted to the map.');
    onClose();
  };

  return (
    <div
      data-lenis-prevent
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-ink/75 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 16 }}
        transition={{ type: 'spring', damping: 25, stiffness: 280 }}
        className="w-full max-w-lg bg-paper dark:bg-night rounded-3xl border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[92dvh]"
      >
        {/* Header with Step Indicator */}
        <div className="p-4 sm:p-5 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {step > 1 && (
              <button
                onClick={handleBack}
                aria-label="Back step"
                className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center hover:bg-black/10 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-ink dark:text-white" />
              </button>
            )}
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-marigold">
                Step {step} of 5
              </span>
              <h2 className="font-display font-extrabold text-base sm:text-lg text-ink dark:text-white leading-tight">
                {step === 1 && "What's the plan?"}
                {step === 2 && 'When are you meeting?'}
                {step === 3 && 'Pick a public spot'}
                {step === 4 && 'Who can join?'}
                {step === 5 && 'Review and Post'}
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              onTogglePlaceMode(false);
              onClose();
            }}
            aria-label="Close composer"
            className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center hover:bg-black/10 transition-colors"
          >
            <X className="w-4 h-4 text-ink dark:text-white" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-black/5 dark:bg-white/5">
          <div
            className="h-full bg-marigold transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 custom-scrollbar">
          {/* STEP 1: What's the plan? */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-ink-muted uppercase tracking-wider mb-1.5">
                  Plan Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Sunset acoustic jam on Bandstand"
                  className="w-full px-4 py-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm font-semibold text-ink dark:text-white placeholder:text-ink-muted focus:outline-hidden focus:border-marigold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-muted uppercase tracking-wider mb-2">
                  Pick an Icon
                </label>
                <div className="grid grid-cols-10 gap-1.5 p-2 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                  {POPULAR_EMOJIS.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setEmoji(e)}
                      className={`h-9 flex items-center justify-center text-lg rounded-xl transition-all ${
                        emoji === e
                          ? 'bg-marigold text-ink shadow-sm scale-110'
                          : 'hover:bg-black/5 dark:hover:bg-white/10'
                      }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-muted uppercase tracking-wider mb-2">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {PLAN_CATEGORIES.map((cat: PlanCategory) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                        category === cat
                          ? 'bg-ink text-white dark:bg-marigold dark:text-ink border-transparent shadow-xs'
                          : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-ink dark:text-white hover:bg-black/10'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: When? */}
          {step === 2 && (
            <div className="space-y-4">
              <label className="block text-xs font-bold text-ink-muted uppercase tracking-wider mb-2">
                Starting Time
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: '30m', label: 'In 30 minutes', sub: 'Starting soon' },
                  { id: '60m', label: 'In 1 hour', sub: 'Most popular' },
                  { id: 'tonight', label: 'Tonight (7:30 pm)', sub: 'Evening plans' },
                  { id: 'tomorrow', label: 'Tomorrow morning', sub: '7:00 am sunrise' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTimeOption(opt.id as any)}
                    className={`p-3.5 rounded-2xl text-left border transition-all ${
                      timeOption === opt.id
                        ? 'bg-marigold/20 border-marigold text-ink dark:text-marigold shadow-xs'
                        : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-ink dark:text-white hover:bg-black/10'
                    }`}
                  >
                    <p className="font-bold text-sm">{opt.label}</p>
                    <p className="text-xs text-ink-muted mt-0.5">{opt.sub}</p>
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-ink-muted uppercase tracking-wider">
                    Expected Duration
                  </label>
                  <span className="text-xs font-bold text-marigold">{durationMin} minutes</span>
                </div>
                <input
                  type="range"
                  min={30}
                  max={180}
                  step={15}
                  value={durationMin}
                  onChange={(e) => setDurationMin(Number(e.target.value))}
                  className="w-full accent-marigold cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-ink-muted mt-1">
                  <span>30 mins</span>
                  <span>1.5 hours</span>
                  <span>3 hours</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Where? (Place Mode) */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-lagoon/10 border border-lagoon/30 flex items-start gap-3">
                <Crosshair className="w-5 h-5 text-lagoon flex-shrink-0 mt-0.5 animate-pulse" />
                <div className="text-xs text-ink dark:text-white">
                  <p className="font-bold">Place mode active on map</p>
                  <p className="text-ink-soft dark:text-ink-muted mt-0.5">
                    Drag the map in the background to position your gathering pin.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink-muted uppercase tracking-wider mb-1.5">
                  Selected Spot
                </label>
                <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center gap-2.5">
                  <MapPin className="w-5 h-5 text-bougainvillea flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-sm text-ink dark:text-white truncate">
                      {selectedLocation.placeName}
                    </p>
                    <p className="text-xs text-ink-muted">
                      Coords: {selectedLocation.lngLat[0].toFixed(4)},{' '}
                      {selectedLocation.lngLat[1].toFixed(4)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Landmark Chips */}
              <div>
                <label className="block text-xs font-bold text-ink-muted uppercase tracking-wider mb-1.5">
                  Or pick a popular landmark:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {CITY.anchors.slice(0, 6).map((anchor) => (
                    <button
                      key={anchor.name}
                      type="button"
                      onClick={() => {
                        selectedLocation.lngLat[0] = anchor.lngLat[0];
                        selectedLocation.lngLat[1] = anchor.lngLat[1];
                        selectedLocation.placeName = `Near ${anchor.name}`;
                      }}
                      className="px-2.5 py-1 rounded-full text-xs font-semibold bg-black/5 dark:bg-white/10 hover:bg-marigold hover:text-ink transition-colors"
                    >
                      {anchor.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Public Place Requirement */}
              <label className="flex items-start gap-2.5 p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublicPlace}
                  onChange={(e) => setIsPublicPlace(e.target.checked)}
                  className="mt-0.5 accent-lagoon"
                />
                <span className="text-xs text-ink dark:text-white leading-relaxed">
                  <strong className="block text-ink dark:text-white">This is a public place</strong>
                  Sangam plans must be in publicly accessible spaces (cafes, promenades, parks, turfs).
                </span>
              </label>
            </div>
          )}

          {/* STEP 4: Who can join? */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-ink-muted uppercase tracking-wider">
                    Group Capacity
                  </label>
                  <span className="text-sm font-black text-marigold">{capacity} people</span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={20}
                  step={1}
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  className="w-full accent-marigold cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-ink-muted mt-1">
                  <span>Small (2)</span>
                  <span>Medium (8)</span>
                  <span>Large circle (20)</span>
                </div>
              </div>

              {/* Verified members toggle */}
              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-lagoon" />
                  <div>
                    <p className="text-xs font-bold text-ink dark:text-white">
                      Verified members only
                    </p>
                    <p className="text-[11px] text-ink-muted">
                      Requires phone & ID verified Sangam badge to RSVP
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="w-4 h-4 accent-lagoon"
                />
              </label>

              {/* Vibe Tags */}
              <div>
                <label className="block text-xs font-bold text-ink-muted uppercase tracking-wider mb-2">
                  Vibe Tags
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {VIBE_OPTIONS.map((tag) => {
                    const isSelected = selectedVibes.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleToggleVibe(tag)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
                          isSelected
                            ? 'bg-marigold text-ink border-transparent shadow-xs'
                            : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-ink dark:text-white'
                        }`}
                      >
                        #{tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-ink-muted uppercase tracking-wider mb-1.5">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Give a quick hint on what you're doing, what to bring, and where to meet."
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs text-ink dark:text-white placeholder:text-ink-muted focus:outline-hidden focus:border-marigold"
                />
              </div>
            </div>
          )}

          {/* STEP 5: Review & Post */}
          {step === 5 && (
            <div className="space-y-4">
              <p className="text-xs text-ink-muted uppercase font-bold tracking-wider">
                Preview your map card
              </p>

              {/* Review Card */}
              <div className="p-4 rounded-3xl bg-white dark:bg-night border-2 border-bougainvillea shadow-soft space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{emoji}</span>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-bougainvillea/20 text-bougainvillea">
                        Your plan • {category}
                      </span>
                      <h3 className="font-display font-bold text-base text-ink dark:text-white mt-0.5">
                        {title || 'Spontaneous Hangout'}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-ink-soft dark:text-ink-muted">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-bougainvillea" />
                    <span>{selectedLocation.placeName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-marigold" />
                    <span>Duration: {durationMin} mins</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-lagoon" />
                    <span>
                      1 / {capacity} spots (You are hosting)
                      {verifiedOnly && ' • Verified only'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {selectedVibes.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-[10px] font-semibold text-ink dark:text-white"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="p-4 sm:p-5 border-t border-black/10 dark:border-white/10 bg-paper/90 dark:bg-night/90 flex items-center justify-between">
          {step < 5 ? (
            <button
              onClick={() => {
                if (step === 2) handleStep3Enter();
                handleNext();
              }}
              disabled={step === 1 && !title.trim()}
              className="ml-auto px-6 py-3 rounded-full bg-marigold text-ink font-display font-extrabold text-sm shadow-soft hover:brightness-105 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handlePost}
              className="w-full py-3.5 px-6 rounded-full bg-bougainvillea text-white font-display font-extrabold text-base shadow-soft hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-marigold" />
              <span>Post to map</span>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
