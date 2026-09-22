'use client';

import React, { useEffect, useRef } from 'react';
import { useCubeStore } from '@/stores/cube-store';
import { Play, Pause, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { RubixLogo } from '@/components/ui/RubixLogo';

export const LiveSolvingCard: React.FC = () => {
  const solutionResult = useCubeStore((s) => s.solutionResult);
  const currentStepIndex = useCubeStore((s) => s.currentStepIndex);
  const isPlaying = useCubeStore((s) => s.isPlaying);
  const playbackSpeed = useCubeStore((s) => s.playbackSpeed);
  const nextStep = useCubeStore((s) => s.nextStep);
  const prevStep = useCubeStore((s) => s.prevStep);
  const togglePlay = useCubeStore((s) => s.togglePlay);
  const setCurrentStepIndex = useCubeStore((s) => s.setCurrentStepIndex);
  const setPlaybackSpeed = useCubeStore((s) => s.setPlaybackSpeed);

  const steps = solutionResult?.steps || [];
  const totalMoves = steps.length;
  const isCompleted = currentStepIndex >= totalMoves && totalMoves > 0;
  const carouselRef = useRef<HTMLDivElement>(null);

  // Autoplay loop with playbackSpeed
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying && totalMoves > 0) {
      if (currentStepIndex >= totalMoves) {
        useCubeStore.getState().setIsPlaying(false);
      } else {
        timer = setTimeout(() => {
          nextStep();
        }, playbackSpeed);
      }
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isPlaying, currentStepIndex, totalMoves, playbackSpeed, nextStep]);

  // Auto scroll active step into view in the filmstrip
  useEffect(() => {
    if (carouselRef.current && currentStepIndex > 0) {
      const activeEl = carouselRef.current.children[currentStepIndex - 1] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [currentStepIndex]);

  const speedOptions = [
    { label: '0.5x', speed: 1800 },
    { label: '1.0x', speed: 900 },
    { label: '1.5x', speed: 600 },
    { label: '2.0x', speed: 350 },
  ];

  return (
    <div className="w-full bg-slate-50 dark:bg-[#0f172a]/95 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-3 shadow-2xs dark:shadow-md select-none transition-colors duration-200">
      {/* Top Header Row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white tracking-tight">
            Live Solving Filmstrip
          </h3>
          <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/25">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
            {isPlaying ? 'Solving...' : isCompleted ? 'Completed' : 'Ready'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400">
            {totalMoves > 0 ? `${currentStepIndex} / ${totalMoves} moves` : '0 / 0 moves'}
          </span>
          <div className="w-20 sm:w-28 h-1.5 bg-slate-200 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-300 dark:border-slate-800">
            <div
              className="h-full bg-blue-500 transition-all duration-200"
              style={{
                width: `${totalMoves > 0 ? (currentStepIndex / totalMoves) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Steps Carousel / Filmstrip */}
      <div
        ref={carouselRef}
        className="flex items-center gap-2 overflow-x-auto py-1 mb-2.5 scrollbar-none"
      >
        {totalMoves > 0 ? (
          steps.map((step, idx) => {
            const stepNum = idx + 1;
            const isActive = currentStepIndex === stepNum;
            const isPassed = currentStepIndex > stepNum;

            return (
              <div
                key={idx}
                onClick={() => setCurrentStepIndex(stepNum)}
                className={`
                  flex flex-col items-center gap-1 p-1.5 rounded-xl border transition-all cursor-pointer shrink-0
                  ${
                    isActive
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/15 ring-2 ring-blue-500/30 shadow-xs scale-102'
                      : isPassed
                      ? 'border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50 opacity-60 hover:opacity-100'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:border-slate-300 dark:hover:border-slate-700'
                  }
                `}
              >
                {/* Mini Cube Thumbnail */}
                <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center p-0.5">
                  <RubixLogo size={22} />
                </div>

                {/* Move Pill Badge */}
                <span
                  className={`
                    text-[11px] font-mono font-bold px-2 py-0.5 rounded-md
                    ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }
                  `}
                >
                  {step.move}
                </span>
              </div>
            );
          })
        ) : (
          <div className="w-full py-4 text-center text-xs text-slate-400 dark:text-slate-500 font-medium">
            Solve or scramble the cube to preview animated step progression
          </div>
        )}
      </div>

      {/* Bottom Playback Controls */}
      <div className="flex items-center justify-center gap-4 relative">
        {/* Previous Step */}
        <button
          type="button"
          onClick={prevStep}
          disabled={currentStepIndex <= 0 || isPlaying}
          className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="Previous Step"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Play / Pause Circular Button */}
        <button
          type="button"
          onClick={togglePlay}
          disabled={totalMoves === 0}
          className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 active:scale-95 disabled:opacity-40 text-white shadow-md shadow-blue-500/25 flex items-center justify-center transition-all cursor-pointer"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-white" />
          ) : (
            <Play className="w-4 h-4 fill-white translate-x-0.5" />
          )}
        </button>

        {/* Next Step */}
        <button
          type="button"
          onClick={nextStep}
          disabled={currentStepIndex >= totalMoves || isPlaying}
          className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="Next Step"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Speed Dropdown */}
        <div className="absolute right-1 flex items-center">
          <select
            value={playbackSpeed}
            onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
            className="text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1 pr-6 cursor-pointer appearance-none outline-none"
          >
            {speedOptions.map((opt) => (
              <option key={opt.speed} value={opt.speed} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none -ml-5" />
        </div>
      </div>
    </div>
  );
};
