// Dựng không gian 3D Three.js cho Rubik với 3 Tấm Gương Phản Chiếu Mặt Khuất (B, D, L)
import * as THREE from 'three';
import { FACE_COLORS } from './rubikState.js';
import { i18n } from './i18n.js';

export class Rubik3D {
  constructor(canvasContainer, rubikState, onMoveComplete, onDirectClick, onMoveStart) {
    this.container = canvasContainer;
    this.state = rubikState;
    this.onMoveComplete = onMoveComplete;
    this.onDirectClick = onDirectClick;
    this.onMoveStart = onMoveStart;

    this.cubies = [];
    this.animationQueue = [];
    this.isAnimating = false;
    this.animationSpeed = 160; // ms mỗi lượt xoay

    this.customView = null;
    this.loadSavedView();
    this.initScene();
    this.createCube();
    this.createMirrors();
    this.setupInteraction();
    this.animate();

    window.addEventListener('resize', () => this.onResize());
  }

  initScene() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0e17);

    // Camera góc nhìn Isometric thoáng: nhìn rõ cả khối 3D và 3 gương phía sau
    const aspect = width / (height || 1);
    const fov = aspect < 1 ? 55 : 42;
    this.camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 100);
    this.defaultCameraPos = aspect < 1 
      ? new THREE.Vector3(6.8, 5.6, 8.4) 
      : new THREE.Vector3(5.8, 4.8, 7.0);
    this.camera.position.copy(this.defaultCameraPos);
    this.camera.lookAt(0, aspect < 1 ? -0.35 : 0, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    // Ánh sáng chân thực
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    this.scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight1.position.set(8, 12, 10);
    dirLight1.castShadow = true;
    this.scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x60a5fa, 0.8);
    dirLight2.position.set(-10, -6, -10);
    this.scene.add(dirLight2);
  }

  // Tạo 27 khối con (Cubies)
  createCube() {
    this.cubeGroup = new THREE.Group();
    this.scene.add(this.cubeGroup);

    const cubieSize = 0.94;
    const spacing = 1.0;
    const geometry = new THREE.BoxGeometry(cubieSize, cubieSize, cubieSize);

    // Màu đen cho phần lõi nhựa Rubik
    const blackMat = new THREE.MeshStandardMaterial({
      color: 0x11141d,
      roughness: 0.45,
      metalness: 0.1
    });

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          // 6 vật liệu cho 6 mặt của mỗi khối con
          // Thứ tự Three.js Box: +X (R), -X (L), +Y (U), -Y (D), +Z (F), -Z (B)
          const materials = [
            x === 1 ? this.createStickerMaterial(FACE_COLORS.R) : blackMat,
            x === -1 ? this.createStickerMaterial(FACE_COLORS.L) : blackMat,
            y === 1 ? this.createStickerMaterial(FACE_COLORS.U) : blackMat,
            y === -1 ? this.createStickerMaterial(FACE_COLORS.D) : blackMat,
            z === 1 ? this.createStickerMaterial(FACE_COLORS.F) : blackMat,
            z === -1 ? this.createStickerMaterial(FACE_COLORS.B) : blackMat,
          ];

          const cubie = new THREE.Mesh(geometry, materials);
          cubie.position.set(x * spacing, y * spacing, z * spacing);
          cubie.castShadow = true;
          cubie.receiveShadow = true;
          cubie.userData = { initialCoord: { x, y, z } };

          this.cubeGroup.add(cubie);
          this.cubies.push(cubie);
        }
      }
    }
  }

  createStickerMaterial(colorHex) {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(colorHex),
      roughness: 0.25,
      metalness: 0.15,
    });
  }

  // TẠO 3 TẤM GƯƠNG SOi 3 MẶT KHUẤT PHÍA SAU (B, D, L)
  createMirrors() {
    this.mirrorTiles = { B: [], D: [], L: [] };
    const mirrorGroup = new THREE.Group();
    this.scene.add(mirrorGroup);

    // Kích thước tấm gương
    const panelSize = 3.2;
    const tileSize = 0.9;
    const tileGap = 0.12;

    const createMirrorPanel = (title, pos, rot, faceKey, borderHex) => {
      const panel = new THREE.Group();
      panel.position.set(pos.x, pos.y, pos.z);
      panel.rotation.set(rot.x, rot.y, rot.z);

      // Khung kính gương
      const frameGeo = new THREE.BoxGeometry(panelSize, panelSize, 0.08);
      const frameMat = new THREE.MeshStandardMaterial({
        color: 0x070b14,
        roughness: 0.1,
        metalness: 0.8,
      });
      const frame = new THREE.Mesh(frameGeo, frameMat);
      panel.add(frame);

      // Viền gương phát sáng neon
      const borderGeo = new THREE.EdgesGeometry(frameGeo);
      const borderMat = new THREE.LineBasicMaterial({ color: borderHex, linewidth: 2 });
      const border = new THREE.LineSegments(borderGeo, borderMat);
      panel.add(border);

      // 9 ô phản chiếu trên bề mặt gương
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          const tileGeo = new THREE.PlaneGeometry(tileSize, tileSize);
          const tileMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(FACE_COLORS[faceKey]),
            roughness: 0.15,
            metalness: 0.3,
            side: THREE.DoubleSide
          });
          const tile = new THREE.Mesh(tileGeo, tileMat);

          // Phản chiếu gương (đảo chiều ngang cho chuẩn phản chiếu quang học)
          const posX = (col - 1) * (tileSize + tileGap);
          const posY = (1 - row) * (tileSize + tileGap);
          tile.position.set(posX, posY, 0.05);
          tile.userData = { isMirrorTile: true, faceKey, tileIdx: row * 3 + col };

          panel.add(tile);
          this.mirrorTiles[faceKey].push(tile);
        }
      }

      mirrorGroup.add(panel);
    };

    // 1. Gương Mặt Sau (B - Xanh Lá): Đặt lùi ra xa tại Z = -4.8, hơi chếch để nhìn rõ cả 9 ô
    createMirrorPanel(
      'Mặt Sau (B)',
      { x: 0.2, y: 0.6, z: -4.8 },
      { x: -0.06, y: 0, z: 0 },
      'B',
      0x22c55e
    );

    // 2. Gương Mặt Trái (L - Magenta): Đặt lùi ra xa tại X = -4.8, hơi chếch để nhìn rõ cả 9 ô
    createMirrorPanel(
      'Mặt Trái (L)',
      { x: -4.8, y: 0.6, z: 0.2 },
      { x: 0, y: Math.PI / 2 + 0.06, z: 0 },
      'L',
      0xe11d48
    );

    // 3. Gương Mặt Dưới (D - Trắng): Đặt lùi ra xa tại Y = -4.8, hơi ngửa lên để nhìn rõ cả 9 ô
    createMirrorPanel(
      'Mặt Đáy (D)',
      { x: 0.2, y: -4.8, z: 0.2 },
      { x: -Math.PI / 2 + 0.06, y: 0, z: 0 },
      'D',
      0xffffff
    );
  }

  // Cập nhật màu trên 3 tấm gương phản chiếu
  updateMirrors() {
    for (const faceKey of ['B', 'D', 'L']) {
      const faceState = this.state.faces[faceKey];
      const tiles = this.mirrorTiles[faceKey];
      if (!tiles || !faceState) continue;

      tiles.forEach((tile, idx) => {
        const colorHex = FACE_COLORS[faceState[idx]];
        tile.material.color.set(colorHex);
      });
    }
  }

  // Tương tác kéo chuột xoay góc nhìn, click trực tiếp vào khối/gương để xoay, và zoom to/nhỏ
  setupInteraction() {
    let isDragging = false;
    let downPos = { x: 0, y: 0 };
    let prevMousePos = { x: 0, y: 0 };
    let dragDist = 0;
    let prevTouchDist = 0;
    let lastClickTime = 0;
    let lastTouchTime = 0;

    this.spherical = new THREE.Spherical();
    if (this.customView) {
      this.spherical.theta = this.customView.theta;
      this.spherical.phi = this.customView.phi;
      this.spherical.radius = this.customView.radius;
      this.camera.position.setFromSpherical(this.spherical);
      this.camera.lookAt(0, 0, 0);
    } else {
      this.spherical.setFromVector3(this.camera.position);
    }

    const raycaster = new THREE.Raycaster();
    const mouseNdc = new THREE.Vector2();

    const getPointerNdc = (clientX, clientY) => {
      const rect = this.container.getBoundingClientRect();
      mouseNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouseNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      return mouseNdc;
    };

    const handleDirectClick = (clientX, clientY) => {
      const now = performance.now();
      // Chống double-fire / synthetic mouse events sau touch
      if (now - lastClickTime < 350) return;
      if (this.isAnimating || (this.animationQueue && this.animationQueue.length > 0) || !this.onDirectClick) return;

      const ndc = getPointerNdc(clientX, clientY);
      raycaster.setFromCamera(ndc, this.camera);

      // Tập hợp tất cả đối tượng tương tác: các khối cubies và các ô trên 3 gương
      const mirrorObjects = Object.values(this.mirrorTiles || {}).flat();
      const allTargets = [...this.cubies, ...mirrorObjects];
      const intersects = raycaster.intersectObjects(allTargets, false);

      if (intersects.length === 0) return;

      lastClickTime = now;
      const hit = intersects[0];
      let targetMove = null;

      // 1. Click vào ô trên gương phản chiếu
      if (hit.object.userData?.isMirrorTile) {
        const { faceKey, tileIdx } = hit.object.userData;
        // tileIdx 4 là ô chính giữa gương -> Xoay thuận; 8 ô rìa -> Xoay nghịch
        targetMove = tileIdx === 4 ? faceKey : `${faceKey}'`;
      }
      // 2. Click vào khối Rubik 3D
      else if (this.cubies.includes(hit.object) && hit.face) {
        // Tính vector pháp tuyến của mặt được click trong không gian thế giới
        const normalMatrix = new THREE.Matrix3().getNormalMatrix(hit.object.matrixWorld);
        const worldNormal = hit.face.normal.clone().applyMatrix3(normalMatrix).normalize();

        let face = null;
        if (worldNormal.y > 0.6) face = 'U';
        else if (worldNormal.y < -0.6) face = 'D';
        else if (worldNormal.x > 0.6) face = 'R';
        else if (worldNormal.x < -0.6) face = 'L';
        else if (worldNormal.z > 0.6) face = 'F';
        else if (worldNormal.z < -0.6) face = 'B';

        if (face) {
          const pos = hit.object.position;
          let isCenter = false;
          if (face === 'U' || face === 'D') {
            isCenter = Math.round(pos.x) === 0 && Math.round(pos.z) === 0;
          } else if (face === 'R' || face === 'L') {
            isCenter = Math.round(pos.y) === 0 && Math.round(pos.z) === 0;
          } else if (face === 'F' || face === 'B') {
            isCenter = Math.round(pos.x) === 0 && Math.round(pos.y) === 0;
          }

          // Ô tâm -> Xoay thuận (U), 8 ô rìa -> Xoay nghịch (U')
          targetMove = isCenter ? face : `${face}'`;
        }
      }

      if (targetMove && this.onDirectClick) {
        this.onDirectClick(targetMove);
      }
    };

    // 1. Kéo chuột xoay góc nhìn & Click trực tiếp
    this.container.addEventListener('mousedown', (e) => {
      // Bỏ qua nếu vừa có sự kiện touch kích hoạt để tránh mouse event giả lập
      if (Date.now() - lastTouchTime < 600) return;
      isDragging = true;
      downPos = { x: e.clientX, y: e.clientY };
      prevMousePos = { x: e.clientX, y: e.clientY };
      dragDist = 0;
      this.container.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
      if (Date.now() - lastTouchTime < 600) return;
      if (!isDragging) {
        // Hiển thị con trỏ pointer & tooltip khi rê chuột qua ô Rubik hoặc gương
        const ndc = getPointerNdc(e.clientX, e.clientY);
        raycaster.setFromCamera(ndc, this.camera);
        const mirrorObjects = Object.values(this.mirrorTiles || {}).flat();
        const intersects = raycaster.intersectObjects([...this.cubies, ...mirrorObjects], false);

        if (intersects.length > 0) {
          this.container.style.cursor = 'pointer';
          const hit = intersects[0];
          if (hit.object.userData?.isMirrorTile) {
            const { faceKey, tileIdx } = hit.object.userData;
            const action = tileIdx === 4 
              ? i18n.t('rubik3d_action_cw', { move: faceKey }) 
              : i18n.t('rubik3d_action_ccw', { move: `${faceKey}'` });
            this.container.title = i18n.t('rubik3d_mirror_tip', { face: faceKey, action });
          } else {
            this.container.title = i18n.t('rubik3d_tip');
          }
        } else {
          this.container.style.cursor = 'grab';
          this.container.title = i18n.t('rubik3d_orbit_tip');
        }
        return;
      }

      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;
      dragDist += Math.hypot(deltaX, deltaY);
      prevMousePos = { x: e.clientX, y: e.clientY };

      this.spherical.theta -= deltaX * 0.007;
      this.spherical.phi = Math.max(0.2, Math.min(Math.PI - 0.2, this.spherical.phi - deltaY * 0.007));

      this.camera.position.setFromSpherical(this.spherical);
      this.camera.lookAt(0, 0, 0);
    });

    window.addEventListener('mouseup', (e) => {
      if (Date.now() - lastTouchTime < 600) return;
      if (!isDragging) return;
      isDragging = false;
      this.container.style.cursor = 'grab';

      // Nếu kéo ít hơn hoặc bằng 5px -> coi là hành động Click/Tap trực tiếp
      if (dragDist <= 5) {
        handleDirectClick(e.clientX, e.clientY);
      }
    });

    // 2. Lăn chuột để phóng to / thu nhỏ (Giới hạn khoảng cách: 5.5 - 16.0)
    this.container.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomSpeed = 0.006;
      const delta = e.deltaY * zoomSpeed;
      this.spherical.radius = Math.max(5.5, Math.min(16.0, this.spherical.radius + delta));
      this.camera.position.setFromSpherical(this.spherical);
      this.camera.lookAt(0, 0, 0);
    }, { passive: false });

    // 3. Touch support: 1 ngón xoay/tap, 2 ngón chụm phóng to/thu nhỏ (Mobile)
    this.container.addEventListener('touchstart', (e) => {
      lastTouchTime = Date.now();
      if (e.touches.length === 1) {
        isDragging = true;
        downPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        dragDist = 0;
      } else if (e.touches.length === 2) {
        isDragging = false;
        prevTouchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1 && isDragging) {
        const deltaX = e.touches[0].clientX - prevMousePos.x;
        const deltaY = e.touches[0].clientY - prevMousePos.y;
        dragDist += Math.hypot(deltaX, deltaY);
        prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };

        this.spherical.theta -= deltaX * 0.007;
        this.spherical.phi = Math.max(0.2, Math.min(Math.PI - 0.2, this.spherical.phi - deltaY * 0.007));

        this.camera.position.setFromSpherical(this.spherical);
        this.camera.lookAt(0, 0, 0);
      } else if (e.touches.length === 2) {
        // Pinch to zoom trên điện thoại
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        if (prevTouchDist > 0) {
          const delta = (prevTouchDist - dist) * 0.02;
          this.spherical.radius = Math.max(5.5, Math.min(16.0, this.spherical.radius + delta));
          this.camera.position.setFromSpherical(this.spherical);
          this.camera.lookAt(0, 0, 0);
        }
        prevTouchDist = dist;
      }
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      isDragging = false;
      prevTouchDist = 0;

      // Xử lý chạm trên màn hình điện thoại nếu không kéo quá 6px
      if (dragDist <= 6) {
        const touch = e.changedTouches && e.changedTouches[0];
        const clientX = touch ? touch.clientX : downPos.x;
        const clientY = touch ? touch.clientY : downPos.y;
        handleDirectClick(clientX, clientY);
      }
    });
  }

  // Hàm zoom theo nấc (+ / -)
  zoom(delta) {
    if (!this.spherical) return;
    this.spherical.radius = Math.max(5.5, Math.min(16.0, this.spherical.radius + delta));
    this.camera.position.setFromSpherical(this.spherical);
    this.camera.lookAt(0, 0, 0);
  }

  loadSavedView() {
    try {
      const saved = localStorage.getItem('rubik_custom_camera_view');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.theta === 'number' && typeof parsed.phi === 'number' && typeof parsed.radius === 'number') {
          this.customView = parsed;
        }
      }
    } catch (e) {
      this.customView = null;
    }
  }

  saveCurrentView() {
    if (!this.spherical) return false;
    this.customView = {
      theta: this.spherical.theta,
      phi: this.spherical.phi,
      radius: this.spherical.radius
    };
    try {
      localStorage.setItem('rubik_custom_camera_view', JSON.stringify(this.customView));
    } catch (e) {}
    return true;
  }

  clearSavedView() {
    this.customView = null;
    try {
      localStorage.removeItem('rubik_custom_camera_view');
    } catch (e) {}
    this.resetCamera(true);
  }

  hasSavedView() {
    return !!this.customView;
  }

  resetCamera(smooth = true) {
    let targetTheta, targetPhi, targetRadius;
    if (this.customView) {
      targetTheta = this.customView.theta;
      targetPhi = this.customView.phi;
      targetRadius = this.customView.radius;
    } else {
      const defSpherical = new THREE.Spherical().setFromVector3(this.defaultCameraPos);
      targetTheta = defSpherical.theta;
      targetPhi = defSpherical.phi;
      targetRadius = defSpherical.radius;
    }

    if (!smooth || !this.spherical) {
      if (this.spherical) {
        this.spherical.theta = targetTheta;
        this.spherical.phi = targetPhi;
        this.spherical.radius = targetRadius;
        this.camera.position.setFromSpherical(this.spherical);
      } else {
        this.camera.position.copy(this.defaultCameraPos);
      }
      this.camera.lookAt(0, 0, 0);
      return;
    }

    const startTheta = this.spherical.theta;
    const startPhi = this.spherical.phi;
    const startRadius = this.spherical.radius;

    // Đường đi ngắn nhất cho góc theta (-PI đến PI)
    let deltaTheta = (targetTheta - startTheta) % (2 * Math.PI);
    if (deltaTheta > Math.PI) deltaTheta -= 2 * Math.PI;
    if (deltaTheta < -Math.PI) deltaTheta += 2 * Math.PI;

    const deltaPhi = targetPhi - startPhi;
    const deltaRadius = targetRadius - startRadius;

    const startTime = performance.now();
    const duration = 280;

    const animateReset = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Cubic ease-out
      const ease = 1 - Math.pow(1 - progress, 3);

      this.spherical.theta = startTheta + deltaTheta * ease;
      this.spherical.phi = startPhi + deltaPhi * ease;
      this.spherical.radius = startRadius + deltaRadius * ease;

      this.camera.position.setFromSpherical(this.spherical);
      this.camera.lookAt(0, 0, 0);

      if (progress < 1) {
        requestAnimationFrame(animateReset);
      }
    };
    requestAnimationFrame(animateReset);
  }

  // Thực thi hoạt họa xoay một tầng
  queueMove(move) {
    this.animationQueue.push(move);
    if (!this.isAnimating) {
      this.processNextMove();
    }
  }

  processNextMove() {
    if (this.animationQueue.length === 0) {
      this.isAnimating = false;
      return;
    }

    this.isAnimating = true;
    const move = this.animationQueue.shift();

    if (this.onMoveStart) {
      this.onMoveStart(move, this.animationSpeed);
    }

    // Xác định mặt, trục, và góc xoay
    const faceKey = move[0];
    const isPrime = move.includes("'");
    const isDouble = move.includes('2');
    const turns = isDouble ? 2 : (isPrime ? -1 : 1);

    let axis = new THREE.Vector3();
    let filterFn = null;
    let angleRad = 0;

    switch (faceKey) {
      case 'U':
        axis.set(0, 1, 0);
        filterFn = (c) => c.position.y > 0.5;
        angleRad = -turns * Math.PI / 2;
        break;
      case 'D':
        axis.set(0, 1, 0);
        filterFn = (c) => c.position.y < -0.5;
        angleRad = turns * Math.PI / 2;
        break;
      case 'R':
        axis.set(1, 0, 0);
        filterFn = (c) => c.position.x > 0.5;
        angleRad = -turns * Math.PI / 2;
        break;
      case 'L':
        axis.set(1, 0, 0);
        filterFn = (c) => c.position.x < -0.5;
        angleRad = turns * Math.PI / 2;
        break;
      case 'F':
        axis.set(0, 0, 1);
        filterFn = (c) => c.position.z > 0.5;
        angleRad = -turns * Math.PI / 2;
        break;
      case 'B':
        axis.set(0, 0, 1);
        filterFn = (c) => c.position.z < -0.5;
        angleRad = turns * Math.PI / 2;
        break;
    }

    // Nhóm các khối con của tầng này vào pivot tạm
    const rotatingCubies = this.cubies.filter(filterFn);
    const pivot = new THREE.Group();
    this.scene.add(pivot);

    rotatingCubies.forEach(cubie => {
      pivot.attach(cubie);
    });

    const startTime = performance.now();
    const duration = this.animationSpeed;

    const animateRotation = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Easing mượt
      const ease = progress < 0.5
        ? 2 * progress * progress
        : -1 + (4 - 2 * progress) * progress;

      const currentAngle = angleRad * ease;
      pivot.setRotationFromAxisAngle(axis, currentAngle);

      if (progress < 1) {
        requestAnimationFrame(animateRotation);
      } else {
        pivot.setRotationFromAxisAngle(axis, angleRad);
        pivot.updateMatrixWorld(true);

        // Tháo các khối con ra khỏi pivot và làm tròn tọa độ tránh sai số dấu phẩy động
        rotatingCubies.forEach(cubie => {
          this.cubeGroup.attach(cubie);
          cubie.position.x = Math.round(cubie.position.x);
          cubie.position.y = Math.round(cubie.position.y);
          cubie.position.z = Math.round(cubie.position.z);
          cubie.updateMatrixWorld(true);
        });

        this.scene.remove(pivot);

        // Áp dụng logic trạng thái toán học
        this.state.applyMove(move);
        this.updateMirrors();

        if (this.onMoveComplete) {
          this.onMoveComplete(move);
        }

        // Xử lý bước tiếp theo trong hàng đợi
        this.processNextMove();
      }
    };

    requestAnimationFrame(animateRotation);
  }

  // Khôi phục lại khối nguyên bản
  resetCube() {
    this.cubeGroup.clear();
    this.cubies = [];
    this.createCube();
    this.updateMirrors();
  }

  onResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    if (width === 0 || height === 0) return;

    const aspect = width / height;
    this.camera.aspect = aspect;
    if (aspect < 1) {
      this.camera.fov = 54;
      this.defaultCameraPos.set(6.6, 5.4, 8.0);
    } else {
      this.camera.fov = 42;
      this.defaultCameraPos.set(5.8, 4.8, 7.0);
    }
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  setVisible(visible) {
    this.visible = visible;
    if (visible) {
      setTimeout(() => this.onResize(), 50);
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    if (this.visible !== false) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}
