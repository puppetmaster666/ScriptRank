// components/header.tsx - Updated black header with Hyoka branding
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
          font-family: 'Vipnagorgialla';
          src: url('/fonts/Vipnagorgialla Bd.otf') format('opentype');
          font-weight: bold;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'FoundersGrotesk';
          src: url('/fonts/FoundersGrotesk-Medium.otf') format('opentype');
          font-weight: 500;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'FoundersGrotesk';
          src: url('/fonts/FoundersGrotesk-Semibold.otf') format('opentype');
          font-weight: 600;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'FoundersGrotesk';
          src: url('/fonts/FoundersGrotesk-Bold.otf') format('opentype');
          font-weight: 700;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'Sohne';
          src: url('/fonts/TestSohneBreit-Buch.otf') format('opentype');
          font-weight: 400;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'Sohne';
          src: url('/fonts/TestSohneBreit-Kraftig.otf') format('opentype');
          font-weight: 500;
          font-display: swap;
        }
        
        .header-logo {
          font-family: 'Vipnagorgialla', serif;
          font-size: 28px;
          font-weight: bold;
          color: black;
          text-decoration: none;
          transition: opacity 0.2s;
        }

        .header-logo:hover {
          opacity: 0.8;
        }
        
        .nav-link {
          font-family: 'FoundersGrotesk', sans-serif;
          font-weight: 600;
          font-size: 14px;
          color: black;
          padding: 8px 16px;
          transition: all 0.2s;
          text-decoration: none;
          border: none;
          background: none;
          cursor: pointer;
        }

        .nav-link:hover {
          color: #4b5563;
        }

        .nav-button {
          font-family: 'FoundersGrotesk', sans-serif;
          font-weight: 600;
          font-size: 14px;
          padding: 10px 20px;
          background: #000000;
          color: white;
          border: none;
          transition: all 0.2s;
          cursor: pointer;
          border-radius: 0;
        }

        .nav-button:hover {
          background: #1f1f1f;
          transform: translateY(-1px);
        }

        .nav-button.secondary {
          background: transparent;
          color: black;
          border: 1px solid #d1d5db;
        }

        .nav-button.secondary:hover {
          background: #f3f4f6;
          color: black;
        }

        .mobile-nav-link {
          font-family: 'FoundersGrotesk', sans-serif;
          font-weight: 600;
          display: block;
          padding: 16px 24px;
          font-size: 14px;
          color: black;
          border-bottom: 1px solid #e5e7eb;
          transition: all 0.2s;
          background: #f0f2f4;
          text-decoration: none;
        }

        .mobile-nav-link:hover {
          background: #e5e7eb;
          color: #374151;
          padding-left: 32px;
        }

        .mobile-nav-button {
          width: 100%;
          font-family: 'FoundersGrotesk', sans-serif;
          font-weight: 600;
          padding: 12px 24px;
          background: none;
          border: 1px solid #d1d5db;
          color: black;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 8px;
        }

        .mobile-nav-button:hover {
          background: #f3f4f6;
          color: black;
        }

        .mobile-nav-button.primary {
          background: #000000;
          color: white;
          border: none;
        }

        .mobile-nav-button.primary:hover {
          background: #1f1f1f;
        }
      `}</style>

      <header className="header">
        <div className="header-container">
          {/* Logo */}
          <Link href="/">
            <a className="header-logo">Hyoka</a>
          </Link>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            <Link href="/">
              <a className="nav-link">Home</a>
            </Link>
            <Link href="/leaderboard">
              <a className="nav-link">Leaderboard</a>
            </Link>
            <Link href="/how-it-works">
              <a className="nav-link">How It Works</a>
            </Link>

            {user ? (
              <>
                <Link href="/dashboard">
                  <a className="nav-link">Dashboard</a>
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="nav-button secondary"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setShowLoginModal(true)} 
                  className="nav-link"
                >
                  Login
                </button>
                <Link href="/submit">
                  <a className="nav-button">Submit Idea</a>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-button"
            aria-label="Toggle menu"
          >
            <svg
              className="menu-icon"
              fill="none"
              stroke="white"
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

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            <nav className="mobile-nav">
              <Link href="/">
                <a className="mobile-nav-link">Home</a>
              </Link>
              <Link href="/leaderboard">
                <a className="mobile-nav-link">Leaderboard</a>
              </Link>
              <Link href="/how-it-works">
                <a className="mobile-nav-link">How It Works</a>
              </Link>
              <Link href="/why-us">
                <a className="mobile-nav-link">Why Us</a>
              </Link>
              <Link href="/pricing">
                <a className="mobile-nav-link">Pricing</a>
              </Link>

              {user ? (
                <>
                  <Link href="/dashboard">
                    <a className="mobile-nav-link">Dashboard</a>
                  </Link>
                  <div className="mobile-actions">
                    <button
                      onClick={handleSignOut}
                      className="mobile-nav-button"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <div className="mobile-actions">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false)
                      setShowLoginModal(true)
                    }}
                    className="mobile-nav-button"
                  >
                    Login
                  </button>
                  <Link href="/submit">
                    <a className="mobile-nav-button primary">Submit Idea</a>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Login Modal */}
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}

      <style jsx>{`
        .header {
          background: #f0f2f4;
          color: black;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          border-bottom: 1px solid #e5e7eb;
        }

        .header-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .mobile-menu-button {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
        }

        .menu-icon {
          width: 24px;
          height: 24px;
        }

        .mobile-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: #f0f2f4;
          border-top: 1px solid #e5e7eb;
          max-height: calc(100vh - 64px);
          overflow-y: auto;
        }

        .mobile-nav {
          display: flex;
          flex-direction: column;
        }

        .mobile-actions {
          padding: 24px;
          border-top: 1px solid #e5e7eb;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .desktop-nav {
            display: none;
          }
          
          .mobile-menu-button {
            display: block;
          }

          .header-container {
            padding: 0 20px;
          }
        }

        @media (max-width: 480px) {
          .header-container {
            padding: 0 16px;
          }

          .header-logo {
            font-size: 24px;
          }
        }
      `}</style>
    </>
  )
}

// Login Modal Component
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
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1001;
          animation: fadeIn 0.2s ease-out;
          backdrop-filter: blur(4px);
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .modal-content {
          background: #FFFFFF;
          border-radius: 12px;
          padding: 32px;
          width: 90%;
          max-width: 400px;
          position: relative;
          animation: slideUp 0.3s ease-out;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
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
          top: 16px;
          right: 16px;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #6b7280;
          transition: all 0.2s;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
        }
        
        .modal-close:hover {
          background: #f3f4f6;
          color: #374151;
        }
        
        h2 {
          font-family: 'FoundersGrotesk', sans-serif;
          font-size: 24px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 20px;
          text-align: center;
        }
        
        .modal-error {
          background: #fef2f2;
          color: #dc2626;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 16px;
          font-family: 'Sohne', sans-serif;
          font-size: 14px;
          text-align: center;
          border: 1px solid #fecaca;
        }
        
        form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        input {
          padding: 12px 16px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-family: 'Sohne', sans-serif;
          font-size: 14px;
          transition: all 0.2s;
          background: #f9fafb;
        }
        
        input:focus {
          outline: none;
          border-color: #000000;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
        }
        
        input::placeholder {
          color: #9ca3af;
        }
        
        button[type="submit"] {
          background: #000000;
          color: #ffffff;
          padding: 12px;
          border: none;
          border-radius: 8px;
          font-family: 'FoundersGrotesk', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 4px;
        }
        
        button[type="submit"]:hover:not(:disabled) {
          background: #1f1f1f;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        
        button[type="submit"]:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        .modal-switch {
          text-align: center;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          font-family: 'Sohne', sans-serif;
          font-size: 14px;
          color: #6b7280;
        }
        
        .modal-switch button {
          background: none;
          border: none;
          color: #000000;
          cursor: pointer;
          margin-left: 4px;
          font-weight: 500;
          transition: color 0.2s;
        }
        
        .modal-switch button:hover {
          color: #374151;
          text-decoration: underline;
        }
      `}</style>
    </>
  )
}
