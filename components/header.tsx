// components/header.tsx - CLASSY NEWSPAPER VERSION
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
        @font-face {
          font-family: 'FugazOne';
          src: url('/fonts/FugazOne-Regular.ttf') format('truetype');
          font-weight: 400;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'WorkSans';
          src: url('/fonts/WorkSans-Regular.ttf') format('truetype');
          font-weight: 400;
          font-display: swap;
        }
        
        .nav-link {
          font-family: 'WorkSans', sans-serif;
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-size: 13px;
          color: #2C2C2C;
          padding: 8px 14px;
          transition: all 0.2s;
          position: relative;
        }

        .nav-link:hover {
          color: #8B7355;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 1px;
          background: #2C2C2C;
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 0.3s;
        }

        .nav-link:hover::after {
          transform: scaleX(1);
          transform-origin: left;
        }

        .nav-button {
          font-family: 'WorkSans', sans-serif;
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-size: 13px;
          padding: 10px 24px;
          background: #2C2C2C;
          color: #FAF7F0;
          border: 1px solid #2C2C2C;
          transition: all 0.2s;
        }

        .nav-button:hover {
          background: #FAF7F0;
          color: #2C2C2C;
        }

        .mobile-nav-link {
          font-family: 'WorkSans', sans-serif;
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          display: block;
          padding: 18px 24px;
          font-size: 14px;
          color: #2C2C2C;
          border-bottom: 1px solid #E5E5E5;
          transition: all 0.2s;
          background: #FAF7F0;
        }

        .mobile-nav-link:hover {
          background: #2C2C2C;
          color: #FAF7F0;
          padding-left: 32px;
        }

        .logo-text {
          font-family: 'FugazOne', serif;
          font-size: 24px;
          color: #2C2C2C;
          letter-spacing: -0.01em;
        }
      `}</style>

      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-[#FAF7F0]/95 backdrop-blur-md shadow-sm border-b border-[#2C2C2C]' 
          : 'bg-[#FAF7F0] border-b border-[#2C2C2C]'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Text Based */}
            <Link href="/">
              <a className="flex items-center group">
                <span className="logo-text">MAKE ME FAMOUS</span>
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
              className="lg:hidden p-2"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="#2C2C2C"
                strokeWidth="1.5"
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
          <div className="lg:hidden fixed inset-0 top-16 bg-[#FAF7F0] z-40 border-t border-[#2C2C2C]">
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
                  <div className="mt-auto p-4 bg-[#2C2C2C]">
                    <button
                      onClick={handleSignOut}
                      className="w-full py-3 bg-[#FAF7F0] text-[#2C2C2C] font-[WorkSans] text-sm uppercase tracking-wider hover:bg-[#D4A574] transition-colors duration-200"
                    >
                      SIGN OUT
                    </button>
                  </div>
                </>
              ) : (
                <div className="mt-auto p-4 bg-[#2C2C2C] space-y-3">
                  <Link href="/login">
                    <a className="block w-full py-3 text-center border border-[#FAF7F0] text-[#FAF7F0] font-[WorkSans] text-sm uppercase tracking-wider hover:bg-[#FAF7F0] hover:text-[#2C2C2C] transition-colors duration-200">
                      LOGIN
                    </a>
                  </Link>
                  <Link href="/register">
                    <a className="block w-full py-3 bg-[#D4A574] text-[#2C2C2C] text-center font-[WorkSans] text-sm uppercase tracking-wider hover:bg-[#C19660] transition-colors duration-200">
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
      <div className="h-16"></div>
    </>
  )
}
