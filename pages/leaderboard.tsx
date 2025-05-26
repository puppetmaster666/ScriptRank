import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { auth, db } from '../lib/firebase'
import { onAuthStateChanged, User } from 'firebase/auth'
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'

type Script = {
  id: string
  userId: string
  title: string
  genre: string
  aiScore?: number
  aiComment?: string
  votes?: { userId: string; score: number }[]
}

export default function LeaderboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [scripts, setScripts] = useState<Script[]>([])
  const [sortKey, setSortKey] = useState<'ai' | 'public' | 'genre' | 'votes'>('ai')

  useEffect(() => {
    onAuthStateChanged(auth, (u) => setUser(u))

    const fetchScripts = async () => {
      const snapshot = await getDocs(collection(db, 'scripts'))
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Script[]
      setScripts(data)
    }

    fetchScripts()
  }, [])

  const sortedScripts = [...scripts].sort((a, b) => {
    if (sortKey === 'ai') return (b.aiScore || 0) - (a.aiScore || 0)
    if (sortKey === 'public') {
      const avgA = a.votes?.reduce((s, v) => s + v.score, 0) / (a.votes?.length || 1)
      const avgB = b.votes?.reduce((s, v) => s + v.score, 0) / (b.votes?.length || 1)
      return (avgB || 0) - (avgA || 0)
    }
    if (sortKey === 'votes') return (b.votes?.length || 0) - (a.votes?.length || 0)
    if (sortKey === 'genre') return (a.genre || '').localeCompare(b.genre || '')
    return 0
  })

  const handleVote = async (scriptId: string, value: number) => {
    if (!user) return
    const target = scripts.find(s => s.id === scriptId)
    if (!target) return

    const hasVoted = target.votes?.some(v => v.userId === user.uid)
    if (hasVoted || user.uid === target.userId) return

    const updatedVotes = [...(target.votes || []), { userId: user.uid, score: value }]
    await updateDoc(doc(db, 'scripts', scriptId), { votes: updatedVotes })
    setScripts(prev =>
      prev.map(s => (s.id === scriptId ? { ...s, votes: updatedVotes } : s))
    )
  }

  const shortenComment = (text?: string) => {
    if (!text) return ''
    return text.length > 100 ? text.slice(0, 100) + '…' : text
  }

  return (
    <>
      
      <main className="max-w-6xl mx-auto mt-10 p-4 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-6">🏆 Leaderboard</h1>

        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Title</th>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => setSortKey('genre')}
              >
                Genre
              </th>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => setSortKey('ai')}
              >
                AI Score
              </th>
              <th className="px-4 py-2">AI Comment</th>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => setSortKey('public')}
              >
                Public Score
              </th>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={() => setSortKey('votes')}
              >
                Votes
              </th>
              <th className="px-4 py-2">Vote</th>
            </tr>
          </thead>
          <tbody>
            {sortedScripts.map((s, i) => {
              const avgPublic = s.votes?.length
                ? (s.votes.reduce((sum, v) => sum + v.score, 0) / s.votes.length).toFixed(2)
                : 'N/A'
              const hasVoted = s.votes?.some(v => v.userId === user?.uid)
              const canVote = user && user.uid !== s.userId && !hasVoted

              const rank = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`

              return (
                <tr key={s.id} className="border-t align-top">
                  <td className="px-4 py-2 font-bold">{rank}</td>
                  <td className="px-4 py-2">{s.title}</td>
                  <td className="px-4 py-2">{s.genre}</td>
                  <td className="px-4 py-2">{s.aiScore?.toFixed(2) ?? 'N/A'}</td>
                  <td className="px-4 py-2 text-gray-600">{shortenComment(s.aiComment)}</td>
                  <td className="px-4 py-2">{avgPublic}</td>
                  <td className="px-4 py-2">{s.votes?.length || 0}</td>
                  <td className="px-4 py-2">
                    {canVote ? (
                      <div className="flex flex-col items-start">
                        <input
                          type="range"
                          min="1"
                          max="10"
                          step="0.01"
                          defaultValue="5"
                          className="w-40"
                          id={`vote-${s.id}`}
                          onChange={(e) => {
                            const label = document.getElementById(`vote-val-${s.id}`)
                            if (label) label.textContent = parseFloat(e.target.value).toFixed(2)
                          }}
                        />
                        <div className="text-sm text-gray-600 mt-1 mb-2">
                          Rating: <span id={`vote-val-${s.id}`}>5.00</span>
                        </div>
                        <button
                          onClick={() => {
                            const input = document.getElementById(`vote-${s.id}`) as HTMLInputElement
                            if (input) handleVote(s.id, parseFloat(input.value))
                          }}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Submit
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm">
                        {user?.uid === s.userId ? "Your script" : hasVoted ? "You voted" : "—"}
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </main>
    </>
  )
}
