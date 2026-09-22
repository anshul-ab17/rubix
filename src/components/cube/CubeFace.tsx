'use client';

import React from 'react';
import { CubeColor, FaceName, COLOR_HEX_MAP } from '@/types/cube';

interface CubeFaceProps {
  face: FaceName;
  label: string;
  colors: CubeColor[];
  onStickerClick?: (index: number) => void;
  highlightIndex?: number | null;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export const CubeFace: React.FC<CubeFaceProps> = ({
  face,
  label,
  colors,
  onStickerClick,
  highlightIndex = null,
  size = 'sm',
}) => {
  const stickerSizes = {
    xs: 'w-4 h-4 rounded-[3px]',
    sm: 'w-5 h-5 sm:w-6 sm:h-6 rounded-[5px]',
    md: 'w-7 h-7 sm:w-8 sm:h-8 rounded-md',
    lg: 'w-9 h-9 sm:w-10 sm:h-10 rounded-lg',
  };

  const gapSizes = {
    xs: 'gap-0.5 p-1 rounded-md',
    sm: 'gap-1 p-1.5 rounded-lg',
    md: 'gap-1.5 p-2 rounded-xl',
    lg: 'gap-2 p-2.5 rounded-2xl',
  };

  return (
    <div className="flex flex-col items-start gap-1">
      <span className="text-[11px] font-semibold text-slate-400 tracking-tight">
        {label}
      </span>

      <div
        className={`grid grid-cols-3 bg-slate-900 border border-slate-800 shadow-md ${gapSizes[size]}`}
      >
        {colors.map((color, idx) => {
          const isCenter = idx === 4;
          const isHighlighted = highlightIndex === idx;
          const hex = COLOR_HEX_MAP[color] || '#334155';

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onStickerClick && onStickerClick(idx)}
              style={{
                backgroundColor: hex,
                border: color === 'white' ? '1px solid #475569' : '1px solid rgba(0,0,0,0.3)',
              }}
              className={`
                ${stickerSizes[size]}
                relative flex items-center justify-center transition-all duration-150 cursor-pointer
                shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),0_1px_3px_rgba(0,0,0,0.4)]
                hover:scale-105 active:scale-95
                ${isCenter ? 'ring-1 ring-slate-400/50' : ''}
                ${isHighlighted ? 'ring-2 ring-blue-400 animate-pulse' : ''}
              `}
              title={`${face}[${idx}] ${color}${isCenter ? ' (Center)' : ''}`}
            />
          );
        })}
      </div>
    </div>
  );
};
