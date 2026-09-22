declare module 'cubejs' {
  export interface CubeInstance {
    solve(): string;
    isSolved(): boolean;
    move(algorithm: string): void;
    asString(): string;
  }
  const Cube: {
    new (): CubeInstance;
    initSolver(): void;
    fromString(str: string): CubeInstance;
    random(): CubeInstance;
  };
  export default Cube;
}
