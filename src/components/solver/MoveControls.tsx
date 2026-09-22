'use client';

import React from 'react';
import { 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Gauge 
} from 'lucide-react';

interface MoveControlsProps {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  playbackSpeed: number;
  onPrev: () => void;
  onNext: () => void;
  onTogglePlay: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
}

export const MoveControls: React.FC<MoveControlsProps> = ({
  currentStep,
  totalSteps,
  isPlaying,
  playbackSpeed,
  onPrev,
  onNext,
  onTogglePlay,
  onReset,
  onSpeedChange,
}) => {
  const isFirst = currentStep === 0;
  const isLast = currentStep >= totalSteps;

  const speedOptions = [
    { label: '0.5s', value: 500 },
    { label: '1.0s', value: 1000 },
    { label: '1.5s', value: 1500 },
    { label: '2.0s', value: 2000 },
  ];

  return (
    <div className="w-full flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 backdrop-blur-xl border border-slate-700/60 p-4 rounded-2xl shadow-xl">
      {/* Playback & Step Navigation */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Reset to Step 0 */}
        <button
          onClick={onReset}
          title="Reset to beginning"
          className="p-2.5 sm:p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-all active:scale-95 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Previous Move */}
        <button
          onClick={onPrev}
          disabled={isFirst}
          title="Previous move (Left Arrow)"
          className={`p-2.5 sm:p-3 rounded-xl border transition-all active:scale-95 cursor-pointer ${
            isFirst
              ? 'bg-slate-800/40 text-slate-600 border-slate-800 cursor-not-allowed'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 hover:text-white'
          }`}
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Play / Pause Main Button */}
        <button
          onClick={onTogglePlay}
          disabled={isLast && !isPlaying}
          className={`px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer ${
            isPlaying
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
              : isLast
              ? 'bg-slate-800 text-slate-600 border border-slate-800 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 shadow-cyan-500/25'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-5 h-5 fill-current" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              <span>{isFirst ? 'Auto-Play' : 'Continue'}</span>
            </>
          )}
        </button>

        {/* Next Move */}
        <button
          onClick={onNext}
          disabled={isLast}
          title="Next move (Right Arrow)"
          className={`p-2.5 sm:p-3 rounded-xl border transition-all active:scale-95 cursor-pointer ${
            isLast
              ? 'bg-slate-800/40 text-slate-600 border-slate-800 cursor-not-allowed'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 hover:text-white'
          }`}
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Speed Selector & Keyboard Hints */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
          <div className="px-2 text-slate-400 flex items-center gap-1 text-xs">
            <Gauge className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Speed:</span>
          </div>
          {speedOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onSpeedChange(opt.value)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                playbackSpeed === opt.value
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
