import React from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown, MapPin, Phone, Mail } from "lucide-react";
import { Button } from "./ui/button";

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [location] = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Schools", path: "/schools" },
    { name: "Programmes", path: "/programmes" },
    { name: "Admissions", path: "/admissions" },
    { name: "Student Life", path: "/student-services" },
    { name: "News", path: "/news" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-background">
      {/* Utility Bar */}
      <div className="bg-primary text-primary-foreground py-1 md:py-2 text-xs md:text-sm">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 opacity-90"><MapPin className="w-3 h-3" /> P.O BOX 385 – 50309, Kaimosi</span>
            <span className="flex items-center gap-1 opacity-90 hidden md:flex"><Phone className="w-3 h-3" /> +254 777 373 633</span>
          </div>
          <div className="flex items-center gap-3 font-medium">
            <a href="https://portal.kafu.ac.ke" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors" data-testid="link-student-portal">Student Portal</a>
            <span className="opacity-40">|</span>
            <a href="https://elearning.kafu.ac.ke" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors" data-testid="link-elearning">E-Learning</a>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3" data-testid="link-home-logo">
          <img 
            src="https://kafu.ac.ke/wp-content/uploads/2025/10/logo-updated-750x126.png" 
            alt="KAFU Logo" 
            className="h-10 md:h-12 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              e.currentTarget.parentElement?.classList.add('fallback-logo');
            }}
          />
          <div className="hidden fallback-logo:block">
            <span className="font-serif text-2xl font-bold text-primary dark:text-white">KAFU</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              href={link.path}
              data-testid={`link-nav-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <Button 
                variant="ghost" 
                className={`text-sm font-medium ${location === link.path ? 'text-accent bg-accent/10' : 'text-foreground hover:text-primary'}`}
              >
                {link.name}
              </Button>
            </Link>
          ))}
          <Button asChild className="ml-4 bg-accent text-accent-foreground hover:bg-accent/90" data-testid="button-apply-now">
            <a href="https://portal.kafu.ac.ke" target="_blank" rel="noreferrer">Apply Now</a>
          </Button>
        </nav>

        {/* Mobile Toggle */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden" 
          onClick={() => setIsOpen(!isOpen)}
          data-testid="button-mobile-menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="lg:hidden border-t p-4 bg-white dark:bg-background flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              href={link.path}
              data-testid={`link-mobile-nav-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setIsOpen(false)}
            >
              <div className={`p-3 rounded-md text-sm font-medium ${location === link.path ? 'bg-accent/10 text-accent' : 'hover:bg-muted'}`}>
                {link.name}
              </div>
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
