import { create } from 'zustand';
import { CubeColor, CubeState, FaceName, FaceState, StandardMove, InputMode, ScannedFace, ValidationResult, FACE_NAMES } from '@/types/cube';
import { createSolvedCube, cloneCubeState } from '@/lib/cube/cube-state';
import { applyMove, generateScramble } from '@/lib/cube/cube-moves';
import { validateCubeState } from '@/lib/cube/cube-validator';
import { solveCube, SolveResult } from '@/lib/solver/solver-adapter';

export interface CubeStore {
  cubeState: CubeState;
  initialSolveState: CubeState | null;
  activeColor: CubeColor;
  inputMode: InputMode;
  
  // Solver state
  isSolving: boolean;
  solutionResult: SolveResult | null;
  currentStepIndex: number;
  isPlaying: boolean;
  playbackSpeed: number; // in ms interval or multiplier
  stepStates: CubeState[]; // Snapshot of cube state after each step

  // Scramble
  currentScramble: string;
  
  // Scanner state
  currentScanFaceIndex: number;
  scannedFaces: Record<FaceName, ScannedFace | null>;
  isScanning: boolean;

  // Validation
  validation: ValidationResult;

  // Actions
  setStickerColor: (face: FaceName, index: number, color: CubeColor) => void;
  fillFace: (face: FaceName, color: CubeColor) => void;
  resetCube: () => void;
  setCubeState: (state: CubeState) => void;
  applySingleMove: (move: StandardMove) => void;
  scrambleCube: (length?: number) => void;
  solveCurrentCube: () => Promise<boolean>;
  stopSolving: () => void;
  setCurrentStepIndex: (index: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  togglePlay: () => void;
  setIsPlaying: (playing: boolean) => void;
  setPlaybackSpeed: (speed: number) => void;
  setActiveColor: (color: CubeColor) => void;
  setInputMode: (mode: InputMode) => void;
  setScanFaceData: (face: FaceName, data: ScannedFace) => void;
  nextScanFace: () => void;
  prevScanFace: () => void;
  applyScannedFacesToCube: () => void;
  resetScan: () => void;
}

const initialValidation = validateCubeState(createSolvedCube());

export const useCubeStore = create<CubeStore>((set, get) => ({
  cubeState: createSolvedCube(),
  initialSolveState: null,
  activeColor: 'white',
  inputMode: 'edit',

  isSolving: false,
  solutionResult: null,
  currentStepIndex: 0,
  isPlaying: false,
  playbackSpeed: 1000,
  stepStates: [],

  currentScramble: '',

  currentScanFaceIndex: 0,
  scannedFaces: {
    U: null,
    R: null,
    F: null,
    D: null,
    L: null,
    B: null,
  },
  isScanning: false,

  validation: initialValidation,

  setStickerColor: (face, index, color) => {
    const nextState = cloneCubeState(get().cubeState);
    nextState[face][index] = color;
    const validation = validateCubeState(nextState);
    set({
      cubeState: nextState,
      validation,
      solutionResult: null,
      currentStepIndex: 0,
      stepStates: [],
    });
  },

  fillFace: (face, color) => {
    const nextState = cloneCubeState(get().cubeState);
    nextState[face] = [color, color, color, color, color, color, color, color, color];
    const validation = validateCubeState(nextState);
    set({
      cubeState: nextState,
      validation,
      solutionResult: null,
      currentStepIndex: 0,
      stepStates: [],
    });
  },

  resetCube: () => {
    const solved = createSolvedCube();
    set({
      cubeState: solved,
      initialSolveState: null,
      validation: validateCubeState(solved),
      solutionResult: null,
      currentStepIndex: 0,
      isPlaying: false,
      stepStates: [],
      currentScramble: '',
    });
  },

  setCubeState: (newState) => {
    const validation = validateCubeState(newState);
    set({
      cubeState: cloneCubeState(newState),
      validation,
      solutionResult: null,
      currentStepIndex: 0,
      isPlaying: false,
      stepStates: [],
    });
  },

  applySingleMove: (move) => {
    const nextState = applyMove(get().cubeState, move);
    const validation = validateCubeState(nextState);
    set({
      cubeState: nextState,
      validation,
    });
  },

  scrambleCube: (length = 20) => {
    const moves = generateScramble(length);
    let state = createSolvedCube();
    for (const move of moves) {
      state = applyMove(state, move);
    }
    const scrambleStr = moves.join(' ');
    set({
      cubeState: state,
      initialSolveState: null,
      currentScramble: scrambleStr,
      validation: validateCubeState(state),
      solutionResult: null,
      currentStepIndex: 0,
      isPlaying: false,
      stepStates: [],
    });
  },

  solveCurrentCube: async () => {
    set({ isSolving: true });
    const currentState = cloneCubeState(get().cubeState);
    const result = await solveCube(currentState);

    if (result.success) {
      // Precompute all snapshot states for seamless step scrubbing
      const snapshots: CubeState[] = [cloneCubeState(currentState)];
      let temp = cloneCubeState(currentState);
      for (const step of result.steps) {
        temp = applyMove(temp, step.move);
        snapshots.push(cloneCubeState(temp));
      }

      set({
        isSolving: false,
        solutionResult: result,
        initialSolveState: currentState,
        currentStepIndex: 0,
        stepStates: snapshots,
        inputMode: 'solve',
      });
      return true;
    } else {
      set({
        isSolving: false,
        solutionResult: result,
      });
      return false;
    }
  },

  stopSolving: () => {
    set({
      isPlaying: false,
      solutionResult: null,
      currentStepIndex: 0,
      stepStates: [],
    });
  },

  setCurrentStepIndex: (index) => {
    const { stepStates, solutionResult } = get();
    if (!solutionResult || !stepStates[index]) return;
    set({
      currentStepIndex: index,
      cubeState: cloneCubeState(stepStates[index]),
    });
  },

  nextStep: () => {
    const { currentStepIndex, solutionResult, stepStates } = get();
    if (!solutionResult) return;
    const nextIdx = Math.min(solutionResult.steps.length, currentStepIndex + 1);
    if (nextIdx !== currentStepIndex && stepStates[nextIdx]) {
      set({
        currentStepIndex: nextIdx,
        cubeState: cloneCubeState(stepStates[nextIdx]),
      });
    }
  },

  prevStep: () => {
    const { currentStepIndex, stepStates } = get();
    const prevIdx = Math.max(0, currentStepIndex - 1);
    if (prevIdx !== currentStepIndex && stepStates[prevIdx]) {
      set({
        currentStepIndex: prevIdx,
        cubeState: cloneCubeState(stepStates[prevIdx]),
      });
    }
  },

  togglePlay: () => {
    set((state) => ({ isPlaying: !state.isPlaying }));
  },

  setIsPlaying: (playing) => {
    set({ isPlaying: playing });
  },

  setPlaybackSpeed: (speed) => {
    set({ playbackSpeed: speed });
  },

  setActiveColor: (color) => {
    set({ activeColor: color });
  },

  setInputMode: (mode) => {
    set({ inputMode: mode, isPlaying: false });
  },

  setScanFaceData: (face, data) => {
    set((state) => ({
      scannedFaces: {
        ...state.scannedFaces,
        [face]: data,
      },
    }));
  },

  nextScanFace: () => {
    set((state) => ({
      currentScanFaceIndex: Math.min(5, state.currentScanFaceIndex + 1),
    }));
  },

  prevScanFace: () => {
    set((state) => ({
      currentScanFaceIndex: Math.max(0, state.currentScanFaceIndex - 1),
    }));
  },

  applyScannedFacesToCube: () => {
    const { scannedFaces } = get();
    const newState = createSolvedCube();
    for (const face of FACE_NAMES) {
      const scanned = scannedFaces[face];
      if (scanned && scanned.colors.length === 9) {
        newState[face] = [...scanned.colors] as FaceState;
      }
    }
    const validation = validateCubeState(newState);
    set({
      cubeState: newState,
      validation,
      inputMode: 'edit',
    });
  },

  resetScan: () => {
    set({
      currentScanFaceIndex: 0,
      scannedFaces: {
        U: null,
        R: null,
        F: null,
        D: null,
        L: null,
        B: null,
      },
    });
  },
}));
