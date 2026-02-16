import { useEffect, useState } from 'react';
import './App.css';

import Navigation from './components/Navigation';
import HeroSection from './sections/HeroSection';
import ContentSection from './sections/ContentSection';
import ProjectsSection from './sections/ProjectsSection';
import AlumniSection from './sections/AlumniSection';
import BoardSection from './sections/BoardSection';
import ContactSection from './sections/ContactSection';
import ClosingSection from './sections/ClosingSection';
import CompetitionsPage from './pages/CompetitionsPage';

const COMPETITIONS_HASH = '#/competitions';

function App() {
  const [isCompetitionsPage, setIsCompetitionsPage] = useState(
    () => window.location.hash === COMPETITIONS_HASH
  );

  useEffect(() => {
    const handleHashChange = () => {
      setIsCompetitionsPage(window.location.hash === COMPETITIONS_HASH);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (isCompetitionsPage) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  }, [isCompetitionsPage]);

  if (isCompetitionsPage) {
    return <CompetitionsPage />;
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
          headline="We Are Builders"
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
        <ContentSection
          id="competition"
          layout="right-photo"
          microLabel="Competition"
          headline="1st Annual Undergraduate Trading Competition"
          body="FQE is hosting a trading competition for current Baruch undergraduates interested in building and testing a trading strategy in real time."
          imageSrc="/resources_working.jpg"
          imageAlt="Students working with laptops and notebooks"
          items={[
            { label: 'Eligibility', description: 'Current Baruch undergraduate students. Coding knowledge is strongly recommended.' },
            { label: 'Key Dates', description: 'Application deadline: March 20th.' },
            { label: 'Prizes', description: 'Prize pool: 300, 200, 100 for top 3 teams, plus recognition and resume-building exposure.' },
          ]}
          ctaText="Learn More"
          ctaHref={COMPETITIONS_HASH}
          ctaVariant="button"
        />

        {/* Alumni */}
        <AlumniSection />

        {/* Board */}
        <BoardSection />

        {/* Events */}
        <ContentSection
          id="events"
          layout="right-photo"
          microLabel="Events"
          headline="Events That Level You Up"
          body="Weekly builds, term-long research sprints, and open sessions for anyone curious."
          imageSrc="/events_group.jpg"
          imageAlt="Group collaboration"
          items={[
            { label: 'Quant Lab', description: 'Weekly coding and modeling sessions.' },
            { label: 'Alumni Fireside', description: 'Career paths and interview prep.' },
            { label: 'Case Competition', description: 'Team-based research and presentation.' },
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
