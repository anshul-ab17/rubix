'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useCubeStore } from '@/stores/cube-store';
import { StandardMove } from '@/types/cube';
import { Shuffle, Trophy, BarChart2, Flame, Play, Square, RotateCcw } from 'lucide-react';

interface SolveRecord {
  id: string;
  timeMs: number;
  scramble: string;
  date: Date;
}

const MOVE_BUTTONS: StandardMove[] = [
  'U', "U'", 'U2',
  'D', "D'", 'D2',
  'R', "R'", 'R2',
  'L', "L'", 'L2',
  'F', "F'", 'F2',
  'B', "B'", 'B2',
];

export const CubeTimer: React.FC = () => {
  const currentScramble = useCubeStore((s) => s.currentScramble);
  const scrambleCube = useCubeStore((s) => s.scrambleCube);
  const isScrambling = useCubeStore((s) => s.isScrambling);
  const applySingleMove = useCubeStore((s) => s.applySingleMove);
  const resetCube = useCubeStore((s) => s.resetCube);

  const [activeTab, setActiveTab] = useState<'timer' | 'freeplay'>('timer');
  const [timerState, setTimerState] = useState<'idle' | 'holding' | 'ready' | 'running'>('idle');
  const [timeMs, setTimeMs] = useState(0);
  const [history, setHistory] = useState<SolveRecord[]>([]);

  const startTimeRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Generate initial scramble if none
  useEffect(() => {
    if (!currentScramble) {
      scrambleCube(20);
    }
  }, [currentScramble, scrambleCube]);

  // Stop Timer
  const stopTimer = useCallback(() => {
    if (timerState === 'running') {
      const finalTime = performance.now() - startTimeRef.current;
      setTimeMs(finalTime);
      setTimerState('idle');
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }

      setHistory((prev) => [
        {
          id: Math.random().toString(36).substring(2, 9),
          timeMs: finalTime,
          scramble: currentScramble,
          date: new Date(),
        },
        ...prev,
      ]);
    }
  }, [timerState, currentScramble]);

  // Start Timer
  const startTimer = useCallback(() => {
    setTimerState('running');
    startTimeRef.current = performance.now();

    const tick = () => {
      setTimeMs(performance.now() - startTimeRef.current);
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);
  }, []);

  // Keyboard Spacebar Listener for WCA-style timer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTab !== 'timer') return;
      if (e.code === 'Space' && (e.target as HTMLElement)?.tagName !== 'INPUT') {
        e.preventDefault();

        if (timerState === 'running') {
          stopTimer();
        } else if (timerState === 'idle') {
          setTimerState('holding');
          holdTimeoutRef.current = setTimeout(() => {
            setTimerState('ready');
          }, 350);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (activeTab !== 'timer') return;
      if (e.code === 'Space') {
        e.preventDefault();

        if (holdTimeoutRef.current) {
          clearTimeout(holdTimeoutRef.current);
        }

        if (timerState === 'ready') {
          startTimer();
        } else if (timerState === 'holding') {
          setTimerState('idle');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [timerState, startTimer, stopTimer, activeTab]);

  // Format Millisecond Time (e.g., "12.45")
  const formatTime = (ms: number) => {
    const totalSeconds = ms / 1000;
    const mins = Math.floor(totalSeconds / 60);
    const secs = (totalSeconds % 60).toFixed(2);
    if (mins > 0) {
      return `${mins}:${secs.padStart(5, '0')}`;
    }
    return secs;
  };

  // Metrics: Best Time & Ao5
  const bestTime = history.length > 0 ? Math.min(...history.map((h) => h.timeMs)) : null;

  const calculateAo5 = () => {
    if (history.length < 5) return null;
    const last5 = history.slice(0, 5).map((h) => h.timeMs);
    const sorted = [...last5].sort((a, b) => a - b);
    const middle3 = sorted.slice(1, 4);
    return middle3.reduce((a, b) => a + b, 0) / 3;
  };
  const ao5 = calculateAo5();

  return (
    <div className="h-full flex flex-col justify-between p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs select-none">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              4. Timer &amp; Freeplay
            </h2>
            <p className="text-[11px] text-slate-400">
              Practice, scramble and beat your best time
            </p>
          </div>
        </div>

        {/* Segmented Switcher */}
        <div className="grid grid-cols-2 gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/60 mb-3">
          <button
            type="button"
            onClick={() => setActiveTab('timer')}
            className={`py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'timer'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Timer
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('freeplay')}
            className={`py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'freeplay'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Freeplay
          </button>
        </div>

        {activeTab === 'timer' ? (
          /* Large Digital Timer View */
          <div>
            <div className="py-2.5 flex flex-col items-center justify-center text-center">
              <span
                className={`
                  text-3xl sm:text-4xl font-extrabold font-mono tracking-tight transition-colors duration-150
                  ${
                    timerState === 'ready'
                      ? 'text-emerald-500 scale-105'
                      : timerState === 'holding'
                      ? 'text-amber-500'
                      : timerState === 'running'
                      ? 'text-blue-600'
                      : 'text-slate-900'
                  }
                `}
              >
                {formatTime(timeMs)}
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5 font-medium">
                {timerState === 'running'
                  ? 'Spacebar or tap Stop to finish'
                  : timerState === 'ready'
                  ? 'Release to START!'
                  : timerState === 'holding'
                  ? 'Hold ready...'
                  : 'Press Spacebar to start'}
              </span>
            </div>

            {/* 3 Metrics Row */}
            <div className="grid grid-cols-3 gap-1.5 mt-2">
              {/* Best Time */}
              <div className="bg-amber-50/70 border border-amber-100 rounded-xl p-1.5 flex flex-col items-center justify-center text-center">
                <div className="flex items-center gap-1 text-amber-600 text-[10px] font-bold">
                  <Trophy className="w-3 h-3" />
                  <span>Best Time</span>
                </div>
                <span className="text-xs font-mono font-extrabold text-amber-800 mt-0.5">
                  {bestTime ? formatTime(bestTime) : '—'}
                </span>
              </div>

              {/* Solves Count */}
              <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-1.5 flex flex-col items-center justify-center text-center">
                <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-bold">
                  <BarChart2 className="w-3 h-3" />
                  <span>Solves</span>
                </div>
                <span className="text-xs font-mono font-extrabold text-emerald-800 mt-0.5">
                  {history.length}
                </span>
              </div>

              {/* Ao5 */}
              <div className="bg-rose-50/70 border border-rose-100 rounded-xl p-1.5 flex flex-col items-center justify-center text-center">
                <div className="flex items-center gap-1 text-rose-600 text-[10px] font-bold">
                  <Flame className="w-3 h-3" />
                  <span>Ao5</span>
                </div>
                <span className="text-xs font-mono font-extrabold text-rose-800 mt-0.5">
                  {ao5 ? formatTime(ao5) : '—'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Freeplay Interactive Pad */
          <div className="py-1">
            <div className="grid grid-cols-6 gap-1 mb-2">
              {MOVE_BUTTONS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => applySingleMove(m)}
                  className="py-1 px-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-blue-600 font-mono font-bold text-[11px] border border-slate-200 transition-colors cursor-pointer text-center"
                >
                  {m}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-center text-slate-400">
              Click buttons to rotate layers freely in 3D
            </p>
          </div>
        )}
      </div>

      {/* Bottom Buttons */}
      <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={() => scrambleCube(20)}
          disabled={isScrambling}
          className="py-1.5 px-3 bg-white hover:bg-slate-50 disabled:opacity-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
        >
          <Shuffle className={`w-3.5 h-3.5 text-slate-500 ${isScrambling ? 'animate-spin text-blue-600' : ''}`} />
          <span>{isScrambling ? 'Shuffling...' : 'Scramble'}</span>
        </button>

        {activeTab === 'timer' ? (
          <button
            type="button"
            onClick={timerState === 'running' ? stopTimer : startTimer}
            className={`py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer ${
              timerState === 'running'
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
            }`}
          >
            {timerState === 'running' ? (
              <>
                <Square className="w-3.5 h-3.5 fill-white" />
                <span>Stop</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Start Timer</span>
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={resetCube}
            className="py-1.5 px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Solved</span>
          </button>
        )}
      </div>
    </div>
  );
};
