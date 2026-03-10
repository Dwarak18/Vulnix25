
"use client"

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
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
  const isHovered = useRef(false);
  const clickBurst = useRef(0);
  const scrollRef = useRef(0);
  const frameId = useRef<number | null>(null);
  const isMobile = useIsMobile();
  
  const isPausedRef = useRef(isPaused);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.08);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = isMobile ? 12 : 10;

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true, 
      powerPreference: "high-performance" 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Post Processing
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5, // strength
      0.4, // radius
      0.85 // threshold
    );
    
    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    const raycaster = new THREE.Raycaster();

    // Ruyi Jingu Bang
    const staffGroup = new THREE.Group();
    
    const staffGeo = new THREE.CylinderGeometry(0.12, 0.12, 8, 32);
    const staffMat = new THREE.MeshStandardMaterial({ 
      color: 0x050505, 
      metalness: 1, 
      roughness: 0.2,
    });
    const staff = new THREE.Mesh(staffGeo, staffMat);
    staffGroup.add(staff);

    const hoopGeo = new THREE.CylinderGeometry(0.16, 0.16, 1.5, 32);
    const hoopMat = new THREE.MeshStandardMaterial({ 
      color: 0xc89b3c, 
      metalness: 1, 
      roughness: 0.1,
      emissive: 0xc89b3c,
      emissiveIntensity: 0.5
    });
    
    const topHoop = new THREE.Mesh(hoopGeo, hoopMat);
    topHoop.position.y = 3.25;
    staffGroup.add(topHoop);

    const bottomHoop = topHoop.clone();
    bottomHoop.position.y = -3.25;
    staffGroup.add(bottomHoop);

    // Intricate Rings
    const ringGeo = new THREE.TorusGeometry(0.19, 0.02, 16, 64);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0x8c6b2e, metalness: 1 });
    
    for (let i = 0; i < 6; i++) {
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.y = 2.5 + (i * 0.2);
      ring.rotation.x = Math.PI / 2;
      staffGroup.add(ring);
      
      const bRing = ring.clone();
      bRing.position.y = -2.5 - (i * 0.2);
      staffGroup.add(bRing);
    }

    scene.add(staffGroup);

    // Dragon Energy Spiral (Particles)
    const energyCount = 200;
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
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    const energySpiral = new THREE.Points(energyGeo, energyMat);
    scene.add(energySpiral);

    // Ambient Particles (Ash/Embers)
    const particleCount = isMobile ? 400 : 1200;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = 0.01 + Math.random() * 0.03;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xc89b3c,
      size: isMobile ? 0.05 : 0.04,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    });
    const ambientParticles = new THREE.Points(particleGeo, particleMat);
    scene.add(ambientParticles);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x111111, 2);
    scene.add(ambientLight);

    const primaryLight = new THREE.PointLight(0xc89b3c, 15, 30);
    primaryLight.position.set(5, 5, 5);
    scene.add(primaryLight);

    const rimLight = new THREE.PointLight(0xffffff, 5, 20);
    rimLight.position.set(-5, 2, -5);
    scene.add(rimLight);

    const onMouseMove = (event: MouseEvent) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const onClick = () => {
      clickBurst.current = 2.0;
    };

    const onScroll = () => {
      scrollRef.current = window.scrollY;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onClick);
    window.addEventListener('scroll', onScroll, { passive: true });

    const animate = () => {
      if (isPausedRef.current) {
        frameId.current = requestAnimationFrame(animate);
        return;
      }

      const time = Date.now() * 0.001;
      const scrollY = scrollRef.current;
      const scrollPercent = scrollY / (document.documentElement.scrollHeight - window.innerHeight);

      // Cinematic Camera Orbit
      const orbitRadius = isMobile ? 12 : 10;
      const orbitSpeed = 0.15;
      camera.position.x = Math.sin(time * orbitSpeed) * orbitRadius;
      camera.position.z = Math.cos(time * orbitSpeed) * orbitRadius;
      camera.position.y = -scrollY * 0.005 + 2;
      camera.lookAt(0, -scrollY * 0.005, 0);

      // Staff Interaction & Levitation
      raycaster.setFromCamera(new THREE.Vector2(mouse.current.x, mouse.current.y), camera);
      const intersects = raycaster.intersectObjects(staffGroup.children);
      isHovered.current = intersects.length > 0;

      const targetEmissive = isHovered.current ? 3.0 : 0.5;
      hoopMat.emissiveIntensity = THREE.MathUtils.lerp(hoopMat.emissiveIntensity, targetEmissive, 0.05);

      staffGroup.rotation.y += 0.01;
      staffGroup.position.y = Math.sin(time * 1.5) * 0.3 - (scrollY * 0.002);
      
      const targetRotX = mouse.current.y * 0.2;
      const targetRotZ = -mouse.current.x * 0.2;
      staffGroup.rotation.x = THREE.MathUtils.lerp(staffGroup.rotation.x, targetRotX, 0.05);
      staffGroup.rotation.z = THREE.MathUtils.lerp(staffGroup.rotation.z, targetRotZ, 0.05);

      // Dragon Energy Spiral Update
      const ePos = energyGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < energyCount; i++) {
        const angle = time * 2 + i * 0.1;
        const radius = 0.5 + Math.sin(time + i * 0.2) * 0.2;
        ePos[i * 3] = Math.cos(angle) * radius;
        ePos[i * 3 + 1] = ((i / energyCount) - 0.5) * 10 + Math.sin(time + i) * 0.5;
        ePos[i * 3 + 2] = Math.sin(angle) * radius;
      }
      energyGeo.attributes.position.needsUpdate = true;

      // Ambient Particles Update
      const pPos = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        pPos[i * 3 + 1] += velocities[i * 3 + 1];
        pPos[i * 3] += velocities[i * 3] + Math.sin(time + i) * 0.005;
        
        if (clickBurst.current > 0) {
          pPos[i * 3] += (pPos[i * 3] / 5) * clickBurst.current;
          pPos[i * 3 + 1] += (pPos[i * 3 + 1] / 5) * clickBurst.current;
        }

        if (pPos[i * 3 + 1] > 20) pPos[i * 3 + 1] = -20;
      }
      if (clickBurst.current > 0) clickBurst.current -= 0.1;
      particleGeo.attributes.position.needsUpdate = true;

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
      window.removeEventListener('mousedown', onClick);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      composer.dispose();
    };
  }, [isMobile]);

  return <div ref={containerRef} className="fixed inset-0 -z-10" style={{ willChange: 'transform' }} />;
};
