import { CubeState, StandardMove, FaceState, FaceName } from '@/types/cube';
import { cloneCubeState, rotateFaceCW, rotateFaceCCW, rotateFace180 } from './cube-state';

export function applyMove(state: CubeState, move: StandardMove): CubeState {
  const next = cloneCubeState(state);

  switch (move) {
    case 'U': {
      next.U = rotateFaceCW(next.U);
      const temp = [next.F[0], next.F[1], next.F[2]];
      next.F[0] = next.R[0]; next.F[1] = next.R[1]; next.F[2] = next.R[2];
      next.R[0] = next.B[0]; next.R[1] = next.B[1]; next.R[2] = next.B[2];
      next.B[0] = next.L[0]; next.B[1] = next.L[1]; next.B[2] = next.L[2];
      next.L[0] = temp[0];   next.L[1] = temp[1];   next.L[2] = temp[2];
      break;
    }
    case "U'": {
      next.U = rotateFaceCCW(next.U);
      const temp = [next.F[0], next.F[1], next.F[2]];
      next.F[0] = next.L[0]; next.F[1] = next.L[1]; next.F[2] = next.L[2];
      next.L[0] = next.B[0]; next.L[1] = next.B[1]; next.L[2] = next.B[2];
      next.B[0] = next.R[0]; next.B[1] = next.R[1]; next.B[2] = next.R[2];
      next.R[0] = temp[0];   next.R[1] = temp[1];   next.R[2] = temp[2];
      break;
    }
    case 'U2': {
      return applyMove(applyMove(state, 'U'), 'U');
    }

    case 'D': {
      next.D = rotateFaceCW(next.D);
      const temp = [next.F[6], next.F[7], next.F[8]];
      next.F[6] = next.L[6]; next.F[7] = next.L[7]; next.F[8] = next.L[8];
      next.L[6] = next.B[6]; next.L[7] = next.B[7]; next.L[8] = next.B[8];
      next.B[6] = next.R[6]; next.B[7] = next.R[7]; next.B[8] = next.R[8];
      next.R[6] = temp[0];   next.R[7] = temp[1];   next.R[8] = temp[2];
      break;
    }
    case "D'": {
      next.D = rotateFaceCCW(next.D);
      const temp = [next.F[6], next.F[7], next.F[8]];
      next.F[6] = next.R[6]; next.F[7] = next.R[7]; next.F[8] = next.R[8];
      next.R[6] = next.B[6]; next.R[7] = next.B[7]; next.R[8] = next.B[8];
      next.B[6] = next.L[6]; next.B[7] = next.L[7]; next.B[8] = next.L[8];
      next.L[6] = temp[0];   next.L[7] = temp[1];   next.L[8] = temp[2];
      break;
    }
    case 'D2': {
      return applyMove(applyMove(state, 'D'), 'D');
    }

    case 'F': {
      next.F = rotateFaceCW(next.F);
      const tempU = [next.U[6], next.U[7], next.U[8]];
      // U6,7,8 <- L8,5,2
      next.U[6] = next.L[8]; next.U[7] = next.L[5]; next.U[8] = next.L[2];
      // L8,5,2 <- D2,1,0
      next.L[8] = next.D[2]; next.L[5] = next.D[1]; next.L[2] = next.D[0];
      // D2,1,0 <- R0,3,6
      next.D[2] = next.R[0]; next.D[1] = next.R[3]; next.D[0] = next.R[6];
      // R0,3,6 <- tempU (U6,7,8)
      next.R[0] = tempU[0];  next.R[3] = tempU[1];  next.R[6] = tempU[2];
      break;
    }
    case "F'": {
      next.F = rotateFaceCCW(next.F);
      const tempU = [next.U[6], next.U[7], next.U[8]];
      // U6,7,8 <- R0,3,6
      next.U[6] = next.R[0]; next.U[7] = next.R[3]; next.U[8] = next.R[6];
      // R0,3,6 <- D2,1,0
      next.R[0] = next.D[2]; next.R[3] = next.D[1]; next.R[6] = next.D[0];
      // D2,1,0 <- L8,5,2
      next.D[2] = next.L[8]; next.D[1] = next.L[5]; next.D[0] = next.L[2];
      // L8,5,2 <- tempU (U6,7,8)
      next.L[8] = tempU[0];  next.L[5] = tempU[1];  next.L[2] = tempU[2];
      break;
    }
    case 'F2': {
      return applyMove(applyMove(state, 'F'), 'F');
    }

    case 'B': {
      next.B = rotateFaceCW(next.B);
      const tempU = [next.U[0], next.U[1], next.U[2]];
      // U0,1,2 <- R2,5,8
      next.U[0] = next.R[2]; next.U[1] = next.R[5]; next.U[2] = next.R[8];
      // R2,5,8 <- D8,7,6
      next.R[2] = next.D[8]; next.R[5] = next.D[7]; next.R[8] = next.D[6];
      // D8,7,6 <- L6,3,0
      next.D[8] = next.L[6]; next.D[7] = next.L[3]; next.D[6] = next.L[0];
      // L6,3,0 <- tempU (U0,1,2)
      next.L[6] = tempU[0];  next.L[3] = tempU[1];  next.L[0] = tempU[2];
      break;
    }
    case "B'": {
      next.B = rotateFaceCCW(next.B);
      const tempU = [next.U[0], next.U[1], next.U[2]];
      // U0,1,2 <- L6,3,0
      next.U[0] = next.L[6]; next.U[1] = next.L[3]; next.U[2] = next.L[0];
      // L6,3,0 <- D8,7,6
      next.L[6] = next.D[8]; next.L[3] = next.D[7]; next.L[0] = next.D[6];
      // D8,7,6 <- R2,5,8
      next.D[8] = next.R[2]; next.D[7] = next.R[5]; next.D[6] = next.R[8];
      // R2,5,8 <- tempU (U0,1,2)
      next.R[2] = tempU[0];  next.R[5] = tempU[1];  next.R[8] = tempU[2];
      break;
    }
    case 'B2': {
      return applyMove(applyMove(state, 'B'), 'B');
    }

    case 'L': {
      next.L = rotateFaceCW(next.L);
      const tempU = [next.U[0], next.U[3], next.U[6]];
      // U0,3,6 <- B8,5,2
      next.U[0] = next.B[8]; next.U[3] = next.B[5]; next.U[6] = next.B[2];
      // B8,5,2 <- D0,3,6
      next.B[8] = next.D[0]; next.B[5] = next.D[3]; next.B[2] = next.D[6];
      // D0,3,6 <- F0,3,6
      next.D[0] = next.F[0]; next.D[3] = next.F[3]; next.D[6] = next.F[6];
      // F0,3,6 <- tempU (U0,3,6)
      next.F[0] = tempU[0];  next.F[3] = tempU[1];  next.F[6] = tempU[2];
      break;
    }
    case "L'": {
      next.L = rotateFaceCCW(next.L);
      const tempU = [next.U[0], next.U[3], next.U[6]];
      // U0,3,6 <- F0,3,6
      next.U[0] = next.F[0]; next.U[3] = next.F[3]; next.U[6] = next.F[6];
      // F0,3,6 <- D0,3,6
      next.F[0] = next.D[0]; next.F[3] = next.D[3]; next.F[6] = next.D[6];
      // D0,3,6 <- B8,5,2
      next.D[0] = next.B[8]; next.D[3] = next.B[5]; next.D[6] = next.B[2];
      // B8,5,2 <- tempU (U0,3,6)
      next.B[8] = tempU[0];  next.B[5] = tempU[1];  next.B[2] = tempU[2];
      break;
    }
    case 'L2': {
      return applyMove(applyMove(state, 'L'), 'L');
    }

    case 'R': {
      next.R = rotateFaceCW(next.R);
      const tempU = [next.U[2], next.U[5], next.U[8]];
      // U2,5,8 <- F2,5,8
      next.U[2] = next.F[2]; next.U[5] = next.F[5]; next.U[8] = next.F[8];
      // F2,5,8 <- D2,5,8
      next.F[2] = next.D[2]; next.F[5] = next.D[5]; next.F[8] = next.D[8];
      // D2,5,8 <- B6,3,0
      next.D[2] = next.B[6]; next.D[5] = next.B[3]; next.D[8] = next.B[0];
      // B6,3,0 <- tempU (U2,5,8)
      next.B[6] = tempU[0];  next.B[3] = tempU[1];  next.B[0] = tempU[2];
      break;
    }
    case "R'": {
      next.R = rotateFaceCCW(next.R);
      const tempU = [next.U[2], next.U[5], next.U[8]];
      // U2,5,8 <- B6,3,0
      next.U[2] = next.B[6]; next.U[5] = next.B[3]; next.U[8] = next.B[0];
      // B6,3,0 <- D2,5,8
      next.B[6] = next.D[2]; next.B[3] = next.D[5]; next.B[0] = next.D[8];
      // D2,5,8 <- F2,5,8
      next.D[2] = next.F[2]; next.D[5] = next.F[5]; next.D[8] = next.F[8];
      // F2,5,8 <- tempU (U2,5,8)
      next.F[2] = tempU[0];  next.F[5] = tempU[1];  next.F[8] = tempU[2];
      break;
    }
    case 'R2': {
      return applyMove(applyMove(state, 'R'), 'R');
    }
  }

  return next;
}

