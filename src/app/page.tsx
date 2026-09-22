'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { RubixLogo } from '@/components/ui/RubixLogo';
import { Cube3D } from '@/components/cube/Cube3D';
import { NotationGuide } from '@/components/guide/NotationGuide';
import { 
  ArrowRight, 
  Play, 
  Camera, 
  Timer, 
  Layers, 
  CheckCircle2, 
  Zap,
  X
} from 'lucide-react';

export default function LandingPage() {
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-blue-600 selection:text-white font-sans antialiased">
      {/* 1. Header Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 sm:px-12 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <RubixLogo size={38} className="transition-transform group-hover:scale-105 duration-200" />
          <span className="text-2xl font-black tracking-tight text-slate-950 font-sans">
            Rubix
          </span>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link href="/" className="text-slate-950 font-bold hover:text-blue-600 transition-colors">
            Home
          </Link>
          <Link href="/solver" className="hover:text-blue-600 transition-colors flex items-center gap-1">
            <span>Solver</span>
            <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.2 rounded-full bg-blue-50 text-blue-600 border border-blue-200/60">
              3×3
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setIsGuideOpen(true)}
            className="hover:text-blue-600 transition-colors cursor-pointer"
          >
            Learn
          </button>
          <a href="#features" className="hover:text-blue-600 transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-blue-600 transition-colors">
            How it works
          </a>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsLoginModalOpen(true)}
            className="hidden sm:inline-flex px-5 py-2 rounded-full text-sm font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Login
          </button>

          <Link
            href="/solver"
            className="px-6 py-2.5 rounded-full bg-slate-950 hover:bg-slate-800 active:scale-95 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <span>Get Started</span>
          </Link>
        </div>
      </header>

      {/* 2. Hero Section matching image copy.png */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28 px-6 sm:px-12 max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center">
        {/* Subtle Ambient Background Blur */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline & Action Buttons */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-950 leading-[1.08] mb-6">
              Scan.<br />
              Solve.<br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                Learn.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-lg mb-8">
              Upload a photo or build your cube to get an instant, step-by-step solution with smooth animations.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/solver"
                className="px-7 py-3.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-bold text-sm sm:text-base shadow-xl hover:shadow-2xl active:scale-95 transition-all flex items-center gap-2.5 group"
              >
                <span>Try the Solver</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <button
                type="button"
                onClick={() => setIsGuideOpen(true)}
                className="px-6 py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm sm:text-base border border-slate-200/90 shadow-2xs hover:shadow-xs active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <Play className="w-3.5 h-3.5 fill-blue-600 translate-x-0.5" />
                </div>
                <span>See How It Works</span>
              </button>
            </div>

            {/* Micro Highlights */}
            <div className="flex items-center gap-6 mt-10 pt-8 border-t border-slate-100 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>100% Free &amp; Offline Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-500" />
                <span>Optimal Kociemba Algorithm</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Mockup Illustration matching image copy.png */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <div className="relative w-full max-w-lg flex items-center justify-between gap-4 sm:gap-6">
              {/* Phone Mockup (Scanner Camera View) */}
              <div className="relative w-56 sm:w-64 aspect-[9/16] bg-slate-950 rounded-[36px] p-2.5 shadow-2xl border-4 border-slate-800 flex flex-col justify-between overflow-hidden">
                {/* Floating "Scan your cube" Pill Badge */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md shadow-md border border-slate-200 flex items-center gap-1.5 text-slate-900 text-xs font-bold">
                  <Camera className="w-3.5 h-3.5 text-blue-600" />
                  <span>Scan your cube</span>
                </div>

                {/* Camera Viewfinder Screen */}
                <div className="w-full h-full bg-slate-900 rounded-[28px] relative overflow-hidden flex items-center justify-center">
                  {/* Subtle Background Glow */}
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 via-slate-900 to-slate-950" />

                  {/* 3D Scrambled Cube with Scanning Reticle */}
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

              {/* Animated Dashed Connecting Arrow */}
              <div className="hidden sm:flex flex-col items-center gap-1 text-slate-300">
                <span className="font-mono text-xl tracking-widest text-slate-400">&bull;&bull;&bull;&gt;</span>
              </div>

              {/* Floating "Solved!" Card */}
              <div className="relative w-44 sm:w-52 aspect-[4/5] bg-white rounded-3xl p-3.5 shadow-2xl border border-slate-200/90 flex flex-col justify-between transform hover:-translate-y-1 transition-transform duration-300">
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
          </div>
        </div>
      </section>

      {/* 3. Features Section ("Why Cubers Love Rubix") */}
      <section id="features" className="py-20 bg-slate-50/70 border-t border-slate-200/60 px-6 sm:px-12">
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
      <section id="how-it-works" className="py-20 px-6 sm:px-12 bg-white">
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

      {/* 5. Call To Action Banner */}
      <section className="py-16 px-6 sm:px-12 bg-slate-950 text-white rounded-3xl max-w-7xl mx-auto w-[calc(100%-2rem)] sm:w-full mb-16 shadow-2xl relative overflow-hidden">
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

      {/* 6. Footer */}
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
