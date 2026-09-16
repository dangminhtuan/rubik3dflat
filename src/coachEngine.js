// Hệ thống Gia Sư Rubik 3D Thông Minh (LBL 7 Bước Chuẩn Sư Phạm)
// Giám sát toàn bộ 54 ô màu thời gian thực và giải quyết chính xác từng giai đoạn theo giáo trình quốc tế
import Cube from 'cubejs';

const ALL_MOVES = ['U', "U'", "U2", 'D', "D'", "D2", 'L', "L'", "L2", 'R', "R'", "R2", 'F', "F'", "F2", 'B', "B'", "B2"];

function invMove(m) {
  if (m.endsWith('2')) return m;
  if (m.endsWith("'")) return m[0];
  return m + "'";
}

function hasColors(stickers, c1, c2, c3) {
  return [...stickers].sort().join('') === [c1, c2, c3].sort().join('');
}

// ==========================================
// 1. STAGE CHECKERS
// ==========================================
export function isWhiteCross(s) {
  return s[28] === 'D' && s[25] === 'F' &&
         s[32] === 'D' && s[16] === 'R' &&
         s[34] === 'D' && s[52] === 'B' &&
         s[30] === 'D' && s[43] === 'L';
}

export function isLayer1(s) {
  if (!isWhiteCross(s)) return false;
  return s[27] === 'D' && s[29] === 'D' && s[33] === 'D' && s[35] === 'D' &&
         s[24] === 'F' && s[26] === 'F' &&
         s[15] === 'R' && s[17] === 'R' &&
         s[51] === 'B' && s[53] === 'B' &&
         s[42] === 'L' && s[44] === 'L';
}

export function isLayer2(s) {
  if (!isLayer1(s)) return false;
  return s[23] === 'F' && s[12] === 'R' &&
         s[21] === 'F' && s[41] === 'L' &&
         s[50] === 'B' && s[39] === 'L' &&
         s[48] === 'B' && s[14] === 'R';
}

export function isYellowCross(s) {
  if (!isLayer2(s)) return false;
  return s[1] === 'U' && s[3] === 'U' && s[5] === 'U' && s[7] === 'U';
}

export function isYellowEdges(s) {
  if (!isYellowCross(s)) return false;
  return s[19] === 'F' && s[10] === 'R' && s[46] === 'B' && s[37] === 'L';
}

export function isCornersPositioned(s) {
  if (!isYellowEdges(s)) return false;
  const cUFL = hasColors([s[6], s[18], s[38]], 'U', 'F', 'L');
  const cUFR = hasColors([s[8], s[20], s[9]], 'U', 'F', 'R');
  const cUBR = hasColors([s[2], s[45], s[11]], 'U', 'B', 'R');
  const cUBL = hasColors([s[0], s[47], s[36]], 'U', 'B', 'L');
  return cUFL && cUFR && cUBR && cUBL;
}

export function isFullySolved(s) {
  for (let i = 0; i < 9; i++) if (s[i] !== 'U') return false;
  for (let i = 9; i < 18; i++) if (s[i] !== 'R') return false;
  for (let i = 18; i < 27; i++) if (s[i] !== 'F') return false;
  for (let i = 27; i < 36; i++) if (s[i] !== 'D') return false;
  for (let i = 36; i < 45; i++) if (s[i] !== 'L') return false;
  for (let i = 45; i < 54; i++) if (s[i] !== 'B') return false;
  return true;
}

// ==========================================
// 2. STAGE 1 SOLVER: WHITE CROSS (BiBFS)
// ==========================================
const SLOTS_EDGES = [
  { name: 'UR', idx: [5, 10] }, { name: 'UF', idx: [7, 19] },
  { name: 'UL', idx: [3, 37] }, { name: 'UB', idx: [1, 46] },
  { name: 'DR', idx: [32, 16] }, { name: 'DF', idx: [28, 25] },
  { name: 'DL', idx: [30, 43] }, { name: 'DB', idx: [34, 52] },
  { name: 'FR', idx: [23, 12] }, { name: 'FL', idx: [21, 41] },
  { name: 'BL', idx: [50, 39] }, { name: 'BR', idx: [48, 14] }
];

