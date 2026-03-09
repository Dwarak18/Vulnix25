"use client"

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { generateMysticalProverb } from '@/ai/flows/ai-powered-mystical-proverb-generator-flow';
import { PaymentPanel } from './PaymentPanel';
import { useFirestore } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Flame, Sparkles, Key } from 'lucide-react';

const memberSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone is required"),
  email: z.string().email("Valid email is required"),
  college: z.string().min(2, "College name is required"),
  department: z.string().min(1, "Department is required"),
});

const formSchema = z.object({
  teamName: z.string().min(2, "Team name is required"),
  eventSelection: z.string().min(1, "Select an event"),
  teamSize: z.string(),
  members: z.array(memberSchema)
});

type FormValues = z.infer<typeof formSchema>;

export const RegistrationForm: React.FC = () => {
  const db = useFirestore();
  const [teamId, setTeamId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);
  const [proverb, setProverb] = useState('');

  useEffect(() => {
    const randomId = Math.floor(1000 + Math.random() * 9000);
    setTeamId(`VULNIX-${randomId}`);
  }, []);

  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamSize: "1",
      members: [{ name: '', phone: '', email: '', college: '', department: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "members"
  });

  const teamSize = watch("teamSize");

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

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      const proverbRes = await generateMysticalProverb({ teamName: data.teamName });
      const currentProverb = proverbRes.proverb;
      setProverb(currentProverb);

      const registrationData = {
        ...data,
        teamId,
        proverb: currentProverb,
        status: 'pending',
        createdAt: serverTimestamp(),
      };

      const docRef = doc(db, 'registrations', teamId);
      
      setDoc(docRef, registrationData)
        .catch(async (serverError) => {
          const permissionError = new FirestorePermissionError({
            path: docRef.path,
            operation: 'create',
            requestResourceData: registrationData,
          });
          errorEmitter.emit('permission-error', permissionError);
        });

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
    return <PaymentPanel teamId={teamId} proverb={proverb} />;
  }

  return (
    <section id="registration" className="py-48 px-4 relative overflow-hidden bg-black/40">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-5xl md:text-8xl mb-8 text-primary font-headline tracking-tighter gold-glow-text">Temple of Records</h2>
          <p className="text-muted-foreground text-xl italic font-body">"Ink your name upon the immortal scroll and face your destiny."</p>
          <div className="mt-12 inline-flex items-center gap-6 px-10 py-6 ornate-border bg-primary/5 text-primary font-headline text-2xl tracking-[0.2em] shadow-gold-glow">
            <Key className="animate-pulse" />
            KEY: {teamId}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-16">
          <Card className="stone-tablet border-primary/40 p-10 md:p-16 ornate-border">
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <Label className="text-primary font-headline tracking-widest uppercase text-sm block">Team Moniker</Label>
                <div className="relative">
                  <Input {...register("teamName")} className="bg-black/60 border-primary/30 focus:border-primary h-14 text-xl tracking-wider pl-4" placeholder="e.g. Shadow Walkers" />
                  <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/20" size={18} />
                </div>
                {errors.teamName && <p className="text-secondary text-sm italic">{errors.teamName.message}</p>}
              </div>

              <div className="space-y-4">
                <Label className="text-primary font-headline tracking-widest uppercase text-sm block">Select Trial</Label>
                <Select onValueChange={(v) => setValue("eventSelection", v)}>
                  <SelectTrigger className="bg-black/60 border-primary/30 h-14 text-xl tracking-wider">
                    <SelectValue placeholder="Choose Path" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-primary/40 font-headline">
                    <SelectItem value="ctf">Capture The Flag</SelectItem>
                    <SelectItem value="prompt">Prompt Engineering</SelectItem>
                    <SelectItem value="expo">Paper Expo</SelectItem>
                    <SelectItem value="debug">Debugging</SelectItem>
                    <SelectItem value="non-tech">Creative Events</SelectItem>
                  </SelectContent>
                </Select>
                {errors.eventSelection && <p className="text-secondary text-sm italic">{errors.eventSelection.message}</p>}
              </div>

              <div className="space-y-4">
                <Label className="text-primary font-headline tracking-widest uppercase text-sm block">Disciple Count</Label>
                <Select value={teamSize} onValueChange={(v) => setValue("teamSize", v)}>
                  <SelectTrigger className="bg-black/60 border-primary/30 h-14 text-xl tracking-wider">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-primary/40 font-headline">
                    {["1", "2", "3", "4", "5"].map(s => (
                      <SelectItem key={s} value={s}>{s} Disciple{parseInt(s) > 1 ? 's' : ''}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {fields.map((field, index) => (
              <Card key={field.id} className="stone-tablet border-accent/40 animate-in fade-in zoom-in-95 duration-700">
                <CardHeader className="border-b border-accent/20 bg-primary/5 p-6">
                  <CardTitle className="text-xl md:text-2xl text-primary font-headline tracking-widest flex items-center gap-4">
                    <Flame size={24} className="text-secondary animate-pulse" />
                    Disciple {index + 1}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8 pt-8 p-8">
                  <div className="space-y-3">
                    <Label className="text-xs uppercase tracking-widest text-muted-foreground font-headline">True Name</Label>
                    <Input {...register(`members.${index}.name`)} className="bg-black/40 border-accent/30 h-12 focus:border-primary transition-colors" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-xs uppercase tracking-widest text-muted-foreground font-headline">Spirit Signal</Label>
                      <Input {...register(`members.${index}.phone`)} className="bg-black/40 border-accent/30 h-12" />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-xs uppercase tracking-widest text-muted-foreground font-headline">Digital Echo</Label>
                      <Input {...register(`members.${index}.email`)} className="bg-black/40 border-accent/30 h-12" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-xs uppercase tracking-widest text-muted-foreground font-headline">Academy</Label>
                      <Input {...register(`members.${index}.college`)} className="bg-black/40 border-accent/30 h-12" />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-xs uppercase tracking-widest text-muted-foreground font-headline">Discipline</Label>
                      <Input {...register(`members.${index}.department`)} className="bg-black/40 border-accent/30 h-12" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center pt-20">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/80 text-black font-black px-24 py-12 text-3xl ornate-border shadow-[0_0_50px_rgba(200,155,60,0.3)] rounded-none transition-all w-full md:w-auto hover:scale-105 active:scale-95"
            >
              {isSubmitting ? "TRANSCENDING..." : "SEAL THE SCROLL"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};
