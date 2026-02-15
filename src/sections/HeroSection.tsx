import { ArrowRight, Github, Instagram, Linkedin, Mail } from 'lucide-react';

const matrixColumns = Array.from({ length: 48 }, (_, i) => ({
  id: i,
  left: `${(i / 48) * 100}%`,
  delay: `${-(i % 11) * 0.7}s`,
  duration: `${5 + (i % 5)}s`,
}));

const matrixGlyphs = '01011010\n11010001\n10100111\n01101001\n10010110\n11100010\n01011101\n00110110';

export default function HeroSection() {
  return (
    <section className="min-h-screen bg-primary-dark relative flex items-center">
      <div className="vignette" />
      <div className="matrix-rain" aria-hidden="true">
        {matrixColumns.map((column) => (
          <span
            key={column.id}
            className="matrix-column"
            style={{
              left: column.left,
              animationDelay: column.delay,
              animationDuration: column.duration,
            }}
          >
            {matrixGlyphs}
          </span>
        ))}
      </div>
      <div className="matrix-hotspot" aria-hidden="true" />

      <div className="relative w-full px-[6vw] py-[14vh] grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Photo Panel */}
        <div className="photo-frame relative z-0 aspect-[3/4] max-h-[72vh]">
          <img
            src="/hero_collaboration.jpg"
            alt="Students collaborating"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Content */}
        <div className="relative z-20 flex flex-col justify-center">
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
            <a href="#about" className="cta-button w-fit">
              <span>About Us</span>
              <ArrowRight size={16} />
            </a>
            <a href="#contact" className="text-link">
              Join the Club
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Socials */}
      <div className="absolute right-[6vw] bottom-[6vh] z-20 flex items-center gap-4">
        <a
          href="https://github.com/BaruchFinancialQuantsEngineers-FQE/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="FQE GitHub"
          className="text-secondary-light hover:text-accent-green transition-colors"
        >
          <Github size={18} strokeWidth={1.5} />
        </a>
        <a
          href="https://www.linkedin.com/company/fqe-baruch/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="FQE LinkedIn"
          className="text-secondary-light hover:text-accent-green transition-colors"
        >
          <Linkedin size={18} strokeWidth={1.5} />
        </a>
        <a
          href="https://www.instagram.com/baruchfqe/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="FQE Instagram"
          className="text-secondary-light hover:text-accent-green transition-colors"
        >
          <Instagram size={18} strokeWidth={1.5} />
        </a>
        <a
          href="mailto:baruchfqe@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Email FQE"
          className="text-secondary-light hover:text-accent-green transition-colors"
        >
          <Mail size={18} strokeWidth={1.5} />
        </a>
      </div>
    </section>
  );
}
