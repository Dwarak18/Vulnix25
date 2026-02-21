'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { getSortedEvents, type Event } from '@/constants/events';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import AnimatedGridPattern from '../common/AnimatedGridPattern';

const TimelineEvent = ({ event, index }: { event: Event; index: number }) => {
  const isEven = index % 2 === 0;

  const cardVariants = {
    hidden: { opacity: 0, x: isEven ? -50 : 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="relative pl-8 md:pl-0"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      variants={cardVariants}
    >
      <div className={cn("md:flex items-center w-full", isEven ? "md:flex-row-reverse" : "")}>
        <div className="md:w-1/2"></div>
        <div className="md:w-1/2">
          <Card className="bg-card/50 backdrop-blur-sm shadow-lg border border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-1">
                <CardTitle className="font-heading text-lg font-semibold">{event.name}</CardTitle>
                <Badge variant={event.type === 'Technical' ? 'default' : 'secondary'} className="text-xs ml-2 shrink-0">{event.type}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-xs text-primary font-mono">
                <Clock className="h-3 w-3 mr-1.5" />
                <span>{event.time}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-primary box-glow z-20 left-8 md:left-1/2 -ml-2 transform md:-translate-x-1/2">
         <div className="absolute inset-0 rounded-full bg-primary/50 animate-ping"></div>
      </div>
    </motion.div>
  );
};

const TimelineSection = () => {
  const sortedEvents = getSortedEvents();

  return (
    <section
      id="timeline"
      className="relative py-24 sm:py-32 bg-background overflow-hidden"
    >
       <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.05}
        duration={3}
        repeatDelay={1}
        className="absolute inset-0"
      />
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
        >
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-center mb-4">Event Flow</h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            A chronological look at how the day of intense competition and learning unfolded.
          </p>
        </motion.div>
        
        <div className="relative flex flex-col gap-12">
          {/* Vertical Line */}
          <div className="absolute left-8 top-0 h-full w-0.5 bg-border md:left-1/2 md:-translate-x-1/2 z-0"></div>

          {sortedEvents.map((event, index) => (
            <TimelineEvent key={event.id} event={event} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
