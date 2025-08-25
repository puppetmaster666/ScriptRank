// pages/submit.tsx
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { PageLayout, Button, Input, Textarea, Select, Card } from '@/components/designSystem'

export default function SubmitPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [currentStep, setCurrentStep] = useState(1)
  
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    genre: '',
    industry: '',
    content: '',
    targetAudience: '',
    uniqueValue: ''
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
      if (!user) {
        router.push('/register')
      }
    })
    return () => unsubscribe()
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const nextStep = () => {
    if (currentStep === 1 && !formData.type) {
      setError('Please select an idea type')
      return
    }
    if (currentStep === 2 && !formData.title) {
      setError('Please enter a title')
      return
    }
    setError('')
    setCurrentStep(prev => prev + 1)
  }

  const prevStep = () => {
    setError('')
    setCurrentStep(prev => prev - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSubmitting(true)
    setError('')

    try {
      // Get AI analysis
      const response = await fetch('/api/rate-idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: formData.type,
          title: formData.title,
          content: formData.content
        })
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const analysis = await response.json()

      if (!analysis.success) {
        throw new Error(analysis.error || 'AI analysis failed')
      }

      // Build the data object with all required fields
      const now = new Date()
      const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

      const ideaData: any = {
        // Core fields
        title: formData.title || 'Untitled',
        type: formData.type || 'entertainment',
        content: formData.content || '',
        targetAudience: formData.targetAudience || '',
        uniqueValue: formData.uniqueValue || '',
        
        // User info
        userId: user.uid,
        username: user.displayName?.toLowerCase().replace(/\s+/g, '.') || 'anonymous',
        userName: user.displayName || 'Anonymous',
        userPhotoURL: user.photoURL || '',
        
        // Initialize arrays and counters
        votes: [],
        voteCount: 0,
        views: 0,
        
        // Timestamps
        createdAt: serverTimestamp(),
        month: month,
        
        // Initialize public scoring
        publicScore: {
          average: 0,
          count: 0,
          sum: 0
        }
      }

      // Add genre OR industry based on type (not both)
      if ((formData.type === 'entertainment' || formData.type === 'game') && formData.genre) {
        ideaData.genre = formData.genre
      } else if (formData.type === 'business' && formData.industry) {
        ideaData.industry = formData.industry
      }

      // Handle AI scores safely
      if (analysis.aiScores && typeof analysis.aiScores === 'object') {
        ideaData.aiScores = {
          overall: Number(analysis.aiScores.overall) || 0,
          market: Number(analysis.aiScores.market) || 0,
          innovation: Number(analysis.aiScores.innovation) || 0,
          execution: Number(analysis.aiScores.execution) || 0,
          verdict: String(analysis.aiScores.verdict || 'Analysis pending'),
          marketFeedback: String(analysis.aiScores.marketFeedback || ''),
          innovationFeedback: String(analysis.aiScores.innovationFeedback || ''),
          executionFeedback: String(analysis.aiScores.executionFeedback || ''),
          investmentStatus: String(analysis.aiScores.investmentStatus || 'PASS')
        }
      } else {
        // Fallback structure
        ideaData.aiScores = {
          overall: Number(analysis.score) || 0,
          market: 0,
          innovation: 0,
          execution: 0,
          verdict: String(analysis.comment || 'Analysis pending'),
          marketFeedback: '',
          innovationFeedback: '',
          executionFeedback: '',
          investmentStatus: 'PASS'
        }
      }

      // CRITICAL: Ensure status is always defined
      ideaData.status = ideaData.aiScores.investmentStatus

      // Backward compatibility fields
      ideaData.aiScore = ideaData.aiScores.overall
      ideaData.aiComment = ideaData.aiScores.verdict

      // Final cleanup - remove any undefined/null/empty string fields
      const cleanedData: any = {}
      for (const [key, value] of Object.entries(ideaData)) {
        if (value !== undefined && value !== null && value !== '') {
          cleanedData[key] = value
        }
      }

      console.log('Submitting cleaned data:', cleanedData) // Debug log

      const docRef = await addDoc(collection(db, 'ideas'), cleanedData)
      
      // Redirect to the idea page
      router.push(`/ideas/${docRef.id}`)
    } catch (err: any) {
      console.error('Submission error:', err)
      setError(err.message || 'Failed to submit idea. Please try again.')
      setSubmitting(false)
    }
  }

  if (loading) return <PageLayout><div className="p-8 text-center">Loading...</div></PageLayout>
  if (!user) return null

  return (
    <>
      <Head>
        <title>Submit Your Idea | Make Me Famous</title>
        <meta name="description" content="Submit your screenplay, game, or business idea for AI scoring" />
      </Head>

      <PageLayout>
        {/* Hero Section */}
        <div className="bg-black text-white py-16 px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-display font-black mb-4">
              SUBMIT YOUR BIG IDEA
            </h1>
            <p className="font-body text-xl opacity-90">
              Get scored by AI. Climb the leaderboard. Win prizes.
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="border-b-2 border-black bg-gray-50">
          <div className="max-w-4xl mx-auto px-8 py-6">
            <div className="flex justify-between items-center">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`
                    w-10 h-10 rounded-full border-2 flex items-center justify-center font-ui font-bold
                    ${currentStep >= step 
                      ? 'bg-black text-white border-black' 
                      : 'bg-white text-gray-400 border-gray-400'}
                  `}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`w-20 sm:w-32 h-1 mx-2 ${
                      currentStep > step ? 'bg-black' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4">
              <span className="font-ui text-sm">Type</span>
              <span className="font-ui text-sm">Details</span>
              <span className="font-ui text-sm">Content</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto px-8 py-12">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-500 rounded-lg">
              <p className="font-body text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1: Type Selection */}
            {currentStep === 1 && (
              <Card>
                <h2 className="text-2xl font-display font-bold mb-6">
                  WHAT ARE YOU SUBMITTING?
                </h2>
                
                <div className="space-y-4">
                  {[
                    { value: 'entertainment', label: '🎬 Film / TV Script', desc: 'Screenplay, series, or story' },
                    { value: 'game', label: '🎮 Game Concept', desc: 'Video game, board game, or app' },
                    { value: 'business', label: '💼 Business Idea', desc: 'Startup, product, or service' }
                  ].map((option) => (
                    <label key={option.value} className="block">
                      <input
                        type="radio"
                        name="type"
                        value={option.value}
                        checked={formData.type === option.value}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className={`
                        p-6 border-2 rounded-lg cursor-pointer transition-all
                        ${formData.type === option.value 
                          ? 'border-black bg-gray-50' 
                          : 'border-gray-300 hover:border-gray-500'}
                      `}>
                        <div className="text-xl font-ui font-bold mb-1">{option.label}</div>
                        <div className="font-body text-sm text-gray-600">{option.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="mt-8 flex justify-end">
                  <Button 
                    onClick={nextStep} 
                    variant="primary" 
                    size="lg"
                    type="button"
                  >
                    Next Step →
                  </Button>
                </div>
              </Card>
            )}

            {/* Step 2: Details */}
            {currentStep === 2 && (
              <Card>
                <h2 className="text-2xl font-display font-bold mb-6">
                  TELL US THE BASICS
                </h2>

                <Input
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder={
                    formData.type === 'entertainment' ? 'The Last Stand' :
                    formData.type === 'game' ? 'Zombie Survival RPG' :
                    'UberEats for Home Services'
                  }
                  required
                />

                {formData.type === 'entertainment' && (
                  <Select
                    label="Genre"
                    name="genre"
                    value={formData.genre}
                    onChange={handleInputChange}
                    options={[
                      { value: 'action', label: 'Action' },
                      { value: 'comedy', label: 'Comedy' },
                      { value: 'drama', label: 'Drama' },
                      { value: 'horror', label: 'Horror' },
                      { value: 'scifi', label: 'Sci-Fi' },
                      { value: 'thriller', label: 'Thriller' },
                      { value: 'romance', label: 'Romance' },
                      { value: 'other', label: 'Other' }
                    ]}
                    required
                  />
                )}

                {formData.type === 'game' && (
                  <Select
                    label="Genre"
                    name="genre"
                    value={formData.genre}
                    onChange={handleInputChange}
                    options={[
                      { value: 'action', label: 'Action' },
                      { value: 'adventure', label: 'Adventure' },
                      { value: 'puzzle', label: 'Puzzle' },
                      { value: 'strategy', label: 'Strategy' },
                      { value: 'rpg', label: 'RPG' },
                      { value: 'simulation', label: 'Simulation' },
                      { value: 'sports', label: 'Sports' },
                      { value: 'other', label: 'Other' }
                    ]}
                    required
                  />
                )}

                {formData.type === 'business' && (
                  <Select
                    label="Industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    options={[
                      { value: 'tech', label: 'Technology' },
                      { value: 'health', label: 'Healthcare' },
                      { value: 'finance', label: 'Finance' },
                      { value: 'education', label: 'Education' },
                      { value: 'retail', label: 'Retail' },
                      { value: 'food', label: 'Food & Beverage' },
                      { value: 'entertainment', label: 'Entertainment' },
                      { value: 'other', label: 'Other' }
                    ]}
                    required
                  />
                )}

                <Input
                  label="Target Audience"
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleInputChange}
                  placeholder="Young adults, 18-35, who love thrillers"
                  required
                />

                <div className="mt-8 flex justify-between">
                  <Button 
                    onClick={prevStep} 
                    variant="outline"
                    type="button"
                  >
                    ← Back
                  </Button>
                  <Button 
                    onClick={nextStep} 
                    variant="primary" 
                    size="lg"
                    type="button"
                  >
                    Next Step →
                  </Button>
                </div>
              </Card>
            )}

            {/* Step 3: Content */}
            {currentStep === 3 && (
              <Card>
                <h2 className="text-2xl font-display font-bold mb-6">
                  PITCH YOUR IDEA
                </h2>

                <Textarea
                  label={
                    formData.type === 'entertainment' ? 'Synopsis' :
                    formData.type === 'game' ? 'Game Concept' :
                    'Business Plan'
                  }
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder={
                    formData.type === 'entertainment' 
                      ? 'In a world where... A reluctant hero must...' 
                      : formData.type === 'game'
                      ? 'Players take on the role of... The objective is to...'
                      : 'We solve the problem of... Our solution is...'
                  }
                  rows={8}
                  required
                />

                <Textarea
                  label="What Makes It Unique?"
                  name="uniqueValue"
                  value={formData.uniqueValue}
                  onChange={handleInputChange}
                  placeholder="Unlike existing solutions, this idea..."
                  rows={4}
                  required
                />

                <div className="mt-8 p-6 bg-gray-50 border-2 border-black rounded-lg">
                  <h3 className="font-ui font-bold mb-2">What happens next?</h3>
                  <ul className="font-body text-sm space-y-2">
                    <li>• Our AI will analyze your idea (takes ~10 seconds)</li>
                    <li>• You'll receive a score from 1-10</li>
                    <li>• Your idea enters the public leaderboard</li>
                    <li>• Community members can vote and comment</li>
                    <li>• Top ideas win monthly prizes!</li>
                  </ul>
                </div>

                <div className="mt-8 flex justify-between">
                  <Button 
                    onClick={prevStep} 
                    variant="outline"
                    type="button"
                  >
                    ← Back
                  </Button>
                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg"
                    disabled={submitting}
                  >
                    {submitting ? 'Analyzing...' : 'Submit for AI Scoring →'}
                  </Button>
                </div>
              </Card>
            )}
          </form>
        </div>
      </PageLayout>

      <style jsx>{`
        .font-display {
          font-family: 'DrukWide', Impact, sans-serif;
        }
        .font-ui {
          font-family: 'Bahnschrift', system-ui, sans-serif;
        }
        .font-body {
          font-family: 'Courier', 'Courier New', monospace;
        }
      `}</style>
    </>
  )
}
