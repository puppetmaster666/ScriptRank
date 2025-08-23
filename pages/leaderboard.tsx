import Head from 'next/head';
import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { castVote } from '@/lib/firebase-collections';
import Link from 'next/link';

type Idea = {
  id: string;
  title: string;
  type: 'movie' | 'game' | 'business';
  content: string;
  userId: string;
  username: string;
  userPhotoURL?: string;
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
  publicScore?: {
    average: number;
    count: number;
    sum: number;
  };
  createdAt: Date;
  month: string;
};

type SortMode = 'ai' | 'public' | 'market' | 'innovation' | 'execution';
type FilterType = 'all' | 'movie' | 'game' | 'business';

export default function LeaderboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [voteValue, setVoteValue] = useState(5.00);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [sortMode, setSortMode] = useState<SortMode>('ai');
  const [loading, setLoading] = useState(true);
  const [submittingVote, setSubmittingVote] = useState(false);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // Real-time data fetching
  useEffect(() => {
    setLoading(true);
    
    // Get current month
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    // Build query based on filters
    let q = query(collection(db, 'ideas'), where('month', '==', currentMonth));
    
    if (activeFilter !== 'all') {
      q = query(q, where('type', '==', activeFilter));
    }
    
    // Add ordering based on sort mode
    const orderByField = {
      'ai': 'aiScores.overall',
      'public': 'publicScore.average',
      'market': 'aiScores.market',
      'innovation': 'aiScores.innovation',
      'execution': 'aiScores.execution'
    }[sortMode];
    
    q = query(q, orderBy(orderByField, 'desc'), limit(50));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map(doc => {
        const data = doc.data();
        return { 
          id: doc.id, 
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          // Ensure publicScore has defaults
          publicScore: data.publicScore || {
            average: data.aiScores?.overall || 0,
            count: 0,
            sum: 0
          }
        } as Idea;
      });
      
      setIdeas(results);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching leaderboard:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [activeFilter, sortMode]);

  const handleVote = async (ideaId: string) => {
    if (!user) {
      alert('Please sign in to vote');
      return;
    }
    
    if (submittingVote) return;
    
    setSubmittingVote(true);
    try {
      await castVote(user.uid, ideaId, voteValue);
      setSelectedIdea(null);
      setVoteValue(5.00);
      // Data will update automatically via real-time listener
    } catch (error: any) {
      console.error('Vote error:', error);
      alert(error.message || 'Failed to submit vote');
    } finally {
      setSubmittingVote(false);
    }
  };

  const getScore = (idea: Idea): number => {
    switch (sortMode) {
      case 'public':
        return idea.publicScore?.average || idea.aiScores.overall;
      case 'market':
        return idea.aiScores.market;
      case 'innovation':
        return idea.aiScores.innovation;
      case 'execution':
        return idea.aiScores.execution;
      default:
        return idea.aiScores.overall;
    }
  };

  // Stats calculations
  const stats = {
    totalIdeas: ideas.length,
    topScore: ideas.length ? Math.max(...ideas.map(idea => getScore(idea))) : 0,
    avgScore: ideas.length ? (ideas.reduce((sum, idea) => sum + getScore(idea), 0) / ideas.length) : 0,
    mostVoted: Math.max(...ideas.map(idea => idea.publicScore?.count || 0), 0)
  };

  return (
    <>
      <Head>
        <title>Leaderboard | MakeMeFamous</title>
        <meta name="description" content="See which ideas are dominating this month's leaderboard" />
      </Head>
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Leaderboard */}
          <div className="flex-1">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Leaderboard</h1>
              <p className="text-gray-600">Current month's top ideas ranked by VC-style AI analysis</p>
            </div>

            {/* Filters & Sort */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Type Filters */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Type</label>
                  <div className="flex space-x-2">
                    {([
                      { key: 'all', label: 'All Ideas', icon: '🎯' },
                      { key: 'movie', label: 'Movies', icon: '🎬' },
                      { key: 'game', label: 'Games', icon: '🎮' },
                      { key: 'business', label: 'Business', icon: '💼' }
                    ] as const).map(({ key, label, icon }) => (
                      <button
                        key={key}
                        onClick={() => setActiveFilter(key)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                          activeFilter === key
                            ? 'bg-gray-900 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <span>{icon}</span>
                        <span className="hidden sm:inline">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort Options */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort by Score</label>
                  <div className="flex space-x-2">
                    {([
                      { key: 'ai', label: 'Overall' },
                      { key: 'public', label: 'Public' },
                      { key: 'market', label: 'Market' },
                      { key: 'innovation', label: 'Innovation' },
                      { key: 'execution', label: 'Execution' }
                    ] as const).map(({ key, label }) => (
                      <button
                        key={key}
                        onClick={() => setSortMode(key)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                          sortMode === key
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Leaderboard Table */}
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            ) : ideas.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-2xl font-bold mb-2">No Ideas Yet</h3>
                <p className="text-gray-600 mb-6">Be the first to submit an idea this month!</p>
                <Link href="/submit">
                  <a className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition">
                    Submit First Idea
                  </a>
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Idea</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Creator</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                          {sortMode.charAt(0).toUpperCase() + sortMode.slice(1)} Score
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Votes</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {ideas.map((idea, index) => {
                        const score = getScore(idea);
                        return (
                          <tr key={idea.id} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <RankBadge rank={index + 1} />
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="text-2xl">
                                  {idea.type === 'movie' ? '🎬' : idea.type === 'game' ? '🎮' : '💼'}
                                </div>
                                <div>
                                  <Link href={`/ideas/${idea.id}`}>
                                    <a className="font-medium text-blue-600 hover:text-blue-800 line-clamp-1">
                                      {idea.title}
                                    </a>
                                  </Link>
                                  <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                                    {idea.content.substring(0, 100)}...
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <img 
                                  src={idea.userPhotoURL || '/default-avatar.png'} 
                                  alt={idea.username}
                                  className="w-6 h-6 rounded-full"
                                />
                                <span className="text-sm text-gray-900">{idea.username}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <ScorePill score={score} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <StatusBadge status={idea.aiScores.investmentStatus} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {idea.publicScore?.count || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => setSelectedIdea(idea)}
                                className="text-sm bg-gray-900 hover:bg-gray-700 text-white px-3 py-1.5 rounded-lg transition font-medium"
                              >
                                Vote
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 space-y-6">
            {/* Stats Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h2 className="text-lg font-bold text-gray-900 mb-4">This Month's Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <StatCard label="Total Ideas" value={stats.totalIdeas} />
                <StatCard label="Top Score" value={stats.topScore.toFixed(2)} />
                <StatCard label="Average" value={stats.avgScore.toFixed(2)} />
                <StatCard label="Most Voted" value={stats.mostVoted} />
              </div>
            </div>

            {/* Voting Panel */}
            {selectedIdea && (
              <div className="bg-white p-6 rounded-xl shadow-sm border sticky top-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Rate This Idea</h2>
                  <button
                    onClick={() => setSelectedIdea(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-medium text-gray-900 mb-1">{selectedIdea.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <span>{selectedIdea.type === 'movie' ? '🎬' : selectedIdea.type === 'game' ? '🎮' : '💼'}</span>
                    <span>by {selectedIdea.username}</span>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-3">
                    {selectedIdea.content}
                  </p>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">Your Score</label>
                    <span className="text-lg font-bold text-blue-600">{voteValue.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.01"
                    max="10.00"
                    step="0.01"
                    value={voteValue}
                    onChange={(e) => setVoteValue(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0.01 (Terrible)</span>
                    <span>10.00 (Perfect)</span>
                  </div>
                </div>

                <button
                  onClick={() => handleVote(selectedIdea.id)}
                  disabled={submittingVote}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 rounded-lg font-medium transition disabled:opacity-50"
                >
                  {submittingVote ? 'Submitting...' : 'Submit Vote'}
                </button>

                <div className="mt-3 text-center">
                  <Link href={`/ideas/${selectedIdea.id}`}>
                    <a className="text-sm text-blue-600 hover:text-blue-800">
                      View Full Details →
                    </a>
                  </Link>
                </div>
              </div>
            )}

            {/* Submit CTA */}
            {user && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                <h3 className="font-bold text-gray-900 mb-2">Have an idea?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Get harsh VC-style feedback and join the leaderboard
                </p>
                <Link href="/submit">
                  <a className="block w-full text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition font-medium">
                    Submit Your Idea
                  </a>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

// Components
const RankBadge = ({ rank }: { rank: number }) => {
  const getBadgeStyle = (rank: number) => {
    if (rank === 1) return 'bg-yellow-400 text-gray-900 font-bold text-lg';
    if (rank === 2) return 'bg-gray-300 text-gray-900 font-bold';
    if (rank === 3) return 'bg-amber-600 text-white font-bold';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${getBadgeStyle(rank)}`}>
      {rank}
    </div>
  );
};

const ScorePill = ({ score }: { score: number }) => {
  const getScoreColor = (score: number) => {
    if (score >= 8.0) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 6.0) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (score >= 4.0) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getScoreColor(score)}`}>
      {score.toFixed(2)}
    </span>
  );
};

const StatusBadge = ({ status }: { status: 'INVEST' | 'PASS' | 'MAYBE' }) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'INVEST': return 'bg-green-100 text-green-800 border-green-200';
      case 'MAYBE': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusStyle(status)}`}>
      {status}
    </span>
  );
};

const StatCard = ({ label, value }: { label: string; value: string | number }) => (
  <div className="text-center">
    <div className="text-2xl font-bold text-gray-900">{value}</div>
    <div className="text-xs text-gray-500 mt-1">{label}</div>
  </div>
);
