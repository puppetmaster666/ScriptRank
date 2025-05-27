import Head from 'next/head';
import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, getDocs, query, where, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import Link from 'next/link';

type Script = {
  id: string;
  title: string;
  genre: string;
  synopsis: string;
  aiScore?: number;
  votes?: { userId: string; score: number }[];
  publicScore?: number;
  critiques?: string[];
};

export default function LeaderboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [scripts, setScripts] = useState<Script[]>([]);
  const [selectedScript, setSelectedScript] = useState<Script | null>(null);
  const [voteValue, setVoteValue] = useState(5.00);
  const [critiqueText, setCritiqueText] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchScripts = async () => {
      const q = query(collection(db, 'scripts'), where('aiScore', '!=', null));
      const snapshot = await getDocs(q);
      const results = snapshot.docs.map(doc => {
        const data = doc.data() as Script;
        const publicScore = data.votes?.length 
          ? data.votes.reduce((sum, vote) => sum + vote.score, 0) / data.votes.length
          : 0;
        return { 
          id: doc.id, 
          ...data,
          publicScore
        };
      }) as Script[];
      setScripts(results);
    };
    fetchScripts();
  }, []);

  const handleVote = async (scriptId: string) => {
    if (!user) return alert('Please sign in to vote');
    
    try {
      const scriptRef = doc(db, 'scripts', scriptId);
      await updateDoc(scriptRef, {
        votes: arrayUnion({
          userId: user.uid,
          score: voteValue
        })
      });
      alert('Vote submitted successfully!');
    } catch (error) {
      console.error('Error submitting vote:', error);
      alert('Failed to submit vote');
    }
  };

  const getScoreColor = (score: number | undefined) => {
    if (!score) return 'bg-gray-100';
    if (score >= 6.5) return 'bg-green-200';
    if (score >= 4.0) return 'bg-amber-200';
    return 'bg-red-200';
  };

  const topScore = scripts.reduce((max, s) => Math.max(max, s.aiScore || 0), 0);
  const mostVotes = Math.max(...scripts.map(s => s.votes?.length || 0), 0);
  const totalScripts = scripts.length;
  const genres = ['All', ...new Set(scripts.map(s => s.genre))];

  const filteredScripts = selectedGenre === 'All' 
    ? scripts 
    : scripts.filter(s => s.genre === selectedGenre);

  return (
    <>
      <Head>
        <title>Script Leaderboard | scriptrank</title>
      </Head>
      <main className="flex flex-col lg:flex-row max-w-7xl mx-auto px-6 py-12 gap-12">
        {/* Leaderboard Table */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Script Leaderboard</h1>
            <select 
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="px-4 py-2 rounded-lg bg-gray-900 text-white shadow-sm"
            >
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-800 text-white text-sm uppercase">
                <tr>
                  <th className="px-6 py-3">#</th>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Genre</th>
                  <th className="px-6 py-3">AI Score</th>
                  <th className="px-6 py-3">Public Score</th>
                  <th className="px-6 py-3">Votes</th>
                  <th className="px-6 py-3">Vote</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredScripts
                  .sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0))
                  .map((s, i) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-bold">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                        i === 0 ? 'bg-yellow-500' :
                        i === 1 ? 'bg-gray-400' :
                        i === 2 ? 'bg-amber-700 text-white' :
                        'bg-gray-100'
                      }`}>
                        {i + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/scripts/${s.id}`} className="font-bold text-gray-900 hover:text-blue-600">
                        {s.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-gray-900 text-white text-xs font-medium rounded-full">
                        {s.genre}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`${getScoreColor(s.aiScore)} px-3 py-1 rounded font-bold text-gray-900`}>
                        {s.aiScore?.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`${getScoreColor(s.publicScore)} px-3 py-1 rounded font-bold text-gray-900`}>
                        {s.publicScore?.toFixed(2) || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">{s.votes?.length || 0}</td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => setSelectedScript(s)}
                        className="text-sm bg-gray-900 hover:bg-gray-700 text-white px-3 py-1 rounded transition-colors"
                      >
                        Rate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-80 space-y-6">
          {/* Stats Card */}
          <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Leaderboard Stats</h2>
            <ul className="space-y-4 text-sm text-gray-700">
              <li className="flex justify-between items-center">
                <span>Total Scripts</span>
                <span className="font-bold">{totalScripts}</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Top AI Score</span>
                <span className="font-bold">{topScore.toFixed(2)}</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Most Votes</span>
                <span className="font-bold">{mostVotes}</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Unique Genres</span>
                <span className="font-bold">{genres.length - 1}</span>
              </li>
            </ul>
          </div>

          {/* Voting Card */}
          {selectedScript && (
            <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Rate {selectedScript.title}</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Score (0.01-10.00)</label>
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
                  <span>0.01</span>
                  <span className="font-bold">{voteValue.toFixed(2)}</span>
                  <span>10.00</span>
                </div>
              </div>
              <button
                onClick={() => handleVote(selectedScript.id)}
                className="w-full bg-gray-900 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Submit Vote
              </button>
            </div>
          )}
        </aside>
      </main>
    </>
  );
}