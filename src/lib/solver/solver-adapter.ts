import { CubeState, StandardMove, SolveStep, FaceName } from '@/types/cube';
import { isCubeSolved } from '@/lib/cube/cube-state';
import { parseMovesToSteps } from '@/lib/cube/cube-notation';
import { validateCubeState } from '@/lib/cube/cube-validator';

let solverInitialized = false;
let CubeLib: typeof import('cubejs').default | null = null;

async function getCubeSolver() {
  if (!CubeLib) {
    // Dynamic import for client side SSR safety
    const mod = await import('cubejs');
    CubeLib = mod.default || mod;
  }
  if (!solverInitialized && CubeLib && CubeLib.initSolver) {
    try {
      CubeLib.initSolver();
      solverInitialized = true;
    } catch (e) {
      console.warn('Cube solver init error:', e);
    }
  }
  return CubeLib;
}

export function cubeStateToFaceletString(state: CubeState): string {
  const centerMap: Record<string, FaceName> = {
    [state.U[4]]: 'U',
    [state.R[4]]: 'R',
    [state.F[4]]: 'F',
    [state.D[4]]: 'D',
    [state.L[4]]: 'L',
    [state.B[4]]: 'B',
  };

  const faces: FaceName[] = ['U', 'R', 'F', 'D', 'L', 'B'];
  let result = '';

  for (const face of faces) {
    for (let i = 0; i < 9; i++) {
      const color = state[face][i];
      const mappedFace = centerMap[color];
      result += mappedFace || 'U';
    }
  }

  return result;
}

export interface SolveResult {
  success: boolean;
  moves: StandardMove[];
  steps: SolveStep[];
  moveCount: number;
  notationString: string;
  error?: string;
}

export async function solveCube(state: CubeState): Promise<SolveResult> {
  // Check if already solved
  if (isCubeSolved(state)) {
    return {
      success: true,
      moves: [],
      steps: [],
      moveCount: 0,
      notationString: '',
    };
  }

  // Validate state
  const validation = validateCubeState(state);
  if (!validation.isValid) {
    return {
      success: false,
      moves: [],
      steps: [],
      moveCount: 0,
      notationString: '',
      error: validation.errors.join(' | '),
    };
  }

  try {
    const Cube = await getCubeSolver();
    const faceletStr = cubeStateToFaceletString(state);
    const cubeInstance = Cube.fromString(faceletStr);

    const solutionString = cubeInstance.solve();

    if (!solutionString || solutionString.trim() === '') {
      return {
        success: true,
        moves: [],
        steps: [],
        moveCount: 0,
        notationString: '',
      };
    }

    const rawMoves = solutionString.trim().split(/\s+/);
    const validMoves: StandardMove[] = rawMoves.filter((m: string) => /^[URFDLB]['2]?$/.test(m)) as StandardMove[];
    const steps = parseMovesToSteps(validMoves);

    return {
      success: true,
      moves: validMoves,
      steps,
      moveCount: validMoves.length,
      notationString: validMoves.join(' '),
    };
  } catch (err: unknown) {
    console.error('Solve error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Failed to calculate solution. Please check your cube configuration.';
    return {
      success: false,
      moves: [],
      steps: [],
      moveCount: 0,
      notationString: '',
      error: errorMessage,
    };
  }
}
