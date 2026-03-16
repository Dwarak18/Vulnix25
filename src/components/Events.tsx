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
    desc: "Ancient board games and sharp wit: Chess, Carrom, and Meme Creation.",
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
      className="relative flex flex-col items-center group mb-12 md:mb-16 perspective-1000 w-full"
    >
      {/* Top Roller - Bronze/Gold Metallic */}
      <div className="w-full h-6 md:h-8 scroll-roller rounded-full z-20 flex items-center justify-between px-4 md:px-6 border-b border-white/5 relative">
        <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-black/60 border border-primary/40 shadow-inner" />
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-black/60 border border-primary/40 shadow-inner" />
      </div>

      {/* Parchment Body */}
      <div className="w-[98%] sm:w-[96%] parchment-texture border-x-4 md:border-x-8 border-accent/30 overflow-hidden shadow-2xl transition-all duration-700 group-hover:shadow-[0_0_40px_rgba(200,155,60,0.15)] group-hover:brightness-110 relative">
        <motion.div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ 
            backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")',
            y: bgY
          }}
        />
        
        <div className="parchment-edge-burn" />

        {/* Pulsing Mythic Watermark */}
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0"
          animate={{ 
            opacity: [0.02, 0.08, 0.02],
            scale: [1.2, 1.4, 1.2]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ 
            fontSize: 'clamp(8rem, 20vw, 18rem)',
            fontFamily: 'var(--font-headline)',
            color: accentColor,
            filter: 'blur(8px)',
            lineHeight: 1,
            willChange: 'opacity, transform'
          }}
        >
          {color === 'primary' ? '智' : '藝'}
        </motion.div>

        <div className="p-6 sm:p-8 md:p-12 space-y-6 md:space-y-8 relative z-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-8 text-center sm:text-left">
            <div 
              className="p-3 sm:p-5 rounded-sm border shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:shadow-primary/20 shrink-0"
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
              className="text-2xl sm:text-3xl md:text-4xl font-headline tracking-widest uppercase transition-all duration-500 group-hover:text-primary drop-shadow-md break-words" 
              style={{ color: color === 'primary' ? undefined : accentColor }}
            >
              {title}
            </h4>
          </div>
          <p 
            className="text-white/80 font-body text-base sm:text-lg md:text-xl leading-relaxed italic border-l-2 sm:border-l-4 pl-4 sm:pl-8 drop-shadow-sm text-center sm:text-left" 
            style={{ borderColor: `${accentColor}40` }}
          >
            {desc}
          </p>
        </div>
        
        <div className="absolute bottom-4 right-4 opacity-5 group-hover:opacity-15 transition-opacity pointer-events-none scale-100 sm:scale-150">
          {icon}
        </div>
      </div>

      {/* Bottom Roller */}
      <div className="w-full h-6 md:h-8 scroll-roller rounded-full z-20 flex items-center justify-between px-4 md:px-6 border-t border-black/40 relative">
        <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-black/60 border border-primary/40 shadow-inner" />
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-black/60 border border-primary/40 shadow-inner" />
      </div>

      <div className="absolute -inset-4 bg-primary/5 rounded-xl blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
    </motion.div>
  );
};

export const Events: React.FC = () => {
  return (
    <section id="events" className="py-24 md:py-48 px-4 relative overflow-hidden">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center mb-20 md:mb-32">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            className="inline-block p-4 md:p-6 bg-primary/5 rounded-full mb-6 md:mb-8 border border-primary/20 shadow-gold-glow"
          >
             <Scroll className="text-primary animate-pulse" size={40} />
          </motion.div>
          <h2 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl mb-6 md:mb-8 text-primary font-headline tracking-tighter gold-glow-text uppercase">The Great Trials</h2>
          <p className="text-muted-foreground text-lg sm:text-xl md:text-3xl font-body italic max-w-4xl mx-auto opacity-80 leading-relaxed px-4">
            "Each scroll contains a trial. Unfurl your destiny and face the Sage's wisdom."
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-32">
          {/* Tech Events */}
          <div className="space-y-12 md:space-y-16">
            <div className="flex items-center gap-6 md:gap-10 mb-12 md:mb-20">
              <div className="h-[2px] flex-grow bg-gradient-to-r from-transparent to-primary/60" />
              <h3 className="text-3xl sm:text-5xl md:text-6xl font-headline text-primary tracking-widest whitespace-nowrap uppercase">Technical Sagas</h3>
              <div className="h-[2px] w-12 md:w-24 bg-primary/60" />
            </div>
            <div className="flex flex-col gap-8">
              {TECH_EVENTS.map((event, idx) => (
                <ScrollCard key={idx} {...event} />
              ))}
            </div>
          </div>

          {/* Non-Tech Events */}
          <div className="space-y-12 md:space-y-16">
            <div className="flex items-center gap-6 md:gap-10 mb-12 md:mb-20">
              <div className="h-[2px] w-12 md:w-24 bg-secondary/60" />
              <h3 className="text-3xl sm:text-5xl md:text-6xl font-headline text-secondary tracking-widest whitespace-nowrap uppercase">Creative Realms</h3>
              <div className="h-[2px] flex-grow bg-gradient-to-l from-transparent to-secondary/60" />
            </div>
            <div className="flex flex-col gap-8">
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
