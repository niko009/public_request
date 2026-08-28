/**
 * Lightweight Three.js hero scene for bacus.dev
 * Abstract laboratory geometry + particles.
 * Respects prefers-reduced-motion and skips on coarse pointers / low power.
 */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const lowPower = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
  if (reduce || coarse || lowPower) return;

  const canvas = document.getElementById('hero-3d-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.set(0, 0.2, 4.2);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setClearColor(0x000000, 0);

  // Soft ambient + cyan key light
  scene.add(new THREE.AmbientLight(0x0a1a18, 0.55));
  const key = new THREE.PointLight(0x00e5cc, 1.4, 18);
  key.position.set(2.5, 2.2, 3);
  scene.add(key);
  const fill = new THREE.PointLight(0x80ffe2, 0.45, 14);
  fill.position.set(-3, -1, 2);
  scene.add(fill);

  const group = new THREE.Group();
  scene.add(group);

  // Wireframe geometric forms (lab / research feel)
  const material = new THREE.MeshBasicMaterial({
    color: 0x00e5cc,
    wireframe: true,
    transparent: true,
    opacity: 0.28,
  });
  const materialSoft = new THREE.MeshBasicMaterial({
    color: 0x80ffe2,
    wireframe: true,
    transparent: true,
    opacity: 0.14,
  });

  const torus = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.22, 12, 48), material);
  torus.position.set(-1.4, 0.35, -0.4);
  group.add(torus);

  const icosa = new THREE.Mesh(new THREE.IcosahedronGeometry(0.85, 1), materialSoft);
  icosa.position.set(1.55, -0.15, 0.2);
  group.add(icosa);

  const octa = new THREE.Mesh(new THREE.OctahedronGeometry(0.55, 0), material);
  octa.position.set(0.15, 1.05, -0.8);
  group.add(octa);

  const box = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.7), materialSoft);
  box.position.set(-0.2, -0.95, 0.5);
  group.add(box);

  // Floating particles
  const particleCount = 90;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 8;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 5;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 4 - 1;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const pMat = new THREE.PointsMaterial({
    color: 0x00e5cc,
    size: 0.035,
    transparent: true,
    opacity: 0.55,
    sizeAttenuation: true,
  });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;
  let raf = 0;
  let running = true;

  function resize() {
    const parent = canvas.parentElement || document.body;
    const w = parent.clientWidth || window.innerWidth;
    const h = parent.clientHeight || window.innerHeight;
    camera.aspect = w / Math.max(h, 1);
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }

  function onPointer(e) {
    targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetY = (e.clientY / window.innerHeight - 0.5) * 2;
  }

  function animate(t) {
    if (!running) return;
    raf = requestAnimationFrame(animate);
    const time = t * 0.001;

    mouseX += (targetX - mouseX) * 0.04;
    mouseY += (targetY - mouseY) * 0.04;

    group.rotation.y = time * 0.12 + mouseX * 0.25;
    group.rotation.x = Math.sin(time * 0.18) * 0.12 + mouseY * 0.15;

    torus.rotation.x = time * 0.35;
    torus.rotation.z = time * 0.22;
    icosa.rotation.y = -time * 0.28;
    icosa.rotation.x = time * 0.15;
    octa.rotation.y = time * 0.45;
    box.rotation.x = time * 0.2;
    box.rotation.y = -time * 0.25;

    particles.rotation.y = time * 0.04;
    particles.rotation.x = Math.sin(time * 0.1) * 0.05;

    camera.position.x = mouseX * 0.35;
    camera.position.y = 0.2 - mouseY * 0.2;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  function start() {
    resize();
    running = true;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(animate);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('pointermove', onPointer, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });

  // Start after a short delay so first paint is clean
  requestAnimationFrame(() => {
    start();
    canvas.classList.add('is-ready');
  });
})();
