'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CubeEditor } from '@/components/cube/CubeEditor';
import { CenterPreview } from '@/components/cube/CenterPreview';
import { SolutionViewer } from '@/components/solver/SolutionViewer';
import { CubeTimer } from '@/components/timer/CubeTimer';
import { FaceScanner } from '@/components/scanner/FaceScanner';
import { NotationGuide } from '@/components/guide/NotationGuide';
import { KeyboardShortcutsModal } from '@/components/guide/KeyboardShortcutsModal';
import { RubixLogo } from '@/components/ui/RubixLogo';
import { useCubeStore } from '@/stores/cube-store';
import { StandardMove } from '@/types/cube';
import { sound } from '@/utils/audio';
import { 
  BookOpen, 
  ArrowLeft,
  Volume2,
  VolumeX,
  Keyboard,
  Layers,
  Box,
  ListOrdered,
  Timer as TimerIcon
} from 'lucide-react';

export default function SolverPage() {
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview' | 'solution' | 'timer'>('preview');

  const applySingleMove = useCubeStore((s) => s.applySingleMove);
  const scrambleCube = useCubeStore((s) => s.scrambleCube);
  const resetCube = useCubeStore((s) => s.resetCube);
  const nextStep = useCubeStore((s) => s.nextStep);
  const prevStep = useCubeStore((s) => s.prevStep);

  // Sync sound initial state
  useEffect(() => {
    setSoundEnabled(sound.isEnabled());
  }, []);

  const handleToggleSound = () => {
    const newState = sound.toggleSound();
    setSoundEnabled(newState);
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is in an input or textarea
      const target = e.target as HTMLElement;
      if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA') return;

      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
        return;
      }

      if (e.key === 'Escape') {
        setIsGuideOpen(false);
        setIsScannerOpen(false);
        setIsShortcutsOpen(false);
        return;
      }

      // Mobile / Section Switch hotkeys 1, 2, 3, 4
      if (e.key === '1') setMobileTab('editor');
      if (e.key === '2') setMobileTab('preview');
      if (e.key === '3') setMobileTab('solution');
      if (e.key === '4') setMobileTab('timer');

      // Arrow keys for step navigation
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextStep();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevStep();
      }

      // Scramble / Reset hotkeys
      if (e.key === 's' || e.key === 'S') {
        if (!e.ctrlKey && !e.metaKey) {
          scrambleCube(20);
        }
      } else if (e.key === 'r' || e.key === 'R') {
        if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
          // Check if user is typing move 'R'
          // We handle R in move keys below
        }
      }

      // 3D Layer Turns (U, D, L, R, F, B)
      const keyUpper = e.key.toUpperCase();
      if (['U', 'D', 'L', 'R', 'F', 'B'].includes(keyUpper) && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        const moveStr = e.shiftKey ? `${keyUpper}'` : keyUpper;
        applySingleMove(moveStr as StandardMove);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [applySingleMove, scrambleCube, resetCube, nextStep, prevStep]);

  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen flex flex-col justify-between bg-slate-100/70 text-slate-900 select-none overflow-x-hidden font-sans">
      {/* Top Navbar */}
      <header className="h-14 shrink-0 bg-white/95 border-b border-slate-200/80 px-3 sm:px-6 flex items-center justify-between z-30 sticky top-0">
        {/* Left: Rubix Brand & Back to Home */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="flex items-center gap-1 text-slate-500 hover:text-slate-900 text-xs font-semibold py-1 px-2 rounded-lg hover:bg-slate-100 transition-colors"
            title="Back to Landing Page"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Home</span>
          </Link>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          <Link href="/" className="flex items-center gap-2">
            <RubixLogo size={28} />
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-base font-black tracking-tight text-slate-900">
                  Rubix
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200/70">
                  3×3 PRO
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium leading-none mt-0.5 hidden md:block">
                Scan &bull; Build &bull; Solve Step by Step
              </p>
            </div>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/70">
          <Link
            href="/"
            className="px-3 py-1 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white/50 transition-all"
          >
            Home
          </Link>
          <span className="px-3 py-1 rounded-xl text-xs font-bold bg-white text-blue-600 shadow-xs">
            Solver Studio
          </span>
          <button
            type="button"
            onClick={() => setIsGuideOpen(true)}
            className="px-3 py-1 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white/50 transition-all cursor-pointer"
          >
            Learn
          </button>
          <Link
            href="/#features"
            className="px-3 py-1 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white/50 transition-all"
          >
            Features
          </Link>
        </nav>

        {/* Right Header Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Sound Mute/Unmute Toggle */}
          <button
            type="button"
            onClick={handleToggleSound}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-blue-50 text-blue-600 border-blue-200/70'
                : 'bg-white text-slate-400 hover:text-slate-600 border-slate-200'
            }`}
            title={soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Keyboard Shortcuts button */}
          <button
            type="button"
            onClick={() => setIsShortcutsOpen(true)}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer hidden sm:flex items-center gap-1 text-xs font-medium"
            title="Keyboard Shortcuts (?)"
          >
            <Keyboard className="w-4 h-4" />
            <span className="hidden lg:inline">Shortcuts</span>
          </button>

          {/* Notation Guide button */}
          <button
            type="button"
            onClick={() => setIsGuideOpen(true)}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Notation Guide</span>
          </button>
        </div>
      </header>

      {/* Mobile/Tablet Adaptive View Switcher (< 1024px) */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-3 py-2 flex items-center justify-between gap-1 overflow-x-auto z-20">
        <div className="grid grid-cols-4 gap-1 w-full max-w-md mx-auto bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setMobileTab('editor')}
            className={`py-1.5 px-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-all ${
              mobileTab === 'editor'
                ? 'bg-white text-blue-600 shadow-xs font-bold'
                : 'text-slate-600'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>1. Build</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileTab('preview')}
            className={`py-1.5 px-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-all ${
              mobileTab === 'preview'
                ? 'bg-white text-blue-600 shadow-xs font-bold'
                : 'text-slate-600'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>2. 3D Cube</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileTab('solution')}
            className={`py-1.5 px-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-all ${
              mobileTab === 'solution'
                ? 'bg-white text-blue-600 shadow-xs font-bold'
                : 'text-slate-600'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>3. Steps</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileTab('timer')}
            className={`py-1.5 px-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-all ${
              mobileTab === 'timer'
                ? 'bg-white text-blue-600 shadow-xs font-bold'
                : 'text-slate-600'
            }`}
          >
            <TimerIcon className="w-3.5 h-3.5" />
            <span>4. Timer</span>
          </button>
        </div>
      </div>

      {/* Main Responsive Grid Layout */}
      {/* 1. Desktop Mode (>= 1024px): 4-quadrant zero-scroll grid */}
      <main className="hidden lg:grid flex-1 min-h-0 p-3 sm:p-4 grid-cols-12 gap-3 sm:gap-4 overflow-hidden">
        {/* Left Column (Section 1: 1. Set Cube State) */}
        <div className="col-span-3 h-full min-h-0">
          <CubeEditor onOpenScanner={() => setIsScannerOpen(true)} />
        </div>

        {/* Center Column (Section 2: 2. 3D Cube Preview + Live Solving Animation) */}
        <div className="col-span-6 h-full min-h-0">
          <CenterPreview />
        </div>

        {/* Right Column (Split into Section 3 & Section 4) */}
        <div className="col-span-3 h-full min-h-0 flex flex-col gap-3 sm:gap-4 justify-between">
          {/* Section 3: 3. Solution & Steps (Top Half) */}
          <div className="flex-1 min-h-0">
            <SolutionViewer onOpenGuide={() => setIsGuideOpen(true)} />
          </div>

          {/* Section 4: 4. Timer & Freeplay (Bottom Half) */}
          <div className="flex-1 min-h-0">
            <CubeTimer />
          </div>
        </div>
      </main>

      {/* 2. Mobile/Tablet Mode (< 1024px): Tabbed Comfortable View */}
      <main className="lg:hidden flex-1 p-3 sm:p-4 overflow-y-auto">
        <div className="max-w-xl mx-auto space-y-4">
          {mobileTab === 'editor' && (
            <div className="min-h-[520px]">
              <CubeEditor onOpenScanner={() => setIsScannerOpen(true)} />
            </div>
          )}

          {mobileTab === 'preview' && (
            <div className="min-h-[520px]">
              <CenterPreview />
            </div>
          )}

          {mobileTab === 'solution' && (
            <div className="min-h-[460px]">
              <SolutionViewer onOpenGuide={() => setIsGuideOpen(true)} />
            </div>
          )}

          {mobileTab === 'timer' && (
            <div className="min-h-[460px]">
              <CubeTimer />
            </div>
          )}
        </div>
      </main>

      {/* Compact Clean Footer */}
      <footer className="h-7 shrink-0 bg-white/80 border-t border-slate-200/80 px-4 sm:px-6 flex items-center justify-between text-[11px] text-slate-400 z-20">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700">Rubix</span>
          <span>&bull;</span>
          <span>Kociemba Two-Phase 3&times;3 Algorithm</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsShortcutsOpen(true)}
            className="hover:text-blue-600 transition-colors cursor-pointer hidden sm:inline"
          >
            Hotkeys (?)
          </button>
          <span className="hidden sm:inline">&bull;</span>
          <button
            onClick={() => setIsGuideOpen(true)}
            className="hover:text-blue-600 transition-colors cursor-pointer"
          >
            Notation Guide
          </button>
          <span>&bull;</span>
          <span>100% Client-Side</span>
        </div>
      </footer>

      {/* Overlays / Modals */}
      <FaceScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
      />
      <NotationGuide
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
}
