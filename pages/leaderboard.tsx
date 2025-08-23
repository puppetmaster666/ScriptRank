import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { castVote } from '@/lib/firebase-collections';

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

export default function LeaderboardPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'movie' | 'game' | 'business'>('all');
  const [sortMode, setSortMode] = useState<'ai' | 'public' | 'market' | 'innovation' | 'execution'>('ai');
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [voteValue, setVoteValue] = useState(5.00);
  const [submittingVote, setSubmittingVote] = useState(false);
  const [userVotes, setUserVotes] = useState<Set<string>>(new Set());

  // Get current month
  const currentMonth = new Date().toISOString().slice(0, 7);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // Fetch ideas
  useEffect(() => {
    setLoading(true);
    
    // Build query with filters
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
          publicScore: data.publicScore || {
            average: 0,
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
  }, [activeFilter, sortMode, currentMonth]);

  // Fetch user's votes
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'votes'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const votedIdeaIds = new Set(snapshot.docs.map(doc => doc.data().ideaId));
      setUserVotes(votedIdeaIds);
    });

    return () => unsubscribe();
  }, [user]);

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
        return idea.publicScore?.average || 0;
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
    avgScore: ideas.length ? 
      ideas.reduce((sum, idea) => sum + getScore(idea), 0) / ideas.length : 0,
    mostVoted: ideas.reduce((max, idea) => 
      (idea.publicScore?.count || 0) > (max.publicScore?.count || 0) ? idea : max, 
      ideas[0] || null)
  };

  return (
    <>
      <Head>
        <title>Leaderboard | ScriptRank</title>
        <meta name="description" content="See the top-ranked ideas this month" />
      </Head>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Monthly Leaderboard</h1>
          <p className="text-gray-600">
            {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} Rankings
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Filters */}
            <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveFilter('all')}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      activeFilter === 'all' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All Ideas
                  </button>
                  <button
                    onClick={() => setActiveFilter('movie')}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      activeFilter === 'movie' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Movies
                  </button>
                  <button
                    onClick={() => setActiveFilter('game')}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      activeFilter === 'game' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Games
                  </button>
                  <button
                    onClick={() => setActiveFilter('business')}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      activeFilter === 'business' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Business
                  </button>
                </div>
              </div>
            </div>

            {/* Ideas Table */}
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            ) : ideas.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl">
                <h3 className="text-2xl font-bold mb-2">No Ideas Yet</h3>
                <p className="text-gray-600 mb-6">Be the first to submit an idea this month!</p>
                <Link href="/submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition">
                  Submit First Idea
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
                        <th 
                          className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-gray-700"
                          onClick={() => setSortMode('ai')}
                        >
                          AI Score {sortMode === 'ai' && '↓'}
                        </th>
                        <th 
                          className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-gray-700"
                          onClick={() => setSortMode('public')}
                        >
                          Public {sortMode === 'public' && '↓'}
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {ideas.map((idea, index) => {
                        const hasVoted = userVotes.has(idea.id);
                        return (
                          <tr key={idea.id} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <RankBadge rank={index + 1} />
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <Link href={`/ideas/${idea.id}`} className="text-gray-900 font-medium hover:text-blue-600">
                                  {idea.title}
                                </Link>
                                <div className="text-sm text-gray-500 capitalize">{idea.type}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                {idea.userPhotoURL && (
                                  <img 
                                    src={idea.userPhotoURL} 
                                    alt={idea.username}
                                    className="w-8 h-8 rounded-full"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                  />
                                )}
                                <span className="text-sm text-gray-900">{idea.username}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <ScorePill score={idea.aiScores.overall} />
                            </td>
                            <td className="px-6 py-4">
                              {idea.publicScore && idea.publicScore.count > 0 ? (
                                <div>
                                  <ScorePill score={idea.publicScore.average} />
                                  <div className="text-xs text-gray-500 mt-1">
                                    {idea.publicScore.count} votes
                                  </div>
                                </div>
                              ) : (
                                <span className="text-gray-400">--</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <StatusBadge status={idea.aiScores.investmentStatus} />
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <Link href={`/ideas/${idea.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                  View
                                </Link>
                                {user && !hasVoted && (
                                  <button
                                    onClick={() => setSelectedIdea(idea)}
                                    className="text-green-600 hover:text-green-800 text-sm font-medium"
                                  >
                                    Vote
                                  </button>
                                )}
                              </div>
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
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="font-bold text-gray-900 mb-4">Current Stats</h2>
              <div className="space-y-3">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.totalIdeas}</div>
                  <div className="text-sm text-gray-600">Total Ideas</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.topScore.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">Top Score</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.avgScore.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">Average Score</div>
                </div>
              </div>
            </div>

            {/* Score Categories */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Score Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSortMode('market')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition ${
                    sortMode === 'market' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
                  }`}
                >
                  Market Score
                </button>
                <button
                  onClick={() => setSortMode('innovation')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition ${
                    sortMode === 'innovation' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
                  }`}
                >
                  Innovation Score
                </button>
                <button
                  onClick={() => setSortMode('execution')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition ${
                    sortMode === 'execution' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
                  }`}
                >
                  Execution Score
                </button>
              </div>
            </div>

            {/* Vote Modal */}
            {selectedIdea && (
              <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-blue-500">
                <h3 className="font-bold mb-3">Vote for: {selectedIdea.title}</h3>
                
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">Your Score</label>
                    <span className="text-2xl font-bold text-blue-600">{voteValue.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.01"
                    max="10.00"
                    step="0.01"
                    value={voteValue}
                    onChange={(e) => setVoteValue(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0</span>
                    <span>5</span>
                    <span>10</span>
                  </div>
                </div>

                <button
                  onClick={() => handleVote(selectedIdea.id)}
                  disabled={submittingVote}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {submittingVote ? 'Submitting...' : 'Submit Vote'}
                </button>

                <button
                  onClick={() => setSelectedIdea(null)}
                  className="w-full mt-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Submit CTA */}
            {user && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                <h3 className="font-bold text-gray-900 mb-2">Have an idea?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Get honest feedback and join the leaderboard
                </p>
                <Link href="/submit" className="block w-full text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition font-medium">
                  Submit Your Idea
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
    if (rank === 1) return 'bg-yellow-400 text-gray-900';
    if (rank === 2) return 'bg-gray-300 text-gray-900';
    if (rank === 3) return 'bg-amber-600 text-white';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getBadgeStyle(rank)}`}>
      {rank}
    </div>
  );
};

const ScorePill = ({ score }: { score: number }) => {
  const getScoreColor = (score: number) => {
    if (score >= 8.0) return 'bg-green-100 text-green-800';
    if (score >= 6.0) return 'bg-blue-100 text-blue-800';
    if (score >= 4.0) return 'bg-amber-100 text-amber-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(score)}`}>
      {score.toFixed(2)}
    </span>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'INVEST': return 'bg-green-100 text-green-800';
      case 'MAYBE': return 'bg-amber-100 text-amber-800';
      default: return 'bg-red-100 text-red-800';
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(status)}`}>
      {status}
    </span>
  );
};
