import { Github, Linkedin, Mail } from 'lucide-react';

export default function ClosingSection() {
  return (
    <section className="bg-primary-dark py-[8vh]">
      {/* Collage Strip */}
      <div className="flex justify-center gap-[3vw] px-[6vw] pb-[6vh]">
        <div className="photo-frame" style={{ width: '26vw', height: '34vh' }}>
          <img
            src="/closing_collage_01.jpg"
            alt="Workspace"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="photo-frame" style={{ width: '26vw', height: '38vh', marginTop: '-4vh' }}>
          <img
            src="/closing_collage_02.jpg"
            alt="Campus architecture"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="photo-frame" style={{ width: '26vw', height: '34vh' }}>
          <img
            src="/closing_collage_03.jpg"
            alt="Group study"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Closing Word */}
      <div className="text-center py-[6vh]">
        <h2
          className="headline-lg text-primary-light"
          style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}
        >
          Thanks for Stopping By
        </h2>
      </div>

      {/* Contact Block */}
      <div className="flex flex-col items-center pb-[6vh]">
        <a
          href="mailto:hello@fqe.club"
          className="micro-label text-accent-green mb-4 hover:underline"
        >
          hello@fqe.club
        </a>
        <p className="body-text text-secondary-light mb-6" style={{ fontSize: '0.9rem' }}>
          University Quantitative Club
        </p>

        {/* Social Icons */}
        <div className="flex items-center gap-6 mb-10">
          <a
            href="https://github.com/BaruchFinancialQuantsEngineers-FQE"
            target="_blank"
            rel="noreferrer"
            aria-label="FQE GitHub"
            className="text-secondary-light hover:text-accent-green transition-colors"
          >
            <Github size={20} strokeWidth={1.5} />
          </a>
          <a
            href="https://www.linkedin.com/company/fqe-baruch/"
            target="_blank"
            rel="noreferrer"
            aria-label="FQE LinkedIn"
            className="text-secondary-light hover:text-accent-green transition-colors"
          >
            <Linkedin size={20} strokeWidth={1.5} />
          </a>
          <a
            href="mailto:hello@fqe.club"
            aria-label="Email FQE"
            className="text-secondary-light hover:text-accent-green transition-colors"
          >
            <Mail size={20} strokeWidth={1.5} />
          </a>
        </div>

        {/* Footer Links */}
        <div className="flex items-center gap-6 mb-6">
          <a href="#" className="micro-label text-secondary-light/60 hover:text-secondary-light transition-colors">
            Privacy
          </a>
          <a href="#" className="micro-label text-secondary-light/60 hover:text-secondary-light transition-colors">
            Terms
          </a>
          <a href="#" className="micro-label text-secondary-light/60 hover:text-secondary-light transition-colors">
            Code of Conduct
          </a>
        </div>

        {/* Copyright */}
        <p className="micro-label text-secondary-light/40">
          FQE. Built by Students.
        </p>
      </div>
    </section>
  );
}
