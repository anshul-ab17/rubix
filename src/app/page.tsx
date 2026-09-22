'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { RubixLogo } from '@/components/ui/RubixLogo';
import { Cube3D } from '@/components/cube/Cube3D';
import { NotationGuide } from '@/components/guide/NotationGuide';
import { useCubeStore } from '@/stores/cube-store';
import { StandardMove } from '@/types/cube';
import { 
  ArrowRight, 
  Play, 
  Camera, 
  Timer, 
  Layers, 
  CheckCircle2, 
  Zap,
  X,
  Menu,
  ChevronDown,
  Shuffle,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Check,
  Award,
  BookOpen,
  MousePointerClick,
  FastForward,
  Lock,
  Eye,
  Sliders
} from 'lucide-react';

// Preset famous cube algorithms for interactive playground
const FAMOUS_ALGORITHMS = [
  {
    name: 'Sexy Move',
    category: 'Fundamental Trigger',
    moves: ["R", "U", "R'", "U'"],
    desc: 'The most essential 4-move building block used across CFOP, Roux, and beginner methods.',
  },
  {
    name: 'Sune (OLL 27)',
    category: 'Orient Last Layer',
    moves: ["R", "U", "R'", "U", "R", "U2", "R'"],
    desc: 'Classic 7-move algorithm to orient top yellow corners while preserving the bottom two layers.',
  },
  {
    name: 'T-Perm (PLL)',
    category: 'Permute Last Layer',
    moves: ["R", "U", "R'", "U'", "R'", "F", "R2", "U'", "R'", "U'", "R", "U", "R'", "F'"],
    desc: 'Iconic PLL algorithm that swaps two corners and two adjacent edges in a T-shape.',
  },
  {
    name: 'Checkerboard Pattern',
    category: 'Symmetry Pattern',
    moves: ["U2", "D2", "R2", "L2", "F2", "B2"],
    desc: 'Generates a symmetrical alternating checkerboard across all 6 faces of the cube.',
  },
  {
    name: 'Cube in a Cube',
    category: 'Display Pattern',
    moves: ["F", "L", "F", "U'", "R", "U", "F2", "L2", "U'", "L'", "B", "D'", "B'", "L2", "U"],
    desc: 'An optical illusion where a mini 2×2 appears nested inside the outer 3×3 cube.',
  },
  {
    name: 'Superflip',
    category: 'God\'s Number Proof',
    moves: ["U", "R2", "F", "B", "R", "B2", "R", "U2", "L", "B2", "R", "U'", "D'", "R2", "F", "R'", "L", "B2", "U2", "F2"],
    desc: 'Every single edge piece is flipped in place; proven to require exactly 20 moves from solved.',
  },
];

// 6-Stage CFOP & Beginner Solving Guide Roadmap
const SOLVING_STAGES = [
  {
    step: '01',
    title: 'The White Cross',
    sub: 'Foundation & Edge Alignment',
    desc: 'Position the 4 white edge pieces around the white center, ensuring each edge secondary color matches its respective lateral center piece (Green, Red, Blue, Orange).',
    tip: 'Solve white cross on the bottom (D layer) to optimize inspection and future F2L transitions.',
    badge: 'Stage 1',
  },
  {
    step: '02',
    title: 'First Layer Corners',
    sub: 'Completing the White Face',
    desc: 'Insert the 4 white corner pieces into their correct spatial slots between corresponding lateral centers using the standard (R U R\' U\') trigger.',
    tip: 'Verify that the T-shape is formed on all 4 lateral faces.',
    badge: 'Stage 2',
  },
  {
    step: '03',
    title: 'Middle Layer (F2L)',
    sub: 'First Two Layers',
    desc: 'Locate top edges without yellow and slot them into the middle equator layer using left or right insertion algorithms (U R U\' R\' U\' F\' U F).',
    tip: 'In advanced CFOP, steps 2 & 3 are merged into 4 corner-edge pair insertions.',
    badge: 'Stage 3',
  },
  {
    step: '04',
    title: 'The Yellow Cross',
    sub: 'Edge Orientation (EO)',
    desc: 'Transform the top yellow face from Dot &rarr; L-Shape &rarr; Line &rarr; Cross using the universal sequence (F R U R\' U\' F\').',
    tip: 'Repeat the algorithm 1 to 3 times depending on the starting top pattern.',
    badge: 'Stage 4',
  },
  {
    step: '05',
    title: 'Orient Last Layer (OLL)',
    sub: 'All Yellow on Top',
    desc: 'Turn all remaining yellow corner stickers facing upwards so the entire U face becomes solid yellow, using algorithms like Sune and Anti-Sune.',
    tip: 'Focus on corner sticker directions to identify the correct OLL case quickly.',
    badge: 'Stage 5',
  },
  {
    step: '06',
    title: 'Permute Last Layer (PLL)',
    sub: 'Final Solved State',
    desc: 'Position corners into solved positions (e.g., A-Perm or T-Perm) and cycle edges (U-Perm) to reach the 100% solved cube state.',
    tip: 'Look for "headlights" (two matching corner colors on one face) to orient your final PLL execution.',
    badge: 'Stage 6',
  },
];

