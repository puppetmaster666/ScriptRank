// STEP 5: Customer Portal API - pages/api/create-portal-session.ts
// ============================================
// pages/api/create-portal-session.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '../../lib/stripe';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ error: 'Missing authentication' });
  }

  try {
    const { getAuth } = await import('firebase-admin/auth');
    const { getFirestore } = await import('firebase-admin/firestore');
    
    const adminAuth = getAuth();
    const adminDb = getFirestore();

    // Verify Firebase auth
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // Get user's Stripe customer ID
    const userDoc = await adminDb.collection('users').doc(userId).get();
    const userData = userDoc.data();
    const customerId = userData?.subscription?.stripeCustomerId;

    if (!customerId) {
      return res.status(400).json({ error: 'No subscription found' });
    }

    // Create portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/account`,
    });

    return res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error('Portal session error:', error);
    return res.status(500).json({ 
      error: 'Failed to create portal session',
      details: error.message 
    });
  }
}
