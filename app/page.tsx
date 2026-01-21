'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import Results from '@/components/Results';
import AISummary from '@/components/AISummary';
import ModelComparison from '@/components/ModelComparison';

export default function Home() {
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'results' | 'summary' | 'comparison'>('results');
  const [analysisTimestamp, setAnalysisTimestamp] = useState<number>(0);

  const handleAnalysisComplete = (data: any) => {
    setAnalysisData(data);
    setIsLoading(false);
    // Update timestamp to trigger cache refresh in child components
    setAnalysisTimestamp(Date.now());
  };

  const handleNewAnalysis = () => {
    setAnalysisData(null);
    setActiveTab('results');
    // Reset timestamp to clear any cached data
    setAnalysisTimestamp(Date.now());
  };

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="glass shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg animate-glow transform hover:scale-110 transition-transform duration-300">
              <span className="text-white text-3xl font-bold animate-pulse">⚡</span>
            </div>
            <div>
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Review Radar</h1>
              <p className="text-sm text-slate-600 font-medium">✨ Transform reviews into actionable insights with AI</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Section */}
        {!analysisData && (
          <div className="mb-8">
            <FileUpload 
              onAnalysisStart={() => setIsLoading(true)}
              onAnalysisComplete={handleAnalysisComplete}
            />
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="glass rounded-3xl shadow-2xl p-12 text-center animate-float">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-purple-500"></div>
              <div className="absolute inset-2 animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-500" style={{animationDirection: 'reverse', animationDuration: '1s'}}></div>
              <div className="h-20 w-20 flex items-center justify-center">
                <span className="text-3xl">🔮</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">Analyzing Your Reviews</h3>
            <p className="text-slate-600 mb-6">AI is processing your data with machine learning magic ✨</p>
            <div className="mt-6 max-w-md mx-auto">
              <div className="flex justify-between text-sm text-slate-600 mb-3 font-medium">
                <span>🚀 Processing</span>
                <span>⏱️ Max 120s</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden shadow-inner">
                <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 h-3 rounded-full animate-pulse" style={{ width: '60%', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}></div>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {analysisData && !isLoading && (
          <div>
            {/* Action Bar */}
            <div className="glass rounded-t-3xl shadow-lg border-b border-purple-200/30 p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex gap-3">
                  <button
                    onClick={() => setActiveTab('results')}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                      activeTab === 'results'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                        : 'bg-white/50 text-slate-700 hover:bg-white/80 hover:shadow-md'
                    }`}
                  >
                    <span className="mr-2">📊</span> Analysis Results
                  </button>
                  <button
                    onClick={() => setActiveTab('summary')}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                      activeTab === 'summary'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                        : 'bg-white/50 text-slate-700 hover:bg-white/80 hover:shadow-md'
                    }`}
                  >
                    <span className="mr-2">🤖</span> AI Summary
                  </button>
                  <button
                    onClick={() => setActiveTab('comparison')}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                      activeTab === 'comparison'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                        : 'bg-white/50 text-slate-700 hover:bg-white/80 hover:shadow-md'
                    }`}
                  >
                    <span className="mr-2">⚖️</span> Model Comparison
                  </button>
                </div>
                <button
                  onClick={handleNewAnalysis}
                  className="px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-xl hover:from-slate-700 hover:to-slate-800 font-semibold transition-all shadow-lg transform hover:scale-105"
                >
                  <span className="mr-2">↻</span> New Analysis
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="glass rounded-b-3xl shadow-2xl p-8">
              {activeTab === 'results' && <Results data={analysisData} />}
              {activeTab === 'summary' && <AISummary key={analysisTimestamp} />}
              {activeTab === 'comparison' && <ModelComparison key={analysisTimestamp} />}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-16 glass border-t border-white/20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-slate-600 font-medium">
            Built with <span className="text-red-500 animate-pulse">❤️</span> for sentiment analysis
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Backend: Flask + ML | Frontend: Next.js | Powered by AI ✨
          </p>
        </div>
      </footer>
    </main>
  );
}
