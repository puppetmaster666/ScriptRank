// pages/ideas/[id].tsx
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import { doc, getDoc, updateDoc, collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore'
import { castVote } from '@/lib/firebase-collections'

interface IdeaData {
  id: string
  title: string
  type: string
  genre?: string
  industry?: string
  content: string
  uniqueValue?: string
  targetAudience?: string
  userId: string
  userName?: string
  username?: string
  userPhotoURL?: string
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
  aiComment?: string
  status?: 'INVEST' | 'MAYBE' | 'PASS'
  votes?: { userId: string; userName: string; value: number }[]
  voteCount?: number
  views?: number
  createdAt: any
  publicScore?: {
    average: number
    count: number
  }
}

interface Comment {
  id: string
  userId: string
  userName: string
  userPhotoURL: string
  content: string
  createdAt: any
}

export default function IdeaDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  
  const [idea, setIdea] = useState<IdeaData | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [voting, setVoting] = useState(false)
  const [commenting, setCommenting] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [userVoteScore, setUserVoteScore] = useState<number>(5.00) // Default to 5
  const [hasVoted, setHasVoted] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setAuthLoading(false)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (id && typeof id === 'string') {
      fetchIdea()
      fetchComments()
    }
  }, [id])

  useEffect(() => {
    // Check if user has already voted
    const checkUserVote = async () => {
      if (user && id && typeof id === 'string') {
        try {
          const voteId = `${user.uid}_${id}`
          const voteDoc = await getDoc(doc(db, 'votes', voteId))
          if (voteDoc.exists()) {
            setHasVoted(true)
            setUserVoteScore(voteDoc.data().score || 0)
          }
        } catch (error) {
          console.error('Error checking user vote:', error)
        }
      }
    }
    checkUserVote()
  }, [user, id])

  const fetchIdea = async () => {
    if (!id || typeof id !== 'string') return
    
    try {
      const ideaDoc = await getDoc(doc(db, 'ideas', id))
      
      if (ideaDoc.exists()) {
        const data = ideaDoc.data()
        const ideaData: IdeaData = { 
          id: ideaDoc.id, 
          ...data,
          votes: data.votes || [],
          userName: data.userName || data.username || 'Anonymous'
        } as IdeaData
        
        setIdea(ideaData)
        
        // Increment view count
        try {
          await updateDoc(doc(db, 'ideas', id), {
            views: (data.views || 0) + 1
          })
        } catch (err) {
          console.log('Could not update views')
        }
      } else {
        console.error('Idea not found')
        router.push('/404')
      }
    } catch (error) {
      console.error('Error fetching idea:', error)
      router.push('/404')
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = () => {
    if (!id || typeof id !== 'string') return
    
    try {
      const commentsQuery = query(
        collection(db, 'ideas', id, 'comments'),
        orderBy('createdAt', 'desc')
      )
      
      const unsubscribe = onSnapshot(commentsQuery, (snapshot) => {
        const commentsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Comment[]
        setComments(commentsData)
      }, (error) => {
        console.error('Error fetching comments:', error)
        setComments([])
      })
      
      return () => unsubscribe()
    } catch (error) {
      console.error('Error setting up comments listener:', error)
      setComments([])
    }
  }

  const handleVote = async () => {
    if (!user || !idea || voting || !id || hasVoted) return
    
    setVoting(true)
    
    try {
      // Use the castVote function from firebase-collections
      await castVote(user.uid, id as string, userVoteScore)
      
      setHasVoted(true)
      alert(`You rated this idea ${userVoteScore.toFixed(2)}/10`)
      
      // Refresh idea data
      await fetchIdea()
    } catch (error: any) {
      console.error('Error voting:', error)
      if (error.message === 'You have already voted on this idea') {
        setHasVoted(true)
        alert('You have already voted on this idea')
      } else {
        alert('Failed to vote. Please try again.')
      }
    } finally {
      setVoting(false)
    }
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !commentText.trim() || commenting || !id) return
    
    setCommenting(true)
    
    try {
      await addDoc(collection(db, 'ideas', id as string, 'comments'), {
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        userPhotoURL: user.photoURL || '',
        content: commentText.trim(),
        createdAt: new Date()
      })
      
      setCommentText('')
    } catch (error) {
      console.error('Error adding comment:', error)
      alert('Failed to add comment. Please try again.')
    } finally {
      setCommenting(false)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'movie':
      case 'entertainment': 
        return '🎬'
      case 'game': 
        return '🎮'
      case 'business': 
        return '💼'
      default: 
        return '💡'
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'INVEST': return 'text-green-600'
      case 'MAYBE': return 'text-yellow-600'
      default: return 'text-red-600'
    }
  }

  // Get AI score safely
  const getAIScore = (): number => {
    if (idea?.aiScores?.overall) return idea.aiScores.overall
    if (idea?.aiScore) return idea.aiScore
    return 0
  }

  const getInvestmentStatus = (): string => {
    if (idea?.aiScores?.investmentStatus) return idea.aiScores.investmentStatus
    if (idea?.status) return idea.status
    return 'PASS'
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!idea) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Idea not found</h1>
          <Link href="/leaderboard" className="text-blue-600 hover:underline">
            Back to Leaderboard
          </Link>
        </div>
      </div>
    )
  }

  const aiScore = getAIScore()
  const publicScore = idea.publicScore?.average || 0
  const totalScore = publicScore > 0 ? ((aiScore + publicScore) / 2).toFixed(1) : aiScore.toFixed(1)

  return (
    <>
      <Head>
        <title>{idea.title} | Make Me Famous</title>
        <meta name="description" content={idea.content.substring(0, 160)} />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="bg-black text-white py-12 px-8">
          <div className="max-w-4xl mx-auto">
            {/* Title and Type */}
            <div className="flex items-start gap-4 mb-6">
              <div className="text-5xl">{getTypeIcon(idea.type)}</div>
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'DrukWide, Impact, sans-serif' }}>
                  {idea.title}
                </h1>
                <div className="flex items-center gap-4" style={{ fontFamily: 'Courier New, monospace' }}>
                  <span>{idea.genre || idea.industry || idea.type}</span>
                  <span>•</span>
                  <span>by {idea.userName}</span>
                  <span>•</span>
                  <span>{idea.views || 0} views</span>
                </div>
              </div>
            </div>

            {/* Scores */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold">{aiScore.toFixed(1)}/10</div>
                <div className="text-sm opacity-75">AI Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {publicScore > 0 ? publicScore.toFixed(1) : '-'}/10
                </div>
                <div className="text-sm opacity-75">Public Score ({idea.publicScore?.count || 0})</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{totalScore}</div>
                <div className="text-sm opacity-75">Total Score</div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* The Pitch */}
              <div className="bg-white border-2 border-black rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">THE PITCH</h2>
                <p className="whitespace-pre-wrap leading-relaxed">
                  {idea.content}
                </p>
                
                {idea.uniqueValue && (
                  <div className="mt-6 pt-6 border-t-2 border-gray-200">
                    <h3 className="font-bold mb-2">What Makes It Unique</h3>
                    <p className="text-gray-700">{idea.uniqueValue}</p>
                  </div>
                )}
                
                {idea.targetAudience && (
                  <div className="mt-6 pt-6 border-t-2 border-gray-200">
                    <h3 className="font-bold mb-2">Target Audience</h3>
                    <p className="text-gray-700">{idea.targetAudience}</p>
                  </div>
                )}
              </div>

              {/* AI Analysis */}
              <div className="bg-white border-2 border-black rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">AI ANALYSIS</h2>
                  <div className={`text-3xl font-bold ${getStatusColor(getInvestmentStatus())}`}>
                    {getInvestmentStatus()}
                  </div>
                </div>
                
                {/* Detailed Scores if available */}
                {idea.aiScores && (
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-600">Market</div>
                      <div className="text-xl font-bold">{idea.aiScores.market.toFixed(1)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Innovation</div>
                      <div className="text-xl font-bold">{idea.aiScores.innovation.toFixed(1)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Execution</div>
                      <div className="text-xl font-bold">{idea.aiScores.execution.toFixed(1)}</div>
                    </div>
                  </div>
                )}
                
                <div className="p-4 bg-gray-50 border-2 border-black rounded-lg">
                  <p className="italic">
                    "{idea.aiScores?.verdict || idea.aiComment || 'AI analysis pending...'}"
                  </p>
                </div>

                {/* Detailed Feedback if available */}
                {idea.aiScores?.marketFeedback && (
                  <div className="mt-4 space-y-2 text-sm">
                    <div><strong>Market:</strong> {idea.aiScores.marketFeedback}</div>
                    <div><strong>Innovation:</strong> {idea.aiScores.innovationFeedback}</div>
                    <div><strong>Execution:</strong> {idea.aiScores.executionFeedback}</div>
                  </div>
                )}
              </div>

              {/* Comments */}
              <div className="bg-white border-2 border-black rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-6">COMMENTS</h2>
                
                {user ? (
                  <form onSubmit={handleComment} className="mb-6">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Share your thoughts..."
                      rows={3}
                      className="w-full p-3 border-2 border-black rounded-lg"
                    />
                    <div className="flex justify-end mt-3">
                      <button
                        type="submit"
                        disabled={commenting || !commentText.trim()}
                        className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
                      >
                        {commenting ? 'Posting...' : 'Post Comment'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="p-4 bg-gray-50 border-2 border-gray-300 rounded-lg mb-6">
                    <p className="text-center">
                      <Link href="/register" className="underline hover:no-underline">Sign in</Link> to comment
                    </p>
                  </div>
                )}
                
                {comments.length > 0 ? (
                  <div className="space-y-4">
                    {comments.map(comment => (
                      <div key={comment.id} className="border-b border-gray-200 pb-4 last:border-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-bold">{comment.userName}</span>
                          <span className="text-xs text-gray-500">
                            {comment.createdAt?.toDate?.()?.toLocaleDateString() || 'Just now'}
                          </span>
                        </div>
                        <p className="text-gray-800">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center">No comments yet. Be the first!</p>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Vote Section - UPDATED WITH SLIDER */}
              <div className="bg-white border-2 border-black rounded-lg p-6">
                <h3 className="font-bold mb-4">RATE THIS IDEA</h3>
                {user ? (
                  hasVoted ? (
                    <div className="text-center">
                      <div className="text-2xl mb-2">✅</div>
                      <p className="font-bold text-lg mb-1">You rated: {userVoteScore.toFixed(2)}/10</p>
                      <p className="text-sm text-gray-600">Thank you for voting!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Your Rating</span>
                          <span className="font-bold text-lg">{userVoteScore.toFixed(2)}/10</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="10"
                          step="0.01"
                          value={userVoteScore}
                          onChange={(e) => setUserVoteScore(parseFloat(e.target.value))}
                          className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                          style={{
                            background: `linear-gradient(to right, black 0%, black ${userVoteScore * 10}%, #e5e7eb ${userVoteScore * 10}%, #e5e7eb 100%)`
                          }}
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>0</span>
                          <span>2.5</span>
                          <span>5</span>
                          <span>7.5</span>
                          <span>10</span>
                        </div>
                      </div>
                      <button
                        onClick={handleVote}
                        disabled={voting}
                        className="w-full px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50 font-bold"
                      >
                        {voting ? 'Submitting...' : `Submit Rating (${userVoteScore.toFixed(2)})`}
                      </button>
                      <p className="text-xs text-gray-500 text-center">
                        You can only vote once
                      </p>
                    </div>
                  )
                ) : (
                  <p className="text-center">
                    <Link href="/register" className="underline hover:no-underline">Sign in</Link> to rate
                  </p>
                )}
              </div>

              {/* Share Section */}
              <div className="bg-white border-2 border-black rounded-lg p-6">
                <h3 className="font-bold mb-4">SHARE</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href)
                      alert('Link copied!')
                    }}
                    className="w-full px-4 py-2 border-2 border-black rounded-lg hover:bg-gray-100 transition"
                  >
                    📋 Copy Link
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Custom slider styles */
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: black;
          cursor: pointer;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: black;
          cursor: pointer;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </>
  )
}
