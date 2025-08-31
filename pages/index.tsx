import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore'
import ArchiveSidebar from '@/components/ArchiveSidebar'

interface Idea {
  id: string
  title: string
  type: string
  author: string
  desc: string
  aiScore: number
  marketScore?: number
  innovationScore?: number
  executionScore?: number
  publicScore: number
  publicVotes: number
  total: number
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState<'ai' | 'market' | 'innovation' | 'execution' | 'public'>('ai')
  const [expandedIdea, setExpandedIdea] = useState<number | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    fetchIdeas()
  }, [])

  const fetchIdeas = async () => {
    try {
      const ideasQuery = query(
        collection(db, 'ideas'),
        orderBy('aiScores.overall', 'desc'),
        limit(10)
      )
      
      const snapshot = await getDocs(ideasQuery)
      const fetchedIdeas = snapshot.docs.map((doc, index) => {
        const data = doc.data()
        return {
          id: doc.id,
          rank: index + 1,
          title: data.title,
          type: data.type,
          author: data.username || data.userName || 'Anonymous',
          desc: data.content,
          aiScore: data.aiScores?.overall || data.aiScore || 0,
          marketScore: data.aiScores?.market || 0,
          innovationScore: data.aiScores?.innovation || 0,
          executionScore: data.aiScores?.execution || 0,
          publicScore: data.publicScore?.average || 0,
          publicVotes: data.publicScore?.count || 0,
          total: data.aiScores?.overall || data.aiScore || 0
        }
      }) as Idea[]
      
      setIdeas(fetchedIdeas)
    } catch (error) {
      console.error('Error fetching ideas:', error)
      // Fallback to mock data if database fails
      setIdeas(mockIdeas)
    } finally {
      setLoading(false)
    }
  }

  // Mock data as fallback
  const mockIdeas: Idea[] = [
    { id: '1', rank: 1, title: 'Neon Nights', type: 'movie', author: 'Michael Rodriguez', desc: 'A cyberpunk thriller set in 2087 Tokyo...', aiScore: 8.73, marketScore: 8.52, innovationScore: 9.01, executionScore: 8.64, publicScore: 9.1, publicVotes: 23, total: 8.73 },
    { id: '2', rank: 2, title: 'GreenEats', type: 'business', author: 'David Park', desc: 'Zero-waste meal delivery using only reusable containers...', aiScore: 8.43, marketScore: 8.79, innovationScore: 8.02, executionScore: 8.31, publicScore: 8.7, publicVotes: 18, total: 8.43 },
    { id: '3', rank: 3, title: 'Battle Royale Chess', type: 'game', author: 'James Mitchell', desc: '100 players start on a giant chess board...', aiScore: 8.04, marketScore: 8.22, innovationScore: 8.15, executionScore: 7.76, publicScore: 8.3, publicVotes: 31, total: 8.04 },
  ]

  const handleVoteClick = (ideaId: string) => {
    if (!user) {
      setShowLoginModal(true)
    } else {
      window.location.href = `/ideas/${ideaId}`
    }
  }

  const sortedIdeas = [...ideas].sort((a, b) => {
    switch(activeTab) {
      case 'market':
        return (b.marketScore || 0) - (a.marketScore || 0)
      case 'innovation':
        return (b.innovationScore || 0) - (a.innovationScore || 0)
      case 'execution':
        return (b.executionScore || 0) - (a.executionScore || 0)
      case 'public':
        return b.publicScore - a.publicScore
      default:
        return b.aiScore - a.aiScore
    }
  })

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
          font-family: 'Raleway';
          src: url('/fonts/Raleway-Bold.ttf') format('truetype');
          font-weight: 700;
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
          font-family: 'WorkSans', sans-serif;
          background: #FFFFFF;
          color: #1a1a1a;
          line-height: 1.6;
        }
      `}</style>

      <div className="min-h-screen">
        {/* Hero Section - Compact with ArgentumSans */}
        <section className="hero">
          <div className="container">
            <h1 className="hero-title">
              NO MONEY? NO PROBLEM.<br/>
              <span className="highlight">LET AI JUDGE YOUR IDEA</span>
            </h1>
            <p className="subtitle">
              Skip the expensive marketing. Submit your idea. Get ranked by AI. Win cash prizes.
            </p>
          </div>
        </section>

        {/* Compressed Value Props */}
        <section className="value-props">
          <div className="container">
            <div className="value-grid">
              <div className="value-card">
                <h3>💰 $0 Marketing</h3>
                <p>No Kickstarter budget needed</p>
              </div>
              <div className="value-card">
                <h3>⚡ Instant Ranking</h3>
                <p>AI scores immediately</p>
              </div>
              <div className="value-card">
                <h3>🏆 Monthly Prizes</h3>
                <p>Real cash for winners</p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Grid */}
        <section className="main-content">
          <div className="container">
            <div className="content-grid">
              {/* Left: Leaderboard */}
              <div className="leaderboard-column">
                <div className="leaderboard-wrapper">
                  {/* Browser-style Tabs */}
                  <div className="tab-bar">
                    <button 
                      className={`tab ${activeTab === 'ai' ? 'active' : ''}`}
                      onClick={() => setActiveTab('ai')}
                    >
                      AI Score
                    </button>
                    <button 
                      className={`tab ${activeTab === 'market' ? 'active' : ''}`}
                      onClick={() => setActiveTab('market')}
                    >
                      Market
                    </button>
                    <button 
                      className={`tab ${activeTab === 'innovation' ? 'active' : ''}`}
                      onClick={() => setActiveTab('innovation')}
                    >
                      Innovation
                    </button>
                    <button 
                      className={`tab ${activeTab === 'execution' ? 'active' : ''}`}
                      onClick={() => setActiveTab('execution')}
                    >
                      Execution
                    </button>
                    <button 
                      className={`tab ${activeTab === 'public' ? 'active' : ''}`}
                      onClick={() => setActiveTab('public')}
                    >
                      Public
                    </button>
                  </div>

                  {/* Leaderboard Content */}
                  <div className="leaderboard-content">
                    <div className="leaderboard-header">
                      <div className="header-rank">#</div>
                      <div className="header-idea">Idea</div>
                      <div className="header-score">Score</div>
                      <div className="header-action"></div>
                    </div>
                    
                    <div className="leaderboard-body">
                      {loading ? (
                        <div className="loading-state">Loading ideas...</div>
                      ) : (
                        sortedIdeas.map((idea, index) => (
                          <div key={idea.id} className="leaderboard-item">
                            <div className="item-rank">
                              <span className={`rank-badge ${index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : ''}`}>
                                {index + 1}
                              </span>
                            </div>
                            
                            <div className="item-content">
                              <h3>{idea.title}</h3>
                              <div className="item-meta">
                                <span className="author">by {idea.author}</span>
                                <span className="type">{idea.type}</span>
                              </div>
                            </div>
                            
                            <div className="item-score">
                              <div className="score-main">
                                {activeTab === 'market' ? idea.marketScore?.toFixed(2) :
                                 activeTab === 'innovation' ? idea.innovationScore?.toFixed(2) :
                                 activeTab === 'execution' ? idea.executionScore?.toFixed(2) :
                                 activeTab === 'public' ? idea.publicScore.toFixed(2) :
                                 idea.aiScore.toFixed(2)}
                              </div>
                              {activeTab === 'public' && (
                                <div className="score-votes">({idea.publicVotes})</div>
                              )}
                            </div>
                            
                            <div className="item-action">
                              <button 
                                className="vote-btn"
                                onClick={() => handleVoteClick(idea.id)}
                              >
                                →
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    
                    <div className="leaderboard-footer">
                      <Link href="/leaderboard">
                        <a>VIEW FULL LEADERBOARD →</a>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Sidebar */}
              <div className="sidebar-column">
                {/* Archives Section */}
                <div className="sidebar-section">
                  <h2 className="sidebar-title">Previous Winners</h2>
                  <ArchiveSidebar />
                </div>

                {/* Submit Idea CTA */}
                <div className="sidebar-section submit-cta">
                  <h3>Got an Idea?</h3>
                  <p>Submit it now and let AI judge its potential</p>
                  <Link href="/submit">
                    <a className="submit-button">Submit Your Idea</a>
                  </Link>
                </div>

                {/* Sponsors Section */}
                <div className="sidebar-section sponsors">
                  <h3 className="sponsors-title">Our Sponsors</h3>
                  <div className="sponsor-grid">
                    <div className="sponsor-item">
                      <div className="sponsor-logo">TechVentures</div>
                    </div>
                    <div className="sponsor-item">
                      <div className="sponsor-logo">InnovateCo</div>
                    </div>
                    <div className="sponsor-item">
                      <div className="sponsor-logo">FutureFlow</div>
                    </div>
                    <div className="sponsor-item">
                      <div className="sponsor-logo">NextGen VC</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Login Modal */}
        {showLoginModal && (
          <LoginModal onClose={() => setShowLoginModal(false)} />
        )}
      </div>

      <style jsx>{`
        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* Hero - Compact with ArgentumSans for main message */
        .hero {
          background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
          color: white;
          padding: 40px 0 30px;
          text-align: center;
        }

        .hero-title {
          font-family: 'ArgentumSans', serif;
          font-size: clamp(28px, 4vw, 48px);
          font-weight: 900;
          font-style: italic;
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin-bottom: 16px;
        }

        .highlight {
          background: linear-gradient(90deg, #60A5FA, #34D399);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .subtitle {
          font-family: 'WorkSans', sans-serif;
          font-size: 15px;
          line-height: 1.5;
          opacity: 0.9;
          max-width: 500px;
          margin: 0 auto;
        }

        /* Compressed Value Props */
        .value-props {
          background: #F8FAFC;
          padding: 20px 0;
          border-bottom: 1px solid #E2E8F0;
        }

        .value-grid {
          display: flex;
          justify-content: center;
          gap: 40px;
        }

        .value-card {
          text-align: center;
        }

        .value-card h3 {
          font-family: 'Raleway', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #0F172A;
          margin-bottom: 4px;
        }

        .value-card p {
          font-family: 'WorkSans', sans-serif;
          font-size: 12px;
          color: #64748B;
        }

        /* Main Content Grid */
        .main-content {
          padding: 30px 0 60px;
          background: #FFFFFF;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 30px;
        }

        /* Leaderboard Column */
        .leaderboard-column {
          min-width: 0;
        }

        .leaderboard-wrapper {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          overflow: hidden;
        }

        /* Browser-style Tabs */
        .tab-bar {
          display: flex;
          background: #F1F5F9;
          border-bottom: 1px solid #E2E8F0;
          padding: 0;
          align-items: flex-end;
        }

        .tab {
          padding: 10px 20px;
          background: #E2E8F0;
          border: none;
          border-right: 1px solid #CBD5E1;
          font-family: 'Raleway', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #64748B;
          cursor: pointer;
          transition: all 0.2s;
          margin: 0;
          border-radius: 8px 8px 0 0;
          margin-top: 8px;
          margin-left: 8px;
        }

        .tab:first-child {
          margin-left: 12px;
        }

        .tab:hover {
          background: #F8FAFC;
          color: #0F172A;
        }

        .tab.active {
          background: #FFFFFF;
          color: #0F172A;
          border-bottom: 1px solid #FFFFFF;
          position: relative;
          z-index: 1;
          margin-bottom: -1px;
        }

        /* Leaderboard Content */
        .leaderboard-content {
          background: #FFFFFF;
        }

        .leaderboard-header {
          display: grid;
          grid-template-columns: 40px 1fr 80px 40px;
          gap: 12px;
          padding: 12px 16px;
          background: #F8FAFC;
          font-family: 'Raleway', sans-serif;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #64748B;
        }

        .leaderboard-body {
          max-height: 500px;
          overflow-y: auto;
        }

        .loading-state {
          padding: 40px;
          text-align: center;
          color: #64748B;
          font-family: 'WorkSans', sans-serif;
        }

        .leaderboard-item {
          display: grid;
          grid-template-columns: 40px 1fr 80px 40px;
          gap: 12px;
          padding: 12px 16px;
          border-bottom: 1px solid #F1F5F9;
          transition: all 0.2s;
          align-items: center;
        }

        .leaderboard-item:hover {
          background: #F0F9FF;
        }

        .rank-badge {
          font-family: 'Raleway', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: #64748B;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          background: #F8FAFC;
        }

        .rank-badge.gold {
          background: linear-gradient(135deg, #FEF3C7, #FDE68A);
          color: #B45309;
        }

        .rank-badge.silver {
          background: linear-gradient(135deg, #E5E7EB, #D1D5DB);
          color: #4B5563;
        }

        .rank-badge.bronze {
          background: linear-gradient(135deg, #FED7AA, #FDBA74);
          color: #C2410C;
        }

        .item-content h3 {
          font-family: 'Raleway', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #0F172A;
          margin-bottom: 2px;
        }

        .item-meta {
          display: flex;
          gap: 12px;
          font-family: 'WorkSans', sans-serif;
          font-size: 12px;
        }

        .author {
          color: #64748B;
        }

        .type {
          color: #94A3B8;
          text-transform: capitalize;
        }

        .item-score {
          text-align: right;
        }

        .score-main {
          font-family: 'Raleway', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #0F172A;
        }

        .score-votes {
          font-family: 'WorkSans', sans-serif;
          font-size: 11px;
          color: #94A3B8;
        }

        .vote-btn {
          width: 32px;
          height: 32px;
          background: #3B82F6;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .vote-btn:hover {
          background: #2563EB;
          transform: translateX(2px);
        }

        .leaderboard-footer {
          background: #F8FAFC;
          padding: 12px;
          text-align: center;
          border-top: 1px solid #E2E8F0;
        }

        .leaderboard-footer a {
          color: #3B82F6;
          text-decoration: none;
          font-family: 'Raleway', sans-serif;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .leaderboard-footer a:hover {
          color: #2563EB;
        }

        /* Sidebar */
        .sidebar-column {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .sidebar-section {
          background: #F0F9FF;
          border-radius: 12px;
          padding: 20px;
          border: 1px solid #E0F2FE;
        }

        .sidebar-title {
          font-family: 'Raleway', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: #0F172A;
          margin-bottom: 16px;
        }

        /* Submit CTA */
        .submit-cta {
          background: linear-gradient(135deg, #3B82F6, #2563EB);
          color: white;
          text-align: center;
          border: none;
        }

        .submit-cta h3 {
          font-family: 'Raleway', sans-serif;
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .submit-cta p {
          font-family: 'WorkSans', sans-serif;
          font-size: 13px;
          margin-bottom: 16px;
          opacity: 0.9;
        }

        .submit-button {
          display: inline-block;
          background: white;
          color: #3B82F6;
          padding: 10px 24px;
          font-family: 'Raleway', sans-serif;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .submit-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        /* Sponsors */
        .sponsors {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
        }

        .sponsors-title {
          font-family: 'Raleway', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 16px;
          text-align: center;
        }

        .sponsor-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .sponsor-item {
          background: #F8FAFC;
          padding: 16px;
          border-radius: 8px;
          text-align: center;
        }

        .sponsor-logo {
          font-family: 'Raleway', sans-serif;
          font-size: 12px;
          font-weight: 700;
          color: #94A3B8;
          letter-spacing: 0.5px;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .content-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }
          
          .sidebar-column {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
          }
        }

        @media (max-width: 640px) {
          .tab-bar {
            overflow-x: auto;
            padding-bottom: 2px;
          }
          
          .tab {
            font-size: 11px;
            padding: 8px 12px;
            white-space: nowrap;
          }
          
          .leaderboard-header,
          .leaderboard-item {
            grid-template-columns: 32px 1fr 60px;
          }
          
          .header-action,
          .item-action {
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
        const { createUserWithEmailAndPassword } = await import('firebase/auth')
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
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
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }
        
        .modal-content {
          background: #FFFFFF;
          border-radius: 16px;
          padding: 32px;
          width: 90%;
          max-width: 400px;
          position: relative;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        
        .modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #64748B;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          transition: all 0.2s;
        }
        
        .modal-close:hover {
          background: #F1F5F9;
          color: #0F172A;
        }
        
        h2 {
          font-family: 'Raleway', sans-serif;
          font-size: 24px;
          font-weight: 700;
          color: #0F172A;
          margin-bottom: 24px;
          text-align: center;
        }
        
        .modal-error {
          background: #FEE2E2;
          color: #DC2626;
          padding: 12px;
          border-radius: 8px;
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
          padding: 12px 16px;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          font-family: 'WorkSans', sans-serif;
          font-size: 14px;
          transition: all 0.2s;
          background: #F8FAFC;
        }
        
        input:focus {
          outline: none;
          border-color: #3B82F6;
          background: #FFFFFF;
        }
        
        button[type="submit"] {
          background: #3B82F6;
          color: white;
          padding: 12px;
          border: none;
          border-radius: 8px;
          font-family: 'Raleway', sans-serif;
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        button[type="submit"]:hover:not(:disabled) {
          background: #2563EB;
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
          color: #64748B;
        }
        
        .modal-switch button {
          background: none;
          border: none;
          color: #3B82F6;
          cursor: pointer;
          margin-left: 4px;
          text-decoration: underline;
        }
        
        .modal-switch button:hover {
          color: #2563EB;
        }
      `}</style>
    </>
  )
}
