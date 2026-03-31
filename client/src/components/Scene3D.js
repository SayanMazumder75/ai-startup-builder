import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// ─── Floating Orbs 3D Scene ────────────────────────────────────────────────
export function HeroScene3D({ style }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth;
    const H = mount.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
    camera.position.set(0, 0, 6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // ── Main glowing sphere ──────────────────────────────────────────
    const mainGeo = new THREE.IcosahedronGeometry(1.4, 4);
    const mainMat = new THREE.MeshPhongMaterial({
      color: 0xfbbf24,
      emissive: 0xf97316,
      emissiveIntensity: 0.3,
      wireframe: false,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
    });
    const mainMesh = new THREE.Mesh(mainGeo, mainMat);
    scene.add(mainMesh);

    // Wireframe overlay
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    const wireMesh = new THREE.Mesh(mainGeo, wireMat);
    wireMesh.scale.setScalar(1.01);
    scene.add(wireMesh);

    // ── Orbiting ring ───────────────────────────────────────────────
    const ringGeo = new THREE.TorusGeometry(2.4, 0.012, 16, 120);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.35,
    });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 3;
    scene.add(ring1);

    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.25,
    });
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(3.1, 0.008, 16, 120), ring2Mat);
    ring2.rotation.x = Math.PI / 6;
    ring2.rotation.y = Math.PI / 4;
    scene.add(ring2);

    // ── Floating particles ───────────────────────────────────────────
    const particleCount = 180;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const amberRGB = [0.98, 0.75, 0.14];
    const violetRGB = [0.54, 0.36, 0.96];
    const cyanRGB = [0.13, 0.83, 0.93];

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.5 + Math.random() * 2.5;
      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const palette = [amberRGB, violetRGB, cyanRGB][Math.floor(Math.random() * 3)];
      colors[i * 3]     = palette[0];
      colors[i * 3 + 1] = palette[1];
      colors[i * 3 + 2] = palette[2];
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ── Lights ───────────────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xfbbf24, 2, 20);
    pointLight1.position.set(4, 4, 4);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x8b5cf6, 1.5, 20);
    pointLight2.position.set(-4, -2, 2);
    scene.add(pointLight2);

    // ── Mouse tracking ───────────────────────────────────────────────
    const mouse = { x: 0, y: 0 };
    const handleMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // ── Animation loop ───────────────────────────────────────────────
    let frameId;
    let t = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      t += 0.008;

      mainMesh.rotation.x = t * 0.3 + mouse.y * 0.2;
      mainMesh.rotation.y = t * 0.5 + mouse.x * 0.2;
      wireMesh.rotation.copy(mainMesh.rotation);

      ring1.rotation.z = t * 0.4;
      ring1.rotation.x = Math.PI / 3 + Math.sin(t * 0.5) * 0.15;
      ring2.rotation.z = -t * 0.3;
      ring2.rotation.y = Math.PI / 4 + Math.cos(t * 0.4) * 0.1;

      particles.rotation.y = t * 0.06;
      particles.rotation.x = t * 0.03;

      // Pulse main sphere
      const scale = 1 + Math.sin(t * 1.5) * 0.04;
      mainMesh.scale.setScalar(scale);

      // Camera slight movement
      camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.03;
      camera.position.y += (mouse.y * 0.3 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    // ── Resize ───────────────────────────────────────────────────────
    const handleResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100%', ...style }} />;
}

// ─── Floating Cube Grid (for cards/features) ──────────────────────────────
export function CubeScene3D({ color = 0xfbbf24, style }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth || 200;
    const H = mount.clientHeight || 200;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
    camera.position.set(0, 0, 4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Rounded cube
    const geo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const mat = new THREE.MeshPhongMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.2,
      transparent: true,
      opacity: 0.18,
      wireframe: false,
    });
    const cube = new THREE.Mesh(geo, mat);
    scene.add(cube);

    const wireMat = new THREE.MeshBasicMaterial({
      color,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    });
    const wire = new THREE.Mesh(geo, wireMat);
    wire.scale.setScalar(1.001);
    scene.add(wire);

    const light1 = new THREE.PointLight(color, 3, 10);
    light1.position.set(2, 2, 2);
    scene.add(light1);
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    let frameId, t = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      t += 0.01;
      cube.rotation.x = t * 0.5;
      cube.rotation.y = t * 0.8;
      wire.rotation.copy(cube.rotation);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [color]);

  return <div ref={mountRef} style={{ width: '100%', height: '100%', ...style }} />;
}

// ─── DNA / Helix Loader ───────────────────────────────────────────────────
export function HelixLoader({ size = 120 }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Create helix points
    const group = new THREE.Group();
    const colors = [0xfbbf24, 0x8b5cf6, 0x22d3ee];
    for (let strand = 0; strand < 3; strand++) {
      const points = [];
      for (let i = 0; i <= 60; i++) {
        const t = (i / 60) * Math.PI * 4;
        const offset = (strand / 3) * Math.PI * 2;
        points.push(new THREE.Vector3(
          Math.cos(t + offset) * 0.8,
          (i / 60 - 0.5) * 3,
          Math.sin(t + offset) * 0.8
        ));
      }
      const curve = new THREE.CatmullRomCurve3(points);
      const geo = new THREE.TubeGeometry(curve, 60, 0.04, 6, false);
      const mat = new THREE.MeshBasicMaterial({ color: colors[strand], transparent: true, opacity: 0.85 });
      group.add(new THREE.Mesh(geo, mat));
    }
    scene.add(group);

    let frameId, t = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      t += 0.025;
      group.rotation.y = t;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [size]);

  return <div ref={mountRef} style={{ width: size, height: size }} />;
}
