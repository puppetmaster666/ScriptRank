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
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-gray-900"
              >
                {/* Abstract M formed by stacked bars */}
                <path 
                  d="M5 7H7V17H5V7Z" 
                  fill="currentColor"
                  className="text-blue-600"
                />
                <path 
                  d="M9 4H11V17H9V4Z" 
                  fill="currentColor"
                  className="text-blue-500"
                />
                <path 
                  d="M13 7H15V17H13V7Z" 
                  fill="currentColor"
                  className="text-blue-600"
                />
                <path 
                  d="M17 4H19V17H17V4Z" 
                  fill="currentColor"
                  className="text-blue-500"
                />
                {/* Small AI indicator dot */}
                <circle 
                  cx="12" 
                  cy="20" 
                  r="1.5" 
                  fill="currentColor"
                  className="text-gray-600"
                />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
              MakeMe<span className="text-blue-600">Famous</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-4 sm:space-x-6">
            <Link
              href="/leaderboard"
              className="text-gray-600 hover:text-gray-900 font-medium text-sm sm:text-base transition-colors"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
            >
              Leaderboard
            </Link>
            <Link
              href="/submit"
              className="text-gray-600 hover:text-gray-900 font-medium text-sm sm:text-base transition-colors"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
            >
              Submit
            </Link>

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-gray-900 font-medium text-sm sm:text-base transition-colors"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => signOut(auth)}
                  className="text-gray-600 hover:text-red-600 font-medium text-sm sm:text-base transition-colors"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/register"
                  className="text-gray-600 hover:text-gray-900 font-medium text-sm sm:text-base transition-colors"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                >
                  Sign Up
                </Link>
                <Link
                  href="/register"
                  className="bg-gray-900 text-white px-4 py-2 rounded-md font-medium hover:bg-gray-800 transition text-sm sm:text-base shadow-sm"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
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