
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
  const ambientParticlesRef = useRef<THREE.Points | null>(null);
  const goldenLightRef = useRef<THREE.PointLight | null>(null);
  const isPausedRef = useRef(isPaused);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // Stage 3 & 4: Procedural "Celestial Staff" Fallback if GLB is missing
  const createProceduralStaff = (scene: THREE.Scene) => {
    const group = new THREE.Group();
    
    // The main shaft - Ornate and powerful
    const geometry = new THREE.CylinderGeometry(0.08, 0.08, 7, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0xc89b3c,
      metalness: 1.0,
      roughness: 0.1,
      emissive: 0x8c6b2e,
      emissiveIntensity: 0.2
    });
    const staff = new THREE.Mesh(geometry, material);
    group.add(staff);

    // Decorative Dragon Rings
    const ringGeo = new THREE.TorusGeometry(0.25, 0.03, 16, 100);
    const ringMat = new THREE.MeshStandardMaterial({ 
      color: 0xc89b3c,
      metalness: 1.0,
      emissive: 0xc89b3c,
      emissiveIntensity: 0.5
    });
    
    for (let i = 0; i < 6; i++) {
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.y = (i - 2.5) * 1.2;
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

    // 1. Scene Setup - Stage 1: Fog Emergence (Deep Red/Charcoal)
    const scene = new THREE.Scene();
    const fogColor = new THREE.Color(0x0a0505);
    scene.background = fogColor;
    scene.fog = new THREE.FogExp2(0x1a0505, 0.04);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, isMobile ? 12 : 10);

    const renderer = new THREE.WebGLRenderer({ 
      antialias: false, // Performance: Post-processing handles smoothing
      alpha: true, 
      powerPreference: "high-performance" 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // 2. Post Processing - Dramatic Fantasy Bloom
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5, // strength
      0.5, // radius
      0.7  // threshold (Only gold highlights glow)
    );
    
    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    // 3. Lighting - Dramatic Red & Gold (Stage 4)
    const ambientLight = new THREE.AmbientLight(0x221111, 0.5);
    scene.add(ambientLight);

    const goldenPointLight = new THREE.PointLight(0xc89b3c, 40, 30);
    goldenPointLight.position.set(0, 0, 1);
    scene.add(goldenPointLight);
    goldenLightRef.current = goldenPointLight;

    const redRimLight = new THREE.PointLight(0x7a1e1e, 20, 25);
    redRimLight.position.set(-5, 5, -5);
    scene.add(redRimLight);

    // 4. Load Wukong GLB (Stage 3)
    const loader = new GLTFLoader();
    loader.load(
      '/black_myth_wukong_-_sun_wu_kong.glb', 
      (gltf) => {
        const model = gltf.scene;
        modelRef.current = model;
        
        // Material Upgrade for Cinematic Feel
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const m = child as THREE.Mesh;
            const mat = m.material as THREE.MeshStandardMaterial;
            if (mat.name.toLowerCase().includes('gold') || mat.color.getHex() > 0xaaaaaa) {
              mat.emissive = new THREE.Color(0xc89b3c);
              mat.emissiveIntensity = 0.4;
            }
          }
        });

        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = (isMobile ? 4.5 : 6) / maxDim;
        model.scale.set(scale, scale, scale);
        
        const center = box.getCenter(new THREE.Vector3());
        model.position.x = -center.x * scale;
        model.position.y = (-center.y * scale) + (isMobile ? -1.5 : -1);
        model.position.z = -center.z * scale;
        
        scene.add(model);

        if (gltf.animations && gltf.animations.length > 0) {
          const mixer = new THREE.AnimationMixer(model);
          mixerRef.current = mixer;
          const action = mixer.clipAction(gltf.animations[0]);
          action.setDuration(10); // Slower, more epic idle
          action.play();
        }
      }, 
      undefined, 
      () => {
        createProceduralStaff(scene);
      }
    );

    // 5. Dragon Energy Spiral (Stage 5)
    const energyCount = isMobile ? 120 : 250;
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
      size: 0.08,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    const energySpiral = new THREE.Points(energyGeo, energyMat);
    dragonSpiralRef.current = energySpiral;
    scene.add(energySpiral);

    // 6. Ambient Golden Sparks (Stage 2)
    const particleCount = isMobile ? 100 : 300;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xc89b3c,
      size: 0.04,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    });
    const ambientParticles = new THREE.Points(particleGeo, particleMat);
    ambientParticlesRef.current = ambientParticles;
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

    // 8. Animation Loop (Stage 6: Cinematic Orbit)
    const clock = new THREE.Clock();
    const animate = () => {
      if (isPausedRef.current) {
        frameId.current = requestAnimationFrame(animate);
        return;
      }

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();
      const scrollY = scrollRef.current;

      // Cinematic Camera Orbit
      const orbitRadius = isMobile ? 14 : 12;
      const orbitSpeed = 0.08;
      camera.position.x = Math.sin(time * orbitSpeed) * orbitRadius;
      camera.position.z = Math.cos(time * orbitSpeed) * orbitRadius;
      camera.position.y = 2 + Math.sin(time * 0.3) * 1.5 - (scrollY * 0.006);
      camera.lookAt(0, 0, 0);

      // Light Intensity Pulsing (Stage 4)
      if (goldenLightRef.current) {
        goldenLightRef.current.intensity = 30 + Math.sin(time * 2) * 10;
        goldenLightRef.current.position.y = Math.sin(time) * 2;
      }

      // Model Interactions & Levitation (Stage 3)
      if (modelRef.current) {
        if (!mixerRef.current) {
          modelRef.current.position.y = Math.sin(time * 0.8) * 0.4;
          modelRef.current.rotation.y += 0.003;
        } else {
          mixerRef.current.update(delta);
          // Combine animation with subtle floating
          modelRef.current.position.y += Math.sin(time) * 0.001;
        }
        
        // Mouse reaction
        const targetRotY = mouse.current.x * 0.15;
        const targetRotX = mouse.current.y * 0.08;
        modelRef.current.rotation.y = THREE.MathUtils.lerp(modelRef.current.rotation.y, targetRotY, 0.03);
        modelRef.current.rotation.x = THREE.MathUtils.lerp(modelRef.current.rotation.x, targetRotX, 0.03);
      }

      // Dragon Energy Spiral - Stage 5 (Swirling Upward)
      if (dragonSpiralRef.current) {
        const ePos = dragonSpiralRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < energyCount; i++) {
          const angle = time * 3 + (i * 0.15);
          const radius = 1.0 + Math.sin(time * 2 + i * 0.1) * 0.5;
          const verticalFlow = ((i / energyCount) - 0.5) * 14 + (Math.sin(time + i * 0.2) * 0.5);
          
          ePos[i * 3] = Math.cos(angle) * radius;
          ePos[i * 3 + 1] = verticalFlow;
          ePos[i * 3 + 2] = Math.sin(angle) * radius;
        }
        dragonSpiralRef.current.geometry.attributes.position.needsUpdate = true;
        dragonSpiralRef.current.rotation.y -= 0.02;
      }

      // Ambient Sparks Drift (Stage 2)
      if (ambientParticlesRef.current) {
        const pPos = ambientParticlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          pPos[i * 3 + 1] += 0.015;
          pPos[i * 3] += Math.sin(time + i) * 0.005;
          if (pPos[i * 3 + 1] > 20) pPos[i * 3 + 1] = -20;
        }
        ambientParticlesRef.current.geometry.attributes.position.needsUpdate = true;
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
