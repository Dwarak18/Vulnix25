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
    <section id="events" className="py-32 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <div className="inline-block p-2 bg-secondary/10 rounded-full mb-4">
             <Scroll className="text-primary animate-pulse" size={32} />
          </div>
          <h2 className="text-5xl md:text-8xl mb-6 text-primary font-headline">The Great Trials</h2>
          <p className="text-muted-foreground text-xl font-body italic">"Choose your path carefully, for each trial demands a different part of your spirit."</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Tech Events */}
          <div className="space-y-10">
            <div className="flex items-center gap-6 mb-12">
              <div className="h-0.5 flex-grow bg-gradient-to-r from-transparent to-primary/50" />
              <h3 className="text-4xl font-headline text-primary">Technical Sagas</h3>
              <div className="h-0.5 w-12 bg-primary/50" />
            </div>
            <div className="grid gap-8">
              {TECH_EVENTS.map((event, idx) => (
                <Card key={idx} className="stone-tablet border-primary/20 hover:border-primary/60 transition-all duration-500 group hover:-translate-y-1">
                  <CardHeader className="flex flex-row items-center gap-6 pb-4">
                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-sm group-hover:bg-primary/20 transition-all text-primary">
                      {event.icon}
                    </div>
                    <CardTitle className="text-2xl font-headline group-hover:text-primary transition-colors tracking-widest">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground font-body text-lg leading-relaxed">{event.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Non-Tech Events */}
          <div className="space-y-10">
            <div className="flex items-center gap-6 mb-12">
              <div className="h-0.5 w-12 bg-secondary/50" />
              <h3 className="text-4xl font-headline text-secondary">Creative Realms</h3>
              <div className="h-0.5 flex-grow bg-gradient-to-l from-transparent to-secondary/50" />
            </div>
            <div className="grid gap-8">
              {NON_TECH_EVENTS.map((event, idx) => (
                <Card key={idx} className="stone-tablet border-secondary/20 hover:border-secondary/60 transition-all duration-500 group hover:-translate-y-1">
                  <CardHeader className="flex flex-row items-center gap-6 pb-4">
                    <div className="p-4 bg-secondary/5 border border-secondary/20 rounded-sm group-hover:bg-secondary/20 transition-all text-secondary">
                      {event.icon}
                    </div>
                    <CardTitle className="text-2xl font-headline group-hover:text-secondary transition-colors tracking-widest">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground font-body text-lg leading-relaxed">{event.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
