// scene.js — hero 3D scene: gold wireframe "AI core" + orbiting cyan nodes
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js';

export function initHeroScene(canvas) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isSmall = window.innerWidth < 720;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 9);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

  // --- Core: gold wireframe icosahedron ---
  const coreGeo = new THREE.IcosahedronGeometry(2.1, 1);
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0xd9b44a,
    wireframe: true,
    transparent: true,
    opacity: 0.85,
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  scene.add(core);

  const coreGlowGeo = new THREE.IcosahedronGeometry(2.14, 1);
  const coreGlowMat = new THREE.MeshBasicMaterial({ color: 0xd9b44a, wireframe: true, transparent: true, opacity: 0.12 });
  const coreGlow = new THREE.Mesh(coreGlowGeo, coreGlowMat);
  scene.add(coreGlow);

  // --- Nodes: Fibonacci sphere placement ---
  const nodeCount = isSmall ? 26 : 46;
  const radius = 4.4;
  const nodeGroup = new THREE.Group();
  const lineGroup = new THREE.Group();

  const nodeGeo = new THREE.SphereGeometry(0.045, 8, 8);
  const nodeMat = new THREE.MeshBasicMaterial({ color: 0x4fd1c5 });
  const lineMat = new THREE.LineBasicMaterial({ color: 0x4fd1c5, transparent: true, opacity: 0.16 });

  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < nodeCount; i++) {
    const y = 1 - (i / (nodeCount - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;

    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;

    const pos = new THREE.Vector3(x * radius, y * radius, z * radius);

    const node = new THREE.Mesh(nodeGeo, nodeMat);
    node.position.copy(pos);
    nodeGroup.add(node);

    const lineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), pos]);
    const line = new THREE.Line(lineGeo, lineMat);
    lineGroup.add(line);
  }

  scene.add(nodeGroup);
  scene.add(lineGroup);

  // --- Neighbor mesh: connect nearby nodes to each other, not just to the
  // core, so the network reads as a graph rather than a spoked wheel ---
  const meshLineMat = new THREE.LineBasicMaterial({ color: 0xd9b44a, transparent: true, opacity: 0.07 });
  const meshMaxDist = radius * 0.62;
  for (let i = 0; i < nodeGroup.children.length; i++) {
    for (let j = i + 1; j < nodeGroup.children.length; j++) {
      const a = nodeGroup.children[i].position;
      const b = nodeGroup.children[j].position;
      if (a.distanceTo(b) < meshMaxDist) {
        const meshGeo = new THREE.BufferGeometry().setFromPoints([a, b]);
        lineGroup.add(new THREE.Line(meshGeo, meshLineMat));
      }
    }
  }

  // --- Ambient starfield: distant, slow-drifting points for depth ---
  const starCount = isSmall ? 200 : 420;
  const starPositions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const r = 18 + Math.random() * 22;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    starPositions[i * 3 + 2] = r * Math.cos(phi);
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.045, transparent: true, opacity: 0.5 });
  const stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);

  // --- Ambient light (kept minimal, mostly self-lit via basic materials) ---
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));

  // --- Mouse-driven camera drift ---
  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;

  function onPointerMove(e) {
    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    const ny = (e.clientY / window.innerHeight) * 2 - 1;
    targetX = nx * 0.6;
    targetY = ny * 0.4;
  }
  if (!reducedMotion) {
    window.addEventListener('pointermove', onPointerMove, { passive: true });
  }

  function onResize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  window.addEventListener('resize', onResize);

  let rafId = null;

  function renderStaticFrame() {
    core.rotation.set(0.3, 0.4, 0);
    coreGlow.rotation.copy(core.rotation);
    nodeGroup.rotation.set(0.1, 0.2, 0);
    lineGroup.rotation.copy(nodeGroup.rotation);
    renderer.render(scene, camera);
  }

  function animate() {
    rafId = requestAnimationFrame(animate);

    const t = performance.now() * 0.001;

    core.rotation.y += 0.0018;
    core.rotation.x += 0.0009;
    coreGlow.rotation.copy(core.rotation);
    coreMat.opacity = 0.72 + Math.sin(t * 0.8) * 0.13;
    coreGlowMat.opacity = 0.1 + Math.sin(t * 0.8 + 1.2) * 0.05;

    nodeGroup.rotation.y += 0.0009;
    nodeGroup.rotation.x += 0.0004;
    lineGroup.rotation.copy(nodeGroup.rotation);

    stars.rotation.y += 0.00006;
    stars.rotation.x += 0.00002;

    currentX += (targetX - currentX) * 0.03;
    currentY += (targetY - currentY) * 0.03;
    camera.position.x = currentX * 1.5;
    camera.position.y = -currentY * 1.2 + 0.3;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  if (reducedMotion) {
    renderStaticFrame();
  } else {
    animate();
  }

  return {
    destroy() {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
      renderer.dispose();
    },
  };
}
