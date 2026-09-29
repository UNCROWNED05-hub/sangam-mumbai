import { useEffect, useState } from 'react';

const KONAMI_CODE = [
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

export function useKonamiCode(onSuccess: () => void) {
  const [keys, setKeys] = useState<string[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Lowercase check for letters
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      setKeys((prev) => {
        const next = [...prev, key].slice(-KONAMI_CODE.length);
        const matches = next.every((k, idx) => k.toLowerCase() === KONAMI_CODE[idx].toLowerCase());
        if (matches && next.length === KONAMI_CODE.length) {
          onSuccess();
          return [];
        }
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSuccess]);

  return keys;
}
