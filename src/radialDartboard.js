// Bản đồ phẳng hóa Rubik dạng Tròn Hướng Tâm (Polar / Radial Dartboard Projection)
// - Tâm: Mặt U (Vàng) gồm 1 hình tròn tâm và 1 vành khuyên 8 ô xung quanh
// - 4 góc phần tư: 4 mặt bên (B, R, F, L), mỗi mặt gồm 3 tầng bán kính x 3 nan quạt = 9 ô (ô tâm ở tầng giữa, nan giữa)
// - Vành ngoài cùng: Mặt Đáy D (Trắng) gồm 8 ô tiếp giáp 4 mặt bên
// - Khoảng không gian nền ngoài: Đại diện cho tâm mặt D (chạm ra ngoài để xoay thuận D)

import { FACE_COLORS } from './rubikState.js';
import { i18n } from './i18n.js';

export class RadialDartboard {
  constructor(containerId, rubikState, onMoveRequest) {
    this.container = document.getElementById(containerId);
    this.state = rubikState;
    this.onMoveRequest = onMoveRequest;
    this.lastClickTime = 0;

    this.initCanvas();
    this.update();

    i18n.onChange(() => {
      this.initCanvas();
      this.update();
    });
  }

  initCanvas() {
    this.container.innerHTML = '';

    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.setAttribute('viewBox', '0 0 540 540');
    this.svg.setAttribute('class', 'w-full h-full select-none');
    this.container.appendChild(this.svg);

    // Filter neon glow
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
      <filter id="dartboard-glow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    `;
    this.svg.appendChild(defs);

    // Nền ngoài cùng: Chạm vào đây là xoay thuận mặt D (do tâm D ẩn ở ngoài)
    this.bgHitZone = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    this.bgHitZone.setAttribute('x', '0');
    this.bgHitZone.setAttribute('y', '0');
    this.bgHitZone.setAttribute('width', '540');
    this.bgHitZone.setAttribute('height', '540');
    this.bgHitZone.setAttribute('fill', 'transparent');
    this.bgHitZone.setAttribute('class', 'cursor-pointer');
    const bgTitle = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    bgTitle.textContent = i18n.t('dartboard_d_bg_tip');
    this.bgHitZone.appendChild(bgTitle);
    this.bgHitZone.addEventListener('click', (e) => {
      this.handleClick("D");
    });
    this.svg.appendChild(this.bgHitZone);

    this.mainGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.svg.appendChild(this.mainGroup);

    // Nhóm hiệu ứng phát sáng viền neon
    this.highlightGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.highlightGroup.setAttribute('class', 'pointer-events-none');
    this.svg.appendChild(this.highlightGroup);

    // Nhóm hoạt họa xoay 60fps mượt mà
    this.animGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.animGroup.setAttribute('class', 'pointer-events-none');
    this.svg.appendChild(this.animGroup);

    this.computeAndRenderGeometry();
  }

  handleClick(move) {
    const now = performance.now();
    if (now - this.lastClickTime < 320) return;
    this.lastClickTime = now;
    if (this.onMoveRequest) {
      this.onMoveRequest(move);
    }
  }

  // Hàm tạo path SVG cho một hình dẻ quạt (annular sector)
  createSectorPath(cx, cy, rIn, rOut, startAngle, endAngle) {
    const rad1 = (startAngle - 90) * (Math.PI / 180);
    const rad2 = (endAngle - 90) * (Math.PI / 180);

    const x1 = cx + rOut * Math.cos(rad1);
    const y1 = cy + rOut * Math.sin(rad1);
    const x2 = cx + rOut * Math.cos(rad2);
    const y2 = cy + rOut * Math.sin(rad2);

    const x3 = cx + rIn * Math.cos(rad2);
    const y3 = cy + rIn * Math.sin(rad2);
    const x4 = cx + rIn * Math.cos(rad1);
    const y4 = cy + rIn * Math.sin(rad1);

    const largeArc = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;

    return `M ${x1.toFixed(2)} ${y1.toFixed(2)} ` +
           `A ${rOut} ${rOut} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} ` +
           `L ${x3.toFixed(2)} ${y3.toFixed(2)} ` +
           `A ${rIn} ${rIn} 0 ${largeArc} 0 ${x4.toFixed(2)} ${y4.toFixed(2)} Z`;
  }

