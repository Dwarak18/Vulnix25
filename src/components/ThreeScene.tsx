"use client"

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const isHovered = useRef(false);
  const clickBurst = useRef(0);

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
    const particleCount = 2000;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const initialPositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 30;
      const y = (Math.random() - 0.5) * 30;
      const z = (Math.random() - 0.5) * 30;
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      initialPositions[i * 3] = x;
      initialPositions[i * 3 + 1] = y;
      initialPositions[i * 3 + 2] = z;

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

    const accentLight = new THREE.PointLight(0x7a1e1e, 10, 20);
    accentLight.position.set(-5, -2, 2);
    scene.add(accentLight);

    // Interaction Listeners
    const onMouseMove = (event: MouseEvent) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const onClick = () => {
      clickBurst.current = 1.0; // Trigger burst effect
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onClick);

    let scrollY = 0;
    const onScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener('scroll', onScroll);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      const time = Date.now() * 0.001;

      // Raycasting for hover detection
      raycaster.setFromCamera(new THREE.Vector2(mouse.current.x, mouse.current.y), camera);
      const intersects = raycaster.intersectObjects(staffGroup.children);
      isHovered.current = intersects.length > 0;

      // Update Staff Appearance based on Hover
      const targetEmissive = isHovered.current ? 1.5 : 0.3;
      hoopMat.emissiveIntensity = THREE.MathUtils.lerp(hoopMat.emissiveIntensity, targetEmissive, 0.1);
      
      const targetParticleSize = isHovered.current ? 0.12 : 0.06;
      particleMat.size = THREE.MathUtils.lerp(particleMat.size, targetParticleSize, 0.1);

      // Staff subtle floating and rotation tracking
      staffGroup.rotation.y += 0.008;
      
      // Rotate slightly toward cursor
      const targetRotX = mouse.current.y * 0.3;
      const targetRotZ = -mouse.current.x * 0.3;
      staffGroup.rotation.x = THREE.MathUtils.lerp(staffGroup.rotation.x, targetRotX + (scrollY * 0.001), 0.05);
      staffGroup.rotation.z = THREE.MathUtils.lerp(staffGroup.rotation.z, targetRotZ + (Math.sin(time * 0.5) * 0.1), 0.05);
      
      staffGroup.position.y = Math.sin(time * 0.8) * 0.2;

      // Camera parallax and zoom
      const targetZ = 8 - Math.min(scrollY * 0.002, 3);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, -scrollY * 0.005, 0.05);
      camera.lookAt(0, -scrollY * 0.005, 0);

      // Particles animation
      const pPos = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        // Normal drift
        pPos[i * 3 + 1] += velocities[i * 3 + 1];
        pPos[i * 3] += velocities[i * 3] + Math.sin(time + i) * 0.002;
        pPos[i * 3 + 2] += velocities[i * 3 + 2];

        // Burst effect logic
        if (clickBurst.current > 0) {
          const dirX = pPos[i * 3];
          const dirY = pPos[i * 3 + 1];
          const dirZ = pPos[i * 3 + 2];
          const dist = Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);
          
          // Push particles away from center
          pPos[i * 3] += (dirX / dist) * clickBurst.current * 0.2;
          pPos[i * 3 + 1] += (dirY / dist) * clickBurst.current * 0.2;
          pPos[i * 3 + 2] += (dirZ / dist) * clickBurst.current * 0.2;
        }

        // Reset particles that go too far
        if (pPos[i * 3 + 1] > 15) {
          pPos[i * 3] = (Math.random() - 0.5) * 30;
          pPos[i * 3 + 1] = -15;
          pPos[i * 3 + 2] = (Math.random() - 0.5) * 30;
        }
      }
      
      // Decay burst effect
      if (clickBurst.current > 0) {
        clickBurst.current -= 0.02;
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
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onClick);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 -z-10" />;
};