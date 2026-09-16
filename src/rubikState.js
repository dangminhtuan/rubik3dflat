// Hệ thống quản lý trạng thái Rubik 3x3 chuẩn WCA
// 6 mặt: U (Trắng), D (Vàng), F (Xanh lá), B (Xanh dương), L (Cam), R (Đỏ)

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

export class RubikState {
  constructor() {
    this.reset();
  }

  reset() {
    // Mỗi mặt gồm 9 ô: 0 1 2 / 3 4 5 / 6 7 8
    this.faces = {
      U: Array(9).fill('U'),
      D: Array(9).fill('D'),
      F: Array(9).fill('F'),
      B: Array(9).fill('B'),
      L: Array(9).fill('L'),
      R: Array(9).fill('R'),
    };
    this.moveHistory = [];
  }

  clone() {
    const copy = new RubikState();
    copy.faces = {
      U: [...this.faces.U],
      D: [...this.faces.D],
      F: [...this.faces.F],
      B: [...this.faces.B],
      L: [...this.faces.L],
      R: [...this.faces.R],
    };
    copy.moveHistory = [...this.moveHistory];
    return copy;
  }

  // Xoay 1 mặt 90 độ theo chiều kim đồng hồ
  _rotateCW(face) {
    const f = this.faces[face];
    this.faces[face] = [
      f[6], f[3], f[0],
      f[7], f[4], f[1],
      f[8], f[5], f[2]
    ];
  }

  // Xoay 1 mặt 90 độ ngược chiều kim đồng hồ
  _rotateCCW(face) {
    const f = this.faces[face];
    this.faces[face] = [
      f[2], f[5], f[8],
      f[1], f[4], f[7],
      f[0], f[3], f[6]
    ];
  }

