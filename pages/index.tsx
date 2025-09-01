import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
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
  const [activeCategory, setActiveCategory] = useState<'all' | 'business' | 'games' | 'movies'>('all')
  const [activeGenre, setActiveGenre] = useState<string>('all')
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<{[key: string]: boolean}>({
    business: true,
    games: true,
    movies: true
  })

  const categories = {
    business: [
      'SaaS', 'E-commerce', 'Fintech', 'Healthcare', 'AI/ML', 
      'Social Media', 'EdTech', 'PropTech', 'CleanTech', 'FoodTech'
    ],
    games: [
      'Mobile Games', 'PC/Console', 'VR/AR', 'Board Games', 'Indie Games',
      'MMO', 'Strategy', 'Puzzle', 'Action', 'Simulation'
    ],
    movies: [
      'Sci-Fi', 'Drama', 'Action', 'Comedy', 'Horror',
      'Documentary', 'Thriller', 'Romance', 'Animation', 'Fantasy'
    ]
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
        limit(50)
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
          genre: data.genre || 'General',
          author: data.username || data.userName || 'Anonymous',
          desc: data.content,
          aiScore: aiScore * 10,
          marketScore: (data.aiScores?.market || Math.random() * 10) * 10,
          innovationScore: (data.aiScores?.innovation || Math.random() * 10) * 10,
          executionScore: (data.aiScores?.execution || Math.random() * 10) * 10,
          publicScore: publicScore,
          publicVotes: publicVotes,
          timestamp: data.createdAt ? new Date(data.createdAt.toDate()).toLocaleDateString() : '2024-01-15',
          expanded: false
        }
      })
      
      setIdeas(fetchedIdeas.length > 0 ? fetchedIdeas : getMockIdeas())
    } catch (error) {
      console.error('Error fetching ideas:', error)
      setIdeas(getMockIdeas())
    } finally {
      setLoading(false)
    }
  }

  const getMockIdeas = (): Idea[] => [
    {
      id: '1', rank: 1, title: 'Neural Trading Assistant', type: 'business', genre: 'Fintech', author: 'Marcus Chen',
      desc: 'AI-powered trading platform that analyzes market sentiment, news, and technical indicators in real-time. Uses deep learning to predict price movements and automatically executes trades based on risk tolerance. Platform includes comprehensive risk management, backtesting capabilities, and social trading features where users can copy strategies from top performers.',
      aiScore: 92, marketScore: 95, innovationScore: 88, executionScore: 93, publicScore: 8.7, publicVotes: 234, timestamp: '2024-01-22', expanded: false
    },
    {
      id: '2', rank: 2, title: 'Quantum Chess VR', type: 'games', genre: 'VR/AR', author: 'Sarah Kim',
      desc: 'Revolutionary VR chess where pieces exist in quantum superposition until observed. Players can make probabilistic moves, creating multiple potential board states simultaneously. Features tournament mode, AI training partners with adjustable difficulty, physics-based piece interactions, and stunning photorealistic 3D environments.',
      aiScore: 89, marketScore: 82, innovationScore: 97, executionScore: 88, publicScore: 9.1, publicVotes: 189, timestamp: '2024-01-21', expanded: false
    },
    {
      id: '3', rank: 3, title: 'The Memory Thief', type: 'movies', genre: 'Sci-Fi', author: 'David Rodriguez',
      desc: 'In 2087, memories are currency traded on black markets. A memory dealer discovers they can steal and implant experiences, but when they accidentally absorb memories of a murder victim, they become the target. Neo-noir thriller exploring identity, consciousness, and what makes us human in an age where memories can be manufactured.',
      aiScore: 87, marketScore: 89, innovationScore: 83, executionScore: 89, publicScore: 8.4, publicVotes: 156, timestamp: '2024-01-20', expanded: false
    },
    {
      id: '4', rank: 4, title: 'EcoChain Marketplace', type: 'business', genre: 'CleanTech', author: 'Anna Foster',
      desc: 'Blockchain-based carbon credit trading platform for individuals and small businesses. Users earn verified tokens for eco-friendly actions, trade credits globally, and offset carbon footprints. Includes IoT sensors for automatic verification, gamification elements, and corporate partnership programs.',
      aiScore: 86, marketScore: 91, innovationScore: 84, executionScore: 83, publicScore: 7.9, publicVotes: 203, timestamp: '2024-01-19', expanded: false
    },
    {
      id: '5', rank: 5, title: 'Mind Palace Builder', type: 'games', genre: 'Mobile Games', author: 'James Park',
      desc: 'Memory training game based on ancient method of loci technique. Players build virtual palaces and systematically place information in rooms to enhance memory retention. Features multiplayer memory competitions, daily brain training challenges, educational content integration, and progress tracking.',
      aiScore: 84, marketScore: 78, innovationScore: 87, executionScore: 87, publicScore: 8.2, publicVotes: 167, timestamp: '2024-01-18', expanded: false
    },
    {
      id: '6', rank: 6, title: 'Fractured Reality', type: 'movies', genre: 'Thriller', author: 'Elena Vasquez',
      desc: 'Quantum physicist discovers parallel universes bleeding into ours after failed experiment. As reality fractures, she must navigate multiple versions of herself to prevent collapse of all dimensions. High-concept sci-fi thriller with practical effects, exploring themes of choice, consequence, and infinite possibility.',
      aiScore: 83, marketScore: 81, innovationScore: 89, executionScore: 79, publicScore: 8.6, publicVotes: 142, timestamp: '2024-01-17', expanded: false
    },
    {
      id: '7', rank: 7, title: 'AgriAI Optimizer', type: 'business', genre: 'AI/ML', author: 'Robert Singh',
      desc: 'Comprehensive AI-powered farm management system using satellite imagery, weather data, soil sensors, and IoT devices to optimize crop yields. Predicts pest outbreaks, recommends precise fertilizer schedules, monitors soil health, and provides real-time market pricing for optimal harvest timing decisions.',
      aiScore: 82, marketScore: 87, innovationScore: 79, executionScore: 80, publicScore: 7.5, publicVotes: 198, timestamp: '2024-01-16', expanded: false
    },
    {
      id: '8', rank: 8, title: 'Temporal Heist', type: 'games', genre: 'Strategy', author: 'Maya Thompson',
      desc: 'Complex turn-based strategy game where players plan elaborate heists across multiple time periods. Actions in past directly affect present outcomes, creating intricate cause-and-effect scenarios. Features single-player campaigns, competitive multiplayer modes, and time paradox puzzle mechanics.',
      aiScore: 81, marketScore: 76, innovationScore: 88, executionScore: 79, publicScore: 8.3, publicVotes: 134, timestamp: '2024-01-15', expanded: false
    },
    {
      id: '9', rank: 9, title: 'CodeMentor AI', type: 'business', genre: 'EdTech', author: 'Alex Johnson',
      desc: 'Personalized AI coding tutor that adapts to individual learning styles and provides real-time feedback on programming projects. Features interactive debugging sessions, code review assistance, career guidance, and integration with popular development environments.',
      aiScore: 79, marketScore: 85, innovationScore: 74, executionScore: 78, publicScore: 7.8, publicVotes: 167, timestamp: '2024-01-14', expanded: false
    },
    {
      id: '10', rank: 10, title: 'Shadow Protocol', type: 'movies', genre: 'Action', author: 'Rachel Torres',
      desc: 'Elite cyber-warfare specialist discovers government conspiracy involving AI manipulation of global markets. Must expose the truth while being hunted by both foreign agents and domestic authorities. High-tech thriller combining practical stunts with cutting-edge digital effects.',
      aiScore: 78, marketScore: 82, innovationScore: 73, executionScore: 80, publicScore: 8.1, publicVotes: 128, timestamp: '2024-01-13', expanded: false
    }
  ]

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  const toggleExpanded = (ideaId: string) => {
    setIdeas(prev => prev.map(idea => 
      idea.id === ideaId ? { ...idea, expanded: !idea.expanded } : idea
    ))
  }

  const filteredIdeas = ideas.filter(idea => {
    if (activeCategory === 'all') return true
    if (activeCategory !== idea.type) return false
    if (activeGenre === 'all') return true
    return idea.genre === activeGenre
  })

  const handleVote = (ideaId: string) => {
    if (!user) {
      setShowLoginModal(true)
      return
    }
    console.log('Voting for idea:', ideaId)
  }

  return (
    <>
      <Head>
        <title>Hyoka - AI Ranks Ideas, Not Marketing Budgets</title>
        <meta name="description" content="Get your ideas ranked by merit, not money. Advanced AI evaluation platform for entrepreneurs, creators, and innovators." />
      </Head>

      <style jsx global>{`
        @font-face {
          font-family: 'Vipnagorgialla';
          src: url('/fonts/Vipnagorgialla Bd.otf') format('opentype');
          font-weight: bold;
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
          font-family: 'Sohne';
          src: url('/fonts/TestSohneBreit-Buch.otf') format('opentype');
          font-weight: 400;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'Sohne';
          src: url('/fonts/TestSohneBreit-Kraftig.otf') format('opentype');
          font-weight: 500;
          font-display: swap;
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Sohne', -apple-system, BlinkMacSystemFont, sans-serif;
          background: #f8f9fa;
          color: #1a1a1a;
          line-height: 1.6;
        }
      `}</style>

      {/* Header */}
      <header className="header">
        <div className="header-content">
          <Link href="/">
            <a className="header-logo">Hyoka</a>
          </Link>
          <nav className="header-nav">
            <Link href="/">
              <a className="nav-link">Home</a>
            </Link>
            <Link href="/leaderboard">
              <a className="nav-link">Leaderboard</a>
            </Link>
            <Link href="/how-it-works">
              <a className="nav-link">How It Works</a>
            </Link>
            <Link href="/why-us">
              <a className="nav-link">Why Us</a>
            </Link>
            <Link href="/pricing">
              <a className="nav-link">Pricing</a>
            </Link>
            {user ? (
              <>
                <Link href="/dashboard">
                  <a className="nav-link">Dashboard</a>
                </Link>
                <button className="nav-button secondary">Sign Out</button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setShowLoginModal(true)} 
                  className="nav-link"
                >
                  Login
                </button>
                <Link href="/submit">
                  <a className="nav-button">Submit My Idea</a>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <div className="app-layout">
        {/* Left Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-section">
            <h3 className="sidebar-title">Categories</h3>
            <div className="nav-category">
              <button
                className={`nav-item ${activeCategory === 'all' ? 'active' : ''}`}
                onClick={() => {
                  setActiveCategory('all')
                  setActiveGenre('all')
                }}
              >
                <span className="nav-text">All Ideas</span>
                <span className="nav-count">{ideas.length}</span>
              </button>
            </div>

            {Object.entries(categories).map(([category, genres]) => (
              <div key={category} className="nav-category">
                <button
                  className={`nav-item ${activeCategory === category ? 'active' : ''}`}
                  onClick={() => {
                    setActiveCategory(category as any)
                    setActiveGenre('all')
                    toggleCategory(category)
                  }}
                >
                  <span className="nav-text">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </span>
                  <span className="nav-count">
                    {ideas.filter(i => i.type === category).length}
                  </span>
                  <span className="expand-icon">
                    {expandedCategories[category] ? '−' : '+'}
                  </span>
                </button>
                
                {expandedCategories[category] && (
                  <div className="genre-list">
                    <button
                      className={`genre-item ${activeGenre === 'all' ? 'active' : ''}`}
                      onClick={() => setActiveGenre('all')}
                    >
                      All {category}
                    </button>
                    {genres.map(genre => (
                      <button
                        key={genre}
                        className={`genre-item ${activeGenre === genre ? 'active' : ''}`}
                        onClick={() => setActiveGenre(genre)}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">Platform Stats</h3>
            <div className="stats-list">
              <div className="stat-item">
                <span className="stat-label">Total Ideas</span>
                <span className="stat-value">15,847</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">AI Evaluations</span>
                <span className="stat-value">23,901</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Active Users</span>
                <span className="stat-value">4,567</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">This Week</span>
                <span className="stat-value">127 new</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {/* Hero Section */}
          <section className="hero-section">
            <h1 className="hero-title">AI Ranks Ideas, Not Marketing Budgets</h1>
            <p className="hero-subtitle">
              Turn great ideas into fame without spending. Submit your ideas for unbiased AI scoring, 
              or discover tomorrow's breakthroughs before they go viral. Join 15,847 entrepreneurs 
              who've gotten honest, data-driven feedback.
            </p>
            <div className="hero-actions">
              <Link href="/submit">
                <a className="primary-cta">Submit My Idea</a>
              </Link>
              <button className="secondary-cta">Browse Top Ideas</button>
            </div>
            <div className="hero-proof">
              <span className="proof-text">127 ideas submitted this week</span>
              <span className="proof-divider">•</span>
              <span className="proof-text">$2.3M in funding raised by top ideas</span>
              <span className="proof-divider">•</span>
              <span className="proof-text">89% accuracy rate</span>
            </div>
          </section>

          {/* Ideas Grid */}
          <section className="ideas-section">
            <div className="section-header">
              <h2 className="section-title">
                {activeCategory === 'all' ? 'All Ideas' : 
                 activeGenre === 'all' ? 
                   `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Ideas` :
                   `${activeGenre} Ideas`}
              </h2>
              <div className="section-meta">
                <span className="result-count">{filteredIdeas.length} results</span>
                <select className="sort-select">
                  <option>Sort by AI Score</option>
                  <option>Sort by Public Score</option>
                  <option>Sort by Recent</option>
                </select>
              </div>
            </div>

            <div className="ideas-grid">
              {filteredIdeas.map((idea) => (
                <div key={idea.id} className="idea-card">
                  <div className="card-rank-bar">
                    <span className="rank-number">{idea.rank}</span>
                  </div>
                  
                  <div className="card-content">
                    <div className="card-header">
                      <h3 className="card-title">{idea.title}</h3>
                      <div className="card-meta">
                        <span className="card-author">by {idea.author}</span>
                        <span className="card-genre">{idea.genre}</span>
                        <span className="card-date">{idea.timestamp}</span>
                      </div>
                    </div>
                    
                    <div className="card-score-main">
                      <span className="main-score">{Math.round(idea.aiScore)}</span>
                      <span className="score-label-main">AI Score</span>
                    </div>
                    
                    <p className="card-description">
                      {idea.expanded ? idea.desc : `${idea.desc.substring(0, 120)}...`}
                    </p>
                    
                    <div className="card-actions">
                      <button 
                        className="expand-button"
                        onClick={() => toggleExpanded(idea.id)}
                      >
                        {idea.expanded ? 'Show Less' : 'Read More'}
                      </button>
                      
                      <div className="public-score">
                        <span className="public-value">{idea.publicScore.toFixed(1)}</span>
                        <span className="public-label">({idea.publicVotes} votes)</span>
                      </div>
                    </div>
                    
                    {idea.expanded && (
                      <div className="detailed-scores">
                        <div className="score-row">
                          <span className="score-metric">Market Potential</span>
                          <span className="score-number">{Math.round(idea.marketScore)}</span>
                        </div>
                        <div className="score-row">
                          <span className="score-metric">Innovation Level</span>
                          <span className="score-number">{Math.round(idea.innovationScore)}</span>
                        </div>
                        <div className="score-row">
                          <span className="score-metric">Execution Difficulty</span>
                          <span className="score-number">{Math.round(idea.executionScore)}</span>
                        </div>
                        <div className="vote-section">
                          <button 
                            className="vote-button"
                            onClick={() => handleVote(idea.id)}
                          >
                            Vote on This Idea
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Explanation Section */}
          <section className="explanation-section">
            <h2 className="section-title">Advanced Neural Network Analysis</h2>
            <div className="explanation-content">
              <div className="explanation-block">
                <h3 className="explanation-title">Three-Dimensional Scoring System</h3>
                <p className="explanation-text">
                  Our proprietary AI analyzes your idea using deep learning models trained on over 50,000 successful 
                  and failed ventures. Every submission receives comprehensive evaluation across Market Potential, 
                  Innovation Level, and Execution Difficulty using real-world business data and market intelligence.
                </p>
              </div>
              
              <div className="explanation-block">
                <h3 className="explanation-title">Real-Time Market Validation</h3>
                <p className="explanation-text">
                  Beyond AI analysis, ideas undergo community validation from verified entrepreneurs, investors, and 
                  industry experts. This dual-layer approach combines algorithmic precision with human insight, 
                  ensuring comprehensive evaluation that mirrors real market conditions.
                </p>
              </div>
              
              <div className="explanation-block">
                <h3 className="explanation-title">Transparent Merit-Based Ranking</h3>
                <p className="explanation-text">
                  No marketing budgets required. No connections needed. No pitch decks necessary. Ideas rise purely 
                  on merit through our transparent scoring system. The platform has helped launch over 200 successful 
                  startups with combined valuations exceeding $500 million.
                </p>
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
          background: #000000;
          color: white;
          padding: 16px 0;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
        }

        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-logo {
          font-family: 'Vipnagorgialla', serif;
          font-size: 24px;
          font-weight: bold;
          color: white;
          text-decoration: none;
        }

        .header-nav {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .nav-link {
          font-family: 'FoundersGrotesk', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: white;
          text-decoration: none;
          padding: 8px 0;
          transition: all 0.2s;
          background: none;
          border: none;
          cursor: pointer;
        }

        .nav-link:hover {
          color: #e5e5e5;
        }

        .nav-button {
          font-family: 'FoundersGrotesk', sans-serif;
          font-size: 14px;
          font-weight: 600;
          padding: 10px 20px;
          background: white;
          color: #000000;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-block;
        }

        .nav-button:hover {
          background: #f0f0f0;
          transform: translateY(-1px);
        }

        .nav-button.secondary {
          background: transparent;
          color: white;
          border: 1px solid white;
        }

        .nav-button.secondary:hover {
          background: white;
          color: #000000;
        }

        .app-layout {
          display: flex;
          margin-top: 64px;
          min-height: calc(100vh - 64px);
        }

        /* Sidebar Styles */
        .sidebar {
          width: 280px;
          background: white;
          border-right: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
          position: fixed;
          height: calc(100vh - 64px);
          overflow-y: auto;
        }

        .sidebar-section {
          padding: 24px 20px;
          border-bottom: 1px solid #f3f4f6;
        }

        .sidebar-title {
          font-family: 'FoundersGrotesk', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #374151;
          margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .nav-category {
          margin-bottom: 4px;
        }

        .nav-item {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border: none;
          background: none;
          font-family: 'FoundersGrotesk', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #4b5563;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
          border-radius: 6px;
        }

        .nav-item:hover,
        .nav-item.active {
          background: #f3f4f6;
          color: #1f2937;
        }

        .nav-text {
          flex: 1;
        }

        .nav-count {
          background: #e5e7eb;
          color: #6b7280;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          margin-right: 8px;
        }

        .nav-item.active .nav-count {
          background: #3b82f6;
          color: white;
        }

        .expand-icon {
          font-size: 14px;
          font-weight: 700;
          color: #9ca3af;
        }

        .genre-list {
          margin-left: 16px;
          margin-top: 8px;
        }

        .genre-item {
          width: 100%;
          padding: 8px 16px;
          background: none;
          border: none;
          font-family: 'Sohne', sans-serif;
          font-size: 13px;
          color: #6b7280;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s;
          border-radius: 4px;
          display: block;
          margin-bottom: 2px;
        }

        .genre-item:hover,
        .genre-item.active {
          color: #3b82f6;
          background: #eff6ff;
        }

        .stats-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .stat-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .stat-label {
          font-family: 'Sohne', sans-serif;
          font-size: 13px;
          color: #6b7280;
        }

        .stat-value {
          font-family: 'FoundersGrotesk', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #1f2937;
        }

        /* Main Content Styles */
        .main-content {
          flex: 1;
          margin-left: 280px;
          background: #f8f9fa;
        }

        /* Hero Section */
        .hero-section {
          background: #f8f9fa;
          padding: 60px 40px;
          text-align: center;
          border-bottom: 1px solid #e5e7eb;
        }

        .hero-title {
          font-family: 'Vipnagorgialla', serif;
          font-size: 48px;
          font-weight: bold;
          margin-bottom: 20px;
          line-height: 1.2;
          color: #1a1a1a;
        }

        .hero-subtitle {
          font-family: 'Sohne', sans-serif;
          font-size: 18px;
          color: #4b5563;
          max-width: 700px;
          margin: 0 auto 32px;
          line-height: 1.6;
        }

        .hero-actions {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-bottom: 32px;
        }

        .primary-cta {
          background: #000000;
          color: white;
          padding: 16px 32px;
          font-family: 'FoundersGrotesk', sans-serif;
          font-size: 16px;
          font-weight: 700;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-block;
        }

        .primary-cta:hover {
          background: #1f1f1f;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }

        .secondary-cta {
          background: transparent;
          color: #4b5563;
          padding: 16px 32px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-family: 'FoundersGrotesk', sans-serif;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .secondary-cta:hover {
          border-color: #9ca3af;
          color: #374151;
        }

        .hero-proof {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          font-family: 'Sohne', sans-serif;
          font-size: 14px;
          color: #6b7280;
        }

        .proof-text {
          font-weight: 500;
        }

        .proof-divider {
          color: #d1d5db;
        }

        /* Ideas Section */
        .ideas-section {
          padding: 40px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .section-title {
          font-family: 'FoundersGrotesk', sans-serif;
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
        }

        .section-meta {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .result-count {
          font-family: 'Sohne', sans-serif;
          font-size: 14px;
          color: #6b7280;
        }

        .sort-select {
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-family: 'Sohne', sans-serif;
          font-size: 13px;
          background: white;
          color: #374151;
        }

        /* Ideas Grid */
        .ideas-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }

        .idea-card {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          transition: all 0.3s;
          position: relative;
          height: fit-content;
        }

        .idea-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.12);
        }

        .card-rank-bar {
          width: 8px;
          height: 100%;
          background: #000000;
          position: absolute;
          left: 0;
          top: 0;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 12px;
        }

        .rank-number {
          background: white;
          color: #000000;
          padding: 4px 6px;
          border-radius: 0 4px 4px 0;
          font-family: 'FoundersGrotesk', sans-serif;
          font-size: 12px;
          font-weight: 700;
          min-width: 24px;
          text-align: center;
        }

        .card-content {
          padding: 20px;
          margin-left: 8px;
        }

        .card-header {
          margin-bottom: 16px;
        }

        .card-title {
          font-family: 'FoundersGrotesk', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 8px;
        }

        .card-meta {
          display: flex;
          gap: 12px;
          font-family: 'Sohne', sans-serif;
          font-size: 12px;
          color: #6b7280;
        }

        .card-author {
          font-weight: 500;
        }

        .card-genre {
          background: #f3f4f6;
          color: #4b5563;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 10px;
          font-weight: 500;
        }

        .card-date {
          color: #9ca3af;
        }

        .card-score-main {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 16px;
        }

        .main-score {
          font-family: 'FoundersGrotesk', sans-serif;
          font-size: 32px;
          font-weight: 700;
          color: #1f2937;
        }

        .score-label-main {
          font-family: 'Sohne', sans-serif;
          font-size: 12px;
          color: #6b7280;
        }

        .card-description {
          font-family: 'Sohne', sans-serif;
          font-size: 14px;
          color: #4b5563;
          line-height: 1.5;
          margin-bottom: 16px;
        }

        .card-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .expand-button {
          background: none;
          border: none;
          color: #3b82f6;
          font-family: 'Sohne', sans-serif;
          font-size: 13px;
          cursor: pointer;
          padding: 0;
        }

        .expand-button:hover {
          text-decoration: underline;
        }

        .public-score {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }

        .public-value {
          font-family: 'FoundersGrotesk', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #1f2937;
        }

        .public-label {
          font-family: 'Sohne', sans-serif;
          font-size: 11px;
          color: #6b7280;
        }

        .detailed-scores {
          border-top: 1px solid #f3f4f6;
          padding-top: 16px;
          margin-top: 16px;
        }

        .score-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .score-metric {
          font-family: 'Sohne', sans-serif;
          font-size: 13px;
          color: #6b7280;
        }

        .score-number {
          font-family: 'FoundersGrotesk', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #1f2937;
        }

        .vote-section {
          margin-top: 16px;
          padding-top: 12px;
          border-top: 1px solid #f3f4f6;
        }

        .vote-button {
          width: 100%;
          background: #3b82f6;
          color: white;
          padding: 10px;
          border: none;
          border-radius: 6px;
          font-family: 'FoundersGrotesk', sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .vote-button:hover {
          background: #2563eb;
        }

        /* Explanation Section */
        .explanation-section {
          padding: 60px 40px;
          background: white;
          border-top: 1px solid #e5e7eb;
        }

        .explanation-content {
          max-width: 1000px;
          margin: 32px auto 0;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 40px;
        }

        .explanation-block {
          text-align: left;
        }

        .explanation-title {
          font-family: 'FoundersGrotesk', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 12px;
        }

        .explanation-text {
          font-family: 'Sohne', sans-serif;
          font-size: 14px;
          color: #4b5563;
          line-height: 1.6;
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .sidebar {
            width: 240px;
          }
          
          .main-content {
            margin-left: 240px;
          }
          
          .ideas-grid {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .header-nav {
            display: none;
          }
          
          .sidebar {
            transform: translateX(-100%);
          }
          
          .main-content {
            margin-left: 0;
          }
          
          .hero-section {
            padding: 40px 20px;
          }
          
          .hero-title {
            font-size: 36px;
          }
          
          .hero-actions {
            flex-direction: column;
            align-items: center;
          }
          
          .hero-proof {
            flex-direction: column;
            gap: 8px;
          }
          
          .ideas-section,
          .explanation-section {
            padding: 40px 20px;
          }
          
          .ideas-grid {
            grid-template-columns: 1fr;
          }
          
          .explanation-content {
            grid-template-columns: 1fr;
            gap: 24px;
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
          z-index: 1001;
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
          font-family: 'FoundersGrotesk', sans-serif;
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
          font-family: 'Sohne', sans-serif;
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
          font-family: 'Sohne', sans-serif;
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
          font-family: 'FoundersGrotesk', sans-serif;
          font-size: 14px;
          font-weight: 600;
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
          font-family: 'Sohne', sans-serif;
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
