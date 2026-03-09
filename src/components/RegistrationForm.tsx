
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
        title: "Registration Initialized",
        description: "Proceed to payment to finalize your entry.",
      });
    } catch (error) {
      toast({
        title: "Submission Error",
        description: "Failed to initialize registration. Please try again.",
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
    <section id="registration" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-5xl mb-4 text-primary">Enter the Fray</h2>
          <p className="text-muted-foreground">Register your team for the symposium</p>
          <div className="mt-4 inline-block px-4 py-2 border border-primary/30 bg-primary/5 text-primary font-bold">
            TEAM ID: {teamId}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <Card className="gold-border bg-card/40 border-primary/20">
            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>Team Name</Label>
                <Input {...register("teamName")} className="bg-background/50 border-primary/20 focus:border-primary" placeholder="Shadow Walkers" />
                {errors.teamName && <p className="text-destructive text-xs">{errors.teamName.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Event Choice</Label>
                <Select onValueChange={(v) => setValue("eventSelection", v)}>
                  <SelectTrigger className="bg-background/50 border-primary/20">
                    <SelectValue placeholder="Select Event" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-primary/30">
                    <SelectItem value="ctf">Capture The Flag</SelectItem>
                    <SelectItem value="prompt">Prompt Engineering</SelectItem>
                    <SelectItem value="expo">Paper Expo</SelectItem>
                    <SelectItem value="debug">Debugging</SelectItem>
                    <SelectItem value="non-tech">Creative Events</SelectItem>
                  </SelectContent>
                </Select>
                {errors.eventSelection && <p className="text-destructive text-xs">{errors.eventSelection.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Team Size (1-5)</Label>
                <Select value={teamSize} onValueChange={(v) => setValue("teamSize", v)}>
                  <SelectTrigger className="bg-background/50 border-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-primary/30">
                    {["1", "2", "3", "4", "5"].map(s => (
                      <SelectItem key={s} value={s}>{s} Member{parseInt(s) > 1 ? 's' : ''}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields.map((field, index) => (
              <Card key={field.id} className="border-primary/10 bg-card/20 animate-in fade-in zoom-in-95 duration-300">
                <CardHeader>
                  <CardTitle className="text-sm text-primary uppercase tracking-widest">Member {index + 1}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <Label className="text-xs">Full Name</Label>
                    <Input {...register(`members.${index}.name`)} className="bg-background/30 h-8" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Phone</Label>
                      <Input {...register(`members.${index}.phone`)} className="bg-background/30 h-8" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Email</Label>
                      <Input {...register(`members.${index}.email`)} className="bg-background/30 h-8" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">College</Label>
                      <Input {...register(`members.${index}.college`)} className="bg-background/30 h-8" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Department</Label>
                      <Input {...register(`members.${index}.department`)} className="bg-background/30 h-8" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center pt-8">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/80 text-black font-black px-12 py-8 text-xl gold-border mystical-glow rounded-none transition-all w-full md:w-auto"
            >
              {isSubmitting ? "INITIATING JOURNEY..." : "SIGN THE MYTHIC SCROLL"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};
