import { useEffect, useRef } from 'react';
import { useHealthStore } from '../store/useHealthStore';
import { soundFx } from '../utils/sound';

export function useSwipeNavigation() {
  const { activeTab, setActiveTab, user } = useHealthStore();
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const tabs: Array<'dashboard' | 'timeline' | 'analytics' | 'scrollystory' | 'settings'> = [
    'dashboard',
    'timeline',
    'analytics',
    'scrollystory',
    'settings',
  ];

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartX.current === null || touchStartY.current === null) return;

      const deltaX = e.changedTouches[0].clientX - touchStartX.current;
      const deltaY = e.changedTouches[0].clientY - touchStartY.current;

      // Threshold: horizontal swipe greater than 80px, and horizontal delta > vertical delta * 1.5
      if (Math.abs(deltaX) > 80 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
        const currentIdx = tabs.indexOf(activeTab);

        if (deltaX < 0 && currentIdx < tabs.length - 1) {
          // Swiped left -> Next tab
          soundFx.playTap(950);
          if (user.hapticsEnabled && 'vibrate' in navigator) {
            navigator.vibrate(25);
          }
          setActiveTab(tabs[currentIdx + 1]);
        } else if (deltaX > 0 && currentIdx > 0) {
          // Swiped right -> Prev tab
          soundFx.playTap(750);
          if (user.hapticsEnabled && 'vibrate' in navigator) {
            navigator.vibrate(25);
          }
          setActiveTab(tabs[currentIdx - 1]);
        }
      }

      touchStartX.current = null;
      touchStartY.current = null;
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [activeTab, setActiveTab, user.hapticsEnabled]);
}
