import { useState } from 'react'

const ideas = {
  business: [
    { id: '1', title: 'Neural Market Predictor', author: 'Dr. Sarah Chen', genre: 'Fintech', aiScore: 94, marketScore: 96, innovationScore: 92, executionScore: 89, publicScore: 9.2, votes: 847, desc: 'AI-powered platform that analyzes 10,000+ market signals in real-time.' },
    { id: '2', title: 'EcoChain Network', author: 'James Foster', genre: 'B2B Tools', aiScore: 85, marketScore: 88, innovationScore: 84, executionScore: 83, publicScore: 8.3, votes: 756, desc: 'Blockchain-based carbon credit marketplace with IoT verification.' },
    { id: '3', title: 'MediSync AI', author: 'Dr. Anna Kim', genre: 'Healthcare', aiScore: 82, marketScore: 90, innovationScore: 78, executionScore: 85, publicScore: 8.7, votes: 523, desc: 'Medical records synchronization platform using NLP.' },
    { id: '4', title: 'RetailFlow Analytics', author: 'Marcus Thompson', genre: 'E-commerce', aiScore: 78, marketScore: 85, innovationScore: 72, executionScore: 80, publicScore: 7.9, votes: 412, desc: 'Real-time retail optimization platform.' },
    { id: '5', title: 'SupplyChain Oracle', author: 'Lisa Wang', genre: 'B2B Tools', aiScore: 76, marketScore: 82, innovationScore: 74, executionScore: 77, publicScore: 7.5, votes: 389, desc: 'Predictive supply chain management system.' }
  ],
  games: [
    { id: '6', title: 'Quantum Chess Arena', author: 'Marcus Webb', genre: 'Strategy', aiScore: 91, marketScore: 85, innovationScore: 98, executionScore: 88, publicScore: 8.9, votes: 623, desc: 'Revolutionary chess variant with quantum mechanics.' },
    { id: '7', title: 'Neural VR Therapy', author: 'Dr. Lisa Park', genre: 'VR/AR', aiScore: 83, marketScore: 79, innovationScore: 89, executionScore: 81, publicScore: 8.8, votes: 567, desc: 'Immersive VR platform for treating PTSD and anxiety.' },
    { id: '8', title: 'Echo Wars Mobile', author: 'Alex Rivera', genre: 'Mobile', aiScore: 79, marketScore: 83, innovationScore: 86, executionScore: 75, publicScore: 8.1, votes: 445, desc: 'Asymmetric multiplayer strategy game.' },
    { id: '9', title: 'Dreamscape Builder', author: 'Sophie Chen', genre: 'Indie', aiScore: 77, marketScore: 72, innovationScore: 88, executionScore: 70, publicScore: 8.4, votes: 367, desc: 'Surreal puzzle-platformer with dream logic.' },
    { id: '10', title: 'Civilization Nexus', author: 'David Kim', genre: 'PC/Console', aiScore: 75, marketScore: 78, innovationScore: 82, executionScore: 73, publicScore: 7.8, votes: 334, desc: 'Grand strategy game spanning 10,000 years.' }
  ],
  movies: [
    { id: '11', title: 'Memory Vault', author: 'Elena Rodriguez', genre: 'Sci-Fi', aiScore: 89, marketScore: 91, innovationScore: 86, executionScore: 90, publicScore: 8.7, votes: 1203, desc: 'In 2090, memories are extracted and stored as digital assets.' },
    { id: '12', title: 'The Algorithm War', author: 'David Zhang', genre: 'Thriller', aiScore: 81, marketScore: 84, innovationScore: 78, executionScore: 82, publicScore: 8.1, votes: 892, desc: 'Corporate espionage thriller with AI algorithms.' },
    { id: '13', title: 'Last Light', author: 'Michael Foster', genre: 'Drama', aiScore: 80, marketScore: 76, innovationScore: 73, executionScore: 85, publicScore: 8.5, votes: 678, desc: 'Three lighthouse keepers in 1890s Maine.' },
    { id: '14', title: 'The Architect', author: 'Sarah Black', genre: 'Horror', aiScore: 74, marketScore: 79, innovationScore: 81, executionScore: 76, publicScore: 7.6, votes: 456, desc: 'Psychological horror about parallel dimensions.' },
    { id: '15', title: 'Echoes of Tomorrow', author: 'Jun Takahashi', genre: 'Animation', aiScore: 72, marketScore: 75, innovationScore: 85, executionScore: 68, publicScore: 8.2, votes: 523, desc: 'Animated epic with timeline-altering music.' }
  ]
}

