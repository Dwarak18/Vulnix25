"use client"

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, Sparkles, Scroll as ScrollIcon } from 'lucide-react';

export const Hero: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  // Calculate opacity/visibility based on scroll for cinematic effects
  const introOpacity = Math.max(0, 1 - scrollY / 400);
  const staffRevealOpacity = Math.min(1, Math.max(0, (scrollY - 200) / 400));
  const mainTitleOpacity = Math.min(1, Math.max(0, (scrollY - 600) / 400));

  return (
    <section className="relative min-h-[300vh] flex flex-col items-center">
      {/* SCENE 1: The Dark Opening */}
      <div 
        className="fixed inset-0 flex items-center justify-center text-center px-4 pointer-events-none z-20"
        style={{ opacity: introOpacity }}
      >
        <div className="max-w-4xl">
          <p className="text-xl md:text-3xl font-headline tracking-[0.4em] text-primary/80 mb-6 italic">
            "Every legend begins with a challenge."
          </p>
          <div className="h-px w-24 bg-primary/40 mx-auto" />
        </div>
      </div>

      {/* SCENE 2 & 3: Staff Reveal and Welcome (Sticky container) */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center text-center px-4 overflow-hidden z-10">
        <div 
          className="max-w-5xl transition-all duration-1000"
          style={{ opacity: scrollY > 400 ? mainTitleOpacity : staffRevealOpacity }}
        >
          {/* Subtle label */}
          <div className="flex items-center justify-center gap-4 mb-4 opacity-70">
            <div className="h-px w-12 bg-primary/50" />
            <span className="text-primary font-headline tracking-[0.5em] text-xs uppercase">The Trials of Enlightenment</span>
            <div className="h-px w-12 bg-primary/50" />
          </div>
          
          <h1 className="text-6xl md:text-9xl font-black text-primary mb-2 tracking-tighter filter drop-shadow-[0_0_30px_rgba(200,155,60,0.5)]">
            VULNIX 2.0
          </h1>
          
          <div className="relative inline-block mb-10">
            <p className="text-xl md:text-4xl font-headline tracking-widest text-secondary font-bold italic">
              Celestial Cyber Symposium
            </p>
            <Sparkles className="absolute -top-4 -right-10 text-primary/40 animate-pulse" />
          </div>

          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-12 text-muted-foreground leading-relaxed font-body">
            "Where the iron of strategy meets the gold of innovation. Descend into the arena and prove your worth before the Great Sage."
          </p>
          
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center pointer-events-auto">
            <Button 
              onClick={() => scrollToSection('registration')}
              size="lg" 
              className="bg-primary hover:bg-primary/80 text-black font-bold px-12 py-8 text-xl rounded-none shadow-gold-glow ornate-border transition-all hover:scale-105"
            >
              SIGN THE SCROLL
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-primary/30 text-primary hover:bg-primary/5 px-12 py-8 text-xl rounded-none transition-all group"
              onClick={() => scrollToSection('about')}
            >
              <ScrollIcon className="mr-2 group-hover:rotate-12 transition-transform" />
              READ THE LEGEND
            </Button>
          </div>
        </div>
        
        {/* Distant silhouettes indicator */}
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black to-transparent pointer-events-none opacity-40 temple-silhouette" />
      </div>
      
      <div 
        className="fixed bottom-12 left-1/2 -translate-x-1/2 animate-bounce text-primary/40 cursor-pointer z-30" 
        onClick={() => scrollToSection('about')}
        style={{ opacity: introOpacity }}
      >
        <ChevronDown size={48} strokeWidth={1} />
      </div>
      
      <div className="fog-layer z-0" />
    </section>
  );
};
