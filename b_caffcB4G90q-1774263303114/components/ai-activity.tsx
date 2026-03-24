"use client"

import { useEffect, useState } from "react"
import { Activity, Cpu, Signal, RefreshCw, Twitter, Newspaper, MessageSquare, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

interface FeedItem {
  id: string
  source: "x" | "news" | "lunarcrush"
  asset: string
  content: string
  url: string
  timestamp: string
}

function NeuralNetworkAnimation() {
  return (
    <div className="relative w-full h-24 overflow-hidden">
      <svg viewBox="0 0 200 80" className="w-full h-full">
        {/* Nodes */}
        {[
          { cx: 20, cy: 20 }, { cx: 20, cy: 40 }, { cx: 20, cy: 60 },
          { cx: 60, cy: 15 }, { cx: 60, cy: 40 }, { cx: 60, cy: 65 },
          { cx: 100, cy: 25 }, { cx: 100, cy: 55 },
          { cx: 140, cy: 15 }, { cx: 140, cy: 40 }, { cx: 140, cy: 65 },
          { cx: 180, cy: 20 }, { cx: 180, cy: 40 }, { cx: 180, cy: 60 },
        ].map((node, i) => (
          <g key={i}>
            <circle
              cx={node.cx}
              cy={node.cy}
              r="4"
              fill="#00D1FF"
              className="animate-pulse"
              style={{ animationDelay: `${i * 100}ms` }}
            />
            <circle
              cx={node.cx}
              cy={node.cy}
              r="6"
              fill="none"
              stroke="#00D1FF"
              strokeWidth="1"
              opacity="0.3"
              className="animate-ping"
              style={{ animationDelay: `${i * 100}ms` }}
            />
          </g>
        ))}

        {/* Connections */}
        {[
          "M20,20 Q40,25 60,15", "M20,20 Q40,30 60,40", "M20,40 Q40,35 60,40",
          "M20,40 Q40,50 60,65", "M20,60 Q40,55 60,40", "M20,60 Q40,65 60,65",
          "M60,15 Q80,20 100,25", "M60,40 Q80,35 100,25", "M60,40 Q80,50 100,55",
          "M60,65 Q80,60 100,55", "M100,25 Q120,20 140,15", "M100,25 Q120,35 140,40",
          "M100,55 Q120,50 140,40", "M100,55 Q120,65 140,65",
          "M140,15 Q160,20 180,20", "M140,40 Q160,35 180,20", "M140,40 Q160,45 180,40",
          "M140,40 Q160,55 180,60", "M140,65 Q160,60 180,60",
        ].map((path, i) => (
          <path
            key={i}
            d={path}
            fill="none"
            stroke="#9B5CFF"
            strokeWidth="0.5"
            opacity="0.4"
            className="animate-pulse"
            style={{ animationDelay: `${i * 50}ms` }}
          />
        ))}

        {/* Animated data flow */}
        {[0, 1, 2].map((i) => (
          <circle key={i} r="2" fill="#00FFB3">
            <animateMotion
              dur={`${2 + i * 0.5}s`}
              repeatCount="indefinite"
              path="M20,40 Q60,30 100,40 Q140,50 180,40"
            />
          </circle>
        ))}
      </svg>
    </div>
  )
}

export function AIActivity() {
  const [signalsDetected, setSignalsDetected] = useState(0)
  const [refreshTimer, setRefreshTimer] = useState(30)
  const [feeds, setFeeds] = useState<FeedItem[]>([])

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/live-feeds")
        if (res.ok) {
          const data = await res.json()
          setFeeds(data)
          setSignalsDetected(data.length)
        }
      } catch (err) {}
    }
    
    fetchFeeds()
    const interval = setInterval(fetchFeeds, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTimer((prev) => (prev <= 1 ? 30 : prev - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const SourceIcon = ({ source }: { source: FeedItem["source"] }) => {
    if (source === "x") return <Twitter className="w-4 h-4 text-[#1DA1F2]" />
    if (source === "news") return <Newspaper className="w-4 h-4 text-neon-blue" />
    return <MessageSquare className="w-4 h-4 text-electric-purple" />
  }

  return (
    <div className="rounded-xl border border-neon-blue/30 bg-card/60 backdrop-blur-sm overflow-hidden flex flex-col max-h-[600px] lg:max-h-[800px]">
      <div className="p-4 border-b border-border bg-neon-blue/5 shrink-0">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-neon-blue animate-pulse" />
          <h2 className="text-lg font-display font-bold text-neon-blue text-glow-blue whitespace-nowrap">
            AI Activity & Live Feeds
          </h2>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Real-time aggregated social intelligence
        </p>
      </div>

      <div className="p-4 flex flex-col flex-1 overflow-hidden">
        {/* Neural Network Animation */}
        <div className="mb-4 p-3 rounded-lg bg-muted/20 border border-border/50 shrink-0">
          <NeuralNetworkAnimation />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4 shrink-0">
          <div className="p-3 rounded-lg bg-muted/20 text-center">
            <div className="text-xl font-bold text-neon-blue">{Math.min(feeds.length, 30)}</div>
            <div className="text-xs text-muted-foreground">Active Feeds</div>
          </div>
          <div className="p-3 rounded-lg bg-muted/20 text-center">
            <div className="text-xl font-bold text-signal-green">{signalsDetected}</div>
            <div className="text-xs text-muted-foreground">Signals</div>
          </div>
          <div className="p-3 rounded-lg bg-muted/20 text-center">
            <div className="flex items-center justify-center gap-1">
              <RefreshCw className={cn(
                "w-4 h-4 text-electric-purple",
                refreshTimer <= 5 && "animate-spin"
              )} />
              <span className="text-xl font-bold text-electric-purple">{refreshTimer}s</span>
            </div>
            <div className="text-xs text-muted-foreground">Refresh</div>
          </div>
        </div>

        {/* Live Feeds */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-neon-blue/20 scrollbar-track-transparent flex flex-col gap-2 relative">
          <div className="text-[10px] sm:text-xs font-semibold text-muted-foreground mb-1 sticky top-0 bg-background/90 backdrop-blur-md z-10 py-2 border-b border-border/50 uppercase tracking-widest flex items-center justify-between">
            <span>Live Intelligence Stream</span>
            <Activity className="w-3 h-3 text-signal-green animate-pulse" />
          </div>
          
          {feeds.length === 0 ? (
            <div className="text-center p-8 text-sm text-muted-foreground font-mono flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-neon-blue border-r-transparent rounded-full animate-spin"></div>
              Initializing aggregate stream...
            </div>
          ) : (
            feeds.map((item, i) => {
              const timeString = (() => {
                  try {
                      return new Date(item.timestamp).toLocaleTimeString()
                  } catch(e) {
                      return "Just now"
                  }
              })()
              
              return (
              <a
                href={item.url !== "#" ? item.url : undefined}
                target="_blank"
                rel="noopener noreferrer"
                key={item.id}
                className="flex flex-col p-3 rounded-xl bg-muted/20 hover:bg-muted/40 border border-border/50 hover:border-neon-blue/40 transition-all duration-300 group cursor-pointer relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-neon-blue/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <SourceIcon source={item.source} />
                    <span className="font-bold text-xs uppercase tracking-wide text-foreground/90">{item.asset}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {timeString !== "Invalid Date" ? timeString : "Just now"}
                    </span>
                    <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <p className="text-sm font-medium text-foreground/80 leading-relaxed">
                  {item.content}
                </p>
              </a>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
