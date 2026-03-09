
"use client"

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { CheckCircle2, Sparkles, ShieldCheck, Info } from 'lucide-react';
import Image from 'next/image';
import { useFirestore } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { motion } from 'framer-motion';

interface PaymentPanelProps {
  teamId: string;
  proverb?: string;
}

export const PaymentPanel: React.FC<PaymentPanelProps> = ({ teamId, proverb }) => {
  const db = useFirestore();
  const [txnId, setTxnId] = useState('');
  const [completed, setCompleted] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handlePaymentSubmit = () => {
    if (!txnId || txnId.length < 6) {
      toast({ 
        title: "Tribute Invalid", 
        description: "Please enter a valid Transaction UTR (12 digits)", 
        variant: "destructive" 
      });
      return;
    }

    setIsUpdating(true);
    const docRef = doc(db, 'registrations', teamId);
    const updateData = { txnId, status: 'pending' };

    updateDoc(docRef, updateData)
      .then(() => {
        setCompleted(true);
        toast({ 
          title: "Tribute Accepted", 
          description: "Your verification is underway. Patience is the root of wisdom." 
        });
      })
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'update',
          requestResourceData: updateData,
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({ title: "Spirit Interruption", description: "Failed to seal your tribute. Try again.", variant: "destructive" });
      })
      .finally(() => {
        setIsUpdating(false);
      });
  };

  if (completed) {
    return (
      <div className="py-48 px-4 max-w-2xl mx-auto text-center animate-in zoom-in duration-700">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none"
        >
          <div className="text-[40rem] text-primary">道</div>
        </motion.div>
        
        <div className="relative z-10">
          <CheckCircle2 size={120} className="mx-auto text-primary mb-12 drop-shadow-[0_0_20px_rgba(200,155,60,0.5)]" />
          <h2 className="text-5xl md:text-7xl text-primary font-headline mb-8 gold-glow-text">Journey Locked</h2>
          <p className="text-2xl text-muted-foreground font-body italic mb-16 leading-relaxed">
            "Your path is set. The Great Sage is reviewing your tribute. Watch the skies for the signal."
          </p>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-primary text-black font-bold px-16 py-8 text-xl ornate-border shadow-gold-glow hover:scale-105 transition-transform"
          >
            RETURN TO SANCTUARY
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-32 px-4 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left: Mystical Blessing & Info */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col justify-center space-y-12"
        >
          <div className="relative p-10 parchment-texture ornate-border shadow-2xl">
            <Sparkles className="absolute -top-4 -left-4 text-primary animate-pulse" size={32} />
            <h3 className="text-primary font-headline mb-6 uppercase tracking-[0.3em] text-xl">The Sage's Blessing</h3>
            <p className="text-2xl md:text-3xl text-foreground font-body leading-relaxed italic border-l-4 border-primary/40 pl-8">
              "{proverb || "The path reveals itself only to those who dare to step into the shadow."}"
            </p>
            <p className="mt-8 text-sm text-primary/50 text-right font-headline tracking-widest">— VULNIX ORACLE</p>
          </div>

          <Card className="bg-black/40 border-primary/20 p-8 rounded-none">
            <div className="flex items-start gap-6">
              <div className="p-3 bg-primary/10 rounded-full">
                <ShieldCheck className="text-primary" />
              </div>
              <div className="space-y-2">
                <Label className="text-primary font-headline tracking-widest text-lg block uppercase">Team Identification</Label>
                <div className="text-3xl font-code tracking-[0.3em] text-white/90">
                  {teamId}
                </div>
                <p className="text-xs text-muted-foreground italic">Keep this secret. It is the key to your trials.</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Right: Payment Console */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="stone-tablet border-primary/30 rounded-none overflow-hidden ornate-border shadow-2xl">
            <CardHeader className="bg-primary/5 border-b border-primary/20 p-8">
              <CardTitle className="text-3xl text-primary font-headline tracking-widest flex items-center gap-4">
                Finalize Trials
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-10 p-10 text-center">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg blur opacity-40 group-hover:opacity-100 transition duration-1000"></div>
                <div className="relative bg-white p-6 inline-block rounded-lg shadow-2xl">
                  <Image 
                    src="https://picsum.photos/seed/vulnix_qr_code/400/400" 
                    alt="Celestial UPI QR" 
                    width={250} 
                    height={250}
                    className="mx-auto"
                    data-ai-hint="QR code"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <p className="text-muted-foreground uppercase tracking-[0.3em] text-sm">Scan to offer your registration fee</p>
                <div className="h-px w-24 bg-primary/20 mx-auto" />
              </div>
              
              <div className="space-y-4 text-left">
                <Label className="text-primary font-headline text-xs tracking-widest uppercase">Transaction UTR (12 Digits)</Label>
                <Input 
                  value={txnId}
                  onChange={(e) => setTxnId(e.target.value)}
                  placeholder="Enter your spirit signature" 
                  className="bg-black/60 border-primary/30 h-16 text-center text-2xl tracking-[0.4em] focus:border-primary rounded-none placeholder:opacity-10"
                />
              </div>

              <div className="flex gap-4 p-4 bg-secondary/5 border-l-2 border-secondary/40 text-left">
                <Info size={18} className="text-secondary shrink-0" />
                <p className="text-xs text-muted-foreground italic leading-relaxed">
                  The verified UTR is your proof of passage. Incorrect entries may stall your journey indefinitely.
                </p>
              </div>
            </CardContent>
            <CardFooter className="p-0">
              <Button 
                onClick={handlePaymentSubmit}
                disabled={isUpdating}
                className="w-full h-24 bg-primary hover:bg-primary/90 text-black font-black text-2xl uppercase tracking-[0.5em] rounded-none shadow-gold-glow transition-all"
              >
                {isUpdating ? "SEALING RECORD..." : "CONFIRM PASSAGE"}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
