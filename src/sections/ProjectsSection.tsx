import { useState } from 'react';
import { ArrowRight, X, ExternalLink } from 'lucide-react';

const projects = [
  {
    id: 1,
    label: 'Volatility Surface',
    shortDesc: 'Calibration and visualization toolkit for equity options.',
    fullDesc: 'A comprehensive toolkit for calibrating and visualizing volatility surfaces from equity options data. Features include real-time data ingestion, multiple calibration models (SVI, SABR), interactive 3D surface plots, and export capabilities for downstream analysis.',
    slideshowLink: '#volatility-slideshow',
  },
  {
    id: 2,
    label: 'StatArb Backtester',
    shortDesc: 'Pairs-trading engine with risk overlays and reporting.',
    fullDesc: 'A production-grade statistical arbitrage backtesting engine supporting cointegration-based pairs trading. Includes dynamic hedge ratio calculation, entry/exit signal generation, comprehensive risk management overlays, and detailed performance reporting with Sharpe ratio and max drawdown analysis.',
    slideshowLink: '#statarb-slideshow',
  },
  {
    id: 3,
    label: 'ML Order Flow',
    shortDesc: 'Microstructure classifier for regime detection.',
    fullDesc: 'Machine learning pipeline for analyzing market microstructure and detecting regime changes in real-time. Uses ensemble methods to classify order flow patterns, identify informed trading, and predict short-term price movements based on limit order book dynamics.',
    slideshowLink: '#mlorderflow-slideshow',
  },
];

export default function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

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
                href="https://github.com"
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
    </>
  );
}
