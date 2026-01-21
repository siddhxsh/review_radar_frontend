# Review Radar - Frontend

Modern Next.js frontend for Review Radar sentiment analysis platform.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Backend API running at `https://project-blackflag.onrender.com`

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Edit .env.local and set your backend URL
# NEXT_PUBLIC_API_URL=https://project-blackflag.onrender.com

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🌐 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variable: `NEXT_PUBLIC_API_URL=https://project-blackflag.onrender.com`
4. Deploy!

## 🎨 Features

- **CSV Upload** - Drag & drop interface for uploading review data
- **Real-time Analysis** - Progress indicators with timeout handling
- **Results Dashboard** - Comprehensive sentiment analysis visualization
  - Sentiment distribution charts
  - Top positive/negative keywords
  - Aspect-based sentiment breakdown
  - Component failure detection
  - Product ranking and comparison
- **AI Summary** - Generate executive summaries using Gemini or OpenRouter
- **Model Comparison** - Compare VADER vs TF-IDF+LogReg performance
- **Download Center** - Download all generated CSV and PNG files

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Chart.js + react-chartjs-2
- **Markdown**: react-markdown

## 📁 Project Structure

```
frontend/
├── app/
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   └── globals.css      # Global styles
├── components/
│   ├── FileUpload.tsx   # CSV upload component
│   ├── Results.tsx      # Analysis results display
│   ├── AISummary.tsx    # AI summary generator
│   └── ModelComparison.tsx  # Model comparison view
├── lib/
│   └── api.ts           # API client functions
└── public/              # Static assets
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://project-blackflag.onrender.com` |

## 📝 API Endpoints Used

- `POST /analyze` - Upload CSV and run analysis
- `GET /outputs/<filename>` - Download result files
- `POST /formulate` - Generate AI summary
- `GET /compare` - Compare model performance

## 🎯 Usage

1. **Upload CSV** - Drop your review CSV file in the upload area
2. **Wait for Analysis** - Processing takes ~30-120 seconds
3. **View Results** - Explore sentiment breakdown, keywords, and insights
4. **Generate Summary** - Click AI Summary tab for executive report
5. **Compare Models** - See which model performs better on your data
6. **Download** - Save all generated files for further analysis

## 🐛 Troubleshooting

**Error: "Failed to fetch"**
- Check that backend API is running
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`
- Check CORS settings on backend

**Timeout errors**
- Large files may take longer (max 120s)
- Try with a smaller CSV first
- Check backend logs for issues

**AI Summary not generating**
- Ensure analysis was run first
- Check that API keys are configured on backend
- Try switching between Gemini/OpenRouter

## 📄 License

MIT License - see parent project for details
