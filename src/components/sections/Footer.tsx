import React from 'react';
import { Linkedin, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: 'Instagram', icon: Instagram, url: 'https://www.instagram.com/vulnix25?igsh=MThkd3pqcWxqNTk1eg%3D%3D' },
    { name: 'LinkedIn', icon: Linkedin, url: 'https://www.linkedin.com/in/3105-149cybersecurity' },
  ];

  return (
    <footer className="relative py-8 bg-transparent text-muted-foreground mt-20">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[1px] w-3/4 max-w-5xl bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center space-x-4 mb-6">
          {socialLinks.map((link) => (
            <Button
              key={link.name}
              variant="ghost"
              size="icon"
              asChild
              className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full"
            >
              <a href={link.url} target="_blank" rel="noopener noreferrer" aria-label={`Visit our ${link.name}`}>
                <link.icon className="h-5 w-5" />
              </a>
            </Button>
          ))}
        </div>
        <p className="text-sm">
          &copy; {currentYear} VULNIX'25 | Department of Cybersecurity, DSCET.
        </p>
         <p className="text-xs mt-2">
           Designed By <span className="text-primary font-heading">&lt;/DWARAK&gt;</span>.
         </p>
      </div>
    </footer>
  );
};

export default Footer;
