'use client';

import React, { useState } from 'react';
import { Cube3D } from './Cube3D';
import { CubeFace } from './CubeFace';
import { LiveSolvingCard } from '@/components/solver/LiveSolvingCard';
import { useCubeStore } from '@/stores/cube-store';
import { Maximize2, RotateCcw } from 'lucide-react';

export const CenterPreview: React.FC = () => {
  const cubeState = useCubeStore((s) => s.cubeState);
  const setStickerColor = useCubeStore((s) => s.setStickerColor);
  const activeColor = useCubeStore((s) => s.activeColor);

  const [viewType, setViewType] = useState<'3d' | 'net'>('3d');
  const [autoRotate, setAutoRotate] = useState(false);
  const [cameraPreset, setCameraPreset] = useState<'iso' | 'front' | 'top' | 'right'>('iso');

  return (
    <div className="h-full flex flex-col justify-between gap-3 select-none">
      {/* 3D Cube Preview Main Card */}
      <div className="flex-1 bg-white dark:bg-[#0f172a]/95 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-3.5 shadow-xs dark:shadow-md flex flex-col justify-between relative min-h-0 transition-colors duration-200">
        {/* Card Header & View Switcher */}
        <div className="flex items-center justify-between mb-1 z-10">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
              2. 3D Cube Preview
            </h2>
            <p className="text-[11px] text-slate-400 dark:text-slate-400">
              Interact, rotate and watch it solve in real-time
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            {/* View Mode Segmented Switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-0.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setViewType('3d')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  viewType === '3d'
                    ? 'bg-blue-600 text-white shadow-2xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                3D View
              </button>
              <button
                type="button"
                onClick={() => setViewType('net')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  viewType === 'net'
                    ? 'bg-blue-600 text-white shadow-2xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Net View
              </button>
              <button
                type="button"
                onClick={() => setAutoRotate(!autoRotate)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  autoRotate
                    ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 font-bold border border-blue-200 dark:border-blue-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Auto Rotate
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!document.fullscreenElement) {
                  document.documentElement.requestFullscreen().catch(() => {});
                } else {
                  document.exitFullscreen().catch(() => {});
                }
              }}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Toggle Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3D Canvas / Net Canvas Area */}
        <div className="flex-1 relative flex items-center justify-center min-h-0 py-1">
          {viewType === '3d' ? (
            <div className="w-full h-full relative flex items-center justify-center">
              <Cube3D
                autoRotate={autoRotate}
                cameraPreset={cameraPreset}
                className="w-full h-full"
              />

              {/* Helper Overlay */}
              <div className="absolute bottom-1 pointer-events-none flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                <span>Drag to rotate 3D view</span>
              </div>
            </div>
          ) : (
            /* Unfolded Net Layout */
            <div className="w-full h-full flex items-center justify-center p-2 overflow-auto">
              <div className="grid grid-cols-4 grid-rows-3 gap-2">
                <div />
                <CubeFace
                  face="U"
                  label="U (Top)"
                  colors={cubeState.U}
                  onStickerClick={(i) => setStickerColor('U', i, activeColor)}
                  size="xs"
                />
                <div />
                <div />

                <CubeFace
                  face="L"
                  label="L (Left)"
                  colors={cubeState.L}
                  onStickerClick={(i) => setStickerColor('L', i, activeColor)}
                  size="xs"
                />
                <CubeFace
                  face="F"
                  label="F (Front)"
                  colors={cubeState.F}
                  onStickerClick={(i) => setStickerColor('F', i, activeColor)}
                  size="xs"
                />
                <CubeFace
                  face="R"
                  label="R (Right)"
                  colors={cubeState.R}
                  onStickerClick={(i) => setStickerColor('R', i, activeColor)}
                  size="xs"
                />
                <CubeFace
                  face="B"
                  label="B (Back)"
                  colors={cubeState.B}
                  onStickerClick={(i) => setStickerColor('B', i, activeColor)}
                  size="xs"
                />

                <div />
                <CubeFace
                  face="D"
                  label="D (Bottom)"
                  colors={cubeState.D}
                  onStickerClick={(i) => setStickerColor('D', i, activeColor)}
                  size="xs"
                />
                <div />
                <div />
              </div>
            </div>
          )}
        </div>

        {/* Camera Orientation Quick Presets */}
        <div className="flex items-center justify-center gap-1.5 pt-1 z-10">
          <button
            type="button"
            onClick={() => setCameraPreset('iso')}
            className={`px-3 py-1 text-xs font-semibold rounded-xl border transition-all cursor-pointer flex items-center gap-1 ${
              cameraPreset === 'iso'
                ? 'bg-blue-600 text-white border-blue-600 shadow-2xs font-bold'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-300 dark:border-slate-800 shadow-2xs'
            }`}
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset View</span>
          </button>

          <button
            type="button"
            onClick={() => setCameraPreset('front')}
            className={`px-3 py-1 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
              cameraPreset === 'front'
                ? 'bg-blue-600 text-white border-blue-600 shadow-2xs font-bold'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-300 dark:border-slate-800 shadow-2xs'
            }`}
          >
            Front (F)
          </button>

          <button
            type="button"
            onClick={() => setCameraPreset('top')}
            className={`px-3 py-1 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
              cameraPreset === 'top'
                ? 'bg-blue-600 text-white border-blue-600 shadow-2xs font-bold'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-300 dark:border-slate-800 shadow-2xs'
            }`}
          >
            Top (U)
          </button>

          <button
            type="button"
            onClick={() => setCameraPreset('right')}
            className={`px-3 py-1 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
              cameraPreset === 'right'
                ? 'bg-blue-600 text-white border-blue-600 shadow-2xs font-bold'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-300 dark:border-slate-800 shadow-2xs'
            }`}
          >
            Right (R)
          </button>
        </div>
      </div>

      {/* Live Solving Animation Card */}
      <LiveSolvingCard />
    </div>
  );
};
