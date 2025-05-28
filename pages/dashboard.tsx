import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect, ChangeEvent, useRef } from 'react';
import { useRouter } from 'next/router';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

type IdeaType = 'movie' | 'game' | 'business';

type Idea = {
  id: string;
  userId: string;
  type: IdeaType;
  title: string;
  genre: string;
  description: string;
  attachmentUrl?: string;
  aiScore: number;
  aiCritique: string;
  votes?: { userId: string; score: number }[];
  publicScore?: number;
  createdAt: Date;
};

type Profile = {
  username?: string;
  bio?: string;
  photoURL?: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile>({});
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [editMode, setEditMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | IdeaType>('all');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        router.push('/login');
      } else {
        setUser(u);
        const prof = JSON.parse(localStorage.getItem(`profile_user_${u.uid}`) || '{}');
        setProfile(prof);
        setUsername(prof.username || '');
        setBio(prof.bio || '');

        const q = query(collection(db, "ideas"), where("userId", "==", u.uid));
        const snapshot = await getDocs(q);
        const userIdeas = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        })) as Idea[];
        setIdeas(userIdeas);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const saveProfile = (photoURL?: string) => {
    if (!user) return;
    const prof: Profile = { username, bio };
    if (photoURL) prof.photoURL = photoURL;
    localStorage.setItem(`profile_user_${user.uid}`, JSON.stringify(prof));
    setProfile(prof);
    setEditMode(false);
  };

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      saveProfile(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this idea?')) return;
    await deleteDoc(doc(db, "ideas", id));
    setIdeas(ideas.filter(i => i.id !== id));
  };

  const filteredIdeas = activeTab === 'all' 
    ? ideas 
    : ideas.filter(i => i.type === activeTab);

  const avgScore = ideas.length
    ? (ideas.reduce((sum, i) => sum + i.aiScore, 0) / ideas.length).toFixed(2)
    : 'N/A';

  const ideasByAI = [...filteredIdeas].sort((a, b) => b.aiScore - a.aiScore);
  const ideasByPublic = [...filteredIdeas].sort((a, b) => {
    const avgA = a.publicScore || a.aiScore;
    const avgB = b.publicScore || b.aiScore;
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

  return (
    <>
      <Head>
        <title>Your Dashboard | MakeMeFamous</title>
      </Head>
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <section className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8 bg-white rounded-xl p-6 shadow-sm">
          <div className="relative">
            <img
              src={profile.photoURL || '/default-avatar.png'}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
            />
            {editMode && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
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
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Your display name"
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
                    onClick={() => saveProfile(profile.photoURL)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition"
                  >
                    Save Profile
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{username || 'Anonymous Creator'}</h1>
                {bio && <p className="mt-2 text-gray-600">{bio}</p>}
                <button
                  onClick={() => setEditMode(true)}
                  className="mt-4 bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </button>
              </div>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg w-full md:w-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <StatCard label="Total Ideas" value={ideas.length} />
              <StatCard label="Avg AI Score" value={avgScore} />
              <StatCard label="Top Idea" value={ideasByAI[0]?.aiScore?.toFixed(2) || 'N/A'} />
            </div>
          </div>
        </section>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          <TabButton active={activeTab === 'all'} onClick={() => setActiveTab('all')}>
            All Ideas
          </TabButton>
          <TabButton active={activeTab === 'movie'} onClick={() => setActiveTab('movie')}>
            🎬 Movies
          </TabButton>
          <TabButton active={activeTab === 'game'} onClick={() => setActiveTab('game')}>
            🎮 Games
          </TabButton>
          <TabButton active={activeTab === 'business'} onClick={() => setActiveTab('business')}>
            💼 Business
          </TabButton>
        </div>

        {/* AI Ranked Ideas */}
        <section className="mb-10 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">✨ Your Top-Ranked Ideas</h2>
            <p className="text-gray-600">Sorted by AI score</p>
          </div>
          
          {ideasByAI.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              {activeTab === 'all' 
                ? "You haven't submitted any ideas yet."
                : `No ${activeTab} ideas found.`}
              <Link href="/submit" className="text-blue-600 hover:underline ml-2">
                Submit your first idea
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {ideasByAI.map((idea, index) => (
                <div key={idea.id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl mt-1">{getTypeIcon(idea.type)}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <Link href={`/ideas/${idea.id}`} className="text-lg font-medium text-blue-600 hover:underline">
                          {idea.title}
                        </Link>
                        <div className="flex items-center gap-4">
                          <ScoreBadge score={idea.aiScore} label="AI" />
                          <ScoreBadge score={idea.publicScore || idea.aiScore} label="Public" />
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{idea.genre}</p>
                      <p className="mt-2 text-gray-700 line-clamp-2">{idea.description}</p>
                      <div className="mt-3 flex justify-between items-center">
                        <p className="text-xs text-gray-400">
                          Submitted on {idea.createdAt.toLocaleDateString()}
                        </p>
                        <button
                          onClick={() => handleDelete(idea.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Public Ranking */}
        <section className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">🌍 Community Rankings</h2>
            <p className="text-gray-600">How the public rated your ideas</p>
          </div>
          
          {ideasByPublic.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No public ratings yet. Share your ideas to get votes!
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {ideasByPublic.map((idea) => (
                <div key={idea.id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl mt-1">{getTypeIcon(idea.type)}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <Link href={`/ideas/${idea.id}`} className="text-lg font-medium text-blue-600 hover:underline">
                          {idea.title}
                        </Link>
                        <div className="flex items-center gap-4">
                          <div className="text-sm">
                            <span className="font-medium">Votes:</span> {idea.votes?.length || 0}
                          </div>
                          <ScoreBadge score={idea.publicScore || idea.aiScore} label="Public" />
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{idea.genre}</p>
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
    className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
      active ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'
    }`}
  >
    {children}
  </button>
);

// Component: Stat Card
const StatCard = ({ label, value }: { label: string; value: string | number }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-lg font-bold text-gray-900">{value}</p>
  </div>
);

// Component: Score Badge
const ScoreBadge = ({ score, label }: { score: number | undefined, label: string }) => {
  if (score === undefined) return null;
  
  const scoreColor = score >= 8 ? 'bg-green-100 text-green-800' :
                    score >= 6 ? 'bg-blue-100 text-blue-800' :
                    score >= 4 ? 'bg-amber-100 text-amber-800' :
                    'bg-red-100 text-red-800';

  return (
    <div className={`px-3 py-1 rounded-full text-xs font-medium ${scoreColor}`}>
      {label}: {score.toFixed(2)}
    </div>
  );
};