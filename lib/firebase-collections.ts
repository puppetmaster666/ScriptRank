// lib/firebase-collections.ts
// This file defines the structure and helper functions for Firebase

import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
  increment,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase'; // Your existing firebase.ts file

// ============================================
// HELPER FUNCTIONS TO WORK WITH COLLECTIONS
// ============================================

/**
 * Create a new user profile
 */
export async function createUserProfile(userId: string, data: {
  username: string;
  displayName: string;
  email: string;
  photoURL?: string;
}) {
  try {
    // Check if username is already taken
    const usernameQuery = query(
      collection(db, 'users'),
      where('username', '==', data.username)
    );
    const usernameCheck = await getDocs(usernameQuery);
    
    if (!usernameCheck.empty) {
      throw new Error('Username already taken');
    }

    // Create the user document
    await setDoc(doc(db, 'users', userId), {
      uid: userId,
      username: data.username.toLowerCase(),
      displayName: data.displayName,
      photoURL: data.photoURL || null,
      bio: '',
      createdAt: serverTimestamp(),
      
      // Initialize stats
      stats: {
        totalIdeas: 0,
        averageAIScore: 0,
        averagePublicScore: 0,
        bestIdeaScore: 0,
        bestIdeaId: '',
        totalVotesCast: 0,
        monthlyIdeasCount: 0
      },
      
      // Initialize social
      followers: [],
      following: [],
      followersCount: 0,
      followingCount: 0
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error creating user profile:', error);
    throw error;
  }
}

/**
 * Submit a new idea and get AI rating
 */
export async function submitIdea(data: {
  userId: string;
  username: string;
  userPhotoURL?: string;
  type: string;
  title: string;
  content: string;
  aiScores: {
    market: number;
    innovation: number;
    execution: number;
    overall: number;
    marketFeedback: string;
    innovationFeedback: string;
    executionFeedback: string;
    verdict: string;
    investmentStatus: 'INVEST' | 'PASS' | 'MAYBE';
  };
}) {
  try {
    // Get current month for archiving
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    // Count words
    const wordCount = data.content.trim().split(/\s+/).length;

    // Create idea document
    const ideaRef = await addDoc(collection(db, 'ideas'), {
      userId: data.userId,
      username: data.username,
      userPhotoURL: data.userPhotoURL || null,
      
      // Content
      type: data.type,
      title: data.title.substring(0, 100), // Enforce max length
      content: data.content,
      wordCount: wordCount,
      
      // AI Scores
      aiScores: data.aiScores,
      
      // Initialize public voting
      publicScore: {
        average: 0,
        count: 0,
        sum: 0
      },
      
      // Timestamps
      createdAt: serverTimestamp(),
      month: month,
      
      // Rankings will be updated by cloud function
      rankings: {}
    });

    // Update user stats
    await updateDoc(doc(db, 'users', data.userId), {
      'stats.totalIdeas': increment(1),
      'stats.monthlyIdeasCount': increment(1),
      // Average scores will be recalculated by cloud function
    });

    return { 
      success: true, 
      ideaId: ideaRef.id 
    };
  } catch (error) {
    console.error('Error submitting idea:', error);
    throw error;
  }
}

/**
 * Cast a vote on an idea
 */
export async function castVote(
  userId: string,
  ideaId: string,
  score: number // 0.00 to 10.00
) {
  try {
    // Check if user already voted
    const voteId = `${userId}_${ideaId}`;
    const existingVote = await getDoc(doc(db, 'votes', voteId));
    
    if (existingVote.exists()) {
      throw new Error('You have already voted on this idea');
    }

    // Ensure score is valid
    const validScore = Math.max(0, Math.min(10, score));
    const roundedScore = Math.round(validScore * 100) / 100; // 2 decimals

    // Create vote document
    await setDoc(doc(db, 'votes', voteId), {
      userId: userId,
      ideaId: ideaId,
      score: roundedScore,
      createdAt: serverTimestamp()
    });

    // Update idea's public score
    await updateDoc(doc(db, 'ideas', ideaId), {
      'publicScore.sum': increment(roundedScore),
      'publicScore.count': increment(1),
      // Average will be recalculated by cloud function
    });

    // Update user's vote count
    await updateDoc(doc(db, 'users', userId), {
      'stats.totalVotesCast': increment(1)
    });

    return { success: true, score: roundedScore };
  } catch (error) {
    console.error('Error casting vote:', error);
    throw error;
  }
}

/**
 * Get current month's leaderboard
 */
export async function getCurrentMonthLeaderboard(
  category: 'overall' | 'market' | 'innovation' | 'execution' | 'public' = 'overall',
  limitCount: number = 10
) {
  try {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    let orderByField;
    switch (category) {
      case 'market':
        orderByField = 'aiScores.market';
        break;
      case 'innovation':
        orderByField = 'aiScores.innovation';
        break;
      case 'execution':
        orderByField = 'aiScores.execution';
        break;
      case 'public':
        orderByField = 'publicScore.average';
        break;
      default:
        orderByField = 'aiScores.overall';
    }

    const q = query(
      collection(db, 'ideas'),
      where('month', '==', currentMonth),
      orderBy(orderByField, 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    const ideas = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return ideas;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
}

/**
 * Follow/Unfollow a user
 */
export async function toggleFollow(
  followerId: string,
  followedId: string,
  action: 'follow' | 'unfollow'
) {
  try {
    const followingId = `${followerId}_${followedId}`;
    
    if (action === 'follow') {
      // Create following relationship
      await setDoc(doc(db, 'following', followingId), {
        followerId: followerId,
        followedId: followedId,
        createdAt: serverTimestamp()
      });

      // Update counts
      await updateDoc(doc(db, 'users', followerId), {
        followingCount: increment(1)
      });
      await updateDoc(doc(db, 'users', followedId), {
        followersCount: increment(1)
      });

      // Create notification
      await addDoc(collection(db, 'notifications'), {
        userId: followedId,
        type: 'new_follower',
        title: 'New Follower',
        message: `Someone started following you`,
        fromUserId: followerId,
        read: false,
        createdAt: serverTimestamp()
      });

    } else {
      // Remove following relationship
      // (You'd implement the delete here)
      
      // Update counts
      await updateDoc(doc(db, 'users', followerId), {
        followingCount: increment(-1)
      });
      await updateDoc(doc(db, 'users', followedId), {
        followersCount: increment(-1)
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error toggling follow:', error);
    throw error;
  }
}

// ============================================
// FIREBASE SECURITY RULES
// ============================================

export const FIREBASE_RULES = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Anyone can read, only authenticated can write
    match /users/{userId} {
      allow read: if true;
      allow create, update: if request.auth != null && request.auth.uid == userId;
    }
    
    match /ideas/{ideaId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    match /votes/{voteId} {
      allow read: if true;
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.userId
        && request.resource.data.score >= 0 
        && request.resource.data.score <= 10;
      allow update, delete: if false; // Votes are final
    }
    
    match /notifications/{notificationId} {
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
      allow update: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    match /following/{followId} {
      allow read: if true;
      allow create, delete: if request.auth != null 
        && request.auth.uid == resource.data.followerId;
    }
    
    match /monthly_archives/{archiveId} {
      allow read: if true;
      allow write: if false; // Only admin
    }
  }
}
`;
// Add these to your firebase-collections.ts file

// ============================================
// SUBSCRIPTION MANAGEMENT
// ============================================

interface UserSubscription {
  tier: 'free' | 'starter' | 'unlimited';
  submissionsRemaining: number;
  submissionsUsedThisMonth: number;
  resetDate: Timestamp; // 30 days from purchase/last reset
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  paymentDate?: Timestamp; // When they paid (for paid tiers)
}

/**
 * Initialize subscription for new user (free tier)
 */
export async function initializeUserSubscription(userId: string) {
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  
  const subscription: UserSubscription = {
    tier: 'free',
    submissionsRemaining: 3,
    submissionsUsedThisMonth: 0,
    resetDate: Timestamp.fromDate(thirtyDaysFromNow)
  };
  
  await updateDoc(doc(db, 'users', userId), {
    subscription: subscription
  });
}

/**
 * Check and reset subscription if 30 days have passed
 */
export async function checkAndResetSubscription(userId: string) {
  const userDoc = await getDoc(doc(db, 'users', userId));
  const userData = userDoc.data();
  
  if (!userData?.subscription) {
    // Initialize if doesn't exist
    await initializeUserSubscription(userId);
    return;
  }
  
  const now = new Date();
  const resetDate = userData.subscription.resetDate.toDate();
  
  // Check if 30 days have passed
  if (now > resetDate) {
    const newResetDate = new Date(resetDate);
    newResetDate.setDate(newResetDate.getDate() + 30);
    
    // Reset based on tier
    let submissionsLimit;
    switch (userData.subscription.tier) {
      case 'starter':
        submissionsLimit = 10;
        break;
      case 'unlimited':
        submissionsLimit = 9999; // Effectively unlimited
        break;
      default: // free
        submissionsLimit = 3;
    }
    
    await updateDoc(doc(db, 'users', userId), {
      'subscription.submissionsRemaining': submissionsLimit,
      'subscription.submissionsUsedThisMonth': 0,
      'subscription.resetDate': Timestamp.fromDate(newResetDate)
    });
  }
}

/**
 * Check if user can submit an idea
 */
export async function canUserSubmitIdea(userId: string): Promise<{
  canSubmit: boolean;
  reason?: string;
  remaining?: number;
}> {
  // First check and reset if needed
  await checkAndResetSubscription(userId);
  
  const userDoc = await getDoc(doc(db, 'users', userId));
  const userData = userDoc.data();
  
  if (!userData?.subscription) {
    return { 
      canSubmit: false, 
      reason: 'No subscription found. Please contact support.' 
    };
  }
  
  const sub = userData.subscription;
  
  if (sub.tier === 'unlimited') {
    return { canSubmit: true, remaining: 9999 };
  }
  
  if (sub.submissionsRemaining > 0) {
    return { 
      canSubmit: true, 
      remaining: sub.submissionsRemaining 
    };
  }
  
  return { 
    canSubmit: false, 
    reason: `You've used all ${sub.tier === 'free' ? '3 free' : '10'} submissions this month. Upgrade to continue.`,
    remaining: 0
  };
}

/**
 * Use a submission when idea is created
 */
export async function useSubmission(userId: string) {
  const userDoc = await getDoc(doc(db, 'users', userId));
  const userData = userDoc.data();
  
  if (!userData?.subscription) return;
  
  // Don't decrement if unlimited
  if (userData.subscription.tier === 'unlimited') return;
  
  await updateDoc(doc(db, 'users', userId), {
    'subscription.submissionsRemaining': increment(-1),
    'subscription.submissionsUsedThisMonth': increment(1)
  });
}

/**
 * Upgrade user subscription (called after Stripe payment)
 */
export async function upgradeUserSubscription(
  userId: string, 
  tier: 'starter' | 'unlimited',
  stripeCustomerId: string,
  stripeSubscriptionId: string
) {
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  
  const submissionsLimit = tier === 'unlimited' ? 9999 : 10;
  
  await updateDoc(doc(db, 'users', userId), {
    subscription: {
      tier: tier,
      submissionsRemaining: submissionsLimit,
      submissionsUsedThisMonth: 0,
      resetDate: Timestamp.fromDate(thirtyDaysFromNow),
      stripeCustomerId: stripeCustomerId,
      stripeSubscriptionId: stripeSubscriptionId,
      paymentDate: serverTimestamp()
    }
  });
  
  // Record payment
  await addDoc(collection(db, 'payments'), {
    userId: userId,
    amount: tier === 'unlimited' ? 10 : 5,
    tier: tier,
    stripeSubscriptionId: stripeSubscriptionId,
    createdAt: serverTimestamp()
  });
}

/**
 * Modified submitIdea function with subscription check
 */
export async function submitIdeaWithSubscription(data: {
  userId: string;
  username: string;
  userPhotoURL?: string;
  type: string;
  title: string;
  content: string;
  aiScores: {
    market: number;
    innovation: number;
    execution: number;
    overall: number;
    marketFeedback: string;
    innovationFeedback: string;
    executionFeedback: string;
    verdict: string;
    investmentStatus: 'INVEST' | 'PASS' | 'MAYBE';
  };
}) {
  // Check if user can submit
  const canSubmit = await canUserSubmitIdea(data.userId);
  
  if (!canSubmit.canSubmit) {
    throw new Error(canSubmit.reason || 'Cannot submit idea');
  }
  
  try {
    // Get current month for archiving
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    // Count words
    const wordCount = data.content.trim().split(/\s+/).length;

    // Create idea document
    const ideaRef = await addDoc(collection(db, 'ideas'), {
      userId: data.userId,
      username: data.username,
      userPhotoURL: data.userPhotoURL || null,
      
      // Content
      type: data.type,
      title: data.title.substring(0, 100),
      content: data.content,
      wordCount: wordCount,
      
      // AI Scores
      aiScores: data.aiScores,
      
      // Initialize public voting
      publicScore: {
        average: 0,
        count: 0,
        sum: 0
      },
      
      // Timestamps
      createdAt: serverTimestamp(),
      month: month,
      
      // Rankings will be updated by cloud function
      rankings: {}
    });

    // Use a submission
    await useSubmission(data.userId);

    // Update user stats
    await updateDoc(doc(db, 'users', data.userId), {
      'stats.totalIdeas': increment(1),
      'stats.monthlyIdeasCount': increment(1),
    });

    return { 
      success: true, 
      ideaId: ideaRef.id,
      submissionsRemaining: canSubmit.remaining ? canSubmit.remaining - 1 : 0
    };
  } catch (error) {
    console.error('Error submitting idea:', error);
    throw error;
  }
}
