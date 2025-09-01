import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { onAuthStateChanged, User, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'

interface Idea {
  id: string
  rank: number
  title: string
  type: string
  genre?: string
  author: string
  desc: string
  aiScore: number
  marketScore: number
  innovationScore: number
  executionScore: number
  publicScore: number
  publicVotes: number
  timestamp: string
  expanded?: boolean
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [activeCategory, setActiveCategory] = useState<'all' | 'business' | 'games' | 'movies' | 'tech'>('all')
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [sidebarExpanded, setSidebarExpanded] = useState(true)

  const categories = {
    business: ['SaaS', 'E-commerce', 'Fintech', 'Healthcare', 'B2B Tools', 'Consumer Apps'],
    games: ['Mobile', 'PC/Console', 'VR/AR', 'Indie', 'Strategy', 'Casual'],
    movies: ['Sci-Fi', 'Drama', 'Thriller', 'Documentary', 'Animation', 'Horror'],
    tech: ['AI/ML', 'Blockchain', 'IoT', 'Dev Tools', 'Hardware', 'Infrastructure']
  }

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
        limit(20)
      )
      
      const snapshot = await getDocs(ideasQuery)
      const fetchedIdeas = snapshot.docs.map((doc, index) => {
        const data = doc.data()
        return {
          id: doc.id,
          rank: index + 1,
          title: data.title,
          type: data.type,
          genre: data.genre || 'General',
          author: data.username || 'Anonymous',
          desc: data.content,
          aiScore: Math.round((data.aiScores?.overall || Math.random() * 10) * 10),
          marketScore: Math.round((data.aiScores?.market || Math.random() * 10) * 10),
          innovationScore: Math.round((data.aiScores?.innovation || Math.random() * 10) * 10),
          executionScore: Math.round((data.aiScores?.execution || Math.random() * 10) * 10),
          publicScore: data.publicScore?.average || 0,
          publicVotes: data.publicScore?.count || 0,
          timestamp: data.createdAt ? new Date(data.createdAt.toDate()).toLocaleDateString() : '2024-01-15',
          expanded: false
        }
      })
      
      setIdeas(fetchedIdeas.length > 0 ? fetchedIdeas : getMockIdeas())
    } catch (error) {
      setIdeas(getMockIdeas())
    } finally {
      setLoading(false)
    }
  }

  const getMockIdeas = (): Idea[] => [
    {
      id: '1', rank: 1, title: 'Neural Market Predictor', type: 'business', genre: 'Fintech', author: 'Dr. Sarah Chen',
      desc: 'AI-powered platform that analyzes 10,000+ market signals in real-time to predict price movements with 89% accuracy. Combines sentiment analysis, technical indicators, and macroeconomic data to generate actionable trading insights for institutional and retail investors.',
      aiScore: 94, marketScore: 96, innovationScore: 92, executionScore: 89, publicScore: 9.2, publicVotes: 847, timestamp: '2024-01-28', expanded: false
    },
    {
      id: '2', rank: 2, title: 'Quantum Chess Arena', type: 'games', genre: 'Strategy', author: 'Marcus Webb',
      desc: 'Revolutionary chess variant where pieces exist in quantum superposition states until observed. Features simultaneous move possibilities, probability-based captures, and tournament modes with global leaderboards. Built with cutting-edge physics simulation.',
      aiScore: 91, marketScore: 85, innovationScore: 98, executionScore: 88, publicScore: 8.9, publicVotes: 623, timestamp: '2024-01-27', expanded: false
    },
    {
      id: '3', rank: 3, title: 'Memory Vault', type: 'movies', genre: 'Sci-Fi', author: 'Elena Rodriguez',
      desc: 'In 2090, memories are extracted and stored as digital assets. A black market memory dealer discovers someone is planting false memories in the global database, threatening the nature of human identity and truth itself.',
      aiScore: 89, marketScore: 91, innovationScore: 86, executionScore: 90, publicScore: 8.7, publicVotes: 1203, timestamp: '2024-01-26', expanded: false
    },
    {
      id: '4', rank: 4, title: 'CodeMind AI', type: 'tech', genre: 'Dev Tools', author: 'Alex Kim',
      desc: 'Advanced code completion and debugging assistant that understands context across entire codebases. Features automatic bug detection, performance optimization suggestions, and natural language to code translation with 95% accuracy.',
      aiScore: 87, marketScore: 93, innovationScore: 82, executionScore: 86, publicScore: 8.5, publicVotes: 934, timestamp: '2024-01-25', expanded: false
    },
    {
      id: '5', rank: 5, title: 'EcoChain Network', type: 'business', genre: 'B2B Tools', author: 'James Foster',
      desc: 'Blockchain-based carbon credit marketplace with IoT verification. Automated sensors validate environmental impact in real-time, creating transparent and fraud-proof carbon trading for businesses seeking net-zero compliance.',
      aiScore: 85, marketScore: 88, innovationScore: 84, executionScore: 83, publicScore: 8.3, publicVotes: 756, timestamp: '2024-01-24', expanded: false
    },
    {
      id: '6', rank: 6, title: 'Neural VR Therapy', type: 'games', genre: 'VR/AR', author: 'Dr. Lisa Park',
      desc: 'Immersive VR platform for treating PTSD, anxiety, and phobias through controlled exposure therapy. Features biometric monitoring, AI-adapted scenarios, and clinical integration for mental health professionals.',
      aiScore: 83, marketScore: 79, innovationScore: 89, executionScore: 81, publicScore: 8.8, publicVotes: 567, timestamp: '2024-01-23', expanded: false
    },
    {
      id: '7', rank: 7, title: 'The Algorithm War', type: 'movies', genre: 'Thriller', author: 'David Zhang',
      desc: 'Corporate espionage thriller where tech companies wage secret battles through AI algorithms. A data scientist discovers her recommendation engine is being weaponized to manipulate global elections and financial markets.',
      aiScore: 81, marketScore: 84, innovationScore: 78, executionScore: 82, publicScore: 8.1, publicVotes: 892, timestamp: '2024-01-22', expanded: false
    },
    {
      id: '8', rank: 8, title: 'SmartFarm IoT', type: 'tech', genre: 'IoT', author: 'Maria Santos',
      desc: 'Comprehensive agricultural IoT platform combining soil sensors, weather prediction, drone monitoring, and AI crop optimization. Increases yield by 35% while reducing water usage by 50% through precision farming.',
      aiScore: 79, marketScore: 86, innovationScore: 74, executionScore: 77, publicScore: 7.9, publicVotes: 678, timestamp: '2024-01-21', expanded: false
    }
  ]

  const toggleExpanded = (ideaId: string) => {
    setIdeas(prev => prev.map(idea => 
      idea.id === ideaId ? { ...idea, expanded: !idea.expanded } : idea
    ))
  }

  const filteredIdeas = ideas.filter(idea => {
    if (activeCategory === 'all') return true
    return idea.type === activeCategory
  })

  const handleVote = (ideaId: string) => {
    if (!user) {
      setShowLoginModal(true)
      return
    }
    console.log('Voting for idea:', ideaId)
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      setMobileMenuOpen(false)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#059669'
    if (score >= 60) return '#d97706' 
    return '#dc2626'
  }

  return (
    <>
      <Head>
        <title>Hyoka - Professional AI Idea Evaluation Platform</title>
        <meta name="description" content="Where brilliant ideas meet rigorous AI analysis. Professional evaluation platform for entrepreneurs, creators, and innovators." />
      </Head>

      <style jsx global>{`
        @font-face {
          font-family: 'Vipnagorgialla';
          src: url('/fonts/Vipnagorgialla Bd.otf') format('opentype');
          font-weight: bold;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'DrukHeavy';
          src: url('/fonts/Druk-HeavyItalic-Trial.otf') format('opentype');
          font-weight: 900;
          font-style: italic;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'FoundersGrotesk';
          src: url('/fonts/FoundersGrotesk-Medium.otf') format('opentype');
          font-weight: 500;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'FoundersGrotesk';
          src: url('/fonts/FoundersGrotesk-Semibold.otf') format('opentype');
          font-weight: 600;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'FoundersGrotesk';
          src: url('/fonts/FoundersGrotesk-Bold.otf') format('opentype');
          font-weight: 700;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'TestSohne';
          src: url('/fonts/TestSohneBreit-Buch.otf') format('opentype');
          font-weight: 400;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'TestSohne';
          src: url('/fonts/TestSohneBreit-Kraftig.otf') format('opentype');
          font-weight: 500;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'Bahnschrift';
          src: url('/fonts/bahnschrift.ttf') format('truetype');
          font-weight: normal;
          font-display: swap;
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'TestSohne', -apple-system, BlinkMacSystemFont, sans-serif;
          background: #fafafa;
          color: #0d1117;
          line-height: 1.6;
          overflow-x: hidden;
        }

        ::selection {
          background: #2563eb;
          color: white;
        }
      `}</style>

      {/* Header */}
      <header className="header">
        <div className="header-container">
          <div className="header-left">
            <Link href="/">
              <a className="logo">Hyoka</a>
            </Link>
            <nav className="main-nav">
              <Link href="/"><a className="nav-item">Home</a></Link>
              <Link href="/explore"><a className="nav-item">Explore</a></Link>
              <Link href="/leaderboard"><a className="nav-item">Leaderboard</a></Link>
              <Link href="/analytics"><a className="nav-item">Analytics</a></Link>
              <Link href="/about"><a className="nav-item">About</a></Link>
            </nav>
          </div>
          
          <div className="header-right">
            <div className="search-container">
              <input type="search" placeholder="Search ideas..." className="search-input" />
            </div>
            
            {user ? (
              <div className="user-menu">
                <Link href="/dashboard"><a className="user-link">Dashboard</a></Link>
                <button onClick={handleSignOut} className="sign-out-btn">Sign Out</button>
              </div>
            ) : (
              <div className="auth-buttons">
                <button onClick={() => setShowLoginModal(true)} className="login-btn">Login</button>
                <Link href="/submit"><a className="submit-btn">Submit Idea</a></Link>
              </div>
            )}
            
            <button 
              className="mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="hamburger"></span>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="mobile-menu">
            <nav className="mobile-nav">
              <Link href="/"><a className="mobile-nav-item">Home</a></Link>
              <Link href="/explore"><a className="mobile-nav-item">Explore</a></Link>
              <Link href="/leaderboard"><a className="mobile-nav-item">Leaderboard</a></Link>
              <Link href="/analytics"><a className="mobile-nav-item">Analytics</a></Link>
              <Link href="/about"><a className="mobile-nav-item">About</a></Link>
            </nav>
          </div>
        )}
      </header>

      <div className="app-layout">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarExpanded ? 'expanded' : 'collapsed'}`}>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
          >
            {sidebarExpanded ? '←' : '→'}
          </button>
          
          <div className="sidebar-content">
            <div className="sidebar-section">
              <h3 className="sidebar-title">Quick Actions</h3>
              <Link href="/submit"><a className="action-btn primary">Submit Idea</a></Link>
              {!user && (
                <button onClick={() => setShowLoginModal(true)} className="action-btn secondary">
                  Join Platform
                </button>
              )}
            </div>

            <div className="sidebar-section">
              <h3 className="sidebar-title">Categories</h3>
              <div className="category-filters">
                <button
                  className={`filter-btn ${activeCategory === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveCategory('all')}
                >
                  All Ideas <span className="count">{ideas.length}</span>
                </button>
                {Object.entries(categories).map(([category]) => (
                  <button
                    key={category}
                    className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
                    onClick={() => setActiveCategory(category as any)}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                    <span className="count">{ideas.filter(i => i.type === category).length}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="sidebar-section">
              <h3 className="sidebar-title">Platform Metrics</h3>
              <div className="metrics-grid">
                <div className="metric-card">
                  <span className="metric-value">47,329</span>
                  <span className="metric-label">Ideas Evaluated</span>
                </div>
                <div className="metric-card">
                  <span className="metric-value">$12.4M</span>
                  <span className="metric-label">Funding Raised</span>
                </div>
                <div className="metric-card">
                  <span className="metric-value">2,847</span>
                  <span className="metric-label">This Month</span>
                </div>
                <div className="metric-card">
                  <span className="metric-value">94.2%</span>
                  <span className="metric-label">Accuracy Rate</span>
                </div>
              </div>
            </div>

            <div className="sidebar-section">
              <h3 className="sidebar-title">Live Activity</h3>
              <div className="activity-feed">
                <div className="activity-item">
                  <div className="activity-dot"></div>
                  <span>Neural Trading Bot submitted</span>
                </div>
                <div className="activity-item">
                  <div className="activity-dot"></div>
                  <span>VR Therapy voted on by 12 users</span>
                </div>
                <div className="activity-item">
                  <div className="activity-dot"></div>
                  <span>Memory Vault reached top 5</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {/* Hero Section */}
          <section className="hero">
            <div className="hero-content">
              <h1 className="hero-title">
                Where Brilliant Ideas
                <span className="title-highlight">Meet AI Analysis</span>
              </h1>
              <p className="hero-subtitle">
                Professional-grade evaluation platform trusted by entrepreneurs, VCs, and innovators worldwide. 
                Get comprehensive AI analysis of market potential, innovation level, and execution complexity.
              </p>
              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-number">47K+</span>
                  <span className="stat-label">Ideas Analyzed</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <span className="stat-number">$12.4M</span>
                  <span className="stat-label">Capital Raised</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <span className="stat-number">94.2%</span>
                  <span className="stat-label">Prediction Accuracy</span>
                </div>
              </div>
            </div>
          </section>

          {/* Featured Ideas */}
          <section className="featured-section">
            <div className="section-header">
              <h2 className="section-title">
                {activeCategory === 'all' ? 'Top Ranked Ideas' : 
                 `Top ${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Ideas`}
              </h2>
              <div className="section-controls">
                <span className="results-count">{filteredIdeas.length} ideas</span>
                <select className="sort-select">
                  <option>Sort by AI Score</option>
                  <option>Sort by Public Score</option>
                  <option>Sort by Recent</option>
                  <option>Sort by Funding Potential</option>
                </select>
              </div>
            </div>

            <div className="ideas-grid">
              {filteredIdeas.map((idea) => (
                <article key={idea.id} className="idea-card">
                  <div className="card-header">
                    <div className="rank-badge">{idea.rank}</div>
                    <div className="card-meta">
                      <span className="idea-type">{idea.type}</span>
                      <span className="idea-genre">{idea.genre}</span>
                    </div>
                  </div>
                  
                  <div className="card-content">
                    <h3 className="idea-title">{idea.title}</h3>
                    <div className="author-info">
                      <span className="author-name">by {idea.author}</span>
                      <span className="publish-date">{idea.timestamp}</span>
                    </div>
                    
                    <div className="score-overview">
                      <div className="primary-score">
                        <span className="score-value">{idea.aiScore}</span>
                        <span className="score-label">AI Score</span>
                      </div>
                      <div className="public-score">
                        <span className="public-rating">{idea.publicScore.toFixed(1)}</span>
                        <span className="vote-count">{idea.publicVotes} votes</span>
                      </div>
                    </div>
                    
                    <p className="idea-description">
                      {idea.expanded ? idea.desc : `${idea.desc.substring(0, 150)}...`}
                    </p>
                    
                    <div className="card-actions">
                      <button 
                        className="expand-btn"
                        onClick={() => toggleExpanded(idea.id)}
                      >
                        {idea.expanded ? 'Show Less' : 'Read More'}
                      </button>
                      <button 
                        className="vote-btn"
                        onClick={() => handleVote(idea.id)}
                      >
                        Vote
                      </button>
                    </div>
                    
                    {idea.expanded && (
                      <div className="detailed-analysis">
                        <h4 className="analysis-title">Detailed Analysis</h4>
                        
                        <div className="metrics-breakdown">
                          <div className="metric-row">
                            <span className="metric-name">Market Potential</span>
                            <div className="metric-visual">
                              <div className="metric-bar">
                                <div 
                                  className="metric-fill"
                                  style={{ 
                                    width: `${idea.marketScore}%`,
                                    backgroundColor: getScoreColor(idea.marketScore)
                                  }}
                                />
                              </div>
                              <span className="metric-score" style={{ color: getScoreColor(idea.marketScore) }}>
                                {idea.marketScore}
                              </span>
                            </div>
                          </div>
                          
                          <div className="metric-row">
                            <span className="metric-name">Innovation Level</span>
                            <div className="metric-visual">
                              <div className="metric-bar">
                                <div 
                                  className="metric-fill"
                                  style={{ 
                                    width: `${idea.innovationScore}%`,
                                    backgroundColor: getScoreColor(idea.innovationScore)
                                  }}
                                />
                              </div>
                              <span className="metric-score" style={{ color: getScoreColor(idea.innovationScore) }}>
                                {idea.innovationScore}
                              </span>
                            </div>
                          </div>
                          
                          <div className="metric-row">
                            <span className="metric-name">Execution Complexity</span>
                            <div className="metric-visual">
                              <div className="metric-bar">
                                <div 
                                  className="metric-fill"
                                  style={{ 
                                    width: `${100 - idea.executionScore}%`,
                                    backgroundColor: idea.executionScore >= 80 ? '#dc2626' : idea.executionScore >= 60 ? '#d97706' : '#059669'
                                  }}
                                />
                              </div>
                              <span className="metric-score" style={{ color: idea.executionScore >= 80 ? '#dc2626' : idea.executionScore >= 60 ? '#d97706' : '#059669' }}>
                                {idea.executionScore}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="engagement-section">
                          <button className="engage-btn primary">Support This Idea</button>
                          <button className="engage-btn secondary">Share Feedback</button>
                          <button className="engage-btn secondary">Follow Updates</button>
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* How It Works */}
          <section className="how-it-works">
            <h2 className="section-title">Advanced AI Evaluation Process</h2>
            <div className="process-grid">
              <div className="process-step">
                <div className="step-icon">01</div>
                <h3 className="step-title">Idea Submission</h3>
                <p className="step-description">
                  Submit your concept through our streamlined interface. Our system accepts 
                  detailed descriptions, supporting materials, and market context.
                </p>
              </div>
              <div className="process-step">
                <div className="step-icon">02</div>
                <h3 className="step-title">Multi-Model Analysis</h3>
                <p className="step-description">
                  Advanced neural networks analyze market signals, innovation patterns, 
                  and execution complexity using proprietary algorithms and real-time data.
                </p>
              </div>
              <div className="process-step">
                <div className="step-icon">03</div>
                <h3 className="step-title">Community Validation</h3>
                <p className="step-description">
                  Expert community provides additional validation through structured feedback, 
                  voting, and peer review processes.
                </p>
              </div>
              <div className="process-step">
                <div className="step-icon">04</div>
                <h3 className="step-title">Comprehensive Report</h3>
                <p className="step-description">
                  Receive detailed analysis including market opportunities, competitive landscape, 
                  funding strategies, and actionable next steps.
                </p>
              </div>
            </div>
          </section>

          {/* Platform Statistics */}
          <section className="platform-stats">
            <h2 className="section-title">Platform Impact</h2>
            <div className="stats-showcase">
              <div className="stat-block">
                <span className="big-number">47,329</span>
                <span className="stat-desc">Ideas Evaluated</span>
                <span className="stat-growth">↑ 23% this month</span>
              </div>
              <div className="stat-block">
                <span className="big-number">$12.4M</span>
                <span className="stat-desc">Total Funding Raised</span>
                <span className="stat-growth">↑ 156% this quarter</span>
              </div>
              <div className="stat-block">
                <span className="big-number">94.2%</span>
                <span className="stat-desc">Prediction Accuracy</span>
                <span className="stat-growth">Industry leading</span>
              </div>
              <div className="stat-block">
                <span className="big-number">18,500</span>
                <span className="stat-desc">Active Users</span>
                <span className="stat-growth">↑ 34% this month</span>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Login Modal */}
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}

      <style jsx>{`
        /* Header Styles */
        .header {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid #e1e5e9;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          height: 70px;
        }

        .header-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 48px;
        }

        .logo {
          font-family: 'Vipnagorgialla', serif;
          font-size: 28px;
          font-weight: bold;
          color: #0d1117;
          text-decoration: none;
          transition: opacity 0.2s;
        }

        .logo:hover {
          opacity: 0.8;
        }

        .main-nav {
          display: flex;
          gap: 32px;
        }

        .nav-item {
          font-family: 'FoundersGrotesk', sans-serif;
          font-weight: 500;
          font-size: 15px;
          color: #656d76;
          text-decoration: none;
          transition: color 0.2s;
          position: relative;
        }

        .nav-item:hover {
          color: #0d1117;
        }

        .nav-item::after {
          content: '';
          position: absolute;
          bottom: -6px;
          left: 0;
          width: 0;
          height: 2px;
          background: #2563eb;
          transition: width 0.3s;
        }

        .nav-item:hover::after {
          width: 100%;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .search-container {
          position: relative;
        }

        .search-input {
          font-family: 'TestSohne', sans-serif;
          width: 280px;
          padding: 10px 16px;
          border: 1px solid #d0d7de;
          border-radius: 6px;
          background: #f6f8fa;
          font-size: 14px;
          transition: all 0.2s;
        }

        .search-input:focus {
          outline: none;
          border-color: #2563eb;
          background: white;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .user-menu {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .user-link {
          font-family: 'FoundersGrotesk', sans-serif;
          font-weight: 500;
          font-size: 14px;
          color: #656d76;
          text-decoration: none;
          transition: color 0.2s;
        }

        .user-link:hover {
          color: #0d1117;
        }

        .sign-out-btn {
          font-family: 'FoundersGrotesk', sans-serif;
          font-weight: 500;
          font-size: 14px;
          padding: 8px 16px;
          background: transparent;
          color: #656d76;
          border: 1px solid #d0d7de;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .sign-out-btn:hover {
          background: #f6f8fa;
          color: #0d1117;
        }

        .auth-buttons {
          display: flex;
          gap: 12px;
        }

        .login-btn {
          font-family: 'FoundersGrotesk', sans-serif;
          font-weight: 500;
          font-size: 14px;
          padding: 10px 20px;
          background: transparent;
          color: #0d1117;
          border: 1px solid #d0d7de;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .login-btn:hover {
          background: #f6f8fa;
        }

        .submit-btn {
          font-family: 'FoundersGrotesk', sans-serif;
          font-weight: 600;
          font-size: 14px;
          padding: 10px 20px;
          background: #2563eb;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .submit-btn:hover {
          background: #1d4ed8;
          transform: translateY(-1px);
        }

        .mobile-toggle {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          flex-direction: column;
          gap: 4px;
          padding: 8px;
        }

        .hamburger {
          width: 20px;
          height: 2px;
          background: #0d1117;
          transition: 0.3s;
        }

        .mobile-menu {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border-bottom: 1px solid #e1e5e9;
          padding: 20px;
        }

        .mobile-nav {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .mobile-nav-item {
          font-family: 'FoundersGrotesk', sans-serif;
          font-weight: 500;
          font-size: 16px;
          color: #656d76;
          text-decoration: none;
          padding: 12px 0;
          border-bottom: 1px solid #f6f8fa;
        }

        /* App Layout */
        .app-layout {
          display: flex;
          margin-top: 70px;
          min-height: calc(100vh - 70px);
        }

        /* Sidebar */
        .sidebar {
          width: 320px;
          background: white;
          border-right: 1px solid #e1e5e9;
          position: fixed;
          height: calc(100vh - 70px);
          overflow-y: auto;
          transition: all 0.3s;
        }

        .sidebar.collapsed {
          width: 60px;
        }

        .sidebar-toggle {
          position: absolute;
          top: 20px;
          right: -15px;
          width: 30px;
          height: 30px;
          background: white;
          border: 1px solid #e1e5e9;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Bahnschrift', sans-serif;
          font-size: 14px;
          z-index: 10;
          transition: all 0.2s;
        }

        .sidebar-toggle:hover {
          background: #f6f8fa;
        }

        .sidebar-content {
          padding: 24px;
        }

        .sidebar.collapsed .sidebar-content {
          opacity: 0;
          pointer-events: none;
        }

        .sidebar-section {
          margin-bottom: 32px;
        }

        .sidebar-title {
          font-family: 'FoundersGrotesk', sans-serif;
          font-weight: 600;
          font-size: 13px;
          color: #656d76;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 16px;
        }

        .action-btn {
          display: block;
          width: 100%;
          padding: 12px 16px;
          font-family: 'FoundersGrotesk', sans-serif;
          font-weight: 600;
          font-size: 14px;
          text-decoration: none;
          text-align: center;
          border-radius: 6px;
          transition: all 0.2s;
          margin-bottom: 8px;
          border: none;
          cursor: pointer;
        }

        .action-btn.primary {
          background: #2563eb;
          color: white;
        }

        .action-btn.primary:hover {
          background: #1d4ed8;
          transform: translateY(-1px);
        }

        .action-btn.secondary {
          background: transparent;
          color: #0d1117;
          border: 1px solid #d0d7de;
        }

        .action-btn.secondary:hover {
          background: #f6f8fa;
        }

        .category-filters {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .filter-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 10px 12px;
          background: transparent;
          border: none;
          border-radius: 6px;
          font-family: 'FoundersGrotesk', sans-serif;
          font-weight: 500;
          font-size: 14px;
          color: #656d76;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }

        .filter-btn:hover,
        .filter-btn.active {
          background: #f6f8fa;
          color: #0d1117;
        }

        .filter-btn.active {
          background: #eff6ff;
          color: #2563eb;
        }

        .count {
          background: #e1e5e9;
          color: #656d76;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 11px;
          font-weight: 600;
        }

        .filter-btn.active .count {
          background: #2563eb;
          color: white;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .metric-card {
          background: #f6f8fa;
          padding: 16px;
          border-radius: 8px;
          text-align: center;
        }

        .metric-value {
          display: block;
          font-family: 'DrukHeavy', sans-serif;
          font-size: 18px;
          font-weight: 900;
          color: #0d1117;
          margin-bottom: 4px;
        }

        .metric-label {
          font-family: 'TestSohne', sans-serif;
          font-size: 11px;
          color: #656d76;
          font-weight: 500;
        }

        .activity-feed {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'TestSohne', sans-serif;
          font-size: 13px;
          color: #656d76;
        }

        .activity-dot {
          width: 6px;
          height: 6px;
          background: #22c55e;
          border-radius: 50%;
          flex-shrink: 0;
        }

        /* Main Content */
        .main-content {
          flex: 1;
          margin-left: 320px;
          padding: 40px;
          transition: margin-left 0.3s;
        }

        .sidebar.collapsed + .main-content {
          margin-left: 60px;
        }

        /* Hero Section */
        .hero {
          margin-bottom: 64px;
          text-align: center;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
          margin-bottom: 64px;
        }

        .hero-title {
          font-family: 'DrukHeavy', sans-serif;
          font-size: clamp(32px, 4vw, 48px);
          font-weight: 900;
          font-style: italic;
          color: #0d1117;
          line-height: 1.2;
          margin-bottom: 20px;
        }

        .title-highlight {
          display: block;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-family: 'TestSohne', sans-serif;
          font-size: 18px;
          color: #656d76;
          line-height: 1.6;
          margin-bottom: 32px;
        }

        .hero-stats {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 32px;
          flex-wrap: wrap;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-family: 'FoundersGrotesk', sans-serif;
          font-weight: 700;
          font-size: 24px;
          color: #0d1117;
          margin-bottom: 4px;
        }

        .stat-label {
          font-family: 'TestSohne', sans-serif;
          font-size: 13px;
          color: #656d76;
        }

        .stat-divider {
          width: 1px;
          height: 40px;
          background: #e1e5e9;
        }

        /* Featured Section */
        .featured-section {
          margin-bottom: 64px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .section-title {
          font-family: 'FoundersGrotesk', sans-serif;
          font-weight: 700;
          font-size: 28px;
          color: #0d1117;
        }

        .section-controls {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .results-count {
          font-family: 'TestSohne', sans-serif;
          font-size: 14px;
          color: #656d76;
        }

        .sort-select {
          font-family: 'TestSohne', sans-serif;
          padding: 8px 12px;
          border: 1px solid #d0d7de;
          border-radius: 6px;
          background: white;
          font-size: 14px;
          color: #656d76;
        }

        /* Ideas Grid */
        .ideas-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }

        .idea-card {
          background: white;
          border: 1px solid #e1e5e9;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s;
          position: relative;
        }

        .idea-card:hover {
          border-color: #2563eb;
          box-shadow: 0 8px 32px rgba(37, 99, 235, 0.1);
          transform: translateY(-2px);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 20px 20px 0;
        }

        .rank-badge {
          background: #dc2626;
          color: white;
          padding: 6px 10px;
          border-radius: 6px;
          font-family: 'FoundersGrotesk', sans-serif;
          font-weight: 700;
          font-size: 12px;
        }

        .card-meta {
          display: flex;
          gap: 8px;
        }

        .idea-type {
          background: #f6f8fa;
          color: #656d76;
          padding: 4px 8px;
          border-radius: 4px;
          font-family: 'TestSohne', sans-serif;
          font-size: 11px;
          font-weight: 500;
          text-transform: capitalize;
        }

        .idea-genre {
          background: #eff6ff;
          color: #2563eb;
          padding: 4px 8px;
          border-radius: 4px;
          font-family: 'TestSohne', sans-serif;
          font-size: 11px;
          font-weight: 500;
        }

        .card-content {
          padding: 20px;
        }

        .idea-title {
          font-family: 'FoundersGrotesk', sans-serif;
          font-weight: 600;
          font-size: 18px;
          color: #0d1117;
          margin-bottom: 8px;
          line-height: 1.3;
        }

        .author-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .author-name {
          font-family: 'TestSohne', sans-serif;
          font-size: 13px;
          color: #656d76;
          font-weight: 500;
        }

        .publish-date {
          font-family: 'TestSohne', sans-serif;
          font-size: 12px;
          color: #8b949e;
        }

        .score-overview {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding: 16px;
          background: #f6f8fa;
          border-radius: 8px;
        }

        .primary-score {
          text-align: center;
        }

        .score-value {
          display: block;
          font-family: 'DrukHeavy', sans-serif;
          font-size: 24px;
          font-weight: 900;
          color: #0d1117;
          margin-bottom: 2px;
        }

        .score-label {
          font-family: 'TestSohne', sans-serif;
          font-size: 11px;
          color: #656d76;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .public-score {
          text-align: center;
        }

        .public-rating {
          display: block;
          font-family: 'FoundersGrotesk', sans-serif;
          font-weight: 600;
          font-size: 16px;
          color: #0d1117;
          margin-bottom: 2px;
        }

        .vote-count {
          font-family: 'TestSohne', sans-serif;
          font-size: 11px;
          color: #656d76;
        }

        .idea-description {
          font-family: 'TestSohne', sans-serif;
          font-size: 14px;
          color: #656d76;
          line-height: 1.6;
          margin-bottom: 16px;
        }

        .card-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .expand-btn {
          background: none;
          border: none;
          color: #2563eb;
          font-family: 'TestSohne', sans-serif;
          font-size: 13px;
          cursor: pointer;
          padding: 0;
          font-weight: 500;
        }

        .expand-btn:hover {
          text-decoration: underline;
        }

        .vote-btn {
          background: #2563eb;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-family: 'FoundersGrotesk', sans-serif;
          font-weight: 600;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .vote-btn:hover {
          background: #1d4ed8;
          transform: translateY(-1px);
        }

        /* Detailed Analysis */
        .detailed-analysis {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #e1e5e9;
        }

        .analysis-title {
          font-family: 'FoundersGrotesk', sans-serif;
          font-weight: 600;
          font-size: 16px;
          color: #0d1117;
          margin-bottom: 16px;
        }

        .metrics-breakdown {
          margin-bottom: 20px;
        }

        .metric-row {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 12px;
        }

        .metric-name {
          font-family: 'TestSohne', sans-serif;
          font-size: 13px;
          color: #656d76;
          width: 120px;
          flex-shrink: 0;
        }

        .metric-visual {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .metric-bar {
          flex: 1;
          height: 20px;
          background: #f6f8fa;
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid #e1e5e9;
        }

        .metric-fill {
          height: 100%;
          transition: width 0.3s ease;
          border-radius: 10px;
        }

        .metric-score {
          font-family: 'FoundersGrotesk', sans-serif;
          font-weight: 600;
          font-size: 13px;
          min-width: 30px;
        }

        .engagement-section {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .engage-btn {
          font-family: 'FoundersGrotesk', sans-serif;
          font-weight: 500;
          font-size: 12px;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .engage-btn.primary {
          background: #22c55e;
          color: white;
        }

        .engage-btn.primary:hover {
          background: #16a34a;
        }

        .engage-btn.secondary {
          background: #f6f8fa;
          color: #656d76;
          border: 1px solid #e1e5e9;
        }

        .engage-btn.secondary:hover {
          background: #e1e5e9;
        }

        /* How It Works */
        .how-it-works {
          margin-bottom: 64px;
          padding: 48px;
          background: white;
          border: 1px solid #e1e5e9;
          border-radius: 16px;
        }

        .process-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 32px;
          margin-top: 32px;
        }

        .process-step {
          text-align: center;
        }

        .step-icon {
          width: 60px;
          height: 60px;
          background: #2563eb;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DrukHeavy', sans-serif;
          font-size: 18px;
          font-weight: 900;
          margin: 0 auto 20px;
        }

        .step-title {
          font-family: 'FoundersGrotesk', sans-serif;
          font-weight: 600;
          font-size: 16px;
          color: #0d1117;
          margin-bottom: 12px;
        }

        .step-description {
          font-family: 'TestSohne', sans-serif;
          font-size: 14px;
          color: #656d76;
          line-height: 1.5;
        }

        /* Platform Stats */
        .platform-stats {
          background: #f6f8fa;
          padding: 48px;
          border-radius: 16px;
          text-align: center;
        }

        .stats-showcase {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 32px;
          margin-top: 32px;
        }

        .stat-block {
          background: white;
          padding: 32px 24px;
          border-radius: 12px;
          border: 1px solid #e1e5e9;
        }

        .big-number {
          display: block;
          font-family: 'DrukHeavy', sans-serif;
          font-size: 36px;
          font-weight: 900;
          color: #0d1117;
          margin-bottom: 8px;
        }

        .stat-desc {
          display: block;
          font-family: 'FoundersGrotesk', sans-serif;
          font-weight: 500;
          font-size: 14px;
          color: #656d76;
          margin-bottom: 8px;
        }

        .stat-growth {
          font-family: 'TestSohne', sans-serif;
          font-size: 12px;
          color: #22c55e;
          font-weight: 500;
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .sidebar {
            transform: translateX(-100%);
          }
          
          .main-content {
            margin-left: 0;
            padding: 20px;
          }
          
          .ideas-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .main-nav {
            display: none;
          }
          
          .mobile-toggle {
            display: flex;
          }
          
          .mobile-menu {
            display: block;
          }
          
          .search-input {
            width: 200px;
          }
          
          .hero-stats {
            flex-direction: column;
            gap: 16px;
          }
          
          .stat-divider {
            display: none;
          }
          
          .process-grid,
          .stats-showcase {
            grid-template-columns: 1fr;
            gap: 20px;
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
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
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
          <h2>{isSignUp ? 'Join Hyoka' : 'Welcome Back'}</h2>
          
          {error && <div className="modal-error">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email address"
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
              {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
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
          background: rgba(13, 17, 23, 0.8);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          animation: fadeIn 0.2s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .modal-content {
          background: white;
          border-radius: 12px;
          padding: 32px;
          width: 90%;
          max-width: 400px;
          position: relative;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.3s ease-out;
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #656d76;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          transition: all 0.2s;
        }
        
        .modal-close:hover {
          background: #f6f8fa;
          color: #0d1117;
        }
        
        h2 {
          font-family: 'FoundersGrotesk', sans-serif;
          font-size: 24px;
          font-weight: 700;
          color: #0d1117;
          margin-bottom: 20px;
          text-align: center;
        }
        
        .modal-error {
          background: #fef2f2;
          color: #dc2626;
          padding: 12px;
          border-radius: 6px;
          margin-bottom: 16px;
          font-family: 'TestSohne', sans-serif;
          font-size: 14px;
          border: 1px solid #fecaca;
        }
        
        form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        input {
          font-family: 'TestSohne', sans-serif;
          padding: 12px 16px;
          border: 1px solid #d0d7de;
          border-radius: 6px;
          font-size: 14px;
          transition: all 0.2s;
          background: #f6f8fa;
        }
        
        input:focus {
          outline: none;
          border-color: #2563eb;
          background: white;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        
        button[type="submit"] {
          font-family: 'FoundersGrotesk', sans-serif;
          background: #2563eb;
          color: white;
          padding: 12px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        button[type="submit"]:hover:not(:disabled) {
          background: #1d4ed8;
          transform: translateY(-1px);
        }
        
        button[type="submit"]:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .modal-switch {
          text-align: center;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #e1e5e9;
          font-family: 'TestSohne', sans-serif;
          font-size: 14px;
          color: #656d76;
        }
        
        .modal-switch button {
          background: none;
          border: none;
          color: #2563eb;
          cursor: pointer;
          margin-left: 4px;
          font-weight: 500;
          transition: color 0.2s;
        }
        
        .modal-switch button:hover {
          color: #1d4ed8;
          text-decoration: underline;
        }
      `}
