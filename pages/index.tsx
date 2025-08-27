import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '@/lib/firebase'

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'movie' | 'game' | 'business'>('all')
  const [expandedIdea, setExpandedIdea] = useState<number | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })
    return () => unsubscribe()
  }, [])

  const handleVoteClick = (ideaId: number) => {
    if (!user) {
      setShowLoginModal(true)
    } else {
      // Navigate to idea page for voting
      window.location.href = `/ideas/fake-${ideaId}`
    }
  }

  const ideas = [
    { rank: 1, title: 'Neon Nights', type: 'movie', author: 'Michael Rodriguez', desc: 'A cyberpunk thriller set in 2087 Tokyo. A detective with memory implants must solve murders that haven\'t happened yet. The city itself becomes a character as augmented reality bleeds into the real world, creating a visually stunning neo-noir experience that questions the nature of reality and justice.', aiScore: 8.73, publicScore: 9.1, publicVotes: 23, total: 8.92 },
    { rank: 2, title: 'GreenEats', type: 'business', author: 'David Park', desc: 'Zero-waste meal delivery using only reusable containers tracked by blockchain. Customers return containers for discounts, creating a circular economy. Partner restaurants reduce packaging costs while appealing to eco-conscious consumers.', aiScore: 8.43, publicScore: 8.7, publicVotes: 18, total: 8.57 },
    { rank: 3, title: 'Battle Royale Chess', type: 'game', author: 'James Mitchell', desc: '100 players start on a giant chess board. Capture pieces to gain their powers. Last player standing wins. Combines strategic thinking with fast-paced action, creating a unique competitive experience.', aiScore: 8.04, publicScore: 8.3, publicVotes: 31, total: 8.17 },
    { rank: 4, title: 'The Last Comedian', type: 'movie', author: 'Sarah Chen', desc: 'In a world where AI has replaced all entertainment, one comedian fights to prove humans are still funny. A dark comedy exploring what makes us uniquely human in an age of artificial intelligence.', aiScore: 8.24, publicScore: 7.8, publicVotes: 12, total: 8.02 },
    { rank: 5, title: 'Memory Lane VR', type: 'game', author: 'Alex Thompson', desc: 'A VR game where players literally walk through their memories and can change small details to alter their present. Each choice creates ripple effects, exploring themes of regret, nostalgia, and the butterfly effect.', aiScore: 7.92, publicScore: 8.1, publicVotes: 15, total: 8.01 },
    { rank: 6, title: 'AI Resume Coach', type: 'business', author: 'Lisa Anderson', desc: 'SaaS that analyzes job postings and automatically tailors your resume to match keywords and requirements. Uses GPT to rewrite descriptions while maintaining authenticity and personal voice.', aiScore: 8.12, publicScore: 7.6, publicVotes: 8, total: 7.86 },
    { rank: 7, title: 'Mind Maze VR', type: 'game', author: 'Emily Davis', desc: 'Puzzle VR game where each level is based on psychological concepts. Players solve their own mind to escape, featuring adaptive difficulty based on player behavior and psychological profiles.', aiScore: 7.81, publicScore: 7.9, publicVotes: 10, total: 7.85 },
    { rank: 8, title: 'Street Kings', type: 'movie', author: 'Robert Taylor', desc: 'Crime drama following chess hustlers in NYC who use the game to run an underground empire. Each chess move mirrors their criminal strategy, creating a layered narrative about strategy and survival.', aiScore: 7.71, publicScore: 7.5, publicVotes: 6, total: 7.60 },
    { rank: 9, title: 'RentMyGarage', type: 'business', author: 'Marcus Johnson', desc: 'Uber for storage space. Homeowners rent out garage space by the square foot. Smart locks provide secure access while insurance protects both parties. Perfect for urban areas with limited storage.', aiScore: 7.63, publicScore: 7.2, publicVotes: 5, total: 7.41 },
    { rank: 10, title: 'Echoes of Tomorrow', type: 'movie', author: 'Jennifer Williams', desc: 'Sci-fi series about archaeologists who discover future artifacts buried in the past. Each artifact reveals humanity\'s potential fate, creating a mind-bending exploration of time paradoxes and free will.', aiScore: 8.36, publicScore: 6.8, publicVotes: 3, total: 7.58 }
  ]

  const filteredIdeas = activeTab === 'all' 
    ? ideas 
    : ideas.filter(idea => idea.type === activeTab)

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
        {/* Hero Section - Compact */}
        <section className="hero">
          <div className="container">
            <h1>
              NO MONEY? NO PROBLEM.<br/>
              <span className="highlight">LET AI JUDGE YOUR IDEA</span>
            </h1>
            <p className="subtitle">
              Skip the expensive marketing. Submit your idea. Get ranked by AI. Win cash prizes.
            </p>
          </div>
        </section>

        {/* Value Proposition - Condensed */}
        <section className="value-props">
          <div className="container">
            <div className="value-grid">
              <div className="value-card">
                <div className="value-icon">💰</div>
                <h3>No Kickstarter Budget?</h3>
                <p>Other platforms need $10K+ marketing. Here? <strong>$0</strong>.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">⚡</div>
                <h3>Instant AI Ranking</h3>
                <p>No waiting for backers. Good ideas rise <strong>automatically</strong>.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">🏆</div>
                <h3>Monthly Cash Prizes</h3>
                <p>Top ideas win <strong>real money</strong> and investor attention.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Leaderboard with Tabs */}
        <section className="leaderboard-section">
          <div className="container">
            <h2>THIS WEEK'S BATTLEGROUND</h2>
            
            {/* Filter Tabs */}
            <div className="filter-tabs">
              <button 
                className={`tab ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                All Ideas
              </button>
              <button 
                className={`tab ${activeTab === 'movie' ? 'active' : ''}`}
                onClick={() => setActiveTab('movie')}
              >
                🎬 Movies
              </button>
              <button 
                className={`tab ${activeTab === 'game' ? 'active' : ''}`}
                onClick={() => setActiveTab('game')}
              >
                🎮 Games
              </button>
              <button 
                className={`tab ${activeTab === 'business' ? 'active' : ''}`}
                onClick={() => setActiveTab('business')}
              >
                💼 Business
              </button>
            </div>

            {/* Leaderboard */}
            <div className="leaderboard-wrapper">
              <div className="leaderboard-header">
                <div className="header-rank">Rank</div>
                <div className="header-idea">Idea</div>
                <div className="header-scores">Scores</div>
                <div className="header-action">Action</div>
              </div>
              
              <div className="leaderboard-body">
                {filteredIdeas.map((idea) => (
                  <div key={idea.rank} className="leaderboard-item">
                    <div className="item-rank">
                      <span className={`rank-badge ${idea.rank <= 3 ? `top-${idea.rank}` : ''}`}>
                        {idea.rank}
                      </span>
                    </div>
                    
                    <div className="item-content">
                      <div className="item-header">
                        <h3>{idea.title}</h3>
                        <span className={`type-badge ${idea.type}`}>
                          {idea.type === 'movie' ? '🎬' : idea.type === 'game' ? '🎮' : '💼'} {idea.type}
                        </span>
                      </div>
                      <p className="item-author">by {idea.author}</p>
                      <p className={`item-desc ${expandedIdea === idea.rank ? 'expanded' : ''}`}>
                        {idea.desc}
                      </p>
                      <button 
                        className="expand-btn"
                        onClick={() => setExpandedIdea(expandedIdea === idea.rank ? null : idea.rank)}
                      >
                        {expandedIdea === idea.rank ? 'Show less ↑' : 'Read more ↓'}
                      </button>
                    </div>
                    
                    <div className="item-scores">
                      <div className="score-item">
                        <div className="score-label">AI</div>
                        <div className="score-value">{idea.aiScore}</div>
                      </div>
                      <div className="score-item">
                        <div className="score-label">Public</div>
                        <div className="score-value">
                          {idea.publicScore}
                          <span className="vote-count">({idea.publicVotes})</span>
                        </div>
                      </div>
                      <div className="score-item total">
                        <div className="score-label">Total</div>
                        <div className="score-value">{idea.total}</div>
                      </div>
                    </div>
                    
                    <div className="item-action">
                      <button 
                        className="vote-btn"
                        onClick={() => handleVoteClick(idea.rank)}
                      >
                        {user ? 'Vote' : 'Sign in to Vote'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="leaderboard-footer">
                <Link href="/leaderboard">
                  <a>VIEW FULL LEADERBOARD →</a>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Login Modal */}
        {showLoginModal && (
          <LoginModal onClose={() => setShowLoginModal(false)} />
        )}

        {/* Rest of sections remain the same... */}
        <section className="how-it-works">
          <div className="container">
            <h2>The Battleground Rules</h2>
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number">1</div>
                <h3>Submit Your Weapon</h3>
                <p>Your idea is your weapon. 30-500 words.</p>
              </div>
              <div className="step-card">
                <div className="step-number">2</div>
                <h3>Face the AI Judge</h3>
                <p>Brutal AI scores 0-10. No mercy.</p>
              </div>
              <div className="step-card">
                <div className="step-number">3</div>
                <h3>Survive Public Vote</h3>
                <p>Community votes. Strong ideas rise.</p>
              </div>
              <div className="step-card">
                <div className="step-number">4</div>
                <h3>Claim Your Prize</h3>
                <p>$5,000 monthly prizes. Real investors.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="container">
            <h2>No Budget? No Problem.</h2>
            <p>Stop begging for money. Let your idea prove itself.</p>
            <Link href="/submit">
              <a className="cta-button">Submit Now →</a>
            </Link>
          </div>
        </section>

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

        /* Hero - Compact */
        .hero {
          background: black;
          color: white;
          padding: 60px 0 50px;
          text-align: center;
        }

        .hero h1 {
          font-family: 'ArgentumSans', serif;
          font-size: clamp(32px, 4.5vw, 56px);
          font-weight: 900;
          font-style: italic;
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin-bottom: 24px;
        }

        .highlight {
          color: #D4A574;
        }

        .subtitle {
          font-family: 'WorkSans', sans-serif;
          font-size: 16px;
          line-height: 1.6;
          opacity: 0.9;
          max-width: 600px;
          margin: 0 auto;
        }

        /* Value Props - Condensed */
        .value-props {
          background: #FAF7F0;
          padding: 50px 0;
        }

        .value-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }

        .value-card {
          background: #FDFCF8;
          padding: 30px;
          border-radius: 12px;
          text-align: center;
          transition: all 0.3s;
        }

        .value-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
        }

        .value-icon {
          font-size: 36px;
          margin-bottom: 16px;
        }

        .value-card h3 {
          font-family: 'ArgentumSans', serif;
          font-size: 20px;
          font-weight: 900;
          font-style: italic;
          margin-bottom: 12px;
          color: #2C2C2C;
        }

        .value-card p {
          font-family: 'WorkSans', sans-serif;
          font-size: 14px;
          line-height: 1.6;
          color: #4A4A4A;
        }

        /* Leaderboard Section */
        .leaderboard-section {
          background: #FDFCF8;
          padding: 60px 0;
        }

        .leaderboard-section h2 {
          font-family: 'ArgentumSans', serif;
          font-size: 36px;
          font-weight: 900;
          font-style: italic;
          text-align: center;
          margin-bottom: 40px;
          color: #2C2C2C;
        }

        /* Filter Tabs */
        .filter-tabs {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 30px;
        }

        .tab {
          padding: 10px 20px;
          background: #FAF7F0;
          border: none;
          border-radius: 8px;
          font-family: 'WorkSans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #4A4A4A;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tab:hover {
          background: #2C2C2C;
          color: #FAF7F0;
        }

        .tab.active {
          background: #2C2C2C;
          color: #FAF7F0;
        }

        /* Leaderboard */
        .leaderboard-wrapper {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .leaderboard-header {
          display: grid;
          grid-template-columns: 60px 1fr 200px 120px;
          gap: 20px;
          padding: 20px;
          background: #2C2C2C;
          color: #FAF7F0;
          font-family: 'WorkSans', sans-serif;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .leaderboard-body {
          padding: 0;
        }

        .leaderboard-item {
          display: grid;
          grid-template-columns: 60px 1fr 200px 120px;
          gap: 20px;
          padding: 20px;
          border-bottom: 1px solid #E5E5E5;
          transition: all 0.2s;
        }

        .leaderboard-item:hover {
          background: #FAF7F0;
        }

        .item-rank {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .rank-badge {
          font-family: 'ArgentumSans', serif;
          font-size: 24px;
          font-weight: 900;
          font-style: italic;
          color: #2C2C2C;
        }

        .rank-badge.top-1 { color: #D4A574; }
        .rank-badge.top-2 { color: #9CA3AF; }
        .rank-badge.top-3 { color: #CD7F32; }

        .item-content h3 {
          font-family: 'ArgentumSans', serif;
          font-size: 18px;
          font-weight: 900;
          font-style: italic;
          color: #2C2C2C;
          margin-bottom: 4px;
        }

        .item-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .type-badge {
          font-family: 'WorkSans', sans-serif;
          font-size: 11px;
          text-transform: uppercase;
          padding: 4px 8px;
          border-radius: 4px;
          background: #FAF7F0;
        }

        .type-badge.movie { color: #8B4513; }
        .type-badge.game { color: #4B0082; }
        .type-badge.business { color: #006400; }

        .item-author {
          font-family: 'WorkSans', sans-serif;
          font-size: 13px;
          color: #6B6B6B;
          margin-bottom: 8px;
        }

        .item-desc {
          font-family: 'WorkSans', sans-serif;
          font-size: 14px;
          line-height: 1.4;
          color: #4A4A4A;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .item-desc.expanded {
          -webkit-line-clamp: unset;
        }

        .expand-btn {
          margin-top: 8px;
          background: none;
          border: none;
          color: #D4A574;
          font-family: 'WorkSans', sans-serif;
          font-size: 13px;
          cursor: pointer;
          padding: 0;
        }

        .expand-btn:hover {
          text-decoration: underline;
        }

        .item-scores {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .score-item {
          text-align: center;
        }

        .score-label {
          font-family: 'WorkSans', sans-serif;
          font-size: 11px;
          text-transform: uppercase;
          color: #6B6B6B;
          margin-bottom: 4px;
        }

        .score-value {
          font-family: 'ArgentumSans', serif;
          font-size: 20px;
          font-weight: 900;
          font-style: italic;
          color: #2C2C2C;
        }

        .vote-count {
          display: block;
          font-family: 'WorkSans', sans-serif;
          font-size: 10px;
          color: #6B6B6B;
          font-weight: 400;
        }

        .score-item.total .score-value {
          color: #D4A574;
        }

        .vote-btn {
          background: #2C2C2C;
          color: #FAF7F0;
          border: none;
          border-radius: 6px;
          padding: 10px 20px;
          font-family: 'WorkSans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .vote-btn:hover {
          background: #D4A574;
          color: #2C2C2C;
        }

        .leaderboard-footer {
          background: #2C2C2C;
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
          padding: 60px 0;
        }

        .how-it-works h2 {
          font-family: 'ArgentumSans', serif;
          font-size: 36px;
          font-weight: 900;
          font-style: italic;
          text-align: center;
          margin-bottom: 40px;
          color: #2C2C2C;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }

        .step-card {
          text-align: center;
          padding: 30px 20px;
          background: #FDFCF8;
          border-radius: 12px;
          transition: all 0.3s;
        }

        .step-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }

        .step-number {
          font-family: 'ArgentumSans', serif;
          font-size: 36px;
          font-weight: 900;
          font-style: italic;
          color: #D4A574;
          margin-bottom: 12px;
        }

        .step-card h3 {
          font-family: 'ArgentumSans', serif;
          font-size: 18px;
          font-weight: 900;
          font-style: italic;
          color: #2C2C2C;
          margin-bottom: 8px;
        }

        .step-card p {
          font-family: 'WorkSans', sans-serif;
          font-size: 13px;
          color: #6B6B6B;
          line-height: 1.5;
        }

        /* CTA */
        .cta-section {
          background: #D4A574;
          padding: 60px 0;
          text-align: center;
          color: #2C2C2C;
        }

        .cta-section h2 {
          font-family: 'ArgentumSans', serif;
          font-size: 36px;
          font-weight: 900;
          font-style: italic;
          margin-bottom: 16px;
        }

        .cta-section p {
          font-family: 'WorkSans', sans-serif;
          font-size: 16px;
          margin-bottom: 30px;
        }

        .cta-button {
          display: inline-block;
          background: #2C2C2C;
          color: #FAF7F0;
          padding: 14px 32px;
          font-family: 'ArgentumSans', serif;
          font-size: 18px;
          font-weight: 900;
          font-style: italic;
          text-decoration: none;
          border-radius: 6px;
          transition: all 0.3s;
        }

        .cta-button:hover {
          background: #FAF7F0;
          color: #2C2C2C;
        }

        /* Footer */
        footer {
          background: #2C2C2C;
          color: #FAF7F0;
          padding: 30px 0;
          text-align: center;
          font-family: 'WorkSans', sans-serif;
          font-size: 13px;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .hero h1 {
            font-size: 28px;
          }
          
          .steps-grid {
            grid-template-columns: 1fr;
          }
          
          .leaderboard-header,
          .leaderboard-item {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          
          .header-rank, .header-scores, .header-action {
            display: none;
          }
          
          .item-rank, .item-scores, .item-action {
            display: none;
          }
        }
      `}</style>
    </>
  )
}

