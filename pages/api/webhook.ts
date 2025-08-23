// STEP 4: Webhook handler - pages/api/webhook.ts
// ============================================
// pages/api/webhook.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import { stripe } from '../../lib/stripe';
import { upgradeUserSubscription } from '../../lib/firebase-collections';

// Disable body parser for webhooks
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature']!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as any;
      const userId = session.metadata.userId;
      const tier = session.metadata.tier;
      const customerId = session.customer;
      const subscriptionId = session.subscription;

      // Update user subscription in Firebase
      await upgradeUserSubscription(
        userId,
        tier,
        customerId,
        subscriptionId
      );

      console.log(`Subscription activated for user ${userId}: ${tier}`);
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as any;
      const userId = subscription.metadata.userId;
      
      // Handle subscription updates (upgrades/downgrades)
      console.log(`Subscription updated for user ${userId}`);
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as any;
      const userId = subscription.metadata.userId;
      
      // Downgrade to free tier
      const { getFirestore } = await import('firebase-admin/firestore');
      const adminDb = getFirestore();
      
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      
      await adminDb.collection('users').doc(userId).update({
        'subscription.tier': 'free',
        'subscription.submissionsRemaining': 3,
        'subscription.submissionsUsedThisMonth': 0,
        'subscription.resetDate': thirtyDaysFromNow,
        'subscription.stripeSubscriptionId': null,
      });
      
      console.log(`User ${userId} downgraded to free tier`);
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as any;
      // Handle failed payment (send email, show warning, etc.)
      console.log(`Payment failed for invoice ${invoice.id}`);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.status(200).json({ received: true });
}
