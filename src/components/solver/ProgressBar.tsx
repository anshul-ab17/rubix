'use client';

import React from 'react';
import { SolveStep } from '@/types/cube';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  steps: SolveStep[];
  onSelectStep: (index: number) => void;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  steps,
  onSelectStep,
}) => {
  const percentage = totalSteps > 0 ? Math.round((currentStep / totalSteps) * 100) : 0;

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Progress Info Header */}
      <div className="flex items-center justify-between text-xs sm:text-sm">
        <span className="font-semibold text-slate-300">
          Step <span className="text-cyan-400 font-mono font-bold">{currentStep}</span> of <span className="font-mono">{totalSteps}</span>
        </span>
        <span className="font-mono font-bold text-slate-400">
          {percentage}% Complete
        </span>
      </div>

      {/* Main Continuous Progress Bar */}
      <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/60 shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 rounded-full transition-all duration-300 shadow-md"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Interactive Move Pills Carousel / Timeline */}
      <div className="w-full flex items-center gap-1.5 overflow-x-auto py-2 px-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {/* Start State (Step 0) */}
        <button
          onClick={() => onSelectStep(0)}
          className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all shrink-0 cursor-pointer ${
            currentStep === 0
              ? 'bg-cyan-500 text-slate-950 shadow-md scale-105'
              : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
          }`}
        >
          Start
        </button>

        {steps.map((step, idx) => {
          const stepNum = idx + 1;
          const isPassed = stepNum <= currentStep;
          const isCurrent = stepNum === currentStep;

          return (
            <button
              key={idx}
              onClick={() => onSelectStep(stepNum)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all shrink-0 cursor-pointer ${
                isCurrent
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 shadow-lg scale-110 ring-2 ring-emerald-300'
                  : isPassed
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30 hover:bg-slate-700'
                  : 'bg-slate-800/60 text-slate-400 border border-slate-700/40 hover:text-slate-200 hover:bg-slate-700'
              }`}
            >
              {step.notation}
            </button>
          );
        })}

        {/* Solved State Pill */}
        <button
          onClick={() => onSelectStep(totalSteps)}
          className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all shrink-0 cursor-pointer ${
            currentStep === totalSteps
              ? 'bg-emerald-400 text-slate-950 shadow-md scale-105'
              : 'bg-slate-800/80 text-emerald-500/60 hover:text-emerald-400 hover:bg-slate-700'
          }`}
        >
          Solved ✓
        </button>
      </div>
    </div>
  );
};
