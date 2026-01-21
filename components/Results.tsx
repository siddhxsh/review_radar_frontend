'use client';

import { api } from '@/lib/api';
import { useState } from 'react';

interface ResultsProps {
  data: any;
}

export default function Results({ data }: ResultsProps) {
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);

  const handleDownload = async (filename: string, displayName: string) => {
    setDownloadingFile(filename);
    try {
      const blob = await api.downloadFile(filename);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = displayName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      alert('Failed to download file');
    } finally {
      setDownloadingFile(null);
    }
  };

  const { summary, data: analysisData, output_files } = data;
  const downloadFiles: Record<string, string> = output_files ?? {};

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 hover:shadow-2xl transition-all duration-300">
          <div className="text-5xl mb-3 animate-float">📊</div>
          <div className="text-4xl font-extrabold mb-1">{summary.total_reviews.toLocaleString()}</div>
          <div className="text-sm font-semibold opacity-90">Total Reviews</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 hover:shadow-2xl transition-all duration-300">
          <div className="text-5xl mb-3 animate-float">😊</div>
          <div className="text-4xl font-extrabold mb-1">{summary.sentiment_summary.positive.toLocaleString()}</div>
          <div className="text-sm font-semibold opacity-90">Positive</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 hover:shadow-2xl transition-all duration-300">
          <div className="text-5xl mb-3 animate-float">😐</div>
          <div className="text-4xl font-extrabold mb-1">{summary.sentiment_summary.neutral.toLocaleString()}</div>
          <div className="text-sm font-semibold opacity-90">Neutral</div>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 hover:shadow-2xl transition-all duration-300">
          <div className="text-5xl mb-3 animate-float">😞</div>
          <div className="text-4xl font-extrabold mb-1">{summary.sentiment_summary.negative.toLocaleString()}</div>
          <div className="text-sm font-semibold opacity-90">Negative</div>
        </div>
      </div>

      {/* Sentiment Distribution Chart */}
      <div className="glass rounded-2xl p-6 border border-purple-200/30">
        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <span className="text-2xl">📊</span> Sentiment Distribution
        </h3>
        <div className="flex items-center gap-1 h-12 rounded-full overflow-hidden shadow-lg">
          <div
            className="bg-gradient-to-r from-green-500 to-emerald-600 h-full flex items-center justify-center text-white text-sm font-bold transition-all hover:shadow-xl"
            style={{
              width: `${(summary.sentiment_summary.positive / summary.total_reviews) * 100}%`,
            }}
          >
            {summary.sentiment_summary.positive > 0 && `${((summary.sentiment_summary.positive / summary.total_reviews) * 100).toFixed(1)}%`}
          </div>
          <div
            className="bg-gradient-to-r from-yellow-500 to-orange-500 h-full flex items-center justify-center text-white text-sm font-bold transition-all hover:shadow-xl"
            style={{
              width: `${(summary.sentiment_summary.neutral / summary.total_reviews) * 100}%`,
            }}
          >
            {summary.sentiment_summary.neutral > 0 && `${((summary.sentiment_summary.neutral / summary.total_reviews) * 100).toFixed(1)}%`}
          </div>
          <div
            className="bg-gradient-to-r from-red-500 to-pink-600 h-full flex items-center justify-center text-white text-sm font-bold transition-all hover:shadow-xl"
            style={{
              width: `${(summary.sentiment_summary.negative / summary.total_reviews) * 100}%`,
            }}
          >
            {summary.sentiment_summary.negative > 0 && `${((summary.sentiment_summary.negative / summary.total_reviews) * 100).toFixed(1)}%`}
          </div>
        </div>
      </div>

      {/* Keywords Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Positive Keywords */}
        <div className="glass rounded-2xl border-2 border-green-200/50 p-6 hover:shadow-xl transition-shadow">
          <h3 className="text-xl font-bold text-slate-900 mb-5 flex items-center gap-2">
            <span className="text-green-500 text-2xl">✓</span> Top Positive Keywords
          </h3>
          {analysisData.positive_keywords.length > 0 ? (
            <div className="space-y-3">
              {analysisData.positive_keywords.slice(0, 10).map((kw: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:shadow-md transition-all">
                  <span className="text-slate-800 font-bold">🌟 {kw.word}</span>
                  <span className="text-sm text-slate-600 font-mono bg-white px-3 py-1 rounded-full">{kw.score_adj_mean_over_df.toFixed(3)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500">No keywords found</p>
          )}
        </div>

        {/* Negative Keywords */}
        <div className="glass rounded-2xl border-2 border-red-200/50 p-6 hover:shadow-xl transition-shadow">
          <h3 className="text-xl font-bold text-slate-900 mb-5 flex items-center gap-2">
            <span className="text-red-500 text-2xl">✗</span> Top Negative Keywords
          </h3>
          {analysisData.negative_keywords.length > 0 ? (
            <div className="space-y-3">
              {analysisData.negative_keywords.slice(0, 10).map((kw: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl hover:shadow-md transition-all">
                  <span className="text-slate-800 font-bold">💥 {kw.word}</span>
                  <span className="text-sm text-slate-600 font-mono bg-white px-3 py-1 rounded-full">{kw.score_adj_mean_over_df.toFixed(3)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500">No keywords found</p>
          )}
        </div>
      </div>

      {/* Aspect Sentiment Analysis */}
      {analysisData.aspect_sentiment.length > 0 && (
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Aspect Sentiment Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Aspect</th>
                  <th className="text-center py-3 px-4 font-semibold text-green-700">Positive</th>
                  <th className="text-center py-3 px-4 font-semibold text-yellow-700">Neutral</th>
                  <th className="text-center py-3 px-4 font-semibold text-red-700">Negative</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">Not Mentioned</th>
                </tr>
              </thead>
              <tbody>
                {analysisData.aspect_sentiment.map((aspect: any, idx: number) => (
                  <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-slate-900">{aspect.aspect}</td>
                    <td className="text-center py-3 px-4 text-green-700">{aspect.Positive}</td>
                    <td className="text-center py-3 px-4 text-yellow-700">{aspect.Neutral}</td>
                    <td className="text-center py-3 px-4 text-red-700">{aspect.Negative}</td>
                    <td className="text-center py-3 px-4 text-slate-500">{aspect['Not Mentioned']}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Component Failures */}
      {analysisData.failure_components.length > 0 && (
        <div className="bg-red-50 rounded-lg border border-red-200 p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center gap-2">
            <span>⚠️</span> Component Failures Detected
          </h3>
          <div className="space-y-3">
            {analysisData.failure_components.map((failure: any, idx: number) => (
              <div key={idx} className="bg-white rounded-lg p-4 border border-red-200">
                <div className="font-semibold text-slate-900">{failure.product}</div>
                <div className="text-sm text-red-700 mt-1">{failure.components}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Products */}
      {analysisData.top_products.length > 0 && (
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Top Reviewed Products</h3>
          <div className="space-y-4">
            {analysisData.top_products.map((product: any, idx: number) => (
              <div key={idx} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-slate-900">{product.ProductName}</h4>
                  <span className="text-sm text-slate-600">{product.ReviewCount} reviews</span>
                </div>
                <div className="flex gap-4 text-sm mb-3">
                  <span className="text-green-700">✓ {product.Positive} positive</span>
                  <span className="text-yellow-700">− {product.Neutral} neutral</span>
                  <span className="text-red-700">✗ {product.Negative} negative</span>
                </div>
                {product.TopPositiveKeywords && (
                  <div className="text-sm text-slate-600">
                    <span className="font-medium">Positive:</span> {product.TopPositiveKeywords}
                  </div>
                )}
                {product.TopNegativeKeywords && (
                  <div className="text-sm text-slate-600">
                    <span className="font-medium">Negative:</span> {product.TopNegativeKeywords}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Download Section */}
      <div className="bg-slate-50 rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">📥 Download Results</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(downloadFiles).map(([key, filename]) => (
            <button
              key={key}
              onClick={() => handleDownload(filename, filename)}
              disabled={downloadingFile === filename}
              className="flex items-center justify-between p-3 bg-white border border-slate-300 rounded-lg hover:border-primary-500 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-sm font-medium text-slate-700 truncate">{filename}</span>
              <span className="text-primary-600 ml-2">
                {downloadingFile === filename ? '⏳' : '⬇️'}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
