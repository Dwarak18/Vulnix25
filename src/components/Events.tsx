"use client"

import React from 'react';
import { motion } from 'framer-motion';
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
  
  return (
    <motion.div
      initial={{ height: 100, opacity: 0 }}
      whileInView={{ height: 'auto', opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="relative flex flex-col items-center group mb-12"
    >
      {/* Top Roller */}
      <div className="w-full h-6 scroll-roller rounded-full z-20 flex items-center justify-between px-4">
        <div className="w-3 h-3 rounded-full bg-black/40 border border-white/10" />
        <div className="w-3 h-3 rounded-full bg-black/40 border border-white/10" />
      </div>

      {/* Parchment Body */}
      <div className="w-[95%] parchment-texture border-x-4 border-accent/20 overflow-hidden shadow-2xl transition-all duration-700 group-hover:shadow-[0_0_30px_rgba(200,155,60,0.1)]">
        <div className="p-8 md:p-10 space-y-6">
          <div className="flex items-center gap-6">
            <div 
              className="p-4 rounded-sm border transition-all duration-500 group-hover:scale-110"
              style={{ backgroundColor: `${accentColor}10`, borderColor: `${accentColor}40`, color: accentColor }}
            >
              {icon}
            </div>
            <h4 className="text-2xl md:text-3xl font-headline tracking-widest uppercase transition-colors duration-500 group-hover:text-primary" style={{ color: color === 'primary' ? undefined : accentColor }}>
              {title}
            </h4>
          </div>
          <p className="text-muted-foreground font-body text-lg leading-relaxed italic border-l-2 pl-6" style={{ borderColor: `${accentColor}30` }}>
            {desc}
          </p>
        </div>
        
        {/* Subtle Watermark Icon */}
        <div className="absolute bottom-4 right-4 opacity-5 group-hover:opacity-10 transition-opacity">
          {icon}
        </div>
      </div>

      {/* Bottom Roller */}
      <div className="w-full h-6 scroll-roller rounded-full z-20 flex items-center justify-between px-4">
        <div className="w-3 h-3 rounded-full bg-black/40 border border-white/10" />
        <div className="w-3 h-3 rounded-full bg-black/40 border border-white/10" />
      </div>
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
            className="inline-block p-4 bg-primary/5 rounded-full mb-6 border border-primary/20"
          >
             <Scroll className="text-primary animate-pulse" size={48} />
          </motion.div>
          <h2 className="text-5xl md:text-8xl mb-8 text-primary font-headline tracking-tighter gold-glow-text">The Great Trials</h2>
          <p className="text-muted-foreground text-2xl font-body italic max-w-3xl mx-auto">
            "Each scroll contains a trial. Unfurl your destiny and face the Sage's wisdom."
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          {/* Tech Events */}
          <div className="space-y-12">
            <div className="flex items-center gap-8 mb-16">
              <div className="h-[2px] flex-grow bg-gradient-to-r from-transparent to-primary/60" />
              <h3 className="text-4xl md:text-5xl font-headline text-primary tracking-widest">Technical Sagas</h3>
              <div className="h-[2px] w-16 bg-primary/60" />
            </div>
            <div className="flex flex-col">
              {TECH_EVENTS.map((event, idx) => (
                <ScrollCard key={idx} {...event} />
              ))}
            </div>
          </div>

          {/* Non-Tech Events */}
          <div className="space-y-12">
            <div className="flex items-center gap-8 mb-16">
              <div className="h-[2px] w-16 bg-secondary/60" />
              <h3 className="text-4xl md:text-5xl font-headline text-secondary tracking-widest">Creative Realms</h3>
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