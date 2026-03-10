
"use client"

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { useIsMobile } from '@/hooks/use-mobile';

interface ThreeSceneProps {
  isPaused?: boolean;
}

export const ThreeScene: React.FC<ThreeSceneProps> = ({ isPaused = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);
  const frameId = useRef<number | null>(null);
  const isMobile = useIsMobile();
  
  // Refs for animation and model control
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const dragonFireSpiralRef = useRef<THREE.Points | null>(null);
  const ambientSparksRef = useRef<THREE.Points | null>(null);
  const groundFlamesRef = useRef<THREE.Points | null>(null);
  const goldenLightRef = useRef<THREE.PointLight | null>(null);
  const isPausedRef = useRef(isPaused);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // Procedural "Celestial Fire Staff"
  const createFireStaff = (scene: THREE.Scene) => {
    const group = new THREE.Group();
    
    // Main shaft
    const geometry = new THREE.CylinderGeometry(0.1, 0.1, 8, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0xc89b3c,
      metalness: 1.0,
      roughness: 0.1,
      emissive: 0xc89b3c,
      emissiveIntensity: 0.8
    });
    const staff = new THREE.Mesh(geometry, material);
    group.add(staff);

    // Glowing ornaments
    const ringGeo = new THREE.TorusGeometry(0.3, 0.05, 16, 100);
    const ringMat = new THREE.MeshStandardMaterial({ 
      color: 0xffaa00,
      emissive: 0xffaa00,
      emissiveIntensity: 2.0
    });
    
    for (let i = 0; i < 4; i++) {
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.y = (i - 1.5) * 2;
      ring.rotation.x = Math.PI / 2;
      group.add(ring);
    }

    scene.add(group);
    modelRef.current = group;
    return group;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050101); // Dark charcoal/red base
    scene.fog = new THREE.FogExp2(0x1a0505, 0.05);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, isMobile ? 15 : 12);

    const renderer = new THREE.WebGLRenderer({ 
      antialias: false,
      alpha: true, 
      powerPreference: "high-performance" 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // 2. Post Processing (Dramatic Fire Bloom)
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      2.0, // Strength
      0.4, // Radius
      0.6  // Threshold
    );
    
    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    // 3. Lighting (Flickering Gold & Red)
    const ambientLight = new THREE.AmbientLight(0x221100, 0.3);
    scene.add(ambientLight);

    const goldenPointLight = new THREE.PointLight(0xff9900, 50, 25);
    goldenPointLight.position.set(0, 0, 2);
    scene.add(goldenPointLight);
    goldenLightRef.current = goldenPointLight;

    const redRimLight = new THREE.PointLight(0xff0000, 30, 30);
    redRimLight.position.set(-8, 5, -8);
    scene.add(redRimLight);

    // 4. Load Wukong or Fallback
    const loader = new GLTFLoader();
    loader.load(
      '/black_myth_wukong_-_sun_wu_kong.glb', 
      (gltf) => {
        const model = gltf.scene;
        modelRef.current = model;
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const m = child as THREE.Mesh;
            const mat = m.material as THREE.MeshStandardMaterial;
            mat.emissive = new THREE.Color(0xc89b3c);
            mat.emissiveIntensity = 0.5;
          }
        });
        const box = new THREE.Box3().setFromObject(model);
        const scale = (isMobile ? 5 : 7) / box.getSize(new THREE.Vector3()).y;
        model.scale.set(scale, scale, scale);
        model.position.y = isMobile ? -2 : -1.5;
        scene.add(model);

        if (gltf.animations && gltf.animations.length > 0) {
          mixerRef.current = new THREE.AnimationMixer(model);
          mixerRef.current.clipAction(gltf.animations[0]).play();
        }
      }, 
      undefined, 
      () => createFireStaff(scene)
    );

    // 5. Fire Particles (Ground Flames)
    const fireCount = isMobile ? 80 : 200;
    const fireGeo = new THREE.BufferGeometry();
    const firePos = new Float32Array(fireCount * 3);
    const fireColors = new Float32Array(fireCount * 3);
    for (let i = 0; i < fireCount; i++) {
      firePos[i * 3] = (Math.random() - 0.5) * 4;
      firePos[i * 3 + 1] = -4; // Base
      firePos[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    fireGeo.setAttribute('position', new THREE.BufferAttribute(firePos, 3));
    const fireMat = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: false,
      color: 0xff4400,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    const groundFlames = new THREE.Points(fireGeo, fireMat);
    groundFlamesRef.current = groundFlames;
    scene.add(groundFlames);

    // 6. Dragon Fire Spiral (Helix)
    const spiralCount = isMobile ? 150 : 400;
    const spiralGeo = new THREE.BufferGeometry();
    const sPos = new Float32Array(spiralCount * 3);
    spiralGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
    const spiralMat = new THREE.PointsMaterial({
      color: 0xffaa00,
      size: 0.08,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    const dragonFireSpiral = new THREE.Points(spiralGeo, spiralMat);
    dragonFireSpiralRef.current = dragonFireSpiral;
    scene.add(dragonFireSpiral);

    // 7. Ambient Sparks (Upward Embers)
    const sparkCount = isMobile ? 60 : 150;
    const sparkGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(sparkCount * 3);
    for (let i = 0; i < sparkCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 20;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const sparkMat = new THREE.PointsMaterial({
      color: 0xffcc00,
      size: 0.05,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const ambientSparks = new THREE.Points(sparkGeo, sparkMat);
    ambientSparksRef.current = ambientSparks;
    scene.add(ambientSparks);

    // 8. Event Handlers
    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    const onScroll = () => scrollRef.current = window.scrollY;
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('scroll', onScroll, { passive: true });

    // 9. Animation Loop
    const clock = new THREE.Clock();
    const animate = () => {
      if (isPausedRef.current) {
        frameId.current = requestAnimationFrame(animate);
        return;
      }

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();
      const scrollY = scrollRef.current;

      // Cinematic Camera Motion (Orbit + Slight Zoom)
      const orbitRadius = (isMobile ? 16 : 13) - (scrollY * 0.002);
      const orbitSpeed = 0.1;
      camera.position.x = Math.sin(time * orbitSpeed) * orbitRadius;
      camera.position.z = Math.cos(time * orbitSpeed) * orbitRadius;
      camera.position.y = 2 + Math.sin(time * 0.2) * 2 - (scrollY * 0.005);
      camera.lookAt(0, 0, 0);

      // Flickering Golden Light
      if (goldenLightRef.current) {
        goldenLightRef.current.intensity = 40 + Math.sin(time * 10) * 15;
        goldenLightRef.current.position.y = Math.sin(time * 2) * 1.5;
      }

      // Ground Flames (Chaotic rising motion)
      if (groundFlamesRef.current) {
        const fPosArr = groundFlamesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < fireCount; i++) {
          fPosArr[i * 3 + 1] += 0.05 + Math.random() * 0.05; // Rise
          fPosArr[i * 3] += Math.sin(time * 5 + i) * 0.02; // Turbulence
          if (fPosArr[i * 3 + 1] > 2) fPosArr[i * 3 + 1] = -4; // Reset
        }
        groundFlamesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Dragon Fire Spiral (Helix)
      if (dragonFireSpiralRef.current) {
        const sPosArr = dragonFireSpiralRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < spiralCount; i++) {
          const angle = time * 4 + (i * 0.1);
          const radius = 1.2 + Math.sin(time + i * 0.2) * 0.3;
          const verticalFlow = ((i / spiralCount) - 0.5) * 12 + Math.sin(time * 2 + i) * 0.5;
          sPosArr[i * 3] = Math.cos(angle) * radius;
          sPosArr[i * 3 + 1] = verticalFlow;
          sPosArr[i * 3 + 2] = Math.sin(angle) * radius;
        }
        dragonFireSpiralRef.current.geometry.attributes.position.needsUpdate = true;
        dragonFireSpiralRef.current.rotation.y -= 0.03;
      }

      // Ambient Embers Drift
      if (ambientSparksRef.current) {
        const pPosArr = ambientSparksRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < sparkCount; i++) {
          pPosArr[i * 3 + 1] += 0.02;
          pPosArr[i * 3] += Math.sin(time + i) * 0.01;
          if (pPosArr[i * 3 + 1] > 10) pPosArr[i * 3 + 1] = -10;
        }
        ambientSparksRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Character / Staff Levitation & Mouse Reactivity
      if (modelRef.current) {
        if (mixerRef.current) mixerRef.current.update(delta);
        modelRef.current.position.y += Math.sin(time * 0.8) * 0.002;
        const targetRotY = mouse.current.x * 0.2;
        modelRef.current.rotation.y = THREE.MathUtils.lerp(modelRef.current.rotation.y, targetRotY, 0.05);
      }

      composer.render();
      frameId.current = requestAnimationFrame(animate);
    };

    frameId.current = requestAnimationFrame(animate);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (frameId.current) cancelAnimationFrame(frameId.current);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      composer.dispose();
    };
  }, [isMobile]);

  return <div ref={containerRef} className="fixed inset-0 -z-10" style={{ willChange: 'transform' }} />;
};
