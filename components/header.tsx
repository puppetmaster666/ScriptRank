import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm' : 'bg-white border-b border-gray-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Brand */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 flex items-center justify-center bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg group-hover:from-purple-700 group-hover:to-pink-600 transition-all shadow-md">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <path
                  d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="currentColor"
                />
                <path
                  d="M12 17V22"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900 lowercase" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.5px' }}>
              makemefamous
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-4 sm:space-x-6">
            <Link
              href="/leaderboard"
              className="text-gray-600 hover:text-gray-900 font-medium text-sm sm:text-base transition-colors"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Leaderboard
            </Link>
            <Link
              href="/submit"
              className="text-gray-600 hover:text-gray-900 font-medium text-sm sm:text-base transition-colors"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Submit
            </Link>

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-gray-900 font-medium text-sm sm:text-base transition-colors"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => signOut(auth)}
                  className="text-gray-600 hover:text-red-600 font-medium text-sm sm:text-base transition-colors"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                {/* Changed from /login to /register */}
                <Link
                  href="/register"
                  className="text-gray-600 hover:text-gray-900 font-medium text-sm sm:text-base transition-colors"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Sign Up
                </Link>
                {/* Changed from /login to /register */}
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-pink-600 transition text-sm sm:text-base shadow-sm"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Get Started
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
