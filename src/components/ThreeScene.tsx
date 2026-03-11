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

  const createOrnateTexture = (color: string, isGold: boolean) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 1024, 1024);
      
      if (isGold) {
        ctx.strokeStyle = '#8c6b2e';
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.2;
        for (let i = 0; i < 50; i++) {
          ctx.beginPath();
          ctx.arc(Math.random() * 1024, Math.random() * 1024, Math.random() * 200, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.globalAlpha = 0.4;
        ctx.font = 'bold 80px serif';
        ctx.fillStyle = '#5a451e';
        for (let i = 0; i < 10; i++) {
          ctx.fillText('龍', Math.random() * 1024, Math.random() * 1024);
        }
      } else {
        ctx.strokeStyle = '#4a0000';
        ctx.lineWidth = 0.5;
        ctx.globalAlpha = 0.1;
        for (let i = 0; i < 1024; i += 2) {
          ctx.beginPath();
          ctx.moveTo(0, i);
          ctx.lineTo(1024, i);
          ctx.stroke();
        }
      }
      
      ctx.globalAlpha = 0.15;
      ctx.strokeStyle = '#ffffff';
      for (let i = 0; i < 100; i++) {
        ctx.beginPath();
        const x = Math.random() * 1024;
        const y = Math.random() * 1024;
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.random() * 50, y + Math.random() * 50);
        ctx.stroke();
      }
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  };

  const createLegendStaff = (scene: THREE.Scene) => {
    const group = new THREE.Group();
    
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xc89b3c,
      metalness: 1.0,
      roughness: 0.18,
      emissive: 0x443300,
      emissiveIntensity: 0.2,
      map: createOrnateTexture('#1a1100', true),
      transparent: true,
      opacity: 1
    });

    const redLacquerMat = new THREE.MeshStandardMaterial({
      color: 0x7A1E1E,
      metalness: 0.4,
      roughness: 0.08,
      emissive: 0x220000,
      emissiveIntensity: 0.1,
      map: createOrnateTexture('#4a0000', false),
      transparent: true,
      opacity: 1
    });

    const glowingGoldMat = new THREE.MeshStandardMaterial({
      color: 0xffaa00,
      emissive: 0xffaa00,
      emissiveIntensity: 1.8,
      metalness: 1.0,
      transparent: true,
      opacity: 1
    });

    const mainShaftGeo = new THREE.CylinderGeometry(0.12, 0.12, 6.8, 64);
    const mainShaft = new THREE.Mesh(mainShaftGeo, goldMat);
    group.add(mainShaft);

    const bandHeight = 1.4;
    const bandGeo = new THREE.CylinderGeometry(0.135, 0.135, bandHeight, 64);
    
    const topBand = new THREE.Mesh(bandGeo, redLacquerMat);
    topBand.position.y = 1.9;
    group.add(topBand);

    const bottomBand = new THREE.Mesh(bandGeo, redLacquerMat);
    bottomBand.position.y = -1.9;
    group.add(bottomBand);

    const capGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.9, 64);
    const topCap = new THREE.Mesh(capGeo, goldMat);
    topCap.position.y = 3.85;
    group.add(topCap);

    const bottomCap = new THREE.Mesh(capGeo, goldMat);
    bottomCap.position.y = -3.85;
    group.add(bottomCap);

    const ringGeo = new THREE.TorusGeometry(0.16, 0.03, 16, 100);
    const ringPositions = [2.6, 1.2, 0, -1.2, -2.6, 3.4, -3.4];
    ringPositions.forEach(y => {
      const ring = new THREE.Mesh(ringGeo, glowingGoldMat);
      ring.position.y = y;
      ring.rotation.x = Math.PI / 2;
      group.add(ring);
    });

    const tipGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.2, 64);
    const topTip = new THREE.Mesh(tipGeo, glowingGoldMat);
    topTip.position.y = 4.3;
    group.add(topTip);

    const bottomTip = new THREE.Mesh(tipGeo, glowingGoldMat);
    bottomTip.position.y = -4.3;
    group.add(bottomTip);

    scene.add(group);
    modelRef.current = group;
    return group;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); 
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.05);

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
      1.5, 
      0.4, 
      0.85 
    );
    
    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.05);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffaa00, 1.2);
    keyLight.position.set(5, 5, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xd7263d, 1.5);
    rimLight.position.set(0, 5, -10);
    scene.add(rimLight);

    const goldenPointLight = new THREE.PointLight(0xffaa00, 50, 15);
    goldenPointLight.position.set(0, 0, 2);
    scene.add(goldenPointLight);
    goldenLightRef.current = goldenPointLight;

    createLegendStaff(scene);

    const sparkCount = isMobile ? 100 : 300;
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

    const burstCount = 100;
    const burstGeo = new THREE.BufferGeometry();
    const bPos = new Float32Array(burstCount * 3);
    for (let i = 0; i < burstCount; i++) {
      bPos[i * 3] = (Math.random() - 0.5) * 0.8;
      bPos[i * 3 + 1] = (Math.random() - 0.5) * 3;
      bPos[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
    }
    burstGeo.setAttribute('position', new THREE.BufferAttribute(bPos, 3));
    const burstMat = new THREE.PointsMaterial({
      color: 0xffaa00,
      size: 0.08,
      transparent: true,
      opacity: 0.9,
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

      const fadeStart = 400;
      const fadeEnd = 900;
      const staffFadeFactor = Math.max(0, 1 - (scrollY - fadeStart) / (fadeEnd - fadeStart));
      
      if (modelRef.current) {
        modelRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material.opacity = staffFadeFactor;
            if (child.material.emissiveIntensity !== undefined) {
              child.material.emissiveIntensity = Math.min(1.8, child.material.emissiveIntensity) * staffFadeFactor;
            }
          }
        });
        
        modelRef.current.position.y = Math.sin(time * 0.5) * 0.3 - (scrollY * 0.001);
        modelRef.current.rotation.y += 0.006;
        modelRef.current.rotation.z = Math.sin(time * 0.3) * 0.05;
      }

      const orbitSpeed = 0.15;
      const orbitRadius = (isMobile ? 11 : 9) + (scrollY * 0.001);
      camera.position.x = Math.sin(time * orbitSpeed) * 0.5;
      camera.position.z = orbitRadius;
      camera.position.y = -1 + Math.sin(time * 0.4) * 0.3 - (scrollY * 0.002);
      camera.lookAt(0, 0, 0);

      if (goldenLightRef.current) {
        goldenLightRef.current.intensity = (45 + Math.sin(time * 6) * 15) * staffFadeFactor;
      }

      if (ambientSparksRef.current) {
        const pPosArr = ambientSparksRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < sparkCount; i++) {
          pPosArr[i * 3 + 1] += 0.015;
          pPosArr[i * 3] += Math.sin(time * 0.5 + i) * 0.008;
          if (pPosArr[i * 3 + 1] > 10) pPosArr[i * 3 + 1] = -10;
        }
        ambientSparksRef.current.geometry.attributes.position.needsUpdate = true;
      }

      if (centerBurstRef.current) {
        centerBurstRef.current.rotation.y -= 0.02;
        const bPosArr = centerBurstRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < burstCount; i++) {
          bPosArr[i * 3 + 1] += Math.sin(time * 2 + i) * 0.003;
        }
        centerBurstRef.current.geometry.attributes.position.needsUpdate = true;
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