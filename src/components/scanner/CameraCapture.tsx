'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, AlertCircle, Upload } from 'lucide-react';
import { extractFaceColorsFromCanvas } from '@/lib/scanner/colour-detection';
import { CubeColor } from '@/types/cube';

interface CameraCaptureProps {
  onCapture: (colors: CubeColor[], confidences: number[], capturedImageUrl: string) => void;
  onSwitchToUpload?: () => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onSwitchToUpload }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Helper to parse getUserMedia errors into user-friendly guidance
  const parseCameraError = (err: unknown): string => {
    if (err && typeof err === 'object' && 'name' in err) {
      const errorName = (err as { name: string }).name;
      if (errorName === 'NotFoundError' || errorName === 'DevicesNotFoundError') {
        return 'No camera was found on this device. Please connect a webcam or switch to the Image Upload tab.';
      }
      if (errorName === 'NotAllowedError' || errorName === 'PermissionDeniedError') {
        return 'Camera permission was denied. Please allow camera permissions in your browser or use Image Upload.';
      }
      if (errorName === 'NotReadableError' || errorName === 'TrackStartError') {
        return 'Your camera is currently in use by another application. Please close other camera apps and retry.';
      }
      if (errorName === 'OverconstrainedError') {
        return 'Requested camera resolution is not supported. Retrying with default settings...';
      }
    }
    return 'Camera stream could not be initialized. Please use the Upload Image tab to scan your cube.';
  };

  const [retryCount, setRetryCount] = useState(0);

  const handleRetry = () => {
    setRetryCount((c) => c + 1);
  };

  useEffect(() => {
    let active = true;

    const startStream = async () => {
      if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
        if (active) {
          setCameraError('Camera access is not supported in this browser. Please use the Image Upload tab.');
        }
        return;
      }

      // Attempt 1: Environment Camera
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 640 } },
        });
        if (!active) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraError(null);
        return;
      } catch (firstErr: unknown) {
        if (!active) return;
        const errorName = (firstErr as { name?: string })?.name;
        if (errorName === 'NotAllowedError') {
          setCameraError(parseCameraError(firstErr));
          return;
        }
      }

      // Attempt 2: Generic Camera Fallback
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (!active) {
          fallbackStream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = fallbackStream;
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
        }
        setCameraError(null);
      } catch (secondErr: unknown) {
        if (!active) return;
        setCameraError(parseCameraError(secondErr));
      }
    };

    startStream();

    return () => {
      active = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, [retryCount]);

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

    // Center 65% square ROI for the cube face
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
    <div className="flex flex-col items-center gap-3 w-full">
      {cameraError ? (
        <div className="w-full p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col items-center text-center gap-2.5 text-amber-900">
          <AlertCircle className="w-7 h-7 text-amber-600" />
          <p className="text-xs sm:text-sm font-medium leading-relaxed max-w-md">
            {cameraError}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <button
              type="button"
              onClick={handleRetry}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>Retry Camera</span>
            </button>

            {onSwitchToUpload && (
              <button
                type="button"
                onClick={onSwitchToUpload}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Image Instead</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="relative w-full max-w-xs aspect-square bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 shadow-md flex items-center justify-center">
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
            <div className="w-[65%] h-[65%] border-2 border-blue-400 rounded-xl grid grid-cols-3 grid-rows-3 bg-blue-400/5 shadow-[0_0_15px_rgba(37,99,235,0.25)]">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="border border-blue-400/40 flex items-center justify-center"
                >
                  <div className="w-2 h-2 rounded-full bg-blue-400/70" />
                </div>
              ))}
            </div>
          </div>

          {!isReady && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-xs flex flex-col items-center justify-center gap-2 text-slate-500 text-xs">
              <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
              <span>Connecting camera stream...</span>
            </div>
          )}
        </div>
      )}

      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Snap Button */}
      {!cameraError && isReady && (
        <button
          type="button"
          onClick={handleCapture}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Camera className="w-4 h-4" />
          <span>Capture Face</span>
        </button>
      )}
    </div>
  );
};
