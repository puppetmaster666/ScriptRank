import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { auth, db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function UploadPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState("");
  const [aiComment, setAiComment] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleUpload = async () => {
    if (!user) {
      setError("You must be logged in to upload a script.");
      return;
    }

    if (!title.trim() || !content.trim()) {
      setError("Please fill in both title and content.");
      return;
    }

    // Approximate page limit (assuming 1,000 characters per page)
    if (content.length > 120000) {
      setError("Script too long. Limit is ~120 pages (120,000 characters).");
      return;
    }

    setLoading(true);
    setError("");
    setAiComment("");

    try {
      const aiRes = await fetch("/api/rate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ synopsis: content }),
      });

      const aiData = await aiRes.json();
      if (!aiData.score) throw new Error("AI rating failed");

      const aiScore = aiData.score;
      const aiComment = aiData.comment;

      await addDoc(collection(db, "scripts"), {
        title,
        content,
        userId: user.uid,
        aiScore,
        aiComment,
        publicScore: 0,
        createdAt: serverTimestamp(),
      });

      setAiComment(aiComment);
      setSuccess(true);
    } catch (err: any) {
      console.error("Upload failed:", err);
      setError("Failed to upload. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Script Uploaded Successfully!</h1>
        <p className="mb-4 text-green-700">Here’s what the AI had to say:</p>
        <div className="bg-gray-100 p-4 rounded text-left whitespace-pre-wrap mb-6">{aiComment}</div>
        <button
          onClick={() => router.push("/profile")}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
        >
          Go to Profile
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Upload Your Script</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-4">
        <label className="block mb-1 font-medium">Title</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Script Content</label>
        <textarea
          className="w-full p-2 border rounded h-48"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={loading}
        />
        <p className="text-sm text-gray-500 mt-1">
          Max: ~120 pages (~120,000 characters)
        </p>
      </div>

      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
      >
        {loading ? "Uploading..." : "Upload Script"}
      </button>
    </div>
  );
}
