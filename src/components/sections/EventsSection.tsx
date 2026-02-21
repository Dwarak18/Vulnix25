'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { eventsData } from '@/constants/events';
import EventCard from './EventCard';
import { BrainCircuit, Gamepad2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnimatedGridPattern from '../common/AnimatedGridPattern';

const EventsSection = () => {
  const technicalEvents = eventsData.filter(event => event.type === 'Technical');
  const nonTechnicalEvents = eventsData.filter(event => event.type === 'Non-Technical');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <section
      id="events"
      className="relative py-24 sm:py-32 bg-background/70 backdrop-blur-sm overflow-hidden"
    >
       <AnimatedGridPattern
        numSquares={40}
        maxOpacity={0.1}
        duration={4}
        repeatDelay={1}
        className="absolute inset-0"
      />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            A Recap of the Challenges
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Ten events across technical and non-technical domains tested the skills and creativity of every participant.
          </p>
        </motion.div>

        <Tabs defaultValue="technical" className="w-full max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 bg-card/80 border border-border backdrop-blur-lg mb-12">
            <TabsTrigger value="technical" className="rounded-none data-[state=active]:shadow-none data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-base py-2">
              <BrainCircuit className="mr-2 h-5 w-5"/> Technical
            </TabsTrigger>
            <TabsTrigger value="non-technical" className="rounded-none data-[state=active]:shadow-none data-[state=active]:bg-secondary/20 data-[state=active]:text-secondary text-base py-2">
              <Gamepad2 className="mr-2 h-5 w-5"/> Non-Technical
            </TabsTrigger>
          </TabsList>
          <TabsContent value="technical">
             <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {technicalEvents.map((event, i) => (
                  <EventCard key={event.id} event={event} index={i}/>
                ))}
             </motion.div>
          </TabsContent>
          <TabsContent value="non-technical">
             <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
              >
                {nonTechnicalEvents.map((event, i) => (
                  <EventCard key={event.id} event={event} index={i} />
                ))}
             </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default EventsSection;
