"use client"

import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  const scrollToRegister = () => {
    document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      <div className="z-10 max-w-5xl animate-in fade-in slide-in-from-bottom-12 duration-1000">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px w-12 bg-primary/50" />
          <span className="text-primary font-headline tracking-[0.5em] text-sm uppercase">The Trials of Enlightenment</span>
          <div className="h-px w-12 bg-primary/50" />
        </div>
        
        <h1 className="text-6xl md:text-9xl font-black text-primary mb-2 tracking-tighter filter drop-shadow-[0_0_20px_rgba(200,155,60,0.4)]">
          VULNIX 2.0
        </h1>
        
        <div className="relative inline-block mb-10">
          <p className="text-xl md:text-4xl font-headline tracking-widest text-secondary font-bold italic">
            Celestial Cyber Symposium
          </p>
          <Sparkles className="absolute -top-4 -right-8 text-primary/40 animate-pulse" />
        </div>

        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-12 text-muted-foreground leading-relaxed font-body">
          "Where the iron of strategy meets the gold of innovation. Descend into the arena and prove your worth before the Great Sage."
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Button 
            onClick={scrollToRegister}
            size="lg" 
            className="bg-primary hover:bg-primary/80 text-black font-bold px-10 py-8 text-xl rounded-none shadow-gold-glow ornate-border transition-all hover:scale-105"
          >
            SIGN THE SCROLL
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="border-primary/30 text-primary hover:bg-primary/5 px-10 py-8 text-xl rounded-none transition-all"
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
          >
            READ THE LEGEND
          </Button>
        </div>
      </div>
      
      <div className="absolute bottom-12 animate-bounce text-primary/40 cursor-pointer" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
        <ChevronDown size={40} strokeWidth={1} />
      </div>
      
      <div className="fog-layer" />
    </section>
  );
};
