"use client"

import { API_BASE } from "@/lib/api"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, MessageCircle, Repeat2, Eye, BadgeCheck, TrendingUp, Flame, Radio, Users, Search, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { TimeAgo } from "@/lib/utils-time" // Helper if exists, otherwise inline
import { useTranslation } from "react-i18next"

interface FeedItem {
  id: string
  author: string
  avatar: string
  verified: boolean
  followers: number
  timestamp: string
  content: string
  tags: string[]
  image?: string | null
  likes: number
  comments: number
  shares: number
  views: number
  sentiment: "bullish" | "bearish" | "neutral"
  source_type: "x" | "news" | "lunarcrush"
}

interface TrendingToken {
  rank: number
  token: string
  price: number
  change24h: number
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
  if (num >= 1000) return (num / 1000).toFixed(1) + "K"
  return num.toString()
}

function getTimeAgo(dateString: string) {
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return `${diffInSeconds}s`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
    return `${Math.floor(diffInSeconds / 86400)}d`
  } catch(e) {
    return "2h"
  }
}

export default function FeedsPage() {
  const [feeds, setFeeds] = useState<FeedItem[]>([])
  const [trending, setTrending] = useState<TrendingToken[]>([])
  const [news, setNews] = useState<any[]>([])
  const { t } = useTranslation()
  
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [feedsRes, trendRes, newsRes] = await Promise.all([
          fetch(`${API_BASE}/api/live-feeds`).catch(() => null),
          fetch(`${API_BASE}/api/trending`).catch(() => null),
          fetch(`${API_BASE}/api/news`).catch(() => null)
        ])
        
        if (feedsRes) {
          const feedsData = await feedsRes.json()
          setFeeds(feedsData)
        }
        if (trendRes) {
          const trendData = await trendRes.json()
          setTrending(trendData)
        }
        if (newsRes) {
          const newsData = await newsRes.json()
          setNews(newsData)
        }
      } catch (err) {
        console.error("Error fetching feed data:", err)
      }
    }
    
    fetchAllData()
    const interval = setInterval(fetchAllData, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row gap-6 mx-auto w-full max-w-[1600px] h-full">
        
        {/* LEFT SIDEBAR - Trending Tokens */}
        <div className="hidden lg:flex flex-col w-[280px] shrink-0 space-y-6">
          <div className="bg-[#111827]/80 backdrop-blur-md rounded-xl border border-border/50 p-4 sticky top-24">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-neon-blue" />
              {t("trending_tokens")}
            </h2>
            <div className="space-y-4">
              {trending.length > 0 ? trending.map((t) => (
                <div key={t.token} className="flex items-center justify-between group cursor-pointer p-2 -mx-2 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground font-mono text-sm w-4">{t.rank}</span>
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-foreground overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/shapes/svg?seed=${t.token}`} alt={t.token} />
                    </div>
                    <span className="font-bold text-foreground">{t.token}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-medium">${t.price < 0.01 ? t.price.toFixed(6) : t.price.toFixed(2)}</span>
                    <span className={cn(
                      "text-xs font-medium",
                      t.change24h >= 0 ? "text-signal-green" : "text-signal-red"
                    )}>
                      {t.change24h > 0 ? "+" : ""}{t.change24h.toFixed(2)}%
                    </span>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-muted-foreground text-sm">{t("loading_market_data")}</div>
              )}
            </div>
          </div>
        </div>

        {/* CENTER FEED */}
        <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full">
          {/* Post composer mockup */}
          <div className="bg-[#111827]/80 backdrop-blur-md rounded-xl border border-neon-blue/30 p-4 mb-6 shadow-[0_0_15px_rgba(0,209,255,0.05)]">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-electric-purple/20 border border-electric-purple/50 flex items-center justify-center font-bold text-electric-purple shrink-0">
                U
              </div>
              <div className="flex-1">
                <input 
                  type="text" 
                  placeholder={t("share_insight")} 
                  className="w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-lg py-2"
                />
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-border/50">
                  <div className="flex gap-4 text-neon-blue">
                    <button className="hover:text-electric-purple transition-colors p-1"><Flame className="w-5 h-5" /></button>
                    <button className="hover:text-electric-purple transition-colors p-1"><TrendingUp className="w-5 h-5" /></button>
                  </div>
                  <button className="bg-neon-blue text-black font-bold px-6 py-1.5 rounded-full hover:bg-neon-blue/90 hover:shadow-[0_0_15px_rgba(0,209,255,0.4)] transition-all">
                     {t("post")}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Feed Stream */}
          <div className="space-y-4">
            {feeds.length === 0 ? (
              <div className="flex items-center justify-center p-12">
                <div className="w-8 h-8 rounded-full border-2 border-neon-blue border-r-transparent animate-spin"></div>
              </div>
            ) : (
              feeds.map((post) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={post.id} 
                  className="bg-[#111827]/80 backdrop-blur-md rounded-xl border border-border/50 p-5 hover:border-border transition-all shadow-sm hover:shadow-md"
                >
                  {/* Post Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-3">
                      <img src={post.avatar} alt={post.author} className="w-12 h-12 rounded-full border border-border bg-muted/20" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-foreground text-[15px]">{post.author}</span>
                          {post.verified && <BadgeCheck className="w-4 h-4 text-neon-blue" fill="currentColor" stroke="black" strokeWidth={1} />}
                          <span className="text-muted-foreground text-sm">· {getTimeAgo(post.timestamp)}</span>
                        </div>
                        <div className="text-muted-foreground text-xs flex items-center gap-2">
                          <span>{formatNumber(post.followers)} {t("followers")}</span>
                          <span className="w-1 h-1 rounded-full bg-muted-foreground/50"></span>
                          <span className={cn(
                            "uppercase text-[10px] font-bold px-1.5 py-0.5 rounded",
                            post.sentiment === "bullish" ? "bg-signal-green/20 text-signal-green" :
                            post.sentiment === "bearish" ? "bg-signal-red/20 text-signal-red" : "bg-muted text-muted-foreground"
                          )}>
                            {post.sentiment}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className="text-neon-blue text-sm font-bold px-3 py-1 rounded-full border border-neon-blue/30 hover:bg-neon-blue/10 transition-colors">
                       {t("follow")}
                    </button>
                  </div>

                  {/* Post Content */}
                  <div className="mb-4 text-[15px] leading-relaxed text-foreground/90">
                    <p>{post.content}</p>
                    {post.tags && post.tags.length > 0 && (
                      <div className="mt-2 text-neon-blue flex gap-2 font-medium text-sm">
                        {post.tags.map(tag => (
                          <span key={tag} className="hover:underline cursor-pointer">#{tag.replace(/\s+/g, '')}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Engagement Bar */}
                  <div className="flex justify-between items-center text-muted-foreground pt-3 border-t border-border/30">
                    <button className="flex items-center gap-2 hover:text-signal-green hover:bg-signal-green/10 justify-center p-2 rounded-full transition-colors group">
                      <TrendingUp className="w-4 h-4 group-hover:animate-pulse" />
                      <span className="text-sm font-medium">{formatNumber(post.likes * 2)}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-neon-blue hover:bg-neon-blue/10 justify-center p-2 rounded-full transition-colors">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm font-medium">{formatNumber(post.likes)}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-electric-purple hover:bg-electric-purple/10 justify-center p-2 rounded-full transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">{formatNumber(post.comments)}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-foreground hover:bg-muted justify-center p-2 rounded-full transition-colors">
                      <Repeat2 className="w-4 h-4" />
                      <span className="text-sm font-medium">{formatNumber(post.shares)}</span>
                    </button>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Eye className="w-4 h-4" />
                      <span>{formatNumber(post.views)}</span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT SIDEBAR - Widgets */}
        <div className="hidden xl:flex flex-col w-[300px] shrink-0 space-y-6">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text"               placeholder={t("search_posts_users")} 
              className="w-full bg-[#111827]/80 border border-border/50 rounded-full py-2.5 pl-10 pr-4 text-sm outline-none focus:border-neon-blue/50 text-foreground transition-colors"
            />
          </div>

          {/* Hot Topic */}
          <div className="bg-[#111827]/80 backdrop-blur-md rounded-xl border border-border/50 p-4">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Flame className="w-5 h-5 text-signal-red" />
               {t("hot_topic")}
            </h2>
            <div className="p-3 bg-signal-red/5 border border-signal-red/20 rounded-lg">
               <span className="text-xs font-bold text-signal-red uppercase tracking-wider mb-1 block">{t("breaking_news")}</span>
              <p className="font-semibold text-foreground/90 leading-snug">
                {news.length > 0 ? news[0].headline : "BlackRock moves $140M BTC to Coinbase Prime"}
              </p>
            </div>
          </div>

          {/* Live Events */}
          <div className="bg-[#111827]/80 backdrop-blur-md rounded-xl border border-border/50 p-4">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Radio className="w-5 h-5 text-signal-yellow animate-pulse" />
               {t("live_events")}
            </h2>
            <div className="space-y-3">
              <div className="flex gap-3 hover:bg-white/5 p-2 -mx-2 rounded-lg cursor-pointer transition-colors">
                <div className="w-12 h-12 rounded bg-signal-yellow/20 border border-signal-yellow/30 flex flex-col items-center justify-center shrink-0">
                   <span className="text-xs font-bold text-signal-yellow">{t("live")}</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">FOMC Meeting Analysis</h4>
                   <p className="text-xs text-muted-foreground">{t("hosted_by")} Crypto Daily</p>
                </div>
              </div>
              <div className="flex gap-3 hover:bg-white/5 p-2 -mx-2 rounded-lg cursor-pointer transition-colors">
                <div className="w-12 h-12 rounded bg-muted flex flex-col items-center justify-center shrink-0">
                   <span className="text-[10px] text-muted-foreground uppercase">{t("later")}</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">ETH Denver AMA</h4>
                   <p className="text-xs text-muted-foreground">{t("hosted_by")} Vitalik</p>
                </div>
              </div>
            </div>
          </div>

          {/* Top Influencers */}
          <div className="bg-[#111827]/80 backdrop-blur-md rounded-xl border border-border/50 p-4">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-electric-purple" />
               {t("top_influencers")}
            </h2>
            <div className="space-y-4">
              {[
                { name: "Satoshi_N", followers: "1.2M", rank: 1, verified: true },
                { name: "CryptoWhale", followers: "845K", rank: 2, verified: true },
                { name: "Degen_Trader", followers: "420K", rank: 3, verified: false }
              ].map(inf => (
                <div key={inf.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${inf.name}`} className="w-8 h-8 rounded-full border border-border bg-muted" />
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-sm text-foreground">{inf.name}</span>
                        {inf.verified && <BadgeCheck className="w-3 h-3 text-neon-blue" fill="currentColor" stroke="black" />}
                      </div>
                       <span className="text-xs text-muted-foreground">{inf.followers} {t("followers")}</span>
                    </div>
                  </div>
                  <span className="font-bold text-electric-purple">#{inf.rank}</span>
                </div>
              ))}
            </div>
            <button className="w-full text-center text-sm text-neon-blue hover:text-white mt-4 pt-4 border-t border-border/50 transition-colors cursor-pointer">
               {t("view_all_leaderboards")}
            </button>
          </div>

        </div>
      </div>
    </DashboardLayout>
  )
}
