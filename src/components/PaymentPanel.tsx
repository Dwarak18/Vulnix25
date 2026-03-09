"use client"

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { CheckCircle2, QrCode, Sparkles } from 'lucide-react';
import Image from 'next/image';

interface PaymentPanelProps {
  teamId: string;
  proverb?: string;
}

export const PaymentPanel: React.FC<PaymentPanelProps> = ({ teamId, proverb }) => {
  const [txnId, setTxnId] = useState('');
  const [completed, setCompleted] = useState(false);

  const handlePaymentSubmit = () => {
    if (!txnId) {
      toast({ title: "Error", description: "Please enter your Transaction ID", variant: "destructive" });
      return;
    }
    // Placeholder for final submission
    setCompleted(true);
    toast({ title: "Success", description: "Payment details submitted for verification." });
  };

  if (completed) {
    return (
      <div className="py-24 px-4 max-w-2xl mx-auto text-center animate-in zoom-in duration-500">
        <CheckCircle2 size={80} className="mx-auto text-primary mb-6" />
        <h2 className="text-4xl text-primary mb-4">Registration Locked</h2>
        <p className="text-xl text-muted-foreground mb-12">Your journey has begun. We will verify your transaction ID soon.</p>
        <Button onClick={() => window.location.reload()} className="bg-primary text-black font-bold px-8">Return Home</Button>
      </div>
    );
  }

  return (
    <div className="py-24 px-4 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-10 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left: Mystical Blessing */}
        <div className="flex flex-col justify-center space-y-8">
          <div className="relative p-8 gold-border bg-card/60 backdrop-blur-md italic">
            <Sparkles className="absolute -top-3 -left-3 text-primary animate-pulse" />
            <h3 className="text-primary font-headline mb-4 uppercase tracking-tighter">Ancient Blessing</h3>
            <p className="text-2xl text-foreground font-serif leading-relaxed">
              "{proverb || "The path reveals itself only to those who dare to step into the shadow."}"
            </p>
            <p className="mt-4 text-sm text-primary/50 text-right font-headline">— The Sage of VULNIX</p>
          </div>
          <div className="text-sm text-muted-foreground bg-primary/5 p-4 border-l-2 border-primary">
            Keep your Team ID safe: <span className="text-primary font-bold">{teamId}</span>
          </div>
        </div>

        {/* Right: Payment Form */}
        <Card className="gold-border bg-card border-primary/30">
          <CardHeader>
            <CardTitle className="text-primary">Finalize Trials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <div className="bg-white p-4 inline-block rounded-lg shadow-lg">
              <Image 
                src="https://picsum.photos/seed/vulnix_qr/300/300" 
                alt="UPI QR Code" 
                width={300} 
                height={300}
                className="mx-auto"
                data-ai-hint="QR code"
              />
            </div>
            <p className="text-sm text-muted-foreground uppercase tracking-widest">Scan to pay registration fee</p>
            
            <div className="space-y-2 text-left">
              <Label>Transaction ID (UTR)</Label>
              <Input 
                value={txnId}
                onChange={(e) => setTxnId(e.target.value)}
                placeholder="Enter 12-digit UTR number" 
                className="bg-black/50 border-primary/20 focus:border-primary text-center tracking-widest"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handlePaymentSubmit}
              className="w-full bg-primary hover:bg-primary/80 text-black font-black h-12 uppercase"
            >
              Confirm Registration
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
