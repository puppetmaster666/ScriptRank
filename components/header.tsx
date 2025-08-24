// components/header.tsx
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { auth, db } from '@/lib/firebase'
import { onAuthStateChanged, signOut, User } from 'firebase/auth'
import { useRouter } from 'next/router'
import { doc, onSnapshot, collection, query, where, orderBy, limit, getDocs, updateDoc } from 'firebase/firestore'

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const router = useRouter()
  const notificationRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })

    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      unsubscribe()
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (user) {
      // Fetch notifications
      const fetchNotifications = async () => {
        try {
          const notifQuery = query(
            collection(db, 'notifications'),
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc'),
            limit(10)
          )
          const snapshot = await getDocs(notifQuery)
          const notifs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          setNotifications(notifs)
          setUnreadCount(notifs.filter((n: any) => !n.read).length)
        } catch (error) {
          console.log('Error fetching notifications:', error)
          // Set some mock notifications for testing
          setNotifications([
            { 
              id: '1', 
              message: 'Your idea "Neon Nights" received 10 votes!', 
              link: '/idea/abc123',
              read: false, 
              createdAt: new Date() 
            },
            { 
              id: '2', 
              message: 'Sarah Chen started following you', 
              link: '/profile/sarah.chen',
              read: false, 
              createdAt: new Date() 
            },
            { 
              id: '3', 
              message: 'New comment on "Mind Maze VR"', 
              link: '/idea/xyz789#comments',
              read: true, 
              createdAt: new Date() 
            }
          ])
          setUnreadCount(2)
        }
      }
      fetchNotifications()
    }
  }, [user])

  const markAsRead = async (notifId: string) => {
    try {
      await updateDoc(doc(db, 'notifications', notifId), {
        read: true
      })
      setNotifications(prev => prev.map(n => 
        n.id === notifId ? { ...n, read: true } : n
      ))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.log('Error marking notification as read:', error)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <>
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
                    className="nav-link"
                  >
                    Dashboard
                  </Link>
                  
                  {/* Notification Bell with Dropdown */}
                  <div className="relative" ref={notificationRef}>
                    <button
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="nav-link relative p-2"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                      </svg>
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                          {unreadCount}
                        </span>
                      )}
                    </button>

                    {/* Notification Dropdown */}
                    {showNotifications && (
                      <div className="absolute right-0 mt-2 w-80 bg-white border-2 border-black rounded-lg shadow-xl z-50">
                        <div className="p-4 border-b border-gray-200">
                          <h3 className="font-bold text-sm">Notifications</h3>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.length > 0 ? (
                            notifications.map((notif) => (
                              <Link
                                key={notif.id}
                                href={notif.link || '#'}
                                onClick={() => {
                                  markAsRead(notif.id)
                                  setShowNotifications(false)
                                }}
                                className={`block p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                                  !notif.read ? 'bg-blue-50' : ''
                                }`}
                              >
                                <p className="text-sm text-gray-800">{notif.message}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {notif.createdAt?.toDate?.()?.toLocaleDateString() || 'Just now'}
                                </p>
                              </Link>
                            ))
                          ) : (
                            <div className="p-4 text-center text-gray-500 text-sm">
                              No notifications yet
                            </div>
                          )}
                        </div>
                        {notifications.length > 0 && (
                          <div className="p-3 border-t border-gray-200">
                            <button 
                              onClick={() => {
                                // Mark all as read
                                notifications.forEach(n => markAsRead(n.id))
                                setShowNotifications(false)
                              }}
                              className="text-sm text-gray-600 hover:text-black w-full text-center"
                            >
                              Mark all as read
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-3">
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
      
      {/* Spacer to prevent content from going under fixed header */}
      <div className="h-20 sm:h-24"></div>
    </>
  )
}
