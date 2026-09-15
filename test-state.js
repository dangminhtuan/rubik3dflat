import { RubikState } from './src/rubikState.js';

const state = new RubikState();
console.log('Initial solved?', state.isSolved());

// Test 1: Each move applied 4 times should return to solved state
const moves = ['U', 'D', 'L', 'R', 'F', 'B'];
for (const m of moves) {
  for (let i = 0; i < 4; i++) state.applyMove(m);
  if (!state.isSolved()) {
    console.error(`FAILED: 4x ${m} did not return to solved!`);
    console.log(state.faces);
    process.exit(1);
  }
}
console.log('Test 1 Passed: 4x single moves return to solved state.');

// Test 2: Move and its prime should cancel
for (const m of moves) {
  state.applyMove(m);
  state.applyMove(m + "'");
  if (!state.isSolved()) {
    console.error(`FAILED: ${m} + ${m}' did not return to solved!`);
    process.exit(1);
  }
}
console.log('Test 2 Passed: Move and prime cancel out.');

// Test 3: Sexy Move (R U R' U') x 6 returns to solved
for (let i = 0; i < 6; i++) {
  state.applyMove('R');
  state.applyMove('U');
  state.applyMove("R'");
  state.applyMove("U'");
}
if (!state.isSolved()) {
  console.error('FAILED: 6x Sexy Move did not return to solved state!');
  process.exit(1);
}
console.log('Test 3 Passed: 6x (R U R\' U\') returns to solved state!');
console.log('ALL MATHEMATICAL CHECKS PASSED PERFECTLY!');
