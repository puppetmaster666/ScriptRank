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
    business: false,
    games: false,
    movies: false
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
          aiScore: Math.round(aiScore * 10),
          marketScore: Math.round((data.aiScores?.market || Math.random() * 10) * 10),
          innovationScore: Math.round((data.aiScores?.innovation || Math.random() * 10) * 10),
          executionScore: Math.round((data.aiScores?.execution || Math.random() * 10) * 10),
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
      desc: 'AI-powered trading platform that analyzes market sentiment, news, and technical indicators in real-time. Uses deep learning to predict price movements and automatically executes trades based on risk tolerance.',
      aiScore: 92, marketScore: 95, innovationScore: 88, executionScore: 93, publicScore: 8.7, publicVotes: 234, timestamp: '2024-01-22', expanded: false
    },
    {
      id: '2', rank: 2, title: 'Quantum Chess VR', type: 'games', genre: 'VR/AR', author: 'Sarah Kim',
      desc: 'Revolutionary VR chess where pieces exist in quantum superposition until observed. Players can make probabilistic moves, creating multiple potential board states simultaneously.',
      aiScore: 89, marketScore: 82, innovationScore: 97, executionScore: 88, publicScore: 9.1, publicVotes: 189, timestamp: '2024-01-21', expanded: false
    },
    {
      id: '3', rank: 3, title: 'The Memory Thief', type: 'movies', genre: 'Sci-Fi', author: 'David Rodriguez',
      desc: 'In 2087, memories are currency traded on black markets. A memory dealer discovers they can steal and implant experiences, but when they absorb memories of a murder victim, they become the target.',
      aiScore: 87, marketScore: 89, innovationScore: 83, executionScore: 89, publicScore: 8.4, publicVotes: 156, timestamp: '2024-01-20', expanded: false
    },
    {
      id: '4', rank: 4, title: 'EcoChain Marketplace', type: 'business', genre: 'CleanTech', author: 'Anna Foster',
      desc: 'Blockchain-based carbon credit trading platform for individuals and small businesses. Users earn verified tokens for eco-friendly actions and trade credits globally.',
      aiScore: 86, marketScore: 91, innovationScore: 84, executionScore: 83, publicScore: 7.9, publicVotes: 203, timestamp: '2024-01-19', expanded: false
    },
    {
      id: '5', rank: 5, title: 'Mind Palace Builder', type: 'games', genre: 'Mobile Games', author: 'James Park',
      desc: 'Memory training game based on ancient method of loci technique. Players build virtual palaces and systematically place information in rooms to enhance memory retention.',
      aiScore: 84, marketScore: 78, innovationScore: 87, executionScore: 87, publicScore: 8.2, publicVotes: 167, timestamp: '2024-01-18', expanded: false
    },
    {
      id: '6', rank: 6, title: 'Fractured Reality', type: 'movies', genre: 'Thriller', author: 'Elena Vasquez',
      desc: 'Quantum physicist discovers parallel universes bleeding into ours after failed experiment. As reality fractures, she must navigate multiple versions of herself to prevent collapse.',
      aiScore: 83, marketScore: 81, innovationScore: 89, executionScore: 79, publicScore: 8.6, publicVotes: 142, timestamp: '2024-01-17', expanded: false
    },
    {
      id: '7', rank: 7, title: 'AgriAI Optimizer', type: 'business', genre: 'AI/ML', author: 'Robert Singh',
      desc: 'AI-powered farm management system using satellite imagery, weather data, and IoT sensors to optimize crop yields. Predicts pest outbreaks and recommends fertilizer schedules.',
      aiScore: 82, marketScore: 87, innovationScore: 79, executionScore: 80, publicScore: 7.5, publicVotes: 198, timestamp: '2024-01-16', expanded: false
    },
    {
      id: '8', rank: 8, title: 'Temporal Heist', type: 'games', genre: 'Strategy', author: 'Maya Thompson',
      desc: 'Turn-based strategy game where players plan elaborate heists across multiple time periods. Actions in past directly affect present outcomes, creating complex scenarios.',
      aiScore: 81, marketScore: 76, innovationScore: 88, executionScore: 79, publicScore: 8.3, publicVotes: 134, timestamp: '2024-01-15', expanded: false
    },
    {
      id: '9', rank: 9, title: 'CodeMentor AI', type: 'business', genre: 'EdTech', author: 'Alex Johnson',
      desc: 'Personalized AI coding tutor that adapts to individual learning styles and provides real-time feedback on programming projects with interactive debugging sessions.',
      aiScore: 79, marketScore: 85, innovationScore: 74, executionScore: 78, publicScore: 7.8, publicVotes: 167, timestamp: '2024-01-14', expanded: false
    },
    {
      id: '10', rank: 10, title: 'Shadow Protocol', type: 'movies', genre: 'Action', author: 'Rachel Torres',
      desc: 'Elite cyber-warfare specialist discovers government conspiracy involving AI manipulation of global markets. Must expose the truth while being hunted by authorities.',
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

  const getScoreColor = (score: number) => {
    if (score >= 75) return '#10b981'
    if (score >= 50) return '#f59e0b' 
    return '#ef4444'
  }

  return (
    <>
      <Head>
        <title>Hyoka - Get Discovered by Merit, Not Money</title>
        <meta name="description" content="AI-powered idea evaluation platform. Professional analysis without marketing budgets." />
      </Head>

      <style jsx global>{`
        @font-face {
          font-family: 'Vipnagorgialla';
          src: url('/fonts/Vipnagorgialla Bd.otf') format('opentype');
          font-weight: bold;
          font-display: swap;
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          background: #f5f5f5;
          color: #1a1a1a;
          line-height: 1.5;
        }
      `}</style>

      {/* Header */}
      <header className="header">
        <div className="container">
          <Link href="/">
            <a className="logo">Hyoka</a>
          </Link>
          <nav className="nav">
            <Link href="/"><a className="nav-link">Home</a></Link>
            <Link href="/leaderboard"><a className="nav-link">Leaderboard</a></Link>
            <Link href="/how-it-works"><a className="nav-link">How It Works</a></Link>
            <Link href="/pricing"><a className="nav-link">Pricing</a></Link>
            {user && <Link href="/dashboard"><a className="nav-link">Dashboard</a></Link>}
          </nav>
        </div>
      </header>

      <div className="layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-section">
            <h3>Actions</h3>
            <Link href="/submit">
              <a className="btn-primary">Submit My Idea</a>
            </Link>
            <button 
              onClick={() => setShowLoginModal(true)} 
              className="btn-secondary"
            >
              Login
            </button>
          </div>

          <div className="sidebar-section">
            <h3>Categories</h3>
            
            <button
              className={`category-btn ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => {
                setActiveCategory('all')
                setActiveGenre('all')
              }}
            >
              <span>All Ideas</span>
              <span className="count">{ideas.length}</span>
            </button>

            {Object.entries(categories).map(([category, genres]) => (
              <div key={category}>
                <button
                  className={`category-btn ${activeCategory === category ? 'active' : ''}`}
                  onClick={() => {
                    setActiveCategory(category as any)
                    setActiveGenre('all')
                    toggleCategory(category)
                  }}
                >
                  <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                  <span className="count">{ideas.filter(i => i.type === category).length}</span>
                  <span className="expand">{expandedCategories[category] ? '−' : '+'}</span>
                </button>
                
                {expandedCategories[category] && (
                  <div className="genre-list">
                    {genres.map(genre => (
                      <button
                        key={genre}
                        className={`genre-btn ${activeGenre === genre ? 'active' : ''}`}
                        onClick={() => {
                          setActiveCategory(category as any)
                          setActiveGenre(genre)
                        }}
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
            <h3>Stats</h3>
            <div className="stats">
              <div className="stat">
                <span className="stat-label">Total Ideas</span>
                <span className="stat-value">15,847</span>
              </div>
              <div className="stat">
                <span className="stat-label">This Week</span>
                <span className="stat-value">127</span>
              </div>
              <div className="stat">
                <span className="stat-label">Active Users</span>
                <span className="stat-value">4,567</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="main">
          {/* Hero */}
          <section className="hero">
            <h1>Get Discovered by Merit, Not Money</h1>
            <p>
              Advanced AI algorithms analyze market potential, innovation level, and execution feasibility. 
              Join 15,847 entrepreneurs who've gotten honest, data-driven feedback without spending on marketing.
            </p>
            <div className="hero-stats">
              <span>127 ideas submitted this week</span>
              <span>•</span>
              <span>$2.3M raised by top ideas</span>
              <span>•</span>
              <span>89% accuracy rate</span>
            </div>
          </section>

          {/* Ideas Grid */}
          <section className="ideas">
            <div className="ideas-header">
              <h2>
                {activeCategory === 'all' ? 'All Ideas' : 
                 activeGenre === 'all' ? 
                   `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Ideas` :
                   `${activeGenre} Ideas`}
              </h2>
              <span className="count">{filteredIdeas.length} results</span>
            </div>

            <div className="grid">
              {filteredIdeas.map((idea) => (
                <div key={idea.id} className="card">
                  <div className="rank-badge">{idea.rank}</div>
                  
                  <div className="card-content">
                    <div className="card-header">
                      <h3>{idea.title}</h3>
                      <div className="meta">
                        <span>by {idea.author}</span>
                        <span>{idea.genre}</span>
                        <span>{idea.timestamp}</span>
                      </div>
                    </div>
                    
                    <div className="score-display">
                      <span className="main-score">{idea.aiScore}</span>
                      <span className="score-label">AI Score</span>
                    </div>
                    
                    <p className="description">
                      {idea.expanded ? idea.desc : `${idea.desc.substring(0, 120)}...`}
                    </p>
                    
                    <div className="card-actions">
                      <button 
                        className="expand-btn"
                        onClick={() => toggleExpanded(idea.id)}
                      >
                        {idea.expanded ? 'Show Less' : 'Read More'}
                      </button>
                      
                      <div className="public-score">
                        <span className="public-value">{idea.publicScore.toFixed(1)}</span>
                        <span className="vote-count">({idea.publicVotes} votes)</span>
                      </div>
                    </div>
                    
                    {idea.expanded && (
                      <div className="detailed-metrics">
                        <div className="metric">
                          <span className="metric-label">Market</span>
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
                        
                        <div className="metric">
                          <span className="metric-label">Innovation</span>
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
                        
                        <div className="metric">
                          <span className="metric-label">Execution</span>
                          <div className="metric-bar">
                            <div 
                              className="metric-fill" 
                              style={{ 
                                width: `${100 - idea.executionScore}%`,
                                backgroundColor: idea.executionScore >= 75 ? '#ef4444' : idea.executionScore >= 50 ? '#f59e0b' : '#10b981'
                              }}
                            />
                          </div>
                          <span className="metric-score" style={{ color: idea.executionScore >= 75 ? '#ef4444' : idea.executionScore >= 50 ? '#f59e0b' : '#10b981' }}>
                            {idea.executionScore}
                          </span>
                        </div>
                        
                        <button 
                          className="vote-btn"
                          onClick={() => handleVote(idea.id)}
                        >
                          Vote on This Idea
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* How It Works */}
          <section className="how-it-works">
            <h2>How AI Evaluation Works</h2>
            <div className="process">
              <div className="process-step">
                <div className="step-number">1</div>
                <h3>Submit Your Idea</h3>
                <p>Describe your concept in 30-500 words. No marketing materials needed.</p>
              </div>
              <div className="process-step">
                <div className="step-number">2</div>
                <h3>AI Analysis</h3>
                <p>Advanced algorithms evaluate market potential, innovation, and execution difficulty.</p>
              </div>
              <div className="process-step">
                <div className="step-number">3</div>
                <h3>Get Rankings</h3>
                <p>Ideas are ranked transparently based on merit, not marketing spend.</p>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Login Modal */}
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}

      <style jsx>{`
        .header {
          background: #f5f5f5;
          border-bottom: 1px solid #ddd;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          height: 60px;
          display: flex;
          align-items: center;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        .logo {
          font-family: 'Vipnagorgialla', serif;
          font-size: 24px;
          font-weight: bold;
          color: #000;
          text-decoration: none;
        }

        .nav {
          display: flex;
          gap: 24px;
        }

        .nav-link {
          color: #333;
          text-decoration: none;
          font-weight: 500;
          font-size: 14px;
        }

        .nav-link:hover {
          color: #000;
        }

        .layout {
          margin-top: 60px;
          display: flex;
          min-height: calc(100vh - 60px);
        }

        .sidebar {
          width: 280px;
          background: #fff;
          border-right: 1px solid #ddd;
          position: fixed;
          height: calc(100vh - 60px);
          overflow-y: auto;
        }

        .sidebar-section {
          padding: 20px;
          border-bottom: 1px solid #eee;
        }

        .sidebar-section h3 {
          font-size: 14px;
          font-weight: 600;
          color: #666;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .btn-primary {
          display: block;
          width: 100%;
          padding: 12px;
          background: #000;
          color: #fff;
          text-decoration: none;
          text-align: center;
          font-weight: 500;
          margin-bottom: 8px;
          transition: background 0.2s;
        }

        .btn-primary:hover {
          background: #333;
        }

        .btn-secondary {
          display: block;
          width: 100%;
          padding: 12px;
          background: transparent;
          color: #333;
          border: 1px solid #ddd;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-secondary:hover {
          background: #f5f5f5;
        }

        .category-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 8px 12px;
          background: transparent;
          border: none;
          text-align: left;
          cursor: pointer;
          font-size: 14px;
          margin-bottom: 2px;
          transition: background 0.2s;
        }

        .category-btn:hover,
        .category-btn.active {
          background: #f0f0f0;
        }

        .count {
          background: #eee;
          color: #666;
          padding: 2px 6px;
          border-radius: 10px;
          font-size: 11px;
          font-weight: 600;
        }

        .category-btn.active .count {
          background: #000;
          color: #fff;
        }

        .expand {
          font-weight: bold;
          color: #999;
        }

        .genre-list {
          margin-left: 16px;
          margin-top: 4px;
        }

        .genre-btn {
          display: block;
          width: 100%;
          padding: 6px 12px;
          background: transparent;
          border: none;
          text-align: left;
          cursor: pointer;
          font-size: 13px;
          color: #666;
          margin-bottom: 2px;
          transition: all 0.2s;
        }

        .genre-btn:hover,
        .genre-btn.active {
          background: #f0f0f0;
          color: #000;
        }

        .stats {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .stat {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .stat-label {
          font-size: 13px;
          color: #666;
        }

        .stat-value {
          font-size: 13px;
          font-weight: 600;
          color: #000;
        }

        .main {
          flex: 1;
          margin-left: 280px;
          padding: 40px;
        }

        .hero {
          text-align: center;
          margin-bottom: 48px;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero h1 {
          font-size: 36px;
          font-weight: 700;
          margin-bottom: 16px;
          color: #000;
        }

        .hero p {
          font-size: 16px;
          color: #666;
          margin-bottom: 24px;
          line-height: 1.6;
        }

        .hero-stats {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          font-size: 14px;
          color: #888;
        }

        .ideas {
          margin-bottom: 48px;
        }

        .ideas-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .ideas-header h2 {
          font-size: 24px;
          font-weight: 600;
          color: #000;
        }

        .ideas-header .count {
          font-size: 14px;
          color: #666;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }

        .card {
          background: #fff;
          border: 1px solid #ddd;
          position: relative;
          overflow: hidden;
          transition: all 0.2s;
        }

        .card:hover {
          border-color: #999;
          transform: translateY(-1px);
        }

        .rank-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: #dc2626;
          color: #000;
          padding: 4px 8px;
          font-size: 12px;
          font-weight: 700;
          z-index: 10;
        }

        .card-content {
          padding: 20px;
        }

        .card-header {
          margin-bottom: 16px;
        }

        .card-header h3 {
          font-size: 16px;
          font-weight: 600;
          color: #000;
          margin-bottom: 8px;
        }

        .meta {
          display: flex;
          gap: 12px;
          font-size: 12px;
          color: #666;
        }

        .score-display {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 16px;
        }

        .main-score {
          font-size: 28px;
          font-weight: 700;
          color: #000;
        }

        .score-label {
          font-size: 12px;
          color: #666;
        }

        .description {
          font-size: 14px;
          color: #666;
          line-height: 1.5;
          margin-bottom: 16px;
        }

        .card-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .expand-btn {
          background: none;
          border: none;
          color: #007acc;
          font-size: 13px;
          cursor: pointer;
          padding: 0;
        }

        .expand-btn:hover {
          text-decoration: underline;
        }

        .public-score {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }

        .public-value {
          font-size: 14px;
          font-weight: 600;
          color: #000;
        }

        .vote-count {
          font-size: 11px;
          color: #666;
        }

        .detailed-metrics {
          border-top: 1px solid #eee;
          padding-top: 16px;
        }

        .metric {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .metric-label {
          font-size: 12px;
          color: #666;
          width: 80px;
        }

        .metric-bar {
          flex: 1;
          height: 16px;
          background: #f0f0f0;
          border: 1px solid #000;
          position: relative;
          overflow: hidden;
        }

        .metric-fill {
          height: 100%;
          transition: width 0.3s;
        }

        .metric-score {
          font-size: 12px;
          font-weight: 600;
          min-width: 24px;
          text-align: right;
        }

        .vote-btn {
          width: 100%;
          padding: 8px;
          background: #007acc;
          color: #fff;
          border: none;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          margin-top: 8px;
          transition: background 0.2s;
        }

        .vote-btn:hover {
          background: #005fa3;
        }

        .how-it-works {
          background: #fff;
          border: 1px solid #ddd;
          padding: 40px;
        }

        .how-it-works h2 {
          font-size: 24px;
          font-weight: 600;
          text-align: center;
          margin-bottom: 32px;
          color: #000;
        }

        .process {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }

        .process-step {
          text-align: center;
        }

        .step-number {
          width: 40px;
          height: 40px;
          background: #000;
          color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 18px;
          margin: 0 auto 16px;
        }

        .process-step h3 {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 8px;
          color: #000;
        }

        .process-step p {
          font-size: 14px;
          color: #666;
          line-height: 1.5;
        }

        @media (max-width: 1024px) {
          .sidebar {
            transform: translateX(-100%);
          }
          
          .main {
            margin-left: 0;
            padding: 20px;
          }
          
          .grid {
            grid-template-columns: 1fr;
          }
          
          .process {
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
          color: #666;
        }
        
        h2 {
          font-size: 20px;
          font-weight: 600;
          color: #000;
          margin-bottom: 20px;
          text-align: center;
        }
        
        .modal-error {
          background: #fee;
          color: #c00;
          padding: 10px;
          margin-bottom: 15px;
          font-size: 13px;
          border-left: 3px solid #c00;
        }
        
        form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        input {
          padding: 10px;
          border: 1px solid #ddd;
          font-size: 14px;
        }
        
        input:focus {
          outline: none;
          border-color: #007acc;
        }
        
        button[type="submit"] {
          background: #000;
          color: white;
          padding: 10px;
          border: none;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        button[type="submit"]:hover:not(:disabled) {
          background: #333;
        }
        
        button[type="submit"]:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .modal-switch {
          text-align: center;
          margin-top: 15px;
          font-size: 13px;
          color: #666;
        }
        
        .modal-switch button {
          background: none;
          border: none;
          color: #007acc;
          cursor: pointer;
          margin-left: 4px;
          text-decoration: underline;
        }
      `}</style>
    </>
  )
}
