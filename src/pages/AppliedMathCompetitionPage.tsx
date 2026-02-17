import { useEffect, useLayoutEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Calculator, Clock3, ShieldAlert, Sigma, Trophy, Users } from 'lucide-react';

const focusAreas = [
  'Market microstructure modeling',
  'Disease spread modeling',
  'Graph theory in network risk',
  'Logistics optimization',
  'Chaotic dynamics',
  'And more',
];

const requirements = [
  'Maximum three people per team',
  'Basic coding and mathematics knowledge',
  'Current Baruch undergraduate student status',
];

const phases = [
  {
    phase: 'Phase 0',
    title: 'Testing and Validation',
    duration: 'Kickoff',
    details: [
      'A GitHub Classroom environment will be provided.',
      'Teams complete a small coding problem for validation.',
    ],
  },
  {
    phase: 'Phase 1',
    title: 'Proposal',
    duration: '2 to 3 Weeks',
    details: [
      'Submit a 2 to 3 page proposal (preferably LaTeX).',
      'Include problem statement, literature review, framework, methodology, and roadmap/data sources.',
      'Judged on originality, mathematical depth, feasibility, and clarity.',
      'Based on interest and funding, teams may be split into tracks such as quantitative finance, general applied mathematics, or AI and learning systems.',
    ],
  },
  {
    phase: 'Phase 2',
    title: 'Research and Implementation',
    duration: '6 to 10 Weeks',
    details: [
      'Produce formal documentation/paper and code repository.',
      'Provide reproducible results with experimental validation and tests.',
      'Use proper notation, explicit assumptions, and statistical testing where applicable.',
    ],
  },
  {
    phase: 'Phase 3',
    title: 'Final Presentation',
    duration: '20 Minutes',
    details: [
      '12 minutes for research presentation.',
      '8 minutes for technical Q&A.',
      'Judging panel includes professors, researchers, alumni, and practitioners.',
    ],
  },
];

const rubric = [
  { category: 'Initial Proposal', score: '1 to 5', weight: '25%' },
  { category: 'Technical Implementation', score: '1 to 10', weight: '25%' },
  { category: 'Originality', score: '1 to 5', weight: '15%' },
  { category: 'Empirical Validation', score: '1 to 5', weight: '15%' },
  { category: 'Communication and Presentation', score: '1 to 5', weight: '10%' },
  { category: 'Practical and Research Relevance', score: '1 to 5', weight: '10%' },
];

const incentives = [
  'Prize pool of 300, 200, 100 for the top 3 teams',
  'Bragging rights and LinkedIn feature on FQE channels',
  'Resume building experience',
  'Published on the FQE website',
];

