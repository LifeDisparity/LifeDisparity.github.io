import { useEffect, useState } from 'react';
import './App.css';

import Navigation from './components/Navigation';
import HeroSection from './sections/HeroSection';
import ContentSection from './sections/ContentSection';
import ProjectsSection from './sections/ProjectsSection';
import AlumniSection from './sections/AlumniSection';
import LeadershipSection from './sections/BoardSection';
import ContactSection from './sections/ContactSection';
import ClosingSection from './sections/ClosingSection';
import TradingCompetitionPage from './pages/TradingCompetitionPage';
import AppliedMathCompetitionPage from './pages/AppliedMathCompetitionPage';
import { ArrowRight } from 'lucide-react';

const TRADING_COMP_HASH = '#/trading-competition';
const APPLIED_MATH_COMP_HASH = '#/applied-math-competition';
const LEGACY_COMP_HASH = '#/competitions';

type CompetitionView = 'main' | 'trading' | 'applied';

function getCompetitionView(hash: string): CompetitionView {
  if (hash === TRADING_COMP_HASH || hash === LEGACY_COMP_HASH) return 'trading';
  if (hash === APPLIED_MATH_COMP_HASH) return 'applied';
  return 'main';
}

function App() {
  const [competitionView, setCompetitionView] = useState<CompetitionView>(
    () => getCompetitionView(window.location.hash)
  );

  useEffect(() => {
    const handleHashChange = () => {
      setCompetitionView(getCompetitionView(window.location.hash));
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (competitionView !== 'main') {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  }, [competitionView]);

  if (competitionView === 'trading') {
    return <TradingCompetitionPage />;
  }

  if (competitionView === 'applied') {
    return <AppliedMathCompetitionPage />;
  }

  return (
    <div className="relative">
      {/* Grain Overlay */}
      <div className="grain-overlay" />

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main>
        {/* Hero */}
        <HeroSection />

        {/* About */}
        <ContentSection
          id="about"
          layout="right-photo"
          microLabel="About"
          headline=" FQE @ Baruch College"
          body="FQE is a student collective building at the intersection of quantitative finance and technology. We develop technical skill and professional network through hands-on research, data science, risk modeling, and algorithmic trading."
          imageSrc="/about_whiteboard.jpg"
          imageAlt="Student writing on whiteboard"
          items={[
            { label: 'Workshops', description: 'Applied sessions in quantitative modeling, stochastic methods, and production-ready data pipelines.' },
            { label: 'Projects', description: 'End-to-end research, backtests, and deployable trading systems.' },
            { label: 'Mentorship', description: 'Direct access to alumni, faculty, and industry leaders shaping the future of finance.' },
          ]}
        />

        {/* Projects */}
        <ProjectsSection />

        {/* Competition */}
        <section
          id="competition"
          className="min-h-screen bg-primary-dark relative flex items-center py-[12vh]"
        >
          <div className="w-full px-[6vw]">
            <div className="max-w-4xl">
              <span className="micro-label text-secondary-light mb-6 block">
                Competition
              </span>
              <h2 className="headline-lg text-primary-light mb-6" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
                FQE Competition Tracks
              </h2>
              <p className="body-text text-secondary-light mb-10">
                FQE runs two competition tracks for undergraduates: Trading Competition and Applied Math Competition.
                Explore each page for details, format, and deadlines.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="border border-white/10 p-6">
                <span className="micro-label text-accent-green mb-3 block">Trading</span>
                <p className="body-text text-secondary-light mb-6">
                  Build and iterate on a live trading strategy with structured milestones and team-based execution.
                </p>
                <a href={TRADING_COMP_HASH} className="cta-button w-fit">
                  <span>Trading Competition</span>
                  <ArrowRight size={16} />
                </a>
              </div>

              <div className="border border-white/10 p-6">
                <span className="micro-label text-accent-green mb-3 block">Applied Math</span>
                <p className="body-text text-secondary-light mb-6">
                  Solve quantitative math and modeling problems that emphasize rigor, logic, and problem-solving speed.
                </p>
                <a href={APPLIED_MATH_COMP_HASH} className="cta-button w-fit">
                  <span>Applied Math Competition</span>
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Alumni */}
        <AlumniSection />

        {/* Leadership */}
        <LeadershipSection />

        {/* Events */}
        <ContentSection
          id="events"
          layout="right-photo"
          microLabel="Events"
          headline="Join Us For"
          body="Ongoing technical programming, collaborative research projects, and curated industry engagements."
          imageSrc="/events_group.jpg"
          imageAlt="Group collaboration"
          items={[
            { label: 'Workshops', description: 'Hackathons, resume reviews, LeetCode sessions, and more.' },
            { label: 'Alumni & Networking', description: 'In-person bank visits, guest speakers, and industry connections.' },
            { label: 'Team Bonding', description: 'Poker nights and social events that strengthen collaboration.' },
            { label: 'Education Events', description: 'Math primers and technical learning sessions.' },
          ]}
          ctaText="See the Calendar"
        />

        {/* Contact */}
        <ContactSection />

        {/* Closing */}
        <ClosingSection />
      </main>
    </div>
  );
}

export default App;
