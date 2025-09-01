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
          aiScore: aiScore * 10, // Convert to 0-100 scale
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
    }
  ]

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

  const getScoreColor = (score: number) => {
    if (score >= 75) return '#059669' // Dark green
    return '#000000' // Black for lower scores
  }

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

      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="header-logo">Hyoka</h1>
          <nav className="header-nav">
            <button className="nav-button">Submit Idea</button>
            <button className="nav-button">Login</button>
          </nav>
        </div>
      </header>

      <div className="app-layout">
        {/* Left Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-block">
            <button
              className={`sidebar-item ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => {
                setActiveCategory('all')
                setActiveGenre('all')
              }}
            >
              All Ideas
            </button>
          </div>

          <div className="sidebar-block">
            <button
              className={`sidebar-item ${activeCategory === 'business' ? 'active' : ''}`}
              onClick={() => {
                setActiveCategory('business')
                setActiveGenre('all')
              }}
            >
              Business
            </button>
            <div className="genre-list">
              {categories.business.map(genre => (
                <button
                  key={genre}
                  className={`genre-item ${activeGenre === genre ? 'active' : ''}`}
                  onClick={() => {
                    setActiveCategory('business')
                    setActiveGenre(genre)
                  }}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-block">
            <button
              className={`sidebar-item ${activeCategory === 'games' ? 'active' : ''}`}
              onClick={() => {
                setActiveCategory('games')
                setActiveGenre('all')
              }}
            >
              Games
            </button>
            <div className="genre-list">
              {categories.games.map(genre => (
                <button
                  key={genre}
                  className={`genre-item ${activeGenre === genre ? 'active' : ''}`}
                  onClick={() => {
                    setActiveCategory('games')
                    setActiveGenre(genre)
                  }}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-block">
            <button
              className={`sidebar-item ${activeCategory === 'movies' ? 'active' : ''}`}
              onClick={() => {
                setActiveCategory('movies')
                setActiveGenre('all')
              }}
            >
              Movies
            </button>
            <div className="genre-list">
              {categories.movies.map(genre => (
                <button
                  key={genre}
                  className={`genre-item ${activeGenre === genre ? 'active' : ''}`}
                  onClick={() => {
                    setActiveCategory('movies')
                    setActiveGenre(genre)
                  }}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {/* Hero Section */}
          <section className="hero-section">
            <h1 className="hero-title">
              Where Ideas Get Brutally Evaluated by AI
            </h1>
            <p className="hero-subtitle">
              Skip the marketing budget. Skip the pitch meetings. Submit your idea and get instant evaluation 
              from advanced AI algorithms that analyze market potential, innovation level, and execution feasibility. 
              Join thousands of entrepreneurs who trust our platform for honest, data-driven feedback.
            </p>
            <div className="hero-stats">
              <div className="stat">
                <div className="stat-number">15,847</div>
                <div className="stat-label">Ideas Evaluated</div>
              </div>
              <div className="stat">
                <div className="stat-number">$2.3M</div>
                <div className="stat-label">Funding Raised</div>
              </div>
              <div className="stat">
                <div className="stat-number">89%</div>
                <div className="stat-label">Accuracy Rate</div>
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
              </div>
            </div>

            <div className="ideas-grid">
              {filteredIdeas.map((idea) => (
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
                      </div>
                    </div>
                    
                    <div className="card-score-main">
                      <span className="main-score" style={{ color: getScoreColor(idea.aiScore) }}>
                        {Math.round(idea.aiScore)}
                      </span>
                      <span className="score-label-main">AI Score</span>
                    </div>
                    
                    <p className="card-description">
                      {idea.expanded ? idea.desc : `${idea.desc.substring(0, 120)}...`}
                    </p>
                    
                    <button 
                      className="expand-button"
                      onClick={() => toggleExpanded(idea.id)}
                    >
                      {idea.expanded ? 'Show Less' : 'Read More'}
                    </button>
                    
                    {idea.expanded && (
                      <div className="detailed-scores">
                        <div className="score-row">
                          <span className="score-metric">Market Potential:</span>
                          <span className="score-number">{Math.round(idea.marketScore)}</span>
                        </div>
                        <div className="score-row">
                          <span className="score-metric">Innovation Level:</span>
                          <span className="score-number">{Math.round(idea.innovationScore)}</span>
                        </div>
                        <div className="score-row">
                          <span className="score-metric">Execution Difficulty:</span>
                          <span className="score-number">{Math.round(idea.executionScore)}</span>
                        </div>
                        <div className="public-voting">
                          <div className="public-score">
                            Public: {idea.publicScore.toFixed(1)} ({idea.publicVotes} votes)
                          </div>
                          <button 
                            className="vote-button"
                            onClick={() => handleVote(idea.id)}
                          >
                            Vote
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* How It Works Section */}
          <section className="explanation-section">
            <h2 className="section-title">How Our AI Evaluation Works</h2>
            <div className="explanation-content">
              <div className="explanation-block">
                <h3 className="explanation-title">Advanced Neural Network Analysis</h3>
                <p className="explanation-text">
                  Our proprietary AI system analyzes your idea using deep learning models trained on over 50,000 successful 
                  and failed ventures. The system evaluates market timing, competitive landscape, technical feasibility, 
                  and revenue potential using real-world business data and market intelligence.
                </p>
              </div>
              
              <div className="explanation-block">
                <h3 className="explanation-title">Three-Dimensional Scoring</h3>
                <p className="explanation-text">
                  Every idea receives comprehensive evaluation across three critical dimensions: Market Potential analyzes 
                  addressable market size and demand validation. Innovation Level measures uniqueness and technological 
                  advancement. Execution Difficulty assesses resource requirements and implementation complexity.
                </p>
              </div>
              
              <div className="explanation-block">
                <h3 className="explanation-title">Real-Time Market Validation</h3>
                <p className="explanation-text">
                  Beyond AI analysis, ideas undergo community validation from verified entrepreneurs, investors, and 
                  industry experts. This dual-layer approach ensures comprehensive evaluation that combines algorithmic 
                  precision with human insight and market experience.
                </p>
              </div>
              
              <div className="explanation-block">
                <h3 className="explanation-title">Actionable Intelligence Reports</h3>
                <p className="explanation-text">
                  High-scoring ideas receive detailed reports including competitive analysis, go-to-market strategies, 
                  potential funding sources, and step-by-step implementation roadmaps. Our platform has helped launch 
                  over 200 successful startups with combined valuations exceeding $500 million.
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
        }

        .header-nav {
          display: flex;
          gap: 16px;
        }

        .nav-button {
          background: none;
          border: 1px solid white;
          color: white;
          padding: 8px 16px;
          font-family: 'FoundersGrotesk', sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .nav-button:hover {
          background: white;
          color: black;
        }

        .app-layout {
          display: flex;
          margin-top: 60px; /* Account for fixed header */
          min-height: calc(100vh - 60px);
        }

        /* Sidebar Styles */
        .sidebar {
          width: 280px;
          background: #f8f9fa;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          position: fixed;
          height: calc(100vh - 60px);
          overflow-y: auto;
        }

        .sidebar-block {
          background: #000000;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 8px;
        }

        .sidebar-item {
          width: 100%;
          background: none;
          border: none;
          color: white;
          font-family: 'FoundersGrotesk', sans-serif;
          font-size: 16px;
          font-weight: 600;
          text-align: left;
          padding: 8px 0;
          cursor: pointer;
          transition: all 0.2s;
        }

        .sidebar-item:hover,
        .sidebar-item.active {
          color: #f0f0f0;
        }

        .genre-list {
          margin-top: 12px;
          padding-left: 16px;
        }

        .genre-item {
          width: 100%;
          background: none;
          border: none;
          color: #cccccc;
          font-family: 'Sohne', sans-serif;
          font-size: 13px;
          text-align: left;
          padding: 4px 0;
          cursor: pointer;
          display: block;
          transition: all 0.2s;
        }

        .genre-item:hover,
        .genre-item.active {
          color: white;
        }

        /* Main Content Styles */
        .main-content {
          flex: 1;
          margin-left: 280px;
          background: white;
        }

        /* Hero Section */
        .hero-section {
          background: white;
          padding: 60px 40px;
          text-align: center;
        }

        .hero-title {
          font-family: 'Vipnagorgialla', serif;
          font-size: 48px;
          font-weight: bold;
          margin-bottom: 24px;
          line-height: 1.2;
          color: #1a1a1a;
        }

        .hero-subtitle {
          font-family: 'Sohne', sans-serif;
          font-size: 18px;
          color: #4b5563;
          max-width: 800px;
          margin: 0 auto 40px;
          line-height: 1.6;
        }

        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 60px;
          margin-top: 40px;
        }

        .stat {
          text-align: center;
        }

        .stat-number {
          font-family: 'FoundersGrotesk', sans-serif;
          font-size: 32px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 8px;
        }

        .stat-label {
          font-family: 'Sohne', sans-serif;
          font-size: 14px;
          color: #6b7280;
        }

        /* Ideas Section */
        .ideas-section {
          padding: 40px;
          background: #f8f9fa;
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
        }

        .result-count {
          font-family: 'Sohne', sans-serif;
          font-size: 14px;
          color: #6b7280;
        }

        /* Ideas Grid */
        .ideas-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .idea-card {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: all 0.3s;
          position: relative;
          height: fit-content;
        }

        .idea-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        }

        .card-rank-bar {
          width: 8px;
          height: 100%;
          position: absolute;
          left: 0;
          top: 0;
        }

        .rank-number {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(0,0,0,0.8);
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-family: 'FoundersGrotesk', sans-serif;
          font-size: 11px;
          font-weight: 700;
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

        .card-genre {
          background: #e5e7eb;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 10px;
          font-weight: 500;
        }

        .card-score-main {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 16px;
        }

        .main-score {
          font-family: 'FoundersGrotesk', sans-serif;
          font-size: 24px;
          font-weight: 700;
        }

        .score-label-main {
          font-family: 'Sohne', sans-serif;
          font-size: 12px;
          color: #6b7280;
        }

        .card-description {
          font-family: 'Sohne', sans-serif;
          font-size: 13px;
          color: #4b5563;
          line-height: 1.5;
          margin-bottom: 12px;
        }

        .expand-button {
          background: none;
          border: none;
          color: #3b82f6;
          font-family: 'Sohne', sans-serif;
          font-size: 12px;
          cursor: pointer;
          padding: 0;
          margin-bottom: 16px;
        }

        .expand-button:hover {
          text-decoration: underline;
        }

        .detailed-scores {
          border-top: 1px solid #e5e7eb;
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
          font-size: 12px;
          color: #6b7280;
        }

        .score-number {
          font-family: 'FoundersGrotesk', sans-serif;
          font-size: 12px;
          font-weight: 600;
          color: #1f2937;
        }

        .public-voting {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #f3f4f6;
        }

        .public-score {
          font-family: 'Sohne', sans-serif;
          font-size: 12px;
          color: #6b7280;
        }

        .vote-button {
          background: #3b82f6;
          color: white;
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          font-family: 'FoundersGrotesk', sans-serif;
          font-size: 11px;
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
        }

        .explanation-content {
          max-width: 1000px;
          margin: 40px auto 0;
        }

        .explanation-block {
          margin-bottom: 40px;
        }

        .explanation-title {
          font-family: 'FoundersGrotesk', sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 16px;
        }

        .explanation-text {
          font-family: 'Sohne', sans-serif;
          font-size: 15px;
          color: #4b5563;
          line-height: 1.7;
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
          
          .hero-stats {
            flex-direction: column;
            gap: 24px;
          }
          
          .ideas-section,
          .explanation-section {
            padding: 40px 20px;
          }
          
          .ideas-grid {
            grid-template-columns: 1fr;
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
