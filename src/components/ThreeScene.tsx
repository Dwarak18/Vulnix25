"use client"

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

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

    // Ruyi Jingu Bang (Golden Hoop Staff) - Improved Mythology Look
    const staffGroup = new THREE.Group();
    
    // Main staff body (Ancient Dark Iron)
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

    // Ash / Embers Particles (More cinematic)
    const particleCount = 1200;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount);
    const life = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
      velocities[i] = 0.005 + Math.random() * 0.015;
      life[i] = Math.random();
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particleMat = new THREE.PointsMaterial({
      color: 0xc89b3c,
      size: 0.05,
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

    const accentLight = new THREE.PointLight(0x7a1e1e, 10, 20);
    accentLight.position.set(-5, -2, 2);
    scene.add(accentLight);

    // Scroll state tracking
    let scrollY = 0;
    const onScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener('scroll', onScroll);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Staff subtle floating animation
      const time = Date.now() * 0.001;
      staffGroup.rotation.y += 0.008;
      staffGroup.rotation.z = Math.sin(time * 0.5) * 0.1;
      staffGroup.position.y = Math.sin(time * 0.8) * 0.2;

      // Parallax and zoom based on scroll
      // As we scroll, camera moves down and slightly closer
      const targetZ = 8 - Math.min(scrollY * 0.002, 3);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, -scrollY * 0.005, 0.05);
      camera.lookAt(0, -scrollY * 0.005, 0);

      // Staff rotates faster or shifts on scroll
      staffGroup.rotation.x = scrollY * 0.001;

      // Particles animation (Ash drift)
      const pPos = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        pPos[i * 3 + 1] += velocities[i];
        if (pPos[i * 3 + 1] > 15) pPos[i * 3 + 1] = -15;
        pPos[i * 3] += Math.sin(time + i) * 0.003;
      }
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
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 -z-10" />;
};
