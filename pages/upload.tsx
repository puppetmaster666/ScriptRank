// pages/upload.tsx
import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect, ChangeEvent } from 'react'
import { useRouter } from 'next/router'
import { auth } from '../lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'

export default function UploadPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [title, setTitle] = useState('')
  const [genre, setGenre] = useState('')
  const [synopsis, setSynopsis] = useState('')
  const [highlight, setHighlight] = useState('')
  const [fileName, setFileName] = useState('')
  const [loading, setLoading] = useState(false)

  // Redirect to login if not authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.push('/login')
      } else {
        setUser(u)
      }
    })
    return unsubscribe
  }, [router])

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setFileName(file.name)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Call AI rating API
    let aiScore: number | null = null
    let aiComment = ''
    try {
      const res = await fetch('/api/rate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ synopsis }),
      })
      const data = await res.json()
      aiScore = data.score
      aiComment = data.comment || ''
    } catch {
      aiComment = 'AI rating unavailable'
    }

    // Save to localStorage
    const script = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      userId: user.uid,
      title,
      genre,
      synopsis,
      highlight,
      fileName,
      aiScore,
      aiComment,
      votes: [],
      createdAt: new Date().toISOString(),
    }
    const all = JSON.parse(localStorage.getItem('scripts') || '[]')
    all.push(script)
    localStorage.setItem('scripts', JSON.stringify(all))

    setLoading(false)
    router.push('/profile')
  }

  return (
    <>
      <Head>
        <title>Upload Script | ScriptRank</title>
      </Head>

      <header className="bg-blue-700 text-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            🎥 ScriptRank
          </Link>
          <nav className="space-x-4">
            <Link href="/profile" className="hover:underline">
              Profile
            </Link>
            <Link href="/leaderboard" className="hover:underline">
              Leaderboard
            </Link>
            <button
              onClick={() => auth.signOut().then(() => router.push('/'))}
              className="hover:underline"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto bg-white mt-8 p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Upload a New Script</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Title</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Genre</label>
            <select
              className="w-full border px-3 py-2 rounded"
              value={genre}
              onChange={e => setGenre(e.target.value)}
              required
            >
              <option value="">Select genre</option>
              <option>Drama</option>
              <option>Comedy</option>
              <option>Action</option>
              <option>Thriller</option>
              <option>Sci-Fi</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Synopsis</label>
            <textarea
              className="w-full border px-3 py-2 rounded"
              rows={5}
              value={synopsis}
              onChange={e => setSynopsis(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Highlight (optional)</label>
            <textarea
              className="w-full border px-3 py-2 rounded"
              rows={3}
              value={highlight}
              onChange={e => setHighlight(e.target.value)}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Script File (optional)</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="block"
            />
            {fileName && (
              <p className="mt-1 text-sm text-gray-600">{fileName}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? 'Uploading…' : 'Upload Script'}
          </button>
        </form>
      </main>
    </>
  )
}
