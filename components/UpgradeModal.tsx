// STEP 6: Upgrade Modal Component - components/UpgradeModal.tsx
// ============================================
// components/UpgradeModal.tsx

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { auth } from '../lib/firebase';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier: 'free' | 'starter' | 'unlimited';
  submissionsUsed: number;
}

export default function UpgradeModal({ 
  isOpen, 
  onClose, 
  currentTier,
  submissionsUsed 
}: UpgradeModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleUpgrade = async (tier: 'starter' | 'unlimited') => {
    setLoading(true);
    try {
      // Get current user's ID token
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');
      
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">
          You've Used All Your Free Submissions! 🚀
        </h2>
        
        <p className="text-gray-600 mb-6">
          You've submitted {submissionsUsed} ideas this month. 
          Upgrade to continue getting harsh VC feedback on your ideas.
        </p>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {/* Starter Plan */}
          <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-500 transition">
            <h3 className="text-xl font-bold mb-2">Starter</h3>
            <p className="text-3xl font-bold mb-4">
              $5<span className="text-sm text-gray-500">/month</span>
            </p>
            <ul className="text-sm text-gray-600 mb-4 space-y-2">
              <li>✅ 10 idea submissions/month</li>
              <li>✅ Harsh VC-style AI feedback</li>
              <li>✅ All leaderboards access</li>
              <li>✅ Public voting rights</li>
            </ul>
            <button
              onClick={() => handleUpgrade('starter')}
              disabled={loading || currentTier !== 'free'}
              className={`w-full py-2 rounded-lg font-semibold ${
                currentTier === 'starter' 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {currentTier === 'starter' ? 'Current Plan' : 'Upgrade to Starter'}
            </button>
          </div>

          {/* Unlimited Plan */}
          <div className="border-2 border-green-500 rounded-lg p-6 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                BEST VALUE
              </span>
            </div>
            <h3 className="text-xl font-bold mb-2 mt-2">Unlimited</h3>
            <p className="text-3xl font-bold mb-4">
              $10<span className="text-sm text-gray-500">/month</span>
            </p>
            <ul className="text-sm text-gray-600 mb-4 space-y-2">
              <li>✅ UNLIMITED submissions</li>
              <li>✅ Priority AI processing</li>
              <li>✅ Profile badge</li>
              <li>✅ Everything in Starter</li>
            </ul>
            <button
              onClick={() => handleUpgrade('unlimited')}
              disabled={loading || currentTier === 'unlimited'}
              className={`w-full py-2 rounded-lg font-semibold ${
                currentTier === 'unlimited' 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {currentTier === 'unlimited' ? 'Current Plan' : 'Go Unlimited'}
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            Maybe later
          </button>
          
          <p className="text-xs text-gray-500">
            Cancel anytime • Secure payment by Stripe
          </p>
        </div>
      </div>
    </div>
  );
}
