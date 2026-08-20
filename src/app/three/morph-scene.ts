import * as THREE from 'three';

export interface MorphSceneHandle {
  dispose(): void;
}

/**
 * Site-wide particle scene that morphs between formations as the user scrolls:
 * hero: chaotic cloud → about: sine wave → projects: lattice grid →
 * skills: four clusters → experience: double helix → contact: converging ring.
 * The scroll story: chaos, directed into structure.
 */
export function createMorphScene(host: HTMLElement, sectionIds: string[]): MorphSceneHandle {
  const isMobile = window.innerWidth < 768;
  const COUNT = isMobile ? 450 : 950;
  const LINE_NODES = isMobile ? 70 : 140;

  // one target position set per section
  const formations: Float32Array[] = [
    cloud(), wave(), grid(), clusters(), helix(), ring(),
  ];
  // per-formation tuning: line reach and overall intensity
  const linkDists = [26, 15, 17, 15, 14, 16];
  const energies = [1.0, 0.45, 0.7, 0.65, 0.55, 0.95];

  function cloud(): Float32Array {
    const a = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      a[i * 3] = (Math.random() - 0.5) * 210;
      a[i * 3 + 1] = (Math.random() - 0.5) * 110;
      a[i * 3 + 2] = (Math.random() - 0.5) * 70;
    }
    return a;
  }
  function wave(): Float32Array {
    const a = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const x = (Math.random() - 0.5) * 220;
      const z = (Math.random() - 0.5) * 80;
      a[i * 3] = x;
      a[i * 3 + 1] = Math.sin(x * 0.045) * 16 + Math.cos(z * 0.09) * 8 + (Math.random() - 0.5) * 4;
      a[i * 3 + 2] = z;
    }
    return a;
  }
  function grid(): Float32Array {
    const a = new Float32Array(COUNT * 3);
    const cols = Math.ceil(Math.sqrt(COUNT));
    for (let i = 0; i < COUNT; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      a[i * 3] = (col / (cols - 1) - 0.5) * 190;
      a[i * 3 + 1] = (row / (cols - 1) - 0.5) * 100;
      a[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return a;
  }
  function clusters(): Float32Array {
    const a = new Float32Array(COUNT * 3);
    const centers = [
      [-62, 30, 0], [62, 30, -10], [-62, -30, -10], [62, -30, 0],
    ];
    for (let i = 0; i < COUNT; i++) {
      const c = centers[i % 4];
      a[i * 3] = c[0] + gauss() * 20;
      a[i * 3 + 1] = c[1] + gauss() * 12;
      a[i * 3 + 2] = c[2] + gauss() * 10;
    }
    return a;
  }
  function helix(): Float32Array {
    const a = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const t = (i / COUNT) * Math.PI * 6;
      const x = (i / COUNT - 0.5) * 220;
      const strand = i % 2 === 0 ? 0 : Math.PI;
      a[i * 3] = x + (Math.random() - 0.5) * 3;
      a[i * 3 + 1] = Math.sin(t + strand) * 26 + (Math.random() - 0.5) * 3;
      a[i * 3 + 2] = Math.cos(t + strand) * 18 + (Math.random() - 0.5) * 3;
    }
    return a;
  }
  function ring(): Float32Array {
    const a = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const angle = (i / COUNT) * Math.PI * 2;
      const r = 46 + (Math.random() - 0.5) * 7;
      a[i * 3] = Math.cos(angle) * r * 1.4;
      a[i * 3 + 1] = Math.sin(angle) * r * 0.85;
      a[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return a;
  }
  function gauss(): number {
    return (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
  }

  // --- three.js setup ---
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x070a12, 0.005);
  const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 1, 500);
  camera.position.z = 95;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, isMobile ? 1.5 : 2));
  renderer.setSize(innerWidth, innerHeight);
  renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';
  host.appendChild(renderer.domElement);

  const group = new THREE.Group();
  scene.add(group);

  const pos = new Float32Array(formations[0]);
  const push = new Float32Array(COUNT * 3);
  const phase = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i++) phase[i] = Math.random() * Math.PI * 2;

  const pointGeo = new THREE.BufferGeometry();
  pointGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage));
  const pointMat = new THREE.PointsMaterial({
    color: 0x4ea8ff, size: 2.1, sizeAttenuation: true, transparent: true,
    opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false,
  });
  group.add(new THREE.Points(pointGeo, pointMat));

  const maxPairs = (LINE_NODES * (LINE_NODES - 1)) / 2;
  const linePos = new Float32Array(maxPairs * 6);
  const lineCol = new Float32Array(maxPairs * 6);
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3).setUsage(THREE.DynamicDrawUsage));
  lineGeo.setAttribute('color', new THREE.BufferAttribute(lineCol, 3).setUsage(THREE.DynamicDrawUsage));
  const lineMat = new THREE.LineBasicMaterial({
    vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
  });
  group.add(new THREE.LineSegments(lineGeo, lineMat));

  // --- scroll state ---
  let sectionTops: number[] = [];
  const measure = () => {
    sectionTops = sectionIds.map((id) => {
      const el = document.getElementById(id);
      return el ? el.getBoundingClientRect().top + scrollY : 0;
    });
  };
  measure();
  const ro = new ResizeObserver(() => {
    measure();
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
  ro.observe(document.body);

  // --- pointer ---
  const pointer = { x: 0, y: 0, active: false };
  const onPointerMove = (e: PointerEvent) => {
    pointer.x = (e.clientX / innerWidth) * 2 - 1;
    pointer.y = -((e.clientY / innerHeight) * 2 - 1);
    pointer.active = true;
  };
  const onPointerOut = () => (pointer.active = false);
  addEventListener('pointermove', onPointerMove, { passive: true });
  addEventListener('pointerout', onPointerOut, { passive: true });

  let running = !document.hidden;
  let rafId = 0;
  const onVisibility = () => {
    running = !document.hidden;
    if (running) loop();
  };
  document.addEventListener('visibilitychange', onVisibility);

  const clock = new THREE.Clock();
  const R = 0.31, G = 0.66, B = 1.0;
  const ease = (t: number) => t * t * (3 - 2 * t);
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  function segment(): { i: number; t: number } {
    const anchor = scrollY + innerHeight * 0.42;
    let i = 0;
    for (let s = 0; s < sectionTops.length - 1; s++) {
      if (anchor >= sectionTops[s]) i = s;
    }
    const start = sectionTops[i];
    const end = sectionTops[i + 1] ?? start + innerHeight;
    const t = Math.min(Math.max((anchor - start) / Math.max(end - start, 1), 0), 1);
    return { i, t };
  }

  function loop() {
    if (!running) return;
    rafId = requestAnimationFrame(loop);
    const time = clock.getElapsedTime();
    const { i, t } = segment();
    const et = ease(t);
    const from = formations[i];
    const to = formations[Math.min(i + 1, formations.length - 1)];
    const linkDist = lerp(linkDists[i], linkDists[Math.min(i + 1, linkDists.length - 1)], et);
    const energy = lerp(energies[i], energies[Math.min(i + 1, energies.length - 1)], et);

    const halfH = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
    const mx = pointer.x * halfH * camera.aspect;
    const my = pointer.y * halfH;

    for (let p = 0; p < COUNT; p++) {
      const ix = p * 3;
      const bx = lerp(from[ix], to[ix], et) + Math.sin(time * 0.4 + phase[p]) * 1.6;
      const by = lerp(from[ix + 1], to[ix + 1], et) + Math.cos(time * 0.33 + phase[p] * 1.7) * 1.6;
      const bz = lerp(from[ix + 2], to[ix + 2], et);
      if (pointer.active) {
        const dx = bx - mx;
        const dy = by - my;
        const d2 = dx * dx + dy * dy;
        if (d2 < 22 * 22) {
          const d = Math.sqrt(d2) || 0.001;
          const force = ((22 - d) / 22) * 1.1;
          push[ix] += (dx / d) * force;
          push[ix + 1] += (dy / d) * force;
        }
      }
      push[ix] *= 0.9;
      push[ix + 1] *= 0.9;
      pos[ix] = bx + push[ix];
      pos[ix + 1] = by + push[ix + 1];
      pos[ix + 2] = bz;
    }
    pointGeo.attributes['position'].needsUpdate = true;
    pointMat.size = 1.5 + energy * 0.9;
    pointMat.opacity = 0.45 + energy * 0.45;

    let vi = 0;
    for (let a = 0; a < LINE_NODES; a++) {
      for (let b = a + 1; b < LINE_NODES; b++) {
        const ax = a * 3, bx2 = b * 3;
        const dx = pos[ax] - pos[bx2];
        const dy = pos[ax + 1] - pos[bx2 + 1];
        const dz = pos[ax + 2] - pos[bx2 + 2];
        const d2 = dx * dx + dy * dy + dz * dz;
        if (d2 < linkDist * linkDist) {
          const alpha = (1 - Math.sqrt(d2) / linkDist) * 0.5 * energy;
          linePos[vi] = pos[ax]; linePos[vi + 1] = pos[ax + 1]; linePos[vi + 2] = pos[ax + 2];
          linePos[vi + 3] = pos[bx2]; linePos[vi + 4] = pos[bx2 + 1]; linePos[vi + 5] = pos[bx2 + 2];
          lineCol[vi] = R * alpha; lineCol[vi + 1] = G * alpha; lineCol[vi + 2] = B * alpha;
          lineCol[vi + 3] = R * alpha; lineCol[vi + 4] = G * alpha; lineCol[vi + 5] = B * alpha;
          vi += 6;
        }
      }
    }
    lineGeo.setDrawRange(0, vi / 3);
    lineGeo.attributes['position'].needsUpdate = true;
    lineGeo.attributes['color'].needsUpdate = true;

    group.rotation.y = Math.sin(time * 0.05) * 0.1;
    camera.position.x += (pointer.x * 6 - camera.position.x) * 0.03;
    camera.position.y += (pointer.y * 3.5 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  }
  loop();

  return {
    dispose() {
      running = false;
      cancelAnimationFrame(rafId);
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      removeEventListener('pointermove', onPointerMove);
      removeEventListener('pointerout', onPointerOut);
      pointGeo.dispose();
      lineGeo.dispose();
      pointMat.dispose();
      lineMat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
