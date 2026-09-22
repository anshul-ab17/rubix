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
  Check, 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  Sparkles, 
  HelpCircle,
  X
} from 'lucide-react';

interface FaceScannerProps {
  isOpen: boolean;
  onClose: () => void;
}

const SCAN_ORDER: { face: FaceName; name: string; centerColor: CubeColor; instruction: string }[] = [
  {
    face: 'F',
    name: 'Front Face',
    centerColor: 'green',
    instruction: 'Hold cube with Green facing you and White on top.',
  },
  {
    face: 'R',
    name: 'Right Face',
    centerColor: 'red',
    instruction: 'Turn cube 90° left: Red is facing you, White stays on top.',
  },
  {
    face: 'B',
    name: 'Back Face',
    centerColor: 'blue',
    instruction: 'Turn 90° left: Blue is facing you, White stays on top.',
  },
  {
    face: 'L',
    name: 'Left Face',
    centerColor: 'orange',
    instruction: 'Turn 90° left: Orange is facing you, White stays on top.',
  },
  {
    face: 'U',
    name: 'Up (Top) Face',
    centerColor: 'white',
    instruction: 'Tilt cube down: White is facing you, Blue is on top.',
  },
  {
    face: 'D',
    name: 'Down (Bottom) Face',
    centerColor: 'yellow',
    instruction: 'Tilt cube up: Yellow is facing you, Green is on top.',
  },
];

const PALETTE: CubeColor[] = ['white', 'yellow', 'green', 'blue', 'red', 'orange'];

export const FaceScanner: React.FC<FaceScannerProps> = ({ isOpen, onClose }) => {
  const currentScanFaceIndex = useCubeStore((s) => s.currentScanFaceIndex);
  const scannedFaces = useCubeStore((s) => s.scannedFaces);
  const setScanFaceData = useCubeStore((s) => s.setScanFaceData);
  const nextScanFace = useCubeStore((s) => s.nextScanFace);
  const prevScanFace = useCubeStore((s) => s.prevScanFace);
  const applyScannedFacesToCube = useCubeStore((s) => s.applyScannedFacesToCube);
  const resetScan = useCubeStore((s) => s.resetScan);

  const [scanMethod, setScanMethod] = useState<'camera' | 'upload'>('camera');
  const [selectedStickerIdx, setSelectedStickerIdx] = useState<number | null>(null);

  if (!isOpen) return null;

  const currentFaceInfo = SCAN_ORDER[currentScanFaceIndex];
  const currentFaceData = scannedFaces[currentFaceInfo.face];

  const handleCapture = (colors: CubeColor[], confidences: number[], imageUrl: string) => {
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

  const handleApply = () => {
    applyScannedFacesToCube();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-colors duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-[#0f172a]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Cube Face Scanner</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Scan all 6 faces with camera or upload ({scannedCount}/6 captured)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetScan}
              className="px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg flex items-center gap-1 transition-all cursor-pointer border border-slate-200 dark:border-slate-700"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-all cursor-pointer border border-slate-200 dark:border-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 6-Face Progress Stepper */}
        <div className="grid grid-cols-6 gap-1.5 p-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          {SCAN_ORDER.map((item, idx) => {
            const isDone = scannedFaces[item.face] !== null;
            const isCurrent = idx === currentScanFaceIndex;

            return (
              <button
                key={item.face}
                onClick={() => useCubeStore.setState({ currentScanFaceIndex: idx })}
                className={`flex flex-col items-center gap-1 p-1.5 rounded-xl border transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-blue-50 dark:bg-blue-500/20 border-blue-500 shadow-xs ring-1 ring-blue-500/40 text-blue-700 dark:text-blue-300'
                    : isDone
                    ? 'bg-emerald-50 dark:bg-emerald-500/15 border-emerald-300 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-400'
                    : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div
                  style={{ backgroundColor: COLOR_HEX_MAP[item.centerColor] }}
                  className="w-4 h-4 rounded-sm shadow-2xs border border-slate-300 dark:border-slate-600 flex items-center justify-center text-[9px] font-extrabold text-slate-900"
                >
                  {item.face}
                </div>
                <span className="text-[10px] font-semibold truncate max-w-full text-slate-700 dark:text-slate-200">
                  {item.face}
                </span>
                {isDone && <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />}
              </button>
            );
          })}
        </div>

        {/* Workspace Body */}
        <div className="p-4 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-4 items-start bg-slate-100/70 dark:bg-[#0b1120]">
          {/* Left: Capture (Camera / Upload) */}
          <div className="md:col-span-7 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl flex flex-col gap-3 shadow-xs">
            {/* Method switch */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-0.5 rounded-lg border border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setScanMethod('camera')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    scanMethod === 'camera'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Live Camera</span>
                </button>
                <button
                  onClick={() => setScanMethod('upload')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    scanMethod === 'upload'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Image</span>
                </button>
              </div>

              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                Face {currentScanFaceIndex + 1} of 6
              </span>
            </div>

            {/* Instruction */}
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl flex items-start gap-2 text-xs">
              <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div className="text-slate-700 dark:text-slate-300">
                <strong className="text-slate-900 dark:text-white font-bold">{currentFaceInfo.name} ({currentFaceInfo.face})</strong>: {currentFaceInfo.instruction}
              </div>
            </div>

            {/* Capture Canvas */}
            {scanMethod === 'camera' ? (
              <CameraCapture
                onCapture={handleCapture}
                onSwitchToUpload={() => setScanMethod('upload')}
              />
            ) : (
              <ImageUploader onCapture={handleCapture} />
            )}
          </div>

          {/* Right: Detected Review */}
          <div className="md:col-span-5 flex flex-col gap-3">
            <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl flex flex-col gap-3 shadow-xs">
              <span className="text-xs font-bold text-slate-900 dark:text-white">Detected Face Grid</span>

              {currentFaceData ? (
                <div className="flex flex-col items-center gap-3">
                  <CubeFace
                    face={currentFaceInfo.face}
                    label={currentFaceInfo.name}
                    colors={currentFaceData.colors}
                    highlightIndex={selectedStickerIdx}
                    onStickerClick={(idx) => setSelectedStickerIdx(idx)}
                    size="md"
                  />

                  {selectedStickerIdx !== null && (
                    <div className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2 rounded-xl flex flex-col gap-1.5 animate-fade-in">
                      <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                        Change sticker #{selectedStickerIdx + 1} color:
                      </span>
                      <div className="grid grid-cols-6 gap-1.5">
                        {PALETTE.map((col) => (
                          <button
                            key={col}
                            onClick={() => handleCorrectSticker(col)}
                            style={{ backgroundColor: COLOR_HEX_MAP[col] }}
                            className="h-6 rounded-md shadow-xs border border-slate-300 dark:border-slate-700 hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                            title={COLOR_NAME_MAP[col]}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
                  Align cube face in camera and click capture
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={prevScanFace}
                  disabled={currentScanFaceIndex === 0}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-30 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Prev</span>
                </button>

                <button
                  onClick={nextScanFace}
                  disabled={currentScanFaceIndex === 5}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-30 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1 cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Apply Button */}
            <button
              onClick={handleApply}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer ${
                allFacesCaptured
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/30'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Apply {scannedCount}/6 Scanned Faces</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
