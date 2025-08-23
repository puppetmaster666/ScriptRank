// pages/success.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function SuccessPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { session_id } = router.query;

  useEffect(() => {
    // You could verify the session here if needed
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [session_id]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {loading ? (
          <div>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Processing your subscription...</p>
          </div>
        ) : (
          <>
            <div className="text-green-500 mb-4">
              <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Successful! 🎉
            </h1>
            
            <p className="text-gray-600 mb-6">
              Your subscription is now active. You can start submitting ideas immediately!
            </p>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800 font-semibold">What's next?</p>
              <ul className="text-sm text-green-700 mt-2 text-left list-disc list-inside">
                <li>Submit unlimited ideas (or up to your plan limit)</li>
                <li>Get harsh VC-style feedback instantly</li>
                <li>Track your rankings on the leaderboard</li>
                <li>Manage your subscription anytime</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <Link href="/submit">
                <a className="block w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold">
                  Submit Your First Idea
                </a>
              </Link>
              
              <Link href="/">
                <a className="block w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition">
                  Back to Homepage
                </a>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
