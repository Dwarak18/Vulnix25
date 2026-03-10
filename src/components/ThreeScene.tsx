
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
  const dragonSpiralRef = useRef<THREE.Points | null>(null);
  const isPausedRef = useRef(isPaused);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // Helper to create a procedural "Celestial Staff" if GLB is missing
  const createProceduralStaff = (scene: THREE.Scene) => {
    const group = new THREE.Group();
    
    // The main shaft
    const geometry = new THREE.CylinderGeometry(0.1, 0.1, 6, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0xc89b3c,
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0xc89b3c,
      emissiveIntensity: 0.5
    });
    const staff = new THREE.Mesh(geometry, material);
    group.add(staff);

    // Decorative Rings
    const ringGeo = new THREE.TorusGeometry(0.2, 0.02, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xc89b3c });
    
    for (let i = 0; i < 4; i++) {
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.y = (i - 1.5) * 1.5;
      ring.rotation.x = Math.PI / 2;
      group.add(ring);
    }

    group.position.y = 0;
    scene.add(group);
    modelRef.current = group;
    return group;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.06);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, isMobile ? 12 : 8);

    const renderer = new THREE.WebGLRenderer({ 
      antialias: !isMobile,
      alpha: true, 
      powerPreference: "high-performance" 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // 2. Post Processing
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.2, // strength
      0.4, // radius
      0.85 // threshold
    );
    
    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    // 3. Lighting (Dramatic Fantasy)
    const ambientLight = new THREE.AmbientLight(0x221111, 1);
    scene.add(ambientLight);

    const goldenPointLight = new THREE.PointLight(0xc89b3c, 25, 30);
    goldenPointLight.position.set(2, 5, 2);
    scene.add(goldenPointLight);

    const redRimLight = new THREE.PointLight(0x7a1e1e, 15, 20);
    redRimLight.position.set(-5, 2, -5);
    scene.add(redRimLight);

    // 4. Load Wukong GLB Model with Fallback
    const loader = new GLTFLoader();
    loader.load(
      '/black_myth_wukong_-_sun_wu_kong.glb', 
      (gltf) => {
        const model = gltf.scene;
        modelRef.current = model;
        
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = (isMobile ? 4 : 5) / maxDim;
        model.scale.set(scale, scale, scale);
        
        const center = box.getCenter(new THREE.Vector3());
        model.position.x = -center.x * scale;
        model.position.y = (-center.y * scale) + (isMobile ? -1 : 0);
        model.position.z = -center.z * scale;
        
        scene.add(model);

        if (gltf.animations && gltf.animations.length > 0) {
          const mixer = new THREE.AnimationMixer(model);
          mixerRef.current = mixer;
          const action = mixer.clipAction(gltf.animations[0]);
          action.play();
        }
      }, 
      undefined, 
      () => {
        // Fallback to procedural staff if file is missing (e.g. 404)
        console.warn('Wukong GLB not found. Invoking Celestial Staff fallback.');
        createProceduralStaff(scene);
      }
    );

    // 5. Dragon Energy Spiral
    const energyCount = isMobile ? 150 : 300;
    const energyGeo = new THREE.BufferGeometry();
    const energyPos = new Float32Array(energyCount * 3);
    for (let i = 0; i < energyCount; i++) {
      energyPos[i * 3] = 0;
      energyPos[i * 3 + 1] = 0;
      energyPos[i * 3 + 2] = 0;
    }
    energyGeo.setAttribute('position', new THREE.BufferAttribute(energyPos, 3));
    const energyMat = new THREE.PointsMaterial({
      color: 0xc89b3c,
      size: 0.05,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    const energySpiral = new THREE.Points(energyGeo, energyMat);
    dragonSpiralRef.current = energySpiral;
    scene.add(energySpiral);

    // 6. Ambient Particles (Ash/Embers)
    const particleCount = isMobile ? 200 : 500;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x8c6b2e,
      size: 0.03,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending
    });
    const ambientParticles = new THREE.Points(particleGeo, particleMat);
    scene.add(ambientParticles);

    // 7. Event Handlers
    const onMouseMove = (event: MouseEvent) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    const onScroll = () => {
      scrollRef.current = window.scrollY;
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('scroll', onScroll, { passive: true });

    // 8. Animation Loop
    const clock = new THREE.Clock();
    const animate = () => {
      if (isPausedRef.current) {
        frameId.current = requestAnimationFrame(animate);
        return;
      }

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();
      const scrollY = scrollRef.current;

      // Camera Cinematic Orbit
      const orbitRadius = isMobile ? 12 : 10;
      const orbitSpeed = 0.1;
      camera.position.x = Math.sin(time * orbitSpeed) * orbitRadius;
      camera.position.z = Math.cos(time * orbitSpeed) * orbitRadius;
      camera.position.y = 2 + Math.sin(time * 0.5) * 0.5 - (scrollY * 0.005);
      camera.lookAt(0, 0, 0);

      // Model Interactions
      if (modelRef.current) {
        if (!mixerRef.current) {
          // Subtle breathing/levitation for procedural fallback
          modelRef.current.position.y = Math.sin(time * 1.5) * 0.2;
          modelRef.current.rotation.y += 0.005;
        } else {
          mixerRef.current.update(delta);
        }
        
        // Mouse reaction
        const targetRotY = mouse.current.x * 0.1;
        const targetRotX = mouse.current.y * 0.05;
        modelRef.current.rotation.y = THREE.MathUtils.lerp(modelRef.current.rotation.y, targetRotY, 0.05);
        modelRef.current.rotation.x = THREE.MathUtils.lerp(modelRef.current.rotation.x, targetRotX, 0.05);
      }

      // Dragon Energy Spiral Update
      if (dragonSpiralRef.current) {
        const ePos = dragonSpiralRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < energyCount; i++) {
          const angle = time * 2 + i * 0.08;
          const radius = 1.2 + Math.sin(time + i * 0.1) * 0.4;
          ePos[i * 3] = Math.cos(angle) * radius;
          ePos[i * 3 + 1] = ((i / energyCount) - 0.5) * 12 + Math.sin(time + i) * 0.2;
          ePos[i * 3 + 2] = Math.sin(angle) * radius;
        }
        dragonSpiralRef.current.geometry.attributes.position.needsUpdate = true;
        dragonSpiralRef.current.rotation.y += 0.01;
      }

      // Ambient Particles Drift
      const pPos = ambientParticles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        pPos[i * 3 + 1] += 0.01;
        if (pPos[i * 3 + 1] > 20) pPos[i * 3 + 1] = -20;
      }
      ambientParticles.geometry.attributes.position.needsUpdate = true;

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
