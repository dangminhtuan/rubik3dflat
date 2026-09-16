import './style.css';
import confetti from 'canvas-confetti';
import { RubikState, FACE_COLORS, FACE_NAMES } from './src/rubikState.js';
import { Rubik3D } from './src/rubik3d.js';
import { ConcentricMandala } from './src/concentricMandala.js';
import { RadialDartboard } from './src/radialDartboard.js';
import { FormulaTrainer, FORMULAS } from './src/trainer.js';
import { CoachEngine } from './src/coachEngine.js';
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

    // Tabs chế độ thanh đáy: Gia Sư AI vs Công Thức Mẫu
    this.tabModeCoach = document.getElementById('tab-mode-coach');
    this.tabModeFormula = document.getElementById('tab-mode-formula');
    this.coachPanel = document.getElementById('coach-panel');
    this.formulaPanel = document.getElementById('formula-panel');

    // Controls Gia Sư AI Coach
    this.coachStageBadge = document.getElementById('coach-stage-badge');
    this.coachCaseName = document.getElementById('coach-case-name');
    this.coachHintText = document.getElementById('coach-hint-text');
    this.coachSteps = document.getElementById('coach-steps');
    this.btnCoachAuto = document.getElementById('btn-coach-auto');
    this.btnCoachStep = document.getElementById('btn-coach-step');
    this.btnCoachUndo = document.getElementById('btn-coach-undo');

    this.coach = new CoachEngine();
    this.currentCoachMoves = [];
    this.coachUndoStack = [];
    this.isAutoSolving = false;
    this.isScrambling = false;
    this.savedNormalSpeed = 300;
    this.lastCoachStage = 0;
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
    this.updateCoachUI();
  }

  setupEvents() {
    if (this.scrambleBtn) {
      this.scrambleBtn.addEventListener('click', () => this.scramble());
    }
    if (this.resetBtn) {
      this.resetBtn.addEventListener('click', () => this.resetGame());
    }
    if (this.centerCamBtn) {
      this.centerCamBtn.addEventListener('click', () => this.rubik3D.resetCamera());
    }

    if (this.soundToggleBtn) {
      let soundOn = true;
      this.soundToggleBtn.addEventListener('click', () => {
        soundOn = !soundOn;
        sound.enabled = soundOn;
        this.soundToggleBtn.innerHTML = soundOn ? '🔊 Âm: BẬT' : '🔇 Âm: TẮT';
        this.soundToggleBtn.classList.toggle('text-emerald-400', soundOn);
        this.soundToggleBtn.classList.toggle('text-slate-400', !soundOn);
      });
    }

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
    if (this.formulaSelect) {
      this.formulaSelect.addEventListener('change', (e) => {
        this.trainer.loadFormula(e.target.value);
      });
    }

    if (this.btnStepNext) {
      this.btnStepNext.addEventListener('click', () => {
        this.trainer.nextStep();
      });
    }

    if (this.btnPlayDemo) {
      this.btnPlayDemo.addEventListener('click', () => {
        if (this.trainer.isPlaying) {
          this.trainer.stop();
          this.btnPlayDemo.textContent = '▶ Tiếp Tục';
        } else {
          this.trainer.playAll(420);
          this.btnPlayDemo.textContent = '⏸ Tạm Dừng';
        }
      });
    }

    if (this.btnResetFormula) {
      this.btnResetFormula.addEventListener('click', () => {
        this.trainer.resetProgress();
        this.btnPlayDemo.textContent = '▶ Chạy Mẫu';
      });
    }
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

    // Sự kiện chuyển đổi giữa 2 chế độ thanh đáy: Gia Sư AI vs Thư Viện Mẫu
    if (this.tabModeCoach && this.tabModeFormula) {
      this.tabModeCoach.addEventListener('click', () => {
        this.tabModeCoach.classList.add('active');
        this.tabModeFormula.classList.remove('active');
        this.coachPanel.style.display = 'flex';
        this.formulaPanel.style.display = 'none';
        this.updateCoachUI();
      });

      this.tabModeFormula.addEventListener('click', () => {
        this.tabModeFormula.classList.add('active');
        this.tabModeCoach.classList.remove('active');
        this.formulaPanel.style.display = 'flex';
        this.coachPanel.style.display = 'none';
      });
    }

    // Sự kiện Gia Sư AI: Tự Giải Hết, Bước Tiếp, Hoàn Tác
    if (this.btnCoachAuto) {
      this.btnCoachAuto.addEventListener('click', () => {
        this.toggleAutoSolve();
      });
    }

    if (this.btnCoachStep) {
      this.btnCoachStep.addEventListener('click', () => {
        this.stepSolve();
      });
    }

    if (this.btnCoachUndo) {
      this.btnCoachUndo.addEventListener('click', () => {
        this.undoCoachMove();
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

  executeMove(move, isUndo = false) {
    if (this.rubik3D.isAnimating && this.rubik3D.animationQueue.length > 3) {
      return;
    }

    if (!isUndo) {
      this.coachUndoStack.push(move);
      if (this.btnCoachUndo) {
        this.btnCoachUndo.style.display = 'inline-flex';
      }
    }

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

    const isQueueEmpty = !this.rubik3D.animationQueue || this.rubik3D.animationQueue.length === 0;

    if (this.isScrambling && isQueueEmpty) {
      this.isScrambling = false;
      this.rubik3D.animationSpeed = this.savedNormalSpeed || 300;
      this.updateCoachUI();
    } else if (this.isAutoSolving) {
      if (isQueueEmpty) {
        this.isAutoSolving = false;
        this.rubik3D.animationSpeed = this.savedNormalSpeed || 300;
        if (this.btnCoachAuto) {
          this.btnCoachAuto.textContent = '⚡ Tự Giải Hết';
          this.btnCoachAuto.classList.add('primary');
        }
        this.updateCoachUI();
      } else {
        const remaining = this.rubik3D.animationQueue.length;
        if (this.coachStageBadge) {
          this.coachStageBadge.textContent = `🎯 CÒN ${remaining} NƯỚC`;
        }
      }
    } else if (isQueueEmpty) {
      this.updateCoachUI();
    }

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
    this.isAutoSolving = false;
    this.isScrambling = true;
    this.coachUndoStack = [];
    this.lastCoachStage = 0;
    if (this.btnCoachUndo) {
      this.btnCoachUndo.style.display = 'none';
    }
    if (this.btnCoachAuto) {
      this.btnCoachAuto.textContent = '⚡ Tự Giải Hết';
      this.btnCoachAuto.classList.add('primary');
    }

    this.statusBadge.textContent = 'ĐANG GIẢI';
    this.statusBadge.className = 'px-2 py-0.5 rounded text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30';

    const scrambleMoves = this.state.generateScramble(20);
    this.savedNormalSpeed = this.rubik3D.animationSpeed || 300;
    this.rubik3D.animationSpeed = 40; // Tăng tốc hoạt họa xáo trộn

    scrambleMoves.forEach(m => {
      this.rubik3D.queueMove(m);
    });
  }

  resetGame() {
    this.stopTimer();
    this.resetTimerDisplay();
    this.moveCount = 0;
    this.moveCountEl.textContent = '0';
    this.isScrambled = false;
    this.isAutoSolving = false;
    this.isScrambling = false;
    this.coachUndoStack = [];
    this.lastCoachStage = 0;
    if (this.btnCoachUndo) {
      this.btnCoachUndo.style.display = 'none';
    }
    if (this.btnCoachAuto) {
      this.btnCoachAuto.textContent = '⚡ Tự Giải Hết';
      this.btnCoachAuto.classList.add('primary');
    }

    this.state.reset();
    this.rubik3D.resetCube();
    this.updateAllViews();
    this.updateCoachUI();

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
    if (this.formulaDesc) {
      this.formulaDesc.textContent = formula.description;
      this.formulaDesc.title = formula.description;
    }

    if (this.formulaSteps) {
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
    }

    if (this.btnPlayDemo && stepIdx >= formula.sequence.length) {
      this.btnPlayDemo.textContent = '▶ Chạy Lại';
    }
  }

  updateCoachUI() {
    if (!this.coachStageBadge) return;

    const analysis = this.coach.analyze(this.state);
    this.currentCoachMoves = analysis.moves || [];

    // Ăn mừng khi tiến sang bước mới
    if (this.lastCoachStage > 0 && analysis.stage > this.lastCoachStage && analysis.stage <= 8) {
      sound.playVictory();
    }
    this.lastCoachStage = analysis.stage;

    // Cập nhật huy hiệu đếm ngược
    if (analysis.isSolved || analysis.stage === 8) {
      this.coachStageBadge.textContent = '🎉 HOÀN THÀNH';
      this.coachStageBadge.style.background = 'rgba(16, 185, 129, 0.2)';
      this.coachStageBadge.style.color = '#34d399';
      this.coachStageBadge.style.borderColor = 'rgba(16, 185, 129, 0.4)';
    } else {
      this.coachStageBadge.textContent = analysis.badgeText; // '🎯 CÒN X NƯỚC'
      this.coachStageBadge.style.background = 'rgba(56, 189, 248, 0.15)';
      this.coachStageBadge.style.color = '#38bdf8';
      this.coachStageBadge.style.borderColor = 'rgba(56, 189, 248, 0.35)';
    }

    this.coachCaseName.textContent = analysis.caseName;
    this.coachHintText.textContent = analysis.hint;
    this.coachHintText.title = analysis.hint;

    // Hiển thị các ô nước đi
    this.coachSteps.innerHTML = '';
    if (!this.currentCoachMoves || this.currentCoachMoves.length === 0) {
      if (analysis.isSolved) {
        const span = document.createElement('span');
        span.className = 'px-2 py-0.5 rounded text-xs font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30';
        span.textContent = '6 Mặt Đã Hoàn Hảo!';
        this.coachSteps.appendChild(span);
      }
      if (this.btnCoachAuto) {
        this.btnCoachAuto.disabled = true;
        this.btnCoachAuto.style.opacity = '0.5';
        this.btnCoachAuto.style.cursor = 'not-allowed';
      }
      if (this.btnCoachStep) {
        this.btnCoachStep.disabled = true;
        this.btnCoachStep.style.opacity = '0.5';
        this.btnCoachStep.style.cursor = 'not-allowed';
      }
    } else {
      this.currentCoachMoves.forEach((m, idx) => {
        const span = document.createElement('span');
        span.className = idx === 0
          ? 'px-1.5 py-0.5 rounded text-xs font-bold font-mono tracking-wider bg-cyan-500/30 text-cyan-200 border border-cyan-400 shadow-sm'
          : 'px-1.5 py-0.5 rounded text-xs font-bold font-mono tracking-wider bg-slate-800/80 text-cyan-300 border border-slate-700/60';
        span.textContent = m;
        this.coachSteps.appendChild(span);
      });
      if (this.btnCoachAuto) {
        this.btnCoachAuto.disabled = false;
        this.btnCoachAuto.style.opacity = '1';
        this.btnCoachAuto.style.cursor = 'pointer';
      }
      if (this.btnCoachStep) {
        this.btnCoachStep.disabled = false;
        this.btnCoachStep.style.opacity = '1';
        this.btnCoachStep.style.cursor = 'pointer';
      }
    }

    if (this.coachUndoStack.length === 0 && this.btnCoachUndo) {
      this.btnCoachUndo.style.display = 'none';
    }
  }

  toggleAutoSolve() {
    if (this.isAutoSolving) {
      this.isAutoSolving = false;
      this.rubik3D.animationQueue = [];
      this.rubik3D.animationSpeed = this.savedNormalSpeed || 300;
      if (this.btnCoachAuto) {
        this.btnCoachAuto.textContent = '⚡ Tự Giải Hết';
        this.btnCoachAuto.classList.add('primary');
      }
      this.updateCoachUI();
      return;
    }

    if (this.state.isSolved()) return;

    const moves = this.state.solve();
    if (!moves || moves.length === 0) return;

    this.isAutoSolving = true;
    if (this.btnCoachAuto) {
      this.btnCoachAuto.textContent = '⏸ Tạm Dừng';
      this.btnCoachAuto.classList.remove('primary');
    }

    this.savedNormalSpeed = this.rubik3D.animationSpeed || 300;
    this.rubik3D.animationSpeed = 160;

    moves.forEach(m => {
      this.moveCount++;
      this.rubik3D.queueMove(m);
    });
    this.moveCountEl.textContent = this.moveCount;
    if (!this.timerRunning && this.isScrambled) {
      this.startTimer();
    }
  }

  stepSolve() {
    if (this.rubik3D.isAnimating || (this.rubik3D.animationQueue && this.rubik3D.animationQueue.length > 0)) return;
    if (this.state.isSolved()) return;

    const moves = this.state.solve();
    if (!moves || moves.length === 0) return;

    const nextMove = moves[0];
    this.executeMove(nextMove);
  }

  undoCoachMove() {
    if (this.rubik3D.isAnimating || (this.rubik3D.animationQueue && this.rubik3D.animationQueue.length > 0)) return;
    if (this.coachUndoStack.length === 0) return;

    const lastMove = this.coachUndoStack.pop();
    const inv = lastMove.endsWith('2') ? lastMove : (lastMove.endsWith("'") ? lastMove.slice(0, -1) : lastMove + "'");

    this.executeMove(inv, true);
    if (this.coachUndoStack.length === 0 && this.btnCoachUndo) {
      this.btnCoachUndo.style.display = 'none';
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new App();
});
