import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../store/useAppStore';
import { useSimulation } from '../store/useSimulation';
import { BRAND } from '../config/brand';
import { CITY } from '../config/city';
import { PLAN_CATEGORIES, PlanCategory, Plan } from '../data/plans';
import { MapView } from './MapView';
import { PlanList } from './PlanList';
import { PlanSheet } from './PlanSheet';
import { ChatRoom } from './ChatRoom';
import { Composer } from './Composer';
import { TimeScrubber } from './TimeScrubber';
import { OnboardingModal } from './OnboardingModal';
import { PremiumSheet } from './PremiumSheet';
import { PlansTab } from './tabs/PlansTab';
import { ChatsTab } from './tabs/ChatsTab';
import { TripsTab } from './tabs/TripsTab';
import { YouTab } from './tabs/YouTab';
import { Toast } from '../ui/Toast';
import { CURRENT_USER } from '../data/people';
import {
  Map as MapIcon,
  CalendarDays,
  MessageSquare,
  Compass,
  User,
  Plus,
  Search,
  Bell,
  SlidersHorizontal,
  Flame,
  ArrowLeft,
  X,
} from 'lucide-react';

interface AppShellProps {
  onSwitchToStory?: () => void;
}

export const AppShell: React.FC<AppShellProps> = ({ onSwitchToStory }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Connect live simulation engine
  useSimulation(true);

  const {
    plans,
    selectedPlanId,
    activeTab,
    activeFilter,
    searchQuery,
    isInvisible,
    livePeopleOutCount,
    chatOpenPlanId,
    notifications,
    selectPlan,
    setActiveTab,
    setFilter,
    setSearchQuery,
    openChatForPlan,
  } = useAppStore();

  const [composerOpen, setComposerOpen] = useState(false);
  const [composerPlaceMode, setComposerPlaceMode] = useState(false);
  const [placeLocation, setPlaceLocation] = useState<{
    lngLat: [number, number];
    placeName: string;
  }>({
    lngLat: [72.821, 19.043],
    placeName: 'Near Bandra Bandstand',
  });

  const [hoveredPlanId, setHoveredPlanId] = useState<string | null>(null);
  const [onlyStartingSoon, setOnlyStartingSoon] = useState(false);
  const [mobileViewMode, setMobileViewMode] = useState<'map' | 'list'>('map');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [premiumSheetOpen, setPremiumSheetOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // 1. Deep link handling (?plan=<id>)
  useEffect(() => {
    const planParam = searchParams.get('plan');
    if (planParam && plans.some((p) => p.id === planParam)) {
      selectPlan(planParam, true);
    }
  }, [searchParams, plans, selectPlan]);

  // 2. Global Keyboard shortcuts: '/' focus search, 'Esc' close overlays, 'J' / 'K' cycle plans
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        if (e.key === 'Escape') {
          (e.target as HTMLElement).blur();
        }
        return;
      }

      if (e.key === '/') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'Escape') {
        selectPlan(null, false);
        openChatForPlan(null);
        setComposerOpen(false);
        setNotificationsOpen(false);
      } else if (e.key === 'j' || e.key === 'J') {
        // Next plan in filtered list
        if (filteredPlans.length > 0) {
          const curIdx = filteredPlans.findIndex((p) => p.id === selectedPlanId);
          const nextIdx = curIdx >= 0 ? (curIdx + 1) % filteredPlans.length : 0;
          selectPlan(filteredPlans[nextIdx].id, true);
        }
      } else if (e.key === 'k' || e.key === 'K') {
        // Prev plan in filtered list
        if (filteredPlans.length > 0) {
          const curIdx = filteredPlans.findIndex((p) => p.id === selectedPlanId);
          const prevIdx =
            curIdx >= 0 ? (curIdx - 1 + filteredPlans.length) % filteredPlans.length : 0;
          selectPlan(filteredPlans[prevIdx].id, true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPlanId, selectPlan, openChatForPlan]);

  // Filter plans based on category, search, and starting soon
  const filteredPlans = useMemo(() => {
    return plans.filter((plan) => {
      // Category filter
      if (activeFilter !== 'All' && plan.category !== activeFilter) {
        return false;
      }
      // Starting soon filter
      if (onlyStartingSoon && plan.startsInMin > 30) {
        return false;
      }
      // Search query filter (title, place name, area)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = plan.title.toLowerCase().includes(q);
        const matchPlace = plan.place.name.toLowerCase().includes(q);
        const matchArea = plan.place.area.toLowerCase().includes(q);
        if (!matchTitle && !matchPlace && !matchArea) {
          return false;
        }
      }
      return true;
    });
  }, [plans, activeFilter, onlyStartingSoon, searchQuery]);

  const selectedPlan = useMemo(
    () => plans.find((p) => p.id === selectedPlanId) || null,
    [plans, selectedPlanId]
  );

  const chatPlan = useMemo(
    () => plans.find((p) => p.id === chatOpenPlanId) || null,
    [plans, chatOpenPlanId]
  );

  const unreadNotificationCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="relative w-screen h-[100dvh] overflow-hidden bg-paper dark:bg-night text-ink dark:text-white flex">
      {/* Toast System Container */}
      <Toast />

      {/* 1. LEFT NAVIGATION RAIL (Desktop lg:flex, 84px) */}
      <nav
        aria-label="Sidebar Navigation"
        className="hidden lg:flex flex-col items-center justify-between w-[84px] h-full py-6 bg-paper/95 dark:bg-night/95 backdrop-blur-md border-r border-black/10 dark:border-white/10 z-30 select-none"
      >
        {/* Logo */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={() => (onSwitchToStory ? onSwitchToStory() : navigate('/'))}
            title="Return to Home Landing"
            className="w-11 h-11 rounded-2xl bg-marigold flex items-center justify-center text-ink font-display font-extrabold text-xl shadow-soft hover:scale-105 active:scale-95 transition-all"
          >
            S
          </button>
          <span className="text-[10px] font-black uppercase tracking-wider text-ink-muted">
            {BRAND.name.toLowerCase()}
          </span>
        </div>

        {/* Tab Items */}
        <div className="flex flex-col items-center gap-3 w-full px-2">
          {[
            { id: 'map' as const, label: 'Map', icon: MapIcon },
            { id: 'plans' as const, label: 'Plans', icon: CalendarDays },
            { id: 'chats' as const, label: 'Chats', icon: MessageSquare },
            { id: 'trips' as const, label: 'Trips', icon: Compass },
            { id: 'you' as const, label: 'You', icon: User },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 'map') {
                    openChatForPlan(null);
                  }
                }}
                className={`relative w-full py-2.5 rounded-2xl flex flex-col items-center gap-1 transition-all ${
                  isActive
                    ? 'text-ink dark:text-white font-bold'
                    : 'text-ink-soft dark:text-ink-muted hover:text-ink dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="railActiveIndicator"
                    className="absolute inset-0 bg-marigold/15 dark:bg-marigold/20 rounded-2xl border border-marigold/30"
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  />
                )}
                <Icon className={`w-5 h-5 relative z-10 ${isActive ? 'text-marigold' : ''}`} />
                <span className="text-[10px] font-bold tracking-tight relative z-10">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Centre Post Button */}
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => setComposerOpen(true)}
            title="Post a new plan"
            className="w-12 h-12 rounded-full bg-marigold text-ink shadow-soft hover:brightness-105 active:scale-95 transition-all flex items-center justify-center font-black"
          >
            <Plus className="w-6 h-6 stroke-[3]" />
          </button>
          <span className="text-[9px] font-bold text-ink-muted">Post</span>
        </div>
      </nav>

      {/* 2. MAIN APP CANVAS CONTAINER */}
      <div className="relative flex-1 h-full flex flex-col overflow-hidden">
        {/* TOP FILTER & SEARCH BAR */}
        <header className="absolute top-0 inset-x-0 z-20 p-3 sm:p-4 pointer-events-none flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-2.5 max-w-7xl mx-auto w-full">
            {/* Search Input Bar */}
            <div className="pointer-events-auto flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-paper/90 dark:bg-night/90 backdrop-blur-md border border-black/10 dark:border-white/10 shadow-soft w-full max-w-sm sm:max-w-md focus-within:border-marigold transition-all">
              <Search className="w-4 h-4 text-ink-muted flex-shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search plans, cafes, areas... (Press /)"
                className="w-full bg-transparent text-xs sm:text-sm text-ink dark:text-white placeholder:text-ink-muted focus:outline-hidden"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="w-4 h-4 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center text-ink-muted hover:text-ink"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Right badges & controls */}
            <div className="pointer-events-auto flex items-center gap-2 flex-shrink-0">
              {/* Live Count Pill */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-paper/90 dark:bg-night/90 backdrop-blur-md border border-black/10 dark:border-white/10 shadow-soft text-xs font-bold text-ink dark:text-white">
                <span className="w-2 h-2 rounded-full bg-lagoon animate-pulse" />
                <span>{livePeopleOutCount.toLocaleString()} out</span>
              </div>

              {/* Mobile View Toggle (Map / List) */}
              <button
                onClick={() => setMobileViewMode(mobileViewMode === 'map' ? 'list' : 'map')}
                className="lg:hidden px-3 py-2 rounded-full bg-paper/90 dark:bg-night/90 backdrop-blur-md border border-black/10 dark:border-white/10 shadow-soft text-xs font-bold text-ink dark:text-white flex items-center gap-1"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-marigold" />
                <span>{mobileViewMode === 'map' ? 'List' : 'Map'}</span>
              </button>

              {/* Notification Bell */}
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative w-10 h-10 rounded-full bg-paper/90 dark:bg-night/90 backdrop-blur-md border border-black/10 dark:border-white/10 shadow-soft flex items-center justify-center text-ink dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-bougainvillea" />
                )}
              </button>
            </div>
          </div>

          {/* Horizontally Scrolling Category Rail */}
          <div
            data-lenis-prevent
            className="pointer-events-auto flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 max-w-7xl mx-auto w-full select-none"
          >
            {/* "All" Chip */}
            <button
              onClick={() => setFilter('All')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-1.5 shadow-xs ${
                activeFilter === 'All'
                  ? 'bg-ink text-white dark:bg-marigold dark:text-ink border-transparent shadow-soft'
                  : 'bg-paper/90 dark:bg-night/90 backdrop-blur-md border-black/10 dark:border-white/10 text-ink dark:text-white hover:bg-black/5'
              }`}
            >
              <span>All Plans</span>
              <span className="text-[10px] font-black opacity-80">({plans.length})</span>
            </button>

            {/* Starting Soon Toggle Chip */}
            <button
              onClick={() => setOnlyStartingSoon(!onlyStartingSoon)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-1.5 shadow-xs ${
                onlyStartingSoon
                  ? 'bg-bougainvillea text-white border-transparent shadow-soft'
                  : 'bg-paper/90 dark:bg-night/90 backdrop-blur-md border-black/10 dark:border-white/10 text-ink dark:text-white hover:bg-black/5'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-marigold" />
              <span>Starting Soon</span>
            </button>

            {/* Categories */}
            {PLAN_CATEGORIES.map((cat: PlanCategory) => {
              const isSelected = activeFilter === cat;
              const count = plans.filter((p) => p.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-1.5 shadow-xs ${
                    isSelected
                      ? 'bg-ink text-white dark:bg-marigold dark:text-ink border-transparent shadow-soft'
                      : 'bg-paper/90 dark:bg-night/90 backdrop-blur-md border-black/10 dark:border-white/10 text-ink dark:text-white hover:bg-black/5'
                  }`}
                >
                  <span>{cat}</span>
                  <span className="text-[10px] font-black opacity-80">({count})</span>
                </button>
              );
            })}
          </div>
        </header>

        {/* NOTIFICATIONS POPOVER */}
        <AnimatePresence>
          {notificationsOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-16 right-4 sm:right-6 z-40 w-80 rounded-3xl bg-paper dark:bg-night border border-black/10 dark:border-white/10 shadow-2xl p-4 space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/5">
                <h4 className="font-display font-bold text-sm text-ink dark:text-white">
                  Notifications
                </h4>
                <button
                  onClick={() => setNotificationsOpen(false)}
                  className="w-6 h-6 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                {notifications.length === 0 ? (
                  <p className="text-xs text-ink-muted text-center py-4">No notifications yet.</p>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        if (item.targetPlanId) selectPlan(item.targetPlanId, true);
                        setNotificationsOpen(false);
                      }}
                      className="p-2.5 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-black/10 cursor-pointer transition-colors text-xs space-y-0.5"
                    >
                      <p className="font-semibold text-ink dark:text-white">{item.title}</p>
                      <p className="text-[10px] text-ink-muted">{item.time}</p>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ACTIVE TAB VIEW CONTENT */}
        {activeTab === 'map' && (
          <div className="relative w-full h-full">
            {/* Map Canvas */}
            <MapView
              filteredPlans={filteredPlans}
              selectedPlanId={selectedPlanId}
              hoveredPlanId={hoveredPlanId}
              onHoverPlan={setHoveredPlanId}
              onSelectPlan={(id) => selectPlan(id, true)}
              placeMode={composerPlaceMode}
              onPlaceLocationChange={(lngLat, placeName) =>
                setPlaceLocation({ lngLat, placeName })
              }
              className="w-full h-full"
            />

            {/* Desktop Left Floating Plan List (340px) */}
            <div className="hidden lg:block absolute top-28 left-5 bottom-8 w-[340px] pointer-events-auto z-10">
              <PlanList
                plans={filteredPlans}
                selectedPlanId={selectedPlanId}
                hoveredPlanId={hoveredPlanId}
                onHoverPlan={setHoveredPlanId}
                onSelectPlan={(id) => selectPlan(id, true)}
                onOpenComposer={() => setComposerOpen(true)}
              />
            </div>

            {/* Time Scrubber (Signature UX Feature P1) */}
            <TimeScrubber className="hidden sm:flex absolute bottom-5 left-1/2 -translate-x-1/2 z-20 w-[90%] max-w-[420px]" />

            {/* Mobile Plan List Overlay (When toggled to List mode) */}
            {mobileViewMode === 'list' && (
              <div className="lg:hidden absolute inset-0 top-28 bg-paper dark:bg-night z-20 p-4">
                <PlanList
                  plans={filteredPlans}
                  selectedPlanId={selectedPlanId}
                  hoveredPlanId={hoveredPlanId}
                  onHoverPlan={setHoveredPlanId}
                  onSelectPlan={(id) => {
                    selectPlan(id, true);
                    setMobileViewMode('map');
                  }}
                  onOpenComposer={() => setComposerOpen(true)}
                />
              </div>
            )}
          </div>
        )}

        {/* PLANS TAB */}
        {activeTab === 'plans' && (
          <PlansTab
            onSelectPlan={(id) => {
              selectPlan(id, true);
              setActiveTab('map');
            }}
            onOpenComposer={() => setComposerOpen(true)}
          />
        )}

        {/* CHATS TAB */}
        {activeTab === 'chats' && (
          <ChatsTab onOpenChat={(id) => openChatForPlan(id)} />
        )}

        {/* TRIPS TAB */}
        {activeTab === 'trips' && (
          <TripsTab onOpenChat={(id) => openChatForPlan(id)} />
        )}

        {/* YOU / PROFILE TAB */}
        {activeTab === 'you' && (
          <YouTab onOpenPremium={() => setPremiumSheetOpen(true)} />
        )}

        {/* PLAN SHEET / DRAWER (When plan is selected) */}
        <AnimatePresence>
          {selectedPlan && (
            <PlanSheet
              plan={selectedPlan}
              onClose={() => selectPlan(null, false)}
              onOpenChat={(planId) => openChatForPlan(planId)}
            />
          )}
        </AnimatePresence>

        {/* CHAT ROOM DRAWER (When chat is opened) */}
        <AnimatePresence>
          {chatPlan && (
            <ChatRoom
              plan={chatPlan}
              onClose={() => openChatForPlan(null)}
            />
          )}
        </AnimatePresence>

        {/* COMPOSER (CREATE PLAN SHEET) */}
        <AnimatePresence>
          {composerOpen && (
            <Composer
              isOpen={composerOpen}
              onClose={() => setComposerOpen(false)}
              onPlanCreated={(newPlan) => {
                selectPlan(newPlan.id, true);
              }}
              onTogglePlaceMode={(active) => setComposerPlaceMode(active)}
              selectedLocation={placeLocation}
            />
          )}
        </AnimatePresence>

        {/* ONBOARDING MODAL (First visit) */}
        <OnboardingModal />

        {/* PREMIUM MEMBERSHIP SHEET */}
        <PremiumSheet
          isOpen={premiumSheetOpen}
          onClose={() => setPremiumSheetOpen(false)}
        />
      </div>

      {/* 3. MOBILE BOTTOM NAVIGATION BAR (<1024px) */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 h-16 bg-paper/95 dark:bg-night/95 backdrop-blur-md border-t border-black/10 dark:border-white/10 flex items-center justify-around px-2 z-30 select-none">
        <button
          onClick={() => {
            setActiveTab('map');
            openChatForPlan(null);
          }}
          className={`flex flex-col items-center gap-0.5 ${
            activeTab === 'map' ? 'text-marigold font-bold' : 'text-ink-soft dark:text-ink-muted'
          }`}
        >
          <MapIcon className="w-5 h-5" />
          <span className="text-[10px]">Map</span>
        </button>

        <button
          onClick={() => setActiveTab('plans')}
          className={`flex flex-col items-center gap-0.5 ${
            activeTab === 'plans' ? 'text-marigold font-bold' : 'text-ink-soft dark:text-ink-muted'
          }`}
        >
          <CalendarDays className="w-5 h-5" />
          <span className="text-[10px]">Plans</span>
        </button>

        {/* Center Post Button */}
        <button
          onClick={() => setComposerOpen(true)}
          className="w-11 h-11 rounded-full bg-marigold text-ink flex items-center justify-center shadow-soft active:scale-95 transition-all -mt-4 border-2 border-paper dark:border-night"
        >
          <Plus className="w-6 h-6 stroke-[3]" />
        </button>

        <button
          onClick={() => setActiveTab('chats')}
          className={`flex flex-col items-center gap-0.5 ${
            activeTab === 'chats' ? 'text-marigold font-bold' : 'text-ink-soft dark:text-ink-muted'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px]">Chats</span>
        </button>

        <button
          onClick={() => setActiveTab('you')}
          className={`flex flex-col items-center gap-0.5 ${
            activeTab === 'you' ? 'text-marigold font-bold' : 'text-ink-soft dark:text-ink-muted'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">You</span>
        </button>
      </div>
    </div>
  );
};
