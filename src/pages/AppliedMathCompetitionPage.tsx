import { useLayoutEffect } from 'react';
import { ArrowLeft, ArrowRight, Calculator, Clock3, Sigma, Trophy } from 'lucide-react';

const timeline = [
  'Application deadline: March 20th',
  'Acceptance notice: March 22nd',
  'Competition round schedule: shared after acceptance',
];

const topics = [
  'Probability and expected value',
  'Combinatorics and counting',
  'Sequences, growth, and bounds',
  'Optimization and logic-based modeling',
];

const format = [
  'Individual and/or team-based quantitative problem sets',
  'Timed rounds focused on structured reasoning',
  'Written solutions with clear assumptions and logic',
];

const prizes = [
  'Top placements recognized by FQE',
  'Resume signal for quantitative roles',
  'Featured highlights on FQE channels',
];

export default function AppliedMathCompetitionPage() {
  useLayoutEffect(() => {
    const previousRestoration = 'scrollRestoration' in window.history ? window.history.scrollRestoration : null;
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const forceTop = () => {
      const html = document.documentElement;
      const previousInlineBehavior = html.style.scrollBehavior;
      html.style.scrollBehavior = 'auto';
      window.scrollTo(0, 0);
      html.scrollTop = 0;
      document.body.scrollTop = 0;
      html.style.scrollBehavior = previousInlineBehavior;
    };

    forceTop();
    const rafId = window.requestAnimationFrame(forceTop);
    const intervalId = window.setInterval(forceTop, 50);
    const timeoutId = window.setTimeout(() => {
      window.clearInterval(intervalId);
      forceTop();
    }, 800);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearInterval(intervalId);
      window.clearTimeout(timeoutId);
      if (previousRestoration) {
        window.history.scrollRestoration = previousRestoration;
      }
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-primary-dark">
      <div className="grain-overlay" />

      <div className="fixed top-6 left-6 z-[200]">
        <a href="#" className="font-display text-xl font-bold text-primary-light tracking-tight hover:text-accent-green transition-colors">
          FQE
        </a>
      </div>

      <div className="fixed top-6 right-6 z-[200]">
        <a href="#competition" className="text-link inline-flex items-center gap-2">
          <ArrowLeft size={14} />
          <span>Back to Main Site</span>
        </a>
      </div>

      <main>
        <section className="min-h-screen bg-primary-dark relative flex items-center py-[12vh]">
          <div className="w-full px-[6vw] grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="photo-frame aspect-[3/4] max-h-[72vh]">
              <img src="/about_whiteboard.jpg" alt="Applied math competition prep" className="w-full h-full object-cover" />
            </div>

            <div className="flex flex-col justify-center">
              <span className="micro-label text-secondary-light mb-6">Competition</span>
              <h1 className="headline-xl text-primary-light mb-6" style={{ fontSize: 'clamp(2.4rem, 5vw, 4.5rem)', lineHeight: 1.04 }}>
                FQE Applied Math Competition
              </h1>
              <p className="body-text text-secondary-light mb-8">
                The Applied Math Competition focuses on quantitative problem solving, mathematical modeling,
                and clear communication of reasoning under time constraints.
              </p>
              <div className="flex flex-col gap-4">
                <a href="mailto:baruchfqe@gmail.com?subject=Applied%20Math%20Competition%20Application" className="cta-button w-fit">
                  <span>Apply to Compete</span>
                  <ArrowRight size={16} />
                </a>
                <a href="#timeline" className="text-link inline-flex items-center gap-2">
                  <span>View Timeline</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="timeline" className="bg-secondary-dark py-[12vh]">
          <div className="w-full px-[6vw] grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock3 className="text-accent-green" size={18} />
                <span className="micro-label text-accent-green">Timeline</span>
              </div>
              <ul className="space-y-2 body-text text-secondary-light text-sm">
                {timeline.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Sigma className="text-accent-green" size={18} />
                <span className="micro-label text-accent-green">Topics</span>
              </div>
              <ul className="space-y-2 body-text text-secondary-light text-sm">
                {topics.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Calculator className="text-accent-green" size={18} />
                <span className="micro-label text-accent-green">Format</span>
              </div>
              <ul className="space-y-2 body-text text-secondary-light text-sm">
                {format.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="text-accent-green" size={18} />
                <span className="micro-label text-accent-green">Prizes</span>
              </div>
              <ul className="space-y-2 body-text text-secondary-light text-sm">
                {prizes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
