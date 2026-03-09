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
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background pointer-events-auto"
        >
          {/* Base Dark Overlay */}
          <motion.div 
            className="absolute inset-0 bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
          
          {/* Swirling Mythical Fog Layers */}
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-[180%] h-[180%] bg-gradient-to-r from-primary/5 via-primary/10 to-transparent rounded-full blur-[140px]"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.15, 0.95, 1],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 12 + i * 2,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                top: `${Math.random() * 40 - 20}%`,
                left: `${Math.random() * 40 - 20}%`,
              }}
            />
          ))}

          {/* Central Ancient Rune (道 - The Way) */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotateY: 90 }}
            animate={{ scale: 1, opacity: 0.15, rotateY: 0 }}
            exit={{ scale: 2, opacity: 0, filter: "blur(20px)" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="text-primary font-headline text-[30vw] select-none pointer-events-none absolute"
          >
            道
          </motion.div>

          {/* Loading Message */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative z-10 flex flex-col items-center gap-6"
          >
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-primary to-transparent" />
            <span className="text-primary font-headline text-3xl tracking-[0.8em] uppercase gold-glow-text">
              Entering the Sanctuary
            </span>
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-primary to-transparent" />
          </motion.div>

          {/* Particle Embers in transition */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={`ember-${i}`}
                className="absolute w-1 h-1 bg-primary rounded-full shadow-[0_0_10px_white]"
                initial={{ 
                  x: Math.random() * 100 + "%", 
                  y: "110%",
                  opacity: 0 
                }}
                animate={{ 
                  y: "-10%",
                  opacity: [0, 1, 0],
                  x: (Math.random() * 100) + (Math.random() * 20 - 10) + "%"
                }}
                transition={{
                  duration: 2 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};