import { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";
import { Trophy, LogIn } from "lucide-react";

export default function Home() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [votes, setVotes] = useState({});

  useEffect(() => {
    const fetchIdeas = async () => {
      const q = query(collection(db, "ideas"), orderBy("aiScore", "desc"), limit(10));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setIdeas(data);
      setLoading(false);
    };
    fetchIdeas();
  }, []);

  const handleVoteChange = (id, value) => {
    setVotes((prev) => ({ ...prev, [id]: value }));
  };

  const handleVoteSubmit = (id) => {
    console.log("Submit vote:", id, votes[id]);
    // Firestore update logic goes here
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">ScriptRank</h1>
          <nav className="space-x-4">
            <Link href="/submit" className="hover:underline">Submit</Link>
            <Link href="/login" className="hover:underline">Login</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold mb-4"
        >
          Rank Your Screenplays with AI & The Crowd
        </motion.h2>
        <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto">
          Get instant AI feedback, share your ideas, and climb the leaderboard with votes from the community.
        </p>
        <Button asChild size="lg" className="bg-white text-blue-600 font-semibold">
          <Link href="/submit">Get Started</Link>
        </Button>
      </section>

      {/* Leaderboard */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <h3 className="text-3xl font-bold text-center mb-10">🏆 Top 10 Scripts</h3>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="space-y-6">
            {ideas.map((idea, index) => (
              <div
                key={idea.id}
                className="bg-white p-6 rounded-2xl shadow-md border border-gray-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {index < 3 ? (
                      <div
                        className={`w-8 h-8 flex items-center justify-center rounded-full text-white font-bold ${
                          index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : "bg-amber-700"
                        }`}
                      >
                        {index + 1}
                      </div>
                    ) : (
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 font-bold">
                        {index + 1}
                      </div>
                    )}
                    <Link href={`/profile/${idea.userId}`} className="font-semibold hover:underline">
                      {idea.username || "Anonymous"}
                    </Link>
                  </div>
                  <span
                    className={`font-bold text-lg ${
                      idea.aiScore >= 8
                        ? "text-green-600"
                        : idea.aiScore >= 6
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {idea.aiScore.toFixed(2)}
                  </span>
                </div>
                <h4 className="text-xl font-bold mb-2">{idea.title}</h4>
                <p className="text-gray-700 mb-2 line-clamp-2">{idea.synopsis || "No synopsis provided."}</p>
                <details className="mb-4">
                  <summary className="cursor-pointer font-semibold">Assessment</summary>
                  <p className="mt-2 text-gray-600">{idea.aiComment || "No comment available."}</p>
                </details>

                {/* Voting */}
                <div className="flex items-center space-x-4">
                  <Slider
                    defaultValue={[5]}
                    min={0.01}
                    max={10}
                    step={0.01}
                    value={[votes[idea.id] || 5]}
                    onValueChange={(val) => handleVoteChange(idea.id, val[0])}
                    className="w-40"
                  />
                  <Button
                    onClick={() => handleVoteSubmit(idea.id)}
                    className="bg-blue-600 text-white"
                  >
                    Vote {votes[idea.id] ? votes[idea.id].toFixed(2) : ""}
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-2">Votes: {idea.voteCount || 0}</p>
              </div>
            ))}
          </div>
        )}
        <div className="text-center mt-10">
          <Button asChild size="lg" className="bg-blue-600 text-white">
            <Link href="/leaderboard">View Full Leaderboard</Link>
          </Button>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-100 py-16 px-4">
        <h3 className="text-3xl font-bold text-center mb-10">How It Works</h3>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: "1",
              title: "Upload Your Script",
              text: "Submit your screenplay or idea to get instant AI scoring.",
            },
            {
              step: "2",
              title: "Get AI Feedback",
              text: "Receive a professional-style assessment with strengths and weaknesses.",
            },
            {
              step: "3",
              title: "Climb the Leaderboard",
              text: "Share your script, gather votes, and rise in the rankings.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 text-center"
            >
              <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-full bg-blue-600 text-white font-bold mb-4">
                {item.step}
              </div>
              <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
              <p className="text-gray-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p>&copy; {new Date().getFullYear()} ScriptRank. All rights reserved.</p>
          <div className="space-x-4">
            <Link href="/about" className="hover:underline">About</Link>
            <Link href="/privacy" className="hover:underline">Privacy</Link>
            <Link href="/terms" className="hover:underline">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
