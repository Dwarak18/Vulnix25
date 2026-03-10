"use client"

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

const RUNES = ["智", "勇", "義", "禮", "信", "忠", "孝", "廉", "道", "德", "空", "法"];

interface BackgroundRunesProps {
  isPaused?: boolean;
}

export const BackgroundRunes: React.FC<BackgroundRunesProps> = ({ isPaused }) => {
  const [mounted, setMounted] = useState(false);
  const [runeInstances, setRuneInstances] = useState<any[]>([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    setMounted(true);
    // Further reduced rune count for mobile
    const count = isMobile ? 4 : 8;
    const instances = Array.from({ length: count }).map((_, i) => ({
      id: i,
      char: RUNES[Math.floor(Math.random() * RUNES.length)],
      left: Math.random() * 90 + 5,
      top: Math.random() * 90 + 5,
      size: isMobile ? (Math.random() * 2 + 1.5) : (Math.random() * 4 + 2),
      duration: isMobile ? (30 + Math.random() * 20) : (25 + Math.random() * 15),
      delay: Math.random() * 5,
      xOffset: Math.random() * 40 - 20,
      yOffset: Math.random() * -80 - 40,
    }));
    setRuneInstances(instances);
  }, [isMobile]);

  if (!mounted || isPaused) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-15]">
      {runeInstances.map((rune) => (
        <motion.div
          key={rune.id}
          className="absolute text-primary/5 select-none font-headline"
          style={{
            left: `${rune.left}%`,
            top: `${rune.top}%`,
            fontSize: `${rune.size}rem`,
            filter: 'blur(3px)',
            willChange: 'transform, opacity',
            transform: 'translate3d(0,0,0)'
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: [0, 0.08, 0.08, 0],
            y: [0, rune.yOffset],
            x: [0, rune.xOffset],
            scale: [0.5, 1, 0.5],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: rune.duration,
            repeat: Infinity,
            delay: rune.delay,
            ease: "easeInOut",
          }}
        >
          {rune.char}
        </motion.div>
      ))}
    </div>
  );
};