export default function AppliedMathCompetitionPage() {
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useLayoutEffect(() => {
    const previousRestoration = 'scrollRestoration' in window.history ? window.history.scrollRestoration : null;
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const forceTop = () => {
      const html = document.documentElement;
      const previousInlineBehavior = html.style.scrollBehavior;
      html.style.scrollBehavior = 'auto';
      window.scrollTo(0, 0);
      html.scrollTop = 0;
      document.body.scrollTop = 0;
      html.style.scrollBehavior = previousInlineBehavior;
    };

    forceTop();
    const rafId = window.requestAnimationFrame(forceTop);
    const intervalId = window.setInterval(forceTop, 50);
    const timeoutId = window.setTimeout(() => {
      window.clearInterval(intervalId);
      forceTop();
    }, 800);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearInterval(intervalId);
      window.clearTimeout(timeoutId);
      if (previousRestoration) {
        window.history.scrollRestoration = previousRestoration;
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = heroSectionRef.current;
    if (!canvas || !section) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellW = 10;
    const cellH = 13;
    const K2 = 7;
    const glyphWidth = 17;
    const glyphHeight = 15;
    const depth = 4;
    const pointStep = 0.42;

    type Point3D = {
      x: number;
      y: number;
      z: number;
      shade: number;
    };

    let cols = 0;
    let rows = 0;
    let A = 0;
    let B = 0;
    let rafId = 0;

    const setCanvasSize = () => {
      canvas.width = section.offsetWidth;
      canvas.height = section.offsetHeight;
      cols = Math.max(24, Math.floor(canvas.width / cellW));
      rows = Math.max(16, Math.floor(canvas.height / cellH));
      ctx.font = `${cellH}px "IBM Plex Mono", monospace`;
      ctx.textBaseline = 'top';
      ctx.textAlign = 'left';
    };

    const buildPiPointCloud = (): Point3D[] => {
      const points: Point3D[] = [];
      const cx = (glyphWidth - 1) / 2;
      const cy = (glyphHeight - 1) / 2;

      const isTopBar = (gy: number) => gy <= 2;
      const isLeftLeg = (gx: number) => gx <= 3;
      const isRightLeg = (gx: number) => gx >= glyphWidth - 4;
      const isCenterStem = (gx: number, gy: number) => gx >= cx - 1 && gx <= cx + 1 && gy >= 6;

      for (let gy = 0; gy < glyphHeight; gy += 1) {
        for (let gx = 0; gx < glyphWidth; gx += 1) {
          const filled = isTopBar(gy) || isLeftLeg(gx) || isRightLeg(gx) || isCenterStem(gx, gy);
          if (!filled) continue;

          for (let gz = -depth; gz <= depth; gz += 1) {
            points.push({
              x: (gx - cx) * pointStep,
              y: (gy - cy) * pointStep,
              z: gz * pointStep * 0.45,
              shade: (gz + depth) / (depth * 2),
            });
          }
        }
      }

      return points;
    };

    const points = buildPiPointCloud();

    const render = () => {
      const zBuffer = new Float32Array(cols * rows);
      const charBuffer = new Array<string>(cols * rows).fill(' ');
      const lightBuffer = new Float32Array(cols * rows);

      const cosA = Math.cos(A);
      const sinA = Math.sin(A);
      const cosB = Math.cos(B);
      const sinB = Math.sin(B);
      const K1 = cols * 0.62;

      for (const p of points) {
        const x1 = p.x * cosA - p.z * sinA;
        const z1 = p.x * sinA + p.z * cosA;
        const y1 = p.y * cosB - z1 * sinB;
        const z2 = K2 + p.y * sinB + z1 * cosB;
        if (z2 <= 0) continue;

        const ooz = 1 / z2;
        const xp = Math.floor(cols * 0.5 + K1 * ooz * x1);
        const yp = Math.floor(rows * 0.5 + K1 * ooz * y1 * 0.86);
        if (xp < 0 || xp >= cols || yp < 0 || yp >= rows) continue;

        const index = xp + yp * cols;
        if (ooz > zBuffer[index]) {
          zBuffer[index] = ooz;
          charBuffer[index] = '\u03C0';
          lightBuffer[index] = p.shade;
        }
      }

      ctx.fillStyle = 'rgba(5, 20, 10, 0.22)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let y = 0; y < rows; y += 1) {
        for (let x = 0; x < cols; x += 1) {
          const index = x + y * cols;
          if (charBuffer[index] === ' ') continue;

          const alpha = Math.min(1, 0.34 + lightBuffer[index] * 0.62);
          ctx.fillStyle = `rgba(74, 222, 128, ${alpha})`;
          ctx.fillText(charBuffer[index], x * cellW, y * cellH);
        }
      }

      A += 0.012;
      B += 0.008;
      rafId = window.requestAnimationFrame(render);
    };

    setCanvasSize();
    render();

    const handleResize = () => {
      setCanvasSize();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-primary-dark">
      <div className="grain-overlay" />

      <div className="fixed top-6 left-6 z-[200]">
        <a href="#" className="font-display text-xl font-bold text-primary-light tracking-tight hover:text-accent-green transition-colors">
          FQE
        </a>
      </div>

      <div className="fixed top-6 right-6 z-[200]">
        <a href="#competition" className="text-link inline-flex items-center gap-2">
          <ArrowLeft size={14} />
          <span>Back to Main Site</span>
        </a>
      </div>

      <main>
        <section ref={heroSectionRef} className="min-h-screen bg-primary-dark relative flex items-center py-[12vh]">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 z-10 w-full h-full pointer-events-none"
            aria-hidden="true"
          />
          <div className="vignette" />

          <div className="relative z-20 w-full px-[6vw] flex justify-center">
            <div className="flex flex-col justify-center items-center text-center max-w-3xl">
              <span className="micro-label text-secondary-light mb-6">Competition</span>
              <h1 className="headline-xl text-primary-light mb-6" style={{ fontSize: 'clamp(2.3rem, 5vw, 4.4rem)', lineHeight: 1.04 }}>
                FQE Undergraduate Applied Mathematics Competition
              </h1>
              <div className="flex flex-col gap-4 items-center">
                <a href="mailto:baruchfqe@gmail.com?subject=Applied%20Mathematics%20Competition%20Application" className="cta-button w-fit">
                  <span>Apply to Compete</span>
                  <ArrowRight size={16} />
                </a>
                <a href="#structure" className="text-link inline-flex items-center gap-2">
                  <span>View Structure</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="requirements" className="bg-secondary-dark py-[12vh]">
          <div className="w-full px-[6vw] grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="text-accent-green" size={18} />
                <span className="micro-label text-accent-green">Requirements</span>
              </div>
              <ul className="space-y-2 body-text text-secondary-light text-sm">
                {requirements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Sigma className="text-accent-green" size={18} />
                <span className="micro-label text-accent-green">Project Ideas</span>
              </div>
              <ul className="space-y-2 body-text text-secondary-light text-sm">
                {focusAreas.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="w-full px-[6vw] mt-8">
            <div className="border border-red-400/40 bg-red-500/5 p-5">
              <div className="flex items-center gap-3 mb-3">
                <ShieldAlert className="text-red-300" size={18} />
                <span className="micro-label text-red-300">Integrity Policy</span>
              </div>
              <p className="body-text text-secondary-light text-sm">
                The use of Artificial Intelligence to generate code is strictly prohibited.
                Teams found using AI-generated code will be immediately disqualified.
              </p>
            </div>
          </div>
        </section>

        <section id="structure" className="bg-primary-dark py-[12vh]">
          <div className="w-full px-[6vw]">
            <div className="mb-10">
              <span className="micro-label text-secondary-light mb-4 block">Competition Structure</span>
              <h2 className="headline-lg text-primary-light" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
                Semester Workflow
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {phases.map((phase) => (
                <div key={phase.phase} className="border border-white/10 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Clock3 className="text-accent-green" size={16} />
                    <span className="micro-label text-accent-green">{phase.phase}</span>
                  </div>
                  <p className="font-display font-semibold text-primary-light mb-1">{phase.title}</p>
                  <p className="micro-label text-secondary-light mb-3">{phase.duration}</p>
                  <ul className="list-disc pl-5 space-y-1 body-text text-secondary-light text-sm">
                    {phase.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="evaluation" className="bg-secondary-dark py-[12vh]">
          <div className="w-full px-[6vw]">
            <div className="mb-8">
              <span className="micro-label text-secondary-light mb-4 block">Evaluation Rubric</span>
              <h2 className="headline-lg text-primary-light" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
                Scoring Framework
              </h2>
            </div>

            <div className="border border-white/10 overflow-hidden">
              <div className="grid grid-cols-12 border-b border-white/10 bg-primary-dark/40">
                <div className="col-span-6 p-4 micro-label text-accent-green">Category</div>
                <div className="col-span-3 p-4 micro-label text-accent-green">Score</div>
                <div className="col-span-3 p-4 micro-label text-accent-green">Weight</div>
              </div>

              {rubric.map((item) => (
                <div key={item.category} className="grid grid-cols-12 border-b last:border-b-0 border-white/10">
                  <div className="col-span-6 p-4 body-text text-secondary-light text-sm">{item.category}</div>
                  <div className="col-span-3 p-4 body-text text-secondary-light text-sm">{item.score}</div>
                  <div className="col-span-3 p-4 body-text text-secondary-light text-sm">{item.weight}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-primary-dark py-[12vh]">
          <div className="w-full px-[6vw] grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Calculator className="text-accent-green" size={18} />
                <span className="micro-label text-accent-green">Presentation</span>
              </div>
              <p className="body-text text-secondary-light text-sm">
                Final presentations are 20 minutes total: 12 minutes for research presentation
                and 8 minutes for technical Q&A with a panel of judges.
              </p>
            </div>

            <div className="border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="text-accent-green" size={18} />
                <span className="micro-label text-accent-green">Incentives</span>
              </div>
              <ul className="space-y-2 body-text text-secondary-light text-sm">
                {incentives.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}


