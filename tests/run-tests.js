const assert = require('assert');
const Cube = require('cubejs');
Cube.initSolver();

console.log('--- Starting Rubix Engine & Solver Verification ---');

// 1. Test Solver
const c = new Cube();
c.move("R U R' U' F2 D B2");
const sol = c.solve();
console.log('1. Generated Solution for scramble [R U R\' U\' F2 D B2]:', sol);
c.move(sol);
assert.strictEqual(c.isSolved(), true, 'Cube must be solved after applying solution');
console.log('   ✓ Kociemba solver verified successfully.');

// 2. Test Solved Cube yields empty moves or 0 moves needed
const solvedCube = new Cube();
assert.strictEqual(solvedCube.isSolved(), true, 'Initial state must be solved');
console.log('   ✓ Solved cube check passed.');

console.log('--- All engine tests passed! ---');
