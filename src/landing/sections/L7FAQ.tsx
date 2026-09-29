import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FAQ_ITEMS } from '../../data/faq';
import { Plus, Shield, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const L7FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const navigate = useNavigate();

  const toggleItem = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="faq" className="relative w-full py-24 px-6 sm:px-10 z-20">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-marigold font-mono">
            Clear Answers
          </span>
          <h2 className="text-4xl sm:text-5xl font-black font-display text-ink dark:text-white tracking-tight">
            Frequently asked questions
          </h2>
          <p className="text-sm sm:text-base text-ink-soft max-w-lg mx-auto">
            Everything you need to know about joining plans, meeting neighbors, and staying safe.
          </p>
        </div>

        {/* 5-Question Accordion */}
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={item.id}
                className="rounded-3xl border border-line bg-white/40 dark:bg-night/40 backdrop-blur-md overflow-hidden transition-all shadow-soft"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                  data-cursor="open"
                >
                  <span className="text-base sm:text-lg font-bold font-display text-ink dark:text-white leading-snug">
                    {item.question}
                  </span>

                  <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-2 rounded-full bg-line/10 text-ink dark:text-white flex-shrink-0"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="px-6 pb-6 text-xs sm:text-sm text-ink-soft leading-relaxed border-t border-line/50 pt-3"
                    >
                      {item.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/safety')}
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-white dark:bg-night border border-line text-xs font-bold text-ink dark:text-white hover:border-lagoon transition-all shadow-sm"
            data-cursor="link"
          >
            <Shield className="w-4 h-4 text-lagoon" />
            <span>Read our safety guidelines</span>
          </button>

          <a
            href="mailto:help@sangam.live"
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/50 dark:bg-night/50 border border-line text-xs font-bold text-ink dark:text-white hover:text-marigold transition-all"
            data-cursor="link"
          >
            <Mail className="w-4 h-4 text-marigold" />
            <span>Still stuck? Email us</span>
          </a>
        </div>
      </div>
    </section>
  );
};
