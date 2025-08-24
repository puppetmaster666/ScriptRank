// pages/register.tsx - FIXED VERSION WITH TOGGLE
import { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { PageLayout, Button, Input, Card } from '@/components/designSystem'

export default function RegisterPage() {
  const [isLogin, setIsLogin] = useState(false) // Toggle between login/register
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        // LOGIN
        await signInWithEmailAndPassword(auth, formData.email, formData.password)
        router.push('/dashboard')
      } else {
        // REGISTER
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match')
          setLoading(false)
          return
        }

        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters')
          setLoading(false)
          return
        }

        if (!/^[a-zA-Z0-9._]+$/.test(formData.username)) {
          setError('Username can only contain letters, numbers, dots and underscores')
          setLoading(false)
          return
        }

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        )

        const user = userCredential.user

        await updateProfile(user, {
          displayName: formData.fullName,
          photoURL: `https://ui-avatars.com/api/?name=${formData.fullName}&background=000&color=fff`
        })

        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: formData.email,
          displayName: formData.fullName,
          username: formData.username.toLowerCase(),
          photoURL: `https://ui-avatars.com/api/?name=${formData.fullName}&background=000&color=fff`,
          bio: '',
          location: '',
          website: '',
          isPremium: false,
          createdAt: new Date(),
          followers: [],
          following: []
        })

        router.push('/profile/' + formData.username.toLowerCase())
      }
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Email is already registered')
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak')
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address')
      } else if (err.code === 'auth/user-not-found') {
        setError('No account found with this email')
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password')
      } else {
        setError('Authentication failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>{isLogin ? 'Login' : 'Sign Up'} | Make Me Famous</title>
        <meta name="description" content={isLogin ? 'Sign in to submit your ideas' : 'Join Make Me Famous'} />
      </Head>

      <PageLayout>
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-display font-black mb-3">
                {isLogin ? 'WELCOME BACK' : 'JOIN THE COMPETITION'}
              </h1>
              <p className="font-body text-gray-600">
                {isLogin 
                  ? 'Sign in to submit ideas and climb the leaderboard.'
                  : 'Submit ideas. Get scored. Become famous.'}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-500 rounded-lg">
                <p className="font-body text-sm text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <>
                  <Input
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required={!isLogin}
                  />

                  <Input
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="johndoe"
                    required={!isLogin}
                  />
                </>
              )}

              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />

              <Input
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />

              {!isLogin && (
                <Input
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required={!isLogin}
                />
              )}

              <Button 
                type="submit"
                variant="primary" 
                size="lg" 
                className="w-full mb-6 mt-6"
                disabled={loading}
              >
                {loading 
                  ? (isLogin ? 'Signing in...' : 'Creating Account...') 
                  : (isLogin ? 'Sign In' : 'Create Account')}
              </Button>

              <div className="text-center border-t-2 border-gray-200 pt-6">
                <p className="font-body text-sm text-gray-600">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="font-bold underline hover:no-underline"
                  >
                    {isLogin ? 'Sign up for free' : 'Sign in'}
                  </button>
                </p>
              </div>
            </form>
          </Card>
        </div>
      </PageLayout>

      <style jsx>{`
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
