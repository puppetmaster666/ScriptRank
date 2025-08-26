import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'

export default function WhyUsPage() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setFaqOpen(faqOpen === index ? null : index)
  }

  return (
    <>
      <Head>
        <title>Why Choose Us - Make Me Famous</title>
        <meta name="description" content="Proof of ownership, fair revenue sharing, and AI validation for your ideas" />
      </Head>

      <style jsx global>{`
        @font-face {
          font-family: 'ArgentumSans';
          src: url('/fonts/ArgentumSans-BlackItalic.ttf') format('truetype');
          font-weight: 900;
          font-style: italic;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'WorkSans';
          src: url('/fonts/WorkSans-Regular.ttf') format('truetype');
          font-weight: 400;
          font-display: swap;
        }
      `}</style>

      <div className="min-h-screen">
        {/* Hero Section - Stays Black */}
        <section className="hero">
          <div className="container">
            <h1>
              WHY TRUST US WITH<br/>
              <span className="highlight">YOUR BRILLIANT IDEA?</span>
            </h1>
            <p className="subtitle">
              PROTECTION, VALIDATION, AND OPPORTUNITY—ALL IN ONE PLACE
            </p>
          </div>
        </section>

        {/* Value Propositions */}
        <section className="value-props">
          <div className="container">
            <div className="value-grid">
              <div className="value-card">
                <div className="value-icon">🛡️</div>
                <h3 className="value-title">Proof of Ownership</h3>
                <p className="value-desc">
                  We timestamp and cryptographically sign your submission, creating undeniable proof that you were the first with your idea.
                </p>
              </div>
              <div className="value-card">
                <div className="value-icon">⚖️</div>
                <h3 className="value-title">Fair Revenue Share</h3>
                <p className="value-desc">
                  We only succeed when you do. We take a minimal 10% cut only if your project gets funding or generates revenue.
                </p>
              </div>
              <div className="value-card">
                <div className="value-icon">🤖</div>
                <h3 className="value-title">AI Validation</h3>
                <p className="value-desc">
                  Get immediate, unbiased feedback from our advanced AI system—no more waiting for human validation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="process">
          <div className="container">
            <h2>How Our Protection Works</h2>
            
            <div className="process-steps">
              <div className="process-step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Submit Your Idea</h3>
                  <p>Describe your project in detail. The more comprehensive, the stronger your proof.</p>
                </div>
              </div>
              <div className="process-step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Timestamp & Encrypt</h3>
                  <p>We immediately timestamp your submission and create a cryptographic hash stored on multiple secure servers.</p>
                </div>
              </div>
              <div className="process-step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Receive Verification</h3>
                  <p>You'll get a unique verification code and timestamped certificate for your records.</p>
                </div>
              </div>
              <div className="process-step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h3>Legal Support if Needed</h3>
                  <p>If ownership disputes arise, we provide the necessary evidence to support your claim.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Revenue Model */}
        <section className="revenue-model">
          <div className="container">
            <div className="revenue-content">
              <div className="revenue-text">
                <h2>Transparent Revenue Sharing</h2>
                <p>We believe in fair compensation. Our model ensures we only get paid when you succeed.</p>
                
                <div className="revenue-details">
                  <div className="revenue-item">
                    <div className="revenue-percent">10%</div>
                    <div className="revenue-desc">of funded amount or first-year revenue</div>
                  </div>
                  <div className="revenue-item">
                    <div className="revenue-percent">0%</div>
                    <div className="revenue-desc">if your project doesn't get funding</div>
                  </div>
                  <div className="revenue-item">
                    <div className="revenue-percent">5%</div>
                    <div className="revenue-desc">discount for exclusive licensing through our platform</div>
                  </div>
                </div>
              </div>
              <div className="revenue-visual">
                <div className="revenue-chart">
                  <div className="chart-bar your-share">
                    <div className="bar-label">Your Share: 90%</div>
                    <div className="bar-fill" style={{height: '90%'}}></div>
                  </div>
                  <div className="chart-bar our-share">
                    <div className="bar-label">Our Share: 10%</div>
                    <div className="bar-fill" style={{height: '10%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="benefits">
          <div className="container">
            <h2>More Reasons to Choose Us</h2>
            
            <div className="benefits-grid">
              <div className="benefit-card">
                <h3>Investor Access</h3>
                <p>Top-ranked ideas get seen by our network of investors and venture capitalists actively looking for new projects.</p>
              </div>
              <div className="benefit-card">
                <h3>Community Feedback</h3>
                <p>Get valuable input from our community of creators and innovators before investing significant resources.</p>
              </div>
              <div className="benefit-card">
                <h3>Marketing Boost</h3>
                <p>Featured projects receive promotional support through our channels and partner networks.</p>
              </div>
              <div className="benefit-card">
                <h3>No Upfront Costs</h3>
                <p>Submit your ideas without any fees. We only participate in your success.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq">
          <div className="container">
            <h2>Frequently Asked Questions</h2>
            
            <div className="faq-list">
              {[
                {
                  question: "How do you prove I was the first with my idea?",
                  answer: "We use cryptographic hashing and secure timestamping to create an immutable record of your submission. This creates legal evidence that can be used to establish ownership precedence."
                },
                {
                  question: "What happens if someone steals my idea?",
                  answer: "We provide documented proof of your original submission timestamp. While we can't prevent theft, we give you the evidence needed to defend your ownership claims."
                },
                {
                  question: "How is the 10% fee calculated?",
                  answer: "For funded projects, it's 10% of the total amount raised. For revenue-generating projects, it's 10% of first-year revenue, capped at $50,000 to ensure fairness."
                },
                {
                  question: "Can I submit multiple ideas?",
                  answer: "Yes! You can submit as many ideas as you want. Each submission is individually protected and evaluated."
                },
                {
                  question: "Who owns the rights to my idea?",
                  answer: "You retain full ownership of your intellectual property. We simply provide validation and protection services in exchange for a share of success."
                }
              ].map((faq, index) => (
                <div key={index} className="faq-item">
                  <button 
                    className="faq-question"
                    onClick={() => toggleFaq(index)}
                  >
                    {faq.question}
                    <span className="faq-icon">{faqOpen === index ? '−' : '+'}</span>
                  </button>
                  {faqOpen === index && (
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container">
            <h2>Ready to Protect Your Idea?</h2>
            <p>Join thousands of innovators who trust us with their brilliant concepts</p>
            <div className="cta-buttons">
              <Link href="/submit">
                <a className="cta-button">Submit Your Idea →</a>
              </Link>
              <Link href="/">
                <a className="cta-button secondary">Back to Home</a>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer>
          <p>© 2024 MAKE ME FAMOUS. PROTECTING INNOVATORS SINCE DAY ONE.</p>
        </footer>
      </div>

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* Hero - Stays Black */
        .hero {
          background: black;
          color: white;
          padding: 100px 0;
          text-align: center;
        }

        .hero h1 {
          font-family: 'ArgentumSans', serif;
          font-size: clamp(36px, 5vw, 64px);
          font-weight: 900;
          font-style: italic;
          line-height: 1;
          letter-spacing: -0.02em;
          margin-bottom: 30px;
        }

        .highlight {
          color: #D4A574;
        }

        .subtitle {
          font-family: 'WorkSans', sans-serif;
          font-size: 18px;
          line-height: 1.6;
          opacity: 0.9;
          max-width: 600px;
          margin: 0 auto;
        }

        /* Value Props */
        .value-props {
          padding: 80px 0;
          background: #FAF7F0;
        }

        .value-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 40px;
        }

        .value-card {
          text-align: center;
          padding: 30px;
          background: #FDFCF8;
          border: 1px solid #D4D4D4;
        }

        .value-icon {
          font-size: 48px;
          margin-bottom: 20px;
        }

        .value-title {
          font-family: 'ArgentumSans', serif;
          font-size: 24px;
          font-weight: 900;
          font-style: italic;
          margin-bottom: 15px;
          color: #2C2C2C;
        }

        .value-desc {
          font-family: 'WorkSans', sans-serif;
          font-size: 16px;
          line-height: 1.6;
          color: #4A4A4A;
        }

        /* Process */
        .process {
          padding: 80px 0;
          background: #FDFCF8;
        }

        .process h2 {
          font-family: 'ArgentumSans', serif;
          font-size: 36px;
          font-weight: 900;
          font-style: italic;
          text-align: center;
          margin-bottom: 60px;
          color: #2C2C2C;
        }

        .process-steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 30px;
        }

        .process-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .step-number {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #D4A574;
          color: #2C2C2C;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'ArgentumSans', serif;
          font-size: 24px;
          font-weight: 900;
          font-style: italic;
          margin-bottom: 20px;
        }

        .step-content h3 {
          font-family: 'ArgentumSans', serif;
          font-size: 20px;
          font-weight: 900;
          font-style: italic;
          margin-bottom: 10px;
          color: #2C2C2C;
        }

        .step-content p {
          font-family: 'WorkSans', sans-serif;
          font-size: 14px;
          color: #4A4A4A;
          line-height: 1.6;
        }

        /* Revenue Model */
        .revenue-model {
          padding: 80px 0;
          background: #2C2C2C;
          color: #FAF7F0;
        }

        .revenue-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }

        .revenue-text h2 {
          font-family: 'ArgentumSans', serif;
          font-size: 36px;
          font-weight: 900;
          font-style: italic;
          margin-bottom: 20px;
        }

        .revenue-text > p {
          font-family: 'WorkSans', sans-serif;
          font-size: 18px;
          margin-bottom: 40px;
          opacity: 0.9;
        }

        .revenue-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 30px;
        }

        .revenue-item {
          text-align: center;
        }

        .revenue-percent {
          font-family: 'ArgentumSans', serif;
          font-size: 32px;
          font-weight: 900;
          font-style: italic;
          color: #D4A574;
          margin-bottom: 10px;
        }

        .revenue-desc {
          font-family: 'WorkSans', sans-serif;
          font-size: 14px;
          opacity: 0.9;
        }

        .revenue-visual {
          display: flex;
          justify-content: center;
        }

        .revenue-chart {
          display: flex;
          align-items: end;
          gap: 20px;
          height: 200px;
        }

        .chart-bar {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 80px;
        }

        .bar-label {
          font-family: 'WorkSans', sans-serif;
          font-size: 12px;
          margin-bottom: 10px;
          text-align: center;
        }

        .bar-fill {
          width: 100%;
          border-radius: 6px 6px 0 0;
          transition: height 1s ease;
        }

        .your-share .bar-fill {
          background: #10B981;
        }

        .our-share .bar-fill {
          background: #D4A574;
        }

        /* Benefits */
        .benefits {
          padding: 80px 0;
          background: #FAF7F0;
        }

        .benefits h2 {
          font-family: 'ArgentumSans', serif;
          font-size: 36px;
          font-weight: 900;
          font-style: italic;
          text-align: center;
          margin-bottom: 60px;
          color: #2C2C2C;
        }

        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 30px;
        }

        .benefit-card {
          padding: 30px;
          background: #FDFCF8;
          border: 1px solid #D4D4D4;
        }

        .benefit-card h3 {
          font-family: 'ArgentumSans', serif;
          font-size: 20px;
          font-weight: 900;
          font-style: italic;
          margin-bottom: 15px;
          color: #2C2C2C;
        }

        .benefit-card p {
          font-family: 'WorkSans', sans-serif;
          font-size: 14px;
          color: #4A4A4A;
          line-height: 1.6;
        }

        /* FAQ */
        .faq {
          padding: 80px 0;
          background: #FDFCF8;
        }

        .faq h2 {
          font-family: 'ArgentumSans', serif;
          font-size: 36px;
          font-weight: 900;
          font-style: italic;
          text-align: center;
          margin-bottom: 60px;
          color: #2C2C2C;
        }

        .faq-list {
          max-width: 800px;
          margin: 0 auto;
        }

        .faq-item {
          margin-bottom: 20px;
          border: 1px solid #D4D4D4;
          overflow: hidden;
        }

        .faq-question {
          width: 100%;
          padding: 20px;
          background: #FAF7F0;
          border: none;
          text-align: left;
          font-family: 'ArgentumSans', serif;
          font-size: 18px;
          font-weight: 900;
          font-style: italic;
          color: #2C2C2C;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .faq-question:hover {
          background: #F5F2EA;
        }

        .faq-icon {
          font-size: 24px;
          font-weight: bold;
          color: #D4A574;
        }

        .faq-answer {
          padding: 20px;
          background: #FDFCF8;
          font-family: 'WorkSans', sans-serif;
          font-size: 16px;
          color: #4A4A4A;
          line-height: 1.6;
        }

        /* CTA */
        .cta-section {
          padding: 80px 0;
          background: #D4A574;
          color: #2C2C2C;
          text-align: center;
        }

        .cta-section h2 {
          font-family: 'ArgentumSans', serif;
          font-size: 36px;
          font-weight: 900;
          font-style: italic;
          margin-bottom: 20px;
        }

        .cta-section p {
          font-family: 'WorkSans', sans-serif;
          font-size: 18px;
          margin-bottom: 40px;
          opacity: 0.9;
        }

        .cta-buttons {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .cta-button {
          display: inline-block;
          background: #2C2C2C;
          color: #FAF7F0;
          padding: 16px 32px;
          font-family: 'ArgentumSans', serif;
          font-size: 18px;
          font-weight: 900;
          font-style: italic;
          text-decoration: none;
          transition: all 0.3s;
          border: 2px solid #2C2C2C;
        }

        .cta-button:hover {
          background: #FAF7F0;
          color: #2C2C2C;
          transform: translateY(-2px);
        }

        .cta-button.secondary {
          background: transparent;
          color: #2C2C2C;
          border: 2px solid #2C2C2C;
        }

        .cta-button.secondary:hover {
          background: #2C2C2C;
          color: #FAF7F0;
        }

        /* Footer */
        footer {
          background: #2C2C2C;
          color: #FAF7F0;
          padding: 40px 0;
          text-align: center;
          font-family: 'WorkSans', sans-serif;
          font-size: 14px;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .revenue-content {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          
          .revenue-chart {
            height: 150px;
          }
          
          .chart-bar {
            width: 60px;
          }
          
          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }
          
          .cta-button {
            width: 100%;
            max-width: 300px;
            text-align: center;
          }
        }
      `}</style>
    </>
  )
}
