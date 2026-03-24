"use client"

import { TrendingUp, MessageCircle, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface TrendingTopic {
  tag: string
  mentions: number
  mentionsGrowth: number
  sentiment: number
  virality: number
}

const topics: TrendingTopic[] = [
  { tag: "#PEPE", mentions: 4200000, mentionsGrowth: 142, sentiment: 85, virality: 94 },
  { tag: "#Memecoin", mentions: 2800000, mentionsGrowth: 78, sentiment: 72, virality: 82 },
  { tag: "#BitcoinETF", mentions: 1950000, mentionsGrowth: 45, sentiment: 68, virality: 65 },
  { tag: "#AIcrypto", mentions: 1420000, mentionsGrowth: 92, sentiment: 78, virality: 76 },
  { tag: "#DOGE", mentions: 3100000, mentionsGrowth: 56, sentiment: 75, virality: 88 },
  { tag: "#Solana", mentions: 980000, mentionsGrowth: 34, sentiment: 70, virality: 62 },
]

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K`
  return num.toString()
}

export function TrendingTopics() {
  return (
    <div className="rounded-xl border border-border bg-card/60 backdrop-blur-sm overflow-hidden">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-display font-bold text-electric-purple text-glow-purple">
          Trending Topics
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Hot hashtags across social platforms
        </p>
      </div>

      <div className="p-4 space-y-3">
        {topics.map((topic, index) => (
          <div
            key={topic.tag}
            className={cn(
              "p-3 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/40 transition-all duration-300 cursor-pointer group",
              "hover:border-electric-purple/50 hover:glow-purple"
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-display font-bold text-electric-purple">
                {topic.tag}
              </span>
              <span className="flex items-center gap-1 text-signal-green text-sm">
                <TrendingUp className="w-3 h-3" />
                +{topic.mentionsGrowth}%
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="flex items-center gap-1 text-muted-foreground">
                <MessageCircle className="w-3 h-3" />
                {formatNumber(topic.mentions)}
              </div>
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Sentiment:</span>
                <span className={cn(
                  "font-medium",
                  topic.sentiment >= 70 ? "text-signal-green" : topic.sentiment >= 50 ? "text-signal-yellow" : "text-signal-red"
                )}>
                  {topic.sentiment}%
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-signal-yellow" />
                <span className="text-muted-foreground">Viral:</span>
                <span className="font-medium text-signal-yellow">{topic.virality}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
