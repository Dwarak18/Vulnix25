"use client"

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.1);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // Staff creation (Simplified version for performance)
    const staffGroup = new THREE.Group();
    
    // Main staff body
    const staffGeo = new THREE.CylinderGeometry(0.05, 0.05, 4, 32);
    const staffMat = new THREE.MeshStandardMaterial({ 
      color: 0xffc100, 
      metalness: 0.9, 
      roughness: 0.1,
      emissive: 0xffc100,
      emissiveIntensity: 0.2
    });
    const staff = new THREE.Mesh(staffGeo, staffMat);
    staffGroup.add(staff);

    // Staff ends
    const endGeo = new THREE.TorusGeometry(0.15, 0.03, 16, 100);
    const endMat = new THREE.MeshStandardMaterial({ color: 0xffc100, metalness: 1 });
    
    const topEnd = new THREE.Mesh(endGeo, endMat);
    topEnd.position.y = 2;
    topEnd.rotation.x = Math.PI / 2;
    staffGroup.add(topEnd);

    const bottomEnd = topEnd.clone();
    bottomEnd.position.y = -2;
    staffGroup.add(bottomEnd);

    scene.add(staffGroup);

    // Embers
    const emberCount = 500;
    const emberGeo = new THREE.BufferGeometry();
    const emberPos = new Float32Array(emberCount * 3);
    for (let i = 0; i < emberCount * 3; i++) {
      emberPos[i] = (Math.random() - 0.5) * 15;
    }
    emberGeo.setAttribute('position', new THREE.BufferAttribute(emberPos, 3));
    const emberMat = new THREE.PointsMaterial({
      color: 0xffc100,
      size: 0.03,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    const embers = new THREE.Points(emberGeo, emberMat);
    scene.add(embers);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffc100, 2, 10);
    pointLight.position.set(2, 2, 2);
    scene.add(pointLight);

    // Animation & Resize
    let scrollY = 0;
    const onScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener('scroll', onScroll);

    const animate = () => {
      requestAnimationFrame(animate);

      // Staff animations
      staffGroup.rotation.y += 0.01;
      staffGroup.rotation.z = Math.sin(Date.now() * 0.001) * 0.1;
      staffGroup.position.y = Math.sin(Date.now() * 0.002) * 0.2;

      // Scroll reactions
      camera.position.y = -scrollY * 0.005;
      camera.lookAt(0, -scrollY * 0.005, 0);
      
      staffGroup.rotation.x = scrollY * 0.001;

      // Embers animation
      const positions = emberGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < emberCount; i++) {
        const idx = i * 3;
        positions[idx + 1] += 0.01; // Rise up
        if (positions[idx + 1] > 7.5) positions[idx + 1] = -7.5;
        positions[idx] += Math.sin(Date.now() * 0.001 + i) * 0.002;
      }
      emberGeo.attributes.position.needsUpdate = true;

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
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 -z-10 bg-black" />;
};