function getCrossStateKey(s) {
  let kDF = '', kDR = '', kDB = '', kDL = '';
  for (let i = 0; i < 12; i++) {
    const slot = SLOTS_EDGES[i];
    const c1 = s[slot.idx[0]];
    const c2 = s[slot.idx[1]];
    if (c1 === 'D' && c2 === 'F') kDF = `${i}:0`;
    else if (c1 === 'F' && c2 === 'D') kDF = `${i}:1`;
    if (c1 === 'D' && c2 === 'R') kDR = `${i}:0`;
    else if (c1 === 'R' && c2 === 'D') kDR = `${i}:1`;
    if (c1 === 'D' && c2 === 'B') kDB = `${i}:0`;
    else if (c1 === 'B' && c2 === 'D') kDB = `${i}:1`;
    if (c1 === 'D' && c2 === 'L') kDL = `${i}:0`;
    else if (c1 === 'L' && c2 === 'D') kDL = `${i}:1`;
  }
  return `${kDF}|${kDR}|${kDB}|${kDL}`;
}

const SOLVED_CROSS_KEY = '5:0|4:0|7:0|6:0';
const backCrossMap = new Map();

function initCrossTable() {
  if (backCrossMap.size > 0) return;
  const backQ = [{ c: new Cube(), moves: [] }];
  backCrossMap.set(SOLVED_CROSS_KEY, []);

  let bHead = 0;
  while (bHead < backQ.length) {
    const { c, moves } = backQ[bHead++];
    if (moves.length >= 3) continue;
    const lastFace = moves.length > 0 ? moves[moves.length - 1][0] : null;
    for (const m of ALL_MOVES) {
      if (m[0] === lastFace) continue;
      const nextC = c.clone();
      nextC.move(m);
      const k = getCrossStateKey(nextC.asString());
      if (!backCrossMap.has(k)) {
        backCrossMap.set(k, [...moves, m]);
        backQ.push({ c: nextC, moves: [...moves, m] });
      }
    }
  }
}

function solveStage1Cross(cube) {
  initCrossTable();
  const initKey = getCrossStateKey(cube.asString());
  if (initKey === SOLVED_CROSS_KEY) return [];

  if (backCrossMap.has(initKey)) {
    const bMoves = backCrossMap.get(initKey);
    return [...bMoves].reverse().map(invMove);
  }

  const forwardQ = [{ c: cube.clone(), moves: [] }];
  const forwardSeen = new Set();
  forwardSeen.add(initKey);

  let fHead = 0;
  while (fHead < forwardQ.length) {
    const { c, moves } = forwardQ[fHead++];
    if (moves.length >= 4) continue;
    const lastFace = moves.length > 0 ? moves[moves.length - 1][0] : null;

    for (const m of ALL_MOVES) {
      if (m[0] === lastFace) continue;
      const nextC = c.clone();
      nextC.move(m);
      const k = getCrossStateKey(nextC.asString());

      if (k === SOLVED_CROSS_KEY) return [...moves, m];
      if (backCrossMap.has(k)) {
        const bMoves = backCrossMap.get(k);
        const bMovesInv = [...bMoves].reverse().map(invMove);
        return [...moves, m, ...bMovesInv];
      }

      if (!forwardSeen.has(k) && moves.length + 1 < 4) {
        forwardSeen.add(k);
        forwardQ.push({ c: nextC, moves: [...moves, m] });
      }
    }
  }
  return [];
}

// ==========================================
// 3. STAGE 2 SOLVER: WHITE CORNERS (Sexy Move)
// ==========================================
const CORNER_SLOTS = [
  { name: 'URF', idx: [8, 9, 20] },
  { name: 'UFL', idx: [6, 18, 38] },
  { name: 'ULB', idx: [0, 36, 47] },
  { name: 'UBR', idx: [2, 45, 11] },
  { name: 'DFR', idx: [29, 26, 15] },
  { name: 'DLF', idx: [27, 44, 24] },
  { name: 'DBL', idx: [33, 53, 42] },
  { name: 'DRB', idx: [35, 17, 51] }
];

function findCornerSlot(s, c1, c2, c3) {
  const target = [c1, c2, c3].sort().join('');
  for (const slot of CORNER_SLOTS) {
    const stickers = [s[slot.idx[0]], s[slot.idx[1]], s[slot.idx[2]]].sort().join('');
    if (stickers === target) return slot.name;
  }
  return null;
}

