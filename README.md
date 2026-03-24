<p align="center">
  <img src="https://image2url.com/r2/default/images/1774258386636-e58b3cf4-24f1-466d-b82f-3f8a2624d165.png" alt="MOONIQ Logo" width="120" />
</p>

<h1 align="center">MOONIQ — AI Crypto Intelligence Platform</h1>

<p align="center">
  <strong>Real-time AI-powered crypto market intelligence, rumor detection, and social sentiment analysis.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Python-3.12-3776AB?logo=python" alt="Python" />
  <img src="https://img.shields.io/badge/TailwindCSS-4.x-06B6D4?logo=tailwindcss" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License" />
</p>

---

## 🚀 Overview

**MOONIQ** is a cutting-edge AI-powered crypto intelligence platform that provides traders and investors with real-time market insights, social sentiment analysis, AI-driven rumor detection, and comprehensive market data — all in a stunning dark futuristic dashboard.

The platform continuously monitors social media platforms (Twitter/X, Telegram, Reddit, Discord), processes data through AI models, and delivers actionable intelligence to help users discover early market signals before official news appears.

---

## ✨ Key Features

### 📊 Dashboard & Market Intelligence
- **Real-time Metric Cards** — Total Sentiment, Top Trending, Highest Virality, Pump Signal, Top Meme Coin, ETH Gas Tracker
- **3D Animated Cards** — Interactive metric cards with sparkline charts, glassmorphism effects, and tilt animations
- **Live Market Data** — Prices, volume, market cap from CoinGecko API
- **ETH Gas Tracker** — Real-time Ethereum gas prices from Etherscan

### 🚨 AI Rumor Detector
- **Social Media Monitoring** — Continuously scans Twitter, Telegram, Reddit, and Discord for rumor signals
- **AI Classification** — NVIDIA GPT-powered rumor classification (Rumor / Normal / Confirmed News)
- **Confidence Scoring** — Multi-factor scoring: AI probability, mention volume, platform diversity, growth velocity
- **Rumor Types** — Exchange Listings, Partnerships, Token Burns, Insider Leaks, ETF Rumors, Major Announcements
- **Real-time Alerts** — Auto-refreshing dashboard panel with animated high-confidence indicators
- **Coin Detection** — Automatic cryptocurrency symbol extraction from social messages

### 🌐 Global Language System (i18n)
- **116+ Languages** — Instant UI translation supporting Hindi, Tamil, Telugu, French, Spanish, German, Japanese, Korean, Chinese, Arabic, and 100+ more
- **Dynamic Content Translation** — News headlines auto-translate via backend AI API
- **Crypto Term Preservation** — Coin names (Bitcoin, Ethereum) and symbols ($BTC, $ETH) stay in English
- **Language Persistence** — User preference saved in localStorage with browser auto-detection
- **Searchable Dropdown** — Glassmorphism language selector with flag indicators

### 📰 Crypto News Hub
- **Live News Aggregation** — Real-time crypto headlines from multiple sources
- **AI Sentiment Analysis** — Bullish/Bearish/Neutral classification per headline
- **Dynamic Translation** — Headlines auto-translate when language is changed
- **Expandable Details** — Full article modal with source, timestamp, and read-more link

### 📡 Crypto Radar
- **Trending Asset Detection** — Real-time trending coins from social signals
- **Pump Signal Detection** — AI-powered pump probability analysis
- **Social Metrics** — Twitter mentions, LunarCrush social data, engagement metrics

### 📈 Asset Explorer
- **Complete Market Index** — Full cryptocurrency market data with detailed profiles
- **Sortable Tables** — Price, 24h change, volume, market cap rankings
- **Asset Detail Panels** — Deep-dive analytics per coin

### 🔥 Trending Topics
- **Social Engagement Analytics** — Top trending coins and social sentiment
- **Virality Tracking** — Real-time virality scores across platforms

### 🤖 AI Insights Engine
- **AI Trend Predictions** — ML-powered trend probability forecasts
- **Pump Probability** — AI-calculated pump likelihood for tracked assets
- **Live Social Intelligence** — Real-time social signal processing

### 📢 Alert System
- **WhatsApp Alerts** — Price target notifications via WhatsApp Business API
- **Dashboard Notifications** — Real-time in-app alert system
- **DEX Screener Bot Signals** — Automated DeFi monitoring

### 🧪 Backtesting Hub
- **Strategy Testing Tools** — Historical performance simulation
- **Performance Charts** — Visual backtesting results

### 💬 Community Feeds
- **Social Feed** — Crypto insights, posts, and community discussions
- **Top Influencers** — Leaderboard of crypto influencers
- **Live Events** — Real-time crypto events and breaking news

### 🤖 MOONIQ Bot Assistant
- **AI Chat Interface** — Floating bot assistant powered by NVIDIA DeepSeek
- **Streaming Responses** — Real-time AI responses with markdown support
- **Persistent Position** — Fixed bottom-right floating assistant

