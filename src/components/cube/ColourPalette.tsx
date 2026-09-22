'use client';

import React, { useEffect } from 'react';
import { CubeColor, COLOR_HEX_MAP, COLOR_NAME_MAP } from '@/types/cube';
import { useCubeStore } from '@/stores/cube-store';

const COLORS: CubeColor[] = ['white', 'yellow', 'green', 'blue', 'red', 'orange'];

interface ColourPaletteProps {
  className?: string;
}

export const ColourPalette: React.FC<ColourPaletteProps> = ({ className = '' }) => {
  const activeColor = useCubeStore((s) => s.activeColor);
  const setActiveColor = useCubeStore((s) => s.setActiveColor);

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
    <div className={`flex items-center justify-between gap-1.5 px-1 py-1 ${className}`}>
      {COLORS.map((color) => {
        const isSelected = activeColor === color;
        const hex = COLOR_HEX_MAP[color];

        return (
          <button
            key={color}
            type="button"
            onClick={() => setActiveColor(color)}
            title={`${COLOR_NAME_MAP[color]} (${color})`}
            className={`
              relative w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-all duration-150 cursor-pointer flex items-center justify-center
              ${isSelected ? 'scale-110 shadow-md ring-2 ring-blue-500 ring-offset-2 ring-offset-white' : 'hover:scale-105 opacity-90 hover:opacity-100'}
            `}
            style={{
              backgroundColor: hex,
              border: color === 'white' ? '1.5px solid #cbd5e1' : '1.5px solid rgba(0,0,0,0.12)',
              boxShadow: isSelected
                ? '0 2px 8px rgba(37, 99, 235, 0.25)'
                : 'inset 0 1px 2px rgba(255,255,255,0.4), 0 1px 3px rgba(0,0,0,0.08)',
            }}
          />
        );
      })}
    </div>
  );
};