// Interactive Move Dictionary
const WCA_NOTATIONS: { move: StandardMove; label: string; desc: string }[] = [
  { move: 'U', label: 'Up Clockwise', desc: 'Turn top layer 90° clockwise' },
  { move: "U'", label: 'Up Prime', desc: 'Turn top layer 90° counter-clockwise' },
  { move: 'U2', label: 'Up Double', desc: 'Turn top layer 180°' },
  { move: 'D', label: 'Down Clockwise', desc: 'Turn bottom layer 90° clockwise' },
  { move: "D'", label: 'Down Prime', desc: 'Turn bottom layer 90° counter-clockwise' },
  { move: 'D2', label: 'Down Double', desc: 'Turn bottom layer 180°' },
  { move: 'R', label: 'Right Clockwise', desc: 'Turn right layer 90° clockwise' },
  { move: "R'", label: 'Right Prime', desc: 'Turn right layer 90° counter-clockwise' },
  { move: 'R2', label: 'Right Double', desc: 'Turn right layer 180°' },
  { move: 'L', label: 'Left Clockwise', desc: 'Turn left layer 90° clockwise' },
  { move: "L'", label: 'Left Prime', desc: 'Turn left layer 90° counter-clockwise' },
  { move: 'L2', label: 'Left Double', desc: 'Turn left layer 180°' },
  { move: 'F', label: 'Front Clockwise', desc: 'Turn front layer 90° clockwise' },
  { move: "F'", label: 'Front Prime', desc: 'Turn front layer 90° counter-clockwise' },
  { move: 'F2', label: 'Front Double', desc: 'Turn front layer 180°' },
  { move: 'B', label: 'Back Clockwise', desc: 'Turn back layer 90° clockwise' },
  { move: "B'", label: 'Back Prime', desc: 'Turn back layer 90° counter-clockwise' },
  { move: 'B2', label: 'Back Double', desc: 'Turn back layer 180°' },
];

