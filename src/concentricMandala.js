// Bản đồ phẳng hóa Rubik bằng 3 bộ vòng tròn đồng tâm đan xen
// Dựa trên mô hình hình học nổi tiếng từ Reddit: "Now the legendary Rubik's Cube is easy to understand"
// 3 tâm tạo thành tam giác đều, mỗi tâm có 3 vòng tròn đồng tâm cắt nhau
// sinh ra chính xác 6 cụm mặt, mỗi mặt gồm đúng 9 giao điểm = 54 ô tròn đại diện cho 54 sticker của Rubik.

import { FACE_COLORS, FACE_NAMES } from './rubikState.js';

export class ConcentricMandala {
  constructor(containerId, rubikState, onMoveRequest) {
    this.container = document.getElementById(containerId);
    this.state = rubikState;
    this.onMoveRequest = onMoveRequest;

    this.initCanvas();
    this.update();
  }

  initCanvas() {
    this.container.innerHTML = '';

    // Tạo SVG độ nét cao với viewBox 0 0 540 540
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.setAttribute('viewBox', '0 0 540 540');
    this.svg.setAttribute('class', 'w-full h-full select-none');
    this.container.appendChild(this.svg);

    // Filter glow cho chấm và vòng neon
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
      <filter id="dot-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2.5" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="ring-neon-glow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="3.5" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    `;
    this.svg.appendChild(defs);

    this.ringsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.ringsGroup.setAttribute('id', 'concentric-rings');
    this.svg.appendChild(this.ringsGroup);

    this.dotsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.dotsGroup.setAttribute('id', 'rubik-dots');
    this.svg.appendChild(this.dotsGroup);

    this.labelsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.labelsGroup.setAttribute('id', 'face-labels');
    this.svg.appendChild(this.labelsGroup);

    this.computeAndRenderGeometry();
  }

  computeAndRenderGeometry() {
    const cx = 270;
    const cy = 270;
    // Thu gọn khoảng cách và bán kính để hình mandala nhỏ lại vừa vặn, thở thoải mái
    const D = 96; 

    // 3 tâm:
    // C1: Đỉnh trên
    // C2: Đáy trái
    // C3: Đáy phải
    this.centers = {
      C1: { x: cx, y: cy - D },
      C2: { x: cx - D * Math.cos(Math.PI / 6), y: cy + D * Math.sin(Math.PI / 6) },
      C3: { x: cx + D * Math.cos(Math.PI / 6), y: cy + D * Math.sin(Math.PI / 6) }
    };

    // 3 bán kính cho 3 vòng tròn đồng tâm ở mỗi tâm (nhỏ gọn vừa vặn khung 540x540)
    this.radii = [118, 142, 166];

    // Vẽ 9 đường tròn đồng tâm (3 bộ x 3 vòng)
    this.ringElements = [];
    const centerList = [
      { id: 'C1', pt: this.centers.C1, color: '#38bdf8' },
      { id: 'C2', pt: this.centers.C2, color: '#f43f5e' },
      { id: 'C3', pt: this.centers.C3, color: '#10b981' }
    ];

    centerList.forEach((c) => {
      this.radii.forEach((r, rIdx) => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', c.pt.x);
        circle.setAttribute('cy', c.pt.y);
        circle.setAttribute('r', r);
        circle.setAttribute('fill', 'none');
        circle.setAttribute('stroke', '#475569');
        circle.setAttribute('stroke-width', rIdx === 1 ? '1.5' : '1.0');
        circle.setAttribute('opacity', '0.35');
        circle.setAttribute('class', `ring-${c.id}-${rIdx}`);
        circle.style.transition = 'stroke 0.25s ease, opacity 0.25s ease, stroke-width 0.25s ease, filter 0.25s ease';
        this.ringsGroup.appendChild(circle);
        this.ringElements.push({ element: circle, centerId: c.id, layerIdx: rIdx });
      });
    });

