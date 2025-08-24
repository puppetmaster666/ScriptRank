// lib/firebase-collections.ts - COMPLETE FILE
// Fixed version with proper username handling and notification support

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
import { db } from './firebase';
import { createVoteNotification, createMilestoneNotification } from './notification-system';

// ============================================
// SUBSCRIPTION TYPES
// ============================================

interface UserSubscription {
  tier: 'free' | 'starter' | 'unlimited';
  submissionsRemaining: number;
  submissionsUsedThisMonth: number;
  resetDate: Timestamp;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  paymentDate?: Timestamp;
}

// ============================================
// USER PROFILE FUNCTIONS
// ============================================

/**
 * Create a new user profile with free tier subscription
 * FIXED: Properly handles usernames without exposing emails
 */
export async function createUserProfile(userId: string, data: {
  username: string;
  displayName: string;
  email: string;
  photoURL?: string;
}) {
  try {
    // Clean and validate username - remove any email parts
    let cleanUsername = data.username.toLowerCase();
    
    // If username contains @ (email was used), extract only the part before @
    if (cleanUsername.includes('@')) {
      cleanUsername = cleanUsername.split('@')[0];
    }
    
    // Remove any problematic characters and numbers at the end
    cleanUsername = cleanUsername.replace(/[^a-z0-9_]/g, '');
    cleanUsername = cleanUsername.replace(/_\d+$/, ''); // Remove trailing _numbers
    
    // Ensure username is valid length
    if (cleanUsername.length < 3) {
      cleanUsername = `user${Date.now().toString().slice(-6)}`;
    }
    
    // Truncate if too long
    if (cleanUsername.length > 20) {
      cleanUsername = cleanUsername.substring(0, 20);
    }
    
    // Check if username is already taken
    const usernameQuery = query(
      collection(db, 'users'),
      where('username', '==', cleanUsername)
    );
    const usernameCheck = await getDocs(usernameQuery);
    
    // If taken, add unique suffix (but not visible email numbers)
    if (!usernameCheck.empty) {
      const randomSuffix = Math.random().toString(36).substring(2, 6);
      cleanUsername = `${cleanUsername}_${randomSuffix}`;
    }

    // Calculate 30 days from now for free tier reset
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    // Create the user document
    await setDoc(doc(db, 'users', userId), {
      uid: userId,
      username: cleanUsername, // Use cleaned username, never expose email
      displayName: data.displayName || cleanUsername,
      email: data.email, // Store email privately, never display publicly
      photoURL: data.photoURL || null,
      bio: '',
      createdAt: serverTimestamp(),
      
      // Initialize subscription (FREE TIER)
      subscription: {
        tier: 'free',
        submissionsRemaining: 3,
        submissionsUsedThisMonth: 0,
        resetDate: Timestamp.fromDate(thirtyDaysFromNow)
      },
      
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

    return { success: true, username: cleanUsername };
  } catch (error: any) {
    console.error('Error creating user profile:', error);
    throw error;
  }
}

// ============================================
// SUBSCRIPTION MANAGEMENT
// ============================================

/**
 * Check and reset subscription if 30 days have passed
 */
export async function checkAndResetSubscription(userId: string) {
  const userDoc = await getDoc(doc(db, 'users', userId));
  const userData = userDoc.data();
  
  if (!userData?.subscription) {
    // Initialize if doesn't exist
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    await updateDoc(doc(db, 'users', userId), {
      subscription: {
        tier: 'free',
        submissionsRemaining: 3,
        submissionsUsedThisMonth: 0,
        resetDate: Timestamp.fromDate(thirtyDaysFromNow)
      }
    });
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
        submissionsLimit = 9999;
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
async function useSubmission(userId: string) {
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

// ============================================
// IDEA SUBMISSION
// ============================================

/**
 * Submit a new idea with subscription check
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

    // Check for investment milestone
    if (data.aiScores.investmentStatus === 'INVEST') {
      await createMilestoneNotification(
        data.userId,
        `Congratulations! Your idea "${data.title}" got an INVEST rating! 💰`,
        ideaRef.id,
        data.title
      );
    }

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

// ============================================
// VOTING SYSTEM
// ============================================

/**
 * Cast a vote on an idea with notifications
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

    // Get voter's profile for notification
    const voterDoc = await getDoc(doc(db, 'users', userId));
    const voterData = voterDoc.data();
    
    // Ensure score is valid
    const validScore = Math.max(0, Math.min(10, score));
    const roundedScore = Math.round(validScore * 100) / 100;

    // Create vote document
    await setDoc(doc(db, 'votes', voteId), {
      userId: userId,
      ideaId: ideaId,
      score: roundedScore,
      createdAt: serverTimestamp()
    });

    // Get current idea data to update average
    const ideaDoc = await getDoc(doc(db, 'ideas', ideaId));
    const ideaData = ideaDoc.data();
    
    if (ideaData) {
      const newSum = (ideaData.publicScore?.sum || 0) + roundedScore;
      const newCount = (ideaData.publicScore?.count || 0) + 1;
      const newAverage = Math.round((newSum / newCount) * 100) / 100;
      
      // Update idea's public score
      await updateDoc(doc(db, 'ideas', ideaId), {
        'publicScore.sum': newSum,
        'publicScore.count': newCount,
        'publicScore.average': newAverage
      });
      
      // Create notification for idea owner
      if (ideaData.userId !== userId) {
        await createVoteNotification(
          ideaData.userId,
          userId,
          voterData?.username || 'Someone',
          voterData?.photoURL,
          ideaId,
          ideaData.title,
          roundedScore
        );
        
        // Check for milestones
        if (newCount === 10) {
          await createMilestoneNotification(
            ideaData.userId,
            `Your idea "${ideaData.title}" reached 10 votes!`,
            ideaId,
            ideaData.title
          );
        } else if (newCount === 25) {
          await createMilestoneNotification(
            ideaData.userId,
            `Your idea "${ideaData.title}" reached 25 votes! 🎉`,
            ideaId,
            ideaData.title
          );
        } else if (newCount === 50) {
          await createMilestoneNotification(
            ideaData.userId,
            `Your idea "${ideaData.title}" reached 50 votes! 🔥`,
            ideaId,
            ideaData.title
          );
        } else if (newCount === 100) {
          await createMilestoneNotification(
            ideaData.userId,
            `INCREDIBLE! Your idea "${ideaData.title}" reached 100 votes! 🚀`,
            ideaId,
            ideaData.title
          );
        }
        
        // High score milestone
        if (roundedScore >= 9.0) {
          await createMilestoneNotification(
            ideaData.userId,
            `Wow! ${voterData?.username || 'Someone'} gave your idea "${ideaData.title}" a ${roundedScore}/10! 🌟`,
            ideaId,
            ideaData.title
          );
        }
      }
    }

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

// ============================================
// LEADERBOARD FUNCTIONS
// ============================================

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

// ============================================
// SOCIAL FEATURES (Moved to notification-system.ts)
// ============================================
// Following functions are now in notification-system.ts

// ============================================
// PAYMENT FUNCTIONS (for Stripe integration)
// ============================================

/**
 * Upgrade user subscription after Stripe payment
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
  
  // Send upgrade notification
  await createMilestoneNotification(
    userId,
    `Welcome to ${tier === 'unlimited' ? 'Unlimited' : 'Starter'} tier! 🎉 You now have ${tier === 'unlimited' ? 'unlimited' : '10'} submissions per month.`
  );
}
