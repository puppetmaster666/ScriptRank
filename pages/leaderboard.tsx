// pages/leaderboard.tsx
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';

type Script = {
  id: string;
  title: string;
  genre: string;
  aiScore: number;
  aiComment?: string;
  userId: string;
  createdAt: string;
};

export default function Leaderboard() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load and sort scripts
    const loadScripts = () => {
      const storedScripts = JSON.parse(localStorage.getItem('scripts') || '[]');
      const validScripts = storedScripts.filter((s: any) => s.aiScore !== undefined);
      const sorted = [...validScripts].sort((a, b) => b.aiScore - a.aiScore);
      setScripts(sorted);
      setLoading(false);
    };

    loadScripts();
    window.addEventListener('storage', loadScripts);
    return () => window.removeEventListener('storage', loadScripts);
  }, []);

  if (loading) return <div className="p-6">Loading leaderboard...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Head>
        <title>Leaderboard | ScriptRank</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Top Scripts</h1>
      
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Rank</th>
              <th className="p-4 text-left">Title</th>
              <th className="p-4 text-left">Genre</th>
              <th className="p-4 text-left">AI Score</th>
              <th className="p-4 text-left">Details</th>
            </tr>
          </thead>
          <tbody>
            {scripts.length > 0 ? (
              scripts.map((script, index) => (
                <tr key={script.id} className="border-t hover:bg-gray-50">
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4 font-medium">{script.title}</td>
                  <td className="p-4 capitalize">{script.genre}</td>
                  <td className="p-4">
                    <span className="font-bold text-blue-600">
                      {script.aiScore.toFixed(2)}
                    </span>
                  </td>
                  <td className="p-4">
                    <Link 
                      href={`/scripts/${script.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No scripts have been rated yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}