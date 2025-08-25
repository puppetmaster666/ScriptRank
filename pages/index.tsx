// pages/index.tsx - FULLY FIXED VERSION
import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore'

interface IdeaPreview {
  id: string
  title: string
  type: string
  aiScore?: number  // Support both old and new structure
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
    setLoading(true)
    try {
      // Try to get ideas from the main collection first
      const ideasRef = collection(db, 'ideas')
      let allIdeas: IdeaPreview[] = []
      
      // First try: Get all ideas with aiScores.overall
      try {
        const q1 = query(ideasRef, orderBy('aiScores.overall', 'desc'), limit(20))
        const snapshot1 = await getDocs(q1)
        
        snapshot1.docs.forEach(doc => {
          const data = doc.data()
          allIdeas.push({
            id: doc.id,
            title: data.title || 'Untitled',
            type: data.type || 'unknown',
            aiScore: data.aiScores?.overall || data.aiScore || 0,
            aiScores: data.aiScores,
            publicScore: data.publicScore,
            votes: data.votes,
            voteCount: data.voteCount || data.votes?.length || 0,
            creatorName: data.userName || data.username || 'Anonymous',
            userName: data.userName,
            username: data.username
          })
        })
      } catch (e1) {
        console.log('No ideas with aiScores.overall, trying aiScore...')
        
        // Second try: Get ideas with flat aiScore
        try {
          const q2 = query(ideasRef, orderBy('aiScore', 'desc'), limit(20))
          const snapshot2 = await getDocs(q2)
          
          snapshot2.docs.forEach(doc => {
            const data = doc.data()
            allIdeas.push({
              id: doc.id,
              title: data.title || 'Untitled',
              type: data.type || 'unknown',
              aiScore: data.aiScore || 0,
              publicScore: data.publicScore,
              votes: data.votes,
              voteCount: data.voteCount || data.votes?.length || 0,
              creatorName: data.userName || data.username || 'Anonymous',
              userName: data.userName,
              username: data.username
            })
          })
        } catch (e2) {
          console.log('No ideas with aiScore either, trying without order...')
          
          // Third try: Just get any ideas
          const q3 = query(ideasRef, limit(20))
          const snapshot3 = await getDocs(q3)
          
          snapshot3.docs.forEach(doc => {
            const data = doc.data()
            allIdeas.push({
              id: doc.id,
              title: data.title || 'Untitled',
              type: data.type || 'unknown',
              aiScore: data.aiScores?.overall || data.aiScore || 0,
              aiScores: data.aiScores,
              publicScore: data.publicScore,
              votes: data.votes,
              voteCount: data.voteCount || data.votes?.length || 0,
              creatorName: data.userName || data.username || 'Anonymous',
              userName: data.userName,
              username: data.username
            })
          })
        }
      }

      // Also check legacy collections
      const legacyCollections = ['movies', 'games', 'business']
      for (const collName of legacyCollections) {
        try {
          const legacyRef = collection(db, collName)
          const legacyQuery = query(legacyRef, limit(5))
          const legacySnapshot = await getDocs(legacyQuery)
          
          legacySnapshot.docs.forEach(doc => {
            const data = doc.data()
            allIdeas.push({
              id: doc.id,
              title: data.title || 'Untitled',
              type: collName === 'movies' ? 'movie' : collName === 'games' ? 'game' : 'business',
              aiScore: data.aiScores?.overall || data.aiScore || 0,
              aiScores: data.aiScores,
              publicScore: data.publicScore,
              votes: data.votes,
              voteCount: data.voteCount || data.votes?.length || 0,
              creatorName: data.userName || data.username || 'Anonymous',
              userName: data.userName,
              username: data.username
            })
          })
        } catch (err) {
          console.log(`No ${collName} collection`)
        }
      }

      // Sort all ideas by score
      allIdeas.sort((a, b) => {
        const scoreA = a.aiScores?.overall || a.aiScore || 0
        const scoreB = b.aiScores?.overall || b.aiScore || 0
        return scoreB - scoreA
      })

      // Filter by type if needed
      if (activeTab !== 'all') {
        const typeMap: any = {
          'movies': 'movie',
          'games': 'game',
          'business': 'business'
        }
        allIdeas = allIdeas.filter(idea => idea.type === typeMap[activeTab])
      }

      console.log('Found ideas:', allIdeas)
      setTopIdeas(allIdeas.slice(0, 20))
    } catch (error) {
      console.error('Error fetching ideas:', error)
      setTopIdeas([])
    } finally {
      setLoading(false)
    }
  }

  // Helper function to safely get AI score
  const getAIScore = (idea: IdeaPreview): number => {
    return idea.aiScores?.overall || idea.aiScore || 0
  }

  return (
    <>
      <Head>
        <title>Make Me Famous - Submit Your Next Big Idea</title>
        <meta name="description" content="Do you have the next Tarantino script? Submit your idea and get scored by our AI. Join the leaderboard for prizes and opportunities." />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="px-8 py-20 bg-black text-white">
          <h1 className="text-center text-white min-h-[64px]" style={{ 
            fontFamily: 'DrukWide, Impact, sans-serif',
            fontSize: 'clamp(32px, 5vw, 64px)',
            fontWeight: 900,
            letterSpacing: '-0.02em',
            lineHeight: 1
          }}>
            {typedText}
            <span className="typing-cursor">|</span>
          </h1>
          <p className="text-center mt-8 text-white opacity-90" style={{
            fontFamily: 'Courier New, monospace',
            fontSize: '18px',
            lineHeight: 1.6,
            letterSpacing: '0.02em'
          }}>
            SUBMIT YOUR IDEA AND GET SCORED BY OUR AI.<br />
            JOIN THE LEADERBOARD FOR<br />
            PRIZES AND OPPORTUNITIES
          </p>
        </section>

        {/* Leaderboard Section */}
        <section className="px-8 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Main Table - Takes 3 columns */}
              <div className="lg:col-span-3">
                {/* Tab and Filters Container */}
                <div className="flex flex-wrap gap-2 mb-0">
                  {/* Tab attached to table */}
                  <div style={{
                    fontFamily: 'Bahnschrift, sans-serif',
                    fontSize: '16px',
                    padding: '12px 32px',
                    border: '2px solid black',
                    borderBottom: 'none',
                    borderRadius: '12px 12px 0 0',
                    background: 'black',
                    color: 'white',
                    display: 'inline-block',
                    fontWeight: 500,
                    position: 'relative',
                    zIndex: 10
                  }}>
                    TOP IDEAS THIS {timeFilter.toUpperCase()}
                  </div>
                  
                  {/* Filter buttons */}
                  <div className="flex gap-2 ml-auto">
                    {['all', 'movies', 'games', 'business'].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 border-2 rounded-lg transition-all`}
                        style={{
                          fontFamily: 'Bahnschrift, sans-serif',
                          backgroundColor: activeTab === tab ? 'black' : 'white',
                          color: activeTab === tab ? 'white' : 'black',
                          borderColor: 'black'
                        }}
                      >
                        {tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Table Container - Attached to tab */}
                <div style={{
                  border: '2px solid black',
                  borderRadius: '0 12px 12px 12px',
                  background: 'white',
                  overflow: 'hidden',
                  marginTop: '-2px'
                }}>
                  {/* Table Header */}
                  <div style={{
                    display: 'flex',
                    padding: '16px 24px',
                    fontFamily: 'Bahnschrift, sans-serif',
                    fontSize: '14px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    borderBottom: '2px solid black',
                    background: 'black',
                    color: 'white'
                  }}>
                    <div style={{ width: '64px', textAlign: 'center' }}>#</div>
                    <div style={{ flex: 1 }}>IDEA</div>
                    <div style={{ width: '80px', textAlign: 'center' }}>AI</div>
                    <div style={{ width: '100px', textAlign: 'center' }}>PUBLIC</div>
                    <div style={{ width: '100px', textAlign: 'center' }}>TOTAL</div>
                  </div>

                  {/* Table Body */}
                  <div>
                    {loading ? (
                      <div className="p-8 text-center">Loading...</div>
                    ) : topIdeas.length > 0 ? (
                      topIdeas.map((idea, index) => {
                        const aiScore = getAIScore(idea)
                        const publicScore = idea.publicScore?.average || 0
                        const totalScore = publicScore > 0 ? ((aiScore + publicScore) / 2).toFixed(1) : aiScore.toFixed(1)
                        
                        return (
                          <Link 
                            key={idea.id}
                            href={`/ideas/${idea.id}`}
                            style={{
                              display: 'flex',
                              padding: '20px 24px',
                              fontFamily: 'Courier New, monospace',
                              fontSize: '16px',
                              borderBottom: index === topIdeas.length - 1 ? 'none' : '1px solid #e0e0e0',
                              textDecoration: 'none',
                              color: 'black',
                              transition: 'background 0.2s',
                              cursor: 'pointer',
                              alignItems: 'center'
                            }}
                            className="hover:bg-gray-50"
                          >
                            <div style={{ width: '64px', display: 'flex', justifyContent: 'center' }}>
                              <div style={{
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                color: 'white',
                                borderRadius: '50%',
                                backgroundColor: index === 0 ? 'black' : index === 1 ? '#374151' : index === 2 ? '#6B7280' : '#9CA3AF'
                              }}>
                                {index + 1}
                              </div>
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontFamily: 'Bahnschrift, sans-serif', fontWeight: 'bold', fontSize: '18px' }}>
                                {idea.title}
                              </div>
                              <div style={{ fontSize: '14px', color: '#666', marginTop: '2px' }}>
                                by {idea.creatorName}
                              </div>
                            </div>
                            <div style={{ width: '80px', textAlign: 'center', fontWeight: 'bold', fontSize: '18px' }}>
                              {aiScore.toFixed(1)}
                            </div>
                            <div style={{ width: '100px', textAlign: 'center' }}>
                              {idea.publicScore && idea.publicScore.count > 0 ? (
                                <div>
                                  <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{publicScore.toFixed(1)}</span>
                                  <span style={{ display: 'block', fontSize: '12px', color: '#9CA3AF' }}>
                                    ({idea.publicScore.count} votes)
                                  </span>
                                </div>
                              ) : (
                                <span style={{ color: '#9CA3AF' }}>0.0</span>
                              )}
                            </div>
                            <div style={{ width: '100px', textAlign: 'center' }}>
                              <div style={{
                                fontSize: '20px',
                                fontWeight: 'bold',
                                backgroundColor: 'black',
                                color: 'white',
                                padding: '4px 12px',
                                borderRadius: '6px',
                                display: 'inline-block'
                              }}>
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
                  </div>
                  
                  {/* View All Link */}
                  <div style={{
                    textAlign: 'center',
                    padding: '24px',
                    borderTop: '1px solid #e0e0e0'
                  }}>
                    <Link href="/leaderboard" style={{
                      fontFamily: 'Bahnschrift, sans-serif',
                      fontSize: '14px',
                      color: 'black',
                      textDecoration: 'underline'
                    }}>
                      VIEW FULL LEADERBOARD →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Sidebar - Takes 1 column */}
              <div className="lg:col-span-1">
                <div style={{
                  border: '2px solid black',
                  borderRadius: '12px',
                  padding: '24px',
                  background: 'white'
                }}>
                  <h3 style={{
                    fontFamily: 'Bahnschrift, sans-serif',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    marginBottom: '16px'
                  }}>
                    PREVIOUS MONTH
                  </h3>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
                    {new Date(new Date().setMonth(new Date().getMonth() - 1)).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </div>
                  <div className="space-y-3">
                    <div style={{ paddingBottom: '12px', borderBottom: '1px solid #e0e0e0' }}>
                      <div style={{ fontWeight: 'bold' }}>🥇 Winner</div>
                      <div style={{ fontSize: '14px' }}>The Memory Thief</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>Score: 9.2</div>
                    </div>
                    <div style={{ paddingBottom: '12px', borderBottom: '1px solid #e0e0e0' }}>
                      <div style={{ fontWeight: 'bold' }}>🥈 Runner-up</div>
                      <div style={{ fontSize: '14px' }}>Quantum Break</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>Score: 8.9</div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>🥉 Third Place</div>
                      <div style={{ fontSize: '14px' }}>Mind Maze VR</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>Score: 8.7</div>
                    </div>
                  </div>
                  <Link href="/archive" style={{
                    display: 'block',
                    marginTop: '24px',
                    textAlign: 'center',
                    padding: '8px',
                    border: '2px solid black',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    color: 'black',
                    transition: 'all 0.2s'
                  }}
                  className="hover:bg-black hover:text-white">
                    View Archive →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="px-8 py-16 border-t-2 border-black">
          <div className="text-center">
            <h2 style={{
              fontFamily: 'DrukWide, Impact, sans-serif',
              fontSize: '36px',
              fontWeight: 900,
              marginBottom: '32px'
            }}>
              READY TO GET FAMOUS?
            </h2>
            <Link href="/submit" style={{
              fontFamily: 'Bahnschrift, sans-serif',
              fontSize: '18px',
              padding: '16px 48px',
              border: '3px solid black',
              borderRadius: '8px',
              background: 'black',
              color: 'white',
              textDecoration: 'none',
              display: 'inline-block',
              transition: 'all 0.2s'
            }}
            className="hover:bg-white hover:text-black">
              SUBMIT YOUR IDEA
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-8 py-8 border-t-2 border-black">
          <div className="text-center" style={{
            fontFamily: 'Courier New, monospace',
            fontSize: '12px',
            letterSpacing: '0.05em',
            color: '#666'
          }}>
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

        .hover\\:bg-gray-50:hover {
          background-color: #f9fafb;
        }

        .hover\\:bg-black:hover {
          background-color: black;
        }

        .hover\\:text-white:hover {
          color: white;
        }
      `}</style>
    </>
  )
}
