const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://project-blackflag.onrender.com';

export interface AnalysisResponse {
  status: string;
  message: string;
  summary: {
    total_reviews: number;
    sentiment_summary: {
      positive: number;
      negative: number;
      neutral: number;
    };
  };
  data: {
    positive_keywords: Array<{word: string; score_adj_mean_over_df: number}>;
    negative_keywords: Array<{word: string; score_adj_mean_over_df: number}>;
    aspect_sentiment: Array<any>;
    failure_components: Array<any>;
    top_products: Array<any>;
  };
  output_files: {
    predictions: string;
    positive_keywords: string;
    negative_keywords: string;
    aspect_sentiment_summary: string;
    failure_components: string;
    top_products: string;
  };
}

export interface SummaryResponse {
  status: string;
  llm_provider: string;
  total_reviews: number;
  sentiment_summary: {
    Positive: number;
    Negative: number;
    Neutral: number;
  };
  executive_summary: string;
}

export interface ComparisonResponse {
  status: string;
  metrics: {
    vader: {
      accuracy: number;
      precision: number;
      recall: number;
      f1: number;
    };
    logistic_regression: {
      accuracy: number;
      precision: number;
      recall: number;
      f1: number;
    };
    comparison: {
      agreement_percent: number;
      test_size: number;
    };
  };
  report: string;
  cached: boolean;
}

export const api = {
  async analyzeCSV(file: File): Promise<AnalysisResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const timestamp = Date.now();
    const response = await fetch(`${API_URL}/analyze?_=${timestamp}`, {
      method: 'POST',
      body: formData,
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Analysis failed');
    }

    return response.json();
  },

  async generateSummary(provider: 'gemini' | 'openrouter' = 'gemini', model?: string): Promise<SummaryResponse> {
    const timestamp = Date.now();
    const response = await fetch(`${API_URL}/formulate?_=${timestamp}`, {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
      body: JSON.stringify({
        llm_provider: provider,
        ...(model && { model }),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Summary generation failed');
    }

    return response.json();
  },

  async compareModels(): Promise<ComparisonResponse> {
    // Critical: Add timestamp for cache busting to prevent stale data
    const timestamp = Date.now();
    const response = await fetch(`${API_URL}/compare?_=${timestamp}`, {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Model comparison failed');
    }

    return response.json();
  },

  getOutputFileUrl(filename: string): string {
    return `${API_URL}/outputs/${filename}`;
  },

  async downloadFile(filename: string): Promise<Blob> {
    const timestamp = Date.now();
    const response = await fetch(`${this.getOutputFileUrl(filename)}?_=${timestamp}`, {
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to download ${filename}`);
    }
    return response.blob();
  },
};
