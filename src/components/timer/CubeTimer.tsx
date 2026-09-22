'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useCubeStore } from '@/stores/cube-store';
import { Cube3D } from '@/components/cube/Cube3D';
import { StandardMove } from '@/types/cube';
import { 
  Timer, 
  Shuffle, 
  RotateCcw, 
  Trophy, 
  Flame, 
  Trash2, 
  Sparkles,
  Play
} from 'lucide-react';

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
  const applySingleMove = useCubeStore((s) => s.applySingleMove);
  const resetCube = useCubeStore((s) => s.resetCube);

  const [timerState, setTimerState] = useState<'idle' | 'holding' | 'ready' | 'running' | 'inspection'>('idle');
  const [timeMs, setTimeMs] = useState(0);
  const [inspectionSeconds, setInspectionSeconds] = useState(15);
  const [history, setHistory] = useState<SolveRecord[]>([]);

  const startTimeRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Generate initial scramble if empty
  useEffect(() => {
    if (!currentScramble) {
      scrambleCube(20);
    }
  }, [currentScramble, scrambleCube]);

  // Timer loop
  useEffect(() => {
    if (timerState === 'running') {
      const updateTimer = () => {
        setTimeMs(Date.now() - startTimeRef.current);
        animFrameRef.current = requestAnimationFrame(updateTimer);
      };
      startTimeRef.current = Date.now();
      animFrameRef.current = requestAnimationFrame(updateTimer);
    } else {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    }

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [timerState]);

  // Spacebar controls
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (timerState === 'running') {
          // Stop timer
          const finalTime = Date.now() - startTimeRef.current;
          setTimeMs(finalTime);
          setTimerState('idle');
          setHistory((prev) => [
            {
              id: Math.random().toString(),
              timeMs: finalTime,
              scramble: currentScramble,
              date: new Date(),
            },
            ...prev,
          ]);
        } else if (timerState === 'idle') {
          setTimerState('holding');
          if (!holdTimeoutRef.current) {
            holdTimeoutRef.current = setTimeout(() => {
              setTimerState('ready');
            }, 400);
          }
        }
      }
    },
    [timerState, currentScramble]
  );

  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (holdTimeoutRef.current) {
          clearTimeout(holdTimeoutRef.current);
          holdTimeoutRef.current = null;
        }

        if (timerState === 'ready') {
          setTimeMs(0);
          setTimerState('running');
        } else if (timerState === 'holding') {
          setTimerState('idle');
        }
      }
    },
    [timerState]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);

    if (minutes > 0) {
      return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
    }
    return `${seconds}.${milliseconds.toString().padStart(2, '0')}`;
  };

  // Stats calculation
  const times = history.map((h) => h.timeMs);
  const bestTime = times.length > 0 ? Math.min(...times) : null;
  const ao5 =
    times.length >= 5
      ? Math.round(times.slice(0, 5).reduce((a, b) => a + b, 0) / 5)
      : null;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
      {/* Scramble Display Bar */}
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 p-4 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Shuffle className="w-5 h-5 text-purple-400 shrink-0" />
          <div className="flex flex-col">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300">
              WCA Official Scramble
            </span>
            <span className="text-sm sm:text-base font-mono font-bold text-slate-100">
              {currentScramble || 'Generate a scramble to start'}
            </span>
          </div>
        </div>

        <button
          onClick={() => scrambleCube(20)}
          className="px-4 py-2 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/50 text-purple-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>New Scramble</span>
        </button>
      </div>

      {/* Main Timer Display */}
      <div
        className={`
          w-full bg-slate-900/90 backdrop-blur-xl border rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col items-center justify-center text-center transition-all duration-200 min-h-[260px] select-none
          ${
            timerState === 'ready'
              ? 'border-emerald-400 bg-emerald-950/30 shadow-emerald-500/20'
              : timerState === 'holding'
              ? 'border-rose-400 bg-rose-950/30'
              : timerState === 'running'
              ? 'border-cyan-500/50 bg-slate-950/90'
              : 'border-slate-700/60'
          }
        `}
      >
        <span
          className={`
            font-mono text-5xl sm:text-7xl md:text-8xl font-black tracking-tight transition-colors duration-150
            ${
              timerState === 'ready'
                ? 'text-emerald-400'
                : timerState === 'holding'
                ? 'text-rose-400'
                : timerState === 'running'
                ? 'text-cyan-400'
                : 'text-white'
            }
          `}
        >
          {formatTime(timeMs)}
        </span>

        <p className="text-xs sm:text-sm text-slate-400 mt-4">
          {timerState === 'ready'
            ? 'Release Spacebar to Start!'
            : timerState === 'holding'
            ? 'Hold...'
            : timerState === 'running'
            ? 'Press Spacebar to Stop'
            : 'Hold Spacebar to Ready, then Release'}
        </p>
      </div>

      {/* 3D Cube & Interactive Move Pad */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 3D Cube View */}
        <div className="lg:col-span-7 bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 p-4 rounded-3xl shadow-xl flex flex-col gap-3 min-h-[380px]">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs sm:text-sm font-semibold text-slate-300">
              Interactive 3D Cube (Freeplay)
            </span>
            <button
              onClick={resetCube}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          <div className="flex-1 w-full bg-slate-950/60 rounded-2xl border border-slate-800/80 overflow-hidden relative min-h-[320px]">
            <Cube3D interactive={true} />
          </div>

          {/* Quick Move Buttons */}
          <div className="grid grid-cols-6 sm:grid-cols-9 gap-1.5 pt-2">
            {MOVE_BUTTONS.map((move) => (
              <button
                key={move}
                onClick={() => applySingleMove(move)}
                className="py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700/60 text-slate-200 hover:text-white rounded-lg font-mono text-xs font-bold transition-all active:scale-95 cursor-pointer"
              >
                {move}
              </button>
            ))}
          </div>
        </div>

        {/* Stats & History */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Stats Badges */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-900/80 border border-slate-700/60 p-4 rounded-2xl flex items-center gap-3">
              <Trophy className="w-8 h-8 text-amber-400 shrink-0" />
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Best Time
                </span>
                <p className="text-lg font-mono font-bold text-white">
                  {bestTime ? formatTime(bestTime) : '—'}
                </p>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-700/60 p-4 rounded-2xl flex items-center gap-3">
              <Flame className="w-8 h-8 text-rose-400 shrink-0" />
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Ao5
                </span>
                <p className="text-lg font-mono font-bold text-white">
                  {ao5 ? formatTime(ao5) : '—'}
                </p>
              </div>
            </div>
          </div>

          {/* History List */}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 p-4 rounded-2xl shadow-xl flex flex-col gap-3 max-h-[300px] overflow-y-auto">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Session History ({history.length})
              </span>
              {history.length > 0 && (
                <button
                  onClick={() => setHistory([])}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            {history.length > 0 ? (
              <div className="flex flex-col gap-1.5">
                {history.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-950/40 border border-slate-800 text-xs font-mono"
                  >
                    <span className="text-slate-500">#{history.length - idx}</span>
                    <span className="font-bold text-emerald-400">{formatTime(item.timeMs)}</span>
                    <span className="text-slate-400 truncate max-w-[120px] text-[10px]">
                      {item.scramble}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-6">
                No solves yet this session. Time your first solve!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
