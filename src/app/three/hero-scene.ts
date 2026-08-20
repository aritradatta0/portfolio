import * as THREE from 'three';

export interface HeroSceneHandle {
  dispose(): void;
}

/**
 * Interactive particle constellation:
 * - ambient dust field + "plexus" of nodes connected by distance-faded lines
 * - cursor repels nearby nodes and parallaxes the camera
 * - pauses when the hero is off-screen or the tab is hidden
 */
export function createHeroScene(host: HTMLElement): HeroSceneHandle {
  const isMobile = window.innerWidth < 768;
  const DUST_COUNT = isMobile ? 700 : 2000;
  const NODE_COUNT = isMobile ? 70 : 130;
  const LINK_DIST = 26;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x070a12, 0.0055);

  const camera = new THREE.PerspectiveCamera(60, host.clientWidth / host.clientHeight, 1, 500);
  camera.position.z = 95;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
  renderer.setSize(host.clientWidth, host.clientHeight);
  renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';
  host.appendChild(renderer.domElement);

  const group = new THREE.Group();
  scene.add(group);

  // --- ambient dust ---
  const dustGeo = new THREE.BufferGeometry();
  const dustPos = new Float32Array(DUST_COUNT * 3);
  for (let i = 0; i < DUST_COUNT; i++) {
    dustPos[i * 3] = (Math.random() - 0.5) * 260;
    dustPos[i * 3 + 1] = (Math.random() - 0.5) * 140;
    dustPos[i * 3 + 2] = (Math.random() - 0.5) * 90;
  }
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  const dustMat = new THREE.PointsMaterial({
    color: 0x9fc8ff,
    size: 1.3,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  group.add(new THREE.Points(dustGeo, dustMat));

  // --- plexus nodes ---
  const home = new Float32Array(NODE_COUNT * 3);
  const phase = new Float32Array(NODE_COUNT);
  const push = new Float32Array(NODE_COUNT * 3);
  for (let i = 0; i < NODE_COUNT; i++) {
    home[i * 3] = (Math.random() - 0.5) * 200;
    home[i * 3 + 1] = (Math.random() - 0.5) * 100;
    home[i * 3 + 2] = (Math.random() - 0.5) * 55;
    phase[i] = Math.random() * Math.PI * 2;
  }
  const nodeGeo = new THREE.BufferGeometry();
  const nodePos = new Float32Array(home);
  nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePos, 3));
  const nodeMat = new THREE.PointsMaterial({
    color: 0x4ea8ff,
    size: 2.6,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  group.add(new THREE.Points(nodeGeo, nodeMat));

  // --- plexus lines (rebuilt each frame, faded by distance) ---
  const maxPairs = (NODE_COUNT * (NODE_COUNT - 1)) / 2;
  const linePos = new Float32Array(maxPairs * 6);
  const lineCol = new Float32Array(maxPairs * 6);
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3).setUsage(THREE.DynamicDrawUsage));
  lineGeo.setAttribute('color', new THREE.BufferAttribute(lineCol, 3).setUsage(THREE.DynamicDrawUsage));
  const lineMat = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const lines = new THREE.LineSegments(lineGeo, lineMat);
  group.add(lines);

  // --- pointer state ---
  const pointer = { x: 0, y: 0, worldX: 0, worldY: 0, active: false };
  const onPointerMove = (e: PointerEvent) => {
    const rect = host.getBoundingClientRect();
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    pointer.active = true;
  };
  const onPointerLeave = () => (pointer.active = false);
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerout', onPointerLeave, { passive: true });

  // --- pause when hidden ---
  let running = true;
  let rafId = 0;
  const io = new IntersectionObserver(([entry]) => {
    running = entry.isIntersecting && !document.hidden;
    if (running) loop();
  });
  io.observe(host);
  const onVisibility = () => {
    running = !document.hidden;
    if (running) loop();
  };
  document.addEventListener('visibilitychange', onVisibility);

  const resize = () => {
    const { clientWidth, clientHeight } = host;
    camera.aspect = clientWidth / Math.max(clientHeight, 1);
    camera.updateProjectionMatrix();
    renderer.setSize(clientWidth, clientHeight);
  };
  const ro = new ResizeObserver(resize);
  ro.observe(host);

  const clock = new THREE.Clock();
  const R = 0.31, G = 0.66, B = 1.0;

  function loop() {
    if (!running) return;
    rafId = requestAnimationFrame(loop);
    const t = clock.getElapsedTime();

    // half-extent of the visible plane at z = 0
    const halfH = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
    pointer.worldX = pointer.x * halfH * camera.aspect;
    pointer.worldY = pointer.y * halfH;

    // nodes: wander + cursor repulsion with decay
    for (let i = 0; i < NODE_COUNT; i++) {
      const ix = i * 3;
      const wx = Math.sin(t * 0.35 + phase[i]) * 3;
      const wy = Math.cos(t * 0.28 + phase[i] * 1.7) * 3;
      if (pointer.active) {
        const dx = home[ix] + wx - pointer.worldX;
        const dy = home[ix + 1] + wy - pointer.worldY;
        const d2 = dx * dx + dy * dy;
        const radius = 26;
        if (d2 < radius * radius) {
          const d = Math.sqrt(d2) || 0.001;
          const force = ((radius - d) / radius) * 10;
          push[ix] += (dx / d) * force * 0.12;
          push[ix + 1] += (dy / d) * force * 0.12;
        }
      }
      push[ix] *= 0.9;
      push[ix + 1] *= 0.9;
      push[ix + 2] *= 0.9;
      nodePos[ix] = home[ix] + wx + push[ix];
      nodePos[ix + 1] = home[ix + 1] + wy + push[ix + 1];
      nodePos[ix + 2] = home[ix + 2] + push[ix + 2];
    }
    nodeGeo.attributes['position'].needsUpdate = true;

    // rebuild plexus lines
    let vi = 0;
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        const ix = i * 3, jx = j * 3;
        const dx = nodePos[ix] - nodePos[jx];
        const dy = nodePos[ix + 1] - nodePos[jx + 1];
        const dz = nodePos[ix + 2] - nodePos[jx + 2];
        const d2 = dx * dx + dy * dy + dz * dz;
        if (d2 < LINK_DIST * LINK_DIST) {
          const a = (1 - Math.sqrt(d2) / LINK_DIST) * 0.55;
          linePos[vi] = nodePos[ix]; linePos[vi + 1] = nodePos[ix + 1]; linePos[vi + 2] = nodePos[ix + 2];
          linePos[vi + 3] = nodePos[jx]; linePos[vi + 4] = nodePos[jx + 1]; linePos[vi + 5] = nodePos[jx + 2];
          lineCol[vi] = R * a; lineCol[vi + 1] = G * a; lineCol[vi + 2] = B * a;
          lineCol[vi + 3] = R * a; lineCol[vi + 4] = G * a; lineCol[vi + 5] = B * a;
          vi += 6;
        }
      }
    }
    lineGeo.setDrawRange(0, vi / 3);
    lineGeo.attributes['position'].needsUpdate = true;
    lineGeo.attributes['color'].needsUpdate = true;

    // slow drift + camera parallax
    group.rotation.y = Math.sin(t * 0.05) * 0.12;
    group.rotation.x = Math.cos(t * 0.04) * 0.05;
    camera.position.x += (pointer.x * 7 - camera.position.x) * 0.03;
    camera.position.y += (pointer.y * 4 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }
  loop();

  return {
    dispose() {
      running = false;
      cancelAnimationFrame(rafId);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerout', onPointerLeave);
      dustGeo.dispose();
      nodeGeo.dispose();
      lineGeo.dispose();
      dustMat.dispose();
      nodeMat.dispose();
      lineMat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
