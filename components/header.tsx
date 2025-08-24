// components/header.tsx
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { auth, db } from '@/lib/firebase'
import { onAuthStateChanged, signOut, User } from 'firebase/auth'
import { useRouter } from 'next/router'
import { doc, onSnapshot } from 'firebase/firestore'

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [notifications, setNotifications] = useState(0)
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
    if (user) {
      const notifDoc = doc(db, 'notifications', user.uid)
      const unsubscribe = onSnapshot(notifDoc, (doc) => {
        if (doc.exists()) {
          const unreadCount = doc.data().notifications?.filter((n: any) => !n.read).length || 0
          setNotifications(unreadCount)
        }
      }, (error) => {
        console.log('Notifications listener error (expected if no notifications yet):', error)
      })
      return () => unsubscribe()
    }
  }, [user])

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md border-b-2 border-black shadow-sm' : 'bg-white border-b-2 border-black'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20 sm:h-24">{/* Increased height for bigger logo */}
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img 
              src="/images/logo.png" 
              alt="Make Me Famous" 
              className="h-12 sm:h-16 md:h-20 w-auto"
              style={{ objectFit: 'contain' }}
            />
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-3 sm:space-x-4">
            <Link
              href="/leaderboard"
              className="nav-link"
            >
              Leaderboard
            </Link>
            <Link
              href="/submit"
              className="nav-link"
            >
              Submit
            </Link>

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="nav-link relative"
                >
                  <span className="text-xl">🔔</span>
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {notifications}
                    </span>
                  )}
                </Link>
                <div className="flex items-center space-x-3">
                  <Link
                    href={`/profile/${user.displayName || user.email?.split('@')[0] || user.uid}`}
                    className="flex items-center space-x-2"
                  >
                    <img
                      src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'User'}&background=000&color=fff`}
                      alt={user.displayName || 'Profile'}
                      className="w-8 h-8 rounded-full border-2 border-black"
                    />
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="nav-button-outline"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="nav-link"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="nav-button"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>

      <style jsx>{`
        .nav-link {
          font-family: 'Bahnschrift', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 15px;
          color: black;
          text-decoration: none;
          padding: 6px 12px;
          border-radius: 6px;
          transition: all 0.2s;
          position: relative;
          font-weight: 500;
        }

        .nav-link:hover {
          background: #f0f0f0;
        }

        .nav-button {
          font-family: 'Bahnschrift', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 15px;
          padding: 8px 20px;
          border: 2px solid black;
          border-radius: 6px;
          background: black;
          color: white;
          text-decoration: none;
          transition: all 0.2s;
          font-weight: 500;
        }

        .nav-button:hover {
          background: white;
          color: black;
        }

        .nav-button-outline {
          font-family: 'Bahnschrift', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 14px;
          padding: 6px 16px;
          border: 2px solid black;
          border-radius: 6px;
          background: white;
          color: black;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 500;
        }

        .nav-button-outline:hover {
          background: black;
          color: white;
        }

        @media (max-width: 640px) {
          .nav-link {
            font-size: 14px;
            padding: 4px 8px;
          }

          .nav-button {
            font-size: 14px;
            padding: 6px 14px;
          }

          .nav-button-outline {
            font-size: 13px;
            padding: 4px 12px;
          }
        }
      `}</style>
    </header>
  )
}
