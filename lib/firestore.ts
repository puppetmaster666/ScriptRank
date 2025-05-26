// lib/firestore.ts
import { db } from './firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

export async function saveScriptToFirestore(script: {
  userId: string
  title: string
  genre: string
  synopsis: string
  aiScore: number
  aiComment: string
  publicScore?: number
  highlight?: string
}) {
  try {
    const docRef = await addDoc(collection(db, 'scripts'), {
      ...script,
      createdAt: serverTimestamp(),
      votes: [], // for public scores later
    })
    return docRef.id
  } catch (error) {
    console.error('Error saving script to Firestore:', error)
    throw error
  }
}
