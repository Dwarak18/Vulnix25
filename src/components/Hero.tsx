"use client"

import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

export const Hero: React.FC = () => {
  const scrollToRegister = () => {
    document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      <div className="z-10 max-w-4xl animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <h1 className="text-7xl md:text-9xl font-black text-primary drop-shadow-[0_0_15px_rgba(255,193,0,0.5)] mb-2">
          VULNIX 2.0
        </h1>
        <p className="text-xl md:text-3xl font-headline tracking-[0.5em] text-secondary mb-6">
          Cyber Myth Symposium
        </p>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 text-muted-foreground leading-relaxed">
          "A gathering where cybersecurity, intelligence, and creativity collide."
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            onClick={scrollToRegister}
            size="lg" 
            className="bg-primary hover:bg-primary/80 text-black font-bold px-8 py-6 text-lg rounded-none gold-border mystical-glow transition-all"
          >
            REGISTER NOW
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="border-primary/50 text-primary hover:bg-primary/10 px-8 py-6 text-lg rounded-none"
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
          >
            EXPLORE MYTH
          </Button>
        </div>
      </div>
      
      <div className="absolute bottom-10 animate-bounce text-primary/50 cursor-pointer" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
        <ChevronDown size={32} />
      </div>
      
      <div className="absolute inset-0 fog-overlay pointer-events-none" />
    </section>
  );
};