export default function HomePage() {
  const [expanded, setExpanded] = useState<string[]>([])

  const toggleExpanded = (id: string) => {
    setExpanded(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    )
  }

  const getColor = (score: number) => {
    if (score >= 80) return '#10b981'
    if (score >= 60) return '#f59e0b'
    return '#ef4444'
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', position: 'relative' }}>
      {/* Background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'url("/bg11.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.1,
        filter: 'blur(3px)',
        zIndex: 0
      }} />
      
      {/* Header */}
      <header style={{ 
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '900' }}>HYOKA</h1>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button style={{ padding: '8px 16px', backgroundColor: 'white', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer' }}>Login</button>
            <button style={{ padding: '8px 16px', backgroundColor: '#111827', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>Submit Idea</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ position: 'relative', zIndex: 10, padding: '32px 24px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '48px', fontWeight: '900', marginBottom: '16px' }}>
            WHERE BRILLIANT IDEAS
            <span style={{ display: 'block', background: 'linear-gradient(to right, #2563eb, #9333ea)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              MEET AI ANALYSIS
            </span>
          </h2>
        </div>

        {/* Three Columns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
          {/* Business Column */}
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '2px solid #111827', paddingBottom: '8px', marginBottom: '16px' }}>
              Business (5)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {ideas.business.map(idea => (
                <div key={idea.id} style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div>
                      <h4 style={{ fontWeight: 'bold', fontSize: '16px' }}>{idea.title}</h4>
                      <p style={{ fontSize: '12px', color: '#6b7280' }}>{idea.author} • {idea.genre}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '24px', fontWeight: '900', color: getColor(idea.aiScore) }}>{idea.aiScore}</div>
                      <div style={{ fontSize: '11px', color: '#6b7280' }}>AI Score</div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    <div style={{ textAlign: 'center', padding: '8px', backgroundColor: '#f9fafb', borderRadius: '4px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', color: getColor(idea.marketScore) }}>{idea.marketScore}</div>
                      <div style={{ fontSize: '11px', color: '#6b7280' }}>Market</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '8px', backgroundColor: '#f9fafb', borderRadius: '4px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', color: getColor(idea.innovationScore) }}>{idea.innovationScore}</div>
                      <div style={{ fontSize: '11px', color: '#6b7280' }}>Innovation</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '8px', backgroundColor: '#f9fafb', borderRadius: '4px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', color: getColor(idea.executionScore) }}>{idea.executionScore}</div>
                      <div style={{ fontSize: '11px', color: '#6b7280' }}>Execution</div>
                    </div>
                  </div>
                  
                  {expanded.includes(idea.id) && (
                    <div style={{ paddingTop: '12px', borderTop: '1px solid #f3f4f6' }}>
                      <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '12px' }}>{idea.desc}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '12px', color: '#6b7280' }}>{idea.votes} votes</span>
                        <span style={{ fontSize: '12px', color: '#4b5563' }}>Rating: {idea.publicScore}/10</span>
                      </div>
                    </div>
                  )}
                  
                  <button onClick={() => toggleExpanded(idea.id)} style={{ marginTop: '12px', fontSize: '12px', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}>
                    {expanded.includes(idea.id) ? 'Show Less' : 'View Details'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Games Column */}
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '2px solid #111827', paddingBottom: '8px', marginBottom: '16px' }}>
              Games (5)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {ideas.games.map(idea => (
                <div key={idea.id} style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div>
                      <h4 style={{ fontWeight: 'bold', fontSize: '16px' }}>{idea.title}</h4>
                      <p style={{ fontSize: '12px', color: '#6b7280' }}>{idea.author} • {idea.genre}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '24px', fontWeight: '900', color: getColor(idea.aiScore) }}>{idea.aiScore}</div>
                      <div style={{ fontSize: '11px', color: '#6b7280' }}>AI Score</div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    <div style={{ textAlign: 'center', padding: '8px', backgroundColor: '#f9fafb', borderRadius: '4px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', color: getColor(idea.marketScore) }}>{idea.marketScore}</div>
                      <div style={{ fontSize: '11px', color: '#6b7280' }}>Market</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '8px', backgroundColor: '#f9fafb', borderRadius: '4px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', color: getColor(idea.innovationScore) }}>{idea.innovationScore}</div>
                      <div style={{ fontSize: '11px', color: '#6b7280' }}>Innovation</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '8px', backgroundColor: '#f9fafb', borderRadius: '4px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', color: getColor(idea.executionScore) }}>{idea.executionScore}</div>
                      <div style={{ fontSize: '11px', color: '#6b7280' }}>Execution</div>
                    </div>
                  </div>
                  
                  {expanded.includes(idea.id) && (
                    <div style={{ paddingTop: '12px', borderTop: '1px solid #f3f4f6' }}>
                      <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '12px' }}>{idea.desc}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '12px', color: '#6b7280' }}>{idea.votes} votes</span>
                        <span style={{ fontSize: '12px', color: '#4b5563' }}>Rating: {idea.publicScore}/10</span>
                      </div>
                    </div>
                  )}
                  
                  <button onClick={() => toggleExpanded(idea.id)} style={{ marginTop: '12px', fontSize: '12px', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}>
                    {expanded.includes(idea.id) ? 'Show Less' : 'View Details'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Movies Column */}
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '2px solid #111827', paddingBottom: '8px', marginBottom: '16px' }}>
              Movies (5)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {ideas.movies.map(idea => (
                <div key={idea.id} style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div>
                      <h4 style={{ fontWeight: 'bold', fontSize: '16px' }}>{idea.title}</h4>
                      <p style={{ fontSize: '12px', color: '#6b7280' }}>{idea.author} • {idea.genre}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '24px', fontWeight: '900', color: getColor(idea.aiScore) }}>{idea.aiScore}</div>
                      <div style={{ fontSize: '11px', color: '#6b7280' }}>AI Score</div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    <div style={{ textAlign: 'center', padding: '8px', backgroundColor: '#f9fafb', borderRadius: '4px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', color: getColor(idea.marketScore) }}>{idea.marketScore}</div>
                      <div style={{ fontSize: '11px', color: '#6b7280' }}>Market</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '8px', backgroundColor: '#f9fafb', borderRadius: '4px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', color: getColor(idea.innovationScore) }}>{idea.innovationScore}</div>
                      <div style={{ fontSize: '11px', color: '#6b7280' }}>Innovation</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '8px', backgroundColor: '#f9fafb', borderRadius: '4px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', color: getColor(idea.executionScore) }}>{idea.executionScore}</div>
                      <div style={{ fontSize: '11px', color: '#6b7280' }}>Execution</div>
                    </div>
                  </div>
                  
                  {expanded.includes(idea.id) && (
                    <div style={{ paddingTop: '12px', borderTop: '1px solid #f3f4f6' }}>
                      <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '12px' }}>{idea.desc}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '12px', color: '#6b7280' }}>{idea.votes} votes</span>
                        <span style={{ fontSize: '12px', color: '#4b5563' }}>Rating: {idea.publicScore}/10</span>
                      </div>
                    </div>
                  )}
                  
                  <button onClick={() => toggleExpanded(idea.id)} style={{ marginTop: '12px', fontSize: '12px', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}>
                    {expanded.includes(idea.id) ? 'Show Less' : 'View Details'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
