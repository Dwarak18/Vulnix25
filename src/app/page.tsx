"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ThreeScene } from '@/components/ThreeScene';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Events } from '@/components/Events';
import { RegistrationForm } from '@/components/RegistrationForm';
import { FogPortal } from '@/components/FogPortal';
import { BackgroundRunes } from '@/components/BackgroundRunes';
import { Toaster } from '@/components/ui/toaster';

export default function Home() {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleRegisterPortal = () => {
    setIsTransitioning(true);
    
    setTimeout(() => {
      const regSection = document.getElementById('registration');
      if (regSection) {
        regSection.scrollIntoView({ behavior: 'auto' });
      }
      
      setTimeout(() => {
        setIsTransitioning(false);
      }, 1000);
    }, 1500);
  };

  return (
    <main className="relative min-h-screen">
      {/* Cinematic Portal Overlay */}
      <FogPortal isVisible={isTransitioning} />

      {/* Immersive 3D Background */}
      <ThreeScene />
      
      {/* Atmospheric Background Elements */}
      <BackgroundRunes />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <div className="text-2xl font-black text-primary pointer-events-auto">VULNIX 2.0</div>
        <div className="hidden md:flex gap-8 text-xs font-headline tracking-widest text-primary/70 pointer-events-auto">
          <a href="#about" className="hover:text-primary transition-colors">LEGEND</a>
          <a href="#events" className="hover:text-primary transition-colors">TRIALS</a>
          <a href="#registration" className="hover:text-primary transition-colors">SCROLL</a>
        </div>
      </nav>

      {/* Content Sections */}
      <Hero onRegisterPortal={handleRegisterPortal} />
      <About />
      <Events />
      <RegistrationForm />

      {/* Ending Scene */}
      <section className="relative py-64 overflow-hidden flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="relative z-10"
        >
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-primary to-transparent mb-12 mx-auto" />
          <h2 className="text-5xl md:text-8xl text-primary font-headline tracking-[0.3em] gold-glow-text uppercase">
            The Trials Await.
          </h2>
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-primary to-transparent mt-12 mx-auto" />
          
          <motion.p 
            className="mt-12 text-muted-foreground font-body text-xl italic tracking-widest"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            Will you face the Sage?
          </motion.p>
        </motion.div>
        
        {/* Swirling Embers at the very bottom */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-primary/5 to-transparent opacity-30" />
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-muted-foreground text-xs uppercase tracking-widest border-t border-primary/10 bg-black/95 relative z-20">
        <div className="max-w-4xl mx-auto px-4">
          <p className="mb-4">© VULNIX 2.0 SYMPOSIUM — POWERED BY THE ANCIENT SPIRIT OF INNOVATION</p>
          <div className="flex justify-center gap-6">
            <span className="text-primary/40 hover:text-primary cursor-pointer transition-colors">INSTAGRAM</span>
            <span className="text-primary/40 hover:text-primary cursor-pointer transition-colors">LINKEDIN</span>
            <span className="text-primary/40 hover:text-primary cursor-pointer transition-colors">TWITTER</span>
          </div>
        </div>
      </footer>

      <Toaster />
    </main>
  );
}