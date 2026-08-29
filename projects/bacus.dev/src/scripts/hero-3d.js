/**
 * IT / programming themed Three.js hero for bacus.dev
 * — code glyph sprites, node graph, data particles
 */
(function () {
  function makeGlyphTexture(text, color) {
    const c = document.createElement('canvas');
    c.width = 128;
    c.height = 128;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, 128, 128);
    ctx.fillStyle = color;
    ctx.font = '600 42px "JetBrains Mono", ui-monospace, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;
    ctx.fillText(text, 64, 66);
    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }

  function initBacusHero3D() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    if (reduce || coarse) return;

    const canvas = document.getElementById('hero-3d-canvas');
    if (!canvas || typeof THREE === 'undefined') return;
    if (canvas.dataset.hero3dReady === '1') return;
    canvas.dataset.hero3dReady = '1';

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 80);
    camera.position.set(0, 0.2, 4.0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);

    scene.add(new THREE.AmbientLight(0x00e5cc, 0.4));
    const key = new THREE.PointLight(0x00e5cc, 2.0, 22);
    key.position.set(2.4, 2.2, 3.4);
    scene.add(key);

    const root = new THREE.Group();
    scene.add(root);

    const matWire = new THREE.MeshBasicMaterial({
      color: 0x00e5cc,
      wireframe: true,
      transparent: true,
      opacity: 0.28,
    });
    const matWireSoft = new THREE.MeshBasicMaterial({
      color: 0x80ffe2,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });

    // Core structures — abstract “runtime”
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.7, 1), matWire);
    core.position.set(0.1, 0.15, -0.4);
    root.add(core);

    const orbit = new THREE.Mesh(new THREE.TorusGeometry(1.35, 0.04, 10, 64), matWireSoft);
    orbit.rotation.x = Math.PI / 2.6;
    orbit.position.set(0.1, 0.1, -0.3);
    root.add(orbit);

    // Node graph (like modules / services)
    const nodes = [
      [-1.6, 0.55, 0.2],
      [1.5, 0.4, 0.1],
      [-1.1, -0.7, 0.35],
      [1.2, -0.55, 0.25],
      [0.15, 1.15, -0.2],
      [-0.3, -1.05, 0.1],
    ].map(([x, y, z], i) => {
      const g = new THREE.SphereGeometry(0.07 + (i % 3) * 0.015, 12, 12);
      const m = new THREE.MeshBasicMaterial({
        color: i % 2 ? 0x00e5cc : 0x80ffe2,
        transparent: true,
        opacity: 0.85,
      });
      const mesh = new THREE.Mesh(g, m);
      mesh.position.set(x, y, z);
      root.add(mesh);
      return mesh;
    });

    // Edges between nodes
    const edgeMat = new THREE.LineBasicMaterial({
      color: 0x00e5cc,
      transparent: true,
      opacity: 0.22,
    });
    const pairs = [[0, 2], [0, 4], [1, 3], [1, 4], [2, 5], [3, 5], [0, 1], [4, 1]];
    pairs.forEach(([a, b]) => {
      const geo = new THREE.BufferGeometry().setFromPoints([
        nodes[a].position.clone(),
        nodes[b].position.clone(),
      ]);
      root.add(new THREE.Line(geo, edgeMat));
    });

    // Floating code glyphs
    const glyphs = ['{ }', '</>', '=>', 'fn', '01', '#', ';', '[]'];
    const colors = ['#00e5cc', '#80ffe2', '#a3ffd6', '#5eead4'];
    const sprites = glyphs.map((g, i) => {
      const mat = new THREE.SpriteMaterial({
        map: makeGlyphTexture(g, colors[i % colors.length]),
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
      });
      const sp = new THREE.Sprite(mat);
      const angle = (i / glyphs.length) * Math.PI * 2;
      const r = 1.7 + (i % 3) * 0.25;
      sp.position.set(Math.cos(angle) * r, Math.sin(angle * 1.3) * 0.85, Math.sin(angle) * 0.6 - 0.2);
      sp.scale.set(0.55, 0.55, 1);
      root.add(sp);
      return { sp, baseY: sp.position.y, phase: i * 0.7, angle, r };
    });

    // Data particles streaming along a ring path
    const streamCount = 48;
    const streamPos = new Float32Array(streamCount * 3);
    for (let i = 0; i < streamCount; i++) {
      const t = (i / streamCount) * Math.PI * 2;
      streamPos[i * 3] = Math.cos(t) * 1.9;
      streamPos[i * 3 + 1] = Math.sin(t * 2) * 0.35;
      streamPos[i * 3 + 2] = Math.sin(t) * 0.9;
    }
    const streamGeo = new THREE.BufferGeometry();
    streamGeo.setAttribute('position', new THREE.BufferAttribute(streamPos, 3));
    const stream = new THREE.Points(
      streamGeo,
      new THREE.PointsMaterial({
        color: 0x00e5cc,
        size: 0.04,
        transparent: true,
        opacity: 0.75,
        sizeAttenuation: true,
      })
    );
    root.add(stream);

    // Ambient dust
    const dustN = 80;
    const dustPos = new Float32Array(dustN * 3);
    for (let i = 0; i < dustN; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 8;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 5;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 4 - 0.5;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    root.add(
      new THREE.Points(
        dustGeo,
        new THREE.PointsMaterial({
          color: 0x00e5cc,
          size: 0.025,
          transparent: true,
          opacity: 0.35,
          sizeAttenuation: true,
        })
      )
    );

    let mx = 0;
    let my = 0;
    let tx = 0;
    let ty = 0;
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
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
    }

    function animate(t) {
      if (!running) return;
      raf = requestAnimationFrame(animate);
      const time = t * 0.001;

      mx += (tx - mx) * 0.045;
      my += (ty - my) * 0.045;

      root.rotation.y = time * 0.08 + mx * 0.28;
      root.rotation.x = Math.sin(time * 0.15) * 0.08 + my * 0.16;

      core.rotation.y = time * 0.35;
      core.rotation.x = time * 0.12;
      orbit.rotation.z = time * 0.2;

      sprites.forEach((item) => {
        item.sp.position.y = item.baseY + Math.sin(time * 0.9 + item.phase) * 0.12;
        item.sp.material.opacity = 0.4 + Math.sin(time * 1.2 + item.phase) * 0.12;
      });

      // Stream particles orbit
      const pos = stream.geometry.attributes.position.array;
      for (let i = 0; i < streamCount; i++) {
        const t0 = (i / streamCount) * Math.PI * 2 + time * 0.55;
        pos[i * 3] = Math.cos(t0) * 1.9;
        pos[i * 3 + 1] = Math.sin(t0 * 2 + time) * 0.35;
        pos[i * 3 + 2] = Math.sin(t0) * 0.9;
      }
      stream.geometry.attributes.position.needsUpdate = true;

      nodes.forEach((n, i) => {
        n.position.y += Math.sin(time * 1.1 + i) * 0.0008;
      });

      camera.position.x = mx * 0.4;
      camera.position.y = 0.2 - my * 0.22;
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
