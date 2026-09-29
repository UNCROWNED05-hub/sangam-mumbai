import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useAppStore } from '../store/useAppStore';

const KONAMI_SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

export const EasterEggs: React.FC = () => {
  const { setTheme, effectiveTheme, addToast } = useAppStore();
  const sequenceIndexRef = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      const expectedKey = KONAMI_SEQUENCE[sequenceIndexRef.current];

      if (key.toLowerCase() === expectedKey.toLowerCase()) {
        sequenceIndexRef.current += 1;

        if (sequenceIndexRef.current === KONAMI_SEQUENCE.length) {
          sequenceIndexRef.current = 0;
          // Trigger Emoji Rain!
          addToast('🎉 Konami Code Activated! It is raining activities.');

          try {
            const count = 200;
            const defaults = {
              origin: { y: 0.1 },
              colors: ['#FFC21A', '#FF3D7F', '#10B5A5', '#14163A'],
            };

            function fire(particleRatio: number, opts: confetti.Options) {
              confetti({
                ...defaults,
                ...opts,
                particleCount: Math.floor(count * particleRatio),
              });
            }

            fire(0.25, { spread: 26, startVelocity: 55 });
            fire(0.2, { spread: 60 });
            fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
            fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
            fire(0.1, { spread: 120, startVelocity: 45 });
          } catch {
            // Ignore
          }
        }
      } else {
        sequenceIndexRef.current = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [addToast]);

  return null;
};
