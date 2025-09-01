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
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())

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
        limit(15)
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
    // Business Ideas
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
    // Games Ideas
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
    // Movies Ideas
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

  const businessIdeas = ideas.filter(idea => idea.type === 'business').slice(0, 5)
  const gamesIdeas = ideas.filter(idea => idea.type === 'games').slice(0, 5)
  const moviesIdeas = ideas.filter(idea => idea.type === 'movies').slice(0, 5)

  const handleSignOut = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <>
      <Head>
        <title>Hyoka - AI-Powered Idea Evaluation Platform</title>
        <meta name="description" content="Professional AI evaluation platform for entrepreneurs, creators, and innovators." />
      </Head>

      <div className="min-h-screen bg-gray-50 relative overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 z-0">
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'url(/bg1.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(8px)',
              animation: 'drift 60s ease-in-out infinite',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/85 to-white/95" />
        </div>

        {/* Header */}
        <header className="relative z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 h-16">
            <div className="flex items-center justify-between h-full">
              <div className="flex items-center space-x-8">
                <Link href="/">
                  <a className="text-2xl font-black tracking-tight text-gray-900">HYOKA</a>
                </Link>
                <nav className="hidden md:flex space-x-6">
                  <Link href="/explore"><a className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Explore</a></Link>
                  <Link href="/leaderboard"><a className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Leaderboard</a></Link>
                  <Link href="/analytics"><a className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Analytics</a></Link>
                </nav>
              </div>
              
              <div className="flex items-center space-x-4">
                {user ? (
                  <>
                    <Link href="/dashboard">
                      <a className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Dashboard</a>
                    </Link>
                    <button 
                      onClick={handleSignOut}
                      className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => setShowLoginModal(true)}
                      className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Login
                    </button>
                    <Link href="/submit">
                      <a className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
                        Submit Idea
                      </a>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative z-10">
          {/* Hero Section */}
          <section className="pt-24 pb-12 px-6">
            <div className="max-w-7xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-black tracking-tight text-gray-900 mb-6">
                AI-POWERED IDEA EVALUATION
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
                Professional-grade analysis platform trusted by entrepreneurs and innovators worldwide.
              </p>
              
              <div className="flex justify-center space-x-12 mb-16">
                <div className="text-center">
                  <div className="text-3xl font-black text-gray-900">47K+</div>
                  <div className="text-sm text-gray-500 mt-1">Ideas Analyzed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-gray-900">94.2%</div>
                  <div className="text-sm text-gray-500 mt-1">Accuracy Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-gray-900">$12.4M</div>
                  <div className="text-sm text-gray-500 mt-1">Funding Raised</div>
                </div>
              </div>
            </div>
          </section>

          {/* Three Column Layout */}
          <section className="px-6 pb-24">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Business Column */}
                <div>
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Business</h2>
                    <div className="mt-2 h-1 w-12 bg-gray-900"></div>
                  </div>
                  <div className="space-y-4">
                    {businessIdeas.map((idea) => (
                      <div key={idea.id} className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-bold text-gray-900 text-base">{idea.title}</h3>
                            <p className="text-xs text-gray-500 mt-1">{idea.author} • {idea.genre}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-black text-gray-900">{idea.aiScore}</div>
                            <div className="text-xs text-gray-500">AI Score</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 mb-3">
                          <div className="text-center py-2 bg-gray-50 rounded">
                            <div className="text-sm font-bold text-gray-700">{idea.marketScore}</div>
                            <div className="text-xs text-gray-500">Market</div>
                          </div>
                          <div className="text-center py-2 bg-gray-50 rounded">
                            <div className="text-sm font-bold text-gray-700">{idea.innovationScore}</div>
                            <div className="text-xs text-gray-500">Innovation</div>
                          </div>
                          <div className="text-center py-2 bg-gray-50 rounded">
                            <div className="text-sm font-bold text-gray-700">{idea.executionScore}</div>
                            <div className="text-xs text-gray-500">Execution</div>
                          </div>
                        </div>
                        
                        {expandedCards.has(idea.id) && (
                          <div className="pt-3 border-t border-gray-100">
                            <p className="text-sm text-gray-600 leading-relaxed">{idea.desc}</p>
                            <div className="mt-3 flex items-center justify-between">
                              <span className="text-xs text-gray-500">{idea.publicVotes} votes</span>
                              <span className="text-xs font-medium text-gray-700">Rating: {idea.publicScore.toFixed(1)}/10</span>
                            </div>
                          </div>
                        )}
                        
                        <button 
                          onClick={() => toggleExpanded(idea.id)}
                          className="mt-3 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          {expandedCards.has(idea.id) ? 'Show Less' : 'View Details'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Games Column */}
                <div>
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Games</h2>
                    <div className="mt-2 h-1 w-12 bg-gray-900"></div>
                  </div>
                  <div className="space-y-4">
                    {gamesIdeas.map((idea) => (
                      <div key={idea.id} className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-bold text-gray-900 text-base">{idea.title}</h3>
                            <p className="text-xs text-gray-500 mt-1">{idea.author} • {idea.genre}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-black text-gray-900">{idea.aiScore}</div>
                            <div className="text-xs text-gray-500">AI Score</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 mb-3">
                          <div className="text-center py-2 bg-gray-50 rounded">
                            <div className="text-sm font-bold text-gray-700">{idea.marketScore}</div>
                            <div className="text-xs text-gray-500">Market</div>
                          </div>
                          <div className="text-center py-2 bg-gray-50 rounded">
                            <div className="text-sm font-bold text-gray-700">{idea.innovationScore}</div>
                            <div className="text-xs text-gray-500">Innovation</div>
                          </div>
                          <div className="text-center py-2 bg-gray-50 rounded">
                            <div className="text-sm font-bold text-gray-700">{idea.executionScore}</div>
                            <div className="text-xs text-gray-500">Execution</div>
                          </div>
                        </div>
                        
                        {expandedCards.has(idea.id) && (
                          <div className="pt-3 border-t border-gray-100">
                            <p className="text-sm text-gray-600 leading-relaxed">{idea.desc}</p>
                            <div className="mt-3 flex items-center justify-between">
                              <span className="text-xs text-gray-500">{idea.publicVotes} votes</span>
                              <span className="text-xs font-medium text-gray-700">Rating: {idea.publicScore.toFixed(1)}/10</span>
                            </div>
                          </div>
                        )}
                        
                        <button 
                          onClick={() => toggleExpanded(idea.id)}
                          className="mt-3 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          {expandedCards.has(idea.id) ? 'Show Less' : 'View Details'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Movies Column */}
                <div>
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Movies</h2>
                    <div className="mt-2 h-1 w-12 bg-gray-900"></div>
                  </div>
                  <div className="space-y-4">
                    {moviesIdeas.map((idea) => (
                      <div key={idea.id} className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-bold text-gray-900 text-base">{idea.title}</h3>
                            <p className="text-xs text-gray-500 mt-1">{idea.author} • {idea.genre}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-black text-gray-900">{idea.aiScore}</div>
                            <div className="text-xs text-gray-500">AI Score</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 mb-3">
                          <div className="text-center py-2 bg-gray-50 rounded">
                            <div className="text-sm font-bold text-gray-700">{idea.marketScore}</div>
                            <div className="text-xs text-gray-500">Market</div>
                          </div>
                          <div className="text-center py-2 bg-gray-50 rounded">
                            <div className="text-sm font-bold text-gray-700">{idea.innovationScore}</div>
                            <div className="text-xs text-gray-500">Innovation</div>
                          </div>
                          <div className="text-center py-2 bg-gray-50 rounded">
                            <div className="text-sm font-bold text-gray-700">{idea.executionScore}</div>
                            <div className="text-xs text-gray-500">Execution</div>
                          </div>
                        </div>
                        
                        {expandedCards.has(idea.id) && (
                          <div className="pt-3 border-t border-gray-100">
                            <p className="text-sm text-gray-600 leading-relaxed">{idea.desc}</p>
                            <div className="mt-3 flex items-center justify-between">
                              <span className="text-xs text-gray-500">{idea.publicVotes} votes</span>
                              <span className="text-xs font-medium text-gray-700">Rating: {idea.publicScore.toFixed(1)}/10</span>
                            </div>
                          </div>
                        )}
                        
                        <button 
                          onClick={() => toggleExpanded(idea.id)}
                          className="mt-3 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          {expandedCards.has(idea.id) ? 'Show Less' : 'View Details'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </section>
        </main>

        {/* Login Modal */}
        {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
      </div>

      <style jsx global>{`
        @keyframes drift {
          0%, 100% {
            transform: translateX(0) translateY(0) scale(1);
          }
          25% {
            transform: translateX(-30px) translateY(-20px) scale(1.02);
          }
          50% {
            transform: translateX(20px) translateY(-40px) scale(1.04);
          }
          75% {
            transform: translateX(-20px) translateY(10px) scale(1.02);
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
