// components/header.tsx - FRESH DESIGN VERSION
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
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
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-soft' 
          : 'bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link href="/">
              <a className="flex items-center">
                <span className="font-display text-2xl sm:text-3xl text-sage">
                  Make<span className="text-sage-light">Me</span>Famous
                </span>
              </a>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link href="/how-it-works">
                <a className="text-charcoal hover:text-sage transition-colors font-medium">
                  How It Works
                </a>
              </Link>
              <Link href="/leaderboard">
                <a className="text-charcoal hover:text-sage transition-colors font-medium">
                  Leaderboard
                </a>
              </Link>
              <Link href="/submit">
                <a className="text-charcoal hover:text-sage transition-colors font-medium">
                  Submit
                </a>
              </Link>

              {user ? (
                <>
                  <Link href="/dashboard">
                    <a className="text-charcoal hover:text-sage transition-colors font-medium">
                      Dashboard
                    </a>
                  </Link>
                  <button 
                    onClick={handleSignOut}
                    className="px-6 py-2 bg-sage text-white rounded-full hover:bg-sage-light transition-colors font-medium"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <a className="text-charcoal hover:text-sage transition-colors font-medium">
                      Login
                    </a>
                  </Link>
                  <Link href="/register">
                    <a className="px-6 py-2 bg-sage text-white rounded-full hover:bg-sage-light transition-colors font-medium">
                      Sign Up
                    </a>
                  </Link>
                </>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-charcoal"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-16 sm:top-20 bg-white z-40">
            <nav className="flex flex-col p-6 space-y-4">
              <Link href="/how-it-works">
                <a className="text-charcoal hover:text-sage transition-colors font-medium text-lg py-2">
                  How It Works
                </a>
              </Link>
              <Link href="/leaderboard">
                <a className="text-charcoal hover:text-sage transition-colors font-medium text-lg py-2">
                  Leaderboard
                </a>
              </Link>
              <Link href="/submit">
                <a className="text-charcoal hover:text-sage transition-colors font-medium text-lg py-2">
                  Submit Idea
                </a>
              </Link>

              {user ? (
                <>
                  <Link href="/dashboard">
                    <a className="text-charcoal hover:text-sage transition-colors font-medium text-lg py-2">
                      Dashboard
                    </a>
                  </Link>
                  <div className="pt-4 border-t border-sage-pale">
                    <button
                      onClick={handleSignOut}
                      className="w-full py-3 bg-sage text-white rounded-full font-medium"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <div className="pt-4 border-t border-sage-pale space-y-3">
                  <Link href="/login">
                    <a className="block w-full py-3 text-center border-2 border-sage text-sage rounded-full font-medium">
                      Login
                    </a>
                  </Link>
                  <Link href="/register">
                    <a className="block w-full py-3 bg-sage text-white text-center rounded-full font-medium">
                      Sign Up
                    </a>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>
      
      {/* Spacer */}
      <div className="h-16 sm:h-20"></div>
    </>
  )
}
