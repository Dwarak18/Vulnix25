"use client"

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, Sparkles, Scroll as ScrollIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeroProps {
  onRegisterPortal?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onRegisterPortal }) => {
  const [scrollY, setScrollY] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const introOpacity = Math.max(0, 1 - scrollY / 400);
  const staffRevealOpacity = Math.min(1, Math.max(0, (scrollY - 200) / 400));
  const mainTitleOpacity = Math.min(1, Math.max(0, (scrollY - 600) / 400));

  return (
    <section className="relative min-h-[250vh] md:min-h-[300vh] flex flex-col items-center">
      {/* SCENE 1: The Dark Opening */}
      <div 
        className="fixed inset-0 flex items-center justify-center text-center px-4 pointer-events-none z-20"
        style={{ opacity: introOpacity }}
      >
        <div className="max-w-4xl mx-auto">
          <p className="text-lg md:text-3xl font-headline tracking-[0.4em] text-primary/90 mb-6 italic uppercase gold-glow-text">
            "EVERY LEGEND BEGINS WITH A CHALLENGE."
          </p>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary/50 to-transparent mx-auto" />
        </div>
      </div>

      {/* SCENE 2 & 3: Welcome (Sticky container) */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center text-center px-4 md:px-8 overflow-hidden z-10">
        <div 
          className="max-w-screen-xl mx-auto transition-all duration-1000 w-full"
          style={{ 
            opacity: scrollY > 400 ? mainTitleOpacity : staffRevealOpacity,
            transform: `translateY(${(scrollY > 600 ? 0 : 20)}px)`
          }}
        >
          {/* Subtle label */}
          <div className="flex items-center justify-center gap-4 mb-6 opacity-70">
            <div className="h-px w-8 md:w-12 bg-primary/50" />
            <span className="text-primary font-headline tracking-[0.5em] text-[10px] md:text-xs uppercase whitespace-nowrap">The Trials of Enlightenment</span>
            <div className="h-px w-8 md:w-12 bg-primary/50" />
          </div>
          
          <h1 className="text-5xl sm:text-7xl md:text-[8rem] lg:text-[10rem] font-black mb-4 tracking-tighter uppercase relative select-none break-words">
            <span className="mythic-bevel-gold">VULNI</span>
            <span className="mythic-bevel-red">X</span>
            <span className="mythic-bevel-gold ml-2 md:ml-4">2.0</span>
          </h1>
          
          <div className="relative inline-block mb-10">
            <p className="text-lg sm:text-2xl md:text-4xl font-headline tracking-widest text-secondary font-bold italic uppercase">
              National level symposium 2026
            </p>
            <Sparkles className="absolute -top-4 -right-8 md:-right-10 text-primary/40 animate-pulse" size={20} />
          </div>

          <p className="text-sm sm:text-base md:text-xl max-w-2xl mx-auto mb-12 text-muted-foreground leading-relaxed font-body italic px-4">
            "Where the iron of strategy meets the gold of innovation. Descend into the arena and prove your worth before the Great Sage."
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center pointer-events-auto w-full max-w-md mx-auto">
            <Button 
              onClick={onRegisterPortal || (() => scrollToSection('registration'))}
              size="lg" 
              className="w-full sm:w-auto bg-primary hover:bg-primary/80 text-black font-bold px-8 md:px-12 py-6 md:py-8 text-lg md:text-xl rounded-none shadow-gold-glow ornate-border transition-all hover:scale-105"
            >
              SIGN THE SCROLL
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto border-primary/30 text-primary hover:bg-primary/5 px-8 md:px-12 py-6 md:py-8 text-lg md:text-xl rounded-none transition-all group"
              onClick={() => scrollToSection('about')}
            >
              <ScrollIcon className="mr-2 group-hover:rotate-12 transition-transform" />
              READ THE LEGEND
            </Button>
          </div>
        </div>
        
        {/* Reduced dark vignette effect at bottom */}
        <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-black/40 to-transparent pointer-events-none opacity-20 temple-silhouette" />
      </div>
      
      <div 
        className="fixed bottom-12 left-1/2 -translate-x-1/2 animate-bounce text-primary/40 cursor-pointer z-30" 
        onClick={() => scrollToSection('about')}
        style={{ opacity: introOpacity }}
      >
        <ChevronDown size={isMobile ? 32 : 48} strokeWidth={1} />
      </div>
      
      <div className="fog-layer z-0" />
    </section>
  );
};