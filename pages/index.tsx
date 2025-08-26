// pages/index.tsx - COMPLETE VERSION WITH ALL FEATURES - MOBILE OPTIMIZED
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

  const getTypeLabel = (type: string): string => {
    switch(type) {
      case 'movie':
      case 'entertainment':
        return 'FILM'
      case 'game':
        return 'GAME'
      case 'business':
        return 'BIZ'
      default:
        return 'IDEA'
    }
  }

  const getGenreOrIndustry = (idea: IdeaPreview): string => {
    if (idea.genre) return idea.genre
    if (idea.industry) return idea.industry
    return idea.type
  }

  const toggleExpanded = (ideaId: string) => {
    setExpandedId(expandedId === ideaId ? null : ideaId)
  }

  const truncateContent = (content: string, maxLength: number = 80): string => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength).trim() + '...'
  }

  return (
    <>
      <Head>
        <title>Make Me Famous - Submit Your Next Big Idea</title>
        <meta name="description" content="Do you have the next Tarantino script? Submit your idea and get scored by our AI. Join the leaderboard for prizes and opportunities." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Hero Section - MOBILE OPTIMIZED */}
        <section className="px-4 sm:px-8 py-12 sm:py-20 bg-black text-white">
          <h1 className="text-center text-white min-h-[40px] sm:min-h-[64px]" style={{ 
            fontFamily: 'DrukWide, Impact, sans-serif',
            fontSize: 'clamp(24px, 6vw, 64px)',
            fontWeight: 900,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            wordBreak: 'break-word'
          }}>
            {typedText}
            <span className="typing-cursor">|</span>
          </h1>
          <p className="text-center mt-6 sm:mt-8 text-white opacity-90 px-4" style={{
            fontFamily: 'Courier New, monospace',
            fontSize: 'clamp(14px, 2.5vw, 18px)',
            lineHeight: 1.6,
            letterSpacing: '0.02em'
          }}>
            SUBMIT YOUR IDEA AND GET SCORED BY OUR AI.<br />
            JOIN THE LEADERBOARD FOR<br />
            PRIZES AND OPPORTUNITIES
          </p>
        </section>

        {/* Leaderboard Section with Previous Month - COMPLETE VERSION */}
        <section className="px-4 sm:px-8 py-8 sm:py-16">
          <div className="max-w-7xl mx-auto">
            {/* Mobile Layout */}
            <div className="lg:hidden">
              {/* Previous Month Section - NOW ON MOBILE */}
              <div className="mb-6 p-4 bg-white border-2 border-black rounded-xl">
                <h3 className="text-lg font-bold mb-3" style={{ fontFamily: 'Bahnschrift, sans-serif' }}>
                  PREVIOUS MONTH WINNERS
                </h3>
                <div className="text-sm text-gray-600 mb-3">
                  {new Date(new Date().setMonth(new Date().getMonth() - 1)).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🥇</span>
                      <div>
                        <div className="font-semibold text-sm">The Memory Thief</div>
                        <div className="text-xs text-gray-600">Score: 9.2</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🥈</span>
                      <div>
                        <div className="font-semibold text-sm">Quantum Break</div>
                        <div className="text-xs text-gray-600">Score: 8.9</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🥉</span>
                      <div>
                        <div className="font-semibold text-sm">Mind Maze VR</div>
                        <div className="text-xs text-gray-600">Score: 8.7</div>
                      </div>
                    </div>
                  </div>
                </div>
                <Link href="/archive" className="block mt-3 text-center py-2 border-2 border-black rounded-lg text-sm font-bold hover:bg-black hover:text-white transition">
                  View Full Archive →
                </Link>
              </div>

              {/* Current Leaderboard */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Bahnschrift, sans-serif' }}>
                  TOP IDEAS THIS {timeFilter.toUpperCase()}
                </h2>
                
                {/* Filter Pills */}
                <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
                  {['all', 'movies', 'games', 'business'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1 border rounded-full text-sm whitespace-nowrap transition-all ${
                        activeTab === tab ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300'
                      }`}
                      style={{ fontFamily: 'Bahnschrift, sans-serif' }}
                    >
                      {tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Ideas Cards with Expandable Content */}
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : topIdeas.length > 0 ? (
                  topIdeas.map((idea, index) => {
                    const aiScore = getAIScore(idea)
                    const publicScore = idea.publicScore?.average || 0
                    const publicVoteCount = idea.publicScore?.count || 0
                    const isExpanded = expandedId === idea.id
                    
                    return (
                      <div key={idea.id} className="bg-white border-2 border-black rounded-lg overflow-hidden">
                        <div 
                          className="p-4 cursor-pointer"
                          onClick={() => toggleExpanded(idea.id)}
                        >
                          {/* Rank Badge and Status */}
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                                index === 0 ? 'bg-yellow-400 text-black' :
                                index === 1 ? 'bg-gray-300 text-black' :
                                index === 2 ? 'bg-amber-600 text-white' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {index + 1}
                              </span>
                              <span className="text-xs text-gray-500 font-bold uppercase">
                                {getTypeLabel(idea.type)}
                              </span>
                            </div>
                            {idea.aiScores?.investmentStatus && (
                              <span className={`text-xs font-bold px-2 py-1 rounded ${
                                idea.aiScores.investmentStatus === 'INVEST' ? 'bg-green-100 text-green-800' :
                                idea.aiScores.investmentStatus === 'MAYBE' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {idea.aiScores.investmentStatus}
                              </span>
                            )}
                          </div>

                          {/* Title */}
                          <h3 className="font-bold text-lg mb-2" style={{ fontFamily: 'Bahnschrift, sans-serif' }}>
                            {idea.title}
                          </h3>

                          {/* Brief */}
                          <p className="text-sm text-gray-600 mb-3">
                            {isExpanded ? idea.content : truncateContent(idea.content)}
                            {idea.content.length > 80 && (
                              <span className="text-blue-600 ml-2 font-bold">
                                {isExpanded ? '▼ Less' : '▶ More'}
                              </span>
                            )}
                          </p>

                          {/* Creator & Scores */}
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">
                              by {idea.creatorName}
                            </span>
                            <div className="flex gap-3 text-xs">
                              <span>AI: <strong>{aiScore.toFixed(1)}</strong></span>
                              {publicVoteCount > 0 && (
                                <span>Public: <strong>{publicScore.toFixed(1)}</strong></span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Expanded Content */}
                        {isExpanded && (
                          <div className="px-4 pb-4 bg-gray-50 border-t border-gray-200">
                            {idea.targetAudience && (
                              <div className="mt-3">
                                <strong className="text-xs text-gray-600">Target Audience:</strong>
                                <p className="text-sm mt-1">{idea.targetAudience}</p>
                              </div>
                            )}
                            
                            {idea.uniqueValue && (
                              <div className="mt-3">
                                <strong className="text-xs text-gray-600">What Makes It Unique:</strong>
                                <p className="text-sm mt-1">{idea.uniqueValue}</p>
                              </div>
                            )}
                            
                            {idea.aiScores?.verdict && (
                              <div className="mt-3 p-3 bg-white rounded-lg border">
                                <strong className="text-xs text-gray-600">AI Verdict:</strong>
                                <p className="text-sm mt-1 italic">"{idea.aiScores.verdict}"</p>
                              </div>
                            )}
                            
                            <Link 
                              href={`/ideas/${idea.id}`}
                              className="block mt-4 text-center py-2 bg-black text-white rounded-lg text-sm font-bold"
                            >
                              View Full Details →
                            </Link>
                          </div>
                        )}
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    No ideas submitted yet. Be the first!
                  </div>
                )}
              </div>

              {/* View All Button */}
              <div className="mt-6 text-center">
                <Link href="/leaderboard" className="inline-block bg-black text-white px-6 py-3 rounded-lg font-bold">
                  VIEW FULL LEADERBOARD →
                </Link>
              </div>
            </div>

            {/* Desktop Layout - KEEP ALL ORIGINAL FEATURES */}
            <div className="hidden lg:grid lg:grid-cols-4 gap-8">
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
                
                {/* Table Container */}
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
                    <div style={{ width: '50px', textAlign: 'center' }}>#</div>
                    <div style={{ width: '60px', textAlign: 'center' }}>TYPE</div>
                    <div style={{ width: '100px' }}>GENRE</div>
                    <div style={{ flex: 1 }}>IDEA</div>
                    <div style={{ width: '140px' }}>CREATOR</div>
                    <div style={{ width: '60px', textAlign: 'center' }}>AI</div>
                    <div style={{ width: '80px', textAlign: 'center' }}>PUBLIC</div>
                  </div>

                  {/* Table Body */}
                  <div>
                    {loading ? (
                      <div className="p-8 text-center">Loading...</div>
                    ) : topIdeas.length > 0 ? (
                      topIdeas.map((idea, index) => {
                        const aiScore = getAIScore(idea)
                        const publicScore = idea.publicScore?.average || 0
                        const publicVoteCount = idea.publicScore?.count || 0
                        const isExpanded = expandedId === idea.id
                        
                        return (
                          <div key={idea.id}>
                            <div
                              style={{
                                display: 'flex',
                                padding: '16px 24px',
                                fontFamily: 'Courier New, monospace',
                                fontSize: '14px',
                                borderBottom: '1px solid #e0e0e0',
                                alignItems: 'center',
                                cursor: 'pointer',
                                transition: 'background 0.2s'
                              }}
                              className="hover:bg-gray-50"
                            >
                              <div style={{ width: '50px', display: 'flex', justifyContent: 'center' }}>
                                <div style={{
                                  width: '32px',
                                  height: '32px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: 'bold',
                                  fontSize: '12px',
                                  color: 'white',
                                  borderRadius: '50%',
                                  backgroundColor: index === 0 ? 'black' : index === 1 ? '#374151' : index === 2 ? '#6B7280' : '#9CA3AF'
                                }}>
                                  {index + 1}
                                </div>
                              </div>
                              
                              <div style={{ width: '60px', textAlign: 'center', fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                                {getTypeLabel(idea.type)}
                              </div>
                              
                              <div style={{ width: '100px', fontSize: '12px', color: '#666' }}>
                                {getGenreOrIndustry(idea)}
                              </div>
                              
                              <div style={{ flex: 1, paddingRight: '10px' }}>
                                <Link href={`/ideas/${idea.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                  <div style={{ fontFamily: 'Bahnschrift, sans-serif', fontWeight: 'bold', fontSize: '15px', marginBottom: '4px' }}>
                                    {idea.title}
                                  </div>
                                </Link>
                                <div 
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleExpanded(idea.id)
                                  }}
                                  style={{ 
                                    fontSize: '12px', 
                                    color: '#666', 
                                    cursor: 'pointer',
                                    textDecoration: 'underline'
                                  }}
                                >
                                  {truncateContent(idea.content)}
                                  {idea.content.length > 80 && (
                                    <span style={{ color: '#000', fontWeight: 'bold', marginLeft: '4px' }}>
                                      {isExpanded ? '▼' : '▶'}
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              <div style={{ width: '140px', fontSize: '12px', color: '#333' }}>
                                {idea.username || idea.userName ? (
                                  <Link 
                                    href={`/profile/${idea.username || idea.userName?.toLowerCase().replace(' ', '.')}`}
                                    style={{ color: '#3B82F6', textDecoration: 'none' }}
                                  >
                                    {idea.creatorName}
                                  </Link>
                                ) : (
                                  <span>{idea.creatorName}</span>
                                )}
                              </div>
                              
                              <div style={{ width: '60px', textAlign: 'center', fontWeight: 'bold', fontSize: '16px' }}>
                                {aiScore.toFixed(2)}
                              </div>
                              
                              <div style={{ width: '80px', textAlign: 'center' }}>
                                {publicVoteCount > 0 ? (
                                  <div>
                                    <span style={{ fontWeight: 'bold', fontSize: '14px' }}>
                                      {publicScore.toFixed(2)}
                                    </span>
                                    <span style={{ display: 'block', fontSize: '10px', color: '#9CA3AF' }}>
                                      ({publicVoteCount} {publicVoteCount === 1 ? 'vote' : 'votes'})
                                    </span>
                                  </div>
                                ) : (
                                  <span style={{ color: '#9CA3AF', fontSize: '12px' }}>No votes</span>
                                )}
                              </div>
                            </div>
                            
                            {/* Expandable Content - Desktop */}
                            {isExpanded && (
                              <div style={{
                                padding: '20px 24px 20px 74px',
                                background: 'linear-gradient(to bottom, #f9fafb, #ffffff)',
                                borderBottom: '1px solid #e0e0e0',
                                animation: 'slideDown 0.3s ease-out'
                              }}>
                                <div style={{
                                  backgroundColor: 'white',
                                  border: '2px solid #e5e7eb',
                                  borderRadius: '8px',
                                  padding: '16px',
                                  position: 'relative'
                                }}>
                                  <button
                                    onClick={() => toggleExpanded(idea.id)}
                                    style={{
                                      position: 'absolute',
                                      top: '8px',
                                      right: '8px',
                                      background: 'none',
                                      border: 'none',
                                      fontSize: '20px',
                                      cursor: 'pointer',
                                      color: '#6B7280'
                                    }}
                                  >
                                    ×
                                  </button>
                                  
                                  <h4 style={{ 
                                    fontFamily: 'Bahnschrift, sans-serif',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    marginBottom: '12px',
                                    color: '#111827'
                                  }}>
                                    Full Brief:
                                  </h4>
                                  
                                  <p style={{
                                    fontFamily: 'Courier New, monospace',
                                    fontSize: '13px',
                                    lineHeight: '1.6',
                                    color: '#374151',
                                    whiteSpace: 'pre-wrap'
                                  }}>
                                    {idea.content}
                                  </p>
                                  
                                  {idea.targetAudience && (
                                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                                      <strong style={{ fontSize: '12px', color: '#6B7280' }}>Target Audience:</strong>
                                      <p style={{ fontSize: '13px', marginTop: '4px' }}>{idea.targetAudience}</p>
                                    </div>
                                  )}
                                  
                                  {idea.uniqueValue && (
                                    <div style={{ marginTop: '12px' }}>
                                      <strong style={{ fontSize: '12px', color: '#6B7280' }}>What Makes It Unique:</strong>
                                      <p style={{ fontSize: '13px', marginTop: '4px' }}>{idea.uniqueValue}</p>
                                    </div>
                                  )}
                                  
                                  {idea.aiScores?.verdict && (
                                    <div style={{ 
                                      marginTop: '16px',
                                      padding: '12px',
                                      background: '#f3f4f6',
                                      borderRadius: '6px'
                                    }}>
                                      <strong style={{ fontSize: '12px', color: '#111827' }}>AI Verdict:</strong>
                                      <p style={{ fontSize: '13px', marginTop: '4px', fontStyle: 'italic' }}>
                                        "{idea.aiScores.verdict}"
                                      </p>
                                    </div>
                                  )}
                                  
                                  <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Link 
                                      href={`/ideas/${idea.id}`}
                                      style={{
                                        fontSize: '12px',
                                        color: '#2563eb',
                                        textDecoration: 'underline',
                                        fontFamily: 'Bahnschrift, sans-serif'
                                      }}
                                    >
                                      View Full Details →
                                    </Link>
                                    
                                    {idea.aiScores?.investmentStatus && (
                                      <span style={{
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        backgroundColor: 
                                          idea.aiScores.investmentStatus === 'INVEST' ? '#10b981' :
                                          idea.aiScores.investmentStatus === 'MAYBE' ? '#f59e0b' : '#ef4444',
                                        color: 'white'
                                      }}>
                                        {idea.aiScores.investmentStatus}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
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

              {/* Sidebar - PREVIOUS MONTH SECTION - DESKTOP */}
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
                      <div style={{ fontWeight: 'bold' }}>1st Place</div>
                      <div style={{ fontSize: '14px' }}>The Memory Thief</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>Score: 9.2</div>
                    </div>
                    <div style={{ paddingBottom: '12px', borderBottom: '1px solid #e0e0e0' }}>
                      <div style={{ fontWeight: 'bold' }}>2nd Place</div>
                      <div style={{ fontSize: '14px' }}>Quantum Break</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>Score: 8.9</div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>3rd Place</div>
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

        {/* How It Works Section - MOBILE OPTIMIZED */}
        <section className="px-4 sm:px-8 py-12 sm:py-16 bg-black text-white">
          <div className="max-w-7xl mx-auto">
            <h2 style={{
              fontFamily: 'DrukWide, Impact, sans-serif',
              fontSize: 'clamp(32px, 5vw, 48px)',
              fontWeight: 900,
              textAlign: 'center',
              marginBottom: '16px'
            }}>
              HOW IT WORKS
            </h2>
            <p style={{
              fontFamily: 'Courier New, monospace',
              fontSize: 'clamp(14px, 2.5vw, 18px)',
              textAlign: 'center',
              marginBottom: 'clamp(32px, 8vw, 64px)',
              opacity: 0.9
            }}>
              FOUR STEPS TO FAME OR SHAME
            </p>

            {/* Steps Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {/* Step 1 */}
              <div className="relative">
                <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 w-10 h-10 sm:w-12 sm:h-12 bg-white text-black rounded-full flex items-center justify-center font-bold text-lg sm:text-xl">
                  1
                </div>
                <div className="bg-gray-900 rounded-xl p-5 sm:p-6 h-full hover:bg-gray-800 transition-all duration-300 hover:transform hover:scale-105">
                  <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">💡</div>
                  <h3 style={{ fontFamily: 'Bahnschrift, sans-serif' }} className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                    SUBMIT YOUR IDEA
                  </h3>
                  <p style={{ fontFamily: 'Courier New, monospace' }} className="text-xs sm:text-sm opacity-90">
                    Movie script? Game concept? Business plan? 
                    Write 30-500 words explaining why it's the next big thing.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 w-10 h-10 sm:w-12 sm:h-12 bg-white text-black rounded-full flex items-center justify-center font-bold text-lg sm:text-xl">
                  2
                </div>
                <div className="bg-gray-900 rounded-xl p-5 sm:p-6 h-full hover:bg-gray-800 transition-all duration-300 hover:transform hover:scale-105">
                  <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🔥</div>
                  <h3 style={{ fontFamily: 'Bahnschrift, sans-serif' }} className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                    GET AI SCORED
                  </h3>
                  <p style={{ fontFamily: 'Courier New, monospace' }} className="text-xs sm:text-sm opacity-90">
                    Our harsh AI judges like a skeptical VC. 
                    Market potential, innovation, execution - all scored 0-10.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 w-10 h-10 sm:w-12 sm:h-12 bg-white text-black rounded-full flex items-center justify-center font-bold text-lg sm:text-xl">
                  3
                </div>
                <div className="bg-gray-900 rounded-xl p-5 sm:p-6 h-full hover:bg-gray-800 transition-all duration-300 hover:transform hover:scale-105">
                  <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">📈</div>
                  <h3 style={{ fontFamily: 'Bahnschrift, sans-serif' }} className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                    CLIMB THE RANKS
                  </h3>
                  <p style={{ fontFamily: 'Courier New, monospace' }} className="text-xs sm:text-sm opacity-90">
                    The community votes. Real people comment. 
                    Watch your idea climb (or crash) in real-time.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative">
                <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 w-10 h-10 sm:w-12 sm:h-12 bg-white text-black rounded-full flex items-center justify-center font-bold text-lg sm:text-xl">
                  4
                </div>
                <div className="bg-gray-900 rounded-xl p-5 sm:p-6 h-full hover:bg-gray-800 transition-all duration-300 hover:transform hover:scale-105">
                  <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🏆</div>
                  <h3 style={{ fontFamily: 'Bahnschrift, sans-serif' }} className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                    WIN REAL PRIZES
                  </h3>
                  <p style={{ fontFamily: 'Courier New, monospace' }} className="text-xs sm:text-sm opacity-90">
                    Monthly winners get $5,000 in prizes. 
                    Top ideas get pitched to real investors & studios.
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 sm:p-6 text-center">
                <div style={{ fontFamily: 'DrukWide, sans-serif' }} className="text-2xl sm:text-3xl font-bold mb-1">
                  10K+
                </div>
                <div style={{ fontFamily: 'Courier New, monospace' }} className="text-xs sm:text-sm opacity-90">
                  Ideas Submitted
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-4 sm:p-6 text-center">
                <div style={{ fontFamily: 'DrukWide, sans-serif' }} className="text-2xl sm:text-3xl font-bold mb-1">
                  $50K
                </div>
                <div style={{ fontFamily: 'Courier New, monospace' }} className="text-xs sm:text-sm opacity-90">
                  Prizes Given
                </div>
              </div>
              <div className="bg-gradient-to-r from-pink-600 to-red-600 rounded-lg p-4 sm:p-6 text-center">
                <div style={{ fontFamily: 'DrukWide, sans-serif' }} className="text-2xl sm:text-3xl font-bold mb-1">
                  3.2
                </div>
                <div style={{ fontFamily: 'Courier New, monospace' }} className="text-xs sm:text-sm opacity-90">
                  Avg AI Score
                </div>
              </div>
              <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-lg p-4 sm:p-6 text-center">
                <div style={{ fontFamily: 'DrukWide, sans-serif' }} className="text-2xl sm:text-3xl font-bold mb-1">
                  12
                </div>
                <div style={{ fontFamily: 'Courier New, monospace' }} className="text-xs sm:text-sm opacity-90">
                  Ideas Funded
                </div>
              </div>
            </div>

            {/* Warning Box */}
            <div className="mt-8 sm:mt-12 max-w-3xl mx-auto bg-red-900 border-2 border-red-500 rounded-xl p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                <span className="text-2xl sm:text-3xl">⚠️</span>
                <div>
                  <h3 style={{ fontFamily: 'Bahnschrift, sans-serif' }} className="text-base sm:text-lg font-bold mb-2">
                    FAIR WARNING
                  </h3>
                  <p style={{ fontFamily: 'Courier New, monospace' }} className="text-xs sm:text-sm opacity-90">
                    The AI doesn't sugarcoat. Most ideas score 3-6. 
                    It's trained to think like a harsh VC who's seen everything. 
                    If you can't handle brutal honesty, this isn't for you.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center mt-8 sm:mt-12">
              <Link href="/how-it-works" style={{
                fontFamily: 'Bahnschrift, sans-serif',
                fontSize: 'clamp(14px, 2.5vw, 16px)',
                padding: '12px 24px',
                border: '2px solid white',
                borderRadius: '8px',
                background: 'transparent',
                color: 'white',
                textDecoration: 'none',
                display: 'inline-block',
                transition: 'all 0.2s'
              }}
              className="hover:bg-white hover:text-black">
                LEARN MORE ABOUT THE PROCESS →
              </Link>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="px-4 sm:px-8 py-12 sm:py-16 border-t-2 border-black">
          <div className="text-center">
            <h2 style={{
              fontFamily: 'DrukWide, Impact, sans-serif',
              fontSize: 'clamp(24px, 5vw, 36px)',
              fontWeight: 900,
              marginBottom: '32px'
            }}>
              READY TO GET FAMOUS?
            </h2>
            <Link href="/submit" style={{
              fontFamily: 'Bahnschrift, sans-serif',
              fontSize: 'clamp(16px, 2.5vw, 18px)',
              padding: 'clamp(12px, 2vw, 16px) clamp(32px, 6vw, 48px)',
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
        <footer className="px-4 sm:px-8 py-6 sm:py-8 border-t-2 border-black">
          <div className="text-center" style={{
            fontFamily: 'Courier New, monospace',
            fontSize: 'clamp(10px, 2vw, 12px)',
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

        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 500px;
          }
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
