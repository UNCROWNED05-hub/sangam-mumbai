import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Sparkles, Check } from 'lucide-react';
import { COMMON_FOODS } from '../../data/mockData';
import { MealItem } from '../../types';
import { soundFx } from '../../utils/sound';
import { firePillConfetti } from '../ui/ConfettiTrigger';

interface MealSearchInputProps {
  selectedMeal: MealItem | null;
  onSelectMeal: (meal: MealItem | null) => void;
}

export const MealSearchInput: React.FC<MealSearchInputProps> = ({ selectedMeal, onSelectMeal }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [customCarbs, setCustomCarbs] = useState(30);

  const filteredFoods = COMMON_FOODS.filter((f) =>
    f.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (meal: MealItem) => {
    soundFx.playTap(980);
    firePillConfetti();
    onSelectMeal(meal);
    setQuery('');
    setIsFocused(false);
  };

  const handleAddCustomMeal = () => {
    if (!query.trim()) return;
    soundFx.playTap(1050);
    firePillConfetti();

    const custom: MealItem = {
      id: 'custom_' + Date.now(),
      name: query.trim(),
      carbs: customCarbs,
      protein: Math.round(customCarbs * 0.4),
      fat: Math.round(customCarbs * 0.25),
      calories: customCarbs * 4 + 60,
      glycemicIndex: customCarbs > 45 ? 'high' : customCarbs > 25 ? 'medium' : 'low',
      icon: '🍽️',
    };

    onSelectMeal(custom);
    setQuery('');
  };

  // Predicted glycemic rise based on carbs
  const predictedRise = Math.round(customCarbs * 0.85);

  return (
    <div className="space-y-4">
      {/* Animated Elastic Search Input */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search
            className={`absolute left-3.5 w-4 h-4 transition-colors duration-300 ${
              isFocused ? 'text-migo-purple-light' : 'text-slate-400'
            }`}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              soundFx.playTap(600);
            }}
            placeholder="Search healthy food or enter custom meal..."
            className="w-full pl-10 pr-20 py-2.5 rounded-xl bg-slate-900/90 text-sm text-white placeholder-slate-500 border border-white/[0.1] focus:border-migo-purple focus:outline-none transition-all duration-300"
          />
          {query.trim().length > 0 && (
            <button
              type="button"
              onClick={handleAddCustomMeal}
              className="absolute right-2 px-2.5 py-1 rounded-lg bg-migo-purple text-white text-xs font-bold shadow-sm hover:brightness-110 active:scale-95 transition-all"
            >
              Add
            </button>
          )}
        </div>

        {/* Dynamic expanding underline from center */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isFocused ? 1 : 0 }}
          transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-migo-purple via-migo-cyan to-migo-purple origin-center"
        />
      </div>

      {/* Custom Carbs Slider if typing new meal */}
      {query.trim().length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] space-y-2 text-xs"
        >
          <div className="flex items-center justify-between text-slate-300">
            <span>Estimated Total Carbs:</span>
            <strong className="text-cyan-400 font-mono text-sm">{customCarbs}g</strong>
          </div>
          <input
            type="range"
            min="5"
            max="120"
            value={customCarbs}
            onChange={(e) => setCustomCarbs(parseInt(e.target.value, 10))}
            className="w-full accent-migo-purple cursor-pointer"
          />
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span>Predicted Glycemic Rise:</span>
            <span className="text-amber-400 font-bold font-mono">+{predictedRise} mg/dL</span>
          </div>
        </motion.div>
      )}

      {/* Selected Meal Card (if active) */}
      <AnimatePresence>
        {selectedMeal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            className="p-3.5 rounded-xl bg-gradient-to-r from-purple-500/15 to-cyan-500/15 border border-migo-purple/40 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl p-1 bg-white/[0.08] rounded-lg">
                {selectedMeal.icon || '🥗'}
              </span>
              <div>
                <h4 className="text-sm font-bold text-white leading-tight">
                  {selectedMeal.name}
                </h4>
                <div className="flex items-center gap-2 mt-1 text-xs">
                  <span className="text-cyan-300 font-mono font-medium">
                    {selectedMeal.carbs}g carbs
                  </span>
                  <span>•</span>
                  <span className="text-purple-300 font-mono font-medium">
                    {selectedMeal.protein}g protein
                  </span>
                  <span>•</span>
                  <span className="text-amber-300 font-mono font-medium">
                    {selectedMeal.calories} kcal
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                soundFx.playTap(400);
                onSelectMeal(null);
              }}
              className="text-xs text-rose-400 hover:text-rose-300 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
            >
              Remove
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Falling Suggestions Grid with Lift Animation */}
      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
          Frequent Healthy Choices
        </span>

        {filteredFoods.map((food, idx) => (
          <motion.button
            key={food.id}
            type="button"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04, duration: 0.3 }}
            whileHover={{ scale: 1.02, y: -2, x: 2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSelect(food)}
            className="w-full text-left p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] hover:border-migo-purple/30 flex items-center justify-between group transition-all"
            data-interactive="true"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-lg">{food.icon}</span>
              <div>
                <span className="text-xs font-semibold text-slate-200 group-hover:text-white block">
                  {food.name}
                </span>
                <span className="text-[10px] text-slate-400">
                  GI: <span className="text-emerald-400 uppercase">{food.glycemicIndex}</span> •{' '}
                  {food.calories} kcal
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold text-cyan-400">
                {food.carbs}g C
              </span>
              <span className="p-1 rounded-full bg-white/[0.05] group-hover:bg-migo-purple group-hover:text-white text-slate-400 transition-colors">
                <Plus className="w-3 h-3" />
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