  applyMove(move, record = true) {
    switch (move) {
      case 'U':
        this._rotateCW('U');
        {
          const temp = [this.faces.F[0], this.faces.F[1], this.faces.F[2]];
          this.faces.F[0] = this.faces.R[0];
          this.faces.F[1] = this.faces.R[1];
          this.faces.F[2] = this.faces.R[2];

          this.faces.R[0] = this.faces.B[0];
          this.faces.R[1] = this.faces.B[1];
          this.faces.R[2] = this.faces.B[2];

          this.faces.B[0] = this.faces.L[0];
          this.faces.B[1] = this.faces.L[1];
          this.faces.B[2] = this.faces.L[2];

          this.faces.L[0] = temp[0];
          this.faces.L[1] = temp[1];
          this.faces.L[2] = temp[2];
        }
        break;

      case "U'":
      case 'Ui':
        this.applyMove('U', false);
        this.applyMove('U', false);
        this.applyMove('U', false);
        break;

      case 'U2':
        this.applyMove('U', false);
        this.applyMove('U', false);
        break;

      case 'D':
        this._rotateCW('D');
        {
          const temp = [this.faces.F[6], this.faces.F[7], this.faces.F[8]];
          this.faces.F[6] = this.faces.L[6];
          this.faces.F[7] = this.faces.L[7];
          this.faces.F[8] = this.faces.L[8];

          this.faces.L[6] = this.faces.B[6];
          this.faces.L[7] = this.faces.B[7];
          this.faces.L[8] = this.faces.B[8];

          this.faces.B[6] = this.faces.R[6];
          this.faces.B[7] = this.faces.R[7];
          this.faces.B[8] = this.faces.R[8];

          this.faces.R[6] = temp[0];
          this.faces.R[7] = temp[1];
          this.faces.R[8] = temp[2];
        }
        break;

      case "D'":
      case 'Di':
        this.applyMove('D', false);
        this.applyMove('D', false);
        this.applyMove('D', false);
        break;

      case 'D2':
        this.applyMove('D', false);
        this.applyMove('D', false);
        break;

      case 'R':
        this._rotateCW('R');
        {
          const temp = [this.faces.U[2], this.faces.U[5], this.faces.U[8]];
          this.faces.U[2] = this.faces.F[2];
          this.faces.U[5] = this.faces.F[5];
          this.faces.U[8] = this.faces.F[8];

          this.faces.F[2] = this.faces.D[2];
          this.faces.F[5] = this.faces.D[5];
          this.faces.F[8] = this.faces.D[8];

          this.faces.D[2] = this.faces.B[6];
          this.faces.D[5] = this.faces.B[3];
          this.faces.D[8] = this.faces.B[0];

          this.faces.B[6] = temp[0];
          this.faces.B[3] = temp[1];
          this.faces.B[0] = temp[2];
        }
        break;

      case "R'":
      case 'Ri':
        this.applyMove('R', false);
        this.applyMove('R', false);
        this.applyMove('R', false);
        break;

      case 'R2':
        this.applyMove('R', false);
        this.applyMove('R', false);
        break;

      case 'L':
        this._rotateCW('L');
        {
          const temp = [this.faces.U[0], this.faces.U[3], this.faces.U[6]];
          this.faces.U[0] = this.faces.B[8];
          this.faces.U[3] = this.faces.B[5];
          this.faces.U[6] = this.faces.B[2];

          this.faces.B[8] = this.faces.D[0];
          this.faces.B[5] = this.faces.D[3];
          this.faces.B[2] = this.faces.D[6];

          this.faces.D[0] = this.faces.F[0];
          this.faces.D[3] = this.faces.F[3];
          this.faces.D[6] = this.faces.F[6];

          this.faces.F[0] = temp[0];
          this.faces.F[3] = temp[1];
          this.faces.F[6] = temp[2];
        }
        break;

      case "L'":
      case 'Li':
        this.applyMove('L', false);
        this.applyMove('L', false);
        this.applyMove('L', false);
        break;

      case 'L2':
        this.applyMove('L', false);
        this.applyMove('L', false);
        break;

      case 'F':
        this._rotateCW('F');
        {
          const temp = [this.faces.U[6], this.faces.U[7], this.faces.U[8]];
          this.faces.U[6] = this.faces.L[8];
          this.faces.U[7] = this.faces.L[5];
          this.faces.U[8] = this.faces.L[2];

          this.faces.L[8] = this.faces.D[2];
          this.faces.L[5] = this.faces.D[1];
          this.faces.L[2] = this.faces.D[0];

          this.faces.D[2] = this.faces.R[6];
          this.faces.D[1] = this.faces.R[3];
          this.faces.D[0] = this.faces.R[0];

          this.faces.R[6] = temp[0];
          this.faces.R[3] = temp[1];
          this.faces.R[0] = temp[2];
        }
        break;

      case "F'":
      case 'Fi':
        this.applyMove('F', false);
        this.applyMove('F', false);
        this.applyMove('F', false);
        break;

      case 'F2':
        this.applyMove('F', false);
        this.applyMove('F', false);
        break;

      case 'B':
        this._rotateCW('B');
        {
          const temp = [this.faces.U[0], this.faces.U[1], this.faces.U[2]];
          this.faces.U[0] = this.faces.R[2];
          this.faces.U[1] = this.faces.R[5];
          this.faces.U[2] = this.faces.R[8];

          this.faces.R[2] = this.faces.D[8];
          this.faces.R[5] = this.faces.D[7];
          this.faces.R[8] = this.faces.D[6];

          this.faces.D[8] = this.faces.L[6];
          this.faces.D[7] = this.faces.L[3];
          this.faces.D[6] = this.faces.L[0];

          this.faces.L[6] = temp[0];
          this.faces.L[3] = temp[1];
          this.faces.L[0] = temp[2];
        }
        break;

      case "B'":
      case 'Bi':
        this.applyMove('B', false);
        this.applyMove('B', false);
        this.applyMove('B', false);
        break;

      case 'B2':
        this.applyMove('B', false);
        this.applyMove('B', false);
        break;
    }

    if (record) {
      this.moveHistory.push(move);
    }
  }

  isSolved() {
    for (const key of ['U', 'D', 'F', 'B', 'L', 'R']) {
      const face = this.faces[key];
      const target = face[4]; // Tâm của mặt
      if (face.some(cell => cell !== target)) {
        return false;
      }
    }
    return true;
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
