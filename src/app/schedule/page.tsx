
"use client"

import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { ThreeScene } from '@/components/ThreeScene';
import { BackgroundRunes } from '@/components/BackgroundRunes';
import { Toaster } from '@/components/ui/toaster';
import { Clock, Sword, Flame, Scroll, Sparkles, Trophy, BookOpen, Coffee, Utensils, Zap, MousePointer2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const SCHEDULE_DATA = [
  { 
    time: "8:00 – 9:00", 
    icon: <Scroll size={20} />,
    events: [{ title: "Arrival & Inscription", subtitle: "Registration & Badge Collection" }] 
  },
  { 
    time: "9:00 – 10:00", 
    icon: <Flame size={20} />,
    isSpecial: true,
    events: [
      { title: "Inaugural Ceremony", subtitle: "Opening the Sanctuary Gates" },
      { title: "Trial of Exploitation", subtitle: "Capture The Flag (9:00 AM - 2:00 PM)", highlight: true }
    ] 
  },
  { 
    time: "10:00 – 10:15", 
    icon: <Coffee size={20} />,
    events: [{ title: "Brief Respite", subtitle: "Morning Tea & Networking" }] 
  },
  { 
    time: "10:15 – 11:00", 
    icon: <BookOpen size={20} />,
    events: [
      { title: "Paper Presentation", subtitle: "Celestial Paper Expo" },
      { title: "Startup Expo", subtitle: "Project & Innovation Showcase" },
      { title: "Fireless Cooking", subtitle: "Alchemy of Taste" }
    ] 
  },
  { 
    time: "11:00 – 11:45", 
    icon: <Sparkles size={20} />,
    events: [
      { title: "Prompt Engineering", subtitle: "Whispering Prompt Challenge" },
      { title: "Photography", subtitle: "The Third Eye Contest" },
      { title: "Short Film", subtitle: "Shadow Sagas Presentation" }
    ] 
  },
  { 
    time: "11:45 – 12:30", 
    icon: <Zap size={20} />,
    events: [
      { title: "Web Weaver Trial", subtitle: "Website Prompt Engineering" },
      { title: "Trial of Strategy", subtitle: "Chess, Carrom & Ludo Arena" }
    ] 
  },
  { 
    time: "12:30 – 1:15", 
    icon: <Sword size={20} />,
    events: [
      { title: "Spirit Debugging", subtitle: "Shadow Debugging Trial" },
      { title: "Musical Trivia", subtitle: "Guess the Song Challenge" },
      { title: "Strategy Continued", subtitle: "Board Game Finals" }
    ] 
  },
  { 
    time: "1:15 – 2:00", 
    icon: <Utensils size={20} />,
    events: [{ title: "Tribute of Sustenance", subtitle: "Grand Lunch Break" }] 
  },
  { 
    time: "2:00 – 3:00", 
    icon: <Trophy size={20} />,
    isSpecial: true,
    events: [{ title: "Ascension Ceremony", subtitle: "Grand Finale & Awards Distribution" }] 
  },
];

const EmberParticle = ({ x, y }: { x: number, y: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0.8, scale: 1, x, y }}
      animate={{ 
        opacity: 0, 
        scale: 0, 
        y: y - 50, 
        x: x + (Math.random() * 40 - 20) 
      }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="absolute w-1 h-1 bg-primary rounded-full pointer-events-none z-50"
    />
  );
};

