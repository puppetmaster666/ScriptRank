// pages/leaderboard.tsx
import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { db } from '@/lib/firebase'
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore'
import { PageLayout, Button, Card, Badge, Tabs, EmptyState } from '@/components/designSystem'

interface Idea {
  id: string
  title: string
  type: string
  genre?: string
  industry?: string
  content: string
  userId: string
  userName: string
  userPhotoURL: string
  aiScore: number
  votes: any[]
  voteCount: number
  views: number
  status: 'INVEST' | 'MAYBE' | 'PASS'
  createdAt: any
}

export default function LeaderboardPage() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [timeFilter, setTimeFilter] = useState('week')
  const [sortBy, setSortBy] = useState('votes')

  useEffect(() => {
    fetchIdeas()
  }, [activeTab, timeFilter, sortBy])

  const fetchIdeas = async () => {
    setLoading(true)
    try {
      let q = query(collection(db, 'ideas'))

      // Filter by type
      if (activeTab !== 'all') {
        q = query(q, where('type', '==', activeTab))
      }

      // Sort
      if (sortBy === 'votes') {
        q = query(q, orderBy('voteCount', 'desc'))
      } else if (sortBy === 'ai') {
        q = query(q, orderBy('aiScore', 'desc'))
      } else if (sortBy === 'newest') {
        q = query(q, orderBy('createdAt', 'desc'))
      }

      q = query(q, limit(50))

      const snapshot = await getDocs(q)
      const ideasData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Idea))

      setIdeas(ideasData)
    } catch (error) {
      console.error('Error fetching ideas:', error)
      // Set mock data if fetch fails
      setIdeas([
        {
          id: '1',
          title: 'Neon Nights',
          type: 'entertainment',
          genre: 'scifi',
          content: 'A cyberpunk thriller...',
          userId: '1',
          userName: 'Michael Rodriguez',
          userPhotoURL: '',
          aiScore: 8.7,
          votes: Array(245).fill(1),
          voteCount: 245,
          views: 1234,
          status: 'INVEST',
          createdAt: new Date()
        },
        {
          id: '2',
          title: 'GreenEats',
          type: 'business',
          industry: 'food',
          content: 'Zero-waste meal delivery...',
          userId: '2',
          userName: 'David Park',
          userPhotoURL: '',
          aiScore: 8.4,
          votes: Array(189).fill(1),
          voteCount: 189,
          views: 987,
          status: 'INVEST',
          createdAt: new Date()
        },
        {
          id: '3',
          title: 'Mind Maze VR',
          type: 'game',
          genre: 'puzzle',
          content: 'A VR puzzle game...',
          userId: '3',
          userName: 'Emily Davis',
          userPhotoURL: '',
          aiScore: 7.8,
          votes: Array(156).fill(1),
          voteCount: 156,
          views: 789,
          status: 'MAYBE',
          createdAt: new Date()
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'entertainment': return '🎬'
      case 'game': return '🎮'
      case 'business': return '💼'
      default: return '💡'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'INVEST':
        return <Badge variant="success">INVEST</Badge>
      case 'MAYBE':
        return <Badge variant="warning">MAYBE</Badge>
      default:
        return <Badge variant="danger">PASS</Badge>
    }
  }

  const calculateTotalScore = (idea: Idea) => {
    // AI score (0-10) + public votes (weighted)
    return (idea.aiScore + (idea.voteCount * 0.1)).toFixed(1)
  }

  return (
    <>
      <Head>
        <title>Leaderboard | Make Me Famous</title>
        <meta name="description" content="See the top-rated ideas competing for fame and prizes" />
      </Head>

      <PageLayout>
        {/* Hero Section */}
        <div className="bg-black text-white py-16 px-8">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-5xl font-display font-black mb-4">
              THE LEADERBOARD
            </h1>
            <p className="font-body text-xl opacity-90">
              Where ideas compete for glory
            </p>
            
            {/* Stats Bar */}
            <div className="flex justify-center gap-12 mt-8">
              <div>
                <div className="text-3xl font-bold font-ui">{ideas.length}</div>
                <div className="font-body text-sm opacity-75">Total Ideas</div>
              </div>
              <div>
                <div className="text-3xl font-bold font-ui">
                  {ideas.reduce((sum, idea) => sum + idea.voteCount, 0)}
                </div>
                <div className="font-body text-sm opacity-75">Total Votes</div>
              </div>
              <div>
                <div className="text-3xl font-bold font-ui">$5,000</div>
                <div className="font-body text-sm opacity-75">Monthly Prize</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="border-b-2 border-black bg-gray-50">
          <div className="max-w-6xl mx-auto px-8 py-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Category Tabs */}
              <div className="flex gap-2">
                {[
                  { id: 'all', label: 'All Ideas' },
                  { id: 'entertainment', label: '🎬 Film' },
                  { id: 'game', label: '🎮 Games' },
                  { id: 'business', label: '💼 Business' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 font-ui font-medium rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-black text-white'
                        : 'bg-white text-black border-2 border-gray-300 hover:border-black'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Sort Options */}
              <div className="flex gap-2">
                <select 
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="px-4 py-2 border-2 border-black rounded-lg font-ui bg-white"
                >
                  <option value="all">All Time</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="today">Today</option>
                </select>

                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border-2 border-black rounded-lg font-ui bg-white"
                >
                  <option value="votes">Most Votes</option>
                  <option value="ai">Highest AI Score</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="max-w-6xl mx-auto px-8 py-12">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 font-body">Loading ideas...</p>
            </div>
          ) : ideas.length === 0 ? (
            <EmptyState 
              title="No ideas yet"
              description="Be the first to submit an idea!"
              action={{
                label: "Submit Your Idea",
                href: "/submit"
              }}
            />
          ) : (
            <div className="space-y-4">
              {/* Table Header - Desktop Only */}
              <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-3 font-ui font-bold text-sm uppercase border-b-2 border-black">
                <div className="col-span-1">Rank</div>
                <div className="col-span-5">Idea</div>
                <div className="col-span-2">Creator</div>
                <div className="col-span-1 text-center">AI</div>
                <div className="col-span-1 text-center">Votes</div>
                <div className="col-span-1 text-center">Total</div>
                <div className="col-span-1">Status</div>
              </div>

              {/* Table Rows */}
              {ideas.map((idea, index) => {
                const totalScore = calculateTotalScore(idea)
                const isTop3 = index < 3

                return (
                  <Link key={idea.id} href={`/idea/${idea.id}`}>
                    <Card 
                      hover
                      className={`${isTop3 ? 'border-3 border-black' : ''}`}
                    >
                      {/* Mobile Layout */}
                      <div className="md:hidden">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`text-2xl font-bold font-ui ${
                              index === 0 ? 'text-yellow-500' :
                              index === 1 ? 'text-gray-400' :
                              index === 2 ? 'text-orange-600' :
                              'text-black'
                            }`}>
                              {index === 0 ? '🥇' : 
                               index === 1 ? '🥈' : 
                               index === 2 ? '🥉' : 
                               `#${index + 1}`}
                            </div>
                            <div className="text-2xl">{getTypeIcon(idea.type)}</div>
                          </div>
                          {getStatusBadge(idea.status)}
                        </div>
                        
                        <h3 className="text-xl font-display font-bold mb-2">{idea.title}</h3>
                        <p className="font-body text-sm text-gray-600 mb-3">by {idea.userName}</p>
                        
                        <div className="flex justify-between font-ui text-sm">
                          <span>AI: {idea.aiScore}</span>
                          <span>Votes: {idea.voteCount}</span>
                          <span className="font-bold">Total: {totalScore}</span>
                        </div>
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden md:grid md:grid-cols-12 gap-4 items-center">
                        <div className="col-span-1">
                          <div className={`text-2xl font-bold font-ui ${
                            index === 0 ? 'text-yellow-500' :
                            index === 1 ? 'text-gray-400' :
                            index === 2 ? 'text-orange-600' :
                            'text-black'
                          }`}>
                            {index === 0 ? '🥇' : 
                             index === 1 ? '🥈' : 
                             index === 2 ? '🥉' : 
                             index + 1}
                          </div>
                        </div>
                        
                        <div className="col-span-5">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{getTypeIcon(idea.type)}</span>
                            <div>
                              <h3 className="font-display font-bold text-lg">{idea.title}</h3>
                              <p className="font-body text-xs text-gray-600">
                                {idea.content.substring(0, 60)}...
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="col-span-2">
                          <p className="font-ui text-sm">{idea.userName}</p>
                        </div>
                        
                        <div className="col-span-1 text-center">
                          <span className="font-ui font-bold">{idea.aiScore}</span>
                        </div>
                        
                        <div className="col-span-1 text-center">
                          <span className="font-ui">{idea.voteCount}</span>
                        </div>
                        
                        <div className="col-span-1 text-center">
                          <span className="font-ui font-bold text-lg">{totalScore}</span>
                        </div>
                        
                        <div className="col-span-1">
                          {getStatusBadge(idea.status)}
                        </div>
                      </div>
                    </Card>
                  </Link>
                )
              })}
            </div>
          )}

          {/* Load More */}
          {!loading && ideas.length >= 50 && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Ideas
              </Button>
            </div>
          )}
        </div>
      </PageLayout>

      <style jsx>{`
        .font-display {
          font-family: 'DrukWide', Impact, sans-serif;
        }
        .font-ui {
          font-family: 'Bahnschrift', system-ui, sans-serif;
        }
        .font-body {
          font-family: 'Courier', 'Courier New', monospace;
        }
      `}</style>
    </>
  )
}
