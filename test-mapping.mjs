// Kiểm tra ánh xạ i, j thành hàng và cột 3x3 cho từng mặt
import { readFileSync } from 'fs';

const D = 110;
const cx = 270, cy = 270;
const C1 = { x: cx, y: cy - D };
const C2 = { x: cx - D * Math.cos(Math.PI / 6), y: cy + D * Math.sin(Math.PI / 6) };
const C3 = { x: cx + D * Math.cos(Math.PI / 6), y: cy + D * Math.sin(Math.PI / 6) };
const radii = [135, 162, 189];

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

function computeFace(cA, cB) {
  const inner = [];
  const outer = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const pts = getIntersections(cA, radii[i], cB, radii[j]);
      const d0 = Math.hypot(pts[0].x - cx, pts[0].y - cy);
      const d1 = Math.hypot(pts[1].x - cx, pts[1].y - cy);
      const inPt = d0 < d1 ? pts[0] : pts[1];
      const outPt = d0 < d1 ? pts[1] : pts[0];
      inner.push({ ...inPt, i, j });
      outer.push({ ...outPt, i, j });
    }
  }
  return { inner, outer };
}

const yellow = computeFace(C2, C3).inner;
// Sort by y, then by x
yellow.sort((a, b) => a.y - b.y || a.x - b.x);
console.log('Yellow sorted points (Top to Bottom):');
yellow.forEach((p, idx) => console.log(idx, `x: ${p.x.toFixed(1)}, y: ${p.y.toFixed(1)} (i:${p.i}, j:${p.j})`));
