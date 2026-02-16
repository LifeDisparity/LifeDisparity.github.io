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
              <p>
                Individuals who cheat on interviews will be <span className="italic underline">blacklisted</span> from the club.
              </p>

              <div>
                <p className="font-semibold text-primary-light">General Interview Layout:</p>
                <p>It&apos;s recommended to do the interview with two people. This should be the layout of the interview:</p>
                <ol className="list-decimal pl-6 space-y-3 mt-2">
                  <li>
                    Screener
                    <ul className="list-disc pl-6 mt-1">
                      <li>Screen individuals if they have the correct background for the club - do not accept people who have done fundamental finance.</li>
                    </ul>
                  </li>
                  <li>
                    Behavioral interview (&lt;10min)
                    <ul className="list-disc pl-6 mt-1">
                      <li>Used as a measure how the individual is like to work with, their ability to work independently, and how likeable they are.</li>
                      <li>This is throughout the interview.</li>
                    </ul>
                  </li>
                  <li>
                    Easy Technical (5min)
                    <ul className="list-disc pl-6 mt-1">
                      <li>This is used as a screener - this should be a quicker answer.</li>
                    </ul>
                  </li>
                  <li>
                    Hard Technical (5 - 10min)
                    <ul className="list-disc pl-6 mt-1">
                      <li>This is used to learn how the individual thinks.</li>
                    </ul>
                  </li>
                  <li>
                    Leetcode (10min)
                    <ul className="list-disc pl-6 mt-1">
                      <li>Used to determine the individuals coding ability.</li>
                    </ul>
                  </li>
                </ol>
              </div>

              <p>
                If the interview does answer technical questions within the given time frame, it is viewed as incomplete and is your judgement if they would have arrived at the correct answer (for the math technicals). Do not provide the solution if the candidate is not understanding the problem or making progress on it.
              </p>

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
