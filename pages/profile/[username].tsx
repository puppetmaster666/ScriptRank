// pages/profile/[username].tsx - NEW FILE
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';

interface UserProfile {
  uid: string;
  username: string;
  displayName: string;
  bio?: string;
  photoURL?: string;
  stats: {
    totalIdeas: number;
    averageAIScore: number;
    bestIdeaScore: number;
    totalVotesCast: number;
  };
  followersCount: number;
  followingCount: number;
  createdAt: any;
}

interface Idea {
  id: string;
  title: string;
  type: 'movie' | 'game' | 'business';
  aiScores: {
    overall: number;
    investmentStatus: 'INVEST' | 'PASS' | 'MAYBE';
  };
  publicScore?: {
    average: number;
    count: number;
  };
  createdAt: Date;
}

export default function UserProfilePage() {
  const router = useRouter();
  const { username } = router.query;
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setCurrentUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!username || typeof username !== 'string') return;

    const loadProfile = async () => {
      try {
        // Find user by username
        const usersQuery = query(
          collection(db, 'users'),
          where('username', '==', username.toLowerCase())
        );
        const userSnapshot = await getDocs(usersQuery);
        
        if (userSnapshot.empty) {
          setProfile(null);
          setLoading(false);
          return;
        }

        const userData = userSnapshot.docs[0].data() as UserProfile;
        const userId = userSnapshot.docs[0].id;
        userData.uid = userId;
        setProfile(userData);

        // Check if current user follows this user
        if (currentUser) {
          const followQuery = query(
            collection(db, 'following'),
            where('followerId', '==', currentUser.uid),
            where('followedId', '==', userId)
          );
          const followSnapshot = await getDocs(followQuery);
          setIsFollowing(!followSnapshot.empty);
        }

        // Load user's ideas
        const ideasQuery = query(
          collection(db, 'ideas'),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc'),
          limit(10)
        );
        const ideasSnapshot = await getDocs(ideasQuery);
        const userIdeas = ideasSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        })) as Idea[];
        
        setIdeas(userIdeas);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [username, currentUser]);

  const handleFollow = async () => {
    if (!currentUser || !profile) {
      alert('Please sign in to follow users');
      return;
    }

    // This would use the toggleFollow function from firebase-collections.ts
    // For now, just show the UI change
    setIsFollowing(!isFollowing);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">User Not Found</h1>
          <p className="text-gray-600 mb-4">No user with username "{username}"</p>
          <Link href="/leaderboard">
            <a className="text-blue-600 hover:text-blue-700">Back to Leaderboard</a>
          </Link>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.uid === profile.uid;

  return (
    <>
      <Head>
        <title>{profile.displayName} | ScriptRank</title>
        <meta name="description" content={`View ${profile.displayName}'s ideas and stats`} />
      </Head>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="flex items-start gap-6">
            <img
              src={profile.photoURL || '/default-avatar.png'}
              alt={profile.displayName}
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-100"
            />
            
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {profile.displayName}
                  </h1>
                  <p className="text-gray-500 mb-3">@{profile.username}</p>
                  {profile.bio && (
                    <p className="text-gray-700 max-w-2xl">{profile.bio}</p>
                  )}
                </div>
                
                <div className="flex gap-3">
                  {isOwnProfile ? (
                    <Link href="/dashboard">
                      <a className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition">
                        Edit Profile
                      </a>
                    </Link>
                  ) : currentUser && (
                    <button
                      onClick={handleFollow}
                      className={`px-6 py-2 rounded-lg transition ${
                        isFollowing 
                          ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </button>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {profile.stats.totalIdeas}
                  </div>
                  <div className="text-sm text-gray-500">Ideas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {profile.stats.averageAIScore > 0 
                      ? profile.stats.averageAIScore.toFixed(2) 
                      : 'N/A'}
                  </div>
                  <div className="text-sm text-gray-500">Avg Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {profile.stats.bestIdeaScore > 0 
                      ? profile.stats.bestIdeaScore.toFixed(2) 
                      : 'N/A'}
                  </div>
                  <div className="text-sm text-gray-500">Best Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {profile.followersCount || 0}
                  </div>
                  <div className="text-sm text-gray-500">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {profile.followingCount || 0}
                  </div>
                  <div className="text-sm text-gray-500">Following</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User's Ideas */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">Recent Ideas</h2>
          
          {ideas.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No ideas submitted yet
            </p>
          ) : (
            <div className="space-y-4">
              {ideas.map((idea) => (
                <Link key={idea.id} href={`/ideas/${idea.id}`}>
                  <a className="block p-4 border rounded-lg hover:bg-gray-50 transition">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {idea.title}
                        </h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <span className="capitalize">
                            {idea.type === 'movie' ? '🎬' : 
                             idea.type === 'game' ? '🎮' : '💼'} {idea.type}
                          </span>
                          <span>
                            {idea.createdAt.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">
                            {idea.aiScores.overall.toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500">AI Score</div>
                        </div>
                        
                        {idea.publicScore && idea.publicScore.count > 0 && (
                          <div className="text-center">
                            <div className="text-lg font-bold text-purple-600">
                              {idea.publicScore.average.toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-500">
                              Public ({idea.publicScore.count})
                            </div>
                          </div>
                        )}
                        
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          idea.aiScores.investmentStatus === 'INVEST' 
                            ? 'bg-green-100 text-green-800'
                            : idea.aiScores.investmentStatus === 'MAYBE'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {idea.aiScores.investmentStatus}
                        </span>
                      </div>
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
