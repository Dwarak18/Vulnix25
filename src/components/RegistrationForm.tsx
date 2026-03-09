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
import { Flame } from 'lucide-react';

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
    <section id="registration" className="py-32 px-4 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl mb-6 text-primary font-headline">The Celestial Register</h2>
          <p className="text-muted-foreground text-lg italic">"Ink your name upon the immortal scroll and face your destiny."</p>
          <div className="mt-8 inline-block px-8 py-4 ornate-border bg-primary/5 text-primary font-headline text-2xl tracking-widest">
            TEMPLE KEY: {teamId}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
          <Card className="stone-tablet border-primary/30 p-8">
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="space-y-3">
                <Label className="text-primary font-headline tracking-widest uppercase">Team Moniker</Label>
                <Input {...register("teamName")} className="bg-black/60 border-primary/20 focus:border-primary h-12 text-lg" placeholder="e.g. Shadow Walkers" />
                {errors.teamName && <p className="text-secondary text-sm italic">{errors.teamName.message}</p>}
              </div>

              <div className="space-y-3">
                <Label className="text-primary font-headline tracking-widest uppercase">Select Trial</Label>
                <Select onValueChange={(v) => setValue("eventSelection", v)}>
                  <SelectTrigger className="bg-black/60 border-primary/20 h-12 text-lg">
                    <SelectValue placeholder="Choose Path" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-primary/30 font-headline">
                    <SelectItem value="ctf">Capture The Flag</SelectItem>
                    <SelectItem value="prompt">Prompt Engineering</SelectItem>
                    <SelectItem value="expo">Paper Expo</SelectItem>
                    <SelectItem value="debug">Debugging</SelectItem>
                    <SelectItem value="non-tech">Creative Events</SelectItem>
                  </SelectContent>
                </Select>
                {errors.eventSelection && <p className="text-secondary text-sm italic">{errors.eventSelection.message}</p>}
              </div>

              <div className="space-y-3">
                <Label className="text-primary font-headline tracking-widest uppercase">Disciple Count</Label>
                <Select value={teamSize} onValueChange={(v) => setValue("teamSize", v)}>
                  <SelectTrigger className="bg-black/60 border-primary/20 h-12 text-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-primary/30 font-headline">
                    {["1", "2", "3", "4", "5"].map(s => (
                      <SelectItem key={s} value={s}>{s} Disciple{parseInt(s) > 1 ? 's' : ''}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {fields.map((field, index) => (
              <Card key={field.id} className="stone-tablet border-accent/30 animate-in fade-in zoom-in-95 duration-500">
                <CardHeader className="border-b border-accent/20">
                  <CardTitle className="text-xl text-primary font-headline tracking-widest flex items-center gap-3">
                    <Flame size={18} className="text-secondary" />
                    Disciple {index + 1}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-widest text-muted-foreground">True Name</Label>
                    <Input {...register(`members.${index}.name`)} className="bg-black/40 border-accent/20 h-10" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-widest text-muted-foreground">Spirit Signal (Phone)</Label>
                      <Input {...register(`members.${index}.phone`)} className="bg-black/40 border-accent/20 h-10" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-widest text-muted-foreground">Digital Echo (Email)</Label>
                      <Input {...register(`members.${index}.email`)} className="bg-black/40 border-accent/20 h-10" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-widest text-muted-foreground">Academy (College)</Label>
                      <Input {...register(`members.${index}.college`)} className="bg-black/40 border-accent/20 h-10" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-widest text-muted-foreground">Discipline (Dept)</Label>
                      <Input {...register(`members.${index}.department`)} className="bg-black/40 border-accent/20 h-10" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center pt-12">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/80 text-black font-black px-16 py-10 text-2xl ornate-border shadow-gold-glow rounded-none transition-all w-full md:w-auto hover:scale-105"
            >
              {isSubmitting ? "TRANSCENDING..." : "SEAL THE SCROLL"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};
