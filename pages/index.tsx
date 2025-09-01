import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { motion } from 'framer-motion'
import { ChevronRight, Star, TrendingUp, Shield, Zap, Users, Trophy, ArrowRight, Check, X, Brain, Target, Rocket } from 'lucide-react'

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'movie' | 'game' | 'business'>('all')
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })
    return () => unsubscribe()
  }, [])

  const leaderboard = [
    { rank: 1, title: 'Neon Nights', type: 'movie', author: 'Michael Rodriguez', aiScore: 8.73, publicScore: 9.1, votes: 234, trending: true, verdict: 'INVEST' },
    { rank: 2, title: 'GreenEats', type: 'business', author: 'David Park', aiScore: 8.43, publicScore: 8.7, votes: 189, trending: true, verdict: 'INVEST' },
    { rank: 3, title: 'Battle Royale Chess', type: 'game', author: 'James Mitchell', aiScore: 8.04, publicScore: 8.3, votes: 167, verdict: 'MAYBE' },
  ]

  const filteredLeaderboard = activeTab === 'all' 
    ? leaderboard 
    : leaderboard.filter(idea => idea.type === activeTab)

  return (
    <>
      <Head>
        <title>Hyoka - Get Your Ideas Brutally Evaluated by AI</title>
        <meta name="description" content="Skip the marketing budget. Let AI judge your idea. Get on the leaderboard. Win real prizes." />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
        
        {/* Navigation */}
        <nav className="absolute top-0 left-0 right-0 z-50 px-6 py-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">H</span>
              </div>
              <span className="text-white font-bold text-xl">Hyoka</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-6"
            >
              <Link href="/how-it-works">
                <a className="text-gray-300 hover:text-white transition">How it Works</a>
              </Link>
              <Link href="/leaderboard">
                <a className="text-gray-300 hover:text-white transition">Leaderboard</a>
              </Link>
              <Link href="/pricing">
                <a className="text-gray-300 hover:text-white transition">Pricing</a>
              </Link>
              {user ? (
                <Link href="/dashboard">
                  <a className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition">
                    Dashboard
                  </a>
                </Link>
              ) : (
                <Link href="/submit">
                  <a className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition">
                    Submit Idea → 
                  </a>
                </Link>
              )}
            </motion.div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative px-6 pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20"></div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative max-w-7xl mx-auto text-center"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-400 text-sm mb-8">
              <Zap className="w-4 h-4" />
              <span>No marketing budget needed, just pure innovation</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Get Your Ideas<br/>
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Brutally Evaluated
              </span><br/>
              by Elite AI
            </h1>
            
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
              Skip the expensive marketing campaigns. Let our advanced AI system score your movie, game, or business idea. 
              Rise through the ranks. Win monthly prizes. Get discovered by real investors.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/submit">
                <a className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold text-lg hover:shadow-xl hover:shadow-purple-500/25 transition transform hover:scale-105">
                  Submit Your Idea
                  <ArrowRight className="inline ml-2 w-5 h-5" />
                </a>
              </Link>
              <Link href="/leaderboard">
                <a className="px-8 py-4 bg-white/10 backdrop-blur border border-white/20 text-white rounded-full font-semibold text-lg hover:bg-white/20 transition">
                  View Leaderboard
                </a>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-white">$5,000</div>
                <div className="text-gray-400 text-sm">Monthly Prizes</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-white">2,847+</div>
                <div className="text-gray-400 text-sm">Ideas Evaluated</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-white">89%</div>
                <div className="text-gray-400 text-sm">Success Rate</div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Why Choose Us */}
        <section className="px-6 py-20 bg-black/50">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Why Creators Choose Hyoka
              </h2>
              <p className="text-gray-400">No Kickstarter? No problem. We level the playing field.</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Brain className="w-8 h-8" />,
                  title: "Elite AI Evaluation",
                  description: "Our AI thinks like top VCs and studio executives. Get professional-grade feedback instantly.",
                  gradient: "from-blue-500 to-purple-500"
                },
                {
                  icon: <Shield className="w-8 h-8" />,
                  title: "Zero Marketing Cost",
                  description: "Others need $10K+ for campaigns. Here, great ideas rise on merit alone.",
                  gradient: "from-purple-500 to-pink-500"
                },
                {
                  icon: <Trophy className="w-8 h-8" />,
                  title: "Real Prizes & Exposure",
                  description: "Monthly cash prizes plus direct access to investors actively seeking new projects.",
                  gradient: "from-pink-500 to-orange-500"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition duration-300 rounded-2xl blur-xl"
                    style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }}
                  ></div>
                  <div className="relative bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center text-white mb-6`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Live Leaderboard Preview */}
        <section className="px-6 py-20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full text-red-400 text-sm mb-4">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span>LIVE RANKINGS</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Today's Top Performers
              </h2>
              <p className="text-gray-400">Watch ideas battle for supremacy in real-time</p>
            </motion.div>

            {/* Tabs */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex bg-gray-900/50 backdrop-blur rounded-full p-1">
                {['all', 'movie', 'game', 'business'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-6 py-2 rounded-full font-medium transition ${
                      activeTab === tab
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {tab === 'all' ? 'All' : tab === 'movie' ? '🎬 Movies' : tab === 'game' ? '🎮 Games' : '💼 Business'}
                  </button>
                ))}
              </div>
            </div>

            {/* Leaderboard Cards */}
            <div className="space-y-4">
              {filteredLeaderboard.map((item, index) => (
                <motion.div
                  key={item.rank}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onMouseEnter={() => setHoveredCard(item.rank)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="relative group"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${
                    item.rank === 1 ? 'from-yellow-500/20 to-orange-500/20' :
                    item.rank === 2 ? 'from-gray-400/20 to-gray-500/20' :
                    'from-amber-600/20 to-amber-700/20'
                  } opacity-0 group-hover:opacity-100 transition duration-300 rounded-2xl blur-xl`}></div>
                  
                  <div className="relative bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        {/* Rank */}
                        <div className={`text-4xl font-bold ${
                          item.rank === 1 ? 'text-yellow-500' :
                          item.rank === 2 ? 'text-gray-400' :
                          'text-amber-600'
                        }`}>
                          #{item.rank}
                        </div>
                        
                        {/* Content */}
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-bold text-white">{item.title}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              item.type === 'movie' ? 'bg-blue-500/20 text-blue-400' :
                              item.type === 'game' ? 'bg-purple-500/20 text-purple-400' :
                              'bg-green-500/20 text-green-400'
                            }`}>
                              {item.type.toUpperCase()}
                            </span>
                            {item.trending && (
                              <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium flex items-center space-x-1">
                                <TrendingUp className="w-3 h-3" />
                                <span>TRENDING</span>
                              </span>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm">by {item.author}</p>
                        </div>
                      </div>
                      
                      {/* Scores */}
                      <div className="flex items-center space-x-8">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">{item.aiScore}</div>
                          <div className="text-xs text-gray-500">AI Score</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">{item.publicScore}</div>
                          <div className="text-xs text-gray-500">Public ({item.votes})</div>
                        </div>
                        <div className={`px-4 py-2 rounded-lg font-bold ${
                          item.verdict === 'INVEST' ? 'bg-green-500/20 text-green-400' :
                          item.verdict === 'MAYBE' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {item.verdict}
                        </div>
                      </div>
                    </div>
                    
                    {hoveredCard === item.rank && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 pt-4 border-t border-gray-800"
                      >
                        <Link href={`/ideas/${item.rank}`}>
                          <a className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition">
                            <span>View Full Analysis</span>
                            <ChevronRight className="w-4 h-4" />
                          </a>
                        </Link>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href="/leaderboard">
                <a className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition text-lg font-medium">
                  <span>View Full Leaderboard</span>
                  <ArrowRight className="w-5 h-5" />
                </a>
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="px-6 py-20 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                The Battle System
              </h2>
              <p className="text-gray-400">Four steps to validation and victory</p>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: 1, title: "Submit Your Weapon", desc: "30-500 words. That's all you need.", icon: <Rocket /> },
                { step: 2, title: "Face the AI Judge", desc: "Get scored 0-10. No sugarcoating.", icon: <Brain /> },
                { step: 3, title: "Community Votes", desc: "Real people rate your brilliance.", icon: <Users /> },
                { step: 4, title: "Claim Victory", desc: "Top ideas win cash and exposure.", icon: <Trophy /> }
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="bg-gradient-to-b from-gray-900/50 to-gray-900/30 backdrop-blur border border-gray-800 rounded-2xl p-6 h-full">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white mb-4">
                      {item.icon}
                    </div>
                    <div className="text-purple-400 font-bold mb-2">STEP {item.step}</div>
                    <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </div>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                      <ChevronRight className="w-6 h-6 text-gray-700" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Preview */}
        <section className="px-6 py-20">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Choose Your Arsenal
              </h2>
              <p className="text-gray-400">Start free. Upgrade when you're ready to dominate.</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  name: "Free",
                  price: "$0",
                  features: ["3 submissions/month", "AI evaluation", "Public voting", "Leaderboard access"],
                  cta: "Start Free",
                  popular: false
                },
                {
                  name: "Starter",
                  price: "$5",
                  features: ["10 submissions/month", "Priority processing", "Detailed analytics", "Email notifications"],
                  cta: "Go Starter",
                  popular: false
                },
                {
                  name: "Unlimited",
                  price: "$10",
                  features: ["Unlimited submissions", "Instant processing", "Profile badge ✨", "Direct investor access"],
                  cta: "Go Unlimited",
                  popular: true
                }
              ].map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative ${plan.popular ? 'scale-105' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full">
                        MOST POPULAR
                      </span>
                    </div>
                  )}
                  <div className={`bg-gray-900/50 backdrop-blur border ${plan.popular ? 'border-purple-500' : 'border-gray-800'} rounded-2xl p-8 h-full`}>
                    <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                    <div className="text-3xl font-bold text-white mb-6">
                      {plan.price}
                      <span className="text-gray-400 text-base font-normal">/month</span>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start space-x-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-300 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href="/pricing">
                      <a className={`block w-full py-3 rounded-full font-semibold text-center transition ${
                        plan.popular
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/25'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}>
                        {plan.cta}
                      </a>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur border border-purple-500/30 rounded-3xl p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Prove Your Brilliance?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                No budget? No network? No problem.<br/>
                Your idea could be worth millions. Let's find out.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/submit">
                  <a className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold text-lg hover:shadow-xl hover:shadow-purple-500/25 transition transform hover:scale-105">
                    Submit Your Idea Now
                    <ArrowRight className="inline ml-2 w-5 h-5" />
                  </a>
                </Link>
                <Link href="/how-it-works">
                  <a className="px-8 py-4 bg-white/10 backdrop-blur border border-white/20 text-white rounded-full font-semibold text-lg hover:bg-white/20 transition">
                    Learn More
                  </a>
                </Link>
              </div>
              
              <div className="mt-8 flex items-center justify-center space-x-8 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Your ideas are protected</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4" />
                  <span>4.9/5 creator rating</span>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="px-6 py-12 border-t border-gray-800">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">H</span>
                  </div>
                  <span className="text-white font-bold">Hyoka</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Where brilliant ideas battle for supremacy.
                </p>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-4">Product</h4>
                <ul className="space-y-2">
                  <li><Link href="/how-it-works"><a className="text-gray-400 hover:text-white transition text-sm">How it Works</a></Link></li>
                  <li><Link href="/pricing"><a className="text-gray-400 hover:text-white transition text-sm">Pricing</a></Link></li>
                  <li><Link href="/leaderboard"><a className="text-gray-400 hover:text-white transition text-sm">Leaderboard</a></Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-4">Company</h4>
                <ul className="space-y-2">
                  <li><Link href="/about"><a className="text-gray-400 hover:text-white transition text-sm">About</a></Link></li>
                  <li><Link href="/blog"><a className="text-gray-400 hover:text-white transition text-sm">Blog</a></Link></li>
                  <li><Link href="/careers"><a className="text-gray-400 hover:text-white transition text-sm">Careers</a></Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li><Link href="/privacy"><a className="text-gray-400 hover:text-white transition text-sm">Privacy</a></Link></li>
                  <li><Link href="/terms"><a className="text-gray-400 hover:text-white transition text-sm">Terms</a></Link></li>
                  <li><Link href="/cookies"><a className="text-gray-400 hover:text-white transition text-sm">Cookies</a></Link></li>
                </ul>
              </div>
            </div>
            
            <div className="pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
              © 2024 Hyoka. All rights reserved. Built for creators who refuse to play by old rules.
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
