// pages/index.tsx
import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import Script from 'next/script'

export default function HomePage() {
  const [rotatingTextIndex, setRotatingTextIndex] = useState(0)
  const rotatingTexts = ['SCREENPLAY', 'GAME IDEA', 'BUSINESS']
  
  useEffect(() => {
    const interval = setInterval(() => {
      setRotatingTextIndex((prev) => (prev + 1) % rotatingTexts.length)
    }, 3000)
    
    // Debug model viewer
    const checkModel = () => {
      const modelViewer = document.querySelector('model-viewer')
      if (modelViewer) {
        console.log('Model viewer found:', modelViewer)
        // @ts-ignore
        modelViewer.addEventListener('load', () => console.log('Model loaded!'))
        // @ts-ignore
        modelViewer.addEventListener('error', (e) => console.error('Model error:', e))
      } else {
        console.log('Model viewer not found yet, retrying...')
        setTimeout(checkModel, 1000)
      }
    }
    checkModel()
    
    return () => clearInterval(interval)
  }, [])

  // Fake profiles data
  const leaderboardData = [
    { rank: '🥇', title: 'Neon Nights', creator: 'Michael Rodriguez', category: '🎬 Film', votes: 847 },
    { rank: '🥈', title: 'GreenEats', creator: 'David Park', category: '💼 Business', votes: 756 },
    { rank: '🥉', title: 'Mind Maze VR', creator: 'Emily Davis', category: '🎮 Game', votes: 698 },
    { rank: '4', title: 'The Last Comedian', creator: 'Sarah Chen', category: '🎬 Film', votes: 623 },
    { rank: '5', title: 'AI Resume Coach', creator: 'Lisa Anderson', category: '💼 Business', votes: 589 },
    { rank: '6', title: 'Pixel Dungeons', creator: 'Alex Thompson', category: '🎮 Game', votes: 512 },
    { rank: '7', title: 'Echoes of Tomorrow', creator: 'Jennifer Williams', category: '🎬 Film', votes: 487 },
    { rank: '8', title: 'RentMyGarage', creator: 'Marcus Johnson', category: '💼 Business', votes: 423 },
    { rank: '9', title: 'Battle Royale Chess', creator: 'James Mitchell', category: '🎮 Game', votes: 398 },
    { rank: '10', title: 'Street Kings', creator: 'Robert Taylor', category: '🎬 Film', votes: 342 }
  ]

  const sponsors = ['Netflix Studios', 'Epic Games', 'Y Combinator', 'Warner Bros', 'Ubisoft', 'TechStars']
  
  const liveActivity = [
    { time: 'Just now', action: 'Sarah Chen voted on "Mind Maze VR" ⬆️' },
    { time: '2 min ago', action: 'New submission: "Coffee & Code" by Alex Kim 🆕' },
    { time: '5 min ago', action: 'Michael Rodriguez reached 800 votes! 🎉' },
    { time: '8 min ago', action: 'David Park commented on "Pixel Dungeons" 💬' }
  ]

  return (
    <>
      <Head>
        <title>Make Me Famous - Where Ideas Become Reality</title>
        <meta name="description" content="Submit your screenplay, game idea, or business concept. Get discovered, win prizes, become famous." />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Kalam:wght@400;700&display=swap" rel="stylesheet" />
      </Head>

      {/* Load model-viewer library */}
      <Script 
        type="module" 
        src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
      />

      {/* City Skyline Background */}
      <div className="fixed bottom-0 left-0 right-0 h-[300px] -z-10 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
        <img 
          src="https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&h=400&fit=crop" 
          alt="City Skyline" 
          className="w-full h-full object-cover opacity-50"
        />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-gray-900/90 backdrop-blur-md z-50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-4xl font-bold" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
            MAKE ME FAMOUS
          </div>
          <div className="flex space-x-6">
            <Link href="/submit" className="hover:text-yellow-400 transition">
              Submit Idea
            </Link>
            <Link href="/leaderboard" className="hover:text-yellow-400 transition">
              Vote
            </Link>
            <a href="#leaderboard" className="hover:text-yellow-400 transition">
              Leaderboard
            </a>
            <Link href="/register" className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-lg font-bold hover:bg-yellow-300 transition">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="space-y-8">
            <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
              <span className="static-text" data-text="Get Your">Get Your</span>
              <br />
              <div className="h-[1.2em] overflow-hidden relative mt-4">
                <span className="text-yellow-400 absolute w-full transition-all duration-500"
                      style={{
                        transform: `translateY(${-rotatingTextIndex * 100}%)`,
                        fontFamily: 'Bebas Neue, sans-serif'
                      }}>
                  {rotatingTexts.map((text, i) => (
                    <div key={i} className="h-[1.2em]">{text}</div>
                  ))}
                </span>
              </div>
              <span className="static-text" data-text="Discovered">Discovered</span>
            </h1>
            
            <p className="text-xl text-gray-300">
              Join thousands of creators competing for fame, recognition, and monthly prizes. 
              Your idea could be the next big thing.
            </p>

            {/* Live Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-800/50 backdrop-blur p-4 rounded-lg border border-gray-700">
                <div className="text-3xl font-bold text-yellow-400">2,847</div>
                <div className="text-sm text-gray-400">Ideas Submitted</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur p-4 rounded-lg border border-gray-700">
                <div className="text-3xl font-bold text-green-400">48,293</div>
                <div className="text-sm text-gray-400">Votes Cast</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur p-4 rounded-lg border border-gray-700">
                <div className="text-3xl font-bold text-blue-400">$5,000</div>
                <div className="text-sm text-gray-400">Monthly Prize</div>
              </div>
            </div>

            <Link href="/register" 
                  className="inline-block bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg text-xl font-bold hover:bg-yellow-300 transform hover:scale-105 transition-all shadow-lg">
              Submit Your Idea Now →
            </Link>
          </div>

          {/* Right: 3D TV */}
          <div className="relative">
            <div 
              id="model-viewer-container"
              dangerouslySetInnerHTML={{
                __html: `
                  <model-viewer 
                    src="/models/tv.glb"
                    alt="3D TV Model"
                    auto-rotate
                    rotation-per-second="30deg"
                    camera-controls
                    disable-zoom
                    shadow-intensity="1"
                    exposure="1.2"
                    interaction-prompt="none"
                    style="width: 100%; height: 400px; background: transparent;">
                  </model-viewer>
                `
              }}
            />
          </div>
        </div>
      </section>

      {/* Monthly Sponsors Section */}
      <section className="py-16 px-6 bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-white">This Month's Prize Sponsors</h2>
          <div className="relative overflow-hidden">
            <div className="flex animate-scroll space-x-12">
              {[...sponsors, ...sponsors].map((sponsor, i) => (
                <div key={i} className="bg-gray-800 px-8 py-4 rounded-lg text-white whitespace-nowrap">
                  {sponsor}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Chalkboard Leaderboard */}
      <section id="leaderboard" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-12 text-white" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
            🏆 Current Leaders
          </h2>
          
          <div className="chalk-board p-8 relative">
            <div className="chalk-dust"></div>
            
            {/* Leaderboard Header */}
            <div className="grid grid-cols-12 gap-4 mb-6 pb-4 border-b-2 border-white/20">
              <div className="col-span-1 chalk-text text-xl font-bold">#</div>
              <div className="col-span-5 chalk-text text-xl font-bold">Idea</div>
              <div className="col-span-2 chalk-text text-xl font-bold">Creator</div>
              <div className="col-span-2 chalk-text text-xl font-bold">Category</div>
              <div className="col-span-2 chalk-text text-xl font-bold text-right">Votes</div>
            </div>

            {/* Leaderboard Items */}
            <div className="space-y-4">
              {leaderboardData.map((item, index) => (
                <div key={index} 
                     className={`leaderboard-item grid grid-cols-12 gap-4 p-3 rounded transition-all hover:translate-x-2 ${
                       index === 0 ? 'bg-yellow-500/10 border-2 border-yellow-400/30' :
                       index === 1 ? 'bg-gray-500/10 border-2 border-gray-400/30' :
                       index === 2 ? 'bg-orange-700/10 border-2 border-orange-600/30' :
                       'hover:bg-white/5'
                     }`}>
                  <div className="col-span-1 chalk-text text-2xl">{item.rank}</div>
                  <div className="col-span-5 chalk-text text-lg font-bold">{item.title}</div>
                  <div className="col-span-2 chalk-text">{item.creator}</div>
                  <div className="col-span-2 chalk-text">{item.category}</div>
                  <div className={`col-span-2 chalk-text text-xl font-bold text-right ${
                    index === 0 ? 'text-yellow-400' : 'text-white'
                  }`}>
                    {item.votes}
                  </div>
                </div>
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center mt-8">
              <Link href="/leaderboard" 
                    className="chalk-text text-xl hover:text-yellow-400 transition underline underline-offset-4">
                View All 2,847 Ideas →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Live Activity Feed */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-6 text-center text-white">🔴 Live Activity</h3>
          <div className="bg-gray-800/50 backdrop-blur rounded-lg p-6 space-y-3">
            {liveActivity.map((activity, i) => (
              <div key={i} className="flex items-center justify-between text-sm text-white">
                <span className="text-gray-400">{activity.time}</span>
                <span>{activity.action}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-800 mt-20">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>&copy; 2024 Make Me Famous. All rights reserved.</p>
          <p className="mt-2 text-sm">Where ideas compete for glory.</p>
        </div>
      </footer>

      <style jsx global>{`
        /* Static TV effect for text */
        @keyframes static {
          0%, 100% { 
            clip-path: inset(0 0 98% 0); 
            transform: translateX(0);
          }
          10% { 
            clip-path: inset(80% 0 10% 0); 
            transform: translateX(-2px);
          }
          20% { 
            clip-path: inset(20% 0 60% 0); 
            transform: translateX(2px);
          }
          30% { 
            clip-path: inset(90% 0 5% 0); 
            transform: translateX(-1px);
          }
          40% { 
            clip-path: inset(40% 0 40% 0); 
            transform: translateX(1px);
          }
          50% { 
            clip-path: inset(60% 0 30% 0); 
            transform: translateX(-2px);
          }
        }

        .static-text {
          position: relative;
          color: white;
          font-family: 'Bebas Neue', sans-serif;
        }

        .static-text::before,
        .static-text::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .static-text::before {
          animation: static 0.5s infinite;
          color: cyan;
          z-index: -1;
          left: 2px;
        }

        .static-text::after {
          animation: static 0.5s infinite reverse;
          color: magenta;
          z-index: -1;
          left: -2px;
        }

        /* Chalk text effect */
        .chalk-text {
          font-family: 'Kalam', cursive;
          color: white;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .chalk-board {
          background: linear-gradient(135deg, #2a4d3a 0%, #1e3a2e 100%);
          border: 12px solid #8b6f3a;
          border-radius: 8px;
          box-shadow: 
            inset 0 0 20px rgba(0,0,0,0.5),
            0 10px 30px rgba(0,0,0,0.3);
          position: relative;
          overflow: hidden;
        }

        .chalk-board::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 50px,
              rgba(255,255,255,0.02) 50px,
              rgba(255,255,255,0.02) 51px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 50px,
              rgba(255,255,255,0.02) 50px,
              rgba(255,255,255,0.02) 51px
            );
          pointer-events: none;
        }

        .chalk-dust {
          position: absolute;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(circle at 20% 30%, rgba(255,255,255,0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(255,255,255,0.04) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(255,255,255,0.03) 0%, transparent 50%);
          pointer-events: none;
        }

        /* Sponsor carousel animation */
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .animate-scroll {
          animation: scroll 30s linear infinite;
        }

        /* Global styles */
        body {
          background-color: #111827;
          color: white;
        }
      `}</style>
    </>
  )
}
