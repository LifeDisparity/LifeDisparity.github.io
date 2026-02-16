import { useLayoutEffect } from 'react';
import { ArrowLeft, ArrowRight, CalendarDays, ShieldAlert, Trophy, Users } from 'lucide-react';

const deadlines = [
  'Application deadline - March 20th',
  'Notice of Acceptance & Coding Assessment - March 22nd',
  'Coding Assessment Due - March 27th',
  'Live Trading Day #1 - April 11th, 8am to 12pm',
  'Live Trading Day #2 - April 18th, 8am to 12pm',
  'Award Ceremony - April 18th, 1pm',
];

const structure = [
  {
    title: '1) Coding Assessment',
    points: [
      'Simple assessment to ensure the competition will be productive for all members.',
      'Straightforward problem expected to take about 2 to 3 hours to complete.',
    ],
  },
  {
    title: '2) Ramp Up, Trading Day #1',
    points: ['Creation of your trading strategy.'],
  },
  {
    title: '3) Trading Day #1',
    points: ['4 hour period.'],
  },
  {
    title: '4) Ramp Up, Trading Day #2',
    points: ['Refine your core strategy as necessary.'],
  },
  {
    title: '5) Trading Day #2',
    points: ['4 hour period of trading.'],
  },
];

const incentives = [
  'Prize pool of 300, 200, 100 for the top 3 teams',
  'Bragging rights and Linked-in feature on our page',
  'Resume building',
  'Published in our FQE website',
];

export default function CompetitionsPage() {
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
        <a href="#" className="text-link inline-flex items-center gap-2">
          <ArrowLeft size={14} />
          <span>Back to Main Site</span>
        </a>
      </div>

      <main>
        <section className="min-h-screen bg-primary-dark relative flex items-center py-[12vh]">
          <div className="w-full px-[6vw] grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="photo-frame aspect-[3/4] max-h-[72vh]">
              <img src="/resources_working.jpg" alt="Competition workspace" className="w-full h-full object-cover" />
            </div>

            <div className="flex flex-col justify-center">
              <span className="micro-label text-secondary-light mb-6">Competition</span>
              <h1 className="headline-xl text-primary-light mb-6" style={{ fontSize: 'clamp(2.4rem, 5vw, 4.5rem)' }}>
                1st Annual, FQE Undergraduate Trading Competition
              </h1>
              <p className="body-text text-secondary-light mb-8">
                Financial Quants & Engineers at Baruch are hosting a Trading Competition to give Baruch undergraduate students
                interested in trading the opportunity to work on a trading strategy in real time.
              </p>
              <p className="body-text text-secondary-light mb-8">
                To participate, we recommend that you know how to code and are a current undergraduate student at Baruch College.
              </p>
              <div className="flex flex-col gap-4">
                <a href="mailto:baruchfqe@gmail.com?subject=Competition%20Application" className="cta-button w-fit">
                  <span>Apply to Compete</span>
                  <ArrowRight size={16} />
                </a>
                <a href="#deadlines" className="text-link inline-flex items-center gap-2">
                  <span>View Deadlines</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="deadlines" className="min-h-screen bg-secondary-dark relative flex items-center py-[12vh]">
          <div className="w-full px-[6vw] grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col justify-center">
              <span className="micro-label text-secondary-light mb-6">Important Dates</span>
              <h2 className="headline-lg text-primary-light mb-6" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
                Important Deadlines
              </h2>
              <div className="space-y-3">
                {deadlines.map((item) => (
                  <div key={item} className="border border-white/10 p-4 flex items-start gap-3">
                    <CalendarDays className="text-accent-green mt-1" size={16} />
                    <p className="body-text text-secondary-light text-sm">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="photo-frame aspect-[3/4] max-h-[72vh]">
              <img src="/events_group.jpg" alt="Competition schedule planning" className="w-full h-full object-cover" />
            </div>
          </div>
        </section>

        <section className="min-h-screen bg-primary-dark relative flex items-center py-[12vh]">
          <div className="w-full px-[6vw]">
            <div className="mb-10">
              <span className="micro-label text-secondary-light mb-4 block">Competition Structure</span>
              <h2 className="headline-lg text-primary-light" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
                Divisions & Format
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="border border-white/10 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="text-accent-green" size={18} />
                  <span className="micro-label text-accent-green">Divisions</span>
                </div>
                <ul className="space-y-2 body-text text-secondary-light text-sm">
                  <li>Systematic</li>
                </ul>
              </div>

              <div className="border border-white/10 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="text-accent-green" size={18} />
                  <span className="micro-label text-accent-green">Group Size</span>
                </div>
                <ul className="space-y-2 body-text text-secondary-light text-sm">
                  <li>Maximum 3 people per team</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              {structure.map((step) => (
                <div key={step.title} className="border border-white/10 p-5">
                  <p className="micro-label text-accent-green mb-2">{step.title}</p>
                  <ul className="list-disc pl-6 space-y-1 body-text text-secondary-light text-sm">
                    {step.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-secondary-dark py-[12vh]">
          <div className="w-full px-[6vw] flex flex-col items-center text-center">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="text-accent-green" size={18} />
              <ShieldAlert className="text-accent-green" size={18} />
            </div>
            <h2 className="headline-lg text-primary-light mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              Evaluation & Incentives
            </h2>
            <p className="body-text text-secondary-light mb-4 max-w-3xl">
              The use of Artificial Intelligence to generate code is strictly forbidden. Use will immediately disqualify your team.
            </p>
            <p className="body-text text-secondary-light mb-6 max-w-3xl">
              Evaluation: Aaa
            </p>
            <ul className="space-y-2 body-text text-secondary-light text-sm mb-8 max-w-3xl">
              {incentives.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <a href="mailto:baruchfqe@gmail.com?subject=Competition%20Registration" className="cta-button w-fit">
              <span>Submit Application</span>
              <ArrowRight size={16} />
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
