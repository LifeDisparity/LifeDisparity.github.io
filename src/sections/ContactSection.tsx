import { useState } from 'react';
import { ArrowRight, Info, X } from 'lucide-react';

export default function ContactSection() {
  const [isInterviewInfoOpen, setIsInterviewInfoOpen] = useState(false);

  return (
    <>
      <section
        id="contact"
        className="min-h-screen bg-primary-dark relative flex items-center py-[12vh]"
      >
        <div className="w-full px-[6vw] grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Block */}
          <div className="flex flex-col justify-center">
            {/* Micro Label */}
            <span className="micro-label text-secondary-light mb-6">
              Contact
            </span>

            {/* Headline */}
            <h2 className="headline-lg text-primary-light mb-6" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
              Ready to Build?
            </h2>

            {/* Body */}
            <p className="body-text text-secondary-light mb-10">
              Whether you are writing your first backtest or optimizing execution, there is a seat at the table.
            </p>

            {/* Primary CTA */}
            <a
              href="mailto:baruchfqe@gmail.com"
              className="cta-button mb-4 w-fit"
            >
              <span>Apply to Join</span>
              <ArrowRight size={16} />
            </a>

            {/* Secondary CTA */}
            <div className="mt-6">
              <button
                onClick={() => setIsInterviewInfoOpen(true)}
                className="text-link inline-flex items-center gap-2"
              >
                <Info size={14} />
                <span>Interview Information</span>
              </button>
            </div>

            {/* Note */}
            <p className="micro-label text-secondary-light/60 mt-8">
              Applications open each term. No prior finance experience required.
            </p>
          </div>

          {/* Photo Panel */}
          <div className="photo-frame aspect-[3/4] max-h-[72vh]">
            <img
              src="/contact_join.jpg"
              alt="Students collaborating"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {isInterviewInfoOpen && (
        <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-secondary-dark max-w-3xl w-full max-h-[80vh] overflow-y-auto border border-white/10">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h3 className="headline-lg text-primary-light" style={{ fontSize: '1.5rem' }}>
                Interview Information
              </h3>
              <button
                onClick={() => setIsInterviewInfoOpen(false)}
                className="text-secondary-light hover:text-accent-green transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 body-text text-secondary-light space-y-6">
              <div>
                <p className="font-semibold text-primary-light">What We Look For</p>
                <p className="mt-1">Ideal candidate traits:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Approachable and coachable</li>
                  <li>Willing to challenge themselves and expand their knowledge</li>
                  <li>Genuinely interested in quantitative finance, mathematics, and computer science</li>
                  <li>Working on or interested in personal projects in finance, math, or programming</li>
                  <li>Able to clearly explain reasoning, even when making mistakes</li>
                </ul>
                <p className="mt-3">We value intellectual honesty, curiosity, and independent thinking more than perfect answers.</p>
              </div>

              <div>
                <p className="font-semibold text-primary-light">Background Expectations</p>
                <p className="mt-2 font-medium text-primary-light">Freshmen / Sophomores / Transfer Students (Non-STEM)</p>
                <ul className="list-disc pl-6 mt-1 space-y-1">
                  <li>Interest in quantitative disciplines</li>
                  <li>Some exposure to math, programming, or finance (formal or informal)</li>
                  <li>Coding experience encouraged but not required</li>
                  <li>Willingness to attempt technical questions and explain reasoning</li>
                  <li>Ability to solve at least one technical question correctly</li>
                </ul>

                <p className="mt-3 font-medium text-primary-light">Juniors / Seniors / Transfer Students (STEM)</p>
                <ul className="list-disc pl-6 mt-1 space-y-1">
                  <li>Coursework or internship experience in math, finance, or computer science</li>
                  <li>At least one personal technical project</li>
                  <li>Stronger expectation on technical performance</li>
                  <li>Ability to solve at least two technical questions</li>
                  <li>Clear explanation of reasoning, assumptions, and logic</li>
                </ul>

                <p className="mt-3">
                  Non-STEM majors are generally discouraged unless they show a clear commitment to technical growth (STEM minor, projects, coursework, etc.).
                </p>
              </div>

              <div>
                <p className="font-semibold text-primary-light">Academic Integrity</p>
                <p className="mt-1">Technical interviews assess independent reasoning ability.</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Calculators are not allowed</li>
                  <li>AI tools are not allowed</li>
                  <li>You may be asked to show written work or share your screen during coding</li>
                </ul>
                <p className="mt-3">
                  Individuals found cheating during interviews will be disqualified from consideration.
                </p>
              </div>

              <div>
                <p className="font-semibold text-primary-light">Interview Structure</p>
                <p className="mt-1">Interviews are typically conducted by two current members:</p>
                <ol className="list-decimal pl-6 mt-2 space-y-3">
                  <li>
                    Screening
                    <p className="mt-1">A brief background check to ensure alignment with the club&apos;s quantitative focus.</p>
                  </li>
                  <li>
                    Behavioral Interview (~10 minutes)
                    <p className="mt-1">We assess communication skills, professionalism, independence, and motivation.</p>
                    <p className="mt-1">Sample prompts:</p>
                    <ul className="list-disc pl-6 mt-1 space-y-1">
                      <li>Tell us about yourself.</li>
                      <li>Why are you interested in FQE?</li>
                      <li>What technical projects have you worked on?</li>
                      <li>What do you hope to gain from the club?</li>
                      <li>How do you approach using AI in projects?</li>
                    </ul>
                  </li>
                  <li>
                    Easy Technical (~5 minutes)
                    <p className="mt-1">A foundational quantitative question designed to be relatively quick.</p>
                    <p className="mt-1">Topics may include expected value, basic probability, logic puzzles, exponential growth, and introductory finance concepts.</p>
                  </li>
                  <li>
                    Hard Technical (~5-10 minutes)
                    <p className="mt-1">A more complex quantitative problem focused on structure, logic, and assumptions.</p>
                  </li>
                  <li>
                    LeetCode-Style Coding Question (~10 minutes)
                    <p className="mt-1">You may be asked to code live, explain complexity, and discuss edge cases.</p>
                    <p className="mt-1">Questions may involve array/list manipulation, sorting and merging, parentheses validation, number transformations, and basic algorithms.</p>
                  </li>
                </ol>
              </div>

              <div>
                <p className="font-semibold text-primary-light">How We Evaluate</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Behavioral fit</li>
                  <li>Easy technical</li>
                  <li>Hard technical</li>
                  <li>Coding ability</li>
                </ul>
                <p className="mt-3">
                  Minimum technical performance is required for project placement. Candidates are compared within similar academic levels.
                </p>
                <p className="mt-3">At the end of the day, we are looking for members who will contribute meaningfully, grow technically, strengthen the FQE network, and take projects seriously.</p>
                <p className="mt-3">
                  Final notes: attempt each question, explain your reasoning clearly, think independently, and maintain integrity.
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-white/10 flex justify-end items-center">
              <button
                onClick={() => setIsInterviewInfoOpen(false)}
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
