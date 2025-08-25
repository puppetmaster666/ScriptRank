// pages/submit.tsx - COMPLETE FIXED FILE
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { submitIdea, createUserProfile } from '@/lib/firebase-collections'

export default function SubmitPage() {
  const router = useRouter()
  
  // Auth state without react-firebase-hooks
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Form state
  const [step, setStep] = useState(1)
  const [ideaType, setIdeaType] = useState<'movie' | 'game' | 'business'>('movie')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [genre, setGenre] = useState('')
  const [industry, setIndustry] = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [uniqueValue, setUniqueValue] = useState('')
  
  // UI state
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [charCount, setCharCount] = useState(0)

  // Set up auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/register')
    }
  }, [user, loading, router])

  useEffect(() => {
    setCharCount(description.length)
  }, [description])

  const handleSubmit = async () => {
    if (!user) {
      router.push('/register')
      return
    }
    
    try {
      setSubmitting(true)
      setError('')
      
      // CRITICAL FIX: Get user profile data FIRST
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      let userData = userDoc.data()
      
      if (!userData) {
        // User doesn't have a profile yet - create one
        console.log('No profile found, creating one...')
        
        // Generate a username from email or displayName
        const baseUsername = user.displayName?.toLowerCase().replace(/\s+/g, '.') || 
                            user.email?.split('@')[0] || 
                            'user'
        const timestamp = Date.now().toString().slice(-6)
        const username = `${baseUsername}_${timestamp}`.replace(/[^a-z0-9._]/g, '')
        
        // Create the profile
        await createUserProfile(user.uid, {
          username: username,
          displayName: user.displayName || baseUsername,
          email: user.email || '',
          photoURL: user.photoURL || undefined
        })
        
        // Fetch the newly created profile
        const newUserDoc = await getDoc(doc(db, 'users', user.uid))
        userData = newUserDoc.data()
        
        if (!userData) {
          throw new Error('Failed to create user profile')
        }
      }
      
      // Get AI analysis first
      const aiResponse = await fetch('/api/rate-idea', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: ideaType,
          content: description,
          title: title
        })
      })

      if (!aiResponse.ok) {
        const errorData = await aiResponse.json()
        throw new Error(errorData.error || 'Failed to get AI analysis')
      }

      const aiData = await aiResponse.json()
      
      // Now submit the idea with complete user information and AI scores
      const result = await submitIdea({
        userId: user.uid,
        username: userData.username || user.email?.split('@')[0] || 'user',
        userPhotoURL: userData.photoURL || user.photoURL || '',
        type: ideaType,
        title: title.trim(),
        content: description.trim(),
        aiScores: {
          market: aiData.aiScores.market,
          innovation: aiData.aiScores.innovation,
          execution: aiData.aiScores.execution,
          overall: aiData.aiScores.overall,
          marketFeedback: aiData.aiScores.marketFeedback,
          innovationFeedback: aiData.aiScores.innovationFeedback,
          executionFeedback: aiData.aiScores.executionFeedback,
          verdict: aiData.aiScores.verdict,
          investmentStatus: aiData.aiScores.investmentStatus
        }
      })
      
      // Success! Redirect to the idea page
      router.push(`/ideas/${result.ideaId}`)
      
    } catch (error: any) {
      console.error('Submission error:', error)
      setError(error.message || 'Failed to submit idea. Please try again.')
      setSubmitting(false)
    }
  }

  const validateStep = (stepNumber: number): boolean => {
    switch (stepNumber) {
      case 1:
        return ideaType !== null
      case 2:
        return title.length >= 3 && title.length <= 100
      case 3:
        return description.length >= 30 && description.length <= 5000
      default:
        return true
    }
  }

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1)
      setError('')
    } else {
      setError('Please complete this step before continuing')
    }
  }

  const prevStep = () => {
    setStep(step - 1)
    setError('')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Submit Your Idea | Make Me Famous</title>
      </Head>

      <div className="min-h-screen bg-white">
        {/* Progress Bar */}
        <div className="bg-black p-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`flex items-center ${i < 3 ? 'flex-1' : ''}`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      i <= step ? 'bg-white text-black' : 'bg-gray-700 text-gray-400'
                    }`}
                  >
                    {i}
                  </div>
                  {i < 3 && (
                    <div className={`flex-1 h-1 mx-2 ${i < step ? 'bg-white' : 'bg-gray-700'}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="text-white text-center">
              {step === 1 && 'Choose Your Category'}
              {step === 2 && 'Name Your Idea'}
              {step === 3 && 'Describe Your Vision'}
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg text-red-800">
              {error}
            </div>
          )}

          {/* Step 1: Choose Type */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-center mb-8">What are you pitching?</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <button
                  onClick={() => setIdeaType('movie')}
                  className={`p-6 border-2 rounded-lg transition-all ${
                    ideaType === 'movie'
                      ? 'border-black bg-black text-white'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="text-4xl mb-3">🎬</div>
                  <div className="font-bold text-lg">Movie/TV</div>
                  <div className="text-sm mt-2 opacity-80">
                    Film scripts, series concepts, documentaries
                  </div>
                </button>

                <button
                  onClick={() => setIdeaType('game')}
                  className={`p-6 border-2 rounded-lg transition-all ${
                    ideaType === 'game'
                      ? 'border-black bg-black text-white'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="text-4xl mb-3">🎮</div>
                  <div className="font-bold text-lg">Game</div>
                  <div className="text-sm mt-2 opacity-80">
                    Video games, mobile games, board games
                  </div>
                </button>

                <button
                  onClick={() => setIdeaType('business')}
                  className={`p-6 border-2 rounded-lg transition-all ${
                    ideaType === 'business'
                      ? 'border-black bg-black text-white'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="text-4xl mb-3">💼</div>
                  <div className="font-bold text-lg">Business</div>
                  <div className="text-sm mt-2 opacity-80">
                    Startups, apps, products, services
                  </div>
                </button>
              </div>

              <div className="flex justify-end mt-8">
                <button
                  onClick={nextStep}
                  disabled={!ideaType}
                  className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Title & Basic Info */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-center mb-8">Give it a name</h2>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={
                    ideaType === 'movie' ? 'e.g., The Memory Thief' :
                    ideaType === 'game' ? 'e.g., Cosmic Conquest VR' :
                    'e.g., AirBnB for Parking Spaces'
                  }
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none"
                  maxLength={100}
                />
                <div className="text-sm text-gray-500 mt-1">
                  {title.length}/100 characters
                </div>
              </div>

              {ideaType === 'movie' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Genre</label>
                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none"
                  >
                    <option value="">Select a genre...</option>
                    <option value="Action">Action</option>
                    <option value="Comedy">Comedy</option>
                    <option value="Drama">Drama</option>
                    <option value="Horror">Horror</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                    <option value="Thriller">Thriller</option>
                    <option value="Romance">Romance</option>
                    <option value="Documentary">Documentary</option>
                    <option value="Animation">Animation</option>
                  </select>
                </div>
              )}

              {ideaType === 'game' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Genre</label>
                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none"
                  >
                    <option value="">Select a genre...</option>
                    <option value="Action">Action</option>
                    <option value="RPG">RPG</option>
                    <option value="Strategy">Strategy</option>
                    <option value="Puzzle">Puzzle</option>
                    <option value="Sports">Sports</option>
                    <option value="Simulation">Simulation</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Horror">Horror</option>
                  </select>
                </div>
              )}

              {ideaType === 'business' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Industry</label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g., Real Estate, FinTech, Healthcare"
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none"
                  />
                </div>
              )}

              <div className="flex justify-between mt-8">
                <button
                  onClick={prevStep}
                  className="px-8 py-3 border-2 border-black text-black rounded-lg hover:bg-gray-100"
                >
                  ← Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={title.length < 3}
                  className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Description */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-center mb-8">Pitch your vision</h2>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={
                    ideaType === 'movie' 
                      ? "Describe your story. What's the plot? Who are the main characters? What makes it unique?"
                      : ideaType === 'game'
                      ? "Describe your game concept. What's the gameplay like? What makes it fun and unique?"
                      : "Describe your business idea. What problem does it solve? Who are your customers?"
                  }
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none h-48"
                  maxLength={5000}
                />
                <div className={`text-sm mt-1 ${charCount < 30 ? 'text-red-500' : 'text-gray-500'}`}>
                  {charCount}/5000 characters (minimum 30)
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder={
                    ideaType === 'movie' ? "e.g., Fans of Christopher Nolan films" :
                    ideaType === 'game' ? "e.g., Casual mobile gamers aged 25-40" :
                    "e.g., Small business owners in urban areas"
                  }
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  What makes it unique?
                </label>
                <textarea
                  value={uniqueValue}
                  onChange={(e) => setUniqueValue(e.target.value)}
                  placeholder="What sets your idea apart from everything else out there?"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none h-24"
                  maxLength={500}
                />
              </div>

              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                <p className="text-sm">
                  <strong>⚠️ Warning:</strong> Our AI is brutally honest. Most ideas score between 3-6. 
                  Only the truly exceptional break 8. Are you ready for harsh feedback?
                </p>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={prevStep}
                  className="px-8 py-3 border-2 border-black text-black rounded-lg hover:bg-gray-100"
                >
                  ← Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || description.length < 30}
                  className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting...' : 'Submit for AI Review'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
