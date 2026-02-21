import type { LucideIcon } from 'lucide-react';
import { Code, FileText, Presentation, SearchCheck, Lightbulb, HelpCircle, ShieldAlert, Wrench, Camera, Flag } from 'lucide-react';

export interface Event {
  id: string;
  name: string;
  description: string;
  type: 'Technical' | 'Non-Technical';
  icon: LucideIcon;
  time: string; // e.g., "10:00 AM - 12:30 PM"
}

export const eventsData: Event[] = [
  {
    id: 'coding-challenge',
    name: 'Zero-Day Code',
    description: 'A high-stakes coding battle where participants solved complex algorithmic problems against the clock.',
    type: 'Technical',
    icon: Code,
    time: '10:00 AM - 12:30 PM',
  },
  {
    id: 'paper-presentation',
    name: 'Glitch Docs',
    description: 'Innovators presented cutting-edge research on cybersecurity and other tech domains to a panel of experts.',
    type: 'Technical',
    icon: FileText,
    time: '10:15 AM - 12:45 PM',
  },
  {
    id: 'cybercase-investigation',
    name: 'Busted',
    description: 'Participants became digital forensic experts, analyzing evidence to solve a simulated cybercrime.',
    type: 'Technical',
    icon: SearchCheck,
    time: '10:15 AM - 11:30 AM',
  },
  {
    id: 'poster-presentation',
    name: 'Pixel Punk',
    description: 'A challenge of creativity and AI-prowess where participants crafted visually stunning posters using generative AI.',
    type: 'Technical',
    icon: Presentation,
    time: '11:00 AM - 12:30 PM',
  },
  {
    id: 'idea-pitch',
    name: 'Concept - Clash',
    description: 'Visionaries pitched groundbreaking startup ideas and cybersecurity solutions, vying for the judges\' approval.',
    type: 'Technical',
    icon: Lightbulb,
    time: '10:30 AM - 11:45 AM',
  },
  {
    id: 'ctf-challenge',
    name: 'FlagRunner 0x7E9',
    description: 'The flagship Capture The Flag event, a grueling test of web, crypto, and forensics skills.',
    type: 'Technical',
    icon: Flag,
    time: '10:00 AM - 12:30 PM',
  },
  {
    id: 'real-or-ruse',
    name: 'Real or Ruse',
    description: 'A fast-paced game testing participants\' ability to distinguish between genuine facts and clever deception.',
    type: 'Non-Technical',
    icon: HelpCircle,
    time: '12:15 PM - 01:45 PM',
  },
  {
    id: 'mix-and-fix',
    name: 'Mix N\' Fix',
    description: 'A hands-on challenge that tested teams\' problem-solving with word puzzles and quick-fire quizzes.',
    type: 'Non-Technical',
    icon: Wrench,
    time: '12:15 PM - 01:45 PM',
  },
  {
    id: 'survival-showdown',
    name: 'Survival Showdown',
    description: 'A test of logic and teamwork through a series of fun, simulated survival scenarios.',
    type: 'Non-Technical',
    icon: ShieldAlert,
    time: '12:00 PM - 01:30 PM',
  },
  {
    id: 'photography',
    name: 'Shutter-Sync',
    description: 'Creativity in focus, where photographers captured the dynamic essence of the VULNIX symposium.',
    type: 'Non-Technical',
    icon: Camera,
    time: '11:00 AM - 01:00 PM',
  },
];

// Helper function to get events sorted by start time
export const getSortedEvents = () => {
  return [...eventsData].sort((a, b) => {
    const timeA = new Date(`1970/01/01 ${a.time.split(' - ')[0]}`);
    const timeB = new Date(`1970/01/01 ${b.time.split(' - ')[0]}`);
    return timeA.getTime() - timeB.getTime();
  });
};