function isCornerSolved(s, cornerName) {
  if (cornerName === 'DFR') return s[29] === 'D' && s[26] === 'F' && s[15] === 'R';
  if (cornerName === 'DLF') return s[27] === 'D' && s[44] === 'L' && s[24] === 'F';
  if (cornerName === 'DBL') return s[33] === 'D' && s[53] === 'B' && s[42] === 'L';
  if (cornerName === 'DRB') return s[35] === 'D' && s[17] === 'R' && s[51] === 'B';
  return false;
}

function solveStage2Corners(cube) {
  const moves = [];
  const c = cube.clone();
  function apply(m) { moves.push(m); c.move(m); }
  function applySeq(seq) { for (const m of seq) apply(m); }

  const CORNER_DEFS = [
    {
      name: 'DFR', colors: ['D', 'F', 'R'],
      sexy: ["R", "U", "R'", "U'"],
      uTurns: { 'URF': '', 'UFL': "U'", 'ULB': 'U2', 'UBR': 'U' }
    },
    {
      name: 'DLF', colors: ['D', 'L', 'F'],
      sexy: ["F", "U", "F'", "U'"],
      uTurns: { 'UFL': '', 'ULB': "U'", 'UBR': 'U2', 'URF': 'U' }
    },
    {
      name: 'DBL', colors: ['D', 'B', 'L'],
      sexy: ["L", "U", "L'", "U'"],
      uTurns: { 'ULB': '', 'UBR': "U'", 'URF': 'U2', 'UFL': 'U' }
    },
    {
      name: 'DRB', colors: ['D', 'R', 'B'],
      sexy: ["B", "U", "B'", "U'"],
      uTurns: { 'UBR': '', 'URF': "U'", 'UFL': 'U2', 'ULB': 'U' }
    }
  ];

  for (const def of CORNER_DEFS) {
    let guard = 0;
    while (!isCornerSolved(c.asString(), def.name) && guard++ < 10) {
      const s = c.asString();
      const currentSlot = findCornerSlot(s, def.colors[0], def.colors[1], def.colors[2]);

      if (['URF', 'UFL', 'ULB', 'UBR'].includes(currentSlot)) {
        const uTurn = def.uTurns[currentSlot];
        if (uTurn) apply(uTurn);
        let sexyGuard = 0;
        while (!isCornerSolved(c.asString(), def.name) && sexyGuard++ < 6) {
          applySeq(def.sexy);
        }
        break;
      } else {
        if (currentSlot === 'DFR') applySeq(["R", "U", "R'", "U'"]);
        else if (currentSlot === 'DLF') applySeq(["F", "U", "F'", "U'"]);
        else if (currentSlot === 'DBL') applySeq(["L", "U", "L'", "U'"]);
        else if (currentSlot === 'DRB') applySeq(["B", "U", "B'", "U'"]);
      }
    }
  }
  return moves;
}

// ==========================================
// 4. STAGE 3 SOLVER: MIDDLE LAYER (F2L)
// ==========================================
const U_EDGES = [
  { name: 'UF', top: 7, side: 19, sideFace: 'F' },
  { name: 'UR', top: 5, side: 10, sideFace: 'R' },
  { name: 'UB', top: 1, side: 46, sideFace: 'B' },
  { name: 'UL', top: 3, side: 37, sideFace: 'L' }
];

const RIGHT_INSERT = {
  F: ["U", "R", "U'", "R'", "U'", "F'", "U", "F"],
  R: ["U", "B", "U'", "B'", "U'", "R'", "U", "R"],
  B: ["U", "L", "U'", "L'", "U'", "B'", "U", "B"],
  L: ["U", "F", "U'", "F'", "U'", "L'", "U", "L"]
};

const LEFT_INSERT = {
  F: ["U'", "L'", "U", "L", "U", "F", "U'", "F'"],
  R: ["U'", "F'", "U", "F", "U", "R", "U'", "R'"],
  B: ["U'", "R'", "U", "R", "U", "B", "U'", "B'"],
  L: ["U'", "B'", "U", "B", "U", "L", "U'", "L'"]
};

const NEXT_RIGHT = { F: 'R', R: 'B', B: 'L', L: 'F' };
const NEXT_LEFT = { F: 'L', L: 'B', B: 'R', R: 'F' };

