'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import images from '@/lib/placeholder-images.json';
import AnimatedGridPattern from '../common/AnimatedGridPattern';

const GallerySection = () => {
  const [[index, direction], setIndex] = useState([0, 0]);
  const [fullscreenImage, setFullscreenImage] = useState<{src: string; alt: string} | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalImages = images.length;

  const paginate = (newDirection: number) => {
    setIndex([(index + newDirection + totalImages) % totalImages, newDirection]);
  };

  const nextImage = () => {
    paginate(1);
  };
  
  const prevImage = () => {
    paginate(-1);
  };
  
  const currentImage = images[index];


  const startAutoRotate = () => {
    stopAutoRotate(); // Ensure no multiple intervals are running
    intervalRef.current = setInterval(() => {
      paginate(1);
    }, 4000);
  };

  const stopAutoRotate = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    startAutoRotate();
    return () => stopAutoRotate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInteraction = (action: () => void) => {
    stopAutoRotate();
    action();
    startAutoRotate();
  };

  const variants = {
    enter: (direction: number) => ({
      rotateY: direction > 0 ? 90 : -90,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      rotateY: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      rotateY: direction < 0 ? 90 : -90,
      opacity: 0,
    }),
  };


  return (
    <section id="gallery" className="relative py-24 sm:py-32 bg-background/70 backdrop-blur-sm overflow-hidden">
      <AnimatedGridPattern
        numSquares={40}
        maxOpacity={0.05}
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
            Moments That Defined VULNIX
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            A glimpse into the energy, innovation, and intensity of VULNIX’25.
          </p>
        </motion.div>

        <div 
          className="relative h-[300px] md:h-[500px] w-full max-w-4xl mx-auto"
          style={{ perspective: '1000px' }}
          onMouseEnter={stopAutoRotate}
          onMouseLeave={startAutoRotate}
        >
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                rotateY: { type: 'spring', stiffness: 100, damping: 20 },
                opacity: { duration: 0.2 },
              }}
              className="absolute w-full h-full"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div 
                className="w-full h-full cursor-pointer group"
                onClick={() => setFullscreenImage({ src: currentImage.src, alt: currentImage.alt })}
              >
                <Image
                  src={currentImage.src}
                  alt={currentImage.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover rounded-lg"
                  data-ai-hint={currentImage.hint}
                  priority={true}
                />
                <div className="absolute inset-0 bg-black/20 rounded-lg group-hover:bg-black/10 transition-colors"></div>
                <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-border/20"></div>
                <div 
                  className="absolute inset-0 rounded-lg"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%)',
                    content: '""',
                  }}
                ></div>
                <div className="absolute inset-0 rounded-lg box-glow opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </motion.div>
          </AnimatePresence>

          <button
            onClick={() => handleInteraction(prevImage)}
            className="absolute top-1/2 -translate-y-1/2 left-0 md:-left-16 z-20 p-2 bg-card/50 rounded-full hover:bg-card transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={() => handleInteraction(nextImage)}
            className="absolute top-1/2 -translate-y-1/2 right-0 md:-right-16 z-20 p-2 bg-card/50 rounded-full hover:bg-card transition-colors"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
      
      <Dialog open={!!fullscreenImage} onOpenChange={() => setFullscreenImage(null)}>
        <DialogContent className="max-w-5xl w-full p-0 bg-transparent border-0">
          <DialogTitle className="sr-only">{fullscreenImage?.alt}</DialogTitle>
          <DialogDescription className="sr-only">A larger view of the image: {fullscreenImage?.alt}</DialogDescription>
          <div className="relative aspect-video">
            {fullscreenImage && (
              <Image src={fullscreenImage.src} alt={fullscreenImage.alt} fill className="object-contain" />
            )}
          </div>
        </DialogContent>
      </Dialog>

    </section>
  );
};

export default GallerySection;