---

## 🏗️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **Next.js 16.2** | React framework with Turbopack |
| **React 19** | UI component library |
| **TypeScript 5** | Type-safe development |
| **TailwindCSS 4** | Utility-first styling |
| **Framer Motion** | Animations and transitions |
| **i18next** | Internationalization |
| **Three.js / R3F** | 3D background effects |
| **Recharts** | Chart components |
| **Firebase Auth** | User authentication |

### Backend
| Technology | Purpose |
|---|---|
| **Python 3.12** | Backend language |
| **FastAPI** | High-performance API framework |
| **Uvicorn** | ASGI server |
| **APScheduler** | Background task scheduling |
| **httpx** | Async HTTP client |
| **OpenAI SDK** | NVIDIA GPT integration |

### APIs & Services
| Service | Purpose |
|---|---|
| **CoinGecko API** | Market data and prices |
| **Twitter/X API** | Social media data collection |
| **LunarCrush API** | Social sentiment metrics |
| **Etherscan API** | ETH gas prices |
| **NVIDIA NIM API** | AI chat, translation, rumor classification |
| **WhatsApp Business API** | Alert notifications |
| **Firebase** | User authentication |

---

## 📁 Project Structure

```
MOONIQ/
├── b_caffcB4G90q-1774263303114/     # Next.js Frontend
│   ├── app/                          # App router pages
│   │   ├── dashboard/                # Main dashboard
│   │   ├── crypto-radar/             # Crypto radar page
│   │   ├── assets/                   # Asset explorer
│   │   ├── trending/                 # Trending topics
│   │   ├── feeds/                    # Community feeds
│   │   ├── news/                     # Crypto news hub
│   │   ├── backtesting/              # Backtesting tools
│   │   ├── alerts/                   # Alert management
│   │   ├── ai-insights/              # AI insights engine
│   │   ├── auth/                     # Authentication
│   │   ├── globals.css               # Global styles
│   │   └── layout.tsx                # Root layout
│   ├── components/                   # React components
│   │   ├── rumor-detector.tsx        # AI Rumor Detector panel
│   │   ├── navbar.tsx                # Navigation bar
│   │   ├── LanguageSelector.tsx      # Language dropdown
│   │   ├── I18nProvider.tsx          # i18n context provider
│   │   ├── metric-cards-3d.tsx       # 3D metric cards
│   │   ├── news-panel.tsx            # News panel
│   │   ├── dashboard-layout.tsx      # Dashboard layout wrapper
│   │   ├── footer.tsx                # Footer component
│   │   ├── MooniqBot.tsx             # AI bot assistant
│   │   ├── AIChatModal.tsx           # AI chat modal
│   │   └── ...                       # 20+ more components
│   ├── hooks/                        # Custom React hooks
│   │   └── useTranslateContent.ts    # Dynamic translation hook
│   ├── lib/                          # Utilities
│   │   ├── i18n.ts                   # i18next configuration
│   │   ├── auth-context.tsx          # Auth context
│   │   └── firebase.ts              # Firebase config
│   ├── locales/                      # Translation files
│   │   ├── en/common.json            # English (200+ keys)
│   │   ├── hi/common.json            # Hindi
│   │   ├── ta/common.json            # Tamil
│   │   ├── fr/common.json            # French
│   │   ├── es/common.json            # Spanish
│   │   ├── de/common.json            # German
│   │   ├── ja/common.json            # Japanese
│   │   ├── ko/common.json            # Korean
│   │   ├── zh/common.json            # Chinese
│   │   ├── ar/common.json            # Arabic
│   │   └── ...                       # 17 built-in locales
│   └── public/                       # Static assets
│       └── icons/mooniq-bot.png      # Bot icon
│
├── backend/                          # FastAPI Backend
│   ├── main.py                       # API endpoints
│   ├── rumor_detector.py             # AI Rumor Detection service
│   ├── data_processor.py             # Data processing pipeline
│   ├── api_clients.py                # External API clients
│   ├── ml_predictor.py               # ML prediction models
│   ├── scheduler.py                  # Background task scheduler
│   ├── whatsapp_service.py           # WhatsApp integration
│   ├── config.py                     # Configuration & env vars
│   ├── requirements.txt              # Python dependencies
│   └── .env                          # Environment variables
│
├── .gitignore                        # Git ignore rules
└── README.md                         # This file
```

---

## 🛠️ Installation & Setup

### Prerequisites

- **Node.js** ≥ 20.x
- **Python** ≥ 3.10
- **npm** or **yarn**
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/pavi-1234-45/MOONIQ.git
cd MOONIQ
```

### 2. Frontend Setup

```bash
cd b_caffcB4G90q-1774263303114
npm install
```

### 3. Backend Setup

```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

