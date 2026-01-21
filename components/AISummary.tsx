'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import ReactMarkdown from 'react-markdown';

export default function AISummary() {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<'gemini' | 'openrouter'>('gemini');

  // Clear state when component mounts (happens when key changes)
  useEffect(() => {
    setSummary(null);
    setError(null);
  }, []);

  const generateSummary = async () => {
    setIsLoading(true);
    setError(null);
    // Clear any previous summary before fetching new
    setSummary(null);

    try {
      const result = await api.generateSummary(provider);
      setSummary(result.executive_summary);
      console.log('✅ Fresh AI summary generated');
    } catch (err: any) {
      setError(err.message || 'Failed to generate summary');
      console.error('❌ Summary generation failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <div className="bg-slate-50 rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">🤖 AI-Powered Executive Summary</h3>
        <p className="text-slate-600 mb-4">
          Generate a comprehensive executive summary using advanced language models to distill key insights, 
          strengths, weaknesses, and actionable recommendations from your analysis.
        </p>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex gap-2">
            <button
              onClick={() => setProvider('gemini')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                provider === 'gemini'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white border border-slate-300 text-slate-700 hover:border-primary-400'
              }`}
            >
              Google Gemini
            </button>
            <button
              onClick={() => setProvider('openrouter')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                provider === 'openrouter'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white border border-slate-300 text-slate-700 hover:border-primary-400'
              }`}
            >
              OpenRouter
            </button>
          </div>

          <button
            onClick={generateSummary}
            disabled={isLoading}
            className="px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all"
          >
            {isLoading ? '⏳ Generating...' : '✨ Generate Summary'}
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary-600 mb-4"></div>
          <p className="text-slate-600">AI is analyzing your data and crafting insights...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 rounded-lg border border-red-200 p-6">
          <h4 className="font-semibold text-red-900 mb-2">❌ Error</h4>
          <p className="text-red-700">{error}</p>
          <p className="text-sm text-red-600 mt-2">
            Make sure you've run the analysis first and that your API keys are configured.
          </p>
        </div>
      )}

      {/* Summary Display */}
      {summary && !isLoading && (
        <div className="bg-white rounded-lg border border-slate-200 p-8">
          <div className="prose prose-slate max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ node, ...props }) => <h1 className="text-3xl font-bold text-slate-900 mb-4" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-2xl font-semibold text-slate-900 mt-6 mb-3" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-xl font-semibold text-slate-900 mt-4 mb-2" {...props} />,
                p: ({ node, ...props }) => <p className="text-slate-700 mb-3 leading-relaxed" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-2 mb-4 text-slate-700" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal list-inside space-y-2 mb-4 text-slate-700" {...props} />,
                li: ({ node, ...props }) => <li className="ml-4" {...props} />,
                strong: ({ node, ...props }) => <strong className="font-semibold text-slate-900" {...props} />,
                code: ({ node, ...props }) => <code className="bg-slate-100 px-2 py-1 rounded text-sm font-mono text-slate-800" {...props} />,
              }}
            >
              {summary}
            </ReactMarkdown>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <button
              onClick={() => {
                const blob = new Blob([summary], { type: 'text/markdown' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'executive-summary.md';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
              }}
              className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 font-medium transition-colors"
            >
              📄 Download Summary
            </button>
          </div>
        </div>
      )}

      {/* Placeholder */}
      {!summary && !isLoading && !error && (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <div className="text-6xl mb-4">🤖</div>
          <h4 className="text-lg font-semibold text-slate-900 mb-2">No Summary Generated Yet</h4>
          <p className="text-slate-600">
            Click "Generate Summary" above to create an AI-powered executive summary of your analysis results.
          </p>
        </div>
      )}
    </div>
  );
}
