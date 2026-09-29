import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Plan } from '../data/plans';
import { getPerson, CURRENT_USER, PEOPLE } from '../data/people';
import { Avatar } from '../ui/Avatar';
import { AvatarStack } from '../ui/AvatarStack';
import { useAppStore } from '../store/useAppStore';
import {
  X,
  MapPin,
  Clock,
  Users,
  Check,
  Share2,
  UserPlus,
  Flag,
  Calendar,
  MessageCircle,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface PlanSheetProps {
  plan: Plan | null;
  onClose: () => void;
  onOpenChat: (planId: string) => void;
}

export const PlanSheet: React.FC<PlanSheetProps> = ({
  plan,
  onClose,
  onOpenChat,
}) => {
  const {
    joinedPlanIds,
    myHostedPlanIds,
    joinPlan,
    leavePlan,
    addToast,
  } = useAppStore();

  const [isJoining, setIsJoining] = useState(false);
  const [justJoined, setJustJoined] = useState(false);
  const [bringFriendCount, setBringFriendCount] = useState(0);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const joinBtnRef = useRef<HTMLButtonElement | null>(null);

  if (!plan) return null;

  const host = getPerson(plan.hostId);
  const isJoined = joinedPlanIds.includes(plan.id);
  const isMine = myHostedPlanIds.includes(plan.id) || plan.hostId === CURRENT_USER.id;
  const isFull = plan.goingIds.length >= plan.capacity;
  const spotsLeft = plan.capacity - plan.goingIds.length;

  // Hero Join Interaction (Section 8.4)
  const handleJoinClick = async (e: React.MouseEvent) => {
    if (isJoined || isMine || isJoining) return;

    setIsJoining(true);

    // Compute button center for confetti
    const rect = joinBtnRef.current?.getBoundingClientRect();
    const cx = rect ? (rect.left + rect.width / 2) / window.innerWidth : 0.5;
    const cy = rect ? (rect.top + rect.height / 2) / window.innerHeight : 0.5;

    // Simulated latency 300 to 700 ms
    await new Promise((resolve) => setTimeout(resolve, 450));

    // Execute state update
    joinPlan(plan.id, bringFriendCount > 0);
    setIsJoining(false);
    setJustJoined(true);

    // Confetti burst: 60 particles, brand colors
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { x: cx, y: cy },
        colors: ['#FFC21A', '#FF3D7F', '#10B5A5', '#14163A'],
        scalar: 0.85,
        zIndex: 9999,
      });
    } catch {
      // Ignore in test or headless
    }

    // Vibration haptic where supported
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(12);
      } catch {
        // Ignore
      }
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/app?plan=${plan.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      addToast('Plan link copied to clipboard!');
    }
  };

  const handleToggleFriend = () => {
    if (bringFriendCount === 0) {
      setBringFriendCount(1);
      addToast('Plus one friend added to reservation!');
    } else {
      setBringFriendCount(0);
      addToast('Plus one removed.');
    }
  };

  const handleCalendar = () => {
    addToast('Calendar event added to your schedule.');
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    setReportSubmitted(true);
    setTimeout(() => {
      setShowReportModal(false);
      setReportSubmitted(false);
      addToast('Thank you for keeping Sangam safe. Our team is on it.');
    }, 1200);
  };

  return (
    <>
      {/* Desktop Drawer (Right 420px) / Mobile Bottom Sheet */}
      <motion.aside
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 26, stiffness: 280 }}
        data-lenis-prevent
        className="fixed inset-y-0 right-0 z-40 w-full lg:w-[440px] bg-paper dark:bg-night border-l border-black/10 dark:border-white/10 shadow-2xl flex flex-col overflow-hidden max-h-[100dvh]"
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-black/5 dark:border-white/10 flex items-center justify-between bg-paper/80 dark:bg-night/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="text-3xl">{plan.emoji}</span>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-marigold/20 text-ink dark:text-marigold">
                {plan.category}
              </span>
              <h2 className="font-display font-extrabold text-lg text-ink dark:text-white line-clamp-1 leading-tight mt-0.5">
                {plan.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close details"
            className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/20 active:scale-95 transition-all text-ink dark:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
          {/* Sponsored strip if applicable */}
          {plan.sponsored && (
            <div className="p-3 rounded-2xl bg-gradient-to-r from-marigold/20 to-bougainvillea/20 border border-marigold/40 flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-marigold flex-shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-ink dark:text-white">
                  Featured Gathering by {plan.sponsorName || 'Venue Partner'}
                </p>
                <p className="text-[11px] text-ink-soft dark:text-ink-muted">
                  Reserved tables and community discount included.
                </p>
              </div>
            </div>
          )}

          {/* Host Card */}
          <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar person={host} size="md" showVerifiedRing showOnlineBadge />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-bold text-sm text-ink dark:text-white">
                    {host.name}
                  </span>
                  {host.verified && (
                    <span
                      title="Verified Sangam Member"
                      className="inline-flex items-center text-lagoon"
                    >
                      <ShieldCheck className="w-4 h-4" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-ink-muted">
                  Hosted {host.plansHosted} plans in {host.area || 'Mumbai'}
                </p>
              </div>
            </div>

            <button
              onClick={() => onOpenChat(plan.id)}
              className="px-3 py-1.5 rounded-full bg-white dark:bg-night text-ink dark:text-white text-xs font-bold border border-black/10 dark:border-white/10 shadow-xs hover:bg-black/5 dark:hover:bg-white/10 flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5 text-lagoon" />
              <span>Chat</span>
            </button>
          </div>

          {/* Where & When Details */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-lagoon/15 text-lagoon flex items-center justify-center flex-shrink-0 mt-0.5">
                <Clock className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-ink-muted uppercase font-bold tracking-wider">When</p>
                <p className="font-display font-bold text-sm text-ink dark:text-white mt-0.5">
                  {plan.startsInMin <= 0
                    ? 'Happening right now'
                    : `In ${plan.startsInMin} minutes (${plan.durationMin} min duration)`}
                </p>
                <p className="text-xs text-ink-soft dark:text-ink-muted mt-0.5">
                  People usually show up 5 minutes early.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-bougainvillea/15 text-bougainvillea flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-xs text-ink-muted uppercase font-bold tracking-wider">Where</p>
                  {plan.place.isPublic && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-lagoon/15 text-lagoon">
                      Public Place
                    </span>
                  )}
                </div>
                <p className="font-display font-bold text-sm text-ink dark:text-white mt-0.5">
                  {plan.place.name}
                </p>
                <p className="text-xs text-ink-soft dark:text-ink-muted mt-0.5">
                  {plan.place.area} • ~700m away (8 min walk)
                </p>
              </div>
            </div>
          </div>

          {/* Who's Going & Capacity */}
          <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-ink-muted" />
                <span className="text-xs font-bold text-ink dark:text-white uppercase tracking-wider">
                  Who's going ({plan.goingIds.length}/{plan.capacity})
                </span>
              </div>
              {spotsLeft <= 2 && spotsLeft > 0 && (
                <span className="text-[11px] font-black text-bougainvillea px-2 py-0.5 rounded-full bg-bougainvillea/15">
                  {spotsLeft} spot{spotsLeft > 1 ? 's' : ''} left
                </span>
              )}
            </div>

            {/* Capacity Progress Bar */}
            <div className="w-full h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isFull ? 'bg-bougainvillea' : 'bg-lagoon'
                }`}
                style={{ width: `${Math.min(100, (plan.goingIds.length / plan.capacity) * 100)}%` }}
              />
            </div>

            {/* Avatars */}
            <div className="flex items-center justify-between pt-1">
              <div
                onClick={() => setShowMembersModal(true)}
                className="cursor-pointer hover:opacity-80 transition-opacity"
              >
                <AvatarStack userIds={plan.goingIds} max={6} size="sm" />
              </div>

              <button
                onClick={() => setShowMembersModal(true)}
                className="text-xs font-bold text-lagoon hover:underline cursor-pointer"
              >
                View all members →
              </button>
            </div>
          </div>

          {/* Description & Vibe Tags */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-ink-muted uppercase tracking-wider">About the plan</h4>
            <p className="text-sm text-ink-soft dark:text-ink-muted leading-relaxed">
              {plan.description}
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {plan.vibeTags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-black/5 dark:bg-white/10 text-ink dark:text-white"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Secondary Actions Row */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 transition-all flex flex-col items-center gap-1 text-center"
            >
              <Share2 className="w-4 h-4 text-ink-soft dark:text-ink-muted" />
              <span className="text-[11px] font-bold text-ink dark:text-white">Share</span>
            </button>

            <button
              onClick={handleToggleFriend}
              className={`p-2.5 rounded-xl border transition-all flex flex-col items-center gap-1 text-center ${
                bringFriendCount > 0
                  ? 'bg-marigold/20 border-marigold text-ink'
                  : 'border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-ink dark:text-white'
              } active:scale-95`}
            >
              <UserPlus className="w-4 h-4 text-marigold" />
              <span className="text-[11px] font-bold">
                {bringFriendCount > 0 ? '+1 Added' : '+1 Friend'}
              </span>
            </button>

            <button
              onClick={handleCalendar}
              className="p-2.5 rounded-xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 transition-all flex flex-col items-center gap-1 text-center"
            >
              <Calendar className="w-4 h-4 text-ink-soft dark:text-ink-muted" />
              <span className="text-[11px] font-bold text-ink dark:text-white">Calendar</span>
            </button>
          </div>

          {/* Report Button */}
          <div className="pt-2 flex justify-center">
            <button
              onClick={() => setShowReportModal(true)}
              className="text-xs text-ink-muted hover:text-bougainvillea flex items-center gap-1 transition-colors"
            >
              <Flag className="w-3.5 h-3.5" />
              <span>Report this plan</span>
            </button>
          </div>
        </div>

        {/* Bottom Hero Join Button Strip */}
        <div className="p-4 sm:p-5 border-t border-black/10 dark:border-white/10 bg-paper/90 dark:bg-night/90 backdrop-blur-md">
          {isMine ? (
            <div className="flex gap-2">
              <div className="flex-1 py-3 px-4 rounded-full bg-bougainvillea text-white font-display font-bold text-sm text-center shadow-soft">
                Your hosted plan
              </div>
              <button
                onClick={() => addToast('Plan edits saved.')}
                className="px-4 py-3 rounded-full border border-black/10 dark:border-white/20 text-xs font-bold hover:bg-black/5 dark:hover:bg-white/10 text-ink dark:text-white transition-all"
              >
                Edit
              </button>
            </div>
          ) : isJoined ? (
            <div className="space-y-2">
              <div className="w-full py-3 px-5 rounded-full bg-lagoon text-white font-display font-bold text-sm flex items-center justify-center gap-2 shadow-soft">
                <Check className="w-5 h-5 stroke-[2.5]" />
                <span>You're going! Chat is unlocked</span>
              </div>
              <div className="flex justify-between items-center px-2">
                <button
                  onClick={() => onOpenChat(plan.id)}
                  className="text-xs font-bold text-lagoon hover:underline flex items-center gap-1"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Open group chat</span>
                </button>
                <button
                  onClick={() => leavePlan(plan.id)}
                  className="text-xs text-ink-muted hover:text-bougainvillea transition-colors"
                >
                  Leave plan
                </button>
              </div>
            </div>
          ) : isFull ? (
            <button
              onClick={() => addToast("Added to waitlist. We'll ping you if a spot opens up.")}
              className="w-full py-3.5 px-6 rounded-full bg-ink text-white font-display font-bold text-sm hover:brightness-110 active:scale-95 transition-all shadow-soft"
            >
              Join Waitlist ({plan.goingIds.length} going)
            </button>
          ) : (
            <motion.button
              ref={joinBtnRef}
              whileTap={{ scale: 0.96 }}
              onClick={handleJoinClick}
              disabled={isJoining}
              className="w-full py-3.5 px-6 rounded-full bg-marigold text-ink font-display font-extrabold text-base shadow-soft hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              {isJoining ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-ink" />
                  <span>Reserving your spot...</span>
                </>
              ) : (
                <>
                  <span>Join • {plan.goingIds.length} going</span>
                </>
              )}
            </motion.button>
          )}
        </div>
      </motion.aside>

      {/* Members Modal */}
      <AnimatePresence>
        {showMembersModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl bg-paper dark:bg-night p-6 border border-black/10 dark:border-white/10 shadow-2xl space-y-4 max-h-[80vh] flex flex-col"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-lg text-ink dark:text-white">
                  Attendees ({plan.goingIds.length})
                </h3>
                <button
                  onClick={() => setShowMembersModal(false)}
                  className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-ink dark:text-white" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2.5 custom-scrollbar pr-1">
                {plan.goingIds.map((userId) => {
                  const person = getPerson(userId);
                  const isHostUser = person.id === plan.hostId;

                  return (
                    <div
                      key={person.id}
                      className="p-2.5 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar person={person} size="sm" showVerifiedRing />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm text-ink dark:text-white">
                              {person.name}
                            </span>
                            {isHostUser && (
                              <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-marigold text-ink">
                                Host
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-ink-muted">
                            {person.interests.slice(0, 2).join(' • ')}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Report Modal */}
      <AnimatePresence>
        {showReportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl bg-paper dark:bg-night p-6 border border-black/10 dark:border-white/10 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-bougainvillea">
                  <AlertCircle className="w-5 h-5" />
                  <h3 className="font-display font-bold text-base text-ink dark:text-white">
                    Report Plan
                  </h3>
                </div>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="w-7 h-7 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-ink dark:text-white" />
                </button>
              </div>

              {reportSubmitted ? (
                <div className="py-6 text-center space-y-2">
                  <Check className="w-10 h-10 text-lagoon mx-auto" />
                  <p className="font-bold text-sm text-ink dark:text-white">Report Received</p>
                  <p className="text-xs text-ink-muted">
                    We review reports within 15 minutes. Thank you for protecting the community.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReport} className="space-y-3">
                  <p className="text-xs text-ink-soft dark:text-ink-muted">
                    Why are you reporting "{plan.title}"?
                  </p>
                  {[
                    'Commercial spam / unauthorized sales',
                    'Suspicious host or location',
                    'Harassment or unsafe behavior',
                    'Not a public location',
                  ].map((reason) => (
                    <label
                      key={reason}
                      className="flex items-center gap-2 p-2.5 rounded-xl border border-black/10 dark:border-white/10 text-xs font-semibold text-ink dark:text-white cursor-pointer hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      <input
                        type="radio"
                        name="reportReason"
                        checked={reportReason === reason}
                        onChange={() => setReportReason(reason)}
                        required
                        className="text-bougainvillea"
                      />
                      <span>{reason}</span>
                    </label>
                  ))}
                  <button
                    type="submit"
                    disabled={!reportReason}
                    className="w-full py-2.5 rounded-full bg-bougainvillea text-white font-bold text-xs disabled:opacity-50 active:scale-95 transition-all shadow-xs"
                  >
                    Submit Report
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
