// Thư viện công thức học chơi Rubik & chế độ chạy mẫu từng bước
import { i18n } from './i18n.js';

const FORMULA_I18N = {
  'sexy-move': {
    sequence: ['R', 'U', "R'", "U'"],
    vi: { name: 'Sexy Move (Kinh điển)', stage: 'Cơ bản', description: 'Công thức nền tảng quan trọng nhất của Rubik. Lặp lại 6 lần sẽ đưa khối Rubik về nguyên trạng!' },
    en: { name: 'Sexy Move (Classic)', stage: 'Basic', description: 'The most fundamental Rubik\'s formula. Repeating 6 times returns the cube to its original state!' },
    ja: { name: 'セクシームーブ (基本)', stage: '基礎', description: '最も基本となる公式。6回繰り返すと元の状態に戻ります！' },
    zh: { name: '基础手法 Sexy Move', stage: '基础', description: '魔方最重要的基础手法。重复6次即可恢复原状！' },
    es: { name: 'Sexy Move (Clásico)', stage: 'Básico', description: '¡La fórmula más fundamental del Cubo. Repetir 6 veces devuelve el cubo a su estado original!' }
  },
  'rev-sexy': {
    sequence: ['U', 'R', "U'", "R'"],
    vi: { name: 'Reverse Sexy Move', stage: 'Cơ bản', description: 'Nghịch đảo của Sexy Move, dùng rất nhiều trong giải góc và tầng 1.' },
    en: { name: 'Reverse Sexy Move', stage: 'Basic', description: 'Inverse of the Sexy Move, widely used for corners and layer 1.' },
    ja: { name: '逆セクシームーブ', stage: '基礎', description: 'セクシームーブの逆手順。第1層のコーナー解法に多用されます。' },
    zh: { name: '逆向手法 Reverse Sexy', stage: '基础', description: 'Sexy Move的逆向公式，广泛用于第1层角块复原。' },
    es: { name: 'Reverse Sexy Move', stage: 'Básico', description: 'Inverso del Sexy Move, muy usado en esquinas y primera capa.' }
  },
  'yellow-cross': {
    sequence: ['F', 'R', 'U', "R'", "U'", "F'"],
    vi: { name: "Tạo dấu cộng vàng (F R U R' U' F')", stage: 'Tầng 3', description: 'Chuyển đổi các hình chữ L, đường thẳng vàng trên đỉnh thành dấu cộng vàng.' },
    en: { name: "Yellow Cross (F R U R' U' F')", stage: 'Layer 3', description: 'Transforms dot, L-shape, or line on top into a yellow cross.' },
    ja: { name: "黄色クロス (F R U R' U' F')", stage: '第3層', description: '上面の点・逆L字・一文字を黄色十字に変換します。' },
    zh: { name: "顶部黄色十字 (F R U R' U' F')", stage: '第3层', description: '将顶层的点、拐角或一字线转换为黄色十字。' },
    es: { name: "Cruz Amarilla (F R U R' U' F')", stage: 'Capa 3', description: 'Transforma punto, L o línea en cruz amarilla superior.' }
  },
  'sune': {
    sequence: ['R', 'U', "R'", 'U', 'R', 'U2', "R'"],
    vi: { name: 'Sune (Lật 3 góc vàng)', stage: 'Tầng 3', description: 'Công thức huyền thoại OLL giúp định hướng toàn bộ mặt vàng lên trên.' },
    en: { name: 'Sune (Orient 3 Corners)', stage: 'Layer 3', description: 'Legendary OLL formula that orients yellow corners face up.' },
    ja: { name: 'スネ (Sune / 3コーナー反転)', stage: '第3層', description: '上面の黄色コーナーを一気に上向きに揃える定番公式。' },
    zh: { name: '小鱼公式 Sune', stage: '第3层', description: '经典OLL公式，用于快速翻转顶层黄色角块朝上。' },
    es: { name: 'Sune (Orientar 3 esquinas)', stage: 'Capa 3', description: 'Fórmula clásica de OLL para orientar las esquinas amarillas hacia arriba.' }
  },
  'anti-sune': {
    sequence: ['R', 'U2', "R'", "U'", 'R', "U'", "R'"],
    vi: { name: 'Anti-Sune (Nghịch đảo Sune)', stage: 'Tầng 3', description: 'Đối xứng với Sune, lật góc vàng ngược chiều kim đồng hồ.' },
    en: { name: 'Anti-Sune (Sune Mirror)', stage: 'Layer 3', description: 'Mirror of Sune, rotates yellow corners counter-clockwise.' },
    ja: { name: 'アンチスネ (Anti-Sune)', stage: '第3層', description: 'スネの鏡像手順。コーナーを反時計回りに反転させます。' },
    zh: { name: '逆小鱼 Anti-Sune', stage: '第3层', description: 'Sune的对称镜像公式，逆时针翻转顶层角块。' },
    es: { name: 'Anti-Sune (Espejo de Sune)', stage: 'Capa 3', description: 'Espejo de Sune, rota esquinas amarillas en sentido antihorario.' }
  },
  'f2l-right': {
    sequence: ['U', 'R', "U'", "R'", "U'", "F'", 'U', 'F'],
    vi: { name: 'Ghép cạnh vào bên phải (Tầng 2)', stage: 'Tầng 2', description: 'Đưa viên cạnh từ tầng 3 vào đúng vị trí giữa tầng 2 bên phải.' },
    en: { name: 'Insert Edge Right (Layer 2)', stage: 'Layer 2', description: 'Inserts top edge into middle right slot.' },
    ja: { name: 'エッジ右挿入 (第2層)', stage: '第2層', description: '上層のエッジを第2層の右スロットに収めます。' },
    zh: { name: '中层右侧棱块归位', stage: '第2层', description: '将顶层棱块精准归位到中层右侧插槽。' },
    es: { name: 'Insertar arista a la derecha (Capa 2)', stage: 'Capa 2', description: 'Inserta la arista superior en la ranura derecha de la capa media.' }
  },
  'f2l-left': {
    sequence: ["U'", "L'", 'U', 'L', 'U', 'F', "U'", "F'"],
    vi: { name: 'Ghép cạnh vào bên trái (Tầng 2)', stage: 'Tầng 2', description: 'Đưa viên cạnh từ tầng 3 vào đúng vị trí giữa tầng 2 bên trái.' },
    en: { name: 'Insert Edge Left (Layer 2)', stage: 'Layer 2', description: 'Inserts top edge into middle left slot.' },
    ja: { name: 'エッジ左挿入 (第2層)', stage: '第2層', description: '上層のエッジを第2層の左スロットに収めます。' },
    zh: { name: '中层左侧棱块归位', stage: '第2层', description: '将顶层棱块精准归位到中层左侧插槽。' },
    es: { name: 'Insertar arista a la izquierda (Capa 2)', stage: 'Capa 2', description: 'Inserta la arista superior en la ranura izquierda de la capa media.' }
  },
  'niklas': {
    sequence: ['U', 'R', "U'", "L'", 'U', "R'", "U'", 'L'],
    vi: { name: 'Niklas (Định vị 4 góc đỉnh)', stage: 'Tầng 3', description: 'Hoán vị 3 góc tầng 3 khi giữ nguyên 1 góc đúng ở trước-phải.' },
    en: { name: 'Niklas (Position 4 Top Corners)', stage: 'Layer 3', description: 'Permutes 3 top corners while keeping front-right intact.' },
    ja: { name: 'ニクラス (4コーナー位置合わせ)', stage: '第3層', description: '手前右の正しいコーナーを固定し、残り3コーナーを循環置換します。' },
    zh: { name: 'Niklas 角块对齐公式', stage: '第3层', description: '保持右前角块不变，循环置换顶层其余三个角块位置。' },
    es: { name: 'Niklas (Posicionar 4 esquinas)', stage: 'Capa 3', description: 'Permuta 3 esquinas superiores manteniendo fija la frontal-derecha.' }
  },
  'orient-corner': {
    sequence: ["R'", "D'", 'R', 'D'],
    vi: { name: "Lật góc vàng (R' D' R D)", stage: 'Tầng 3', description: "Lật ngửa mặt vàng của góc tầng 3 về đỉnh U. Lặp lại 2 hoặc 4 lần cho mỗi góc." },
    en: { name: "Orient Corner (R' D' R D)", stage: 'Layer 3', description: "Orients yellow corner upward to U. Repeat 2 or 4 times per corner." },
    ja: { name: "コーナー反転 (R' D' R D)", stage: '第3層', description: "上面の黄色を上向きに揃えます。各コーナーごとに2回または4回繰り返します。" },
    zh: { name: "翻转黄色角块 (R' D' R D)", stage: '第3层', description: "将黄色角块朝上翻转，每个角块重复2次或4次。" },
    es: { name: "Orientar esquina (R' D' R D)", stage: 'Capa 3', description: "Gira la esquina para que el amarillo mire hacia arriba. Repetir 2 o 4 veces por esquina." }
  },
  't-perm': {
    sequence: ['R', 'U', "R'", "U'", "R'", 'F', 'R2', "U'", "R'", "U'", 'R', 'U', "R'", "F'"],
    vi: { name: 'T-Perm (Hoán vị góc & cạnh)', stage: 'PLL Nâng cao', description: 'Công thức PLL chữ T nổi tiếng nhất hoán vị 2 góc phải và 2 cạnh liền kề.' },
    en: { name: 'T-Perm (Permute Corners & Edges)', stage: 'Advanced PLL', description: 'Famous T-Perm swapping 2 right corners and 2 adjacent edges.' },
    ja: { name: 'T-Perm (コーナー＆エッジ交換)', stage: '上級 PLL', description: '右側2コーナーと隣接2エッジを同時に交換する定番PLL公式。' },
    zh: { name: 'T-Perm 经典置换', stage: '高级 PLL', description: '最著名的T型PLL手法，同时交换右侧两个角块与相邻两棱块。' },
    es: { name: 'T-Perm (Permutar esquinas y aristas)', stage: 'PLL Avanzado', description: 'Famoso T-Perm que intercambia 2 esquinas derechas y 2 aristas adyacentes.' }
  }
};

export const FORMULAS = Object.entries(FORMULA_I18N).map(([id, item]) => ({
  id,
  sequence: item.sequence,
  get name() {
    const lang = i18n.getLanguage();
    return item[lang]?.name || item.en?.name || item.vi?.name;
  },
  get stage() {
    const lang = i18n.getLanguage();
    return item[lang]?.stage || item.en?.stage || item.vi?.stage;
  },
  get description() {
    const lang = i18n.getLanguage();
    return item[lang]?.description || item.en?.description || item.vi?.description;
  }
}));

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
      this.stepIndex = 0;
      if (this.onStepChange) {
        this.onStepChange(this.currentFormula, this.stepIndex);
      }
    }

    const move = this.currentFormula.sequence[this.stepIndex];
    this.rubik3D.queueMove(move);

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

    // Tự động tua lại từ đầu nếu đã chạy hết chuỗi công thức
    if (this.stepIndex >= this.currentFormula.sequence.length) {
      this.stepIndex = 0;
      if (this.onStepChange) {
        this.onStepChange(this.currentFormula, this.stepIndex);
      }
    }

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
