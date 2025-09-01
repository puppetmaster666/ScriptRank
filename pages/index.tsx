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
        limit(30)
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
    // Score is 0-100 (percentage)
    if (score < 40) {
      return '#dc2626' // Red
    } else if (score < 70) {
      // Gradient from red to yellow to greenish
      const ratio = (score - 40) / 30
      const r = Math.round(220 - (220 - 105) * ratio)
      const g = Math.round(38 + (247 - 38) * ratio)
      const b = Math.round(38 + (77 - 38) * ratio)
      return `rgb(${r}, ${g}, ${b})`
    } else {
      // Greenish to bright green (#69f74d)
      return '#69f74d'
    }
  }

  // Separate ideas by type
  const movieIdeas = ideas.filter(idea => idea.type === 'movies')
  const gameIdeas = ideas.filter(idea => idea.type === 'games')
  const businessIdeas = ideas.filter(idea => idea.type === 'business' || idea.type === 'tech')

  return (
    <>
      <Head>
        <title>ScriptRank - Make Me Famous | AI Idea Evaluation Platform</title>
        <meta name="description" content="Where brilliant ideas meet rigorous AI analysis. Professional evaluation platform for entrepreneurs, creators, and innovators." />
      </Head>

      <style jsx global>{`
        @font-face {
          font-family: 'TitleFont';
          src: url('/fonts/tt0205m_.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'ContentFont';
          src: url('/fonts/TestSohneBreit-Buch.otf') format('opentype');
          font-weight: 400;
          font-display: swap;
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'ContentFont', -apple-system, BlinkMacSystemFont, sans-serif;
          background: #f5f5f5;
          color: #0d1117;
          line-height: 1.6;
          overflow-x: hidden;
        }

        ::selection {
          background: #4331f4;
          color: white;
        }
      `}</style>

      {/* Header */}
      <header className="header">
        <div className="header-container">
          <div className="header-left">
            <Link href="/">
              <a className="logo">ScriptRank</a>
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
        {/* Fixed Sidebar */}
        <aside className="sidebar">
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
          {/* Featured Section with 3 Columns */}
          <section className="featured-section">
            <div className="section-header">
              <h2 className="section-title">Top Ranked Ideas</h2>
              <div className="section-controls">
                <span className="results-count">{ideas.length} ideas</span>
                <select className="sort-select">
                  <option>Sort by AI Score</option>
                  <option>Sort by Public Score</option>
                  <option>Sort by Recent</option>
                  <option>Sort by Funding Potential</option>
                </select>
              </div>
            </div>

            <div className="ideas-grid">
              {/* Movies Column */}
              <div className="idea-column">
                <div className="column-header">
                  <svg className="column-icon" viewBox="0 0 24 24" fill="none" stroke="#4331f4" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                    <line x1="7" y1="2" x2="7" y2="22"></line>
                    <line x1="17" y1="2" x2="17" y2="22"></line>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                  </svg>
                  <h3 className="column-title">Movies</h3>
                </div>
                {movieIdeas.map((idea, index) => (
                  <div key={idea.id} className="idea-wrapper">
                    <div className="idea-header-outside">
                      <span className="idea-rank">#{index + 1}</span>
                      <span className="idea-title-outside">{idea.title}</span>
                    </div>
                    <article className="idea-card">
                      <div className="card-genre-badge">{idea.genre}</div>
                      
                      <div className="card-content">
                        <div className="author-info">
                          <span className="author-name">by {idea.author}</span>
                          <span className="publish-date">{idea.timestamp}</span>
                        </div>
                        
                        <div className="score-overview">
                          <div className="score-bar-container">
                            <div className="score-bar-label">
                              <span>AI Score</span>
                              <span className="score-percentage" style={{ color: getScoreColor(idea.aiScore) }}>
                                {idea.aiScore}%
                              </span>
                            </div>
                            <div className="score-bar">
                              <div 
                                className="score-fill"
                                style={{ 
                                  width: `${idea.aiScore}%`,
                                  background: `linear-gradient(90deg, ${getScoreColor(idea.aiScore - 10)} 0%, ${getScoreColor(idea.aiScore)} 100%)`
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <p className="idea-description">
                          {idea.expanded ? idea.desc : `${idea.desc.substring(0, 120)}...`}
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
                                    {idea.marketScore}%
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
                                    {idea.innovationScore}%
                                  </span>
                                </div>
                              </div>
                              
                              <div className="metric-row">
                                <span className="metric-name">Execution</span>
                                <div className="metric-visual">
                                  <div className="metric-bar">
                                    <div 
                                      className="metric-fill"
                                      style={{ 
                                        width: `${idea.executionScore}%`,
                                        backgroundColor: getScoreColor(idea.executionScore)
                                      }}
                                    />
                                  </div>
                                  <span className="metric-score" style={{ color: getScoreColor(idea.executionScore) }}>
                                    {idea.executionScore}%
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="engagement-section">
                              <button className="engage-btn primary">Support This Idea</button>
                              <button className="engage-btn secondary">Share Feedback</button>
                            </div>
                          </div>
                        )}
                      </div>
                    </article>
                  </div>
                ))}
              </div>

              {/* Games Column */}
              <div className="idea-column">
                <div className="column-header">
                  <svg className="column-icon" viewBox="0 0 24 24" fill="none" stroke="#69f74d" strokeWidth="2">
                    <line x1="6" y1="12" x2="18" y2="12"></line>
                    <line x1="12" y1="6" x2="12" y2="18"></line>
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  </svg>
                  <h3 className="column-title">Games</h3>
                </div>
                {gameIdeas.map((idea, index) => (
                  <div key={idea.id} className="idea-wrapper">
                    <div className="idea-header-outside">
                      <span className="idea-rank">#{index + 1}</span>
                      <span className="idea-title-outside">{idea.title}</span>
                    </div>
                    <article className="idea-card">
                      <div className="card-genre-badge">{idea.genre}</div>
                      
                      <div className="card-content">
                        <div className="author-info">
                          <span className="author-name">by {idea.author}</span>
                          <span className="publish-date">{idea.timestamp}</span>
                        </div>
                        
                        <div className="score-overview">
                          <div className="score-bar-container">
                            <div className="score-bar-label">
                              <span>AI Score</span>
                              <span className="score-percentage" style={{ color: getScoreColor(idea.aiScore) }}>
                                {idea.aiScore}%
                              </span>
                            </div>
                            <div className="score-bar">
                              <div 
                                className="score-fill"
                                style={{ 
                                  width: `${idea.aiScore}%`,
                                  background: `linear-gradient(90deg, ${getScoreColor(idea.aiScore - 10)} 0%, ${getScoreColor(idea.aiScore)} 100%)`
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <p className="idea-description">
                          {idea.expanded ? idea.desc : `${idea.desc.substring(0, 120)}...`}
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
                                    {idea.marketScore}%
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
                                    {idea.innovationScore}%
                                  </span>
                                </div>
                              </div>
                              
                              <div className="metric-row">
                                <span className="metric-name">Execution</span>
                                <div className="metric-visual">
                                  <div className="metric-bar">
                                    <div 
                                      className="metric-fill"
                                      style={{ 
                                        width: `${idea.executionScore}%`,
                                        backgroundColor: getScoreColor(idea.executionScore)
                                      }}
                                    />
                                  </div>
                                  <span className="metric-score" style={{ color: getScoreColor(idea.executionScore) }}>
                                    {idea.executionScore}%
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="engagement-section">
                              <button className="engage-btn primary">Support This Idea</button>
                              <button className="engage-btn secondary">Share Feedback</button>
                            </div>
                          </div>
                        )}
                      </div>
                    </article>
                  </div>
                ))}
              </div>

              {/* Business Column */}
              <div className="idea-column">
                <div className="column-header">
                  <svg className="column-icon" viewBox="0 0 24 24" fill="none" stroke="#656d76" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                  </svg>
                  <h3 className="column-title">Business</h3>
                </div>
                {businessIdeas.map((idea, index) => (
                  <div key={idea.id} className="idea-wrapper">
                    <div className="idea-header-outside">
                      <span className="idea-rank">#{index + 1}</span>
                      <span className="idea-title-outside">{idea.title}</span>
                    </div>
                    <article className="idea-card">
                      <div className="card-genre-badge">{idea.genre}</div>
                      
                      <div className="card-content">
                        <div className="author-info">
                          <span className="author-name">by {idea.author}</span>
                          <span className="publish-date">{idea.timestamp}</span>
                        </div>
                        
                        <div className="score-overview">
                          <div className="score-bar-container">
                            <div className="score-bar-label">
                              <span>AI Score</span>
                              <span className="score-percentage" style={{ color: getScoreColor(idea.aiScore) }}>
                                {idea.aiScore}%
                              </span>
                            </div>
                            <div className="score-bar">
                              <div 
                                className="score-fill"
                                style={{ 
                                  width: `${idea.aiScore}%`,
                                  background: `linear-gradient(90deg, ${getScoreColor(idea.aiScore - 10)} 0%, ${getScoreColor(idea.aiScore)} 100%)`
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <p className="idea-description">
                          {idea.expanded ? idea.desc : `${idea.desc.substring(0, 120)}...`}
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
                                    {idea.marketScore}%
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
                                    {idea.innovationScore}%
                                  </span>
                                </div>
                              </div>
                              
                              <div className="metric-row">
                                <span className="metric-name">Execution</span>
                                <div className="metric-visual">
                                  <div className="metric-bar">
                                    <div 
                                      className="metric-fill"
                                      style={{ 
                                        width: `${idea.executionScore}%`,
                                        backgroundColor: getScoreColor(idea.executionScore)
                                      }}
                                    />
                                  </div>
                                  <span className="metric-score" style={{ color: getScoreColor(idea.executionScore) }}>
                                    {idea.executionScore}%
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="engagement-section">
                              <button className="engage-btn primary">Support This Idea</button>
                              <button className="engage-btn secondary">Share Feedback</button>
                            </div>
                          </div>
                        )}
                      </div>
                    </article>
                  </div>
                ))}
              </div>
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
          font-family: 'TitleFont', serif;
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
          font-family: 'ContentFont', sans-serif;
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
          background: #4331f4;
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
          font-family: 'ContentFont', sans-serif;
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
          border-color: #4331f4;
          background: white;
          box-shadow: 0 0 0 3px rgba(67, 49, 244, 0.1);
        }

        .user-menu {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .user-link {
          font-family: 'ContentFont', sans-serif;
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
          font-family: 'ContentFont', sans-serif;
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
          font-family: 'ContentFont', sans-serif;
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
          font-family: 'ContentFont', sans-serif;
          font-weight: 600;
          font-size: 14px;
          padding: 10px 20px;
          background: #4331f4;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .submit-btn:hover {
          background: #3628c7;
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
          font-family: 'ContentFont', sans-serif;
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

        /* Sidebar - Fixed */
        .sidebar {
          width: 280px;
          background: white;
          border-right: 1px solid #e1e5e9;
          position: fixed;
          height: calc(100vh - 70px);
          overflow-y: auto;
        }

        .sidebar-content {
          padding: 24px;
        }

        .sidebar-section {
          margin-bottom: 32px;
        }

        .sidebar-title {
          font-family: 'ContentFont', sans-serif;
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
          font-family: 'ContentFont', sans-serif;
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
          background: #4331f4;
          color: white;
        }

        .action-btn.primary:hover {
          background: #3628c7;
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
          font-family: 'ContentFont', sans-serif;
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
          color: #4331f4;
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
          background: #4331f4;
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
          font-family: 'TitleFont', sans-serif;
          font-size: 18px;
          font-weight: 900;
          color: #0d1117;
          margin-bottom: 4px;
        }

        .metric-label {
          font-family: 'ContentFont', sans-serif;
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
          font-family: 'ContentFont', sans-serif;
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
          margin-left: 280px;
          padding: 40px;
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
          font-family: 'TitleFont', sans-serif;
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
          font-family: 'ContentFont', sans-serif;
          font-size: 14px;
          color: #656d76;
        }

        .sort-select {
          font-family: 'ContentFont', sans-serif;
          padding: 8px 12px;
          border: 1px solid #d0d7de;
          border-radius: 6px;
          background: white;
          font-size: 14px;
          color: #656d76;
        }

        /* Ideas Grid - 3 Columns */
        .ideas-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }

        .idea-column {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .column-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 16px;
          border-bottom: 2px solid #e1e5e9;
        }

        .column-title {
          font-family: 'TitleFont', sans-serif;
          font-size: 24px;
          font-weight: bold;
          color: #0d1117;
        }

        .column-icon {
          width: 28px;
          height: 28px;
        }

        .idea-wrapper {
          margin-bottom: 20px;
        }

        .idea-header-outside {
          display: flex;
          align-items: baseline;
          gap: 12px;
          margin-bottom: 8px;
          padding-left: 4px;
        }

        .idea-rank {
          font-family: 'TitleFont', sans-serif;
          font-size: 32px;
          font-weight: bold;
          color: #0d1117;
        }

        .idea-title-outside {
          font-family: 'TitleFont', sans-serif;
          font-size: 18px;
          color: #0d1117;
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .idea-card {
          background: white;
          border: 1px solid #e1e5e9;
          border-radius: 34px;
          padding: 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          transition: all 0.3s;
          position: relative;
        }

        .idea-card:hover {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .card-genre-badge {
          position: absolute;
          top: 20px;
          right: 20px;
          background: #000000;
          color: white;
          padding: 6px 14px;
          border-radius: 20px;
          font-family: 'ContentFont', sans-serif;
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .card-content {
          padding-top: 20px;
        }

        .author-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .author-name {
          font-family: 'ContentFont', sans-serif;
          font-size: 13px;
          color: #656d76;
          font-weight: 500;
        }

        .publish-date {
          font-family: 'ContentFont', sans-serif;
          font-size: 12px;
          color: #8b949e;
        }

        .score-overview {
          margin-bottom: 16px;
        }

        .score-bar-container {
          width: 100%;
        }

        .score-bar-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .score-bar-label span:first-child {
          font-family: 'ContentFont', sans-serif;
          font-size: 12px;
          color: #656d76;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .score-percentage {
          font-family: 'TitleFont', sans-serif;
          font-size: 24px;
          font-weight: bold;
        }

        .score-bar {
          width: 100%;
          height: 12px;
          background: #f0f0f0;
          border-radius: 100px;
          overflow: hidden;
        }

        .score-fill {
          height: 100%;
          border-radius: 100px;
          transition: width 0.5s ease;
        }

        .idea-description {
          font-family: 'ContentFont', sans-serif;
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
          color: #4331f4;
          font-family: 'ContentFont', sans-serif;
          font-size: 13px;
          cursor: pointer;
          padding: 0;
          font-weight: 500;
        }

        .expand-btn:hover {
          text-decoration: underline;
        }

        .vote-btn {
          background: #4331f4;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-family: 'ContentFont', sans-serif;
          font-weight: 600;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .vote-btn:hover {
          background: #3628c7;
          transform: translateY(-1px);
        }

        /* Detailed Analysis */
        .detailed-analysis {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #e1e5e9;
        }

        .analysis-title {
          font-family: 'ContentFont', sans-serif;
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
          font-family: 'ContentFont', sans-serif;
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
          font-family: 'ContentFont', sans-serif;
          font-weight: 600;
          font-size: 13px;
          min-width: 40px;
        }

        .engagement-section {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .engage-btn {
          font-family: 'ContentFont', sans-serif;
          font-weight: 500;
          font-size: 12px;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .engage-btn.primary {
          background: #69f74d;
          color: #0d1117;
        }

        .engage-btn.primary:hover {
          background: #5ce63d;
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
          background: #4331f4;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'TitleFont', sans-serif;
          font-size: 18px;
          font-weight: 900;
          margin: 0 auto 20px;
        }

        .step-title {
          font-family: 'ContentFont', sans-serif;
          font-weight: 600;
          font-size: 16px;
          color: #0d1117;
          margin-bottom: 12px;
        }

        .step-description {
          font-family: 'ContentFont', sans-serif;
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
          font-family: 'TitleFont', sans-serif;
          font-size: 36px;
          font-weight: 900;
          color: #0d1117;
          margin-bottom: 8px;
        }

        .stat-desc {
          display: block;
          font-family: 'ContentFont', sans-serif;
          font-weight: 500;
          font-size: 14px;
          color: #656d76;
          margin-bottom: 8px;
        }

        .stat-growth {
          font-family: 'ContentFont', sans-serif;
          font-size: 12px;
          color: #22c55e;
          font-weight: 500;
        }

        /* Responsive Design */
        @media (max-width: 1400px) {
          .ideas-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

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
          <h2>{isSignUp ? 'Join ScriptRank' : 'Welcome Back'}</h2>
          
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
          font-family: 'TitleFont', sans-serif;
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
          font-family: 'ContentFont', sans-serif;
          font-size: 14px;
          border: 1px solid #fecaca;
        }
        
        form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        input {
          font-family: 'ContentFont', sans-serif;
          padding: 12px 16px;
          border: 1px solid #d0d7de;
          border-radius: 6px;
          font-size: 14px;
          transition: all 0.2s;
          background: #f6f8fa;
        }
        
        input:focus {
          outline: none;
          border-color: #4331f4;
          background: white;
          box-shadow: 0 0 0 3px rgba(67, 49, 244, 0.1);
        }
        
        button[type="submit"] {
          font-family: 'ContentFont', sans-serif;
          background: #4331f4;
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
          background: #3628c7;
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
          font-family: 'ContentFont', sans-serif;
          font-size: 14px;
          color: #656d76;
        }
        
        .modal-switch button {
          background: none;
          border: none;
          color: #4331f4;
          cursor: pointer;
          margin-left: 4px;
          font-weight: 500;
          transition: color 0.2s;
        }
        
        .modal-switch button:hover {
          color: #3628c7;
          text-decoration: underline;
        }
      `}</style>
    </>
  )
}
