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
      <span className="text-[11px] font-semibold text-slate-500 tracking-tight">
        {label}
      </span>

      <div
        className={`grid grid-cols-3 bg-slate-100 border border-slate-200/80 shadow-xs ${gapSizes[size]}`}
      >
        {colors.map((color, idx) => {
          const isCenter = idx === 4;
          const isHighlighted = highlightIndex === idx;
          const hex = COLOR_HEX_MAP[color] || '#e2e8f0';

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onStickerClick && onStickerClick(idx)}
              style={{
                backgroundColor: hex,
                border: color === 'white' ? '1px solid #cbd5e1' : '1px solid rgba(0,0,0,0.1)',
              }}
              className={`
                ${stickerSizes[size]}
                relative flex items-center justify-center transition-all duration-150 cursor-pointer
                shadow-[inset_0_1px_2px_rgba(255,255,255,0.35),0_1px_2px_rgba(0,0,0,0.06)]
                hover:scale-105 active:scale-95
                ${isCenter ? 'ring-1 ring-slate-400/40' : ''}
                ${isHighlighted ? 'ring-2 ring-blue-500 animate-pulse' : ''}
              `}
              title={`${face}[${idx}] ${color}${isCenter ? ' (Center)' : ''}`}
            />
          );
        })}
      </div>
    </div>
  );
};
