// pages/pricing.tsx - COMPLETE FILE
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface UserSubscription {
  tier: 'free' | 'starter' | 'unlimited';
  submissionsRemaining: number;
  submissionsUsedThisMonth: number;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

export default function PricingPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [currentTier, setCurrentTier] = useState<'free' | 'starter' | 'unlimited'>('free');
  const [loading, setLoading] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Get user's current subscription
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        const userData = userDoc.data();
        if (userData?.subscription) {
          setCurrentTier(userData.subscription.tier || 'free');
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleUpgrade = async (tier: 'starter' | 'unlimited') => {
    if (!user) {
      router.push('/register');
      return;
    }

    setLoading(true);
    try {
      const idToken = await user.getIdToken();

      // Create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, idToken }),
      });

      const { sessionId, url } = await response.json();

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      } else {
        const stripe = await stripePromise;
        await stripe?.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      alert('Failed to start upgrade process');
    } finally {
      setLoading(false);
    }
  };

  const handleManageBilling = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const idToken = await user.getIdToken();

      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Portal error:', error);
      alert('Failed to open billing portal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Pricing | MakeMeFamous</title>
        <meta name="description" content="Choose the perfect plan for your creative journey" />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        {/* Header */}
        <section className="pt-24 pb-12 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Choose Your Path to Fame
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Get brutally honest AI feedback on your movie, game, or business ideas
            </p>
            
            {/* Billing Toggle */}
            <div className="inline-flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-md transition ${
                  billingCycle === 'monthly' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-2 rounded-md transition ${
                  billingCycle === 'yearly' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600'
                }`}
              >
                Yearly
                <span className="ml-1 text-xs text-green-600 font-semibold">Save 20%</span>
              </button>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="px-6 pb-24">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            
            {/* Free Tier */}
            <div className={`relative bg-white rounded-2xl shadow-lg overflow-hidden ${
              currentTier === 'free' ? 'ring-2 ring-gray-400' : ''
            }`}>
              {currentTier === 'free' && (
                <div className="absolute top-0 right-0 bg-gray-600 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
                  CURRENT PLAN
                </div>
              )}
              
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-gray-500">/month</span>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">3 idea submissions per month</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Harsh AI feedback</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Public voting</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Leaderboard access</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-gray-300 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-400">No priority support</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-gray-300 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-400">No profile badge</span>
                  </li>
                </ul>
                
                {currentTier === 'free' ? (
                  <button
                    disabled
                    className="w-full py-3 px-4 bg-gray-100 text-gray-400 rounded-lg font-semibold cursor-not-allowed"
                  >
                    Current Plan
                  </button>
                ) : (
                  <Link href="/register">
                    <a className="block w-full py-3 px-4 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition text-center">
                      Get Started
                    </a>
                  </Link>
                )}
              </div>
            </div>

            {/* Starter Tier */}
            <div className={`relative bg-white rounded-2xl shadow-lg overflow-hidden ${
              currentTier === 'starter' ? 'ring-2 ring-blue-500' : ''
            }`}>
              {currentTier === 'starter' && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
                  CURRENT PLAN
                </div>
              )}
              
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">
                    ${billingCycle === 'monthly' ? '5' : '4'}
                  </span>
                  <span className="text-gray-500">/month</span>
                  {billingCycle === 'yearly' && (
                    <div className="text-sm text-green-600 mt-1">Billed $48 yearly</div>
                  )}
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700"><strong>10 idea submissions</strong> per month</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Everything in Free</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Email notifications</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Basic analytics</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-gray-300 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-400">No profile badge</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-gray-300 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-400">No priority processing</span>
                  </li>
                </ul>
                
                {currentTier === 'starter' ? (
                  <button
                    onClick={handleManageBilling}
                    disabled={loading}
                    className="w-full py-3 px-4 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition"
                  >
                    Manage Billing
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpgrade('starter')}
                    disabled={loading || currentTier === 'unlimited'}
                    className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Upgrade to Starter'}
                  </button>
                )}
              </div>
            </div>

            {/* Unlimited Tier */}
            <div className={`relative bg-gradient-to-b from-purple-50 to-white rounded-2xl shadow-xl overflow-hidden border-2 ${
              currentTier === 'unlimited' ? 'border-purple-500' : 'border-purple-200'
            }`}>
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-2 text-sm font-bold">
                BEST VALUE
              </div>
              {currentTier === 'unlimited' && (
                <div className="absolute top-8 right-0 bg-purple-600 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
                  CURRENT PLAN
                </div>
              )}
              
              <div className="p-8 pt-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Unlimited</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">
                    ${billingCycle === 'monthly' ? '10' : '8'}
                  </span>
                  <span className="text-gray-500">/month</span>
                  {billingCycle === 'yearly' && (
                    <div className="text-sm text-green-600 mt-1">Billed $96 yearly</div>
                  )}
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700"><strong>UNLIMITED submissions</strong></span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Everything in Starter</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Priority AI processing</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">✨ Profile badge</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Advanced analytics</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Priority support</span>
                  </li>
                </ul>
                
                {currentTier === 'unlimited' ? (
                  <button
                    onClick={handleManageBilling}
                    disabled={loading}
                    className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition"
                  >
                    Manage Billing
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpgrade('unlimited')}
                    disabled={loading}
                    className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Go Unlimited'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="px-6 pb-24">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Compare Plans</h2>
            
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Features</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">Free</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">Starter</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-900 bg-purple-50">Unlimited</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Monthly Submissions</td>
                    <td className="px-6 py-4 text-center text-sm">3</td>
                    <td className="px-6 py-4 text-center text-sm">10</td>
                    <td className="px-6 py-4 text-center text-sm font-semibold bg-purple-50">∞</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">AI Feedback</td>
                    <td className="px-6 py-4 text-center">✅</td>
                    <td className="px-6 py-4 text-center">✅</td>
                    <td className="px-6 py-4 text-center bg-purple-50">✅</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Public Voting</td>
                    <td className="px-6 py-4 text-center">✅</td>
                    <td className="px-6 py-4 text-center">✅</td>
                    <td className="px-6 py-4 text-center bg-purple-50">✅</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Leaderboard Access</td>
                    <td className="px-6 py-4 text-center">✅</td>
                    <td className="px-6 py-4 text-center">✅</td>
                    <td className="px-6 py-4 text-center bg-purple-50">✅</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Email Notifications</td>
                    <td className="px-6 py-4 text-center">❌</td>
                    <td className="px-6 py-4 text-center">✅</td>
                    <td className="px-6 py-4 text-center bg-purple-50">✅</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Analytics Dashboard</td>
                    <td className="px-6 py-4 text-center">❌</td>
                    <td className="px-6 py-4 text-center">Basic</td>
                    <td className="px-6 py-4 text-center bg-purple-50">Advanced</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Priority Processing</td>
                    <td className="px-6 py-4 text-center">❌</td>
                    <td className="px-6 py-4 text-center">❌</td>
                    <td className="px-6 py-4 text-center bg-purple-50">✅</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Profile Badge</td>
                    <td className="px-6 py-4 text-center">❌</td>
                    <td className="px-6 py-4 text-center">❌</td>
                    <td className="px-6 py-4 text-center bg-purple-50">✨</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Support</td>
                    <td className="px-6 py-4 text-center text-sm">Community</td>
                    <td className="px-6 py-4 text-center text-sm">Email</td>
                    <td className="px-6 py-4 text-center text-sm bg-purple-50">Priority</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="px-6 pb-24">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">Can I change plans anytime?</h3>
                <p className="text-gray-600">Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">What happens to my unused submissions?</h3>
                <p className="text-gray-600">Submissions don't roll over to the next month. Your quota resets on your billing date.</p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">Can I cancel my subscription?</h3>
                <p className="text-gray-600">Absolutely. You can cancel anytime from your billing portal. You'll keep access until the end of your billing period.</p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">Is my payment information secure?</h3>
                <p className="text-gray-600">Yes! We use Stripe for payment processing. We never store your credit card information on our servers.</p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-600">We accept all major credit cards, debit cards, and digital wallets through Stripe.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 pb-24">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Famous?</h2>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of creators getting brutally honest feedback on their ideas
            </p>
            {!user ? (
              <Link href="/register">
                <a className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition">
                  Start Free Today
                </a>
              </Link>
            ) : currentTier === 'free' ? (
              <button
                onClick={() => handleUpgrade('unlimited')}
                className="inline-block bg-white text-purple-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition"
              >
                Upgrade Now
              </button>
            ) : (
              <Link href="/submit">
                <a className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition">
                  Submit Your Idea
                </a>
              </Link>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
