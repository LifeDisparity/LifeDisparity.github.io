import './App.css';

import Navigation from './components/Navigation';
import HeroSection from './sections/HeroSection';
import ContentSection from './sections/ContentSection';
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
        <ContentSection
          id="projects"
          layout="left-photo"
          microLabel="Projects"
          headline="Projects That Matter"
          body="From alpha research to execution systems. Our work is built to be tested, iterated, and shipped."
          imageSrc="/projects_laptop.jpg"
          imageAlt="Coding on laptop"
          items={[
            { label: 'Volatility Surface', description: 'Calibration and visualization toolkit for equity options.' },
            { label: 'StatArb Backtester', description: 'Pairs-trading engine with risk overlays and reporting.' },
            { label: 'ML Order Flow', description: 'Microstructure classifier for regime detection.' },
          ]}
          ctaText="View on GitHub"
          ctaHref="https://github.com"
        />

        {/* Alumni */}
        <ContentSection
          id="alumni"
          background="secondary"
          layout="right-photo"
          microLabel="Alumni"
          headline="Where Members Go"
          body="Our graduates work in quantitative research, trading, data science, and engineering at firms that value rigor."
          imageSrc="/alumni_campus.jpg"
          imageAlt="Campus scene"
          items={[
            { label: 'Buy-Side', description: 'Hedge funds and asset managers' },
            { label: 'Sell-Side', description: 'Quantitative research and trading desks' },
            { label: 'Tech / Fintech', description: 'Data science and infrastructure roles' },
          ]}
          ctaText="Read Alumni Stories"
        />

        {/* Board */}
        <ContentSection
          id="board"
          layout="left-photo"
          microLabel="Board"
          headline="Meet the Board"
          body="A small team focused on building things that work and helping others learn."
          imageSrc="/board_portrait.jpg"
          imageAlt="Board member portrait"
          items={[
            { label: 'President', description: 'Strategy, partnerships, and club direction.' },
            { label: 'VP Projects', description: 'Research pipelines and code quality.' },
            { label: 'VP Education', description: 'Workshops, curriculum, and mentorship.' },
            { label: 'VP Outreach', description: 'Events, recruiting, and alumni relations.' },
          ]}
          ctaText="Contact the Board"
          ctaHref="mailto:hello@fqe.club"
        />

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

        {/* Resources */}
        <ContentSection
          id="resources"
          background="secondary"
          layout="left-photo"
          microLabel="Resources"
          headline="Tools We Use"
          body="A shared stack for research, collaboration, and shipping real systems."
          imageSrc="/resources_working.jpg"
          imageAlt="Student working"
          items={[
            { label: 'Code Repos', description: 'Templates, backtesters, and notebooks.' },
            { label: 'Data Access', description: 'Curated datasets and vendor partnerships.' },
            { label: 'Compute', description: 'Cloud notebooks and simulation environments.' },
          ]}
          ctaText="Browse Resources"
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
