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
          body="The Financial Quants and Engineers club will develop students' technical skills and network at the intersection of quantitative finance and technology. Members will work on a variety of projects within data science, risk analysis, quantitative modeling, and algorithmic trading. The main goal of the organization is to provide the necessary exposure and skills for students to gain roles in quantitative fields. FQE regularly hosts seminars, organizes discussions with leading professors, and offers opportunities for members to work on innovative projects, providing valuable hands-on experience. Our goal is to empower the next generation of quants to lead and innovate in the ever-evolving landscape of finance and technology."
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
