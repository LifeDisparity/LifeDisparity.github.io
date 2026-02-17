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

    const cell = 16;
    const fontSize = 12;
    const waveChars = [' ', '.', ':', '-', '=', '+', '*', 'o', 'O', '@'];
    const constants = ['pi', 'e', 'phi', 'tau', 'sqrt2', 'ln2'];

    type Drop = {
      x: number;
      y: number;
      speed: number;
      length: number;
    };

    type Ripple = {
      x: number;
      y: number;
      radius: number;
      speed: number;
      life: number;
      amplitude: number;
    };

    type Donut = {
      x: number;
      y: number;
      angle: number;
      spin: number;
      life: number;
      symbol: string;
    };

    let cols = 0;
    let rows = 0;
    let drops: Drop[] = [];
    let ripples: Ripple[] = [];
    let donuts: Donut[] = [];
    let rafId = 0;

    const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

    const setCanvasSize = () => {
      canvas.width = section.offsetWidth;
      canvas.height = section.offsetHeight;
      cols = Math.max(12, Math.ceil(canvas.width / cell));
      rows = Math.max(8, Math.ceil(canvas.height / cell));
      ctx.font = `${fontSize}px "IBM Plex Mono", monospace`;
      ctx.textBaseline = 'top';
      ctx.textAlign = 'left';
    };

    const createDrop = (randomY: boolean): Drop => ({
      x: Math.floor(Math.random() * cols) * cell,
      y: randomY ? Math.random() * canvas.height : -Math.random() * canvas.height * 0.6 - cell,
      speed: 1.7 + Math.random() * 2.4,
      length: 1 + Math.floor(Math.random() * 2),
    });

    const resetDrop = (drop: Drop, randomY: boolean) => {
      const fresh = createDrop(randomY);
      drop.x = fresh.x;
      drop.y = fresh.y;
      drop.speed = fresh.speed;
      drop.length = fresh.length;
    };

    const spawnImpact = (x: number, y: number) => {
      ripples.push({
        x,
        y,
        radius: 0,
        speed: 1.2 + Math.random() * 0.7,
        life: 95 + Math.random() * 35,
        amplitude: 1 + Math.random() * 0.5,
      });
      if (ripples.length > 28) {
        ripples.shift();
      }

      donuts.push({
        x,
        y,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() > 0.5 ? 1 : -1) * (0.05 + Math.random() * 0.08),
        life: 70 + Math.random() * 28,
        symbol: constants[Math.floor(Math.random() * constants.length)],
      });
      if (donuts.length > 20) {
        donuts.shift();
      }
    };

    const drawSurface = () => {
      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          const x = col * cell;
          const y = row * cell;
          let wave = 0;

          for (const ripple of ripples) {
            const dx = x - ripple.x;
            const dy = y - ripple.y;
            const dist = Math.hypot(dx, dy);
            const phase = dist - ripple.radius;
            if (Math.abs(phase) > 34) continue;

            const envelope = Math.exp(-Math.abs(phase) * 0.08) * (ripple.life / 120);
            wave += Math.sin(phase * 0.4) * envelope * ripple.amplitude;
          }

          const intensity = clamp((wave + 1) * 0.5, 0, 1);
          const index = clamp(Math.floor(intensity * (waveChars.length - 1)), 0, waveChars.length - 1);
          const alpha = 0.13 + intensity * 0.36;

          ctx.fillStyle = `rgba(163, 184, 170, ${alpha})`;
          ctx.fillText(waveChars[index], x, y);
        }
      }
    };

    const drawDonuts = () => {
      for (let i = donuts.length - 1; i >= 0; i -= 1) {
        const donut = donuts[i];
        const alpha = clamp(donut.life / 95, 0, 1);
        const points = 8;
        const step = (Math.PI * 2) / points;
        const ringRadius = 8 + (95 - donut.life) * 0.14;

        ctx.fillStyle = `rgba(74, 222, 128, ${0.25 + alpha * 0.65})`;
        for (let p = 0; p < points; p += 1) {
          const a = donut.angle + p * step;
          const x = donut.x + Math.cos(a) * ringRadius;
          const y = donut.y + Math.sin(a) * ringRadius * 0.58;
          ctx.fillText(donut.symbol, x, y);
        }

        donut.angle += donut.spin;
        donut.life -= 1.6;
        if (donut.life <= 0) {
          donuts.splice(i, 1);
        }
      }
    };

    const updateRipples = () => {
      for (let i = ripples.length - 1; i >= 0; i -= 1) {
        ripples[i].radius += ripples[i].speed;
        ripples[i].life -= 1.2;
        ripples[i].amplitude *= 0.996;
        if (ripples[i].life <= 0) {
          ripples.splice(i, 1);
        }
      }
    };

    const drawRain = () => {
      ctx.fillStyle = 'rgba(167, 243, 208, 0.84)';
      for (const drop of drops) {
        ctx.fillText('|', drop.x, drop.y);
        if (drop.length > 1) {
          ctx.fillText('|', drop.x, drop.y - fontSize);
        }

        drop.y += drop.speed;
        if (drop.y >= canvas.height - cell * 0.6) {
          spawnImpact(drop.x, canvas.height - cell * 0.6);
          resetDrop(drop, false);
        }
      }
    };

    const draw = () => {
      ctx.fillStyle = 'rgba(5, 20, 10, 0.22)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawSurface();
      drawDonuts();
      drawRain();
      updateRipples();

      rafId = window.requestAnimationFrame(draw);
    };

    const init = () => {
      setCanvasSize();
      drops = Array.from({ length: Math.max(10, Math.floor(cols * 0.45)) }, () => createDrop(true));
      ripples = [];
      donuts = [];
    };

    init();
    draw();

    const handleResize = () => {
      init();
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

