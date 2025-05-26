// pages/profile.tsx
import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect, ChangeEvent, useRef } from 'react'
import { useRouter } from 'next/router'
import { auth } from '../lib/firebase'
import { onAuthStateChanged, signOut, User } from 'firebase/auth'

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
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.push('/login')
      } else {
        setUser(u)
        // Load profile
        const prof = JSON.parse(localStorage.getItem(`profile_user_${u.uid}`) || '{}')
        setProfile(prof)
        setUsername(prof.username || '')
        // Load and sort user's scripts
        const all = (JSON.parse(localStorage.getItem('scripts') || '[]') as Script[])
        const mine = all.filter(s => s.userId === u.uid)
        mine.sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0))
        setScripts(mine)
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

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this script?')) return
    const all = (JSON.parse(localStorage.getItem('scripts') || '[]') as Script[])
    const updated = all.filter(s => s.id !== id)
    localStorage.setItem('scripts', JSON.stringify(updated))
    setScripts(updated.filter(s => s.userId === user?.uid))
  }

  const avgRating = scripts.length
    ? (scripts.reduce((sum, s) => sum + (s.aiScore || 0), 0) / scripts.length).toFixed(2)
    : 'N/A'

  return (
    <>
      <Head>
        <title>Profile | ScriptRank</title>
      </Head>

      <header className="bg-blue-700 text-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">🎥 ScriptRank</Link>
          <nav className="space-x-4">
            <Link href="/upload" className="hover:underline">Upload</Link>
            <Link href="/leaderboard" className="hover:underline">Leaderboard</Link>
            <button
              onClick={async () => {
                await signOut(auth)
                router.push('/')
              }}
              className="hover:underline"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto bg-white mt-8 p-8 rounded shadow">
        <section className="flex items-center mb-8">
          <div className="relative">
            <img
              src={profile.photoURL || '/default-avatar.png'}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1"
            >
              +
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>
          <div className="ml-6">
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Your display name"
              className="border px-4 py-2 rounded w-64 mb-2"
            />
            <div>
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
            </div>
            <p className="mt-4">Scripts Published: <strong>{scripts.length}</strong></p>
            <p>Average AI Rating: <strong>{avgRating}</strong></p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">My Uploaded Scripts</h2>
          {scripts.length === 0 ? (
            <p>You haven't uploaded any scripts yet.</p>
          ) : (
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Title</th>
                  <th className="px-4 py-2">Genre</th>
                  <th className="px-4 py-2">AI Score</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {scripts.map((s, i) => (
                  <tr key={s.id} className="border-t">
                    <td className="px-4 py-2">{i + 1}</td>
                    <td className="px-4 py-2">{s.title}</td>
                    <td className="px-4 py-2">{s.genre}</td>
                    <td className="px-4 py-2">{s.aiScore?.toFixed(2) ?? 'N/A'}</td>
                    <td className="px-4 py-2 space-x-2">
                      {s.highlight && (
                        <button
                          onClick={() => alert(s.highlight)}
                          className="text-blue-600 hover:underline"
                        >
                          Highlight
                        </button>
                      )}
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
      </main>
    </>
  )
}