### 4. Environment Variables

Create `backend/.env` with the following:

```env
# Twitter/X API
X_BEARER_TOKEN=your_twitter_bearer_token
X_ACCESS_TOKEN=your_access_token
X_ACCESS_TOKEN_SECRET=your_access_token_secret
X_CONSUMER_KEY=your_consumer_key
X_CONSUMER_SECRET=your_consumer_secret

# CoinGecko
COINGECKO_API_KEY=your_coingecko_api_key

# LunarCrush
LUNARCRUSH_API_KEY=your_lunarcrush_api_key

# Etherscan
ETHERSCAN_API_KEY=your_etherscan_api_key

# WhatsApp
WHATSAPP_API_TOKEN=your_whatsapp_token
WHATSAPP_PHONE_ID=your_phone_id
```

### 5. Firebase Setup

Create a Firebase project and add your config to `lib/firebase.ts`.

---

## 🚀 Running the Application

### Start Backend Server

```bash
cd backend
.\venv\Scripts\activate
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

### Start Frontend Dev Server

```bash
cd b_caffcB4G90q-1774263303114
npm run dev
```

### Access the Application

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://127.0.0.1:8000](http://127.0.0.1:8000)
- **API Docs:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Welcome / status |
| `GET` | `/api/health` | Health check |
| `GET` | `/api/prices` | Market price data for tracked assets |
| `GET` | `/api/social` | Social / tweet metrics |
| `GET` | `/api/hype` | Hype score & phase classification |
| `GET` | `/api/trend` | Trend probability (0–1) |
| `GET` | `/api/news` | Aggregated crypto news headlines |
| `GET` | `/api/rumor-alerts` | Active AI rumor alerts |
| `GET` | `/api/rumor-status` | Rumor scanner status |
| `POST` | `/api/translate` | Translate dynamic content |
| `POST` | `/api/ai/chat` | AI chat assistant |
| `POST` | `/api/alerts/whatsapp` | Send WhatsApp alert |

---

## 🚨 AI Rumor Detector — Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Social Platforms                     │
│   Twitter/X  │  Telegram  │  Reddit  │  Discord      │
└──────┬───────┴─────┬──────┴────┬─────┴──────┬────────┘
       │             │           │            │
       ▼             ▼           ▼            ▼
┌─────────────────────────────────────────────────────┐
│              Data Collector Service                   │
│  Keywords: listing, partnership, burn, ETF, insider   │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│              Text Preprocessing                      │
│  Remove URLs │ Remove Emojis │ Spam Filter │ Dedup   │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│           AI Rumor Classification                    │
│  NVIDIA GPT → Rumor / Normal / Confirmed News        │
│  Fallback: Keyword-based classification              │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│            Coin Detection & Scoring                  │
│  Extract coins │ Confidence score (0-100%)           │
│  Factors: AI prob, mentions, platforms, velocity     │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│              MOONIQ Dashboard                        │
│  🚨 Rumor Cards │ Confidence Bars │ Source Badges     │
│  Auto-refresh every 2 minutes                        │
└─────────────────────────────────────────────────────┘
```

---

## 🌐 Supported Languages

The platform supports **116+ languages** with built-in locale files for:

| Language | Code | Language | Code |
|---|---|---|---|
| English | `en` | Japanese | `ja` |
| Hindi | `hi` | Korean | `ko` |
| Tamil | `ta` | Chinese | `zh` |
| Telugu | `te` | Arabic | `ar` |
| Malayalam | `ml` | Portuguese | `pt` |
| Kannada | `kn` | Russian | `ru` |
| Bengali | `bn` | Italian | `it` |
| French | `fr` | German | `de` |
| Spanish | `es` | + 100 more... | |

Dynamic content (news headlines, AI insights) auto-translates via the backend NVIDIA GPT API while preserving crypto coin names and symbols in English.

---

## 🎨 Design System

MOONIQ uses a **dark futuristic design** with:

- **Neon Blue** (`#00D1FF`) — Primary accent
- **Electric Purple** (`#A855F7`) — Secondary accent
- **Signal Green** (`#22C55E`) — Bullish indicators
- **Signal Red** (`#FF4D6D`) — Bearish / alert indicators
- **Signal Yellow** (`#FFD166`) — Neutral / warning
- **Glassmorphism** — Frosted glass card effects
- **Micro-animations** — Smooth transitions and hover effects
- **3D Effects** — Tilt animations on metric cards

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 👥 Contributors

- **Gopi** — Full-stack Development, AI Integration
- **Pavi** — Project Management

---

<p align="center">
  <strong>Built with ❤️ by the MOONIQ Team</strong>
</p>

<p align="center">
  <img src="https://image2url.com/r2/default/images/1774258386636-e58b3cf4-24f1-466d-b82f-3f8a2624d165.png" alt="MOONIQ" width="60" />
</p>
