// components/header.tsx - BOLD AGGRESSIVE VERSION WITH HOME BUTTON
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged, signOut, User } from 'firebase/auth'
import { useRouter } from 'next/router'

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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
      <style jsx>{`
        .nav-link {
          font-family: 'Oswald', sans-serif;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-size: 15px;
          color: #1e293b;
          padding: 8px 16px;
          transition: all 0.2s;
          position: relative;
        }

        .nav-link:hover {
          color: #1e3a8a;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 3px;
          background: #1e3a8a;
          transition: all 0.3s;
          transform: translateX(-50%);
        }

        .nav-link:hover::after {
          width: 80%;
        }

        .nav-button {
          font-family: 'Oswald', sans-serif;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 10px 24px;
          background: #1e3a8a;
          color: white;
          border: 3px solid #1e3a8a;
          transition: all 0.2s;
        }

        .nav-button:hover {
          background: white;
          color: #1e3a8a;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
      `}</style>

      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-xl border-b-4 border-gray-900' 
          : 'bg-white border-b-4 border-gray-900'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo - Keep Original */}
            <Link href="/">
              <a className="flex items-center">
                <img 
                  src="/images/logo.png" 
                  alt="Make Me Famous" 
                  className="h-14 sm:h-16 w-auto"
                  style={{ objectFit: 'contain' }}
                />
              </a>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2">
              <Link href="/">
                <a className="nav-link">HOME</a>
              </Link>
              <Link href="/how-it-works">
                <a className="nav-link">HOW IT WORKS</a>
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
                  <Link href="/login">
                    <a className="nav-link">LOGIN</a>
                  </Link>
                  <Link href="/register">
                    <a className="nav-button ml-4">
                      SIGN UP
                    </a>
                  </Link>
                </>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-900"
              aria-label="Toggle menu"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="square" strokeLinejoin="miter" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="square" strokeLinejoin="miter" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-20 bg-white z-40 border-t-4 border-gray-900">
            <nav className="flex flex-col p-6 space-y-1">
              <Link href="/">
                <a className="block py-4 px-4 text-lg font-bold uppercase tracking-wider text-gray-900 hover:bg-gray-100 transition-colors"
                   style={{ fontFamily: 'Oswald, sans-serif' }}>
                  HOME
                </a>
              </Link>
              <Link href="/how-it-works">
                <a className="block py-4 px-4 text-lg font-bold uppercase tracking-wider text-gray-900 hover:bg-gray-100 transition-colors"
                   style={{ fontFamily: 'Oswald, sans-serif' }}>
                  HOW IT WORKS
                </a>
              </Link>
              <Link href="/leaderboard">
                <a className="block py-4 px-4 text-lg font-bold uppercase tracking-wider text-gray-900 hover:bg-gray-100 transition-colors"
                   style={{ fontFamily: 'Oswald, sans-serif' }}>
                  LEADERBOARD
                </a>
              </Link>
              <Link href="/submit">
                <a className="block py-4 px-4 text-lg font-bold uppercase tracking-wider text-gray-900 hover:bg-gray-100 transition-colors"
                   style={{ fontFamily: 'Oswald, sans-serif' }}>
                  SUBMIT IDEA
                </a>
              </Link>

              {user ? (
                <>
                  <Link href="/dashboard">
                    <a className="block py-4 px-4 text-lg font-bold uppercase tracking-wider text-gray-900 hover:bg-gray-100 transition-colors"
                       style={{ fontFamily: 'Oswald, sans-serif' }}>
                      DASHBOARD
                    </a>
                  </Link>
                  <div className="pt-4 mt-4 border-t-4 border-gray-200">
                    <button
                      onClick={handleSignOut}
                      className="w-full py-4 bg-gray-900 text-white text-lg font-bold uppercase tracking-wider"
                      style={{ fontFamily: 'Oswald, sans-serif' }}
                    >
                      SIGN OUT
                    </button>
                  </div>
                </>
              ) : (
                <div className="pt-4 mt-4 border-t-4 border-gray-200 space-y-3">
                  <Link href="/login">
                    <a className="block w-full py-4 text-center border-4 border-gray-900 text-gray-900 text-lg font-bold uppercase tracking-wider"
                       style={{ fontFamily: 'Oswald, sans-serif' }}>
                      LOGIN
                    </a>
                  </Link>
                  <Link href="/register">
                    <a className="block w-full py-4 bg-blue-900 text-white text-center text-lg font-bold uppercase tracking-wider"
                       style={{ fontFamily: 'Oswald, sans-serif' }}>
                      SIGN UP
                    </a>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>
      
      {/* Spacer */}
      <div className="h-20"></div>
    </>
  )
}
