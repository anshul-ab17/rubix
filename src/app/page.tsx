'use client';

import React, { useState } from 'react';
import { useCubeStore } from '@/stores/cube-store';
import { CubeEditor } from '@/components/cube/CubeEditor';
import { FaceScanner } from '@/components/scanner/FaceScanner';
import { SolutionViewer } from '@/components/solver/SolutionViewer';
import { CubeTimer } from '@/components/timer/CubeTimer';
import { NotationGuide } from '@/components/guide/NotationGuide';
import { 
  Box, 
  Camera, 
  Sparkles, 
  Timer, 
  BookOpen
} from 'lucide-react';
import { InputMode } from '@/types/cube';

export default function Home() {
  const inputMode = useCubeStore((s) => s.inputMode);
  const setInputMode = useCubeStore((s) => s.setInputMode);
  const solutionResult = useCubeStore((s) => s.solutionResult);

  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const tabs: { id: InputMode; label: string; icon: React.FC<{ className?: string }>; badge?: string }[] = [
    { id: 'edit', label: 'Build & Edit', icon: Box },
    { id: 'scan', label: 'Scan Faces', icon: Camera, badge: 'Vision' },
    { id: 'solve', label: 'Step Solver', icon: Sparkles, badge: solutionResult ? `${solutionResult.moveCount} moves` : undefined },
    { id: 'timer', label: 'Timer & Freeplay', icon: Timer },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Top Header Navbar */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-emerald-400 flex items-center justify-center p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Box className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  Rubix
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  3×3 Pro
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Scan &bull; Build &bull; Solve Step by Step
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs (Desktop) */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 p-1.5 rounded-2xl">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = inputMode === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setInputMode(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive
                          ? 'bg-slate-950 text-cyan-300'
                          : 'bg-slate-800 text-cyan-400'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsGuideOpen(true)}
              className="p-2 sm:px-3 sm:py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
              title="Notation and fingertrick guide"
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Notation Guide</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="md:hidden flex items-center justify-around border-t border-slate-800/80 px-2 py-1.5 bg-slate-950">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = inputMode === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setInputMode(tab.id)}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'text-cyan-400 bg-cyan-500/10'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col items-center">
        {inputMode === 'edit' && <CubeEditor />}
        {inputMode === 'scan' && <FaceScanner />}
        {inputMode === 'solve' && <SolutionViewer />}
        {inputMode === 'timer' && <CubeTimer />}
      </main>

      {/* Notation Reference Modal */}
      <NotationGuide
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 px-4 bg-slate-950/60 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">Rubix</span>
            <span>&bull;</span>
            <span>Kociemba Two-Phase 3×3 Algorithm</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsGuideOpen(true)}
              className="hover:text-cyan-400 transition-colors"
            >
              How to hold & solve
            </button>
            <span>&bull;</span>
            <span>100% Client-Side &amp; Offline Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
