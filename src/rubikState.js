// Hệ thống quản lý trạng thái Rubik 3x3 chuẩn WCA
// 6 mặt: U (Trắng), D (Vàng), F (Cyan), B (Xanh lá), L (Magenta), R (Xanh dương)
import Cube from 'cubejs';

export const FACE_COLORS = {
  U: '#FACC15', // Vàng (Top)
  D: '#FFFFFF', // Trắng (Bottom)
  F: '#06B6D4', // Cyan (Front-Left)
  B: '#22C55E', // Xanh Lá (Back-Right)
  L: '#E11D48', // Magenta (Back-Left)
  R: '#2563EB', // Xanh Dương (Front-Right)
};

export const FACE_NAMES = {
  U: 'Trên (U - Vàng)',
  D: 'Dưới (D - Trắng)',
  F: 'Trước (F - Cyan)',
  B: 'Sau (B - Xanh Lá)',
  L: 'Trái (L - Magenta)',
  R: 'Phải (R - Xanh Dương)'
};

let solverInitialized = false;
export function initCubeSolver() {
  if (!solverInitialized) {
    try {
      Cube.initSolver();
      solverInitialized = true;
    } catch (e) {
      console.warn('Cube initSolver error:', e);
    }
  }
}

export class RubikState {
  constructor() {
    initCubeSolver();
    this.reset();
  }

  reset() {
    this.cube = new Cube();
    this.faces = {
      U: Array(9).fill('U'),
      D: Array(9).fill('D'),
      F: Array(9).fill('F'),
      B: Array(9).fill('B'),
      L: Array(9).fill('L'),
      R: Array(9).fill('R'),
    };
    this.moveHistory = [];
    this._syncFaces();
  }

  _syncFaces() {
    const s = this.cube.asString();
    this.faces.U = s.slice(0, 9).split('');
    this.faces.R = s.slice(9, 18).split('');
    this.faces.F = s.slice(18, 27).split('');
    this.faces.D = s.slice(27, 36).split('');
    this.faces.L = s.slice(36, 45).split('');
    this.faces.B = s.slice(45, 54).split('');
  }

  clone() {
    const copy = new RubikState();
    copy.cube = this.cube.clone();
    copy._syncFaces();
    copy.moveHistory = [...this.moveHistory];
    return copy;
  }

  applyMove(move, record = true) {
    this.cube.move(move);
    this._syncFaces();
    if (record) {
      this.moveHistory.push(move);
    }
  }

  isSolved() {
    return this.cube.asString() === 'UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB';
  }

  solve() {
    if (this.isSolved()) return [];
    try {
      initCubeSolver();
      const sol = this.cube.solve();
      if (!sol || sol.trim() === '') return [];
      return sol.trim().split(/\s+/);
    } catch (e) {
      console.error('RubikState solve error:', e);
      return [];
    }
  }

  generateScramble(length = 20) {
    const faces = ['U', 'D', 'L', 'R', 'F', 'B'];
    const modifiers = ['', "'", '2'];
    const moves = [];
    let lastFace = '';

    while (moves.length < length) {
      const face = faces[Math.floor(Math.random() * faces.length)];
      if (face === lastFace) continue;
      lastFace = face;
      const mod = modifiers[Math.floor(Math.random() * modifiers.length)];
      moves.push(face + mod);
    }
    return moves;
  }
}
