// pages/index.tsx
import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'

interface IdeaPreview {
  id: string
  title: string
  aiScore: number
  publicVotes: number
  totalVotes: number
  creatorName: string
}

export default function HomePage() {
  const [topIdeas, setTopIdeas] = useState<IdeaPreview[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTopIdeas()
  }, [])

  const fetchTopIdeas = async () => {
    try {
      const ideasRef = collection(db, 'ideas')
      const q = query(ideasRef, orderBy('votes', 'desc'), limit(10))
      const snapshot = await getDocs(q)
      
      const ideas = snapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title,
        aiScore: doc.data().aiScore || 0,
        publicVotes: doc.data().votes?.length || 0,
        totalVotes: (doc.data().aiScore || 0) + (doc.data().votes?.length || 0),
        creatorName: doc.data().userName || 'Anonymous'
      }))
      
      setTopIdeas(ideas)
    } catch (error) {
      console.error('Error fetching ideas:', error)
      // Set fake data as fallback
      setTopIdeas([
        { id: '1', title: 'The Memory Thief', aiScore: 8.5, publicVotes: 245, totalVotes: 253.5, creatorName: 'Sarah Chen' },
        { id: '2', title: 'Neon Nights', aiScore: 8.2, publicVotes: 189, totalVotes: 197.2, creatorName: 'Michael Rodriguez' },
        { id: '3', title: 'Quantum Break', aiScore: 7.9, publicVotes: 156, totalVotes: 163.9, creatorName: 'Alex Thompson' },
        { id: '4', title: 'The Last Algorithm', aiScore: 7.8, publicVotes: 134, totalVotes: 141.8, creatorName: 'Emily Davis' },
        { id: '5', title: 'Mind Maze VR', aiScore: 7.5, publicVotes: 128, totalVotes: 135.5, creatorName: 'David Park' }
      ])
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
        {/* Navigation */}
        <nav className="flex justify-between items-center px-8 py-6 border-b-2 border-black">
          <Link href="/" className="logo-text">
            MAKE ME<br />FAMOUS
          </Link>
          
          <div className="flex gap-4">
            <Link href="/submit" className="nav-button">
              Submit
            </Link>
            <Link href="/dashboard" className="nav-button">
              Dashboard
            </Link>
            <Link href="/login" className="nav-button">
              Login
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="px-8 py-16 border-b-2 border-black">
          <h1 className="hero-title text-center">
            DO YOU HAVE THE NEXT TARANTINO SCRIPT?
          </h1>
          <p className="hero-subtitle text-center mt-8">
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
                <div className="w-20 text-center">Public</div>
                <div className="w-20 text-center">Votes</div>
              </div>

              {/* Table Body */}
              {loading ? (
                <div className="p-8 text-center">Loading...</div>
              ) : (
                topIdeas.map((idea, index) => (
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
                    <div className="w-20 text-center">{idea.publicVotes}</div>
                    <div className="w-20 text-center font-bold">{idea.totalVotes.toFixed(1)}</div>
                  </Link>
                ))
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
        .logo-text {
          font-family: 'DrukWide', sans-serif;
          font-size: 24px;
          line-height: 0.9;
          font-weight: 900;
          color: black;
          text-decoration: none;
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
