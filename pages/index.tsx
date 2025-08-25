// pages/index.tsx - FIXED VERSION
import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore'

interface IdeaPreview {
  id: string
  title: string
  type: string
  aiScores?: {
    overall: number
    market: number
    innovation: number
    execution: number
  }
  publicScore?: {
    average: number
    count: number
  }
  votes?: any[]
  voteCount?: number
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
  const fullText = 'DO YOU HAVE THE NEXT TARANTINO SCRIPT?'

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
    try {
      const ideasRef = collection(db, 'ideas')
      let q = query(ideasRef)
      
      // Filter by type if not 'all'
      if (activeTab !== 'all') {
        const typeMap: any = {
          'movies': 'movie',  // Fixed: movie not entertainment
          'games': 'game', 
          'business': 'business'
        }
        q = query(ideasRef, where('type', '==', typeMap[activeTab] || activeTab))
      }
      
      // FIX: Use aiScores.overall instead of aiScore
      q = query(q, orderBy('aiScores.overall', 'desc'), limit(20))
      
      const snapshot = await getDocs(q)
      
      if (!snapshot.empty) {
        const ideas = snapshot.docs.map(doc => {
          const data = doc.data()
          console.log('Fetched idea data:', data) // Debug log
          return {
            id: doc.id,
            title: data.title,
            type: data.type,
            aiScores: data.aiScores, // Keep the full aiScores object
            publicScore: data.publicScore,
            votes: data.votes,
            voteCount: data.voteCount || data.votes?.length || 0,
            creatorName: data.userName || data.username || 'Anonymous',
            userName: data.userName,
            username: data.username
          }
        })
        setTopIdeas(ideas)
      } else {
        console.log('No ideas found in database')
        setTopIdeas([])
      }
    } catch (error) {
      console.error('Error fetching ideas:', error)
      setTopIdeas([])
    } finally {
      setLoading(false)
    }
  }

  // Helper function to safely get AI score
  const getAIScore = (idea: IdeaPreview): number => {
    return idea.aiScores?.overall || 0
  }

  return (
    <>
      <Head>
        <title>Make Me Famous - Submit Your Next Big Idea</title>
        <meta name="description" content="Do you have the next Tarantino script? Submit your idea and get scored by our AI. Join the leaderboard for prizes and opportunities." />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Hero Section - Black background with white text */}
        <section className="px-8 py-20 bg-black text-white">
          <h1 className="hero-title text-center text-white min-h-[64px]">
            {typedText}
            <span className="typing-cursor">|</span>
          </h1>
          <p className="hero-subtitle text-center mt-8 text-white opacity-90">
            SUBMIT YOUR IDEA AND GET SCORED BY OUR AI.<br />
            JOIN THE LEADERBOARD FOR<br />
            PRIZES AND OPPORTUNITIES
          </p>
        </section>

        {/* Leaderboard Section */}
        <section className="px-8 py-16">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-4 gap-8">
            {/* Main Table */}
            <div className="lg:col-span-3">
              {/* Tabs */}
              <div className="flex gap-2 mb-6">
                <div className="leaderboard-tab bg-black text-white">
                  TOP IDEAS THIS {timeFilter.toUpperCase()}
                </div>
                <div className="flex gap-2 ml-auto">
                  {['all', 'movies', 'games', 'business'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 font-ui border-2 rounded-lg transition-all ${
                        activeTab === tab
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-black border-gray-300 hover:border-black'
                      }`}
                    >
                      {tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Table Container */}
              <div className="leaderboard-container">
                {/* Table Header */}
                <div className="leaderboard-header bg-black text-white">
                  <div className="w-16 text-center font-bold">#</div>
                  <div className="flex-1 font-bold">IDEA</div>
                  <div className="w-20 text-center font-bold">AI</div>
                  <div className="w-24 text-center font-bold">PUBLIC</div>
                  <div className="w-24 text-center font-bold">TOTAL</div>
                </div>

                {/* Table Body */}
                {loading ? (
                  <div className="p-8 text-center">Loading...</div>
                ) : topIdeas.length > 0 ? (
                  topIdeas.map((idea, index) => {
                    const aiScore = getAIScore(idea)
                    const publicScore = idea.publicScore?.average || 0
                    const totalScore = ((aiScore + publicScore) / 2).toFixed(1)
                    
                    return (
                      <Link 
                        key={idea.id}
                        href={`/ideas/${idea.id}`}
                        className="leaderboard-row hover:bg-gray-50 transition-all"
                      >
                        <div className="w-16 flex justify-center">
                          <div className={`w-10 h-10 flex items-center justify-center font-bold text-white rounded ${
                            index === 0 ? 'bg-black' :
                            index === 1 ? 'bg-gray-800' :
                            index === 2 ? 'bg-gray-600' :
                            'bg-gray-400'
                          }`}>
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-lg" style={{ fontFamily: 'Bahnschrift, sans-serif' }}>
                            {idea.title}
                          </div>
                          <div className="text-sm text-gray-600 font-body">
                            by {idea.creatorName}
                          </div>
                        </div>
                        <div className="w-20 text-center font-bold text-lg">{aiScore.toFixed(1)}</div>
                        <div className="w-24 text-center">
                          {idea.publicScore ? (
                            <div>
                              <span className="font-bold text-lg">{publicScore.toFixed(1)}</span>
                              <span className="text-xs text-gray-500 block">({idea.publicScore.count} votes)</span>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </div>
                        <div className="w-24 text-center">
                          <div className="text-xl font-bold bg-black text-white py-1 px-3 rounded">
                            {totalScore}
                          </div>
                        </div>
                      </Link>
                    )
                  })
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    No ideas submitted yet. Be the first!
                  </div>
                )}
                
                {/* View All Link */}
                <div className="text-center pt-8 pb-4 border-t">
                  <Link href="/leaderboard" className="view-all-link">
                    VIEW FULL LEADERBOARD →
                  </Link>
                </div>
              </div>
            </div>

            {/* Previous Month Sidebar */}
            <div className="lg:col-span-1">
              <div className="border-2 border-black rounded-lg p-6">
                <h3 className="font-bold text-lg mb-4" style={{ fontFamily: 'Bahnschrift, sans-serif' }}>
                  PREVIOUS MONTH
                </h3>
                <div className="text-sm font-body text-gray-600 mb-4">
                  {new Date(new Date().setMonth(new Date().getMonth() - 1)).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
                <div className="space-y-3">
                  <div className="pb-3 border-b">
                    <div className="font-bold">🥇 Winner</div>
                    <div className="text-sm">The Memory Thief</div>
                    <div className="text-xs text-gray-600">Score: 9.2</div>
                  </div>
                  <div className="pb-3 border-b">
                    <div className="font-bold">🥈 Runner-up</div>
                    <div className="text-sm">Quantum Break</div>
                    <div className="text-xs text-gray-600">Score: 8.9</div>
                  </div>
                  <div>
                    <div className="font-bold">🥉 Third Place</div>
                    <div className="text-sm">Mind Maze VR</div>
                    <div className="text-xs text-gray-600">Score: 8.7</div>
                  </div>
                </div>
                <Link href="/archive" className="block mt-6 text-center py-2 border-2 border-black rounded hover:bg-black hover:text-white transition-all">
                  View Archive →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="px-8 py-16 border-t-2 border-black">
          <div className="text-center">
            <h2 className="cta-title">READY TO GET FAMOUS?</h2>
            <Link href="/submit" className="submit-button">
              SUBMIT YOUR IDEA
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-8 py-8 border-t-2 border-black">
          <div className="text-center footer-text">
            © 2024 MAKE ME FAMOUS. WHERE IDEAS COMPETE.
          </div>
        </footer>
      </div>

      <style jsx>{`
        .typing-cursor {
          animation: blink 1s infinite;
          font-weight: 100;
          color: white;
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        .nav-button {
          font-family: 'Bahnschrift', sans-serif;
          font-size: 16px;
          padding: 8px 24px;
          border: 2px solid black;
          border-radius: 8px;
          background: white;
          color: black;
          text-decoration: none;
          transition: all 0.2s;
        }

        .nav-button:hover {
          background: black;
          color: white;
        }

        .hero-title {
          font-family: 'DrukWide', sans-serif;
          font-size: clamp(32px, 5vw, 64px);
          line-height: 1;
          font-weight: 900;
          letter-spacing: -0.02em;
        }

        .hero-subtitle {
          font-family: 'Courier', monospace;
          font-size: 18px;
          line-height: 1.6;
          letter-spacing: 0.02em;
        }

        .leaderboard-tab {
          font-family: 'Bahnschrift', sans-serif;
          font-size: 16px;
          padding: 12px 32px;
          border: 2px solid black;
          border-bottom: none;
          border-radius: 12px 12px 0 0;
          background: white;
          display: inline-block;
          font-weight: 500;
        }

        .leaderboard-container {
          border: 2px solid black;
          border-radius: 0 12px 12px 12px;
          background: white;
          overflow: hidden;
        }

        .leaderboard-header {
          display: flex;
          padding: 16px 24px;
          font-family: 'Bahnschrift', sans-serif;
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          border-bottom: 2px solid black;
          background: #f8f8f8;
        }

        .leaderboard-row {
          display: flex;
          padding: 20px 24px;
          font-family: 'Courier', monospace;
          font-size: 16px;
          border-bottom: 1px solid #e0e0e0;
          text-decoration: none;
          color: black;
          transition: background 0.2s;
        }

        .leaderboard-row:hover {
          background: #f8f8f8;
        }

        .leaderboard-row:last-of-type {
          border-bottom: none;
        }

        .creator-name {
          font-family: 'Bahnschrift', sans-serif;
          font-size: 14px;
          color: #666;
          font-weight: normal;
        }

        .view-all-link {
          font-family: 'Bahnschrift', sans-serif;
          font-size: 14px;
          color: black;
          text-decoration: underline;
          transition: opacity 0.2s;
        }

        .view-all-link:hover {
          opacity: 0.6;
        }

        .cta-title {
          font-family: 'DrukWide', sans-serif;
          font-size: 36px;
          font-weight: 900;
          margin-bottom: 32px;
        }

        .submit-button {
          font-family: 'Bahnschrift', sans-serif;
          font-size: 18px;
          padding: 16px 48px;
          border: 3px solid black;
          border-radius: 8px;
          background: black;
          color: white;
          text-decoration: none;
          display: inline-block;
          transition: all 0.2s;
        }

        .submit-button:hover {
          background: white;
          color: black;
        }

        .footer-text {
          font-family: 'Courier', monospace;
          font-size: 12px;
          letter-spacing: 0.05em;
          color: #666;
        }

        @media (max-width: 768px) {
          .nav-button {
            font-size: 14px;
            padding: 6px 16px;
          }

          .hero-subtitle {
            font-size: 14px;
          }

          .leaderboard-header,
          .leaderboard-row {
            font-size: 12px;
            padding: 12px;
          }

          .creator-name {
            display: block;
            margin-top: 4px;
          }
        }
      `}</style>
    </>
  )
}
