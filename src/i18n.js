// ==========================================
// HỆ THỐNG ĐA NGÔN NGỮ QUỐC TẾ (i18n)
// Hỗ trợ: Tiếng Việt (vi), English (en), 日本語 (ja), 中文 (zh), Español (es)
// ==========================================

export const SUPPORTED_LANGUAGES = [
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'es', label: 'Español', flag: '🇪🇸' }
];

const TRANSLATIONS = {
  vi: {
    // Header
    app_title: 'Cyber Rubik 3D & 3 Vòng Tròn Đồng Tâm',
    logo_text: 'RUBIK 3D',
    status_solved: 'NGUYÊN BẢN',
    status_solving: 'ĐANG GIẢI',
    status_completed: 'HOÀN THÀNH!',
    stat_moves: 'BƯỚC:',
    stat_time: 'GIỜ:',
    btn_display: 'HIỂN THỊ',
    btn_scramble: 'Xáo Trộn',
    btn_scramble_title: 'Xáo trộn ngẫu nhiên Rubik',

    // Menu Con Mắt (Tùy chọn)
    popover_title: '👁️ TÙY CHỌN HIỂN THỊ',
    opt_rubik3d_title: '🧊 Khối Rubik 3D',
    opt_rubik3d_desc: 'Bật: Hiện mô phỏng 3D & gương | Tắt: 2D toàn màn hình',
    opt_labels_title: '🏷️ Nhãn chữ nút bấm',
    opt_labels_desc: 'Bật: Icon + Chữ | Tắt: Chỉ giữ Icon (Pro Mode)',
    opt_stats_title: '⏱️ Bộ đếm Bước & Thời gian',
    opt_stats_desc: 'Hiện thông số chơi game',
    opt_move_bar_title: '⌨️ Thanh 12 phím xoay',
    opt_move_bar_desc: 'Dải nút U, U\', D, D\', L, L\'...',
    opt_sound_title: '🔊 Âm thanh click',
    opt_sound_desc: 'Âm thanh click khi xoay khối',
    opt_auto_solve_title: '⚡ Nút Tự Giải Hết',
    opt_auto_solve_desc: 'Hiện nút máy tự xoay giải 6 mặt (Mặc định ẩn)',

    // Ngôn ngữ
    lang_select_title: '🌐 Chọn ngôn ngữ',

    // 3D & Gương
    mirror_chip: '🪞 Gương sau: <span style="color:#22c55e">B</span> | <span style="color:#e11d48">L</span> | <span style="color:#ffffff">D</span>',
    zoom_in_title: 'Phóng to (+)',
    zoom_out_title: 'Thu nhỏ (−)',
    play_thumb_title: 'Xoay đúng 1 nước tiếp theo (Nước đôi = bấm 2 lần)',
    play_thumb_label: '1 Nước',
    reset_view: 'RESET VIEW',
    reset_view_title: 'Đặt lại góc nhìn 3D chuẩn',
    reset_rubik: 'RESET RUBIK',
    reset_rubik_title: 'Khôi phục Rubik về nguyên bản 6 mặt',

    // 2D Mandala
    tab_mandala: '3 VÒNG TRÒN',
    tab_mandala_title: 'Bản đồ 3 Vòng Tròn Giao Điểm',
    tab_dartboard: 'HƯỚNG TÂM',
    tab_dartboard_title: 'Bản đồ Tròn Hướng Tâm (Bia Bắn 54 Ô)',
    mandala_hint: '💡 Chạm tâm: Thuận | Rìa: Nghịch',

    // Thanh điều khiển đáy
    tab_coach: 'GIA SƯ',
    tab_coach_title: 'Gia sư dạy xoay 6 mặt LBL 7 bước',
    tab_formula: 'MẪU',
    tab_formula_title: 'Thư viện công thức mẫu',
    formula_library_title: '📚 THƯ VIỆN CÔNG THỨC:',
    formula_library_default_desc: 'Chọn công thức để xem chi tiết',

    // Nút hành động đáy
    btn_stage_solve: 'Xong Bước',
    btn_stage_solve_title: 'Máy tự giải hoàn tất bước này rồi dừng lại',
    btn_auto_solve: 'Tự Giải',
    btn_auto_solve_title: 'Máy tự động xoay giải toàn bộ về đích 6 mặt',
    btn_auto_pause: 'Tạm Dừng',
    btn_auto_full: 'Tự Giải Hết',
    btn_undo: 'Hoàn Tác',
    btn_undo_title: 'Hoàn tác lại nước vừa xoay',
    btn_step_next: 'Bước',
    btn_step_next_title: 'Đi từng bước',
    btn_play_demo: 'Chạy',
    btn_play_demo_title: 'Chạy mẫu tự động',
    btn_replay_demo: 'Chạy Lại',
    btn_reset_formula: 'Lại',
    btn_reset_formula_title: 'Đặt lại',

    // Gia sư LBL 7 bước
    coach_initial_case: 'Khối Đang Nguyên Bản',
    coach_initial_hint: 'Bấm "Xáo Trộn" góc trên để bắt đầu',
    coach_stage_prefix: 'BƯỚC ',
    coach_step_of: '/7',
    coach_remaining_moves: 'CÒN {count} NƯỚC',
    coach_completed: 'HOÀN THÀNH',
    coach_solved_banner: '6 Mặt Đã Hoàn Hảo',
    coach_solved_pill: '6 Mặt Hoàn Hảo',
    coach_solved_formula: '🎉 Xuất Sắc!',
    coach_solved_hint: 'Tuyệt vời! Toàn bộ khối Rubik đã về đích hoàn tất.',

    // Chi tiết từng bước
    stage1_name: 'Bước 1/7: Dấu Cộng Trắng Đáy ({count}/4 cạnh)',
    stage1_tag: 'Mẫu: Cạnh Trắng Đáy',
    stage1_formula: 'Hoa cúc 🌼 hoặc đưa trực tiếp về đáy D',
    stage1_hint: 'Khớp màu 4 cạnh trắng với 4 tâm bên rồi đưa về đáy D. Bấm [⏭ Xong Bước] để máy giải xong Dấu Cộng.',

    stage2_name: 'Bước 2/7: 4 Góc Trắng Tầng 1',
    stage2_tag: 'Mẫu: Sexy Move (R U R\' U\')',
    stage2_formula: 'R U R\' U\' (Sexy Move)',
    stage2_hint: 'Ngữ cảnh: Đưa góc trắng lên tầng 3 ngay trên khe đích, xoay R U R\' U\' 1-5 lần. Bấm [⏭ Xong Bước] để giải xong Tầng 1.',

    stage3_name: 'Bước 3/7: 4 Cạnh Tầng 2 (F2L)',
    stage3_tag: 'Mẫu: Ghép Cạnh Tầng 2',
    stage3_formula: 'Phải: U R U\' R\' U\' F\' U F | Trái: U\' L\' U L U F U\' F\'',
    stage3_hint: 'Ngữ cảnh: Tìm cạnh không có màu vàng ở tầng 3, khớp màu tâm trước rồi ghép sang phải hoặc trái. Bấm [⏭ Xong Bước] để giải xong Tầng 2.',

    stage4_name: 'Bước 4/7: Dấu Cộng Vàng Đỉnh ({caseDesc})',
    stage4_tag: 'Mẫu: Dấu Cộng Vàng (F R U R\' U\' F\')',
    stage4_formula: 'F R U R\' U\' F\'',
    stage4_hint: 'Ngữ cảnh: Đỉnh U là Chấm Vàng / Chữ L ngược / Vạch Ngang. Áp dụng F R U R\' U\' F\' để chuyển thành Dấu Cộng Vàng. Bấm [⏭ Xong Bước] để giải xong.',
    case_dot: 'Chấm Vàng',
    case_hook: 'Chữ L Ngược',
    case_line: 'Vạch Ngang',

    stage5_name: 'Bước 5/7: Khớp Màu Cạnh Đỉnh (Sune)',
    stage5_tag: 'Mẫu: Sune Khớp Cạnh',
    stage5_formula: 'R U R\' U R U2 R\' U',
    stage5_hint: 'Ngữ cảnh: Đã có dấu cộng vàng. Xoay U tìm 2 cạnh khớp màu tâm, để ở sau-phải rồi dùng Sune để khớp cả 4 cạnh. Bấm [⏭ Xong Bước] để hoàn tất.',

    stage6_name: 'Bước 6/7: Định Vị 4 Góc Đỉnh (Niklas)',
    stage6_tag: 'Mẫu: Niklas Định Vị Góc',
    stage6_formula: 'U R U\' L\' U R\' U\' L',
    stage6_hint: 'Ngữ cảnh: 4 cạnh đã khớp. Tìm 1 góc đúng vị trí để ở trước-phải rồi áp dụng Niklas để hoán vị 3 góc còn lại. Bấm [⏭ Xong Bước] để hoàn tất.',

    stage7_name: 'Bước 7/7: Lật Góc Vàng Về Đích',
    stage7_tag: 'Mẫu: Lật Góc Vàng (R\' D\' R D)',
    stage7_formula: 'R\' D\' R D (lặp lại cho từng góc)',
    stage7_hint: 'Ngữ cảnh: Để góc vàng chưa lật ở trước-phải, lặp R\' D\' R D đến khi vàng ngửa lên, xoay U\' đổi góc tiếp theo. Bấm [⏭ Xong Bước] để về đích.'
  },

  en: {
    // Header
    app_title: 'Cyber Rubik 3D & Concentric Flat Circles',
    logo_text: 'RUBIK 3D',
    status_solved: 'SOLVED',
    status_solving: 'SOLVING',
    status_completed: 'COMPLETED!',
    stat_moves: 'MOVES:',
    stat_time: 'TIME:',
    btn_display: 'VIEW',
    btn_scramble: 'Scramble',
    btn_scramble_title: 'Randomly scramble the Rubik\'s cube',

    // Display Popover
    popover_title: '👁️ DISPLAY PREFERENCES',
    opt_rubik3d_title: '🧊 3D Rubik Cube',
    opt_rubik3d_desc: 'On: Show 3D cube & mirrors | Off: Fullscreen 2D',
    opt_labels_title: '🏷️ Button text labels',
    opt_labels_desc: 'On: Icon + Text | Off: Icons only (Pro Mode)',
    opt_stats_title: '⏱️ Move & Time stats',
    opt_stats_desc: 'Show game timer and move counter',
    opt_move_bar_title: '⌨️ 12-key rotation bar',
    opt_move_bar_desc: 'Buttons for U, U\', D, D\', L, L\'...',
    opt_sound_title: '🔊 Click sound effects',
    opt_sound_desc: 'Audio feedback when rotating faces',
    opt_auto_solve_title: '⚡ Full Auto-Solve button',
    opt_auto_solve_desc: 'Show 20-move Kociemba auto-solver (Hidden by default)',

    // Language
    lang_select_title: '🌐 Select Language',

    // 3D & Mirrors
    mirror_chip: '🪞 Back mirrors: <span style="color:#22c55e">B</span> | <span style="color:#e11d48">L</span> | <span style="color:#ffffff">D</span>',
    zoom_in_title: 'Zoom in (+)',
    zoom_out_title: 'Zoom out (−)',
    play_thumb_title: 'Execute next move (Double move L2 = tap twice)',
    play_thumb_label: '1 Move',
    reset_view: 'RESET VIEW',
    reset_view_title: 'Reset standard 3D camera angle',
    reset_rubik: 'RESET RUBIK',
    reset_rubik_title: 'Reset Rubik to pristine solved state',

    // 2D Mandala
    tab_mandala: '3 RINGS',
    tab_mandala_title: '3-Ring Intersecting Flat Map',
    tab_dartboard: 'DARTBOARD',
    tab_dartboard_title: 'Radial 54-Sticker Dartboard View',
    mandala_hint: '💡 Tap center: Clockwise | Outer ring: Counter-clockwise',

    // Bottom toolbar
    tab_coach: 'COACH',
    tab_coach_title: 'AI Coach 7-Step LBL Tutorial',
    tab_formula: 'FORMULAS',
    tab_formula_title: 'Formula template library',
    formula_library_title: '📚 FORMULA LIBRARY:',
    formula_library_default_desc: 'Select a formula to view its pattern',

    // Action buttons
    btn_stage_solve: 'Solve Step',
    btn_stage_solve_title: 'Automatically finish this step and stop',
    btn_auto_solve: 'Auto Solve',
    btn_auto_solve_title: 'Fully solve all 6 faces to the finish line',
    btn_auto_pause: 'Pause',
    btn_auto_full: 'Solve All',
    btn_undo: 'Undo',
    btn_undo_title: 'Undo last move',
    btn_step_next: 'Step',
    btn_step_next_title: 'Step through moves',
    btn_play_demo: 'Play',
    btn_play_demo_title: 'Play animated demo',
    btn_replay_demo: 'Replay',
    btn_reset_formula: 'Reset',
    btn_reset_formula_title: 'Reset formula',

    // 7-Stage LBL Coach
    coach_initial_case: 'Pristine Solved State',
    coach_initial_hint: 'Click "Scramble" at top to start',
    coach_stage_prefix: 'STEP ',
    coach_step_of: '/7',
    coach_remaining_moves: '{count} MOVES LEFT',
    coach_completed: 'COMPLETED',
    coach_solved_banner: 'All 6 Faces Perfectly Solved',
    coach_solved_pill: '6 Faces Solved',
    coach_solved_formula: '🎉 Excellent!',
    coach_solved_hint: 'Bravo! The entire Rubik\'s cube is completely solved.',

    // Stages details
    stage1_name: 'Step 1/7: Bottom White Cross ({count}/4 edges)',
    stage1_tag: 'Formula: White Cross',
    stage1_formula: 'Daisy method 🌼 or direct insertion to D',
    stage1_hint: 'Match 4 white edges with side centers on D face. Click [⏭ Solve Step] to complete White Cross.',

    stage2_name: 'Step 2/7: 4 First-Layer White Corners',
    stage2_tag: 'Formula: Sexy Move (R U R\' U\')',
    stage2_formula: 'R U R\' U\' (Sexy Move)',
    stage2_hint: 'Context: Place white corner on layer 3 above target slot, repeat R U R\' U\' 1-5 times. Click [⏭ Solve Step] to finish Layer 1.',

    stage3_name: 'Step 3/7: 4 Middle Layer Edges (F2L)',
    stage3_tag: 'Formula: F2L Edge Insertion',
    stage3_formula: 'Right: U R U\' R\' U\' F\' U F | Left: U\' L\' U L U F U\' F\'',
    stage3_hint: 'Context: Match layer 3 non-yellow edge with front center, insert right or left. Click [⏭ Solve Step] to finish Layer 2.',

    stage4_name: 'Step 4/7: Top Yellow Cross ({caseDesc})',
    stage4_tag: 'Formula: Yellow Cross (F R U R\' U\' F\')',
    stage4_formula: 'F R U R\' U\' F\'',
    stage4_hint: 'Context: Top U is Dot / Inverted L / Horizontal Line. Apply F R U R\' U\' F\' to create Yellow Cross. Click [⏭ Solve Step] to finish.',
    case_dot: 'Dot',
    case_hook: 'Inverted L',
    case_line: 'Line',

    stage5_name: 'Step 5/7: Align Yellow Edges (Sune)',
    stage5_tag: 'Formula: Sune Edge Alignment',
    stage5_formula: 'R U R\' U R U2 R\' U',
    stage5_hint: 'Context: Yellow cross ready. Rotate U to find 2 matched edges, hold back-right and run Sune to match all 4. Click [⏭ Solve Step] to finish.',

    stage6_name: 'Step 6/7: Position Yellow Corners (Niklas)',
    stage6_tag: 'Formula: Niklas Corner Permutation',
    stage6_formula: 'U R U\' L\' U R\' U\' L',
    stage6_hint: 'Context: 4 edges aligned. Keep 1 correct corner at front-right, run Niklas to cycle the other 3. Click [⏭ Solve Step] to finish.',

    stage7_name: 'Step 7/7: Orient Yellow Corners',
    stage7_tag: 'Formula: Orient Corners (R\' D\' R D)',
    stage7_formula: 'R\' D\' R D (repeat per corner)',
    stage7_hint: 'Context: Hold unsolved corner at front-right, repeat R\' D\' R D until yellow faces up, rotate U\' for next. Click [⏭ Solve Step] to finish.'
  },

  ja: {
    // Header
    app_title: 'サイバールービック 3D & 同心円フラットマップ',
    logo_text: 'ルービック 3D',
    status_solved: '完成状態',
    status_solving: '攻略中',
    status_completed: '完成！',
    stat_moves: '手目:',
    stat_time: '時間:',
    btn_display: '表示設定',
    btn_scramble: 'シャッフル',
    btn_scramble_title: 'ルービックキューブをランダムに崩す',

    // Popover
    popover_title: '👁️ 表示オプション',
    opt_rubik3d_title: '🧊 3Dルービックキューブ',
    opt_rubik3d_desc: 'オン: 3Dキューブ表示 | オフ: 2D全画面',
    opt_labels_title: '🏷️ ボタンのテキスト表示',
    opt_labels_desc: 'ON: アイコン+文字 | OFF: アイコンのみ (Pro)',
    opt_stats_title: '⏱️ 手数 & タイム計測',
    opt_stats_desc: 'タイマーと手数の表示',
    opt_move_bar_title: '⌨️ 12キー回転バー',
    opt_move_bar_desc: 'U, U\', D, D\', L, L\'ボタンバー...',
    opt_sound_title: '🔊 操作効果音',
    opt_sound_desc: '回転時のクリック音',
    opt_auto_solve_title: '⚡ 完全自動解答ボタン',
    opt_auto_solve_desc: '20手以内のKociemba完全自動解答（初期値は非表示）',

    // Language
    lang_select_title: '🌐 言語選択',

    // 3D
    mirror_chip: '🪞 背面ミラー: <span style="color:#22c55e">B</span> | <span style="color:#e11d48">L</span> | <span style="color:#ffffff">D</span>',
    zoom_in_title: '拡大 (+)',
    zoom_out_title: '縮小 (−)',
    play_thumb_title: '次の1手を回転 (ダブル手L2 = 2回タップ)',
    play_thumb_label: '1手進む',
    reset_view: '視点リセット',
    reset_view_title: '標準3Dカメラ角度に戻す',
    reset_rubik: '初期状態に戻す',
    reset_rubik_title: '6面完成状態に復帰',

    // 2D
    tab_mandala: '3交差円',
    tab_mandala_title: '3つの同心円平面マップ',
    tab_dartboard: 'ターゲット',
    tab_dartboard_title: '54ピース同心円ダーツボード',
    mandala_hint: '💡 中心タップ: 時計回り | 外枠: 反時計回り',

    // Bottom
    tab_coach: 'コーチ',
    tab_coach_title: 'AI家庭教師 LBL 7ステップ解法',
    tab_formula: '公式集',
    tab_formula_title: '学習用公式テンプレート集',
    formula_library_title: '📚 ルービック公式集:',
    formula_library_default_desc: '公式を選択すると手順が表示されます',

    // Action
    btn_stage_solve: 'ステップ完了',
    btn_stage_solve_title: '現在のステップを自動完了して停止します',
    btn_auto_solve: '自動完成',
    btn_auto_solve_title: '全6面完成まで完全自動回転',
    btn_auto_pause: '一時停止',
    btn_auto_full: '全自動解答',
    btn_undo: '戻す',
    btn_undo_title: '直前の手を元に戻す',
    btn_step_next: '次手',
    btn_step_next_title: '1手ずつ実行',
    btn_play_demo: '再生',
    btn_play_demo_title: '自動再生',
    btn_replay_demo: '再実行',
    btn_reset_formula: 'リセット',
    btn_reset_formula_title: '公式リセット',

    // Coach LBL
    coach_initial_case: '原点完成状態',
    coach_initial_hint: '上の「シャッフル」を押してスタート',
    coach_stage_prefix: 'ステップ ',
    coach_step_of: '/7',
    coach_remaining_moves: '残り {count} 手',
    coach_completed: '全面完成！',
    coach_solved_banner: '6面すべて完璧に揃いました',
    coach_solved_pill: '6面完成',
    coach_solved_formula: '🎉 お見事です！',
    coach_solved_hint: '素晴らしい！すべての面が完成しました。',

    // Stages
    stage1_name: 'ステップ 1/7: 白クロス底面 ({count}/4エッジ)',
    stage1_tag: '公式: 白クロス形成',
    stage1_formula: 'デイジー🌼または直接D面に格納',
    stage1_hint: '白の4エッジを側面のセンター色と揃えてD面に配置します。[⏭ ステップ完了] で自動配置。',

    stage2_name: 'ステップ 2/7: 完全1層目 白コーナー',
    stage2_tag: '公式: セクシームーブ (R U R\' U\')',
    stage2_formula: 'R U R\' U\' (Sexy Move)',
    stage2_hint: 'コツ: 白コーナーを目的位置の真上(3層目)に置き、R U R\' U\' を1〜5回回します。[⏭ ステップ完了] で1層完成。',

    stage3_name: 'ステップ 3/7: 2層目中間エッジ (F2L)',
    stage3_tag: '公式: 2層目エッジ挿入',
    stage3_formula: '右: U R U\' R\' U\' F\' U F | 左: U\' L\' U L U F U\' F\'',
    stage3_hint: 'コツ: 3層目の黄色を含まないエッジを正面に合わせ、右または左へ格納します。[⏭ ステップ完了] で2層完成。',

    stage4_name: 'ステップ 4/7: 頂点 黄色クロス ({caseDesc})',
    stage4_tag: '公式: 黄色クロス (F R U R\' U\' F\')',
    stage4_formula: 'F R U R\' U\' F\'',
    stage4_hint: 'コツ: 点・逆L字・横バーの状態から F R U R\' U\' F\' を回して黄色クロスを作ります。',
    case_dot: '点',
    case_hook: '逆L字',
    case_line: '横バー',

    stage5_name: 'ステップ 5/7: 黄色エッジの色合わせ (Sune)',
    stage5_tag: '公式: スン・エッジ揃え',
    stage5_formula: 'R U R\' U R U2 R\' U',
    stage5_hint: 'コツ: U面を回して揃っている2辺を探し、右奥に置いてSuneを回し4辺を揃えます。',

    stage6_name: 'ステップ 6/7: 頂点4コーナー位置合わせ (Niklas)',
    stage6_tag: '公式: ニクラス コーナー移動',
    stage6_formula: 'U R U\' L\' U R\' U\' L',
    stage6_hint: 'コツ: 4エッジ完成後、合っている1コーナーを手前右に固定しNiklasで残り3つを交換します。',

    stage7_name: 'ステップ 7/7: 黄色コーナー向き合わせ',
    stage7_tag: '公式: コーナー向き合わせ (R\' D\' R D)',
    stage7_formula: 'R\' D\' R D (各コーナー毎に繰り返し)',
    stage7_hint: 'コツ: 未完成コーナーを手前右に置き、黄色が上を向くまで R\' D\' R D を繰り返し、U\' で次へ。'
  },

  zh: {
    // Header
    app_title: '赛博魔方 3D 与同心圆投影',
    logo_text: '魔方 3D',
    status_solved: '初始复原',
    status_solving: '求解中',
    status_completed: '恭喜完成！',
    stat_moves: '步数:',
    stat_time: '用时:',
    btn_display: '显示',
    btn_scramble: '打乱',
    btn_scramble_title: '随机打乱魔方',

    // Popover
    popover_title: '👁️ 显示偏好设置',
    opt_rubik3d_title: '🧊 3D魔方模型',
    opt_rubik3d_desc: '开启: 显示3D魔方与镜面 | 关闭: 2D全屏',
    opt_labels_title: '🏷️ 按钮文字标签',
    opt_labels_desc: '开启: 图标+文字 | 关闭: 仅图标 (极简极客模式)',
    opt_stats_title: '⏱️ 步数与计时器',
    opt_stats_desc: '显示步数和解题用时',
    opt_move_bar_title: '⌨️ 12个快捷旋转键',
    opt_move_bar_desc: '显示 U, U\', D, D\', L, L\' 按钮栏...',
    opt_sound_title: '🔊 操作音效',
    opt_sound_desc: '旋转魔方时的按键音效',
    opt_auto_solve_title: '⚡ 一键完全自动还原',
    opt_auto_solve_desc: '显示20步极速还原按钮 (默认隐藏)',

    // Language
    lang_select_title: '🌐 语言选择',

    // 3D
    mirror_chip: '🪞 背面镜像: <span style="color:#22c55e">B</span> | <span style="color:#e11d48">L</span> | <span style="color:#ffffff">D</span>',
    zoom_in_title: '放大 (+)',
    zoom_out_title: '缩小 (−)',
    play_thumb_title: '走下一步 (双步L2 = 连点2次)',
    play_thumb_label: '走1步',
    reset_view: '重置视角',
    reset_view_title: '重置3D标准视角',
    reset_rubik: '还原魔方',
    reset_rubik_title: '一键恢复6面初始状态',

    // 2D
    tab_mandala: '3相交圆',
    tab_mandala_title: '3相交圆平面展开图',
    tab_dartboard: '同心靶盘',
    tab_dartboard_title: '54色块径向同心靶盘',
    mandala_hint: '💡 轻触中心: 顺时针 | 外圈: 逆时针',

    // Bottom
    tab_coach: 'AI导师',
    tab_coach_title: 'AI分步导师 LBL 七步教学',
    tab_formula: '公式库',
    tab_formula_title: '经典复原公式库',
    formula_library_title: '📚 经典公式库:',
    formula_library_default_desc: '选择公式即可查看演示步骤',

    // Action
    btn_stage_solve: '完成本步',
    btn_stage_solve_title: '自动完成当前阶段并暂停',
    btn_auto_solve: '自动还原',
    btn_auto_solve_title: '全自动旋转直至六面复原',
    btn_auto_pause: '暂停',
    btn_auto_full: '完全复原',
    btn_undo: '撤销',
    btn_undo_title: '撤销上一步操作',
    btn_step_next: '单步',
    btn_step_next_title: '单步运行演示',
    btn_play_demo: '播放',
    btn_play_demo_title: '自动演示公式',
    btn_replay_demo: '重播',
    btn_reset_formula: '重置',
    btn_reset_formula_title: '重置公式',

    // Coach LBL
    coach_initial_case: '六面已复原',
    coach_initial_hint: '点击上方“打乱”按钮即可开始学习',
    coach_stage_prefix: '第 ',
    coach_step_of: '/7 步',
    coach_remaining_moves: '还剩 {count} 步',
    coach_completed: '圆满复原',
    coach_solved_banner: '六面完全复原！',
    coach_solved_pill: '六面复原',
    coach_solved_formula: '🎉 太棒了！',
    coach_solved_hint: '祝贺你！整个魔方已经完美复原。',

    // Stages
    stage1_name: '第 1/7 步: 底层白色十字 ({count}/4棱块)',
    stage1_tag: '公式: 底层白十字',
    stage1_formula: '小雏菊法 🌼 或直接归位到底层D面',
    stage1_hint: '将4个白棱块对准侧面中心色并移至D面。点击 [⏭ 完成本步] 自动复原十字。',

    stage2_name: '第 2/7 步: 底层4个白色角块',
    stage2_tag: '公式: 连招 (R U R\' U\')',
    stage2_formula: 'R U R\' U\' (Sexy Move)',
    stage2_hint: '要领: 将白色角块移至目标槽位上方(顶层)，重复 R U R\' U\' 1-5次入槽。点击 [⏭ 完成本步] 完成第一层。',

    stage3_name: '第 3/7 步: 中间层4个棱块 (F2L)',
    stage3_tag: '公式: 中层棱块归位',
    stage3_formula: '向右: U R U\' R\' U\' F\' U F | 向左: U\' L\' U L U F U\' F\'',
    stage3_hint: '要领: 找到顶层不含黄色的棱块，对齐正面中心色后向右或向左入槽。点击 [⏭ 完成本步] 完成第二层。',

    stage4_name: '第 4/7 步: 顶层黄色十字 ({caseDesc})',
    stage4_tag: '公式: 顶层黄十字 (F R U R\' U\' F\')',
    stage4_formula: 'F R U R\' U\' F\'',
    stage4_hint: '要领: 点、小拐弯或一字状态下，执行 F R U R\' U\' F\' 变为黄色十字。点击 [⏭ 完成本步] 完成。',
    case_dot: '中心点',
    case_hook: '拐角',
    case_line: '一字线',

    stage5_name: '第 5/7 步: 对齐顶层棱块侧色 (Sune)',
    stage5_tag: '公式: 小鱼公式 Sune',
    stage5_formula: 'R U R\' U R U2 R\' U',
    stage5_hint: '要领: 转动U层找到2个对齐的棱块，置于后右方运行 Sune 对齐全部4棱。点击 [⏭ 完成本步] 完成。',

    stage6_name: '第 6/7 步: 顶层4角块位置归位 (Niklas)',
    stage6_tag: '公式: 换角公式 Niklas',
    stage6_formula: 'U R U\' L\' U R\' U\' L',
    stage6_hint: '要领: 4棱已对齐后，保留1个正确角块在右前方，运行 Niklas 交换剩余3角。点击 [⏭ 完成本步] 完成。',

    stage7_name: '第 7/7 步: 翻转黄色角块朝向',
    stage7_tag: '公式: 角块翻色 (R\' D\' R D)',
    stage7_formula: 'R\' D\' R D (每个角块循环)',
    stage7_hint: '要领: 将未翻正角块置于右前方，连做 R\' D\' R D 直至黄色朝上，转 U\' 换下一个角块。点击 [⏭ 完成本步] 终结复原。'
  },

  es: {
    // Header
    app_title: 'Cyber Rubik 3D y Círculos Concéntricos Planos',
    logo_text: 'RUBIK 3D',
    status_solved: 'RESUELTO',
    status_solving: 'RESOLVIENDO',
    status_completed: '¡COMPLETADO!',
    stat_moves: 'MOV:',
    stat_time: 'TIEMPO:',
    btn_display: 'VER',
    btn_scramble: 'Mezclar',
    btn_scramble_title: 'Mezclar cubo de Rubik aleatoriamente',

    // Popover
    popover_title: '👁️ OPCIONES DE VISUALIZACIÓN',
    opt_rubik3d_title: '🧊 Cubo Rubik 3D',
    opt_rubik3d_desc: 'Activar: Mostrar 3D y espejos | Desactivar: 2D pantalla completa',
    opt_labels_title: '🏷️ Etiquetas de botones',
    opt_labels_desc: 'Activado: Icono + Texto | Desactivado: Solo icono (Pro)',
    opt_stats_title: '⏱️ Contador de movimientos y tiempo',
    opt_stats_desc: 'Mostrar estadísticas de juego',
    opt_move_bar_title: '⌨️ Barra de 12 giros',
    opt_move_bar_desc: 'Botones U, U\', D, D\', L, L\'...',
    opt_sound_title: '🔊 Sonido de giros',
    opt_sound_desc: 'Efectos de sonido al rotar caras',
    opt_auto_solve_title: '⚡ Botón Auto-Resolución total',
    opt_auto_solve_desc: 'Mostrar botón de resolución en 20 movimientos (Oculto por defecto)',

    // Language
    lang_select_title: '🌐 Seleccionar idioma',

    // 3D
    mirror_chip: '🪞 Espejos traseros: <span style="color:#22c55e">B</span> | <span style="color:#e11d48">L</span> | <span style="color:#ffffff">D</span>',
    zoom_in_title: 'Acercar (+)',
    zoom_out_title: 'Alejar (−)',
    play_thumb_title: 'Girar 1 movimiento siguiente (Doble L2 = pulsar 2 veces)',
    play_thumb_label: '1 Mov',
    reset_view: 'RESET VISTA',
    reset_view_title: 'Restablecer ángulo 3D estándar',
    reset_rubik: 'RESET CUBO',
    reset_rubik_title: 'Restablecer cubo a estado resuelto',

    // 2D
    tab_mandala: '3 CÍRCULOS',
    tab_mandala_title: 'Mapa plano de 3 círculos intersecantes',
    tab_dartboard: 'DIANA',
    tab_dartboard_title: 'Diana radial de 54 pegatinas',
    mandala_hint: '💡 Toque centro: Horario | Borde: Antihorario',

    // Bottom
    tab_coach: 'TUTOR',
    tab_coach_title: 'Tutor IA LBL en 7 pasos',
    tab_formula: 'FÓRMULAS',
    tab_formula_title: 'Biblioteca de fórmulas',
    formula_library_title: '📚 BIBLIOTECA DE FÓRMULAS:',
    formula_library_default_desc: 'Selecciona una fórmula para ver el tutorial',

    // Action
    btn_stage_solve: 'Resolver Paso',
    btn_stage_solve_title: 'Completar automáticamente este paso y detenerse',
    btn_auto_solve: 'Auto Resolver',
    btn_auto_solve_title: 'Resolver automáticamente las 6 caras',
    btn_auto_pause: 'Pausa',
    btn_auto_full: 'Resolver Todo',
    btn_undo: 'Deshacer',
    btn_undo_title: 'Deshacer último giro',
    btn_step_next: 'Paso',
    btn_step_next_title: 'Avanzar paso a paso',
    btn_play_demo: 'Play',
    btn_play_demo_title: 'Reproducir demo automática',
    btn_replay_demo: 'Repetir',
    btn_reset_formula: 'Reiniciar',
    btn_reset_formula_title: 'Reiniciar fórmula',

    // Coach LBL
    coach_initial_case: 'Estado Inicial Resuelto',
    coach_initial_hint: 'Pulsa "Mezclar" arriba para comenzar',
    coach_stage_prefix: 'PASO ',
    coach_step_of: '/7',
    coach_remaining_moves: 'QUEDAN {count} MOV',
    coach_completed: '¡COMPLETADO!',
    coach_solved_banner: 'Las 6 caras resueltas con éxito',
    coach_solved_pill: '6 Caras Resueltas',
    coach_solved_formula: '🎉 ¡Excelente!',
    coach_solved_hint: '¡Maravilloso! Todo el cubo de Rubik ha sido resuelto.',

    // Stages
    stage1_name: 'Paso 1/7: Cruz Blanca Inferior ({count}/4 aristas)',
    stage1_tag: 'Fórmula: Cruz Blanca',
    stage1_formula: 'Margarita 🌼 o inserción directa en D',
    stage1_hint: 'Alinea 4 aristas blancas con los centros laterales en D. Pulsa [⏭ Resolver Paso] para completar la cruz.',

    stage2_name: 'Paso 2/7: 4 Esquinas Blancas Primera Capa',
    stage2_tag: 'Fórmula: Sexy Move (R U R\' U\')',
    stage2_formula: 'R U R\' U\' (Sexy Move)',
    stage2_hint: 'Contexto: Coloca esquina blanca en capa 3 sobre ranura destino, repite R U R\' U\' 1-5 veces. Pulsa [⏭ Resolver Paso] para terminar capa 1.',

    stage3_name: 'Paso 3/7: 4 Aristas Capa Media (F2L)',
    stage3_tag: 'Fórmula: Inserción Aristas F2L',
    stage3_formula: 'Der: U R U\' R\' U\' F\' U F | Izq: U\' L\' U L U F U\' F\'',
    stage3_hint: 'Contexto: Busca arista sin amarillo en capa 3, alinea centro frontal e inserta a der/izq. Pulsa [⏭ Resolver Paso] para terminar capa 2.',

    stage4_name: 'Paso 4/7: Cruz Amarilla Superior ({caseDesc})',
    stage4_tag: 'Fórmula: Cruz Amarilla (F R U R\' U\' F\')',
    stage4_formula: 'F R U R\' U\' F\'',
    stage4_hint: 'Contexto: Capa U tiene punto / L invertida / línea. Aplica F R U R\' U\' F\' para formar la cruz amarilla. Pulsa [⏭ Resolver Paso].',
    case_dot: 'Punto',
    case_hook: 'L Invertida',
    case_line: 'Línea',

    stage5_name: 'Paso 5/7: Alinear Aristas Amarillas (Sune)',
    stage5_tag: 'Fórmula: Sune Alinear Aristas',
    stage5_formula: 'R U R\' U R U2 R\' U',
    stage5_hint: 'Contexto: Cruz amarilla lista. Gira U para hallar 2 aristas alineadas, ubica atrás-derecha y corre Sune. Pulsa [⏭ Resolver Paso].',

    stage6_name: 'Paso 6/7: Posicionar 4 Esquinas (Niklas)',
    stage6_tag: 'Fórmula: Niklas Permutar Esquinas',
    stage6_formula: 'U R U\' L\' U R\' U\' L',
    stage6_hint: 'Contexto: Aristas alineadas. Mantén 1 esquina correcta al frente-derecha y corre Niklas para ciclar las 3 restantes. Pulsa [⏭ Resolver Paso].',

    stage7_name: 'Paso 7/7: Orientar Esquinas Amarillas',
    stage7_tag: 'Fórmula: Orientar Esquinas (R\' D\' R D)',
    stage7_formula: 'R\' D\' R D (repetir por esquina)',
    stage7_hint: 'Contexto: Ranura no orientada al frente-derecha, corre R\' D\' R D hasta que mire amarillo arriba, gira U\' para la siguiente.'
  }
};

