'use client';

import React, { useState } from 'react';
import { useCubeStore } from '@/stores/cube-store';
import { CameraCapture } from './CameraCapture';
import { ImageUploader } from './ImageUploader';
import { CubeFace } from '@/components/cube/CubeFace';
import { FaceName, CubeColor, COLOR_HEX_MAP, COLOR_NAME_MAP } from '@/types/cube';
import { 
  Camera, 
  Upload, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  Sparkles, 
  HelpCircle,
  Edit2
} from 'lucide-react';

const SCAN_ORDER: { face: FaceName; name: string; centerColor: CubeColor; instruction: string }[] = [
  {
    face: 'F',
    name: 'Front Face',
    centerColor: 'green',
    instruction: 'Hold your cube with Green facing you and White on top.',
  },
  {
    face: 'R',
    name: 'Right Face',
    centerColor: 'red',
    instruction: 'Turn the cube 90° to the left: Red is now facing you, White remains on top.',
  },
  {
    face: 'B',
    name: 'Back Face',
    centerColor: 'blue',
    instruction: 'Turn another 90° to the left: Blue is facing you, White remains on top.',
  },
  {
    face: 'L',
    name: 'Left Face',
    centerColor: 'orange',
    instruction: 'Turn another 90° to the left: Orange is facing you, White remains on top.',
  },
  {
    face: 'U',
    name: 'Up (Top) Face',
    centerColor: 'white',
    instruction: 'Tilt the cube downwards: White is facing you, Blue is on top.',
  },
  {
    face: 'D',
    name: 'Down (Bottom) Face',
    centerColor: 'yellow',
    instruction: 'Tilt the cube upwards: Yellow is facing you, Green is on top.',
  },
];

const PALETTE: CubeColor[] = ['white', 'yellow', 'green', 'blue', 'red', 'orange'];

