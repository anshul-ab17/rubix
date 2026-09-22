'use client';

import React, { useState } from 'react';
import { useCubeStore } from '@/stores/cube-store';
import { Copy, Check, Play, Download, Sparkles, AlertCircle } from 'lucide-react';

export const SolutionViewer: React.FC = () => {
  const solutionResult = useCubeStore((s) => s.solutionResult);
  const isSolving = useCubeStore((s) => s.isSolving);
  const solveCurrentCube = useCubeStore((s) => s.solveCurrentCube);
  const togglePlay = useCubeStore((s) => s.togglePlay);
  const isPlaying = useCubeStore((s) => s.isPlaying);
  const validation = useCubeStore((s) => s.validation);

  const [activeTab, setActiveTab] = useState<'moves' | 'steps'>('moves');
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
    <div className="h-full flex flex-col justify-between p-3.5 bg-[#0f172a]/95 rounded-2xl border border-slate-800/80 shadow-md select-none">
      <div>
        {/* Top Header & Copy */}
        <div className="flex items-start justify-between mb-2">
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">
              3. Solution &amp; Steps
            </h2>
            <p className="text-[11px] text-slate-400">
              Optimal 2-Phase Kociemba solver
            </p>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            disabled={!notationString}
            className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            title="Copy Solution"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Segmented Tab Switcher */}
        <div className="grid grid-cols-2 gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 mb-2.5">
          <button
            type="button"
            onClick={() => setActiveTab('moves')}
            className={`py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'moves'
                ? 'bg-blue-600 text-white shadow-xs font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Move Notation
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('steps')}
            className={`py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'steps'
                ? 'bg-blue-600 text-white shadow-xs font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Step Breakdown
          </button>
        </div>

        {/* Move Notation Box */}
        <div className="p-2.5 bg-slate-900/90 border border-slate-800 rounded-xl min-h-[58px] flex items-center justify-center text-center mb-2.5">
          {solutionResult ? (
            <p className="font-mono text-xs font-bold tracking-wider text-slate-200 leading-relaxed break-words line-clamp-3">
              {notationString || 'Solved! No moves needed.'}
            </p>
          ) : isSolving ? (
            <div className="flex items-center gap-2 text-xs text-blue-400 font-medium animate-pulse">
              <Sparkles className="w-4 h-4 animate-spin text-blue-400" />
              <span>Computing optimal Two-Phase solution...</span>
            </div>
          ) : !validation.isValid ? (
            <div className="flex items-center gap-1.5 text-xs text-amber-300">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Invalid cube configuration</span>
            </div>
          ) : (
            <p className="text-xs text-slate-500 font-medium">
              Click &quot;Animate Solution&quot; to compute optimal moves
            </p>
          )}
        </div>

        {/* 3 Stats Metrics Row */}
        <div className="grid grid-cols-3 gap-1.5 mb-2.5">
          {/* Card 1: Move Count */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-2 flex flex-col items-center justify-center text-center">
            <span className="text-sm sm:text-base font-extrabold text-blue-400 font-mono">
              {solutionResult ? moveCount : '—'}
            </span>
            <span className="text-[10px] font-semibold text-blue-400/80">Moves</span>
          </div>

          {/* Card 2: Estimated Time */}
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-2 flex flex-col items-center justify-center text-center">
            <span className="text-sm sm:text-base font-extrabold text-emerald-400 font-mono">
              {solutionResult ? estTimeStr : '—'}
            </span>
            <span className="text-[10px] font-semibold text-emerald-400/80">Est. Time</span>
          </div>

          {/* Card 3: Optimality */}
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-2 flex flex-col items-center justify-center text-center">
            <span className="text-xs sm:text-sm font-extrabold text-purple-400">
              Optimal
            </span>
            <span className="text-[10px] font-semibold text-purple-400/80">Two-Phase</span>
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
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 active:scale-[0.99] disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
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
            className="py-1.5 px-3 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-all disabled:opacity-30 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5 text-slate-400" />
            <span>Copy Moves</span>
          </button>

          <button
            type="button"
            onClick={handleExport}
            disabled={!notationString}
            className="py-1.5 px-3 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-all disabled:opacity-30 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export</span>
          </button>
        </div>
      </div>
    </div>
  );
};
