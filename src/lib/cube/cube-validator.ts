import { CubeColor, CubeState, FaceName, ValidationResult, COLOR_NAME_MAP, FACE_FULL_NAMES, FACE_NAMES } from '@/types/cube';

export function validateCubeState(state: CubeState): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const counts: Record<CubeColor, number> = {
    white: 0,
    yellow: 0,
    green: 0,
    blue: 0,
    red: 0,
    orange: 0,
  };

  // 1. Check sticker counts
  for (const face of FACE_NAMES) {
    for (let i = 0; i < 9; i++) {
      const color = state[face][i];
      if (color && counts[color] !== undefined) {
        counts[color]++;
      }
    }
  }

  const allColors: CubeColor[] = ['white', 'yellow', 'green', 'blue', 'red', 'orange'];
  const incorrectCounts = allColors.filter(c => counts[c] !== 9);

  if (incorrectCounts.length > 0) {
    const detail = incorrectCounts.map(c => `${COLOR_NAME_MAP[c]}: ${counts[c]}/9`).join(', ');
    errors.push(`Sticker count mismatch (${detail}). Every color must have exactly 9 stickers.`);
  }

  // 2. Center pieces validation
  const centerColors = new Set<CubeColor>();
  for (const face of FACE_NAMES) {
    const c = state[face][4];
    if (centerColors.has(c)) {
      errors.push(`Duplicate center color detected for ${COLOR_NAME_MAP[c]}. Center pieces define face orientation.`);
    }
    centerColors.add(c);
  }

  if (centerColors.size !== 6) {
    errors.push(`The 6 center stickers must all be different colors.`);
  }

  // 3. Check opposite centers if standard
  const centerMap: Record<FaceName, CubeColor> = {
    U: state.U[4],
    R: state.R[4],
    F: state.F[4],
    D: state.D[4],
    L: state.L[4],
    B: state.B[4],
  };

  // If counts are correct and centers are unique, let's check edge and corner legality
  if (errors.length === 0) {
    const pieceValidation = validatePiecesAndParity(state, centerMap);
    errors.push(...pieceValidation.errors);
    warnings.push(...pieceValidation.warnings);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    colorCounts: counts,
  };
}

// 12 edges on 3x3
// Edge slots: [Face1, index1, Face2, index2]
const EDGE_SLOTS: [FaceName, number, FaceName, number][] = [
  ['U', 1, 'B', 1], // UB
  ['U', 5, 'R', 1], // UR
  ['U', 7, 'F', 1], // UF
  ['U', 3, 'L', 1], // UL
  ['D', 1, 'F', 7], // DF
  ['D', 5, 'R', 7], // DR
  ['D', 7, 'B', 7], // DB
  ['D', 3, 'L', 7], // DL
  ['F', 5, 'R', 3], // FR
  ['F', 3, 'L', 5], // FL
  ['B', 3, 'R', 5], // BR
  ['B', 5, 'L', 3], // BL
];

// 8 corners on 3x3
// Corner slots: [Face1, index1, Face2, index2, Face3, index3]
const CORNER_SLOTS: [FaceName, number, FaceName, number, FaceName, number][] = [
  ['U', 8, 'R', 0, 'F', 2], // URF
  ['U', 6, 'F', 0, 'L', 2], // UFL
  ['U', 0, 'L', 0, 'B', 2], // ULB
  ['U', 2, 'B', 0, 'R', 2], // UBR
  ['D', 2, 'F', 8, 'R', 6], // DFR
  ['D', 0, 'L', 8, 'F', 6], // DLF
  ['D', 6, 'B', 8, 'L', 6], // DBL
  ['D', 8, 'R', 8, 'B', 6], // DRB
];

function validatePiecesAndParity(
  state: CubeState,
  centerMap: Record<FaceName, CubeColor>
): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Color to face mapping
  const colorToFace = new Map<CubeColor, FaceName>();
  for (const face of FACE_NAMES) {
    colorToFace.set(centerMap[face], face);
  }

  // Edge orientation & duplicate check
  const seenEdges = new Set<string>();
  let totalEdgeFlip = 0;

  for (const [f1, i1, f2, i2] of EDGE_SLOTS) {
    const c1 = state[f1][i1];
    const c2 = state[f2][i2];
    const face1 = colorToFace.get(c1);
    const face2 = colorToFace.get(c2);

    if (!face1 || !face2 || face1 === face2) {
      errors.push(`Invalid edge sticker pairing at ${f1}/${f2}`);
      continue;
    }

    const edgeKey = [face1, face2].sort().join('-');
    if (seenEdges.has(edgeKey)) {
      errors.push(`Duplicate edge piece detected: ${COLOR_NAME_MAP[c1]}-${COLOR_NAME_MAP[c2]}`);
    }
    seenEdges.add(edgeKey);

    // Orientation: if edge has U or D color, it's oriented if that color is on U/D (or F/B if in E-layer)
    const uColor = centerMap.U;
    const dColor = centerMap.D;
    const fColor = centerMap.F;
    const bColor = centerMap.B;

    let flip = 0;
    if (c1 === uColor || c1 === dColor) {
      flip = (f1 === 'U' || f1 === 'D') ? 0 : 1;
    } else if (c2 === uColor || c2 === dColor) {
      flip = (f2 === 'U' || f2 === 'D') ? 0 : 1;
    } else if (c1 === fColor || c1 === bColor) {
      flip = (f1 === 'F' || f1 === 'B') ? 0 : 1;
    } else if (c2 === fColor || c2 === bColor) {
      flip = (f2 === 'F' || f2 === 'B') ? 0 : 1;
    }
    totalEdgeFlip += flip;
  }

  if (totalEdgeFlip % 2 !== 0) {
    errors.push('Edge parity error: Exactly one edge is flipped. An edge flip alone is impossible on a standard cube.');
  }

  // Corner orientation & duplicate check
  const seenCorners = new Set<string>();
  let totalCornerTwist = 0;

  for (const [f1, i1, f2, i2, f3, i3] of CORNER_SLOTS) {
    const c1 = state[f1][i1];
    const c2 = state[f2][i2];
    const c3 = state[f3][i3];
    const face1 = colorToFace.get(c1);
    const face2 = colorToFace.get(c2);
    const face3 = colorToFace.get(c3);

    if (!face1 || !face2 || !face3 || new Set([face1, face2, face3]).size !== 3) {
      errors.push(`Invalid corner piece found at ${f1}/${f2}/${f3}`);
      continue;
    }

    const cornerKey = [face1, face2, face3].sort().join('-');
    if (seenCorners.has(cornerKey)) {
      errors.push(`Duplicate corner piece detected: ${COLOR_NAME_MAP[c1]}-${COLOR_NAME_MAP[c2]}-${COLOR_NAME_MAP[c3]}`);
    }
    seenCorners.add(cornerKey);

    // Orientation: 0 if U/D color is on U/D face, 1 if clockwise twist, 2 if CCW twist
    const uColor = centerMap.U;
    const dColor = centerMap.D;
    let twist = 0;
    if (c1 === uColor || c1 === dColor) twist = 0;
    else if (c2 === uColor || c2 === dColor) twist = 1;
    else if (c3 === uColor || c3 === dColor) twist = 2;

    totalCornerTwist += twist;
  }

  if (totalCornerTwist % 3 !== 0) {
    errors.push('Corner twist parity error: A single corner is twisted. Please check corner orientations.');
  }

  return { errors, warnings };
}
