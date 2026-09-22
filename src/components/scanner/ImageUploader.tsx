'use client';

import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { extractFaceColorsFromCanvas } from '@/lib/scanner/colour-detection';
import { CubeColor } from '@/types/cube';

interface ImageUploaderProps {
  onCapture: (colors: CubeColor[], confidences: number[], imageUrl: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onCapture }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setIsProcessing(false);
          return;
        }

        ctx.drawImage(img, 0, 0);

        const minDim = Math.min(img.width, img.height);
        const boxSize = minDim * 0.7;
        const roi = {
          x: (img.width - boxSize) / 2,
          y: (img.height - boxSize) / 2,
          width: boxSize,
          height: boxSize,
        };

        const { colors, confidences } = extractFaceColorsFromCanvas(canvas, roi);
        const imageUrl = canvas.toDataURL('image/jpeg', 0.85);

        setIsProcessing(false);
        onCapture(colors, confidences, imageUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          w-full max-w-xs aspect-square rounded-2xl border-2 border-dashed transition-all p-6
          flex flex-col items-center justify-center text-center gap-2.5 cursor-pointer
          ${dragOver ? 'border-blue-500 bg-blue-50/50 scale-102' : 'border-slate-300 bg-white hover:border-blue-400 hover:bg-slate-50/60 shadow-xs'}
        `}
      >
        <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-2xs">
          {isProcessing ? (
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Upload className="w-6 h-6" />
          )}
        </div>

        <div>
          <p className="text-xs sm:text-sm font-semibold text-slate-800">
            {isProcessing ? 'Analyzing Image...' : 'Click to Upload or Drag Image'}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            PNG, JPG, or WEBP of a single cube face
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              processFile(e.target.files[0]);
            }
          }}
        />
      </div>
    </div>
  );
};
