import { ArrowRight, Mail } from 'lucide-react';

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="min-h-screen bg-primary-dark relative flex items-center py-[12vh]"
    >
      <div className="w-full px-[6vw] grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Text Block */}
        <div className="flex flex-col justify-center">
          {/* Micro Label */}
          <span className="micro-label text-secondary-light mb-6">
            Contact
          </span>

          {/* Headline */}
          <h2 className="headline-lg text-primary-light mb-6" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
            Ready to Build?
          </h2>

          {/* Body */}
          <p className="body-text text-secondary-light mb-10">
            Whether you are writing your first backtest or optimizing execution, there is a seat at the table.
          </p>

          {/* Primary CTA */}
          <a 
            href="mailto:hello@fqe.club" 
            className="cta-button mb-4 w-fit"
          >
            <span>Apply to Join</span>
            <ArrowRight size={16} />
          </a>

          {/* Secondary CTA */}
          <div className="mt-6">
            <a href="mailto:hello@fqe.club" className="text-link inline-flex items-center gap-2">
              <Mail size={14} />
              <span>Email the Board</span>
            </a>
          </div>

          {/* Note */}
          <p className="micro-label text-secondary-light/60 mt-8">
            Applications open each term. No prior finance experience required.
          </p>
        </div>

        {/* Photo Panel */}
        <div className="photo-frame aspect-[3/4] max-h-[72vh]">
          <img
            src="/contact_join.jpg"
            alt="Students collaborating"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
