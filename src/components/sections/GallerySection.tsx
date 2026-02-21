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

  const totalImages = Array.isArray(images) ? images.length : 0;

  const paginate = (newDirection: number) => {
    if (totalImages === 0) return;
    setIndex([(index + newDirection + totalImages) % totalImages, newDirection]);
  };

  const nextImage = () => paginate(1);
  const prevImage = () => paginate(-1);

  const startAutoRotate = () => {
    if (totalImages <= 1) return;
    stopAutoRotate();
    intervalRef.current = setInterval(() => paginate(1), 4000);
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
  }, [totalImages]);

  const handleInteraction = (action: () => void) => {
    stopAutoRotate();
    action();
    startAutoRotate();
  };

  const sideImagesToShow = 2; // Number of images to show on each side of the main image

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

        {totalImages > 0 ? (
          <div 
            className="relative h-[300px] md:h-[500px] w-full max-w-5xl mx-auto flex items-center justify-center"
            onMouseEnter={stopAutoRotate}
            onMouseLeave={startAutoRotate}
          >
            {Array.from({ length: sideImagesToShow * 2 + 1 }).map((_, i) => {
              const offset = i - sideImagesToShow;
              const imageIndex = (index + offset + totalImages) % totalImages;
              
              if (!images[imageIndex]) return null;

              const distance = Math.abs(offset);
              const isInFocus = offset === 0;

              const xPercentage = offset * 40 - (isInFocus ? 0 : offset > 0 ? 10 : -10);
              const scale = isInFocus ? 1 : 0.7;
              const opacity = isInFocus ? 1 : 0.3;
              const zIndex = sideImagesToShow - distance;

              return (
                <motion.div
                  key={imageIndex + offset}
                  className="absolute w-[65%] h-[85%]"
                  initial={false}
                  animate={{
                    x: `${xPercentage}%`,
                    scale,
                    opacity,
                    zIndex,
                  }}
                  transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                  onClick={() => {
                    if (isInFocus) {
                      setFullscreenImage({ src: images[imageIndex].src, alt: images[imageIndex].alt });
                    } else {
                      handleInteraction(() => paginate(offset));
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="relative w-full h-full group">
                    <Image
                      src={images[imageIndex].src}
                      alt={images[imageIndex].alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover rounded-lg"
                      data-ai-hint={images[imageIndex].hint}
                      priority={isInFocus}
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-lg group-hover:bg-black/20 transition-colors" style={{ opacity: isInFocus ? 0 : 0.5 }}></div>
                    <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-border/20"></div>
                     {isInFocus && <div className="absolute inset-0 rounded-lg box-glow opacity-0 group-hover:opacity-100 transition-opacity"></div>}
                  </div>
                </motion.div>
              );
            })}

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
        ) : (
          <div className="relative h-[300px] md:h-[500px] w-full max-w-4xl mx-auto flex items-center justify-center bg-card/20 rounded-lg border border-dashed border-border">
            <p className="text-muted-foreground text-center">
              Gallery images not found.
              <br />
              Please add images to <code className="bg-muted px-1.5 py-1 rounded-sm text-xs">public/gallery</code> and run <code className="bg-muted px-1.5 py-1 rounded-sm text-xs">npm run rename:gallery</code>.
            </p>
          </div>
        )}
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
