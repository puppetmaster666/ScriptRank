import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { auth, db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

type IdeaType = 'movie' | 'game' | 'business';

export default function SubmitPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [selectedType, setSelectedType] = useState<IdeaType>('movie');
  
  // Form fields
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [aiFeedback, setAiFeedback] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
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

    if (selectedType === 'movie' && description.length < 100) {
      setError("Movie synopsis must be at least 100 characters.");
      return;
    }

    if ((selectedType === 'game' || selectedType === 'business') && description.length < 50) {
      setError("Description must be at least 50 characters.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Upload attachment if exists
      let attachmentUrl = "";
      if (attachment) {
        // Implement your file upload logic here (to Firebase Storage or other service)
        // attachmentUrl = await uploadFile(attachment);
      }

      // Get AI rating
      const aiRes = await fetch("/api/rate-idea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          type: selectedType,
          content: description // ✅ FIXED: description renamed to content
        }),
      });

      if (!aiRes.ok) {
        const errorText = await aiRes.text();
        console.error("AI rating failed (non-OK):", aiRes.status, errorText);
        throw new Error("AI server error. Please try again.");
      }

      const aiData = await aiRes.json();
      console.log("AI response:", aiData);

      if (!aiData.score) throw new Error("AI rating failed");

      // Save to Firestore
      await addDoc(collection(db, "ideas"), {
        type: selectedType,
        title,
        genre,
        description,
        attachmentUrl,
        userId: user.uid,
        userName: user.displayName || "Anonymous",
        aiScore: aiData.score,
        aiCritique: aiData.comment,
        publicScore: aiData.score, // Start with AI score
        votes: [],
        createdAt: serverTimestamp(),
      });

      setAiFeedback(aiData.comment);
      setSuccess(true);
    } catch (err: any) {
      console.error("Submission failed:", err);
      setError(err.message || "Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Idea Submitted Successfully!</h1>
        <p className="mb-4 text-green-700">AI Feedback:</p>
        <div className="bg-gray-100 p-4 rounded text-left whitespace-pre-wrap mb-6">
          {aiFeedback}
        </div>
        <button
          onClick={() => router.push("/leaderboard")}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition"
        >
          View Leaderboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Submit Your Idea</h1>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <div className="mb-6">
        <label className="block mb-2 font-medium">Idea Type</label>
        <div className="flex space-x-2">
          {(['movie', 'game', 'business'] as IdeaType[]).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-md ${
                selectedType === type
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Title*</label>
        <input
          type="text"
          className="w-full p-3 border rounded-lg"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
          placeholder={`Amazing ${selectedType} idea...`}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Genre*</label>
        <input
          type="text"
          className="w-full p-3 border rounded-lg"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          disabled={loading}
          placeholder="e.g. Sci-Fi, RPG, SaaS"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">
          {selectedType === 'movie' ? 'Synopsis* (100-500 words)' : 
           selectedType === 'game' ? 'Description* (50-300 words)' : 
           'Business Plan* (50-300 words)'}
        </label>
        <textarea
          className="w-full p-3 border rounded-lg h-48"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
          placeholder={
            selectedType === 'movie' ? "Describe your movie plot..." :
            selectedType === 'game' ? "Explain your game concept..." :
            "Describe your business idea..."
          }
        />
      </div>

      <div className="mb-6">
        <label className="block mb-1 font-medium">
          {selectedType === 'movie' ? 'Script (Optional)' : 
           selectedType === 'game' ? 'Prototype Video (Optional)' : 
           'Business Plan (Optional)'}
        </label>
        <input
          type="file"
          onChange={(e) => setAttachment(e.target.files?.[0] || null)}
          className="w-full p-2 border rounded-lg"
          disabled={loading}
          accept={
            selectedType === 'movie' ? '.pdf,.doc,.docx' :
            selectedType === 'game' ? 'video/*' :
            '.pdf,.doc,.docx'
          }
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Submitting...
          </span>
        ) : (
          "Submit Idea"
        )}
      </button>
    </div>
  );
}
