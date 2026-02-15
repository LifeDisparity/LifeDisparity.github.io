import { useState } from 'react';
import { ArrowRight, X, ExternalLink } from 'lucide-react';

const projects = [
  {
    id: 1,
    label: 'Kalman Filter For Volatility Surface',
    shortDesc: 'Real-time options theoretical value updates using an Unscented Kalman Filter.',
    fullDesc: 'We construct a methodology that offers a quick way for option market makers to update their theoretical values for options in real-time. We use an Unscented Kalman Filter (UKF) to quickly calibrate the implied volatility surface parameterization, which replaces the need for a costly objective function that needs to be minimized, allowing for real-time updates of the volatility surface.',
    slideshowLink: '#volatility-slideshow',
  },
  {
    id: 2,
    label: 'Sentiment Analysis Project',
    shortDesc: 'Predicting stock movement using sentiment from social/news/event text plus price data.',
    fullDesc: 'This project aims to predict stock price movements by integrating sentiment analysis of Twitter posts, financial news articles, and Kalshi event contract names with historical stock data. By quantifying public sentiment overall and toward specific stocks, we seek to uncover patterns and correlations that influence market dynamics. A Long-Short-Term Memory (LSTM) neural network will model temporal dependencies within the combined sentiment metrics and stock prices.',
    slideshowLink: '#statarb-slideshow',
  },
  {
    id: 3,
    label: 'Another Project Placeholder',
    shortDesc: 'Placeholder project summary.',
    fullDesc: 'blah blah blah',
    slideshowLink: '#mlorderflow-slideshow',
  },
];

const pastProjects = [
  {
    id: 1,
    year: 2025,
    label: 'Past Project Alpha',
    fullDesc: 'Summary of a completed past project.',
    slideshowLink: '#past-project-alpha',
  },
  {
    id: 2,
    year: 2024,
    label: 'Past Project Beta',
    fullDesc: 'Summary of another completed past project.',
    slideshowLink: '#past-project-beta',
  },
  {
    id: 3,
    year: 2024,
    label: 'Past Project Gamma',
    fullDesc: 'Summary of an earlier project from previous semesters.',
    slideshowLink: '#past-project-gamma',
  },
  {
    id: 4,
    year: 2022,
    label: 'Past Project Foxtrot',
    fullDesc: 'Summary of an earlier project from previous semesters.',
    slideshowLink: '#past-project-foxtrot',
  },
];

export default function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const [isPastProjectsOpen, setIsPastProjectsOpen] = useState(false);
  const projectsByYear = Object.entries(
    pastProjects.reduce<Record<number, typeof pastProjects>>((acc, project) => {
      if (!acc[project.year]) acc[project.year] = [];
      acc[project.year].push(project);
      return acc;
    }, {})
  ).sort((a, b) => Number(b[0]) - Number(a[0]));

  return (
    <>
      <section
        id="projects"
        className="min-h-screen bg-primary-dark relative flex items-center py-[12vh]"
      >
        <div className="w-full px-[6vw] grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Photo Panel */}
          <div className="photo-frame aspect-[3/4] max-h-[72vh]">
            <img
              src="/projects_laptop.jpg"
              alt="Coding on laptop"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Text Block */}
          <div className="flex flex-col justify-center">
            {/* Micro Label */}
            <span className="micro-label text-secondary-light mb-6">
              Projects
            </span>

            {/* Headline */}
            <h2 className="headline-lg text-primary-light mb-6" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
              Projects That Matter
            </h2>

            {/* Body */}
            <p className="body-text text-secondary-light mb-8">
              From alpha research to execution systems. Our work is built to be tested, iterated, and shipped.
            </p>

            {/* Projects List */}
            <div className="space-y-4 mb-8">
              {projects.map((project) => (
                <div key={project.id} className="flex flex-col">
                  <span className="micro-label text-accent-green mb-1">{project.label}</span>
                  <span className="body-text text-secondary-light" style={{ fontSize: '0.9rem' }}>
                    {project.shortDesc}
                  </span>
                </div>
              ))}
            </div>

            {/* Learn More Button */}
            <button
              onClick={() => setSelectedProject(projects[0])}
              className="cta-button w-fit"
            >
              <span>Learn More</span>
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => setIsPastProjectsOpen(true)}
              className="text-link mt-4 w-fit text-left"
            >
              Past Projects
            </button>
          </div>
        </div>
      </section>

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-secondary-dark max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-white/10">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h3 className="headline-lg text-primary-light" style={{ fontSize: '1.5rem' }}>
                Our Projects
              </h3>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-secondary-light hover:text-accent-green transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className={`mb-8 pb-8 ${project.id !== projects.length ? 'border-b border-white/10' : ''}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="micro-label text-accent-green">{project.label}</span>
                    <a
                      href={project.slideshowLink}
                      className="text-link inline-flex items-center gap-1 text-xs"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>View Slideshow</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                  <p className="body-text text-secondary-light">
                    {project.fullDesc}
                  </p>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-white/10 flex justify-between items-center">
              <a
                href="https://github.com/BaruchFinancialQuantsEngineers-FQE"
                target="_blank"
                rel="noopener noreferrer"
                className="text-link inline-flex items-center gap-2"
              >
                <span>View on GitHub</span>
                <ExternalLink size={14} />
              </a>
              <button
                onClick={() => setSelectedProject(null)}
                className="cta-button"
              >
                <span>Close</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Past Projects Modal */}
      {isPastProjectsOpen && (
        <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-secondary-dark max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-white/10">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h3 className="headline-lg text-primary-light" style={{ fontSize: '1.5rem' }}>
                Past Projects
              </h3>
              <button
                onClick={() => setIsPastProjectsOpen(false)}
                className="text-secondary-light hover:text-accent-green transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {projectsByYear.map(([year, yearProjects]) => (
                <details key={year} className="border border-white/10" open>
                  <summary className="micro-label text-accent-green cursor-pointer px-4 py-3">
                    {year}
                  </summary>
                  <div className="px-4 pb-4 pt-2">
                    {yearProjects.map((project, index) => (
                      <div
                        key={project.id}
                        className={`py-4 ${index !== yearProjects.length - 1 ? 'border-b border-white/10' : ''}`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <span className="micro-label text-accent-green">{project.label}</span>
                          <a
                            href={project.slideshowLink}
                            className="text-link inline-flex items-center gap-1 text-xs"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span>View Slideshow</span>
                            <ExternalLink size={12} />
                          </a>
                        </div>
                        <p className="body-text text-secondary-light">
                          {project.fullDesc}
                        </p>
                      </div>
                    ))}
                  </div>
                </details>
              ))}
            </div>

            <div className="p-6 border-t border-white/10 flex justify-end items-center">
              <button
                onClick={() => setIsPastProjectsOpen(false)}
                className="cta-button"
              >
                <span>Close</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
