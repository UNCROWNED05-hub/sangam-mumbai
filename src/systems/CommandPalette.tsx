import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command } from 'cmdk';
import { useAppStore } from '../store/useAppStore';
import {
  Search,
  MapPin,
  Calendar,
  MessageSquare,
  Compass,
  Moon,
  Sun,
  EyeOff,
  Plus,
  ArrowRight,
} from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const {
    plans,
    selectPlan,
    setActiveTab,
    setTheme,
    effectiveTheme,
    toggleInvisible,
    setComposerOpen,
  } = useAppStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-ink/70 backdrop-blur-xs flex items-start justify-center pt-20 p-4">
      <div className="w-full max-w-lg bg-paper dark:bg-night rounded-3xl border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col">
        <Command className="w-full">
          <div className="flex items-center px-4 py-3 border-b border-black/10 dark:border-white/10 gap-2.5">
            <Search className="w-4 h-4 text-ink-muted" />
            <Command.Input
              placeholder="Search plans, actions, or jump to tabs... (Esc to close)"
              className="w-full bg-transparent text-sm text-ink dark:text-white placeholder:text-ink-muted focus:outline-hidden"
              autoFocus
            />
          </div>

          <Command.List className="max-h-80 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            <Command.Empty className="p-4 text-xs text-ink-muted text-center">
              No matching results found.
            </Command.Empty>

            <Command.Group heading="Quick Actions" className="text-[10px] font-bold text-ink-muted uppercase px-3 py-1">
              <Command.Item
                onSelect={() => {
                  setOpen(false);
                  navigate('/app');
                  setComposerOpen(true);
                }}
                className="p-2.5 rounded-2xl flex items-center justify-between text-xs font-semibold text-ink dark:text-white hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-marigold" />
                  <span>Post a new gathering to map</span>
                </div>
                <span className="text-[10px] text-ink-muted">Action</span>
              </Command.Item>

              <Command.Item
                onSelect={() => {
                  setOpen(false);
                  setTheme(effectiveTheme === 'dark' ? 'day' : 'night');
                }}
                className="p-2.5 rounded-2xl flex items-center justify-between text-xs font-semibold text-ink dark:text-white hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  {effectiveTheme === 'dark' ? (
                    <Sun className="w-4 h-4 text-marigold" />
                  ) : (
                    <Moon className="w-4 h-4 text-ink-soft" />
                  )}
                  <span>Toggle Day / Night map theme</span>
                </div>
                <span className="text-[10px] text-ink-muted">Theme</span>
              </Command.Item>

              <Command.Item
                onSelect={() => {
                  setOpen(false);
                  toggleInvisible();
                }}
                className="p-2.5 rounded-2xl flex items-center justify-between text-xs font-semibold text-ink dark:text-white hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <EyeOff className="w-4 h-4 text-bougainvillea" />
                  <span>Toggle Invisible Ghost Mode</span>
                </div>
                <span className="text-[10px] text-ink-muted">Privacy</span>
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Live Plans Nearby" className="text-[10px] font-bold text-ink-muted uppercase px-3 py-1 pt-2">
              {plans.slice(0, 8).map((plan) => (
                <Command.Item
                  key={plan.id}
                  onSelect={() => {
                    setOpen(false);
                    navigate(`/app?plan=${plan.id}`);
                    selectPlan(plan.id, true);
                  }}
                  className="p-2.5 rounded-2xl flex items-center justify-between text-xs font-semibold text-ink dark:text-white hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-base">{plan.emoji}</span>
                    <span className="truncate">{plan.title}</span>
                  </div>
                  <span className="text-[10px] text-ink-muted flex-shrink-0">
                    {plan.place.area}
                  </span>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
};
