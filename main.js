import './style.css';
import confetti from 'canvas-confetti';
import { RubikState, FACE_COLORS, FACE_NAMES } from './src/rubikState.js';
import { Rubik3D } from './src/rubik3d.js';
import { ConcentricMandala } from './src/concentricMandala.js';
import { RadialDartboard } from './src/radialDartboard.js';
import { FormulaTrainer, FORMULAS } from './src/trainer.js';
import { CoachEngine } from './src/coachEngine.js';
import { sound } from './src/sound.js';
import { i18n } from './src/i18n.js';

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
    // Menu chọn ngôn ngữ quốc tế
    this.btnLangToggle = document.getElementById('btn-lang-toggle');
    this.langPopover = document.getElementById('lang-popover');
    this.btnCloseLang = document.getElementById('btn-close-lang');
    this.currentLangLabel = document.getElementById('current-lang-label');
    this.langItems = document.querySelectorAll('.lang-item');

    this.canvasContainer = document.getElementById('rubik-canvas');
    this.mandalaContainer = document.getElementById('mandala-container');
    this.dartboardContainer = document.getElementById('dartboard-container');
    this.mandalaViewportsWrapper = document.getElementById('mandala-viewports-wrapper');
    this.tabMandala = document.getElementById('tab-mandala');
    this.tabDartboard = document.getElementById('tab-dartboard');
    this.tabDual = document.getElementById('tab-dual');
    this.mandalaHint = document.getElementById('mandala-hint');

    this.timerEl = document.getElementById('timer-display');
    this.moveCountEl = document.getElementById('move-count');
    this.scrambleBtn = document.getElementById('btn-scramble');
    this.statusBadge = document.getElementById('status-badge');

    // 2 Nút Reset ở hàng giữa
    this.btnResetView = document.getElementById('btn-reset-view');
    this.btnResetRubik = document.getElementById('btn-reset-rubik');

    // Nút Con Mắt & Menu Tùy chọn hiển thị
    this.btnDisplayToggle = document.getElementById('btn-display-toggle');
    this.displayPopover = document.getElementById('display-popover');
    this.btnClosePopover = document.getElementById('btn-close-popover');
    this.chkRubik3D = document.getElementById('chk-rubik-3d');
    this.chkLabels = document.getElementById('chk-labels');
    this.chkStats = document.getElementById('chk-stats');
    this.chkMoveBar = document.getElementById('chk-move-bar');
    this.chkSound = document.getElementById('chk-sound');
    this.chkAutoSolve = document.getElementById('chk-auto-solve');
    this.sliderAutoSpeed = document.getElementById('slider-auto-speed');
    this.speedValueBadge = document.getElementById('speed-value-badge');
    this.speedPresetBtns = document.querySelectorAll('.speed-preset-btn');
    this.statsBar = document.getElementById('stats-bar');
    this.quickMoveBar = document.getElementById('quick-move-bar');

    // Tải cấu hình hiển thị từ localStorage
    this.prefs = {
      rubik3D: localStorage.getItem('rubik_pref_rubik3d') !== 'false', // Mặc định bật (true)
      labels: localStorage.getItem('rubik_pref_labels') !== 'false',
      stats: localStorage.getItem('rubik_pref_stats') !== 'false',
      moveBar: localStorage.getItem('rubik_pref_moveBar') !== 'false',
      sound: localStorage.getItem('rubik_pref_sound') !== 'false',
      autoSolve: localStorage.getItem('rubik_pref_autoSolve') === 'true', // Mặc định tắt (false)
      autoSpeed: parseFloat(localStorage.getItem('rubik_pref_auto_speed')) || 1.0,
    };

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
    this.coachPedagogyInfo = document.getElementById('coach-pedagogy-info');
    this.formulaPedagogyInfo = document.getElementById('formula-pedagogy-info');

    // Controls Gia Sư AI Coach
    this.coachStageBadge = document.getElementById('coach-stage-badge');
    this.coachCaseName = document.getElementById('coach-case-name');
    this.coachFormulaBadge = document.getElementById('coach-formula-badge');
    this.coachHintText = document.getElementById('coach-hint-text');
    this.coachSteps = document.getElementById('coach-steps');
    this.btnCoachStep = document.getElementById('btn-coach-step');
    this.btnCoachStepInline = document.getElementById('btn-coach-step-inline');
    this.btnCoachStage = document.getElementById('btn-coach-stage');
    this.btnCoachAuto = document.getElementById('btn-coach-auto');
    this.btnCoachUndo = document.getElementById('btn-coach-undo');
    this.btnResetRubikAlt = document.getElementById('btn-reset-rubik-alt');
    if (this.btnCoachUndo) this.btnCoachUndo.disabled = true;

    this.coach = new CoachEngine();
    this.currentCoachMoves = [];
    this.coachUndoStack = [];
    this.currentCoachFormulaId = null;
    this.isAutoSolving = false;
    this.isStageSolving = false;
    this.isScrambling = false;
    this.savedNormalSpeed = 300;
    this.lastCoachStage = 0;
  }

  applyPreferences() {
    // 0. Khối Rubik 3D (Mặc định bật, tắt để trải nghiệm 2D toàn màn hình)
    if (this.prefs.rubik3D) {
      document.body.classList.remove('hide-rubik-3d');
      if (this.rubik3D) this.rubik3D.setVisible(true);
    } else {
      document.body.classList.add('hide-rubik-3d');
      if (this.rubik3D) this.rubik3D.setVisible(false);
    }
    if (this.chkRubik3D) this.chkRubik3D.checked = this.prefs.rubik3D;

    // 1. Nhãn chữ
    if (this.prefs.labels) {
      document.body.classList.remove('icon-only-mode');
    } else {
      document.body.classList.add('icon-only-mode');
    }
    if (this.chkLabels) this.chkLabels.checked = this.prefs.labels;

    // 2. Bộ đếm game
    if (this.statsBar) {
      this.statsBar.classList.toggle('hidden-stats', !this.prefs.stats);
    }
    if (this.chkStats) this.chkStats.checked = this.prefs.stats;

    // 3. Thanh 12 phím xoay
    if (this.quickMoveBar) {
      this.quickMoveBar.classList.toggle('hidden-move-bar', !this.prefs.moveBar);
    }
    if (this.chkMoveBar) this.chkMoveBar.checked = this.prefs.moveBar;

    // 4. Âm thanh
    sound.enabled = this.prefs.sound;
    if (this.chkSound) this.chkSound.checked = this.prefs.sound;

    // 5. Nút Tự Giải Hết (Mặc định ẩn, bật trong popover mắt)
    if (this.btnCoachAuto) {
      this.btnCoachAuto.style.display = this.prefs.autoSolve ? 'inline-flex' : 'none';
    }
    if (this.chkAutoSolve) this.chkAutoSolve.checked = this.prefs.autoSolve;

    // 6. Tốc độ tự động quay
    this.setAutoSpeed(this.prefs.autoSpeed || 1.0);

    localStorage.setItem('rubik_pref_rubik3d', this.prefs.rubik3D);
    localStorage.setItem('rubik_pref_labels', this.prefs.labels);
    localStorage.setItem('rubik_pref_stats', this.prefs.stats);
    localStorage.setItem('rubik_pref_moveBar', this.prefs.moveBar);
    localStorage.setItem('rubik_pref_sound', this.prefs.sound);
    localStorage.setItem('rubik_pref_autoSolve', this.prefs.autoSolve);
    localStorage.setItem('rubik_pref_auto_speed', this.prefs.autoSpeed || 1.0);
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
      (directMove) => this.executeMove(directMove),
      (move, duration) => this.onMoveStart(move, duration)
    );

    // 4. Hệ thống gợi ý & học công thức
    this.trainer = new FormulaTrainer(this.rubik3D, this.mandala, (formula, stepIdx) => {
      this.updateFormulaUI(formula, stepIdx);
    });

    // Khởi tạo đa ngôn ngữ i18n
    i18n.init();
    this.updateLanguageUI(i18n.getLanguage());
    i18n.onChange((newLang) => this.onLanguageChange(newLang));

    this.populateFormulaList();
    this.updateAllViews();
    this.updateCoachUI();
    this.applyPreferences();

    // Khởi tạo chế độ xem 2D (3 Vòng Tròn / Hướng Tâm / Song Song)
    const saved2DMode = localStorage.getItem('rubik_pref_2d_mode') || 'mandala';
    this.set2DViewMode(saved2DMode);
  }

  updateLanguageUI(lang) {
    if (this.currentLangLabel) {
      this.currentLangLabel.textContent = lang.toUpperCase();
    }
    const items = document.querySelectorAll('.lang-item');
    items.forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-lang') === lang);
    });
    if (this.mandalaContainer) {
      this.mandalaContainer.setAttribute('data-view-label', `🪐 ${i18n.t('tab_mandala')}`);
    }
    if (this.dartboardContainer) {
      this.dartboardContainer.setAttribute('data-view-label', `🎯 ${i18n.t('tab_dartboard')}`);
    }
  }

  onLanguageChange(lang) {
    this.updateLanguageUI(lang);
    this.populateFormulaList();
    this.currentCoachMoves = [];
    this.updateCoachUI();
    if (this.mandalaContainer) {
      this.mandalaContainer.setAttribute('data-view-label', `🪐 ${i18n.t('tab_mandala')}`);
    }
    if (this.dartboardContainer) {
      this.dartboardContainer.setAttribute('data-view-label', `🎯 ${i18n.t('tab_dartboard')}`);
    }
    if (this.rubik3D && this.rubik3D.updateMirrorChip) {
      this.rubik3D.updateMirrorChip();
    }
    if (this.state.isSolved()) {
      this.statusBadge.innerHTML = '🟢 <span class="btn-lbl">' + i18n.t('status_solved') + '</span>';
    } else if (this.isScrambled) {
      this.statusBadge.innerHTML = '⏳ <span class="btn-lbl">' + i18n.t('status_solving') + '</span>';
    }
  }

  setupEvents() {
    // Menu Chọn Ngôn Ngữ Quốc Tế
    if (this.btnLangToggle && this.langPopover) {
      this.btnLangToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHidden = this.langPopover.style.display === 'none';
        this.langPopover.style.display = isHidden ? 'block' : 'none';
        if (this.displayPopover) this.displayPopover.style.display = 'none';
      });

      if (this.btnCloseLang) {
        this.btnCloseLang.addEventListener('click', (e) => {
          e.stopPropagation();
          this.langPopover.style.display = 'none';
        });
      }

      this.langItems.forEach(item => {
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          const lang = item.getAttribute('data-lang');
          if (lang) {
            i18n.setLanguage(lang);
            this.langPopover.style.display = 'none';
          }
        });
      });

      document.addEventListener('click', (e) => {
        if (!this.langPopover.contains(e.target) && e.target !== this.btnLangToggle && !this.btnLangToggle.contains(e.target)) {
          this.langPopover.style.display = 'none';
        }
      });
    }

    if (this.scrambleBtn) {
      this.scrambleBtn.addEventListener('click', () => this.scramble());
    }

    // 2 Nút Reset ở trung tâm
    if (this.btnResetView) {
      this.btnResetView.addEventListener('click', () => this.rubik3D.resetCamera());
    }
    if (this.btnResetRubik) {
      this.btnResetRubik.addEventListener('click', () => this.resetGame());
    }
    if (this.btnResetRubikAlt) {
      this.btnResetRubikAlt.addEventListener('click', () => this.resetGame());
    }

    // Menu Con Mắt & Tùy chọn giao diện
    if (this.btnDisplayToggle && this.displayPopover) {
      this.btnDisplayToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.langPopover) this.langPopover.style.display = 'none';
        const isHidden = this.displayPopover.style.display === 'none';
        this.displayPopover.style.display = isHidden ? 'block' : 'none';
      });

      if (this.btnClosePopover) {
        this.btnClosePopover.addEventListener('click', (e) => {
          e.stopPropagation();
          this.displayPopover.style.display = 'none';
        });
      }

      document.addEventListener('click', (e) => {
        if (!this.displayPopover.contains(e.target) && e.target !== this.btnDisplayToggle && !this.btnDisplayToggle.contains(e.target)) {
          this.displayPopover.style.display = 'none';
        }
      });
    }

    // Checkbox Tùy chọn giao diện
    if (this.chkRubik3D) {
      this.chkRubik3D.addEventListener('change', (e) => {
        this.prefs.rubik3D = e.target.checked;
        this.applyPreferences();
      });
    }
    if (this.chkLabels) {
      this.chkLabels.addEventListener('change', (e) => {
        this.prefs.labels = e.target.checked;
        this.applyPreferences();
      });
    }
    if (this.chkStats) {
      this.chkStats.addEventListener('change', (e) => {
        this.prefs.stats = e.target.checked;
        this.applyPreferences();
      });
    }
    if (this.chkMoveBar) {
      this.chkMoveBar.addEventListener('change', (e) => {
        this.prefs.moveBar = e.target.checked;
        this.applyPreferences();
      });
    }
    if (this.chkSound) {
      this.chkSound.addEventListener('change', (e) => {
        this.prefs.sound = e.target.checked;
        this.applyPreferences();
      });
    }
    if (this.chkAutoSolve) {
      this.chkAutoSolve.addEventListener('change', (e) => {
        this.prefs.autoSolve = e.target.checked;
        this.applyPreferences();
      });
    }
    if (this.sliderAutoSpeed) {
      this.sliderAutoSpeed.addEventListener('input', (e) => {
        this.setAutoSpeed(e.target.value);
      });
    }
    if (this.speedPresetBtns) {
      this.speedPresetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const speed = btn.getAttribute('data-speed');
          this.setAutoSpeed(speed);
        });
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

    // Nút Ghim / Lưu góc nhìn 3D tùy chỉnh
    const btnSaveView = document.getElementById('btn-save-view');
    const updateSaveViewBtnState = () => {
      if (btnSaveView) {
        btnSaveView.classList.toggle('active-pinned', this.rubik3D.hasSavedView());
      }
    };

    updateSaveViewBtnState();

    if (btnSaveView) {
      // 1. Click chuột trái: Lưu góc nhìn và mức zoom hiện tại
      btnSaveView.addEventListener('click', () => {
        this.rubik3D.saveCurrentView();
        updateSaveViewBtnState();
        this.showToast(i18n.t('view_saved_toast'));
      });

      // 2. Click chuột phải: Khôi phục góc nhìn chuẩn ban đầu
      btnSaveView.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (this.rubik3D.hasSavedView()) {
          this.rubik3D.clearSavedView();
          updateSaveViewBtnState();
          this.showToast(i18n.t('view_reset_toast'));
        }
      });

      // 3. Chạm giữ trên mobile (>500ms): Khôi phục góc nhìn chuẩn
      let touchTimer = null;
      btnSaveView.addEventListener('touchstart', () => {
        touchTimer = setTimeout(() => {
          touchTimer = null;
          if (this.rubik3D.hasSavedView()) {
            this.rubik3D.clearSavedView();
            updateSaveViewBtnState();
            this.showToast(i18n.t('view_reset_toast'));
          }
        }, 500);
      }, { passive: true });

      const clearTouch = () => {
        if (touchTimer) {
          clearTimeout(touchTimer);
          touchTimer = null;
        }
      };
      btnSaveView.addEventListener('touchend', clearTouch);
      btnSaveView.addEventListener('touchcancel', clearTouch);
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
          this.btnPlayDemo.innerHTML = '▶ <span class="btn-lbl">' + i18n.t('btn_resume_demo') + '</span>';
        } else {
          const speedMs = Math.max(120, Math.round(420 / (this.prefs.autoSpeed || 1.0)));
          this.trainer.playAll(speedMs);
          this.btnPlayDemo.innerHTML = '⏸ <span class="btn-lbl">' + i18n.t('btn_auto_pause') + '</span>';
        }
      });
    }

    if (this.btnResetFormula) {
      this.btnResetFormula.addEventListener('click', () => {
        this.trainer.resetProgress();
        if (this.btnPlayDemo) {
          this.btnPlayDemo.innerHTML = '▶ <span class="btn-lbl">' + i18n.t('btn_play_demo') + '</span>';
        }
      });
    }
    // Sự kiện chuyển đổi giữa các chế độ bản đồ 2D: 3 Vòng Tròn, Hướng Tâm, Song Song
    if (this.tabMandala) {
      this.tabMandala.addEventListener('click', () => this.set2DViewMode('mandala'));
    }
    if (this.tabDartboard) {
      this.tabDartboard.addEventListener('click', () => this.set2DViewMode('dartboard'));
    }
    if (this.tabDual) {
      this.tabDual.addEventListener('click', () => this.set2DViewMode('dual'));
    }

    // Sự kiện chuyển đổi giữa 2 chế độ thanh đáy: Gia Sư AI vs Thư Viện Mẫu
    if (this.tabModeCoach && this.tabModeFormula) {
      this.tabModeCoach.addEventListener('click', () => {
        this.tabModeCoach.classList.add('active');
        this.tabModeFormula.classList.remove('active');
        if (this.coachPedagogyInfo) this.coachPedagogyInfo.style.display = 'flex';
        if (this.formulaPedagogyInfo) this.formulaPedagogyInfo.style.display = 'none';
        this.coachPanel.style.display = 'flex';
        this.formulaPanel.style.display = 'none';
        if (this.btnCoachStep) this.btnCoachStep.style.display = 'inline-flex';
        if (this.btnCoachStepInline) this.btnCoachStepInline.style.display = '';
        this.updateCoachUI();
      });

      this.tabModeFormula.addEventListener('click', () => {
        this.tabModeFormula.classList.add('active');
        this.tabModeCoach.classList.remove('active');
        if (this.coachPedagogyInfo) this.coachPedagogyInfo.style.display = 'none';
        if (this.formulaPedagogyInfo) this.formulaPedagogyInfo.style.display = 'flex';
        this.formulaPanel.style.display = 'flex';
        this.coachPanel.style.display = 'none';
        if (this.btnCoachStep) this.btnCoachStep.style.display = 'none';
        if (this.btnCoachStepInline) this.btnCoachStepInline.style.display = 'none';
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

    if (this.btnCoachStepInline) {
      this.btnCoachStepInline.addEventListener('click', () => {
        this.stepSolve();
      });
    }

    if (this.btnCoachStage) {
      this.btnCoachStage.addEventListener('click', () => {
        this.stageSolve();
      });
    }

    if (this.btnCoachUndo) {
      this.btnCoachUndo.addEventListener('click', () => {
        this.undoCoachMove();
      });
    }

    if (this.coachFormulaBadge) {
      this.coachFormulaBadge.addEventListener('click', () => {
        if (this.currentCoachFormulaId && this.tabModeFormula && this.formulaSelect) {
          this.tabModeFormula.click();
          this.formulaSelect.value = this.currentCoachFormulaId;
          this.trainer.loadFormula(this.currentCoachFormulaId);
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

  executeMove(move, isUndo = false) {
    if (this.rubik3D.isAnimating && this.rubik3D.animationQueue.length > 3) {
      return;
    }

    if (!isUndo) {
      this.coachUndoStack.push(move);
      if (this.btnCoachUndo) {
        this.btnCoachUndo.disabled = false;
      }

      // Tịnh tiến hàng đợi gợi ý: Nếu nước đi khớp với nước tiếp theo, loại bỏ nước đó khỏi hàng đợi
      if (this.currentCoachMoves && this.currentCoachMoves.length > 0 && this.currentCoachMoves[0] === move) {
        this.currentCoachMoves.shift();
      } else {
        // Người dùng tự xoay nước khác -> reset hàng đợi để Gia Sư tính toán lại từ thế cờ mới
        this.currentCoachMoves = [];
      }
    } else {
      // Hoàn tác -> tính lại từ đầu
      this.currentCoachMoves = [];
    }

    if (!this.timerRunning && this.isScrambled) {
      this.startTimer();
    }

    sound.playClick();
    this.moveCount++;
    this.moveCountEl.textContent = this.moveCount;

    this.rubik3D.queueMove(move);
  }

  onMoveStart(move, duration) {
    if (!this.isScrambling) {
      if (this.mandala) {
        this.mandala.animateMove(move, duration);
      }
      if (this.dartboard) {
        this.dartboard.animateMove(move, duration);
      }
      if (this.isAutoSolving || this.isStageSolving) {
        sound.playClick();
        this.moveCount++;
        if (this.moveCountEl) {
          this.moveCountEl.textContent = this.moveCount;
        }
      }
    }
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
          this.btnCoachAuto.innerHTML = '⚡ <span class="btn-lbl">' + i18n.t('btn_auto_full') + '</span>';
          this.btnCoachAuto.classList.add('primary');
        }
        this.updateCoachUI();
      } else {
        const remaining = this.rubik3D.animationQueue.length;
        if (this.coachStageBadge) {
          this.coachStageBadge.innerHTML = `🏁 <span class="badge-lbl">${i18n.t('coach_remaining_moves', { count: remaining })}</span>`;
        }
      }
    } else if (this.isStageSolving) {
      if (isQueueEmpty) {
        this.isStageSolving = false;
        this.rubik3D.animationSpeed = this.savedNormalSpeed || 300;
        this.updateCoachUI();
      } else {
        const remaining = this.rubik3D.animationQueue.length;
        if (this.coachStageBadge) {
          this.coachStageBadge.innerHTML = `🏁 <span class="badge-lbl">${i18n.t('coach_remaining_moves', { count: remaining })}</span>`;
        }
      }
    } else if (isQueueEmpty) {
      this.rubik3D.animationSpeed = this.savedNormalSpeed || 300;
      this.updateCoachUI();
    }

    // Kiểm tra hoàn thành
    if (this.isScrambled && this.state.isSolved()) {
      this.stopTimer();
      this.isScrambled = false;
      this.statusBadge.innerHTML = '🎉 <span class="btn-lbl">' + i18n.t('status_completed') + '</span>';
      this.statusBadge.className = 'badge-tag badge-success';
      sound.playVictory();
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }

  showToast(message) {
    let toast = document.getElementById('rubik-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'rubik-toast';
      toast.className = 'rubik-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(this._toastTimeout);
    this._toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2200);
  }

  updateAllViews() {
    this.mandala.update();
    if (this.dartboard) {
      this.dartboard.update();
    }
    this.rubik3D.updateMirrors();
  }

  set2DViewMode(mode) {
    this.current2DMode = mode;
    if (this.tabMandala) this.tabMandala.classList.toggle('active', mode === 'mandala');
    if (this.tabDartboard) this.tabDartboard.classList.toggle('active', mode === 'dartboard');
    if (this.tabDual) this.tabDual.classList.toggle('active', mode === 'dual');

    if (mode === 'dual') {
      if (this.mandalaViewportsWrapper) {
        this.mandalaViewportsWrapper.classList.add('dual-mode');
      }
      if (this.mandalaContainer) this.mandalaContainer.style.display = 'flex';
      if (this.dartboardContainer) this.dartboardContainer.style.display = 'flex';
      if (this.mandala) this.mandala.update();
      if (this.dartboard) this.dartboard.update();
    } else if (mode === 'dartboard') {
      if (this.mandalaViewportsWrapper) {
        this.mandalaViewportsWrapper.classList.remove('dual-mode');
      }
      if (this.mandalaContainer) this.mandalaContainer.style.display = 'none';
      if (this.dartboardContainer) this.dartboardContainer.style.display = 'flex';
      if (this.dartboard) this.dartboard.update();
    } else {
      // mode === 'mandala'
      if (this.mandalaViewportsWrapper) {
        this.mandalaViewportsWrapper.classList.remove('dual-mode');
      }
      if (this.mandalaContainer) this.mandalaContainer.style.display = 'flex';
      if (this.dartboardContainer) this.dartboardContainer.style.display = 'none';
      if (this.mandala) this.mandala.update();
    }

    if (this.mandalaHint) {
      this.mandalaHint.innerHTML = i18n.t('mandala_hint');
    }

    localStorage.setItem('rubik_pref_2d_mode', mode);
  }

  getAutoSolveDuration() {
    const base = 180;
    const mult = this.prefs && this.prefs.autoSpeed ? this.prefs.autoSpeed : 1.0;
    return Math.max(45, Math.round(base / mult));
  }

  setAutoSpeed(multiplier) {
    const mult = Math.max(0.25, Math.min(3.0, parseFloat(multiplier) || 1.0));
    if (!this.prefs) this.prefs = {};
    this.prefs.autoSpeed = mult;

    if (this.sliderAutoSpeed) {
      this.sliderAutoSpeed.value = mult;
    }
    if (this.speedValueBadge) {
      const text = `${parseFloat(mult.toFixed(2))}x`;
      this.speedValueBadge.textContent = text;
    }
    if (this.speedPresetBtns) {
      this.speedPresetBtns.forEach(btn => {
        const btnSpeed = parseFloat(btn.getAttribute('data-speed'));
        btn.classList.toggle('active', Math.abs(btnSpeed - mult) < 0.05);
      });
    }
    localStorage.setItem('rubik_pref_auto_speed', mult);

    // Nếu đang trong tiến trình tự giải, cập nhật animationSpeed ngay lập tức
    if (this.isAutoSolving || this.isStageSolving) {
      if (this.rubik3D) {
        this.rubik3D.animationSpeed = this.getAutoSolveDuration();
      }
    }
  }

  scramble() {
    this.stopTimer();
    this.resetTimerDisplay();
    this.moveCount = 0;
    this.moveCountEl.textContent = '0';
    this.isScrambled = true;
    this.isAutoSolving = false;
    this.isStageSolving = false;
    this.isScrambling = true;
    this.coachUndoStack = [];
    this.lastCoachStage = 0;
    this.currentCoachMoves = [];
    if (this.btnCoachUndo) {
      this.btnCoachUndo.disabled = true;
    }
    if (this.btnCoachAuto) {
      this.btnCoachAuto.innerHTML = '⚡ <span class="btn-lbl">' + i18n.t('btn_auto_solve') + '</span>';
      this.btnCoachAuto.classList.add('primary');
    }

    this.statusBadge.innerHTML = '⏳ <span class="btn-lbl">' + i18n.t('status_solving') + '</span>';
    this.statusBadge.className = 'badge-tag badge-warning';

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
    this.isStageSolving = false;
    this.isScrambling = false;
    this.coachUndoStack = [];
    this.lastCoachStage = 0;
    this.currentCoachMoves = [];
    if (this.btnCoachUndo) {
      this.btnCoachUndo.disabled = true;
    }
    if (this.btnCoachAuto) {
      this.btnCoachAuto.innerHTML = '⚡ <span class="btn-lbl">' + i18n.t('btn_auto_solve') + '</span>';
      this.btnCoachAuto.classList.add('primary');
    }

    this.state.reset();
    this.rubik3D.resetCube();
    this.updateAllViews();
    this.updateCoachUI();

    this.statusBadge.innerHTML = '🟢 <span class="btn-lbl">' + i18n.t('status_solved') + '</span>';
    this.statusBadge.className = 'badge-tag';
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

    if (this.btnPlayDemo) {
      const lbl = stepIdx >= formula.sequence.length ? i18n.t('btn_replay_demo') : i18n.t('btn_play_demo');
      this.btnPlayDemo.innerHTML = `▶ <span class="btn-lbl">${lbl}</span>`;
    }
  }

  updateCoachUI() {
    if (!this.coachStageBadge) return;

    // 1. Nếu hàng đợi vẫn còn nước đi (người dùng đang xoay dở chuỗi công thức của bước hiện tại):
    // Các nước đi trung gian tạm thời làm lệch một số viên (VD: xoay L nhấc cạnh trắng).
    // Tuyệt đối KHÔNG phân tích lại trạng thái và KHÔNG ghi đè hàng đợi khi hàng đợi chưa đi hết!
    if (this.currentCoachMoves && this.currentCoachMoves.length > 0) {
      this.renderCoachMovePills();
      if (this.btnCoachUndo) {
        this.btnCoachUndo.disabled = (this.coachUndoStack.length === 0);
      }
      return;
    }

    // 2. Khi hàng đợi đã đi hết (currentCoachMoves.length === 0):
    // Khối Rubik đã hoàn tất chuỗi công thức và trở về trạng thái ổn định.
    // Lúc này phân tích lại trạng thái 54 ô màu của khối:
    const analysis = this.coach.analyze(this.state);

    // Ăn mừng khi tiến sang bước mới
    if (this.lastCoachStage > 0 && analysis.stage > this.lastCoachStage && analysis.stage <= 8) {
      sound.playVictory();
    }

    this.currentCoachMoves = analysis.moves ? [...analysis.moves] : [];
    this.lastCoachStage = analysis.stage;
    this.renderCoachFullUI(analysis);
  }

  renderCoachMovePills() {
    if (!this.coachSteps) return;
    this.coachSteps.innerHTML = '';
    if (!this.currentCoachMoves || this.currentCoachMoves.length === 0) {
      if (this.currentCoachAnalysis && this.currentCoachAnalysis.isSolved) {
        const span = document.createElement('span');
        span.className = 'coach-steps-badge';
        span.innerHTML = '✨ <span class="btn-lbl">' + i18n.t('coach_solved_pill') + '</span>';
        this.coachSteps.appendChild(span);
      }
      if (this.btnCoachAuto) this.btnCoachAuto.disabled = true;
      if (this.btnCoachStep) this.btnCoachStep.disabled = true;
      if (this.btnCoachStepInline) this.btnCoachStepInline.disabled = true;
      if (this.btnCoachStage) this.btnCoachStage.disabled = true;
    } else {
      this.currentCoachMoves.forEach((m, idx) => {
        const span = document.createElement('span');
        span.className = idx === 0 ? 'move-pill next-move' : 'move-pill';
        span.textContent = m;
        span.title = m;
        span.style.cursor = 'pointer';
        span.addEventListener('click', () => {
          this.executeMove(m);
        });
        this.coachSteps.appendChild(span);
      });
      if (this.btnCoachAuto) this.btnCoachAuto.disabled = false;
      if (this.btnCoachStep) this.btnCoachStep.disabled = false;
      if (this.btnCoachStepInline) this.btnCoachStepInline.disabled = false;
      if (this.btnCoachStage) this.btnCoachStage.disabled = false;
    }
  }

  renderCoachFullUI(analysis) {
    this.currentCoachAnalysis = analysis;

    // Cập nhật huy hiệu tiến trình 7 bước
    if (analysis.isSolved || analysis.stage === 8) {
      this.coachStageBadge.innerHTML = '🎉 <span class="badge-lbl">' + i18n.t('coach_completed') + '</span>';
      this.coachStageBadge.style.background = 'rgba(16, 185, 129, 0.2)';
      this.coachStageBadge.style.color = '#34d399';
      this.coachStageBadge.style.borderColor = 'rgba(16, 185, 129, 0.4)';
    } else {
      this.coachStageBadge.innerHTML = `🏁 <span class="badge-lbl">${i18n.t('coach_stage_prefix')}</span>${analysis.stage}${i18n.t('coach_step_of')}`;
      this.coachStageBadge.style.background = 'rgba(56, 189, 248, 0.15)';
      this.coachStageBadge.style.color = '#38bdf8';
      this.coachStageBadge.style.borderColor = 'rgba(56, 189, 248, 0.35)';
    }

    if (this.coachCaseName) {
      this.coachCaseName.textContent = analysis.caseName;
    }

    this.currentCoachFormulaId = analysis.formulaId || null;
    if (this.coachFormulaBadge) {
      if (analysis.formulaTag && !analysis.isSolved) {
        this.coachFormulaBadge.textContent = analysis.formulaTag;
        this.coachFormulaBadge.title = analysis.formulaId
          ? `${i18n.t('tab_formula')}: ${analysis.formulaTag}`
          : analysis.formulaTag;
        this.coachFormulaBadge.style.display = 'inline-flex';
      } else {
        this.coachFormulaBadge.style.display = 'none';
      }
    }

    if (this.coachHintText) {
      const fullHint = analysis.formula ? `${analysis.formula} — ${analysis.hint}` : analysis.hint;
      this.coachHintText.textContent = fullHint;
      this.coachHintText.title = fullHint;
    }

    this.renderCoachMovePills();

    if (this.btnCoachUndo) {
      this.btnCoachUndo.disabled = (this.coachUndoStack.length === 0);
    }
  }

  toggleAutoSolve() {
    if (this.isAutoSolving) {
      this.isAutoSolving = false;
      this.rubik3D.animationQueue = [];
      this.rubik3D.animationSpeed = this.savedNormalSpeed || 300;
      if (this.btnCoachAuto) {
        this.btnCoachAuto.innerHTML = '⚡ <span class="btn-lbl">' + i18n.t('btn_auto_solve') + '</span>';
        this.btnCoachAuto.classList.add('primary');
      }
      this.updateCoachUI();
      return;
    }

    if (this.state.isSolved()) return;

    const moves = this.state.solve();
    if (!moves || moves.length === 0) return;

    this.isAutoSolving = true;
    this.currentCoachMoves = [];
    if (this.btnCoachAuto) {
      this.btnCoachAuto.innerHTML = '⏸ <span class="btn-lbl">' + i18n.t('btn_auto_pause') + '</span>';
      this.btnCoachAuto.classList.remove('primary');
    }

    this.savedNormalSpeed = this.rubik3D.animationSpeed || 300;
    this.rubik3D.animationSpeed = this.getAutoSolveDuration();

    moves.forEach(m => {
      this.rubik3D.queueMove(m);
    });
    if (!this.timerRunning && this.isScrambled) {
      this.startTimer();
    }
  }

  stepSolve() {
    if (this.rubik3D.isAnimating || (this.rubik3D.animationQueue && this.rubik3D.animationQueue.length > 0)) return;
    if (this.state.isSolved()) return;

    if (!this.currentCoachMoves || this.currentCoachMoves.length === 0) {
      const analysis = this.coach.analyze(this.state);
      this.currentCoachMoves = analysis.moves ? [...analysis.moves] : [];
      this.lastCoachStage = analysis.stage;
      this.renderCoachFullUI(analysis);
    }

    if (!this.currentCoachMoves || this.currentCoachMoves.length === 0) return;

    const nextMove = this.currentCoachMoves[0];
    this.executeMove(nextMove);
  }

  stageSolve() {
    if (this.rubik3D.isAnimating || (this.rubik3D.animationQueue && this.rubik3D.animationQueue.length > 0)) return;
    if (this.state.isSolved()) return;

    const analysis = this.coach.analyze(this.state);
    const moves = analysis.moves;
    if (!moves || moves.length === 0) return;

    this.isStageSolving = true;
    this.currentCoachMoves = [];
    this.savedNormalSpeed = this.rubik3D.animationSpeed || 300;
    this.rubik3D.animationSpeed = this.getAutoSolveDuration();

    moves.forEach(m => {
      this.rubik3D.queueMove(m);
    });
    if (!this.timerRunning && this.isScrambled) {
      this.startTimer();
    }
  }

  undoCoachMove() {
    if (this.rubik3D.isAnimating || (this.rubik3D.animationQueue && this.rubik3D.animationQueue.length > 0)) return;
    if (this.coachUndoStack.length === 0) return;

    const lastMove = this.coachUndoStack.pop();
    const inv = lastMove.endsWith('2') ? lastMove : (lastMove.endsWith("'") ? lastMove.slice(0, -1) : lastMove + "'");

    this.executeMove(inv, true);
    if (this.btnCoachUndo) {
      this.btnCoachUndo.disabled = (this.coachUndoStack.length === 0);
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new App();
});
