import './App.css';

import Navigation from './components/Navigation';
import HeroSection from './sections/HeroSection';
import ContentSection from './sections/ContentSection';
import ProjectsSection from './sections/ProjectsSection';
import AlumniSection from './sections/AlumniSection';
import BoardSection from './sections/BoardSection';
import ContactSection from './sections/ContactSection';
import ClosingSection from './sections/ClosingSection';

function App() {
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
          body="FQE is a student collective that applies theory to practice. We use stochastic calculus, machine learning, and systems programming to solve real-world finance problems."
          imageSrc="/about_whiteboard.jpg"
          imageAlt="Student writing on whiteboard"
          items={[
            { label: 'Workshops', description: 'Hands-on quant modeling and data pipeline sessions.' },
            { label: 'Projects', description: 'End-to-end research, backtests, and deployable tools.' },
            { label: 'Mentorship', description: 'Alumni and faculty guidance for career paths.' },
          ]}
        />

        {/* Projects */}
        <ProjectsSection />

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
