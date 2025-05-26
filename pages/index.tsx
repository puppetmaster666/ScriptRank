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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchScripts = async () => {
      setIsLoading(true);
      const snapshot = await getDocs(collection(db, "scripts"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Script[];

      const sorted = data.sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0));
      setScripts(sorted.slice(0, 10));
      setIsLoading(false);
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
    if (score === undefined || score === null) return "bg-gray-100 text-gray-800";
    if (score >= 8) return "bg-green-100 text-green-800";
    if (score >= 6.5) return "bg-yellow-100 text-yellow-800";
    if (score >= 5) return "bg-orange-100 text-orange-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <>
      <Head>
        <title>ScriptRank – AI Feedback for Screenwriters</title>
        <meta name="description" content="Get AI-powered script analysis and ratings for your screenplay" />
      </Head>

      {/* Hero Section */}
      <section className="text-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-24 px-4 rounded-xl shadow-lg mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
          Elevate Your Screenwriting
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
          AI-powered script analysis with actionable feedback to help you refine your craft
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/upload"
            className="inline-block bg-white text-blue-600 px-6 py-3 md:px-8 md:py-4 rounded-lg font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-md"
          >
            Upload Your Script
          </Link>
          <Link
            href="/leaderboard"
            className="inline-block border-2 border-white text-white px-6 py-3 md:px-8 md:py-4 rounded-lg font-bold hover:bg-white hover:bg-opacity-10 transition-all duration-300"
          >
            Browse Top Scripts
          </Link>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Leaderboard Preview */}
        <section className="bg-white p-6 md:p-8 rounded-xl shadow-lg mb-16 border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">Top Rated Scripts</h2>
            <div className="flex gap-2">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">AI Scores</span>
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">Community Ratings</span>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-200">
                    <th className="pb-4 font-medium text-gray-500">Rank</th>
                    <th className="pb-4 font-medium text-gray-500">Title</th>
                    <th className="pb-4 font-medium text-gray-500">Genre</th>
                    <th className="pb-4 font-medium text-gray-500 text-center">AI</th>
                    <th className="pb-4 font-medium text-gray-500 text-center">Public</th>
                    <th className="pb-4 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {scripts.map((s, i) => {
                    const avgPublic = averagePublicScore(s.votes);
                    return (
                      <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 font-bold text-gray-700 w-10">{getMedal(i)}</td>
                        <td className="py-4 font-medium">{s.title}</td>
                        <td className="py-4">
                          <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs">
                            {s.genre}
                          </span>
                        </td>
                        <td className="py-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(s.aiScore)}`}>
                            {s.aiScore?.toFixed(2) ?? "N/A"}
                          </span>
                        </td>
                        <td className="py-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(avgPublic)}`}>
                            {avgPublic?.toFixed(2) ?? "N/A"}
                          </span>
                        </td>
                        <td className="py-4">
                          <Link
                            href={`/scripts/${s.id}`}
                            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="text-center mt-6">
            <Link
              href="/leaderboard"
              className="inline-block border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              View Full Leaderboard →
            </Link>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-12 md:py-16">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Professional script feedback in minutes, not weeks
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                emoji: "📤",
                title: "Upload Your Script",
                desc: "Simply paste your script or upload a file. We support all major formats."
              },
              {
                emoji: "✨", 
                title: "Instant AI Analysis",
                desc: "Get detailed ratings on plot, dialogue, structure and commercial potential"
              },
              {
                emoji: "📊",
                title: "Actionable Insights",
                desc: "Receive specific suggestions to improve your screenplay's marketability"
              }
            ].map((item, i) => (
              <div 
                key={i} 
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
              >
                <div className="text-4xl mb-4">{item.emoji}</div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-12 md:py-16 bg-gray-50 rounded-xl mb-16">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">What Writers Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {[
                {
                  quote: "The AI feedback helped me identify weak points I'd missed through multiple drafts.",
                  author: "Sarah J., Screenwriter"
                },
                {
                  quote: "Finally, affordable script analysis that doesn't take weeks to get back!",
                  author: "Michael T., Filmmaker"
                }
              ].map((testimonial, i) => (
                <div 
                  key={i} 
                  className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="text-yellow-400 text-2xl mb-2">★★★★★</div>
                  <p className="text-gray-700 italic mb-4">"{testimonial.quote}"</p>
                  <p className="text-gray-500 font-medium">— {testimonial.author}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Floating CTA */}
      <div className="fixed bottom-6 right-6 z-50">
        <Link
          href="/upload"
          className="bg-blue-600 text-white px-4 py-3 md:px-6 md:py-3 rounded-full shadow-xl flex items-center hover:bg-blue-700 transition-all hover:scale-105"
        >
          <span className="mr-2">📝</span>
          <span className="font-bold hidden sm:inline">Upload Script</span>
        </Link>
      </div>
    </>
  );
}