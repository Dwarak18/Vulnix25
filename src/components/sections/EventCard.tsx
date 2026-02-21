'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { Event } from '@/constants/events';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EventCardProps {
  event: Event;
  index: number;
}

const EventCard: React.FC<EventCardProps> = ({ event, index }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      className="h-full"
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
    >
      <Card
        className={cn(
          "h-full bg-card/50 backdrop-blur-sm border-2 border-transparent transition-all duration-300 overflow-hidden group hover:border-primary/80 hover:box-glow",
          event.type === 'Technical' ? "hover:border-primary/80" : "hover:border-secondary/80"
        )}
      >
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="font-heading text-xl lg:text-2xl">{event.name}</CardTitle>
            <Badge variant={event.type === 'Technical' ? 'default' : 'secondary'} className="shrink-0">
              {event.type}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col h-full">
          <CardDescription className="text-muted-foreground mb-4">{event.description}</CardDescription>
          <div className="mt-auto flex justify-between items-center text-xs text-muted-foreground pt-4 border-t border-border/50">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Completed Successfully</span>
            </div>
            <span>{event.time}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EventCard;
