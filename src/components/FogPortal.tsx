"use client"

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FogPortalProps {
  isVisible: boolean;
}

export const FogPortal: React.FC<FogPortalProps> = ({ isVisible }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background pointer-events-auto overflow-hidden"
          style={{ willChange: 'opacity' }}
        >
          {/* Base Dark Overlay */}
          <div className="absolute inset-0 bg-black/90" />
          
          {/* Optimized Swirling Fog Layers (Only 2 layers as requested) */}
          <motion.div
            className="absolute w-[200%] h-[200%] bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-full blur-[120px]"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ 
              top: '-50%', 
              left: '-50%',
              willChange: 'transform',
              transform: 'translate3d(0,0,0)'
            }}
          />
          <motion.div
            className="absolute w-[180%] h-[180%] bg-gradient-to-l from-primary/10 via-primary/5 to-transparent rounded-full blur-[140px]"
            animate={{
              rotate: [360, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ 
              bottom: '-40%', 
              right: '-40%',
              willChange: 'transform',
              transform: 'translate3d(0,0,0)'
            }}
          />

          {/* Central Ancient Rune (道 - The Way) */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotateY: 90 }}
            animate={{ scale: 1, opacity: 0.1, rotateY: 0 }}
            exit={{ scale: 1.5, opacity: 0, filter: "blur(20px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-primary font-headline text-[35vw] select-none pointer-events-none absolute"
            style={{ willChange: 'transform, opacity' }}
          >
            道
          </motion.div>

          {/* Loading Message */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative z-10 flex flex-col items-center gap-6"
            style={{ willChange: 'transform, opacity' }}
          >
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent" />
            <span className="text-primary font-headline text-2xl tracking-[0.6em] uppercase gold-glow-text text-center">
              Entering the Sanctuary
            </span>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent" />
          </motion.div>

          {/* Optimized Particle Embers (Limited to 40) */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(40)].map((_, i) => (
              <motion.div
                key={`ember-${i}`}
                className="absolute w-1 h-1 bg-primary rounded-full"
                initial={{ 
                  x: Math.random() * 100 + "%", 
                  y: "110%",
                  opacity: 0 
                }}
                animate={{ 
                  y: "-10%",
                  opacity: [0, 0.8, 0],
                  x: (Math.random() * 100) + (Math.random() * 10 - 5) + "%"
                }}
                transition={{
                  duration: 1.5 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 1,
                  ease: "linear"
                }}
                style={{ 
                  willChange: 'transform, opacity',
                  transform: 'translate3d(0,0,0)'
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
