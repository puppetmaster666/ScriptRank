// pages/login.tsx
import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { auth } from '../lib/firebase'
import { signInWithEmailAndPassword, onAuthStateChanged, User } from 'firebase/auth'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // If already signed in, redirect to profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        router.replace('/profile')
      }
    })
    return () => unsubscribe()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/profile')
    } catch (err: any) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>Login | ScriptRank</title>
      </Head>

      <header className="bg-blue-700 text-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">🎥 ScriptRank</Link>
          <nav className="space-x-4">
            <Link href="/register" className="hover:underline">Register</Link>
            <Link href="/upload" className="hover:underline">Upload</Link>
          </nav>
        </div>
      </header>

      <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded shadow">
          <h1 className="text-2xl font-bold mb-6 text-center">Log In to ScriptRank</h1>
          <form onSubmit={handleLogin}>
            <label className="block mb-2 text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded mb-4"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label className="block mb-2 text-sm font-medium">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded mb-4"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>
          <p className="mt-4 text-center text-sm">
            New here?{' '}
            <Link href="/register" className="text-blue-600 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </main>
    </>
  )
}
