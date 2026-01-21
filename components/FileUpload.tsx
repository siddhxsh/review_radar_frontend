'use client';

import { useState, useRef } from 'react';
import { api } from '@/lib/api';

interface FileUploadProps {
  onAnalysisStart: () => void;
  onAnalysisComplete: (data: any) => void;
}

export default function FileUpload({ onAnalysisStart, onAnalysisComplete }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith('.csv')) {
      setFile(droppedFile);
    } else {
      setError('Please upload a CSV file');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
      } else {
        setError('Please upload a CSV file');
      }
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setError(null);
    onAnalysisStart();

    try {
      const result = await api.analyzeCSV(file);
      onAnalysisComplete(result);
    } catch (err: any) {
      setError(err.message || 'Analysis failed. Please try again.');
      onAnalysisComplete(null);
    }
  };

  return (
    <div className="glass rounded-3xl shadow-2xl p-8 border-2 border-white/30">
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
          📤 Upload Your Review Data
        </h2>
        <p className="text-slate-600 text-lg">
          Upload a CSV file containing your e-commerce reviews for instant AI-powered sentiment analysis ✨
        </p>
      </div>

      {/* Drag & Drop Area */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border-3 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all transform hover:scale-[1.02] duration-300
          ${
            isDragging
              ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-xl scale-[1.02]'
              : 'border-slate-300 hover:border-purple-400 bg-gradient-to-br from-white/50 to-slate-50/50 hover:shadow-lg'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col items-center">
          <div className="mb-6 transform transition-transform hover:scale-110 duration-300">
            <svg
              className="w-20 h-20 text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>

          {file ? (
            <div className="text-center">
              <div className="mb-3 text-5xl animate-bounce">✅</div>
              <p className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                {file.name}
              </p>
              <p className="text-sm text-slate-600 font-medium">
                {(file.size / 1024).toFixed(2)} KB | 👆 Click to change file
              </p>
            </div>
          ) : (
            <div>
              <p className="text-xl font-bold text-slate-900 mb-2">
                📥 Drop your CSV file here
              </p>
              <p className="text-sm text-slate-600 font-medium">or click to browse from your computer</p>
            </div>
          )}
        </div>
      </div>

      {/* Expected Format Info */}
      <div className="mt-6 p-6 glass-dark rounded-2xl border border-purple-200/30">
        <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2 text-lg">
          <span className="text-2xl">💡</span> Expected CSV Format
        </h4>
        <div className="text-sm text-slate-700 space-y-2 font-medium">
          <p>• <strong className="text-purple-700">Required:</strong> Review text and Rating (1-5 stars)</p>
          <p>• <strong className="text-purple-700">Optional:</strong> Product name, Price, Summary</p>
          <p>• <strong className="text-purple-700">Smart:</strong> Column names are auto-detected by AI ✨</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-5 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 rounded-2xl shadow-lg animate-shake">
          <p className="text-red-800 font-bold text-lg">❌ {error}</p>
        </div>
      )}

      {/* Analyze Button */}
      <button
        onClick={handleAnalyze}
        disabled={!file}
        className={`
          mt-6 w-full py-5 rounded-2xl font-bold text-xl transition-all transform
          ${
            file
              ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white hover:shadow-2xl hover:-translate-y-1 active:scale-95'
              : 'bg-slate-300 text-slate-500 cursor-not-allowed'
          }
        `}
      >
        {file ? (
          <span>
            <span className="mr-2">⚡</span> Analyze Reviews with AI
          </span>
        ) : (
          <span>
            <span className="mr-2">📤</span> Upload CSV to Begin
          </span>
        )}
      </button>
    </div>
  );
}
