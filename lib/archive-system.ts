// lib/archive-system.ts
// Automatic monthly archiving system - FREE tier compatible

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
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';

// ============================================
// TYPES
// ============================================

interface ArchivedIdea {
  id: string;
  rank: number;
  title: string;
  type: 'movie' | 'game' | 'business';
  username: string;
  userPhotoURL?: string;
  aiScores: {
    overall: number;
    market: number;
    innovation: number;
    execution: number;
  };
  publicScore: {
    average: number;
    count: number;
  };
  createdAt: Date;
}

interface MonthlyArchive {
  month: string; // "2024-04"
  displayMonth: string; // "April 2024"
  archivedAt: Timestamp;
  topIdeas: ArchivedIdea[];
  totalIdeas: number;
  stats: {
    averageScore: number;
    topScore: number;
    totalVotes: number;
  };
}

// ============================================
// ARCHIVE FUNCTIONS
// ============================================

/**
 * Get month string from date
 */
function getMonthString(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

/**
 * Get display month name
 */
function getDisplayMonth(monthString: string): string {
  const [year, month] = monthString.split('-');
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  return `${monthNames[parseInt(month) - 1]} ${year}`;
}

/**
 * Check if we need to archive last month's data
 */
export async function checkAndArchiveLastMonth() {
  const now = new Date();
  const currentMonth = getMonthString(now);
  
  // Get last month
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonth = getMonthString(lastMonthDate);
  
  // Check if last month is already archived
  const archiveDoc = await getDoc(doc(db, 'archives', lastMonth));
  
  if (archiveDoc.exists()) {
    console.log(`Month ${lastMonth} already archived`);
    return false;
  }
  
  // If we're on or after the 1st and last month isn't archived, archive it
  if (now.getDate() >= 1) {
    console.log(`Archiving month: ${lastMonth}`);
    await archiveMonth(lastMonth);
    return true;
  }
  
  return false;
}

/**
 * Archive a specific month's leaderboard
 */
async function archiveMonth(monthString: string) {
  try {
    // Fetch all ideas from that month
    const ideasQuery = query(
      collection(db, 'ideas'),
      where('month', '==', monthString),
      orderBy('aiScores.overall', 'desc')
    );
    
    const snapshot = await getDocs(ideasQuery);
    const allIdeas = snapshot.docs.map((doc, index) => ({
      id: doc.id,
      rank: index + 1,
      title: doc.data().title,
      type: doc.data().type,
      username: doc.data().username,
      userPhotoURL: doc.data().userPhotoURL,
      aiScores: doc.data().aiScores,
      publicScore: doc.data().publicScore || { average: 0, count: 0 },
      createdAt: doc.data().createdAt?.toDate() || new Date()
    })) as ArchivedIdea[];
    
    // Calculate stats
    const stats = {
      averageScore: allIdeas.length > 0 
        ? allIdeas.reduce((sum, idea) => sum + idea.aiScores.overall, 0) / allIdeas.length 
        : 0,
      topScore: allIdeas.length > 0 ? allIdeas[0].aiScores.overall : 0,
      totalVotes: allIdeas.reduce((sum, idea) => sum + idea.publicScore.count, 0)
    };
    
    // Create archive document
    const archive: MonthlyArchive = {
      month: monthString,
      displayMonth: getDisplayMonth(monthString),
      archivedAt: serverTimestamp() as Timestamp,
      topIdeas: allIdeas.slice(0, 100), // Store top 100 for full leaderboard
      totalIdeas: allIdeas.length,
      stats
    };
    
    // Save to Firestore
    await setDoc(doc(db, 'archives', monthString), archive);
    
    console.log(`Successfully archived ${monthString}: ${allIdeas.length} ideas`);
    return archive;
    
  } catch (error) {
    console.error('Error archiving month:', error);
    throw error;
  }
}

/**
 * Get last 2 months of archives for sidebar
 */
export async function getRecentArchives(): Promise<MonthlyArchive[]> {
  try {
    // Get current date and calculate last 2 months
    const now = new Date();
    const months: string[] = [];
    
    // Get last 2 months
    for (let i = 1; i <= 2; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(getMonthString(date));
    }
    
    // Fetch archives for these months
    const archives: MonthlyArchive[] = [];
    
    for (const month of months) {
      const archiveDoc = await getDoc(doc(db, 'archives', month));
      if (archiveDoc.exists()) {
        archives.push(archiveDoc.data() as MonthlyArchive);
      }
    }
    
    return archives;
    
  } catch (error) {
    console.error('Error fetching archives:', error);
    return [];
  }
}

/**
 * Get a specific month's full archive
 */
export async function getMonthArchive(monthString: string): Promise<MonthlyArchive | null> {
  try {
    const archiveDoc = await getDoc(doc(db, 'archives', monthString));
    
    if (archiveDoc.exists()) {
      return archiveDoc.data() as MonthlyArchive;
    }
    
    return null;
    
  } catch (error) {
    console.error('Error fetching month archive:', error);
    return null;
  }
}

// ============================================
// FIRESTORE RULES UPDATE NEEDED
// ============================================
/*
Add this to your firestore.rules:

match /archives/{monthId} {
  // Anyone can read archives (public leaderboard history)
  allow read: if true;
  
  // Only allow creation through client-side archiving
  // (In production, you'd want this to be admin-only or Cloud Function)
  allow create: if request.auth != null;
  
  // Archives are permanent - no updates or deletes
  allow update, delete: if false;
}
*/
