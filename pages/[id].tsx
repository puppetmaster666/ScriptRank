import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
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
  wordCount: number;
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

type Vote = {
  userId: string;
  score: number;
  createdAt: Date;
};

export default function IdeaDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState<User | null>(null);
  const [idea, setIdea] = useState<Idea | null>(null);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(true);
  const [voteValue, setVoteValue] = useState(5.00);
  const [submittingVote, setSubmittingVote] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [showVotePanel, setShowVotePanel] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // Fetch idea details
  useEffect(() => {
    if (!id || typeof id !== 'string') return;

    const fetchIdeaDetails = async () => {
      try {
        const ideaDoc = await getDoc(doc(db, 'ideas', id));
        if (ideaDoc.exists()) {
          const data = ideaDoc.data();
          setIdea({
            id: ideaDoc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            publicScore: data.publicScore || {
              average: data.aiScores?.overall || 0,
              count: 0,
              sum: 0
            }
          } as Idea);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching idea:', error);
        setLoading(false);
      }
    };

    fetchIdeaDetails();
  }, [id]);

  // Fetch votes and check if user has voted
  useEffect(() => {
    if (!id || typeof id !== 'string') return;

    // Listen to votes in real-time
    const votesQuery = query(
      collection(db, 'votes'),
      where('ideaId', '==', id)
    );

    const unsubscribe = onSnapshot(votesQuery, (snapshot) => {
      const votesList = snapshot.docs.map(doc => ({
        userId: doc.data().userId,
        score: doc.data().score,
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }));
      
      setVotes(votesList);
      
      // Check if current user has voted
      if (user) {
        const userVote = votesList.find(vote => vote.userId === user.uid);
        setHasVoted(!!userVote);
      }
    });

    return () => unsubscribe();
  }, [id, user]);

  const handleVote = async () => {
    if (!user || !idea) {
      alert('Please sign in to vote');
      return;
    }
    
    if (submittingVote) return;
    
    setSubmittingVote(true);
    try {
      await castVote(user.uid, idea.id, voteValue);
      setShowVotePanel(false);
      setVoteValue(5.00);
    } catch (error: any) {
      console.error('Vote error:', error);
      alert(error.message || 'Failed to submit vote');
    } finally {
      setSubmittingVote(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <div className="text-6xl mb-4">😕</div>
        <h1 className="text-2xl font-bold mb-2">Idea Not Found</h1>
        <p className="text-gray-600 mb-6">This idea doesn't exist or has been removed.</p>
        <Link href="/leaderboard">
          <a className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
            Back to Leaderboard
          </a>
        </Link>
      </div>
    );
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'movie': return '🎬';
      case 'game': return '🎮';
      case 'business': return '💼';
      default: return '💡';
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'INVEST': return 'bg-green-100 text-green-800 border-green-200';
      case 'MAYBE': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  return (
    <>
      <Head>
        <title>{idea.title} | MakeMeFamous</title>
        <meta name="description" content={idea.content.substring(0, 160)} />
      </Head>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-500">
          <Link href="/"><a className="hover:text-blue-600">Home</a></Link>
          <span className="mx-2">›</span>
          <Link href="/leaderboard"><a className="hover:text-blue-600">Leaderboard</a></Link>
          <span className="mx-2">›</span>
          <span className="text-gray-900">{idea.title}</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="flex items-start gap-4 mb-6">
                <div className="text-4xl">{getTypeIcon(idea.type)}</div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{idea.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <img 
                        src={idea.userPhotoURL || '/default-avatar.png'} 
                        alt={idea.username}
                        className="w-6 h-6 rounded-full"
                      />
                      <span>by {idea.username}</span>
                    </div>
                    <span>•</span>
                    <span>{idea.createdAt.toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{idea.wordCount} words</span>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusStyle(idea.aiScores.investmentStatus)}`}>
                  {idea.aiScores.investmentStatus}
                </div>
              </div>

              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{idea.content}</p>
              </div>
            </div>

            {/* AI Scores Breakdown */}
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">VC Analysis Breakdown</h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <ScoreCard 
                  label="Market Score" 
                  score={idea.aiScores.market} 
                  description="Market viability and TAM"
                />
                <ScoreCard 
                  label="Innovation Score" 
                  score={idea.aiScores.innovation} 
                  description="Uniqueness and differentiation"
                />
                <ScoreCard 
                  label="Execution Score" 
                  score={idea.aiScores.execution} 
                  description="Technical feasibility"
                />
                <ScoreCard 
                  label="Overall Score" 
                  score={idea.aiScores.overall} 
                  description="Weighted average"
                  isOverall={true}
                />
              </div>

              <div className="space-y-6">
                <FeedbackSection 
                  title="Market Analysis"
                  score={idea.aiScores.market}
                  feedback={idea.aiScores.marketFeedback}
                />
                <FeedbackSection 
                  title="Innovation Assessment"
                  score={idea.aiScores.innovation}
                  feedback={idea.aiScores.innovationFeedback}
                />
                <FeedbackSection 
                  title="Execution Evaluation"
                  score={idea.aiScores.execution}
                  feedback={idea.aiScores.executionFeedback}
                />
              </div>

              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-3">Final Verdict</h3>
                <p className="text-gray-800 leading-relaxed">{idea.aiScores.verdict}</p>
              </div>
            </div>

            {/* Public Voting Section */}
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Community Rating</h2>
                {user && !hasVoted && (
                  <button
                    onClick={() => setShowVotePanel(!showVotePanel)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    {showVotePanel ? 'Cancel Vote' : 'Rate This Idea'}
                  </button>
                )}
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">
                    {idea.publicScore?.average?.toFixed(2) || idea.aiScores.overall.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">Average Score</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">
                    {idea.publicScore?.count || 0}
                  </div>
                  <div className="text-sm text-gray-600">Total Votes</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">
                    {votes.length > 0 ? (Math.max(...votes.map(v => v.score))).toFixed(2) : '0.00'}
                  </div>
                  <div className="text-sm text-gray-600">Highest Vote</div>
                </div>
              </div>

              {showVotePanel && (
                <div className="border-2 border-blue-200 rounded-lg p-6 mb-6 bg-blue-50">
                  <h3 className="font-bold mb-4">Rate This Idea</h3>
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
                      className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0.01 (Terrible)</span>
                      <span>5.00 (Average)</span>
                      <span>10.00 (Perfect)</span>
                    </div>
                  </div>
                  <button
                    onClick={handleVote}
                    disabled={submittingVote}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {submittingVote ? 'Submitting...' : 'Submit Vote'}
                  </button>
                </div>
              )}

              {hasVoted && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 text-green-800">
                    <span>✓</span>
                    <span className="font-medium">You've already voted on this idea</span>
                  </div>
                </div>
              )}

              {votes.length > 0 && (
                <div>
                  <h3 className="font-bold mb-4">Vote Distribution</h3>
                  <VoteHistogram votes={votes} />
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type</span>
                  <span className="font-medium capitalize">{idea.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">AI Rating</span>
                  <span className="font-medium">{idea.aiScores.overall.toFixed(2)}/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Public Rating</span>
                  <span className="font-medium">
                    {idea.publicScore?.average?.toFixed(2) || 'N/A'}/10
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Word Count</span>
                  <span className="font-medium">{idea.wordCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Votes</span>
                  <span className="font-medium">{idea.publicScore?.count || 0}</span>
                </div>
              </div>
            </div>

            {/* Related Ideas CTA */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
              <h3 className="font-bold text-gray-900 mb-2">Explore More Ideas</h3>
              <p className="text-sm text-gray-600 mb-4">
                Check out other {idea.type} ideas on the leaderboard
              </p>
              <Link href={`/leaderboard?type=${idea.type}`}>
                <a className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition font-medium">
                  View {idea.type.charAt(0).toUpperCase() + idea.type.slice(1)} Ideas
                </a>
              </Link>
            </div>

            {/* Submit Your Own */}
            {user && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
                <h3 className="font-bold text-gray-900 mb-2">Have Your Own Idea?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Get VC-style feedback and join the leaderboard
                </p>
                <Link href="/submit">
                  <a className="block w-full text-center bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition font-medium">
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
const ScoreCard = ({ 
  label, 
  score, 
  description, 
  isOverall = false 
}: { 
  label: string; 
  score: number; 
  description: string; 
  isOverall?: boolean; 
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 8.0) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 6.0) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 4.0) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className={`p-4 rounded-lg border-2 ${getScoreColor(score)} ${isOverall ? 'ring-2 ring-offset-2 ring-blue-400' : ''}`}>
      <div className="text-3xl font-bold mb-1">{score.toFixed(2)}</div>
      <div className="text-sm font-medium mb-1">{label}</div>
      <div className="text-xs opacity-75">{description}</div>
    </div>
  );
};

const FeedbackSection = ({ 
  title, 
  score, 
  feedback 
}: { 
  title: string; 
  score: number; 
  feedback: string; 
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 8.0) return 'text-green-600';
    if (score >= 6.0) return 'text-blue-600';
    if (score >= 4.0) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="border-l-4 border-gray-200 pl-4">
      <div className="flex items-center gap-2 mb-2">
        <h4 className="font-medium text-gray-900">{title}</h4>
        <span className={`font-bold ${getScoreColor(score)}`}>
          {score.toFixed(2)}/10
        </span>
      </div>
      <p className="text-gray-700 text-sm leading-relaxed">{feedback}</p>
    </div>
  );
};

const VoteHistogram = ({ votes }: { votes: Vote[] }) => {
  // Create histogram data (0-1, 1-2, 2-3, etc.)
  const bins = Array.from({ length: 10 }, (_, i) => {
    const min = i;
    const max = i + 1;
    const count = votes.filter(vote => vote.score >= min && vote.score < max).length;
    return {
      range: `${min}.0-${max}.0`,
      count: count,
      percentage: votes.length > 0 ? (count / votes.length) * 100 : 0
    };
  });

  // Handle the 10.0 score separately
  const perfectScores = votes.filter(vote => vote.score === 10).length;
  if (perfectScores > 0) {
    bins[9].count += perfectScores;
    bins[9].percentage = votes.length > 0 ? (bins[9].count / votes.length) * 100 : 0;
  }

  const maxCount = Math.max(...bins.map(bin => bin.count));

  return (
    <div className="space-y-2">
      {bins.map((bin, index) => (
        <div key={index} className="flex items-center gap-3">
          <div className="w-12 text-xs text-gray-600">{bin.range}</div>
          <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
            <div 
              className="bg-blue-500 h-6 rounded-full flex items-center justify-end pr-2"
              style={{ width: `${maxCount > 0 ? (bin.count / maxCount) * 100 : 0}%` }}
            >
              {bin.count > 0 && (
                <span className="text-xs text-white font-medium">{bin.count}</span>
              )}
            </div>
          </div>
          <div className="w-12 text-xs text-gray-600 text-right">
            {bin.percentage.toFixed(0)}%
          </div>
        </div>
      ))}
    </div>
  );
};
