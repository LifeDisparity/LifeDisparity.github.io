import { useEffect, useRef } from 'react';
import { ArrowRight, Github, Instagram, Linkedin, Mail } from 'lucide-react';

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = section.offsetWidth;
      canvas.height = section.offsetHeight;
    };

    setCanvasSize();

    const letters = '\u03B1\u03B2\u03B3\u03B4\u03B5\u03B6\u03B7\u03B8\u03B9\u03BA\u03BB\u03BC\u03BD\u03BE\u03BF\u03C0\u03C1\u03C3\u03C4\u03C5\u03C6\u03C7\u03C8\u03C9\u0391\u0392\u0393\u0394\u0395\u0396\u0397\u0398\u0399\u039A\u039B\u039C\u039D\u039E\u039F\u03A0\u03A1\u03A3\u03A4\u03A5\u03A6\u03A7\u03A8\u03A9\u2202\u2206\u2207\u222B\u2211\u220F\u221E\u2248\u2260\u2261\u2264\u2265\u221A\u221D%01'.split('');
    const fontSize = 10;
    ctx.font = `${fontSize}px "IBM Plex Mono", monospace`;

    let columns = canvas.width / fontSize;
    let drops: number[] = [];
    for (let i = 0; i < columns; i += 1) {
      drops[i] = 1;
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, .1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < drops.length; i += 1) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillStyle = '#0f0';
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        drops[i] += 1;
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.95) {
          drops[i] = 0;
        }
      }
    };

    const intervalId = window.setInterval(draw, 28);

    const handleResize = () => {
      if (window.innerWidth > 768) {
        setCanvasSize();
        ctx.font = `${fontSize}px "IBM Plex Mono", monospace`;
        columns = canvas.width / fontSize;
        drops = [];
        for (let i = 0; i < columns; i += 1) {
          drops[i] = 1;
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section
      id="canvas-section"
      ref={sectionRef}
      className="min-h-screen bg-primary-dark relative flex items-center"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 w-full h-full pointer-events-none"
        aria-hidden="true"
      />
      <div className="vignette" />

      <div className="relative z-20 w-full px-[6vw] py-[14vh] grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Photo Panel */}
        <div className="photo-frame aspect-[3/4] max-h-[72vh]">
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
