"use client"

import { API_BASE } from "@/lib/api"

import { useState, useEffect } from "react"
import { Bell, TrendingUp, Sun, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface TrendingCoin {
  asset: string
  price: number
  change24h: number
  trend_score: number
}

export function CryptoAlertSystem() {
  const [trending, setTrending] = useState<TrendingCoin[]>([])
  const [status, setStatus] = useState<{message: string, type: "success" | "error"} | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Fetch live data for top 3 trending coins from backend API
    const fetchTrending = async () => {
      try {
        const [pricesRes, trendRes] = await Promise.all([
          fetch(`${API_BASE}/api/prices`).catch(() => null),
          fetch(`${API_BASE}/api/trend`).catch(() => null)
        ])
        
        if (!pricesRes || !trendRes) return;
        
        const pricesList = await pricesRes.json()
        const trendList = await trendRes.json()
        
        // Convert pricesList array into map for easy lookup
        const prices = Array.isArray(pricesList) 
          ? pricesList.reduce((acc, p) => ({...acc, [p.asset]: p}), {}) 
          : pricesList
        
        const coins = []
        for (const t of trendList) {
          const pInfo = prices[t.asset] || {}
          coins.push({
            asset: t.asset,
            price: pInfo.price || 0,
            change24h: pInfo.change_24h || pInfo.change24h || 0,
            trend_score: t.trend_score
          })
        }
        
        coins.sort((a, b) => b.trend_score - a.trend_score)
        setTrending(coins.slice(0, 3))
      } catch (err) {
        console.error("Failed to fetch trending coins:", err)
      }
    }
    
    fetchTrending()
    const interval = setInterval(fetchTrending, 60000)
    return () => clearInterval(interval)
  }, [])

  const triggerAlert = async (type: "trend-alert" | "morning-report") => {
    setLoading(true)
    setStatus(null)
    try {
      const res = await fetch(`${API_BASE}/api/whatsapp/${type}`)
      const data = await res.json()
      
      if (data.status === "success") {
        const msg = type === "trend-alert" ? "Trend alert sent to WhatsApp" : "Morning report sent to WhatsApp"
        setStatus({ message: msg, type: "success" })
        alert("WhatsApp alert sent successfully")
      } else {
        setStatus({ message: data.error || "Failed to send alert", type: "error" })
      }
    } catch (err) {
      setStatus({ message: "Network error", type: "error" })
    } finally {
      setLoading(false)
      setTimeout(() => setStatus(null), 5000)
    }
  }

  return (
    <div className="rounded-xl border border-neon-blue/30 bg-card/60 backdrop-blur-sm overflow-hidden">
      <div className="p-4 border-b border-border bg-neon-blue/5">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-neon-blue animate-pulse" />
          <h2 className="text-lg font-display font-bold text-neon-blue text-glow-blue">
            Crypto Alert System
          </h2>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Monitor trends and trigger WhatsApp alerts directly from the dashboard
        </p>
      </div>

      <div className="p-4 space-y-6">
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => triggerAlert("trend-alert")}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-neon-blue/10 hover:bg-neon-blue/20 border border-neon-blue text-neon-blue rounded-lg transition-colors font-medium text-sm"
          >
            <TrendingUp className="w-4 h-4" />
            Send Trend Alert
          </button>
          
          <button
            onClick={() => triggerAlert("morning-report")}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-electric-purple/10 hover:bg-electric-purple/20 border border-electric-purple text-electric-purple rounded-lg transition-colors font-medium text-sm"
          >
            <Sun className="w-4 h-4" />
            Send Morning Report
          </button>
        </div>

        {status && (
          <div className={cn(
            "p-3 rounded-lg flex items-center gap-2 text-sm font-medium",
            status.type === "success" ? "bg-signal-green/10 text-signal-green border border-signal-green/20" : "bg-signal-red/10 text-signal-red border border-signal-red/20"
          )}>
            {status.type === "success" && <CheckCircle2 className="w-4 h-4" />}
            {status.message}
          </div>
        )}

        {/* Top Trending Coins */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">Top Trending Coins Today</h3>
          <div className="space-y-2 pb-2">
            {trending.length > 0 ? trending.map((coin, index) => (
              <div key={coin.asset} className="flex flex-row items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground font-mono text-xs">{index + 1}.</span>
                  <span className="font-bold text-foreground">{coin.asset}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground font-mono">
                    ${coin.price < 0.01 ? coin.price.toFixed(6) : coin.price.toFixed(2)}
                  </span>
                  <span className={cn(
                    "font-medium tabular-nums",
                    coin.change24h >= 0 ? "text-signal-green" : "text-signal-red"
                  )}>
                    ({coin.change24h > 0 ? "+" : ""}{coin.change24h.toFixed(2)}%)
                  </span>
                </div>
              </div>
            )) : (
              <div className="text-center p-4 text-muted-foreground text-sm flex items-center justify-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-neon-blue border-r-transparent animate-spin"></span>
                Fetching live market data...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
