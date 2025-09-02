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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

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
          border-color: #0d1117;
          background: white;
          box-shadow: 0 0 0 3px rgba(13, 17, 23, 0.1);
        }
        
        button[type="submit"] {
          font-family: 'ContentFont', sans-serif;
          background: #0d1117;
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
          background: #1a1f2e;
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
          color: #0d1117;
          cursor: pointer;
          margin-left: 4px;
          font-weight: 500;
          transition: color 0.2s;
        }
        
        .modal-switch button:hover {
          color: #1a1f2e;
          text-decoration: underline;
        }
      })
      
      // Always use mock data for now to ensure proper display
      setIdeas(getMockIdeas())
    } catch (error) {
      setIdeas(getMockIdeas())
    } finally {
      setLoading(false)
    }
  }

  const getMockIdeas = (): Idea[] => [
    // Movies
    {
      id: '1', rank: 1, title: 'Memory Vault', type: 'movie', genre: 'Sci-Fi', author: 'Elena Rodriguez',
      desc: 'In 2090, memories are extracted and stored as digital assets. A black market memory dealer discovers someone is planting false memories in the global database, threatening the nature of human identity and truth itself.',
      aiScore: 94, marketScore: 91, innovationScore: 96, executionScore: 90, publicScore: 9.2, publicVotes: 1203, timestamp: '2024-01-26', expanded: false
    },
    {
      id: '2', rank: 2, title: 'The Algorithm War', type: 'movie', genre: 'Thriller', author: 'David Zhang',
      desc: 'Corporate espionage thriller where tech companies wage secret battles through AI algorithms. A data scientist discovers her recommendation engine is being weaponized to manipulate global elections and financial markets.',
      aiScore: 89, marketScore: 84, innovationScore: 87, executionScore: 82, publicScore: 8.1, publicVotes: 892, timestamp: '2024-01-22', expanded: false
    },
    {
      id: '3', rank: 3, title: 'Echoes of Tomorrow', type: 'movie', genre: 'Drama', author: 'Sarah Mitchell',
      desc: 'A time-loop drama where a woman relives the last day with her daughter before a tragic accident. Each loop reveals hidden truths about their relationship and the choices that led them there.',
      aiScore: 86, marketScore: 88, innovationScore: 82, executionScore: 85, publicScore: 8.7, publicVotes: 756, timestamp: '2024-01-25', expanded: false
    },
    {
      id: '4', rank: 4, title: 'Neon Nights', type: 'movie', genre: 'Action', author: 'Marcus Chen',
      desc: 'Neo-Tokyo 2087: A detective with memory implants must solve murders that haven\'t happened yet while the city\'s AR layer bleeds into reality, questioning what is real.',
      aiScore: 83, marketScore: 80, innovationScore: 89, executionScore: 79, publicScore: 8.3, publicVotes: 654, timestamp: '2024-01-24', expanded: false
    },
    {
      id: '5', rank: 5, title: 'The Last Comedian', type: 'movie', genre: 'Comedy', author: 'Alex Turner',
      desc: 'In a world where AI has replaced all entertainment, one comedian fights to prove humans are still funny. A dark comedy questioning what makes us uniquely human.',
      aiScore: 78, marketScore: 75, innovationScore: 81, executionScore: 76, publicScore: 7.9, publicVotes: 543, timestamp: '2024-01-23', expanded: false
    },
    // Games
    {
      id: '6', rank: 1, title: 'Quantum Chess Arena', type: 'game', genre: 'Strategy', author: 'Marcus Webb',
      desc: 'Revolutionary chess variant where pieces exist in quantum superposition states until observed. Features simultaneous move possibilities, probability-based captures, and tournament modes with global leaderboards.',
      aiScore: 91, marketScore: 85, innovationScore: 98, executionScore: 88, publicScore: 8.9, publicVotes: 623, timestamp: '2024-01-27', expanded: false
    },
    {
      id: '7', rank: 2, title: 'Neural VR Therapy', type: 'game', genre: 'VR/AR', author: 'Dr. Lisa Park',
      desc: 'Immersive VR platform for treating PTSD, anxiety, and phobias through controlled exposure therapy. Features biometric monitoring, AI-adapted scenarios, and clinical integration.',
      aiScore: 87, marketScore: 79, innovationScore: 93, executionScore: 81, publicScore: 8.8, publicVotes: 567, timestamp: '2024-01-23', expanded: false
    },
    {
      id: '8', rank: 3, title: 'Battle Royale Chess', type: 'game', genre: 'Multiplayer', author: 'James Foster',
      desc: '100 players start on a massive chess board. Capture pieces to gain their powers. The board shrinks every 5 minutes. Last player standing wins the crown.',
      aiScore: 84, marketScore: 88, innovationScore: 80, executionScore: 85, publicScore: 8.5, publicVotes: 892, timestamp: '2024-01-26', expanded: false
    },
    {
      id: '9', rank: 4, title: 'Memory Lane VR', type: 'game', genre: 'Puzzle', author: 'Sophie Chen',
      desc: 'Walk through your memories in VR and change small details to alter your present. Each change creates ripple effects through time in this emotional puzzle adventure.',
      aiScore: 81, marketScore: 77, innovationScore: 86, executionScore: 78, publicScore: 8.2, publicVotes: 445, timestamp: '2024-01-25', expanded: false
    },
    {
      id: '10', rank: 5, title: 'Pixel Dungeons', type: 'game', genre: 'Roguelike', author: 'Tom Anderson',
      desc: 'Roguelike mobile game with time-loop mechanics. Every death teaches you something new about the dungeon. Procedurally generated with persistent story elements.',
      aiScore: 76, marketScore: 82, innovationScore: 72, executionScore: 79, publicScore: 7.8, publicVotes: 334, timestamp: '2024-01-24', expanded: false
    },
    // Business
    {
      id: '11', rank: 1, title: 'Neural Market Predictor', type: 'business', genre: 'Fintech', author: 'Dr. Sarah Chen',
      desc: 'AI-powered platform that analyzes 10,000+ market signals in real-time to predict price movements with 89% accuracy. Combines sentiment analysis, technical indicators, and macroeconomic data.',
      aiScore: 94, marketScore: 96, innovationScore: 92, executionScore: 89, publicScore: 9.2, publicVotes: 847, timestamp: '2024-01-28', expanded: false
    },
    {
      id: '12', rank: 2, title: 'GreenEats', type: 'business', genre: 'Marketplace', author: 'Emma Wilson',
      desc: 'Zero-waste meal delivery using only reusable containers tracked by blockchain. Return containers get you discounts. Partners with local restaurants for sustainable dining.',
      aiScore: 88, marketScore: 85, innovationScore: 87, executionScore: 83, publicScore: 8.6, publicVotes: 756, timestamp: '2024-01-24', expanded: false
    },
    {
      id: '13', rank: 3, title: 'AI Resume Coach', type: 'business', genre: 'SaaS', author: 'Michael Brown',
      desc: 'SaaS that analyzes job postings and automatically tailors your resume to match keywords and requirements. Uses GPT to rewrite descriptions for maximum impact.',
      aiScore: 85, marketScore: 89, innovationScore: 78, executionScore: 86, publicScore: 8.4, publicVotes: 623, timestamp: '2024-01-25', expanded: false
    },
    {
      id: '14', rank: 4, title: 'RentMyGarage', type: 'business', genre: 'Real Estate', author: 'Jake Martinez',
      desc: 'Uber for storage space. Homeowners rent out garage space by the square foot, with insurance included. Smart locks provide secure 24/7 access for renters.',
      aiScore: 82, marketScore: 86, innovationScore: 76, executionScore: 84, publicScore: 8.1, publicVotes: 512, timestamp: '2024-01-26', expanded: false
    },
    {
      id: '15', rank: 5, title: 'EcoChain Network', type: 'business', genre: 'B2B', author: 'James Foster',
      desc: 'Blockchain-based carbon credit marketplace with IoT verification. Automated sensors validate environmental impact in real-time, creating transparent carbon trading.',
      aiScore: 79, marketScore: 77, innovationScore: 84, executionScore: 75, publicScore: 7.7, publicVotes: 445, timestamp: '2024-01-24', expanded: false
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
    if (score < 50) {
      // Red to yellow
      const ratio = score / 50;
      const r = 255;
      const g = Math.round(255 * ratio);
      return `rgb(${r}, ${g}, 0)`;
    } else if (score < 70) {
      // Yellow to yellow-green
      const ratio = (score - 50) / 20;
      const r = Math.round(255 * (1 - ratio * 0.5));
      const g = 255;
      return `rgb(${r}, ${g}, 0)`;
    } else if (score < 80) {
      // Yellow-green to greenish
      const ratio = (score - 70) / 10;
      const r = Math.round(127 - 127 * ratio);
      const g = Math.round(255 - 8 * ratio);
      const b = Math.round(77 * ratio);
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      // Green (#69f74d)
      return '#69f74d';
    }
  }

  // Separate ideas by type - ensure we get all 5
  const movieIdeas = ideas.filter(idea => idea.type === 'movie').slice(0, 5)
  const gameIdeas = ideas.filter(idea => idea.type === 'game').slice(0, 5)
  const businessIdeas = ideas.filter(idea => idea.type === 'business').slice(0, 5)

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
        
        @font-face {
          font-family: 'ArgentumSans';
          src: url('/fonts/ArgentumSans-BlackItalic.ttf') format('truetype');
          font-weight: 900;
          font-style: italic;
          font-display: swap;
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'ContentFont', -apple-system, BlinkMacSystemFont, sans-serif;
          background: linear-gradient(180deg, #f8f9fb 0%, #e8ebf0 100%);
          color: #0d1117;
          line-height: 1.6;
          overflow-x: hidden;
          position: relative;
        }
        
        body::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            radial-gradient(circle at 20% 50%, rgba(67, 49, 244, 0.02) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(105, 247, 77, 0.02) 0%, transparent 50%);
          pointer-events: none;
          z-index: 0;
        }
        
        /* Hide ALL scrollbars */
        ::-webkit-scrollbar {
          display: none;
        }
        
        * {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        ::selection {
          background: #4331f4;
          color: white;
        }
        
        /* Color Palette Variables */
        :root {
          --primary-blue: #4331f4;
          --primary-green: #69f74d;
          --accent-purple: #8b7ff4;
          --accent-teal: #4de5f7;
          --dark: #0d1117;
          --dark-secondary: #1a1f2e;
          --grey-dark: #424651;
          --grey-medium: #656d76;
          --grey-light: #8b949e;
          --bg-primary: #f8f9fb;
          --bg-secondary: #ffffff;
          --bg-hover: #f0f3f8;
          --border: #e1e5e9;
          --shadow-sm: 0 2px 8px rgba(13, 17, 23, 0.04);
          --shadow-md: 0 8px 24px rgba(13, 17, 23, 0.08);
          --shadow-lg: 0 16px 48px rgba(13, 17, 23, 0.12);
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes slideIn {
          from { 
            opacity: 0;
            transform: translateX(-20px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
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
        {/* Collapsible Sidebar */}
        <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? '→' : '←'}
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
                <div className="category-item">
                  <button className="filter-btn">
                    Movies <span className="count">{movieIdeas.length}</span>
                  </button>
                  <div className="genre-dropdown">
                    <a href="#">Sci-Fi</a>
                    <a href="#">Drama</a>
                    <a href="#">Thriller</a>
                    <a href="#">Comedy</a>
                    <a href="#">Horror</a>
                    <a href="#">Action</a>
                  </div>
                </div>
                <div className="category-item">
                  <button className="filter-btn">
                    Games <span className="count">{gameIdeas.length}</span>
                  </button>
                  <div className="genre-dropdown">
                    <a href="#">Strategy</a>
                    <a href="#">VR/AR</a>
                    <a href="#">Multiplayer</a>
                    <a href="#">Puzzle</a>
                    <a href="#">Roguelike</a>
                    <a href="#">Mobile</a>
                  </div>
                </div>
                <div className="category-item">
                  <button className="filter-btn">
                    Business <span className="count">{businessIdeas.length}</span>
                  </button>
                  <div className="genre-dropdown">
                    <a href="#">Fintech</a>
                    <a href="#">SaaS</a>
                    <a href="#">Marketplace</a>
                    <a href="#">B2B</a>
                    <a href="#">Real Estate</a>
                    <a href="#">AI/ML</a>
                  </div>
                </div>
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
          <section className="hero-section">
            <div className="hero-content">
              <h1 className="hero-title">
                Get Your Ideas <span className="hero-highlight">Ranked</span>
              </h1>
              <p className="hero-description">
                Submit your movie script, game concept, or business idea and let our advanced AI evaluate its potential. 
                Get instant scores on market viability, innovation, and execution complexity.
              </p>
              <div className="hero-features">
                <div className="hero-feature">
                  <span className="feature-icon">✓</span>
                  <span className="feature-text">No Marketing Budget Needed</span>
                  <span className="feature-sub">Unlike Kickstarter, just submit your idea</span>
                </div>
                <div className="hero-feature">
                  <span className="feature-icon">✓</span>
                  <span className="feature-text">Instant AI Evaluation</span>
                  <span className="feature-sub">Get professional analysis in seconds</span>
                </div>
                <div className="hero-feature">
                  <span className="feature-icon">✓</span>
                  <span className="feature-text">Community Validation</span>
                  <span className="feature-sub">Real users vote on your concept</span>
                </div>
              </div>
            </div>
          </section>

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
                                  background: getScoreColor(idea.aiScore)
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <p className="idea-description">
                          {idea.desc.substring(0, 100)}...
                        </p>
                        
                        <div className="card-actions">
                          <button 
                            className="expand-btn"
                            onClick={() => toggleExpanded(idea.id)}
                          >
                            {idea.expanded ? 'Show Less' : 'Read More'}
                          </button>
                          <div className="public-voting">
                            <span className="public-score">
                              {idea.publicScore.toFixed(1)} / 10
                            </span>
                            <button 
                              className="vote-btn"
                              onClick={() => handleVote(idea.id)}
                            >
                              Vote
                            </button>
                          </div>
                        </div>
                        
                        {idea.expanded && (
                          <div className="expanded-content">
                            <div className="full-description">
                              <p>{idea.desc}</p>
                            </div>
                            
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
                            
                            <div className="public-votes-info">
                              <span>{idea.publicVotes} people have voted</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </article>
                  </div>
                ))}
                <Link href="/leaderboard/movies">
                  <button className="view-leaderboard-btn">View Full Movie Leaderboard</button>
                </Link>
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
                                  background: getScoreColor(idea.aiScore)
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <p className="idea-description">
                          {idea.desc.substring(0, 100)}...
                        </p>
                        
                        <div className="card-actions">
                          <button 
                            className="expand-btn"
                            onClick={() => toggleExpanded(idea.id)}
                          >
                            {idea.expanded ? 'Show Less' : 'Read More'}
                          </button>
                          <div className="public-voting">
                            <span className="public-score">
                              {idea.publicScore.toFixed(1)} / 10
                            </span>
                            <button 
                              className="vote-btn"
                              onClick={() => handleVote(idea.id)}
                            >
                              Vote
                            </button>
                          </div>
                        </div>
                        
                        {idea.expanded && (
                          <div className="expanded-content">
                            <div className="full-description">
                              <p>{idea.desc}</p>
                            </div>
                            
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
                            
                            <div className="public-votes-info">
                              <span>{idea.publicVotes} people have voted</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </article>
                  </div>
                ))}
                <Link href="/leaderboard/games">
                  <button className="view-leaderboard-btn">View Full Games Leaderboard</button>
                </Link>
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
                                  background: getScoreColor(idea.aiScore)
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <p className="idea-description">
                          {idea.desc.substring(0, 100)}...
                        </p>
                        
                        <div className="card-actions">
                          <button 
                            className="expand-btn"
                            onClick={() => toggleExpanded(idea.id)}
                          >
                            {idea.expanded ? 'Show Less' : 'Read More'}
                          </button>
                          <div className="public-voting">
                            <span className="public-score">
                              {idea.publicScore.toFixed(1)} / 10
                            </span>
                            <button 
                              className="vote-btn"
                              onClick={() => handleVote(idea.id)}
                            >
                              Vote
                            </button>
                          </div>
                        </div>
                        
                        {idea.expanded && (
                          <div className="expanded-content">
                            <div className="full-description">
                              <p>{idea.desc}</p>
                            </div>
                            
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
                            
                            <div className="public-votes-info">
                              <span>{idea.publicVotes} people have voted</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </article>
                  </div>
                ))}
                <Link href="/leaderboard/business">
                  <button className="view-leaderboard-btn">View Full Business Leaderboard</button>
                </Link>
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
        /* Header Styles - Simplified and Professional */
        .header {
          background: white;
          border-bottom: 1px solid var(--border);
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          height: 64px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
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
          gap: 40px;
        }

        .logo {
          font-family: 'TitleFont', serif;
          font-size: 24px;
          font-weight: bold;
          color: var(--dark);
          text-decoration: none;
          transition: opacity 0.2s;
        }

        .logo:hover {
          opacity: 0.8;
        }

        .main-nav {
          display: flex;
          gap: 28px;
        }

        .nav-item {
          font-family: 'ContentFont', sans-serif;
          font-weight: 500;
          font-size: 14px;
          color: var(--grey-medium);
          text-decoration: none;
          transition: color 0.2s;
          position: relative;
        }

        .nav-item:hover {
          color: var(--dark);
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .search-container {
          position: relative;
        }

        .search-input {
          font-family: 'ContentFont', sans-serif;
          width: 240px;
          padding: 8px 12px;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--bg-primary);
          font-size: 13px;
          transition: all 0.2s;
        }

        .search-input:focus {
          outline: none;
          border-color: var(--primary-blue);
          background: white;
        }

        .user-menu {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-link {
          font-family: 'ContentFont', sans-serif;
          font-weight: 500;
          font-size: 13px;
          color: var(--grey-medium);
          text-decoration: none;
          transition: color 0.2s;
        }

        .user-link:hover {
          color: var(--dark);
        }

        .sign-out-btn {
          font-family: 'ContentFont', sans-serif;
          font-weight: 500;
          font-size: 13px;
          padding: 8px 14px;
          background: transparent;
          color: var(--grey-medium);
          border: 1px solid var(--border);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .sign-out-btn:hover {
          background: var(--bg-hover);
          color: var(--dark);
        }

        .auth-buttons {
          display: flex;
          gap: 10px;
        }

        .login-btn {
          font-family: 'ContentFont', sans-serif;
          font-weight: 500;
          font-size: 13px;
          padding: 8px 16px;
          background: transparent;
          color: var(--dark);
          border: 1px solid var(--border);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .login-btn:hover {
          background: var(--bg-hover);
        }

        .submit-btn {
          font-family: 'ContentFont', sans-serif;
          font-weight: 600;
          font-size: 13px;
          padding: 8px 16px;
          background: var(--dark);
          color: white;
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .submit-btn:hover {
          background: var(--dark-secondary);
        }

        .mobile-toggle {
          display: none;
        }

        .mobile-menu {
          display: none;
        }

        /* App Layout */
        .app-layout {
          display: flex;
          margin-top: 64px;
          min-height: calc(100vh - 64px);
        }

        /* Sidebar - Simplified */
        .sidebar {
          width: 260px;
          background: white;
          border-right: 1px solid var(--border);
          position: fixed;
          height: calc(100vh - 64px);
          transition: transform 0.3s ease;
          z-index: 100;
          overflow-y: auto;
        }

        .sidebar.collapsed {
          transform: translateX(-260px);
        }

        .sidebar-toggle {
          position: absolute;
          top: 20px;
          right: -36px;
          width: 28px;
          height: 28px;
          background: white;
          border: 1px solid var(--border);
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          z-index: 101;
          transition: all 0.2s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .sidebar-toggle:hover {
          background: var(--bg-hover);
        }

        .sidebar-content {
          padding: 20px;
        }

        .sidebar-section {
          margin-bottom: 28px;
        }

        .sidebar-title {
          font-family: 'ContentFont', sans-serif;
          font-weight: 600;
          font-size: 11px;
          color: var(--grey-medium);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
        }

        .action-btn {
          display: block;
          width: 100%;
          padding: 10px 14px;
          font-family: 'ContentFont', sans-serif;
          font-weight: 600;
          font-size: 13px;
          text-decoration: none;
          text-align: center;
          border-radius: 8px;
          transition: all 0.2s;
          margin-bottom: 8px;
          border: none;
          cursor: pointer;
        }

        .action-btn.primary {
          background: var(--dark);
          color: white;
        }

        .action-btn.primary:hover {
          background: var(--dark-secondary);
        }

        .action-btn.secondary {
          background: transparent;
          color: var(--dark);
          border: 1px solid var(--border);
        }

        .action-btn.secondary:hover {
          background: var(--bg-hover);
        }

        /* Category Items with Dropdown */
        .category-item {
          position: relative;
        }

        .category-item:hover .genre-dropdown {
          display: block;
          opacity: 1;
        }

        .genre-dropdown {
          display: none;
          position: absolute;
          left: 100%;
          top: 0;
          background: white;
          border: 1px solid var(--border);
          border-radius: 8px;
          min-width: 140px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          margin-left: 8px;
        }

        .genre-dropdown a {
          display: block;
          padding: 8px 12px;
          color: var(--grey-medium);
          text-decoration: none;
          font-family: 'ContentFont', sans-serif;
          font-size: 12px;
          transition: all 0.2s;
        }

        .genre-dropdown a:hover {
          background: var(--bg-hover);
          color: var(--dark);
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
          padding: 8px 10px;
          background: transparent;
          border: none;
          border-radius: 6px;
          font-family: 'ContentFont', sans-serif;
          font-weight: 500;
          font-size: 13px;
          color: var(--grey-medium);
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }

        .filter-btn:hover {
          background: var(--bg-hover);
          color: var(--dark);
        }

        .count {
          background: var(--bg-hover);
          color: var(--grey-medium);
          padding: 2px 6px;
          border-radius: 8px;
          font-size: 10px;
          font-weight: 600;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .metric-card {
          background: var(--bg-hover);
          padding: 12px;
          border-radius: 8px;
          text-align: center;
        }

        .metric-value {
          display: block;
          font-family: 'TitleFont', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: var(--dark);
          margin-bottom: 2px;
        }

        .metric-label {
          font-family: 'ContentFont', sans-serif;
          font-size: 10px;
          color: var(--grey-medium);
        }

        .activity-feed {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'ContentFont', sans-serif;
          font-size: 12px;
          color: var(--grey-medium);
        }

        .activity-dot {
          width: 6px;
          height: 6px;
          background: var(--primary-green);
          border-radius: 50%;
          flex-shrink: 0;
        }

        /* Main Content */
        .main-content {
          flex: 1;
          margin-left: 260px;
          transition: margin-left 0.3s ease;
        }

        .sidebar.collapsed ~ .main-content {
          margin-left: 36px;
        }

        /* Hero Section */
        .hero-section {
          background: linear-gradient(135deg, var(--dark) 0%, var(--dark-secondary) 100%);
          color: white;
          padding: 60px 40px;
          margin-bottom: 40px;
        }

        .hero-content {
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
        }

        .hero-title {
          font-family: 'ArgentumSans', sans-serif;
          font-size: 56px;
          font-weight: 900;
          font-style: italic;
          margin-bottom: 20px;
          line-height: 1.1;
        }

        .hero-highlight {
          color: var(--primary-green);
        }

        .hero-description {
          font-family: 'ContentFont', sans-serif;
          font-size: 18px;
          max-width: 700px;
          margin: 0 auto 40px;
          line-height: 1.5;
          opacity: 0.9;
        }

        .hero-features {
          display: flex;
          justify-content: center;
          gap: 50px;
          margin-top: 40px;
        }

        .hero-feature {
          text-align: left;
          max-width: 260px;
          padding: 18px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          backdrop-filter: blur(10px);
        }

        .feature-icon {
          display: inline-block;
          color: var(--primary-green);
          font-size: 24px;
          margin-bottom: 10px;
        }

        .feature-text {
          display: block;
          font-family: 'TitleFont', sans-serif;
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 6px;
        }

        .feature-sub {
          display: block;
          font-family: 'ContentFont', sans-serif;
          font-size: 13px;
          opacity: 0.7;
          line-height: 1.4;
        }

        /* Featured Section */
        .featured-section {
          padding: 0 40px 40px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
        }

        .section-title {
          font-family: 'TitleFont', sans-serif;
          font-weight: 700;
          font-size: 24px;
          color: var(--dark);
        }

        .section-controls {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .results-count {
          font-family: 'ContentFont', sans-serif;
          font-size: 13px;
          color: var(--grey-medium);
        }

        .sort-select {
          font-family: 'ContentFont', sans-serif;
          padding: 6px 10px;
          border: 1px solid var(--border);
          border-radius: 6px;
          background: white;
          font-size: 13px;
          color: var(--grey-medium);
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
          gap: 20px;
        }

        .column-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: white;
          border-radius: 12px;
          border: 1px solid var(--border);
        }

        .column-title {
          font-family: 'TitleFont', sans-serif;
          font-size: 20px;
          font-weight: bold;
          color: var(--dark);
        }

        .column-icon {
          width: 28px;
          height: 28px;
        }

        .idea-wrapper {
          animation: fadeIn 0.5s ease;
        }

        .idea-header-outside {
          display: flex;
          align-items: baseline;
          gap: 10px;
          margin-bottom: 6px;
          padding-left: 6px;
        }

        .idea-rank {
          font-family: 'TitleFont', sans-serif;
          font-size: 24px;
          font-weight: bold;
          color: var(--primary-blue);
        }

        .idea-title-outside {
          font-family: 'TitleFont', sans-serif;
          font-size: 18px;
          font-weight: bold;
          color: var(--dark);
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .idea-card {
          background: white;
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          transition: all 0.2s ease;
          position: relative;
          min-height: 240px;
          display: flex;
          flex-direction: column;
        }

        .idea-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .card-genre-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          background: var(--dark);
          color: white;
          padding: 4px 10px;
          border-radius: 16px;
          font-family: 'ContentFont', sans-serif;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .card-content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .author-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .author-name {
          font-family: 'ContentFont', sans-serif;
          font-size: 12px;
          color: var(--grey-medium);
          font-weight: 500;
        }

        .publish-date {
          font-family: 'ContentFont', sans-serif;
          font-size: 11px;
          color: var(--grey-light);
        }

        .score-overview {
          margin-bottom: 12px;
        }

        .score-bar-container {
          width: 100%;
        }

        .score-bar-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }

        .score-bar-label span:first-child {
          font-family: 'ContentFont', sans-serif;
          font-size: 11px;
          color: var(--grey-medium);
          text-transform: uppercase;
          letter-spacing: 0.3px;
          font-weight: 600;
        }

        .score-percentage {
          font-family: 'TitleFont', sans-serif;
          font-size: 20px;
          font-weight: bold;
        }

        .score-bar {
          width: 100%;
          height: 8px;
          background: var(--bg-hover);
          border-radius: 100px;
          overflow: hidden;
        }

        .score-fill {
          height: 100%;
          border-radius: 100px;
          transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .idea-description {
          font-family: 'ContentFont', sans-serif;
          font-size: 13px;
          color: var(--grey-dark);
          line-height: 1.5;
          margin-bottom: 12px;
          flex: 1;
        }

        .card-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 12px;
          border-top: 1px solid var(--border);
        }

        .expand-btn {
          background: none;
          border: none;
          color: var(--primary-blue);
          font-family: 'ContentFont', sans-serif;
          font-size: 12px;
          cursor: pointer;
          padding: 0;
          font-weight: 600;
          transition: opacity 0.2s;
        }

        .expand-btn:hover {
          opacity: 0.7;
        }

        .public-voting {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .public-score {
          font-family: 'TitleFont', sans-serif;
          font-size: 14px;
          color: var(--primary-blue);
          font-weight: 700;
        }

        .vote-btn {
          background: var(--dark);
          color: white;
          border: none;
          padding: 6px 14px;
          border-radius: 16px;
          font-family: 'ContentFont', sans-serif;
          font-weight: 600;
          font-size: 11px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .vote-btn:hover {
          background: var(--dark-secondary);
        }

        .expanded-content {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid var(--border);
          animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 600px;
          }
        }

        .full-description {
          margin-bottom: 16px;
        }

        .full-description p {
          font-family: 'ContentFont', sans-serif;
          font-size: 13px;
          color: var(--grey-dark);
          line-height: 1.6;
        }

        .analysis-title {
          font-family: 'ContentFont', sans-serif;
          font-weight: 600;
          font-size: 14px;
          color: var(--dark);
          margin-bottom: 12px;
        }

        .metrics-breakdown {
          margin-bottom: 16px;
        }

        .metric-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 10px;
        }

        .metric-name {
          font-family: 'ContentFont', sans-serif;
          font-size: 12px;
          color: var(--grey-medium);
          width: 100px;
          flex-shrink: 0;
        }

        .metric-visual {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .metric-bar {
          flex: 1;
          height: 16px;
          background: var(--bg-hover);
          border-radius: 8px;
          overflow: hidden;
        }

        .metric-fill {
          height: 100%;
          transition: width 0.3s ease;
          border-radius: 8px;
        }

        .metric-score {
          font-family: 'ContentFont', sans-serif;
          font-weight: 600;
          font-size: 12px;
          min-width: 36px;
        }

        .engagement-section {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }

        .engage-btn {
          font-family: 'ContentFont', sans-serif;
          font-weight: 500;
          font-size: 11px;
          padding: 6px 10px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .engage-btn.primary {
          background: var(--primary-green);
          color: var(--dark);
        }

        .engage-btn.primary:hover {
          opacity: 0.9;
        }

        .engage-btn.secondary {
          background: var(--bg-hover);
          color: var(--grey-medium);
          border: 1px solid var(--border);
        }

        .engage-btn.secondary:hover {
          background: var(--border);
        }

        .public-votes-info {
          text-align: center;
          font-family: 'ContentFont', sans-serif;
          font-size: 11px;
          color: var(--grey-light);
          padding: 8px;
          background: var(--bg-hover);
          border-radius: 6px;
        }

        .view-leaderboard-btn {
          width: 100%;
          padding: 12px;
          margin-top: 20px;
          background: var(--dark);
          color: white;
          border: none;
          border-radius: 10px;
          font-family: 'ContentFont', sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .view-leaderboard-btn:hover {
          background: var(--dark-secondary);
        }

        /* How It Works */
        .how-it-works {
          margin: 40px;
          padding: 36px;
          background: white;
          border: 1px solid var(--border);
          border-radius: 12px;
        }

        .process-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 28px;
          margin-top: 28px;
        }

        .process-step {
          text-align: center;
        }

        .step-icon {
          width: 52px;
          height: 52px;
          background: var(--dark);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'TitleFont', sans-serif;
          font-size: 16px;
          font-weight: 700;
          margin: 0 auto 16px;
        }

        .step-title {
          font-family: 'ContentFont', sans-serif;
          font-weight: 600;
          font-size: 14px;
          color: var(--dark);
          margin-bottom: 8px;
        }

        .step-description {
          font-family: 'ContentFont', sans-serif;
          font-size: 12px;
          color: var(--grey-medium);
          line-height: 1.4;
        }

        /* Platform Stats */
        .platform-stats {
          background: var(--bg-hover);
          padding: 40px;
          border-radius: 12px;
          text-align: center;
          margin: 0 40px 40px;
        }

        .stats-showcase {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 28px;
          margin-top: 28px;
        }

        .stat-block {
          background: white;
          padding: 24px 20px;
          border-radius: 10px;
          border: 1px solid var(--border);
        }

        .big-number {
          display: block;
          font-family: 'TitleFont', sans-serif;
          font-size: 28px;
          font-weight: 900;
          color: var(--dark);
          margin-bottom: 6px;
        }

        .stat-desc {
          display: block;
          font-family: 'ContentFont', sans-serif;
          font-weight: 500;
          font-size: 12px;
          color: var(--grey-medium);
          margin-bottom: 6px;
        }

        .stat-growth {
          font-family: 'ContentFont', sans-serif;
          font-size: 11px;
          color: var(--primary-green);
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
            transform: translateX(-260px);
          }
          
          .main-content {
            margin-left: 36px;
          }
          
          .ideas-grid {
            grid-template-columns: 1fr;
          }
          
          .process-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .main-nav {
            display: none;
          }
          
          .search-input {
            width: 160px;
          }
          
          .hero-title {
            font-size: 36px;
          }
          
          .hero-features {
            flex-direction: column;
            gap: 20px;
          }
          
          .process-grid,
          .stats-showcase {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }
