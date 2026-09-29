import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, CloudSun, Sunset, Compass, Sparkles, Clock } from 'lucide-react';
import { useHealthStore } from '../../store/useHealthStore';
import { TimeOfDay } from '../../types';
import { soundFx } from '../../utils/sound';

export const CircadianWidget: React.FC = () => {
  const { timeOfDay, setTimeOfDay } = useHealthStore();

  const circadianModes: Array<{
    id: TimeOfDay;
    label: string;
    icon: React.ReactNode;
    phase: string;
    insulinSensitivity: string;
    status: string;
    temp: string;
  }> = [
    {
      id: 'dawn',
      label: 'Dawn',
      icon: <CloudSun className="w-4 h-4 text-rose-400" />,
      phase: 'Cortisol Awaken Phase (6:00 - 9:00)',
      insulinSensitivity: 'Moderate (Hepatic output rising)',
      status: 'Fast-breaking optimal',
      temp: '18°C Fresh Breeze',
    },
    {
      id: 'noon',
      label: 'Noon',
      icon: <Sun className="w-4 h-4 text-cyan-400" />,
      phase: 'Peak Metabolic Velocity (11:00 - 14:00)',
      insulinSensitivity: 'High (GLUT4 receptor affinity +28%)',
      status: 'Prime carb tolerance',
      temp: '26°C Clear Skies',
    },
    {
      id: 'sunset',
      label: 'Sunset',
      icon: <Sunset className="w-4 h-4 text-amber-400" />,
      phase: 'Metabolic Taper Phase (17:00 - 20:00)',
      insulinSensitivity: 'Diminishing (Prepare for fasting)',
      status: 'Light dinner buffer',
      temp: '22°C Golden Hour',
    },
    {
      id: 'midnight',
      label: 'Midnight',
      icon: <Moon className="w-4 h-4 text-purple-400" />,
      phase: 'Melatonin & Deep REM Repair (22:00 - 5:00)',
      insulinSensitivity: 'Basal Low (Cellular autophagy)',
      status: 'Homeostatic fast',
      temp: '16°C Quiet Night',
    },
    {
      id: 'realtime',
      label: 'Auto Realtime',
      icon: <Clock className="w-4 h-4 text-emerald-400" />,
      phase: 'Synchronized with Device Chronobiology',
      insulinSensitivity: 'Continuous Biological Feedback',
      status: 'Live Clock Sync',
      temp: '21°C Mild',
    }
  ];

  const currentMode = circadianModes.find((m) => m.id === timeOfDay) || circadianModes[0];

  return (
    <div className="glass-panel rounded-2xl p-5 md:p-6 border border-white/[0.08] shadow-glass relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-white/[0.06] text-migo-purple-light">
              <Compass className="w-4 h-4" />
            </span>
            <h3 className="font-display font-bold text-white text-base tracking-tight">
              Circadian Chronobiology & Ambient Weather
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/20 font-mono">
              {currentMode.temp}
            </span>
          </div>

          <div className="mt-2 space-y-1">
            <p className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-migo-purple-light" />
              <span>{currentMode.phase}</span>
            </p>
            <p className="text-xs text-slate-400">
              Insulin Affinity: <strong className="text-white">{currentMode.insulinSensitivity}</strong> • {currentMode.status}
            </p>
          </div>
        </div>

        {/* Circadian Mode Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-white/[0.08] overflow-x-auto w-full md:w-auto">
          {circadianModes.map((mode) => {
            const isSelected = timeOfDay === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => {
                  setTimeOfDay(mode.id);
                  soundFx.playTap(1000);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  isSelected
                    ? 'bg-migo-purple text-white shadow-neon-purple scale-100'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                }`}
                data-interactive="true"
              >
                {mode.icon}
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