function solveStage3F2L(cube) {
  const moves = [];
  const c = cube.clone();
  function apply(m) { moves.push(m); c.move(m); }
  function applySeq(seq) { for (const m of seq) apply(m); }

  const U_TO_FACE = {
    UF: { F: '', R: "U'", B: 'U2', L: 'U' },
    UR: { F: 'U', R: '', B: "U'", L: 'U2' },
    UB: { F: 'U2', R: 'U', B: '', L: "U'" },
    UL: { F: "U'", R: 'U2', B: 'U', L: '' }
  };

  let guard = 0;
  while (!isLayer2(c.asString()) && guard++ < 15) {
    const s = c.asString();
    let target = null;
    for (const ue of U_EDGES) {
      const topColor = s[ue.top];
      const sideColor = s[ue.side];
      if (topColor !== 'U' && sideColor !== 'U') {
        target = { slot: ue.name, topColor, sideColor };
        break;
      }
    }

    if (target) {
      const face = target.sideColor;
      const turn = U_TO_FACE[target.slot][face];
      if (turn) apply(turn);

      if (NEXT_RIGHT[face] === target.topColor) {
        applySeq(RIGHT_INSERT[face]);
      } else if (NEXT_LEFT[face] === target.topColor) {
        applySeq(LEFT_INSERT[face]);
      }
    } else {
      if (!(s[23] === 'F' && s[12] === 'R')) applySeq(RIGHT_INSERT['F']);
      else if (!(s[21] === 'F' && s[41] === 'L')) applySeq(LEFT_INSERT['F']);
      else if (!(s[48] === 'B' && s[14] === 'R')) applySeq(LEFT_INSERT['B']);
      else if (!(s[50] === 'B' && s[39] === 'L')) applySeq(RIGHT_INSERT['B']);
    }
  }
  return moves;
}

// ==========================================
// 5. STAGE 4 SOLVER: YELLOW CROSS
// ==========================================
function solveStage4Cross(cube) {
  const moves = [];
  const c = cube.clone();
  function apply(m) { moves.push(m); c.move(m); }
  function applySeq(seq) { for (const m of seq) apply(m); }

  let guard = 0;
  while (!isYellowCross(c.asString()) && guard++ < 4) {
    const s = c.asString();
    const edges = [s[1] === 'U', s[3] === 'U', s[5] === 'U', s[7] === 'U']; // UB, UL, UR, UF
    const yellowCount = edges.filter(Boolean).length;
    if (yellowCount === 4) break;

    // Dot
    if (yellowCount === 0) {
      applySeq(["F", "R", "U", "R'", "U'", "F'"]);
      continue;
    }

    // Line
    if (edges[1] && edges[2]) { // horizontal (UL & UR)
      applySeq(["F", "R", "U", "R'", "U'", "F'"]);
      continue;
    }
    if (edges[0] && edges[3]) { // vertical (UB & UF)
      apply('U');
      applySeq(["F", "R", "U", "R'", "U'", "F'"]);
      continue;
    }

    // Hook (L-shape)
    if (edges[0] && edges[1]) { // top-left (UB & UL)
      applySeq(["F", "U", "R", "U'", "R'", "F'"]);
      continue;
    }
    if (edges[0] && edges[2]) { // top-right
      apply("U'");
      applySeq(["F", "U", "R", "U'", "R'", "F'"]);
      continue;
    }
    if (edges[3] && edges[2]) { // bottom-right
      apply('U2');
      applySeq(["F", "U", "R", "U'", "R'", "F'"]);
      continue;
    }
    if (edges[3] && edges[1]) { // bottom-left
      apply('U');
      applySeq(["F", "U", "R", "U'", "R'", "F'"]);
      continue;
    }
  }
  return moves;
}

// ==========================================
// 6. STAGE 5 SOLVER: YELLOW EDGES (Sune)
// ==========================================
const SUNE_FACES = {
  F: ["R", "U", "R'", "U", "R", "U2", "R'", "U"],
  R: ["B", "U", "B'", "U", "B", "U2", "B'", "U"],
  B: ["L", "U", "L'", "U", "L", "U2", "L'", "U"],
  L: ["F", "U", "F'", "U", "F", "U2", "F'", "U"]
};

