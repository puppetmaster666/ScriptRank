import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  return (
    <header className="bg-blue-600 text-white pt-4 pb-0">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-4">
        <Link href="/" className="text-xl font-bold">🎥 ScriptRank</Link>
        <nav className="space-x-4">
          <Link href="/leaderboard" className="hover:underline">Leaderboard</Link>
          <Link href="/upload" className="hover:underline">Upload</Link>
          {user ? (
            <>
              <Link href="/profile" className="hover:underline">Profile</Link>
              <button onClick={() => signOut(auth)} className="hover:underline">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline">Login</Link>
              <Link href="/register" className="hover:underline">Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
