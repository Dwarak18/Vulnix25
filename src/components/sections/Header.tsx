
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { motion } from 'framer-motion';

const navItems = [
  { href: "/#about", label: "About" },
  { href: "/#events", label: "Events" },
  { href: "/#gallery", label: "Highlights" },
  { href: "/#timeline", label: "Timeline" },
  { href: "/#brainstormx", label: "BrainstormX" },
];

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/80 backdrop-blur-lg border-b border-border/50' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-heading text-2xl font-bold text-primary text-glow">
          VULNIX'25
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex items-center space-x-8">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                  >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Navigation Trigger */}
        <div className="md:hidden">
           <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
             <SheetTrigger asChild>
               <Button variant="ghost" size="icon" className="text-foreground hover:text-primary">
                 <Menu className="h-6 w-6" />
                 <span className="sr-only">Toggle Menu</span>
               </Button>
             </SheetTrigger>
             <SheetContent side="right" className="w-[280px] p-6 bg-background/90 backdrop-blur-xl">
                <div className="mb-12">
                   <Link href="/" className="font-heading text-3xl font-bold text-primary text-glow" onClick={() => setIsMobileMenuOpen(false)}>
                     VULNIX'25
                   </Link>
                </div>
                <nav>
                  <ul className="flex flex-col space-y-6">
                    {navItems.map((item) => (
                      <li key={item.href}>
                         <SheetClose asChild>
                           <Link
                             href={item.href}
                             className="block py-2 text-xl text-foreground hover:text-primary transition-colors"
                             onClick={() => setIsMobileMenuOpen(false)}
                           >
                             {item.label}
                           </Link>
                         </SheetClose>
                      </li>
                    ))}
                  </ul>
                </nav>
             </SheetContent>
           </Sheet>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
