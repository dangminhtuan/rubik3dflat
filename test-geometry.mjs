// Test tính toán tọa độ giao điểm 3 bộ vòng tròn đồng tâm chuẩn theo Reddit
const D = 120;
const cx = 270, cy = 270;

// 3 tâm tạo thành tam giác đều
// C1: Đỉnh trên (0, -D)
// C2: Đáy trái (-D*cos30, D*sin30)
// C3: Đáy phải (D*cos30, D*sin30)
const C1 = { x: cx, y: cy - D };
const C2 = { x: cx - D * Math.cos(Math.PI / 6), y: cy + D * Math.sin(Math.PI / 6) };
const C3 = { x: cx + D * Math.cos(Math.PI / 6), y: cy + D * Math.sin(Math.PI / 6) };

const radii = [142, 170, 198];

function getIntersections(cA, rA, cB, rB) {
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
}

function computeFacePoints(cA, cB) {
  const inner = [];
  const outer = [];

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const pts = getIntersections(cA, radii[i], cB, radii[j]);
      if (pts) {
        // Điểm nào gần tâm (cx, cy) hơn là inner, xa hơn là outer
        const d0 = Math.hypot(pts[0].x - cx, pts[0].y - cy);
        const d1 = Math.hypot(pts[1].x - cx, pts[1].y - cy);
        if (d0 < d1) {
          inner.push({ x: pts[0].x, y: pts[0].y, i, j });
          outer.push({ x: pts[1].x, y: pts[1].y, i, j });
        } else {
          inner.push({ x: pts[1].x, y: pts[1].y, i, j });
          outer.push({ x: pts[0].x, y: pts[0].y, i, j });
        }
      }
    }
  }
  return { inner, outer };
}

const pairC2C3 = computeFacePoints(C2, C3); // Yellow (inner) & Red (outer)
const pairC1C3 = computeFacePoints(C3, C1); // Cyan (inner) & Green (outer)
const pairC1C2 = computeFacePoints(C1, C2); // Blue (inner) & Magenta (outer)

console.log('Yellow (inner) points:', pairC2C3.inner.length);
console.log('Red (outer) points:', pairC2C3.outer.length);
console.log('Cyan (inner) points:', pairC1C3.inner.length);
console.log('Green (outer) points:', pairC1C3.outer.length);
console.log('Blue (inner) points:', pairC1C2.inner.length);
console.log('Magenta (outer) points:', pairC1C2.outer.length);
