'use client';

import React, { useEffect } from 'react';
import { CubeColor, COLOR_HEX_MAP, COLOR_NAME_MAP } from '@/types/cube';
import { useCubeStore } from '@/stores/cube-store';
import { Check, Paintbrush } from 'lucide-react';

const COLORS: CubeColor[] = ['white', 'yellow', 'green', 'blue', 'red', 'orange'];

export const ColourPalette: React.FC = () => {
  const activeColor = useCubeStore((s) => s.activeColor);
  const setActiveColor = useCubeStore((s) => s.setActiveColor);
  const validation = useCubeStore((s) => s.validation);

  // Keyboard shortcut listener for 1-6 keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = parseInt(e.key, 10);
      if (key >= 1 && key <= 6) {
        setActiveColor(COLORS[key - 1]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveColor]);

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 p-3 sm:p-4 rounded-2xl shadow-xl flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-300 font-medium text-xs sm:text-sm">
          <Paintbrush className="w-4 h-4 text-cyan-400" />
          <span>Active Paint Color</span>
        </div>
        <span className="text-[11px] text-slate-400 hidden sm:inline">
          Press keys <span className="text-cyan-400 font-mono">1–6</span> to select
        </span>
      </div>

      <div className="grid grid-cols-6 gap-2 sm:gap-3">
        {COLORS.map((color, index) => {
          const isSelected = activeColor === color;
          const count = validation.colorCounts[color] || 0;
          const isComplete = count === 9;
          const isOver = count > 9;

          return (
            <button
              key={color}
              type="button"
              onClick={() => setActiveColor(color)}
              className={`
                group relative flex flex-col items-center gap-1.5 p-1.5 sm:p-2 rounded-xl transition-all duration-200 cursor-pointer
                ${isSelected ? 'bg-slate-800 ring-2 ring-cyan-400 shadow-lg scale-105' : 'bg-slate-800/40 hover:bg-slate-800/70'}
              `}
            >
              {/* Color swatch */}
              <div
                style={{ backgroundColor: COLOR_HEX_MAP[color] }}
                className={`
                  w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-transform duration-200
                  shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),0_2px_4px_rgba(0,0,0,0.4)]
                  ${isSelected ? 'scale-105' : 'group-hover:scale-100'}
                `}
              >
                {isSelected && (
                  <div className="w-4 h-4 rounded-full bg-slate-950/70 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>

              {/* Color Label & Count */}
              <div className="flex flex-col items-center">
                <span className="text-[10px] sm:text-xs font-semibold text-slate-300">
                  {COLOR_NAME_MAP[color]}
                </span>
                <span
                  className={`text-[9px] sm:text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                    isComplete
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : isOver
                      ? 'bg-rose-500/20 text-rose-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}
                >
                  {count}/9
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
