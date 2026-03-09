import React from 'react';

export const About: React.FC = () => {
  return (
    <section id="about" className="relative py-24 px-4 bg-background/50">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-6xl mb-12 text-primary font-bold">The Legend</h2>
        <div className="relative p-8 md:p-12 gold-border bg-card/40 backdrop-blur-sm">
          <p className="text-xl md:text-2xl leading-relaxed text-muted-foreground">
            VULNIX 2.0 is a cybersecurity and innovation symposium where participants challenge themselves through hacking puzzles, AI competitions, technical presentations, and creative contests. 
          </p>
          <p className="mt-8 text-xl md:text-2xl leading-relaxed text-muted-foreground font-headline italic">
            Inspired by the mythological journey of the Monkey King, every participant faces trials of intelligence, creativity, and strategy.
          </p>
          <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-primary" />
          <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-primary" />
        </div>
      </div>
    </section>
  );
};
