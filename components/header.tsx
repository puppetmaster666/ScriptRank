// components/header.tsx - Updated with Raleway font and fresh colors
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged, signOut, User, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'next/router'
import { createUserProfile } from '@/lib/firebase-collections'

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })

    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      unsubscribe()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [router.pathname])

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      setMobileMenuOpen(false)
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <>
      <style jsx global>{`
        @font-face {
          font-family: 'ArgentumSans';
          src: url('/fonts/ArgentumSans-BlackItalic.ttf') format('truetype');
          font-weight: 900;
          font-style: italic;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'Raleway';
          src: url('/fonts/Raleway-Bold.ttf') format('truetype');
          font-weight: 700;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'WorkSans';
          src: url('/fonts/WorkSans-Regular.ttf') format('truetype');
          font-weight: 400;
          font-display: swap;
        }
        
        .nav-link {
          font-family: 'Raleway', sans-serif;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-size: 12px;
          color: #475569;
          padding: 8px 14px;
          transition: all 0.2s;
          position: relative;
          background: none;
          border: none;
          cursor: pointer;
        }

        .nav-link:hover {
          color: #3B82F6;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%) scaleX(0);
          width: 80%;
          height: 2px;
          background: #3B82F6;
          transition: transform 0.3s;
        }

        .nav-link:hover::after {
          transform: translateX(-50%) scaleX(1);
        }

        .nav-button {
          font-family: 'Raleway', sans-serif;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-size: 12px;
          padding: 10px 24px;
          background: #3B82F6;
          color: #FFFFFF;
          border: none;
          transition: all 0.2s;
          cursor: pointer;
          border-radius: 8px;
        }

        .nav-button:hover {
          background: #2563EB;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .mobile-nav-link {
          font-family: 'Raleway', sans-serif;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          display: block;
          padding: 18px 24px;
          font-size: 13px;
          color: #1E293B;
          border-bottom: 1px solid #E2E8F0;
          transition: all 0.2s;
          background: #FFFFFF;
        }

        .mobile-nav-link:hover {
          background: #F0F9FF;
          color: #3B82F6;
          padding-left: 32px;
        }

        .logo-text {
          font-family: 'ArgentumSans', serif;
          font-size: 24px;
          font-weight: 900;
          font-style: italic;
          color: #0F172A;
          letter-spacing: -0.01em;
        }
      `}</style>

      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-sm' 
          : 'bg-white'
      }`} style={{ borderBottom: '1px solid #E2E8F0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Keeps ArgentumSans */}
            <Link href="/">
              <a className="flex items-center group">
                <span className="logo-text transition-colors group-hover:text-blue-600">MAKE ME FAMOUS</span>
              </a>
            </Link>

            {/* Desktop Navigation - Raleway Font */}
            <nav className="hidden lg:flex items-center gap-2">
              <Link href="/">
                <a className="nav-link">HOME</a>
              </Link>
              <Link href="/how-it-works">
                <a className="nav-link">HOW IT WORKS</a>
              </Link>
              <Link href="/why-us">
                <a className="nav-link">WHY US</a>
              </Link>
              <Link href="/leaderboard">
                <a className="nav-link">LEADERBOARD</a>
              </Link>
              <Link href="/submit">
                <a className="nav-link">SUBMIT</a>
              </Link>

              {user ? (
                <>
                  <Link href="/dashboard">
                    <a className="nav-link">DASHBOARD</a>
                  </Link>
                  <button 
                    onClick={handleSignOut}
                    className="nav-button ml-4"
                  >
                    SIGN OUT
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setShowLoginModal(true)} className="nav-link">
                    LOGIN
                  </button>
                  <button onClick={() => setShowLoginModal(true)} className="nav-button ml-4">
                    SIGN UP
                  </button>
                </>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="#475569"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M3 6h18M3 18h18" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-16 bg-white z-40 border-t border-gray-200">
            <nav className="flex flex-col">
              <Link href="/">
                <a className="mobile-nav-link">HOME</a>
              </Link>
              <Link href="/how-it-works">
                <a className="mobile-nav-link">HOW IT WORKS</a>
              </Link>
              <Link href="/why-us">
                <a className="mobile-nav-link">WHY US</a>
              </Link>
              <Link href="/leaderboard">
                <a className="mobile-nav-link">LEADERBOARD</a>
              </Link>
              <Link href="/submit">
                <a className="mobile-nav-link">SUBMIT IDEA</a>
              </Link>

              {user ? (
                <>
                  <Link href="/dashboard">
                    <a className="mobile-nav-link">DASHBOARD</a>
                  </Link>
                  <div className="mt-auto p-4 bg-gradient-to-r from-blue-600 to-blue-700">
                    <button
                      onClick={handleSignOut}
                      className="w-full py-3 bg-white text-blue-600 font-bold text-sm uppercase tracking-wider rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      SIGN OUT
                    </button>
                  </div>
                </>
              ) : (
                <div className="mt-auto p-4 bg-gradient-to-r from-blue-600 to-blue-700 space-y-3">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false)
                      setShowLoginModal(true)
                    }}
                    className="block w-full py-3 text-center border border-white text-white font-bold text-sm uppercase tracking-wider rounded-lg hover:bg-white/10 transition-colors duration-200"
                  >
                    LOGIN
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false)
                      setShowLoginModal(true)
                    }}
                    className="block w-full py-3 bg-white text-blue-600 text-center font-bold text-sm uppercase tracking-wider rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    SIGN UP
                  </button>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>
      
      {/* Spacer */}
      <div className="h-16"></div>

      {/* Login Modal */}
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </>
  )
}

// Login Modal Component - Updated with fresh colors
function LoginModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const router = useRouter()
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      if (isSignUp) {
        // Sign up
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        
        // Create user profile
        const username = email.split('@')[0].toLowerCase()
        await createUserProfile(userCredential.user.uid, {
          username: username,
          displayName: fullName || username,
          email: email,
          photoURL: undefined
        })
        
        onClose()
        router.push('/dashboard')
      } else {
        // Sign in
        await signInWithEmailAndPassword(auth, email, password)
        onClose()
        router.push('/dashboard')
      }
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Email is already registered')
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters')
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address')
      } else if (err.code === 'auth/user-not-found') {
        setError('No account found with this email')
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password')
      } else {
        setError(err.message || 'Authentication failed')
      }
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>×</button>
          <h2>{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
          
          {error && <div className="modal-error">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            {isSignUp && (
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In')}
            </button>
          </form>
          
          <p className="modal-switch">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button onClick={() => {
              setIsSignUp(!isSignUp)
              setError('')
              setEmail('')
              setPassword('')
              setFullName('')
            }}>
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
      
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.2s ease-out;
          backdrop-filter: blur(4px);
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .modal-content {
          background: #FFFFFF;
          border-radius: 16px;
          padding: 40px;
          width: 90%;
          max-width: 400px;
          position: relative;
          animation: slideUp 0.3s ease-out;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .modal-close {
          position: absolute;
          top: 20px;
          right: 20px;
          background: none;
          border: none;
          font-size: 28px;
          cursor: pointer;
          color: #94A3B8;
          transition: all 0.2s;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
        }
        
        .modal-close:hover {
          background: #F1F5F9;
          color: #475569;
        }
        
        h2 {
          font-family: 'Raleway', sans-serif;
          font-size: 28px;
          font-weight: 700;
          color: #0F172A;
          margin-bottom: 24px;
          text-align: center;
        }
        
        .modal-error {
          background: #FEE2E2;
          color: #DC2626;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-family: 'WorkSans', sans-serif;
          font-size: 14px;
          text-align: center;
        }
        
        form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        input {
          padding: 14px 16px;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          font-family: 'WorkSans', sans-serif;
          font-size: 14px;
          transition: all 0.2s;
          background: #F8FAFC;
        }
        
        input:focus {
          outline: none;
          border-color: #3B82F6;
          background: #FFFFFF;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        input::placeholder {
          color: #94A3B8;
        }
        
        button[type="submit"] {
          background: #3B82F6;
          color: #FFFFFF;
          padding: 14px;
          border: none;
          border-radius: 8px;
          font-family: 'Raleway', sans-serif;
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 8px;
        }
        
        button[type="submit"]:hover:not(:disabled) {
          background: #2563EB;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
        
        button[type="submit"]:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .modal-switch {
          text-align: center;
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid #E2E8F0;
          font-family: 'WorkSans', sans-serif;
          font-size: 14px;
          color: #64748B;
        }
        
        .modal-switch button {
          background: none;
          border: none;
          color: #3B82F6;
          cursor: pointer;
          margin-left: 4px;
          font-weight: 600;
          transition: color 0.2s;
        }
        
        .modal-switch button:hover {
          color: #2563EB;
          text-decoration: underline;
        }
      `}</style>
    </>
  )
}
