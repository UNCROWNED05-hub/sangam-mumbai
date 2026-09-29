import confetti from 'canvas-confetti';

export function fireCelebrationConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ['#8b5cf6', '#a78bfa', '#ec4899'],
  });
  fire(0.2, {
    spread: 60,
    colors: ['#06b6d4', '#38bdf8', '#10b981'],
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    colors: ['#c084fc', '#f59e0b', '#34d399'],
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
    colors: ['#ffffff', '#a855f7'],
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
    colors: ['#8b5cf6', '#10b981'],
  });
}

export function firePillConfetti() {
  confetti({
    particleCount: 40,
    angle: 60,
    spread: 55,
    origin: { x: 0 },
    colors: ['#10b981', '#34d399', '#8b5cf6'],
    zIndex: 9999,
  });
  confetti({
    particleCount: 40,
    angle: 120,
    spread: 55,
    origin: { x: 1 },
    colors: ['#06b6d4', '#38bdf8', '#ec4899'],
    zIndex: 9999,
  });
}
