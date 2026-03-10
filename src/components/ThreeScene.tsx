
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

  // Create an intricate ornate texture for the gold and red sections
  const createOrnateTexture = (color: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Base color
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 512, 512);
      
      // Filigree patterns
      ctx.strokeStyle = '#c89b3c';
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.4;
      
      for (let i = 0; i < 40; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * 512, Math.random() * 512);
        ctx.bezierCurveTo(
          Math.random() * 512, Math.random() * 512,
          Math.random() * 512, Math.random() * 512,
          Math.random() * 512, Math.random() * 512
        );
        ctx.stroke();
      }

      // Border lines
      ctx.globalAlpha = 0.7;
      ctx.strokeRect(10, 10, 492, 492);
      ctx.strokeRect(20, 20, 472, 472);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  };

  // Create the specific Sun Wukong staff from the image
  const createCelestialStaff = (scene: THREE.Scene) => {
    const group = new THREE.Group();
    
    // Materials
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xc89b3c,
      metalness: 0.95,
      roughness: 0.1,
      emissive: 0x443300,
      emissiveIntensity: 0.3,
      map: createOrnateTexture('#1a1100')
    });

    const redMat = new THREE.MeshStandardMaterial({
      color: 0x8b0000,
      metalness: 0.4,
      roughness: 0.2,
      emissive: 0x330000,
      emissiveIntensity: 0.2,
      map: createOrnateTexture('#4a0000')
    });

    // 1. Central Red Shaft
    const shaftGeo = new THREE.CylinderGeometry(0.12, 0.12, 6, 32);
    const shaft = new THREE.Mesh(shaftGeo, redMat);
    group.add(shaft);

    // 2. Ornate Gold Ends (Caps)
    const capGeo = new THREE.CylinderGeometry(0.15, 0.15, 1.2, 32);
    
    const topCap = new THREE.Mesh(capGeo, goldMat);
    topCap.position.y = 3.6;
    group.add(topCap);

    const bottomCap = new THREE.Mesh(capGeo, goldMat);
    bottomCap.position.y = -3.6;
    group.add(bottomCap);

    // 3. Gold Decorative Rings on the red shaft
    const ringGeo = new THREE.TorusGeometry(0.13, 0.015, 16, 64);
    const ringMat = new THREE.MeshStandardMaterial({ 
      color: 0xffaa00,
      emissive: 0xffaa00,
      emissiveIntensity: 1.0,
      metalness: 1.0
    });
    
    // Positions derived from the provided image
    const ringPositions = [2.8, 1.5, 0, -1.5, -2.8];
    ringPositions.forEach(y => {
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.y = y;
      ring.rotation.x = Math.PI / 2;
      group.add(ring);
    });

    // 4. Detailed Engravings (Calligraphy / Patterns on the Gold sections)
    const detailGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.2, 32);
    const topDetail = new THREE.Mesh(detailGeo, ringMat);
    topDetail.position.y = 4.1;
    group.add(topDetail);

    const bottomDetail = new THREE.Mesh(detailGeo, ringMat);
    bottomDetail.position.y = -4.1;
    group.add(bottomDetail);

    scene.add(group);
    modelRef.current = group;
    return group;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x010101); // Minimalist deep black
    scene.fog = new THREE.FogExp2(0x010101, 0.05);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, isMobile ? 14 : 10);

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
      1.5, // Radiant mystical bloom
      0.5, 
      0.9  
    );
    
    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);

    const goldenPointLight = new THREE.PointLight(0xffaa00, 30, 15);
    goldenPointLight.position.set(2, 2, 4);
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
            mat.emissiveIntensity = 0.2;
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
      () => createCelestialStaff(scene)
    );

    // Floating Golden Ember Particles (Clean, as requested)
    const sparkCount = isMobile ? 60 : 120;
    const sparkGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(sparkCount * 3);
    for (let i = 0; i < sparkCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 15;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const sparkMat = new THREE.PointsMaterial({
      color: 0xc89b3c,
      size: 0.035,
      transparent: true,
      opacity: 0.5,
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

      // Cinematic Fixed Camera with slight orbit
      const orbitSpeed = 0.08;
      const orbitRadius = (isMobile ? 12 : 9) - (scrollY * 0.002);
      camera.position.x = Math.sin(time * orbitSpeed) * 0.5;
      camera.position.z = orbitRadius;
      camera.position.y = Math.sin(time * 0.2) * 0.5 - (scrollY * 0.003);
      camera.lookAt(0, 0, 0);

      // Flickering Golden Light
      if (goldenLightRef.current) {
        goldenLightRef.current.intensity = 25 + Math.sin(time * 4) * 10;
      }

      // Drifting Golden Embers
      if (ambientSparksRef.current) {
        const pPosArr = ambientSparksRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < sparkCount; i++) {
          pPosArr[i * 3 + 1] += 0.008;
          pPosArr[i * 3] += Math.sin(time * 0.3 + i) * 0.004;
          if (pPosArr[i * 3 + 1] > 7.5) pPosArr[i * 3 + 1] = -7.5;
        }
        ambientSparksRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Staff levitation & rotation
      if (modelRef.current) {
        if (mixerRef.current) mixerRef.current.update(delta);
        modelRef.current.position.y = Math.sin(time * 0.5) * 0.15 - (scrollY * 0.001);
        modelRef.current.rotation.y += 0.003;
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
