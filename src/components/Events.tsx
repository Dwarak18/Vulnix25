"use client"

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Shield, Brain, Globe, Flag, Terminal, Music, Camera, Film, Utensils, Dice5, Scroll } from 'lucide-react';

const TECH_EVENTS = [
  {
    title: "Celestial Paper Expo",
    desc: "Present your most visionary research. Evaluated on the enlightenment of your concepts.",
    icon: <Globe size={28} />,
    color: "primary"
  },
  {
    title: "Whispering Prompt",
    desc: "Command the spirits of AI with precision. The most effective incantation wins.",
    icon: <Brain size={28} />,
    color: "primary"
  },
  {
    title: "Web Weaver Trial",
    desc: "Construct digital realms using nothing but your words and prompt-based wisdom.",
    icon: <Terminal size={28} />,
    color: "primary"
  },
  {
    title: "Golden CTF",
    desc: "The ultimate trial of infiltration. Solve puzzles of shadow and light.",
    icon: <Flag size={28} />,
    color: "primary"
  },
  {
    title: "Spirit Debugging",
    desc: "Identify the corruption in the code and purify it before the incense burns out.",
    icon: <Shield size={28} />,
    color: "primary"
  }
];

const NON_TECH_EVENTS = [
  {
    title: "Melody of the Sage",
    desc: "Identify the ancient tunes from mere echoes in this musical trivia challenge.",
    icon: <Music size={28} />,
    color: "secondary"
  },
  {
    title: "The Third Eye",
    desc: "Capture the essence of the world through your lens. Perspective is everything.",
    icon: <Camera size={28} />,
    color: "secondary"
  },
  {
    title: "Shadow Sagas",
    desc: "Short film presentations demonstrating storytelling and visual mastery.",
    icon: <Film size={28} />,
    color: "secondary"
  },
  {
    title: "Alchemy of Taste",
    desc: "Prepare divine sustenance without the use of fire. True elemental control.",
    icon: <Utensils size={28} />,
    color: "secondary"
  },
  {
    title: "Trial of Strategy",
    desc: "Ancient board games: Chess, Carrom, and Ludo. Test your tactical mind.",
    icon: <Dice5 size={28} />,
    color: "secondary"
  }
];

const ScrollCard = ({ title, desc, icon, color }: { title: string, desc: string, icon: React.ReactNode, color: string }) => {
  const accentColor = color === 'primary' ? 'hsl(var(--primary))' : 'hsl(var(--secondary))';
  const cardRef = React.useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ height: 100, opacity: 0 }}
      whileInView={{ height: 'auto', opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      whileHover={{ scale: 1.02, y: -5, rotateX: 2 }}
      className="relative flex flex-col items-center group mb-16 perspective-1000"
    >
      {/* Top Roller - Bronze/Gold Metallic */}
      <div className="w-full h-8 scroll-roller rounded-full z-20 flex items-center justify-between px-6 border-b border-white/5 relative">
        <div className="w-4 h-4 rounded-full bg-black/60 border border-primary/40 shadow-inner" />
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="w-4 h-4 rounded-full bg-black/60 border border-primary/40 shadow-inner" />
      </div>

      {/* Parchment Body */}
      <div className="w-[96%] parchment-texture border-x-8 border-accent/30 overflow-hidden shadow-2xl transition-all duration-700 group-hover:shadow-[0_0_40px_rgba(200,155,60,0.15)] group-hover:brightness-110 relative">
        {/* Parallax Background Texture */}
        <motion.div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ 
            backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")',
            y: bgY
          }}
        />
        
        <div className="parchment-edge-burn" />

        <div className="p-10 md:p-12 space-y-8 relative z-10">
          <div className="flex items-center gap-8">
            <div 
              className="p-5 rounded-sm border shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:shadow-primary/20"
              style={{ 
                backgroundColor: `${accentColor}15`, 
                borderColor: `${accentColor}50`, 
                color: accentColor,
                boxShadow: `inset 0 0 15px ${accentColor}20`
              }}
            >
              {icon}
            </div>
            <h4 
              className="text-3xl md:text-4xl font-headline tracking-widest uppercase transition-all duration-500 group-hover:text-primary drop-shadow-md" 
              style={{ color: color === 'primary' ? undefined : accentColor }}
            >
              {title}
            </h4>
          </div>
          <p 
            className="text-white/80 font-body text-xl leading-relaxed italic border-l-4 pl-8 drop-shadow-sm" 
            style={{ borderColor: `${accentColor}40` }}
          >
            {desc}
          </p>
        </div>
        
        {/* Subtle Watermark Icon */}
        <div className="absolute bottom-6 right-6 opacity-5 group-hover:opacity-15 transition-opacity pointer-events-none scale-150">
          {icon}
        </div>
      </div>

      {/* Bottom Roller */}
      <div className="w-full h-8 scroll-roller rounded-full z-20 flex items-center justify-between px-6 border-t border-black/40 relative">
        <div className="w-4 h-4 rounded-full bg-black/60 border border-primary/40 shadow-inner" />
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="w-4 h-4 rounded-full bg-black/60 border border-primary/40 shadow-inner" />
      </div>

      {/* Outer Glow on Hover */}
      <div className="absolute -inset-4 bg-primary/5 rounded-xl blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
    </motion.div>
  );
};

export const Events: React.FC = () => {
  return (
    <section id="events" className="py-48 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-32">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            className="inline-block p-6 bg-primary/5 rounded-full mb-8 border border-primary/20 shadow-gold-glow"
          >
             <Scroll className="text-primary animate-pulse" size={56} />
          </motion.div>
          <h2 className="text-6xl md:text-9xl mb-8 text-primary font-headline tracking-tighter gold-glow-text">The Great Trials</h2>
          <p className="text-muted-foreground text-2xl md:text-3xl font-body italic max-w-4xl mx-auto opacity-80">
            "Each scroll contains a trial. Unfurl your destiny and face the Sage's wisdom."
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32">
          {/* Tech Events */}
          <div className="space-y-16">
            <div className="flex items-center gap-10 mb-20">
              <div className="h-[2px] flex-grow bg-gradient-to-r from-transparent to-primary/60" />
              <h3 className="text-5xl md:text-6xl font-headline text-primary tracking-widest whitespace-nowrap">Technical Sagas</h3>
              <div className="h-[2px] w-24 bg-primary/60" />
            </div>
            <div className="flex flex-col">
              {TECH_EVENTS.map((event, idx) => (
                <ScrollCard key={idx} {...event} />
              ))}
            </div>
          </div>

          {/* Non-Tech Events */}
          <div className="space-y-16">
            <div className="flex items-center gap-10 mb-20">
              <div className="h-[2px] w-24 bg-secondary/60" />
              <h3 className="text-5xl md:text-6xl font-headline text-secondary tracking-widest whitespace-nowrap">Creative Realms</h3>
              <div className="h-[2px] flex-grow bg-gradient-to-l from-transparent to-secondary/60" />
            </div>
            <div className="flex flex-col">
              {NON_TECH_EVENTS.map((event, idx) => (
                <ScrollCard key={idx} {...event} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};