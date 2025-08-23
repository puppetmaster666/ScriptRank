// lib/stripe.ts
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
});

// Your actual price IDs from Stripe Dashboard
export const PRICE_IDS = {
  starter: process.env.STRIPE_STARTER_PRICE_ID!,
  unlimited: process.env.STRIPE_UNLIMITED_PRICE_ID!,
};
