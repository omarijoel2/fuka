import React from "react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="font-serif text-xl font-bold mb-4 text-white">Kaimosi Friends University</h3>
            <p className="text-primary-foreground/80 mb-4 text-sm">
              Spring of Knowledge. A Quaker-founded public university established in 2014, committed to truth and service.
            </p>
            <div className="space-y-2 text-sm text-primary-foreground/80">
              <p>P.O BOX 385 – 50309</p>
              <p>Kaimosi, Kenya</p>
              <p>+254 777 373 633</p>
              <p>info@kafu.ac.ke</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 text-white uppercase tracking-wider text-sm">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-primary-foreground/80 hover:text-accent transition-colors" data-testid="footer-link-about">About KAFU</Link></li>
              <li><Link href="/admissions" className="text-primary-foreground/80 hover:text-accent transition-colors" data-testid="footer-link-admissions">Admissions</Link></li>
              <li><Link href="/programmes" className="text-primary-foreground/80 hover:text-accent transition-colors" data-testid="footer-link-programmes">Academic Programmes</Link></li>
              <li><Link href="/schools" className="text-primary-foreground/80 hover:text-accent transition-colors" data-testid="footer-link-schools">Schools & Faculties</Link></li>
              <li><Link href="/opportunities" className="text-primary-foreground/80 hover:text-accent transition-colors" data-testid="footer-link-opportunities">Careers & Tenders</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 text-white uppercase tracking-wider text-sm">Portals</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="https://portal.kafu.ac.ke" target="_blank" rel="noreferrer" className="text-primary-foreground/80 hover:text-accent transition-colors" data-testid="footer-link-portal">Student Portal</a></li>
              <li><a href="https://elearning.kafu.ac.ke" target="_blank" rel="noreferrer" className="text-primary-foreground/80 hover:text-accent transition-colors" data-testid="footer-link-elearning">E-Learning Portal</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors" data-testid="footer-link-staff">Staff Portal</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors" data-testid="footer-link-alumni">Alumni Portal</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-white uppercase tracking-wider text-sm">Connect</h4>
            <p className="text-primary-foreground/80 mb-4 text-sm">Follow us on our official social media channels to stay updated.</p>
            <div className="flex gap-4">
              {/* Simplified social icons for footer */}
              <a href="#" className="w-8 h-8 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-primary transition-colors">F</a>
              <a href="#" className="w-8 h-8 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-primary transition-colors">X</a>
              <a href="#" className="w-8 h-8 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-primary transition-colors">in</a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} Kaimosi Friends University. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
