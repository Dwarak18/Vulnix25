
'use client';

import React, { useState, useEffect, type FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import AnimatedGridPattern from './AnimatedGridPattern';

interface LoadingScreenProps {
  onLoaded: () => void;
  duration?: number;
}

const LoadingScreen: FC<LoadingScreenProps> = ({ onLoaded, duration = 3000 }) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const intervalTime = duration / 100;
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsVisible(false);
            setTimeout(onLoaded, 500); // Allow fade-out animation to complete
          }, 500);
          return 100;
        }
        return Math.min(prev + 1, 100);
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [duration, onLoaded]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
        >
          <AnimatedGridPattern
            numSquares={30}
            maxOpacity={0.1}
            duration={3}
            repeatDelay={1}
            className="absolute inset-0"
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative z-10 w-full max-w-md p-8 text-center"
          >
            <h1 className="font-heading text-5xl font-bold text-primary text-glow mb-4">VULNIX'25</h1>
            <div className="w-full h-1 bg-border rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: 'linear' }}
              />
            </div>
            <p className="mt-4 text-sm font-mono text-muted-foreground">
              DECRYPTING THE ARCHIVES... {Math.round(progress)}%
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
