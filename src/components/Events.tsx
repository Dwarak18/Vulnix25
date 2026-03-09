import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Shield, Brain, Globe, Flag, Terminal, Music, Camera, Film, Utensils, Dice5, Scroll } from 'lucide-react';

const TECH_EVENTS = [
  {
    title: "Celestial Paper Expo",
    desc: "Present your most visionary research. Evaluated on the enlightenment of your concepts.",
    icon: <Globe size={28} />
  },
  {
    title: "Whispering Prompt",
    desc: "Command the spirits of AI with precision. The most effective incantation wins.",
    icon: <Brain size={28} />
  },
  {
    title: "Web Weaver Trial",
    desc: "Construct digital realms using nothing but your words and prompt-based wisdom.",
    icon: <Terminal size={28} />
  },
  {
    title: "Golden CTF",
    desc: "The ultimate trial of infiltration. Solve puzzles of shadow and light.",
    icon: <Flag size={28} />
  },
  {
    title: "Spirit Debugging",
    desc: "Identify the corruption in the code and purify it before the incense burns out.",
    icon: <Shield size={28} />
  }
];

const NON_TECH_EVENTS = [
  {
    title: "Melody of the Sage",
    desc: "Identify the ancient tunes from mere echoes in this musical trivia challenge.",
    icon: <Music size={28} />
  },
  {
    title: "The Third Eye",
    desc: "Capture the essence of the world through your lens. Perspective is everything.",
    icon: <Camera size={28} />
  },
  {
    title: "Shadow Sagas",
    desc: "Short film presentations demonstrating storytelling and visual mastery.",
    icon: <Film size={28} />
  },
  {
    title: "Alchemy of Taste",
    desc: "Prepare divine sustenance without the use of fire. True elemental control.",
    icon: <Utensils size={28} />
  },
  {
    title: "Trial of Strategy",
    desc: "Ancient board games: Chess, Carrom, and Ludo. Test your tactical mind.",
    icon: <Dice5 size={28} />
  }
];

export const Events: React.FC = () => {
  return (
    <section id="events" className="py-48 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-32">
          <div className="inline-block p-4 bg-primary/5 rounded-full mb-6 border border-primary/20">
             <Scroll className="text-primary animate-pulse" size={48} />
          </div>
          <h2 className="text-5xl md:text-8xl mb-8 text-primary font-headline tracking-tighter gold-glow-text">The Great Trials</h2>
          <p className="text-muted-foreground text-2xl font-body italic max-w-3xl mx-auto">
            "Choose your path carefully, for each trial demands a different part of your spirit."
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          {/* Tech Events */}
          <div className="space-y-12">
            <div className="flex items-center gap-8 mb-16">
              <div className="h-[2px] flex-grow bg-gradient-to-r from-transparent to-primary/60" />
              <h3 className="text-4xl md:text-5xl font-headline text-primary tracking-widest">Technical Sagas</h3>
              <div className="h-[2px] w-16 bg-primary/60" />
            </div>
            <div className="grid gap-10">
              {TECH_EVENTS.map((event, idx) => (
                <Card key={idx} className="stone-tablet border-primary/20 hover:border-primary/80 transition-all duration-700 group hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(200,155,60,0.15)]">
                  <CardHeader className="flex flex-row items-center gap-8 pb-4">
                    <div className="p-5 bg-primary/5 border border-primary/20 rounded-sm group-hover:bg-primary/20 transition-all text-primary shadow-inner">
                      {event.icon}
                    </div>
                    <CardTitle className="text-2xl md:text-3xl font-headline group-hover:text-primary transition-colors tracking-widest gold-glow-text">
                      {event.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground font-body text-lg leading-relaxed">{event.desc}</p>
                  </CardContent>
                  <div className="absolute bottom-0 right-0 p-2 opacity-5 group-hover:opacity-20 transition-opacity">
                    <Shield size={64} className="text-primary" />
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Non-Tech Events */}
          <div className="space-y-12">
            <div className="flex items-center gap-8 mb-16">
              <div className="h-[2px] w-16 bg-secondary/60" />
              <h3 className="text-4xl md:text-5xl font-headline text-secondary tracking-widest">Creative Realms</h3>
              <div className="h-[2px] flex-grow bg-gradient-to-l from-transparent to-secondary/60" />
            </div>
            <div className="grid gap-10">
              {NON_TECH_EVENTS.map((event, idx) => (
                <Card key={idx} className="stone-tablet border-secondary/20 hover:border-secondary/80 transition-all duration-700 group hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(122,30,30,0.15)]">
                  <CardHeader className="flex flex-row items-center gap-8 pb-4">
                    <div className="p-5 bg-secondary/5 border border-secondary/20 rounded-sm group-hover:bg-secondary/20 transition-all text-secondary shadow-inner">
                      {event.icon}
                    </div>
                    <CardTitle className="text-2xl md:text-3xl font-headline group-hover:text-secondary transition-colors tracking-widest">
                      {event.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground font-body text-lg leading-relaxed">{event.desc}</p>
                  </CardContent>
                  <div className="absolute bottom-0 right-0 p-2 opacity-5 group-hover:opacity-20 transition-opacity">
                    <Scroll size={64} className="text-secondary" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
