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
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'business' | 'games' | 'movies' | 'tech'>('all')
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)
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
    // Business Ideas (5+)
    {
      id: '1', rank: 1, title: 'Neural Market Predictor', type: 'business', genre: 'Fintech', author: 'Dr. Sarah Chen',
      desc: 'AI-powered platform that analyzes 10,000+ market signals in real-time to predict price movements with 89% accuracy. Combines sentiment analysis, technical indicators, and macroeconomic data to generate actionable trading insights for institutional and retail investors.',
      aiScore: 94, marketScore: 96, innovationScore: 92, executionScore: 89, publicScore: 9.2, publicVotes: 847, timestamp: '2024-01-28', expanded: false
    },
    {
      id: '5', rank: 5, title: 'EcoChain Network', type: 'business', genre: 'B2B Tools', author: 'James Foster',
      desc: 'Blockchain-based carbon credit marketplace with IoT verification. Automated sensors validate environmental impact in real-time, creating transparent and fraud-proof carbon trading for businesses seeking net-zero compliance.',
      aiScore: 85, marketScore: 88, innovationScore: 84, executionScore: 83, publicScore: 8.3, publicVotes: 756, timestamp: '2024-01-24', expanded: false
    },
    {
      id: '9', rank: 9, title: 'MediSync AI', type: 'business', genre: 'Healthcare', author: 'Dr. Anna Kim',
      desc: 'Comprehensive medical records synchronization platform using advanced NLP to extract and standardize patient data across disparate healthcare systems, reducing medical errors by 67% and saving 4 hours per physician daily.',
      aiScore: 82, marketScore: 90, innovationScore: 78, executionScore: 85, publicScore: 8.7, publicVotes: 523, timestamp: '2024-01-20', expanded: false
    },
    {
      id: '10', rank: 10, title: 'RetailFlow Analytics', type: 'business', genre: 'E-commerce', author: 'Marcus Thompson',
      desc: 'Real-time retail optimization platform that uses computer vision and predictive analytics to optimize store layouts, increasing conversion rates by 34% and reducing inventory costs by 28% through dynamic pricing.',
      aiScore: 78, marketScore: 85, innovationScore: 72, executionScore: 80, publicScore: 7.9, publicVotes: 412, timestamp: '2024-01-19', expanded: false
    },
    {
      id: '11', rank: 11, title: 'SupplyChain Oracle', type: 'business', genre: 'B2B Tools', author: 'Lisa Wang',
      desc: 'Predictive supply chain management system that anticipates disruptions 3-6 months in advance using satellite imagery, weather patterns, and geopolitical analysis, saving Fortune 500 companies millions in logistics costs.',
      aiScore: 76, marketScore: 82, innovationScore: 74, executionScore: 77, publicScore: 7.5, publicVotes: 389, timestamp: '2024-01-18', expanded: false
    },
    {
      id: '18', rank: 18, title: 'QuantumSecure Banking', type: 'business', genre: 'Fintech', author: 'Dr. Robert Chen',
      desc: 'Next-generation banking security platform using quantum encryption and biometric authentication. Prevents 99.99% of fraud attempts while reducing authentication time to under 0.5 seconds.',
      aiScore: 73, marketScore: 88, innovationScore: 95, executionScore: 62, publicScore: 8.1, publicVotes: 298, timestamp: '2024-01-11', expanded: false
    },
    // Games Ideas (5+)
    {
      id: '2', rank: 2, title: 'Quantum Chess Arena', type: 'games', genre: 'Strategy', author: 'Marcus Webb',
      desc: 'Revolutionary chess variant where pieces exist in quantum superposition states until observed. Features simultaneous move possibilities, probability-based captures, and tournament modes with global leaderboards. Built with cutting-edge physics simulation.',
      aiScore: 91, marketScore: 85, innovationScore: 98, executionScore: 88, publicScore: 8.9, publicVotes: 623, timestamp: '2024-01-27', expanded: false
    },
    {
      id: '6', rank: 6, title: 'Neural VR Therapy', type: 'games', genre: 'VR/AR', author: 'Dr. Lisa Park',
      desc: 'Immersive VR platform for treating PTSD, anxiety, and phobias through controlled exposure therapy. Features biometric monitoring, AI-adapted scenarios, and clinical integration for mental health professionals.',
      aiScore: 83, marketScore: 79, innovationScore: 89, executionScore: 81, publicScore: 8.8, publicVotes: 567, timestamp: '2024-01-23', expanded: false
    },
    {
      id: '12', rank: 12, title: 'Echo Wars Mobile', type: 'games', genre: 'Mobile', author: 'Alex Rivera',
      desc: 'Asymmetric multiplayer strategy game where sound-based combat mechanics create unique tactical gameplay. Players command armies using voice commands and audio patterns, with procedurally generated battlefields.',
      aiScore: 79, marketScore: 83, innovationScore: 86, executionScore: 75, publicScore: 8.1, publicVotes: 445, timestamp: '2024-01-17', expanded: false
    },
    {
      id: '13', rank: 13, title: 'Dreamscape Builder', type: 'games', genre: 'Indie', author: 'Sophie Chen',
      desc: 'Surreal puzzle-platformer where players manipulate dream logic to solve environmental challenges. Features procedural dream generation based on player behavior and a haunting adaptive soundtrack.',
      aiScore: 77, marketScore: 72, innovationScore: 88, executionScore: 70, publicScore: 8.4, publicVotes: 367, timestamp: '2024-01-16', expanded: false
    },
    {
      id: '14', rank: 14, title: 'Civilization Nexus', type: 'games', genre: 'PC/Console', author: 'David Kim',
      desc: 'Grand strategy game spanning 10,000 years of alternative history where player decisions create branching timelines. Features complex diplomatic AI and emergent storytelling through procedural historical events.',
      aiScore: 75, marketScore: 78, innovationScore: 82, executionScore: 73, publicScore: 7.8, publicVotes: 334, timestamp: '2024-01-15', expanded: false
    },
    {
      id: '19', rank: 19, title: 'Mindforge Arena', type: 'games', genre: 'Mobile', author: 'Jake Martinez',
      desc: 'Competitive puzzle-battle game where players create spells by solving logic puzzles in real-time. Features ranked matchmaking, daily tournaments, and a unique spell-crafting system.',
      aiScore: 71, marketScore: 76, innovationScore: 79, executionScore: 74, publicScore: 7.6, publicVotes: 256, timestamp: '2024-01-10', expanded: false
    },
    // Movies Ideas (5+)
    {
      id: '3', rank: 3, title: 'Memory Vault', type: 'movies', genre: 'Sci-Fi', author: 'Elena Rodriguez',
      desc: 'In 2090, memories are extracted and stored as digital assets. A black market memory dealer discovers someone is planting false memories in the global database, threatening the nature of human identity and truth itself.',
      aiScore: 89, marketScore: 91, innovationScore: 86, executionScore: 90, publicScore: 8.7, publicVotes: 1203, timestamp: '2024-01-26', expanded: false
    },
    {
      id: '7', rank: 7, title: 'The Algorithm War', type: 'movies', genre: 'Thriller', author: 'David Zhang',
      desc: 'Corporate espionage thriller where tech companies wage secret battles through AI algorithms. A data scientist discovers her recommendation engine is being weaponized to manipulate global elections and financial markets.',
      aiScore: 81, marketScore: 84, innovationScore: 78, executionScore: 82, publicScore: 8.1, publicVotes: 892, timestamp: '2024-01-22', expanded: false
    },
    {
      id: '15', rank: 15, title: 'Last Light', type: 'movies', genre: 'Drama', author: 'Michael Foster',
      desc: 'Character-driven drama following three lighthouse keepers in 1890s Maine as they confront isolation, madness, and supernatural phenomena during a month-long storm that cuts them off from civilization.',
      aiScore: 80, marketScore: 76, innovationScore: 73, executionScore: 85, publicScore: 8.5, publicVotes: 678, timestamp: '2024-01-14', expanded: false
    },
    {
      id: '16', rank: 16, title: 'The Architect', type: 'movies', genre: 'Horror', author: 'Sarah Black',
      desc: 'Psychological horror about an architect who discovers that buildings she designs are manifesting in a parallel dimension where trapped souls are forced to inhabit them for eternity.',
      aiScore: 74, marketScore: 79, innovationScore: 81, executionScore: 76, publicScore: 7.6, publicVotes: 456, timestamp: '2024-01-13', expanded: false
    },
    {
      id: '17', rank: 17, title: 'Echoes of Tomorrow', type: 'movies', genre: 'Animation', author: 'Jun Takahashi',
      desc: 'Animated epic where a young musician discovers she can alter the future by composing songs that resonate with specific timeline frequencies, but each change erases someone from existence.',
      aiScore: 72, marketScore: 75, innovationScore: 85, executionScore: 68, publicScore: 8.2, publicVotes: 523, timestamp: '2024-01-12', expanded: false
    },
    {
      id: '20', rank: 20, title: 'Digital Prophets', type: 'movies', genre: 'Documentary', author: 'Amanda Lee',
      desc: 'Documentary exploring the rise of AI-generated religions and digital cults in 2080s, following three followers as they navigate faith, technology, and the question of artificial consciousness.',
      aiScore: 70, marketScore: 73, innovationScore: 77, executionScore: 78, publicScore: 7.4, publicVotes: 189, timestamp: '2024-01-09', expanded: false
    },
    // Tech Ideas (for variety in "All" view)
    {
      id: '4', rank: 4, title: 'CodeMind AI', type: 'tech', genre: 'Dev Tools', author: 'Alex Kim',
      desc: 'Advanced code completion and debugging assistant that understands context across entire codebases. Features automatic bug detection, performance optimization suggestions, and natural language to code translation with 95% accuracy.',
      aiScore: 87, marketScore: 93, innovationScore: 82, executionScore: 86, publicScore: 8.5, publicVotes: 934, timestamp: '2024-01-25', expanded: false
    },
    {
      id: '8', rank: 8, title: 'SmartFarm IoT', type: 'tech', genre: 'IoT', author: 'Maria Santos',
      desc: 'Comprehensive agricultural IoT platform combining soil sensors, weather prediction, drone monitoring, and AI crop optimization. Increases yield by 35% while reducing water usage by 50% through precision farming.',
      aiScore: 79, marketScore: 86, innovationScore: 74, executionScore: 77, publicScore: 7.9, publicVotes: 678, timestamp: '2024-01-21', expanded: false
    }
  ]

  const toggleExpanded = (ideaId: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev)
      if (newSet.has(ideaId)) {
        newSet.delete(ideaId)
      } else {
        newSet.add(ideaId)
      }
      return newSet
    })
  }

  const businessIdeas = ideas.filter(idea => idea.type === 'business')
  const gamesIdeas = ideas.filter(idea => idea.type === 'games')
  const moviesIdeas = ideas.filter(idea => idea.type === 'movies')

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
    if (score >= 80) return '#10b981'
    if (score >= 60) return '#f59e0b' 
    return '#ef4444'
  }

  return (
    <>
      <Head>
        <title>Hyoka - Professional AI Idea Evaluation Platform</title>
        <meta name="description" content="Where brilliant ideas meet rigorous AI analysis. Professional evaluation platform for entrepreneurs, creators, and innovators." />
      </Head>

      <div className="min-h-screen bg-gray-50 relative">
        {/* Animated Background */}
        <div className="fixed inset-0 z-0">
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'url(/bg11.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(3px)',
              animation: 'drift 45s ease-in-out infinite',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/92 to-white/95" />
        </div>

        {/* Header */}
        <header className="relative z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200 sticky top-0">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-10">
                <Link href="/">
                  <a className="text-2xl font-black tracking-tight">HYOKA</a>
                </Link>
                <nav className="hidden md:flex space-x-8">
                  <Link href="/"><a className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Home</a></Link>
                  <Link href="/explore"><a className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Explore</a></Link>
                  <Link href="/leaderboard"><a className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Leaderboard</a></Link>
                  <Link href="/analytics"><a className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Analytics</a></Link>
                  <Link href="/about"><a className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">About</a></Link>
                </nav>
              </div>
              
              <div className="flex items-center space-x-4">
                <input 
                  type="search" 
                  placeholder="Search ideas..." 
                  className="hidden lg:block w-64 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 transition-colors"
                />
                
                {user ? (
                  <div className="flex items-center space-x-4">
                    <Link href="/dashboard"><a className="text-sm font-medium text-gray-600 hover:text-gray-900">Dashboard</a></Link>
                    <button onClick={handleSignOut} className="text-sm font-medium text-gray-600 hover:text-gray-900">Sign Out</button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <button onClick={() => setShowLoginModal(true)} className="text-sm font-medium text-gray-600 hover:text-gray-900">Login</button>
                    <Link href="/submit">
                      <a className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
                        Submit Idea
                      </a>
                    </Link>
                  </div>
                )}
                
                <button 
                  className="md:hidden p-2"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  <div className="w-5 h-0.5 bg-gray-900 mb-1"></div>
                  <div className="w-5 h-0.5 bg-gray-900 mb-1"></div>
                  <div className="w-5 h-0.5 bg-gray-900"></div>
                </button>
              </div>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 p-4">
              <nav className="flex flex-col space-y-3">
                <Link href="/"><a className="text-sm font-medium text-gray-600">Home</a></Link>
                <Link href="/explore"><a className="text-sm font-medium text-gray-600">Explore</a></Link>
                <Link href="/leaderboard"><a className="text-sm font-medium text-gray-600">Leaderboard</a></Link>
                <Link href="/analytics"><a className="text-sm font-medium text-gray-600">Analytics</a></Link>
                <Link href="/about"><a className="text-sm font-medium text-gray-600">About</a></Link>
              </nav>
            </div>
          )}
        </header>

        <div className="relative z-10 flex">
          {/* Sidebar */}
          <aside className={`${sidebarExpanded ? 'w-80' : 'w-16'} bg-white/90 backdrop-blur-sm border-r border-gray-200 min-h-screen sticky top-16 transition-all duration-300 hidden lg:block`}>
            <button 
              className="absolute -right-3 top-6 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-xs hover:bg-gray-50"
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
            >
              {sidebarExpanded ? '←' : '→'}
            </button>
            
            {sidebarExpanded && (
              <div className="p-6 space-y-8">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <Link href="/submit">
                      <a className="block w-full px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors text-center">
                        Submit New Idea
                      </a>
                    </Link>
                    {!user && (
                      <button 
                        onClick={() => setShowLoginModal(true)}
                        className="w-full px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Join Platform
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">Categories</h3>
                  <div className="relative">
                    <button 
                      onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                      className="w-full flex items-center justify-between px-3 py-2 text-sm text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <span className="font-medium capitalize">{selectedCategory === 'all' ? 'All Categories' : selectedCategory}</span>
                      <svg className={`w-4 h-4 transition-transform ${categoryDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {categoryDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        <button 
                          onClick={() => { setSelectedCategory('all'); setCategoryDropdownOpen(false); }}
                          className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors"
                        >
                          All Categories
                        </button>
                        <button 
                          onClick={() => { setSelectedCategory('business'); setCategoryDropdownOpen(false); }}
                          className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors"
                        >
                          Business
                        </button>
                        <button 
                          onClick={() => { setSelectedCategory('games'); setCategoryDropdownOpen(false); }}
                          className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors"
                        >
                          Games
                        </button>
                        <button 
                          onClick={() => { setSelectedCategory('movies'); setCategoryDropdownOpen(false); }}
                          className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors"
                        >
                          Movies
                        </button>
                        <button 
                          onClick={() => { setSelectedCategory('tech'); setCategoryDropdownOpen(false); }}
                          className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors"
                        >
                          Tech
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center justify-between px-3 py-1 text-sm">
                      <span className="text-gray-600">Total Ideas</span>
                      <span className="font-bold">{ideas.length}</span>
                    </div>
                    <div className="flex items-center justify-between px-3 py-1 text-sm">
                      <span className="text-gray-600">Business</span>
                      <span className="font-bold">{businessIdeas.length}</span>
                    </div>
                    <div className="flex items-center justify-between px-3 py-1 text-sm">
                      <span className="text-gray-600">Games</span>
                      <span className="font-bold">{gamesIdeas.length}</span>
                    </div>
                    <div className="flex items-center justify-between px-3 py-1 text-sm">
                      <span className="text-gray-600">Movies</span>
                      <span className="font-bold">{moviesIdeas.length}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">Previous Month Winners</h3>
                  <div className="space-y-3">
                    <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-lg">🏆</span>
                        <span className="text-xs font-bold text-yellow-700">BUSINESS</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">AI Legal Assistant</p>
                      <p className="text-xs text-gray-600 mt-1">Score: 96 • $2.3M raised</p>
                    </div>
                    <div className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-lg">🥈</span>
                        <span className="text-xs font-bold text-gray-700">GAMES</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">MetaVerse Chess</p>
                      <p className="text-xs text-gray-600 mt-1">Score: 93 • 50K downloads</p>
                    </div>
                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-lg">🥉</span>
                        <span className="text-xs font-bold text-orange-700">MOVIES</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">The Last Algorithm</p>
                      <p className="text-xs text-gray-600 mt-1">Score: 91 • Netflix deal</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">Platform Metrics</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-lg font-bold">47,329</div>
                      <div className="text-xs text-gray-500">Ideas Evaluated</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-lg font-bold">$12.4M</div>
                      <div className="text-xs text-gray-500">Funding Raised</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-lg font-bold">2,847</div>
                      <div className="text-xs text-gray-500">This Month</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-lg font-bold">94.2%</div>
                      <div className="text-xs text-gray-500">Accuracy Rate</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">Live Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 animate-pulse"></div>
                      <span className="text-xs text-gray-600">Neural Trading Bot submitted 2m ago</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 animate-pulse"></div>
                      <span className="text-xs text-gray-600">VR Therapy voted by 12 users</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 animate-pulse"></div>
                      <span className="text-xs text-gray-600">Memory Vault reached top 5</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 animate-pulse"></div>
                      <span className="text-xs text-gray-600">New funding milestone: $12.4M</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </aside>

          {/* Main Content */}
          <main className="flex-1 px-6 py-8">
            {/* Hero Section */}
            <section className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4">
                WHERE BRILLIANT IDEAS
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  MEET AI ANALYSIS
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Professional-grade evaluation platform trusted by entrepreneurs, VCs, and innovators worldwide. 
                Get comprehensive AI analysis of market potential, innovation level, and execution complexity.
              </p>
              
              <div className="flex justify-center space-x-8 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-black">47K+</div>
                  <div className="text-sm text-gray-500">Ideas Analyzed</div>
                </div>
                <div className="w-px bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-3xl font-black">$12.4M</div>
                  <div className="text-sm text-gray-500">Capital Raised</div>
                </div>
                <div className="w-px bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-3xl font-black">94.2%</div>
                  <div className="text-sm text-gray-500">Prediction Accuracy</div>
                </div>
              </div>
            </section>

            {/* Three Column Layout */}
            <section className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">Top Ranked Ideas</h2>
                <select className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400">
                  <option>Sort by AI Score</option>
                  <option>Sort by Public Score</option>
                  <option>Sort by Recent</option>
                  <option>Sort by Funding Potential</option>
                </select>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Business Column */}
                <div>
                  <div className="mb-4 pb-2 border-b-2 border-gray-900">
                    <h3 className="text-lg font-bold uppercase tracking-wide">Business</h3>
                  </div>
                  <div className="space-y-4">
                    {businessIdeas.map((idea) => (
                      <div key={idea.id} className="bg-white/95 backdrop-blur-sm rounded-lg border border-gray-200 p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-xs font-bold text-red-600">#{idea.rank}</span>
                              <h4 className="font-bold text-base">{idea.title}</h4>
                            </div>
                            <p className="text-xs text-gray-500">{idea.author} • {idea.genre}</p>
                          </div>
                          <div className="text-right ml-3">
                            <div className="text-2xl font-black" style={{ color: getScoreColor(idea.aiScore) }}>{idea.aiScore}</div>
                            <div className="text-xs text-gray-500">AI Score</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 mb-3">
                          <div className="text-center py-2 bg-gray-50 rounded">
                            <div className="text-sm font-bold" style={{ color: getScoreColor(idea.marketScore) }}>{idea.marketScore}</div>
                            <div className="text-xs text-gray-500">Market</div>
                          </div>
                          <div className="text-center py-2 bg-gray-50 rounded">
                            <div className="text-sm font-bold" style={{ color: getScoreColor(idea.innovationScore) }}>{idea.innovationScore}</div>
                            <div className="text-xs text-gray-500">Innovation</div>
                          </div>
                          <div className="text-center py-2 bg-gray-50 rounded">
                            <div className="text-sm font-bold" style={{ color: getScoreColor(idea.executionScore) }}>{idea.executionScore}</div>
                            <div className="text-xs text-gray-500">Execution</div>
                          </div>
                        </div>
                        
                        {expandedCards.has(idea.id) && (
                          <div className="pt-3 border-t border-gray-100">
                            <p className="text-sm text-gray-600 leading-relaxed mb-3">{idea.desc}</p>
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-xs text-gray-500">{idea.publicVotes} votes</span>
                              <span className="text-xs font-medium text-gray-700">Public Rating: {idea.publicScore.toFixed(1)}/10</span>
                            </div>
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleVote(idea.id)}
                                className="flex-1 px-3 py-1.5 bg-green-500 text-white text-xs font-medium rounded hover:bg-green-600 transition-colors"
                              >
                                Support
                              </button>
                              <button className="flex-1 px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded hover:bg-gray-200 transition-colors">
                                Share
                              </button>
                            </div>
                          </div>
                        )}
                        
                        <button 
                          onClick={() => toggleExpanded(idea.id)}
                          className="mt-3 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          {expandedCards.has(idea.id) ? '← Show Less' : 'View Details →'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Games Column */}
                <div>
                  <div className="mb-4 pb-2 border-b-2 border-gray-900">
                    <h3 className="text-lg font-bold uppercase tracking-wide">Games</h3>
                  </div>
                  <div className="space-y-4">
                    {gamesIdeas.map((idea) => (
                      <div key={idea.id} className="bg-white/95 backdrop-blur-sm rounded-lg border border-gray-200 p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-xs font-bold text-red-600">#{idea.rank}</span>
                              <h4 className="font-bold text-base">{idea.title}</h4>
                            </div>
                            <p className="text-xs text-gray-500">{idea.author} • {idea.genre}</p>
                          </div>
                          <div className="text-right ml-3">
                            <div className="text-2xl font-black" style={{ color: getScoreColor(idea.aiScore) }}>{idea.aiScore}</div>
                            <div className="text-xs text-gray-500">AI Score</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 mb-3">
                          <div className="text-center py-2 bg-gray-50 rounded">
                            <div className="text-sm font-bold" style={{ color: getScoreColor(idea.marketScore) }}>{idea.marketScore}</div>
                            <div className="text-xs text-gray-500">Market</div>
                          </div>
                          <div className="text-center py-2 bg-gray-50 rounded">
                            <div className="text-sm font-bold" style={{ color: getScoreColor(idea.innovationScore) }}>{idea.innovationScore}</div>
                            <div className="text-xs text-gray-500">Innovation</div>
                          </div>
                          <div className="text-center py-2 bg-gray-50 rounded">
                            <div className="text-sm font-bold" style={{ color: getScoreColor(idea.executionScore) }}>{idea.executionScore}</div>
                            <div className="text-xs text-gray-500">Execution</div>
                          </div>
                        </div>
                        
                        {expandedCards.has(idea.id) && (
                          <div className="pt-3 border-t border-gray-100">
                            <p className="text-sm text-gray-600 leading-relaxed mb-3">{idea.desc}</p>
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-xs text-gray-500">{idea.publicVotes} votes</span>
                              <span className="text-xs font-medium text-gray-700">Public Rating: {idea.publicScore.toFixed(1)}/10</span>
                            </div>
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleVote(idea.id)}
                                className="flex-1 px-3 py-1.5 bg-green-500 text-white text-xs font-medium rounded hover:bg-green-600 transition-colors"
                              >
                                Support
                              </button>
                              <button className="flex-1 px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded hover:bg-gray-200 transition-colors">
                                Share
                              </button>
                            </div>
                          </div>
                        )}
                        
                        <button 
                          onClick={() => toggleExpanded(idea.id)}
                          className="mt-3 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          {expandedCards.has(idea.id) ? '← Show Less' : 'View Details →'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Movies Column */}
                <div>
                  <div className="mb-4 pb-2 border-b-2 border-gray-900">
                    <h3 className="text-lg font-bold uppercase tracking-wide">Movies</h3>
                  </div>
                  <div className="space-y-4">
                    {moviesIdeas.map((idea) => (
                      <div key={idea.id} className="bg-white/95 backdrop-blur-sm rounded-lg border border-gray-200 p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-xs font-bold text-red-600">#{idea.rank}</span>
                              <h4 className="font-bold text-base">{idea.title}</h4>
                            </div>
                            <p className="text-xs text-gray-500">{idea.author} • {idea.genre}</p>
                          </div>
                          <div className="text-right ml-3">
                            <div className="text-2xl font-black" style={{ color: getScoreColor(idea.aiScore) }}>{idea.aiScore}</div>
                            <div className="text-xs text-gray-500">AI Score</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 mb-3">
                          <div className="text-center py-2 bg-gray-50 rounded">
                            <div className="text-sm font-bold" style={{ color: getScoreColor(idea.marketScore) }}>{idea.marketScore}</div>
                            <div className="text-xs text-gray-500">Market</div>
                          </div>
                          <div className="text-center py-2 bg-gray-50 rounded">
                            <div className="text-sm font-bold" style={{ color: getScoreColor(idea.innovationScore) }}>{idea.innovationScore}</div>
                            <div className="text-xs text-gray-500">Innovation</div>
                          </div>
                          <div className="text-center py-2 bg-gray-50 rounded">
                            <div className="text-sm font-bold" style={{ color: getScoreColor(idea.executionScore) }}>{idea.executionScore}</div>
                            <div className="text-xs text-gray-500">Execution</div>
                          </div>
                        </div>
                        
                        {expandedCards.has(idea.id) && (
                          <div className="pt-3 border-t border-gray-100">
                            <p className="text-sm text-gray-600 leading-relaxed mb-3">{idea.desc}</p>
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-xs text-gray-500">{idea.publicVotes} votes</span>
                              <span className="text-xs font-medium text-gray-700">Public Rating: {idea.publicScore.toFixed(1)}/10</span>
                            </div>
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleVote(idea.id)}
                                className="flex-1 px-3 py-1.5 bg-green-500 text-white text-xs font-medium rounded hover:bg-green-600 transition-colors"
                              >
                                Support
                              </button>
                              <button className="flex-1 px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded hover:bg-gray-200 transition-colors">
                                Share
                              </button>
                            </div>
                          </div>
                        )}
                        
                        <button 
                          onClick={() => toggleExpanded(idea.id)}
                          className="mt-3 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          {expandedCards.has(idea.id) ? '← Show Less' : 'View Details →'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* How It Works */}
            <section className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 p-8 mb-12">
              <h2 className="text-2xl font-bold mb-8 text-center">Advanced AI Evaluation Process</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold mx-auto mb-4">01</div>
                  <h3 className="font-bold mb-2">Idea Submission</h3>
                  <p className="text-sm text-gray-600">Submit your concept through our streamlined interface with detailed descriptions and market context.</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold mx-auto mb-4">02</div>
                  <h3 className="font-bold mb-2">Multi-Model Analysis</h3>
                  <p className="text-sm text-gray-600">Advanced neural networks analyze market signals, innovation patterns, and execution complexity.</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold mx-auto mb-4">03</div>
                  <h3 className="font-bold mb-2">Community Validation</h3>
                  <p className="text-sm text-gray-600">Expert community provides additional validation through structured feedback and peer review.</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold mx-auto mb-4">04</div>
                  <h3 className="font-bold mb-2">Comprehensive Report</h3>
                  <p className="text-sm text-gray-600">Receive detailed analysis including opportunities, competitive landscape, and actionable next steps.</p>
                </div>
              </div>
            </section>

            {/* Platform Statistics */}
            <section className="text-center">
              <h2 className="text-2xl font-bold mb-8">Platform Impact</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 p-6">
                  <div className="text-3xl font-black mb-1">47,329</div>
                  <div className="text-sm text-gray-600 mb-1">Ideas Evaluated</div>
                  <div className="text-xs text-green-600 font-medium">↑ 23% this month</div>
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 p-6">
                  <div className="text-3xl font-black mb-1">$12.4M</div>
                  <div className="text-sm text-gray-600 mb-1">Total Funding Raised</div>
                  <div className="text-xs text-green-600 font-medium">↑ 156% this quarter</div>
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 p-6">
                  <div className="text-3xl font-black mb-1">94.2%</div>
                  <div className="text-sm text-gray-600 mb-1">Prediction Accuracy</div>
                  <div className="text-xs text-green-600 font-medium">Industry leading</div>
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 p-6">
                  <div className="text-3xl font-black mb-1">18,500</div>
                  <div className="text-sm text-gray-600 mb-1">Active Users</div>
                  <div className="text-xs text-green-600 font-medium">↑ 34% this month</div>
                </div>
              </div>
            </section>
          </main>
        </div>

        {/* Footer */}
        <footer className="relative z-10 bg-gray-900 text-white mt-20">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-2xl font-black mb-4">HYOKA</h3>
                <p className="text-sm text-gray-400">Professional AI-powered idea evaluation platform for entrepreneurs and innovators.</p>
                <div className="flex space-x-4 mt-4">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
              </div>
              
              <div>
                <h4 className="font-bold mb-4">Platform</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">How it Works</a></li>
                  <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                  <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Success Stories</a></li>
                  <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">API Access</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold mb-4">Resources</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                  <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Community</a></li>
                  <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Support</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold mb-4">Company</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">About Us</a></li>
                  <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Careers</a></li>
                  <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 text-center">
              <p className="text-sm text-gray-400">© 2024 Hyoka. All rights reserved. Powered by advanced AI technology.</p>
            </div>
          </div>
        </footer>

        {/* Login Modal */}
        {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
      </div>

      <style jsx global>{`
        @keyframes drift {
          0%, 100% {
            transform: translateX(0) translateY(0) scale(1);
          }
          25% {
            transform: translateX(-20px) translateY(-15px) scale(1.01);
          }
          50% {
            transform: translateX(15px) translateY(-25px) scale(1.02);
          }
          75% {
            transform: translateX(-15px) translateY(10px) scale(1.01);
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
  
  const handleSubmit = async (e: any) => {
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
        >
          ×
        </button>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors"
            required
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSubmit(e)
              }
            }}
          />
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-600">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="ml-1 text-gray-900 font-medium hover:underline"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  )
}
