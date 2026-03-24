"use client"

import { API_BASE } from "@/lib/api"

import { useState, useEffect } from "react"
import { Bell, BellRing, Settings, Check, X, Flame } from "lucide-react"
import { cn } from "@/lib/utils"

interface Alert {
  id: string
  asset: string
  symbol: string
  type: "phase_change" | "pump_signal" | "sentiment_shift" | "volume_spike"
  message: string
  trendScore: number
  timestamp: string
  read: boolean
  url?: string
}

const fallbackAlerts: Alert[] = [
  {
    id: "1",
    asset: "PEPE",
    symbol: "PEPE",
    type: "phase_change",
    message: "PEPE entering Peak Phase",
    trendScore: 82,
    timestamp: "2 min ago",
    read: false,
  },
  {
    id: "2",
    asset: "BONK",
    symbol: "BONK",
    type: "pump_signal",
    message: "Strong pump signal detected",
    trendScore: 79,
    timestamp: "8 min ago",
    read: false,
  },
  {
    id: "3",
    asset: "DOGE",
    symbol: "DOGE",
    type: "phase_change",
    message: "DOGE entering Emerging Phase",
    trendScore: 76,
    timestamp: "15 min ago",
    read: true,
  },
  {
    id: "4",
    asset: "SOL",
    symbol: "SOL",
    type: "volume_spike",
    message: "Unusual volume detected",
    trendScore: 65,
    timestamp: "32 min ago",
    read: true,
  },
]

const alertTypeConfig = {
  phase_change: { color: "text-signal-yellow", bg: "bg-signal-yellow/20" },
  pump_signal: { color: "text-signal-red", bg: "bg-signal-red/20" },
  sentiment_shift: { color: "text-signal-green", bg: "bg-signal-green/20" },
  volume_spike: { color: "text-neon-blue", bg: "bg-neon-blue/20" },
}

export function BotAlerts() {
  const [sensitivity, setSensitivity] = useState<"low" | "medium" | "high">("medium")
  const [alertsList, setAlertsList] = useState<Alert[]>(fallbackAlerts)

  useEffect(() => {
    const fetchDexBoosts = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/dex-boosts")
        if (!res.ok) return
        const boosts = await res.json()
        if (boosts && boosts.length > 0) {
          const formatted = boosts.map((b: any, index: number) => {
            const isFresh = index < 3
            return {
              id: b.tokenAddress || String(index),
              asset: String(b.chainId).toUpperCase(),
              symbol: "BOOST",
              type: "volume_spike", // maps to neon-blue theme in config
              message: b.description ? (b.description.substring(0, 50) + "...") : "Live DEX Screener Boost Detected!",
              trendScore: Math.max(90 - index, 50),
              timestamp: isFresh ? "Just now" : "Live",
              read: !isFresh,
              url: b.url
            }
          })
          setAlertsList(formatted)
        }
      } catch (err) {
        console.error("Failed to fetch DEX Screener boosts:", err)
      }
    }
    
    fetchDexBoosts()
    const interval = setInterval(fetchDexBoosts, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="rounded-xl border border-border bg-card/60 backdrop-blur-sm overflow-hidden">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-signal-yellow animate-pulse" />
            <h2 className="text-lg font-display font-bold text-signal-yellow text-glow-yellow">
              DEX Screener Bot
            </h2>
          </div>
          <button className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors">
            <Settings className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Real-time boosted tokens from DEX Screener
        </p>
      </div>

      {/* Sensitivity Toggle */}
      <div className="p-3 border-b border-border bg-muted/20">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Alert Sensitivity</span>
          <div className="flex gap-1">
            {(["low", "medium", "high"] as const).map((level) => (
              <button
                key={level}
                onClick={() => setSensitivity(level)}
                className={cn(
                  "px-2.5 py-1 text-xs font-medium rounded transition-all",
                  sensitivity === level
                    ? "bg-neon-blue text-neon-blue/10 text-white"
                    : "bg-muted/50 text-muted-foreground hover:text-foreground"
                )}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="divide-y divide-border/50 max-h-[400px] overflow-y-auto custom-scrollbar">
        {alertsList.map((alert, index) => {
          const config = alertTypeConfig[alert.type]
          
          return (
            <div
              key={alert.id}
              className={cn(
                "p-4 transition-all duration-300 cursor-pointer group",
                !alert.read && "bg-muted/10",
                "hover:bg-muted/20"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-3">
                <div className={cn("p-2 rounded-lg shrink-0", config.bg)}>
                  <Bell className={cn("w-4 h-4", config.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm tracking-wider">{alert.asset}</span>
                    <span className="text-[10px] uppercase font-bold text-neon-blue border border-neon-blue/30 bg-neon-blue/10 px-1.5 rounded">NEW BOOST</span>
                    {!alert.read && (
                      <span className="w-2 h-2 rounded-full bg-neon-blue animate-pulse ml-auto" />
                    )}
                  </div>
                  <p className="text-sm text-foreground/90">{alert.message}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">
                        Power: <span className="text-signal-green font-medium">{alert.trendScore}%</span>
                      </span>
                      <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                    </div>
                    {alert.url && (
                      <a
                        href={alert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()} 
                        className="px-2 py-1 text-[10px] font-bold uppercase rounded bg-neon-blue/10 text-neon-blue hover:bg-neon-blue/20 transition-colors border border-neon-blue/30"
                      >
                        DEX
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
