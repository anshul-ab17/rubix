import { FaceName, StandardMove, SolveStep } from '@/types/cube';

export interface MoveDescription {
  notation: StandardMove;
  name: string;
  face: FaceName;
  direction: 'clockwise' | 'counterclockwise' | 'double';
  quarterTurns: number;
  description: string;
  handHint: string;
  cameraFocusFace: FaceName;
}

export const MOVE_DESCRIPTIONS: Record<StandardMove, MoveDescription> = {
  U: {
    notation: 'U',
    name: 'Up (Clockwise)',
    face: 'U',
    direction: 'clockwise',
    quarterTurns: 1,
    description: 'Turn the top (Up) layer clockwise by 90° (quarter turn to the left when looking down).',
    handHint: 'Flick the top-right corner with your right index finger towards you.',
    cameraFocusFace: 'U',
  },
  "U'": {
    notation: "U'",
    name: 'Up Prime (Counter-Clockwise)',
    face: 'U',
    direction: 'counterclockwise',
    quarterTurns: 1,
    description: 'Turn the top (Up) layer counter-clockwise by 90° (quarter turn to the right when looking down).',
    handHint: 'Flick the top-left corner with your left index finger towards you.',
    cameraFocusFace: 'U',
  },
  U2: {
    notation: 'U2',
    name: 'Up Double Turn',
    face: 'U',
    direction: 'double',
    quarterTurns: 2,
    description: 'Turn the top (Up) layer by 180° (two quarter turns).',
    handHint: 'Double flick using your right index and middle fingers.',
    cameraFocusFace: 'U',
  },
  D: {
    notation: 'D',
    name: 'Down (Clockwise)',
    face: 'D',
    direction: 'clockwise',
    quarterTurns: 1,
    description: 'Turn the bottom (Down) layer clockwise by 90° (as seen looking directly at the bottom).',
    handHint: 'Push the bottom layer with your left ring finger.',
    cameraFocusFace: 'D',
  },
  "D'": {
    notation: "D'",
    name: 'Down Prime (Counter-Clockwise)',
    face: 'D',
    direction: 'counterclockwise',
    quarterTurns: 1,
    description: 'Turn the bottom (Down) layer counter-clockwise by 90° (as seen looking directly at the bottom).',
    handHint: 'Push the bottom layer with your right ring finger.',
    cameraFocusFace: 'D',
  },
  D2: {
    notation: 'D2',
    name: 'Down Double Turn',
    face: 'D',
    direction: 'double',
    quarterTurns: 2,
    description: 'Turn the bottom (Down) layer by 180°.',
    handHint: 'Double flick the bottom layer with your ring and pinky fingers.',
    cameraFocusFace: 'D',
  },
  R: {
    notation: 'R',
    name: 'Right (Clockwise)',
    face: 'R',
    direction: 'clockwise',
    quarterTurns: 1,
    description: 'Turn the Right face clockwise by 90° (rotate the right layer upwards away from you).',
    handHint: 'Grip the right face and push upwards with your right wrist/fingers.',
    cameraFocusFace: 'R',
  },
  "R'": {
    notation: "R'",
    name: 'Right Prime (Counter-Clockwise)',
    face: 'R',
    direction: 'counterclockwise',
    quarterTurns: 1,
    description: 'Turn the Right face counter-clockwise by 90° (rotate the right layer downwards towards you).',
    handHint: 'Pull the right face downwards with your right thumb/wrist.',
    cameraFocusFace: 'R',
  },
  R2: {
    notation: 'R2',
    name: 'Right Double Turn',
    face: 'R',
    direction: 'double',
    quarterTurns: 2,
    description: 'Turn the Right face by 180° (two quarter turns).',
    handHint: 'Roll the right layer a full half turn with your right hand.',
    cameraFocusFace: 'R',
  },
  L: {
    notation: 'L',
    name: 'Left (Clockwise)',
    face: 'L',
    direction: 'clockwise',
    quarterTurns: 1,
    description: 'Turn the Left face clockwise by 90° (rotate the left layer downwards towards you).',
    handHint: 'Pull the left face downwards with your left hand.',
    cameraFocusFace: 'L',
  },
  "L'": {
    notation: "L'",
    name: 'Left Prime (Counter-Clockwise)',
    face: 'L',
    direction: 'counterclockwise',
    quarterTurns: 1,
    description: 'Turn the Left face counter-clockwise by 90° (rotate the left layer upwards away from you).',
    handHint: 'Push the left face upwards with your left hand.',
    cameraFocusFace: 'L',
  },
  L2: {
    notation: 'L2',
    name: 'Left Double Turn',
    face: 'L',
    direction: 'double',
    quarterTurns: 2,
    description: 'Turn the Left face by 180° (two quarter turns).',
    handHint: 'Roll the left layer a full half turn with your left hand.',
    cameraFocusFace: 'L',
  },
  F: {
    notation: 'F',
    name: 'Front (Clockwise)',
    face: 'F',
    direction: 'clockwise',
    quarterTurns: 1,
    description: 'Turn the Front face clockwise by 90° (like turning a clock face to the right).',
    handHint: 'Push the top edge of the front face to the right with your right index finger.',
    cameraFocusFace: 'F',
  },
  "F'": {
    notation: "F'",
    name: 'Front Prime (Counter-Clockwise)',
    face: 'F',
    direction: 'counterclockwise',
    quarterTurns: 1,
    description: 'Turn the Front face counter-clockwise by 90° (like turning a clock face to the left).',
    handHint: 'Push the top edge of the front face to the left with your left index finger.',
    cameraFocusFace: 'F',
  },
  F2: {
    notation: 'F2',
    name: 'Front Double Turn',
    face: 'F',
    direction: 'double',
    quarterTurns: 2,
    description: 'Turn the Front face by 180°.',
    handHint: 'Rotate the front face a full half turn.',
    cameraFocusFace: 'F',
  },
  B: {
    notation: 'B',
    name: 'Back (Clockwise)',
    face: 'B',
    direction: 'clockwise',
    quarterTurns: 1,
    description: 'Turn the Back face clockwise by 90° (as seen looking directly at the back).',
    handHint: 'Push the back layer using your left or right ring finger.',
    cameraFocusFace: 'B',
  },
  "B'": {
    notation: "B'",
    name: 'Back Prime (Counter-Clockwise)',
    face: 'B',
    direction: 'counterclockwise',
    quarterTurns: 1,
    description: 'Turn the Back face counter-clockwise by 90° (as seen looking directly at the back).',
    handHint: 'Pull the back layer with your right index/ring finger.',
    cameraFocusFace: 'B',
  },
  B2: {
    notation: 'B2',
    name: 'Back Double Turn',
    face: 'B',
    direction: 'double',
    quarterTurns: 2,
    description: 'Turn the Back face by 180°.',
    handHint: 'Rotate the back face two quarter turns.',
    cameraFocusFace: 'B',
  },
};

export function parseMoveToStep(move: StandardMove, index: number): SolveStep {
  const desc = MOVE_DESCRIPTIONS[move];
  return {
    index,
    move,
    face: desc.face,
    direction: desc.direction,
    quarterTurns: desc.quarterTurns,
    notation: desc.notation,
    description: desc.description,
    handHint: desc.handHint,
    cameraFocusFace: desc.cameraFocusFace,
  };
}

export function parseMovesToSteps(moves: StandardMove[]): SolveStep[] {
  return moves.map((m, i) => parseMoveToStep(m, i));
}