const ScheduleCard = ({ event, isSpecial }: { event: any, isSpecial?: boolean }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState<{ id: number, x: number, y: number }[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);
  const particleIdCounter = useRef(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    // Emit particles occasionally
    if (Math.random() > 0.85 && particles.length < 15) {
      const id = particleIdCounter.current++;
      setParticles(prev => [...prev, { id, x, y }]);
      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== id));
      }, 1000);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setParticles([]);
      }}
      whileHover={{ 
        y: -8, 
        rotateX: 2, 
        rotateY: -2,
        transition: { duration: 0.4, ease: "easeOut" }
      }}
      className={cn(
        "stone-tablet p-6 md:p-8 ornate-border group relative overflow-hidden transition-all duration-500",
        (isSpecial || event.highlight) ? "border-primary shadow-gold-glow" : "border-primary/20",
        "cursor-pointer"
      )}
      style={{ perspective: "1000px" }}
    >
      {/* Dynamic Cursor Glow */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute pointer-events-none z-0"
            style={{
              left: mousePos.x,
              top: mousePos.y,
              width: '150px',
              height: '150px',
              background: 'radial-gradient(circle, rgba(200, 155, 60, 0.15) 0%, transparent 70%)',
              transform: 'translate(-50%, -50%)',
              filter: 'blur(20px)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Hover Particles */}
      {particles.map(p => (
        <EmberParticle key={p.id} x={p.x} y={p.y} />
      ))}

      <div className="relative z-10">
        <h4 className={cn(
          "text-xl md:text-2xl font-headline tracking-widest mb-2 transition-colors",
          (isSpecial || event.highlight) ? "gold-glow-text text-primary" : "group-hover:text-primary"
        )}>
          {event.title}
        </h4>
        <p className="text-muted-foreground font-body italic text-sm md:text-base leading-relaxed">
          {event.subtitle}
        </p>
        
        {(isSpecial || event.highlight) && (
          <div className="mt-4 pt-4 border-t border-primary/20 flex items-center gap-2">
            <Sparkles size={14} className="text-primary animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-primary/70 font-headline">Supreme Trial</span>
          </div>
        )}
      </div>

      {/* Background Rune Watermark */}
      <div className="absolute -bottom-4 -right-4 text-primary/5 text-6xl font-headline select-none pointer-events-none">
        道
      </div>
    </motion.div>
  );
};

const TimelineBlock = ({ item, index }: { item: any, index: number }) => {
  return (
    <div className="relative flex flex-col md:flex-row gap-8 mb-24 w-full">
      {/* Time & Marker */}
      <div className="w-full md:w-48 flex flex-row md:flex-col items-center md:items-end gap-4 shrink-0">
        <div className="text-primary font-headline tracking-widest text-sm md:text-right">
          {item.time}
        </div>
        <div className={cn(
          "w-10 h-10 rounded-full border-2 bg-background flex items-center justify-center relative z-20 shadow-gold-glow transition-transform duration-500 group-hover:scale-110",
          item.isSpecial ? "border-primary" : "border-primary/40"
        )}>
          <div className={cn("w-2 h-2 rounded-full", item.isSpecial ? "bg-primary animate-pulse" : "bg-primary/40")} />
          
          {/* Vertical Line Segment */}
          <div className="absolute top-10 w-px h-24 bg-gradient-to-b from-primary/40 to-transparent hidden md:block" />
        </div>
        <div className="p-2 rounded-sm bg-primary/5 text-primary border border-primary/20 md:mt-2">
          {item.icon}
        </div>
      </div>

      {/* Events Grid */}
      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {item.events.map((event: any, idx: number) => (
          <ScheduleCard key={idx} event={event} isSpecial={item.isSpecial} />
        ))}
      </div>
    </div>
  );
};

export default function SchedulePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <main className="relative min-h-screen bg-background overflow-x-hidden" ref={containerRef}>
      <ThreeScene isPaused={false} />
      <BackgroundRunes isPaused={false} />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center bg-gradient-to-b from-black to-transparent pointer-events-none">
        <a href="/" className="text-2xl font-black text-primary hover:scale-105 transition-transform pointer-events-auto">VULNIX 2.0</a>
        <div className="flex gap-8 text-xs font-headline tracking-widest text-primary/70 pointer-events-auto">
          <a href="/" className="hover:text-primary transition-colors">BACK TO SANCTUARY</a>
        </div>
      </nav>

      {/* Header */}
      <section className="relative pt-48 pb-24 px-4 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent mb-8 mx-auto" />
          <h1 className="text-5xl md:text-8xl text-primary font-headline tracking-[0.2em] uppercase gold-glow-text mb-6">
            Chronicle of the Trials
          </h1>
          <p className="text-muted-foreground text-xl md:text-2xl font-body italic tracking-widest uppercase">
            VULNIX 2.0 Event Schedule
          </p>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent mt-8 mx-auto" />
        </motion.div>
      </section>

      {/* Timeline Section */}
      <section className="relative py-24 px-4 max-w-7xl mx-auto">
        {/* Animated Central Timeline Line */}
        <div className="absolute left-[44px] md:left-[192px] top-0 bottom-0 w-[2px] bg-primary/10 hidden sm:block">
          <motion.div 
            className="w-full bg-primary shadow-gold-glow"
            style={{ 
              scaleY, 
              originY: 0,
              height: '100%'
            }} 
          />
        </div>

        <div className="flex flex-col relative z-10">
          {SCHEDULE_DATA.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
            >
              <TimelineBlock item={item} index={idx} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bottom Proverb */}
      <section className="py-32 text-center relative z-20 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="max-w-4xl mx-auto px-4"
        >
          <div className="h-px w-16 bg-primary/20 mx-auto mb-12" />
          <p className="text-2xl md:text-4xl text-primary font-headline italic tracking-[0.2em] leading-relaxed gold-glow-text">
            "Every second is a grain of sand in the hourglass of destiny. Use yours wisely."
          </p>
          <div className="h-px w-16 bg-primary/20 mx-auto mt-12" />
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-muted-foreground text-xs uppercase tracking-widest border-t border-primary/10 bg-black/95 relative z-20">
        <div className="max-w-4xl mx-auto px-4">
          <p>© VULNIX 2.0 SYMPOSIUM — POWERED BY THE ANCIENT SPIRIT OF INNOVATION</p>
        </div>
      </footer>

      <Toaster />
    </main>
  );
}

