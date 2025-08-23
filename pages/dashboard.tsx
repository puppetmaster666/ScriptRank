import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect, ChangeEvent, useRef } from 'react';
import { useRouter } from 'next/router';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { createUserProfile, checkAndResetSubscription } from '@/lib/firebase-collections';

type IdeaType = 'movie' | 'game' | 'business';

type Idea = {
  id: string;
  userId: string;
  type: IdeaType;
  title: string;
  content: string;
  aiScores: {
    market: number;
    innovation: number;
    execution: number;
    overall: number;
    verdict: string;
    investmentStatus: 'INVEST' | 'PASS' | 'MAYBE';
  };
  publicScore?: {
    average: number;
    count: number;
  };
  createdAt: any;
};

type UserProfile = {
  uid: string;
  username: string;
  displayName: string;
  bio?: string;
  photoURL?: string;
  subscription: {
    tier: 'free' | 'starter' | 'unlimited';
    submissionsRemaining: number;
    submissionsUsedThisMonth: number;
    resetDate: any;
  };
  stats: {
    totalIdeas: number;
    averageAIScore: number;
    averagePublicScore: number;
    bestIdeaScore: number;
    totalVotesCast: number;
  };
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | IdeaType>('all');
  const [profileError, setProfileError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        router.push('/register');
        return;
      }
      
      setUser(u);
      setLoading(true);
      
      try {
        // Check and reset subscription if needed
        await checkAndResetSubscription(u.uid);
        
        // Get user profile from Firestore
        const userDoc = await getDoc(doc(db, 'users', u.uid));
        
        if (!userDoc.exists()) {
          // Profile doesn't exist, create it
          console.log('Creating new profile for existing user...');
          try {
            await createUserProfile(u.uid, {
              username: u.displayName || u.email?.split('@')[0] || 'user',
              displayName: u.displayName || 'Anonymous',
              email: u.email || '',
              photoURL: u.photoURL || undefined
            });
            // Fetch the newly created profile
            const newUserDoc = await getDoc(doc(db, 'users', u.uid));
            if (newUserDoc.exists()) {
              const profileData = newUserDoc.data() as UserProfile;
              setProfile(profileData);
              setUsername(profileData.username);
              setDisplayName(profileData.displayName);
              setBio(profileData.bio || '');
            }
          } catch (error: any) {
            console.error('Error creating profile:', error);
            setProfileError('Failed to create profile. ' + error.message);
          }
        } else {
          // Profile exists, use it
          const profileData = userDoc.data() as UserProfile;
          setProfile(profileData);
          setUsername(profileData.username);
          setDisplayName(profileData.displayName);
          setBio(profileData.bio || '');
        }

        // Fetch user's ideas
        const ideasQuery = query(
          collection(db, 'ideas'),
          where('userId', '==', u.uid),
          orderBy('createdAt', 'desc')
        );
        const ideasSnapshot = await getDocs(ideasQuery);
        const userIdeas = ideasSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Idea[];
        setIdeas(userIdeas);
        
      } catch (error) {
        console.error('Error loading dashboard:', error);
        setProfileError('Error loading profile data');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const saveProfile = async () => {
    if (!user || !profile) return;
    
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        displayName: displayName,
        bio: bio,
        // Username cannot be changed after creation
      });
      
      setProfile({
        ...profile,
        displayName: displayName,
        bio: bio
      });
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setProfileError('Failed to update profile');
    }
  };

  const handlePhotoChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    const reader = new FileReader();
    reader.onload = async () => {
      const photoURL = reader.result as string;
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          photoURL: photoURL
        });
        if (profile) {
          setProfile({
            ...profile,
            photoURL: photoURL
          });
        }
      } catch (error) {
        console.error('Error updating photo:', error);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-800">{profileError}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const filteredIdeas = activeTab === 'all' 
    ? ideas 
    : ideas.filter(i => i.type === activeTab);

  const avgScore = ideas.length
    ? (ideas.reduce((sum, i) => sum + i.aiScores.overall, 0) / ideas.length).toFixed(2)
    : 'N/A';

  const ideasByAI = [...filteredIdeas].sort((a, b) => b.aiScores.overall - a.aiScores.overall);
  const ideasByPublic = [...filteredIdeas].sort((a, b) => {
    const avgA = a.publicScore?.average || 0;
    const avgB = b.publicScore?.average || 0;
    return avgB - avgA;
  });

  const getTypeIcon = (type: IdeaType) => {
    switch (type) {
      case 'movie': return '🎬';
      case 'game': return '🎮';
      case 'business': return '💼';
      default: return '💡';
    }
  };

  const getInvestmentEmoji = (status: string) => {
    switch (status) {
      case 'INVEST': return '💰';
      case 'MAYBE': return '🤔';
      default: return '❌';
    }
  };

  return (
    <>
      <Head>
        <title>Dashboard | ScriptRank</title>
      </Head>
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <section className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8 bg-white rounded-xl p-6 shadow-sm">
          <div className="relative">
            <img
              src={profile?.photoURL || '/default-avatar.png'}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
            />
            {editMode && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition"
              >
                📷
              </button>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>

          <div className="flex-1">
            {editMode ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600">Username (cannot be changed)</label>
                  <input
                    type="text"
                    value={username}
                    disabled
                    className="w-full p-3 border rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>
                <input
                  type="text"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="Display name"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  className="w-full p-3 border rounded-lg h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="flex space-x-3">
                  <button
                    onClick={saveProfile}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition"
                  >
                    Save Profile
                  </button>
                  <button
                    onClick={() => {
                      setEditMode(false);
                      setDisplayName(profile?.displayName || '');
                      setBio(profile?.bio || '');
                    }}
                    className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{profile?.displayName || 'Anonymous Creator'}</h1>
                <p className="text-sm text-gray-500">@{profile?.username}</p>
                {profile?.bio && <p className="mt-2 text-gray-600">{profile.bio}</p>}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => setEditMode(true)}
                    className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg w-full md:w-auto">
            <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
              <StatCard 
                label="Subscription" 
                value={profile?.subscription.tier.toUpperCase() || 'FREE'} 
              />
              <StatCard 
                label="Ideas Left" 
                value={`${profile?.subscription.submissionsRemaining || 0}/${
                  profile?.subscription.tier === 'free' ? '3' :
                  profile?.subscription.tier === 'starter' ? '10' : '∞'
                }`} 
              />
              <StatCard 
                label="Total Ideas" 
                value={profile?.stats.totalIdeas || 0} 
              />
              <StatCard 
                label="Avg Score" 
                value={avgScore} 
              />
            </div>
            {profile?.subscription.tier === 'free' && (
              <Link href="/pricing" className="block mt-4">
                <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition text-sm font-medium">
                  Upgrade Plan
                </button>
              </Link>
            )}
          </div>
        </section>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          <TabButton active={activeTab === 'all'} onClick={() => setActiveTab('all')}>
            All Ideas ({ideas.length})
          </TabButton>
          <TabButton active={activeTab === 'movie'} onClick={() => setActiveTab('movie')}>
            🎬 Movies ({ideas.filter(i => i.type === 'movie').length})
          </TabButton>
          <TabButton active={activeTab === 'game'} onClick={() => setActiveTab('game')}>
            🎮 Games ({ideas.filter(i => i.type === 'game').length})
          </TabButton>
          <TabButton active={activeTab === 'business'} onClick={() => setActiveTab('business')}>
            💼 Business ({ideas.filter(i => i.type === 'business').length})
          </TabButton>
        </div>

        {/* Ideas List */}
        <section className="mb-10 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Your Ideas</h2>
            <p className="text-gray-600">Sorted by AI overall score</p>
          </div>
          
          {ideasByAI.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">💡</div>
              <p className="text-gray-500 mb-4">
                {activeTab === 'all' 
                  ? "You haven't submitted any ideas yet."
                  : `No ${activeTab} ideas found.`}
              </p>
              <Link href="/submit">
                <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition">
                  Submit Your First Idea
                </button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {ideasByAI.map((idea) => (
                <div key={idea.id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl mt-1">{getTypeIcon(idea.type)}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {idea.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-2xl">{getInvestmentEmoji(idea.aiScores.investmentStatus)}</span>
                            <span className={`text-sm font-medium ${
                              idea.aiScores.investmentStatus === 'INVEST' ? 'text-green-600' :
                              idea.aiScores.investmentStatus === 'MAYBE' ? 'text-amber-600' :
                              'text-red-600'
                            }`}>
                              {idea.aiScores.investmentStatus}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Score Grid */}
                      <div className="grid grid-cols-5 gap-2 mb-3">
                        <ScoreBadge score={idea.aiScores.overall} label="Overall" isMain />
                        <ScoreBadge score={idea.aiScores.market} label="Market" />
                        <ScoreBadge score={idea.aiScores.innovation} label="Innovation" />
                        <ScoreBadge score={idea.aiScores.execution} label="Execution" />
                        <ScoreBadge 
                          score={idea.publicScore?.average || 0} 
                          label={`Public (${idea.publicScore?.count || 0})`} 
                        />
                      </div>

                      <p className="text-gray-700 line-clamp-2 mb-3">{idea.content}</p>
                      
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-600 italic">"{idea.aiScores.verdict}"</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}

// Component: Tab Button
const TabButton = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition ${
      active 
        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' 
        : 'text-gray-700 hover:bg-gray-100'
    }`}
  >
    {children}
  </button>
);

// Component: Stat Card
const StatCard = ({ label, value }: { label: string; value: string | number }) => (
  <div className="text-center">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-lg font-bold text-gray-900">{value}</p>
  </div>
);

// Component: Score Badge
const ScoreBadge = ({ score, label, isMain = false }: { score: number; label: string; isMain?: boolean }) => {
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 6) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (score >= 4) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  return (
    <div className={`text-center p-2 rounded-lg border ${getScoreColor(score)} ${isMain ? 'ring-2 ring-offset-1 ring-blue-500' : ''}`}>
      <div className="text-lg font-bold">{score.toFixed(1)}</div>
      <div className="text-xs">{label}</div>
    </div>
  );
};