const FAQS = [
  {
    q: 'How does the camera scanning work?',
    a: 'Rubix uses your device webcam or uploaded photos to capture all 6 faces. An advanced CIELAB color-distance classification engine accurately identifies White, Yellow, Green, Blue, Red, and Orange stickers even under variable lighting.'
  },
  {
    q: 'Is Rubix 100% free and client-side?',
    a: 'Yes! All calculations, 3D WebGL rendering, and Kociemba 2-phase solving run completely inside your web browser. No server round-trips, ads, paywalls, or account creation required.'
  },
  {
    q: 'How optimal are the generated solutions?',
    a: 'The Kociemba Two-Phase algorithm finds near-optimal solutions typically between 18 and 22 moves in under 100 milliseconds right in your browser memory.'
  },
  {
    q: 'Can I use Rubix as a speedcubing timer?',
    a: 'Absolutely. The studio includes an official WCA-compliant hold-to-ready spacebar timer with session history, Best Time, and Ao5 (Average of 5) calculations.'
  },
  {
    q: 'Does it work on mobile phones and tablets?',
    a: 'Yes. Rubix features an adaptive mobile responsive dashboard with a segmented view switcher, touch-to-hold timer, camera photo capture, and full touch-orbit 3D cube controls.'
  },
  {
    q: 'What if my cube state has impossible colors or parity errors?',
    a: 'Rubix includes an instant mathematical legality validator that verifies edge parity, corner orientation parity, and exact sticker counts (9 of each color), giving friendly real-time hints if a piece is misplaced.'
  }
];

