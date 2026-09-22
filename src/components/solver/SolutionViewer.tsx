'use client';

import React, { useState } from 'react';
import { useCubeStore } from '@/stores/cube-store';
import { Copy, Check, Play, Download, Sparkles, AlertCircle } from 'lucide-react';

interface SolutionViewerProps {
  onOpenGuide?: () => void;
}

export const SolutionViewer: React.FC<SolutionViewerProps> = ({ onOpenGuide }) => {
  const solutionResult = useCubeStore((s) => s.solutionResult);
  const isSolving = useCubeStore((s) => s.isSolving);
  const solveCurrentCube = useCubeStore((s) => s.solveCurrentCube);
  const togglePlay = useCubeStore((s) => s.togglePlay);
  const isPlaying = useCubeStore((s) => s.isPlaying);
  const validation = useCubeStore((s) => s.validation);

  const [activeTab, setActiveTab] = useState<'moves' | 'steps' | 'guide'>('moves');
  const [copied, setCopied] = useState(false);

  const moves = solutionResult?.moves || [];
  const moveCount = moves.length;
  const notationString = solutionResult?.notationString || '';

  const handleCopy = async () => {
    if (!notationString) return;
    try {
      await navigator.clipboard.writeText(notationString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleExport = () => {
    if (!notationString) return;
    const blob = new Blob([notationString], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rubix-solution-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAnimateClick = async () => {
    if (!solutionResult) {
      const ok = await solveCurrentCube();
      if (ok) {
        useCubeStore.getState().setIsPlaying(true);
      }
    } else {
      togglePlay();
    }
  };

  // Estimated solving time calculation (~2.5s per move for human average)
  const estSeconds = Math.max(10, Math.round(moveCount * 2.5));
  const estTimeStr = estSeconds < 60 ? `~${estSeconds}s` : `~${Math.ceil(estSeconds / 60)} min`;

  return (
    <div className="h-full flex flex-col justify-between p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs select-none">
      <div>
        {/* Top Header & Copy */}
        <div className="flex items-start justify-between mb-2">
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              3. Solution &amp; Steps
            </h2>
            <p className="text-[11px] text-slate-400">
              Optimized solution using Kociemba algorithm
            </p>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            disabled={!notationString}
            className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            title="Copy Solution"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Segmented Tab Switcher */}
        <div className="grid grid-cols-3 gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/60 mb-2.5">
          <button
            type="button"
            onClick={() => setActiveTab('moves')}
            className={`py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'moves'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Moves
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('steps')}
            className={`py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'steps'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Step by Step
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('guide');
              if (onOpenGuide) onOpenGuide();
            }}
            className={`py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'guide'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Beginner Guide
          </button>
        </div>

        {/* Move Notation Box */}
        <div className="p-2.5 bg-slate-50/80 border border-slate-200/70 rounded-xl min-h-[58px] flex items-center justify-center text-center mb-2.5">
          {solutionResult ? (
            <p className="font-mono text-xs font-bold tracking-wider text-slate-800 leading-relaxed break-words line-clamp-3">
              {notationString || 'Solved! No moves needed.'}
            </p>
          ) : isSolving ? (
            <div className="flex items-center gap-2 text-xs text-blue-600 font-medium animate-pulse">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Computing optimal Two-Phase solution...</span>
            </div>
          ) : !validation.isValid ? (
            <div className="flex items-center gap-1.5 text-xs text-amber-700">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
              <span>Invalid cube configuration</span>
            </div>
          ) : (
            <p className="text-xs text-slate-400 font-medium">
              Click &quot;Animate Solution&quot; to calculate optimal solution
            </p>
          )}
        </div>

        {/* 3 Stats Metrics Row */}
        <div className="grid grid-cols-3 gap-1.5 mb-2.5">
          {/* Card 1: Move Count */}
          <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-2 flex flex-col items-center justify-center text-center">
            <span className="text-sm sm:text-base font-extrabold text-blue-700 font-mono">
              {solutionResult ? moveCount : '—'}
            </span>
            <span className="text-[10px] font-semibold text-blue-500">Moves</span>
          </div>

          {/* Card 2: Estimated Time */}
          <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-2 flex flex-col items-center justify-center text-center">
            <span className="text-sm sm:text-base font-extrabold text-emerald-700 font-mono">
              {solutionResult ? estTimeStr : '—'}
            </span>
            <span className="text-[10px] font-semibold text-emerald-500">Est. Time</span>
          </div>

          {/* Card 3: Optimality */}
          <div className="bg-purple-50/70 border border-purple-100 rounded-xl p-2 flex flex-col items-center justify-center text-center">
            <span className="text-xs sm:text-sm font-extrabold text-purple-700">
              Optimal
            </span>
            <span className="text-[10px] font-semibold text-purple-500">(Usually)</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-1.5">
        {/* Large Blue Animate Button */}
        <button
          type="button"
          onClick={handleAnimateClick}
          disabled={!validation.isValid || isSolving}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>{isPlaying ? 'Pause Solution' : 'Animate Solution'}</span>
        </button>

        {/* Secondary Buttons Row */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleCopy}
            disabled={!notationString}
            className="py-1.5 px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-all disabled:opacity-40 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5 text-slate-500" />
            <span>Copy Moves</span>
          </button>

          <button
            type="button"
            onClick={handleExport}
            disabled={!notationString}
            className="py-1.5 px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-all disabled:opacity-40 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export</span>
          </button>
        </div>
      </div>
    </div>
  );
};
