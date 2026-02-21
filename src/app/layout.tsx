
import type { Metadata } from 'next';
import { Roboto_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Header from '@/components/sections/Header';
import LayoutClientWrapper from '@/components/common/LayoutClientWrapper';
import BackgroundMusic from '@/components/common/BackgroundMusic';

const robotoMono = Roboto_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'VULNIX`25 | CYZOR & CYBEXA',
  description: 'VULNIX - College Symposium on Cybersecurity Awareness',
  icons: [
    { rel: 'icon', url: '/cybersecurity.ico' },
  ],

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${robotoMono.variable} font-mono antialiased`}>
        <LayoutClientWrapper>
           <div className="relative">
             <Header/>
             <main>{children}</main>
             <BackgroundMusic />
           </div>
        </LayoutClientWrapper>
        <Toaster />
      </body>
    </html>
  );
}
