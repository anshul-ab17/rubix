import { CubeColor } from '@/types/cube';

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSV {
  h: number; // 0 - 360
  s: number; // 0 - 100
  v: number; // 0 - 100
}

export interface LAB {
  l: number;
  a: number;
  b: number;
}

export function rgbToHsv(r: number, g: number, b: number): HSV {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;
  let h = 0;
  const s = max === 0 ? 0 : (diff / max) * 100;
  const v = max * 100;

  if (diff !== 0) {
    if (max === r) {
      h = ((g - b) / diff) % 6;
    } else if (max === g) {
      h = (b - r) / diff + 2;
    } else {
      h = (r - g) / diff + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }

  return { h, s, v };
}

export function rgbToLab(r: number, g: number, b: number): LAB {
  // Normalize RGB to [0, 1] and apply sRGB gamma correction
  let rLin = r / 255;
  let gLin = g / 255;
  let bLin = b / 255;

  rLin = rLin > 0.04045 ? Math.pow((rLin + 0.055) / 1.055, 2.4) : rLin / 12.92;
  gLin = gLin > 0.04045 ? Math.pow((gLin + 0.055) / 1.055, 2.4) : gLin / 12.92;
  bLin = bLin > 0.04045 ? Math.pow((bLin + 0.055) / 1.055, 2.4) : bLin / 12.92;

  // Convert to XYZ with standard D65 illuminant
  const x = (rLin * 0.4124 + gLin * 0.3576 + bLin * 0.1805) / 0.95047;
  const y = (rLin * 0.2126 + gLin * 0.7152 + bLin * 0.0722) / 1.00000;
  const z = (rLin * 0.0193 + gLin * 0.1192 + bLin * 0.9505) / 1.08883;

  const f = (t: number) => t > 0.008856 ? Math.pow(t, 1 / 3) : (7.787 * t) + (16 / 116);

  const fx = f(x);
  const fy = f(y);
  const fz = f(z);

  return {
    l: (116 * fy) - 16,
    a: 500 * (fx - fy),
    b: 200 * (fy - fz),
  };
}

export function labDistance(lab1: LAB, lab2: LAB): number {
  const dl = lab1.l - lab2.l;
  const da = lab1.a - lab2.a;
  const db = lab1.b - lab2.b;
  return Math.sqrt(dl * dl + da * da + db * db);
}

// Reference typical Rubik's Cube sticker colors in RGB
export const REFERENCE_COLORS: Record<CubeColor, RGB> = {
  white: { r: 245, g: 245, b: 245 },
  yellow: { r: 240, g: 220, b: 20 },
  green: { r: 20, g: 170, b: 60 },
  blue: { r: 15, g: 90, b: 215 },
  red: { r: 215, g: 30, b: 35 },
  orange: { r: 245, g: 110, b: 20 },
};

export function classifyColor(rgb: RGB): { color: CubeColor; confidence: number } {
  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
  const targetLab = rgbToLab(rgb.r, rgb.g, rgb.b);

  // Heuristic rule 1: Low saturation -> White
  if (hsv.s < 20 && hsv.v > 40) {
    const confidence = Math.min(1, Math.max(0.6, (100 - hsv.s) / 100));
    return { color: 'white', confidence };
  }

  // Heuristic rule 2: Yellow detection (Hue 40-70, high saturation & brightness)
  if (hsv.h >= 42 && hsv.h <= 75 && hsv.s > 35 && hsv.v > 45) {
    return { color: 'yellow', confidence: 0.92 };
  }

  // Heuristic rule 3: Green detection (Hue 75-165)
  if (hsv.h > 75 && hsv.h <= 165 && hsv.s > 25) {
    return { color: 'green', confidence: 0.94 };
  }

  // Heuristic rule 4: Blue detection (Hue 170-260)
  if (hsv.h > 170 && hsv.h <= 260 && hsv.s > 30) {
    return { color: 'blue', confidence: 0.94 };
  }

  // Heuristic rule 5: Orange vs Red distinction (Hue 0-42 or 340-360)
  if ((hsv.h >= 0 && hsv.h <= 42) || hsv.h >= 340) {
    // Orange has higher green component and hue between 12 and 42
    if (hsv.h >= 14 && hsv.h <= 42 && (rgb.g / Math.max(1, rgb.r) > 0.35)) {
      return { color: 'orange', confidence: 0.88 };
    }
    return { color: 'red', confidence: 0.88 };
  }

  // Fallback: CIELAB minimum distance
  let minDistance = Infinity;
  let bestColor: CubeColor = 'white';

  for (const [colorKey, refRgb] of Object.entries(REFERENCE_COLORS)) {
    const refLab = rgbToLab(refRgb.r, refRgb.g, refRgb.b);
    const dist = labDistance(targetLab, refLab);
    if (dist < minDistance) {
      minDistance = dist;
      bestColor = colorKey as CubeColor;
    }
  }

  const confidence = Math.max(0.4, Math.min(0.95, 1 - minDistance / 100));
  return { color: bestColor, confidence };
}

// Extract 9 color samples from a 3x3 grid region on an HTMLCanvasElement or ImageData
export function extractFaceColorsFromCanvas(
  canvas: HTMLCanvasElement,
  roi: { x: number; y: number; width: number; height: number }
): { colors: CubeColor[]; confidences: number[]; rawRgb: RGB[] } {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return {
      colors: Array(9).fill('white'),
      confidences: Array(9).fill(0.5),
      rawRgb: Array(9).fill({ r: 255, g: 255, b: 255 }),
    };
  }

  const cellWidth = roi.width / 3;
  const cellHeight = roi.height / 3;
  const sampleRadius = Math.min(cellWidth, cellHeight) * 0.22; // sample central 44% to avoid sticker borders

  const colors: CubeColor[] = [];
  const confidences: number[] = [];
  const rawRgb: RGB[] = [];

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const centerX = roi.x + col * cellWidth + cellWidth / 2;
      const centerY = roi.y + row * cellHeight + cellHeight / 2;

      const sampleX = Math.max(0, Math.floor(centerX - sampleRadius));
      const sampleY = Math.max(0, Math.floor(centerY - sampleRadius));
      const sampleW = Math.max(1, Math.floor(sampleRadius * 2));
      const sampleH = Math.max(1, Math.floor(sampleRadius * 2));

      try {
        const imgData = ctx.getImageData(sampleX, sampleY, sampleW, sampleH);
        const data = imgData.data;
        let sumR = 0;
        let sumG = 0;
        let sumB = 0;
        let count = 0;

        for (let i = 0; i < data.length; i += 4) {
          sumR += data[i];
          sumG += data[i + 1];
          sumB += data[i + 2];
          count++;
        }

        const avgRgb: RGB = {
          r: count > 0 ? Math.round(sumR / count) : 255,
          g: count > 0 ? Math.round(sumG / count) : 255,
          b: count > 0 ? Math.round(sumB / count) : 255,
        };

        const classification = classifyColor(avgRgb);
        colors.push(classification.color);
        confidences.push(classification.confidence);
        rawRgb.push(avgRgb);
      } catch {
        colors.push('white');
        confidences.push(0.5);
        rawRgb.push({ r: 255, g: 255, b: 255 });
      }
    }
  }

  return { colors, confidences, rawRgb };
}
