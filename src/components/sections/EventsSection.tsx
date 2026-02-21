'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { eventsData } from '@/constants/events';
import EventCard from './EventCard';
import { BrainCircuit, Gamepad2 } from 'lucide-react';
import AnimatedGridPattern from '../common/AnimatedGridPattern';
import { cn } from '@/lib/utils';

const EventsSection = () => {
  const [activeTab, setActiveTab] = useState('technical');
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
  
  const TABS = [
      { id: 'technical', label: 'Technical', Icon: BrainCircuit },
      { id: 'non-technical', label: 'Non-Technical', Icon: Gamepad2 },
  ];

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

        <div className="w-full max-w-xs mx-auto mb-12">
            <div className="relative flex w-full p-1 bg-card/80 border border-border backdrop-blur-lg rounded-full">
                <motion.div
                    className="absolute top-1 left-1 h-[calc(100%-8px)] w-1/2 bg-primary rounded-full z-0"
                    layout
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    animate={{ x: activeTab === 'technical' ? '0%' : '100%' }}
                />
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            'relative z-10 flex-1 flex items-center justify-center text-base py-2 rounded-full transition-colors duration-300',
                            activeTab === tab.id ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                        )}
                        style={{ WebkitTapHighlightColor: "transparent" }}
                    >
                        <tab.Icon className="mr-2 h-5 w-5" />
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
        
        <div>
          {activeTab === 'technical' ? (
             <motion.div
                key="technical"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {technicalEvents.map((event, i) => (
                  <EventCard key={event.id} event={event} index={i}/>
                ))}
             </motion.div>
          ) : (
             <motion.div
                key="non-technical"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
              >
                {nonTechnicalEvents.map((event, i) => (
                  <EventCard key={event.id} event={event} index={i} />
                ))}
             </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;