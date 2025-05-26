// pages/upload.tsx
import Head from 'next/head'
import Link from 'next/link'
import { auth } from '../lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function UploadPage() {
  const router = useRouter()

  // Optional: If you want to redirect logged-in users to a real upload form later
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // For now we still show the login/register prompt,
        // but you could router.push('/upload-form') once implemented.
      }
    })
  }, [router])

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
            <Link href="/login" className="hover:underline">
              Login
            </Link>
            <Link href="/register" className="hover:underline">
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-16 text-center bg-white mt-8 p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Upload Your Script</h1>
        <p className="mb-6">
          You need to be registered and logged in to upload a script.
        </p>
        <div className="space-x-4">
          <Link
            href="/login"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
          >
            Log In
          </Link>
          <Link
            href="/register"
            className="inline-block px-6 py-3 bg-white text-blue-600 font-semibold border border-blue-600 rounded hover:bg-blue-50 transition"
          >
            Register
          </Link>
        </div>
      </main>
    </>
  )
}
