"use client"

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.15);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Ruyi Jingu Bang (Golden Hoop Staff)
    const staffGroup = new THREE.Group();
    
    // Main staff body (Iron)
    const staffGeo = new THREE.CylinderGeometry(0.08, 0.08, 4.5, 32);
    const staffMat = new THREE.MeshStandardMaterial({ 
      color: 0x1a1a1a, 
      metalness: 1, 
      roughness: 0.4,
    });
    const staff = new THREE.Mesh(staffGeo, staffMat);
    staffGroup.add(staff);

    // Golden Hoops (Ends)
    const hoopGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.6, 32);
    const hoopMat = new THREE.MeshStandardMaterial({ 
      color: 0xc89b3c, 
      metalness: 1, 
      roughness: 0.1,
      emissive: 0xc89b3c,
      emissiveIntensity: 0.2
    });
    
    const topHoop = new THREE.Mesh(hoopGeo, hoopMat);
    topHoop.position.y = 1.95;
    staffGroup.add(topHoop);

    const bottomHoop = topHoop.clone();
    bottomHoop.position.y = -1.95;
    staffGroup.add(bottomHoop);

    // Ornate engravings (simplified as torus rings)
    const ringGeo = new THREE.TorusGeometry(0.14, 0.02, 16, 100);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0xc89b3c, metalness: 1 });
    
    for (let i = 0; i < 4; i++) {
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.y = 1.7 + (i * 0.1);
      ring.rotation.x = Math.PI / 2;
      staffGroup.add(ring);
      
      const bRing = ring.clone();
      bRing.position.y = -1.7 - (i * 0.1);
      staffGroup.add(bRing);
    }

    scene.add(staffGroup);

    // Ash / Embers Particles
    const particleCount = 800;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      velocities[i] = 0.005 + Math.random() * 0.01;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particleMat = new THREE.PointsMaterial({
      color: 0xc89b3c,
      size: 0.04,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const primaryLight = new THREE.PointLight(0xc89b3c, 5, 20);
    primaryLight.position.set(2, 2, 4);
    scene.add(primaryLight);

    const rimLight = new THREE.DirectionalLight(0x7a1e1e, 1);
    rimLight.position.set(-5, 0, -5);
    scene.add(rimLight);

    // Animation loop
    let scrollY = 0;
    const onScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener('scroll', onScroll);

    const animate = () => {
      requestAnimationFrame(animate);

      // Staff rotation and hover
      staffGroup.rotation.y += 0.005;
      staffGroup.rotation.z = Math.sin(Date.now() * 0.001) * 0.05;
      staffGroup.position.y = Math.sin(Date.now() * 0.0015) * 0.15;

      // Parallax effect
      camera.position.y = -scrollY * 0.003;
      camera.lookAt(0, -scrollY * 0.003, 0);
      
      staffGroup.rotation.x = scrollY * 0.0005;

      // Particles animation
      const pPos = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        pPos[i * 3 + 1] += velocities[i];
        if (pPos[i * 3 + 1] > 10) pPos[i * 3 + 1] = -10;
        pPos[i * 3] += Math.sin(Date.now() * 0.0005 + i) * 0.002;
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
