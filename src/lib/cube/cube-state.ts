import { CubeState, FaceState, DEFAULT_FACE_COLORS, FACE_NAMES } from '@/types/cube';

export function createSolvedCube(): CubeState {
  const cube: Partial<CubeState> = {};
  for (const face of FACE_NAMES) {
    const color = DEFAULT_FACE_COLORS[face];
    cube[face] = [color, color, color, color, color, color, color, color, color];
  }
  return cube as CubeState;
}

export function cloneCubeState(state: CubeState): CubeState {
  return {
    U: [...state.U] as FaceState,
    R: [...state.R] as FaceState,
    F: [...state.F] as FaceState,
    D: [...state.D] as FaceState,
    L: [...state.L] as FaceState,
    B: [...state.B] as FaceState,
  };
}

export function isCubeSolved(state: CubeState): boolean {
  for (const face of FACE_NAMES) {
    const centerColor = state[face][4];
    for (let i = 0; i < 9; i++) {
      if (state[face][i] !== centerColor) {
        return false;
      }
    }
  }
  return true;
}

export function rotateFaceCW(face: FaceState): FaceState {
  return [
    face[6], face[3], face[0],
    face[7], face[4], face[1],
    face[8], face[5], face[2]
  ];
}

export function rotateFaceCCW(face: FaceState): FaceState {
  return [
    face[2], face[5], face[8],
    face[1], face[4], face[7],
    face[0], face[3], face[6]
  ];
}

export function rotateFace180(face: FaceState): FaceState {
  return [
    face[8], face[7], face[6],
    face[5], face[4], face[3],
    face[2], face[1], face[0]
  ];
}
