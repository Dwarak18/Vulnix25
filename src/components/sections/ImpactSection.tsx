'use client';
import React from 'react';
import { motion } from 'framer-motion';
import AnimatedCounter from '../common/AnimatedCounter';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Award, ClipboardList, Clock, Layers, Users } from 'lucide-react';
import AnimatedGridPattern from '../common/AnimatedGridPattern';

const ImpactSection = () => {
    
    const stats = [
        { icon: <Users className="h-8 w-8" />, value: 250, label: 'Total Registrations' },
        { icon: <Layers className="h-8 w-8" />, value: 80, label: 'Teams Participated' },
        { icon: <Clock className="h-8 w-8" />, value: 8, label: 'Hours of Competition' },
        { icon: <Award className="h-8 w-8" />, value: 10000, label: 'Prize Pool (INR)', isCurrency: true },
        { icon: <ClipboardList className="h-8 w-8" />, value: 200, label: 'Certificates Issued' },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
          },
        },
      };
    
      const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
          transition: {
            type: 'spring',
            stiffness: 100,
          },
        },
      };

  return (
    <section className="relative py-24 sm:py-32 bg-background/50 overflow-hidden">
        <AnimatedGridPattern
            numSquares={30}
            maxOpacity={0.1}
            duration={3}
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
            The Impact of VULNIX'25
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            By the numbers: a testament to the symposium's scale, engagement, and success.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="bg-card/50 backdrop-blur-sm border-border text-center h-full">
                <CardHeader>
                  <div className="text-primary mx-auto mb-2">{stat.icon}</div>
                  <CardTitle className="font-heading text-4xl">
                    {stat.isCurrency && '₹'}
                    <AnimatedCounter to={stat.value} />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ImpactSection;