class I18nManager {
  constructor() {
    this.currentLang = 'vi';
    this.listeners = [];
  }

  init() {
    this.currentLang = this.detectLanguage();
    this.applyDOM();

    // Nếu người dùng chưa từng chọn thủ công, thử định vị IP bất đồng bộ để tối ưu hơn nữa
    if (!localStorage.getItem('rubik_lang')) {
      this.detectCountryByIP().then(ipLang => {
        if (ipLang && ipLang !== this.currentLang && !localStorage.getItem('rubik_lang')) {
          this.setLanguage(ipLang, false);
        }
      });
    }
  }

  detectLanguage() {
    // 1. Kiểm tra lựa chọn đã lưu trong localStorage
    const saved = localStorage.getItem('rubik_lang');
    if (saved && TRANSLATIONS[saved]) {
      return saved;
    }

    // 2. Kiểm tra cài đặt ngôn ngữ trình duyệt / thiết bị (0ms latency)
    const navLangs = navigator.languages || [navigator.language || ''];
    for (const l of navLangs) {
      if (!l) continue;
      const lower = l.toLowerCase();
      if (lower.startsWith('vi')) return 'vi';
      if (lower.startsWith('ja')) return 'ja';
      if (lower.startsWith('zh')) return 'zh';
      if (lower.startsWith('es')) return 'es';
      if (lower.startsWith('en')) return 'en';
    }

    // Mặc định ban đầu nếu ở Việt Nam là vi, quốc tế là en
    return 'vi';
  }

