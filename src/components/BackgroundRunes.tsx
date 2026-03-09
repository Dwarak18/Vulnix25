"use client"

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const RUNES = ["智", "勇", "義", "禮", "信", "忠", "孝", "廉", "道", "德", "空", "法"];

export const BackgroundRunes = () => {
  const [mounted, setMounted] = useState(false);
  const [runeInstances, setRuneInstances] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    // Generate static positions on mount to avoid hydration mismatch
    const instances = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      char: RUNES[Math.floor(Math.random() * RUNES.length)],
      left: Math.random() * 90 + 5,
      top: Math.random() * 90 + 5,
      size: Math.random() * 6 + 3,
      duration: 20 + Math.random() * 20,
      delay: Math.random() * 10,
      xOffset: Math.random() * 60 - 30,
      yOffset: Math.random() * -120 - 60,
    }));
    setRuneInstances(instances);
  }, []);

  if (!mounted) return null;

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
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: [0, 0.15, 0.15, 0],
            y: [0, rune.yOffset],
            x: [0, rune.xOffset],
            scale: [0.5, 1, 0.5],
            rotate: [0, 15, -15, 0],
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
