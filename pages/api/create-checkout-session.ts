// STEP 3: Create checkout API - pages/api/create-checkout-session.ts
// ============================================
// pages/api/create-checkout-session.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '../../lib/stripe';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin (we'll set this up)
import { initializeApp, cert, getApps } from 'firebase-admin/app';

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const adminAuth = getAuth();
const adminDb = getFirestore();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { tier, idToken } = req.body;

  if (!tier || !idToken) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Verify Firebase auth token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;
    const email = decodedToken.email;

    // Get user data from Firestore
    const userDoc = await adminDb.collection('users').doc(userId).get();
    const userData = userDoc.data();

    // Check if user already has a Stripe customer ID
    let customerId = userData?.subscription?.stripeCustomerId;

    if (!customerId) {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: email,
        metadata: {
          firebaseUID: userId,
        },
      });
      customerId = customer.id;

      // Save customer ID to Firestore
      await adminDb.collection('users').doc(userId).update({
        'subscription.stripeCustomerId': customerId,
      });
    }

    // Determine price ID based on tier
    const priceId = tier === 'unlimited' 
      ? process.env.STRIPE_UNLIMITED_PRICE_ID 
      : process.env.STRIPE_STARTER_PRICE_ID;

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
      metadata: {
        userId: userId,
        tier: tier,
      },
      subscription_data: {
        metadata: {
          userId: userId,
          tier: tier,
        },
      },
      // Enable customer portal for subscription management
      customer_update: {
        address: 'auto',
      },
      allow_promotion_codes: true,
    });

    return res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Checkout session error:', error);
    return res.status(500).json({ 
      error: 'Failed to create checkout session',
      details: error.message 
    });
  }
}
