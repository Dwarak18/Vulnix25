'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';
import AnimatedGridPattern from '../common/AnimatedGridPattern';

const BrainstormXSection = () => {
  return (
    <section id="brainstormx" className="relative py-24 sm:py-32 overflow-hidden text-center bg-background">
       <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className="absolute inset-0"
      />
      <div className="container relative z-10">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
        >
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
                From VULNIX to BrainstormX
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Building on the momentum of VULNIX’25, BrainstormX continues the journey on March 3 & 4 with deeper technical challenges and immersive experiences.
            </p>
            <Button size="lg">
                Explore BrainstormX <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
        </motion.div>
      </div>
    </section>
  )
}

export default BrainstormXSection
