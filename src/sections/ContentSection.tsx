import { ArrowRight } from 'lucide-react';

interface ContentSectionProps {
  id?: string;
  background?: 'primary' | 'secondary';
  layout: 'left-photo' | 'right-photo';
  microLabel: string;
  headline: string;
  body: string;
  imageSrc: string;
  imageAlt: string;
  items?: { label: string; description: string }[];
  ctaText?: string;
  ctaHref?: string;
  ctaVariant?: 'link' | 'button';
}

export default function ContentSection({
  id,
  background = 'primary',
  layout,
  microLabel,
  headline,
  body,
  imageSrc,
  imageAlt,
  items = [],
  ctaText,
  ctaHref = '#',
  ctaVariant = 'link',
}: ContentSectionProps) {
  const isLeftPhoto = layout === 'left-photo';
  const bgClass = background === 'primary' ? 'bg-primary-dark' : 'bg-secondary-dark';

  return (
    <section
      id={id}
      className={`min-h-screen ${bgClass} relative flex items-center py-[12vh]`}
    >
      <div className={`w-full px-[6vw] grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${isLeftPhoto ? '' : 'lg:grid-flow-dense'}`}>
        {/* Photo Panel */}
        <div className={`photo-frame aspect-[3/4] max-h-[72vh] ${isLeftPhoto ? '' : 'lg:col-start-2'}`}>
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text Block */}
        <div className={`flex flex-col justify-center ${isLeftPhoto ? '' : 'lg:col-start-1 lg:row-start-1'}`}>
          {/* Micro Label */}
          <span className="micro-label text-secondary-light mb-6">
            {microLabel}
          </span>

          {/* Headline */}
          <h2 className="headline-lg text-primary-light mb-6" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
            {headline}
          </h2>

          {/* Body */}
          <p className="body-text text-secondary-light mb-8">
            {body}
          </p>

          {/* Items */}
          {items.length > 0 && (
            <div className="space-y-4 mb-8">
              {items.map((item, index) => (
                <div key={index} className="flex flex-col">
                  <span className="micro-label text-accent-green mb-1">{item.label}</span>
                  <span className="body-text text-secondary-light" style={{ fontSize: '0.9rem' }}>
                    {item.description}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          {ctaText && (
            <a
              href={ctaHref}
              className={ctaVariant === 'button' ? 'cta-button w-fit' : 'text-link inline-flex items-center gap-2'}
            >
              <span>{ctaText}</span>
              <ArrowRight size={ctaVariant === 'button' ? 16 : 14} />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
