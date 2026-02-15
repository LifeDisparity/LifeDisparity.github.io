import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="min-h-screen bg-primary-dark relative flex items-center">
      <div className="vignette" />

      <div className="w-full px-[6vw] py-[14vh] grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Photo Panel */}
        <div className="photo-frame aspect-[3/4] max-h-[72vh]">
          <img
            src="/hero_collaboration.jpg"
            alt="Students collaborating"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Content */}
        <div className="flex flex-col justify-center">
          {/* Micro Label */}
          <span className="micro-label text-secondary-light mb-6">
            Baruch's Quantitative Club
          </span>

          {/* Headline */}
          <h1 className="headline-xl text-primary-light mb-8" style={{ fontSize: 'clamp(2.5rem, 5.5vw, 5rem)' }}>
            <span className="block">Financial</span>
            <span className="block">Quants &</span>
            <span className="block">Engineers</span>
          </h1>

          {/* Subheadline */}
          <p className="body-text text-secondary-light mb-8 max-w-md" style={{ fontSize: '1.05rem' }}>
            We build models, write code, and trade ideas across math, data, and markets.
          </p>

          {/* CTAs */}
          <div className="flex flex-col gap-4">
            <a href="#projects" className="cta-button w-fit">
              <span>Explore Projects</span>
              <ArrowRight size={16} />
            </a>
            <a href="#contact" className="text-link">
              Join the Club
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Socials */}
      <div className="absolute right-[6vw] bottom-[6vh] flex items-center gap-4">
        <a href="#" className="text-secondary-light hover:text-accent-green transition-colors">
          <Github size={18} strokeWidth={1.5} />
        </a>
        <a href="https://www.linkedin.com/company/fqe-baruch/" className="text-secondary-light hover:text-accent-green transition-colors">
          <Linkedin size={18} strokeWidth={1.5} />
        </a>
        <a href="#" className="text-secondary-light hover:text-accent-green transition-colors">
          <Mail size={18} strokeWidth={1.5} />
        </a>
      </div>
    </section>
  );
}
