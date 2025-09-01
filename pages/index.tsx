import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { onAuthStateChanged, User, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'

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

const mockIdeas: Idea[] = [
  // Business Ideas (6)
  {
    id: '1', rank: 1, title: 'Neural Market Predictor', type: 'business', genre: 'Fintech', author: 'Dr. Sarah Chen',
    desc: 'AI-powered platform that analyzes 10,000+ market signals in real-time to predict price movements with 89% accuracy.',
    aiScore: 94, marketScore: 96, innovationScore: 92, executionScore: 89, publicScore: 9.2, publicVotes: 847, timestamp: '2024-01-28'
  },
  {
    id: '5', rank: 5, title: 'EcoChain Network', type: 'business', genre: 'B2B Tools', author: 'James Foster',
    desc: 'Blockchain-based carbon credit marketplace with IoT verification for transparent carbon trading.',
    aiScore: 85, marketScore: 88, innovationScore: 84, executionScore: 83, publicScore: 8.3, publicVotes: 756, timestamp: '2024-01-24'
  },
  {
    id: '9', rank: 9, title: 'MediSync AI', type: 'business', genre: 'Healthcare', author: 'Dr. Anna Kim',
    desc: 'Medical records synchronization platform using NLP to standardize patient data across healthcare systems.',
    aiScore: 82, marketScore: 90, innovationScore: 78, executionScore: 85, publicScore: 8.7, publicVotes: 523, timestamp: '2024-01-20'
  },
  {
    id: '10', rank: 10, title: 'RetailFlow Analytics', type: 'business', genre: 'E-commerce', author: 'Marcus Thompson',
    desc: 'Real-time retail optimization platform using computer vision and predictive analytics.',
    aiScore: 78, marketScore: 85, innovationScore: 72, executionScore: 80, publicScore: 7.9, publicVotes: 412, timestamp: '2024-01-19'
  },
  {
    id: '11', rank: 11, title: 'SupplyChain Oracle', type: 'business', genre: 'B2B Tools', author: 'Lisa Wang',
    desc: 'Predictive supply chain management system anticipating disruptions 3-6 months in advance.',
    aiScore: 76, marketScore: 82, innovationScore: 74, executionScore: 77, publicScore: 7.5, publicVotes: 389, timestamp: '2024-01-18'
  },
  {
    id: '18', rank: 18, title: 'QuantumSecure Banking', type: 'business', genre: 'Fintech', author: 'Dr. Robert Chen',
    desc: 'Next-generation banking security platform using quantum encryption and biometric authentication.',
    aiScore: 73, marketScore: 88, innovationScore: 95, executionScore: 62, publicScore: 8.1, publicVotes: 298, timestamp: '2024-01-11'
  },
  // Games Ideas (6)
  {
    id: '2', rank: 2, title: 'Quantum Chess Arena', type: 'games', genre: 'Strategy', author: 'Marcus Webb',
    desc: 'Revolutionary chess variant where pieces exist in quantum superposition states until observed.',
    aiScore: 91, marketScore: 85, innovationScore: 98, executionScore: 88, publicScore: 8.9, publicVotes: 623, timestamp: '2024-01-27'
  },
  {
    id: '6', rank: 6, title: 'Neural VR Therapy', type: 'games', genre: 'VR/AR', author: 'Dr. Lisa Park',
    desc: 'Immersive VR platform for treating PTSD, anxiety, and phobias through controlled exposure therapy.',
    aiScore: 83, marketScore: 79, innovationScore: 89, executionScore: 81, publicScore: 8.8, publicVotes: 567, timestamp: '2024-01-23'
  },
  {
    id: '12', rank: 12, title: 'Echo Wars Mobile', type: 'games', genre: 'Mobile', author: 'Alex Rivera',
    desc: 'Asymmetric multiplayer strategy game where sound-based combat mechanics create unique tactical gameplay.',
    aiScore: 79, marketScore: 83, innovationScore: 86, executionScore: 75, publicScore: 8.1, publicVotes: 445, timestamp: '2024-01-17'
  },
  {
    id: '13', rank: 13, title: 'Dreamscape Builder', type: 'games', genre: 'Indie', author: 'Sophie Chen',
    desc: 'Surreal puzzle-platformer where players manipulate dream logic to solve environmental challenges.',
    aiScore: 77, marketScore: 72, innovationScore: 88, executionScore: 70, publicScore: 8.4, publicVotes: 367, timestamp: '2024-01-16'
  },
  {
    id: '14', rank: 14, title: 'Civilization Nexus', type: 'games', genre: 'PC/Console', author: 'David Kim',
    desc: 'Grand strategy game spanning 10,000 years of alternative history with branching timelines.',
    aiScore: 75, marketScore: 78, innovationScore: 82, executionScore: 73, publicScore: 7.8, publicVotes: 334, timestamp: '2024-01-15'
  },
  {
    id: '19', rank: 19, title: 'Mindforge Arena', type: 'games', genre: 'Mobile', author: 'Jake Martinez',
    desc: 'Competitive puzzle-battle game where players create spells by solving logic puzzles in real-time.',
    aiScore: 71, marketScore: 76, innovationScore: 79, executionScore: 74, publicScore: 7.6, publicVotes: 256, timestamp: '2024-01-10'
  },
  // Movies Ideas (6)
  {
    id: '3', rank: 3, title: 'Memory Vault', type: 'movies', genre: 'Sci-Fi', author: 'Elena Rodriguez',
    desc: 'In 2090, memories are extracted and stored as digital assets in a world where identity is fluid.',
    aiScore: 89, marketScore: 91, innovationScore: 86, executionScore: 90, publicScore: 8.7, publicVotes: 1203, timestamp: '2024-01-26'
  },
  {
    id: '7', rank: 7, title: 'The Algorithm War', type: 'movies', genre: 'Thriller', author: 'David Zhang',
    desc: 'Corporate espionage thriller where tech companies wage secret battles through AI algorithms.',
    aiScore: 81, marketScore: 84, innovationScore: 78, executionScore: 82, publicScore: 8.1, publicVotes: 892, timestamp: '2024-01-22'
  },
  {
    id: '15', rank: 15, title: 'Last Light', type: 'movies', genre: 'Drama', author: 'Michael Foster',
    desc: 'Character-driven drama following three lighthouse keepers in 1890s Maine during a month-long storm.',
    aiScore: 80, marketScore: 76, innovationScore: 73, executionScore: 85, publicScore: 8.5, publicVotes: 678, timestamp: '2024-01-14'
  },
  {
    id: '16', rank: 16, title: 'The Architect', type: 'movies', genre: 'Horror', author: 'Sarah Black',
    desc: 'Psychological horror about an architect whose buildings manifest in a parallel dimension.',
    aiScore: 74, marketScore: 79, innovationScore: 81, executionScore: 76, publicScore: 7.6, publicVotes: 456, timestamp: '2024-01-13'
  },
  {
    id: '17', rank: 17, title: 'Echoes of Tomorrow', type: 'movies', genre: 'Animation', author: 'Jun Takahashi',
    desc: 'Animated epic where a young musician can alter the future by composing timeline-resonant songs.',
    aiScore: 72, marketScore: 75, innovationScore: 85, executionScore: 68, publicScore: 8.2, publicVotes: 523, timestamp: '2024-01-12'
  },
  {
    id: '20', rank: 20, title: 'Digital Prophets', type: 'movies', genre: 'Documentary', author: 'Amanda Lee',
    desc: 'Documentary exploring the rise of AI-generated religions and digital cults in 2080s.',
    aiScore: 70, marketScore: 73, innovationScore: 77, executionScore: 78, publicScore: 7.4, publicVotes: 189, timestamp: '2024-01-09'
  }
]

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
    setIdeas(mockIdeas)
    setLoading(false)
  }, [])

  const businessIdeas = ideas.filter(idea => idea.type === 'business')
  const gamesIdeas = ideas.filter(idea => idea.type === 'games')
  const moviesIdeas = ideas.filter(idea => idea.type === 'movies')

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

  const handleSignOut = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-yellow-500'
    return 'text-red-500'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 mb-2">Loading Hyoka...</div>
          <div className="text-gray-600">Preparing your idea evaluation platform</div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Hyoka - Professional AI Idea Evaluation Platform</title>
        <meta name="description" content="Where brilliant ideas meet rigorous AI analysis." />
      </Head>

      <div className="min-h-screen bg-gray-50 relative">
        {/* Background Image */}
        <div 
          className="fixed inset-0 z-0 opacity-20"
          style={{
            backgroundImage: 'url("/bg11.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(3px)',
          }}
        />
        <div className="fixed inset-0 z-0 bg-gradient-to-b from-white/95 via-white/92 to-white/95" />

        {/* Header */}
        <header className="relative z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200 sticky top-0">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-10">
                <Link href="/">
                  <a className="text-2xl font-black tracking-tight">HYOKA</a>
                </Link>
                <nav className="hidden md:flex space-x-8">
                  <Link href="/"><a className="text-sm font-medium text-gray-600 hover:text-gray-900">Home</a></Link>
                  <Link href="/explore"><a className="text-sm font-medium text-gray-600 hover:text-gray-900">Explore</a></Link>
                  <Link href="/leaderboard"><a className="text-sm font-medium text-gray-600 hover:text-gray-900">Leaderboard</a></Link>
                </nav>
              </div>
              
              <div className="flex items-center space-x-4">
                {user ? (
                  <>
                    <Link href="/dashboard"><a className="text-sm font-medium text-gray-600 hover:text-gray-900">Dashboard</a></Link>
                    <button onClick={handleSignOut} className="text-sm font-medium text-gray-600 hover:text-gray-900">Sign Out</button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => setShowLoginModal(true)} 
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Login
                    </button>
                    <Link href="/submit">
                      <a className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800">
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
        <main className="relative z-10 px-6 py-8">
          <section className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4">
              WHERE BRILLIANT IDEAS
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                MEET AI ANALYSIS
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional-grade evaluation platform trusted by entrepreneurs, VCs, and innovators worldwide.
            </p>
          </section>

          {/* Three Column Layout */}
          <section className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">Top Ranked Ideas</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Business Column */}
              <div>
                <div className="mb-4 pb-2 border-b-2 border-gray-900">
                  <h3 className="text-lg font-bold uppercase">Business ({businessIdeas.length})</h3>
                </div>
                <div className="space-y-4">
                  {businessIdeas.slice(0, 5).map((idea) => (
                    <div key={idea.id} className="bg-white/95 backdrop-blur-sm rounded-lg border border-gray-200 p-5 hover:shadow-xl transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-base">{idea.title}</h4>
                          <p className="text-xs text-gray-500">{idea.author} • {idea.genre}</p>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-black ${getScoreColor(idea.aiScore)}`}>{idea.aiScore}</div>
                          <div className="text-xs text-gray-500">AI Score</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <div className="text-center py-2 bg-gray-50 rounded">
                          <div className={`text-sm font-bold ${getScoreColor(idea.marketScore)}`}>{idea.marketScore}</div>
                          <div className="text-xs text-gray-500">Market</div>
                        </div>
                        <div className="text-center py-2 bg-gray-50 rounded">
                          <div className={`text-sm font-bold ${getScoreColor(idea.innovationScore)}`}>{idea.innovationScore}</div>
                          <div className="text-xs text-gray-500">Innovation</div>
                        </div>
                        <div className="text-center py-2 bg-gray-50 rounded">
                          <div className={`text-sm font-bold ${getScoreColor(idea.executionScore)}`}>{idea.executionScore}</div>
                          <div className="text-xs text-gray-500">Execution</div>
                        </div>
                      </div>
                      
                      {expandedCards.has(idea.id) && (
                        <div className="pt-3 border-t border-gray-100">
                          <p className="text-sm text-gray-600 mb-3">{idea.desc}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">{idea.publicVotes} votes</span>
                            <span className="text-xs font-medium text-gray-700">Rating: {idea.publicScore.toFixed(1)}/10</span>
                          </div>
                        </div>
                      )}
                      
                      <button 
                        onClick={() => toggleExpanded(idea.id)}
                        className="mt-3 text-xs font-medium text-blue-600 hover:text-blue-700"
                      >
                        {expandedCards.has(idea.id) ? 'Show Less' : 'View Details'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Games Column */}
              <div>
                <div className="mb-4 pb-2 border-b-2 border-gray-900">
                  <h3 className="text-lg font-bold uppercase">Games ({gamesIdeas.length})</h3>
                </div>
                <div className="space-y-4">
                  {gamesIdeas.slice(0, 5).map((idea) => (
                    <div key={idea.id} className="bg-white/95 backdrop-blur-sm rounded-lg border border-gray-200 p-5 hover:shadow-xl transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-base">{idea.title}</h4>
                          <p className="text-xs text-gray-500">{idea.author} • {idea.genre}</p>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-black ${getScoreColor(idea.aiScore)}`}>{idea.aiScore}</div>
                          <div className="text-xs text-gray-500">AI Score</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <div className="text-center py-2 bg-gray-50 rounded">
                          <div className={`text-sm font-bold ${getScoreColor(idea.marketScore)}`}>{idea.marketScore}</div>
                          <div className="text-xs text-gray-500">Market</div>
                        </div>
                        <div className="text-center py-2 bg-gray-50 rounded">
                          <div className={`text-sm font-bold ${getScoreColor(idea.innovationScore)}`}>{idea.innovationScore}</div>
                          <div className="text-xs text-gray-500">Innovation</div>
                        </div>
                        <div className="text-center py-2 bg-gray-50 rounded">
                          <div className={`text-sm font-bold ${getScoreColor(idea.executionScore)}`}>{idea.executionScore}</div>
                          <div className="text-xs text-gray-500">Execution</div>
                        </div>
                      </div>
                      
                      {expandedCards.has(idea.id) && (
                        <div className="pt-3 border-t border-gray-100">
                          <p className="text-sm text-gray-600 mb-3">{idea.desc}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">{idea.publicVotes} votes</span>
                            <span className="text-xs font-medium text-gray-700">Rating: {idea.publicScore.toFixed(1)}/10</span>
                          </div>
                        </div>
                      )}
                      
                      <button 
                        onClick={() => toggleExpanded(idea.id)}
                        className="mt-3 text-xs font-medium text-blue-600 hover:text-blue-700"
                      >
                        {expandedCards.has(idea.id) ? 'Show Less' : 'View Details'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Movies Column */}
              <div>
                <div className="mb-4 pb-2 border-b-2 border-gray-900">
                  <h3 className="text-lg font-bold uppercase">Movies ({moviesIdeas.length})</h3>
                </div>
                <div className="space-y-4">
                  {moviesIdeas.slice(0, 5).map((idea) => (
                    <div key={idea.id} className="bg-white/95 backdrop-blur-sm rounded-lg border border-gray-200 p-5 hover:shadow-xl transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-base">{idea.title}</h4>
                          <p className="text-xs text-gray-500">{idea.author} • {idea.genre}</p>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-black ${getScoreColor(idea.aiScore)}`}>{idea.aiScore}</div>
                          <div className="text-xs text-gray-500">AI Score</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <div className="text-center py-2 bg-gray-50 rounded">
                          <div className={`text-sm font-bold ${getScoreColor(idea.marketScore)}`}>{idea.marketScore}</div>
                          <div className="text-xs text-gray-500">Market</div>
                        </div>
                        <div className="text-center py-2 bg-gray-50 rounded">
                          <div className={`text-sm font-bold ${getScoreColor(idea.innovationScore)}`}>{idea.innovationScore}</div>
                          <div className="text-xs text-gray-500">Innovation</div>
                        </div>
                        <div className="text-center py-2 bg-gray-50 rounded">
                          <div className={`text-sm font-bold ${getScoreColor(idea.executionScore)}`}>{idea.executionScore}</div>
                          <div className="text-xs text-gray-500">Execution</div>
                        </div>
                      </div>
                      
                      {expandedCards.has(idea.id) && (
                        <div className="pt-3 border-t border-gray-100">
                          <p className="text-sm text-gray-600 mb-3">{idea.desc}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">{idea.publicVotes} votes</span>
                            <span className="text-xs font-medium text-gray-700">Rating: {idea.publicScore.toFixed(1)}/10</span>
                          </div>
                        </div>
                      )}
                      
                      <button 
                        onClick={() => toggleExpanded(idea.id)}
                        className="mt-3 text-xs font-medium text-blue-600 hover:text-blue-700"
                      >
                        {expandedCards.has(idea.id) ? 'Show Less' : 'View Details'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="relative z-10 bg-gray-900 text-white mt-20">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="text-center">
              <h3 className="text-2xl font-black mb-4">HYOKA</h3>
              <p className="text-sm text-gray-400">© 2024 Hyoka. All rights reserved.</p>
            </div>
          </div>
        </footer>

        {/* Login Modal */}
        {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
      </div>
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
  
  const handleSubmit = async () => {
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
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
          />
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50"
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
