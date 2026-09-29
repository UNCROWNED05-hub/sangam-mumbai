import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../../store/useAppStore';
import { Trip } from '../../data/trips';
import { AvatarStack } from '../../ui/AvatarStack';
import {
  Compass,
  Calendar,
  MapPin,
  CheckCircle,
  Circle,
  CreditCard,
  MessageCircle,
  X,
  ArrowRight,
} from 'lucide-react';

interface TripsTabProps {
  onOpenChat: (tripId: string) => void;
}

export const TripsTab: React.FC<TripsTabProps> = ({ onOpenChat }) => {
  const { trips, toggleChecklistItem, addToast } = useAppStore();
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(trips[0] || null);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div
      data-lenis-prevent
      className="flex-1 overflow-y-auto p-4 sm:p-8 pt-24 sm:pt-28 max-w-4xl mx-auto w-full space-y-6"
    >
      <div>
        <h2 className="font-display font-extrabold text-2xl text-ink dark:text-white">
          Crew Trips
        </h2>
        <p className="text-xs text-ink-soft dark:text-ink-muted mt-0.5">
          Plan weekend escapes, share itineraries, and pack together with your circle.
        </p>
      </div>

      {/* Trips Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {trips.map((trip) => {
          const checkedCount = trip.packingChecklist.filter((c) => c.done).length;

          return (
            <div
              key={trip.id}
              onClick={() => {
                setSelectedTrip(trip);
                setModalOpen(true);
              }}
              className="group p-5 rounded-3xl bg-paper dark:bg-night border border-black/10 dark:border-white/10 shadow-soft hover:border-marigold cursor-pointer transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-4xl group-hover:scale-110 transition-transform">
                    {trip.emoji}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-ink-muted">
                    {trip.dates.split('(')[0]}
                  </span>
                </div>

                <div>
                  <h3 className="font-display font-bold text-base text-ink dark:text-white leading-tight">
                    {trip.title}
                  </h3>
                  <p className="text-xs text-ink-muted flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-bougainvillea" />
                    <span>{trip.destination}</span>
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                <AvatarStack userIds={trip.memberIds} max={3} size="xs" />
                <span className="text-xs font-bold text-marigold flex items-center gap-0.5">
                  Itinerary →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trip Detail Modal */}
      <AnimatePresence>
        {modalOpen && selectedTrip && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-ink/75 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0 }}
              className="w-full max-w-xl bg-paper dark:bg-night rounded-3xl border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90dvh]"
            >
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl">{selectedTrip.emoji}</span>
                  <div>
                    <h3 className="font-display font-extrabold text-lg text-ink dark:text-white leading-tight">
                      {selectedTrip.title}
                    </h3>
                    <p className="text-xs text-ink-muted">{selectedTrip.dates}</p>
                  </div>
                </div>

                <button
                  onClick={() => setModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center hover:bg-black/10 transition-colors"
                >
                  <X className="w-4 h-4 text-ink dark:text-white" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
                {/* Crew & Budget Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-1.5">
                    <span className="text-[10px] font-bold text-ink-muted uppercase">Crew Going</span>
                    <div className="flex items-center gap-2">
                      <AvatarStack userIds={selectedTrip.memberIds} max={4} size="sm" />
                      <span className="text-xs font-bold">{selectedTrip.memberIds.length} packed</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-1">
                    <span className="text-[10px] font-bold text-ink-muted uppercase">Shared Estimate</span>
                    <p className="font-display font-extrabold text-base text-lagoon">
                      ₹{selectedTrip.budgetPerPerson.toLocaleString()}
                      <span className="text-[11px] font-normal text-ink-muted"> / person</span>
                    </p>
                  </div>
                </div>

                {/* Day-by-Day Itinerary Timeline */}
                <div className="space-y-3">
                  <h4 className="font-display font-bold text-sm text-ink dark:text-white uppercase tracking-wider">
                    Itinerary Timeline
                  </h4>
                  <div className="space-y-2 border-l-2 border-marigold/30 ml-2 pl-4">
                    {selectedTrip.itinerary.map((item, idx) => (
                      <div key={idx} className="relative space-y-0.5 pb-2">
                        {/* Dot */}
                        <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-marigold ring-4 ring-paper dark:ring-night" />
                        <div className="flex items-center gap-2 text-[11px] font-bold text-marigold">
                          <span>{item.day}</span>
                          <span>•</span>
                          <span>{item.time}</span>
                        </div>
                        <p className="text-xs text-ink-soft dark:text-ink-muted font-medium">
                          {item.activity}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Packing Checklist */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-display font-bold text-sm text-ink dark:text-white uppercase tracking-wider">
                      Shared Packing Checklist
                    </h4>
                    <span className="text-xs font-bold text-ink-muted">
                      {selectedTrip.packingChecklist.filter((c) => c.done).length} /{' '}
                      {selectedTrip.packingChecklist.length} ready
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {selectedTrip.packingChecklist.map((check, idx) => (
                      <button
                        key={idx}
                        onClick={() => toggleChecklistItem(selectedTrip.id, idx)}
                        className={`w-full p-2.5 rounded-2xl border text-left text-xs font-semibold flex items-center gap-2.5 transition-all ${
                          check.done
                            ? 'bg-lagoon/10 border-lagoon/30 text-ink dark:text-white'
                            : 'bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/10 text-ink-soft dark:text-ink-muted hover:bg-black/10'
                        }`}
                      >
                        {check.done ? (
                          <CheckCircle className="w-4 h-4 text-lagoon flex-shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-ink-muted flex-shrink-0" />
                        )}
                        <span className={check.done ? 'line-through opacity-70' : ''}>
                          {check.item}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-4 sm:p-5 border-t border-black/10 dark:border-white/10 bg-paper/90 dark:bg-night/90 flex items-center justify-between">
                <button
                  onClick={() => {
                    setModalOpen(false);
                    addToast(`Joined "${selectedTrip.title}" trip group!`);
                  }}
                  className="w-full py-3 px-6 rounded-full bg-marigold text-ink font-display font-extrabold text-sm shadow-soft hover:brightness-105 active:scale-95 transition-all text-center"
                >
                  Join Trip Crew
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