  async detectCountryByIP() {
    try {
      // Dùng ipapi.co siêu nhẹ
      const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) });
      if (!res.ok) return null;
      const data = await res.json();
      const country = data.country_code || data.country;
      if (!country) return null;

      const c = country.toUpperCase();
      if (c === 'VN') return 'vi';
      if (c === 'JP') return 'ja';
      if (['CN', 'TW', 'HK', 'MO'].includes(c)) return 'zh';
      if (['ES', 'MX', 'AR', 'CO', 'CL', 'PE', 'VE', 'EC', 'GT', 'CU', 'BO', 'DO', 'HN', 'PY', 'SV', 'NI', 'CR', 'PA', 'UY', 'PR'].includes(c)) return 'es';
      return 'en';
    } catch {
      return null;
    }
  }

  setLanguage(langCode, saveToStorage = true) {
    if (!TRANSLATIONS[langCode]) return;
    this.currentLang = langCode;
    if (saveToStorage) {
      localStorage.setItem('rubik_lang', langCode);
    }
    document.documentElement.lang = langCode;
    this.applyDOM();
    this.emitChange();
  }

  t(key, params = {}) {
    const dict = TRANSLATIONS[this.currentLang] || TRANSLATIONS.vi;
    let str = dict[key] || TRANSLATIONS.en[key] || TRANSLATIONS.vi[key] || key;
    for (const [k, v] of Object.entries(params)) {
      str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
    }
    return str;
  }

  getLanguage() {
    return this.currentLang;
  }

  getLanguageMeta() {
    return SUPPORTED_LANGUAGES.find(l => l.code === this.currentLang) || SUPPORTED_LANGUAGES[0];
  }

  applyDOM() {
    document.title = this.t('app_title');

    // Cập nhật text cho các thẻ có thuộc tính data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) {
        el.textContent = this.t(key);
      }
    });

    // Cập nhật title tooltip cho các thẻ có thuộc tính data-i18n-title
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (key) {
        el.title = this.t(key);
      }
    });

    // Cập nhật HTML cho các thẻ có data-i18n-html
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      if (key) {
        el.innerHTML = this.t(key);
      }
    });
  }

  onChange(callback) {
    this.listeners.push(callback);
  }

  emitChange() {
    for (const cb of this.listeners) {
      try {
        cb(this.currentLang);
      } catch (e) {
        console.error('Error in i18n change listener:', e);
      }
    }
  }
}

export const i18n = new I18nManager();
