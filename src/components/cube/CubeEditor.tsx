'use client';

import React, { useState } from 'react';
import { useCubeStore } from '@/stores/cube-store';
import { CubeFace } from './CubeFace';
import { ColourPalette } from './ColourPalette';
import { Cube3D } from './Cube3D';
import { FaceName } from '@/types/cube';
import { 
  RotateCcw, 
  Shuffle, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Box, 
  Grid3X3,
  PaintBucket,
  Info
} from 'lucide-react';

export const CubeEditor: React.FC = () => {
  const cubeState = useCubeStore((s) => s.cubeState);
  const activeColor = useCubeStore((s) => s.activeColor);
  const validation = useCubeStore((s) => s.validation);
  const isSolving = useCubeStore((s) => s.isSolving);
  const setStickerColor = useCubeStore((s) => s.setStickerColor);
  const fillFace = useCubeStore((s) => s.fillFace);
  const resetCube = useCubeStore((s) => s.resetCube);
  const scrambleCube = useCubeStore((s) => s.scrambleCube);
  const solveCurrentCube = useCubeStore((s) => s.solveCurrentCube);
  const currentScramble = useCubeStore((s) => s.currentScramble);
  const solutionResult = useCubeStore((s) => s.solutionResult);

  const [viewMode, setViewMode] = useState<'both' | '2d' | '3d'>('both');
  const [selectedFaceToFill, setSelectedFaceToFill] = useState<FaceName | null>(null);

  const handleStickerClick = (face: FaceName, index: number) => {
    setStickerColor(face, index, activeColor);
  };

  const handleSolve = async () => {
    await solveCurrentCube();
  };

  return (
    <div className="w-full flex flex-col gap-6 max-w-6xl mx-auto">
      {/* Top Toolbar: View toggles & Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 p-3 sm:p-4 rounded-2xl shadow-xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('both')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'both' ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Box className="w-4 h-4" />
            <span className="hidden sm:inline">Split 2D + 3D</span>
            <span className="sm:hidden">Split</span>
          </button>
          <button
            onClick={() => setViewMode('2d')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === '2d' ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
            <span>2D Net</span>
          </button>
          <button
            onClick={() => setViewMode('3d')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === '3d' ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Box className="w-4 h-4" />
            <span>3D Cube</span>
          </button>
        </div>

        {/* Action Buttons: Scramble, Reset, Solve */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scrambleCube(20)}
            className="px-3 py-2 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs sm:text-sm font-medium text-slate-200 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            title="Generate a random scramble"
          >
            <Shuffle className="w-4 h-4 text-purple-400" />
            <span>Scramble</span>
          </button>

          <button
            onClick={resetCube}
            className="px-3 py-2 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs sm:text-sm font-medium text-slate-200 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            title="Reset cube to solved state"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span>Reset</span>
          </button>

          <button
            onClick={handleSolve}
            disabled={!validation.isValid || isSolving}
            className={`px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-lg cursor-pointer ${
              validation.isValid && !isSolving
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/25 active:scale-95'
                : 'bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed'
            }`}
          >
            {isSolving ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                <span>Solving...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Solve Cube</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Scramble Info Banner if Scrambled */}
      {currentScramble && (
        <div className="bg-purple-950/40 border border-purple-800/50 px-4 py-2.5 rounded-xl flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-purple-200">
            <span className="font-semibold text-purple-300">Scramble:</span>
            <span className="font-mono bg-purple-900/50 px-2 py-0.5 rounded border border-purple-700/50 text-purple-100">
              {currentScramble}
            </span>
          </div>
        </div>
      )}

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Center Area: 2D Net Editor */}
        {(viewMode === 'both' || viewMode === '2d') && (
          <div className={`${viewMode === 'both' ? 'lg:col-span-7' : 'lg:col-span-12'} flex flex-col gap-4`}>
            {/* Color Palette Component */}
            <ColourPalette />

            {/* 2D Unfolded Cube Net */}
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 p-4 sm:p-6 rounded-2xl shadow-xl flex flex-col items-center">
              <div className="w-full flex items-center justify-between mb-4">
                <span className="text-xs sm:text-sm font-semibold text-slate-300 flex items-center gap-1.5">
                  <Grid3X3 className="w-4 h-4 text-cyan-400" />
                  <span>Interactive 2D Net Layout</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  Click any sticker to paint with {activeColor}
                </span>
              </div>

              {/* Unfolded Net:
                     [ U ]
                 [ L ][ F ][ R ][ B ]
                     [ D ]
              */}
              <div className="flex flex-col items-center gap-3">
                {/* UP (Top Face) */}
                <div className="relative group">
                  <CubeFace
                    face="U"
                    colors={cubeState.U}
                    onStickerClick={(idx) => handleStickerClick('U', idx)}
                    activeColor={activeColor}
                  />
                  <button
                    onClick={() => fillFace('U', activeColor)}
                    title={`Fill Up face with ${activeColor}`}
                    className="absolute -top-2 -right-2 p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] flex items-center gap-1 shadow-lg"
                  >
                    <PaintBucket className="w-3 h-3 text-cyan-400" />
                    <span>Fill</span>
                  </button>
                </div>

                {/* Middle Row: Left, Front, Right, Back */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-3">
                  <div className="relative group">
                    <CubeFace
                      face="L"
                      colors={cubeState.L}
                      onStickerClick={(idx) => handleStickerClick('L', idx)}
                      activeColor={activeColor}
                    />
                    <button
                      onClick={() => fillFace('L', activeColor)}
                      title={`Fill Left face with ${activeColor}`}
                      className="absolute -top-2 -right-2 p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] flex items-center gap-1 shadow-lg"
                    >
                      <PaintBucket className="w-3 h-3 text-cyan-400" />
                      <span>Fill</span>
                    </button>
                  </div>

                  <div className="relative group">
                    <CubeFace
                      face="F"
                      colors={cubeState.F}
                      onStickerClick={(idx) => handleStickerClick('F', idx)}
                      activeColor={activeColor}
                    />
                    <button
                      onClick={() => fillFace('F', activeColor)}
                      title={`Fill Front face with ${activeColor}`}
                      className="absolute -top-2 -right-2 p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] flex items-center gap-1 shadow-lg"
                    >
                      <PaintBucket className="w-3 h-3 text-cyan-400" />
                      <span>Fill</span>
                    </button>
                  </div>

                  <div className="relative group">
                    <CubeFace
                      face="R"
                      colors={cubeState.R}
                      onStickerClick={(idx) => handleStickerClick('R', idx)}
                      activeColor={activeColor}
                    />
                    <button
                      onClick={() => fillFace('R', activeColor)}
                      title={`Fill Right face with ${activeColor}`}
                      className="absolute -top-2 -right-2 p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] flex items-center gap-1 shadow-lg"
                    >
                      <PaintBucket className="w-3 h-3 text-cyan-400" />
                      <span>Fill</span>
                    </button>
                  </div>

                  <div className="relative group">
                    <CubeFace
                      face="B"
                      colors={cubeState.B}
                      onStickerClick={(idx) => handleStickerClick('B', idx)}
                      activeColor={activeColor}
                    />
                    <button
                      onClick={() => fillFace('B', activeColor)}
                      title={`Fill Back face with ${activeColor}`}
                      className="absolute -top-2 -right-2 p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] flex items-center gap-1 shadow-lg"
                    >
                      <PaintBucket className="w-3 h-3 text-cyan-400" />
                      <span>Fill</span>
                    </button>
                  </div>
                </div>

                {/* DOWN (Bottom Face) */}
                <div className="relative group">
                  <CubeFace
                    face="D"
                    colors={cubeState.D}
                    onStickerClick={(idx) => handleStickerClick('D', idx)}
                    activeColor={activeColor}
                  />
                  <button
                    onClick={() => fillFace('D', activeColor)}
                    title={`Fill Down face with ${activeColor}`}
                    className="absolute -top-2 -right-2 p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] flex items-center gap-1 shadow-lg"
                  >
                    <PaintBucket className="w-3 h-3 text-cyan-400" />
                    <span>Fill</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Right / Center Area: 3D Cube Viewer */}
        {(viewMode === 'both' || viewMode === '3d') && (
          <div className={`${viewMode === 'both' ? 'lg:col-span-5' : 'lg:col-span-12'} flex flex-col gap-4`}>
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 p-4 rounded-2xl shadow-xl flex flex-col gap-3 min-h-[420px]">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-semibold text-slate-300 flex items-center gap-1.5">
                  <Box className="w-4 h-4 text-cyan-400" />
                  <span>3D Interactive Preview</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  Drag to rotate & click stickers
                </span>
              </div>

              {/* 3D Canvas */}
              <div className="flex-1 w-full bg-slate-950/60 rounded-xl border border-slate-800/80 overflow-hidden relative min-h-[350px]">
                <Cube3D interactive={true} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Validation Status Card */}
      <div className="w-full">
        {validation.isValid ? (
          <div className="bg-emerald-950/30 border border-emerald-500/30 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3 text-emerald-300 text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="font-semibold text-emerald-200">Cube Configuration Valid</p>
                <p className="text-xs text-emerald-400/80">
                  All 54 stickers and pieces pass physical legality checks. Click &ldquo;Solve Cube&rdquo; to compute the solution.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-rose-950/30 border border-rose-500/30 p-4 rounded-2xl flex flex-col gap-2">
            <div className="flex items-center gap-2.5 text-rose-300 text-sm font-semibold">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>Cube Configuration Errors ({validation.errors.length})</span>
            </div>
            <ul className="list-disc list-inside text-xs text-rose-300/90 space-y-1 pl-1">
              {validation.errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {solutionResult?.error && (
          <div className="mt-3 bg-amber-950/40 border border-amber-500/40 p-3.5 rounded-xl text-xs text-amber-200 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{solutionResult.error}</span>
          </div>
        )}
      </div>
    </div>
  );
};
