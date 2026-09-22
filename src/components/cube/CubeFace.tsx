'use client';

import React from 'react';
import { CubeColor, FaceName, COLOR_HEX_MAP, FACE_FULL_NAMES } from '@/types/cube';

interface CubeFaceProps {
  face: FaceName;
  colors: CubeColor[];
  onStickerClick?: (index: number) => void;
  highlightIndex?: number | null;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
}

export const CubeFace: React.FC<CubeFaceProps> = ({
  face,
  colors,
  onStickerClick,
  highlightIndex = null,
  size = 'md',
  showLabels = true,
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6 rounded-[4px] text-[10px]',
    md: 'w-9 h-9 sm:w-11 sm:h-11 rounded-lg text-xs',
    lg: 'w-12 h-12 sm:w-14 sm:h-14 rounded-xl text-sm',
  };

  const gapClasses = {
    sm: 'gap-1 p-1 rounded-lg',
    md: 'gap-1.5 p-2 rounded-xl',
    lg: 'gap-2 p-2.5 rounded-2xl',
  };

  return (
    <div className="flex flex-col items-center">
      {showLabels && (
        <div className="mb-1.5 flex items-center justify-between w-full px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {FACE_FULL_NAMES[face]} ({face})
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            {face === 'U' ? 'Top' : face === 'D' ? 'Bottom' : 'Side'}
          </span>
        </div>
      )}

      <div className={`grid grid-cols-3 bg-slate-900/90 border border-slate-700/60 shadow-xl backdrop-blur-md ${gapClasses[size]}`}>
        {colors.map((color, idx) => {
          const isCenter = idx === 4;
          const isHighlighted = highlightIndex === idx;
          const hex = COLOR_HEX_MAP[color] || '#334155';

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onStickerClick && onStickerClick(idx)}
              style={{ backgroundColor: hex }}
              className={`
                ${sizeClasses[size]}
                relative flex items-center justify-center font-bold font-mono transition-all duration-150
                shadow-[inset_0_2px_4px_rgba(255,255,255,0.25),0_2px_4px_rgba(0,0,0,0.4)]
                hover:scale-105 active:scale-95 cursor-pointer
                ${isCenter ? 'ring-2 ring-white/50' : ''}
                ${isHighlighted ? 'ring-4 ring-cyan-400 animate-pulse' : ''}
              `}
              title={`${face}[${idx}] ${color}${isCenter ? ' (Center Piece)' : ''}`}
            >
              {isCenter && (
                <span className="text-[10px] font-extrabold uppercase px-1 py-0.5 rounded bg-black/40 text-white backdrop-blur-xs">
                  {face}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
