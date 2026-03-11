"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { CheckCircle2, Sparkles, ShieldCheck, Info, CreditCard } from 'lucide-react';
import Image from 'next/image';
import { useFirestore } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { motion } from 'framer-motion';

const GOOGLE_SHEETS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyGFMnfFIJMcQm2GFlAWKR5Fd5XwkY1JHmEFOP6-bwijDiMOG102hd6ZOCForUzNjYj/exec";

interface PaymentPanelProps {
  registrationData: any;
}

export const PaymentPanel: React.FC<PaymentPanelProps> = ({ registrationData }) => {
  const db = useFirestore();
  const panelRef = useRef<HTMLDivElement>(null);
  const [txnId, setTxnId] = useState('');
  const [completed, setCompleted] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    panelRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }, []);

  const handlePaymentSubmit = () => {
    if (!txnId || txnId.trim().length < 6) {
      toast({ title: "Tribute Invalid", description: "Please enter a valid Transaction ID", variant: "destructive" });
      return;
    }

    setIsUpdating(true);
    const teamId = registrationData.teamId;
    const finalData = { ...registrationData, txnId, status: 'pending', createdAt: serverTimestamp() };

    // Optimistic Update: Initiate background writes and transitions immediately
    const docRef = doc(db, 'registrations', teamId);
    setDoc(docRef, finalData)
      .catch(async () => {
        const permissionError = new FirestorePermissionError({ path: docRef.path, operation: 'create', requestResourceData: finalData });
        errorEmitter.emit('permission-error', permissionError);
      });

    const sheetPayload = {
      teamId: finalData.teamId,
      teamName: finalData.teamName,
      events: finalData.events,
      eventCount: finalData.eventCount,
      teamSize: finalData.teamSize,
      members: finalData.members,
      transactionID: txnId
    };

    console.log("Sending registration to Google Sheets:", sheetPayload);

    // Google Sheets sync in background - Google Apps Script compatible version
    fetch(GOOGLE_SHEETS_WEB_APP_URL, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(sheetPayload)
    }).catch(err => {
      console.warn("Google Sheets background sync failed:", err);
      toast({ title: "Sync Warning", description: "Failed to sync registration with Google Sheets.", variant: "destructive" });
    });

    setCompleted(true);
    setIsUpdating(false);
    toast({ title: "Tribute Accepted", description: "Your verification is underway. Patience is the root of wisdom." });

    setTimeout(() => {
      const endingScene = document.getElementById('ending-scene');
      if (endingScene) {
        endingScene.scrollIntoView({ behavior: 'smooth' });
      }
    }, 1500);
  };

  if (completed) {
    return (
      <div ref={panelRef} className="px-4 max-w-2xl mx-auto text-center animate-in zoom-in duration-700 pt-16 md:pt-24">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <div className="text-[20rem] md:text-[40rem] text-primary">道</div>
        </motion.div>
        <div className="relative z-10">
          <CheckCircle2 className="w-20 h-20 md:w-[120px] md:h-[120px] mx-auto text-primary mb-8 md:mb-12 drop-shadow-[0_0_20px_rgba(200,155,60,0.5)]" />
          <h2 className="text-4xl sm:text-5xl md:text-7xl text-primary font-headline mb-6 md:mb-8 gold-glow-text uppercase">Journey Locked</h2>
          <p className="text-lg md:text-2xl text-muted-foreground font-body italic mb-12 md:mb-16 leading-relaxed">"Your path is set. The Great Sage is reviewing your tribute."</p>
          <Button onClick={() => window.location.reload()} className="bg-primary text-black font-bold px-10 md:px-16 py-6 md:py-8 text-lg md:text-xl ornate-border shadow-gold-glow hover:scale-105 transition-transform uppercase tracking-widest">RETURN TO SANCTUARY</Button>
        </div>
      </div>
    );
  }

  return (
    <div ref={panelRef} className="px-4 max-w-screen-xl mx-auto py-16 md:py-32">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-start">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col justify-center space-y-8 md:space-y-12">
          <div className="relative p-6 md:p-10 parchment-texture ornate-border shadow-2xl">
            <Sparkles className="absolute -top-4 -left-4 text-primary animate-pulse w-6 h-6 md:w-8 md:h-8" />
            <h3 className="text-primary font-headline mb-4 md:mb-6 uppercase tracking-[0.3em] text-lg md:text-xl">The Sage's Blessing</h3>
            <p className="text-xl sm:text-2xl md:text-3xl text-foreground font-body leading-relaxed italic border-l-4 border-primary/40 pl-6 md:pl-8 break-words">"{registrationData.proverb}"</p>
          </div>
          <Card className="bg-black/40 border-primary/20 p-6 md:p-8 rounded-none">
            <div className="flex items-start gap-4 md:gap-6">
              <div className="p-2 md:p-3 bg-primary/10 rounded-full shrink-0"><ShieldCheck className="text-primary" /></div>
              <div className="space-y-1 md:space-y-2 overflow-hidden">
                <Label className="text-primary font-headline tracking-widest text-base md:text-lg block uppercase">Team ID</Label>
                <div className="text-xl sm:text-2xl md:text-3xl font-code tracking-[0.2em] md:tracking-[0.3em] text-white/90 break-all">{registrationData.teamId}</div>
              </div>
            </div>
          </Card>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <Card className="stone-tablet border-primary/30 rounded-none overflow-hidden ornate-border shadow-2xl mx-auto max-w-lg">
            <CardHeader className="bg-primary/5 border-b border-primary/20 p-6 md:p-8">
              <CardTitle className="text-2xl md:text-3xl text-primary font-headline tracking-widest flex items-center gap-4 uppercase"><CreditCard className="text-secondary shrink-0" />Registration Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 md:space-y-10 p-6 md:p-10 text-center">
              <div className="space-y-2">
                <p className="text-xl md:text-2xl text-foreground font-headline uppercase">Registration Fee: ₹250</p>
                <p className="text-xs sm:text-sm text-muted-foreground italic">One fee covers all selected trials.</p>
              </div>
              <div className="relative group mx-auto">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg blur opacity-40 group-hover:opacity-100 transition duration-1000" />
                <div className="relative bg-white p-4 md:p-6 inline-block rounded-lg shadow-2xl">
                  <Image
                    src="/img/payment.png"
                    alt="VULNIX UPI QR"
                    width={220}
                    height={220}
                    className="mx-auto"
                  />
                </div>
              </div>
              <p className="text-muted-foreground uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-xs">Scan the QR code and complete the payment.</p>
              <div className="space-y-4 text-left">
                <Label className="text-primary font-headline text-[10px] md:text-xs tracking-widest uppercase">Transaction ID / UTR</Label>
                <Input value={txnId} onChange={(e) => setTxnId(e.target.value)} placeholder="Enter spirit signature" className="bg-black/60 border-primary/30 h-14 md:h-16 text-center text-xl md:text-2xl tracking-[0.3em] md:tracking-[0.4em] focus:border-primary rounded-none" />
              </div>
              <div className="flex gap-4 p-4 bg-secondary/5 border-l-2 border-secondary/40 text-left">
                <Info className="text-secondary shrink-0 w-4 h-4 md:w-[18px] md:h-[18px]" />
                <p className="text-[10px] md:text-xs text-muted-foreground italic leading-relaxed">Passage is only granted to those who offer a true tribute.</p>
              </div>
            </CardContent>
            <CardFooter className="p-0">
              <Button onClick={handlePaymentSubmit} disabled={isUpdating} className="w-full h-20 md:h-24 bg-primary hover:bg-primary/90 text-black font-black text-xl md:text-2xl uppercase tracking-[0.3em] md:tracking-[0.5em] rounded-none transition-all">{isUpdating ? "SEALING RECORD..." : "CONFIRM PASSAGE"}</Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};