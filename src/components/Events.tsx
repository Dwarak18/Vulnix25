import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Brain, Globe, Flag, Terminal, Music, Camera, Film, Utensils, Dice5 } from 'lucide-react';

const TECH_EVENTS = [
  {
    title: "Paper Presentation / Expo",
    desc: "Present research ideas, startup concepts, or innovative projects. Evaluated on creativity and feasibility.",
    icon: <Globe className="text-primary" />
  },
  {
    title: "Prompt Engineering",
    desc: "Create the most effective prompts for AI systems to generate powerful outputs.",
    icon: <Brain className="text-primary" />
  },
  {
    title: "Website Prompt Challenge",
    desc: "Design websites using prompt-based tools. Demonstrate creativity and problem-solving.",
    icon: <Terminal className="text-primary" />
  },
  {
    title: "Capture The Flag (CTF)",
    desc: "Solve hacking puzzles, cryptography tasks, and vulnerabilities in this ultimate cyber trial.",
    icon: <Flag className="text-primary" />
  },
  {
    title: "Debugging Challenge",
    desc: "Identify and fix errors in complex code within a strictly limited time.",
    icon: <Shield className="text-primary" />
  }
];

const NON_TECH_EVENTS = [
  {
    title: "Guess the Song",
    desc: "Identify songs from small audio clues or hints in this musical trivia challenge.",
    icon: <Music className="text-secondary" />
  },
  {
    title: "Photography Contest",
    desc: "Capture creative photos showcasing unique perspectives through your lens.",
    icon: <Camera className="text-secondary" />
  },
  {
    title: "Short Film",
    desc: "Teams present short films demonstrating storytelling, editing, and creativity.",
    icon: <Film className="text-secondary" />
  },
  {
    title: "Fireless Cooking",
    desc: "Prepare innovative and delicious dishes without using any fire.",
    icon: <Utensils className="text-secondary" />
  },
  {
    title: "Strategic Games",
    desc: "Classic board game competitions: Chess, Carrom, and Ludo strategy tests.",
    icon: <Dice5 className="text-secondary" />
  }
];

export const Events: React.FC = () => {
  return (
    <section id="events" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl mb-4 text-primary">Trials of Skill</h2>
          <p className="text-muted-foreground text-lg">Choose your path and conquer the challenges</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Tech Events */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="h-1 w-12 bg-primary" />
              <h3 className="text-3xl font-headline text-primary">Technical Sagas</h3>
            </div>
            <div className="space-y-6">
              {TECH_EVENTS.map((event, idx) => (
                <Card key={idx} className="group gold-border bg-card/40 border-primary/20 hover:border-primary transition-all duration-300">
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                      {event.icon}
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors uppercase">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{event.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Non-Tech Events */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="h-1 w-12 bg-secondary" />
              <h3 className="text-3xl font-headline text-secondary">Creative Realms</h3>
            </div>
            <div className="space-y-6">
              {NON_TECH_EVENTS.map((event, idx) => (
                <Card key={idx} className="group border-secondary/20 bg-card/40 hover:border-secondary transition-all duration-300">
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <div className="p-3 bg-secondary/10 rounded-full group-hover:bg-secondary/20 transition-colors">
                      {event.icon}
                    </div>
                    <CardTitle className="text-xl group-hover:text-secondary transition-colors uppercase">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{event.desc}</p>
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
