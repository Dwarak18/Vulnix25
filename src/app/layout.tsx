
import type { Metadata } from 'next';
import { Orbitron, Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Header from '@/components/sections/Header';
import LayoutClientWrapper from '@/components/common/LayoutClientWrapper';
import { cn } from '@/lib/utils';

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['400', '700', '900'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: "VULNIX'25 | Past Event Showcase",
  description: 'VULNIX’25 – Where Vulnerabilities Met Vision. A look back at the flagship cybersecurity symposium.',
  icons: [{ rel: 'icon', url: '/cybersecurity.ico' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn(
        'antialiased',
        orbitron.variable,
        inter.variable
      )}>
        <LayoutClientWrapper>
           <div className="relative font-body">
             <Header/>
             <main>{children}</main>
           </div>
        </LayoutClientWrapper>
        <Toaster />
      </body>
    </html>
  );
}
