import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { soundFx } from '../../utils/sound';
import { firePillConfetti } from '../ui/ConfettiTrigger';
import { Pill, Plus, Check } from 'lucide-react';

interface PillShakerProps {
  onSelectMedication: (med: { name: string; units: number; type: 'rapid' | 'long_acting' | 'oral' } | null) => void;
  selectedMed: { name: string; units: number; type: 'rapid' | 'long_acting' | 'oral' } | null;
}

export const PillShaker: React.FC<PillShakerProps> = ({ onSelectMedication, selectedMed }) => {
  const [shakingBottle, setShakingBottle] = useState<string | null>(null);

  const medications = [
    { id: 'm1', name: 'Metformin XR', defaultUnits: 500, unitLabel: 'mg', type: 'oral' as const, color: '#8b5cf6' },
    { id: 'm2', name: 'GLP-1 Analog', defaultUnits: 0.5, unitLabel: 'mg', type: 'rapid' as const, color: '#06b6d4' },
    { id: 'm3', name: 'Rapid Insulin', defaultUnits: 4, unitLabel: 'units', type: 'rapid' as const, color: '#f43f5e' },
    { id: 'm4', name: 'Basal Glargine', defaultUnits: 18, unitLabel: 'units', type: 'long_acting' as const, color: '#10b981' },
  ];

  const handleBottleClick = (med: typeof medications[0]) => {
    setShakingBottle(med.id);
    soundFx.playPillRattle();
    firePillConfetti();

    onSelectMedication({
      name: med.name,
      units: med.defaultUnits,
      type: med.type,
    });

    setTimeout(() => {
      setShakingBottle(null);
    }, 600);
  };

  return (
    <div className="space-y-3">
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
        Tap bottle to shake & log dosage
      </span>

      <div className="grid grid-cols-2 gap-3">
        {medications.map((med) => {
          const isSelected = selectedMed?.name === med.name;
          const isShaking = shakingBottle === med.id;

          return (
            <motion.div
              key={med.id}
              animate={
                isShaking
                  ? {
                      rotate: [-8, 8, -6, 6, -3, 3, 0],
                      y: [-4, 0, -4, 0],
                    }
                  : { rotate: 0, y: 0 }
              }
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => handleBottleClick(med)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all select-none relative overflow-hidden flex flex-col items-center text-center ${
                isSelected
                  ? 'bg-migo-purple/20 border-migo-purple shadow-neon-purple'
                  : 'glass-panel-subtle border-white/[0.08] hover:border-white/[0.2]'
              }`}
              data-interactive="true"
            >
              {/* Bottle Visual */}
              <div
                className="w-12 h-16 rounded-xl flex flex-col items-center justify-between p-1.5 mb-2 relative shadow-md"
                style={{
                  backgroundColor: `${med.color}22`,
                  borderColor: med.color,
                  borderWidth: 2,
                }}
              >
                {/* Bottle Cap */}
                <div className="w-7 h-2 rounded-t-sm bg-white/70 shadow-sm" />
                {/* Pill Icon */}
                <Pill className="w-5 h-5" style={{ color: med.color }} />
                {/* Pill Label on bottle */}
                <div className="w-full bg-white/10 rounded py-0.5 text-[8px] font-bold text-white uppercase tracking-tighter">
                  Rx
                </div>
              </div>

              <span className="text-xs font-bold text-white block truncate w-full">
                {med.name}
              </span>
              <span className="text-[11px] font-mono text-slate-300 mt-0.5">
                {med.defaultUnits} {med.unitLabel}
              </span>

              {isSelected && (
                <div className="absolute top-2 right-2 p-1 rounded-full bg-migo-purple text-white">
                  <Check className="w-3 h-3" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {selectedMed && (
        <div className="flex items-center justify-between text-xs px-3 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300">
          <span>Active: <strong>{selectedMed.name}</strong> ({selectedMed.units} dose)</span>
          <button
            type="button"
            onClick={() => onSelectMedication(null)}
            className="text-rose-400 hover:text-rose-300 ml-2"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
};
