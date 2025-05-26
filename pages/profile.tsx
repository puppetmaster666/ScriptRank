import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect, ChangeEvent, useRef } from 'react'
import { useRouter } from 'next/router'
import { auth, db } from '../lib/firebase'
import { onAuthStateChanged, signOut, User } from 'firebase/auth'
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore'

type Script = {
  id: string
  userId: string
  title: string
  genre: string
  synopsis: string
  highlight?: string
  fileName?: string
  aiScore?: number
  aiComment?: string
  votes?: { userId: string; score: number }[]
}

type Profile = {
  username?: string
  photoURL?: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile>({})
  const [scripts, setScripts] = useState<Script[]>([])
  const [username, setUsername] = useState('')
  const [editMode, setEditMode] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    onAuthStateChanged(auth, async (u) => {
      if (!u) {
        router.push('/login')
      } else {
        setUser(u)
        const prof = JSON.parse(localStorage.getItem(`profile_user_${u.uid}`) || '{}')
        setProfile(prof)
        setUsername(prof.username || '')

        const q = query(collection(db, "scripts"), where("userId", "==", u.uid))
        const snapshot = await getDocs(q)
        const userScripts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Script[]
        setScripts(userScripts)
      }
    })
  }, [router])

  const saveProfile = (photoURL?: string) => {
    if (!user) return
    const prof: Profile = { username }
    if (photoURL) prof.photoURL = photoURL
    localStorage.setItem(`profile_user_${user.uid}`, JSON.stringify(prof))
    setProfile(prof)
  }

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      saveProfile(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this script?')) return
    await deleteDoc(doc(db, "scripts", id))
    setScripts(scripts.filter(s => s.id !== id))
  }

  const avgRating = scripts.length
    ? (scripts.reduce((sum, s) => sum + (s.aiScore || 0), 0) / scripts.length).toFixed(2)
    : 'N/A'

  const scriptsByAI = [...scripts].sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0))

  const scriptsByPublic = [...scripts].sort((a, b) => {
    const avgA = a.votes?.length ? a.votes.reduce((s, v) => s + v.score, 0) / a.votes.length : 0
    const avgB = b.votes?.length ? b.votes.reduce((s, v) => s + v.score, 0) / b.votes.length : 0
    return avgB - avgA
  })

  return (
    <>
      
      <main className="max-w-4xl mx-auto bg-white mt-8 p-8 rounded shadow">
        <section className="flex items-center mb-8">
          <div className="relative">
            <img
              src={profile.photoURL || '/default-avatar.png'}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
            {editMode && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1"
              >
                +
              </button>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>
          <div className="ml-6">
            {editMode ? (
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Your display name"
                className="border px-4 py-2 rounded w-64 mb-2"
              />
            ) : (
              <p className="text-lg font-semibold">{username || 'No username set'}</p>
            )}
            <div>
              {editMode ? (
                <>
                  <button
                    onClick={() => saveProfile(profile.photoURL)}
                    className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
                  >
                    Save Profile
                  </button>
                  <button
                    onClick={() => { setUsername(''); saveProfile() }}
                    className="bg-gray-400 text-white px-4 py-2 rounded"
                  >
                    Remove Photo
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Edit Profile
                </button>
              )}
            </div>
            <p className="mt-4">Scripts Published: <strong>{scripts.length}</strong></p>
            <p>Average AI Rating: <strong>{avgRating}</strong></p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">🧠 AI Scored Scripts</h2>
          {scriptsByAI.length === 0 ? (
            <p>You haven't uploaded any scripts yet.</p>
          ) : (
            <table className="w-full table-auto border-collapse mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Title</th>
                  <th className="px-4 py-2">AI Score</th>
                  <th className="px-4 py-2">Comment</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {scriptsByAI.map((s, i) => (
                  <tr key={s.id} className="border-t align-top">
                    <td className="px-4 py-2">{i + 1}</td>
                    <td className="px-4 py-2">{s.title}</td>
                    <td className="px-4 py-2">{s.aiScore?.toFixed(2) ?? 'N/A'}</td>
                    <td className="px-4 py-2 whitespace-pre-wrap text-sm">{s.aiComment}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">🌐 Public Score Ranking</h2>
          {scriptsByPublic.length === 0 ? (
            <p>No public scores yet.</p>
          ) : (
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Title</th>
                  <th className="px-4 py-2">Avg Public Score</th>
                  <th className="px-4 py-2">Vote</th>
                </tr>
              </thead>
              <tbody>
                {scriptsByPublic.map((s, i) => {
                  const avgPublic = s.votes?.length
                    ? (s.votes.reduce((sum, v) => sum + v.score, 0) / s.votes.length).toFixed(2)
                    : 'N/A'

                  const hasVoted = s.votes?.some(v => v.userId === user?.uid)
                  const canVote = user?.uid !== s.userId && !hasVoted

                  const handleVote = async (value: number) => {
                    const docRef = doc(db, "scripts", s.id)
                    const updatedVotes = [...(s.votes || []), { userId: user?.uid, score: value }]
                    await updateDoc(docRef, { votes: updatedVotes })
                    setScripts(prev => prev.map(script => script.id === s.id ? { ...script, votes: updatedVotes } : script))
                  }

                  return (
                    <tr key={s.id} className="border-t align-middle">
                      <td className="px-4 py-2">{i + 1}</td>
                      <td className="px-4 py-2">{s.title}</td>
                      <td className="px-4 py-2">{avgPublic}</td>
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
                              id={`slider-${s.id}`}
                              onChange={(e) => {
                                const label = document.getElementById(`value-${s.id}`)
                                if (label) label.textContent = parseFloat(e.target.value).toFixed(2)
                              }}
                            />
                            <div className="text-sm text-gray-600 mt-1 mb-2">
                              Rating: <span id={`value-${s.id}`}>5.00</span>
                            </div>
                            <button
                              onClick={() => {
                                const input = document.getElementById(`slider-${s.id}`) as HTMLInputElement
                                if (input) handleVote(parseFloat(input.value))
                              }}
                              className="bg-green-600 text-white px-4 py-1 rounded text-sm"
                            >
                              Submit Vote
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-500 text-sm">
                            {user?.uid === s.userId ? "Your script" : hasVoted ? "You voted" : "N/A"}
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </>
  )
}
