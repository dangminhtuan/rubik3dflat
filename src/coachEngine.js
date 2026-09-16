// Hệ thống Gia Sư Rubik 3D Thông Minh & Bộ Não Tự Động Giải (AI Coach & Solver)
// Phân tích trạng thái khối Rubik theo thuật toán tối ưu Kociemba & tiến trình LBL 7 Bước
import Cube from 'cubejs';

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

  analyze(state) {
    if (state.isSolved()) {
      return {
        stage: 8,
        remainingCount: 0,
        badgeText: '🎉 HOÀN THÀNH',
        caseName: '6 Mặt Đã Được Giải Hoàn Hảo',
        hint: 'Tuyệt vời! Toàn bộ khối Rubik đã về đích hoàn tất.',
        moves: [],
        isSolved: true,
        color: '#10b981'
      };
    }

    // Lấy chuỗi nước đi giải tối ưu từ state
    const moves = state.solve();
    const count = moves.length;

    // Ước lượng giai đoạn tương ứng trong 7 bước
    let stageNum = 1;
    let stageTitle = 'Dấu Cộng Trắng Đáy';
    if (count <= 3) {
      stageNum = 7;
      stageTitle = 'Lật Góc Vàng Về Đích';
    } else if (count <= 6) {
      stageNum = 6;
      stageTitle = 'Định Vị 4 Góc Đỉnh';
    } else if (count <= 9) {
      stageNum = 5;
      stageTitle = 'Khớp Màu Cạnh Vàng';
    } else if (count <= 13) {
      stageNum = 4;
      stageTitle = 'Dấu Cộng Vàng Đỉnh';
    } else if (count <= 16) {
      stageNum = 3;
      stageTitle = '4 Cạnh Tầng Giữa';
    } else if (count <= 19) {
      stageNum = 2;
      stageTitle = '4 Góc Trắng Tầng 1';
    } else {
      stageNum = 1;
      stageTitle = 'Dấu Cộng Trắng Đáy';
    }

    return {
      stage: stageNum,
      remainingCount: count,
      badgeText: `🎯 CÒN ${count} NƯỚC`,
      caseName: `Bước ${stageNum}/7: ${stageTitle}`,
      hint: `Còn ${count} nước nữa là xong. Bấm "⚡ Tự Giải Hết" để máy xoay về đích, hoặc "▶ Bước Tiếp" để đi từng nước.`,
      moves: moves,
      isSolved: false,
      color: '#38bdf8'
    };
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
