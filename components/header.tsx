// components/header.tsx - IMPROVED BOLD AGGRESSIVE VERSION
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
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&display=swap');
        
        .nav-link {
          font-family: 'Oswald', sans-serif;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-size: 16px;
          color: #000;
          padding: 10px 16px;
          transition: all 0.2s;
          position: relative;
          text-shadow: 1px 1px 0 rgba(0,0,0,0.1);
        }

        .nav-link:hover {
          color: #dc2626;
          transform: translateY(-2px);
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 4px;
          background: #dc2626;
          transition: all 0.3s;
          transform: translateX(-50%);
        }

        .nav-link:hover::after {
          width: 100%;
        }

        .nav-button {
          font-family: 'Oswald', sans-serif;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 12px 28px;
          background: #dc2626;
          color: white;
          border: 3px solid #000;
          transition: all 0.2s;
          box-shadow: 4px 4px 0 #000;
          position: relative;
          overflow: hidden;
        }

        .nav-button:hover {
          background: #b91c1c;
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0 #000;
        }

        .nav-button:active {
          transform: translate(4px, 4px);
          box-shadow: 0px 0px 0 #000;
        }

        .mobile-nav-link {
          font-family: 'Oswald', sans-serif;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          display: block;
          padding: 20px;
          font-size: 18px;
          color: #000;
          border-bottom: 3px solid #000;
          transition: all 0.2s;
          background: #fef3c7;
        }

        .mobile-nav-link:hover {
          background: #dc2626;
          color: white;
          padding-left: 30px;
        }
      `}</style>

      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-yellow-400/95 backdrop-blur-md shadow-2xl border-b-4 border-gray-900' 
          : 'bg-yellow-400 border-b-4 border-gray-900'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo - More aggressive styling */}
            <Link href="/">
              <a className="flex items-center group">
                <div className="relative">
                  <div className="absolute -inset-3 bg-red-600 transform -skew-x-6 group-hover:skew-x-0 transition-transform duration-200 opacity-70 group-hover:opacity-100"></div>
                  <img 
                    src="/images/logo.png" 
                    alt="Make Me Famous" 
                    className="h-14 sm:h-16 w-auto relative z-10 transform group-hover:scale-105 transition-transform duration-200"
                    style={{ objectFit: 'contain' }}
                  />
                </div>
                <span className="ml-3 text-2xl font-bold text-black font-oswald uppercase tracking-wider hidden sm:block">
                  MAKE ME FAMOUS
                </span>
              </a>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
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

            {/* Mobile Menu Button - More aggressive styling */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-3 bg-black text-yellow-400 rounded-lg border-2 border-black hover:bg-yellow-400 hover:text-black transition-colors duration-200"
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

        {/* Mobile Menu - More aggressive styling */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-20 bg-yellow-400 z-40 border-t-4 border-black">
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
                  <div className="mt-4 p-4 bg-black">
                    <button
                      onClick={handleSignOut}
                      className="w-full py-4 bg-red-600 text-white text-lg font-bold uppercase tracking-wider border-2 border-black hover:bg-red-700 transition-colors duration-200"
                      style={{ fontFamily: 'Oswald, sans-serif' }}
                    >
                      SIGN OUT
                    </button>
                  </div>
                </>
              ) : (
                <div className="mt-4 p-4 bg-black space-y-3">
                  <Link href="/login">
                    <a className="block w-full py-4 text-center border-2 border-white text-white text-lg font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-colors duration-200"
                       style={{ fontFamily: 'Oswald, sans-serif' }}>
                      LOGIN
                    </a>
                  </Link>
                  <Link href="/register">
                    <a className="block w-full py-4 bg-red-600 text-white text-center text-lg font-bold uppercase tracking-wider border-2 border-black hover:bg-red-700 transition-colors duration-200"
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