function solveStage5Edges(cube) {
  const moves = [];
  const c = cube.clone();
  function apply(m) { moves.push(m); c.move(m); }
  function applySeq(seq) { for (const m of seq) apply(m); }

  function getMatches(s) {
    const m = [];
    if (s[19] === 'F') m.push('F');
    if (s[10] === 'R') m.push('R');
    if (s[46] === 'B') m.push('B');
    if (s[37] === 'L') m.push('L');
    return m;
  }

  for (let loop = 0; loop < 5; loop++) {
    for (const u of ['', 'U', 'U2', "U'"]) {
      const testC = c.clone();
      if (u) testC.move(u);
      if (getMatches(testC.asString()).length === 4) {
        if (u) apply(u);
        return moves;
      }
    }

    let bestU = '';
    let bestMatches = [];
    for (const u of ['', 'U', 'U2', "U'"]) {
      const testC = c.clone();
      if (u) testC.move(u);
      const matches = getMatches(testC.asString());
      if (matches.length === 2) {
        bestU = u;
        bestMatches = matches;
        break;
      }
    }

    if (bestU) apply(bestU);

    if ((bestMatches.includes('F') && bestMatches.includes('B')) ||
        (bestMatches.includes('R') && bestMatches.includes('L'))) {
      applySeq(SUNE_FACES['F']);
      continue;
    }

    if (bestMatches.includes('B') && bestMatches.includes('R')) {
      applySeq(SUNE_FACES['F']);
    } else if (bestMatches.includes('B') && bestMatches.includes('L')) {
      applySeq(SUNE_FACES['R']);
    } else if (bestMatches.includes('F') && bestMatches.includes('L')) {
      applySeq(SUNE_FACES['B']);
    } else if (bestMatches.includes('F') && bestMatches.includes('R')) {
      applySeq(SUNE_FACES['L']);
    } else {
      applySeq(SUNE_FACES['F']);
    }
  }

  return moves;
}

// ==========================================
// 7. STAGE 6 SOLVER: YELLOW CORNERS (Niklas)
// ==========================================
function solveStage6Corners(cube) {
  const moves = [];
  const c = cube.clone();
  function apply(m) { moves.push(m); c.move(m); }
  function applySeq(seq) { for (const m of seq) apply(m); }

  const NIKLAS = ["U", "R", "U'", "L'", "U", "R'", "U'", "L"];

  function countCorrect(s) {
    const correct = [];
    if (hasColors([s[8], s[20], s[9]], 'U', 'F', 'R')) correct.push('UFR');
    if (hasColors([s[6], s[18], s[38]], 'U', 'F', 'L')) correct.push('UFL');
    if (hasColors([s[0], s[47], s[36]], 'U', 'B', 'L')) correct.push('UBL');
    if (hasColors([s[2], s[45], s[11]], 'U', 'B', 'R')) correct.push('UBR');
    return correct;
  }

  let guard = 0;
  while (!isCornersPositioned(c.asString()) && guard++ < 6) {
    const correct = countCorrect(c.asString());
    if (correct.length === 4) break;

    if (correct.length === 0) {
      applySeq(NIKLAS);
      continue;
    }

    if (correct.includes('UFR')) {
      applySeq(NIKLAS);
    } else if (correct.includes('UBR')) {
      apply("U'");
      applySeq(NIKLAS);
      apply('U');
    } else if (correct.includes('UBL')) {
      apply('U2');
      applySeq(NIKLAS);
      apply('U2');
    } else if (correct.includes('UFL')) {
      apply('U');
      applySeq(NIKLAS);
      apply("U'");
    }
  }
  return moves;
}

// ==========================================
// 8. STAGE 7 SOLVER: ORIENT CORNERS (R' D' R D)
// ==========================================
function solveStage7Orient(cube) {
  const moves = [];
  const c = cube.clone();
  function apply(m) { moves.push(m); c.move(m); }
  function applySeq(seq) { for (const m of seq) apply(m); }

  const RD = ["R'", "D'", "R", "D"];

  for (let i = 0; i < 4; i++) {
    let guard = 0;
    while (c.asString()[8] !== 'U' && guard++ < 6) {
      applySeq(RD);
    }
    apply('U');
  }

  for (const u of ['', 'U', 'U2', "U'"]) {
    const testC = c.clone();
    if (u) testC.move(u);
    if (isFullySolved(testC.asString())) {
      if (u) apply(u);
      break;
    }
  }
  return moves;
}

