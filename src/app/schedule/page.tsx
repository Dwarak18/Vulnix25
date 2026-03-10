
"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { ThreeScene } from '@/components/ThreeScene';
import { BackgroundRunes } from '@/components/BackgroundRunes';
import { Toaster } from '@/components/ui/toaster';
import { Clock, Sword, Flame, Scroll, Sparkles, Trophy, BookOpen, Coffee, Utensils, Zap } from 'lucide-react';

const SCHEDULE_DATA = [
  { time: "8:00 – 9:00", title: "Arrival & Inscription", subtitle: "Registration", icon: <Scroll size={20} /> },
  { time: "9:00 – 10:00", title: "Inaugural Ceremony", subtitle: "Opening the Sanctuary Gates", icon: <Flame size={20} /> },
  { time: "10:00 – 10:15", title: "Brief Respite", subtitle: "Break", icon: <Coffee size={20} /> },
  { 
    time: "10:15 – 11:00", 
    title: "The Morning Sagas", 
    events: ["Paper Presentation", "Startup / Project Expo", "Fireless Cooking"],
    icon: <BookOpen size={20} />
  },
  { 
    time: "11:00 – 11:45", 
    title: "Trials of Vision", 
    events: ["Prompt Engineering Challenge", "Photography Contest", "Short Film"],
    icon: <Sparkles size={20} />
  },
  { 
    time: "11:45 – 12:30", 
    title: "Digital Weaving", 
    events: ["Website Prompt Challenge", "Trial of Strategy (Chess/Carrom/Ludo)"],
    icon: <Zap size={20} />
  },
  { 
    time: "12:30 – 1:15", 
    title: "Shadow Debugging", 
    events: ["Debugging Challenge", "Guess the Song", "Trial of Strategy Continued"],
    icon: <Sword size={20} />
  },
  { time: "1:15 – 2:00", title: "Tribute of Sustenance", subtitle: "Lunch Break", icon: <Utensils size={20} /> },
  { time: "2:00 – 3:00", title: "Ascension Ceremony", subtitle: "Conclusion & Awards", icon: <Trophy size={20} /> },
];

const TimelineItem = ({ data, index, isSpecial = false }: { data: any, index: number, isSpecial?: boolean }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className={`relative flex flex-col md:flex-row items-center gap-8 mb-24 w-full ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
    >
      {/* Timeline Node */}
      <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center justify-center z-10">
        <div className={`w-12 h-12 rounded-full border-2 bg-background flex items-center justify-center shadow-gold-glow ${isSpecial ? 'border-primary animate-pulse' : 'border-primary/40'}`}>
          <div className={`w-3 h-3 rounded-full ${isSpecial ? 'bg-primary' : 'bg-primary/40'}`} />
        </div>
      </div>

      {/* Card Content */}
      <div className={`w-full md:w-[45%] ${isSpecial ? 'z-20' : 'z-0'}`}>
        <div className={`stone-tablet p-8 md:p-10 ornate-border group hover:border-primary transition-all duration-500 ${isSpecial ? 'shadow-[0_0_50px_rgba(200,155,60,0.3)] border-primary' : ''}`}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-primary font-headline tracking-widest text-sm flex items-center gap-2">
              <Clock size={16} />
              {data.time}
            </span>
            <div className={`p-2 rounded-sm bg-primary/5 text-primary border border-primary/20`}>
              {data.icon}
            </div>
          </div>
          
          <h3 className={`text-2xl md:text-3xl font-headline tracking-widest mb-2 group-hover:text-primary transition-colors ${isSpecial ? 'gold-glow-text text-primary' : ''}`}>
            {data.title}
          </h3>
          
          {data.subtitle && (
            <p className="text-muted-foreground font-body italic text-lg">{data.subtitle}</p>
          )}

          {data.events && (
            <ul className="mt-4 space-y-2">
              {data.events.map((event: string, i: number) => (
                <li key={i} className="text-muted-foreground font-body flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-2 shrink-0" />
                  {event}
                </li>
              ))}
            </ul>
          )}

          {isSpecial && (
            <div className="mt-6 pt-6 border-t border-primary/20">
              <p className="text-primary font-body italic leading-relaxed">
                "The ultimate test of wit and infiltration. Only the enlightened shall prevail."
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Spacer for Desktop */}
      <div className="hidden md:block w-[45%]" />
    </motion.div>
  );
};

export default function SchedulePage() {
  return (
    <main className="relative min-h-screen bg-background overflow-x-hidden">
      <ThreeScene isPaused={false} />
      <BackgroundRunes isPaused={false} />

      {/* Nav */}
      <nav className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center bg-gradient-to-b from-black to-transparent">
        <a href="/" className="text-2xl font-black text-primary hover:scale-105 transition-transform">VULNIX 2.0</a>
        <div className="flex gap-8 text-xs font-headline tracking-widest text-primary/70">
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
        {/* Central Line */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/0 via-primary/20 to-primary/0 hidden md:block" />

        <div className="flex flex-col items-center">
          {/* CTF HIGHLIGHT - Inserted into the flow */}
          <div className="w-full flex justify-center mb-32 relative z-20">
             <TimelineItem 
               index={0} 
               isSpecial={true}
               data={{
                 time: "9:00 – 2:00",
                 title: "Trial of Exploitation",
                 subtitle: "Capture The Flag (CTF)",
                 icon: <Sword size={24} />,
               }} 
             />
          </div>

          {/* Main Schedule */}
          {SCHEDULE_DATA.map((item, idx) => (
            <TimelineItem key={idx} index={idx + 1} data={item} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 text-center text-muted-foreground text-xs uppercase tracking-widest border-t border-primary/10 bg-black/95 relative z-20">
        <div className="max-w-4xl mx-auto px-4">
          <p className="mb-4 italic">"Time is but a river; your skill is the boat that carries you."</p>
          <p>© VULNIX 2.0 SYMPOSIUM — POWERED BY THE ANCIENT SPIRIT OF INNOVATION</p>
        </div>
      </footer>

      <Toaster />
    </main>
  );
}
