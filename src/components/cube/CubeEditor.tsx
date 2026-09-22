'use client';

import React, { useState } from 'react';
import { useCubeStore } from '@/stores/cube-store';
import { CubeFace } from './CubeFace';
import { ColourPalette } from './ColourPalette';
import { FaceName, StandardMove } from '@/types/cube';
import { RotateCcw, Shuffle, AlertCircle } from 'lucide-react';

interface CubeEditorProps {
  onOpenScanner?: () => void;
}

// Preset famous cube patterns for instant practice
const PATTERNS: { name: string; scramble: string }[] = [
  { name: 'Checkerboard', scramble: "M2 E2 S2" },
  { name: 'Superflip', scramble: "U R2 F B R B2 R U2 L B2 R U' D' R2 F R' L B2 U2 F2" },
  { name: 'Cube in a Cube', scramble: "F L F U' R U F2 L2 U' L' B D' B' L2 U" },
  { name: 'Anaconda', scramble: "L U B' U' R L' B R' F B' D R D' F'" },
  { name: 'Wire', scramble: "R L F B R L F B R L F B" },
];

export const CubeEditor: React.FC<CubeEditorProps> = ({ onOpenScanner }) => {
  const cubeState = useCubeStore((s) => s.cubeState);
  const activeColor = useCubeStore((s) => s.activeColor);
  const setStickerColor = useCubeStore((s) => s.setStickerColor);
  const resetCube = useCubeStore((s) => s.resetCube);
  const scrambleCube = useCubeStore((s) => s.scrambleCube);
  const isScrambling = useCubeStore((s) => s.isScrambling);
  const validation = useCubeStore((s) => s.validation);

  const [activeTab, setActiveTab] = useState<'build' | 'scan' | 'presets'>('build');
  const [showPresetsMenu, setShowPresetsMenu] = useState(false);

  const handleStickerClick = (face: FaceName, index: number) => {
    setStickerColor(face, index, activeColor);
  };

  const handleTabClick = (tab: 'build' | 'scan' | 'presets') => {
    setActiveTab(tab);
    if (tab === 'scan' && onOpenScanner) {
      onOpenScanner();
    } else if (tab === 'presets') {
      setShowPresetsMenu(!showPresetsMenu);
    } else {
      setShowPresetsMenu(false);
    }
  };

  const applyPattern = (patternScramble: string) => {
    // Apply preset pattern scramble
    scrambleCube(0); // reset
    // Apply moves via store
    useCubeStore.getState().resetCube();
    const moves = patternScramble.trim().split(/\s+/);
    for (const m of moves) {
      useCubeStore.getState().applySingleMove(m as StandardMove);
    }
    setShowPresetsMenu(false);
    setActiveTab('build');
  };

  return (
    <div className="h-full flex flex-col justify-between p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs select-none">
      {/* Top Segmented Switcher */}
      <div>
        <div className="grid grid-cols-3 gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/60 mb-3">
          <button
            type="button"
            onClick={() => handleTabClick('build')}
            className={`py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'build'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Build
          </button>
          <button
            type="button"
            onClick={() => handleTabClick('scan')}
            className={`py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'scan'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Scan
          </button>
          <button
            type="button"
            onClick={() => handleTabClick('presets')}
            className={`py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'presets'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Presets
          </button>
        </div>

        {/* Section Header */}
        <div className="mb-2">
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            1. Set Cube State
          </h2>
          <p className="text-[11px] text-slate-400">
            Click stickers to set the colors
          </p>
        </div>

        {/* Circular Palette */}
        <div className="mb-3">
          <ColourPalette />
        </div>

        {/* Presets Dropdown if Open */}
        {showPresetsMenu && (
          <div className="mb-2 p-2 bg-slate-50 border border-slate-200 rounded-xl shadow-md text-xs space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 px-1">Choose Preset Pattern</span>
            {PATTERNS.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => applyPattern(p.scramble)}
                className="w-full text-left px-2 py-1 rounded-md hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-medium transition-colors"
              >
                {p.name}
              </button>
            ))}
          </div>
        )}

        {/* 6 Faces Grid (2 Columns x 3 Rows) */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-2">
          {/* Row 1 */}
          <CubeFace
            face="U"
            label="U (Top)"
            colors={cubeState.U}
            onStickerClick={(idx) => handleStickerClick('U', idx)}
            size="sm"
          />
          <CubeFace
            face="D"
            label="D (Bottom)"
            colors={cubeState.D}
            onStickerClick={(idx) => handleStickerClick('D', idx)}
            size="sm"
          />

          {/* Row 2 */}
          <CubeFace
            face="F"
            label="F (Front)"
            colors={cubeState.F}
            onStickerClick={(idx) => handleStickerClick('F', idx)}
            size="sm"
          />
          <CubeFace
            face="B"
            label="B (Back)"
            colors={cubeState.B}
            onStickerClick={(idx) => handleStickerClick('B', idx)}
            size="sm"
          />

          {/* Row 3 */}
          <CubeFace
            face="L"
            label="L (Left)"
            colors={cubeState.L}
            onStickerClick={(idx) => handleStickerClick('L', idx)}
            size="sm"
          />
          <CubeFace
            face="R"
            label="R (Right)"
            colors={cubeState.R}
            onStickerClick={(idx) => handleStickerClick('R', idx)}
            size="sm"
          />
        </div>

        {/* Validation Error Banner (if invalid) */}
        {!validation.isValid && (
          <div className="mt-2 p-1.5 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-1.5 text-[11px] text-amber-800">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="truncate">{validation.errors[0] || 'Invalid cube state'}</span>
          </div>
        )}
      </div>

      {/* Bottom Action Buttons */}
      <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={resetCube}
          className="py-1.5 px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Reset</span>
        </button>

        <button
          type="button"
          onClick={() => scrambleCube(20)}
          disabled={isScrambling}
          className="py-1.5 px-3 bg-white hover:bg-slate-50 disabled:opacity-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
        >
          <Shuffle className={`w-3.5 h-3.5 text-slate-500 ${isScrambling ? 'animate-spin text-blue-600' : ''}`} />
          <span>{isScrambling ? 'Shuffling...' : 'Random Scramble'}</span>
        </button>
      </div>
    </div>
  );
};
