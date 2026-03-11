import React from 'react';

export const About: React.FC = () => {
  return (
    <section id="about" className="relative py-24 md:py-48 px-4 overflow-hidden">
      {/* Background Silhouettes */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5 flex items-end justify-center">
        <div className="w-[120%] h-64 bg-primary/20 temple-silhouette blur-3xl transform -translate-y-24" />
      </div>

      <div className="max-w-screen-xl mx-auto text-center relative z-10 px-4 sm:px-6 md:px-8">
        <h2 className="text-3xl sm:text-5xl md:text-7xl mb-12 md:mb-16 text-primary font-headline tracking-tighter uppercase">The Ancient Accord</h2>
        <div className="stone-tablet p-8 sm:p-12 md:p-24 ornate-border shadow-2xl mx-auto max-w-4xl">
          <p className="text-lg sm:text-xl md:text-2xl leading-relaxed text-muted-foreground font-body mb-8 md:mb-10 text-justify md:text-center">
            VULNIX 2.0 is more than a symposium; it is a sacred gathering where the digital and mythological converge. In this realm, your code is your weapon, and your logic is your spirit.
          </p>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent my-8 md:my-12" />
          <p className="text-xl sm:text-2xl md:text-4xl leading-relaxed text-primary font-headline italic tracking-widest gold-glow-text uppercase">
            "True mastery is not found in the tools one wields, but in the spirit that guides them through the shadow."
          </p>
          
          {/* Mythical Runes */}
          <div className="absolute top-4 md:top-8 left-4 md:left-8 text-primary/10 text-6xl md:text-8xl select-none font-headline rune-glow hidden sm:block">智</div>
          <div className="absolute bottom-4 md:bottom-8 right-4 md:right-8 text-primary/10 text-6xl md:text-8xl select-none font-headline rune-glow hidden sm:block">勇</div>
        </div>
      </div>
    </section>
  );
};