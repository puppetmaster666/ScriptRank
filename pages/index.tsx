// pages/index.tsx - BOLD AGGRESSIVE DESIGN WITH ALL FEATURES
import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'

interface IdeaPreview {
  id: string
  title: string
  type: string
  genre?: string
  industry?: string
  content: string
  targetAudience?: string
  uniqueValue?: string
  aiScore?: number
  aiScores?: {
    overall: number
    market: number
    innovation: number
    execution: number
    verdict?: string
    marketFeedback?: string
    innovationFeedback?: string
    executionFeedback?: string
    investmentStatus?: 'INVEST' | 'PASS' | 'MAYBE'
  }
  publicScore?: {
    average: number
    count: number
    sum?: number
  }
  creatorName: string
  userName?: string
  username?: string
}

export default function HomePage() {
  const [topIdeas, setTopIdeas] = useState<IdeaPreview[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [timeFilter, setTimeFilter] = useState('week')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    fetchTopIdeas()
  }, [])

  useEffect(() => {
    fetchTopIdeas()
  }, [activeTab, timeFilter])

  const fetchTopIdeas = async () => {
    setLoading(true)
    try {
      const ideasRef = collection(db, 'ideas')
      let allIdeas: IdeaPreview[] = []
      
      try {
        const q1 = query(ideasRef, orderBy('aiScores.overall', 'desc'), limit(20))
        const snapshot1 = await getDocs(q1)
        
        snapshot1.docs.forEach(doc => {
          const data = doc.data()
          allIdeas.push({
            id: doc.id,
            title: data.title || 'Untitled',
            type: data.type || 'unknown',
            genre: data.genre,
            industry: data.industry,
            content: data.content || '',
            targetAudience: data.targetAudience,
            uniqueValue: data.uniqueValue,
            aiScore: data.aiScores?.overall || data.aiScore || 0,
            aiScores: data.aiScores,
            publicScore: data.publicScore || { average: 0, count: 0, sum: 0 },
            creatorName: data.userName || data.username || 'Anonymous',
            userName: data.userName,
            username: data.username
          })
        })
      } catch (e1) {
        console.log('No ideas with aiScores.overall, trying aiScore...')
        
        try {
          const q2 = query(ideasRef, orderBy('aiScore', 'desc'), limit(20))
          const snapshot2 = await getDocs(q2)
          
          snapshot2.docs.forEach(doc => {
            const data = doc.data()
            allIdeas.push({
              id: doc.id,
              title: data.title || 'Untitled',
              type: data.type || 'unknown',
              genre: data.genre,
              industry: data.industry,
              content: data.content || '',
              targetAudience: data.targetAudience,
              uniqueValue: data.uniqueValue,
              aiScore: data.aiScore || 0,
              publicScore: data.publicScore || { average: 0, count: 0, sum: 0 },
              creatorName: data.userName || data.username || 'Anonymous',
              userName: data.userName,
              username: data.username
            })
          })
        } catch (e2) {
          console.log('Error fetching ideas')
        }
      }

      allIdeas.sort((a, b) => {
        const scoreA = a.aiScores?.overall || a.aiScore || 0
        const scoreB = b.aiScores?.overall || b.aiScore || 0
        return scoreB - scoreA
      })

      if (activeTab !== 'all') {
        const typeMap: any = {
          'movies': 'movie',
          'games': 'game',
          'business': 'business'
        }
        allIdeas = allIdeas.filter(idea => idea.type === typeMap[activeTab])
      }

      setTopIdeas(allIdeas.slice(0, 20))
    } catch (error) {
      console.error('Error fetching ideas:', error)
      setTopIdeas([])
    } finally {
      setLoading(false)
    }
  }

  const getAIScore = (idea: IdeaPreview): number => {
    return idea.aiScores?.overall || idea.aiScore || 0
  }

  const toggleExpanded = (ideaId: string) => {
    setExpandedId(expandedId === ideaId ? null : ideaId)
  }

  const truncateContent = (content: string, maxLength: number = 120): string => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength).trim() + '...'
  }

  return (
    <>
      <Head>
        <title>Make Me Famous - No Marketing Budget? No Problem. AI Ranks Your Idea.</title>
        <meta name="description" content="Skip the marketing. Let AI judge your idea. Get on the leaderboard. Win cash prizes. Connect with investors." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Add new aggressive fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Oswald:wght@400;500;600;700&family=Barlow:wght@400;500;600;700;800;900&family=Roboto+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        :root {
          --primary-blue: #1e3a8a;
          --dark-blue: #1e293b;
          --steel-gray: #64748b;
          --light-gray: #e2e8f0;
          --bg-gray: #f8fafc;
          --accent-red: #dc2626;
          --accent-green: #16a34a;
          --accent-yellow: #facc15;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Barlow', sans-serif;
          background: var(--bg-gray);
          color: var(--dark-blue);
        }

        .font-display {
          font-family: 'Bebas Neue', Impact, sans-serif;
          letter-spacing: 0.03em;
        }

        .font-heading {
          font-family: 'Oswald', sans-serif;
          font-weight: 700;
        }

        .font-mono {
          font-family: 'Roboto Mono', monospace;
        }
      `}</style>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section - BOLD & AGGRESSIVE */}
        <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
            <div className="text-center mb-12">
              <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl mb-6 leading-none">
                NO MONEY? NO PROBLEM.
                <br />
                <span className="text-yellow-400">LET AI JUDGE YOUR IDEA</span>
              </h1>
              <p className="font-heading text-xl sm:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
                SKIP THE EXPENSIVE MARKETING. SUBMIT YOUR IDEA. GET RANKED BY AI. WIN CASH PRIZES.
              </p>
            </div>
          </div>
        </section>

        {/* Value Proposition Section - NEW */}
        <section className="bg-white border-t-8 border-yellow-400">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-5xl mb-4">🚫💰</div>
                <h3 className="font-heading text-2xl mb-3 text-gray-900">NO KICKSTARTER BUDGET?</h3>
                <p className="text-gray-600">
                  Other platforms need $10K+ for marketing to get noticed. Here? <strong>$0</strong>. 
                  Your idea speaks for itself.
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">🤖⚡</div>
                <h3 className="font-heading text-2xl mb-3 text-gray-900">INSTANT AI RANKING</h3>
                <p className="text-gray-600">
                  No waiting for backers. Our harsh AI scores you immediately. 
                  Good ideas rise to the top <strong>automatically</strong>.
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">💵🏆</div>
                <h3 className="font-heading text-2xl mb-3 text-gray-900">MONTHLY CASH PRIZES</h3>
                <p className="text-gray-600">
                  Top ideas win <strong>real money</strong>. Investors browse the leaderboard. 
                  Every month is a new chance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It's Different - NEW */}
        <section className="bg-slate-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="md:w-1/2">
                <h2 className="font-display text-4xl sm:text-5xl mb-4 text-yellow-400">
                  THE OLD WAY IS BROKEN
                </h2>
                <ul className="space-y-3 text-lg">
                  <li className="flex items-start gap-3">
                    <span className="text-red-500">❌</span>
                    <span>Kickstarter: Need $10K+ marketing budget to get seen</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-500">❌</span>
                    <span>IndieGoGo: Pay for ads or get buried</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-500">❌</span>
                    <span>ProductHunt: Need existing audience to win</span>
                  </li>
                </ul>
              </div>
              <div className="md:w-1/2">
                <h2 className="font-display text-4xl sm:text-5xl mb-4 text-green-400">
                  OUR WAY: MERIT ONLY
                </h2>
                <ul className="space-y-3 text-lg">
                  <li className="flex items-start gap-3">
                    <span className="text-green-400">✓</span>
                    <span>AI judges quality, not marketing spend</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400">✓</span>
                    <span>Great ideas automatically rank high</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400">✓</span>
                    <span>Investors see the best ideas first</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="font-display text-5xl">10K+</div>
                <div className="font-heading text-sm uppercase tracking-wider opacity-80">Ideas Submitted</div>
              </div>
              <div>
                <div className="font-display text-5xl">$50K</div>
                <div className="font-heading text-sm uppercase tracking-wider opacity-80">Prizes Given</div>
              </div>
              <div>
                <div className="font-display text-5xl">3.2</div>
                <div className="font-heading text-sm uppercase tracking-wider opacity-80">Avg AI Score</div>
              </div>
              <div>
                <div className="font-display text-5xl">12</div>
                <div className="font-heading text-sm uppercase tracking-wider opacity-80">Ideas Funded</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Leaderboard Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          {/* Aggressive Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-3 font-heading text-lg uppercase tracking-wider transition-all ${
                activeTab === 'all' 
                  ? 'bg-blue-900 text-white' 
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-900'
              }`}
            >
              ALL IDEAS
            </button>
            <button
              onClick={() => setActiveTab('movies')}
              className={`px-6 py-3 font-heading text-lg uppercase tracking-wider transition-all ${
                activeTab === 'movies' 
                  ? 'bg-blue-900 text-white' 
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-900'
              }`}
            >
              🎬 MOVIES
            </button>
            <button
              onClick={() => setActiveTab('games')}
              className={`px-6 py-3 font-heading text-lg uppercase tracking-wider transition-all ${
                activeTab === 'games' 
                  ? 'bg-blue-900 text-white' 
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-900'
              }`}
            >
              🎮 GAMES
            </button>
            <button
              onClick={() => setActiveTab('business')}
              className={`px-6 py-3 font-heading text-lg uppercase tracking-wider transition-all ${
                activeTab === 'business' 
                  ? 'bg-blue-900 text-white' 
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-900'
              }`}
            >
              💼 BUSINESS
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Ideas Section */}
            <div className="lg:col-span-2">
              <div className="bg-white border-4 border-gray-900 shadow-xl">
                <div className="bg-gray-900 text-white p-6">
                  <h2 className="font-display text-4xl">
                    THIS {timeFilter.toUpperCase()}'S BATTLEGROUND
                  </h2>
                </div>

                {loading ? (
                  <div className="p-12 text-center">
                    <div className="inline-block h-12 w-12 animate-spin border-4 border-blue-900 border-t-transparent"></div>
                    <p className="mt-4 font-heading text-gray-600">LOADING WARRIORS...</p>
                  </div>
                ) : topIdeas.length > 0 ? (
                  <div className="divide-y-4 divide-gray-200">
                    {topIdeas.map((idea, index) => {
                      const aiScore = getAIScore(idea)
                      const publicScore = idea.publicScore?.average || 0
                      const publicVoteCount = idea.publicScore?.count || 0
                      const isExpanded = expandedId === idea.id
                      
                      return (
                        <div 
                          key={idea.id} 
                          className="relative p-6 hover:bg-gray-50 transition-all cursor-pointer"
                          onClick={() => toggleExpanded(idea.id)}
                        >
                          {/* Rank Badge */}
                          <div className={`absolute -top-4 -left-4 w-16 h-16 flex items-center justify-center font-display text-2xl transform rotate-3 ${
                            index === 0 ? 'bg-yellow-400 text-black' :
                            index === 1 ? 'bg-gray-400 text-white' :
                            index === 2 ? 'bg-orange-600 text-white' :
                            'bg-gray-800 text-white'
                          }`}>
                            #{index + 1}
                          </div>

                          {/* Content */}
                          <div className="pl-12">
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="font-heading text-2xl text-gray-900 uppercase">
                                {idea.title}
                              </h3>
                              {idea.aiScores?.investmentStatus && (
                                <span className={`px-3 py-1 font-mono text-xs font-bold ${
                                  idea.aiScores.investmentStatus === 'INVEST' ? 'bg-green-500 text-white' :
                                  idea.aiScores.investmentStatus === 'MAYBE' ? 'bg-yellow-500 text-black' :
                                  'bg-red-500 text-white'
                                }`}>
                                  {idea.aiScores.investmentStatus}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-4 mb-3 text-sm">
                              <span className="font-mono text-gray-600">TYPE: {idea.type.toUpperCase()}</span>
                              <span className="font-mono text-gray-600">BY: {idea.creatorName.toUpperCase()}</span>
                            </div>

                            <p className="text-gray-700 mb-4 font-medium">
                              {isExpanded ? idea.content : truncateContent(idea.content)}
                            </p>

                            {/* Expanded Content */}
                            {isExpanded && (
                              <div className="bg-gray-100 p-4 border-l-4 border-blue-900 mb-4">
                                {idea.aiScores?.verdict && (
                                  <div className="mb-4">
                                    <strong className="font-heading text-sm uppercase">AI VERDICT:</strong>
                                    <p className="text-gray-800 mt-1 italic">"{idea.aiScores.verdict}"</p>
                                  </div>
                                )}
                                <Link href={`/ideas/${idea.id}`}>
                                  <a className="font-heading text-blue-900 uppercase hover:underline">
                                    FULL ANALYSIS →
                                  </a>
                                </Link>
                              </div>
                            )}

                            {/* Score Display */}
                            <div className="grid grid-cols-3 gap-4 pt-4 border-t-2 border-gray-200">
                              <div>
                                <div className="font-mono text-3xl font-bold text-blue-900">{aiScore.toFixed(1)}</div>
                                <div className="font-heading text-xs uppercase text-gray-500">AI SCORE</div>
                              </div>
                              {publicVoteCount > 0 && (
                                <div>
                                  <div className="font-mono text-3xl font-bold text-green-600">{publicScore.toFixed(1)}</div>
                                  <div className="font-heading text-xs uppercase text-gray-500">PUBLIC ({publicVoteCount})</div>
                                </div>
                              )}
                              <div>
                                <div className="font-mono text-3xl font-bold text-purple-600">
                                  {publicVoteCount > 0 ? ((aiScore + publicScore) / 2).toFixed(1) : aiScore.toFixed(1)}
                                </div>
                                <div className="font-heading text-xs uppercase text-gray-500">TOTAL</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <div className="text-6xl mb-4">⚔️</div>
                    <p className="font-heading text-xl text-gray-600 mb-6">NO WARRIORS IN THE ARENA YET</p>
                    <Link href="/submit">
                      <a className="inline-block bg-blue-900 text-white px-8 py-4 font-heading text-xl uppercase hover:bg-blue-800">
                        BE THE FIRST →
                      </a>
                    </Link>
                  </div>
                )}

                <div className="bg-gray-900 text-white p-4 text-center">
                  <Link href="/leaderboard">
                    <a className="font-heading text-lg uppercase hover:text-yellow-400">
                      ENTER FULL BATTLEGROUND →
                    </a>
                  </Link>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Previous Month Winners */}
              <div className="bg-white border-4 border-gray-900 shadow-xl">
                <div className="bg-yellow-400 text-black p-4">
                  <h3 className="font-display text-2xl">LAST MONTH'S CHAMPIONS</h3>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-100">
                    <span className="text-3xl">🥇</span>
                    <div className="flex-1">
                      <div className="font-heading font-bold">THE MEMORY THIEF</div>
                      <div className="font-mono text-sm text-gray-600">SCORE: 9.2</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-100">
                    <span className="text-3xl">🥈</span>
                    <div className="flex-1">
                      <div className="font-heading font-bold">QUANTUM BREAK</div>
                      <div className="font-mono text-sm text-gray-600">SCORE: 8.9</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-100">
                    <span className="text-3xl">🥉</span>
                    <div className="flex-1">
                      <div className="font-heading font-bold">MIND MAZE VR</div>
                      <div className="font-mono text-sm text-gray-600">SCORE: 8.7</div>
                    </div>
                  </div>
                </div>
                <Link href="/archive">
                  <a className="block bg-gray-900 text-white text-center py-3 font-heading uppercase hover:bg-gray-800">
                    VIEW HALL OF FAME →
                  </a>
                </Link>
              </div>

              {/* CTA Card */}
              <div className="bg-gradient-to-br from-red-600 to-red-800 text-white p-6 border-4 border-gray-900">
                <h3 className="font-display text-3xl mb-3">READY TO FIGHT?</h3>
                <p className="mb-4 font-medium">
                  Submit your idea. Face the AI. Climb the ranks.
                </p>
                <Link href="/submit">
                  <a className="block text-center bg-white text-red-700 py-3 font-heading text-lg uppercase hover:bg-yellow-400">
                    ENTER ARENA →
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-gray-900 text-white py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="font-display text-5xl text-center mb-12 text-yellow-400">
              THE BATTLEGROUND RULES
            </h2>
            
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { num: 1, emoji: '⚔️', title: 'SUBMIT YOUR WEAPON', desc: 'Your idea is your weapon. 30-500 words. Make it count.' },
                { num: 2, emoji: '🤖', title: 'FACE THE AI JUDGE', desc: 'Brutal AI scores 0-10. No mercy. Most fail.' },
                { num: 3, emoji: '🗳️', title: 'SURVIVE PUBLIC VOTE', desc: 'Community votes. Weak ideas die. Strong ideas rise.' },
                { num: 4, emoji: '💰', title: 'CLAIM YOUR PRIZE', desc: '$5,000 monthly prizes. Real investors watching.' }
              ].map((step) => (
                <div key={step.num} className="text-center">
                  <div className="font-display text-6xl text-yellow-400 mb-3">{step.num}</div>
                  <div className="text-5xl mb-3">{step.emoji}</div>
                  <h3 className="font-heading text-xl mb-2 uppercase">{step.title}</h3>
                  <p className="text-gray-400 text-sm">{step.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 max-w-3xl mx-auto bg-red-900 border-4 border-red-500 p-6">
              <div className="flex gap-4">
                <span className="text-4xl">⚠️</span>
                <div>
                  <h3 className="font-heading text-xl uppercase mb-2">WARNING</h3>
                  <p className="text-red-200">
                    The AI doesn't care about your feelings. Most ideas score 3-6. 
                    If you can't handle brutal truth, leave now.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-gradient-to-r from-blue-900 to-blue-700 py-16 text-center text-white">
          <h2 className="font-display text-6xl mb-6">NO BUDGET? NO PROBLEM.</h2>
          <p className="font-heading text-2xl mb-8 max-w-2xl mx-auto">
            STOP BEGGING FOR MONEY. LET YOUR IDEA PROVE ITSELF.
          </p>
          <Link href="/submit">
            <a className="inline-block bg-yellow-400 text-black px-12 py-5 font-display text-3xl hover:bg-yellow-300 transform hover:scale-105 transition-all">
              SUBMIT NOW →
            </a>
          </Link>
        </section>

        {/* Footer */}
        <footer className="bg-black text-white py-8 text-center">
          <p className="font-mono text-sm">© 2024 MAKE ME FAMOUS. WHERE IDEAS FIGHT TO WIN.</p>
        </footer>
      </div>
    </>
  )
}
