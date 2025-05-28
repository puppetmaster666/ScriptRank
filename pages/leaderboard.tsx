import Head from 'next/head';
import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, where, doc, updateDoc, arrayUnion, onSnapshot, orderBy } from 'firebase/firestore';
import Link from 'next/link';

type Idea = {
  id: string;
  title: string;
  genre: string;
  type: 'movie' | 'game' | 'business';
  description: string;
  aiScore: number;
  votes?: { userId: string; score: number }[];
  publicScore?: number;
  aiCritique: string;
  createdAt: Date;
};

export default function LeaderboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [voteValue, setVoteValue] = useState(5.00);
  const [activeTab, setActiveTab] = useState<'all' | 'movie' | 'game' | 'business'>('all');
  const [loading, setLoading] = useState(true);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // Real-time data fetching
  useEffect(() => {
    setLoading(true);
    let q;
    
    if (activeTab === 'all') {
      q = query(collection(db, 'ideas'), orderBy('aiScore', 'desc'));
    } else {
      q = query(
        collection(db, 'ideas'),
        where('type', '==', activeTab),
        orderBy('aiScore', 'desc')
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map(doc => {
        const data = doc.data() as Idea;
        const publicScore = data.votes?.length 
          ? data.votes.reduce((sum, vote) => sum + vote.score, 0) / data.votes.length
          : data.aiScore; // Fallback to AI score if no votes
        
        return { 
          id: doc.id, 
          ...data,
          publicScore: parseFloat(publicScore.toFixed(2))
        };
      });
      
      setIdeas(results);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [activeTab]);

  const handleVote = async (ideaId: string) => {
    if (!user) return alert('Please sign in to vote');
    
    try {
      const ideaRef = doc(db, 'ideas', ideaId);
      await updateDoc(ideaRef, {
        votes: arrayUnion({
          userId: user.uid,
          score: voteValue,
          timestamp: new Date()
        })
      });
      alert('Vote submitted!');
      setSelectedIdea(null);
    } catch (error) {
      console.error('Vote error:', error);
      alert('Failed to submit vote');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8.0) return 'bg-gradient-to-r from-green-400 to-emerald-600 text-white';
    if (score >= 6.0) return 'bg-green-100 text-green-800';
    if (score >= 4.0) return 'bg-amber-100 text-amber-800';
    return 'bg-red-100 text-red-800';
  };

  // Stats calculations
  const topScore = ideas.reduce((max, idea) => Math.max(max, idea.aiScore), 0);
  const mostVotes = Math.max(...ideas.map(idea => idea.votes?.length || 0), 0);
  const totalIdeas = ideas.length;
  const uniqueGenres = [...new Set(ideas.map(idea => idea.genre))].length;

  return (
    <>
      <Head>
        <title>Idea Leaderboard | MakeMeFamous</title>
      </Head>
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Leaderboard */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h1 className="text-3xl font-bold text-gray-900">Idea Leaderboard</h1>
              
              <div className="flex space-x-2">
                <TabButton active={activeTab === 'all'} onClick={() => setActiveTab('all')}>
                  All Ideas
                </TabButton>
                <TabButton active={activeTab === 'movie'} onClick={() => setActiveTab('movie')}>
                  Movies
                </TabButton>
                <TabButton active={activeTab === 'game'} onClick={() => setActiveTab('game')}>
                  Games
                </TabButton>
                <TabButton active={activeTab === 'business'} onClick={() => setActiveTab('business')}>
                  Business
                </TabButton>
              </div>
            </div>

            {loading ? (
              <div className="animate-pulse space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            ) : ideas.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No ideas found in this category</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AI Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Public Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Votes</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {ideas.map((idea, index) => (
                      <tr key={idea.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <RankBadge rank={index + 1} />
                        </td>
                        <td className="px-6 py-4">
                          <Link href={`/ideas/${idea.id}`} className="font-medium text-blue-600 hover:text-blue-800">
                            {idea.title}
                          </Link>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-1">{idea.description}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                            {idea.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <ScorePill score={idea.aiScore} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <ScorePill score={idea.publicScore || idea.aiScore} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {idea.votes?.length || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => setSelectedIdea(idea)}
                            className="text-sm bg-gray-900 hover:bg-gray-700 text-white px-3 py-1 rounded transition-colors"
                          >
                            Vote
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 space-y-6">
            {/* Stats Card */}
            <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Leaderboard Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <StatCard label="Total Ideas" value={totalIdeas} />
                <StatCard label="Top AI Score" value={topScore.toFixed(2)} />
                <StatCard label="Most Votes" value={mostVotes} />
                <StatCard label="Unique Genres" value={uniqueGenres} />
              </div>
            </div>

            {/* Voting Panel */}
            {selectedIdea && (
              <div className="bg-white p-6 rounded-xl shadow border border-gray-200 sticky top-6">
                <h2 className="text-lg font-bold text-gray-900 mb-2">Rate This Idea</h2>
                <p className="text-gray-700 mb-4 font-medium">{selectedIdea.title}</p>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Score: <span className="font-bold">{voteValue.toFixed(2)}</span>
                  </label>
                  <input
                    type="range"
                    min="0.01"
                    max="10.00"
                    step="0.01"
                    value={voteValue}
                    onChange={(e) => setVoteValue(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0.01 (Bad)</span>
                    <span>10.00 (Perfect)</span>
                  </div>
                </div>

                <button
                  onClick={() => handleVote(selectedIdea.id)}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Submit Your Vote
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

// Component: Tab Button
const TabButton = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-md text-sm font-medium ${
      active ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'
    }`}
  >
    {children}
  </button>
);

// Component: Rank Badge
const RankBadge = ({ rank }: { rank: number }) => (
  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
    rank === 1 ? 'bg-yellow-400 text-gray-900 font-bold' :
    rank === 2 ? 'bg-gray-300 text-gray-900 font-bold' :
    rank === 3 ? 'bg-amber-600 text-white font-bold' :
    'bg-gray-100 text-gray-700'
  }`}>
    {rank}
  </span>
);

// Component: Score Pill
const ScorePill = ({ score }: { score: number }) => (
  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
    score >= 8.0 ? 'bg-green-100 text-green-800' :
    score >= 6.0 ? 'bg-blue-100 text-blue-800' :
    score >= 4.0 ? 'bg-amber-100 text-amber-800' :
    'bg-red-100 text-red-800'
  }`}>
    {score.toFixed(2)}
  </span>
);

// Component: Stat Card
const StatCard = ({ label, value }: { label: string; value: string | number }) => (
  <div className="bg-gray-50 p-3 rounded-lg">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-lg font-bold text-gray-900">{value}</p>
  </div>
);