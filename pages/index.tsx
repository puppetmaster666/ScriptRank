import { useState, useEffect } from 'react'

export default function HomePage() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Don't render anything on server
  if (!isClient) {
    return null
  }

  // Only render on client
  return <ClientOnlyContent />
}

function ClientOnlyContent() {
  const [expanded, setExpanded] = useState<string[]>([])

  const ideas = {
    business: [
      { id: 'b1', title: 'Neural Market Predictor', author: 'Dr. Sarah Chen', genre: 'Fintech', aiScore: 94, marketScore: 96, innovationScore: 92, executionScore: 89 },
      { id: 'b2', title: 'EcoChain Network', author: 'James Foster', genre: 'B2B Tools', aiScore: 85, marketScore: 88, innovationScore: 84, executionScore: 83 },
      { id: 'b3', title: 'MediSync AI', author: 'Dr. Anna Kim', genre: 'Healthcare', aiScore: 82, marketScore: 90, innovationScore: 78, executionScore: 85 },
      { id: 'b4', title: 'RetailFlow Analytics', author: 'Marcus Thompson', genre: 'E-commerce', aiScore: 78, marketScore: 85, innovationScore: 72, executionScore: 80 },
      { id: 'b5', title: 'SupplyChain Oracle', author: 'Lisa Wang', genre: 'B2B Tools', aiScore: 76, marketScore: 82, innovationScore: 74, executionScore: 77 }
    ],
    games: [
      { id: 'g1', title: 'Quantum Chess Arena', author: 'Marcus Webb', genre: 'Strategy', aiScore: 91, marketScore: 85, innovationScore: 98, executionScore: 88 },
      { id: 'g2', title: 'Neural VR Therapy', author: 'Dr. Lisa Park', genre: 'VR/AR', aiScore: 83, marketScore: 79, innovationScore: 89, executionScore: 81 },
      { id: 'g3', title: 'Echo Wars Mobile', author: 'Alex Rivera', genre: 'Mobile', aiScore: 79, marketScore: 83, innovationScore: 86, executionScore: 75 },
      { id: 'g4', title: 'Dreamscape Builder', author: 'Sophie Chen', genre: 'Indie', aiScore: 77, marketScore: 72, innovationScore: 88, executionScore: 70 },
      { id: 'g5', title: 'Civilization Nexus', author: 'David Kim', genre: 'PC/Console', aiScore: 75, marketScore: 78, innovationScore: 82, executionScore: 73 }
    ],
    movies: [
      { id: 'm1', title: 'Memory Vault', author: 'Elena Rodriguez', genre: 'Sci-Fi', aiScore: 89, marketScore: 91, innovationScore: 86, executionScore: 90 },
      { id: 'm2', title: 'The Algorithm War', author: 'David Zhang', genre: 'Thriller', aiScore: 81, marketScore: 84, innovationScore: 78, executionScore: 82 },
      { id: 'm3', title: 'Last Light', author: 'Michael Foster', genre: 'Drama', aiScore: 80, marketScore: 76, innovationScore: 73, executionScore: 85 },
      { id: 'm4', title: 'The Architect', author: 'Sarah Black', genre: 'Horror', aiScore: 74, marketScore: 79, innovationScore: 81, executionScore: 76 },
      { id: 'm5', title: 'Echoes of Tomorrow', author: 'Jun Takahashi', genre: 'Animation', aiScore: 72, marketScore: 75, innovationScore: 85, executionScore: 68 }
    ]
  }

  const toggleExpanded = (id: string) => {
    setExpanded(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url(/bg11.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(3px)'
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/90 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-black">HYOKA</h1>
          <div className="flex gap-4">
            <button className="px-4 py-2 border rounded">Login</button>
            <button className="px-4 py-2 bg-black text-white rounded">Submit Idea</button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 p-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-black text-center mb-12">
            WHERE BRILLIANT IDEAS<br/>
            <span className="text-blue-600">MEET AI ANALYSIS</span>
          </h2>

          {/* Three Columns */}
          <div className="grid grid-cols-3 gap-8">
            {/* Business */}
            <div>
              <h3 className="text-lg font-bold uppercase border-b-2 border-black pb-2 mb-4">Business (5)</h3>
              <div className="space-y-4">
                {ideas.business.map(idea => (
                  <IdeaCard key={idea.id} idea={idea} expanded={expanded.includes(idea.id)} toggleExpanded={toggleExpanded} />
                ))}
              </div>
            </div>

            {/* Games */}
            <div>
              <h3 className="text-lg font-bold uppercase border-b-2 border-black pb-2 mb-4">Games (5)</h3>
              <div className="space-y-4">
                {ideas.games.map(idea => (
                  <IdeaCard key={idea.id} idea={idea} expanded={expanded.includes(idea.id)} toggleExpanded={toggleExpanded} />
                ))}
              </div>
            </div>

            {/* Movies */}
            <div>
              <h3 className="text-lg font-bold uppercase border-b-2 border-black pb-2 mb-4">Movies (5)</h3>
              <div className="space-y-4">
                {ideas.movies.map(idea => (
                  <IdeaCard key={idea.id} idea={idea} expanded={expanded.includes(idea.id)} toggleExpanded={toggleExpanded} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-900 text-white p-8 mt-20">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">HYOKA</h3>
          <p className="text-gray-400">© 2024 All rights reserved</p>
        </div>
      </footer>
    </div>
  )
}

function IdeaCard({ idea, expanded, toggleExpanded }: any) {
  const getColor = (score: number) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-yellow-500'
    return 'text-red-500'
  }

  return (
    <div className="bg-white border rounded-lg p-5">
      <div className="flex justify-between mb-3">
        <div>
          <h4 className="font-bold">{idea.title}</h4>
          <p className="text-xs text-gray-500">{idea.author} • {idea.genre}</p>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-black ${getColor(idea.aiScore)}`}>{idea.aiScore}</div>
          <div className="text-xs text-gray-500">AI Score</div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center py-2 bg-gray-50 rounded">
          <div className={`text-sm font-bold ${getColor(idea.marketScore)}`}>{idea.marketScore}</div>
          <div className="text-xs text-gray-500">Market</div>
        </div>
        <div className="text-center py-2 bg-gray-50 rounded">
          <div className={`text-sm font-bold ${getColor(idea.innovationScore)}`}>{idea.innovationScore}</div>
          <div className="text-xs text-gray-500">Innovation</div>
        </div>
        <div className="text-center py-2 bg-gray-50 rounded">
          <div className={`text-sm font-bold ${getColor(idea.executionScore)}`}>{idea.executionScore}</div>
          <div className="text-xs text-gray-500">Execution</div>
        </div>
      </div>
      
      {expanded && (
        <div className="pt-3 border-t">
          <p className="text-sm text-gray-600">Advanced AI-powered platform for next-generation analysis.</p>
        </div>
      )}
      
      <button onClick={() => toggleExpanded(idea.id)} className="mt-3 text-xs text-blue-600">
        {expanded ? 'Show Less' : 'View Details'}
      </button>
    </div>
  )
}
