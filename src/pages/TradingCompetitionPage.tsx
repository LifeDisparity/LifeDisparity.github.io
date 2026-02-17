import { useEffect, useLayoutEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Calculator, Clock3, ShieldAlert, Sigma, Trophy, Users } from 'lucide-react';

const deadlines = [
  'Application deadline: March 20th',
  'Notice of acceptance and coding assessment: March 22nd',
  'Coding assessment due: March 27th',
  'Live Trading Day #1: April 11th, 8am to 12pm',
  'Live Trading Day #2: April 18th, 8am to 12pm',
  'Award ceremony: April 18th, 1pm',
];

const setup = [
  'Systematic division',
  'Maximum three people per team',
  'Current Baruch undergraduate students',
  'Basic coding knowledge is strongly recommended',
];

const phases = [
  {
    phase: 'Phase 0',
    title: 'Coding Assessment',
    duration: 'Pre-competition',
    details: [
      'Complete a practical coding assessment before live trading.',
      'Assessment is designed as a quick screening challenge (about 2 to 3 hours).',
    ],
  },
  {
    phase: 'Phase 1',
    title: 'Ramp Up and Strategy Build',
    duration: 'Before Trading Day #1',
    details: [
      'Design your initial trading strategy and assumptions.',
      'Prepare execution logic and core risk controls.',
    ],
  },
  {
    phase: 'Phase 2',
    title: 'Live Trading Day #1',
    duration: '4 Hours',
    details: [
      'Run and monitor strategy performance in real time.',
      'Document observations and identify model adjustments.',
    ],
  },
  {
    phase: 'Phase 3',
    title: 'Refinement and Trading Day #2',
    duration: 'Ramp Up + 4 Hours',
    details: [
      'Refine your strategy based on Day #1 outcomes.',
      'Execute final live trading session and submit final results.',
    ],
  },
];

const rubric = [
  { category: 'Coding Assessment', score: '1 to 10', weight: '25%' },
  { category: 'Strategy Design and Logic', score: '1 to 10', weight: '20%' },
  { category: 'Execution and Performance', score: '1 to 10', weight: '20%' },
  { category: 'Risk Management', score: '1 to 5', weight: '15%' },
  { category: 'Adaptability Across Trading Days', score: '1 to 5', weight: '10%' },
  { category: 'Communication and Technical Q&A', score: '1 to 5', weight: '10%' },
];

const incentives = [
  'Prize pool of 300, 200, 100 for the top 3 teams',
  'Bragging rights and LinkedIn feature on FQE channels',
  'Resume building experience',
  'Published on the FQE website',
];