    // Hàm giải phương trình giao điểm của 2 đường tròn (cA, rA) và (cB, rB)
    const getIntersections = (cA, rA, cB, rB) => {
      const dx = cB.x - cA.x;
      const dy = cB.y - cA.y;
      const d = Math.hypot(dx, dy);
      if (d > rA + rB || d < Math.abs(rA - rB)) return null;

      const a = (rA * rA - rB * rB + d * d) / (2 * d);
      const h = Math.sqrt(Math.max(0, rA * rA - a * a));

      const p2x = cA.x + (a * dx) / d;
      const p2y = cA.y + (a * dy) / d;

      return [
        { x: p2x + (h * -dy) / d, y: p2y + (h * dx) / d },
        { x: p2x - (h * -dy) / d, y: p2y - (h * dx) / d }
      ];
    };

    // Hàm lấy 9 điểm giao nhau giữa 2 bộ 3 vòng tròn
    const getFacePoints = (cA, cB) => {
      const inner = [];
      const outer = [];
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          const pts = getIntersections(cA, this.radii[i], cB, this.radii[j]);
          if (pts) {
            const d0 = Math.hypot(pts[0].x - cx, pts[0].y - cy);
            const d1 = Math.hypot(pts[1].x - cx, pts[1].y - cy);
            const inPt = d0 < d1 ? pts[0] : pts[1];
            const outPt = d0 < d1 ? pts[1] : pts[0];
            inner.push({ ...inPt, i, j });
            outer.push({ ...outPt, i, j });
          }
        }
      }
      return { inner, outer };
    };

    // 6 cụm mặt:
    // C2 (Đáy Trái) x C3 (Đáy Phải) -> U (Vàng, inner trên) & D (Đỏ, outer dưới)
    const pairC2C3 = getFacePoints(this.centers.C2, this.centers.C3);
    // C3 (Đáy Phải) x C1 (Đỉnh Trên) -> F (Cyan, inner trái) & B (Xanh Lá, outer phải)
    const pairC3C1 = getFacePoints(this.centers.C3, this.centers.C1);
    // C1 (Đỉnh Trên) x C2 (Đáy Trái) -> R (Xanh Dương, inner phải) & L (Magenta, outer trái)
    const pairC1C2 = getFacePoints(this.centers.C1, this.centers.C2);

    this.faceDefinitions = {
      U: { points: pairC2C3.inner, label: 'U', move: 'U', prime: "U'" },
      D: { points: pairC2C3.outer, label: 'D', move: 'D', prime: "D'" },
      F: { points: pairC3C1.inner, label: 'F', move: 'F', prime: "F'" },
      B: { points: pairC3C1.outer, label: 'B', move: 'B', prime: "B'" },
      R: { points: pairC1C2.inner, label: 'R', move: 'R', prime: "R'" },
      L: { points: pairC1C2.outer, label: 'L', move: 'L', prime: "L'" },
    };

    // Sắp xếp các điểm theo thứ tự ma trận 3x3 (row 0..2, col 0..2)
    // sao cho index 4 luôn là ô tâm
    this.dotElements = {};

    for (const [faceKey, def] of Object.entries(this.faceDefinitions)) {
      this.dotElements[faceKey] = [];

      // Sắp xếp các điểm theo thứ tự (i, j)
      def.points.sort((a, b) => {
        if (a.i !== b.i) return a.i - b.i;
        return a.j - b.j;
      });

      // Tạo nhóm chứa 9 điểm tròn của mặt này
      const faceG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      faceG.setAttribute('class', 'cursor-pointer group');

      // Click vào cụm mặt để xoay
      faceG.addEventListener('click', (e) => {
        if (this.onMoveRequest) {
          const move = e.shiftKey ? def.prime : def.move;
          this.onMoveRequest(move);
        }
      });

      // Hover xem trước vòng tròn tương ứng sáng lên
      faceG.addEventListener('mouseenter', () => {
        if (!this.currentAnim) {
          this.previewRingHover(def.move);
        }
      });
      faceG.addEventListener('mouseleave', () => {
        if (!this.currentAnim) {
          this.resetRingHighlights();
        }
      });

      // Tính trọng tâm của 9 điểm để tạo vùng chạm tiện lợi cho cả mặt
      const avgX = def.points.reduce((acc, p) => acc + p.x, 0) / def.points.length;
      const avgY = def.points.reduce((acc, p) => acc + p.y, 0) / def.points.length;

      // Vùng chạm vô hình bao phủ toàn bộ 9 chấm để không bị hụt click
      const clusterHit = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      clusterHit.setAttribute('cx', avgX.toFixed(2));
      clusterHit.setAttribute('cy', avgY.toFixed(2));
      clusterHit.setAttribute('r', '38');
      clusterHit.setAttribute('fill', 'rgba(255, 255, 255, 0.001)');
      faceG.appendChild(clusterHit);

      // Vẽ 9 điểm tròn tại các giao điểm (ô tâm có viền trắng nổi bật)
      def.points.forEach((pt, idx) => {
        const isCenter = idx === 4;
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', pt.x.toFixed(2));
        circle.setAttribute('cy', pt.y.toFixed(2));
        circle.setAttribute('r', isCenter ? '8.0' : '6.5'); // Ô tâm lớn hơn và có viền trắng
        circle.setAttribute('fill', FACE_COLORS[faceKey] || '#ffffff');
        circle.setAttribute('stroke', isCenter ? '#ffffff' : '#090d16');
        circle.setAttribute('stroke-width', isCenter ? '2.0' : '1.5');
        circle.setAttribute('class', 'transition-all duration-200');

        // Hiệu ứng viền phát sáng khi hover
        circle.addEventListener('mouseenter', () => {
          circle.setAttribute('stroke', '#38bdf8');
          circle.setAttribute('stroke-width', '2.5');
        });
        circle.addEventListener('mouseleave', () => {
          circle.setAttribute('stroke', isCenter ? '#ffffff' : '#090d16');
          circle.setAttribute('stroke-width', isCenter ? '2.0' : '1.5');
        });

        const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        title.textContent = `Mặt ${def.label}: Chạm vào mặt để xoay thuận (${def.move}) | Chạm vòng ngoài để xoay ngược (${def.prime})`;
        circle.appendChild(title);

        faceG.appendChild(circle);
        this.dotElements[faceKey].push(circle);
      });

      this.dotsGroup.appendChild(faceG);

      // VỊ TRÍ 6 HUY HIỆU NGOÀI (Rời hẳn ra ngoài 9 điểm, xa khu vực trung tâm)
      const outerBadgePositions = {
        U: { x: 270, y: 34 },
        D: { x: 270, y: 506 },
        L: { x: 38, y: 195 },
        B: { x: 502, y: 195 },
        F: { x: 68, y: 405 },
        R: { x: 472, y: 405 },
      };

      const badgePos = outerBadgePositions[faceKey];
      const labelX = badgePos.x;
      const labelY = badgePos.y;

      // Nút huy hiệu nhãn bên ngoài: Bấm vào đây hoặc lân cận để xoay ngược (Prime)
      const badgeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      badgeGroup.setAttribute('class', 'cursor-pointer select-none group');

      const badgeTitle = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      badgeTitle.textContent = `Vòng ${def.label}': Chạm vào vòng hoặc lân cận để xoay ngược (${def.prime})`;
      badgeGroup.appendChild(badgeTitle);

      // 1. Vùng chạm rộng rãi (hit area) lân cận vòng cho ngón tay điện thoại & chuột
      const hitZone = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      hitZone.setAttribute('cx', labelX);
      hitZone.setAttribute('cy', labelY);
      hitZone.setAttribute('r', '34');
      hitZone.setAttribute('fill', 'rgba(255, 255, 255, 0.001)');
      badgeGroup.appendChild(hitZone);

      // 2. Vòng hào quang đứt đoạn (halo ring) viền ngoài tinh tế
      const haloRing = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      haloRing.setAttribute('cx', labelX);
      haloRing.setAttribute('cy', labelY);
      haloRing.setAttribute('r', '23');
      haloRing.setAttribute('fill', 'none');
      haloRing.setAttribute('stroke', FACE_COLORS[faceKey] || '#64748b');
      haloRing.setAttribute('stroke-width', '1.5');
      haloRing.setAttribute('stroke-dasharray', '3 3');
      haloRing.setAttribute('opacity', '0.4');
      haloRing.setAttribute('class', 'transition-all duration-300');
      badgeGroup.appendChild(haloRing);

      // 3. Vòng tròn nút chính nổi bật
      const badgeBg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      badgeBg.setAttribute('cx', labelX);
      badgeBg.setAttribute('cy', labelY);
      badgeBg.setAttribute('r', '16');
      badgeBg.setAttribute('fill', '#090d16');
      badgeBg.setAttribute('stroke', FACE_COLORS[faceKey] || '#64748b');
      badgeBg.setAttribute('stroke-width', '2.2');
      badgeBg.setAttribute('class', 'transition-all duration-200');
      badgeGroup.appendChild(badgeBg);

      // 4. Nhãn chữ hiển thị (U', D', F', B', R', L')
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', labelX);
      label.setAttribute('y', labelY + 4.5);
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('fill', '#f8fafc');
      label.setAttribute('font-size', '12');
      label.setAttribute('font-weight', '900');
      label.setAttribute('letter-spacing', '0.5px');
      label.textContent = def.prime;
      badgeGroup.appendChild(label);

      // Hiệu ứng hover nổi bật cho toàn bộ vòng và vùng lân cận
      badgeGroup.addEventListener('mouseenter', () => {
        badgeBg.setAttribute('fill', '#1e293b');
        badgeBg.setAttribute('stroke', '#38bdf8');
        badgeBg.setAttribute('stroke-width', '2.8');
        haloRing.setAttribute('stroke', '#38bdf8');
        haloRing.setAttribute('opacity', '0.9');
        label.setAttribute('fill', '#38bdf8');
        if (!this.currentAnim) {
          this.previewRingHover(def.prime);
        }
      });
      badgeGroup.addEventListener('mouseleave', () => {
        badgeBg.setAttribute('fill', '#090d16');
        badgeBg.setAttribute('stroke', FACE_COLORS[faceKey] || '#64748b');
        badgeBg.setAttribute('stroke-width', '2.2');
        haloRing.setAttribute('stroke', FACE_COLORS[faceKey] || '#64748b');
        haloRing.setAttribute('opacity', '0.4');
        label.setAttribute('fill', '#f8fafc');
        if (!this.currentAnim) {
          this.resetRingHighlights();
        }
      });

      // Click vào vòng hoặc lân cận vòng -> Xoay ngược
      badgeGroup.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.onMoveRequest) {
          this.onMoveRequest(def.prime);
        }
      });

      this.labelsGroup.appendChild(badgeGroup);
    }

    // Nhóm chứa các chấm tròn chuyển động trung gian
    this.animGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.animGroup.setAttribute('id', 'anim-glide-group');
    this.svg.appendChild(this.animGroup);

    this.currentAnim = null;
  }

  // Cập nhật màu 54 điểm tròn đồng bộ thời gian thực với trạng thái Rubik
  update() {
    if (this.currentAnim) {
      cancelAnimationFrame(this.currentAnim);
      this.currentAnim = null;
    }
    if (this.animGroup) {
      this.animGroup.innerHTML = '';
    }

    if (!this.dotElements) return;
    for (const [faceKey, dots] of Object.entries(this.dotElements)) {
      const faceState = this.state.faces[faceKey];
      if (!faceState) continue;
      dots.forEach((dot, idx) => {
        const colorKey = faceState[idx];
        const hexColor = FACE_COLORS[colorKey] || '#334155';
        dot.setAttribute('fill', hexColor);
        dot.setAttribute('opacity', '1');
      });
    }
  }

  // HIỆU ỨNG CHUYỂN ĐỘNG TRUNG GIAN TRƯỢT CUNG TRÒN (Arc Glide Animation)
  animateMove(move, duration = 160) {
    if (this.currentAnim) {
      cancelAnimationFrame(this.currentAnim);
      this.currentAnim = null;
    }
    this.animGroup.innerHTML = '';

    const faceKey = move[0];
    const isPrime = move.includes("'");
    const isDouble = move.includes('2');
    const dir = isPrime ? -1 : 1;
    const turns = isDouble ? 2 : 1;

    // Xác định tâm xoay và các mặt xung quanh bị ảnh hưởng
    let axisCenter = this.centers.C1;
    let sideSign = 1;

    if (faceKey === 'U') {
      axisCenter = this.centers.C1;
      sideSign = 1;
    } else if (faceKey === 'D') {
      axisCenter = this.centers.C1;
      sideSign = -1;
    } else if (faceKey === 'F') {
      axisCenter = this.centers.C2;
      sideSign = 1;
    } else if (faceKey === 'B') {
      axisCenter = this.centers.C2;
      sideSign = -1;
    } else if (faceKey === 'R') {
      axisCenter = this.centers.C3;
      sideSign = 1;
    } else if (faceKey === 'L') {
      axisCenter = this.centers.C3;
      sideSign = -1;
    }

    // Danh sách các sticker bị di chuyển
    const sideMap = {
      U: [
        { f: 'F', idxs: [0, 1, 2] },
        { f: 'R', idxs: [0, 1, 2] },
        { f: 'B', idxs: [0, 1, 2] },
        { f: 'L', idxs: [0, 1, 2] }
      ],
      D: [
        { f: 'F', idxs: [6, 7, 8] },
        { f: 'L', idxs: [6, 7, 8] },
        { f: 'B', idxs: [6, 7, 8] },
        { f: 'R', idxs: [6, 7, 8] }
      ],
      F: [
        { f: 'U', idxs: [6, 7, 8] },
        { f: 'R', idxs: [0, 3, 6] },
        { f: 'D', idxs: [0, 1, 2] },
        { f: 'L', idxs: [2, 5, 8] }
      ],
      B: [
        { f: 'U', idxs: [0, 1, 2] },
        { f: 'L', idxs: [0, 3, 6] },
        { f: 'D', idxs: [6, 7, 8] },
        { f: 'R', idxs: [2, 5, 8] }
      ],
      R: [
        { f: 'U', idxs: [2, 5, 8] },
        { f: 'B', idxs: [0, 3, 6] },
        { f: 'D', idxs: [2, 5, 8] },
        { f: 'F', idxs: [2, 5, 8] }
      ],
      L: [
        { f: 'U', idxs: [0, 3, 6] },
        { f: 'F', idxs: [0, 3, 6] },
        { f: 'D', idxs: [0, 3, 6] },
        { f: 'B', idxs: [2, 5, 8] }
      ]
    };

    const movingItems = [];

    // 1. Nhóm 9 điểm của mặt chính (xoay tại chỗ quanh trọng tâm mặt)
    const mainFaceDef = this.faceDefinitions[faceKey];
    if (mainFaceDef) {
      const avgX = mainFaceDef.points.reduce((acc, p) => acc + p.x, 0) / mainFaceDef.points.length;
      const avgY = mainFaceDef.points.reduce((acc, p) => acc + p.y, 0) / mainFaceDef.points.length;
      const faceCenter = { x: avgX, y: avgY };

      mainFaceDef.points.forEach((pt, idx) => {
        const baseDot = this.dotElements[faceKey][idx];
        const color = baseDot.getAttribute('fill');
        baseDot.setAttribute('opacity', '0.15');

        const dx = pt.x - faceCenter.x;
        const dy = pt.y - faceCenter.y;
        const radius = Math.hypot(dx, dy);
        const startAngle = Math.atan2(dy, dx);
        const deltaAngle = dir * (Math.PI / 2) * turns;

        // Tạo phần tử chấm tròn chuyển động
        const animCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        animCircle.setAttribute('r', idx === 4 ? '7.5' : '6.5');
        animCircle.setAttribute('fill', color);
        animCircle.setAttribute('stroke', '#ffffff');
        animCircle.setAttribute('stroke-width', '1.8');
        this.animGroup.appendChild(animCircle);

        movingItems.push({
          element: animCircle,
          center: faceCenter,
          radius,
          startAngle,
          deltaAngle,
          baseDot
        });
      });
    }

    // 2. Nhóm 12 điểm ở 4 cạnh bên (trượt dọc theo cung tròn đồng tâm)
    const sides = sideMap[faceKey] || [];
    sides.forEach(group => {
      group.idxs.forEach(idx => {
        const pt = this.faceDefinitions[group.f].points[idx];
        const baseDot = this.dotElements[group.f][idx];
        const color = baseDot.getAttribute('fill');
        baseDot.setAttribute('opacity', '0.15');

        const dx = pt.x - axisCenter.x;
        const dy = pt.y - axisCenter.y;
        const radius = Math.hypot(dx, dy);
        const startAngle = Math.atan2(dy, dx);
        // Trượt dọc theo cung tròn góc 90 độ
        const deltaAngle = dir * sideSign * (Math.PI / 2) * turns;

        const animCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        animCircle.setAttribute('r', '6.5');
        animCircle.setAttribute('fill', color);
        animCircle.setAttribute('stroke', '#ffffff');
        animCircle.setAttribute('stroke-width', '1.8');
        this.animGroup.appendChild(animCircle);

        movingItems.push({
          element: animCircle,
          center: axisCenter,
          radius,
          startAngle,
          deltaAngle,
          baseDot
        });
      });
    });

    // Phát sáng duy nhất dải vòng tròn chuyển động
    this.highlightMove(move, duration);

    // Chạy hoạt họa 60fps mượt mà
    const startTime = performance.now();
    const animLoop = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Easing mượt mà
      const ease = progress < 0.5
        ? 2 * progress * progress
        : -1 + (4 - 2 * progress) * progress;

      movingItems.forEach(item => {
        const curAngle = item.startAngle + item.deltaAngle * ease;
        const curX = item.center.x + item.radius * Math.cos(curAngle);
        const curY = item.center.y + item.radius * Math.sin(curAngle);
        item.element.setAttribute('cx', curX.toFixed(2));
        item.element.setAttribute('cy', curY.toFixed(2));
      });

      if (progress < 1) {
        this.currentAnim = requestAnimationFrame(animLoop);
      } else {
        this.currentAnim = null;
        this.animGroup.innerHTML = '';
        movingItems.forEach(item => item.baseDot.setAttribute('opacity', '1'));
        this.update();
      }
    };

    this.currentAnim = requestAnimationFrame(animLoop);
  }

  // Lấy ID tâm vòng tròn tương ứng với từng mặt: U/D -> C1, F/B -> C2, R/L -> C3
  getCenterForMove(move) {
    if (!move) return null;
    const faceKey = move[0].toUpperCase();
    if (faceKey === 'U' || faceKey === 'D' || faceKey === 'E') return 'C1';
    if (faceKey === 'F' || faceKey === 'B' || faceKey === 'S') return 'C2';
    if (faceKey === 'R' || faceKey === 'L' || faceKey === 'M') return 'C3';
    return null;
  }

  // Xác định chính xác chỉ số vòng tròn trong 3 vòng đồng tâm:
  // layerIdx = 0: Vòng trong cùng (r = 118) -> U, F, R (gần tâm tương ứng)
  // layerIdx = 1: Vòng ở giữa (r = 142) -> M, E, S (các lát cắt giữa)
  // layerIdx = 2: Vòng bao ngoài cùng (r = 166) -> D, B, L (xa tâm tương ứng)
  getActiveRingIndex(move) {
    if (!move) return 1;
    const faceKey = move[0].toUpperCase();
    if (faceKey === 'U' || faceKey === 'F' || faceKey === 'R') return 0; // Vòng trong
    if (faceKey === 'D' || faceKey === 'B' || faceKey === 'L') return 2; // Vòng ngoài
    return 1; // Vòng giữa
  }

  // Hiệu ứng phát sáng RIÊNG BIỆT cho duy nhất vòng tròn chuyển động (đúng như hình minh họa & video)
  highlightMove(move, duration = 160) {
    const activeCenterId = this.getCenterForMove(move);
    const activeLayerIdx = this.getActiveRingIndex(move);
    if (!activeCenterId || !this.ringElements) return;

    if (this.highlightTimeout) {
      clearTimeout(this.highlightTimeout);
      this.highlightTimeout = null;
    }

    this.ringElements.forEach(({ element, centerId, layerIdx }) => {
      if (centerId === activeCenterId && layerIdx === activeLayerIdx) {
        // Duy nhất vòng tròn tương ứng với thao tác quay: sáng rực rỡ neon với glow
        element.setAttribute('stroke', '#38bdf8');
        element.setAttribute('stroke-width', '3.0');
        element.setAttribute('opacity', '1.0');
        element.setAttribute('filter', 'url(#ring-neon-glow)');
      } else if (centerId === activeCenterId) {
        // 2 vòng tròn còn lại cùng tâm: giữ mờ nhẹ để thấy rõ cấu trúc đồng tâm
        element.setAttribute('stroke', '#0284c7');
        element.setAttribute('stroke-width', '1.2');
        element.setAttribute('opacity', '0.35');
        element.removeAttribute('filter');
      } else {
        // 6 vòng thuộc 2 tâm còn lại: chìm hẳn xuống nền tối để tôn vòng đang quay
        element.setAttribute('stroke', '#334155');
        element.setAttribute('stroke-width', '1.0');
        element.setAttribute('opacity', '0.15');
        element.removeAttribute('filter');
      }
    });

    // Sau khi hoạt họa kết thúc, chuyển tiếp mượt mà về trạng thái bình thường
    this.highlightTimeout = setTimeout(() => {
      this.resetRingHighlights();
    }, Math.max(duration + 100, 250));
  }

  // Hiệu ứng xem trước khi rê chuột qua cụm mặt hoặc nút xoay
  previewRingHover(move) {
    if (this.currentAnim) return;
    const centerId = this.getCenterForMove(move);
    const targetLayerIdx = this.getActiveRingIndex(move);
    if (!centerId || !this.ringElements) return;

    this.ringElements.forEach(({ element, centerId: cid, layerIdx }) => {
      if (cid === centerId && layerIdx === targetLayerIdx) {
        element.setAttribute('stroke', '#38bdf8');
        element.setAttribute('stroke-width', '2.6');
        element.setAttribute('opacity', '0.95');
        element.setAttribute('filter', 'url(#ring-neon-glow)');
      } else if (cid === centerId) {
        element.setAttribute('stroke', '#0ea5e9');
        element.setAttribute('stroke-width', '1.2');
        element.setAttribute('opacity', '0.45');
        element.removeAttribute('filter');
      } else {
        element.setAttribute('stroke', '#334155');
        element.setAttribute('stroke-width', '1.0');
        element.setAttribute('opacity', '0.15');
        element.removeAttribute('filter');
      }
    });
  }

  resetRingHighlights() {
    if (this.highlightTimeout) {
      clearTimeout(this.highlightTimeout);
      this.highlightTimeout = null;
    }
    if (!this.ringElements) return;
    this.ringElements.forEach(({ element, layerIdx }) => {
      element.setAttribute('stroke', '#475569');
      element.setAttribute('stroke-width', layerIdx === 1 ? '1.5' : '1.0');
      element.setAttribute('opacity', '0.35');
      element.removeAttribute('filter');
    });
  }
}
