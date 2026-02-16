import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Competions', href: '#competition' },
  { label: 'Alumni', href: '#alumni' },
  { label: 'Board', href: '#board' },
  { label: 'Contact', href: '#contact' },
];

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Logo */}
      <div className="fixed top-6 left-6 z-[200]">
        <a 
          href="#" 
          className="font-display text-xl font-bold text-primary-light tracking-tight hover:text-accent-green transition-colors"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          FQE
        </a>
      </div>

      {/* Desktop Navigation */}
      <nav className="fixed top-6 right-6 z-[200] hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            onClick={(e) => handleNavClick(e, link.href)}
            className="nav-link"
          >
            {link.label}
          </a>
        ))}
      </nav>

      {/* Mobile Menu Button */}
      <button
        className="fixed top-6 right-6 z-[200] md:hidden p-2 text-primary-light"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-[150] bg-primary-dark/95 backdrop-blur-sm md:hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="font-display text-2xl font-bold text-primary-light hover:text-accent-green transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
