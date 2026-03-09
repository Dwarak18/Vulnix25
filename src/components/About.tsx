import React from 'react';

export const About: React.FC = () => {
  return (
    <section id="about" className="relative py-32 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-6xl mb-16 text-primary font-headline">The Ancient Accord</h2>
        <div className="stone-tablet p-12 md:p-20 ornate-border">
          <p className="text-xl md:text-2xl leading-relaxed text-muted-foreground font-body mb-8">
            VULNIX 2.0 is more than a symposium; it is a sacred gathering of the most disciplined minds. In this realm, the digital and the mythological converge.
          </p>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent my-10" />
          <p className="text-2xl md:text-3xl leading-relaxed text-primary font-headline italic tracking-wide">
            "True mastery is not found in the tools one wields, but in the spirit that guides them through the shadow."
          </p>
          <div className="absolute top-4 left-4 text-primary/20 text-6xl select-none font-headline">智</div>
          <div className="absolute bottom-4 right-4 text-primary/20 text-6xl select-none font-headline">勇</div>
        </div>
      </div>
    </section>
  );
};
