// pages/register.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { createUserProfile } from '@/lib/firebase-collections';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // Add username field
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        // Handle login
        await signInWithEmailAndPassword(auth, email, password);
        router.push('/dashboard');
      } else {
        // Handle registration
        if (!username.trim()) {
          setError('Please choose a username');
          setLoading(false);
          return;
        }

        // Validate username (alphanumeric and underscores only)
        if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
          setError('Username must be 3-20 characters, alphanumeric and underscores only');
          setLoading(false);
          return;
        }

        // Create auth account
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Update auth profile with username
        await updateProfile(userCredential.user, {
          displayName: username
        });

        // Create Firestore profile
        try {
          await createUserProfile(userCredential.user.uid, {
            username: username.toLowerCase(),
            displayName: username,
            email: email,
            photoURL: userCredential.user.photoURL || undefined
          });
          
          router.push('/dashboard');
        } catch (profileError: any) {
          // If username is taken or other error
          setError(profileError.message || 'Failed to create profile');
          // Note: User is created in Auth but profile failed
          // You might want to delete the auth account here
        }
      }
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Email is already registered');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else if (err.code === 'auth/user-not-found') {
        setError('No account found with this email');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password');
      } else {
        setError(err.message || 'Authentication failed');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {isLogin ? 'Welcome Back!' : 'Join ScriptRank'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isLogin ? 'Log in to your account' : 'Get 3 free idea submissions per month'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a unique username"
                  required={!isLogin}
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  3-20 characters, letters, numbers, and underscores only
                </p>
              </div>
            </>
          )}

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
            />
            {!isLogin && (
              <p className="text-xs text-gray-500 mt-1">
                At least 6 characters
              </p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isLogin ? 'Logging in...' : 'Creating account...'}
              </span>
            ) : (
              isLogin ? 'Log In' : 'Create Account'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setUsername('');
              }}
              className="text-blue-600 hover:text-blue-700 ml-1 font-medium"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>

        {!isLogin && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Free Plan Includes:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✓ 3 idea submissions per month</li>
                <li>✓ AI-powered VC feedback</li>
                <li>✓ Public voting system</li>
                <li>✓ Monthly leaderboards</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
