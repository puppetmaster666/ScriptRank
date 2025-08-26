import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Make Me Famous - No Marketing Budget? No Problem. AI Ranks Your Idea.</title>
        <meta name="description" content="Skip the marketing. Let AI judge your idea. Get on the leaderboard. Win cash prizes." />
      </Head>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Archivo:wght@400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        
        @font-face {
          font-family: 'DrukWide';
          src: url('/fonts/Druk-HeavyItalic-Trial.otf') format('opentype');
          font-weight: 900;
          font-style: italic;
          font-display: swap;
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Space Grotesk', sans-serif;
          background: white;
          color: #111;
          line-height: 1.6;
        }

        h1, h2, h3, h4 {
          font-family: 'Archivo Black', sans-serif;
          letter-spacing: -0.02em;
        }
      `}</style>

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="hero">
          <div className="container">
            <div className="hero-content">
              <h1>
                NO MONEY? NO PROBLEM.<br/>
                <span className="highlight">LET AI JUDGE YOUR IDEA</span>
              </h1>
              <p className="subtitle">
                SKIP THE EXPENSIVE MARKETING. SUBMIT YOUR IDEA. GET RANKED BY AI. WIN CASH PRIZES.
              </p>
              <div className="hero-buttons">
                <Link href="/submit">
                  <a className="cta-button primary">Submit Your Idea</a>
                </Link>
                <Link href="/how-it-works">
                  <a className="cta-button secondary">How It Works</a>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Value Proposition */}
        <section className="value-props">
          <div className="container">
            <div className="section-header">
              <h2>Why Choose Our Arena?</h2>
              <p>Traditional platforms require money to compete. We require only talent.</p>
            </div>
            <div className="value-grid">
              <div className="value-card">
                <div className="value-icon">💰</div>
                <h3 className="value-title">Zero Marketing Budget</h3>
                <p className="value-desc">
                  Other platforms need $10K+ for marketing to get noticed. Here? <strong>$0</strong>. 
                  Your idea speaks for itself.
                </p>
              </div>
              <div className="value-card">
                <div className="value-icon">🤖</div>
                <h3 className="value-title">Instant AI Ranking</h3>
                <p className="value-desc">
                  No waiting for backers. Our harsh AI scores you immediately. 
                  Good ideas rise to the top <strong>automatically</strong>.
                </p>
              </div>
              <div className="value-card">
                <div className="value-icon">🏆</div>
                <h3 className="value-title">Monthly Cash Prizes</h3>
                <p className="value-desc">
                  Top ideas win <strong>real money</strong>. Investors browse the leaderboard. 
                  Every month is a new chance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Leaderboard Preview */}
        <section className="leaderboard-preview">
          <div className="container">
            <div className="section-header">
              <h2>THIS WEEK'S BATTLEGROUND</h2>
              <p>The top ideas fighting for dominance this week</p>
            </div>
            
            <div className="leaderboard-grid">
              <div className="main-leaderboard">
                <div className="leaderboard-table">
                  {/* Top 10 Ideas */}
                  {[
                    { rank: 1, title: 'Neon Nights', type: 'Movie', author: 'Michael Rodriguez', desc: 'A cyberpunk thriller set in 2087 Tokyo. A detective with memory implants must solve murders that haven\'t happened yet. The city itself becomes a character as augmented reality bleeds into the real world, creating a visually stunning exploration of memory, identity, and predestination.', aiScore: 8.73, publicScore: 9.1, publicVotes: 23, total: 8.92 },
                    { rank: 2, title: 'GreenEats', type: 'Business', author: 'David Park', desc: 'Zero-waste meal delivery using only reusable containers tracked by blockchain. Return containers get you discounts. Partner with local restaurants to create a sustainable food ecosystem that eliminates single-use plastics while providing convenience and cost savings.', aiScore: 8.43, publicScore: 8.7, publicVotes: 18, total: 8.57 },
                    { rank: 3, title: 'Battle Royale Chess', type: 'Game', author: 'James Mitchell', desc: '100 players start on a giant chess board. Capture pieces to gain their powers. Last player standing wins. Real-time strategy meets classic chess in an innovative multiplayer experience that combines tactical thinking with fast-paced action.', aiScore: 8.04, publicScore: 8.3, publicVotes: 31, total: 8.17 },
                    { rank: 4, title: 'The Last Comedian', type: 'Movie', author: 'Sarah Chen', desc: 'In a world where AI has replaced all entertainment, one comedian fights to prove humans are still funny. A dark comedy that questions what makes us human, exploring themes of authenticity, creativity, and the irreplaceable value of human imperfection.', aiScore: 8.24, publicScore: 7.8, publicVotes: 12, total: 8.02 },
                    { rank: 5, title: 'Memory Lane VR', type: 'Game', author: 'Alex Thompson', desc: 'A VR game where players literally walk through their memories and can change small details to alter their present. Each choice creates ripple effects, teaching players about consequence and the butterfly effect through deeply personal gameplay.', aiScore: 7.92, publicScore: 8.1, publicVotes: 15, total: 8.01 },
                    { rank: 6, title: 'AI Resume Coach', type: 'Business', author: 'Lisa Anderson', desc: 'SaaS that analyzes job postings and automatically tailors your resume to match keywords and requirements. Uses GPT to rewrite descriptions while maintaining authenticity, helping job seekers beat ATS systems and land more interviews.', aiScore: 8.12, publicScore: 7.6, publicVotes: 8, total: 7.86 },
                    { rank: 7, title: 'Mind Maze VR', type: 'Game', author: 'Emily Davis', desc: 'Puzzle VR game where each level is based on psychological concepts. Solve your own mind to escape. Features adaptive difficulty based on player behavior, creating a personalized journey through consciousness and self-discovery.', aiScore: 7.81, publicScore: 7.9, publicVotes: 10, total: 7.85 },
                    { rank: 8, title: 'Street Kings', type: 'Movie', author: 'Robert Taylor', desc: 'Crime drama following chess hustlers in NYC who use the game to run an underground empire. Each chess move mirrors their criminal strategy, creating a layered narrative where the game board reflects the streets of New York.', aiScore: 7.71, publicScore: 7.5, publicVotes: 6, total: 7.60 },
                    { rank: 9, title: 'RentMyGarage', type: 'Business', author: 'Marcus Johnson', desc: 'Uber for storage space. Homeowners rent out garage space by the square foot, with insurance included. Smart locks provide secure access while an AI pricing algorithm ensures fair market rates based on location and demand.', aiScore: 7.63, publicScore: 7.2, publicVotes: 5, total: 7.41 },
                    { rank: 10, title: 'Echoes of Tomorrow', type: 'Movie', author: 'Jennifer Williams', desc: 'Sci-fi series about archaeologists who discover future artifacts buried in the past. Each artifact reveals humanity\'s fate. Mind-bending time paradoxes explore free will versus determinism in a race to prevent or ensure the future.', aiScore: 8.36, publicScore: 6.8, publicVotes: 3, total: 7.58 }
                  ].map((idea) => {
                    const [expanded, setExpanded] = useState(false);
                    const shortDesc = idea.desc.substring(0, 100) + '...';
                    
                    return (
                      <div key={idea.rank} className="idea-row">
                        <div className={`rank-badge ${idea.rank <= 3 ? `rank-${idea.rank}` : 'rank-default'}`}>
                          #{idea.rank}
                        </div>
                        <div className="idea-content">
                          <div className="idea-header">
                            <div>
                              <h3 className="idea-title">{idea.title}</h3>
                              <div className="idea-meta">Type: {idea.type} • By: {idea.author}</div>
                            </div>
                            <button className="vote-btn">VOTE</button>
                          </div>
                          <p className="idea-desc">
                            {expanded ? idea.desc : shortDesc}
                            <button 
                              onClick={() => setExpanded(!expanded)} 
                              className="expand-btn"
                            >
                              {expanded ? ' Show less' : ' Read more'}
                            </button>
                          </p>
                          <div className="score-grid">
                            <div className="score-item">
                              <div className="score-value">{idea.aiScore}</div>
                              <div className="score-label">AI Score</div>
                            </div>
                            <div className="score-item">
                              <div className="score-value">{idea.publicScore}</div>
                              <div className="score-label">Public ({idea.publicVotes})</div>
                            </div>
                            <div className="score-item">
                              <div className="score-value">{idea.total}</div>
                              <div className="score-label">Total</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <div className="leaderboard-footer">
                    <Link href="/leaderboard">
                      <a>VIEW FULL LEADERBOARD →</a>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Sidebar - Narrower */}
              <div className="leaderboard-sidebar">
                {/* Previous Month Winners */}
                <div className="sidebar-card">
                  <div className="sidebar-header">
                    <h3>LAST MONTH'S CHAMPIONS</h3>
                  </div>
                  <div className="sidebar-content">
                    <div className="winner-item">
                      <span className="winner-badge gold">🥇</span>
                      <div className="winner-info">
                        <div className="winner-title">THE MEMORY THIEF</div>
                        <div className="winner-score">SCORE: 9.2</div>
                      </div>
                    </div>
                    <div className="winner-item">
                      <span className="winner-badge silver">🥈</span>
                      <div className="winner-info">
                        <div className="winner-title">QUANTUM BREAK</div>
                        <div className="winner-score">SCORE: 8.9</div>
                      </div>
                    </div>
                    <div className="winner-item">
                      <span className="winner-badge bronze">🥉</span>
                      <div className="winner-info">
                        <div className="winner-title">MIND MAZE VR</div>
                        <div className="winner-score">SCORE: 8.7</div>
                      </div>
                    </div>
                    <Link href="/archive">
                      <a className="sidebar-link">VIEW HALL OF FAME →</a>
                    </Link>
                  </div>
                </div>

                {/* Submit CTA */}
                <div className="sidebar-card submit-card">
                  <h3>READY TO FIGHT?</h3>
                  <p>Submit your idea. Face the AI. Climb the ranks.</p>
                  <Link href="/submit">
                    <a className="submit-button">ENTER ARENA →</a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="how-it-works">
          <div className="container">
            <div className="section-header">
              <h2>The Battleground Rules</h2>
              <p>Four simple steps from submission to victory</p>
            </div>
            
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number">1</div>
                <span className="step-icon">⚔️</span>
                <h3 className="step-title">Submit Your Weapon</h3>
                <p className="step-desc">Your idea is your weapon. 30-500 words. Make it count.</p>
              </div>
              
              <div className="step-card">
                <div className="step-number">2</div>
                <span className="step-icon">🤖</span>
                <h3 className="step-title">Face the AI Judge</h3>
                <p className="step-desc">Brutal AI scores 0-10. No mercy. Most fail.</p>
              </div>
              
              <div className="step-card">
                <div className="step-number">3</div>
                <span className="step-icon">🗳️</span>
                <h3 className="step-title">Survive Public Vote</h3>
                <p className="step-desc">Community votes. Weak ideas die. Strong ideas rise.</p>
              </div>
              
              <div className="step-card">
                <div className="step-number">4</div>
                <span className="step-icon">💰</span>
                <h3 className="step-title">Claim Your Prize</h3>
                <p className="step-desc">$5,000 monthly prizes. Real investors watching.</p>
              </div>
            </div>

            <div className="warning-box">
              <h3>Warning</h3>
              <p>
                The AI doesn't care about your feelings. Most ideas score 3-6. 
                If you can't handle brutal truth, leave now.
              </p>
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="comparison">
          <div className="container">
            <div className="section-header">
              <h2>The Old Way vs. Our Way</h2>
              <p>Why traditional platforms are broken and how we fix them</p>
            </div>
            <div className="comparison-grid">
              <div className="comparison-card broken">
                <h3>THE OLD WAY IS BROKEN</h3>
                <ul>
                  <li>
                    <span className="comparison-icon">×</span>
                    <span>Kickstarter: Need $10K+ marketing budget</span>
                  </li>
                  <li>
                    <span className="comparison-icon">×</span>
                    <span>IndieGoGo: Pay for ads or get buried</span>
                  </li>
                  <li>
                    <span className="comparison-icon">×</span>
                    <span>ProductHunt: Need existing audience</span>
                  </li>
                </ul>
              </div>
              <div className="comparison-card fixed">
                <h3>OUR WAY: MERIT ONLY</h3>
                <ul>
                  <li>
                    <span className="comparison-icon">✓</span>
                    <span>AI judges quality, not marketing spend</span>
                  </li>
                  <li>
                    <span className="comparison-icon">✓</span>
                    <span>Great ideas automatically rank high</span>
                  </li>
                  <li>
                    <span className="comparison-icon">✓</span>
                    <span>Investors see the best ideas first</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container">
            <div className="section-header">
              <h2>No Budget? No Problem.</h2>
              <p>Stop begging for money. Let your idea prove itself.</p>
            </div>
            <Link href="/submit">
              <a className="cta-button large">Submit Now →</a>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer>
          <p>© 2024 MAKE ME FAMOUS. WHERE IDEAS FIGHT TO WIN.</p>
          <div className="footer-links">
            <Link href="/why-us">
              <a>Why Choose Us</a>
            </Link>
            <Link href="/privacy">
              <a>Privacy Policy</a>
            </Link>
            <Link href="/terms">
              <a>Terms of Service</a>
            </Link>
          </div>
        </footer>
      </div>

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .section-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .section-header h2 {
          font-size: 2.5rem;
          margin-bottom: 16px;
          color: #111;
        }

        .section-header p {
          font-size: 1.1rem;
          color: #666;
          max-width: 600px;
          margin: 0 auto;
        }

        /* Hero */
        .hero {
          background: linear-gradient(to right, #0A0A1A, #000);
          color: white;
          padding: 120px 0 100px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23facc15' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
          opacity: 0.3;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 900px;
          margin: 0 auto;
        }

        .hero h1 {
          font-family: 'DrukWide', Impact, sans-serif;
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 900;
          font-style: italic;
          line-height: 0.95;
          letter-spacing: -0.02em;
          margin-bottom: 30px;
        }

        .highlight {
          color: #FACC15;
        }

        .subtitle {
          font-size: 1.2rem;
          line-height: 1.6;
          opacity: 0.9;
          max-width: 700px;
          margin: 0 auto 40px;
          font-weight: 400;
        }

        .hero-buttons {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .cta-button {
          display: inline-block;
          padding: 16px 32px;
          font-family: 'Archivo', sans-serif;
          font-weight: 700;
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.3s;
          text-align: center;
        }

        .cta-button.primary {
          background: #FACC15;
          color: #000;
          border: 2px solid #FACC15;
        }

        .cta-button.primary:hover {
          background: #000;
          color: #FACC15;
          transform: translateY(-2px);
        }

        .cta-button.secondary {
          background: transparent;
          color: white;
          border: 2px solid white;
        }

        .cta-button.secondary:hover {
          background: white;
          color: #000;
          transform: translateY(-2px);
        }

        .cta-button.large {
          padding: 20px 50px;
          font-size: 1.2rem;
        }

        /* Value Props */
        .value-props {
          padding: 100px 0;
          background: #fff;
        }

        .value-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 40px;
        }

        .value-card {
          text-align: center;
          padding: 40px 30px;
          background: #f8fafc;
          border-radius: 16px;
          transition: transform 0.3s, box-shadow 0.3s;
          border: 1px solid #e2e8f0;
        }

        .value-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }

        .value-icon {
          font-size: 48px;
          margin-bottom: 20px;
        }

        .value-title {
          font-size: 1.5rem;
          margin-bottom: 16px;
          color: #1e293b;
        }

        .value-desc {
          font-size: 1rem;
          color: #475569;
          line-height: 1.6;
        }

        /* Leaderboard */
        .leaderboard-preview {
          padding: 100px 0;
          background: #f8fafc;
        }

        .leaderboard-grid {
          display: grid;
          grid-template-columns: 3fr 1fr;
          gap: 30px;
        }

        .leaderboard-table {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          border: 1px solid #e2e8f0;
        }

        .leaderboard-header {
          background: #1e293b;
          color: white;
          padding: 30px;
        }

        .leaderboard-header h2 {
          font-size: 1.8rem;
          margin: 0;
          color: white;
        }

        .idea-row {
          padding: 25px;
          border-bottom: 1px solid #e2e8f0;
          transition: background 0.2s;
          position: relative;
        }

        .idea-row:hover {
          background: #f1f5f9;
        }

        .idea-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .vote-btn {
          background: #1e293b;
          color: white;
          border: none;
          padding: 8px 20px;
          font-family: 'Archivo', sans-serif;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .vote-btn:hover {
          background: #FACC15;
          color: black;
        }

        .expand-btn {
          background: none;
          border: none;
          color: #3b82f6;
          cursor: pointer;
          font-size: 14px;
          text-decoration: underline;
          margin-left: 5px;
        }

        .expand-btn:hover {
          color: #1e40af;
        }

        .rank-badge {
          position: absolute;
          top: -12px;
          left: -12px;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Archivo Black', sans-serif;
          font-size: 20px;
          font-weight: 900;
          transform: rotate(3deg);
          border-radius: 8px;
          z-index: 1;
        }

        .rank-1 { background: #FACC15; color: black; }
        .rank-2 { background: #9CA3AF; color: white; }
        .rank-3 { background: #EA580C; color: white; }
        .rank-default { background: #1F2937; color: white; }

        .idea-content {
          padding-left: 50px;
        }

        .idea-title {
          font-size: 1.4rem;
          margin-bottom: 8px;
          color: #111;
        }

        .idea-meta {
          font-size: 0.9rem;
          color: #64748b;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .idea-desc {
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 16px;
          color: #374151;
        }

        .score-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          padding-top: 16px;
          border-top: 1px solid #e2e8f0;
        }

        .score-item {
          text-align: center;
        }

        .score-value {
          font-family: 'Archivo', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
        }

        .score-label {
          font-size: 0.8rem;
          text-transform: uppercase;
          color: #64748b;
          letter-spacing: 1px;
        }

        .leaderboard-footer {
          background: #1e293b;
          color: white;
          padding: 20px;
          text-align: center;
        }

        .leaderboard-footer a {
          color: white;
          text-decoration: none;
          font-family: 'Archivo', sans-serif;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .leaderboard-footer a:hover {
          color: #FACC15;
        }

        /* Sidebar Cards */
        .leaderboard-sidebar {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .sidebar-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          border: 1px solid #e2e8f0;
        }

        .sidebar-header {
          background: #FACC15;
          color: black;
          padding: 20px;
        }

        .sidebar-header h3 {
          font-size: 1.2rem;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .sidebar-content {
          padding: 20px;
        }

        .winner-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px;
          background: #f8fafc;
          margin-bottom: 10px;
          border-radius: 8px;
        }

        .winner-badge {
          font-size: 24px;
        }

        .winner-info {
          flex: 1;
        }

        .winner-title {
          font-family: 'Archivo', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          text-transform: uppercase;
          margin-bottom: 2px;
          color: #111;
        }

        .winner-score {
          font-size: 0.8rem;
          color: #64748b;
        }

        .sidebar-link {
          display: block;
          background: #1e293b;
          color: white;
          text-align: center;
          padding: 12px;
          text-decoration: none;
          font-family: 'Archivo', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-top: 10px;
          border-radius: 6px;
          transition: background 0.2s;
        }

        .sidebar-link:hover {
          background: #334155;
        }

        /* Submit Card */
        .submit-card {
          background: #1e293b;
          color: white;
          text-align: center;
        }

        .submit-card h3 {
          font-size: 1.4rem;
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
          padding: 20px 20px 0 20px;
        }

        .submit-card p {
          font-size: 0.9rem;
          margin-bottom: 20px;
          line-height: 1.4;
          padding: 0 20px;
          opacity: 0.9;
        }

        .submit-button {
          display: block;
          background: #FACC15;
          color: black;
          text-align: center;
          padding: 16px;
          text-decoration: none;
          font-family: 'Archivo', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: background 0.2s;
        }

        .submit-button:hover {
          background: #fde047;
        }

        /* How It Works */
        .how-it-works {
          padding: 100px 0;
          background: white;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 30px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .step-card {
          text-align: center;
          padding: 40px 20px;
          background: #f8fafc;
          border-radius: 16px;
          transition: all 0.3s;
          border: 1px solid #e2e8f0;
        }

        .step-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }

        .step-number {
          font-family: 'Archivo Black', sans-serif;
          font-size: 3rem;
          font-weight: 900;
          color: #FACC15;
          margin-bottom: 15px;
        }

        .step-icon {
          font-size: 36px;
          margin-bottom: 15px;
          display: block;
        }

        .step-title {
          font-size: 1.3rem;
          margin-bottom: 12px;
          color: #1e293b;
        }

        .step-desc {
          font-size: 0.95rem;
          color: #475569;
          line-height: 1.6;
        }

        /* Warning Box */
        .warning-box {
          max-width: 800px;
          margin: 80px auto 0;
          background: #dc2626;
          border-radius: 16px;
          padding: 40px;
          color: white;
          text-align: center;
          border: 2px solid #991b1b;
        }

        .warning-box h3 {
          font-family: 'Archivo Black', sans-serif;
          font-size: 1.5rem;
          text-transform: uppercase;
          margin-bottom: 16px;
        }

        .warning-box p {
          font-size: 1rem;
          line-height: 1.6;
          opacity: 0.9;
        }

        /* Comparison */
        .comparison {
          padding: 100px 0;
          background: #f8fafc;
        }

        .comparison-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 40px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .comparison-card {
          padding: 40px;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .comparison-card.broken {
          background: white;
          border: 2px solid #ef4444;
        }

        .comparison-card.fixed {
          background: white;
          border: 2px solid #10b981;
        }

        .comparison-card h3 {
          font-size: 1.5rem;
          margin-bottom: 30px;
          text-align: center;
        }

        .comparison-card.broken h3 {
          color: #ef4444;
        }

        .comparison-card.fixed h3 {
          color: #10b981;
        }

        .comparison-card ul {
          list-style: none;
        }

        .comparison-card li {
          display: flex;
          gap: 16px;
          font-size: 1rem;
          line-height: 1.6;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .comparison-icon {
          font-weight: bold;
          font-size: 24px;
          flex-shrink: 0;
        }

        .comparison-card.broken .comparison-icon {
          color: #ef4444;
        }

        .comparison-card.fixed .comparison-icon {
          color: #10b981;
        }

        /* CTA */
        .cta-section {
          padding: 100px 0;
          background: linear-gradient(to right, #1e3a8a, #1e40af);
          color: white;
          text-align: center;
        }

        .cta-section .section-header h2 {
          color: white;
        }

        .cta-section .section-header p {
          color: rgba(255, 255, 255, 0.9);
        }

        /* Footer */
        footer {
          background: #0f172a;
          color: white;
          padding: 60px 0;
          text-align: center;
        }

        footer p {
          margin-bottom: 20px;
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .footer-links {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .footer-links a {
          color: #cbd5e1;
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.2s;
        }

        .footer-links a:hover {
          color: #FACC15;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .leaderboard-grid {
            grid-template-columns: 1fr;
          }
          
          .steps-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .container {
            padding: 0 16px;
          }
          
          .hero {
            padding: 80px 0 60px;
          }
          
          .hero-buttons {
            flex-direction: column;
            align-items: center;
          }
          
          .value-grid,
          .comparison-grid,
          .steps-grid {
            grid-template-columns: 1fr;
          }
          
          .section-header h2 {
            font-size: 2rem;
          }
          
          .idea-header {
            flex-direction: column;
            gap: 15px;
          }
          
          .score-grid {
            grid-template-columns: 1fr;
            gap: 15px;
          }
          
          .footer-links {
            flex-direction: column;
            gap: 10px;
          }
        }
      `}</style>
    </>
  )
}
