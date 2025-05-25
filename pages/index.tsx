import Head from 'next/head'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Head>
        <title>ScriptRank</title>
      </Head>
      <header className="bg-blue-700 text-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">🎥 ScriptRank</h1>
          <nav className="space-x-4">
            <a href="/leaderboard" className="hover:underline">Leaderboard</a>
            <a href="/upload" className="hover:underline">Upload</a>
            <a href="/profile" className="hover:underline">Profile</a>
            <a href="/login" className="hover:underline">Login</a>
          </nav>
        </div>
      </header>
      <main className="max-w-4xl mx-auto py-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Get Your Script Rated by AI</h2>
        <p className="text-lg mb-8">Upload your script and get brutally honest AI feedback and a score.</p>
        <a href="/register" className="px-6 py-3 bg-white text-blue-700 font-bold rounded shadow hover:bg-gray-100">
          Get Started
        </a>
      </main>
    </div>
  )
}
