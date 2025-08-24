// components/ArchiveSidebar.tsx
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getRecentArchives, checkAndArchiveLastMonth } from '@/lib/archive-system';

interface ArchivedIdea {
  id: string;
  rank: number;
  title: string;
  type: 'movie' | 'game' | 'business';
  username: string;
  aiScores: {
    overall: number;
  };
  publicScore: {
    average: number;
    count: number;
  };
}

interface MonthlyArchive {
  month: string;
  displayMonth: string;
  topIdeas: ArchivedIdea[];
  totalIdeas: number;
  stats: {
    averageScore: number;
    topScore: number;
    totalVotes: number;
  };
}

export default function ArchiveSidebar() {
  const [archives, setArchives] = useState<MonthlyArchive[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArchives = async () => {
      try {
        // Check if we need to archive last month (runs on 1st of month)
        await checkAndArchiveLastMonth();
        
        // Load recent archives for sidebar
        const recentArchives = await getRecentArchives();
        setArchives(recentArchives);
      } catch (error) {
        console.error('Error loading archives:', error);
      } finally {
        setLoading(false);
      }
    };

    loadArchives();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map(i => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map(j => (
                <div key={j} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (archives.length === 0) {
    return (
      <div className="bg-gray-50 rounded-xl p-6 text-center">
        <div className="text-gray-500 text-sm">
          No archived months yet
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {archives.map((archive) => (
        <Link 
          key={archive.month}
          href={`/archive/${archive.month}`}
          className="block"
        >
          <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100 hover:border-blue-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900">
                Top 5 {archive.displayMonth}
              </h3>
              <span className="text-xs text-gray-500">
                {archive.totalIdeas} ideas
              </span>
            </div>

            {/* Top 5 List */}
            <div className="space-y-2">
              {archive.topIdeas.slice(0, 5).map((idea, index) => (
                <div key={idea.id} className="flex items-center gap-2 text-sm">
                  {/* Rank Badge */}
                  <div className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                    ${index === 0 ? 'bg-yellow-400 text-gray-900' : 
                      index === 1 ? 'bg-gray-300 text-gray-900' : 
                      index === 2 ? 'bg-amber-600 text-white' : 
                      'bg-gray-100 text-gray-600'}
                  `}>
                    {index + 1}
                  </div>
                  
                  {/* Title & Score */}
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-gray-900 font-medium">
                      {idea.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {idea.username} • {idea.aiScores.overall.toFixed(2)}
                    </div>
                  </div>
                  
                  {/* Type Icon */}
                  <div className="text-lg">
                    {idea.type === 'movie' ? '🎬' : 
                     idea.type === 'game' ? '🎮' : '💼'}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Avg: {archive.stats.averageScore.toFixed(2)}</span>
                <span className="text-blue-600 hover:text-blue-700 font-medium">
                  View Full Leaderboard →
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
