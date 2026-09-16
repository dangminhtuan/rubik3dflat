// Bản đồ phẳng hóa Rubik dạng Tròn Hướng Tâm (Polar / Radial Dartboard Projection)
// - Tâm: Mặt U (Vàng) gồm 1 hình tròn tâm và 1 vành khuyên 8 ô xung quanh
// - 4 góc phần tư: 4 mặt bên (B, R, F, L), mỗi mặt gồm 3 tầng bán kính x 3 nan quạt = 9 ô (ô tâm ở tầng giữa, nan giữa)
// - Vành ngoài cùng: Mặt Đáy D (Trắng) gồm 8 ô tiếp giáp 4 mặt bên
// - Khoảng không gian nền ngoài: Đại diện cho tâm mặt D (chạm ra ngoài để xoay thuận D)

import { FACE_COLORS } from './rubikState.js';

export class RadialDartboard {
  constructor(containerId, rubikState, onMoveRequest) {
    this.container = document.getElementById(containerId);
    this.state = rubikState;
    this.onMoveRequest = onMoveRequest;
    this.lastClickTime = 0;

    this.initCanvas();
    this.update();
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
    bgTitle.textContent = 'Mặt Đáy (D): Chạm khoảng trống ngoài để xoay thuận (D)';
    this.bgHitZone.appendChild(bgTitle);
    this.bgHitZone.addEventListener('click', (e) => {
      this.handleClick("D");
    });
    this.svg.appendChild(this.bgHitZone);

    this.mainGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.svg.appendChild(this.mainGroup);

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
    centerU.setAttribute('stroke', '#ffffff');
    centerU.setAttribute('stroke-width', '2.5');
    centerU.setAttribute('class', 'cursor-pointer transition-all duration-200 hover:brightness-125');
    const titleU = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    titleU.textContent = 'Tâm mặt U (Vàng): Chạm để xoay thuận (U)';
    centerU.appendChild(titleU);
    centerU.addEventListener('click', (e) => {
      e.stopPropagation();
      this.handleClick('U');
    });
    this.mainGroup.appendChild(centerU);
    this.cellElements.U[4] = centerU;

    // 1.2. Vành 8 ô của mặt U bao quanh tâm (1 vành duy nhất)
    // 8 ô: 4 ô cạnh (Top, Right, Bottom, Left) và 4 ô góc (đường chéo)
    // Chia 8 cung: mỗi cung 45 độ, bắt đầu từ -22.5 độ (để ô Top nằm cân xứng ở đỉnh)
    const uSectors = [
      { idx: 1, start: -22.5, end: 22.5, name: 'Cạnh Trên (U1)' },       // Top (hướng B)
      { idx: 2, start: 22.5, end: 67.5, name: 'Góc Trên-Phải (U2)' },    // Top-Right
      { idx: 5, start: 67.5, end: 112.5, name: 'Cạnh Phải (U5)' },      // Right (hướng R)
      { idx: 8, start: 112.5, end: 157.5, name: 'Góc Dưới-Phải (U8)' },  // Bottom-Right
      { idx: 7, start: 157.5, end: 202.5, name: 'Cạnh Dưới (U7)' },     // Bottom (hướng F)
      { idx: 6, start: 202.5, end: 247.5, name: 'Góc Dưới-Trái (U6)' },  // Bottom-Left
      { idx: 3, start: 247.5, end: 292.5, name: 'Cạnh Trái (U3)' },      // Left (hướng L)
      { idx: 0, start: 292.5, end: 337.5, name: 'Góc Trên-Trái (U0)' },   // Top-Left
    ];

    uSectors.forEach(sec => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const d = this.createSectorPath(cx, cy, R0, R1, sec.start, sec.end);
      path.setAttribute('d', d);
      path.setAttribute('fill', FACE_COLORS.U || '#FACC15');
      path.setAttribute('stroke', '#090d16');
      path.setAttribute('stroke-width', '1.8');
      path.setAttribute('class', 'cursor-pointer transition-all duration-200 hover:brightness-125');
      const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      title.textContent = `Mặt U (${sec.name}): Chạm ô rìa để xoay nghịch (U')`;
      path.appendChild(title);
      path.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleClick("U'");
      });
      this.mainGroup.appendChild(path);
      this.cellElements.U[sec.idx] = path;
    });

    // 2. TẠO 4 MẶT BÊN (B, R, F, L)
    // Mỗi mặt gồm 3 tầng (R1->R2, R2->R3, R3->R4) và 3 nan (mỗi nan 30 độ)
    const sideFaces = [
      {
        faceKey: 'B',
        label: 'Sau (B)',
        startDeg: -45, // Từ 315° (-45°) đến 45°
        // Ma trận 3x3:
        // Tầng trong (R1->R2): index 2 (trái/L), 1 (giữa), 0 (phải/R)
        // Tầng giữa (R2->R3):  index 5, 4 (tâm), 3
        // Tầng ngoài (R3->R4): index 8, 7, 6
        gridMap: [
          [2, 1, 0],
          [5, 4, 3],
          [8, 7, 6]
        ]
      },
      {
        faceKey: 'R',
        label: 'Phải (R)',
        startDeg: 45, // Từ 45° đến 135°
        gridMap: [
          [0, 1, 2],
          [3, 4, 5],
          [6, 7, 8]
        ]
      },
      {
        faceKey: 'F',
        label: 'Trước (F)',
        startDeg: 135, // Từ 135° đến 225°
        gridMap: [
          [0, 1, 2],
          [3, 4, 5],
          [6, 7, 8]
        ]
      },
      {
        faceKey: 'L',
        label: 'Trái (L)',
        startDeg: 225, // Từ 225° đến 315°
        gridMap: [
          [0, 1, 2],
          [3, 4, 5],
          [6, 7, 8]
        ]
      }
    ];

    const ringRanges = [
      { rIn: R1, rOut: R2 }, // Tầng 1 (trong)
      { rIn: R2, rOut: R3 }, // Tầng 2 (giữa, chứa tâm)
      { rIn: R3, rOut: R4 }, // Tầng 3 (ngoài)
    ];

    sideFaces.forEach(sf => {
      ringRanges.forEach((ring, rIdx) => {
        for (let col = 0; col < 3; col++) {
          const sliceStart = sf.startDeg + col * 30;
          const sliceEnd = sliceStart + 30;
          const stickerIdx = sf.gridMap[rIdx][col];
          const isCenter = stickerIdx === 4;

          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          const d = this.createSectorPath(cx, cy, ring.rIn, ring.rOut, sliceStart, sliceEnd);
          path.setAttribute('d', d);
          path.setAttribute('fill', FACE_COLORS[sf.faceKey] || '#38bdf8');
          path.setAttribute('stroke', isCenter ? '#ffffff' : '#090d16');
          path.setAttribute('stroke-width', isCenter ? '2.2' : '1.5');
          path.setAttribute('class', 'cursor-pointer transition-all duration-200 hover:brightness-125');

          const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
          const actionText = isCenter 
            ? `Tâm mặt ${sf.label}: Chạm để xoay thuận (${sf.faceKey})` 
            : `Ô rìa mặt ${sf.label}: Chạm để xoay nghịch (${sf.faceKey}')`;
          title.textContent = actionText;
          path.appendChild(title);

          path.addEventListener('click', (e) => {
            e.stopPropagation();
            const move = isCenter ? sf.faceKey : `${sf.faceKey}'`;
            this.handleClick(move);
          });

          this.mainGroup.appendChild(path);
          this.cellElements[sf.faceKey][stickerIdx] = path;
        }
      });
    });

    // 3. TẠO MẶT ĐÁY D (VÀNH NGOÀI CÙNG R4 -> R5)
    // Gồm 8 ô tiếp giáp: 4 ô cạnh và 4 ô góc
    const dSectors = [
      { idx: 7, start: -22.5, end: 22.5, name: 'Cạnh Trên (D7 giáp B)' },
      { idx: 8, start: 22.5, end: 67.5, name: 'Góc Trên-Phải (D8)' },
      { idx: 5, start: 67.5, end: 112.5, name: 'Cạnh Phải (D5 giáp R)' },
      { idx: 2, start: 112.5, end: 157.5, name: 'Góc Dưới-Phải (D2)' },
      { idx: 1, start: 157.5, end: 202.5, name: 'Cạnh Dưới (D1 giáp F)' },
      { idx: 0, start: 202.5, end: 247.5, name: 'Góc Dưới-Trái (D0)' },
      { idx: 3, start: 247.5, end: 292.5, name: 'Cạnh Trái (D3 giáp L)' },
      { idx: 6, start: 292.5, end: 337.5, name: 'Góc Trên-Trái (D6)' },
    ];

    dSectors.forEach(sec => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const d = this.createSectorPath(cx, cy, R4, R5, sec.start, sec.end);
      path.setAttribute('d', d);
      path.setAttribute('fill', FACE_COLORS.D || '#EF4444');
      path.setAttribute('stroke', '#090d16');
      path.setAttribute('stroke-width', '1.8');
      path.setAttribute('class', 'cursor-pointer transition-all duration-200 hover:brightness-125');

      const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      title.textContent = `Mặt Đáy (${sec.name}): Chạm ô rìa để xoay nghịch (D')`;
      path.appendChild(title);

      path.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleClick("D'");
      });

      this.mainGroup.appendChild(path);
      this.cellElements.D[sec.idx] = path;
    });

    // 4. Các đường viền nan chính nổi bật
    const bordersGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    bordersGroup.setAttribute('class', 'pointer-events-none');
    
    // 4 đường chéo phân định 4 mặt bên
    [-45, 45, 135, 225].forEach(deg => {
      const rad = (deg - 90) * (Math.PI / 180);
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', (cx + R1 * Math.cos(rad)).toFixed(2));
      line.setAttribute('y1', (cy + R1 * Math.sin(rad)).toFixed(2));
      line.setAttribute('x2', (cx + R5 * Math.cos(rad)).toFixed(2));
      line.setAttribute('y2', (cy + R5 * Math.sin(rad)).toFixed(2));
      line.setAttribute('stroke', '#ffffff');
      line.setAttribute('stroke-width', '2.0');
      line.setAttribute('opacity', '0.7');
      bordersGroup.appendChild(line);
    });

    // Vòng tròn phân ranh giới U và các mặt bên
    const boundaryCircle1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    boundaryCircle1.setAttribute('cx', cx);
    boundaryCircle1.setAttribute('cy', cy);
    boundaryCircle1.setAttribute('r', R1);
    boundaryCircle1.setAttribute('fill', 'none');
    boundaryCircle1.setAttribute('stroke', '#ffffff');
    boundaryCircle1.setAttribute('stroke-width', '2.2');
    boundaryCircle1.setAttribute('opacity', '0.8');
    bordersGroup.appendChild(boundaryCircle1);

    // Vòng tròn phân ranh giới 4 mặt bên và mặt Đáy D
    const boundaryCircle2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    boundaryCircle2.setAttribute('cx', cx);
    boundaryCircle2.setAttribute('cy', cy);
    boundaryCircle2.setAttribute('r', R4);
    boundaryCircle2.setAttribute('fill', 'none');
    boundaryCircle2.setAttribute('stroke', '#ffffff');
    boundaryCircle2.setAttribute('stroke-width', '2.2');
    boundaryCircle2.setAttribute('opacity', '0.8');
    bordersGroup.appendChild(boundaryCircle2);

    this.mainGroup.appendChild(bordersGroup);
  }

  // Cập nhật màu 54 ô sticker đồng bộ thời gian thực
  update() {
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
}
