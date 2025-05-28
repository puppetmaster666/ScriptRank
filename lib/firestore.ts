// lib/firestore.ts
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function saveIdea(ideaData: {
  type: string;
  title: string;
  genre?: string;
  industry?: string;
  content: string;
  userId: string;
  fileURL?: string;
  aiScore: number;
  aiComment: string;
}) {
  try {
    const collectionName = `${ideaData.type}s`; // e.g., 'movies', 'games', 'business'
    const docRef = await addDoc(collection(db, collectionName), {
      title: ideaData.title,
      genre: ideaData.genre,
      industry: ideaData.industry,
      content: ideaData.content,
      userId: ideaData.userId,
      fileURL: ideaData.fileURL,
      aiScore: ideaData.aiScore,
      aiComment: ideaData.aiComment,
      createdAt: serverTimestamp(),
      votes: []
    });
    console.log('Document written with ID: ', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving idea:', error);
    throw error;
  }
}
