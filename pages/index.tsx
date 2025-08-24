// pages/index.tsx
import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'

interface IdeaPreview {
  id: string
  title: string
  type: string
  aiScore: number
  publicScore?: {
    average: number
    count: number
  }
  votes?: any[]
  voteCount?: number
  creatorName: string
  userName?: string
}

export default function HomePage() {
  const [topIdeas, setTopIdeas] = useState<IdeaPreview[]>([])
  const [loading, setLoading] = useState(true)
  const [typedText, setTypedText] = useState('')
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
    }, 50) // Adjust speed here

    return () => clearInterval(typingInterval)
  }, [])

  const fetchTopIdeas = async () => {
    try {
      const ideasRef = collection(db, 'ideas')
      const q = query(ideasRef, orderBy('aiScore', 'desc'), limit(10))
      const snapshot = await getDocs(q)
      
      if (!snapshot.empty) {
        const ideas = snapshot.docs.map(doc => {
          const data = doc.data()
          return {
            id: doc.id,
            title: data.title,
            type: data.type,
            aiScore: data.aiScore || data.aiScores?.overall || 0,
            publicScore: data.publicScore,
            votes: data.votes,
            voteCount: data.voteCount || data.votes?.length || 0,
            creatorName: data.userName || data.username || 'Anonymous',
            userName: data.userName || data.username
          }
        })
        setTopIdeas(ideas)
      } else {
        // No data - fetch from ALL collections
        const collections = ['ideas', 'movies', 'games', 'business']
        let allIdeas: IdeaPreview[] = []
        
        for (const col of collections) {
          try {
            const colRef = collection(db, col)
            const colQuery = query(colRef, limit(3))
            const colSnapshot = await getDocs(colQuery)
            
            colSnapshot.docs.forEach(doc => {
              const data = doc.data()
              allIdeas.push({
                id: doc.id,
                title: data.title,
                type: col === 'movies' ? 'entertainment' : col,
                aiScore: data.aiScore || data.aiScores?.overall || 0,
                publicScore: data.publicScore,
                votes: data.votes,
                voteCount: data.voteCount || data.votes?.length || 0,
                creatorName: data.userName || data.username || 'Anonymous',
                userName: data.userName || data.username
              })
            })
          } catch (err) {
            console.log(`No ${col} collection yet`)
          }
        }
        
        setTopIdeas(allIdeas.sort((a, b) => b.aiScore - a.aiScore).slice(0, 10))
      }
    } catch (error) {
      console.error('Error fetching ideas:', error)
      setTopIdeas([])
    } finally {
      setLoading(false)
    }
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
          <div className="max-w-4xl mx-auto">
            {/* Tab */}
            <div className="leaderboard-tab">
              TOP IDEAS THIS WEEK
            </div>
            
            {/* Table Container */}
            <div className="leaderboard-container">
              {/* Table Header */}
              <div className="leaderboard-header">
                <div className="flex-1">Name</div>
                <div className="w-20 text-center">AI</div>
                <div className="w-24 text-center">Public</div>
                <div className="w-20 text-center">Total</div>
              </div>

              {/* Table Body */}
              {loading ? (
                <div className="p-8 text-center">Loading...</div>
              ) : topIdeas.length > 0 ? (
                topIdeas.map((idea, index) => {
                  const publicScore = idea.publicScore?.average || 0
                  const totalScore = ((idea.aiScore + publicScore) / 2).toFixed(1)
                  
                  return (
                    <Link 
                      key={idea.id}
                      href={`/ideas/${idea.id}`}
                      className="leaderboard-row"
                    >
                      <div className="flex-1">
                        <span className="mr-4">{index + 1}.</span>
                        {idea.title}
                        <span className="creator-name"> by {idea.creatorName}</span>
                      </div>
                      <div className="w-20 text-center">{idea.aiScore.toFixed(1)}</div>
                      <div className="w-24 text-center">
                        {idea.publicScore ? `${publicScore.toFixed(1)} (${idea.publicScore.count})` : 'No votes'}
                      </div>
                      <div className="w-20 text-center font-bold">{totalScore}</div>
                    </Link>
                  )
                })
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No ideas submitted yet. Be the first!
                </div>
              )}
              
              {/* View All Link */}
              <div className="text-center pt-8 pb-4">
                <Link href="/leaderboard" className="view-all-link">
                  VIEW ALL IDEAS →
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