// Login Modal Component
function LoginModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      if (isSignUp) {
        // Sign up logic
        const { createUserWithEmailAndPassword } = await import('firebase/auth')
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        // Sign in logic
        const { signInWithEmailAndPassword } = await import('firebase/auth')
        await signInWithEmailAndPassword(auth, email, password)
      }
      onClose()
    } catch (err: any) {
      setError(err.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>×</button>
          <h2>{isSignUp ? 'Create Account' : 'Sign In'}</h2>
          
          {error && <div className="modal-error">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
            </button>
          </form>
          
          <p className="modal-switch">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button onClick={() => setIsSignUp(!isSignUp)}>
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
      
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .modal-content {
          background: #FDFCF8;
          border-radius: 12px;
          padding: 40px;
          width: 90%;
          max-width: 400px;
          position: relative;
        }
        
        .modal-close {
          position: absolute;
          top: 20px;
          right: 20px;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #2C2C2C;
        }
        
        h2 {
          font-family: 'ArgentumSans', serif;
          font-size: 28px;
          font-weight: 900;
          font-style: italic;
          color: #2C2C2C;
          margin-bottom: 24px;
          text-align: center;
        }
        
        .modal-error {
          background: #FFE5E5;
          color: #CC0000;
          padding: 12px;
          border-radius: 6px;
          margin-bottom: 20px;
          font-family: 'WorkSans', sans-serif;
          font-size: 14px;
        }
        
        form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        input {
          padding: 14px;
          border: 2px solid #E5E5E5;
          border-radius: 6px;
          font-family: 'WorkSans', sans-serif;
          font-size: 14px;
          transition: border-color 0.2s;
        }
        
        input:focus {
          outline: none;
          border-color: #D4A574;
        }
        
        button[type="submit"] {
          background: #2C2C2C;
          color: #FAF7F0;
          padding: 14px;
          border: none;
          border-radius: 6px;
          font-family: 'WorkSans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        button[type="submit"]:hover:not(:disabled) {
          background: #D4A574;
          color: #2C2C2C;
        }
        
        button[type="submit"]:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .modal-switch {
          text-align: center;
          margin-top: 20px;
          font-family: 'WorkSans', sans-serif;
          font-size: 14px;
          color: #6B6B6B;
        }
        
        .modal-switch button {
          background: none;
          border: none;
          color: #D4A574;
          cursor: pointer;
          margin-left: 4px;
          text-decoration: underline;
        }
      `}</style>
    </>
  )
}
