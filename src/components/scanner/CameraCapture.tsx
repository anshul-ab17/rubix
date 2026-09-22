'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Camera, RefreshCw, AlertCircle, Check } from 'lucide-react';
import { extractFaceColorsFromCanvas, RGB } from '@/lib/scanner/colour-detection';
import { CubeColor } from '@/types/cube';

interface CameraCaptureProps {
  onCapture: (colors: CubeColor[], confidences: number[], capturedImageUrl: string) => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Start webcam
  const startCamera = useCallback(async () => {
    setCameraError(null);
    setIsReady(false);
    try {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // prefer back camera on mobile
          width: { ideal: 640 },
          height: { ideal: 640 },
        },
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('Unable to access camera. Please allow camera permissions or use Image Upload.');
    }
  }, [stream]);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const handleCanPlay = () => {
    setIsReady(true);
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, width, height);

    // Center 60% square ROI for the cube face
    const minDim = Math.min(width, height);
    const boxSize = minDim * 0.65;
    const roi = {
      x: (width - boxSize) / 2,
      y: (height - boxSize) / 2,
      width: boxSize,
      height: boxSize,
    };

    const { colors, confidences } = extractFaceColorsFromCanvas(canvas, roi);
    const capturedImageUrl = canvas.toDataURL('image/jpeg', 0.85);

    onCapture(colors, confidences, capturedImageUrl);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {cameraError ? (
        <div className="w-full p-4 bg-rose-950/40 border border-rose-500/40 rounded-2xl flex flex-col items-center text-center gap-3 text-rose-200">
          <AlertCircle className="w-8 h-8 text-rose-400" />
          <p className="text-xs sm:text-sm">{cameraError}</p>
          <button
            onClick={startCamera}
            className="px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-400/40 rounded-xl text-xs font-semibold flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      ) : (
        <div className="relative w-full max-w-sm aspect-square bg-slate-950 rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl flex items-center justify-center">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            onCanPlay={handleCanPlay}
            className="w-full h-full object-cover"
          />

          {/* 3x3 Overlay Bounding Grid */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[65%] h-[65%] border-2 border-cyan-400 rounded-xl grid grid-cols-3 grid-rows-3 bg-cyan-400/5 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="border border-cyan-400/40 flex items-center justify-center"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400/60" />
                </div>
              ))}
            </div>
          </div>

          {!isReady && (
            <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center gap-2 text-slate-400 text-xs">
              <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
              <span>Starting camera stream...</span>
            </div>
          )}
        </div>
      )}

      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Snap Button */}
      {!cameraError && isReady && (
        <button
          onClick={handleCapture}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-bold rounded-2xl shadow-xl shadow-cyan-500/25 flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
        >
          <Camera className="w-5 h-5" />
          <span>Capture Face Colors</span>
        </button>
      )}
    </div>
  );
};
