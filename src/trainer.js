// Thư viện công thức học chơi Rubik & chế độ chạy mẫu từng bước

export const FORMULAS = [
  {
    id: 'sexy-move',
    name: 'Sexy Move (Kinh điển)',
    stage: 'Cơ bản',
    description: 'Công thức nền tảng quan trọng nhất của Rubik. Lặp lại 6 lần sẽ đưa khối Rubik về nguyên trạng!',
    sequence: ['R', 'U', "R'", "U'"]
  },
  {
    id: 'rev-sexy',
    name: 'Reverse Sexy Move',
    stage: 'Cơ bản',
    description: 'Nghịch đảo của Sexy Move, dùng rất nhiều trong giải góc và tầng 1.',
    sequence: ['U', 'R', "U'", "R'"]
  },
  {
    id: 'yellow-cross',
    name: 'Tạo dấu cộng vàng (F R U R\' U\' F\')',
    stage: 'Tầng 3',
    description: 'Chuyển đổi các hình chữ L, đường thẳng vàng trên đỉnh thành dấu cộng vàng.',
    sequence: ['F', 'R', 'U', "R'", "U'", "F'"]
  },
  {
    id: 'sune',
    name: 'Sune (Lật 3 góc vàng)',
    stage: 'Tầng 3',
    description: 'Công thức huyền thoại OLL giúp định hướng toàn bộ mặt vàng lên trên.',
    sequence: ['R', 'U', "R'", 'U', 'R', 'U2', "R'"]
  },
  {
    id: 'anti-sune',
    name: 'Anti-Sune (Nghịch đảo Sune)',
    stage: 'Tầng 3',
    description: 'Đối xứng với Sune, lật góc vàng ngược chiều kim đồng hồ.',
    sequence: ['R', 'U2', "R'", "U'", 'R', "U'", "R'"]
  },
  {
    id: 'f2l-right',
    name: 'Ghép cạnh vào bên phải (Tầng 2)',
    stage: 'Tầng 2',
    description: 'Đưa viên cạnh từ tầng 3 vào đúng vị trí giữa tầng 2 bên phải.',
    sequence: ['U', 'R', "U'", "R'", "U'", "F'", 'U', 'F']
  },
  {
    id: 'f2l-left',
    name: 'Ghép cạnh vào bên trái (Tầng 2)',
    stage: 'Tầng 2',
    description: 'Đưa viên cạnh từ tầng 3 vào đúng vị trí giữa tầng 2 bên trái.',
    sequence: ["U'", "L'", 'U', 'L', 'U', 'F', "U'", "F'"]
  },
  {
    id: 't-perm',
    name: 'T-Perm (Hoán vị góc & cạnh)',
    stage: 'PLL Nâng cao',
    description: 'Công thức PLL chữ T nổi tiếng nhất hoán vị 2 góc phải và 2 cạnh liền kề.',
    sequence: ['R', 'U', "R'", "U'", "R'", 'F', 'R2', "U'", "R'", "U'", 'R', 'U', "R'", "F'"]
  }
];

export class FormulaTrainer {
  constructor(rubik3D, mandala, onStepChange) {
    this.rubik3D = rubik3D;
    this.mandala = mandala;
    this.onStepChange = onStepChange;

    this.currentFormula = null;
    this.stepIndex = 0;
    this.isPlaying = false;
    this.playTimer = null;
  }

  loadFormula(formulaId) {
    this.stop();
    this.currentFormula = FORMULAS.find(f => f.id === formulaId) || null;
    this.stepIndex = 0;
    if (this.onStepChange) {
      this.onStepChange(this.currentFormula, this.stepIndex);
    }
  }

  nextStep() {
    if (!this.currentFormula) return;
    if (this.stepIndex >= this.currentFormula.sequence.length) {
      this.stop();
      return;
    }

    const move = this.currentFormula.sequence[this.stepIndex];
    this.rubik3D.queueMove(move);
    this.mandala.animateMove(move, this.rubik3D.animationSpeed);

    this.stepIndex++;
    if (this.onStepChange) {
      this.onStepChange(this.currentFormula, this.stepIndex);
    }

    if (this.stepIndex >= this.currentFormula.sequence.length) {
      this.stop();
    }
  }

  playAll(speedMs = 450) {
    if (!this.currentFormula) return;
    if (this.isPlaying) return;

    this.isPlaying = true;
    const playNext = () => {
      if (!this.isPlaying) return;
      if (this.stepIndex >= this.currentFormula.sequence.length) {
        this.stop();
        return;
      }
      this.nextStep();
      this.playTimer = setTimeout(playNext, speedMs);
    };

    playNext();
  }

  stop() {
    this.isPlaying = false;
    if (this.playTimer) {
      clearTimeout(this.playTimer);
      this.playTimer = null;
    }
  }

  resetProgress() {
    this.stop();
    this.stepIndex = 0;
    if (this.onStepChange) {
      this.onStepChange(this.currentFormula, this.stepIndex);
    }
  }
}
