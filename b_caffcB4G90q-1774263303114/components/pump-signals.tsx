"use client"

import { useState, useEffect } from "react"
import { Rocket, TrendingUp, Zap, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"

interface PumpSignal {
  asset: string
  symbol: string
  icon: string
  pumpScore: number
  trendScore: number
  sentiment: number
  virality: number
  strength: "strong" | "moderate" | "emerging"
}

const pumpSignals: PumpSignal[] = [
  {
    asset: "Pepe",
    symbol: "PEPE",
    icon: "🐸",
    pumpScore: 92,
    trendScore: 82,
    sentiment: 85,
    virality: 94,
    strength: "strong",
  },
  {
    asset: "Bonk",
    symbol: "BONK",
    icon: "🦴",
    pumpScore: 85,
    trendScore: 79,
    sentiment: 82,
    virality: 88,
    strength: "strong",
  },
  {
    asset: "Dogecoin",
    symbol: "DOGE",
    icon: "🐕",
    pumpScore: 78,
    trendScore: 76,
    sentiment: 78,
    virality: 91,
    strength: "moderate",
  },
]

function StrengthIndicator({ strength }: { strength: PumpSignal["strength"] }) {
  const config = {
    strong: { bars: 3, color: "bg-signal-red" },
    moderate: { bars: 2, color: "bg-signal-yellow" },
    emerging: { bars: 1, color: "bg-signal-green" },
  }

  const { bars, color } = config[strength]

  return (
    <div className="flex items-end gap-0.5 h-4">
      {[1, 2, 3].map((bar) => (
        <div
          key={bar}
          className={cn(
            "w-1 rounded-full transition-all",
            bar <= bars ? color : "bg-muted/50",
            bar === 1 ? "h-1.5" : bar === 2 ? "h-2.5" : "h-4"
          )}
        />
      ))}
    </div>
  )
}

export function PumpSignals() {
  const [signals, setSignals] = useState<PumpSignal[]>(pumpSignals)

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        const [socialRes, hypeRes, trendRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/social").catch(() => null),
          fetch("http://127.0.0.1:8000/api/hype").catch(() => null),
          fetch("http://127.0.0.1:8000/api/trend").catch(() => null)
        ])
        
        if (!hypeRes || !hypeRes.ok) return

        const social = socialRes && socialRes.ok ? await socialRes.json() : {}
        const hype = await hypeRes.json()
        const trend = trendRes && trendRes.ok ? await trendRes.json() : {}

        const latestSignals: PumpSignal[] = pumpSignals.map(signal => {
          const s = signal.symbol
          const sSocial = social[s] || {}
          const sHype = hype[s]
          const sTrend = trend[s] || 0

          if (!sHype) return signal // fallback to mock if API misses

          let strength: "strong" | "moderate" | "emerging" = "emerging"
          if (sHype.score >= 85) strength = "strong"
          else if (sHype.score >= 75) strength = "moderate"

          return {
            ...signal,
            pumpScore: Math.round(sHype.score),
            trendScore: Math.round(sTrend * 100),
            sentiment: sSocial.sentiment ? Math.round(sSocial.sentiment) : signal.sentiment,
            strength
          }
        })
        
        // Filter out low scores and sort by pump score
        const activeSignals = latestSignals
          .filter(s => s.pumpScore > 70)
          .sort((a, b) => b.pumpScore - a.pumpScore)

        setSignals(activeSignals.length > 0 ? activeSignals : pumpSignals)
      } catch (err) {
        console.error("Failed to fetch pump signals:", err)
      }
    }

    fetchSignals()
    const interval = setInterval(fetchSignals, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="rounded-xl border border-signal-red/30 bg-card/60 backdrop-blur-sm overflow-hidden">
      <div className="p-4 border-b border-border bg-signal-red/5">
        <div className="flex items-center gap-2">
          <Rocket className="w-5 h-5 text-signal-red animate-pulse" />
          <h2 className="text-lg font-display font-bold text-signal-red">
            Pump Signals
          </h2>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Assets showing coordinated spikes
        </p>
      </div>

      <div className="p-4 space-y-3">
        {signals.map((signal, index) => (
          <div
            key={signal.symbol}
            className={cn(
              "p-4 rounded-lg border transition-all duration-300 cursor-pointer group",
              signal.strength === "strong"
                ? "border-signal-red/50 bg-signal-red/5 glow-red"
                : "border-border/50 bg-muted/20 hover:border-signal-red/30"
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-xl bg-muted/50",
                  signal.strength === "strong" && "animate-pulse"
                )}>
                  {signal.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{signal.asset}</span>
                    <span className="text-sm text-muted-foreground">{signal.symbol}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className={cn(
                      "text-xs font-medium uppercase",
                      signal.strength === "strong" ? "text-signal-red" : signal.strength === "moderate" ? "text-signal-yellow" : "text-signal-green"
                    )}>
                      {signal.strength}
                    </span>
                    <StrengthIndicator strength={signal.strength} />
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-signal-red">
                  {signal.pumpScore}%
                </div>
                <div className="text-xs text-muted-foreground">Pump Score</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="flex items-center gap-1.5 p-2 rounded bg-muted/30">
                <TrendingUp className="w-3 h-3 text-neon-blue" />
                <span className="text-muted-foreground">Trend:</span>
                <span className="font-medium text-neon-blue">{signal.trendScore}%</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded bg-muted/30">
                <BarChart3 className="w-3 h-3 text-signal-green" />
                <span className="text-muted-foreground">Sent:</span>
                <span className="font-medium text-signal-green">{signal.sentiment}%</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded bg-muted/30">
                <Zap className="w-3 h-3 text-signal-yellow" />
                <span className="text-muted-foreground">Viral:</span>
                <span className="font-medium text-signal-yellow">{signal.virality}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
