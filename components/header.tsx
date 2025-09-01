// components/header.tsx - Clean header matching main page design
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged, signOut, User, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'next/router'

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })
    return () => unsubscribe()
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
      `}</style>

      <header className="header">
        <div className="container">
          {/* Logo */}
          <Link href="/">
            <a className="logo">Hyoka</a>
          </Link>

          {/* Desktop Navigation */}
          <nav className="nav">
            <Link href="/">
              <a className="nav-link">Home</a>
            </Link>
            <Link href="/leaderboard">
              <a className="nav-link">Leaderboard</a>
            </Link>
            <Link href="/how-it-works">
              <a className="nav-link">How It Works</a>
            </Link>
            <Link href="/pricing">
              <a className="nav-link">Pricing</a>
            </Link>
            {user && (
              <Link href="/dashboard">
                <a className="nav-link">Dashboard</a>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-btn"
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
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
                <a className="mobile-link">Home</a>
              </Link>
              <Link href="/leaderboard">
                <a className="mobile-link">Leaderboard</a>
              </Link>
              <Link href="/how-it-works">
                <a className="mobile-link">How It Works</a>
              </Link>
              <Link href="/pricing">
                <a className="mobile-link">Pricing</a>
              </Link>
              {user && (
                <Link href="/dashboard">
                  <a className="mobile-link">Dashboard</a>
                </Link>
              )}
              
              <div className="mobile-actions">
                {user ? (
                  <button onClick={handleSignOut} className="mobile-btn">
                    Sign Out
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={() => {
                        setMobileMenuOpen(false)
                        setShowLoginModal(true)
                      }}
                      className="mobile-btn secondary"
                    >
                      Login
                    </button>
                    <Link href="/submit">
                      <a className="mobile-btn primary">Submit Idea</a>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Login Modal */}
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}

      <style jsx>{`
        .header {
          background: #f5f5f5;
          border-bottom: 1px solid #ddd;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          height: 60px;
          display: flex;
          align-items: center;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        .logo {
          font-family: 'Vipnagorgialla', serif;
          font-size: 24px;
          font-weight: bold;
          color: #000;
          text-decoration: none;
        }

        .logo:hover {
          opacity: 0.8;
        }

        .nav {
          display: flex;
          gap: 24px;
        }

        .nav-link {
          color: #333;
          text-decoration: none;
          font-weight: 500;
          font-size: 14px;
          transition: color 0.2s;
        }

        .nav-link:hover {
          color: #000;
        }

        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          color: #333;
        }

        .mobile-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: #f5f5f5;
          border-top: 1px solid #ddd;
          border-bottom: 1px solid #ddd;
        }

        .mobile-nav {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .mobile-link {
          display: block;
          padding: 12px 0;
          color: #333;
          text-decoration: none;
          font-weight: 500;
          font-size: 16px;
          border-bottom: 1px solid #eee;
          transition: color 0.2s;
        }

        .mobile-link:hover {
          color: #000;
        }

        .mobile-actions {
          padding-top: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .mobile-btn {
          padding: 12px;
          border: none;
          font-weight: 500;
          cursor: pointer;
          text-decoration: none;
          text-align: center;
          display: block;
          transition: all 0.2s;
        }

        .mobile-btn.primary {
          background: #000;
          color: #fff;
        }

        .mobile-btn.primary:hover {
          background: #333;
        }

        .mobile-btn.secondary {
          background: transparent;
          color: #333;
          border: 1px solid #ddd;
        }

        .mobile-btn.secondary:hover {
          background: #eee;
        }

        @media (max-width: 768px) {
          .nav {
            display: none;
          }
          
          .mobile-menu-btn {
            display: block;
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
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
      onClose()
      router.push('/dashboard')
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
          <h2>{isSignUp ? 'Create Account' : 'Sign In'}</h2>
          
          {error && <div className="modal-error">{error}</div>}
          
          <form onSubmit={handleSubmit}>
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
        }
        
        .modal-content {
          background: white;
          padding: 30px;
          width: 90%;
          max-width: 380px;
          position: relative;
        }
        
        .modal-close {
          position: absolute;
          top: 15px;
          right: 15px;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
        }
        
        h2 {
          font-size: 20px;
          font-weight: 600;
          color: #000;
          margin-bottom: 20px;
          text-align: center;
        }
        
        .modal-error {
          background: #fee;
          color: #c00;
          padding: 10px;
          margin-bottom: 15px;
          font-size: 13px;
          border-left: 3px solid #c00;
        }
        
        form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        input {
          padding: 10px;
          border: 1px solid #ddd;
          font-size: 14px;
        }
        
        input:focus {
          outline: none;
          border-color: #007acc;
        }
        
        button[type="submit"] {
          background: #000;
          color: white;
          padding: 10px;
          border: none;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        button[type="submit"]:hover:not(:disabled) {
          background: #333;
        }
        
        button[type="submit"]:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .modal-switch {
          text-align: center;
          margin-top: 15px;
          font-size: 13px;
          color: #666;
        }
        
        .modal-switch button {
          background: none;
          border: none;
          color: #007acc;
          cursor: pointer;
          margin-left: 4px;
          text-decoration: underline;
        }
      `}</style>
    </>
  )
}
