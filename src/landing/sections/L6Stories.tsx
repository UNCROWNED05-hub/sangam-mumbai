import React, { useState } from 'react';
import { motion } from 'motion/react';
import { STORIES } from '../../data/stories';

export const L6Stories: React.FC = () => {
  const [isPausedRow1, setIsPausedRow1] = useState(false);
  const [isPausedRow2, setIsPausedRow2] = useState(false);

  const row1Stories = STORIES.slice(0, 7);
  const row2Stories = STORIES.slice(7, 14);

  return (
    <section className="relative w-full py-20 sm:py-28 overflow-hidden z-10 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-10 text-center">
        <span className="text-xs font-black uppercase tracking-widest text-bougainvillea">
          Community Stories
        </span>
        <h2 className="font-display font-black text-3xl sm:text-4xl text-ink dark:text-white mt-1.5">
          Real evenings. Zero followers required.
        </h2>
      </div>

      {/* Row 1: Leftward Marquee */}
      <div
        onMouseEnter={() => setIsPausedRow1(true)}
        onMouseLeave={() => setIsPausedRow1(false)}
        className="flex overflow-hidden py-2"
        data-cursor="pause"
      >
        <div
          className={`flex gap-4 shrink-0 ${
            isPausedRow1 ? '' : 'animate-marquee-slow'
          }`}
          style={{ animationPlayState: isPausedRow1 ? 'paused' : 'running' }}
        >
          {[...row1Stories, ...row1Stories].map((story, idx) => (
            <div
              key={`${story.id}-${idx}`}
              className="w-80 sm:w-96 p-4 sm:p-5 rounded-3xl bg-paper/85 dark:bg-night/85 backdrop-blur-md border border-black/10 dark:border-white/10 shadow-soft flex flex-col justify-between space-y-3 shrink-0"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-white text-xs shadow-sm ring-2 ring-white dark:ring-night"
                  style={{
                    background: `linear-gradient(135deg, ${story.avatarGradient[0]}, ${story.avatarGradient[1]})`,
                  }}
                >
                  {story.name.slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-display font-bold text-sm text-ink dark:text-white">
                      {story.name}
                    </span>
                    <span className="text-sm">{story.planEmoji}</span>
                  </div>
                  <p className="text-[10px] text-ink-muted">{story.city} Circle</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-ink-soft dark:text-ink-muted leading-relaxed italic">
                "{story.quote}"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2: Rightward Reverse Marquee */}
      <div
        onMouseEnter={() => setIsPausedRow2(true)}
        onMouseLeave={() => setIsPausedRow2(false)}
        className="flex overflow-hidden py-3 mt-2"
        data-cursor="pause"
      >
        <div
          className={`flex gap-4 shrink-0 ${
            isPausedRow2 ? '' : 'animate-marquee-slow'
          }`}
          style={{
            animationDirection: 'reverse',
            animationPlayState: isPausedRow2 ? 'paused' : 'running',
          }}
        >
          {[...row2Stories, ...row2Stories].map((story, idx) => (
            <div
              key={`${story.id}-${idx}`}
              className="w-80 sm:w-96 p-4 sm:p-5 rounded-3xl bg-paper/85 dark:bg-night/85 backdrop-blur-md border border-black/10 dark:border-white/10 shadow-soft flex flex-col justify-between space-y-3 shrink-0"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-white text-xs shadow-sm ring-2 ring-white dark:ring-night"
                  style={{
                    background: `linear-gradient(135deg, ${story.avatarGradient[0]}, ${story.avatarGradient[1]})`,
                  }}
                >
                  {story.name.slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-display font-bold text-sm text-ink dark:text-white">
                      {story.name}
                    </span>
                    <span className="text-sm">{story.planEmoji}</span>
                  </div>
                  <p className="text-[10px] text-ink-muted">{story.city} Circle</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-ink-soft dark:text-ink-muted leading-relaxed italic">
                "{story.quote}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
