import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore'

interface Idea {
  id: string
  rank: number
  title: string
  type: string
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
  const [activeCategory, setActiveCategory] = useState<'movies' | 'business' | 'games'>('movies')
  const [movieIdeas, setMovieIdeas] = useState<Idea[]>([])
  const [businessIdeas, setBusinessIdeas] = useState<Idea[]>([])
  const [gameIdeas, setGameIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchIdeas()
  }, [])

  const fetchIdeas = async () => {
    try {
      // Fetch movies
      const moviesQuery = query(
        collection(db, 'ideas'),
        where('type', '==', 'movie'),
        orderBy('aiScores.overall', 'desc'),
        limit(5)
      )
      const moviesSnapshot = await getDocs(moviesQuery)
      const movies = moviesSnapshot.docs.map((doc, index) => ({
        id: doc.id,
        rank: index + 1,
        ...doc.data()
      })) as Idea[]
      setMovieIdeas(movies)

      // Fetch business ideas
      const businessQuery = query(
        collection(db, 'ideas'),
        where('type', '==', 'business'),
        orderBy('aiScores.overall', 'desc'),
        limit(5)
      )
      const businessSnapshot = await getDocs(businessQuery)
      const business = businessSnapshot.docs.map((doc, index) => ({
        id: doc.id,
        rank: index + 1,
        ...doc.data()
      })) as Idea[]
      setBusinessIdeas(business)

      // Fetch games
      const gamesQuery = query(
        collection(db, 'ideas'),
        where('type', '==', 'game'),
        orderBy('aiScores.overall', 'desc'),
        limit(5)
      )
      const gamesSnapshot = await getDocs(gamesQuery)
      const games = gamesSnapshot.docs.map((doc, index) => ({
        id: doc.id,
        rank: index + 1,
        ...doc.data()
      })) as Idea[]
      setGameIdeas(games)

    } catch (error) {
      console.error('Error fetching ideas:', error)
      // Use mock data if fetch fails
      setMovieIdeas(getMockMovies())
      setBusinessIdeas(getMockBusiness())
      setGameIdeas(getMockGames())
    } finally {
      setLoading(false)
    }
  }

  const getMockMovies = (): Idea[] => [
    {
      id: '1',
      rank: 1,
      title: 'Echoes of Tomorrow',
      type: 'movie',
      content: 'A time-loop thriller where a quantum physicist must prevent a catastrophic event by living the same day repeatedly, each iteration revealing deeper layers of conspiracy.',
      username: 'Sarah Mitchell',
      aiScores: { overall: 9.2, market: 8.7, innovation: 9.5, execution: 9.1 },
      publicScore: { average: 8.9, count: 847 },
      status: 'INVEST'
    },
    {
      id: '2',
      rank: 2,
      title: 'The Last Archive',
      type: 'movie',
      content: 'In a world where all digital data has been erased, a librarian discovers the last physical archive containing humanity\'s deleted history.',
      username: 'Michael Chen',
      aiScores: { overall: 8.9, market: 9.1, innovation: 8.4, execution: 8.8 },
      publicScore: { average: 8.5, count: 623 },
      status: 'INVEST'
    },
    {
      id: '3',
      rank: 3,
      title: 'Parallel Lives',
      type: 'movie',
      content: 'A psychological drama following five strangers who discover they\'re living the same life in parallel dimensions.',
      username: 'Emma Rodriguez',
      aiScores: { overall: 8.6, market: 8.2, innovation: 9.0, execution: 8.5 },
      publicScore: { average: 8.3, count: 512 },
      status: 'INVEST'
    },
    {
      id: '4',
      rank: 4,
      title: 'The Memory Thief',
      type: 'movie',
      content: 'A noir mystery set in a future where memories can be extracted and sold, following a detective who must solve crimes by stealing memories.',
      username: 'James Wilson',
      aiScores: { overall: 8.3, market: 8.5, innovation: 7.9, execution: 8.4 },
      publicScore: { average: 8.1, count: 389 },
      status: 'MAYBE'
    },
    {
      id: '5',
      rank: 5,
      title: 'Fractured Light',
      type: 'movie',
      content: 'A visually stunning epic about a civilization that exists within light beams, threatened when Earth\'s sun begins to die.',
      username: 'Olivia Park',
      aiScores: { overall: 7.9, market: 7.3, innovation: 8.8, execution: 7.6 },
      publicScore: { average: 7.5, count: 267 },
      status: 'MAYBE'
    }
  ]

  const getMockBusiness = (): Idea[] => [
    {
      id: '6',
      rank: 1,
      title: 'EcoChain Logistics',
      type: 'business',
      content: 'Blockchain-powered supply chain platform that tracks carbon footprint in real-time, allowing companies to optimize routes and achieve net-zero shipping.',
      username: 'David Kumar',
      aiScores: { overall: 9.4, market: 9.6, innovation: 8.9, execution: 9.5 },
      publicScore: { average: 9.1, count: 923 },
      status: 'INVEST'
    },
    {
      id: '7',
      rank: 2,
      title: 'MediMatch AI',
      type: 'business',
      content: 'AI platform that matches patients with clinical trials based on genetic markers, medical history, and lifestyle factors.',
      username: 'Dr. Lisa Chen',
      aiScores: { overall: 9.1, market: 9.3, innovation: 8.7, execution: 9.2 },
      publicScore: { average: 8.8, count: 756 },
      status: 'INVEST'
    },
    {
      id: '8',
      rank: 3,
      title: 'SkillBridge Pro',
      type: 'business',
      content: 'B2B platform connecting retiring professionals with companies for knowledge transfer programs.',
      username: 'Marcus Johnson',
      aiScores: { overall: 8.7, market: 9.0, innovation: 8.1, execution: 8.9 },
      publicScore: { average: 8.4, count: 543 },
      status: 'INVEST'
    },
    {
      id: '9',
      rank: 4,
      title: 'LocalFarm Network',
      type: 'business',
      content: 'Subscription marketplace connecting urban consumers directly with local farms, offering customizable produce boxes.',
      username: 'Amanda Torres',
      aiScores: { overall: 8.2, market: 8.5, innovation: 7.6, execution: 8.4 },
      publicScore: { average: 8.0, count: 412 },
      status: 'MAYBE'
    },
    {
      id: '10',
      rank: 5,
      title: 'RentReady AI',
      type: 'business',
      content: 'Automated property management platform using computer vision to conduct virtual inspections and predict maintenance needs.',
      username: 'Kevin Park',
      aiScores: { overall: 7.8, market: 8.2, innovation: 7.1, execution: 7.9 },
      publicScore: { average: 7.5, count: 298 },
      status: 'MAYBE'
    }
  ]

  const getMockGames = (): Idea[] => [
    {
      id: '11',
      rank: 1,
      title: 'Neural Nexus VR',
      type: 'game',
      content: 'VR strategy game where players control armies through thought patterns, using real EEG sensors to translate brain activity into tactical commands.',
      username: 'Alex Thompson',
      aiScores: { overall: 9.3, market: 8.8, innovation: 9.7, execution: 9.2 },
      publicScore: { average: 9.0, count: 1087 },
      status: 'INVEST'
    },
    {
      id: '12',
      rank: 2,
      title: 'Quantum Chess Arena',
      type: 'game',
      content: 'Multiplayer chess variant where pieces exist in quantum superposition until observed, adding probability mechanics to classic strategy.',
      username: 'Dr. Rachel Wei',
      aiScores: { overall: 8.8, market: 8.3, innovation: 9.4, execution: 8.5 },
      publicScore: { average: 8.6, count: 892 },
      status: 'INVEST'
    },
    {
      id: '13',
      rank: 3,
      title: 'Echo Worlds',
      type: 'game',
      content: 'Open-world RPG where player actions in the past dynamically reshape the present, featuring a dual-timeline system.',
      username: 'Studio Nexus Team',
      aiScores: { overall: 8.5, market: 8.7, innovation: 8.2, execution: 8.4 },
      publicScore: { average: 8.3, count: 678 },
      status: 'INVEST'
    },
    {
      id: '14',
      rank: 4,
      title: 'Mindscape Detective',
      type: 'game',
      content: 'Mystery adventure game where players solve crimes by entering suspects\' memories and navigating psychological landscapes.',
      username: 'Jordan Blake',
      aiScores: { overall: 8.1, market: 8.4, innovation: 7.8, execution: 8.2 },
      publicScore: { average: 7.9, count: 521 },
      status: 'MAYBE'
    },
    {
      id: '15',
      rank: 5,
      title: 'Constellation Builders',
      type: 'game',
      content: 'Collaborative space simulation where players work together to build stellar megastructures across light-years.',
      username: 'Maria Santos',
      aiScores: { overall: 7.6, market: 7.9, innovation: 7.2, execution: 7.7 },
      publicScore: { average: 7.4, count: 334 },
      status: 'PASS'
    }
  ]

  const getStatusBadgeClass = (status?: string) => {
    switch (status) {
      case 'INVEST': return 'status-invest'
      case 'MAYBE': return 'status-maybe'
      default: return 'status-pass'
    }
  }

  const getRankBadgeClass = (rank: number) => {
    switch (rank) {
      case 1: return 'rank-1'
      case 2: return 'rank-2'
      case 3: return 'rank-3'
      default: return 'rank-default'
    }
  }

  const currentIdeas = activeCategory === 'movies' ? movieIdeas : 
                       activeCategory === 'business' ? businessIdeas : gameIdeas

  const categoryTitles = {
    movies: 'Top Movie & TV Scripts',
    business: 'Top Business Ideas',
    games: 'Top Game Concepts'
  }

  const categorySubtitles = {
    movies: 'This month\'s highest-rated entertainment concepts',
    business: 'Innovative startups and business concepts',
    games: 'Revolutionary gaming experiences and mechanics'
  }

  return (
    <>
      <Head>
        <title>ScriptRank - Professional AI Idea Evaluation Platform</title>
        <meta name="description" content="Submit your movie script, game concept, or business idea. Get instant AI analysis and compete for prizes." />
      </Head>

      <div className="page-wrapper">
        <main className="main-content">
          {/* Hero Section */}
          <section className="hero">
            <h1>Where Brilliant Ideas Meet AI Validation</h1>
            <p>Submit your movie script, game concept, or business idea. Get instant AI analysis, compete on the leaderboard, and connect with investors.</p>
            
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">2,847</span>
                <span className="stat-label">Ideas Evaluated</span>
              </div>
              <div className="stat">
                <span className="stat-number">$5M</span>
                <span className="stat-label">In Prizes</span>
              </div>
              <div className="stat">
                <span className="stat-number">94%</span>
                <span className="stat-label">Success Rate</span>
              </div>
            </div>
          </section>

          {/* Category Tabs */}
          <div className="category-tabs">
            <button 
              className={`category-tab ${activeCategory === 'movies' ? 'active' : ''}`}
              onClick={() => setActiveCategory('movies')}
            >
              Movies & TV
            </button>
            <button 
              className={`category-tab ${activeCategory === 'business' ? 'active' : ''}`}
              onClick={() => setActiveCategory('business')}
            >
              Business Ideas
            </button>
            <button 
              className={`category-tab ${activeCategory === 'games' ? 'active' : ''}`}
              onClick={() => setActiveCategory('games')}
            >
              Game Concepts
            </button>
          </div>

          {/* Leaderboard Container */}
          <div className="leaderboard-container">
            <div className="category-header">
              <h2 className="category-title">{categoryTitles[activeCategory]}</h2>
              <p className="category-subtitle">{categorySubtitles[activeCategory]}</p>
            </div>

            {loading ? (
              <div className="loading">Loading ideas...</div>
            ) : (
              <div className="ideas-grid">
                {currentIdeas.map((idea) => (
                  <Link key={idea.id} href={`/ideas/${idea.id}`}>
                    <a className="idea-card">
                      <div className="card-header">
                        <div className={`rank-badge ${getRankBadgeClass(idea.rank)}`}>
                          {idea.rank}
                        </div>
                        <div className="card-meta">
                          <h3 className="idea-title">{idea.title}</h3>
                          <p className="idea-author">{idea.username}</p>
                        </div>
                      </div>
                      <p className="idea-description">{idea.content}</p>
                      <div className="card-stats">
                        <div className="stat-item">
                          <span className="stat-value">{idea.aiScores.overall.toFixed(1)}</span>
                          <span className="stat-label">AI Score</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-value">{idea.aiScores.market.toFixed(1)}</span>
                          <span className="stat-label">Market</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-value">{idea.aiScores.innovation.toFixed(1)}</span>
                          <span className="stat-label">Innovation</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-value">{idea.publicScore.count}</span>
                          <span className="stat-label">Votes</span>
                        </div>
                      </div>
                      <div className="card-footer">
                        <span className={`status-badge ${getStatusBadgeClass(idea.status)}`}>
                          {idea.status || 'PASS'}
                        </span>
                        <span className="view-details">View Details →</span>
                      </div>
                    </a>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <style jsx>{`
        .page-wrapper {
          min-height: 100vh;
          background: url('/bg11.png') center/cover no-repeat fixed;
          position: relative;
        }

        .page-wrapper::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(180deg, 
            rgba(26, 31, 46, 0.3) 0%, 
            rgba(26, 31, 46, 0.5) 100%);
          z-index: -1;
        }

        .main-content {
          padding-top: 100px;
          max-width: 1400px;
          margin: 0 auto;
          padding-left: 2rem;
          padding-right: 2rem;
          padding-bottom: 4rem;
        }

        .hero {
          text-align: center;
          padding: 4rem 0;
          color: white;
        }

        .hero h1 {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          letter-spacing: -1px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .hero p {
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.95);
          max-width: 700px;
          margin: 0 auto 2rem;
          line-height: 1.6;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        }

        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 4rem;
          margin-top: 3rem;
        }

        .stat {
          text-align: center;
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: 800;
          color: white;
          display: block;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .stat-label {
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.95rem;
          margin-top: 0.5rem;
        }

        .category-tabs {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 3rem;
          flex-wrap: wrap;
        }

        .category-tab {
          padding: 0.875rem 2rem;
          background: rgba(255, 255, 255, 0.95);
          border: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s;
          color: #4b5563;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .category-tab:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        .category-tab.active {
          background: #2563eb;
          color: white;
          transform: scale(1.05);
        }

        .leaderboard-container {
          margin-bottom: 4rem;
        }

        .category-header {
          background: rgba(255, 255, 255, 0.95);
          padding: 1.5rem 2rem;
          border-radius: 16px 16px 0 0;
          margin-bottom: 1.5rem;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .category-title {
          font-size: 2rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 0.5rem;
        }

        .category-subtitle {
          color: #4b5563;
          font-size: 1rem;
        }

        .loading {
          text-align: center;
          color: white;
          font-size: 1.25rem;
          padding: 4rem;
        }

        .ideas-grid {
          display: grid;
          gap: 1.5rem;
        }

        .idea-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 16px;
          padding: 1.75rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          transition: all 0.3s;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          display: block;
          text-decoration: none;
        }

        .idea-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: #2563eb;
          transform: scaleY(0);
          transition: transform 0.3s;
        }

        .idea-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2);
        }

        .idea-card:hover::before {
          transform: scaleY(1);
        }

        .card-header {
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
          margin-bottom: 1rem;
          gap: 1rem;
        }

        .rank-badge {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.1rem;
          flex-shrink: 0;
        }

        .rank-1 {
          background: linear-gradient(135deg, #ffd700, #ffed4e);
          color: #1a1f2e;
        }

        .rank-2 {
          background: linear-gradient(135deg, #c0c0c0, #e8e8e8);
          color: #1a1f2e;
        }

        .rank-3 {
          background: linear-gradient(135deg, #cd7f32, #e4a853);
          color: white;
        }

        .rank-default {
          background: #e5e7eb;
          color: #4b5563;
        }

        .card-meta {
          flex: 1;
        }

        .idea-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 0.5rem;
          line-height: 1.3;
        }

        .idea-author {
          color: #4b5563;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .idea-description {
          color: #4b5563;
          line-height: 1.6;
          margin: 1rem 0;
          font-size: 0.95rem;
        }

        .card-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          padding: 1rem;
          background: rgba(248, 250, 252, 0.8);
          border-radius: 12px;
          margin: 1rem 0;
        }

        .stat-item {
          text-align: center;
        }

        .stat-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: #111827;
          display: block;
        }

        .stat-label {
          font-size: 0.75rem;
          color: #6b7280;
          text-transform: uppercase;
          margin-top: 0.25rem;
          letter-spacing: 0.5px;
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1.5rem;
        }

        .status-badge {
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-invest {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          border: 1px solid #10b981;
        }

        .status-maybe {
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
          border: 1px solid #f59e0b;
        }

        .status-pass {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid #ef4444;
        }

        .view-details {
          color: #2563eb;
          font-weight: 600;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: gap 0.3s;
        }

        .idea-card:hover .view-details {
          gap: 0.75rem;
        }

        @media (max-width: 768px) {
          .main-content {
            padding-left: 1rem;
            padding-right: 1rem;
          }

          .hero h1 {
            font-size: 2.5rem;
          }

          .hero p {
            font-size: 1.1rem;
          }

          .hero-stats {
            gap: 2rem;
          }

          .stat-number {
            font-size: 2rem;
          }

          .card-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .category-tab {
            padding: 0.75rem 1.5rem;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </>
  )
}
