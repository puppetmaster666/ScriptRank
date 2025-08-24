// lib/notification-system.ts
// Complete notification system with following functionality

import { 
  collection, 
  doc, 
  setDoc, 
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  onSnapshot,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';

// ============================================
// TYPES
// ============================================

export interface Notification {
  id: string;
  userId: string;
  type: 'new_follower' | 'idea_voted' | 'milestone_reached' | 'idea_invested';
  title: string;
  message: string;
  fromUserId?: string;
  fromUsername?: string;
  fromUserPhoto?: string;
  ideaId?: string;
  ideaTitle?: string;
  read: boolean;
  createdAt: Timestamp;
}

// ============================================
// FOLLOWING SYSTEM
// ============================================

/**
 * Follow a user
 */
export async function followUser(
  followerId: string,
  followedId: string,
  followerUsername: string,
  followerPhoto?: string
) {
  if (followerId === followedId) {
    throw new Error("You can't follow yourself");
  }

  try {
    const batch = writeBatch(db);
    const followingId = `${followerId}_${followedId}`;
    
    // Check if already following
    const existingFollow = await getDoc(doc(db, 'following', followingId));
    if (existingFollow.exists()) {
      throw new Error('Already following this user');
    }

    // Create following relationship
    batch.set(doc(db, 'following', followingId), {
      followerId: followerId,
      followedId: followedId,
      createdAt: serverTimestamp()
    });

    // Update follower count for followed user
    const followedUserRef = doc(db, 'users', followedId);
    const followedUserDoc = await getDoc(followedUserRef);
    const currentFollowers = followedUserDoc.data()?.followersCount || 0;
    batch.update(followedUserRef, {
      followersCount: currentFollowers + 1
    });

    // Update following count for follower
    const followerUserRef = doc(db, 'users', followerId);
    const followerUserDoc = await getDoc(followerUserRef);
    const currentFollowing = followerUserDoc.data()?.followingCount || 0;
    batch.update(followerUserRef, {
      followingCount: currentFollowing + 1
    });

    // Create notification for followed user
    const notificationRef = doc(collection(db, 'notifications'));
    batch.set(notificationRef, {
      userId: followedId,
      type: 'new_follower',
      title: 'New Follower',
      message: `${followerUsername} started following you`,
      fromUserId: followerId,
      fromUsername: followerUsername,
      fromUserPhoto: followerPhoto,
      read: false,
      createdAt: serverTimestamp()
    });

    await batch.commit();
    return { success: true };

  } catch (error: any) {
    console.error('Error following user:', error);
    throw error;
  }
}

/**
 * Unfollow a user
 */
export async function unfollowUser(followerId: string, followedId: string) {
  try {
    const batch = writeBatch(db);
    const followingId = `${followerId}_${followedId}`;
    
    // Check if following
    const existingFollow = await getDoc(doc(db, 'following', followingId));
    if (!existingFollow.exists()) {
      throw new Error('Not following this user');
    }

    // Delete following relationship
    batch.delete(doc(db, 'following', followingId));

    // Update follower count for followed user
    const followedUserRef = doc(db, 'users', followedId);
    const followedUserDoc = await getDoc(followedUserRef);
    const currentFollowers = Math.max(0, (followedUserDoc.data()?.followersCount || 1) - 1);
    batch.update(followedUserRef, {
      followersCount: currentFollowers
    });

    // Update following count for follower
    const followerUserRef = doc(db, 'users', followerId);
    const followerUserDoc = await getDoc(followerUserRef);
    const currentFollowing = Math.max(0, (followerUserDoc.data()?.followingCount || 1) - 1);
    batch.update(followerUserRef, {
      followingCount: currentFollowing
    });

    await batch.commit();
    return { success: true };

  } catch (error: any) {
    console.error('Error unfollowing user:', error);
    throw error;
  }
}

/**
 * Check if user is following another user
 */
export async function isFollowing(followerId: string, followedId: string): Promise<boolean> {
  try {
    const followingId = `${followerId}_${followedId}`;
    const followDoc = await getDoc(doc(db, 'following', followingId));
    return followDoc.exists();
  } catch (error) {
    console.error('Error checking follow status:', error);
    return false;
  }
}

/**
 * Get list of followers
 */
export async function getFollowers(userId: string) {
  try {
    const q = query(
      collection(db, 'following'),
      where('followedId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    const followerIds = snapshot.docs.map(doc => doc.data().followerId);
    
    // Get user details for each follower
    const followers = [];
    for (const followerId of followerIds) {
      const userDoc = await getDoc(doc(db, 'users', followerId));
      if (userDoc.exists()) {
        followers.push({
          id: followerId,
          ...userDoc.data()
        });
      }
    }
    
    return followers;
  } catch (error) {
    console.error('Error getting followers:', error);
    return [];
  }
}

/**
 * Get list of users being followed
 */
export async function getFollowing(userId: string) {
  try {
    const q = query(
      collection(db, 'following'),
      where('followerId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    const followingIds = snapshot.docs.map(doc => doc.data().followedId);
    
    // Get user details for each followed user
    const following = [];
    for (const followedId of followingIds) {
      const userDoc = await getDoc(doc(db, 'users', followedId));
      if (userDoc.exists()) {
        following.push({
          id: followedId,
          ...userDoc.data()
        });
      }
    }
    
    return following;
  } catch (error) {
    console.error('Error getting following:', error);
    return [];
  }
}

// ============================================
// NOTIFICATION FUNCTIONS
// ============================================

/**
 * Create a notification when someone votes on your idea
 */
export async function createVoteNotification(
  ideaOwnerId: string,
  voterId: string,
  voterUsername: string,
  voterPhoto: string | undefined,
  ideaId: string,
  ideaTitle: string,
  score: number
) {
  try {
    // Don't notify if voting on own idea
    if (ideaOwnerId === voterId) return;

    await setDoc(doc(collection(db, 'notifications')), {
      userId: ideaOwnerId,
      type: 'idea_voted',
      title: 'New Vote',
      message: `${voterUsername} rated your idea "${ideaTitle}" with ${score.toFixed(2)}/10`,
      fromUserId: voterId,
      fromUsername: voterUsername,
      fromUserPhoto: voterPhoto,
      ideaId: ideaId,
      ideaTitle: ideaTitle,
      read: false,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error creating vote notification:', error);
  }
}

/**
 * Create milestone notification
 */
export async function createMilestoneNotification(
  userId: string,
  milestone: string,
  ideaId?: string,
  ideaTitle?: string
) {
  try {
    await setDoc(doc(collection(db, 'notifications')), {
      userId: userId,
      type: 'milestone_reached',
      title: 'Milestone Reached! 🎉',
      message: milestone,
      ideaId: ideaId,
      ideaTitle: ideaTitle,
      read: false,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error creating milestone notification:', error);
  }
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(userId: string): Promise<number> {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      where('read', '==', false)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }
}

/**
 * Get user's notifications
 */
export async function getNotifications(userId: string, limitCount: number = 20) {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Notification[];
  } catch (error) {
    console.error('Error getting notifications:', error);
    return [];
  }
}

/**
 * Mark notification as read
 */
export async function markAsRead(notificationId: string) {
  try {
    await updateDoc(doc(db, 'notifications', notificationId), {
      read: true
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllAsRead(userId: string) {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      where('read', '==', false)
    );
    
    const snapshot = await getDocs(q);
    const batch = writeBatch(db);
    
    snapshot.docs.forEach(doc => {
      batch.update(doc.ref, { read: true });
    });
    
    await batch.commit();
  } catch (error) {
    console.error('Error marking all as read:', error);
  }
}

/**
 * Delete a notification
 */
export async function deleteNotification(notificationId: string) {
  try {
    await deleteDoc(doc(db, 'notifications', notificationId));
  } catch (error) {
    console.error('Error deleting notification:', error);
  }
}
