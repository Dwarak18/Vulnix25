
"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { generateMysticalProverb } from '@/ai/flows/ai-powered-mystical-proverb-generator-flow';
import { PaymentPanel } from './PaymentPanel';
import { useFirestore } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Flame, Sparkles, Key, Users, Trophy, ScrollText, AlertCircle, Clock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface EventTrial {
  id: string;
  name: string;
  start: string; // HH:mm
  end: string;   // HH:mm
}

const AVAILABLE_EVENTS: EventTrial[] = [
  { id: "paper", name: "Paper Presentation / Startup Expo", start: "10:15", end: "11:00" },
  { id: "fireless", name: "Fireless Cooking", start: "10:15", end: "11:00" },
  { id: "prompt", name: "Prompt Engineering Challenge", start: "11:00", end: "11:45" },
  { id: "photo", name: "Photography Contest", start: "11:00", end: "11:45" },
  { id: "film", name: "Short Film", start: "11:00", end: "11:45" },
  { id: "web", name: "Website Prompt Challenge", start: "11:45", end: "12:30" },
  { id: "debugging", name: "Debugging Challenge", start: "12:30", end: "13:15" },
  { id: "song", name: "Guess The Song", start: "12:30", end: "13:15" },
  { id: "strategy", name: "Chess / Carrom / Ludo", start: "11:45", end: "13:15" },
  { id: "ctf", name: "Capture The Flag (CTF)", start: "09:00", end: "14:00" }
];

const memberSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone is required"),
  email: z.string().email("Valid email is required"),
  college: z.string().min(2, "College name is required"),
  department: z.string().min(1, "Department is required"),
});

const formSchema = z.object({
  teamName: z.string().min(2, "Team name is required"),
  events: z.array(z.string()).min(1, "Select at least one event"),
  teamSize: z.string(),
  members: z.array(memberSchema)
});

type FormValues = z.infer<typeof formSchema>;

// Helper to convert time string to minutes
const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

// Overlap logic: startA < endB AND endA > startB
const isOverlapping = (e1: EventTrial, e2: EventTrial) => {
  return timeToMinutes(e1.start) < timeToMinutes(e2.end) && 
         timeToMinutes(e1.end) > timeToMinutes(e2.start);
};

