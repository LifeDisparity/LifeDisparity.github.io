const companyLogos = [
  { name: 'Citadel', image: '/logo_citadel.jpg' },
  { name: 'Jane Street', image: '/logo_janestreet.jpg' },
  { name: 'Two Sigma', image: '/logo_twosigma.jpg' },
  { name: 'DE Shaw', image: '/logo_deshaw.jpg' },
  { name: 'HRT', image: '/logo_hrt.jpg' },
  { name: 'Jump Trading', image: '/logo_jump.jpg' },
  { name: 'Optiver', image: '/logo_optiver.jpg' },
  { name: 'Goldman Sachs', image: '/logo_goldman.jpg' },
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
            Our graduates work in quantitative research, trading, data science, and engineering at firms that value rigor.
          </p>
        </div>

        {/* Placement Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="border border-white/10 p-6">
            <span className="micro-label text-accent-green mb-2 block">Buy-Side</span>
            <p className="body-text text-secondary-light text-sm">
              Hedge funds and asset managers
            </p>
          </div>
          <div className="border border-white/10 p-6">
            <span className="micro-label text-accent-green mb-2 block">Sell-Side</span>
            <p className="body-text text-secondary-light text-sm">
              Quantitative research and trading desks
            </p>
          </div>
          <div className="border border-white/10 p-6">
            <span className="micro-label text-accent-green mb-2 block">Tech / Fintech</span>
            <p className="body-text text-secondary-light text-sm">
              Data science and infrastructure roles
            </p>
          </div>
        </div>

        {/* Logo Carousel */}
        <div className="relative overflow-hidden">
          <div className="logo-carousel flex gap-8">
            {allLogos.map((company, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-48 h-32 photo-frame overflow-hidden hover:opacity-80 transition-opacity"
              >
                <img
                  src={company.image}
                  alt={company.name}
                  className="w-full h-full object-cover"
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
