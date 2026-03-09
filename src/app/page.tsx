import React from 'react';
import { ThreeScene } from '@/components/ThreeScene';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Events } from '@/components/Events';
import { RegistrationForm } from '@/components/RegistrationForm';
import { Toaster } from '@/components/ui/toaster';

export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* Immersive 3D Background */}
      <ThreeScene />
      
      {/* Navigation (Simplified for theme) */}
      <nav className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <div className="text-2xl font-black text-primary pointer-events-auto">VULNIX 2.0</div>
        <div className="hidden md:flex gap-8 text-xs font-headline tracking-widest text-primary/70 pointer-events-auto">
          <a href="#about" className="hover:text-primary transition-colors">LEGEND</a>
          <a href="#events" className="hover:text-primary transition-colors">TRIALS</a>
          <a href="#registration" className="hover:text-primary transition-colors">SCROLL</a>
        </div>
      </nav>

      {/* Content Sections */}
      <Hero />
      <About />
      <Events />
      <RegistrationForm />

      {/* Footer */}
      <footer className="py-12 text-center text-muted-foreground text-xs uppercase tracking-widest border-t border-primary/10 bg-black/80">
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
