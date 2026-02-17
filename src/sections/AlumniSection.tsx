import { useState } from 'react';
import { ExternalLink, X } from 'lucide-react';

const companyLogos = [
  { name: 'American Express', image: '/logo_americanexpress.png' },
  { name: 'Bank of America', image: '/logo_bankofamerica.svg.png' },
  { name: 'Bloomberg', image: '/logo_bloomberg.svg.png' },
  { name: 'BNY Mellon', image: '/logo_bnymellon.svg.png' },
  { name: 'Cargill', image: '/logo_cargill.svg.png' },
  { name: 'Chimera', image: '/logo_chimera.svg.svg' },
  { name: 'Citi', image: '/logo_citi.svg.svg' },
  { name: 'Credit Agricole CIB', image: '/logo_creditagricolecib.svg.png' },
  { name: 'Deloitte', image: '/logo_deloitte.svg.png' },
  { name: 'Deutsche Bank', image: '/logo_deutschebank.svg.png' },
  { name: 'EY', image: '/logo_ey.svg.png' },
  { name: 'Fidelity', image: '/logo_fidelity.svg.svg' },
  { name: 'FTI Consulting', image: '/logo_fticonsulting.png.png' },
  { name: 'Goldman Sachs', image: '/logo_goldman.svg.svg' },
  { name: 'Intel', image: '/logo_intel.svg.svg' },
  { name: 'JPMorgan Chase', image: '/logo_jpmorganchase.svg.png' },
  { name: 'Marex Solutions', image: '/logo_marexsolutions.svg' },
  { name: 'Meta', image: '/logo_meta.svg.svg' },
  { name: 'MUFG', image: '/logo_mufg.svg' },
  { name: 'PwC', image: '/logo_pwc.svg' },
  { name: 'Raymond James', image: '/logo_raymondjames.svg.svg' },
  { name: 'State Street', image: '/logo_statestreet.svg' },
  { name: 'The Depository Trust & Clearing Corporation (DTCC)', image: '/logo_dtcc.svg' },
  { name: 'VanEck', image: '/logo_vaneck.svg' },
  { name: 'Wells Fargo', image: '/logo_wellsfargo.svg' },
  { name: 'Wolfe Research', image: '/logo_wolferesearch.svg.png' },
];

const alumniStories = [
  {
    name: 'Alumni Name 1',
    company: 'Goldman Sachs',
    testimonial:
      'FQE gave me the technical foundation and confidence to break into quant-focused work. The project experience directly helped me in interviews.',
    linkedin: 'https://www.linkedin.com/company/fqe-baruch/',
  },
  {
    name: 'Alumni Name 2',
    company: 'JPMorgan Chase',
    testimonial:
      'Working on collaborative projects at FQE improved my problem solving, communication, and ability to deliver under deadlines.',
    linkedin: 'https://www.linkedin.com/company/fqe-baruch/',
  },
  {
    name: 'Alumni Name 3',
    company: 'Bloomberg',
    testimonial:
      'FQE connected me with a strong network of peers and mentors. The hands-on technical environment made a big difference in my career path.',
    linkedin: 'https://www.linkedin.com/company/fqe-baruch/',
  },
];

export default function AlumniSection() {
  const [isStoriesOpen, setIsStoriesOpen] = useState(false);
  // Double the logos for seamless infinite scroll
  const allLogos = [...companyLogos, ...companyLogos];

  return (
    <section
      id="alumni"
      className="min-h-screen bg-primary-dark relative flex items-center py-[12vh]"
    >
      <div className="w-full px-[6vw]">
        {/* Header */}
        <div className="mb-12">
          <span className="micro-label text-secondary-light mb-4 block">
            Alumni
          </span>
          <h2 className="headline-lg text-primary-light" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
            Where Alumni Are
          </h2>
          <p className="body-text text-secondary-light mt-4 max-w-xl">
            Our alumni build quantitative strategies, trading systems, and data technology at leading financial and technology firms.
          </p>
        </div>

        {/* Placement Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="border border-white/10 p-6">
            <span className="micro-label text-accent-green mb-2 block">ALPHA & PORTFOLIO STRATEGIES</span>
            <p className="body-text text-secondary-light text-sm">
              Systematic funds and asset management firms
            </p>
          </div>
          <div className="border border-white/10 p-6">
            <span className="micro-label text-accent-green mb-2 block">DERIVATIVES & MARKET STRUCTURE</span>
            <p className="body-text text-secondary-light text-sm">
              Quant research, trading, and market making
            </p>
          </div>
          <div className="border border-white/10 p-6">
            <span className="micro-label text-accent-green mb-2 block">DATA, ML & INFRASTRUCTURE</span>
            <p className="body-text text-secondary-light text-sm">
              Quant engineering and financial systems
            </p>
          </div>
        </div>









        {/* Logo Carousel */}
        <div className="relative overflow-hidden">
          <div className="logo-carousel flex w-max gap-8">
            {allLogos.map((company, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-48 h-32 photo-frame bg-[#F6FFF6] overflow-hidden p-3 flex items-center justify-center hover:opacity-80 transition-opacity"
              >
                <img
                  src={company.image}
                  alt={company.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={() => setIsStoriesOpen(true)}
            className="text-link inline-flex items-center gap-2"
          >
            <span>Read Alumni Stories</span>
          </button>
        </div>
      </div>

      {isStoriesOpen && (
        <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-secondary-dark max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-white/10">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h3 className="headline-lg text-primary-light" style={{ fontSize: '1.5rem' }}>
                Alumni Stories
              </h3>
              <button
                onClick={() => setIsStoriesOpen(false)}
                className="text-secondary-light hover:text-accent-green transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {alumniStories.map((story, index) => (
                <div
                  key={`${story.name}-${story.company}`}
                  className={`mb-8 pb-8 ${index !== alumniStories.length - 1 ? 'border-b border-white/10' : ''}`}
                >
                  <p className="micro-label text-accent-green mb-3">
                    {story.name} - {story.company}
                  </p>
                  <p className="body-text text-secondary-light mb-4">
                    {story.testimonial}
                  </p>
                  <a
                    href={story.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-link inline-flex items-center gap-2"
                  >
                    <span>LinkedIn</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setIsStoriesOpen(false)}
                className="cta-button"
              >
                <span>Close</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
