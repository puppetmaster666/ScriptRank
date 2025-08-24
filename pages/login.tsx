// pages/login.tsx
import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { PageLayout, Button, Input, Card } from '@/components/designSystem'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/dashboard')
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email')
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password')
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address')
      } else {
        setError('Failed to sign in. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Login | Make Me Famous</title>
        <meta name="description" content="Sign in to submit your ideas and climb the leaderboard" />
      </Head>

      <PageLayout>
        <div className="min-h-[80vh] flex items-center justify-center px-4">
          <Card className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-display font-black mb-3">WELCOME BACK</h1>
              <p className="font-body text-gray-600">
                Sign in to submit ideas and climb the leaderboard.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-500 rounded-lg">
                <p className="font-body text-sm text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />

              <div className="mb-6">
                <Link href="/forgot-password" className="font-body text-sm underline hover:no-underline">
                  Forgot your password?
                </Link>
              </div>

              <Button 
                type="submit"
                variant="primary" 
                size="lg" 
                className="w-full mb-6"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>

              <div className="text-center border-t-2 border-gray-200 pt-6">
                <p className="font-body text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link href="/register" className="font-bold underline hover:no-underline">
                    Sign up for free
                  </Link>
                </p>
              </div>
            </form>
          </Card>
        </div>
      </PageLayout>

      <style jsx>{`
        /* Ensure fonts are loaded */
        .font-display {
          font-family: 'DrukWide', Impact, sans-serif;
        }
        .font-body {
          font-family: 'Courier', 'Courier New', monospace;
        }
      `}</style>
    </>
  )
}
