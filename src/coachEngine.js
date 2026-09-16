// Hệ thống Gia Sư Rubik 3D Thông Minh (LBL 7 Bước Chuẩn Sư Phạm)
// Giám sát toàn bộ 54 ô màu thời gian thực và hướng dẫn theo giáo trình Layer-by-Layer quốc tế

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
  }

  // Phân tích trạng thái 54 ô màu để xác định chính xác giai đoạn LBL hiện tại
  analyze(state) {
    if (state.isSolved()) {
      return {
        stage: 8,
        remainingCount: 0,
        badgeText: '🎉 HOÀN THÀNH',
        caseName: '6 Mặt Đã Hoàn Hảo',
        formula: '🎉 Xuất Sắc!',
        hint: 'Tuyệt vời! Toàn bộ khối Rubik đã về đích hoàn tất.',
        moves: [],
        stageMoves: [],
        isSolved: true,
        color: '#10b981'
      };
    }

    const s = state.cube.asString();

    // 1. Kiểm tra Bước 1: Dấu cộng trắng đáy (White Cross on D)
    // D-F: 28='D', 25='F' | D-R: 32='D', 16='R' | D-B: 34='D', 52='B' | D-L: 30='D', 43='L'
    const isWhiteCross = s[28] === 'D' && s[25] === 'F' &&
                         s[32] === 'D' && s[16] === 'R' &&
                         s[34] === 'D' && s[52] === 'B' &&
                         s[30] === 'D' && s[43] === 'L';

    if (!isWhiteCross) {
      let correctEdges = 0;
      if (s[28] === 'D' && s[25] === 'F') correctEdges++;
      if (s[32] === 'D' && s[16] === 'R') correctEdges++;
      if (s[34] === 'D' && s[52] === 'B') correctEdges++;
      if (s[30] === 'D' && s[43] === 'L') correctEdges++;

      const fullSolution = state.solve();
      const stageMoves = this._extractCrossMoves(state, fullSolution);

      return {
        stage: 1,
        remainingCount: fullSolution.length,
        badgeText: `🏁 BƯỚC 1/7`,
        caseName: `Bước 1/7: Dấu Cộng Trắng Đáy (${correctEdges}/4 cạnh)`,
        formula: 'Hoa cúc 🌼 hoặc đưa trực tiếp về tâm trắng',
        hint: `Đưa 4 viên cạnh trắng về đáy D khớp màu với tâm các mặt bên. Bấm [⏭ Xong Bước] để máy giải xong bước này.`,
        moves: stageMoves,
        fullMoves: fullSolution,
        isSolved: false,
        color: '#38bdf8'
      };
    }

    // 2. Kiểm tra Bước 2: 4 góc trắng tầng 1 (White Corners)
    // D corners: 27, 29, 33, 35 must be 'D'
    // F: 24, 26='F' | R: 15, 17='R' | B: 51, 53='B' | L: 42, 44='L'
    const isLayer1 = s[27] === 'D' && s[29] === 'D' && s[33] === 'D' && s[35] === 'D' &&
                     s[24] === 'F' && s[26] === 'F' &&
                     s[15] === 'R' && s[17] === 'R' &&
                     s[51] === 'B' && s[53] === 'B' &&
                     s[42] === 'L' && s[44] === 'L';

    if (!isLayer1) {
      const fullSolution = state.solve();
      const stageMoves = this._extractStageMovesUntil(state, fullSolution, (testState) => {
        const ts = testState.cube.asString();
        return ts[27] === 'D' && ts[29] === 'D' && ts[33] === 'D' && ts[35] === 'D' &&
               ts[24] === 'F' && ts[26] === 'F' && ts[15] === 'R' && ts[17] === 'R' &&
               ts[51] === 'B' && ts[53] === 'B' && ts[42] === 'L' && ts[44] === 'L';
      });

      return {
        stage: 2,
        remainingCount: fullSolution.length,
        badgeText: `🏁 BƯỚC 2/7`,
        caseName: `Bước 2/7: 4 Góc Trắng Tầng 1`,
        formula: "R U R' U' (Sexy Move)",
        hint: `Đưa góc trắng về phía trên vị trí cần chèn rồi lặp lại công thức R U R' U' từ 1-5 lần.`,
        moves: stageMoves,
        fullMoves: fullSolution,
        isSolved: false,
        color: '#38bdf8'
      };
    }

    // 3. Kiểm tra Bước 3: 4 cạnh tầng giữa (Tầng 2 - F2L cơ bản)
    // F-L: 21='F', 41='L' | F-R: 23='F', 12='R' | B-R: 50='B', 14='R' | B-L: 48='B', 39='L'
    const isLayer2 = s[21] === 'F' && s[41] === 'L' &&
                     s[23] === 'F' && s[12] === 'R' &&
                     s[50] === 'B' && s[14] === 'R' &&
                     s[48] === 'B' && s[39] === 'L';

    if (!isLayer2) {
      const fullSolution = state.solve();
      const stageMoves = this._extractStageMovesUntil(state, fullSolution, (testState) => {
        const ts = testState.cube.asString();
        return ts[21] === 'F' && ts[41] === 'L' && ts[23] === 'F' && ts[12] === 'R' &&
               ts[50] === 'B' && ts[14] === 'R' && ts[48] === 'B' && ts[39] === 'L';
      });

      return {
        stage: 3,
        remainingCount: fullSolution.length,
        badgeText: `🏁 BƯỚC 3/7`,
        caseName: `Bước 3/7: 4 Cạnh Tầng 2 (Giữa)`,
        formula: "Phải: U R U' R' U' F' U F | Trái: U' L' U L U F U' F'",
        hint: `Đưa cạnh không có màu vàng ở tầng 3 vào đúng khe tầng giữa bên phải hoặc trái.`,
        moves: stageMoves,
        fullMoves: fullSolution,
        isSolved: false,
        color: '#38bdf8'
      };
    }

    // 4. Kiểm tra Bước 4: Dấu cộng vàng đỉnh (Yellow Cross on U)
    // U edges: 1, 3, 5, 7 must be 'U'
    const isYellowCross = s[1] === 'U' && s[3] === 'U' && s[5] === 'U' && s[7] === 'U';

    if (!isYellowCross) {
      const yellowCount = [s[1], s[3], s[5], s[7]].filter(c => c === 'U').length;
      let caseDesc = 'Chấm Vàng';
      let recommendedFormula = ["F", "R", "U", "R'", "U'", "F'"];

      if (yellowCount === 2) {
        if (s[1] === 'U' && s[3] === 'U') {
          caseDesc = 'Chữ L Ngược (Góc sau-trái)';
          recommendedFormula = ["F", "U", "R", "U'", "R'", "F'"];
        } else if (s[3] === 'U' && s[5] === 'U') {
          caseDesc = 'Vạch Ngang (Ngang mặt)';
          recommendedFormula = ["F", "R", "U", "R'", "U'", "F'"];
        } else {
          caseDesc = 'Chữ L / Vạch vàng';
          recommendedFormula = ["U", "F", "R", "U", "R'", "U'", "F'"];
        }
      }

      const fullSolution = state.solve();
      const stageMoves = this._extractStageMovesUntil(state, fullSolution, (testState) => {
        const ts = testState.cube.asString();
        return ts[1] === 'U' && ts[3] === 'U' && ts[5] === 'U' && ts[7] === 'U';
      });

      return {
        stage: 4,
        remainingCount: fullSolution.length,
        badgeText: `🏁 BƯỚC 4/7`,
        caseName: `Bước 4/7: Dấu Cộng Vàng (${caseDesc})`,
        formula: "F R U R' U' F'",
        hint: `Áp dụng công thức F R U R' U' F' để biến chấm/chữ L/vạch ngang thành dấu cộng vàng.`,
        moves: stageMoves.length > 0 ? stageMoves : recommendedFormula,
        fullMoves: fullSolution,
        isSolved: false,
        color: '#38bdf8'
      };
    }

    // 5. Kiểm tra Bước 5: Khớp màu 4 cạnh đỉnh với tâm mặt bên (Sune)
    // U-F side: 19='F' | U-R side: 10='R' | U-B side: 46='B' | U-L side: 37='L'
    const isYellowEdgesAligned = s[19] === 'F' && s[10] === 'R' && s[46] === 'B' && s[37] === 'L';

    if (!isYellowEdgesAligned) {
      const fullSolution = state.solve();
      const stageMoves = this._extractStageMovesUntil(state, fullSolution, (testState) => {
        const ts = testState.cube.asString();
        return ts[19] === 'F' && ts[10] === 'R' && ts[46] === 'B' && ts[37] === 'L';
      });

      return {
        stage: 5,
        remainingCount: fullSolution.length,
        badgeText: `🏁 BƯỚC 5/7`,
        caseName: `Bước 5/7: Khớp Màu Cạnh Đỉnh (Sune)`,
        formula: "R U R' U R U2 R' U",
        hint: `Xoay U để có 2 cạnh trùng màu mặt bên, để ở sau-phải rồi dùng công thức Sune.`,
        moves: stageMoves.length > 0 ? stageMoves : ["R", "U", "R'", "U", "R", "U2", "R'", "U"],
        fullMoves: fullSolution,
        isSolved: false,
        color: '#38bdf8'
      };
    }

    // 6. Kiểm tra Bước 6: Định vị 4 góc đỉnh (Niklas)
    const hasColors = (stickers, c1, c2, c3) => {
      return [...stickers].sort().join('') === [c1, c2, c3].sort().join('');
    };

    const cUFL = hasColors([s[6], s[18], s[38]], 'U', 'F', 'L');
    const cUFR = hasColors([s[8], s[20], s[9]], 'U', 'F', 'R');
    const cUBR = hasColors([s[2], s[45], s[11]], 'U', 'B', 'R');
    const cUBL = hasColors([s[0], s[47], s[36]], 'U', 'B', 'L');

    const isCornersPositioned = cUFL && cUFR && cUBR && cUBL;

    if (!isCornersPositioned) {
      const fullSolution = state.solve();
      const stageMoves = this._extractStageMovesUntil(state, fullSolution, (testState) => {
        const ts = testState.cube.asString();
        return hasColors([ts[6], ts[18], ts[38]], 'U', 'F', 'L') &&
               hasColors([ts[8], ts[20], ts[9]], 'U', 'F', 'R') &&
               hasColors([ts[2], ts[45], ts[11]], 'U', 'B', 'R') &&
               hasColors([ts[0], ts[47], ts[36]], 'U', 'B', 'L');
      });

      return {
        stage: 6,
        remainingCount: fullSolution.length,
        badgeText: `🏁 BƯỚC 6/7`,
        caseName: `Bước 6/7: Định Vị 4 Góc Đỉnh (Niklas)`,
        formula: "U R U' L' U R' U' L",
        hint: `Tìm góc đã ở đúng vị trí (dù chưa lật đúng màu vàng), để ở trước-phải rồi dùng công thức Niklas.`,
        moves: stageMoves.length > 0 ? stageMoves : ["U", "R", "U'", "L'", "U", "R'", "U'", "L"],
        fullMoves: fullSolution,
        isSolved: false,
        color: '#38bdf8'
      };
    }

    // 7. Bước 7: Lật góc vàng hoàn tất (R' D' R D)
    const fullSolution = state.solve();

    return {
      stage: 7,
      remainingCount: fullSolution.length,
      badgeText: `🏁 BƯỚC 7/7`,
      caseName: `Bước 7/7: Lật Góc Vàng Về Đích`,
      formula: "R' D' R D (lặp lại đến khi vàng ngửa lên)",
      hint: `Đặt góc chưa hoàn thành ở trước-phải, xoay R' D' R D đến khi mặt vàng ngửa lên. Xoay U đưa góc tiếp theo vào và lặp lại.`,
      moves: fullSolution,
      fullMoves: fullSolution,
      isSolved: false,
      color: '#38bdf8'
    };
  }

  // Trích xuất các nước đi chỉ đủ để hoàn thành bước hiện tại
  _extractStageMovesUntil(state, fullSolution, conditionFn) {
    if (!fullSolution || fullSolution.length === 0) return [];
    const testState = state.clone();
    const stageMoves = [];

    for (const move of fullSolution) {
      testState.applyMove(move, false);
      stageMoves.push(move);
      if (conditionFn(testState)) {
        break;
      }
    }
    return stageMoves.length > 0 ? stageMoves : fullSolution.slice(0, 4);
  }

  // Trích xuất các nước đi giải Dấu cộng trắng đáy
  _extractCrossMoves(state, fullSolution) {
    return this._extractStageMovesUntil(state, fullSolution, (testState) => {
      const s = testState.cube.asString();
      return s[28] === 'D' && s[25] === 'F' &&
             s[32] === 'D' && s[16] === 'R' &&
             s[34] === 'D' && s[52] === 'B' &&
             s[30] === 'D' && s[43] === 'L';
    });
  }

  // Đảo ngược chuỗi nước đi phục vụ tính năng Hoàn Tác (Undo)
  invertMoves(moves) {
    if (!moves || moves.length === 0) return [];
    const inv = [];
    for (let i = moves.length - 1; i >= 0; i--) {
      const m = moves[i];
      if (m.endsWith('2')) inv.push(m);
      else if (m.endsWith("'")) inv.push(m.slice(0, -1));
      else inv.push(m + "'");
    }
    return inv;
  }
}
