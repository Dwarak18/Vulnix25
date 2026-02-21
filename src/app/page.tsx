
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import EventsSection from '@/components/sections/EventsSection';
import TimelineSection from '@/components/sections/TimelineSection';
import Footer from '@/components/sections/Footer';
import ImpactSection from '@/components/sections/ImpactSection';
import GallerySection from '@/components/sections/GallerySection';
import BrainstormXSection from '@/components/sections/BrainstormXSection';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background overflow-x-hidden">
      <HeroSection />
      <AboutSection />
      <ImpactSection />
      <EventsSection />
      <GallerySection />
      <TimelineSection />
      <BrainstormXSection />
      <Footer />
    </div>
  );
}
