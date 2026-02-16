import { ArrowLeft, ArrowRight, BarChart3, BrainCircuit, Code2, ShieldCheck, Timer, Trophy, Users } from 'lucide-react';

const timeline = [
  { phase: 'Round 1', detail: 'Problem release, team matching, and baseline model submission.', length: 'Week 1' },
  { phase: 'Round 2', detail: 'Model iteration, risk controls, and short technical review.', length: 'Week 2' },
  { phase: 'Round 3', detail: 'Live defense, robustness checks, and final ranking.', length: 'Week 3' },
];

const tracks = [
  {
    icon: BrainCircuit,
    title: 'Quant Research',
    text: 'Design alpha hypotheses, validate assumptions, and present statistical evidence clearly.',
  },
  {
    icon: BarChart3,
    title: 'Risk & Portfolio',
    text: 'Build risk overlays, position sizing logic, and scenario-based portfolio constraints.',
  },
  {
    icon: Code2,
    title: 'Systems & Execution',
    text: 'Implement reliable pipelines, simulation harnesses, and production-style reporting tools.',
  },
];

const judging = [
  'Research depth and model clarity',
  'Code quality and reproducibility',
  'Risk controls and interpretation',
  'Presentation quality and Q&A performance',
];

export default function CompetitionsPage() {
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
                Build Under Pressure
              </h1>
              <p className="body-text text-secondary-light mb-8">
                The FQE competition page centralizes everything: rules, schedule, judging criteria, and preparation expectations.
                Teams solve real quant prompts and defend their process in front of peers, alumni, and technical reviewers.
              </p>
              <div className="flex flex-col gap-4">
                <a href="mailto:baruchfqe@gmail.com?subject=Competition%20Interest" className="cta-button w-fit">
                  <span>Apply to Compete</span>
                  <ArrowRight size={16} />
                </a>
                <a href="#format" className="text-link inline-flex items-center gap-2">
                  <span>View Format</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="format" className="min-h-screen bg-secondary-dark relative flex items-center py-[12vh]">
          <div className="w-full px-[6vw] grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col justify-center">
              <span className="micro-label text-secondary-light mb-6">Format</span>
              <h2 className="headline-lg text-primary-light mb-6" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
                Timeline & Structure
              </h2>
              <p className="body-text text-secondary-light mb-8">
                Each cycle is designed to mirror a real project sprint: scoped problem, iterative progress checkpoints, and a final defense.
              </p>
              <div className="space-y-4">
                {timeline.map((item) => (
                  <div key={item.phase} className="border border-white/10 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="micro-label text-accent-green">{item.phase}</span>
                      <span className="micro-label text-secondary-light/70">{item.length}</span>
                    </div>
                    <p className="body-text text-secondary-light text-sm">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="photo-frame aspect-[3/4] max-h-[72vh]">
              <img src="/events_group.jpg" alt="Competition timeline discussion" className="w-full h-full object-cover" />
            </div>
          </div>
        </section>

        <section className="min-h-screen bg-primary-dark relative flex items-center py-[12vh]">
          <div className="w-full px-[6vw]">
            <div className="mb-10">
              <span className="micro-label text-secondary-light mb-4 block">Tracks</span>
              <h2 className="headline-lg text-primary-light" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
                What You Can Build
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
              {tracks.map((track) => (
                <div key={track.title} className="border border-white/10 p-6">
                  <track.icon className="text-accent-green mb-4" size={20} />
                  <p className="micro-label text-accent-green mb-3">{track.title}</p>
                  <p className="body-text text-secondary-light text-sm">{track.text}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="border border-white/10 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <ShieldCheck className="text-accent-green" size={18} />
                  <span className="micro-label text-accent-green">Judging Criteria</span>
                </div>
                <ul className="space-y-2">
                  {judging.map((item) => (
                    <li key={item} className="body-text text-secondary-light text-sm">{item}</li>
                  ))}
                </ul>
              </div>

              <div className="border border-white/10 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="text-accent-green" size={18} />
                  <span className="micro-label text-accent-green">Team Expectations</span>
                </div>
                <ul className="space-y-2 body-text text-secondary-light text-sm">
                  <li>2-4 members per team with defined owner roles.</li>
                  <li>Weekly updates and reproducible code checkpoints.</li>
                  <li>Clear assumptions, metrics, and failure analysis.</li>
                  <li>Respect deadlines and present concise tradeoffs.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-secondary-dark py-[12vh]">
          <div className="w-full px-[6vw] flex flex-col items-center text-center">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="text-accent-green" size={18} />
              <Timer className="text-accent-green" size={18} />
            </div>
            <h2 className="headline-lg text-primary-light mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              Ready for the Next Round?
            </h2>
            <p className="body-text text-secondary-light mb-8 max-w-2xl">
              If you want challenge-driven learning, this is the fastest path to sharpen your quantitative toolkit.
            </p>
            <a href="mailto:baruchfqe@gmail.com?subject=Competition%20Registration" className="cta-button w-fit">
              <span>Register Interest</span>
              <ArrowRight size={16} />
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
