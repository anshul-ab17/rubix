'use client';

import { create } from 'zustand';
import { CubeColor, CubeState, FaceName, FaceState, StandardMove, InputMode, ScannedFace, ValidationResult, FACE_NAMES } from '@/types/cube';
import { createSolvedCube, cloneCubeState } from '@/lib/cube/cube-state';
import { applyMove, generateScramble } from '@/lib/cube/cube-moves';
import { validateCubeState } from '@/lib/cube/cube-validator';
import { solveCube, SolveResult } from '@/lib/solver/solver-adapter';

function getInverseMove(move: StandardMove): StandardMove {
  if (move.endsWith("'")) return move.slice(0, 1) as StandardMove;
  if (move.endsWith("2")) return move;
  return `${move}'` as StandardMove;
}

export interface AnimatedMoveEvent {
  move: StandardMove;
  id: number;
  speedMs?: number;
}

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
  playbackSpeed: number; // in ms interval
  stepStates: CubeState[]; // Snapshot of cube state after each step

  // Animated Move Dispatcher for 3D View
  activeAnimatedMove: AnimatedMoveEvent | null;
  isScrambling: boolean;

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
  triggerAnimatedMove: (move: StandardMove, speedMs?: number) => void;
  scrambleCube: (length?: number) => Promise<void>;
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
  playbackSpeed: 900,
  stepStates: [],

  activeAnimatedMove: null,
  isScrambling: false,

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
      isScrambling: false,
      stepStates: [],
      currentScramble: '',
      activeAnimatedMove: null,
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

  triggerAnimatedMove: (move, speedMs = 200) => {
    set({
      activeAnimatedMove: {
        move,
        id: Date.now() + Math.random(),
        speedMs,
      },
    });
  },

  applySingleMove: (move) => {
    const nextState = applyMove(get().cubeState, move);
    const validation = validateCubeState(nextState);
    set({
      cubeState: nextState,
      validation,
      activeAnimatedMove: {
        move,
        id: Date.now() + Math.random(),
        speedMs: 200,
      },
    });
  },

  scrambleCube: async (length = 20) => {
    if (get().isScrambling) return;
    
    set({
      isScrambling: true,
      isPlaying: false,
      solutionResult: null,
      currentStepIndex: 0,
      stepStates: [],
    });

    const moves = generateScramble(length);
    const scrambleStr = moves.join(' ');
    set({ currentScramble: scrambleStr });

    let state = cloneCubeState(get().cubeState);
    const moveDelay = length > 12 ? 95 : 140;

    for (const move of moves) {
      // Trigger layer animation in 3D
      set({
        activeAnimatedMove: {
          move,
          id: Date.now() + Math.random(),
          speedMs: moveDelay * 0.85,
        },
      });

      state = applyMove(state, move);
      set({
        cubeState: cloneCubeState(state),
        validation: validateCubeState(state),
      });

      // Rapid pause between scramble moves for visual mechanical fluidity
      await new Promise((resolve) => setTimeout(resolve, moveDelay));
    }

    set({
      isScrambling: false,
      initialSolveState: null,
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
    const { currentStepIndex, solutionResult, stepStates, playbackSpeed } = get();
    if (!solutionResult) return;
    const nextIdx = Math.min(solutionResult.steps.length, currentStepIndex + 1);
    if (nextIdx !== currentStepIndex && stepStates[nextIdx]) {
      const step = solutionResult.steps[currentStepIndex];
      if (step) {
        set({
          activeAnimatedMove: {
            move: step.move,
            id: Date.now() + Math.random(),
            speedMs: Math.min(300, playbackSpeed * 0.7),
          },
        });
      }
      set({
        currentStepIndex: nextIdx,
        cubeState: cloneCubeState(stepStates[nextIdx]),
      });
    }
  },

  prevStep: () => {
    const { currentStepIndex, solutionResult, stepStates, playbackSpeed } = get();
    const prevIdx = Math.max(0, currentStepIndex - 1);
    if (prevIdx !== currentStepIndex && stepStates[prevIdx]) {
      if (solutionResult && solutionResult.steps[prevIdx]) {
        const step = solutionResult.steps[prevIdx];
        const invMove = getInverseMove(step.move);
        set({
          activeAnimatedMove: {
            move: invMove,
            id: Date.now() + Math.random(),
            speedMs: Math.min(300, playbackSpeed * 0.7),
          },
        });
      }
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
