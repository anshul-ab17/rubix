'use client';

import React from 'react';
import { X, BookOpen, Compass, CheckCircle2, RotateCw, RotateCcw } from 'lucide-react';
import { MOVE_DESCRIPTIONS } from '@/lib/cube/cube-notation';
import { StandardMove } from '@/types/cube';

interface NotationGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const NOTATION_KEYS: StandardMove[] = [
  'U', "U'", 'U2',
  'D', "D'", 'D2',
  'F', "F'", 'F2',
  'B', "B'", 'B2',
  'R', "R'", 'R2',
  'L', "L'", 'L2',
];

export const NotationGuide: React.FC<NotationGuideProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[85vh] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Rubik&rsquo;s Cube Notation Guide</h3>
              <p className="text-xs text-slate-400">
                Official WCA notation and beginner reference
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-300">
          {/* Orientation Rule */}
          <div className="bg-cyan-950/30 border border-cyan-500/30 p-4 rounded-2xl flex items-start gap-3">
            <Compass className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-cyan-200">How to Hold the Cube</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                When following instructions, always keep <strong className="text-emerald-400">Green</strong> in front and <strong className="text-slate-100">White</strong> on top. Every face turn is defined relative to this starting position:
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-3 text-center text-xs font-mono font-bold">
                <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700">U = Up (White)</div>
                <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700">D = Down (Yellow)</div>
                <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700">F = Front (Green)</div>
                <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700">B = Back (Blue)</div>
                <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700">R = Right (Red)</div>
                <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700">L = Left (Orange)</div>
              </div>
            </div>
          </div>

          {/* Notation Rules */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-800/50 border border-slate-700/60 p-3.5 rounded-xl flex flex-col gap-1">
              <span className="font-bold text-white flex items-center gap-1.5">
                <RotateCw className="w-4 h-4 text-emerald-400" />
                <span>Single Letter (e.g. R, U)</span>
              </span>
              <p className="text-slate-400">
                Turn that face <strong>90° clockwise</strong> (as if you are looking directly at that face).
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/60 p-3.5 rounded-xl flex flex-col gap-1">
              <span className="font-bold text-white flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-amber-400" />
                <span>Letter with Apostrophe (R&apos;, U&apos;)</span>
              </span>
              <p className="text-slate-400">
                Turn that face <strong>90° counter-clockwise</strong> (Prime move).
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/60 p-3.5 rounded-xl flex flex-col gap-1">
              <span className="font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <span>Letter with 2 (R2, U2)</span>
              </span>
              <p className="text-slate-400">
                Turn that face <strong>180°</strong> (half-turn in either direction).
              </p>
            </div>
          </div>

          {/* Move Grid Dictionary */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3">All Standard Moves:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {NOTATION_KEYS.map((key) => {
                const desc = MOVE_DESCRIPTIONS[key];
                return (
                  <div
                    key={key}
                    className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-start gap-3"
                  >
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center font-mono font-black text-cyan-300 text-lg shrink-0">
                      {key}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-200">{desc.name}</span>
                      <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
                        {desc.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
