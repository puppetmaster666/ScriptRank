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
          font-family: 'Courier New', monospace;
          background: white;
          color: #333;
          line-height: 1.6;
        }
      `}</style>

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="hero">
          <div className="container">
            <h1>
              NO MONEY? NO PROBLEM.<br/>
              <span className="highlight">LET AI JUDGE YOUR IDEA</span>
            </h1>
            <p className="subtitle">
              SKIP THE EXPENSIVE MARKETING. SUBMIT YOUR IDEA. GET RANKED BY AI. WIN CASH PRIZES.
            </p>
          </div>
        </section>

        {/* Value Proposition */}
        <section className="value-props">
          <div className="container">
            <div className="value-grid">
              <div className="value-card">
                <h3 className="value-title">No Kickstarter Budget?</h3>
                <p className="value-desc">
                  Other platforms need $10K+ for marketing to get noticed. Here? <strong>$0</strong>. 
                  Your idea speaks for itself.
                </p>
              </div>
              <div className="value-card">
                <h3 className="value-title">Instant AI Ranking</h3>
                <p className="value-desc">
                  No waiting for backers. Our harsh AI scores you immediately. 
                  Good ideas rise to the top <strong>automatically</strong>.
                </p>
              </div>
              <div className="value-card">
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
            <div className="leaderboard-grid">
              <div className="main-leaderboard">
                <div className="leaderboard-table">
                  <div className="leaderboard-header">
                    <h2>THIS WEEK'S BATTLEGROUND</h2>
                  </div>
                  
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
                    const [expanded, setExpanded] = React.useState(false);
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

        {/* How It Works - Single Line */}
        <section className="how-it-works">
          <div className="container">
            <h2>The Battleground Rules</h2>
            
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

        {/* Comparison Section - Moved Below */}
        <section className="comparison">
          <div className="container">
            <div className="comparison-grid">
              <div>
                <h2 style={{color: '#EF4444'}}>THE OLD WAY IS BROKEN</h2>
                <ul>
                  <li>
                    <span style={{color: '#EF4444', fontWeight: 'bold', fontSize: '24px'}}>×</span>
                    <span>Kickstarter: Need $10K+ marketing budget</span>
                  </li>
                  <li>
                    <span style={{color: '#EF4444', fontWeight: 'bold', fontSize: '24px'}}>×</span>
                    <span>IndieGoGo: Pay for ads or get buried</span>
                  </li>
                  <li>
                    <span style={{color: '#EF4444', fontWeight: 'bold', fontSize: '24px'}}>×</span>
                    <span>ProductHunt: Need existing audience</span>
                  </li>
                </ul>
              </div>
              <div>
                <h2 style={{color: '#10B981'}}>OUR WAY: MERIT ONLY</h2>
                <ul>
                  <li>
                    <span style={{color: '#10B981', fontWeight: 'bold', fontSize: '20px'}}>✓</span>
                    <span>AI judges quality, not marketing spend</span>
                  </li>
                  <li>
                    <span style={{color: '#10B981', fontWeight: 'bold', fontSize: '20px'}}>✓</span>
                    <span>Great ideas automatically rank high</span>
                  </li>
                  <li>
                    <span style={{color: '#10B981', fontWeight: 'bold', fontSize: '20px'}}>✓</span>
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
            <h2>No Budget? No Problem.</h2>
            <p>Stop begging for money. Let your idea prove itself.</p>
            <Link href="/submit">
              <a className="cta-button">Submit Now →</a>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer>
          <p>© 2024 MAKE ME FAMOUS. WHERE IDEAS FIGHT TO WIN.</p>
        </footer>
      </div>

      <style jsx>{`
        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 40px;
        }

        /* Hero */
        .hero {
          background: black;
          color: white;
          padding: 120px 0;
          text-align: center;
        }

        .hero h1 {
          font-family: 'DrukWide', Impact, sans-serif;
          font-size: clamp(48px, 6vw, 96px);
          font-weight: 900;
          font-style: italic;
          line-height: 0.95;
          letter-spacing: -0.02em;
          margin-bottom: 40px;
          max-width: 1200px;
          margin-left: auto;
          margin-right: auto;
        }

        .highlight {
          color: #FACC15;
        }

        .subtitle {
          font-family: 'Courier New', monospace;
          font-size: 20px;
          line-height: 1.6;
          opacity: 0.9;
          max-width: 800px;
          margin: 0 auto;
          letter-spacing: 0.5px;
        }

        /* Value Props */
        .value-props {
          background: white;
          border-bottom: 8px solid #FACC15;
          padding: 80px 0;
        }

        .value-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 60px;
        }

        .value-card {
          text-align: center;
          padding: 0 20px;
        }

        .value-title {
          font-family: 'DrukWide', Impact, sans-serif;
          font-size: 32px;
          font-weight: 900;
          margin-bottom: 20px;
          text-transform: uppercase;
          letter-spacing: -0.02em;
        }

        .value-desc {
          font-family: 'Courier New', monospace;
          font-size: 16px;
          line-height: 1.8;
          color: #666;
        }

        /* Comparison */
        .comparison {
          background: linear-gradient(to right, #1e3a8a, #1e40af);
          color: white;
          padding: 60px 0;
        }

        .comparison-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .comparison h2 {
          font-family: 'DrukWide', Impact, sans-serif;
          font-size: 36px;
          font-weight: 900;
          font-style: italic;
          margin-bottom: 30px;
          letter-spacing: -0.02em;
        }

        .comparison ul {
          list-style: none;
        }

        .comparison li {
          display: flex;
          gap: 16px;
          font-size: 16px;
          line-height: 1.6;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        /* Leaderboard */
        .leaderboard-preview {
          padding: 80px 0;
          background: white;
        }

        .leaderboard-grid {
          display: grid;
          grid-template-columns: 3fr 1fr;
          gap: 30px;
        }

        .leaderboard-table {
          background: white;
          border: 4px solid black;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 10px 10px 0 rgba(0,0,0,0.1);
        }

        .leaderboard-header {
          background: black;
          color: white;
          padding: 30px;
        }

        .leaderboard-header h2 {
          font-family: 'DrukWide', Impact, sans-serif;
          font-size: 42px;
          font-weight: 900;
          font-style: italic;
          text-transform: uppercase;
          letter-spacing: -0.02em;
        }

        .idea-row {
          padding: 25px;
          border-bottom: 2px solid #eee;
          transition: background 0.2s;
          position: relative;
        }

        .idea-row:hover {
          background: #f9f9f9;
        }

        .idea-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .vote-btn {
          background: black;
          color: white;
          border: none;
          padding: 8px 20px;
          font-family: 'Bahnschrift', sans-serif;
          font-size: 12px;
          font-weight: bold;
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
          color: #1e3a8a;
          cursor: pointer;
          font-family: 'Courier New', monospace;
          font-size: 14px;
          text-decoration: underline;
        }

        .expand-btn:hover {
          color: black;
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
          font-family: 'DrukWide', Impact, sans-serif;
          font-size: 20px;
          font-weight: 900;
          transform: rotate(3deg);
          border-radius: 8px;
        }

        .rank-1 { background: #FACC15; color: black; }
        .rank-2 { background: #9CA3AF; color: white; }
        .rank-3 { background: #EA580C; color: white; }
        .rank-default { background: #1F2937; color: white; }

        .idea-content {
          padding-left: 50px;
        }

        .idea-title {
          font-family: 'DrukWide', Impact, sans-serif;
          font-size: 24px;
          font-weight: 900;
          text-transform: uppercase;
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }

        .idea-meta {
          font-family: 'Courier New', monospace;
          font-size: 12px;
          color: #666;
          margin-bottom: 12px;
          text-transform: uppercase;
        }

        .idea-desc {
          font-family: 'Courier New', monospace;
          font-size: 14px;
          line-height: 1.5;
          margin-bottom: 16px;
          color: #333;
        }

        .score-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          padding-top: 16px;
          border-top: 1px solid #eee;
        }

        .score-item {
          text-align: center;
        }

        .score-value {
          font-family: 'Courier New', monospace;
          font-size: 24px;
          font-weight: bold;
          color: black;
        }

        .score-label {
          font-family: 'Bahnschrift', sans-serif;
          font-size: 10px;
          text-transform: uppercase;
          color: #999;
          letter-spacing: 1px;
        }

        .leaderboard-footer {
          background: black;
          color: white;
          padding: 20px;
          text-align: center;
        }

        .leaderboard-footer a {
          color: white;
          text-decoration: none;
          font-family: 'Bahnschrift', sans-serif;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .leaderboard-footer a:hover {
          color: #FACC15;
        }

        /* Sidebar Cards */
        .leaderboard-sidebar {
          margin-left: 20px;
        }

        .sidebar-card {
          background: white;
          border: 4px solid black;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 30px;
        }

        .sidebar-header {
          background: #FACC15;
          color: black;
          padding: 15px;
        }

        .sidebar-header h3 {
          font-family: 'DrukWide', Impact, sans-serif;
          font-size: 18px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: -0.02em;
        }

        .sidebar-content {
          padding: 15px;
        }

        .winner-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px;
          background: #f8f8f8;
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
          font-family: 'Bahnschrift', sans-serif;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
          margin-bottom: 2px;
        }

        .winner-score {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          color: #666;
        }

        .sidebar-link {
          display: block;
          background: black;
          color: white;
          text-align: center;
          padding: 10px;
          text-decoration: none;
          font-family: 'Bahnschrift', sans-serif;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-top: 10px;
          border-radius: 6px;
        }

        .sidebar-link:hover {
          background: #333;
        }

        /* Submit Card */
        .submit-card {
          background: black;
          color: white;
          border: 4px solid #FACC15;
        }

        .submit-card h3 {
          font-family: 'DrukWide', Impact, sans-serif;
          font-size: 24px;
          font-weight: 900;
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          padding: 15px 15px 0 15px;
        }

        .submit-card p {
          font-family: 'Courier New', monospace;
          font-size: 12px;
          margin-bottom: 15px;
          line-height: 1.4;
          padding: 0 15px;
        }

        .submit-button {
          display: block;
          background: #FACC15;
          color: black;
          text-align: center;
          padding: 14px;
          text-decoration: none;
          font-family: 'DrukWide', Impact, sans-serif;
          font-size: 16px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          border-radius: 0 0 8px 8px;
          margin-top: 10px;
        }

        .submit-button:hover {
          background: #FDE047;
        }

        /* How It Works - Single Line */
        .how-it-works {
          background: white;
          padding: 100px 0;
        }

        .how-it-works h2 {
          font-family: 'DrukWide', Impact, sans-serif;
          font-size: 56px;
          font-weight: 900;
          font-style: italic;
          text-align: center;
          margin-bottom: 80px;
          text-transform: uppercase;
          letter-spacing: -0.02em;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 40px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .step-card {
          text-align: center;
          padding: 40px 20px;
          background: white;
          border: 3px solid black;
          border-radius: 12px;
          transition: all 0.3s;
        }

        .step-card:hover {
          transform: translateY(-5px);
          box-shadow: 8px 8px 0 rgba(0,0,0,0.1);
        }

        .step-number {
          font-family: 'DrukWide', Impact, sans-serif;
          font-size: 56px;
          font-weight: 900;
          font-style: italic;
          color: #FACC15;
          margin-bottom: 15px;
        }

        .step-icon {
          font-size: 36px;
          margin-bottom: 15px;
          display: block;
        }

        .step-title {
          font-family: 'DrukWide', Impact, sans-serif;
          font-size: 20px;
          font-weight: 900;
          text-transform: uppercase;
          margin-bottom: 12px;
          letter-spacing: -0.02em;
        }

        .step-desc {
          font-family: 'Courier New', monospace;
          font-size: 13px;
          color: #666;
          line-height: 1.5;
        }

        /* Warning Box */
        .warning-box {
          max-width: 800px;
          margin: 80px auto 0;
          background: #DC2626;
          border: 4px solid #991B1B;
          border-radius: 12px;
          padding: 40px;
          color: white;
          text-align: center;
        }

        .warning-box h3 {
          font-family: 'Bahnschrift', sans-serif;
          font-size: 24px;
          text-transform: uppercase;
          margin-bottom: 16px;
        }

        .warning-box p {
          font-family: 'Courier New', monospace;
          font-size: 16px;
          line-height: 1.6;
        }

        /* CTA */
        .cta-section {
          background: linear-gradient(to right, #1e3a8a, #1e40af);
          padding: 100px 0;
          text-align: center;
          color: white;
        }

        .cta-section h2 {
          font-family: 'DrukWide', Impact, sans-serif;
          font-size: 64px;
          font-weight: 900;
          font-style: italic;
          margin-bottom: 30px;
          text-transform: uppercase;
          letter-spacing: -0.02em;
        }

        .cta-section p {
          font-family: 'Bahnschrift', sans-serif;
          font-size: 24px;
          margin-bottom: 50px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .cta-button {
          display: inline-block;
          background: #FACC15;
          color: black;
          padding: 24px 60px;
          font-family: 'DrukWide', Impact, sans-serif;
          font-size: 28px;
          font-weight: 900;
          font-style: italic;
          text-decoration: none;
          transition: transform 0.3s;
          text-transform: uppercase;
        }

        .cta-button:hover {
          transform: scale(1.05);
          background: #FDE047;
        }

        /* Footer */
        footer {
          background: black;
          color: white;
          padding: 40px 0;
          text-align: center;
          font-family: 'Courier New', monospace;
          font-size: 14px;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .container {
            padding: 0 20px;
          }
          
          .comparison-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          
          .score-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .steps-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  )
}
