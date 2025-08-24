// pages/archive/[month].tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { getMonthArchive } from '@/lib/archive-system';

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
}

interface MonthlyArchive {
  month: string;
  displayMonth: string;
  topIdeas: ArchivedIdea[];
  totalIdeas: number;
  stats: {
    averageScore: number;
    topScore: number;
    totalVotes: number;
  };
}

export default function ArchivePage() {
  const router = useRouter();
  const { month } = router.query;
  const [archive, setArchive] = useState<MonthlyArchive | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'movie' | 'game' | 'business'>('all');

  useEffect(() => {
    if (!month || typeof month !== 'string') return;

    const loadArchive = async () => {
      try {
        const data = await getMonthArchive(month);
        setArchive(data);
      } catch (error) {
        console.error('Error loading archive:', error);
      } finally {
        setLoading(false);
      }
    };

    loadArchive();
  }, [month]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!archive) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <div className="text-6xl mb-4">📁</div>
        <h1 className="text-2xl font-bold mb-2">Archive Not Found</h1>
        <p className="text-gray-600 mb-6">This month hasn't been archived yet.</p>
        <Link href="/leaderboard">
          <a className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
            Back to Current Leaderboard
          </a>
        </Link>
      </div>
    );
  }

  const filteredIdeas = filter === 'all' 
    ? archive.topIdeas 
    : archive.topIdeas.filter(idea => idea.type === filter);

  return (
    <>
      <Head>
        <title>{archive.displayMonth} Archive | ScriptRank</title>
        <meta name="description" content={`View the ${archive.displayMonth} leaderboard archive`} />
      </Head>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link href="/"><a className="hover:text-blue-600">Home</a></Link>
            <span>›</span>
            <Link href="/leaderboard"><a className="hover:text-blue-600">Current Leaderboard</a></Link>
            <span>›</span>
            <span className="text-gray-900">Archive</span>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {archive.displayMonth} Leaderboard Archive
          </h1>
          <p className="text-gray-600">
            Final rankings from {archive.displayMonth} • {archive.totalIdeas} total submissions
          </p>
        </div>

        {/* Stats Bar */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border border-blue-100">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">
                {archive.stats.topScore.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Top Score</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">
                {archive.stats.averageScore.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Average Score</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">
                {archive.stats.totalVotes}
              </div>
              <div className="text-sm text-gray-600">Total Votes</div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <div className="flex gap-2">
            {(['all', 'movie', 'game', 'business'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === type 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type === 'all' ? 'All Ideas' : 
                 type === 'movie' ? '🎬 Movies' :
                 type === 'game' ? '🎮 Games' : '💼 Business'}
              </button>
            ))}
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Idea</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Creator</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">AI Score</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Public Score</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Votes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredIdeas.map((idea) => (
                <tr key={idea.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                      ${idea.rank === 1 ? 'bg-yellow-400 text-gray-900' : 
                        idea.rank === 2 ? 'bg-gray-300 text-gray-900' : 
                        idea.rank === 3 ? 'bg-amber-600 text-white' : 
                        'bg-gray-100 text-gray-700'}
                    `}>
                      {idea.rank}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-gray-900 font-medium">
                        {idea.title}
                      </div>
                      <div className="text-sm text-gray-500 capitalize">
                        {idea.type === 'movie' ? '🎬' : 
                         idea.type === 'game' ? '🎮' : '💼'} {idea.type}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {idea.userPhotoURL && (
                        <img 
                          src={idea.userPhotoURL} 
                          alt={idea.username}
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                      <span className="text-sm text-gray-900">{idea.username}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-medium
                      ${idea.aiScores.overall >= 8 ? 'bg-green-100 text-green-800' :
                        idea.aiScores.overall >= 6 ? 'bg-blue-100 text-blue-800' :
                        idea.aiScores.overall >= 4 ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'}
                    `}>
                      {idea.aiScores.overall.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-900">
                      {idea.publicScore.average.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-600">
                      {idea.publicScore.count}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Trophy Section for Winners */}
        {archive.topIdeas.length >= 3 && (
          <div className="mt-12 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-8 border border-yellow-200">
            <h2 className="text-2xl font-bold text-center mb-8">{archive.displayMonth} Winners</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {archive.topIdeas.slice(0, 3).map((winner, index) => (
                <div key={winner.id} className="text-center">
                  <div className="text-6xl mb-4">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-1">
                    {winner.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    by {winner.username}
                  </p>
                  <div className="text-2xl font-bold text-amber-600">
                    {winner.aiScores.overall.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
