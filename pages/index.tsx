import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

type Script = {
  id: string;
  title: string;
  genre: string;
  aiScore?: number;
  votes?: { userId: string; score: number }[];
};

export default function HomePage() {
  const [scripts, setScripts] = useState<Script[]>([]);

  useEffect(() => {
    const fetchScripts = async () => {
      const snapshot = await getDocs(collection(db, "scripts"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Script[];

      const sorted = data.sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0));
      setScripts(sorted.slice(0, 10));
    };

    fetchScripts();
  }, []);

  const getMedal = (index: number) =>
    index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1;

  const averagePublicScore = (votes?: { score: number }[]) => {
    if (!votes || votes.length === 0) return null;
    const avg = votes.reduce((sum, v) => sum + v.score, 0) / votes.length;
    return avg;
  };

  const getScoreColor = (score?: number | null) => {
    if (score === undefined || score === null) return "bg-gray-400";
    if (score >= 8) return "bg-green-500";
    if (score >= 6.5) return "bg-yellow-400";
    if (score >= 5) return "bg-orange-400";
    return "bg-red-500";
  };

  return (
    <>
      <Head>
        <title>ScriptRank – AI Feedback for Screenwriters</title>
      </Head>

      <main className="max-w-6xl mx-auto p-6">
        {/* Hero Section */}
        <section className="text-center bg-blue-600 text-white py-20">
          <h1 className="text-4xl font-bold mb-2">🎬 Welcome to ScriptRank</h1>
          <p className="text-lg mb-4">Get AI-powered feedback and ratings for your screenplay</p>
          <Link
            href="/upload"
            className="inline-block bg-white text-blue-600 px-6 py-3 rounded font-semibold hover:bg-gray-100 transition"
          >
            Upload Your Script
          </Link>
        </section>

        {/* Leaderboard Preview */}
        <section className="bg-white p-6 rounded shadow mt-10 mb-16">
          <h2 className="text-2xl font-bold mb-4">Top Rated Scripts</h2>
          <table className="w-full table-auto border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Genre</th>
                <th className="px-4 py-2">AI Score</th>
                <th className="px-4 py-2">Public Score</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {scripts.map((s, i) => {
                const avgPublic = averagePublicScore(s.votes);
                return (
                  <tr key={s.id} className="border-t">
                    <td className="px-4 py-2 font-bold">{getMedal(i)}</td>
                    <td className="px-4 py-2">{s.title}</td>
                    <td className="px-4 py-2">{s.genre}</td>
                    <td className="px-4 py-2">
                      <span className={`text-white px-2 py-1 rounded-full text-xs font-semibold ${getScoreColor(s.aiScore)}`}>
                        {s.aiScore?.toFixed(2) ?? "N/A"}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span className={`text-white px-2 py-1 rounded-full text-xs font-semibold ${getScoreColor(avgPublic)}`}>
                        {avgPublic?.toFixed(2) ?? "N/A"}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <Link
                        href="/leaderboard"
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="text-center mt-4">
            <Link
              href="/leaderboard"
              className="inline-block mt-4 border border-blue-600 text-blue-600 px-6 py-2 rounded hover:bg-blue-50 transition"
            >
              View Full Leaderboard
            </Link>
          </div>
        </section>

        {/* How It Works */}
        <section className="text-center">
          <h2 className="text-2xl font-bold mb-6">How It Works</h2>
          <p className="text-gray-600 mb-10">
            Get professional-quality feedback on your script in three simple steps
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded shadow">
              <div className="text-4xl mb-3">📤</div>
              <h3 className="font-bold text-lg mb-1">1. Upload</h3>
              <p className="text-gray-600">
                Upload your script title, synopsis, or full content. No PDF needed.
              </p>
            </div>

            <div className="bg-white p-6 rounded shadow">
              <div className="text-4xl mb-3">🤖</div>
              <h3 className="font-bold text-lg mb-1">2. AI Analysis</h3>
              <p className="text-gray-600">
                Our AI model rates your script on a 10-point scale and gives comments.
              </p>
            </div>

            <div className="bg-white p-6 rounded shadow">
              <div className="text-4xl mb-3">🌍</div>
              <h3 className="font-bold text-lg mb-1">3. Get Feedback</h3>
              <p className="text-gray-600">
                Share your script, gather public votes, and rise on the leaderboard.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
