'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export default function ModelComparison() {
  const [comparison, setComparison] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  // Clear state when component mounts (happens when key changes)
  useEffect(() => {
    setComparison(null);
    setError(null);
    setLastFetchTime(0);
  }, []);

  const runComparison = async () => {
    setIsLoading(true);
    setError(null);
    // Clear any previous comparison data before fetching new
    setComparison(null);

    try {
      const result = await api.compareModels();
      setComparison(result);
      setLastFetchTime(Date.now());
      console.log('✅ Fresh comparison data fetched:', result.metrics?.comparison);
    } catch (err: any) {
      setError(err.message || 'Failed to run comparison');
      console.error('❌ Comparison failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <div className="glass rounded-2xl border border-purple-200/30 p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span className="text-2xl">⚖️</span> Model Performance Comparison
        </h3>
        <p className="text-slate-600 mb-4 text-lg">
          Compare VADER (rule-based) vs TF-IDF + Logistic Regression (ML-based) sentiment analysis models 
          on your dataset. See which approach performs better for your specific use case.
        </p>

        <div className="flex items-center gap-4 flex-wrap">
          <button
            onClick={runComparison}
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-bold transition-all transform hover:scale-105"
          >
            {isLoading ? '⏳ Running Comparison...' : '▶️ Run Comparison'}
          </button>
          
          {lastFetchTime > 0 && (
            <span className="text-sm text-slate-600 bg-white/50 px-4 py-2 rounded-lg">
              Last updated: {new Date(lastFetchTime).toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="glass rounded-2xl shadow-xl p-12 text-center animate-float">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
            <div className="absolute inset-2 animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-pink-500" style={{animationDirection: 'reverse', animationDuration: '1s'}}></div>
            <div className="h-16 w-16 flex items-center justify-center">
              <span className="text-2xl">⚖️</span>
            </div>
          </div>
          <p className="text-slate-700 font-semibold text-lg">Evaluating both models on your dataset...</p>
          <p className="text-slate-500 text-sm mt-2">Fetching fresh comparison data 🔄</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 rounded-lg border border-red-200 p-6">
          <h4 className="font-semibold text-red-900 mb-2">❌ Error</h4>
          <p className="text-red-700">{error}</p>
          <p className="text-sm text-red-600 mt-2">
            Make sure you've uploaded and analyzed data before running model comparison.
          </p>
        </div>
      )}

      {/* Comparison Results */}
      {comparison && !isLoading && (
        <div className="space-y-6">
          {/* Metrics Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* VADER Card */}
            <div className="bg-white rounded-lg border-2 border-blue-200 p-6">
              <h4 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                <span>📚</span> VADER (Rule-Based)
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-700 font-medium">Accuracy</span>
                  <span className="text-lg font-bold text-blue-900">
                    {(comparison.metrics.vader.accuracy * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-700 font-medium">Precision</span>
                  <span className="text-lg font-bold text-blue-900">
                    {(comparison.metrics.vader.precision * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-700 font-medium">Recall</span>
                  <span className="text-lg font-bold text-blue-900">
                    {(comparison.metrics.vader.recall * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-700 font-medium">F1 Score</span>
                  <span className="text-lg font-bold text-blue-900">
                    {(comparison.metrics.vader.f1 * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Logistic Regression Card */}
            <div className="bg-white rounded-lg border-2 border-green-200 p-6">
              <h4 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
                <span>🤖</span> TF-IDF + Logistic Regression
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-700 font-medium">Accuracy</span>
                  <span className="text-lg font-bold text-green-900">
                    {(comparison.metrics.logistic_regression.accuracy * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-700 font-medium">Precision</span>
                  <span className="text-lg font-bold text-green-900">
                    {(comparison.metrics.logistic_regression.precision * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-700 font-medium">Recall</span>
                  <span className="text-lg font-bold text-green-900">
                    {(comparison.metrics.logistic_regression.recall * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-700 font-medium">F1 Score</span>
                  <span className="text-lg font-bold text-green-900">
                    {(comparison.metrics.logistic_regression.f1 * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Agreement Stats */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 p-6">
            <h4 className="text-lg font-semibold text-purple-900 mb-3">Model Agreement</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-3xl font-bold text-purple-900">
                  {comparison.metrics.comparison.agreement_percent.toFixed(2)}%
                </div>
                <div className="text-sm text-purple-700">Models Agree</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-900">
                  {comparison.metrics.comparison.test_size}
                </div>
                <div className="text-sm text-purple-700">Test Samples</div>
              </div>
            </div>
          </div>

          {/* Winner */}
          <div className={`rounded-lg border-2 p-6 ${
            comparison.metrics.logistic_regression.accuracy > comparison.metrics.vader.accuracy
              ? 'bg-green-50 border-green-300'
              : comparison.metrics.vader.accuracy > comparison.metrics.logistic_regression.accuracy
              ? 'bg-blue-50 border-blue-300'
              : 'bg-slate-50 border-slate-300'
          }`}>
            <h4 className="text-lg font-semibold text-slate-900 mb-2">🏆 Recommended Model</h4>
            <p className="text-slate-700">
              {comparison.metrics.logistic_regression.accuracy > comparison.metrics.vader.accuracy
                ? '✅ TF-IDF + Logistic Regression performs better on your dataset'
                : comparison.metrics.vader.accuracy > comparison.metrics.logistic_regression.accuracy
                ? '✅ VADER performs better on your dataset'
                : '⚖️ Both models perform equally on your dataset'}
            </p>
          </div>

          {/* Analysis Report */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">📋 Detailed Analysis Report</h4>
            <pre className="bg-slate-50 rounded-lg p-4 text-sm text-slate-700 overflow-x-auto whitespace-pre-wrap font-mono">
              {comparison.report}
            </pre>
          </div>

          {/* Download Button */}
          <div className="flex gap-3">
            <button
              onClick={async () => {
                const blob = await api.downloadFile('model_comparison_metrics.json');
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'model_comparison_metrics.json';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
              }}
              className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 font-medium transition-colors"
            >
              📊 Download Metrics (JSON)
            </button>
            <button
              onClick={async () => {
                const blob = await api.downloadFile('model_comparison_report.txt');
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'model_comparison_report.txt';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
              }}
              className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 font-medium transition-colors"
            >
              📄 Download Report (TXT)
            </button>
          </div>
        </div>
      )}

      {/* Placeholder */}
      {!comparison && !isLoading && !error && (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <div className="text-6xl mb-4">⚖️</div>
          <h4 className="text-lg font-semibold text-slate-900 mb-2">No Comparison Run Yet</h4>
          <p className="text-slate-600">
            Click "Run Comparison" above to evaluate both sentiment analysis models on your dataset.
          </p>
        </div>
      )}
    </div>
  );
}
