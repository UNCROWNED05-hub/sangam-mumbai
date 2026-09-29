import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHealthStore } from '../../store/useHealthStore';
import { GlucoseNumpad } from './GlucoseNumpad';
import { MealSearchInput } from './MealSearchInput';
import { PillShaker } from './PillShaker';
import { fireCelebrationConfetti } from '../ui/ConfettiTrigger';
import { soundFx } from '../../utils/sound';
import { X, Sparkles, Check, Activity, Utensils, Pill, FileText, Loader2 } from 'lucide-react';
import { MealItem } from '../../types';

export const LogEntryModal: React.FC = () => {
  const { isLogModalOpen, closeLogModal, activeLogCategory, addReading, user } = useHealthStore();

  const [activeTab, setActiveTab] = useState<'glucose' | 'meal' | 'medication' | 'note'>(
    activeLogCategory || 'glucose'
  );
  const [glucoseValue, setGlucoseValue] = useState('118');
  const [selectedMeal, setSelectedMeal] = useState<MealItem | null>(null);
  const [selectedMed, setSelectedMed] = useState<{ name: string; units: number; type: 'rapid' | 'long_acting' | 'oral' } | null>(null);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const charLimit = 140;
  const charsLeft = charLimit - notes.length;
  const isNearLimit = charsLeft < 20;

  if (!isLogModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playTap(900);
    setIsSubmitting(true);

    // Simulated short async network delay with button spinner
    await new Promise((r) => setTimeout(r, 600));

    addReading({
      value: parseInt(glucoseValue, 10) || 118,
      note: notes || undefined,
      meal: selectedMeal || undefined,
      medicationDose: selectedMed || undefined,
      trend: parseInt(glucoseValue, 10) > 140 ? 'rising' : 'stable',
    });

    setIsSubmitting(false);
    setIsSuccess(true);
    fireCelebrationConfetti();

    setTimeout(() => {
      setIsSuccess(false);
      closeLogModal();
      // Reset form
      setNotes('');
      setSelectedMeal(null);
      setSelectedMed(null);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeLogModal}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
      />

      {/* Modal Dialog Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="relative w-full max-w-lg glass-panel-glow rounded-3xl p-6 md:p-8 shadow-2xl border border-migo-purple/30 z-10 overflow-hidden"
      >
        {/* Glow ambient background inside modal */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-migo-purple/15 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-migo-purple/20 text-migo-purple-light">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-display font-bold text-xl text-white tracking-tight">
                Log Metabolic Biomarker
              </h3>
              <p className="text-xs text-slate-400">
                Synchronized with continuous telemetry stream
              </p>
            </div>
          </div>

          <button
            onClick={closeLogModal}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-900/80 rounded-2xl border border-white/[0.08] my-5">
          {(
            [
              { id: 'glucose', label: 'Glucose', icon: <Activity className="w-4 h-4" /> },
              { id: 'meal', label: 'Nutrition', icon: <Utensils className="w-4 h-4" /> },
              { id: 'medication', label: 'Rx Meds', icon: <Pill className="w-4 h-4" /> },
              { id: 'note', label: 'Journal', icon: <FileText className="w-4 h-4" /> },
            ] as const
          ).map((tab) => {
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  soundFx.playTap(900);
                }}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all select-none ${
                  isCurrent
                    ? 'bg-migo-purple text-white shadow-neon-purple'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
                data-interactive="true"
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <form onSubmit={handleSubmit}>
          <div className="min-h-[250px]">
            {activeTab === 'glucose' && (
              <motion.div
                key="tab-glucose"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                <GlucoseNumpad
                  value={glucoseValue}
                  onChange={setGlucoseValue}
                  unit={user.unit}
                />
              </motion.div>
            )}

            {activeTab === 'meal' && (
              <motion.div
                key="tab-meal"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MealSearchInput
                  selectedMeal={selectedMeal}
                  onSelectMeal={setSelectedMeal}
                />
              </motion.div>
            )}

            {activeTab === 'medication' && (
              <motion.div
                key="tab-meds"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                <PillShaker
                  selectedMed={selectedMed}
                  onSelectMedication={setSelectedMed}
                />
              </motion.div>
            )}

            {activeTab === 'note' && (
              <motion.div
                key="tab-notes"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="relative">
                  <textarea
                    rows={4}
                    value={notes}
                    maxLength={charLimit}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter contextual observations (e.g. post-cardio feeling, sleep quality, stress level)..."
                    className="w-full p-4 rounded-xl bg-slate-900/90 text-sm text-white placeholder-slate-500 border border-white/[0.1] focus:border-migo-purple focus:outline-none transition-all resize-none"
                  />
                  {/* Expanding underline */}
                  <div className="absolute bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-migo-purple to-migo-cyan" />
                </div>

                {/* Animated Character Count near limit */}
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Context aids metabolic AI predictions</span>
                  <motion.span
                    animate={{
                      scale: isNearLimit ? [1, 1.2, 1] : 1,
                      color: isNearLimit ? '#f43f5e' : '#94a3b8',
                    }}
                    transition={{ duration: 0.3 }}
                    className="font-mono font-bold"
                  >
                    {charsLeft} chars remaining
                  </motion.span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Submit Action Bar */}
          <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between gap-3">
            <div className="text-xs text-slate-400">
              Value: <strong className="text-white font-mono">{glucoseValue} {user.unit}</strong>
              {selectedMeal && <span className="text-cyan-400 ml-1">+{selectedMeal.name.slice(0, 15)}...</span>}
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting || isSuccess}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              className="relative px-6 py-3 rounded-2xl bg-gradient-to-r from-migo-purple via-indigo-600 to-migo-cyan text-white font-bold text-sm shadow-neon-purple flex items-center gap-2 overflow-hidden transition-all disabled:opacity-75"
              data-interactive="true"
              data-cursor-cta="Commit"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Syncing...</span>
                </>
              ) : isSuccess ? (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' }}
                  >
                    <Check className="w-4 h-4 text-emerald-300" />
                  </motion.div>
                  <span>Logged Successfully!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Record Entry</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
