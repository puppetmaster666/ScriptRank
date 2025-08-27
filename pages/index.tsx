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
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'WorkSans', serif;
          background: #FAF7F0;
          color: #2C2C2C;
          line-height: 1.6;
        }
      `}</style>

      <div className="min-h-screen">
        {/* Hero Section - Stays Black */}
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
            
            {/* Human Ideas Only Banner */}
            <div className="human-only-banner">
              <h4>HUMAN CREATIVITY ONLY</h4>
              <p>
                We believe in authentic human innovation. AI-generated submissions are prohibited. 
                Our detection systems flag suspicious content, and verified winners must prove ownership through video calls. 
                <strong> Let YOUR mind shine, not a machine's.</strong>
              </p>
            </div>
          </div>
        </section>

        {/* Leaderboard Preview with Two Sidebars */}
        <section className="leaderboard-preview">
          <div className="container-wide">
            <h2 className="section-title">THIS WEEK'S BATTLEGROUND</h2>
            
            <div className="leaderboard-layout">
              {/* Left Sidebar - Sponsors */}
              <div className="sidebar-left">
                <div className="sidebar-card">
                  <h4>SPONSORS</h4>
                  <div className="sponsor-list">
                    <div className="sponsor-item">
                      <div className="sponsor-logo">AI VENTURES</div>
                      <p className="sponsor-desc">Funding tomorrow's ideas today</p>
                    </div>
                    <div className="sponsor-item">
                      <div className="sponsor-logo">TECH CAPITAL</div>
                      <p className="sponsor-desc">$50M for innovative startups</p>
                    </div>
                    <div className="sponsor-item">
                      <div className="sponsor-logo">FUTURE FUND</div>
                      <p className="sponsor-desc">Early-stage investor network</p>
                    </div>
                  </div>
                  <a href="/sponsors" className="sidebar-link">BECOME A SPONSOR →</a>
                </div>
              </div>

              {/* Main Leaderboard */}
              <div className="main-leaderboard">
                <table className="leaderboard-table">
                  <thead>
                    <tr>
                      <th style={{width: '60px'}}>Rank</th>
                      <th>Name</th>
                      <th style={{width: '100px'}}>Type</th>
                      <th>Description</th>
                      <th style={{width: '80px'}}>AI Score</th>
                      <th style={{width: '80px'}}>Public</th>
                      <th style={{width: '80px'}}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { rank: 1, title: 'Neon Nights', type: 'Movie', author: 'Michael Rodriguez', desc: 'A cyberpunk thriller set in 2087 Tokyo. A detective with memory implants must solve murders that haven\'t happened yet.', aiScore: 8.73, publicScore: 9.1, publicVotes: 23, total: 8.92 },
                      { rank: 2, title: 'GreenEats', type: 'Business', author: 'David Park', desc: 'Zero-waste meal delivery using only reusable containers tracked by blockchain.', aiScore: 8.43, publicScore: 8.7, publicVotes: 18, total: 8.57 },
                      { rank: 3, title: 'Battle Royale Chess', type: 'Game', author: 'James Mitchell', desc: '100 players start on a giant chess board. Capture pieces to gain their powers.', aiScore: 8.04, publicScore: 8.3, publicVotes: 31, total: 8.17 },
                      { rank: 4, title: 'The Last Comedian', type: 'Movie', author: 'Sarah Chen', desc: 'In a world where AI has replaced all entertainment, one comedian fights to prove humans are still funny.', aiScore: 8.24, publicScore: 7.8, publicVotes: 12, total: 8.02 },
                      { rank: 5, title: 'Memory Lane VR', type: 'Game', author: 'Alex Thompson', desc: 'A VR game where players literally walk through their memories and can change small details.', aiScore: 7.92, publicScore: 8.1, publicVotes: 15, total: 8.01 },
                      { rank: 6, title: 'AI Resume Coach', type: 'Business', author: 'Lisa Anderson', desc: 'SaaS that analyzes job postings and automatically tailors your resume to match keywords.', aiScore: 8.12, publicScore: 7.6, publicVotes: 8, total: 7.86 },
                      { rank: 7, title: 'Mind Maze VR', type: 'Game', author: 'Emily Davis', desc: 'Puzzle VR game where each level is based on psychological concepts.', aiScore: 7.81, publicScore: 7.9, publicVotes: 10, total: 7.85 },
                      { rank: 8, title: 'Street Kings', type: 'Movie', author: 'Robert Taylor', desc: 'Crime drama following chess hustlers in NYC who use the game to run an underground empire.', aiScore: 7.71, publicScore: 7.5, publicVotes: 6, total: 7.60 },
                      { rank: 9, title: 'RentMyGarage', type: 'Business', author: 'Marcus Johnson', desc: 'Uber for storage space. Homeowners rent out garage space by the square foot.', aiScore: 7.63, publicScore: 7.2, publicVotes: 5, total: 7.41 },
                      { rank: 10, title: 'Echoes of Tomorrow', type: 'Movie', author: 'Jennifer Williams', desc: 'Sci-fi series about archaeologists who discover future artifacts buried in the past.', aiScore: 8.36, publicScore: 6.8, publicVotes: 3, total: 7.58 }
                    ].map((idea) => (
                      <tr key={idea.rank}>
                        <td className="rank-cell">
                          <span className={`rank-number ${idea.rank <= 3 ? `top-${idea.rank}` : ''}`}>
                            {idea.rank}
                          </span>
                        </td>
                        <td className="name-cell">
                          <div className="idea-title">{idea.title}</div>
                          <div className="idea-author">by {idea.author}</div>
                        </td>
                        <td className="type-cell">{idea.type}</td>
                        <td className="desc-cell">{idea.desc}</td>
                        <td className="score-cell">{idea.aiScore}</td>
                        <td className="score-cell">
                          <div>{idea.publicScore}</div>
                          <div className="votes">({idea.publicVotes})</div>
                        </td>
                        <td className="total-cell">{idea.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="leaderboard-footer">
                  <Link href="/leaderboard">
                    <a>VIEW FULL LEADERBOARD →</a>
                  </Link>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="sidebar-right">
                {/* Previous Month Winners */}
                <div className="sidebar-card">
                  <h4>LAST MONTH</h4>
                  <div className="winner-list">
                    <div className="winner-item">
                      <span className="winner-rank gold">1</span>
                      <div>
                        <div className="winner-title">THE MEMORY THIEF</div>
                        <div className="winner-score">9.2</div>
                      </div>
                    </div>
                    <div className="winner-item">
                      <span className="winner-rank silver">2</span>
                      <div>
                        <div className="winner-title">QUANTUM BREAK</div>
                        <div className="winner-score">8.9</div>
                      </div>
                    </div>
                    <div className="winner-item">
                      <span className="winner-rank bronze">3</span>
                      <div>
                        <div className="winner-title">MIND MAZE VR</div>
                        <div className="winner-score">8.7</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit CTA */}
                <div className="sidebar-card submit-card">
                  <h4>READY TO FIGHT?</h4>
                  <p>Submit your idea and face the AI judge.</p>
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
            <h2>The Battleground Rules</h2>
            
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number">1</div>
                <h3 className="step-title">Submit Your Weapon</h3>
                <p className="step-desc">Your idea is your weapon. 30-500 words. Make it count.</p>
              </div>
              
              <div className="step-card">
                <div className="step-number">2</div>
                <h3 className="step-title">Face the AI Judge</h3>
                <p className="step-desc">Brutal AI scores 0-10. No mercy. Most fail.</p>
              </div>
              
              <div className="step-card">
                <div className="step-number">3</div>
                <h3 className="step-title">Survive Public Vote</h3>
                <p className="step-desc">Community votes. Weak ideas die. Strong ideas rise.</p>
              </div>
              
              <div className="step-card">
                <div className="step-number">4</div>
                <h3 className="step-title">Claim Your Prize</h3>
                <p className="step-desc">$5,000 monthly prizes. Real investors watching.</p>
              </div>
            </div>

            <div className="warning-box">
              <h3>WARNING</h3>
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
            <div className="comparison-grid">
              <div>
                <h2>THE OLD WAY IS BROKEN</h2>
                <ul>
                  <li>
                    <span className="x-mark">×</span>
                    <span>Kickstarter: Need $10K+ marketing budget</span>
                  </li>
                  <li>
                    <span className="x-mark">×</span>
                    <span>IndieGoGo: Pay for ads or get buried</span>
                  </li>
                  <li>
                    <span className="x-mark">×</span>
                    <span>ProductHunt: Need existing audience</span>
                  </li>
                </ul>
              </div>
              <div>
                <h2>OUR WAY: MERIT ONLY</h2>
                <ul>
                  <li>
                    <span className="check-mark">✓</span>
                    <span>AI judges quality, not marketing spend</span>
                  </li>
                  <li>
                    <span className="check-mark">✓</span>
                    <span>Great ideas automatically rank high</span>
                  </li>
                  <li>
                    <span className="check-mark">✓</span>
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
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .container-wide {
          max-width: 1600px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* Hero - Stays Black */
        .hero {
          background: black;
          color: white;
          padding: 120px 0;
          text-align: center;
        }

        .hero h1 {
          font-family: 'ArgentumSans', serif;
          font-size: clamp(48px, 6vw, 96px);
          font-weight: 900;
          font-style: italic;
          line-height: 1;
          letter-spacing: -0.02em;
          margin-bottom: 40px;
          max-width: 1200px;
          margin-left: auto;
          margin-right: auto;
        }

        .highlight {
          color: #D4A574;
        }

        .subtitle {
          font-family: 'WorkSans', sans-serif;
          font-size: 18px;
          line-height: 1.6;
          opacity: 0.9;
          max-width: 800px;
          margin: 0 auto;
          letter-spacing: 0.5px;
        }

        /* Value Props */
        .value-props {
          background: #FAF7F0;
          padding: 80px 0;
          border-bottom: 1px solid #D4D4D4;
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
          font-family: 'ArgentumSans', serif;
          font-size: 28px;
          font-weight: 900;
          font-style: italic;
          margin-bottom: 20px;
          color: #2C2C2C;
        }

        .value-desc {
          font-family: 'WorkSans', sans-serif;
          font-size: 16px;
          line-height: 1.8;
          color: #4A4A4A;
        }

        /* Human Only Banner */
        .human-only-banner {
          margin-top: 60px;
          padding: 40px;
          background: #2C2C2C;
          color: #FAF7F0;
          text-align: center;
          border-left: 6px solid #D4A574;
        }

        .human-only-banner h4 {
          font-family: 'ArgentumSans', serif;
          font-size: 28px;
          font-weight: 900;
          font-style: italic;
          color: #D4A574;
          margin-bottom: 15px;
        }

        .human-only-banner p {
          font-family: 'WorkSans', sans-serif;
          font-size: 16px;
          line-height: 1.8;
          max-width: 800px;
          margin: 0 auto;
        }

        /* Leaderboard Section */
        .leaderboard-preview {
          padding: 80px 0;
          background: #FDFCF8;
        }

        .section-title {
          font-family: 'ArgentumSans', serif;
          font-size: 48px;
          font-weight: 900;
          font-style: italic;
          text-align: center;
          margin-bottom: 60px;
          color: #2C2C2C;
        }

        .leaderboard-layout {
          display: grid;
          grid-template-columns: 200px 1fr 200px;
          gap: 30px;
        }

        /* Sidebars */
        .sidebar-card {
          background: #FAF7F0;
          border: 1px solid #D4D4D4;
          padding: 20px;
          margin-bottom: 20px;
        }

        .sidebar-card h4 {
          font-family: 'ArgentumSans', serif;
          font-size: 16px;
          font-weight: 900;
          font-style: italic;
          margin-bottom: 15px;
          color: #2C2C2C;
        }

        /* Sponsors */
        .sponsor-list {
          margin-bottom: 20px;
        }

        .sponsor-item {
          padding: 12px 0;
          border-bottom: 1px solid #E5E5E5;
        }

        .sponsor-item:last-child {
          border-bottom: none;
        }

        .sponsor-logo {
          font-family: 'ArgentumSans', serif;
          font-size: 12px;
          font-weight: 900;
          font-style: italic;
          color: #2C2C2C;
          margin-bottom: 4px;
        }

        .sponsor-desc {
          font-family: 'WorkSans', sans-serif;
          font-size: 11px;
          color: #6B6B6B;
        }

        /* Winners */
        .winner-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .winner-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px;
          background: #FDFCF8;
        }

        .winner-rank {
          font-family: 'ArgentumSans', serif;
          font-size: 20px;
          font-weight: 900;
          font-style: italic;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }

        .winner-rank.gold { background: #D4A574; color: white; }
        .winner-rank.silver { background: #9CA3AF; color: white; }
        .winner-rank.bronze { background: #CD7F32; color: white; }

        .winner-title {
          font-family: 'WorkSans', sans-serif;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          color: #2C2C2C;
        }

        .winner-score {
          font-family: 'ArgentumSans', serif;
          font-size: 14px;
          font-weight: 900;
          font-style: italic;
          color: #D4A574;
        }

        /* Submit Card */
        .submit-card {
          background: #2C2C2C;
          color: #FAF7F0;
          border: none;
        }

        .submit-card h4 {
          color: #D4A574;
        }

        .submit-card p {
          font-family: 'WorkSans', sans-serif;
          font-size: 12px;
          margin-bottom: 15px;
        }

        .submit-button {
          display: block;
          background: #D4A574;
          color: #2C2C2C;
          text-align: center;
          padding: 12px;
          font-family: 'ArgentumSans', serif;
          font-size: 14px;
          font-weight: 900;
          font-style: italic;
          text-decoration: none;
          transition: all 0.2s;
        }

        .submit-button:hover {
          background: #C19660;
        }

        .sidebar-link {
          display: block;
          text-align: center;
          padding: 10px;
          background: #2C2C2C;
          color: #FAF7F0;
          font-family: 'WorkSans', sans-serif;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          text-decoration: none;
          transition: all 0.2s;
        }

        .sidebar-link:hover {
          background: #4A4A4A;
        }

        /* Main Leaderboard Table */
        .main-leaderboard {
          background: white;
          overflow: hidden;
        }

        .leaderboard-table {
          width: 100%;
          border-collapse: collapse;
        }

        .leaderboard-table thead {
          background: #2C2C2C;
          color: #FAF7F0;
        }

        .leaderboard-table th {
          font-family: 'WorkSans', sans-serif;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 15px;
          text-align: left;
          border-bottom: 1px solid #2C2C2C;
        }

        .leaderboard-table tbody tr {
          border-bottom: 1px solid #E5E5E5;
          transition: background 0.2s;
        }

        .leaderboard-table tbody tr:hover {
          background: #FAF7F0;
        }

        .leaderboard-table td {
          padding: 15px;
          font-family: 'WorkSans', sans-serif;
          font-size: 14px;
        }

        .rank-cell {
          text-align: center;
        }

        .rank-number {
          font-family: 'ArgentumSans', serif;
          font-size: 24px;
          font-weight: 900;
          font-style: italic;
          color: #2C2C2C;
        }

        .rank-number.top-1 { color: #D4A574; }
        .rank-number.top-2 { color: #9CA3AF; }
        .rank-number.top-3 { color: #CD7F32; }

        .idea-title {
          font-family: 'ArgentumSans', serif;
          font-size: 16px;
          font-weight: 900;
          font-style: italic;
          color: #2C2C2C;
          margin-bottom: 2px;
        }

        .idea-author {
          font-size: 12px;
          color: #6B6B6B;
        }

        .type-cell {
          text-transform: uppercase;
          font-size: 12px;
          color: #6B6B6B;
        }

        .desc-cell {
          color: #4A4A4A;
          line-height: 1.4;
        }

        .score-cell, .total-cell {
          text-align: center;
          font-family: 'ArgentumSans', serif;
          font-size: 18px;
          font-weight: 900;
          font-style: italic;
          color: #2C2C2C;
        }

        .votes {
          font-family: 'WorkSans', sans-serif;
          font-size: 10px;
          color: #6B6B6B;
          font-weight: 400;
        }

        .leaderboard-footer {
          background: #2C2C2C;
          color: #FAF7F0;
          padding: 20px;
          text-align: center;
        }

        .leaderboard-footer a {
          color: #FAF7F0;
          text-decoration: none;
          font-family: 'WorkSans', sans-serif;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .leaderboard-footer a:hover {
          color: #D4A574;
        }

        /* How It Works */
        .how-it-works {
          background: #FAF7F0;
          padding: 100px 0;
        }

        .how-it-works h2 {
          font-family: 'ArgentumSans', serif;
          font-size: 48px;
          font-weight: 900;
          font-style: italic;
          text-align: center;
          margin-bottom: 60px;
          color: #2C2C2C;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 30px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .step-card {
          text-align: center;
          padding: 30px 20px;
          background: #FDFCF8;
          border: 1px solid #D4D4D4;
          transition: all 0.3s;
        }

        .step-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        .step-number {
          font-family: 'ArgentumSans', serif;
          font-size: 48px;
          font-weight: 900;
          font-style: italic;
          color: #D4A574;
          margin-bottom: 15px;
        }

        .step-title {
          font-family: 'ArgentumSans', serif;
          font-size: 18px;
          font-weight: 900;
          font-style: italic;
          color: #2C2C2C;
          margin-bottom: 12px;
        }

        .step-desc {
          font-family: 'WorkSans', sans-serif;
          font-size: 14px;
          color: #6B6B6B;
          line-height: 1.6;
        }

        /* Warning Box */
        .warning-box {
          max-width: 700px;
          margin: 60px auto 0;
          background: #2C2C2C;
          padding: 40px;
          color: #FAF7F0;
          text-align: center;
        }

        .warning-box h3 {
          font-family: 'ArgentumSans', serif;
          font-size: 24px;
          font-weight: 900;
          font-style: italic;
          margin-bottom: 16px;
          color: #D4A574;
        }

        .warning-box p {
          font-family: 'WorkSans', sans-serif;
          font-size: 16px;
          line-height: 1.6;
        }

        /* Comparison */
        .comparison {
          background: #2C2C2C;
          color: #FAF7F0;
          padding: 80px 0;
        }

        .comparison-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .comparison h2 {
          font-family: 'ArgentumSans', serif;
          font-size: 32px;
          font-weight: 900;
          font-style: italic;
          margin-bottom: 30px;
        }

        .comparison ul {
          list-style: none;
        }

        .comparison li {
          display: flex;
          gap: 16px;
          font-family: 'WorkSans', sans-serif;
          font-size: 16px;
          line-height: 1.6;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .x-mark {
          color: #EF4444;
          font-weight: bold;
          font-size: 24px;
        }

        .check-mark {
          color: #10B981;
          font-weight: bold;
          font-size: 20px;
        }

        /* CTA */
        .cta-section {
          background: #D4A574;
          padding: 100px 0;
          text-align: center;
          color: #2C2C2C;
        }

        .cta-section h2 {
          font-family: 'ArgentumSans', serif;
          font-size: 56px;
          font-weight: 900;
          font-style: italic;
          margin-bottom: 20px;
        }

        .cta-section p {
          font-family: 'WorkSans', sans-serif;
          font-size: 20px;
          margin-bottom: 40px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .cta-button {
          display: inline-block;
          background: #2C2C2C;
          color: #FAF7F0;
          padding: 20px 50px;
          font-family: 'ArgentumSans', serif;
          font-size: 24px;
          font-weight: 900;
          font-style: italic;
          text-decoration: none;
          border: 2px solid #2C2C2C;
          transition: all 0.3s;
          text-transform: uppercase;
        }

        .cta-button:hover {
          background: #FAF7F0;
          color: #2C2C2C;
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
        @media (max-width: 1200px) {
          .leaderboard-layout {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .sidebar-left, .sidebar-right {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
          }
        }
        
        @media (max-width: 768px) {
          .container, .container-wide {
            padding: 0 20px;
          }
          
          .comparison-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          
          .steps-grid {
            grid-template-columns: 1fr;
          }
          
          .leaderboard-table {
            font-size: 12px;
          }
          
          .leaderboard-table th,
          .leaderboard-table td {
            padding: 10px 5px;
          }
        }
      `}</style>
    </>
  )
}
