'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CubeEditor } from '@/components/cube/CubeEditor';
import { CenterPreview } from '@/components/cube/CenterPreview';
import { SolutionViewer } from '@/components/solver/SolutionViewer';
import { CubeTimer } from '@/components/timer/CubeTimer';
import { FaceScanner } from '@/components/scanner/FaceScanner';
import { NotationGuide } from '@/components/guide/NotationGuide';
import { RubixLogo } from '@/components/ui/RubixLogo';
import { 
  BookOpen, 
  Sun,
  Settings,
  ArrowLeft
} from 'lucide-react';

export default function SolverPage() {
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  return (
    <div className="h-screen max-h-screen flex flex-col justify-between bg-slate-100/70 text-slate-900 select-none overflow-hidden font-sans">
      {/* Top Navbar */}
      <header className="h-14 shrink-0 bg-white/95 border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between z-30">
        {/* Left: Rubix Brand & Back to Home */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 text-xs font-semibold py-1 px-2 rounded-lg hover:bg-slate-100 transition-colors"
            title="Back to Landing Page"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Home</span>
          </Link>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          <Link href="/" className="flex items-center gap-2.5">
            <RubixLogo size={32} />
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-base font-black tracking-tight text-slate-900">
                  Rubix
                </span>
                <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200/70">
                  3×3 PRO
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium leading-none mt-0.5 hidden sm:block">
                Scan &bull; Build &bull; Solve Step by Step
              </p>
            </div>
          </Link>
        </div>

        {/* Center: Navigation Links */}
        <nav className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/70">
          <Link
            href="/"
            className="px-3 py-1 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white/50 transition-all"
          >
            Home
          </Link>
          <span className="px-3 py-1 rounded-xl text-xs font-bold bg-white text-blue-600 shadow-xs">
            Solver
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
            className="px-3 py-1 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white/50 transition-all hidden md:inline"
          >
            Features
          </Link>
        </nav>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2">
          {/* Light theme indicator */}
          <button
            type="button"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title="Theme"
          >
            <Sun className="w-4 h-4" />
          </button>

          {/* Notation Guide button */}
          <button
            type="button"
            onClick={() => setIsGuideOpen(true)}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">Notation Guide</span>
          </button>

          {/* Settings button */}
          <button
            type="button"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Handwritten Quote */}
          <span className="hidden xl:inline text-xs font-serif italic text-blue-600 font-semibold pl-2">
            Turn Ideas Into Solved
          </span>
        </div>
      </header>

      {/* Main 4-Section Dashboard Grid */}
      <main className="flex-1 min-h-0 p-3 sm:p-4 grid grid-cols-12 gap-3 sm:gap-4 overflow-hidden">
        {/* Left Column (Section 1: 1. Set Cube State) */}
        <div className="col-span-12 lg:col-span-3 h-full min-h-0">
          <CubeEditor onOpenScanner={() => setIsScannerOpen(true)} />
        </div>

        {/* Center Column (Section 2: 2. 3D Cube Preview + Live Solving Animation) */}
        <div className="col-span-12 lg:col-span-6 h-full min-h-0">
          <CenterPreview />
        </div>

        {/* Right Column (Split into Section 3 & Section 4) */}
        <div className="col-span-12 lg:col-span-3 h-full min-h-0 flex flex-col gap-3 sm:gap-4 justify-between">
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

      {/* Compact Clean Footer */}
      <footer className="h-7 shrink-0 bg-white/80 border-t border-slate-200/80 px-4 sm:px-6 flex items-center justify-between text-[11px] text-slate-400 z-20">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700">Rubix</span>
          <span>&bull;</span>
          <span>Kociemba Two-Phase 3&times;3 Algorithm</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsGuideOpen(true)}
            className="hover:text-blue-600 transition-colors cursor-pointer"
          >
            How to solve
          </button>
          <span>&bull;</span>
          <button
            onClick={() => setIsGuideOpen(true)}
            className="hover:text-blue-600 transition-colors cursor-pointer"
          >
            Notation Guide
          </button>
          <span>&bull;</span>
          <span>100% Client-Side</span>
          <span>&bull;</span>
          <span>Built with &#9825; for cubers</span>
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
    </div>
  );
}
