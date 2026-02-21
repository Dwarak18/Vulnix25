'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Cpu, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AnimatedGridPattern from '../common/AnimatedGridPattern';

const AboutSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  const features = [
    {
      icon: <Cpu className="h-8 w-8 text-primary" />,
      title: 'Industry-Relevant Challenges',
      description: 'Participants tackled real-world scenarios in digital forensics, ethical hacking, and network security.',
    },
    {
      icon: <Target className="h-8 w-8 text-primary" />,
      title: 'Flagship CTF',
      description: 'The FlagRunner 0x7E9 CTF pushed teams to their limits with intricate puzzles and vulnerabilities.',
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-primary" />,
      title: 'Innovation & Research',
      description: 'Students presented groundbreaking ideas and research, contributing to the future of cybersecurity.',
    },
  ];

  return (
    <section id="about" className="relative py-24 sm:py-32 bg-background overflow-hidden">
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.05}
        duration={3}
        repeatDelay={1}
        className="absolute inset-0"
      />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            A Legacy of Cyber Excellence
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            VULNIX'25 successfully concluded as a pioneering cybersecurity symposium by the Department of Cybersecurity at DSCET. It was a nexus for industry-relevant challenges, hands-on competitions, and innovation, setting the stage for future leaders and laying the groundwork for BrainstormX.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid md:grid-cols-3 gap-8 mt-16 max-w-6xl mx-auto"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="bg-card/50 backdrop-blur-sm border-border h-full text-center hover:border-primary/50 transition-colors duration-300">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="font-heading text-2xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