export default function TradingCompetitionPage() {
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

    const charW = 10;
    const charH = 12;
    const wickChar = '|';
    const bodyChar = '#';
    const topPaddingRows = 1;
    const bottomPaddingRows = 1;

    type Candle = {
      open: number;
      close: number;
      high: number;
      low: number;
      bull: boolean;
    };

    let rows = 0;
    let cols = 0;
    let offset = 0;
    let priceRow = 0;
    let candles: Candle[] = [];
    let trend = -1; // -1 = bullish (up), +1 = bearish (down)
    let candlesSinceSwitch = 0;
    let switchAfter = 22 + Math.floor(Math.random() * 14);

    const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

    const setCanvasSize = () => {
      canvas.width = section.offsetWidth;
      canvas.height = section.offsetHeight;
      ctx.font = `${charH}px "IBM Plex Mono", monospace`;
      ctx.textBaseline = 'top';
      ctx.textAlign = 'left';
    };

    const buildCandle = (): Candle => {
      const minRow = topPaddingRows;
      const maxRow = Math.max(minRow + 8, rows - bottomPaddingRows);

      if (candlesSinceSwitch >= switchAfter) {
        trend *= -1;
        candlesSinceSwitch = 0;
        switchAfter = 20 + Math.floor(Math.random() * 16);
      }
      candlesSinceSwitch += 1;

      const open = priceRow;
      const directional = trend * (Math.random() * 1.6 + 0.35);
      const noise = (Math.random() - 0.5) * 2.6;
      const close = clamp(Math.round(open + directional + noise), minRow, maxRow);
      const wickAbove = 1 + Math.floor(Math.random() * 3);
      const wickBelow = 1 + Math.floor(Math.random() * 3);
      const high = clamp(Math.min(open, close) - wickAbove, minRow, maxRow);
      const low = clamp(Math.max(open, close) + wickBelow, minRow, maxRow);

      priceRow = close;
      return {
        open,
        close,
        high,
        low,
        bull: close < open,
      };
    };

    const initSeries = () => {
      rows = Math.max(18, Math.floor(canvas.height / charH));
      cols = Math.max(24, Math.ceil(canvas.width / charW) + 6);
      priceRow = Math.floor(rows * 0.55);
      candles = [];
      offset = 0;
      trend = -1;
      candlesSinceSwitch = 0;
      switchAfter = 22 + Math.floor(Math.random() * 14);
      for (let i = 0; i < cols + 4; i += 1) {
        candles.push(buildCandle());
      }
    };

    const drawCandle = (candle: Candle, x: number) => {
      const wickColor = candle.bull ? 'rgba(74, 222, 128, 0.55)' : 'rgba(248, 113, 113, 0.55)';
      const bodyColor = candle.bull ? 'rgba(74, 222, 128, 0.95)' : 'rgba(248, 113, 113, 0.95)';

      ctx.fillStyle = wickColor;
      for (let row = candle.high; row <= candle.low; row += 1) {
        ctx.fillText(wickChar, x, row * charH);
      }

      ctx.fillStyle = bodyColor;
      const bodyTop = Math.min(candle.open, candle.close);
      const bodyBottom = Math.max(candle.open, candle.close);
      for (let row = bodyTop; row <= bodyBottom; row += 1) {
        ctx.fillText(bodyChar, x, row * charH);
      }
    };

    setCanvasSize();
    initSeries();

    const draw = () => {
      ctx.fillStyle = 'rgba(5, 20, 10, 0.16)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      offset += 1.4;
      if (offset >= charW) {
        offset -= charW;
        candles.push(buildCandle());
        if (candles.length > cols + 8) {
          candles.shift();
        }
      }

      for (let i = 0; i < candles.length; i += 1) {
        const x = i * charW - offset;
        if (x > canvas.width + charW) {
          break;
        }
        if (x < -charW) {
          continue;
        }
        drawCandle(candles[i], x);
      }
    };

    const drawIntervalId = window.setInterval(draw, 40);

    const handleResize = () => {
      setCanvasSize();
      initSeries();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.clearInterval(drawIntervalId);
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
                FQE Undergraduate Trading Competition
              </h1>
              <div className="flex flex-col gap-4 items-center">
                <a href="mailto:baruchfqe@gmail.com?subject=Trading%20Competition%20Application" className="cta-button w-fit">
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
                <span className="micro-label text-accent-green">Eligibility and Setup</span>
              </div>
              <ul className="space-y-2 body-text text-secondary-light text-sm">
                {setup.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock3 className="text-accent-green" size={18} />
                <span className="micro-label text-accent-green">Important Dates</span>
              </div>
              <ul className="space-y-2 body-text text-secondary-light text-sm">
                {deadlines.map((item) => (
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
                Trading Workflow
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {phases.map((phase) => (
                <div key={phase.phase} className="border border-white/10 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Sigma className="text-accent-green" size={16} />
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
                <span className="micro-label text-accent-green">Live Sessions</span>
              </div>
              <p className="body-text text-secondary-light text-sm">
                Teams participate in two 4-hour live trading sessions with a ramp-up period between sessions
                to refine strategies and improve execution quality.
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
