import './style.css';
import confetti from 'canvas-confetti';
import { RubikState, FACE_COLORS, FACE_NAMES } from './src/rubikState.js';
import { Rubik3D } from './src/rubik3d.js';
import { ConcentricMandala } from './src/concentricMandala.js';
import { RadialDartboard } from './src/radialDartboard.js';
import { FormulaTrainer, FORMULAS } from './src/trainer.js';
import { sound } from './src/sound.js';

class App {
  constructor() {
    this.state = new RubikState();
    this.moveCount = 0;
    this.timerInterval = null;
    this.timerStartTime = null;
    this.timerRunning = false;
    this.isScrambled = false;

    this.initElements();
    this.initComponents();
    this.setupEvents();
    this.setupKeybindings();
  }

  initElements() {
    this.canvasContainer = document.getElementById('rubik-canvas');
    this.mandalaContainer = document.getElementById('mandala-container');
    this.dartboardContainer = document.getElementById('dartboard-container');
    this.tabMandala = document.getElementById('tab-mandala');
    this.tabDartboard = document.getElementById('tab-dartboard');
    this.mandalaHint = document.getElementById('mandala-hint');

    this.timerEl = document.getElementById('timer-display');
    this.moveCountEl = document.getElementById('move-count');
    this.scrambleBtn = document.getElementById('btn-scramble');
    this.resetBtn = document.getElementById('btn-reset');
    this.centerCamBtn = document.getElementById('btn-center-cam');
    this.soundToggleBtn = document.getElementById('btn-sound-toggle');
    this.statusBadge = document.getElementById('status-badge');

    // Controls học công thức
    this.formulaSelect = document.getElementById('formula-select');
    this.formulaDesc = document.getElementById('formula-desc');
    this.formulaSteps = document.getElementById('formula-steps');
    this.btnStepNext = document.getElementById('btn-step-next');
    this.btnPlayDemo = document.getElementById('btn-play-demo');
    this.btnResetFormula = document.getElementById('btn-reset-formula');
  }

  initComponents() {
    // 1. Bản đồ 1: 3 Vòng tròn giao thoa phẳng hóa
    this.mandala = new ConcentricMandala('mandala-container', this.state, (move) => {
      this.executeMove(move);
    });

    // 2. Bản đồ 2: Bia bắn Tròn Hướng Tâm (Radial Dartboard)
    this.dartboard = new RadialDartboard('dartboard-container', this.state, (move) => {
      this.executeMove(move);
    });

    // 3. Không gian 3D và 3 Gương phản chiếu (Hỗ trợ click trực tiếp lên khối & gương)
    this.rubik3D = new Rubik3D(
      this.canvasContainer,
      this.state,
      (move) => this.onMoveFinished(move),
      (directMove) => this.executeMove(directMove)
    );

    // 4. Hệ thống gợi ý & học công thức
    this.trainer = new FormulaTrainer(this.rubik3D, this.mandala, (formula, stepIdx) => {
      this.updateFormulaUI(formula, stepIdx);
    });

    this.populateFormulaList();
    this.updateAllViews();
  }

  setupEvents() {
    this.scrambleBtn.addEventListener('click', () => this.scramble());
    this.resetBtn.addEventListener('click', () => this.resetGame());
    this.centerCamBtn.addEventListener('click', () => this.rubik3D.resetCamera());

    let soundOn = true;
    this.soundToggleBtn.addEventListener('click', () => {
      soundOn = !soundOn;
      sound.enabled = soundOn;
      this.soundToggleBtn.innerHTML = soundOn ? '🔊 Âm: BẬT' : '🔇 Âm: TẮT';
      this.soundToggleBtn.classList.toggle('text-emerald-400', soundOn);
      this.soundToggleBtn.classList.toggle('text-slate-400', !soundOn);
    });

    // Nút phóng to / thu nhỏ góc nhìn 3D
    const btnZoomIn = document.getElementById('btn-zoom-in');
    const btnZoomOut = document.getElementById('btn-zoom-out');
    if (btnZoomIn) {
      btnZoomIn.addEventListener('click', () => this.rubik3D.zoom(-1.2));
    }
    if (btnZoomOut) {
      btnZoomOut.addEventListener('click', () => this.rubik3D.zoom(1.2));
    }

    // Nút xoay nhanh trên thanh điều khiển
    document.querySelectorAll('[data-move]').forEach(btn => {
      btn.addEventListener('click', () => {
        const move = btn.getAttribute('data-move');
        this.executeMove(move);
      });
    });

    // Sự kiện phần học công thức
    this.formulaSelect.addEventListener('change', (e) => {
      this.trainer.loadFormula(e.target.value);
    });

    this.btnStepNext.addEventListener('click', () => {
      this.trainer.nextStep();
    });

    this.btnPlayDemo.addEventListener('click', () => {
      if (this.trainer.isPlaying) {
        this.trainer.stop();
        this.btnPlayDemo.textContent = '▶ Tiếp Tục';
      } else {
        this.trainer.playAll(420);
        this.btnPlayDemo.textContent = '⏸ Tạm Dừng';
      }
    });

    this.btnResetFormula.addEventListener('click', () => {
      this.trainer.resetProgress();
      this.btnPlayDemo.textContent = '▶ Chạy Mẫu';
    });
    // Sự kiện chuyển đổi giữa 2 mô hình phẳng 2D: 3 Vòng Tròn vs Hướng Tâm
    if (this.tabMandala && this.tabDartboard) {
      this.tabMandala.addEventListener('click', () => {
        this.tabMandala.classList.add('active');
        this.tabDartboard.classList.remove('active');
        this.mandalaContainer.style.display = 'flex';
        this.dartboardContainer.style.display = 'none';
        if (this.mandalaHint) {
          this.mandalaHint.textContent = '💡 2D: Chạm màu = Thuận, nhãn ngoài = Nghịch';
        }
      });

      this.tabDartboard.addEventListener('click', () => {
        this.tabDartboard.classList.add('active');
        this.tabMandala.classList.remove('active');
        this.dartboardContainer.style.display = 'flex';
        this.mandalaContainer.style.display = 'none';
        if (this.dartboard) {
          this.dartboard.update();
        }
        if (this.mandalaHint) {
          this.mandalaHint.textContent = '💡 Chạm tâm = Thuận | Rìa = Nghịch | Đáy D: chạm ngoài = Thuận';
        }
      });
    }
  }

