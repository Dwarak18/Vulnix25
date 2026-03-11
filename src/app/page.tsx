"use client"

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ThreeScene } from '@/components/ThreeScene';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Events } from '@/components/Events';
import { RegistrationForm } from '@/components/RegistrationForm';
import { FogPortal } from '@/components/FogPortal';
import { BackgroundRunes } from '@/components/BackgroundRunes';
import { Toaster } from '@/components/ui/toaster';
import { Instagram, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);

  // Intersection observer to track if registration is visible
  const [isRegistrationInView, setIsRegistrationInView] = useState(false);

  const handleRegisterPortal = () => {
    setIsTransitioning(true);
    
    // Lazy-load the registration UI slightly before it's needed
    setTimeout(() => {
      setShowRegistration(true);
    }, 500);

    setTimeout(() => {
      const regSection = document.getElementById('registration');
      if (regSection) {
        regSection.scrollIntoView({ behavior: 'auto' });
      }
      
      setTimeout(() => {
        setIsTransitioning(false);
      }, 600);
    }, 1200);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsRegistrationInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const regElement = document.getElementById('registration');
    if (regElement) observer.observe(regElement);

    return () => {
      if (regElement) observer.unobserve(regElement);
    };
  }, [showRegistration]);

  return (
    <main className="relative min-h-screen">
      {/* Cinematic Portal Overlay */}
      <FogPortal isVisible={isTransitioning} />

      {/* Immersive 3D Background */}
      <ThreeScene isPaused={isTransitioning} />
      
      {/* Atmospheric Background Elements */}
      <BackgroundRunes isPaused={isTransitioning || isRegistrationInView} />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 px-4 sm:px-8 py-4 sm:py-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <div className="text-xl sm:text-2xl font-black text-primary pointer-events-auto flex items-center">
          VULNI<span className="vulnix-x">X</span> 2.0
        </div>
        <div className="hidden md:flex gap-8 text-xs font-headline tracking-widest text-primary/70 pointer-events-auto">
          <a href="#about" className="hover:text-primary transition-colors">LEGEND</a>
          <a href="#events" className="hover:text-primary transition-colors">TRIALS</a>
          <Link href="/schedule" className="hover:text-primary transition-colors">CHRONICLE</Link>
          <a href="#registration" className="hover:text-primary transition-colors">SCROLL</a>
        </div>
      </nav>

      {/* Content Sections */}
      <Hero onRegisterPortal={handleRegisterPortal} />
      <About />
      <Events />
      
      {/* Defer RegistrationForm rendering until transition starts for performance */}
      {(showRegistration || isTransitioning) && <RegistrationForm />}

      {/* Ending Scene */}
      <section id="ending-scene" className="relative py-32 md:py-64 overflow-hidden flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative z-10 w-full max-w-screen-xl mx-auto"
        >
          <div className="h-px w-16 md:w-24 bg-gradient-to-r from-transparent via-primary to-transparent mb-8 md:mb-12 mx-auto" />
          <h2 className="text-4xl sm:text-6xl md:text-8xl text-primary font-headline tracking-[0.2em] md:tracking-[0.3em] gold-glow-text uppercase break-words">
            The Trials Await.
          </h2>
          <div className="h-px w-16 md:w-24 bg-gradient-to-r from-transparent via-primary to-transparent mt-8 md:mt-12 mx-auto" />
          
          <motion.p 
            className="mt-8 md:mt-12 text-muted-foreground font-body text-lg md:text-xl italic tracking-widest"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            Will you face the Sage?
          </motion.p>
        </motion.div>
        
        {/* Reduced dark vignette effect */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-primary/5 to-transparent opacity-10" />
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-muted-foreground text-[10px] sm:text-xs uppercase tracking-widest border-t border-primary/10 bg-black/95 relative z-20 px-4">
        <div className="max-w-screen-xl mx-auto">
          <p className="mb-6">© VULNIX 2.0 SYMPOSIUM — POWERED BY THE ANCIENT SPIRIT OF INNOVATION</p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-12 mt-8">
            <a 
              href="https://www.instagram.com/_cyzor_?igsh=MWU3ZWczZWQxbHVicA==" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary/40 hover:text-primary cursor-pointer transition-colors flex items-center gap-2"
            >
              <Instagram size={14} /> INSTAGRAM
            </a>
            <a 
              href="https://www.linkedin.com/in/3105-149cybersecurity?utm_source=share_via&utm_content=profile&utm_medium=member_android" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary/40 hover:text-primary cursor-pointer transition-colors flex items-center gap-2"
            >
              <Linkedin size={14} /> LINKEDIN
            </a>
            <a 
              href="mailto:cyberevents@dscet.ac.in" 
              className="text-primary/40 hover:text-primary cursor-pointer transition-colors flex items-center gap-2"
            >
              <Mail size={14} /> cyberevents@dscet.ac.in
            </a>
          </div>
          
          <p className="text-[10px] text-primary/60 tracking-[0.3em] italic mt-16 text-center uppercase">
            Forged by the Architects of VULNIX — Dwarak × Kumaran
          </p>
        </div>
      </footer>

      <Toaster />
    </main>
  );
}