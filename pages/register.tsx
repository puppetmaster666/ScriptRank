// pages/register.tsx
import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { PageLayout, Button, Input, Card } from '@/components/designSystem'

export default function RegisterPage() {
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

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (!/^[a-zA-Z0-9._]+$/.test(formData.username)) {
      setError('Username can only contain letters, numbers, dots and underscores')
      return
    }

    setLoading(true)

    try {
      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      )

      const user = userCredential.user

      // Update display name
      await updateProfile(user, {
        displayName: formData.fullName,
        photoURL: `https://ui-avatars.com/api/?name=${formData.fullName}&background=000&color=fff`
      })

      // Create user profile in Firestore
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
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Email is already registered')
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak')
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address')
      } else {
        setError('Failed to create account. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Sign Up | Make Me Famous</title>
        <meta name="description" content="Join Make Me Famous to submit your ideas and compete for prizes" />
      </Head>

      <PageLayout>
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-display font-black mb-3">JOIN THE COMPETITION</h1>
              <p className="font-body text-gray-600">
                Submit ideas. Get scored. Become famous.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-500 rounded-lg">
                <p className="font-body text-sm text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <Input
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />

              <Input
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="johndoe"
                required
              />

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

              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />

              <div className="mb-6">
                <label className="flex items-start gap-2">
                  <input 
                    type="checkbox" 
                    required
                    className="mt-1 border-2 border-black rounded"
                  />
                  <span className="font-body text-sm text-gray-600">
                    I agree to the{' '}
                    <Link href="/terms" className="underline hover:no-underline">
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="underline hover:no-underline">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
              </div>

              <Button 
                type="submit"
                variant="primary" 
                size="lg" 
                className="w-full mb-6"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>

              <div className="text-center border-t-2 border-gray-200 pt-6">
                <p className="font-body text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link href="/login" className="font-bold underline hover:no-underline">
                    Sign in
                  </Link>
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
