"use client"

import { useState, useEffect } from "react"
import { ExternalLink, TrendingUp, TrendingDown, Minus, X, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "react-i18next"
import { useTranslateContent } from "@/hooks/useTranslateContent"

interface NewsItem {
  id: string
  headline: string
  full_title?: string
  description?: string
  content?: string
  url?: string
  asset: string
  sentiment: "bullish" | "bearish" | "neutral"
  source: string
  timestamp: string
}

const mockPlaceholderNews: NewsItem[] = [
  {
    id: "1",
    headline: "Fetching live crypto headlines...",
    asset: "LOADING",
    sentiment: "neutral",
    source: "System",
    timestamp: "Just now",
  }
]

function SentimentBadge({ sentiment }: { sentiment: NewsItem["sentiment"] }) {
  const { t } = useTranslation()
  const config = {
    bullish: {
      icon: TrendingUp,
      bg: "bg-signal-green/20",
      text: "text-signal-green",
      border: "border-signal-green/40",
      label: t("bullish"),
    },
    bearish: {
      icon: TrendingDown,
      bg: "bg-signal-red/20",
      text: "text-signal-red",
      border: "border-signal-red/40",
      label: t("bearish"),
    },
    neutral: {
      icon: Minus,
      bg: "bg-signal-yellow/20",
      text: "text-signal-yellow",
      border: "border-signal-yellow/40",
      label: t("neutral"),
    },
  }

  const { icon: Icon, bg, text, border, label } = config[sentiment]

  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border", bg, text, border)}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  )
}

export function NewsPanel() {
  const [items, setItems] = useState<NewsItem[]>(mockPlaceholderNews)
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)
  const [viewAll, setViewAll] = useState(false)
  const { t } = useTranslation()

  // Extract headlines for dynamic translation
  const headlines = items.map((item) => item.headline)
  const translatedHeadlines = useTranslateContent(headlines)

  // Translate description of selected news
  const selectedDescriptions = selectedNews
    ? [selectedNews.full_title || selectedNews.headline, selectedNews.description || ""]
    : ["", ""]
  const translatedSelected = useTranslateContent(selectedDescriptions)

  const fetchNews = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/news")
      if (!res.ok) return
      const data = await res.json()
      if (data && data.length > 0) {
        const formattedData = data.map((d: any) => {
          const date = new Date(d.timestamp)
          const diffMin = Math.round((new Date().getTime() - date.getTime()) / 60000)
          let timeStr = "Just now"
          if (!isNaN(date.getTime()) && diffMin >= 0) {
            timeStr = diffMin < 60 ? `${Math.max(1, diffMin)} min ago` : `${Math.round(diffMin/60)} hr ago`
          }
          return {
            ...d,
            timestamp: timeStr
          }
        })
        setItems(formattedData)
      }
    } catch (err) {
      console.error("Failed to fetch news:", err)
    }
  }

  useEffect(() => {
    fetchNews()
    const interval = setInterval(fetchNews, 60000 * 5)
    return () => clearInterval(interval)
  }, [])

  const displayedItems = viewAll ? items : items.slice(0, 5)

  return (
    <>
      <div className="rounded-xl border border-border bg-card/60 backdrop-blur-sm overflow-hidden flex flex-col max-h-[600px] lg:max-h-[800px]">
        <div className="p-4 border-b border-border shrink-0 bg-card/60 backdrop-blur-xl z-10 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-display font-bold text-neon-blue text-glow-blue flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                {t("crypto_news_hub")}
              </h2>
              <p className="text-sm text-muted-foreground mt-1 transition-all">
                {viewAll ? t("news_subtitle") : t("news_subtitle")}
              </p>
            </div>
            {viewAll && (
              <button 
                onClick={() => setViewAll(false)}
                className="p-2 bg-muted/30 hover:bg-muted/50 rounded-lg transition-colors border border-border/50"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        <div className={cn(
          "divide-y divide-border/50 overflow-y-auto flex-1 scroll-smooth",
          viewAll && "scrollbar-thin scrollbar-thumb-neon-blue/20 scrollbar-track-transparent"
        )}>
          {displayedItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setSelectedNews(item)}
              className="p-4 hover:bg-neon-blue/5 transition-all duration-300 cursor-pointer group relative"
            >
              <div className="flex items-start justify-between gap-3 mb-2 pr-4">
                <h3 className="text-sm font-medium leading-tight group-hover:text-neon-blue transition-colors">
                  {translatedHeadlines[viewAll ? index : index] || item.headline}
                </h3>
                <ExternalLink className="w-4 h-4 absolute right-4 top-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="flex items-center gap-3 text-[10px] md:text-xs">
                <span className="px-2 py-0.5 rounded bg-muted/50 font-mono font-medium whitespace-nowrap border border-border/50 text-foreground/80">
                  {item.asset}
                </span>
                <SentimentBadge sentiment={item.sentiment} />
                <span className="text-muted-foreground truncate max-w-[100px] sm:max-w-none">{item.source}</span>
                <span className="text-muted-foreground ml-auto whitespace-nowrap">{item.timestamp}</span>
              </div>
            </div>
          ))}
        </div>

        {!viewAll && items.length > 5 && (
          <div className="p-3 border-t border-border bg-card/60 backdrop-blur-lg shrink-0">
            <button 
              onClick={() => setViewAll(true)}
              className="w-full text-center text-sm font-medium text-neon-blue hover:text-neon-blue/80 hover:bg-neon-blue/10 py-2.5 rounded-lg transition-all border border-transparent hover:border-neon-blue/20"
            >
              {t("view_more")} ({items.length})
            </button>
          </div>
        )}
      </div>

      {/* Full News Details Modal */}
      <AnimatePresence>
        {selectedNews && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
              onClick={() => setSelectedNews(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-2xl max-h-[85vh] flex flex-col bg-[#0d1321] border border-[#1f2937] rounded-xl shadow-2xl shadow-neon-blue/20 z-50 overflow-hidden"
            >
              <div className="bg-[#0d1321] border-b border-[#1f2937] p-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3 text-sm">
                  <span className="px-2 py-1 rounded bg-[#1f2937] font-mono text-white font-medium border border-gray-700/50">
                    {selectedNews.asset}
                  </span>
                  <SentimentBadge sentiment={selectedNews.sentiment} />
                </div>
                <button onClick={() => setSelectedNews(null)} className="p-2 hover:bg-[#1f2937] rounded-lg transition-colors text-gray-400 hover:text-white border border-transparent hover:border-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-[#1f2937] scrollbar-track-transparent">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-3 leading-snug">
                    {translatedSelected[0] || selectedNews.full_title || selectedNews.headline}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 font-medium">
                    <span className="text-[#00D1FF] flex items-center gap-1.5 px-2.5 py-1 bg-[#00D1FF]/10 rounded-md">
                      {selectedNews.source}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      {selectedNews.timestamp}
                    </span>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none">
                  {translatedSelected[1] && translatedSelected[1] !== "No description available." && (
                    <p className="text-lg text-gray-300 leading-relaxed font-medium border-l-2 border-[#00D1FF] pl-4 italic">
                      {translatedSelected[1]}
                    </p>
                  )}
                  {selectedNews.content && selectedNews.content !== selectedNews.description && (
                    <div className="text-gray-400 leading-relaxed whitespace-pre-wrap mt-4 bg-[#1f2937]/30 p-4 rounded-lg border border-[#1f2937]/50">
                      {selectedNews.content.replace(/\[\+\d+ chars\]/g, "")}
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-[#1f2937] flex justify-end">
                  <a
                    href={selectedNews.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-[#00D1FF] hover:bg-white text-black font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(0,209,255,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] transform hover:-translate-y-0.5"
                  >
                    {t("view_more")} — {selectedNews.source}
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
