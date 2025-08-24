// pages/idea/[id].tsx
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '@/lib/firebase'
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore'
import { PageLayout, Button, Card, Badge, Textarea, EmptyState } from '@/components/designSystem'

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
  userName: string
  userPhotoURL: string
  aiScore: number
  aiComment: string
  status: 'INVEST' | 'MAYBE' | 'PASS'
  votes: { userId: string; userName: string; value: number }[]
  voteCount: number
  views: number
  createdAt: any
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
  const [user] = useAuthState(auth)
  
  const [idea, setIdea] = useState<IdeaData | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [voting, setVoting] = useState(false)
  const [commenting, setCommenting] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [userVote, setUserVote] = useState<number>(0) // -1, 0, or 1

  useEffect(() => {
    if (id) {
      fetchIdea()
      fetchComments()
    }
  }, [id])

  useEffect(() => {
    if (user && idea) {
      const existingVote = idea.votes.find(v => v.userId === user.uid)
      if (existingVote) {
        setUserVote(existingVote.value)
      }
    }
  }, [user, idea])

  const fetchIdea = async () => {
    if (!id) return
    
    try {
      const ideaDoc = await getDoc(doc(db, 'ideas', id as string))
      
      if (ideaDoc.exists()) {
        const data = { id: ideaDoc.id, ...ideaDoc.data() } as IdeaData
        setIdea(data)
        
        // Increment view count
        await updateDoc(doc(db, 'ideas', id as string), {
          views: (data.views || 0) + 1
        })
      } else {
        router.push('/404')
      }
    } catch (error) {
      console.error('Error fetching idea:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = () => {
    if (!id) return
    
    const commentsQuery = query(
      collection(db, 'ideas', id as string, 'comments'),
      orderBy('createdAt', 'desc')
    )
    
    const unsubscribe = onSnapshot(commentsQuery, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Comment[]
      setComments(commentsData)
    })
    
    return () => unsubscribe()
  }

  const handleVote = async (value: number) => {
    if (!user || !idea || voting) return
    
    setVoting(true)
    
    try {
      const voteData = {
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        value
      }
      
      // Remove existing vote if any
      if (userVote !== 0) {
        await updateDoc(doc(db, 'ideas', id as string), {
          votes: arrayRemove({ userId: user.uid, userName: user.displayName || 'Anonymous', value: userVote }),
          voteCount: idea.voteCount - userVote
        })
      }
      
      // Add new vote if not removing
      if (value !== userVote) {
        await updateDoc(doc(db, 'ideas', id as string), {
          votes: arrayUnion(voteData),
          voteCount: idea.voteCount - userVote + value
        })
        setUserVote(value)
      } else {
        setUserVote(0)
      }
      
      // Refresh idea data
      await fetchIdea()
    } catch (error) {
      console.error('Error voting:', error)
    } finally {
      setVoting(false)
    }
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !commentText.trim() || commenting) return
    
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
    } finally {
      setCommenting(false)
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'INVEST': return 'text-green-600'
      case 'MAYBE': return 'text-yellow-600'
      default: return 'text-red-600'
    }
  }

  if (loading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
        </div>
      </PageLayout>
    )
  }

  if (!idea) {
    return (
      <PageLayout>
        <EmptyState 
          title="Idea not found"
          description="This idea may have been removed or doesn't exist."
          action={{ label: "View Leaderboard", href: "/leaderboard" }}
        />
      </PageLayout>
    )
  }

  const totalScore = (idea.aiScore + (idea.voteCount * 0.1)).toFixed(1)

  return (
    <>
      <Head>
        <title>{idea.title} | Make Me Famous</title>
        <meta name="description" content={idea.content.substring(0, 160)} />
      </Head>

      <PageLayout>
        {/* Hero Section */}
        <div className="bg-black text-white py-12 px-8">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm font-ui mb-6 opacity-75">
              <Link href="/" className="hover:opacity-100">Home</Link>
              <span>/</span>
              <Link href="/leaderboard" className="hover:opacity-100">Leaderboard</Link>
              <span>/</span>
              <span className="opacity-100">{idea.title}</span>
            </div>

            {/* Title and Type */}
            <div className="flex items-start gap-4 mb-6">
              <div className="text-5xl">{getTypeIcon(idea.type)}</div>
              <div className="flex-1">
                <h1 className="text-4xl font-display font-black mb-2">
                  {idea.title}
                </h1>
                <div className="flex items-center gap-4 font-body">
                  <span>{idea.genre || idea.industry || idea.type}</span>
                  <span>•</span>
                  <span>by <Link href={`/profile/${idea.userName.toLowerCase().replace(' ', '.')}`} className="underline hover:no-underline">{idea.userName}</Link></span>
                  <span>•</span>
                  <span>{idea.views} views</span>
                </div>
              </div>
            </div>

            {/* Scores */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold font-ui">{idea.aiScore}/10</div>
                <div className="font-body text-sm opacity-75">AI Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold font-ui">{idea.voteCount}</div>
                <div className="font-body text-sm opacity-75">Community Votes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold font-ui">{totalScore}</div>
                <div className="font-body text-sm opacity-75">Total Score</div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* The Pitch */}
              <Card>
                <h2 className="text-2xl font-display font-bold mb-4">THE PITCH</h2>
                <p className="font-body text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {idea.content}
                </p>
                
                {idea.uniqueValue && (
                  <div className="mt-6 pt-6 border-t-2 border-gray-200">
                    <h3 className="font-ui font-bold mb-2">What Makes It Unique</h3>
                    <p className="font-body text-gray-700">
                      {idea.uniqueValue}
                    </p>
                  </div>
                )}
                
                {idea.targetAudience && (
                  <div className="mt-6 pt-6 border-t-2 border-gray-200">
                    <h3 className="font-ui font-bold mb-2">Target Audience</h3>
                    <p className="font-body text-gray-700">
                      {idea.targetAudience}
                    </p>
                  </div>
                )}
              </Card>

              {/* AI Analysis */}
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-display font-bold">AI ANALYSIS</h2>
                  <div className={`text-3xl font-bold ${getStatusColor(idea.status)}`}>
                    {idea.status}
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-ui font-medium">Score</span>
                    <span className="font-ui font-bold text-xl">{idea.aiScore}/10</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-black rounded-full h-4 transition-all"
                      style={{ width: `${idea.aiScore * 10}%` }}
                    />
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 border-2 border-black rounded-lg">
                  <p className="font-body text-sm italic">
                    "{idea.aiComment}"
                  </p>
                </div>
              </Card>

              {/* Comments */}
              <Card>
                <h2 className="text-2xl font-display font-bold mb-6">COMMENTS</h2>
                
                {user ? (
                  <form onSubmit={handleComment} className="mb-6">
                    <Textarea
                      label=""
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Share your thoughts..."
                      rows={3}
                    />
                    <div className="flex justify-end mt-3">
                      <Button 
                        type="submit"
                        variant="primary"
                        size="sm"
                        disabled={commenting || !commentText.trim()}
                      >
                        {commenting ? 'Posting...' : 'Post Comment'}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="p-4 bg-gray-50 border-2 border-gray-300 rounded-lg mb-6">
                    <p className="font-body text-sm text-center">
                      <Link href="/login" className="underline hover:no-underline">Sign in</Link> to comment
                    </p>
                  </div>
                )}
                
                {comments.length > 0 ? (
                  <div className="space-y-4">
                    {comments.map(comment => (
                      <div key={comment.id} className="border-b border-gray-200 pb-4 last:border-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Link 
                            href={`/profile/${comment.userName.toLowerCase().replace(' ', '.')}`}
                            className="font-ui font-medium hover:underline"
                          >
                            {comment.userName}
                          </Link>
                          <span className="font-body text-xs text-gray-500">
                            {comment.createdAt?.toDate?.()?.toLocaleDateString() || 'Just now'}
                          </span>
                        </div>
                        <p className="font-body text-gray-800">
                          {comment.content}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="font-body text-gray-500 text-center">
                    No comments yet. Be the first!
                  </p>
                )}
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Vote Section */}
              <Card>
                <h3 className="font-ui font-bold mb-4">VOTE</h3>
                {user ? (
                  <div className="flex gap-2">
                    <Button
                      variant={userVote === 1 ? 'primary' : 'outline'}
                      className="flex-1"
                      onClick={() => handleVote(1)}
                      disabled={voting}
                    >
                      👍 Upvote
                    </Button>
                    <Button
                      variant={userVote === -1 ? 'primary' : 'outline'}
                      className="flex-1"
                      onClick={() => handleVote(-1)}
                      disabled={voting}
                    >
                      👎 Downvote
                    </Button>
                  </div>
                ) : (
                  <p className="font-body text-sm text-center">
                    <Link href="/login" className="underline hover:no-underline">Sign in</Link> to vote
                  </p>
                )}
              </Card>

              {/* Share Section */}
              <Card>
                <h3 className="font-ui font-bold mb-4">SHARE</h3>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href)
                      alert('Link copied!')
                    }}
                  >
                    📋 Copy Link
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      window.open(`https://twitter.com/intent/tweet?text=Check out "${idea.title}" on Make Me Famous!&url=${encodeURIComponent(window.location.href)}`)
                    }}
                  >
                    𝕏 Share on X
                  </Button>
                </div>
              </Card>

              {/* Creator */}
              <Card>
                <h3 className="font-ui font-bold mb-4">CREATOR</h3>
                <Link href={`/profile/${idea.userName.toLowerCase().replace(' ', '.')}`}>
                  <div className="flex items-center gap-3 hover:opacity-75 transition">
                    <img 
                      src={idea.userPhotoURL || `https://ui-avatars.com/api/?name=${idea.userName}&background=000&color=fff`}
                      alt={idea.userName}
                      className="w-12 h-12 rounded-full border-2 border-black"
                    />
                    <div>
                      <p className="font-ui font-medium">{idea.userName}</p>
                      <p className="font-body text-xs text-gray-600">View Profile →</p>
                    </div>
                  </div>
                </Link>
              </Card>
            </div>
          </div>
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
