// pages/index.tsx - COMPLETE FILE
import Head from 'next/head'
import Link from 'next/link'
import LeaderboardPage from './leaderboard'
import ArchiveSidebar from '@/components/ArchiveSidebar'

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Make Me Famous | AI-Powered Idea Analysis</title>
        <meta name="description" content="Submit your ideas for movies, games, or business and get evaluated by AI and human reviewers." />
      </Head>

      {/* Hero Section */}
      <section className="pt-28 pb-24 px-6 bg-blue-600 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-800 rounded-full opacity-20 blur-3xl transform translate-x-20 -translate-y-10"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center">
            <h1 className="text-5xl font-extrabold leading-tight mb-6 drop-shadow">
              Think you have the next big idea?
              <br />
              Prove it on the <span className="underline decoration-white">leaderboard</span>.
            </h1>
            <p className="text-lg text-blue-100 mb-10">
              Submit your idea for a movie, game, or business. Get evaluated by our AI. Rise in the ranks.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/submit" className="bg-white text-blue-700 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors">
                Submit Your Idea
              </Link>
              <Link href="#leaderboard" className="border border-white text-white px-6 py-3 rounded-lg font-bold hover:bg-white hover:text-blue-700 transition-colors">
                View Leaderboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard Section with Archive Sidebar */}
      <section id="leaderboard" className="py-20 px-6 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Leaderboard - Takes 3 columns */}
            <div className="lg:col-span-3">
              <LeaderboardPage />
            </div>
            
            {/* Archive Sidebar - Takes 1 column */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>📚</span> Previous Months
                </h2>
                <ArchiveSidebar />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              How It Works
            </h2>
            <p className="text-gray-600 text-lg">
              Professional idea feedback in minutes, not weeks.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '📝',
                title: '1. Submit',
                description: 'Upload your idea and a short description. No fluff. No frills.'
              },
              {
                icon: '⚡',
                title: '2. Analyze',
                description: 'Our AI digs in immediately. No waiting rooms.'
              },
              {
                icon: '🏆',
                title: '3. Compete',
                description: 'Join the leaderboard. Watch your idea rise (or crash).'
              }
            ].map((step, index) => (
              <div key={index} className="bg-blue-50 p-6 rounded-xl shadow hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold text-blue-800 mb-2">{step.title}</h3>
                <p className="text-gray-700">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">What Creators Are Saying</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Lena M.',
                quote: 'Brutally honest. Exactly what I needed to sharpen my story.',
                title: 'Screenwriter, Berlin'
              },
              {
                name: 'Jamal K.',
                quote: 'This AI gave me a 4.2 and I am not even mad. It was right.',
                title: 'Game Developer, London'
              },
              {
                name: 'Daisy P.',
                quote: 'The leaderboard is addictive. It pushed me to rewrite twice.',
                title: 'Entrepreneur, NYC'
              }
            ].map((review, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl shadow transition-transform hover:-translate-y-1 hover:shadow-xl">
                <p className="text-gray-800 text-lg italic mb-4">"{review.quote}"</p>
                <div className="text-sm text-gray-500">
                  <strong className="text-gray-900">{review.name}</strong> — {review.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-blue-700 text-white py-16 px-6 mt-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold mb-4">Make Me Famous</h3>
            <p className="text-blue-100 text-sm mb-2">
              AI-powered idea analysis for bold creators.
            </p>
            <p className="text-blue-100 text-sm">© {new Date().getFullYear()} Make Me Famous. All rights reserved.</p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-2">Stay in the loop</h4>
            <p className="text-blue-100 text-sm mb-4">
              Get updates on features, contests, and tips.
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="px-4 py-2 rounded-lg text-black w-full sm:w-auto flex-1"
              />
              <button
                type="submit"
                className="bg-white text-blue-700 font-semibold px-5 py-2 rounded-lg hover:bg-blue-100 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </footer>
    </>
  )
}
