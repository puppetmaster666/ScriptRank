import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { db, auth } from '@/lib/firebase'
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore'
import { onAuthStateChanged, User } from 'firebase/auth'

interface Idea {
  id: string
  rank: number
  title: string
  type: string
  genre?: string
  content: string
  username: string
  aiScores: {
    overall: number
    market: number
    innovation: number
    execution: number
  }
  publicScore: {
    average: number
    count: number
  }
  status?: string
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [activeCategory, setActiveCategory] = useState<'all' | 'movies' | 'business' | 'games'>('all')
  const [allIdeas, setAllIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser)
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
      const ideas = snapshot.docs.map((doc, index) => ({
        id: doc.id,
        rank: index + 1,
        ...doc.data()
      })) as Idea[]
      setAllIdeas(ideas.length > 0 ? ideas : getMockIdeas())
    } catch (error) {
      console.error('Error fetching ideas:', error)
      setAllIdeas(getMockIdeas())
    } finally {
      setLoading(false)
    }
  }

  const getMockIdeas = (): Idea[] => [
    {
      id: '1',
      rank: 1,
      title: 'The echoes of tomorrow',
      type: 'movie',
      genre: 'Thriller',
      content: 'A doctor goes missing in the forest and comes back looking like a homeless fugitive.',
      username: 'Marco Rubio',
      aiScores: { overall: 89, market: 87, innovation: 92, execution: 88 },
      publicScore: { average: 85, count: 847 }
    },
    {
      id: '2',
      rank: 2,
      title: 'Quantum Chess Arena',
      type: 'game',
      genre: 'Strategy',
      content: 'Multiplayer chess variant where pieces exist in quantum superposition until observed.',
      username: 'Rachel Wei',
      aiScores: { overall: 85, market: 83, innovation: 88, execution: 84 },
      publicScore: { average: 82, count: 623 }
    },
    {
      id: '3',
      rank: 3,
      title: 'EcoChain Logistics',
      type: 'business',
      genre: 'SaaS',
      content: 'Blockchain-powered supply chain platform that tracks carbon footprint in real-time.',
      username: 'David Kumar',
      aiScores: { overall: 82, market: 85, innovation: 79, execution: 81 },
      publicScore: { average: 80, count: 512 }
    },
    {
      id: '4',
      rank: 4,
      title: 'Memory Thief',
      type: 'movie',
      genre: 'Sci-Fi',
      content: 'A noir mystery set in a future where memories can be extracted and sold.',
      username: 'James Wilson',
      aiScores: { overall: 78, market: 76, innovation: 81, execution: 77 },
      publicScore: { average: 75, count: 389 }
    },
    {
      id: '5',
      rank: 5,
      title: 'Neural Nexus VR',
      type: 'game',
      genre: 'VR',
      content: 'VR strategy game where players control armies through thought patterns using EEG sensors.',
      username: 'Alex Thompson',
      aiScores: { overall: 75, market: 73, innovation: 78, execution: 74 },
      publicScore: { average: 72, count: 267 }
    },
    {
      id: '6',
      rank: 6,
      title: 'LocalFarm Network',
      type: 'business',
      genre: 'Marketplace',
      content: 'Subscription marketplace connecting urban consumers directly with local farms.',
      username: 'Amanda Torres',
      aiScores: { overall: 72, market: 74, innovation: 69, execution: 73 },
      publicScore: { average: 70, count: 198 }
    },
    {
      id: '7',
      rank: 7,
      title: 'Parallel Lives',
      type: 'movie',
      genre: 'Drama',
      content: 'Five strangers discover they are living the same life in parallel dimensions.',
      username: 'Emma Rodriguez',
      aiScores: { overall: 68, market: 66, innovation: 71, execution: 67 },
      publicScore: { average: 65, count: 156 }
    },
    {
      id: '8',
      rank: 8,
      title: 'Echo Worlds',
      type: 'game',
      genre: 'RPG',
      content: 'Open-world RPG where player actions in the past dynamically reshape the present.',
      username: 'Studio Nexus',
      aiScores: { overall: 65, market: 63, innovation: 68, execution: 64 },
      publicScore: { average: 62, count: 134 }
    },
    {
      id: '9',
      rank: 9,
      title: 'MediMatch AI',
      type: 'business',
      genre: 'HealthTech',
      content: 'AI platform that matches patients with clinical trials based on genetic markers.',
      username: 'Dr. Lisa Chen',
      aiScores: { overall: 62, market: 64, innovation: 59, execution: 63 },
      publicScore: { average: 60, count: 112 }
    }
  ]

  const getScoreColor = (score: number): string => {
    if (score >= 70) {
      const greenIntensity = Math.min((score - 70) / 30, 1)
      return `linear-gradient(135deg, rgba(105, 247, 77, ${0.6 + greenIntensity * 0.4}), #69f74d)`
    } else if (score >= 40) {
      return `linear-gradient(135deg, #f7d060, #f59e0b)`
    } else {
      return `linear-gradient(135deg, #ff6b6b, #dc2626)`
    }
  }

  const toggleCard = (id: string) => {
    const newExpanded = new Set(expandedCards)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedCards(newExpanded)
  }

  const filteredIdeas = activeCategory === 'all' 
    ? allIdeas 
    : allIdeas.filter(idea => idea.type === activeCategory.slice(0, -1))

  return (
    <>
      <Head>
        <title>ScriptRank - Professional AI Idea Evaluation Platform</title>
        <meta name="description" content="Submit your movie script, game concept, or business idea. Get instant AI analysis and compete for prizes." />
      </Head>

      <style jsx global>{`
        @font-face {
          font-family: 'TT0205M';
          src: url('/fonts/tt0205m_.ttf') format('truetype');
          font-weight: normal;
          font-display: swap;
        }

        @font-face {
          font-family: 'TestSohneBreit';
          src: url('/fonts/TestSohneBreit-Buch.otf') format('opentype');
          font-weight: normal;
          font-display: swap;
        }

        body {
          margin: 0;
          padding: 0;
          background: #f5f5f0;
          font-family: 'TestSohneBreit', -apple-system, sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>

      <div className="page-wrapper">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-section">
            <h3>Quick Stats</h3>
            <div className="stat-item">
              <span className="stat-value">2,847</span>
              <span className="stat-label">Ideas</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">$5M</span>
              <span className="stat-label">Prizes</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">94%</span>
              <span className="stat-label">Success</span>
            </div>
          </div>

          <div className="sidebar-section">
            <h3>Categories</h3>
            <button 
              className={`category-btn ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              All Ideas
            </button>
            <button 
              className={`category-btn ${activeCategory === 'movies' ? 'active' : ''}`}
              onClick={() => setActiveCategory('movies')}
            >
              Movies
            </button>
            <button 
              className={`category-btn ${activeCategory === 'business' ? 'active' : ''}`}
              onClick={() => setActiveCategory('business')}
            >
              Business
            </button>
            <button 
              className={`category-btn ${activeCategory === 'games' ? 'active' : ''}`}
              onClick={() => setActiveCategory('games')}
            >
              Games
            </button>
          </div>

          <div className="sidebar-section">
            <h3>Actions</h3>
            <Link href="/submit">
              <a className="action-btn primary">Submit Idea</a>
            </Link>
            {user ? (
              <Link href="/dashboard">
                <a className="action-btn">Dashboard</a>
              </Link>
            ) : (
              <Link href="/login">
                <a className="action-btn">Sign In</a>
              </Link>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <div className="content-header">
            <h1>Leaderboard</h1>
            <p>Top rated ideas competing for investment</p>
          </div>

          {loading ? (
            <div className="loading">Loading ideas...</div>
          ) : (
            <div className="ideas-grid">
              {filteredIdeas.map((idea) => (
                <div key={idea.id} className="idea-wrapper">
                  <div className="idea-header">
                    <span className="idea-rank">#{idea.rank}</span>
                    <span className="idea-title">{idea.title}</span>
                  </div>
                  <div 
                    className={`idea-card ${expandedCards.has(idea.id) ? 'expanded' : ''}`}
                    onClick={() => toggleCard(idea.id)}
                  >
                    <div className="genre-badge">{idea.genre || idea.type}</div>
                    
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{
                          width: `${idea.aiScores.overall}%`,
                          background: getScoreColor(idea.aiScores.overall)
                        }}
                      />
                    </div>
                    
                    <div className="score-display">
                      <span className="score-value">{idea.aiScores.overall}%</span>
                    </div>

                    <div className="card-content">
                      <div className="author">{idea.username}</div>
                      <p className="description">
                        {idea.content}
                        {expandedCards.has(idea.id) && (
                          <>
                            <br /><br />
                            <strong>Market Score:</strong> {idea.aiScores.market}%<br />
                            <strong>Innovation:</strong> {idea.aiScores.innovation}%<br />
                            <strong>Execution:</strong> {idea.aiScores.execution}%<br />
                            <strong>Public Score:</strong> {idea.publicScore.average}% ({idea.publicScore.count} votes)
                          </>
                        )}
                      </p>
                      <button className="read-more">
                        {expandedCards.has(idea.id) ? 'read less' : 'read more'}
                      </button>
                    </div>

                    <Link href={`/ideas/${idea.id}`}>
                      <a className="vote-btn" onClick={(e) => e.stopPropagation()}>
                        Vote
                      </a>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <style jsx>{`
        .page-wrapper {
          display: flex;
          min-height: 100vh;
          padding-top: 80px;
        }

        /* Sidebar */
        .sidebar {
          width: 250px;
          background: #000;
          color: white;
          padding: 2rem 1.5rem;
          position: fixed;
          left: 0;
          top: 80px;
          bottom: 0;
          overflow-y: auto;
        }

        .sidebar-section {
          margin-bottom: 3rem;
        }

        .sidebar-section h3 {
          font-family: 'TT0205M', sans-serif;
          font-size: 1rem;
          margin-bottom: 1.5rem;
          opacity: 0.8;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .stat-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
        }

        .stat-value {
          font-family: 'TT0205M', sans-serif;
          font-size: 1.25rem;
          font-weight: bold;
        }

        .stat-label {
          font-size: 0.9rem;
          opacity: 0.7;
        }

        .category-btn {
          display: block;
          width: 100%;
          padding: 0.75rem;
          margin-bottom: 0.5rem;
          background: transparent;
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          font-family: 'TestSohneBreit', sans-serif;
          cursor: pointer;
          transition: all 0.3s;
        }

        .category-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .category-btn.active {
          background: #4331f4;
          border-color: #4331f4;
        }

        .action-btn {
          display: block;
          width: 100%;
          padding: 0.75rem;
          margin-bottom: 0.5rem;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          text-align: center;
          text-decoration: none;
          font-family: 'TestSohneBreit', sans-serif;
          transition: all 0.3s;
        }

        .action-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .action-btn.primary {
          background: #69f74d;
          color: black;
          border-color: #69f74d;
        }

        .action-btn.primary:hover {
          background: #5ee63f;
        }

        /* Main Content */
        .main-content {
          flex: 1;
          margin-left: 250px;
          padding: 2rem 3rem;
        }

        .content-header {
          margin-bottom: 3rem;
        }

        .content-header h1 {
          font-family: 'TT0205M', sans-serif;
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          color: #1a1a1a;
        }

        .content-header p {
          font-family: 'TestSohneBreit', sans-serif;
          color: #666;
          font-size: 1.1rem;
        }

        .loading {
          text-align: center;
          font-size: 1.25rem;
          color: #666;
          padding: 4rem;
        }

        /* Ideas Grid */
        .ideas-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        .idea-wrapper {
          display: flex;
          flex-direction: column;
        }

        .idea-header {
          display: flex;
          align-items: baseline;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
          padding-left: 0.5rem;
        }

        .idea-rank {
          font-family: 'TT0205M', sans-serif;
          font-size: 1.5rem;
          font-weight: bold;
          color: #1a1a1a;
        }

        .idea-title {
          font-family: 'TT0205M', sans-serif;
          font-size: 1.1rem;
          color: #1a1a1a;
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .idea-card {
          background: white;
          border-radius: 34px;
          padding: 1.75rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          position: relative;
          cursor: pointer;
          transition: all 0.3s;
        }

        .idea-card:hover {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          transform: translateY(-2px);
        }

        .idea-card.expanded {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }

        .genre-badge {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          background: #000;
          color: white;
          padding: 0.4rem 1rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-family: 'TT0205M', sans-serif;
          text-transform: uppercase;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: #f0f0f0;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 1rem;
        }

        .progress-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .score-display {
          text-align: left;
          margin-bottom: 1rem;
        }

        .score-value {
          font-family: 'TT0205M', sans-serif;
          font-size: 2rem;
          font-weight: bold;
          color: #1a1a1a;
        }

        .card-content {
          margin-bottom: 1.5rem;
        }

        .author {
          font-family: 'TestSohneBreit', sans-serif;
          color: #4331f4;
          font-size: 0.9rem;
          margin-bottom: 0.75rem;
        }

        .description {
          font-family: 'TestSohneBreit', sans-serif;
          color: #666;
          line-height: 1.6;
          font-size: 0.95rem;
          margin-bottom: 1rem;
        }

        .read-more {
          background: none;
          border: none;
          color: #999;
          font-size: 0.85rem;
          cursor: pointer;
          text-decoration: underline;
          font-family: 'TestSohneBreit', sans-serif;
        }

        .vote-btn {
          position: absolute;
          bottom: 1.75rem;
          right: 1.75rem;
          background: #4331f4;
          color: white;
          padding: 0.6rem 2rem;
          border-radius: 24px;
          text-decoration: none;
          font-family: 'TestSohneBreit', sans-serif;
          font-size: 0.9rem;
          transition: all 0.3s;
        }

        .vote-btn:hover {
          background: #5a47f5;
          transform: scale(1.05);
        }

        @media (max-width: 1400px) {
          .ideas-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 1024px) {
          .sidebar {
            width: 200px;
          }
          
          .main-content {
            margin-left: 200px;
          }
          
          .ideas-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .sidebar {
            display: none;
          }
          
          .main-content {
            margin-left: 0;
            padding: 1rem;
          }
        }
      `}</style>
    </>
  )
}
