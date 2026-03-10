
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
  
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const ambientSparksRef = useRef<THREE.Points | null>(null);
  const goldenLightRef = useRef<THREE.PointLight | null>(null);
  const isPausedRef = useRef(isPaused);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // Create a procedural texture for "engravings" and "calligraphy"
  const createOrnateTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Background
      ctx.fillStyle = '#111111';
      ctx.fillRect(0, 0, 512, 512);
      
      // Patterns
      ctx.strokeStyle = '#c89b3c';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 15]);
      
      // Draw some "mythical" lines/characters
      for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * 512, Math.random() * 512);
        ctx.bezierCurveTo(
          Math.random() * 512, Math.random() * 512,
          Math.random() * 512, Math.random() * 512,
          Math.random() * 512, Math.random() * 512
        );
        ctx.stroke();
      }

      // Add "Glow" highlights for the energy lines
      ctx.strokeStyle = '#ffaa00';
      ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * 100);
        ctx.lineTo(512, i * 100);
        ctx.stroke();
      }
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  };

  // Procedural "Ruyi Jingu Bang" with minimal elegant materials
  const createFireStaff = (scene: THREE.Scene) => {
    const group = new THREE.Group();
    const ornateTexture = createOrnateTexture();
    
    // 1. Main Gold Shaft
    const shaftGeo = new THREE.CylinderGeometry(0.12, 0.12, 8, 32);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xc89b3c,
      metalness: 0.95,
      roughness: 0.15,
      emissive: 0x443300,
      emissiveIntensity: 0.4,
      map: ornateTexture
    });
    const shaft = new THREE.Mesh(shaftGeo, goldMat);
    group.add(shaft);

    // 2. Dark Bronze Sections (Replaced Red for minimal look)
    const bronzeGeo = new THREE.CylinderGeometry(0.13, 0.13, 1.5, 32);
    const bronzeMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a, // Dark Charcoal / Bronze
      metalness: 0.8,
      roughness: 0.3,
      emissive: 0x000000,
      emissiveIntensity: 0
    });

    const topBronze = new THREE.Mesh(bronzeGeo, bronzeMat);
    topBronze.position.y = 2.5;
    group.add(topBronze);

    const bottomBronze = new THREE.Mesh(bronzeGeo, bronzeMat);
    bottomBronze.position.y = -2.5;
    group.add(bottomBronze);

    // 3. Ornate Caps
    const capGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.8, 32);
    const topCap = new THREE.Mesh(capGeo, goldMat);
    topCap.position.y = 3.65;
    group.add(topCap);

    const bottomCap = new THREE.Mesh(capGeo, goldMat);
    bottomCap.position.y = -3.65;
    group.add(bottomCap);

    // 4. Intricate Golden Rings
    const ringGeo = new THREE.TorusGeometry(0.16, 0.02, 16, 64);
    const ringMat = new THREE.MeshStandardMaterial({ 
      color: 0xffaa00,
      emissive: 0xffaa00,
      emissiveIntensity: 1.2,
      metalness: 1.0
    });
    
    const ringPositions = [3.25, 1.75, -1.75, -3.25];
    ringPositions.forEach(y => {
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.y = y;
      ring.rotation.x = Math.PI / 2;
      group.add(ring);
    });

    scene.add(group);
    modelRef.current = group;
    return group;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020202); // Deeper black
    scene.fog = new THREE.FogExp2(0x050505, 0.04); // Clean dark fog

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

    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.8, // Subtle mystical bloom
      0.4, 
      0.85  
    );
    
    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    const ambientLight = new THREE.AmbientLight(0x222222, 0.3);
    scene.add(ambientLight);

    const goldenPointLight = new THREE.PointLight(0xffaa00, 45, 20);
    goldenPointLight.position.set(0, 0, 4);
    scene.add(goldenPointLight);
    goldenLightRef.current = goldenPointLight;

    // Load Wukong or Fallback to Celestial Staff
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
            mat.emissiveIntensity = 0.3;
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

    // Ambient Golden Sparks (Embers only)
    const sparkCount = isMobile ? 80 : 180;
    const sparkGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(sparkCount * 3);
    for (let i = 0; i < sparkCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 20;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const sparkMat = new THREE.PointsMaterial({
      color: 0xffcc33,
      size: 0.045,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const ambientSparks = new THREE.Points(sparkGeo, sparkMat);
    ambientSparksRef.current = ambientSparks;
    scene.add(ambientSparks);

    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    const onScroll = () => scrollRef.current = window.scrollY;
    window.addEventListener('mousemove', onMouseMove);
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

      // Cinematic Camera Motion
      const orbitRadius = (isMobile ? 18 : 14) - (scrollY * 0.003);
      const orbitSpeed = 0.12;
      camera.position.x = Math.sin(time * orbitSpeed) * orbitRadius;
      camera.position.z = Math.cos(time * orbitSpeed) * orbitRadius;
      camera.position.y = 2 + Math.sin(time * 0.25) * 1.2 - (scrollY * 0.004);
      camera.lookAt(0, 0, 0);

      // Flickering Light
      if (goldenLightRef.current) {
        goldenLightRef.current.intensity = 40 + Math.sin(time * 6) * 15;
      }

      // Ambient Sparks drift
      if (ambientSparksRef.current) {
        const pPosArr = ambientSparksRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < sparkCount; i++) {
          pPosArr[i * 3 + 1] += 0.012;
          pPosArr[i * 3] += Math.sin(time * 0.5 + i) * 0.006;
          if (pPosArr[i * 3 + 1] > 10) pPosArr[i * 3 + 1] = -10;
        }
        ambientSparksRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Staff levitation & rotation
      if (modelRef.current) {
        if (mixerRef.current) mixerRef.current.update(delta);
        modelRef.current.position.y = (isMobile ? -2 : -1.5) + Math.sin(time * 0.6) * 0.2;
        modelRef.current.rotation.y += 0.004;
        
        const targetRotZ = mouse.current.x * 0.04;
        modelRef.current.rotation.z = THREE.MathUtils.lerp(modelRef.current.rotation.z, targetRotZ, 0.02);
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
