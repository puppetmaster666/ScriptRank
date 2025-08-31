import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import ArchiveSidebar from '@/components/ArchiveSidebar'

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'movie' | 'game' | 'business'>('all')
  const [sortBy, setSortBy] = useState<'ai' | 'public'>('ai')
  const [expandedIdea, setExpandedIdea] = useState<number | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [ideas, setIdeas] = useState<any[]>([])
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
        const aiScore = data.aiScores?.overall || data.aiScore || 0
        const publicScore = data.publicScore?.average || 0
        const publicVotes = data.publicScore?.count || 0
        
        return {
          id: doc.id,
          rank: index + 1,
          title: data.title,
          type: data.type,
          author: data.username || data.userName || 'Anonymous',
          desc: data.content,
          aiScore: aiScore,
          publicScore: publicScore,
          publicVotes: publicVotes
        }
      })
      
      setIdeas(fetchedIdeas)
    } catch (error) {
      console.error('Error fetching ideas:', error)
      // Fallback mock data
      setIdeas([
        { rank: 1, title: 'Neon Nights', type: 'movie', author: 'Michael Rodriguez', desc: 'A cyberpunk thriller set in 2087 Tokyo. A detective with memory implants must solve murders that haven\'t happened yet. The city itself becomes a character as augmented reality bleeds into the real world, creating a visually stunning neo-noir experience that questions the nature of reality and justice.', aiScore: 8.73, publicScore: 9.1, publicVotes: 23 },
        { rank: 2, title: 'GreenEats', type: 'business', author: 'David Park', desc: 'Zero-waste meal delivery using only reusable containers tracked by blockchain. Customers return containers for discounts, creating a circular economy. Partner restaurants reduce packaging costs while appealing to eco-conscious consumers.', aiScore: 8.43, publicScore: 8.7, publicVotes: 18 },
        { rank: 3, title: 'Battle Royale Chess', type: 'game', author: 'James Mitchell', desc: '100 players start on a giant chess board. Capture pieces to gain their powers. Last player standing wins. Combines strategic thinking with fast-paced action, creating a unique competitive experience.', aiScore: 8.04, publicScore: 8.3, publicVotes: 31 },
        { rank: 4, title: 'The Last Comedian', type: 'movie', author: 'Sarah Chen', desc: 'In a world where AI has replaced all entertainment, one comedian fights to prove humans are still funny. A dark comedy exploring what makes us uniquely human in an age of artificial intelligence.', aiScore: 8.24, publicScore: 7.8, publicVotes: 12 },
        { rank: 5, title: 'Memory Lane VR', type: 'game', author: 'Alex Thompson', desc: 'A VR game where players literally walk through their memories and can change small details to alter their present. Each choice creates ripple effects, exploring themes of regret, nostalgia, and the butterfly effect.', aiScore: 7.92, publicScore: 8.1, publicVotes: 15 },
        { rank: 6, title: 'AI Resume Coach', type: 'business', author: 'Lisa Anderson', desc: 'SaaS that analyzes job postings and automatically tailors your resume to match keywords and requirements. Uses GPT to rewrite descriptions while maintaining authenticity and personal voice.', aiScore: 8.12, publicScore: 7.6, publicVotes: 8 },
        { rank: 7, title: 'Mind Maze VR', type: 'game', author: 'Emily Davis', desc: 'Puzzle VR game where each level is based on psychological concepts. Players solve their own mind to escape, featuring adaptive difficulty based on player behavior and psychological profiles.', aiScore: 7.81, publicScore: 7.9, publicVotes: 10 },
        { rank: 8, title: 'Street Kings', type: 'movie', author: 'Robert Taylor', desc: 'Crime drama following chess hustlers in NYC who use the game to run an underground empire. Each chess move mirrors their criminal strategy, creating a layered narrative about strategy and survival.', aiScore: 7.71, publicScore: 7.5, publicVotes: 6 },
        { rank: 9, title: 'RentMyGarage', type: 'business', author: 'Marcus Johnson', desc: 'Uber for storage space. Homeowners rent out garage space by the square foot. Smart locks provide secure access while insurance protects both parties. Perfect for urban areas with limited storage.', aiScore: 7.63, publicScore: 7.2, publicVotes: 5 },
        { rank: 10, title: 'Echoes of Tomorrow', type: 'movie', author: 'Jennifer Williams', desc: 'Sci-fi series about archaeologists who discover future artifacts buried in the past. Each artifact reveals humanity\'s potential fate, creating a mind-bending exploration of time paradoxes and free will.', aiScore: 8.36, publicScore: 6.8, publicVotes: 3 }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleVoteClick = (ideaId: number) => {
    if (!user) {
      setShowLoginModal(true)
    } else {
      window.location.href = `/ideas/fake-${ideaId}`
    }
  }

  const filteredIdeas = activeTab === 'all' 
    ? ideas 
    : ideas.filter(idea => idea.type === activeTab)

  const sortedIdeas = [...filteredIdeas].sort((a, b) => {
    if (sortBy === 'public') {
      return b.publicScore - a.publicScore
    }
    return b.aiScore - a.aiScore
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

        {/* Value Proposition - More Compressed */}
        <section className="value-props">
          <div className="container">
            <div className="value-grid">
              <div className="value-card">
                <h3>No Kickstarter Budget?</h3>
                <p>Other platforms need $10K+ marketing. Here? <strong>$0</strong>.</p>
              </div>
              <div className="value-card">
                <h3>Instant AI Ranking</h3>
                <p>No waiting for backers. Good ideas rise <strong>automatically</strong>.</p>
              </div>
              <div className="value-card">
                <h3>Monthly Cash Prizes</h3>
                <p>Top ideas win <strong>real money</strong> and investor attention.</p>
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
                <h2>THIS WEEK'S BATTLEGROUND</h2>
                
                {/* Leaderboard with browser tabs */}
                <div className="leaderboard-wrapper">
                  {/* Browser-style tabs on top left */}
                  <div className="browser-tabs">
                    <button 
                      className={`browser-tab ${activeTab === 'all' ? 'active' : ''}`}
                      onClick={() => setActiveTab('all')}
                    >
                      All Ideas
                    </button>
                    <button 
                      className={`browser-tab ${activeTab === 'movie' ? 'active' : ''}`}
                      onClick={() => setActiveTab('movie')}
                    >
                      Movies
                    </button>
                    <button 
                      className={`browser-tab ${activeTab === 'game' ? 'active' : ''}`}
                      onClick={() => setActiveTab('game')}
                    >
                      Games
                    </button>
                    <button 
                      className={`browser-tab ${activeTab === 'business' ? 'active' : ''}`}
                      onClick={() => setActiveTab('business')}
                    >
                      Business
                    </button>
                  </div>

                  <div className="leaderboard-content">
                    <div className="leaderboard-header">
                      <div className="header-rank">#</div>
                      <div className="header-idea">Idea</div>
                      <div 
                        className={`header-score sortable ${sortBy === 'ai' ? 'active' : ''}`}
                        onClick={() => setSortBy('ai')}
                      >
                        AI Score ↓
                      </div>
                      <div 
                        className={`header-score sortable ${sortBy === 'public' ? 'active' : ''}`}
                        onClick={() => setSortBy('public')}
                      >
                        Public ↓
                      </div>
                      <div className="header-action">Vote</div>
                    </div>
                    
                    <div className="leaderboard-body">
                      {sortedIdeas.map((idea, index) => (
                        <div key={idea.rank} className="leaderboard-item">
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
                            <p className={`item-desc ${expandedIdea === idea.rank ? 'expanded' : ''}`}>
                              {idea.desc}
                            </p>
                            <button 
                              className="expand-btn"
                              onClick={() => setExpandedIdea(expandedIdea === idea.rank ? null : idea.rank)}
                            >
                              {expandedIdea === idea.rank ? 'Show less' : 'Read more'}
                            </button>
                          </div>
                          
                          <div className="item-score">
                            <div className="score-value">{idea.aiScore.toFixed(2)}</div>
                          </div>
                          
                          <div className="item-score">
                            <div className="score-value">{idea.publicScore.toFixed(2)}</div>
                            <div className="vote-count">({idea.publicVotes})</div>
                          </div>
                          
                          <div className="item-action">
                            <button 
                              className="vote-btn"
                              onClick={() => handleVoteClick(idea.rank)}
                            >
                              Vote
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="leaderboard-footer">
                      <Link href="/leaderboard">
                        <a>VIEW FULL LEADERBOARD</a>
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

        {/* How It Works */}
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
              <a className="cta-button">Submit Now</a>
            </Link>
          </div>
        </section>

        <footer>
          <p>WHERE IDEAS FIGHT TO WIN.</p>
        </footer>

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

        /* Hero - Compact with ArgentumSans */
        .hero {
          background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
          color: white;
          padding: 30px 0 25px;
          text-align: center;
        }

        .hero h1 {
          font-family: 'ArgentumSans', serif;
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 900;
          font-style: italic;
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin-bottom: 15px;
        }

        .highlight {
          background: linear-gradient(90deg, #60A5FA, #34D399);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .subtitle {
          font-family: 'WorkSans', sans-serif;
          font-size: 14px;
          line-height: 1.5;
          opacity: 0.9;
          max-width: 450px;
          margin: 0 auto;
        }

        /* Value Props - More Compressed */
        .value-props {
          background: #F8FAFC;
          padding: 20px 0;
        }

        .value-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .value-card {
          background: #F0F9FF;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
        }

        .value-card h3 {
          font-family: 'Raleway', sans-serif;
          font-size: 15px;
          font-weight: 700;
          margin-bottom: 6px;
          color: #0F172A;
        }

        .value-card p {
          font-family: 'WorkSans', sans-serif;
          font-size: 13px;
          line-height: 1.5;
          color: #475569;
        }

        /* Main Content */
        .main-content {
          padding: 25px 0 40px;
          background: #FFFFFF;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 25px;
        }

        .leaderboard-column h2 {
          font-family: 'ArgentumSans', serif;
          font-size: 28px;
          font-weight: 900;
          font-style: italic;
          text-align: center;
          margin-bottom: 20px;
          color: #0F172A;
        }

        /* Leaderboard with browser tabs */
        .leaderboard-wrapper {
          background: white;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          overflow: hidden;
        }

        /* Browser tabs on top left */
        .browser-tabs {
          display: flex;
          background: #F1F5F9;
          border-bottom: 1px solid #E2E8F0;
          padding: 0;
          align-items: flex-end;
        }

        .browser-tab {
          padding: 8px 16px;
          background: #E2E8F0;
          border: none;
          border-right: 1px solid #CBD5E1;
          font-family: 'Raleway', sans-serif;
          font-size: 12px;
          font-weight: 700;
          color: #64748B;
          cursor: pointer;
          transition: all 0.2s;
          margin: 0;
          border-radius: 6px 6px 0 0;
          margin-top: 6px;
          margin-left: 6px;
        }

        .browser-tab:first-child {
          margin-left: 10px;
        }

        .browser-tab:hover {
          background: #F8FAFC;
          color: #0F172A;
        }

        .browser-tab.active {
          background: #FFFFFF;
          color: #0F172A;
          border-bottom: 1px solid #FFFFFF;
          position: relative;
          z-index: 1;
          margin-bottom: -1px;
        }

        .leaderboard-content {
          background: white;
        }

        .leaderboard-header {
          display: grid;
          grid-template-columns: 40px 1fr 80px 80px 60px;
          gap: 10px;
          padding: 10px 15px;
          background: #F8FAFC;
          font-family: 'Raleway', sans-serif;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #64748B;
          border-bottom: 2px solid #E2E8F0;
        }

        .header-score.sortable {
          cursor: pointer;
          user-select: none;
        }

        .header-score.sortable:hover {
          color: #3B82F6;
        }

        .header-score.active {
          color: #3B82F6;
        }

        .leaderboard-body {
          max-height: 450px;
          overflow-y: auto;
        }

        .leaderboard-item {
          display: grid;
          grid-template-columns: 40px 1fr 80px 80px 60px;
          gap: 10px;
          padding: 12px 15px;
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
          border-radius: 4px;
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
          font-size: 15px;
          font-weight: 700;
          color: #0F172A;
          margin-bottom: 2px;
        }

        .item-meta {
          display: flex;
          gap: 10px;
          font-family: 'WorkSans', sans-serif;
          font-size: 11px;
          margin-bottom: 6px;
        }

        .author {
          color: #64748B;
        }

        .type {
          color: #94A3B8;
          text-transform: capitalize;
        }

        .item-desc {
          font-family: 'WorkSans', sans-serif;
          font-size: 12px;
          line-height: 1.4;
          color: #475569;
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
          margin-top: 4px;
          background: none;
          border: none;
          color: #3B82F6;
          font-family: 'WorkSans', sans-serif;
          font-size: 11px;
          cursor: pointer;
          padding: 0;
        }

        .expand-btn:hover {
          text-decoration: underline;
        }

        .item-score {
          text-align: center;
        }

        .score-value {
          font-family: 'Raleway', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: #0F172A;
        }

        .vote-count {
          font-family: 'WorkSans', sans-serif;
          font-size: 10px;
          color: #94A3B8;
        }

        .vote-btn {
          background: #3B82F6;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 6px 12px;
          font-family: 'WorkSans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .vote-btn:hover {
          background: #2563EB;
        }

        .leaderboard-footer {
          background: #0F172A;
          padding: 12px;
          text-align: center;
        }

        .leaderboard-footer a {
          color: white;
          text-decoration: none;
          font-family: 'WorkSans', sans-serif;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        .leaderboard-footer a:hover {
          color: #60A5FA;
        }

        /* Sidebar */
        .sidebar-column {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .sidebar-section {
          background: #F0F9FF;
          border-radius: 8px;
          padding: 15px;
          border: 1px solid #E0F2FE;
        }

        .sidebar-title {
          font-family: 'Raleway', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: #0F172A;
          margin-bottom: 12px;
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
          margin-bottom: 6px;
        }

        .submit-cta p {
          font-family: 'WorkSans', sans-serif;
          font-size: 13px;
          margin-bottom: 12px;
          opacity: 0.9;
        }

        .submit-button {
          display: inline-block;
          background: white;
          color: #3B82F6;
          padding: 10px 24px;
          font-family: 'Raleway', sans-serif;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .submit-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        /* Sponsors */
        .sponsors {
          background: white;
          border: 1px solid #E2E8F0;
        }

        .sponsors-title {
          font-family: 'Raleway', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
          text-align: center;
        }

        .sponsor-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .sponsor-item {
          background: #F8FAFC;
          padding: 12px;
          border-radius: 6px;
          text-align: center;
        }

        .sponsor-logo {
          font-family: 'Raleway', sans-serif;
          font-size: 11px;
          font-weight: 700;
          color: #94A3B8;
          letter-spacing: 0.3px;
        }

        /* How It Works */
        .how-it-works {
          background: #F8FAFC;
          padding: 40px 0;
        }

        .how-it-works h2 {
          font-family: 'ArgentumSans', serif;
          font-size: 32px;
          font-weight: 900;
          font-style: italic;
          text-align: center;
          margin-bottom: 25px;
          color: #0F172A;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .step-card {
          text-align: center;
          padding: 20px 15px;
          background: white;
          border-radius: 8px;
          transition: all 0.3s;
        }

        .step-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
        }

        .step-number {
          font-family: 'Raleway', sans-serif;
          font-size: 28px;
          font-weight: 700;
          color: #3B82F6;
          margin-bottom: 8px;
        }

        .step-card h3 {
          font-family: 'Raleway', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: #0F172A;
          margin-bottom: 6px;
        }

        .step-card p {
          font-family: 'WorkSans', sans-serif;
          font-size: 12px;
          color: #6B6B6B;
          line-height: 1.4;
        }

        /* CTA */
        .cta-section {
          background: #3B82F6;
          padding: 40px 0;
          text-align: center;
          color: white;
        }

        .cta-section h2 {
          font-family: 'ArgentumSans', serif;
          font-size: 32px;
          font-weight: 900;
          font-style: italic;
          margin-bottom: 12px;
        }

        .cta-section p {
          font-family: 'WorkSans', sans-serif;
          font-size: 15px;
          margin-bottom: 20px;
        }

        .cta-button {
          display: inline-block;
          background: white;
          color: #3B82F6;
          padding: 12px 28px;
          font-family: 'Raleway', sans-serif;
          font-size: 16px;
          font-weight: 700;
          text-decoration: none;
          border-radius: 6px;
          transition: all 0.3s;
        }

        .cta-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        /* Footer */
        footer {
          background: #0F172A;
          color: white;
          padding: 20px 0;
          text-align: center;
          font-family: 'ArgentumSans', serif;
          font-size: 14px;
          font-weight: 900;
          font-style: italic;
          letter-spacing: 0.5px;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .content-grid {
            grid-template-columns: 1fr;
            gap: 25px;
          }
          
          .sidebar-column {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 15px;
          }
          
          .value-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
        }

        @media (max-width: 768px) {
          .hero h1 {
            font-size: 24px;
          }
          
          .steps-grid {
            grid-template-columns: 1fr;
            gap: 15px;
          }
          
          .leaderboard-header,
          .leaderboard-item {
            grid-template-columns: 1fr;
            gap: 8px;
          }
          
          .header-rank, .header-score, .header-action {
            display: none;
          }
          
          .item-rank, .item-score, .item-action {
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
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .modal-content {
          background: white;
          border-radius: 8px;
          padding: 30px;
          width: 90%;
          max-width: 380px;
          position: relative;
        }
        
        .modal-close {
          position: absolute;
          top: 15px;
          right: 15px;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #475569;
        }
        
        h2 {
          font-family: 'Raleway', sans-serif;
          font-size: 24px;
          font-weight: 700;
          color: #0F172A;
          margin-bottom: 20px;
          text-align: center;
        }
        
        .modal-error {
          background: #FFE5E5;
          color: #CC0000;
          padding: 10px;
          border-radius: 6px;
          margin-bottom: 15px;
          font-family: 'WorkSans', sans-serif;
          font-size: 13px;
        }
        
        form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        input {
          padding: 10px;
          border: 2px solid #E5E5E5;
          border-radius: 6px;
          font-family: 'WorkSans', sans-serif;
          font-size: 14px;
          transition: border-color 0.2s;
        }
        
        input:focus {
          outline: none;
          border-color: #3B82F6;
        }
        
        button[type="submit"] {
          background: #3B82F6;
          color: white;
          padding: 10px;
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
          background: #2563EB;
        }
        
        button[type="submit"]:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .modal-switch {
          text-align: center;
          margin-top: 15px;
          font-family: 'WorkSans', sans-serif;
          font-size: 13px;
          color: #6B6B6B;
        }
        
        .modal-switch button {
          background: none;
          border: none;
          color: #3B82F6;
          cursor: pointer;
          margin-left: 4px;
          text-decoration: underline;
        }
      `}</style>
    </>
  )
}
