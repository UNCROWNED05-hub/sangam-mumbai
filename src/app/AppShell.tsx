import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { BRAND } from '../config/brand';
import { ArrowLeft } from 'lucide-react';

export const AppShell: React.FC = () => {
  const navigate = useNavigate();
  const { plans, selectedPlanId, activeTab, setActiveTab } = useAppStore();

  return (
    <div className="min-h-screen bg-paper dark:bg-night text-ink dark:text-white flex flex-col">
      <header className="p-4 border-b border-line flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="font-display font-extrabold text-lg text-ink dark:text-white">
            {BRAND.name.toLowerCase()} map
          </span>
        </div>
        <span className="text-xs font-bold text-lagoon px-2.5 py-1 rounded-full bg-lagoon/10">
          {plans.length} Live Plans Loaded
        </span>
      </header>

      <main className="flex-1 flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4">
          <h2 className="text-2xl font-bold font-display">Live App Shell Initialized</h2>
          <p className="text-sm text-ink-soft">
            Phase 1 Foundation complete. App Map, Bubbles, and Sheet ready for Phase 3.
          </p>
        </div>
      </main>
    </div>
  );
};