// ==========================================
// COACH ENGINE CLASS
// ==========================================
export class CoachEngine {
  constructor() {
    this.stageNames = {
      1: 'Dấu Cộng Trắng Đáy',
      2: '4 Góc Trắng Tầng 1',
      3: '4 Cạnh Tầng Giữa',
      4: 'Dấu Cộng Vàng Đỉnh',
      5: 'Khớp Màu Cạnh Vàng',
      6: 'Định Vị 4 Góc Đỉnh',
      7: 'Lật Góc Vàng Về Đích',
      8: '🎉 HOÀN THÀNH 6 MẶT!'
    };
    initCrossTable();
  }

  // Phân tích trạng thái 54 ô màu và sinh nước đi đúng chuẩn từng bước LBL
  analyze(state) {
    const s = state.cube.asString();

    // Kiểm tra hoàn thành 6 mặt
    if (state.isSolved() || isFullySolved(s)) {
      return {
        stage: 8,
        remainingCount: 0,
        badgeText: '🎉 HOÀN THÀNH',
        formulaTag: 'Hoàn Tất 6 Mặt',
        caseName: '6 Mặt Đã Hoàn Hảo',
        formula: '🎉 Xuất Sắc!',
        hint: 'Tuyệt vời! Toàn bộ khối Rubik đã về đích hoàn tất.',
        moves: [],
        isSolved: true,
        color: '#10b981'
      };
    }

    // 1. Bước 1: Dấu cộng trắng đáy (White Cross on D)
    if (!isWhiteCross(s)) {
      let correctEdges = 0;
      if (s[28] === 'D' && s[25] === 'F') correctEdges++;
      if (s[32] === 'D' && s[16] === 'R') correctEdges++;
      if (s[34] === 'D' && s[52] === 'B') correctEdges++;
      if (s[30] === 'D' && s[43] === 'L') correctEdges++;

      const stageMoves = solveStage1Cross(state.cube);

      return {
        stage: 1,
        remainingCount: stageMoves.length,
        badgeText: `🏁 BƯỚC 1/7`,
        formulaTag: 'Mẫu: Cạnh Trắng Đáy',
        formulaId: null,
        caseName: `Bước 1/7: Dấu Cộng Trắng Đáy (${correctEdges}/4 cạnh)`,
        formula: 'Hoa cúc 🌼 hoặc đưa trực tiếp về đáy D',
        hint: `Đưa 4 viên cạnh trắng về đáy D khớp màu với 4 tâm bên. Bấm [⏭ Xong Bước] để máy giải xong Dấu Cộng.`,
        moves: stageMoves,
        isSolved: false,
        color: '#38bdf8'
      };
    }

    // 2. Bước 2: 4 góc trắng tầng 1 (White Corners)
    if (!isLayer1(s)) {
      const stageMoves = solveStage2Corners(state.cube);

      return {
        stage: 2,
        remainingCount: stageMoves.length,
        badgeText: `🏁 BƯỚC 2/7`,
        formulaTag: "Mẫu: Sexy Move (R U R' U')",
        formulaId: 'sexy-move',
        caseName: `Bước 2/7: 4 Góc Trắng Tầng 1`,
        formula: "R U R' U' (Sexy Move)",
        hint: `Đưa góc trắng về phía trên khe đích rồi áp dụng R U R' U' từ 1-5 lần. Bấm [⏭ Xong Bước] để giải xong Tầng 1.`,
        moves: stageMoves,
        isSolved: false,
        color: '#38bdf8'
      };
    }

    // 3. Bước 3: 4 cạnh tầng giữa (Tầng 2 - F2L cơ bản)
    if (!isLayer2(s)) {
      const stageMoves = solveStage3F2L(state.cube);

      return {
        stage: 3,
        remainingCount: stageMoves.length,
        badgeText: `🏁 BƯỚC 3/7`,
        formulaTag: 'Mẫu: Ghép Cạnh Tầng 2',
        formulaId: 'f2l-right',
        caseName: `Bước 3/7: 4 Cạnh Tầng 2 (Giữa)`,
        formula: "Phải: U R U' R' U' F' U F | Trái: U' L' U L U F U' F'",
        hint: `Khớp màu cạnh tầng 3 với tâm trước, ghép sang phải hoặc trái. Bấm [⏭ Xong Bước] để giải xong Tầng 2.`,
        moves: stageMoves,
        isSolved: false,
        color: '#38bdf8'
      };
    }

    // 4. Bước 4: Dấu cộng vàng đỉnh (Yellow Cross on U)
    if (!isYellowCross(s)) {
      const yellowCount = [s[1], s[3], s[5], s[7]].filter(c => c === 'U').length;
      let caseDesc = 'Chấm Vàng';
      if (yellowCount === 2) {
        if ((s[1] === 'U' && s[7] === 'U') || (s[3] === 'U' && s[5] === 'U')) {
          caseDesc = 'Vạch Ngang';
        } else {
          caseDesc = 'Chữ L Ngược';
        }
      }

      const stageMoves = solveStage4Cross(state.cube);

      return {
        stage: 4,
        remainingCount: stageMoves.length,
        badgeText: `🏁 BƯỚC 4/7`,
        formulaTag: "Mẫu: Dấu Cộng Vàng (F R U R' U' F')",
        formulaId: 'yellow-cross',
        caseName: `Bước 4/7: Dấu Cộng Vàng (${caseDesc})`,
        formula: "F R U R' U' F'",
        hint: `Áp dụng công thức F R U R' U' F' để chuyển vạch ngang/chữ L thành dấu cộng vàng. Bấm [⏭ Xong Bước] để giải xong Dấu Cộng Vàng.`,
        moves: stageMoves,
        isSolved: false,
        color: '#38bdf8'
      };
    }

    // 5. Bước 5: Khớp màu 4 cạnh đỉnh với tâm mặt bên (Sune)
    if (!isYellowEdges(s)) {
      const stageMoves = solveStage5Edges(state.cube);

      return {
        stage: 5,
        remainingCount: stageMoves.length,
        badgeText: `🏁 BƯỚC 5/7`,
        formulaTag: 'Mẫu: Sune Khớp Cạnh',
        formulaId: 'sune',
        caseName: `Bước 5/7: Khớp Màu Cạnh Đỉnh (Sune)`,
        formula: "R U R' U R U2 R' U",
        hint: `Xoay U tìm 2 cạnh khớp màu tâm, để ở sau-phải rồi dùng Sune. Bấm [⏭ Xong Bước] để khớp 4 cạnh đỉnh.`,
        moves: stageMoves,
        isSolved: false,
        color: '#38bdf8'
      };
    }

    // 6. Bước 6: Định vị 4 góc đỉnh (Niklas)
    if (!isCornersPositioned(s)) {
      const stageMoves = solveStage6Corners(state.cube);

      return {
        stage: 6,
        remainingCount: stageMoves.length,
        badgeText: `🏁 BƯỚC 6/7`,
        formulaTag: 'Mẫu: Niklas Định Vị Góc',
        formulaId: 'niklas',
        caseName: `Bước 6/7: Định Vị 4 Góc Đỉnh (Niklas)`,
        formula: "U R U' L' U R' U' L",
        hint: `Tìm 1 góc đúng, để ở trước-phải rồi dùng Niklas để hoán vị 3 góc còn lại. Bấm [⏭ Xong Bước] để định vị 4 góc.`,
        moves: stageMoves,
        isSolved: false,
        color: '#38bdf8'
      };
    }

    // 7. Bước 7: Lật góc vàng về đích (R' D' R D)
    const stageMoves = solveStage7Orient(state.cube);

    return {
      stage: 7,
      remainingCount: stageMoves.length,
      badgeText: `🏁 BƯỚC 7/7`,
      formulaTag: "Mẫu: Lật Góc Vàng (R' D' R D)",
      formulaId: 'orient-corner',
      caseName: `Bước 7/7: Lật Góc Vàng Về Đích`,
      formula: "R' D' R D (lặp lại cho từng góc)",
      hint: `Đặt góc chưa xong ở trước-phải, xoay R' D' R D đến khi vàng ngửa lên. Bấm [⏭ Xong Bước] để hoàn tất 6 mặt.`,
      moves: stageMoves,
      isSolved: false,
      color: '#38bdf8'
    };
  }

  // Đảo ngược chuỗi nước đi phục vụ tính năng Hoàn Tác (Undo)
  invertMoves(moves) {
    if (!moves || moves.length === 0) return [];
    const inv = [];
    for (let i = moves.length - 1; i >= 0; i--) {
      inv.push(invMove(moves[i]));
    }
    return inv;
  }
}