  computeAndRenderGeometry() {
    const cx = 270;
    const cy = 270;

    // Các bán kính tầng chuẩn mực
    const R0 = 36;  // Tâm U
    const R1 = 82;  // Vành 8 ô của U
    const R2 = 128; // Tầng 1 của 4 mặt bên
    const R3 = 174; // Tầng 2 của 4 mặt bên (tầng giữa chứa ô tâm)
    const R4 = 220; // Tầng 3 của 4 mặt bên
    const R5 = 256; // Vành 8 ô của mặt Đáy D

    this.cellElements = {
      U: [],
      D: [],
      F: [],
      B: [],
      L: [],
      R: []
    };

    // 1. TẠO MẶT U (TRUNG TÂM)
    // 1.1. Ô tâm U (index 4)
    const centerU = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    centerU.setAttribute('cx', cx);
    centerU.setAttribute('cy', cy);
    centerU.setAttribute('r', R0);
    centerU.setAttribute('fill', FACE_COLORS.U || '#FACC15');
    centerU.setAttribute('stroke', '#090d16');
    centerU.setAttribute('stroke-width', '2.0');
    centerU.setAttribute('class', 'cursor-pointer transition-all duration-200 hover:brightness-125');
    const titleU = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    titleU.textContent = i18n.t('dartboard_u_center_tip');
    centerU.appendChild(titleU);
    centerU.addEventListener('click', (e) => {
      e.stopPropagation();
      this.handleClick('U');
    });
    this.mainGroup.appendChild(centerU);
    this.cellElements.U[4] = centerU;

    // 1.2. Vành 8 ô của mặt U (Đồng quy 100% với các nan của 4 mặt bên và các đường chéo)
    // 4 cạnh: rộng 30 độ (khớp với nan giữa của 4 mặt bên)
    // 4 góc: rộng 60 độ (khớp với đường chéo 45 độ chia 2 nửa)
    const uSectors = [
      { idx: 1, start: -15, end: 15, name: 'U1' },
      { idx: 2, start: 15, end: 75, name: 'U2' },
      { idx: 5, start: 75, end: 105, name: 'U5' },
      { idx: 8, start: 105, end: 165, name: 'U8' },
      { idx: 7, start: 165, end: 195, name: 'U7' },
      { idx: 6, start: 195, end: 255, name: 'U6' },
      { idx: 3, start: 255, end: 285, name: 'U3' },
      { idx: 0, start: 285, end: 345, name: 'U0' },
    ];

    uSectors.forEach(sec => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const d = this.createSectorPath(cx, cy, R0, R1, sec.start, sec.end);
      path.setAttribute('d', d);
      path.setAttribute('fill', FACE_COLORS.U || '#FACC15');
      path.setAttribute('stroke', '#090d16');
      path.setAttribute('stroke-width', '1.5');
      path.setAttribute('class', 'cursor-pointer transition-all duration-200 hover:brightness-125');
      const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      title.textContent = i18n.t('dartboard_u_edge_tip', { name: sec.name });
      path.appendChild(title);
      path.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleClick("U'");
      });
      this.mainGroup.appendChild(path);
      this.cellElements.U[sec.idx] = path;
    });

    // 2. TẠO 4 MẶT BÊN (B, R, F, L)
    // 4 góc phần tư: B (-45°..45°), R (45°..135°), F (135°..225°), L (225°..315°)
    // Mỗi mặt gồm 3 tầng bán kính x 3 nan (mỗi nan 30° thẳng tắp)
    // Ma trận sticker chuẩn topo học 3D (xoay chiều kim đồng hồ quanh hình tròn):
    // Tầng 1 (trong, gần U): [2, 1, 0]
    // Tầng 2 (giữa, chứa tâm 4): [5, 4, 3]
    // Tầng 3 (ngoài, gần D): [8, 7, 6]
    const sideFaces = [
      { faceKey: 'B', label: 'B', startDeg: -45 },
      { faceKey: 'R', label: 'R', startDeg: 45 },
      { faceKey: 'F', label: 'F', startDeg: 135 },
      { faceKey: 'L', label: 'L', startDeg: 225 },
    ];

    const ringRanges = [
      { rIn: R1, rOut: R2 }, // Tầng 1 (trong)
      { rIn: R2, rOut: R3 }, // Tầng 2 (giữa, chứa tâm)
      { rIn: R3, rOut: R4 }, // Tầng 3 (ngoài)
    ];

    const standardGrid = [
      [2, 1, 0],
      [5, 4, 3],
      [8, 7, 6]
    ];

    sideFaces.forEach(sf => {
      ringRanges.forEach((ring, rIdx) => {
        for (let col = 0; col < 3; col++) {
          const sliceStart = sf.startDeg + col * 30;
          const sliceEnd = sliceStart + 30;
          const stickerIdx = standardGrid[rIdx][col];
          const isCenter = stickerIdx === 4;

          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          const d = this.createSectorPath(cx, cy, ring.rIn, ring.rOut, sliceStart, sliceEnd);
          path.setAttribute('d', d);
          path.setAttribute('fill', FACE_COLORS[sf.faceKey] || '#38bdf8');
          path.setAttribute('stroke', '#090d16');
          path.setAttribute('stroke-width', '1.5');
          path.setAttribute('class', 'cursor-pointer transition-all duration-200 hover:brightness-125');

          const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
          const actionText = isCenter 
            ? i18n.t('dartboard_face_center_tip', { face: sf.label, move: sf.faceKey }) 
            : i18n.t('dartboard_face_edge_tip', { face: sf.label, move: `${sf.faceKey}'` });
          title.textContent = actionText;
          path.appendChild(title);

          path.addEventListener('click', (e) => {
            e.stopPropagation();
            const move = isCenter ? sf.faceKey : `${sf.faceKey}'`;
            this.handleClick(move);
          });

          this.mainGroup.appendChild(path);
          this.cellElements[sf.faceKey][stickerIdx] = path;

          // Nếu là ô tâm (isCenter), thêm biểu tượng bullseye mini tinh tế bên trong để nhận diện trực quan mà KHÔNG làm vỡ nét viền
          if (isCenter) {
            const midAngleRad = (sf.startDeg + 45 - 90) * (Math.PI / 180);
            const midR = (ring.rIn + ring.rOut) / 2;
            const markerX = cx + midR * Math.cos(midAngleRad);
            const markerY = cy + midR * Math.sin(midAngleRad);

            const bullseye = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            bullseye.setAttribute('cx', markerX.toFixed(2));
            bullseye.setAttribute('cy', markerY.toFixed(2));
            bullseye.setAttribute('r', '5.5');
            bullseye.setAttribute('fill', 'none');
            bullseye.setAttribute('stroke', '#ffffff');
            bullseye.setAttribute('stroke-width', '1.8');
            bullseye.setAttribute('opacity', '0.9');
            bullseye.setAttribute('class', 'pointer-events-none');
            this.mainGroup.appendChild(bullseye);
          }
        }
      });
    });

    // 3. TẠO MẶT ĐÁY D (VÀNH NGOÀI CÙNG R4 -> R5 - MÀU TRẮNG)
    // 8 ô tiếp giáp: 4 ô cạnh (rộng 30°) và 4 ô góc (rộng 60°) thẳng tắp với các tia hướng tâm
    const dSectors = [
      { idx: 7, start: -15, end: 15, name: 'D7' },
      { idx: 8, start: 15, end: 75, name: 'D8' },
      { idx: 5, start: 75, end: 105, name: 'D5' },
      { idx: 2, start: 105, end: 165, name: 'D2' },
      { idx: 1, start: 165, end: 195, name: 'D1' },
      { idx: 0, start: 195, end: 255, name: 'D0' },
      { idx: 3, start: 255, end: 285, name: 'D3' },
      { idx: 6, start: 285, end: 345, name: 'D6' },
    ];

    dSectors.forEach(sec => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const d = this.createSectorPath(cx, cy, R4, R5, sec.start, sec.end);
      path.setAttribute('d', d);
      path.setAttribute('fill', FACE_COLORS.D || '#FFFFFF');
      path.setAttribute('stroke', '#090d16');
      path.setAttribute('stroke-width', '1.5');
      path.setAttribute('class', 'cursor-pointer transition-all duration-200 hover:brightness-125');

      const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      title.textContent = i18n.t('dartboard_d_edge_tip', { name: sec.name });
      path.appendChild(title);

      path.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleClick("D'");
      });

      this.mainGroup.appendChild(path);
      this.cellElements.D[sec.idx] = path;
    });

    // 4. CÁC ĐƯỜNG NAN THẲNG TẮP ĐỒNG QUY TỪ TÂM RA NGOÀI (POINTER-EVENTS-NONE)
    const overlayGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    overlayGroup.setAttribute('class', 'pointer-events-none');

    // 4.1. 4 đường chéo chính phân định 4 góc phần tư (-45°, 45°, 135°, 225°)
    // Chạy thẳng tắp từ R0 ra tận R5
    [-45, 45, 135, 225].forEach(deg => {
      const rad = (deg - 90) * (Math.PI / 180);
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', (cx + R0 * Math.cos(rad)).toFixed(2));
      line.setAttribute('y1', (cy + R0 * Math.sin(rad)).toFixed(2));
      line.setAttribute('x2', (cx + R5 * Math.cos(rad)).toFixed(2));
      line.setAttribute('y2', (cy + R5 * Math.sin(rad)).toFixed(2));
      line.setAttribute('stroke', '#ffffff');
      line.setAttribute('stroke-width', '2.2');
      line.setAttribute('opacity', '0.75');
      overlayGroup.appendChild(line);
    });

    // 4.2. 8 tia nan quạt phân chia 3 cột của 4 mặt bên
    // Chạy thẳng tắp từ R0 ra tận R5
    [-15, 15, 75, 105, 165, 195, 255, 285].forEach(deg => {
      const rad = (deg - 90) * (Math.PI / 180);
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', (cx + R0 * Math.cos(rad)).toFixed(2));
      line.setAttribute('y1', (cy + R0 * Math.sin(rad)).toFixed(2));
      line.setAttribute('x2', (cx + R5 * Math.cos(rad)).toFixed(2));
      line.setAttribute('y2', (cy + R5 * Math.sin(rad)).toFixed(2));
      line.setAttribute('stroke', '#090d16');
      line.setAttribute('stroke-width', '1.6');
      overlayGroup.appendChild(line);
    });

    // 4.3. Các vòng tròn phân tầng đồng tâm hoàn hảo (R0, R1, R4, R5)
    [R0, R1, R4, R5].forEach((r, idx) => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', cx);
      circle.setAttribute('cy', cy);
      circle.setAttribute('r', r);
      circle.setAttribute('fill', 'none');
      circle.setAttribute('stroke', idx === 1 || idx === 2 ? '#ffffff' : '#090d16');
      circle.setAttribute('stroke-width', idx === 1 || idx === 2 ? '2.2' : '1.6');
      circle.setAttribute('opacity', idx === 1 || idx === 2 ? '0.75' : '1.0');
      overlayGroup.appendChild(circle);
    });

    this.mainGroup.appendChild(overlayGroup);
  }

  // Cập nhật màu 54 ô sticker đồng bộ thời gian thực
  update() {
    // Dọn dẹp hoạt họa đang chạy nếu có để đảm bảo trạng thái sạch sẽ
    if (this.currentAnim) {
      cancelAnimationFrame(this.currentAnim);
      this.currentAnim = null;
    }
    if (this.currentAnimElements) {
      this.currentAnimElements.forEach(el => {
        if (el) el.style.opacity = '1';
      });
      this.currentAnimElements = null;
    }
    if (this.animGroup) {
      this.animGroup.innerHTML = '';
    }

    if (!this.cellElements) return;

    for (const [faceKey, elements] of Object.entries(this.cellElements)) {
      const faceState = this.state.faces[faceKey];
      if (!faceState) continue;

      elements.forEach((el, idx) => {
        if (!el) return;
        const colorKey = faceState[idx];
        const hexColor = FACE_COLORS[colorKey] || '#334155';
        el.setAttribute('fill', hexColor);
      });
    }
  }

  // Xác định tâm xoay, góc quay và danh sách ô tham gia của từng phép xoay
  getMoveSpec(move) {
    if (!move) return null;
    const face = move[0].toUpperCase();
    const isDouble = move.includes('2');
    const isPrime = move.includes("'");
    const turns = isDouble ? 2 : 1;

    const cx = 270;
    const cy = 270;
    const midR = 151; // (R2 + R3) / 2 = (128 + 174) / 2

    switch (face) {
      case 'U': {
        // Xoay quanh tâm (270, 270). Thuận chiều kim đồng hồ khi U thuận.
        const sign = isPrime ? -1 : 1;
        const targetAngle = sign * turns * 90;
        const targets = [];
        // 9 ô của mặt U
        for (let i = 0; i < 9; i++) targets.push({ face: 'U', idx: i });
        // Tầng 1 của 4 mặt bên giáp U (hàng 0: indices [0, 1, 2])
        [0, 1, 2].forEach(i => {
          targets.push({ face: 'B', idx: i });
          targets.push({ face: 'R', idx: i });
          targets.push({ face: 'F', idx: i });
          targets.push({ face: 'L', idx: i });
        });
        return {
          center: { x: cx, y: cy },
          targetAngle,
          targets,
          face
        };
      }

      case 'D': {
        // Xoay quanh tâm (270, 270). Ngược chiều kim đồng hồ khi nhìn từ đỉnh xuống.
        const sign = isPrime ? 1 : -1;
        const targetAngle = sign * turns * 90;
        const targets = [];
        // 8 ô của mặt D
        [0, 1, 2, 3, 5, 6, 7, 8].forEach(i => targets.push({ face: 'D', idx: i }));
        // Tầng 3 của 4 mặt bên giáp D (hàng 2: indices [6, 7, 8])
        [6, 7, 8].forEach(i => {
          targets.push({ face: 'B', idx: i });
          targets.push({ face: 'R', idx: i });
          targets.push({ face: 'F', idx: i });
          targets.push({ face: 'L', idx: i });
        });
        return {
          center: { x: cx, y: cy },
          targetAngle,
          targets,
          face
        };
      }

      case 'F': {
        // Tâm F ở phía dưới (góc 180°): cx = 270, cy = 270 + 151 = 421
        const sign = isPrime ? -1 : 1;
        const targetAngle = sign * turns * 90;
        const targets = [];
        // 9 ô của mặt F
        for (let i = 0; i < 9; i++) targets.push({ face: 'F', idx: i });
        // Các ô tiếp giáp: U cạnh dưới [6,7,8], D cạnh dưới [0,1,2], L cột phải [2,5,8], R cột trái [0,3,6]
        [6, 7, 8].forEach(i => targets.push({ face: 'U', idx: i }));
        [0, 1, 2].forEach(i => targets.push({ face: 'D', idx: i }));
        [2, 5, 8].forEach(i => targets.push({ face: 'L', idx: i }));
        [0, 3, 6].forEach(i => targets.push({ face: 'R', idx: i }));
        return {
          center: { x: cx, y: cy + midR },
          targetAngle,
          targets,
          face
        };
      }

      case 'B': {
        // Tâm B ở phía trên (góc 0°): cx = 270, cy = 270 - 151 = 119
        // Nhìn từ trước, chiều xoay của B bị nghịch đảo: B thuận là -90°
        const sign = isPrime ? 1 : -1;
        const targetAngle = sign * turns * 90;
        const targets = [];
        // 9 ô của mặt B
        for (let i = 0; i < 9; i++) targets.push({ face: 'B', idx: i });
        // Các ô tiếp giáp: U cạnh trên [0,1,2], D cạnh trên [6,7,8], L cột trái [0,3,6], R cột phải [2,5,8]
        [0, 1, 2].forEach(i => targets.push({ face: 'U', idx: i }));
        [6, 7, 8].forEach(i => targets.push({ face: 'D', idx: i }));
        [0, 3, 6].forEach(i => targets.push({ face: 'L', idx: i }));
        [2, 5, 8].forEach(i => targets.push({ face: 'R', idx: i }));
        return {
          center: { x: cx, y: cy - midR },
          targetAngle,
          targets,
          face
        };
      }

      case 'R': {
        // Tâm R ở bên phải (góc 90°): cx = 270 + 151 = 421, cy = 270
        const sign = isPrime ? -1 : 1;
        const targetAngle = sign * turns * 90;
        const targets = [];
        // 9 ô của mặt R
        for (let i = 0; i < 9; i++) targets.push({ face: 'R', idx: i });
        // Các ô tiếp giáp: U cạnh phải [2,5,8], D cạnh phải [2,5,8], B cột phải [0,3,6], F cột trái [2,5,8]
        [2, 5, 8].forEach(i => targets.push({ face: 'U', idx: i }));
        [2, 5, 8].forEach(i => targets.push({ face: 'D', idx: i }));
        [0, 3, 6].forEach(i => targets.push({ face: 'B', idx: i }));
        [2, 5, 8].forEach(i => targets.push({ face: 'F', idx: i }));
        return {
          center: { x: cx + midR, y: cy },
          targetAngle,
          targets,
          face
        };
      }

      case 'L': {
        // Tâm L ở bên trái (góc 270°): cx = 270 - 151 = 119, cy = 270
        const sign = isPrime ? -1 : 1;
        const targetAngle = sign * turns * 90;
        const targets = [];
        // 9 ô của mặt L
        for (let i = 0; i < 9; i++) targets.push({ face: 'L', idx: i });
        // Các ô tiếp giáp: U cạnh trái [0,3,6], D cạnh trái [0,3,6], B cột trái [2,5,8], F cột phải [0,3,6]
        [0, 3, 6].forEach(i => targets.push({ face: 'U', idx: i }));
        [0, 3, 6].forEach(i => targets.push({ face: 'D', idx: i }));
        [2, 5, 8].forEach(i => targets.push({ face: 'B', idx: i }));
        [0, 3, 6].forEach(i => targets.push({ face: 'F', idx: i }));
        return {
          center: { x: cx - midR, y: cy },
          targetAngle,
          targets,
          face
        };
      }

      default:
        return null;
    }
  }

  // Phát sáng neon cyan cho vùng mặt/vành tròn tương ứng
  highlightMove(move, duration = 160) {
    if (!move || !this.highlightGroup) return;
    const face = move[0].toUpperCase();

    if (this.highlightTimeout) {
      clearTimeout(this.highlightTimeout);
      this.highlightTimeout = null;
    }

    this.highlightGroup.innerHTML = '';
    const cx = 270;
    const cy = 270;
    const R1 = 82;
    const R4 = 220;
    const R5 = 256;

    let highlightEl = null;

    if (face === 'U') {
      highlightEl = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      highlightEl.setAttribute('cx', cx);
      highlightEl.setAttribute('cy', cy);
      highlightEl.setAttribute('r', R1);
      highlightEl.setAttribute('fill', 'rgba(56, 189, 248, 0.12)');
      highlightEl.setAttribute('stroke', '#38bdf8');
      highlightEl.setAttribute('stroke-width', '3.0');
      highlightEl.setAttribute('filter', 'url(#dartboard-glow)');
    } else if (face === 'D') {
      highlightEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      highlightEl.setAttribute('d', this.createSectorPath(cx, cy, R4, R5, -45, 315));
      highlightEl.setAttribute('fill', 'rgba(56, 189, 248, 0.12)');
      highlightEl.setAttribute('stroke', '#38bdf8');
      highlightEl.setAttribute('stroke-width', '3.0');
      highlightEl.setAttribute('filter', 'url(#dartboard-glow)');
    } else {
      const degMap = {
        B: { start: -45, end: 45 },
        R: { start: 45, end: 135 },
        F: { start: 135, end: 225 },
        L: { start: 225, end: 315 }
      };
      const degs = degMap[face];
      if (degs) {
        highlightEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        highlightEl.setAttribute('d', this.createSectorPath(cx, cy, R1, R4, degs.start, degs.end));
        highlightEl.setAttribute('fill', 'rgba(56, 189, 248, 0.12)');
        highlightEl.setAttribute('stroke', '#38bdf8');
        highlightEl.setAttribute('stroke-width', '3.0');
        highlightEl.setAttribute('filter', 'url(#dartboard-glow)');
      }
    }

    if (highlightEl) {
      highlightEl.style.transition = 'opacity 0.25s ease';
      highlightEl.style.opacity = '1';
      this.highlightGroup.appendChild(highlightEl);

      this.highlightTimeout = setTimeout(() => {
        highlightEl.style.opacity = '0';
        setTimeout(() => {
          if (highlightEl.parentNode === this.highlightGroup) {
            this.highlightGroup.removeChild(highlightEl);
          }
        }, 250);
      }, Math.max(duration, 180));
    }
  }

  resetHighlights() {
    if (this.highlightTimeout) {
      clearTimeout(this.highlightTimeout);
      this.highlightTimeout = null;
    }
    if (this.highlightGroup) {
      this.highlightGroup.innerHTML = '';
    }
  }

  // Thực thi hoạt họa xoay 60fps mượt mà cho Bia Bắn Tròn Hướng Tâm
  animateMove(move, duration = 160) {
    if (!move || !this.cellElements) return;

    // Hủy hoạt họa đang chạy nếu có
    if (this.currentAnim) {
      cancelAnimationFrame(this.currentAnim);
      this.currentAnim = null;
    }
    if (this.currentAnimElements) {
      this.currentAnimElements.forEach(el => {
        if (el) el.style.opacity = '1';
      });
      this.currentAnimElements = null;
    }
    if (this.animGroup) {
      this.animGroup.innerHTML = '';
    }

    const spec = this.getMoveSpec(move);
    if (!spec) {
      this.update();
      return;
    }

    // Bật hiệu ứng phát sáng neon
    this.highlightMove(move, duration);

    const rotatingGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.animGroup.appendChild(rotatingGroup);

    const elementsToAnimate = [];
    spec.targets.forEach(({ face, idx }) => {
      const el = this.cellElements[face] && this.cellElements[face][idx];
      if (el) {
        elementsToAnimate.push(el);
        const clone = el.cloneNode(true);
        clone.setAttribute('fill', el.getAttribute('fill'));
        clone.setAttribute('stroke', el.getAttribute('stroke') || '#090d16');
        clone.setAttribute('stroke-width', el.getAttribute('stroke-width') || '1.5');
        clone.style.pointerEvents = 'none';
        rotatingGroup.appendChild(clone);
        el.style.opacity = '0';
      }
    });

    this.currentAnimElements = elementsToAnimate;

    const { center, targetAngle } = spec;
    const startTime = performance.now();

    const animLoop = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Easing quad mượt mà đồng bộ với Mandala
      const ease = progress < 0.5
        ? 2 * progress * progress
        : -1 + (4 - 2 * progress) * progress;

      const curAngle = targetAngle * ease;
      rotatingGroup.setAttribute('transform', `rotate(${curAngle.toFixed(2)}, ${center.x}, ${center.y})`);

      if (progress < 1) {
        this.currentAnim = requestAnimationFrame(animLoop);
      } else {
        this.currentAnim = null;
        this.animGroup.innerHTML = '';
        if (this.currentAnimElements) {
          this.currentAnimElements.forEach(el => {
            if (el) el.style.opacity = '1';
          });
          this.currentAnimElements = null;
        }
        this.update();
      }
    };

    this.currentAnim = requestAnimationFrame(animLoop);
  }
}
