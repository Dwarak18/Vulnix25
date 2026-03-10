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
  const scrollRef = useRef(0);
  const frameId = useRef<number | null>(null);
  const isMobile = useIsMobile();
  
  const modelRef = useRef<THREE.Group | null>(null);
  const ambientSparksRef = useRef<THREE.Points | null>(null);
  const centerBurstRef = useRef<THREE.Points | null>(null);
  const goldenLightRef = useRef<THREE.PointLight | null>(null);
  const isPausedRef = useRef(isPaused);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  const createOrnateTexture = (color: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 512, 512);
      ctx.strokeStyle = '#c89b3c';
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.3;
      for (let i = 0; i < 30; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * 512, Math.random() * 512, Math.random() * 100, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 0.5;
      ctx.strokeRect(5, 5, 502, 502);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  };

  const createLegendStaff = (scene: THREE.Scene) => {
    const group = new THREE.Group();
    
    // High-fidelity Materials with transparency support for fading
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xc89b3c,
      metalness: 1.0,
      roughness: 0.15,
      emissive: 0x443300,
      emissiveIntensity: 0.2,
      map: createOrnateTexture('#1a1100'),
      transparent: true,
      opacity: 1
    });

    const redLacquerMat = new THREE.MeshStandardMaterial({
      color: 0x7A1E1E,
      metalness: 0.3,
      roughness: 0.1,
      emissive: 0x220000,
      emissiveIntensity: 0.1,
      map: createOrnateTexture('#4a0000'),
      transparent: true,
      opacity: 1
    });

    const glowingGoldMat = new THREE.MeshStandardMaterial({
      color: 0xffaa00,
      emissive: 0xffaa00,
      emissiveIntensity: 1.5,
      metalness: 1.0,
      transparent: true,
      opacity: 1
    });

    // 1. Main Polished Gold Shaft
    const mainShaftGeo = new THREE.CylinderGeometry(0.12, 0.12, 6.5, 32);
    const mainShaft = new THREE.Mesh(mainShaftGeo, goldMat);
    group.add(mainShaft);

    // 2. Deep Red Lacquer Bands
    const bandHeight = 1.2;
    const bandGeo = new THREE.CylinderGeometry(0.13, 0.13, bandHeight, 32);
    
    const topBand = new THREE.Mesh(bandGeo, redLacquerMat);
    topBand.position.y = 1.8;
    group.add(topBand);

    const bottomBand = new THREE.Mesh(bandGeo, redLacquerMat);
    bottomBand.position.y = -1.8;
    group.add(bottomBand);

    // 3. Engraved Gold Caps
    const capGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.8, 32);
    const capMat = goldMat.clone();
    capMat.emissiveIntensity = 0.4;

    const topCap = new THREE.Mesh(capGeo, capMat);
    topCap.position.y = 3.65;
    group.add(topCap);

    const bottomCap = new THREE.Mesh(capGeo, capMat);
    bottomCap.position.y = -3.65;
    group.add(bottomCap);

    // 4. Ornamental Rings
    const ringGeo = new THREE.TorusGeometry(0.14, 0.02, 16, 64);
    const ringPositions = [2.4, 1.2, 0, -1.2, -2.4, 3.25, -3.25];
    ringPositions.forEach(y => {
      const ring = new THREE.Mesh(ringGeo, glowingGoldMat);
      ring.position.y = y;
      ring.rotation.x = Math.PI / 2;
      group.add(ring);
    });

    // 5. Final Detailed Tips
    const tipGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.15, 32);
    const topTip = new THREE.Mesh(tipGeo, glowingGoldMat);
    topTip.position.y = 4.05;
    group.add(topTip);

    const bottomTip = new THREE.Mesh(tipGeo, glowingGoldMat);
    bottomTip.position.y = -4.05;
    group.add(bottomTip);

    scene.add(group);
    modelRef.current = group;
    return group;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); 
    scene.fog = new THREE.FogExp2(0x000000, 0.04);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, -1, isMobile ? 12 : 9);

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true, 
      powerPreference: "high-performance" 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.8, 
      0.4, 
      0.85 
    );
    
    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.05);
    scene.add(ambientLight);

    const goldenPointLight = new THREE.PointLight(0xffaa00, 40, 12);
    goldenPointLight.position.set(0, 0, 2);
    scene.add(goldenPointLight);
    goldenLightRef.current = goldenPointLight;

    const rimLight = new THREE.DirectionalLight(0xff3300, 0.5);
    rimLight.position.set(0, 0, -5);
    scene.add(rimLight);

    createLegendStaff(scene);

    const sparkCount = isMobile ? 80 : 200;
    const sparkGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(sparkCount * 3);
    for (let i = 0; i < sparkCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 20;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const sparkMat = new THREE.PointsMaterial({
      color: 0xc89b3c,
      size: 0.04,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const ambientSparks = new THREE.Points(sparkGeo, sparkMat);
    ambientSparksRef.current = ambientSparks;
    scene.add(ambientSparks);

    const burstCount = 50;
    const burstGeo = new THREE.BufferGeometry();
    const bPos = new Float32Array(burstCount * 3);
    for (let i = 0; i < burstCount; i++) {
      bPos[i * 3] = (Math.random() - 0.5) * 0.5;
      bPos[i * 3 + 1] = (Math.random() - 0.5) * 2;
      bPos[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
    }
    burstGeo.setAttribute('position', new THREE.BufferAttribute(bPos, 3));
    const burstMat = new THREE.PointsMaterial({
      color: 0xffaa00,
      size: 0.06,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    const centerBurst = new THREE.Points(burstGeo, burstMat);
    centerBurstRef.current = centerBurst;
    scene.add(centerBurst);

    const onScroll = () => scrollRef.current = window.scrollY;
    window.addEventListener('scroll', onScroll, { passive: true });

    const clock = new THREE.Clock();
    const animate = () => {
      if (isPausedRef.current) {
        frameId.current = requestAnimationFrame(animate);
        return;
      }

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();
      const scrollY = scrollRef.current;

      // Staff Fading Logic: Fade out as user scrolls towards the main title reveal
      // VULNIX 2.0 starts revealing around 600px, so we fade staff between 400px and 900px
      const fadeStart = 400;
      const fadeEnd = 900;
      const staffFadeFactor = Math.max(0, 1 - (scrollY - fadeStart) / (fadeEnd - fadeStart));
      
      if (modelRef.current) {
        modelRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material.opacity = staffFadeFactor;
            // Also reduce emissive intensity so it doesn't bloom while invisible
            if (child.material.emissiveIntensity !== undefined) {
              child.material.emissiveIntensity = Math.min(1.5, child.material.emissiveIntensity) * staffFadeFactor;
            }
          }
        });
        modelRef.current.position.y = Math.sin(time * 0.6) * 0.2 - (scrollY * 0.001);
        modelRef.current.rotation.y += 0.004;
      }

      // Cinematic Camera Orbit
      const orbitSpeed = 0.12;
      const orbitRadius = (isMobile ? 11 : 8.5) + (scrollY * 0.001);
      camera.position.x = Math.sin(time * orbitSpeed) * 0.8;
      camera.position.z = orbitRadius;
      camera.position.y = -1 + Math.sin(time * 0.3) * 0.4 - (scrollY * 0.002);
      camera.lookAt(0, 0, 0);

      // Flickering & Pulsing Center Light - also affected by staff fade
      if (goldenLightRef.current) {
        goldenLightRef.current.intensity = (35 + Math.sin(time * 5) * 15) * staffFadeFactor;
      }

      // Ambient Spark Drift
      if (ambientSparksRef.current) {
        const pPosArr = ambientSparksRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < sparkCount; i++) {
          pPosArr[i * 3 + 1] += 0.01;
          pPosArr[i * 3] += Math.sin(time * 0.4 + i) * 0.005;
          if (pPosArr[i * 3 + 1] > 10) pPosArr[i * 3 + 1] = -10;
        }
        ambientSparksRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Center Burst Animation
      if (centerBurstRef.current) {
        const bPosArr = centerBurstRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < burstCount; i++) {
          bPosArr[i * 3 + 1] += Math.sin(time + i) * 0.002;
          bPosArr[i * 3] += Math.cos(time + i) * 0.002;
        }
        centerBurstRef.current.geometry.attributes.position.needsUpdate = true;
        centerBurstRef.current.rotation.y += 0.01;
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
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      composer.dispose();
    };
  }, [isMobile]);

  return <div ref={containerRef} className="fixed inset-0 -z-10 bg-black" style={{ willChange: 'transform' }} />;
};