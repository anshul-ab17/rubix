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
  ShieldCheck
} from 'lucide-react';

const FAQS = [
  {
    q: 'How does the camera scanning work?',
    a: 'Rubix uses your device webcam or uploaded photos to capture all 6 faces. An advanced CIELAB color-distance classification engine accurately identifies White, Yellow, Green, Blue, Red, and Orange stickers even under variable lighting.'
  },
  {
    q: 'Is Rubix 100% free and client-side?',
    a: 'Yes! All calculations, 3D WebGL rendering, and Kociemba 2-phase solving run completely inside your web browser. No server round-trips or account creation required.'
  },
  {
    q: 'How optimal are the generated solutions?',
    a: 'The Kociemba Two-Phase algorithm finds near-optimal solutions typically between 18 and 22 moves in under 100 milliseconds.'
  },
  {
    q: 'Can I use Rubix as a speedcubing timer?',
    a: 'Absolutely. The studio includes an official WCA-compliant hold-to-ready spacebar timer with session history, Best Time, and Ao5 (Average of 5) calculations.'
  }
];

export default function LandingPage() {
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const applySingleMove = useCubeStore((s) => s.applySingleMove);
  const scrambleCube = useCubeStore((s) => s.scrambleCube);
  const resetCube = useCubeStore((s) => s.resetCube);
  const isScrambling = useCubeStore((s) => s.isScrambling);

  const heroMoves: StandardMove[] = ['U', 'R', 'F', "R'", "U'"];

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-blue-600 selection:text-white font-sans antialiased overflow-x-hidden">
      {/* 1. Header Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 sm:px-12 h-18 sm:h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
          <RubixLogo size={36} className="transition-transform group-hover:scale-105 duration-200" />
          <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 font-sans">
            Rubix
          </span>
        </Link>

        {/* Center Nav Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link href="/" className="text-slate-950 font-bold hover:text-blue-600 transition-colors">
            Home
          </Link>
          <Link href="/solver" className="hover:text-blue-600 transition-colors flex items-center gap-1">
            <span>Solver Studio</span>
            <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.2 rounded-full bg-blue-50 text-blue-600 border border-blue-200/60">
              3×3 PRO
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setIsGuideOpen(true)}
            className="hover:text-blue-600 transition-colors cursor-pointer"
          >
            Notation Guide
          </button>
          <a href="#features" className="hover:text-blue-600 transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-blue-600 transition-colors">
            How it works
          </a>
          <a href="#faqs" className="hover:text-blue-600 transition-colors">
            FAQs
          </a>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setIsLoginModalOpen(true)}
            className="hidden sm:inline-flex px-4 py-2 rounded-full text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Login
          </button>

          <Link
            href="/solver"
            className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-slate-950 hover:bg-slate-800 active:scale-95 text-white text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <span>Launch Studio</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-700 md:hidden hover:bg-slate-100 rounded-xl"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 py-4 space-y-3 z-30 animate-fade-in shadow-lg">
          <Link
            href="/solver"
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-between"
          >
            <span>Launch Solver Studio</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            type="button"
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsGuideOpen(true);
            }}
            className="w-full text-left py-2 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg flex items-center justify-between"
          >
            <span>Notation Reference</span>
            <span className="text-xs text-blue-600 font-bold">&rarr;</span>
          </button>
          <a
            href="#features"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            How it works
          </a>
          <a
            href="#faqs"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Frequently Asked Questions
          </a>
        </div>
      )}

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-16 sm:pt-16 sm:pb-28 px-4 sm:px-12 max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Headline & Action Buttons */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/70 text-blue-600 text-xs font-bold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Generation 3×3 Solver</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-950 leading-[1.08] mb-5">
              Scan.<br />
              Solve.<br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                Learn.
              </span>
            </h1>

            <p className="text-sm sm:text-lg text-slate-600 font-normal leading-relaxed max-w-lg mb-7">
              Upload a photo or build your cube to get an instant, step-by-step solution with smooth 3D animations and WCA timer.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <Link
                href="/solver"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-bold text-sm sm:text-base shadow-xl hover:shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-2.5 group"
              >
                <span>Try the Solver</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <button
                type="button"
                onClick={() => setIsGuideOpen(true)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm sm:text-base border border-slate-200/90 shadow-2xs hover:shadow-xs active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <Play className="w-3.5 h-3.5 fill-blue-600 translate-x-0.5" />
                </div>
                <span>See How It Works</span>
              </button>
            </div>

            {/* Micro Highlights */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-8 pt-6 border-t border-slate-100 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>100% Free &amp; Offline Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-500" />
                <span>Optimal Kociemba Algorithm</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-500" />
                <span>WCA Standard</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Mockup Illustration matching image copy.png */}
          <div className="lg:col-span-6 relative flex flex-col items-center justify-center">
            <div className="relative w-full max-w-lg flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
              {/* Phone Mockup (Scanner Camera View) */}
              <div className="relative w-56 sm:w-60 aspect-[9/16] bg-slate-950 rounded-[36px] p-2.5 shadow-2xl border-4 border-slate-800 flex flex-col justify-between overflow-hidden">
                {/* Floating "Scan your cube" Pill Badge */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md shadow-md border border-slate-200 flex items-center gap-1.5 text-slate-900 text-xs font-bold">
                  <Camera className="w-3.5 h-3.5 text-blue-600" />
                  <span>Scan your cube</span>
                </div>

                {/* Camera Viewfinder Screen */}
                <div className="w-full h-full bg-slate-900 rounded-[28px] relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 via-slate-900 to-slate-950" />

                  <div className="w-full h-48 relative flex items-center justify-center">
                    <Cube3D
                      interactive={false}
                      autoRotate={true}
                      className="w-full h-full"
                    />

                    {/* Camera Bounding Reticle */}
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
                {/* Top Badge: "Solved!" */}
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

                {/* Live 3D Solved Cube */}
                <div className="w-full h-32 relative flex items-center justify-center my-1">
                  <Cube3D
                    interactive={true}
                    autoRotate={true}
                    className="w-full h-full"
                  />
                </div>

                {/* Bottom Card Footer */}
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

      {/* 3. Features Section ("Why Cubers Love Rubix") */}
      <section id="features" className="py-20 bg-slate-50/70 border-t border-slate-200/60 px-4 sm:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase font-extrabold tracking-widest text-blue-600 bg-blue-50 border border-blue-200/70 px-3 py-1 rounded-full">
              Engineered For Speed &amp; Accuracy
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 mt-4 tracking-tight">
              Everything you need to master the 3×3
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-3">
              Combines cutting-edge computer vision, optimal combinatorial algorithms, and realistic 3D WebGL animations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-4">
                  <Camera className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Computer Vision Scanner
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Scan all 6 cube faces using live camera guidance or photo upload with CIELAB color classification.
                </p>
              </div>
              <span className="text-[11px] font-bold text-blue-600 mt-6 inline-flex items-center gap-1">
                Zero manual typing &rarr;
              </span>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
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
              <span className="text-[11px] font-bold text-emerald-600 mt-6 inline-flex items-center gap-1">
                100% Client-Side &rarr;
              </span>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 mb-4">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Realistic 3D Animations
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Watch physical cube layers rotate smoothly with spring-like physics, turn fingertips, and jump-to-step controls.
                </p>
              </div>
              <span className="text-[11px] font-bold text-purple-600 mt-6 inline-flex items-center gap-1">
                Interactive Three.js &rarr;
              </span>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-4">
                  <Timer className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Spacebar Speed Timer
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Official WCA-scrambler with hold-to-ready spacebar timing, session solve history, Best Time, and Ao5.
                </p>
              </div>
              <span className="text-[11px] font-bold text-amber-600 mt-6 inline-flex items-center gap-1">
                Pro Speedcubing &rarr;
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How It Works 3-Step Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase font-extrabold tracking-widest text-slate-500">
              Simple 3-Step Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 mt-3 tracking-tight">
              Solve any scramble in under 1 minute
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 flex flex-col items-start">
              <span className="w-10 h-10 rounded-2xl bg-blue-600 text-white font-extrabold text-lg flex items-center justify-center mb-6 shadow-md shadow-blue-500/25">
                1
              </span>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Input Your Cube State
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Scan your physical cube faces with your camera, or color the 2D/3D interactive net in seconds.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 flex flex-col items-start">
              <span className="w-10 h-10 rounded-2xl bg-blue-600 text-white font-extrabold text-lg flex items-center justify-center mb-6 shadow-md shadow-blue-500/25">
                2
              </span>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Compute Optimal Moves
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Rubix verifies physical legality and calculates the shortest mathematical sequence using Two-Phase search.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 flex flex-col items-start">
              <span className="w-10 h-10 rounded-2xl bg-blue-600 text-white font-extrabold text-lg flex items-center justify-center mb-6 shadow-md shadow-blue-500/25">
                3
              </span>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Follow Step by Step
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Watch 3D layer animations, see standard move notations, and solve your cube effortlessly!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQs Interactive Accordion Section */}
      <section id="faqs" className="py-20 px-4 sm:px-12 bg-slate-50/70 border-t border-slate-200/60">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
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

      {/* 6. Call To Action Banner */}
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
            className="px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-blue-500/30 active:scale-95 transition-all flex items-center gap-2 shrink-0"
          >
            <span>Launch Rubix Solver</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-12 px-6 sm:px-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <RubixLogo size={28} />
            <span className="font-bold text-slate-900 text-sm">Rubix</span>
            <span>&bull;</span>
            <span>Kociemba Two-Phase 3×3 Algorithm</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-medium">
            <button
              onClick={() => setIsGuideOpen(true)}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Notation Reference
            </button>
            <Link href="/solver" className="hover:text-blue-600 transition-colors">
              Launch Studio
            </Link>
            <span>100% Client-Side &amp; Offline Ready</span>
            <span>Built with &#9825; for cubers</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <NotationGuide
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Simple Demo Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500"
            >
              <X className="w-4 h-4" />
            </button>
            <RubixLogo size={36} className="mb-3" />
            <h3 className="text-lg font-bold text-slate-900">Welcome to Rubix</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Rubix runs 100% client-side. No account required to scan or solve!
            </p>
            <Link
              href="/solver"
              onClick={() => setIsLoginModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>Continue to Solver Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
