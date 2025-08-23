import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { submitIdea, canUserSubmitIdea } from "@/lib/firebase-collections";

type IdeaType = 'movie' | 'game' | 'business';

export default function SubmitPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [selectedType, setSelectedType] = useState<IdeaType>('movie');
  const [submissionsRemaining, setSubmissionsRemaining] = useState<number>(0);
  const [userTier, setUserTier] = useState<'free' | 'starter' | 'unlimited'>('free');
  
  // Form fields
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");
  const [aiFeedback, setAiFeedback] = useState<any>(null);

  // Check subscription status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const canSubmit = await canUserSubmitIdea(currentUser.uid);
          setSubmissionsRemaining(canSubmit.remaining || 0);
          
          // Get user tier from local storage or Firebase
          const profile = JSON.parse(localStorage.getItem(`profile_user_${currentUser.uid}`) || '{}');
          setUserTier(profile.subscription?.tier || 'free');
        } catch (error) {
          console.error('Error checking submission status:', error);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async () => {
    if (!user) {
      setError("You must be logged in to submit an idea.");
      return;
    }

    // Validation based on idea type
    if (!title.trim() || !genre.trim() || !description.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    // Word count validation
    const wordCount = description.trim().split(/\s+/).length;
    if (wordCount < 30) {
      setError("Description must be at least 30 words.");
      return;
    }
    if (wordCount > 500) {
      setError("Description must be 500 words or less.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Get AI rating with new multi-score system
      const aiRes = await fetch("/api/rate-idea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          type: selectedType,
          title: title,
          content: description
        }),
      });

      if (!aiRes.ok) {
        const errorData = await aiRes.json();
        throw new Error(errorData.error || "AI analysis failed");
      }

      const aiData = await aiRes.json();
      console.log("AI response:", aiData);

      if (!aiData.success || !aiData.aiScores) {
        throw new Error("Invalid AI response format");
      }

      // Submit to Firebase using new collections system
      const result = await submitIdea({
        userId: user.uid,
        username: user.displayName || user.email || "Anonymous",
        userPhotoURL: user.photoURL,
        type: selectedType,
        title: title,
        content: description,
        aiScores: aiData.aiScores
      });

      if (result.success) {
        setAiFeedback(aiData);
        setSubmissionsRemaining(result.submissionsRemaining || 0);
        setSuccess(true);
      }

    } catch (err: any) {
      console.error("Submission failed:", err);
      setError(err.message || "Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Success screen
  if (success && aiFeedback) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">
              {aiFeedback.aiScores.investmentStatus === 'INVEST' ? '🎉' : 
               aiFeedback.aiScores.investmentStatus === 'MAYBE' ? '🤔' : '💔'}
            </div>
            <h1 className="text-3xl font-bold mb-2">
              {aiFeedback.aiScores.investmentStatus === 'INVEST' ? 'Investment Ready!' : 
               aiFeedback.aiScores.investmentStatus === 'MAYBE' ? 'Promising, But...' : 'Hard Pass'}
            </h1>
            <p className="text-gray-600">Your idea has been analyzed by our VC AI</p>
          </div>

          {/* Score Breakdown */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <ScoreCard 
              label="Market" 
              score={aiFeedback.aiScores.market} 
              feedback={aiFeedback.aiScores.marketFeedback}
            />
            <ScoreCard 
              label="Innovation" 
              score={aiFeedback.aiScores.innovation} 
              feedback={aiFeedback.aiScores.innovationFeedback}
            />
            <ScoreCard 
              label="Execution" 
              score={aiFeedback.aiScores.execution} 
              feedback={aiFeedback.aiScores.executionFeedback}
            />
            <ScoreCard 
              label="Overall" 
              score={aiFeedback.aiScores.overall} 
              feedback="Weighted average"
              isOverall={true}
            />
          </div>

          {/* Verdict */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-bold mb-3 text-gray-900">VC Verdict:</h3>
            <p className="text-gray-800 leading-relaxed">{aiFeedback.aiScores.verdict}</p>
          </div>

          {/* Submission Status */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-blue-900">Submissions Remaining: {submissionsRemaining}</p>
                <p className="text-sm text-blue-700">Current Plan: {userTier.toUpperCase()}</p>
              </div>
              {submissionsRemaining === 0 && (
                <button 
                  onClick={() => router.push('/pricing')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Upgrade Plan
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => router.push("/leaderboard")}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition font-medium"
            >
              View Leaderboard
            </button>
            <button
              onClick={() => {
                setSuccess(false);
                setTitle("");
                setGenre("");
                setDescription("");
                setAiFeedback(null);
              }}
              className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Submit Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Form screen
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Submit Your Idea</h1>
        <p className="text-gray-600">Get brutally honest VC-style feedback in seconds</p>
        
        {/* Submission Status */}
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-blue-900">Submissions Remaining: {submissionsRemaining}</p>
              <p className="text-sm text-blue-700">Plan: {userTier.toUpperCase()}</p>
            </div>
            {submissionsRemaining === 0 && (
              <button 
                onClick={() => router.push('/pricing')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
              >
                Upgrade
              </button>
            )}
          </div>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {submissionsRemaining === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">😴</div>
          <h2 className="text-2xl font-bold mb-2">No Submissions Left</h2>
          <p className="text-gray-600 mb-6">Upgrade your plan to continue getting feedback</p>
          <button 
            onClick={() => router.push('/pricing')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition"
          >
            View Plans
          </button>
        </div>
      ) : (
        <>
          {/* Idea Type Selection */}
          <div className="mb-6">
            <label className="block mb-3 font-medium text-gray-900">Idea Type</label>
            <div className="grid grid-cols-3 gap-2">
              {(['movie', 'game', 'business'] as IdeaType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`p-4 rounded-lg border-2 transition ${
                    selectedType === type
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-2xl mb-2">
                    {type === 'movie' ? '🎬' : type === 'game' ? '🎮' : '💼'}
                  </div>
                  <div className="font-medium capitalize">{type}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="mb-4">
            <label className="block mb-2 font-medium text-gray-900">Title*</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              placeholder={`Your ${selectedType} title...`}
              maxLength={100}
            />
          </div>

          {/* Genre */}
          <div className="mb-4">
            <label className="block mb-2 font-medium text-gray-900">Genre/Category*</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              disabled={loading}
              placeholder="e.g. Sci-Fi Thriller, RPG, SaaS"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block mb-2 font-medium text-gray-900">
              Description* (30-500 words)
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg h-48 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              placeholder={
                selectedType === 'movie' ? "Describe your movie plot and characters..." :
                selectedType === 'game' ? "Explain your game concept, mechanics, and goals..." :
                "Describe your business idea, target market, and value proposition..."
              }
            />
            <div className="mt-2 text-sm text-gray-500">
              Word count: {description.trim().split(/\s+/).filter(w => w.length > 0).length}/500
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading || submissionsRemaining === 0}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing with AI...
              </span>
            ) : (
              "Get VC Feedback"
            )}
          </button>
        </>
      )}
    </div>
  );
}

// Score Card Component
const ScoreCard = ({ 
  label, 
  score, 
  feedback, 
  isOverall = false 
}: { 
  label: string; 
  score: number; 
  feedback: string; 
  isOverall?: boolean; 
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 8.0) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 6.0) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 4.0) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className={`p-4 rounded-lg border-2 ${getScoreColor(score)} ${isOverall ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}>
      <div className="text-center mb-2">
        <div className="text-2xl font-bold">{score.toFixed(2)}</div>
        <div className="text-sm font-medium">{label}</div>
      </div>
      <p className="text-xs leading-tight">{feedback}</p>
    </div>
  );
};
