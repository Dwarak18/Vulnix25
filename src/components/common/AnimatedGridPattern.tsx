'use client';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedGridPatternProps {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  strokeDasharray?: any;
  numSquares?: number;
  className?: string;
  maxOpacity?: number;
  duration?: number;
  repeatDelay?: number;
}

export function GridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeDasharray = 0,
  numSquares = 50,
  className,
  maxOpacity = 0.5,
  duration = 4,
  repeatDelay = 1,
  ...props
}: AnimatedGridPatternProps) {
  const id = useMemo(() => Math.random().toString(36).substring(7), []);

  const squares = useMemo(() => {
    return Array.from({ length: numSquares }).map((_, i) => {
      const col = Math.floor(Math.random() * (width / 10));
      const row = Math.floor(Math.random() * (height / 10));
      return {
        x: col * 10,
        y: row * 10,
        key: `${col}-${row}-${i}`,
      };
    });
  }, [numSquares, width, height]);

  return (
    <svg
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2',
        className,
      )}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            strokeDasharray={strokeDasharray}
            className="stroke-border/50"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
      <svg x={x} y={y} className="overflow-visible">
        {squares.map(({ x, y, key }) => (
          <motion.rect
            key={key}
            width="10"
            height="10"
            x={x}
            y={y}
            fill="hsl(var(--primary))"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, maxOpacity, 0],
              transition: {
                duration: duration,
                repeat: Infinity,
                delay: Math.random() * duration,
                repeatType: 'loop',
                repeatDelay: repeatDelay,
              },
            }}
          />
        ))}
      </svg>
    </svg>
  );
}

export default GridPattern;
