'use client';

import React from 'react';
import { X, BookOpen, Compass, RotateCw, RotateCcw, Check } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Rubik&rsquo;s Cube Notation Guide</h3>
              <p className="text-xs text-slate-400">
                Official WCA notation and beginner reference
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-slate-600">
          {/* Orientation Rule */}
          <div className="bg-blue-50/60 border border-blue-100 p-3.5 rounded-2xl flex items-start gap-3">
            <Compass className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-blue-900">How to Hold the Cube</h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Keep <strong className="text-emerald-600">Green</strong> in front and <strong className="text-slate-800">White</strong> on top. Every face turn is defined relative to this starting position:
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 mt-2.5 text-center text-[11px] font-mono font-bold">
                <div className="bg-white p-1.5 rounded-lg border border-slate-200 text-slate-700">U = Up</div>
                <div className="bg-white p-1.5 rounded-lg border border-slate-200 text-slate-700">D = Down</div>
                <div className="bg-white p-1.5 rounded-lg border border-slate-200 text-slate-700">F = Front</div>
                <div className="bg-white p-1.5 rounded-lg border border-slate-200 text-slate-700">B = Back</div>
                <div className="bg-white p-1.5 rounded-lg border border-slate-200 text-slate-700">R = Right</div>
                <div className="bg-white p-1.5 rounded-lg border border-slate-200 text-slate-700">L = Left</div>
              </div>
            </div>
          </div>

          {/* Notation Rules */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex flex-col gap-1">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <RotateCw className="w-3.5 h-3.5 text-emerald-600" />
                <span>Single Letter (R, U)</span>
              </span>
              <p className="text-[11px] text-slate-500">
                Turn face <strong>90° clockwise</strong> looking directly at that face.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex flex-col gap-1">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                <span>Prime (R&apos;, U&apos;)</span>
              </span>
              <p className="text-[11px] text-slate-500">
                Turn face <strong>90° counter-clockwise</strong>.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex flex-col gap-1">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-purple-600" />
                <span>Double Turn (R2, U2)</span>
              </span>
              <p className="text-[11px] text-slate-500">
                Turn face <strong>180°</strong> in either direction.
              </p>
            </div>
          </div>

          {/* Move Grid Dictionary */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 mb-2">Standard Notation Reference:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {NOTATION_KEYS.map((key) => {
                const desc = MOVE_DESCRIPTIONS[key];
                return (
                  <div
                    key={key}
                    className="p-2 bg-slate-50 border border-slate-200/80 rounded-xl flex items-start gap-2.5"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center font-mono font-bold text-blue-700 text-sm shrink-0">
                      {key}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-800">{desc.name}</span>
                      <p className="text-[10px] text-slate-500 leading-tight">
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