export const RegistrationForm: React.FC = () => {
  const db = useFirestore();
  const [teamId, setTeamId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);
  
  useEffect(() => {
    const randomId = Math.floor(1000 + Math.random() * 9000);
    setTeamId(`VULNIX-${randomId}`);
  }, []);

  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamSize: "1",
      events: [],
      members: [{ name: '', phone: '', email: '', college: '', department: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "members"
  });

  const selectedEventIds = watch("events");
  const teamSize = watch("teamSize");

  // Calculate disabled events based on selection
  const conflictMap = useMemo(() => {
    const map: Record<string, string | boolean> = {};
    const selectedEvents = AVAILABLE_EVENTS.filter(e => selectedEventIds.includes(e.id));
    const hasCtfSelected = selectedEventIds.includes('ctf');
    const hasOtherSelected = selectedEventIds.length > 0 && !hasCtfSelected;

    AVAILABLE_EVENTS.forEach(event => {
      // Rule 1: If CTF is selected, everything else is disabled
      if (hasCtfSelected && event.id !== 'ctf') {
        map[event.id] = "CTF runs from 9:00 AM to 2:00 PM and cannot be combined with other events.";
        return;
      }

      // Rule 2: If anything else is selected, CTF is disabled
      if (hasOtherSelected && event.id === 'ctf') {
        map[event.id] = "CTF conflicts with your other selected event times.";
        return;
      }

      // Rule 3: Parallel Event Check (Standard Overlap)
      const conflict = selectedEvents.find(se => se.id !== event.id && isOverlapping(se, event));
      if (conflict) {
        map[event.id] = `Conflicts with ${conflict.name}.`;
      }
    });

    return map;
  }, [selectedEventIds]);

  useEffect(() => {
    const targetSize = parseInt(teamSize);
    const currentSize = fields.length;
    
    if (targetSize > currentSize) {
      for (let i = 0; i < targetSize - currentSize; i++) {
        append({ name: '', phone: '', email: '', college: '', department: '' });
      }
    } else if (targetSize < currentSize) {
      for (let i = 0; i < currentSize - targetSize; i++) {
        remove(fields.length - 1 - i);
      }
    }
  }, [teamSize, append, remove, fields.length]);

  const handleEventToggle = (eventId: string) => {
    if (conflictMap[eventId]) return;

    const current = selectedEventIds;
    if (current.includes(eventId)) {
      setValue("events", current.filter(id => id !== eventId));
    } else {
      setValue("events", [...current, eventId]);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      const proverbRes = await generateMysticalProverb({ teamName: data.teamName });
      const currentProverb = proverbRes.proverb;

      const registrationData = {
        ...data,
        teamId,
        proverb: currentProverb,
        eventCount: data.events.length,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      setSubmittedData(registrationData);
      
      toast({
        title: "Inscription Noted",
        description: "Your journey begins. Finalize the tribute.",
      });
    } catch (error) {
      toast({
        title: "Trial Interrupted",
        description: "The spirits are silent. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedData) {
    return <PaymentPanel registrationData={submittedData} />;
  }

  return (
    <section id="registration" className="py-48 px-4 relative overflow-hidden bg-black/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-block p-4 bg-primary/10 rounded-full mb-8 border border-primary/20"
          >
            <ScrollText className="text-primary" size={48} />
          </motion.div>
          <h2 className="text-5xl md:text-8xl mb-8 text-primary font-headline tracking-tighter gold-glow-text">Temple of Records</h2>
          <p className="text-muted-foreground text-xl italic font-body max-w-2xl mx-auto">
            "Ink your name upon the immortal scroll and face your destiny. The Sage watches every stroke."
          </p>
          
          <div className="mt-12 inline-flex items-center gap-6 px-10 py-6 ornate-border bg-primary/5 text-primary font-headline text-2xl tracking-[0.2em] shadow-gold-glow">
            <Key className="animate-pulse" />
            VESTIBULE KEY: {teamId}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-16">
          <Card className="stone-tablet border-primary/40 p-10 md:p-16 ornate-border overflow-visible">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <Label className="text-primary font-headline tracking-widest uppercase text-sm flex items-center gap-2">
                  <Flame size={14} className="text-secondary" />
                  Team Moniker
                </Label>
                <div className="relative">
                  <Input 
                    {...register("teamName")} 
                    className="bg-black/60 border-primary/30 h-14 text-xl tracking-wider pl-4 rounded-none" 
                    placeholder="e.g. Wukong's Shadow" 
                  />
                  <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/20" size={18} />
                </div>
                {errors.teamName && <p className="text-secondary text-sm italic">{errors.teamName.message}</p>}
              </div>

              <div className="space-y-4">
                <Label className="text-primary font-headline tracking-widest uppercase text-sm flex items-center gap-2">
                  <Users size={14} className="text-secondary" />
                  Disciple Count
                </Label>
                <Select value={teamSize} onValueChange={(v) => setValue("teamSize", v)}>
                  <SelectTrigger className="bg-black/60 border-primary/30 h-14 text-xl tracking-wider rounded-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-primary/40 font-headline">
                    {["1", "2", "3", "4", "5"].map(s => (
                      <SelectItem key={s} value={s}>{s} Disciple{parseInt(s) > 1 ? 's' : ''}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-12 space-y-6">
              <Label className="text-primary font-headline tracking-widest uppercase text-sm flex items-center gap-2">
                <Trophy size={14} className="text-secondary" />
                Chosen Trials (Time Conflict Validation)
              </Label>
              <TooltipProvider>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {AVAILABLE_EVENTS.map((event) => {
                    const isDisabled = conflictMap[event.id];
                    const isChecked = selectedEventIds.includes(event.id);
                    
                    return (
                      <Tooltip key={event.id}>
                        <TooltipTrigger asChild>
                          <div className={`flex items-center space-x-3 p-4 border transition-all duration-300 ${
                            isDisabled 
                              ? "opacity-40 bg-black/20 border-white/5 cursor-not-allowed" 
                              : "bg-black/40 border-primary/10 hover:border-primary/40"
                          }`}>
                            <Checkbox 
                              id={event.id}
                              checked={isChecked}
                              onCheckedChange={() => handleEventToggle(event.id)}
                              disabled={!!isDisabled}
                              className="border-primary"
                            />
                            <div className="flex flex-col flex-grow cursor-pointer" onClick={() => !isDisabled && handleEventToggle(event.id)}>
                              <label 
                                htmlFor={event.id}
                                className={`text-sm font-body cursor-pointer select-none ${isDisabled ? 'text-muted-foreground' : 'text-foreground'}`}
                              >
                                {event.name}
                              </label>
                              <span className="text-[10px] text-primary/40 flex items-center gap-1">
                                <Clock size={10} />
                                {event.start} – {event.end}
                              </span>
                            </div>
                          </div>
                        </TooltipTrigger>
                        {isDisabled && !isChecked && (
                          <TooltipContent className="bg-secondary text-white border-none font-headline text-[10px] tracking-widest">
                            <p>{isDisabled}</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    );
                  })}
                </div>
              </TooltipProvider>
              {errors.events && (
                <div className="flex items-center gap-2 text-secondary text-sm italic mt-2">
                  <AlertCircle size={14} />
                  {errors.events.message}
                </div>
              )}
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <AnimatePresence mode="popLayout">
              {fields.map((field, index) => (
                <motion.div
                  key={field.id}
                  layout
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ duration: 0.6, delay: (index % 2) * 0.1 }}
                  className="w-full"
                >
                  <Card className="stone-tablet border-accent/40 shadow-gold-glow overflow-hidden group">
                    <CardHeader className="border-b border-accent/20 bg-primary/5 p-6 flex flex-row items-center justify-between">
                      <CardTitle className="text-xl md:text-2xl text-primary font-headline tracking-widest flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full border border-primary/30 flex items-center justify-center text-sm font-headline bg-black/40">
                          {index + 1}
                        </div>
                        Disciple {index + 1}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8 pt-8 p-8">
                      <div className="space-y-3">
                        <Label className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-headline">True Name</Label>
                        <Input {...register(`members.${index}.name`)} className="bg-black/40 border-accent/30 h-12 rounded-none" />
                        {errors.members?.[index]?.name && <p className="text-secondary text-xs">{errors.members[index].name?.message}</p>}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-headline">Phone</Label>
                          <Input {...register(`members.${index}.phone`)} className="bg-black/40 border-accent/30 h-12 rounded-none" />
                        </div>
                        <div className="space-y-3">
                          <Label className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-headline">Email</Label>
                          <Input {...register(`members.${index}.email`)} className="bg-black/40 border-accent/30 h-12 rounded-none" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-headline">College</Label>
                          <Input {...register(`members.${index}.college`)} className="bg-black/40 border-accent/30 h-12 rounded-none" />
                        </div>
                        <div className="space-y-3">
                          <Label className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-headline">Department</Label>
                          <Input {...register(`members.${index}.department`)} className="bg-black/40 border-accent/30 h-12 rounded-none" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="text-center pt-24">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90 text-black font-black px-24 py-12 text-3xl ornate-border shadow-[0_0_60px_rgba(200,155,60,0.4)] rounded-none transition-all w-full md:w-auto"
            >
              {isSubmitting ? "ASCENDING..." : "SEAL THE SCROLL"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};