export function applyMoves(state: CubeState, moves: (StandardMove | string)[]): CubeState {
  let current = cloneCubeState(state);
  for (const move of moves) {
    if (isValidMove(move)) {
      current = applyMove(current, move);
    }
  }
  return current;
}

export function isValidMove(move: string): move is StandardMove {
  return /^[URFDLB]['2]?$/.test(move);
}

export function invertMove(move: StandardMove): StandardMove {
  if (move.endsWith('2')) return move;
  if (move.endsWith("'")) return move.slice(0, 1) as StandardMove;
  return `${move}'` as StandardMove;
}

export function invertMoves(moves: StandardMove[]): StandardMove[] {
  return [...moves].reverse().map(invertMove);
}

export function generateScramble(length = 20): StandardMove[] {
  const faces: FaceName[] = ['U', 'D', 'L', 'R', 'F', 'B'];
  const modifiers = ['', "'", '2'];
  const scramble: StandardMove[] = [];
  let lastFace: FaceName | null = null;
  let secondLastFace: FaceName | null = null;

  const oppositeFaces: Record<FaceName, FaceName> = {
    U: 'D', D: 'U',
    L: 'R', R: 'L',
    F: 'B', B: 'F'
  };

  while (scramble.length < length) {
    const face = faces[Math.floor(Math.random() * faces.length)];
    if (face === lastFace) continue;
    if (secondLastFace === face && oppositeFaces[face] === lastFace) continue;

    const mod = modifiers[Math.floor(Math.random() * modifiers.length)];
    scramble.push(`${face}${mod}` as StandardMove);
    secondLastFace = lastFace;
    lastFace = face;
  }

  return scramble;
}
