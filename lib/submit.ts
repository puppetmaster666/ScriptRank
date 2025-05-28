// lib/submit.ts
import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { saveIdea } from './firestore'; // Assuming you have a function to save ideas to Firestore

export async function uploadFileAndSaveData(file: File, ideaData: {
  type: string; // Type of submission (Movie, Game, Business)
  title: string;
  genre?: string; // For Movies and Games
  industry?: string; // For Business
  content: string; // Synopsis, brief explanation, or business plan
  userId: string;
}) {
  try {
    // Upload file to Firebase Storage
    const storageRef = ref(storage, `uploads/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Get AI analysis
    const analysis = await fetch('/api/analyze-script', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: ideaData.type,
        content: ideaData.content
      })
    }).then(res => res.json());

    if (!analysis.score) throw new Error('AI analysis failed');

    // Create idea object with the download URL
    const newIdea = {
      type: ideaData.type,
      title: ideaData.title,
      genre: ideaData.genre,
      industry: ideaData.industry,
      content: ideaData.content,
      userId: ideaData.userId,
      fileURL: downloadURL, // Store the download URL
      aiScore: analysis.score,
      aiComment: analysis.comment,
      createdAt: new Date().toISOString(),
      votes: []
    };

    // Save to Firestore
    return await saveIdea(newIdea);
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
}
