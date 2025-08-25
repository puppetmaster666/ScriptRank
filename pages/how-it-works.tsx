import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'

export default function HowItWorksPage() {
  const [activeStep, setActiveStep] = useState(1)

  return (
    <>
      <Head>
        <title>How It Works | Make Me Famous</title>
        <meta name="description" content="Learn how to submit your ideas and compete for fame and prizes" />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="px-8 py-20 bg-black text-white">
          <h1 className="text-center text-white" style={{ 
            fontFamily: 'DrukWide, Impact, sans-serif',
            fontSize: 'clamp(32px, 5vw, 64px)',
            fontWeight: 900,
            letterSpacing: '-0.02em',
            lineHeight: 1
          }}>
            HOW TO GET FAMOUS
          </h1>
          <p className="text-center mt-8 text-white opacity-90" style={{
            fontFamily: 'Courier New, monospace',
            fontSize: '18px',
            lineHeight: 1.6
          }}>
            IT'S BRUTALLY SIMPLE.
          </p>
        </section>

        {/* Interactive Steps */}
        <section className="px-8 py-16 max-w-6xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Left: Step Selector */}
            <div className="space-y-4">
              {[
                { num: 1, title: 'SUBMIT YOUR IDEA', icon: '💡' },
                { num: 2, title: 'GET ROASTED BY AI', icon: '🔥' },
                { num: 3, title: 'CLIMB THE LEADERBOARD', icon: '📈' },
                { num: 4, title: 'WIN PRIZES & FAME', icon: '🏆' }
              ].map((step) => (
                <div
                  key={step.num}
                  onClick={() => setActiveStep(step.num)}
                  className={`cursor-pointer transition-all duration-300 ${
                    activeStep === step.num ? 'scale-105' : 'scale-100 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className={`flex items-center gap-4 p-6 border-2 rounded-xl ${
                    activeStep === step.num 
                      ? 'border-black bg-black text-white' 
                      : 'border-gray-300 hover:border-gray-500'
                  }`}>
                    <div className="text-4xl">{step.icon}</div>
                    <div>
                      <div style={{ fontFamily: 'Bahnschrift, sans-serif' }} className="text-sm font-bold opacity-60">
                        STEP {step.num}
                      </div>
                      <div style={{ fontFamily: 'DrukWide, Impact, sans-serif' }} className="text-xl font-black">
                        {step.title}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Step Details */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-black p-8 min-h-[400px]">
              {activeStep === 1 && (
                <div className="space-y-6">
                  <h3 style={{ fontFamily: 'DrukWide, Impact, sans-serif' }} className="text-3xl font-black">
                    PITCH YOUR BIG IDEA
                  </h3>
                  <div style={{ fontFamily: 'Courier New, monospace' }} className="space-y-4 text-gray-700">
                    <p className="text-lg">Choose your category:</p>
                    <div className="grid gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🎬</span>
                        <span className="font-bold">Movies/TV</span> - Your next blockbuster script
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🎮</span>
                        <span className="font-bold">Games</span> - The game everyone will play
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">💼</span>
                        <span className="font-bold">Business</span> - Your billion-dollar startup
                      </div>
                    </div>
                    <p className="pt-4 text-sm">
                      Write 30-500 words explaining why your idea is THE NEXT BIG THING.
                      No fluff. Just pure vision.
                    </p>
                  </div>
                  <Link href="/submit">
                    <button className="mt-6 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition" 
                            style={{ fontFamily: 'Bahnschrift, sans-serif' }}>
                      START SUBMITTING →
                    </button>
                  </Link>
                </div>
              )}

              {activeStep === 2 && (
                <div className="space-y-6">
                  <h3 style={{ fontFamily: 'DrukWide, Impact, sans-serif' }} className="text-3xl font-black">
                    BRUTAL AI FEEDBACK
                  </h3>
                  <div style={{ fontFamily: 'Courier New, monospace' }} className="space-y-4 text-gray-700">
                    <p className="text-lg">Our AI judges like a harsh VC:</p>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                        <span className="font-bold">Market Potential</span>
                        <span className="text-xl">0-10</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                        <span className="font-bold">Innovation Score</span>
                        <span className="text-xl">0-10</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                        <span className="font-bold">Execution Difficulty</span>
                        <span className="text-xl">0-10</span>
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                      <p className="text-sm font-bold text-red-800">
                        ⚠️ WARNING: The AI doesn't sugarcoat. Most ideas score 3-6.
                        Only the truly exceptional hit 8+.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeStep === 3 && (
                <div className="space-y-6">
                  <h3 style={{ fontFamily: 'DrukWide, Impact, sans-serif' }} className="text-3xl font-black">
                    COMPETE FOR GLORY
                  </h3>
                  <div style={{ fontFamily: 'Courier New, monospace' }} className="space-y-4 text-gray-700">
                    <p className="text-lg">Your idea enters the arena:</p>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <span className="text-xl">👥</span>
                        <div>
                          <p className="font-bold">Public Voting</p>
                          <p className="text-sm">The community rates your idea 0-10</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-xl">💬</span>
                        <div>
                          <p className="font-bold">Get Feedback</p>
                          <p className="text-sm">Real people comment and critique</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-xl">📊</span>
                        <div>
                          <p className="font-bold">Live Rankings</p>
                          <p className="text-sm">Watch your idea climb in real-time</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm pt-4 italic">
                      Total Score = (AI Score + Public Score) / 2
                    </p>
                  </div>
                </div>
              )}

              {activeStep === 4 && (
                <div className="space-y-6">
                  <h3 style={{ fontFamily: 'DrukWide, Impact, sans-serif' }} className="text-3xl font-black">
                    REAL PRIZES AWAIT
                  </h3>
                  <div style={{ fontFamily: 'Courier New, monospace' }} className="space-y-4 text-gray-700">
                    <p className="text-lg font-bold">Monthly Winners Get:</p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🥇</span>
                        <div>
                          <p className="font-bold">1st Place: $2,000</p>
                          <p className="text-sm">+ Industry connections</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🥈</span>
                        <div>
                          <p className="font-bold">2nd Place: $1,000</p>
                          <p className="text-sm">+ Featured exposure</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🥉</span>
                        <div>
                          <p className="font-bold">3rd Place: $500</p>
                          <p className="text-sm">+ Premium subscription</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 p-4 bg-green-50 border-2 border-green-300 rounded-lg">
                      <p className="text-sm font-bold text-green-800">
                        💎 TOP IDEAS GET PITCHED TO REAL INVESTORS & STUDIOS
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Pricing Tiers */}
        <section className="px-8 py-16 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <h2 style={{ fontFamily: 'DrukWide, Impact, sans-serif' }} 
                className="text-4xl font-black text-center mb-12">
              CHOOSE YOUR WEAPON
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Free */}
              <div className="bg-white border-2 border-gray-300 rounded-xl p-6 hover:border-black transition">
                <div className="text-center mb-6">
                  <h3 style={{ fontFamily: 'Bahnschrift, sans-serif' }} className="text-2xl font-bold">
                    FREE
                  </h3>
                  <div className="text-4xl font-bold mt-2">$0</div>
                </div>
                <ul style={{ fontFamily: 'Courier New, monospace' }} className="space-y-3 text-sm">
                  <li>✓ 3 ideas per month</li>
                  <li>✓ AI feedback</li>
                  <li>✓ Public voting</li>
                  <li>✓ Leaderboard access</li>
                  <li className="opacity-50">✗ Priority processing</li>
                  <li className="opacity-50">✗ Profile badge</li>
                </ul>
              </div>

              {/* Starter */}
              <div className="bg-white border-2 border-blue-500 rounded-xl p-6 relative">
                <div className="text-center mb-6">
                  <h3 style={{ fontFamily: 'Bahnschrift, sans-serif' }} className="text-2xl font-bold">
                    STARTER
                  </h3>
                  <div className="text-4xl font-bold mt-2">$5<span className="text-lg">/mo</span></div>
                </div>
                <ul style={{ fontFamily: 'Courier New, monospace' }} className="space-y-3 text-sm">
                  <li>✓ 10 ideas per month</li>
                  <li>✓ Everything in Free</li>
                  <li>✓ Email notifications</li>
                  <li>✓ Basic analytics</li>
                  <li className="opacity-50">✗ Priority processing</li>
                  <li className="opacity-50">✗ Profile badge</li>
                </ul>
              </div>

              {/* Unlimited */}
              <div className="bg-gradient-to-b from-purple-50 to-white border-2 border-purple-500 rounded-xl p-6 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    BEST VALUE
                  </span>
                </div>
                <div className="text-center mb-6">
                  <h3 style={{ fontFamily: 'Bahnschrift, sans-serif' }} className="text-2xl font-bold">
                    UNLIMITED
                  </h3>
                  <div className="text-4xl font-bold mt-2">$10<span className="text-lg">/mo</span></div>
                </div>
                <ul style={{ fontFamily: 'Courier New, monospace' }} className="space-y-3 text-sm">
                  <li className="font-bold">✓ UNLIMITED ideas</li>
                  <li>✓ Everything in Starter</li>
                  <li>✓ Priority AI processing</li>
                  <li>✓ Profile badge ✨</li>
                  <li>✓ Advanced analytics</li>
                  <li>✓ Priority support</li>
                </ul>
              </div>
            </div>

            <div className="text-center mt-8">
              <Link href="/pricing">
                <button className="bg-black text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition"
                        style={{ fontFamily: 'Bahnschrift, sans-serif', fontSize: '18px' }}>
                  VIEW ALL PRICING OPTIONS →
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-8 py-16 max-w-4xl mx-auto">
          <h2 style={{ fontFamily: 'DrukWide, Impact, sans-serif' }} 
              className="text-4xl font-black text-center mb-12">
            QUESTIONS?
          </h2>
          
          <div className="space-y-6">
            <details className="border-2 border-black rounded-lg p-6 cursor-pointer group">
              <summary style={{ fontFamily: 'Bahnschrift, sans-serif' }} className="font-bold text-lg">
                Is the AI really that harsh?
              </summary>
              <p style={{ fontFamily: 'Courier New, monospace' }} className="mt-4 text-gray-700">
                Yes. It's trained to think like a skeptical VC who's seen it all. 
                Most ideas score between 3-6. If you get above 8, you might actually have something.
              </p>
            </details>

            <details className="border-2 border-black rounded-lg p-6 cursor-pointer group">
              <summary style={{ fontFamily: 'Bahnschrift, sans-serif' }} className="font-bold text-lg">
                Are the prizes real?
              </summary>
              <p style={{ fontFamily: 'Courier New, monospace' }} className="mt-4 text-gray-700">
                100% real. Winners are announced on the 1st of each month. 
                We've already given out over $50,000 to creators.
              </p>
            </details>

            <details className="border-2 border-black rounded-lg p-6 cursor-pointer group">
              <summary style={{ fontFamily: 'Bahnschrift, sans-serif' }} className="font-bold text-lg">
                Can I edit my idea after submitting?
              </summary>
              <p style={{ fontFamily: 'Courier New, monospace' }} className="mt-4 text-gray-700">
                No. Once submitted, your idea is locked in. This keeps the competition fair.
                Think before you submit!
              </p>
            </details>

            <details className="border-2 border-black rounded-lg p-6 cursor-pointer group">
              <summary style={{ fontFamily: 'Bahnschrift, sans-serif' }} className="font-bold text-lg">
                Who owns my idea?
              </summary>
              <p style={{ fontFamily: 'Courier New, monospace' }} className="mt-4 text-gray-700">
                You do! We never claim ownership of your ideas. 
                We're just here to help you test them and get famous.
              </p>
            </details>
          </div>
        </section>

        {/* CTA */}
        <section className="px-8 py-20 bg-black text-white text-center">
          <h2 style={{ fontFamily: 'DrukWide, Impact, sans-serif' }} 
              className="text-4xl font-black mb-6">
            READY TO PROVE YOURSELF?
          </h2>
          <p style={{ fontFamily: 'Courier New, monospace' }} className="text-xl mb-8 opacity-90">
            Your idea could be worth millions. Or nothing.<br/>
            There's only one way to find out.
          </p>
          <Link href="/submit">
            <button className="bg-white text-black px-12 py-5 rounded-lg hover:bg-gray-200 transition"
                    style={{ fontFamily: 'Bahnschrift, sans-serif', fontSize: '20px', fontWeight: 'bold' }}>
              SUBMIT YOUR IDEA NOW
            </button>
          </Link>
        </section>
      </div>
    </>
  )
}
