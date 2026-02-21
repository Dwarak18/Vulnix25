'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import AnimatedGridPattern from '../common/AnimatedGridPattern';
import AnimatedCounter from '../common/AnimatedCounter';
import { Badge } from '../ui/badge';
import { Users, Zap, Award, BarChart } from 'lucide-react';

const HeroSection = () => {
  const handleScroll = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const stats = [
    { value: 80, label: 'Teams', icon: <Users className="h-6 w-6" /> },
    { value: 10, label: 'Events', icon: <Zap className="h-6 w-6" /> },
    { value: 1, label: 'Flagship CTF', icon: <Award className="h-6 w-6" /> },
    { value: 1, label: 'Legacy Built', icon: <BarChart className="h-6 w-6" /> },
  ];

  return (
    <section id="hero" className="relative h-screen flex flex-col items-center justify-center text-center text-foreground overflow-hidden">
      <AnimatedGridPattern
        numSquares={50}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className="absolute inset-0"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/50 to-background z-0"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 p-4 flex flex-col items-center"
      >
        <Badge variant="outline" className="mb-4 bg-primary/10 border-primary/30 text-primary py-1 px-4 text-sm">
          Successfully Concluded
        </Badge>
        <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-black mb-4 text-glow">
          VULNIX'25
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl text-muted-foreground font-light">
          Where Vulnerabilities Met Vision. A look back at the high-impact cybersecurity symposium that united the next generation of security engineers, researchers, and innovators.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" onClick={() => handleScroll('gallery')}>
            View Highlights
          </Button>
          <Button size="lg" variant="outline" onClick={() => handleScroll('events')}>
            Explore Events
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="absolute bottom-0 left-0 right-0 z-10 p-8"
      >
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                 <div className="text-primary">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold font-heading">
                  <AnimatedCounter to={stat.value} />+
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
