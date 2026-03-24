"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Brain, Sparkles, TrendingUp, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface AIInsight {
  id: string
  asset: string
  symbol: string
  insight: string
  confidence: number
  factors: string[]
  timestamp: string
  prediction?: {
    current_price: number
    predicted_price: number
    change_percent: number
    trend: string
  }
}

const insights: AIInsight[] = [
  {
    id: "1",
    asset: "Pepe",
    symbol: "PEPE",
    insight: "PEPE mentions increased 4x compared to baseline, sentiment is strongly positive at 85%, and engagement has surged across all platforms. Historical patterns suggest continued momentum for 24-48 hours.",
    confidence: 92,
    factors: ["Social surge", "Whale accumulation", "Positive sentiment"],
    timestamp: "Just now",
  },
  {
    id: "2",
    asset: "Dogecoin",
    symbol: "DOGE",
    insight: "DOGE is entering an emerging hype phase with coordinated social activity detected. Volume patterns mirror previous rally initiations with 78% similarity score.",
    confidence: 85,
    factors: ["Volume spike", "Influencer activity", "Pattern match"],
    timestamp: "5 min ago",
  },
  {
    id: "3",
    asset: "Solana",
    symbol: "SOL",
    insight: "SOL ecosystem tokens showing correlated strength. Developer activity metrics up 45% this week. DeFi TVL growth indicates sustained organic interest.",
    confidence: 78,
    factors: ["Ecosystem growth", "Developer activity", "TVL increase"],
    timestamp: "12 min ago",
  },
]

export function AIInsights() {
  const [dynamicInsights, setDynamicInsights] = useState<AIInsight[]>(insights)

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const coins = ["BTC", "ETH", "SOL"]
        const results = await Promise.all(coins.map(c => 
          fetch(`http://127.0.0.1:8000/api/predict/${c}`).then(r => r.json())
        ))
        
        const newInsights = results.map(pred => ({
          id: pred.coin,
          asset: pred.coin === "BTC" ? "Bitcoin" : pred.coin === "ETH" ? "Ethereum" : "Solana",
          symbol: pred.coin,
          insight: `The Hybrid LSTM-Transformer ensemble predicts a ${pred.trend} move towards $${pred.predicted_price.toLocaleString()} (${pred.change_percent > 0 ? '+' : ''}${pred.change_percent}%). Multi-factor analysis indicates alignment across moving averages and fundamental order flow.`,
          confidence: Math.round(pred.confidence * 100),
          factors: ["On-chain flow", "LSTM Sequence", "XGBoost Core"],
          timestamp: "Just now",
          prediction: pred 
        }))
        setDynamicInsights(newInsights)
      } catch (err) {
        console.error("Failed to fetch predictions", err)
      }
    }
    
    fetchPredictions()
    const interval = setInterval(fetchPredictions, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="rounded-xl border border-electric-purple/30 bg-card/60 backdrop-blur-sm overflow-hidden">
      <div className="p-4 border-b border-border bg-electric-purple/5">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Brain className="w-5 h-5 text-electric-purple" />
            <Sparkles className="w-3 h-3 text-neon-blue absolute -top-1 -right-1 animate-pulse" />
          </div>
          <h2 className="text-lg font-display font-bold text-electric-purple text-glow-purple">
            AI Insights
          </h2>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Explainable intelligence on trending assets
        </p>
      </div>

      <div className="p-4 space-y-4">
        {dynamicInsights.map((insight, index) => (
          <div
            key={insight.id}
            className={cn(
              "p-4 rounded-lg border border-border/50 bg-muted/20 transition-all duration-300 cursor-pointer group",
              "hover:border-electric-purple/50 hover:bg-electric-purple/5"
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground">{insight.asset}</span>
                <span className="text-sm font-mono text-muted-foreground">{insight.symbol}</span>
                {insight.prediction && (
                  <span className={cn(
                    "text-xs font-bold px-2 py-0.5 rounded ml-2",
                    insight.prediction.trend === "bullish" ? "bg-signal-green/20 text-signal-green" : "bg-signal-red/20 text-signal-red"
                  )}>
                    {insight.prediction.change_percent > 0 ? "+" : ""}{insight.prediction.change_percent}%
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className={cn(
                  "flex items-center gap-1 px-2 py-0.5 rounded-full border",
                  insight.confidence > 75 ? "bg-electric-purple/20 border-electric-purple/40 text-electric-purple" : "bg-muted/50 border-border text-muted-foreground"
                )}>
                  <Sparkles className="w-3 h-3" />
                  <span className="text-xs font-medium">
                    {insight.confidence}% confidence
                  </span>
                </div>
              </div>
            </div>

            {insight.prediction && (
               <div className="flex items-center gap-4 mb-3 p-3 rounded-lg bg-black/20 border border-border/50">
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Current</div>
                    <div className="font-mono text-sm">${insight.prediction.current_price.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Predicted</div>
                    <div className="font-mono font-bold text-sm text-foreground">${insight.prediction.predicted_price.toLocaleString()}</div>
                  </div>
               </div>
            )}

            <p className="text-sm text-foreground/80 leading-relaxed mb-3">
              {insight.insight}
            </p>

            <div className="flex flex-wrap gap-2 mb-2">
              {insight.factors.map((factor) => (
                <span
                  key={factor}
                  className="px-2 py-0.5 text-xs rounded-full bg-muted/50 text-muted-foreground"
                >
                  {factor}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/30">
              <span className="text-xs text-muted-foreground">{insight.timestamp}</span>
              <Link 
                 href={`/ai-model-tree/${insight.symbol}`}
                 className="text-xs font-bold text-electric-purple hover:text-neon-blue transition-colors hover:underline"
              >
                View full model tree →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