export default function LandingPage() {
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [selectedAlgIndex, setSelectedAlgIndex] = useState<number>(0);
  const [isAlgRunning, setIsAlgRunning] = useState(false);

  const applySingleMove = useCubeStore((s) => s.applySingleMove);
  const scrambleCube = useCubeStore((s) => s.scrambleCube);
  const resetCube = useCubeStore((s) => s.resetCube);
  const isScrambling = useCubeStore((s) => s.isScrambling);

  const heroMoves: StandardMove[] = ['U', 'R', 'F', "R'", "U'", "F'"];

  // Play an algorithm sequence smoothly
  const handlePlayAlgorithm = (moves: StandardMove[]) => {
    if (isAlgRunning) return;
    setIsAlgRunning(true);
    resetCube();

    let i = 0;
    const interval = setInterval(() => {
      if (i < moves.length) {
        applySingleMove(moves[i]);
        i++;
      } else {
        clearInterval(interval);
        setIsAlgRunning(false);
      }
    }, 280);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-blue-600 selection:text-white font-sans antialiased overflow-x-hidden">
      {/* 1. Header Navbar (No Login, Only Get Started) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-12 h-18 sm:h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
          <RubixLogo size={36} className="transition-transform group-hover:scale-105 duration-200" />
          <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 font-sans">
            Rubix
          </span>
        </Link>

        {/* Center Nav Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
          <Link href="/" className="text-slate-950 font-bold hover:text-blue-600 transition-colors">
            Home
          </Link>
          <a href="#playground" className="hover:text-blue-600 transition-colors">
            Algorithms
          </a>
          <a href="#roadmap" className="hover:text-blue-600 transition-colors">
            Solving Guide
          </a>
          <a href="#features" className="hover:text-blue-600 transition-colors">
            Features
          </a>
          <a href="#notation" className="hover:text-blue-600 transition-colors">
            Notation
          </a>
          <a href="#comparison" className="hover:text-blue-600 transition-colors">
            Comparison
          </a>
          <a href="#faqs" className="hover:text-blue-600 transition-colors">
            FAQs
          </a>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/solver"
            className="px-5 sm:px-6 py-2.5 rounded-full bg-slate-950 hover:bg-slate-800 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 group"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-700 lg:hidden hover:bg-slate-100 rounded-xl"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 py-5 space-y-3 z-30 animate-fade-in shadow-xl">
          <Link
            href="/solver"
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full py-3 px-4 rounded-2xl bg-blue-600 text-white font-bold text-sm flex items-center justify-between shadow-md shadow-blue-500/20"
          >
            <span>Get Started with Solver</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#playground"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2.5 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl"
          >
            Interactive Algorithms
          </a>
          <a
            href="#roadmap"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2.5 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl"
          >
            6-Stage Solving Roadmap
          </a>
          <a
            href="#features"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2.5 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl"
          >
            Core Features
          </a>
          <a
            href="#notation"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2.5 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl"
          >
            WCA Move Notation Reference
          </a>
          <a
            href="#comparison"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2.5 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl"
          >
            Why Choose Rubix
          </a>
          <a
            href="#faqs"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2.5 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl"
          >
            Frequently Asked Questions
          </a>
        </div>
      )}

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-20 sm:pt-16 sm:pb-28 px-4 sm:px-12 max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Headline & Action Buttons */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200/70 text-blue-600 text-xs font-bold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen 3×3 Rubik&rsquo;s Cube Solver Studio</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-950 leading-[1.08] mb-5">
              Scan.<br />
              Solve.<br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                Learn.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-lg mb-7">
              Upload a photo or build your cube to get an instant, optimal step-by-step solution with realistic 3D layer animations and WCA speed timer.
            </p>

            {/* Action Buttons (Get Started) */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <Link
                href="/solver"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-extrabold text-sm sm:text-base shadow-xl hover:shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-2.5 group"
              >
                <span>Get Started (Free)</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <button
                type="button"
                onClick={() => setIsGuideOpen(true)}
                className="w-full sm:w-auto px-6 py-4 rounded-full bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm sm:text-base border border-slate-200/90 shadow-2xs hover:shadow-xs active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <Play className="w-3.5 h-3.5 fill-blue-600 translate-x-0.5" />
                </div>
                <span>How It Works</span>
              </button>
            </div>

            {/* Micro Highlights */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-8 pt-6 border-t border-slate-100 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>100% Client-Side &amp; Private</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-500" />
                <span>Kociemba 2-Phase Algorithm</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-500" />
                <span>Zero Ads or Account Required</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Mockup Illustration matching reference */}
          <div className="lg:col-span-6 relative flex flex-col items-center justify-center">
            <div className="relative w-full max-w-lg flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
              {/* Phone Mockup (Scanner Camera View) */}
              <div className="relative w-56 sm:w-60 aspect-[9/16] bg-slate-950 rounded-[36px] p-2.5 shadow-2xl border-4 border-slate-800 flex flex-col justify-between overflow-hidden">
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md shadow-md border border-slate-200 flex items-center gap-1.5 text-slate-900 text-xs font-bold">
                  <Camera className="w-3.5 h-3.5 text-blue-600" />
                  <span>Scan your cube</span>
                </div>

                <div className="w-full h-full bg-slate-900 rounded-[28px] relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 via-slate-900 to-slate-950" />

                  <div className="w-full h-48 relative flex items-center justify-center">
                    <Cube3D
                      interactive={false}
                      autoRotate={true}
                      className="w-full h-full"
                    />

                    <div className="absolute inset-0 m-auto w-28 h-28 border-2 border-dashed border-white/60 rounded-2xl pointer-events-none flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Connecting Arrow */}
              <div className="hidden sm:flex flex-col items-center gap-1 text-slate-300">
                <span className="font-mono text-xl tracking-widest text-slate-400">&bull;&bull;&bull;&gt;</span>
              </div>

              {/* Floating "Solved!" Card */}
              <div className="relative w-48 sm:w-56 aspect-[4/5] bg-white rounded-3xl p-3.5 shadow-2xl border border-slate-200/90 flex flex-col justify-between transform hover:-translate-y-1 transition-transform duration-300">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-xs font-black text-slate-900">Solved!</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                    20 moves
                  </span>
                </div>

                <div className="w-full h-32 relative flex items-center justify-center my-1">
                  <Cube3D
                    interactive={true}
                    autoRotate={true}
                    className="w-full h-full"
                  />
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-semibold text-slate-400">
                  <span>Kociemba 2-Phase</span>
                  <span className="text-emerald-600 font-bold">&bull; 0.12s</span>
                </div>
              </div>
            </div>

            {/* Interactive Hero Quick Turn Bar */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5 bg-slate-50 border border-slate-200/80 p-1.5 rounded-2xl shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase px-2">Interactive:</span>
              {heroMoves.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => applySingleMove(m)}
                  className="px-2.5 py-1 bg-white hover:bg-blue-50 border border-slate-200 text-slate-800 hover:text-blue-600 rounded-lg text-xs font-mono font-bold transition-all shadow-2xs cursor-pointer"
                >
                  {m}
                </button>
              ))}
              <button
                type="button"
                onClick={() => scrambleCube(15)}
                disabled={isScrambling}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
              >
                <Shuffle className={`w-3 h-3 ${isScrambling ? 'animate-spin text-blue-600' : ''}`} />
                <span>Scramble</span>
              </button>
              <button
                type="button"
                onClick={resetCube}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3 text-slate-500" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Algorithms & Patterns Playground Section */}
      <section id="playground" className="py-20 bg-slate-50/70 border-t border-slate-200/60 px-4 sm:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase font-extrabold tracking-widest text-blue-600 bg-blue-50 border border-blue-200/70 px-3 py-1 rounded-full">
              Live 3D Algorithm Tester
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 mt-4 tracking-tight">
              Test Famous Algorithms in Real-Time
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              Select any pro speedcubing algorithm or symmetrical pattern below to watch the 3D cube execute every layer rotation with physics.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Algorithm Selector Cards (Left 7 Cols) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {FAMOUS_ALGORITHMS.map((alg, index) => {
                const isSelected = selectedAlgIndex === index;
                return (
                  <div
                    key={alg.name}
                    onClick={() => {
                      setSelectedAlgIndex(index);
                      handlePlayAlgorithm(alg.moves as StandardMove[]);
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-white border-blue-600 ring-2 ring-blue-500/20 shadow-md scale-[1.01]'
                        : 'bg-white/80 border-slate-200/80 hover:border-slate-300 hover:bg-white shadow-2xs'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] uppercase font-extrabold tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                          {alg.category}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400 font-bold">
                          {alg.moves.length} moves
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mb-1">
                        {alg.name}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                        {alg.desc}
                      </p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold text-slate-700 truncate max-w-[200px]">
                        {alg.moves.join(' ')}
                      </span>
                      <button
                        type="button"
                        className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-600 hover:text-white transition-colors flex items-center gap-1"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Run</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live 3D Preview Player for the selected algorithm (Right 5 Cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xl flex flex-col justify-between min-h-[460px]">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] uppercase font-bold text-blue-600">Active Preset</span>
                  <h4 className="text-base font-bold text-slate-900">
                    {FAMOUS_ALGORITHMS[selectedAlgIndex].name}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => handlePlayAlgorithm(FAMOUS_ALGORITHMS[selectedAlgIndex].moves as StandardMove[])}
                  disabled={isAlgRunning}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <FastForward className="w-3.5 h-3.5" />
                  <span>{isAlgRunning ? 'Executing...' : 'Replay'}</span>
                </button>
              </div>

              {/* 3D Cube Canvas */}
              <div className="w-full h-56 relative flex items-center justify-center my-3">
                <Cube3D interactive={true} autoRotate={false} className="w-full h-full" />
              </div>

              {/* Sequence Notation Breakdown */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                <span className="text-[10px] font-bold uppercase text-slate-400">Move Sequence:</span>
                <p className="font-mono text-xs font-extrabold text-slate-800 mt-0.5 break-words">
                  {FAMOUS_ALGORITHMS[selectedAlgIndex].moves.join('  ')}
                </p>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <MousePointerClick className="w-3.5 h-3.5 text-blue-500" />
                  <span>Drag to rotate 3D view</span>
                </span>
                <Link href="/solver" className="font-bold text-blue-600 hover:underline">
                  Open Studio &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Complete 6-Stage Solving Roadmap */}
      <section id="roadmap" className="py-20 px-4 sm:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase font-extrabold tracking-widest text-slate-500">
              Master The 3×3 Step By Step
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 mt-3 tracking-tight">
              Beginner to Pro Solving Roadmap
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              Learn the mathematical progression that solves any scrambled cube in under 60 seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SOLVING_STAGES.map((stage) => (
              <div
                key={stage.step}
                className="p-6 rounded-3xl bg-slate-50/80 border border-slate-200/80 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-10 h-10 rounded-2xl bg-slate-900 text-white font-mono font-black text-sm flex items-center justify-center shadow-sm">
                      {stage.step}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/50">
                      {stage.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-950 mb-1">
                    {stage.title}
                  </h3>
                  <span className="text-xs font-semibold text-slate-400 block mb-3">
                    {stage.sub}
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {stage.desc}
                  </p>
                </div>

                <div className="p-3 bg-white border border-slate-200/70 rounded-xl text-[11px] text-slate-600 flex items-start gap-2">
                  <Award className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Pro Tip:</strong> {stage.tip}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Core Features Deep-Dive */}
      <section id="features" className="py-20 bg-slate-50/70 border-t border-slate-200/60 px-4 sm:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase font-extrabold tracking-widest text-blue-600 bg-blue-50 border border-blue-200/70 px-3 py-1 rounded-full">
              Engineered For Speed &amp; Precision
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 mt-4 tracking-tight">
              State-of-the-Art Speedcubing Suite
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              Combines computer vision color detection, group theory algorithms, and WebGL 3D physics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-4">
                  <Camera className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  CIELAB Vision Scanner
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Scan all 6 cube faces using live camera guidance or photo upload with perceptual color distance clustering.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-blue-600">
                <span>Zero manual typing</span>
                <span>&rarr;</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Optimal 2-Phase Solver
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Calculates near-optimal 18–22 move solutions in milliseconds right in your browser with zero backend lag.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-emerald-600">
                <span>Sub-100ms Search</span>
                <span>&rarr;</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 mb-4">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Realistic 3D Animations
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Watch physical cube layers rotate smoothly with mechanical spring physics, turn fingertips, and step filmstrips.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-purple-600">
                <span>WebGL High-FPS</span>
                <span>&rarr;</span>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-4">
                  <Timer className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  WCA Speed Timer
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Official WCA scrambler with hold-to-ready spacebar timing, session solve history, Best Time, and Ao5.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-amber-600">
                <span>Pro Speedcubing</span>
                <span>&rarr;</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Interactive WCA Notation Reference Grid */}
      <section id="notation" className="py-20 px-4 sm:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase font-extrabold tracking-widest text-slate-500">
              Official World Cube Association Standard
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 mt-3 tracking-tight">
              Interactive Notation Dictionary
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              Click any notation badge below to test the corresponding face rotation on the 3D cube.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {WCA_NOTATIONS.map((n) => (
              <button
                key={n.move}
                type="button"
                onClick={() => applySingleMove(n.move)}
                className="p-3 bg-slate-50 hover:bg-blue-50/70 border border-slate-200/80 hover:border-blue-400 rounded-2xl text-left transition-all cursor-pointer group flex flex-col justify-between shadow-2xs"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 group-hover:border-blue-300 group-hover:text-blue-600 flex items-center justify-center font-mono font-black text-slate-900 text-base mb-2 shadow-2xs">
                    {n.move}
                  </div>
                  <span className="text-xs font-bold text-slate-900 block leading-tight">
                    {n.label}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1 leading-tight">
                  {n.desc}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Comparison Table: Why Rubix vs Others */}
      <section id="comparison" className="py-20 bg-slate-50/70 border-t border-slate-200/60 px-4 sm:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase font-extrabold tracking-widest text-blue-600 bg-blue-50 border border-blue-200/70 px-3 py-1 rounded-full">
              Transparent Comparison
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 mt-4 tracking-tight">
              Why Cubers Choose Rubix
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              Clean, zero-friction speedcubing tools built with modern web technologies.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70">
                    <th className="p-4 sm:p-5 font-bold text-slate-900">Feature</th>
                    <th className="p-4 sm:p-5 font-black text-blue-600 bg-blue-50/60 text-center">
                      Rubix Studio
                    </th>
                    <th className="p-4 sm:p-5 font-semibold text-slate-600 text-center">
                      Legacy Web Solvers
                    </th>
                    <th className="p-4 sm:p-5 font-semibold text-slate-600 text-center">
                      App Store Apps
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  <tr>
                    <td className="p-4 sm:p-5 font-semibold text-slate-900 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-emerald-500" />
                      <span>100% Free &amp; Zero Ads</span>
                    </td>
                    <td className="p-4 sm:p-5 text-center bg-blue-50/30 font-bold text-emerald-600">
                      <Check className="w-5 h-5 mx-auto text-emerald-600" />
                    </td>
                    <td className="p-4 sm:p-5 text-center text-rose-500 font-medium">Cluttered with ads</td>
                    <td className="p-4 sm:p-5 text-center text-rose-500 font-medium">Paywalls &amp; IAP</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-semibold text-slate-900 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-blue-500" />
                      <span>No Account / Sign-In Required</span>
                    </td>
                    <td className="p-4 sm:p-5 text-center bg-blue-50/30 font-bold text-emerald-600">
                      <Check className="w-5 h-5 mx-auto text-emerald-600" />
                    </td>
                    <td className="p-4 sm:p-5 text-center text-emerald-600">Yes</td>
                    <td className="p-4 sm:p-5 text-center text-rose-500 font-medium">Mandatory login</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-semibold text-slate-900 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span>Kociemba Optimal 2-Phase Engine</span>
                    </td>
                    <td className="p-4 sm:p-5 text-center bg-blue-50/30 font-bold text-emerald-600">
                      <Check className="w-5 h-5 mx-auto text-emerald-600" />
                    </td>
                    <td className="p-4 sm:p-5 text-center text-slate-500">Slow (80+ moves)</td>
                    <td className="p-4 sm:p-5 text-center text-slate-500">Varies</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-semibold text-slate-900 flex items-center gap-2">
                      <Eye className="w-4 h-4 text-purple-500" />
                      <span>CIELAB Computer Vision Scanner</span>
                    </td>
                    <td className="p-4 sm:p-5 text-center bg-blue-50/30 font-bold text-emerald-600">
                      <Check className="w-5 h-5 mx-auto text-emerald-600" />
                    </td>
                    <td className="p-4 sm:p-5 text-center text-rose-500 font-medium">Manual typing only</td>
                    <td className="p-4 sm:p-5 text-center text-emerald-600">Available (Paid)</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-semibold text-slate-900 flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-blue-500" />
                      <span>Physical 3D WebGL Vinyl Layer Physics</span>
                    </td>
                    <td className="p-4 sm:p-5 text-center bg-blue-50/30 font-bold text-emerald-600">
                      <Check className="w-5 h-5 mx-auto text-emerald-600" />
                    </td>
                    <td className="p-4 sm:p-5 text-center text-rose-500 font-medium">Flat 2D arrows</td>
                    <td className="p-4 sm:p-5 text-center text-slate-500">Basic 3D</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-semibold text-slate-900 flex items-center gap-2">
                      <Timer className="w-4 h-4 text-rose-500" />
                      <span>WCA Spacebar Speed Timer</span>
                    </td>
                    <td className="p-4 sm:p-5 text-center bg-blue-50/30 font-bold text-emerald-600">
                      <Check className="w-5 h-5 mx-auto text-emerald-600" />
                    </td>
                    <td className="p-4 sm:p-5 text-center text-rose-500 font-medium">Not included</td>
                    <td className="p-4 sm:p-5 text-center text-slate-500">Separate app</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Live Statistics Counters */}
      <section className="py-16 bg-white border-t border-slate-100 px-4 sm:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/70">
            <span className="text-3xl sm:text-4xl font-black text-slate-950 font-mono">
              20
            </span>
            <span className="text-xs font-bold text-slate-500 block mt-1">Average Solution Moves</span>
          </div>
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/70">
            <span className="text-3xl sm:text-4xl font-black text-blue-600 font-mono">
              &lt; 0.1s
            </span>
            <span className="text-xs font-bold text-slate-500 block mt-1">Client Compute Time</span>
          </div>
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/70">
            <span className="text-3xl sm:text-4xl font-black text-purple-600 font-mono">
              43Q+
            </span>
            <span className="text-xs font-bold text-slate-500 block mt-1">Supported States</span>
          </div>
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/70">
            <span className="text-3xl sm:text-4xl font-black text-emerald-600 font-mono">
              100%
            </span>
            <span className="text-xs font-bold text-slate-500 block mt-1">Free &amp; Client-Side</span>
          </div>
        </div>
      </section>

      {/* 9. FAQs Section */}
      <section id="faqs" className="py-20 px-4 sm:px-12 bg-slate-50/70 border-t border-slate-200/60">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs uppercase font-extrabold tracking-widest text-blue-600 bg-blue-50 border border-blue-200/70 px-3 py-1 rounded-full">
              Got Questions?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 mt-4 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left font-bold text-sm sm:text-base text-slate-900 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10. Call To Action Banner */}
      <section className="py-16 px-6 sm:px-12 bg-slate-950 text-white rounded-3xl max-w-7xl mx-auto w-[calc(100%-2rem)] sm:w-full my-16 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to solve your Rubik&rsquo;s Cube?
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-xl">
              Launch the 3D solver studio with real-time animations, camera scanning, and speedcubing timer.
            </p>
          </div>

          <Link
            href="/solver"
            className="px-9 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-blue-500/30 active:scale-95 transition-all flex items-center gap-2 shrink-0"
          >
            <span>Launch Rubix Studio Now</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* 11. Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-14 px-4 sm:px-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <RubixLogo size={30} />
              <span className="font-black text-slate-950 text-lg tracking-tight">Rubix</span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">
              Open-source, client-side Rubik&rsquo;s Cube solver and speedcubing platform powered by Kociemba 2-Phase algorithms.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
              Solver Tools
            </h4>
            <ul className="space-y-2 font-medium">
              <li>
                <Link href="/solver" className="hover:text-blue-600 transition-colors">
                  3D Solver Studio
                </Link>
              </li>
              <li>
                <Link href="/solver" className="hover:text-blue-600 transition-colors">
                  Computer Vision Scanner
                </Link>
              </li>
              <li>
                <Link href="/solver" className="hover:text-blue-600 transition-colors">
                  WCA Speed Timer
                </Link>
              </li>
              <li>
                <Link href="/solver" className="hover:text-blue-600 transition-colors">
                  2D Net Builder
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
              Learning &amp; Reference
            </h4>
            <ul className="space-y-2 font-medium">
              <li>
                <button
                  onClick={() => setIsGuideOpen(true)}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-left"
                >
                  WCA Notation Cheat Sheet
                </button>
              </li>
              <li>
                <a href="#playground" className="hover:text-blue-600 transition-colors">
                  Famous Algorithms &amp; Triggers
                </a>
              </li>
              <li>
                <a href="#roadmap" className="hover:text-blue-600 transition-colors">
                  6-Stage CFOP Roadmap
                </a>
              </li>
              <li>
                <a href="#faqs" className="hover:text-blue-600 transition-colors">
                  Frequently Asked Questions
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
              Architecture &amp; Tech
            </h4>
            <ul className="space-y-2 font-medium">
              <li><span>Three.js WebGL Engine</span></li>
              <li><span>Next.js &amp; React 19</span></li>
              <li><span>Zustand State Store</span></li>
              <li><span>100% Client-Side Privacy</span></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-400">
            &copy; {new Date().getFullYear()} Rubix. Built with &#9825; for speedcubers worldwide.
          </p>
          <div className="flex items-center gap-4 font-semibold">
            <Link href="/solver" className="hover:text-blue-600 transition-colors">
              Launch Studio
            </Link>
            <span>&bull;</span>
            <button
              onClick={() => setIsGuideOpen(true)}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Notation Reference
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <NotationGuide
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
