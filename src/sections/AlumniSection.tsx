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

export default function AlumniSection() {
  // Double the logos for seamless infinite scroll
  const allLogos = [...companyLogos, ...companyLogos];

  return (
    <section
      id="alumni"
      className="min-h-screen bg-secondary-dark relative flex items-center py-[12vh]"
    >
      <div className="w-full px-[6vw]">
        {/* Header */}
        <div className="mb-12">
          <span className="micro-label text-secondary-light mb-4 block">
            Alumni
          </span>
          <h2 className="headline-lg text-primary-light" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
            Where Members Go
          </h2>
          <p className="body-text text-secondary-light mt-4 max-w-xl">
            Our alumni build quantitative strategies, trading systems, and data infrastructure at leading financial and technology firms.
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
          <div className="logo-carousel flex gap-8">
            {allLogos.map((company, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-48 h-32 photo-frame overflow-hidden p-3 flex items-center justify-center hover:opacity-80 transition-opacity"
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
          <a href="#" className="text-link inline-flex items-center gap-2">
            <span>Read Alumni Stories</span>
          </a>
        </div>
      </div>
    </section>
  );
}
