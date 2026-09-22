'use client';

import React, { useEffect, useCallback } from 'react';
import { useCubeStore } from '@/stores/cube-store';
import { Cube3D } from '@/components/cube/Cube3D';
import { ProgressBar } from './ProgressBar';
import { MoveControls } from './MoveControls';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Sparkles, 
  RotateCcw, 
  HelpCircle, 
  Hand, 
  Eye, 
  Edit3,
  Layers
} from 'lucide-react';

export const SolutionViewer: React.FC = () => {
  const solutionResult = useCubeStore((s) => s.solutionResult);
  const currentStepIndex = useCubeStore((s) => s.currentStepIndex);
  const isPlaying = useCubeStore((s) => s.isPlaying);
  const playbackSpeed = useCubeStore((s) => s.playbackSpeed);
  const nextStep = useCubeStore((s) => s.nextStep);
  const prevStep = useCubeStore((s) => s.prevStep);
  const togglePlay = useCubeStore((s) => s.togglePlay);
  const setIsPlaying = useCubeStore((s) => s.setIsPlaying);
  const setCurrentStepIndex = useCubeStore((s) => s.setCurrentStepIndex);
  const setPlaybackSpeed = useCubeStore((s) => s.setPlaybackSpeed);
  const setInputMode = useCubeStore((s) => s.setInputMode);
  const resetCube = useCubeStore((s) => s.resetCube);

  const steps = solutionResult?.steps || [];
  const totalSteps = steps.length;
  const isCompleted = currentStepIndex >= totalSteps && totalSteps > 0;
  const currentStep = currentStepIndex > 0 && currentStepIndex <= totalSteps ? steps[currentStepIndex - 1] : null;

  // Trigger celebration confetti on solve completion
  useEffect(() => {
    if (isCompleted) {
      setIsPlaying(false);
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#22c55e', '#3b82f6', '#facc15', '#ef4444', '#f97316', '#ffffff'],
        });
      } catch {
        // ignore in tests/ssr
      }
    }
  }, [isCompleted, setIsPlaying]);

  // Autoplay timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying && currentStepIndex < totalSteps) {
      timer = setTimeout(() => {
        nextStep();
      }, playbackSpeed);
    } else if (currentStepIndex >= totalSteps) {
      setIsPlaying(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isPlaying, currentStepIndex, totalSteps, playbackSpeed, nextStep, setIsPlaying]);

  // Global Keyboard Navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        nextStep();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        prevStep();
      }
    },
    [togglePlay, nextStep, prevStep]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!solutionResult || !solutionResult.success) {
    return (
      <div className="w-full max-w-xl mx-auto p-8 bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 rounded-3xl text-center flex flex-col items-center gap-4">
        <Layers className="w-12 h-12 text-slate-500" />
        <h3 className="text-xl font-bold text-white">No Active Solution</h3>
        <p className="text-sm text-slate-400">
          Please build or scan a cube state and click &ldquo;Solve Cube&rdquo; to generate step-by-step instructions.
        </p>
        <button
          onClick={() => setInputMode('edit')}
          className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/20"
        >
          Open Cube Editor
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
      {/* Top Header Card */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 p-4 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-slate-950 font-bold shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Solution Guide</h2>
            <p className="text-xs text-slate-400">
              Optimal Two-Phase Algorithm &bull; <span className="text-cyan-400 font-semibold">{totalSteps} moves total</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setInputMode('edit')}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Edit3 className="w-4 h-4 text-cyan-400" />
            <span>Edit Cube</span>
          </button>
          <button
            onClick={() => {
              resetCube();
              setInputMode('edit');
            }}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span>New Solve</span>
          </button>
        </div>
      </div>

      {/* Main Solver Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 3D Animated Interactive Cube */}
        <div className="lg:col-span-6 bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 p-4 rounded-3xl shadow-xl flex flex-col gap-3 min-h-[420px]">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs sm:text-sm font-semibold text-slate-300 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span>3D Cube Simulation</span>
            </span>
            <span className="text-[11px] text-slate-400">
              Updates in real-time with each step
            </span>
          </div>

          <div className="flex-1 w-full bg-slate-950/60 rounded-2xl border border-slate-800/80 overflow-hidden relative min-h-[360px]">
            <Cube3D
              interactive={true}
              highlightMove={currentStep ? currentStep.move : null}
            />
          </div>
        </div>

        {/* Right: Current Move Card & Instruction */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          {/* Active Step Card */}
          {isCompleted ? (
            <div className="bg-gradient-to-br from-emerald-950/50 via-slate-900 to-teal-950/50 border border-emerald-500/40 p-6 sm:p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center gap-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-white">Cube Solved!</h3>
                <p className="text-sm text-emerald-300 mt-1">
                  Congratulations! All 6 faces have been restored to their solved state in {totalSteps} moves.
                </p>
              </div>

              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={() => setCurrentStepIndex(0)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Replay Solution</span>
                </button>
                <button
                  onClick={() => {
                    resetCube();
                    setInputMode('edit');
                  }}
                  className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold rounded-xl text-xs shadow-lg transition-all cursor-pointer"
                >
                  Solve Another Cube
                </button>
              </div>
            </div>
          ) : currentStep ? (
            <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/60 p-6 rounded-3xl shadow-xl flex flex-col gap-5">
              {/* Header: Move Notation & Direction Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-teal-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-mono text-3xl font-extrabold shadow-inner">
                    {currentStep.notation}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                      Step {currentStepIndex} of {totalSteps}
                    </span>
                    <h3 className="text-xl font-bold text-white capitalize">
                      {currentStep.face} Face {currentStep.direction}
                    </h3>
                  </div>
                </div>

                <div className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold capitalize">
                  {currentStep.direction} ({currentStep.quarterTurns * 90}°)
                </div>
              </div>

              {/* Description */}
              <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                  <span>What to do:</span>
                </span>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
                  {currentStep.description}
                </p>
              </div>

              {/* Hand/Fingertrick Tip */}
              <div className="bg-cyan-950/20 border border-cyan-500/20 p-4 rounded-2xl flex items-start gap-3">
                <Hand className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-cyan-300 block mb-0.5">
                    Pro Fingertrick Tip:
                  </span>
                  <p className="text-xs text-slate-300 leading-normal">
                    {currentStep.handHint}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/60 p-6 rounded-3xl shadow-xl flex flex-col gap-4 items-center text-center justify-center min-h-[260px]">
              <h3 className="text-lg font-bold text-white">Starting Position</h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Hold your Rubik&rsquo;s Cube with the <strong className="text-white">Green</strong> face facing you (Front) and the <strong className="text-white">White</strong> face on top (Up). Click Play or Next to start following the moves.
              </p>
            </div>
          )}

          {/* Progress Bar & Pills */}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 p-4 rounded-2xl shadow-xl">
            <ProgressBar
              currentStep={currentStepIndex}
              totalSteps={totalSteps}
              steps={steps}
              onSelectStep={(idx) => setCurrentStepIndex(idx)}
            />
          </div>

          {/* Playback Controls */}
          <MoveControls
            currentStep={currentStepIndex}
            totalSteps={totalSteps}
            isPlaying={isPlaying}
            playbackSpeed={playbackSpeed}
            onPrev={prevStep}
            onNext={nextStep}
            onTogglePlay={togglePlay}
            onReset={() => setCurrentStepIndex(0)}
            onSpeedChange={setPlaybackSpeed}
          />
        </div>
      </div>
    </div>
  );
};