  setupKeybindings() {
    window.addEventListener('keydown', (e) => {
      // Bỏ qua nếu đang gõ trong input/select
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

      const key = e.key.toUpperCase();
      const validFaces = ['U', 'D', 'L', 'R', 'F', 'B'];

      if (validFaces.includes(key)) {
        const move = e.shiftKey ? `${key}'` : key;
        this.executeMove(move);
        e.preventDefault();
      } else if (e.code === 'Space') {
        this.scramble();
        e.preventDefault();
      }
    });
  }

  executeMove(move) {
    if (!this.timerRunning && this.isScrambled) {
      this.startTimer();
    }

    sound.playClick();
    this.moveCount++;
    this.moveCountEl.textContent = this.moveCount;

    this.rubik3D.queueMove(move);
    this.mandala.animateMove(move, this.rubik3D.animationSpeed);
  }

  onMoveFinished(move) {
    this.updateAllViews();

    // Kiểm tra hoàn thành
    if (this.isScrambled && this.state.isSolved()) {
      this.stopTimer();
      this.isScrambled = false;
      this.statusBadge.textContent = '🎉 HOÀN THÀNH!';
      this.statusBadge.className = 'px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
      sound.playVictory();
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }

  updateAllViews() {
    this.mandala.update();
    if (this.dartboard) {
      this.dartboard.update();
    }
    this.rubik3D.updateMirrors();
  }

  scramble() {
    this.stopTimer();
    this.resetTimerDisplay();
    this.moveCount = 0;
    this.moveCountEl.textContent = '0';
    this.isScrambled = true;

    this.statusBadge.textContent = 'ĐANG GIẢI';
    this.statusBadge.className = 'px-2 py-0.5 rounded text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30';

    const scrambleMoves = this.state.generateScramble(20);
    const speedBackup = this.rubik3D.animationSpeed;
    this.rubik3D.animationSpeed = 40; // Tăng tốc hoạt họa xáo trộn

    scrambleMoves.forEach(m => {
      this.rubik3D.queueMove(m);
    });

    setTimeout(() => {
      this.rubik3D.animationSpeed = speedBackup;
    }, 20 * 45);
  }

  resetGame() {
    this.stopTimer();
    this.resetTimerDisplay();
    this.moveCount = 0;
    this.moveCountEl.textContent = '0';
    this.isScrambled = false;

    this.state.reset();
    this.rubik3D.resetCube();
    this.updateAllViews();

    this.statusBadge.textContent = 'NGUYÊN BẢN';
    this.statusBadge.className = 'px-2 py-0.5 rounded text-xs font-bold bg-slate-500/20 text-slate-300 border border-slate-500/30';
  }

  startTimer() {
    this.timerRunning = true;
    this.timerStartTime = performance.now();
    this.timerInterval = setInterval(() => {
      const elapsed = performance.now() - this.timerStartTime;
      const min = Math.floor(elapsed / 60000);
      const sec = Math.floor((elapsed % 60000) / 1000);
      const ms = Math.floor((elapsed % 1000) / 10);
      this.timerEl.textContent = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
    }, 45);
  }

  stopTimer() {
    this.timerRunning = false;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  resetTimerDisplay() {
    this.timerEl.textContent = '00:00.00';
  }

  populateFormulaList() {
    this.formulaSelect.innerHTML = '';
    FORMULAS.forEach(f => {
      const opt = document.createElement('option');
      opt.value = f.id;
      opt.textContent = `[${f.stage}] ${f.name}`;
      this.formulaSelect.appendChild(opt);
    });

    this.trainer.loadFormula(FORMULAS[0].id);
  }

  updateFormulaUI(formula, stepIdx) {
    if (!formula) return;
    this.formulaDesc.textContent = formula.description;
    this.formulaSteps.innerHTML = '';

    formula.sequence.forEach((move, idx) => {
      const span = document.createElement('span');
      span.className = `px-2 py-1 rounded text-xs font-bold tracking-wider transition-all duration-200 ${
        idx === stepIdx
          ? 'bg-cyan-500 text-slate-950 scale-110 shadow-lg shadow-cyan-500/50 ring-2 ring-white'
          : idx < stepIdx
          ? 'bg-slate-800 text-slate-400 opacity-60'
          : 'bg-slate-800/80 text-cyan-300 border border-slate-700/60'
      }`;
      span.textContent = move;
      this.formulaSteps.appendChild(span);
    });

    if (stepIdx >= formula.sequence.length) {
      this.btnPlayDemo.textContent = '▶ Chạy Lại';
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new App();
});
