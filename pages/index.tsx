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
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [activeCategory, setActiveCategory] = useState<'all' | 'business' | 'games' | 'movies'>('all')
  const [activeGenre, setActiveGenre] = useState<string>('all')
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)
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
          aiScore: aiScore,
          marketScore: data.aiScores?.market || Math.random() * 10,
          innovationScore: data.aiScores?.innovation || Math.random() * 10,
          executionScore: data.aiScores?.execution || Math.random() * 10,
          publicScore: publicScore,
          publicVotes: publicVotes,
          timestamp: data.createdAt ? new Date(data.createdAt.toDate()).toLocaleDateString() : '2024-01-15'
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
      id: '1',
      rank: 1,
      title: 'Neural Trading Assistant',
      type: 'business',
      genre: 'Fintech',
      author: 'Marcus Chen',
      desc: 'AI-powered trading platform that analyzes market sentiment, news, and technical indicators in real-time. Uses deep learning to predict price movements and automatically executes trades based on risk tolerance. Includes social trading features and copy-trading from top performers.',
      aiScore: 9.2,
      marketScore: 9.5,
      innovationScore: 8.8,
      executionScore: 9.3,
      publicScore: 8.7,
      publicVotes: 234,
      timestamp: '2024-01-22'
    },
    {
      id: '2',
      rank: 2,
      title: 'Quantum Chess VR',
      type: 'games',
      genre: 'VR/AR',
      author: 'Sarah Kim',
      desc: 'Revolutionary VR chess where pieces exist in quantum superposition until observed. Players can make probabilistic moves, creating multiple potential board states. Features tournament mode, AI training partners, and physics-based piece interactions in stunning 3D environments.',
      aiScore: 8.9,
      marketScore: 8.2,
      innovationScore: 9.7,
      executionScore: 8.8,
      publicScore: 9.1,
      publicVotes: 189,
      timestamp: '2024-01-21'
    },
    {
      id: '3',
      rank: 3,
      title: 'The Memory Thief',
      type: 'movies',
      genre: 'Sci-Fi',
      author: 'David Rodriguez',
      desc: 'In 2087, memories are currency. A black market memory dealer discovers they can steal and implant experiences, but when they accidentally absorb the memories of a murder victim, they become the target. A neo-noir thriller exploring identity and consciousness.',
      aiScore: 8.7,
      marketScore: 8.9,
      innovationScore: 8.3,
      executionScore: 8.9,
      publicScore: 8.4,
      publicVotes: 156,
      timestamp: '2024-01-20'
    },
    {
      id: '4',
      rank: 4,
      title: 'EcoChain Marketplace',
      type: 'business',
      genre: 'CleanTech',
      author: 'Anna Foster',
      desc: 'Blockchain-based carbon credit trading platform for individuals and small businesses. Users earn tokens for verified eco-friendly actions, trade credits, and offset their carbon footprint. Includes IoT sensors for automatic verification and gamification elements.',
      aiScore: 8.6,
      marketScore: 9.1,
      innovationScore: 8.4,
      executionScore: 8.3,
      publicScore: 7.9,
      publicVotes: 203,
      timestamp: '2024-01-19'
    },
    {
      id: '5',
      rank: 5,
      title: 'Mind Palace Builder',
      type: 'games',
      genre: 'Mobile Games',
      author: 'James Park',
      desc: 'Memory training game based on the ancient "method of loci" technique. Players build virtual palaces and place information in rooms to enhance memory. Features multiplayer memory competitions, daily challenges, and integration with educational content.',
      aiScore: 8.4,
      marketScore: 7.8,
      innovationScore: 8.7,
      executionScore: 8.7,
      publicScore: 8.2,
      publicVotes: 167,
      timestamp: '2024-01-18'
    },
    {
      id: '6',
      rank: 6,
      title: 'Fractured Reality',
      type: 'movies',
      genre: 'Thriller',
      author: 'Elena Vasquez',
      desc: 'A quantum physicist discovers parallel universes are bleeding into ours after a failed experiment. As reality fractures, she must navigate multiple versions of herself to prevent the collapse of all dimensions. High-concept sci-fi with practical effects.',
      aiScore: 8.3,
      marketScore: 8.1,
      innovationScore: 8.9,
      executionScore: 7.9,
      publicScore: 8.6,
      publicVotes: 142,
      timestamp: '2024-01-17'
    },
    {
      id: '7',
      rank: 7,
      title: 'AgriAI Optimizer',
      type: 'business',
      genre: 'AI/ML',
      author: 'Robert Singh',
      desc: 'AI-powered farm management system using satellite imagery, weather data, and IoT sensors to optimize crop yields. Predicts pest outbreaks, recommends fertilizer schedules, and provides real-time market pricing for harvest timing decisions.',
      aiScore: 8.2,
      marketScore: 8.7,
      innovationScore: 7.9,
      executionScore: 8.0,
      publicScore: 7.5,
      publicVotes: 198,
      timestamp: '2024-01-16'
    },
    {
      id: '8',
      rank: 8,
      title: 'Temporal Heist',
      type: 'games',
      genre: 'Strategy',
      author: 'Maya Thompson',
      desc: 'Turn-based strategy game where players plan elaborate heists across multiple time periods. Actions in the past affect the present, creating complex cause-and-effect scenarios. Features single-player campaigns and competitive multiplayer modes.',
      aiScore: 8.1,
      marketScore: 7.6,
      innovationScore: 8.8,
      executionScore: 7.9,
      publicScore: 8.3,
      publicVotes: 134,
      timestamp: '2024-01-15'
    }
  ]

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  const filteredIdeas = ideas.filter(idea => {
    if (activeCategory === 'all') return true
    if (activeCategory !== idea.type) return false
    if (activeGenre === 'all') return true
    return idea.genre === activeGenre
  })

  const getScoreColor = (score: number) => {
    if (score >= 8.5) return '#10B981' // Green
    if (score >= 7.0) return '#F59E0B' // Orange
    if (score >= 5.5) return '#EF4444' // Red
    return '#6B7280' // Gray
  }

  const handleVote = (ideaId: string) => {
    if (!user) {
      // Show login modal or redirect
      alert('Please login to vote')
      return
    }
    // Implement voting logic
    console.log('Voting for idea:', ideaId)
  }

  return (
    <>
      <Head>
        <title>Hyoka - AI Idea Evaluation Platform</title>
        <meta name="description" content="Professional AI-powered idea evaluation platform. Get your ideas ranked, analyzed, and validated by advanced AI algorithms." />
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

      <div className="app-layout">
        {/* Left Sidebar */}
        <aside className="sidebar">
          <div className="logo-section">
            <h1 className="logo">Hyoka</h1>
            <p className="tagline">AI Idea Evaluation</p>
          </div>

          <nav className="sidebar-nav">
            <button
              className={`nav-item ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => {
                setActiveCategory('all')
                setActiveGenre('all')
              }}
            >
              <span className="nav-icon">📊</span>
              <span className="nav-text">All Ideas</span>
              <span className="nav-count">{ideas.length}</span>
            </button>

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
                  <span className="nav-icon">
                    {category === 'business' ? '💼' : 
                     category === 'games' ? '🎮' : '🎬'}
                  </span>
                  <span className="nav-text">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </span>
                  <span className="nav-count">
                    {ideas.filter(i => i.type === category).length}
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
          </nav>

          <div className="sidebar-footer">
            <div className="stats-section">
              <h3 className="stats-title">Platform Stats</h3>
              <div className="stat-item">
                <span className="stat-label">Total Ideas</span>
                <span className="stat-value">12,847</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">AI Evaluations</span>
                <span className="stat-value">15,923</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Active Users</span>
                <span className="stat-value">3,456</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {/* Hero Section */}
          <section className="hero-section">
            <div className="hero-content">
              <h1 className="hero-title">
                Professional AI Idea Evaluation
              </h1>
              <p className="hero-subtitle">
                Advanced algorithms analyze market potential, innovation level, and execution feasibility. 
                Get comprehensive insights that VCs and investors trust.
              </p>
              <div className="hero-actions">
                <button className="primary-button">
                  Submit Your Idea
                </button>
                <button className="secondary-button">
                  View Analytics
                </button>
              </div>
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
              {filteredIdeas.map((idea, index) => (
                <div key={idea.id} className="idea-card">
                  <div className="card-rank-bar" style={{ backgroundColor: getScoreColor(idea.aiScore) }}>
                    <span className="rank-number">#{idea.rank}</span>
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
                    
                    <p className="card-description">
                      {idea.desc}
                    </p>
                    
                    <div className="card-scores">
                      <div className="score-group">
                        <div className="score-item">
                          <span className="score-label">Market</span>
                          <div className="score-bar">
                            <div 
                              className="score-fill" 
                              style={{ 
                                width: `${(idea.marketScore / 10) * 100}%`,
                                backgroundColor: getScoreColor(idea.marketScore)
                              }}
                            />
                            <span className="score-value">{idea.marketScore.toFixed(1)}</span>
                          </div>
                        </div>
                        
                        <div className="score-item">
                          <span className="score-label">Innovation</span>
                          <div className="score-bar">
                            <div 
                              className="score-fill" 
                              style={{ 
                                width: `${(idea.innovationScore / 10) * 100}%`,
                                backgroundColor: getScoreColor(idea.innovationScore)
                              }}
                            />
                            <span className="score-value">{idea.innovationScore.toFixed(1)}</span>
                          </div>
                        </div>
                        
                        <div className="score-item">
                          <span className="score-label">Execution</span>
                          <div className="score-bar">
                            <div 
                              className="score-fill" 
                              style={{ 
                                width: `${(idea.executionScore / 10) * 100}%`,
                                backgroundColor: getScoreColor(idea.executionScore)
                              }}
                            />
                            <span className="score-value">{idea.executionScore.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="overall-score">
                        <span className="overall-label">AI Score</span>
                        <span 
                          className="overall-value"
                          style={{ color: getScoreColor(idea.aiScore) }}
                        >
                          {idea.aiScore.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="card-actions">
                      <div className="public-score">
                        <span className="public-value">{idea.publicScore.toFixed(1)}</span>
                        <span className="public-label">Public ({idea.publicVotes})</span>
                      </div>
                      <button 
                        className="vote-button"
                        onClick={() => handleVote(idea.id)}
                      >
                        Vote
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* How It Works Section */}
          <section className="how-it-works">
            <h2 className="section-title">How Our AI Evaluation Works</h2>
            <div className="process-grid">
              <div className="process-step">
                <div className="step-number">01</div>
                <h3 className="step-title">Idea Submission</h3>
                <p className="step-description">
                  Submit your idea with detailed description. Our system accepts business concepts, 
                  game designs, movie scripts, and innovative solutions across all industries.
                </p>
              </div>
              
              <div className="process-step">
                <div className="step-number">02</div>
                <h3 className="step-title">AI Analysis</h3>
                <p className="step-description">
                  Advanced neural networks analyze market potential, innovation level, and execution 
                  feasibility using proprietary algorithms trained on successful ventures.
                </p>
              </div>
              
              <div className="process-step">
                <div className="step-number">03</div>
                <h3 className="step-title">Community Voting</h3>
                <p className="step-description">
                  Professional community of entrepreneurs, VCs, and industry experts provide 
                  additional validation through peer review and voting systems.
                </p>
              </div>
              
              <div className="process-step">
                <div className="step-number">04</div>
                <h3 className="step-title">Comprehensive Report</h3>
                <p className="step-description">
                  Receive detailed analysis including strengths, weaknesses, market opportunities, 
                  competitive landscape, and actionable recommendations for improvement.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>

      <style jsx>{`
        .app-layout {
          display: flex;
          min-height: 100vh;
        }

        /* Sidebar Styles */
        .sidebar {
          width: 280px;
          background: #ffffff;
          border-right: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
          position: fixed;
          height: 100vh;
          overflow-y: auto;
        }

        .logo-section {
          padding: 24px 20px;
          border-bottom: 1px solid #e5e7eb;
        }

        .logo {
          font-family: 'Vipnagorgialla', serif;
          font-size: 28px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 4px;
        }

        .tagline {
          font-family: 'Sohne', sans-serif;
          font-size: 12px;
          color: #6b7280;
          font-weight: 500;
        }

        .sidebar-nav {
          flex: 1;
          padding: 20px 0;
        }

        .nav-item {
          width: 100%;
          display: flex;
          align-items: center;
          padding: 12px 20px;
          border: none;
          background: none;
          font-family: 'FoundersGrotesk', sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #4b5563;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }

        .nav-item:hover,
        .nav-item.active {
          background: #f3f4f6;
          color: #1f2937;
        }

        .nav-icon {
          margin-right: 12px;
          font-size: 16px;
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
        }

        .nav-item.active .nav-count {
          background: #3b82f6;
          color: white;
        }

        .genre-list {
          margin-left: 20px;
          padding-left: 20px;
          border-left: 2px solid #f3f4f6;
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
        }

        .genre-item:hover,
        .genre-item.active {
          color: #3b82f6;
          background: #eff6ff;
        }

        .sidebar-footer {
          padding: 20px;
          border-top: 1px solid #e5e7eb;
        }

        .stats-section {
          background: #f9fafb;
          padding: 16px;
          border-radius: 8px;
        }

        .stats-title {
          font-family: 'FoundersGrotesk', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .stat-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .stat-label {
          font-family: 'Sohne', sans-serif;
          font-size: 12px;
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
          padding: 0;
        }

        /* Hero Section */
        .hero-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 60px 40px;
          text-align: center;
        }

        .hero-title {
          font-family: 'Vipnagorgialla', serif;
          font-size: 48px;
          font-weight: bold;
          margin-bottom: 16px;
          line-height: 1.2;
        }

        .hero-subtitle {
          font-family: 'Sohne', sans-serif;
          font-size: 18px;
          opacity: 0.9;
          max-width: 600px;
          margin: 0 auto 32px;
          line-height: 1.6;
        }

        .hero-actions {
          display: flex;
          justify-content: center;
          gap: 16px;
        }

        .primary-button {
          background: white;
          color: #667eea;
          padding: 14px 32px;
          border: none;
          border-radius: 8px;
          font-family: 'FoundersGrotesk', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .primary-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }

        .secondary-button {
          background: transparent;
          color: white;
          padding: 14px 32px;
          border: 2px solid white;
          border-radius: 8px;
          font-family: 'FoundersGrotesk', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .secondary-button:hover {
          background: white;
          color: #667eea;
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
          padding: 8px 16px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-family: 'Sohne', sans-serif;
          font-size: 14px;
          background: white;
        }

        /* Ideas Grid */
        .ideas-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 24px;
        }

        .idea-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          transition: all 0.3s;
          position: relative;
        }

        .idea-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.12);
        }

        .card-rank-bar {
          width: 4px;
          height: 100%;
          position: absolute;
          left: 0;
          top: 0;
          display: flex;
          align-items: center;
        }

        .rank-number {
          background: rgba(255,255,255,0.9);
          color: #1f2937;
          padding: 4px 8px;
          border-radius: 0 4px 4px 0;
          font-family: 'FoundersGrotesk', sans-serif;
          font-size: 12px;
          font-weight: 700;
        }

        .card-content {
          padding: 20px;
          margin-left: 4px;
        }

        .card-header {
          margin-bottom: 16px;
        }

        .card-title {
          font-family: 'FoundersGrotesk', sans-serif;
          font-size: 18px;
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
          background: #eff6ff;
          color: #3b82f6;
          padding: 2px 8px;
          border-radius: 4px;
          font-weight: 500;
        }

        .card-description {
          font-family: 'Sohne', sans-serif;
          font-size: 14px;
          color: #4b5563;
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .card-scores {
          margin-bottom: 20px;
        }

        .score-group {
          margin-bottom: 16px;
        }

        .score-item {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
        }

        .score-label {
          font-family: 'FoundersGrotesk', sans-serif;
          font-size: 11px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          width: 80px;
        }

        .score-bar {
          flex: 1;
          height: 20px;
          background: #f3f4f6;
          border-radius: 10px;
          position: relative;
          margin: 0 12px;
          overflow: hidden;
        }

        .score-fill {
          height: 100%;
          border-radius: 10px;
          transition: width 0.3s ease;
        }

        .score-value {
          font-family: 'FoundersGrotesk', sans-serif;
          font-size: 12px;
          font-weight: 700;
          color: #1f2937;
          min-width: 30px;
          text-align: right;
        }

        .overall-score {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: #f9fafb;
          border-radius: 8px;
        }

        .overall-label {
          font-family: 'FoundersGrotesk', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .overall-value {
          font-family: 'FoundersGrotesk', sans-serif;
          font-size: 24px;
          font-weight: 700;
        }

        .card-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .public-score {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .public-value {
          font-family: 'FoundersGrotesk', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #1f2937;
        }

        .public-label {
          font-family: 'Sohne', sans-serif;
          font-size: 11px;
          color: #6b7280;
        }

        .vote-button {
          background: #3b82f6;
          color: white;
          padding: 10px 20px;
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
          transform: translateY(-1px);
        }

        /* How It Works Section */
        .how-it-works {
          padding: 60px 40px;
          background: white;
          margin-top: 40px;
        }

        .process-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 32px;
          margin-top: 40px;
        }

        .process-step {
          text-align: center;
        }

        .step-number {
          font-family: 'FoundersGrotesk', sans-serif;
          font-size: 36px;
          font-weight: 700;
          color: #3b82f6;
          margin-bottom: 16px;
        }

        .step-title {
          font-family: 'FoundersGrotesk', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 12px;
        }

        .step-description {
          font-family: 'Sohne', sans-serif;
          font-size: 14px;
          color: #6b7280;
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
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
            transition: transform 0.3s;
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
          
          .ideas-section {
            padding: 20px;
          }
          
          .ideas-grid {
            grid-template-columns: 1fr;
          }
          
          .process-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          
          .how-it-works {
            padding: 40px 20px;
          }
        }
      `}</style>
    </>
  )
}