export const FaceScanner: React.FC = () => {
  const currentScanFaceIndex = useCubeStore((s) => s.currentScanFaceIndex);
  const scannedFaces = useCubeStore((s) => s.scannedFaces);
  const setScanFaceData = useCubeStore((s) => s.setScanFaceData);
  const nextScanFace = useCubeStore((s) => s.nextScanFace);
  const prevScanFace = useCubeStore((s) => s.prevScanFace);
  const applyScannedFacesToCube = useCubeStore((s) => s.applyScannedFacesToCube);
  const resetScan = useCubeStore((s) => s.resetScan);
  const setInputMode = useCubeStore((s) => s.setInputMode);

  const [scanMethod, setScanMethod] = useState<'camera' | 'upload'>('camera');
  const [selectedStickerIdx, setSelectedStickerIdx] = useState<number | null>(null);

  const currentFaceInfo = SCAN_ORDER[currentScanFaceIndex];
  const currentFaceData = scannedFaces[currentFaceInfo.face];

  const handleCapture = (colors: CubeColor[], confidences: number[], imageUrl: string) => {
    // Ensure center sticker matches standard face center color if needed
    const adjustedColors = [...colors];
    adjustedColors[4] = currentFaceInfo.centerColor;

    setScanFaceData(currentFaceInfo.face, {
      face: currentFaceInfo.face,
      colors: adjustedColors,
      confidence: confidences,
      capturedImageUrl: imageUrl,
    });
  };

  const handleCorrectSticker = (color: CubeColor) => {
    if (selectedStickerIdx === null || !currentFaceData) return;
    const newColors = [...currentFaceData.colors];
    newColors[selectedStickerIdx] = color;

    setScanFaceData(currentFaceInfo.face, {
      ...currentFaceData,
      colors: newColors,
    });
  };

  const allFacesCaptured = SCAN_ORDER.every((item) => scannedFaces[item.face] !== null);
  const scannedCount = SCAN_ORDER.filter((item) => scannedFaces[item.face] !== null).length;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
      {/* Top Header Card */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 p-4 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-slate-950 font-bold shadow-md">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Cube Scanner (Computer Vision)</h2>
            <p className="text-xs text-slate-400">
              Scan all 6 faces using your device camera or image upload ({scannedCount}/6 captured)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetScan}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span>Reset Scan</span>
          </button>
          <button
            onClick={() => setInputMode('edit')}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Manual Editor</span>
          </button>
        </div>
      </div>

      {/* 6-Face Progress Stepper */}
      <div className="grid grid-cols-6 gap-2 bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 p-3 rounded-2xl shadow-xl">
        {SCAN_ORDER.map((item, idx) => {
          const isDone = scannedFaces[item.face] !== null;
          const isCurrent = idx === currentScanFaceIndex;

          return (
            <button
              key={item.face}
              onClick={() => useCubeStore.setState({ currentScanFaceIndex: idx })}
              className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all cursor-pointer ${
                isCurrent
                  ? 'bg-cyan-500/20 border-2 border-cyan-400 shadow-md'
                  : isDone
                  ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-800/40 border border-slate-700/40 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <div
                style={{ backgroundColor: COLOR_HEX_MAP[item.centerColor] }}
                className="w-5 h-5 rounded-md shadow-sm flex items-center justify-center text-[10px] font-extrabold text-slate-950"
              >
                {item.face}
              </div>
              <span className="text-[10px] sm:text-xs font-semibold hidden sm:inline">
                {item.name}
              </span>
              {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            </button>
          );
        })}
      </div>

      {/* Main Scanner Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Capture Interface (Camera / Upload) */}
        <div className="lg:col-span-7 bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 p-5 rounded-3xl shadow-xl flex flex-col gap-4">
          {/* Method Switcher */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setScanMethod('camera')}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  scanMethod === 'camera'
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>Live Camera</span>
              </button>
              <button
                onClick={() => setScanMethod('upload')}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  scanMethod === 'upload'
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>Upload Image</span>
              </button>
            </div>

            <span className="text-xs font-bold text-cyan-400">
              Face {currentScanFaceIndex + 1} of 6
            </span>
          </div>

          {/* Orientation Guide Card */}
          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-white mb-0.5">
                Target: {currentFaceInfo.name} ({currentFaceInfo.face})
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentFaceInfo.instruction}
              </p>
            </div>
          </div>

          {/* Capture Component */}
          {scanMethod === 'camera' ? (
            <CameraCapture onCapture={handleCapture} />
          ) : (
            <ImageUploader onCapture={handleCapture} />
          )}
        </div>

        {/* Right Column: Captured Face Review & Manual Correction */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 p-5 rounded-3xl shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-cyan-400" />
                <span>Detected Facelet Grid</span>
              </h3>
              {currentFaceData && (
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Captured</span>
                </span>
              )}
            </div>

            {currentFaceData ? (
              <div className="flex flex-col items-center gap-4">
                <p className="text-xs text-slate-400 text-center">
                  Click any sticker to manually adjust its detected colour.
                </p>

                <CubeFace
                  face={currentFaceInfo.face}
                  colors={currentFaceData.colors}
                  highlightIndex={selectedStickerIdx}
                  onStickerClick={(idx) => setSelectedStickerIdx(idx)}
                  size="lg"
                  showLabels={false}
                />

                {/* Correction Color Palette */}
                {selectedStickerIdx !== null && (
                  <div className="w-full bg-slate-950/60 border border-slate-800 p-3 rounded-2xl flex flex-col gap-2 animate-fade-in">
                    <span className="text-xs text-slate-300 font-medium">
                      Select color for sticker #{selectedStickerIdx + 1}:
                    </span>
                    <div className="grid grid-cols-6 gap-2">
                      {PALETTE.map((col) => (
                        <button
                          key={col}
                          onClick={() => handleCorrectSticker(col)}
                          style={{ backgroundColor: COLOR_HEX_MAP[col] }}
                          className="h-8 rounded-lg shadow-md hover:scale-110 active:scale-95 transition-transform"
                          title={COLOR_NAME_MAP[col]}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center gap-2 text-slate-500">
                <Camera className="w-10 h-10 stroke-1" />
                <p className="text-xs">No image captured yet for this face.</p>
                <p className="text-[11px] text-slate-600">Align face inside grid and snap!</p>
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                onClick={prevScanFace}
                disabled={currentScanFaceIndex === 0}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev Face</span>
              </button>

              <button
                onClick={nextScanFace}
                disabled={currentScanFaceIndex === 5}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 flex items-center gap-1 cursor-pointer"
              >
                <span>Next Face</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Finalize Button */}
          <button
            onClick={applyScannedFacesToCube}
            className={`w-full py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-xl cursor-pointer ${
              allFacesCaptured
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-emerald-500/25 active:scale-98'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            <span>
              {allFacesCaptured
                ? 'Apply All 6 Faces & Build Solution'
                : `Apply Current Scans (${scannedCount}/6) to Virtual Cube`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
