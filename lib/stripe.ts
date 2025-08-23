// ============================================
// STEP 2: Create Stripe instance - lib/stripe.ts
// ============================================
// lib/stripe.ts

import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia', // Use latest API version
  typescript: true,
});

// Subscription price IDs (you'll create these in Stripe Dashboard)
export const PRICE_IDS = {
  starter: process.env.STRIPE_STARTER_PRICE_ID || 'price_starter_test',
  unlimited: process.env.STRIPE_UNLIMITED_PRICE_ID || 'price_unlimited_test',
};
