/**
 * Lightweight Three.js hero scene for bacus.dev
 * Abstract laboratory geometry + particles.
 * Call window.initBacusHero3D() after THREE is loaded, or load this file after THREE.
 */
(function () {
  function initBacusHero3D() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    if (reduce || coarse) return;

    const canvas = document.getElementById('hero-3d-canvas');
    if (!canvas || typeof THREE === 'undefined') return;
    if (canvas.dataset.hero3dReady === '1') return;
    canvas.dataset.hero3dReady = '1';

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0.15, 3.6);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);

    scene.add(new THREE.AmbientLight(0x00e5cc, 0.35));
    const key = new THREE.PointLight(0x00e5cc, 2.2, 20);
    key.position.set(2.2, 2.4, 3.2);
    scene.add(key);
    const fill = new THREE.PointLight(0x80ffe2, 0.9, 16);
    fill.position.set(-2.8, -0.6, 2.4);
    scene.add(fill);

    const group = new THREE.Group();
    scene.add(group);

    const matMain = new THREE.MeshBasicMaterial({
      color: 0x00e5cc,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
    });
    const matSoft = new THREE.MeshBasicMaterial({
      color: 0x80ffe2,
      wireframe: true,
      transparent: true,
      opacity: 0.32,
    });
    const matAccent = new THREE.MeshBasicMaterial({
      color: 0xa3ffd6,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });

    const torus = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.28, 16, 64), matMain);
    torus.position.set(-1.25, 0.25, -0.2);
    group.add(torus);

    const icosa = new THREE.Mesh(new THREE.IcosahedronGeometry(0.95, 1), matSoft);
    icosa.position.set(1.45, -0.1, 0.15);
    group.add(icosa);

    const octa = new THREE.Mesh(new THREE.OctahedronGeometry(0.62, 0), matAccent);
    octa.position.set(0.05, 1.05, -0.65);
    group.add(octa);

    const box = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), matSoft);
    box.position.set(-0.15, -0.95, 0.45);
    group.add(box);

    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.06, 12, 48), matMain);
    ring.position.set(0.9, 0.85, -0.3);
    ring.rotation.x = Math.PI / 2.4;
    group.add(ring);

    // Particles
    const particleCount = 140;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 5.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5 - 0.5;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x00e5cc,
      size: 0.045,
      transparent: true,
      opacity: 0.7,
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

      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      group.rotation.y = time * 0.14 + mouseX * 0.35;
      group.rotation.x = Math.sin(time * 0.2) * 0.14 + mouseY * 0.2;

      torus.rotation.x = time * 0.4;
      torus.rotation.z = time * 0.25;
      icosa.rotation.y = -time * 0.32;
      icosa.rotation.x = time * 0.18;
      octa.rotation.y = time * 0.5;
      box.rotation.x = time * 0.22;
      box.rotation.y = -time * 0.28;
      ring.rotation.z = time * 0.35;

      particles.rotation.y = time * 0.05;
      particles.rotation.x = Math.sin(time * 0.12) * 0.06;

      camera.position.x = mouseX * 0.45;
      camera.position.y = 0.15 - mouseY * 0.25;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }

    function start() {
      resize();
      running = true;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(animate);
      canvas.classList.add('is-ready');
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

    start();
  }

  window.initBacusHero3D = initBacusHero3D;

  if (typeof THREE !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initBacusHero3D);
    } else {
      initBacusHero3D();
    }
  }
})();
