import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

interface RouteTransitionContextType {
  openApp: (originX?: number, originY?: number, planId?: string) => void;
}

const RouteTransitionContext = createContext<RouteTransitionContextType>({
  openApp: () => {},
});

export const useRouteTransition = () => useContext(RouteTransitionContext);

export const RouteTransitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [transitioning, setTransitioning] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 }); // percentage

  const openApp = (clickX?: number, clickY?: number, planId?: string) => {
    if (typeof window !== 'undefined' && clickX !== undefined && clickY !== undefined) {
      setOrigin({
        x: (clickX / window.innerWidth) * 100,
        y: (clickY / window.innerHeight) * 100,
      });
    } else {
      setOrigin({ x: 50, y: 50 });
    }

    setTransitioning(true);

    // Midpoint route change
    setTimeout(() => {
      navigate(planId ? `/app?plan=${planId}` : '/app');
      setTimeout(() => {
        setTransitioning(false);
      }, 350);
    }, 320);
  };

  return (
    <RouteTransitionContext.Provider value={{ openApp }}>
      {children}

      {/* Expanding Marigold Circle Overlay */}
      <AnimatePresence>
        {transitioning && (
          <motion.div
            initial={{ clipPath: `circle(0% at ${origin.x}% ${origin.y}%)` }}
            animate={{ clipPath: `circle(150% at ${origin.x}% ${origin.y}%)` }}
            exit={{ clipPath: `circle(0% at ${origin.x}% ${origin.y}%)` }}
            transition={{ duration: 0.65, ease: [0.65, 0, 0.35, 1] }}
            className="fixed inset-0 z-[99995] bg-marigold pointer-events-none"
          />
        )}
      </AnimatePresence>
    </RouteTransitionContext.Provider>
  );
};
