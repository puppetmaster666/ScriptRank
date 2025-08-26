// pages/index.tsx - COMPLETE FRESH DESIGN WITH ALL FEATURES
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
  const [typedText, setTypedText] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [timeFilter, setTimeFilter] = useState('week')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const fullText = 'Do You Have The Next Big Idea?'

  useEffect(() => {
    fetchTopIdeas()
    
    // Typing animation
    let index = 0
    const typingInterval = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index))
        index++
      } else {
        clearInterval(typingInterval)
      }
    }, 50)

    return () => clearInterval(typingInterval)
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

  const getRankClass = (index: number) => {
    if (index === 0) return 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white'
    if (index === 1) return 'bg-gradient-to-r from-gray-300 to-gray-400 text-white'
    if (index === 2) return 'bg-gradient-to-r from-amber-600 to-amber-700 text-white'
    return 'bg-white text-charcoal border border-sage/20'
  }

  const getInvestmentBadgeClass = (status?: string) => {
    switch (status) {
      case 'INVEST':
        return 'bg-green-100 text-green-800'
      case 'MAYBE':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-red-100 text-red-800'
    }
  }

  return (
    <>
      <Head>
        <title>Make Me Famous - Submit Your Next Big Idea</title>
        <meta name="description" content="Submit your idea and get scored by our AI. Join the leaderboard for prizes and opportunities." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-cream">
        {/* Hero Section */}
        <section className="relative gradient-sage min-h-[80vh] flex items-center justify-center overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              animation: 'float 20s ease-in-out infinite'
            }} />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 text-center px-6 sm:px-8 max-w-5xl mx-auto">
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-white mb-6 leading-tight">
              {typedText}
              <span className="animate-pulse inline-block ml-2 text-accent-yellow">|</span>
            </h1>
            <p className="font-mono text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Submit your concept. Get brutally honest AI feedback.<br/>
              Join the leaderboard. Win real prizes.
            </p>
            <Link href="/submit">
              <a className="inline-block bg-white text-sage px-10 py-4 rounded-full font-semibold text-lg hover:transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                Submit Your Idea →
              </a>
            </Link>
          </div>
        </section>

        {/* Stats Bar */}
        <div className="max-w-6xl mx-auto px-6 -mt-20 relative z-20">
          <div className="bg-white rounded-3xl shadow-large p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="font-display text-4xl text-sage mb-2">10K+</div>
                <div className="text-sm uppercase tracking-wider text-charcoal/60">Ideas Submitted</div>
              </div>
              <div className="text-center">
                <div className="font-display text-4xl text-sage mb-2">$50K</div>
                <div className="text-sm uppercase tracking-wider text-charcoal/60">Prizes Given</div>
              </div>
              <div className="text-center">
                <div className="font-display text-4xl text-sage mb-2">3.2</div>
                <div className="text-sm uppercase tracking-wider text-charcoal/60">Avg AI Score</div>
              </div>
              <div className="text-center">
                <div className="font-display text-4xl text-sage mb-2">92%</div>
                <div className="text-sm uppercase tracking-wider text-charcoal/60">Get Roasted</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Section */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-3 mb-8">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                activeTab === 'all' 
                  ? 'bg-sage text-white' 
                  : 'bg-white text-charcoal hover:bg-sage-pale'
              }`}
            >
              All Ideas
            </button>
            <button
              onClick={() => setActiveTab('movies')}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                activeTab === 'movies' 
                  ? 'bg-sage text-white' 
                  : 'bg-white text-charcoal hover:bg-sage-pale'
              }`}
            >
              🎬 Movies
            </button>
            <button
              onClick={() => setActiveTab('games')}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                activeTab === 'games' 
                  ? 'bg-sage text-white' 
                  : 'bg-white text-charcoal hover:bg-sage-pale'
              }`}
            >
              🎮 Games
            </button>
            <button
              onClick={() => setActiveTab('business')}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                activeTab === 'business' 
                  ? 'bg-sage text-white' 
                  : 'bg-white text-charcoal hover:bg-sage-pale'
              }`}
            >
              💼 Business
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Ideas Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl p-8 shadow-soft">
                <h2 className="font-display text-3xl text-soft-black mb-6">
                  This {timeFilter === 'week' ? "Week's" : timeFilter === 'month' ? "Month's" : "Year's"} Top Ideas
                </h2>

                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-sage border-r-transparent"></div>
                    <p className="mt-4 text-charcoal/60">Loading amazing ideas...</p>
                  </div>
                ) : topIdeas.length > 0 ? (
                  <div className="space-y-6">
                    {topIdeas.map((idea, index) => {
                      const aiScore = getAIScore(idea)
                      const publicScore = idea.publicScore?.average || 0
                      const publicVoteCount = idea.publicScore?.count || 0
                      const isExpanded = expandedId === idea.id
                      
                      return (
                        <div 
                          key={idea.id} 
                          className="relative bg-warm-beige rounded-2xl p-6 transition-all duration-300 hover:shadow-medium cursor-pointer"
                          onClick={() => toggleExpanded(idea.id)}
                        >
                          {/* Rank Badge */}
                          <div className={`absolute -top-3 -right-3 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg ${getRankClass(index)}`}>
                            {index + 1}
                          </div>

                          {/* Title and Meta */}
                          <h3 className="font-display text-2xl text-soft-black mb-3 pr-12">
                            {idea.title}
                          </h3>
                          
                          <div className="flex flex-wrap items-center gap-3 mb-4">
                            <span className="px-3 py-1 bg-sage-pale text-sage rounded-full text-sm font-medium uppercase tracking-wider">
                              {idea.type}
                            </span>
                            <span className="text-charcoal/60 text-sm">
                              by {idea.creatorName}
                            </span>
                            {idea.aiScores?.investmentStatus && (
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${getInvestmentBadgeClass(idea.aiScores.investmentStatus)}`}>
                                {idea.aiScores.investmentStatus}
                              </span>
                            )}
                          </div>

                          {/* Content */}
                          <p className="text-charcoal leading-relaxed mb-4">
                            {isExpanded ? idea.content : truncateContent(idea.content)}
                          </p>

                          {/* Expanded Content */}
                          {isExpanded && (
                            <div className="mt-4 pt-4 border-t border-sage/10 animate-slideDown">
                              {idea.targetAudience && (
                                <div className="mb-3">
                                  <strong className="text-sm text-charcoal/70">Target Audience:</strong>
                                  <p className="text-charcoal mt-1">{idea.targetAudience}</p>
                                </div>
                              )}
                              
                              {idea.uniqueValue && (
                                <div className="mb-3">
                                  <strong className="text-sm text-charcoal/70">What Makes It Unique:</strong>
                                  <p className="text-charcoal mt-1">{idea.uniqueValue}</p>
                                </div>
                              )}
                              
                              {idea.aiScores?.verdict && (
                                <div className="bg-white rounded-xl p-4 mt-4">
                                  <strong className="text-sm text-charcoal/70">AI Verdict:</strong>
                                  <p className="text-charcoal mt-1 italic">"{idea.aiScores.verdict}"</p>
                                </div>
                              )}
                              
                              <Link href={`/ideas/${idea.id}`}>
                                <a className="inline-block mt-4 text-sage font-medium hover:underline">
                                  View Full Details →
                                </a>
                              </Link>
                            </div>
                          )}

                          {/* Scores */}
                          <div className="flex gap-6 pt-4 border-t border-sage/10">
                            <div className="text-center">
                              <div className="font-mono text-2xl font-bold text-sage">{aiScore.toFixed(1)}</div>
                              <div className="text-xs uppercase tracking-wider text-charcoal/50">AI Score</div>
                            </div>
                            {publicVoteCount > 0 && (
                              <div className="text-center">
                                <div className="font-mono text-2xl font-bold text-sage">{publicScore.toFixed(1)}</div>
                                <div className="text-xs uppercase tracking-wider text-charcoal/50">Public ({publicVoteCount})</div>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">💡</div>
                    <p className="text-charcoal/60 mb-6">No ideas submitted yet. Be the first!</p>
                    <Link href="/submit">
                      <a className="btn-primary">Submit Your Idea</a>
                    </Link>
                  </div>
                )}

                <div className="text-center mt-8">
                  <Link href="/leaderboard">
                    <a className="text-sage font-medium hover:underline">View Full Leaderboard →</a>
                  </Link>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Previous Month Winners */}
              <div className="bg-warm-beige rounded-3xl p-6 shadow-soft mb-6">
                <h3 className="font-display text-2xl text-soft-black mb-4">Previous Month Winners</h3>
                
                <div className="space-y-3">
                  <div className="bg-white rounded-xl p-4 flex items-center gap-3">
                    <span className="text-2xl">🥇</span>
                    <div className="flex-1">
                      <div className="font-semibold text-soft-black">The Memory Thief</div>
                      <div className="text-sm font-mono text-sage">Score: 9.2</div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl p-4 flex items-center gap-3">
                    <span className="text-2xl">🥈</span>
                    <div className="flex-1">
                      <div className="font-semibold text-soft-black">Quantum Break</div>
                      <div className="text-sm font-mono text-sage">Score: 8.9</div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl p-4 flex items-center gap-3">
                    <span className="text-2xl">🥉</span>
                    <div className="flex-1">
                      <div className="font-semibold text-soft-black">Mind Maze VR</div>
                      <div className="text-sm font-mono text-sage">Score: 8.7</div>
                    </div>
                  </div>
                </div>

                <Link href="/archive">
                  <a className="block mt-4 text-center bg-sage text-white py-3 rounded-xl font-medium hover:bg-sage-light transition-colors">
                    View Full Archive →
                  </a>
                </Link>
              </div>

              {/* Call to Action Card */}
              <div className="bg-gradient-to-br from-sage to-sage-light rounded-3xl p-6 text-white">
                <h3 className="font-display text-2xl mb-3">Ready to compete?</h3>
                <p className="text-white/90 mb-4">Submit your idea and see how it stacks up against the competition.</p>
                <Link href="/submit">
                  <a className="block text-center bg-white text-sage py-3 rounded-xl font-medium hover:shadow-lg transition-all">
                    Submit Now →
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="gradient-warm py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-5xl text-center text-soft-black mb-12">How It Works</h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { num: 1, emoji: '💡', title: 'Submit Your Idea', desc: 'Movie script? Game concept? Business plan? Write 30-500 words explaining why it\'s revolutionary.' },
                { num: 2, emoji: '🔥', title: 'Get AI Scored', desc: 'Our harsh AI judges like a skeptical VC. Market potential, innovation, execution - all scored 0-10.' },
                { num: 3, emoji: '📈', title: 'Community Votes', desc: 'Real people rate and comment. Watch your idea climb (or crash) on the live leaderboard.' },
                { num: 4, emoji: '🏆', title: 'Win Real Prizes', desc: 'Monthly winners get $5,000 in prizes. Top ideas get pitched to real investors & studios.' }
              ].map((step) => (
                <div key={step.num} className="bg-white rounded-2xl p-6 text-center hover:transform hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-sage-pale text-sage rounded-full font-bold text-lg mb-4">
                    {step.num}
                  </div>
                  <div className="text-4xl mb-3">{step.emoji}</div>
                  <h3 className="font-bold text-lg text-soft-black mb-2">{step.title}</h3>
                  <p className="text-charcoal/70 text-sm">{step.desc}</p>
                </div>
              ))}
            </div>
            
            {/* Warning Box */}
            <div className="mt-12 max-w-3xl mx-auto bg-accent-coral/10 border-2 border-accent-coral/20 rounded-2xl p-6">
              <div className="flex gap-4">
                <span className="text-3xl">⚠️</span>
                <div>
                  <h3 className="font-bold text-soft-black mb-2">Fair Warning</h3>
                  <p className="text-charcoal/80">
                    The AI doesn't sugarcoat. Most ideas score 3-6. 
                    It's trained to think like a harsh VC who's seen everything. 
                    If you can't handle brutal honesty, this isn't for you.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="bg-sage py-16 px-6 text-center">
          <h2 className="font-display text-5xl text-white mb-6">Ready to Get Famous?</h2>
          <Link href="/submit">
            <a className="inline-block bg-white text-sage px-12 py-5 rounded-full font-bold text-xl hover:transform hover:scale-105 hover:shadow-xl transition-all">
              Submit Your Idea Now
            </a>
          </Link>
        </section>

        {/* Simple Footer */}
        <footer className="bg-charcoal text-white/60 py-8 px-6 text-center">
          <p className="font-mono text-sm">© 2024 Make Me Famous. Where Ideas Compete.</p>
        </footer>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(120deg); }
          66% { transform: translate(-20px, 20px) rotate(240deg); }
        }
      `}</style>
    </>
  )
}
