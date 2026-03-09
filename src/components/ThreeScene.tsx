"use client"

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const isHovered = useRef(false);
  const clickBurst = useRef(0);
  const scrollRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.12);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    const raycaster = new THREE.Raycaster();

    // Ruyi Jingu Bang (Golden Hoop Staff)
    const staffGroup = new THREE.Group();
    
    // Main staff body
    const staffGeo = new THREE.CylinderGeometry(0.1, 0.1, 6, 32);
    const staffMat = new THREE.MeshStandardMaterial({ 
      color: 0x111111, 
      metalness: 0.9, 
      roughness: 0.6,
    });
    const staff = new THREE.Mesh(staffGeo, staffMat);
    staffGroup.add(staff);

    // Golden Ends
    const hoopGeo = new THREE.CylinderGeometry(0.14, 0.14, 1.2, 32);
    const hoopMat = new THREE.MeshStandardMaterial({ 
      color: 0xc89b3c, 
      metalness: 1, 
      roughness: 0.2,
      emissive: 0xc89b3c,
      emissiveIntensity: 0.3
    });
    
    const topHoop = new THREE.Mesh(hoopGeo, hoopMat);
    topHoop.position.y = 2.4;
    staffGroup.add(topHoop);

    const bottomHoop = topHoop.clone();
    bottomHoop.position.y = -2.4;
    staffGroup.add(bottomHoop);

    // Ornate details
    const detailGeo = new THREE.TorusGeometry(0.16, 0.03, 16, 100);
    const detailMat = new THREE.MeshStandardMaterial({ color: 0x8c6b2e, metalness: 1 });
    
    for (let i = 0; i < 6; i++) {
      const ring = new THREE.Mesh(detailGeo, detailMat);
      ring.position.y = 1.8 + (i * 0.15);
      ring.rotation.x = Math.PI / 2;
      staffGroup.add(ring);
      
      const bRing = ring.clone();
      bRing.position.y = -1.8 - (i * 0.15);
      staffGroup.add(bRing);
    }

    scene.add(staffGroup);

    // Ash / Embers Particles
    const particleCount = 3000;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;

      velocities[i * 3] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 1] = 0.005 + Math.random() * 0.015;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particleMat = new THREE.PointsMaterial({
      color: 0xc89b3c,
      size: 0.06,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });
    
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x222222, 1);
    scene.add(ambientLight);

    const primaryLight = new THREE.PointLight(0xc89b3c, 15, 30);
    primaryLight.position.set(3, 3, 5);
    scene.add(primaryLight);

    // Interaction Listeners
    const onMouseMove = (event: MouseEvent) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const onClick = () => {
      clickBurst.current = 1.5;
    };

    const onScroll = () => {
      scrollRef.current = window.scrollY;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onClick);
    window.addEventListener('scroll', onScroll);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      const time = Date.now() * 0.001;
      const scrollY = scrollRef.current;
      const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollY / pageHeight;
      const isAtBottom = scrollPercent > 0.95;

      // Interaction
      raycaster.setFromCamera(new THREE.Vector2(mouse.current.x, mouse.current.y), camera);
      const intersects = raycaster.intersectObjects(staffGroup.children);
      isHovered.current = intersects.length > 0;

      // Glow intensity based on hover and bottom state
      const baseEmissive = isAtBottom ? 0.1 : (isHovered.current ? 1.5 : 0.3);
      hoopMat.emissiveIntensity = THREE.MathUtils.lerp(hoopMat.emissiveIntensity, baseEmissive, 0.05);
      
      // Particle behavior
      const targetParticleSize = isAtBottom ? 0.1 : (isHovered.current ? 0.12 : 0.06);
      particleMat.size = THREE.MathUtils.lerp(particleMat.size, targetParticleSize, 0.05);

      // Staff Motion
      staffGroup.rotation.y += 0.008;
      const targetRotX = mouse.current.y * 0.3;
      const targetRotZ = -mouse.current.x * 0.3;
      staffGroup.rotation.x = THREE.MathUtils.lerp(staffGroup.rotation.x, targetRotX + (scrollY * 0.0005), 0.05);
      staffGroup.rotation.z = THREE.MathUtils.lerp(staffGroup.rotation.z, targetRotZ + (Math.sin(time * 0.5) * 0.1), 0.05);
      
      // Lower staff at the bottom
      const targetY = isAtBottom ? -8 : Math.sin(time * 0.8) * 0.2;
      staffGroup.position.y = THREE.MathUtils.lerp(staffGroup.position.y, targetY, 0.03);

      // Camera
      const targetZ = 8 - Math.min(scrollY * 0.001, 4);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, -scrollY * 0.004, 0.05);
      camera.lookAt(0, -scrollY * 0.004, 0);

      // Particles
      const pPos = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        // Faster upward drift at bottom
        const speedMult = isAtBottom ? 2.5 : 1;
        pPos[i * 3 + 1] += velocities[i * 3 + 1] * speedMult;
        pPos[i * 3] += velocities[i * 3] + Math.sin(time + i) * 0.002;
        pPos[i * 3 + 2] += velocities[i * 3 + 2];

        if (clickBurst.current > 0) {
          const dirX = pPos[i * 3];
          const dirY = pPos[i * 3 + 1];
          const dirZ = pPos[i * 3 + 2];
          const dist = Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);
          pPos[i * 3] += (dirX / dist) * clickBurst.current * 0.2;
          pPos[i * 3 + 1] += (dirY / dist) * clickBurst.current * 0.2;
          pPos[i * 3 + 2] += (dirZ / dist) * clickBurst.current * 0.2;
        }

        if (pPos[i * 3 + 1] > 20) {
          pPos[i * 3] = (Math.random() - 0.5) * 40;
          pPos[i * 3 + 1] = -20;
          pPos[i * 3 + 2] = (Math.random() - 0.5) * 40;
        }
      }
      
      if (clickBurst.current > 0) clickBurst.current -= 0.05;
      particleGeo.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onClick);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 -z-10" />;
};