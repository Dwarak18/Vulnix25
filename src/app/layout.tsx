
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google'; // Assuming Geist font setup
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Import Toaster
import Header from '@/components/sections/Header';
import LayoutClientWrapper from '@/components/common/LayoutClientWrapper'; // Import the wrapper
import BackgroundMusic from '@/components/common/BackgroundMusic'; // Import BackgroundMusic

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'VULNIX`26 | DSCET CyberSecurity', // Updated title
  description: 'VULNIX - College Symposium on Cybersecurity Awareness',
  icons: [
    // Reference the local icon file expected to be in the src/app directory
    { rel: 'icon', url: 'src/app/cybersecurity.ico' },
  ], // Ensures a specific favicon is linked via metadata

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      {/* Force dark theme based on cyberpunk palette */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Wrap Header and children in the client wrapper */}
        <LayoutClientWrapper>
           <div className="relative">
             <Header/>
             <main>{children}</main> {/* Wrap children in main */}
             <BackgroundMusic /> {/* Add the music component */}
           </div>
        </LayoutClientWrapper>
        <Toaster /> {/* Toaster remains outside the main conditional rendering */}
      </body>
    </html>
  );
}
