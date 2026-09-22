export type CubeColor = 'white' | 'yellow' | 'green' | 'blue' | 'red' | 'orange';

export type FaceName = 'U' | 'R' | 'F' | 'D' | 'L' | 'B';

export type StandardMove =
  | 'U' | "U'" | 'U2'
  | 'D' | "D'" | 'D2'
  | 'L' | "L'" | 'L2'
  | 'R' | "R'" | 'R2'
  | 'F' | "F'" | 'F2'
  | 'B' | "B'" | 'B2';

// 9 stickers per face, 0 to 8:
// 0 1 2
// 3 4 5  (4 is center)
// 6 7 8
export type FaceState = [
  CubeColor, CubeColor, CubeColor,
  CubeColor, CubeColor, CubeColor,
  CubeColor, CubeColor, CubeColor
];

export interface CubeState {
  U: FaceState;
  R: FaceState;
  F: FaceState;
  D: FaceState;
  L: FaceState;
  B: FaceState;
}

export const FACE_NAMES: FaceName[] = ['U', 'R', 'F', 'D', 'L', 'B'];

export const DEFAULT_FACE_COLORS: Record<FaceName, CubeColor> = {
  U: 'white',
  R: 'red',
  F: 'green',
  D: 'yellow',
  L: 'orange',
  B: 'blue',
};

export const COLOR_HEX_MAP: Record<CubeColor, string> = {
  white: '#F8FAFC',
  yellow: '#FACC15',
  green: '#22C55E',
  blue: '#3B82F6',
  red: '#EF4444',
  orange: '#F97316',
};

export const COLOR_NAME_MAP: Record<CubeColor, string> = {
  white: 'White',
  yellow: 'Yellow',
  green: 'Green',
  blue: 'Blue',
  red: 'Red',
  orange: 'Orange',
};

export const FACE_FULL_NAMES: Record<FaceName, string> = {
  U: 'Up (Top)',
  R: 'Right',
  F: 'Front',
  D: 'Down (Bottom)',
  L: 'Left',
  B: 'Back',
};

export interface SolveStep {
  index: number;
  move: StandardMove;
  face: FaceName;
  direction: 'clockwise' | 'counterclockwise' | 'double';
  quarterTurns: number;
  notation: string;
  description: string;
  handHint: string;
  cameraFocusFace: FaceName;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  colorCounts: Record<CubeColor, number>;
}

export type InputMode = 'edit' | 'scan' | 'solve' | 'timer' | 'freeplay';

export interface ScannedFace {
  face: FaceName;
  colors: CubeColor[];
  capturedImageUrl?: string;
  confidence: number[];
}
