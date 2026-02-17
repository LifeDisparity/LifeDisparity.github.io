import { useLayoutEffect } from 'react';
import { ArrowLeft, ArrowRight, Calculator, Clock3, ShieldAlert, Sigma, Trophy, Users } from 'lucide-react';

const deadlines = [
  'Application deadline: March 20th',
  'Notice of acceptance and coding assessment: March 22nd',
  'Coding assessment due: March 27th',
  'Live Trading Day #1: April 11th, 8am to 12pm',
  'Live Trading Day #2: April 18th, 8am to 12pm',
  'Award ceremony: April 18th, 1pm',
];

const setup = [
  'Systematic division',
  'Maximum three people per team',
  'Current Baruch undergraduate students',
  'Basic coding knowledge is strongly recommended',
];

const phases = [
  {
    phase: 'Phase 0',
    title: 'Coding Assessment',
    duration: 'Pre-competition',
    details: [
      'Complete a practical coding assessment before live trading.',
      'Assessment is designed as a quick screening challenge (about 2 to 3 hours).',
    ],
  },
  {
    phase: 'Phase 1',
    title: 'Ramp Up and Strategy Build',
    duration: 'Before Trading Day #1',
    details: [
      'Design your initial trading strategy and assumptions.',
      'Prepare execution logic and core risk controls.',
    ],
  },
  {
    phase: 'Phase 2',
    title: 'Live Trading Day #1',
    duration: '4 Hours',
    details: [
      'Run and monitor strategy performance in real time.',
      'Document observations and identify model adjustments.',
    ],
  },
  {
    phase: 'Phase 3',
    title: 'Refinement and Trading Day #2',
    duration: 'Ramp Up + 4 Hours',
    details: [
      'Refine your strategy based on Day #1 outcomes.',
      'Execute final live trading session and submit final results.',
    ],
  },
];

const rubric = [
  { category: 'Coding Assessment', score: '1 to 10', weight: '25%' },
  { category: 'Strategy Design and Logic', score: '1 to 10', weight: '20%' },
  { category: 'Execution and Performance', score: '1 to 10', weight: '20%' },
  { category: 'Risk Management', score: '1 to 5', weight: '15%' },
  { category: 'Adaptability Across Trading Days', score: '1 to 5', weight: '10%' },
  { category: 'Communication and Technical Q&A', score: '1 to 5', weight: '10%' },
];

const incentives = [
  'Prize pool of 300, 200, 100 for the top 3 teams',
  'Bragging rights and LinkedIn feature on FQE channels',
  'Resume building experience',
  'Published on the FQE website',
];

export default function TradingCompetitionPage() {
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
              <img src="/resources_working.jpg" alt="Trading competition workspace" className="w-full h-full object-cover" />
            </div>

            <div className="flex flex-col justify-center">
              <span className="micro-label text-secondary-light mb-6">Competition</span>
              <h1 className="headline-xl text-primary-light mb-6" style={{ fontSize: 'clamp(2.3rem, 5vw, 4.4rem)', lineHeight: 1.04 }}>
                FQE Undergraduate Trading Competition
              </h1>
              <p className="body-text text-secondary-light mb-6">
                Financial Quants & Engineers at Baruch are hosting a Trading Competition to give
                undergraduate students the opportunity to build and run trading strategies in real time.
              </p>
              <p className="body-text text-secondary-light mb-8">
                Teams move from coding assessment to two live trading sessions, with iterative strategy
                refinement and technical evaluation throughout the process.
              </p>
              <div className="flex flex-col gap-4">
                <a href="mailto:baruchfqe@gmail.com?subject=Trading%20Competition%20Application" className="cta-button w-fit">
                  <span>Apply to Compete</span>
                  <ArrowRight size={16} />
                </a>
                <a href="#structure" className="text-link inline-flex items-center gap-2">
                  <span>View Structure</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="requirements" className="bg-secondary-dark py-[12vh]">
          <div className="w-full px-[6vw] grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="text-accent-green" size={18} />
                <span className="micro-label text-accent-green">Eligibility and Setup</span>
              </div>
              <ul className="space-y-2 body-text text-secondary-light text-sm">
                {setup.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock3 className="text-accent-green" size={18} />
                <span className="micro-label text-accent-green">Important Dates</span>
              </div>
              <ul className="space-y-2 body-text text-secondary-light text-sm">
                {deadlines.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="w-full px-[6vw] mt-8">
            <div className="border border-red-400/40 bg-red-500/5 p-5">
              <div className="flex items-center gap-3 mb-3">
                <ShieldAlert className="text-red-300" size={18} />
                <span className="micro-label text-red-300">Integrity Policy</span>
              </div>
              <p className="body-text text-secondary-light text-sm">
                The use of Artificial Intelligence to generate code is strictly prohibited.
                Teams found using AI-generated code will be immediately disqualified.
              </p>
            </div>
          </div>
        </section>

        <section id="structure" className="bg-primary-dark py-[12vh]">
          <div className="w-full px-[6vw]">
            <div className="mb-10">
              <span className="micro-label text-secondary-light mb-4 block">Competition Structure</span>
              <h2 className="headline-lg text-primary-light" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
                Trading Workflow
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {phases.map((phase) => (
                <div key={phase.phase} className="border border-white/10 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Sigma className="text-accent-green" size={16} />
                    <span className="micro-label text-accent-green">{phase.phase}</span>
                  </div>
                  <p className="font-display font-semibold text-primary-light mb-1">{phase.title}</p>
                  <p className="micro-label text-secondary-light mb-3">{phase.duration}</p>
                  <ul className="list-disc pl-5 space-y-1 body-text text-secondary-light text-sm">
                    {phase.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="evaluation" className="bg-secondary-dark py-[12vh]">
          <div className="w-full px-[6vw]">
            <div className="mb-8">
              <span className="micro-label text-secondary-light mb-4 block">Evaluation Rubric</span>
              <h2 className="headline-lg text-primary-light" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
                Scoring Framework
              </h2>
            </div>

            <div className="border border-white/10 overflow-hidden">
              <div className="grid grid-cols-12 border-b border-white/10 bg-primary-dark/40">
                <div className="col-span-6 p-4 micro-label text-accent-green">Category</div>
                <div className="col-span-3 p-4 micro-label text-accent-green">Score</div>
                <div className="col-span-3 p-4 micro-label text-accent-green">Weight</div>
              </div>

              {rubric.map((item) => (
                <div key={item.category} className="grid grid-cols-12 border-b last:border-b-0 border-white/10">
                  <div className="col-span-6 p-4 body-text text-secondary-light text-sm">{item.category}</div>
                  <div className="col-span-3 p-4 body-text text-secondary-light text-sm">{item.score}</div>
                  <div className="col-span-3 p-4 body-text text-secondary-light text-sm">{item.weight}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-primary-dark py-[12vh]">
          <div className="w-full px-[6vw] grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Calculator className="text-accent-green" size={18} />
                <span className="micro-label text-accent-green">Live Sessions</span>
              </div>
              <p className="body-text text-secondary-light text-sm">
                Teams participate in two 4-hour live trading sessions with a ramp-up period between sessions
                to refine strategies and improve execution quality.
              </p>
            </div>

            <div className="border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="text-accent-green" size={18} />
                <span className="micro-label text-accent-green">Incentives</span>
              </div>
              <ul className="space-y-2 body-text text-secondary-light text-sm">
                {incentives.map((item) => (
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
