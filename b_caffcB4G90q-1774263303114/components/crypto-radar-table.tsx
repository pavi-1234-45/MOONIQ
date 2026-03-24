"use client"

import { API_BASE } from "@/lib/api"

import { useState, useEffect } from "react"
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface CryptoAsset {
  id: string
  name: string
  symbol: string
  icon: string
  price: number
  change24h: number
  volume24h: number
  mentions: number
  sentiment: number
  hypeScore: number
  viralityScore: number
  hypePhase: "Calm" | "Emerging" | "Peak" | "Cooling"
  trendScore: number
  pumpSignal: boolean
}

const mockAssets: CryptoAsset[] = [
  {
    id: "1",
    name: "Pepe",
    symbol: "PEPE",
    icon: "🐸",
    price: 0.00001245,
    change24h: 24.5,
    volume24h: 892000000,
    mentions: 4200000,
    sentiment: 85,
    hypeScore: 92,
    viralityScore: 94,
    hypePhase: "Peak",
    trendScore: 82,
    pumpSignal: true,
  },
  {
    id: "2",
    name: "Dogecoin",
    symbol: "DOGE",
    icon: "🐕",
    price: 0.0842,
    change24h: 12.4,
    volume24h: 1240000000,
    mentions: 3800000,
    sentiment: 78,
    hypeScore: 88,
    viralityScore: 91,
    hypePhase: "Emerging",
    trendScore: 76,
    pumpSignal: true,
  },
  {
    id: "3",
    name: "Shiba Inu",
    symbol: "SHIB",
    icon: "🦊",
    price: 0.00002156,
    change24h: 8.7,
    volume24h: 567000000,
    mentions: 2100000,
    sentiment: 72,
    hypeScore: 75,
    viralityScore: 78,
    hypePhase: "Emerging",
    trendScore: 68,
    pumpSignal: false,
  },
  {
    id: "4",
    name: "Bitcoin",
    symbol: "BTC",
    icon: "₿",
    price: 67245.82,
    change24h: 2.3,
    volume24h: 28400000000,
    mentions: 8500000,
    sentiment: 65,
    hypeScore: 62,
    viralityScore: 55,
    hypePhase: "Calm",
    trendScore: 58,
    pumpSignal: false,
  },
  {
    id: "5",
    name: "Ethereum",
    symbol: "ETH",
    icon: "⟠",
    price: 3542.18,
    change24h: 3.8,
    volume24h: 15200000000,
    mentions: 6200000,
    sentiment: 68,
    hypeScore: 65,
    viralityScore: 58,
    hypePhase: "Calm",
    trendScore: 55,
    pumpSignal: false,
  },
  {
    id: "6",
    name: "Bonk",
    symbol: "BONK",
    icon: "🦴",
    price: 0.00002845,
    change24h: 18.2,
    volume24h: 345000000,
    mentions: 1850000,
    sentiment: 82,
    hypeScore: 85,
    viralityScore: 88,
    hypePhase: "Peak",
    trendScore: 79,
    pumpSignal: true,
  },
  {
    id: "7",
    name: "Floki",
    symbol: "FLOKI",
    icon: "⚔️",
    price: 0.00018245,
    change24h: -5.2,
    volume24h: 198000000,
    mentions: 980000,
    sentiment: 52,
    hypeScore: 48,
    viralityScore: 45,
    hypePhase: "Cooling",
    trendScore: 42,
    pumpSignal: false,
  },
  {
    id: "8",
    name: "Solana",
    symbol: "SOL",
    icon: "◎",
    price: 142.56,
    change24h: 6.8,
    volume24h: 3200000000,
    mentions: 3400000,
    sentiment: 75,
    hypeScore: 72,
    viralityScore: 68,
    hypePhase: "Emerging",
    trendScore: 65,
    pumpSignal: false,
  },
]

type SortField = keyof CryptoAsset
type SortDirection = "asc" | "desc"

function HypePhaseBadge({ phase }: { phase: CryptoAsset["hypePhase"] }) {
  const config = {
    Calm: { bg: "bg-signal-green/20", text: "text-signal-green", border: "border-signal-green/40" },
    Emerging: { bg: "bg-signal-yellow/20", text: "text-signal-yellow", border: "border-signal-yellow/40" },
    Peak: { bg: "bg-signal-red/20", text: "text-signal-red", border: "border-signal-red/40" },
    Cooling: { bg: "bg-signal-blue/20", text: "text-signal-blue", border: "border-signal-blue/40" },
  }

  const styles = config[phase]

  return (
    <span
      className={cn(
        "px-2.5 py-1 text-xs font-medium rounded-full border animate-pulse-slow",
        styles.bg,
        styles.text,
        styles.border
      )}
    >
      {phase}
    </span>
  )
}

function TrendScoreBar({ score }: { score: number }) {
  const getColor = () => {
    if (score >= 70) return "bg-signal-green"
    if (score >= 50) return "bg-signal-yellow"
    return "bg-signal-red"
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-muted/50 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-1000", getColor())}
          style={{ 
            width: `${score}%`,
            boxShadow: score >= 70 ? "0 0 10px rgba(0, 255, 179, 0.5)" : "none"
          }}
        />
      </div>
      <span className={cn(
        "text-sm font-medium min-w-[40px]",
        score >= 70 ? "text-signal-green" : score >= 50 ? "text-signal-yellow" : "text-signal-red"
      )}>
        {score}%
      </span>
    </div>
  )
}

function formatNumber(num: number): string {
  if (num >= 1000000000) return `$${(num / 1000000000).toFixed(2)}B`
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

function formatPrice(price: number): string {
  if (price < 0.0001) return `$${price.toFixed(8)}`
  if (price < 1) return `$${price.toFixed(6)}`
  if (price < 100) return `$${price.toFixed(2)}`
  return `$${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
}

interface CryptoRadarTableProps {
  onSelectAsset: (asset: CryptoAsset) => void
}

export function CryptoRadarTable({ onSelectAsset }: CryptoRadarTableProps) {
  const [sortField, setSortField] = useState<SortField>("trendScore")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [assets, setAssets] = useState<CryptoAsset[]>(mockAssets)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pricesRes, socialRes, hypeRes, trendRes] = await Promise.all([
          fetch(`${API_BASE}/api/prices").catch(() => null),
          fetch(`${API_BASE}/api/social").catch(() => null),
          fetch(`${API_BASE}/api/hype").catch(() => null),
          fetch(`${API_BASE}/api/trend").catch(() => null)
        ])
        
        if (!pricesRes || !pricesRes.ok) throw new Error("Backend not reachable");

        const prices = await pricesRes.json()
        const social = socialRes && socialRes.ok ? await socialRes.json() : {}
        const hype = hypeRes && hypeRes.ok ? await hypeRes.json() : {}
        const trend = trendRes && trendRes.ok ? await trendRes.json() : {}

        const newAssets = mockAssets.map(asset => {
          const s = asset.symbol
          const priceData = prices[s] || prices[s.toLowerCase()]
          if (!priceData) return asset
          
          const sSocial = social[s] || {}
          const sHype = hype[s] || {}
          const sTrend = trend[s] || 0

          return {
            ...asset,
            price: priceData.price || asset.price,
            change24h: priceData.change_24h || asset.change24h,
            volume24h: priceData.volume_24h || asset.volume24h,
            mentions: sSocial.social_mentions || asset.mentions,
            sentiment: sSocial.sentiment ? Math.round(sSocial.sentiment) : asset.sentiment,
            hypeScore: sHype.score ? Math.round(sHype.score) : asset.hypeScore,
            hypePhase: sHype.phase || asset.hypePhase,
            trendScore: sTrend ? Math.round(sTrend * 100) : asset.trendScore,
            pumpSignal: (sHype.score > 75 && sTrend > 0.6)
          }
        })
        setAssets(newAssets)
      } catch (err) {
        console.error("Failed to fetch real data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const sortedAssets = [...assets].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]
    
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue)
    }
    
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }
    
    return 0
  })

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 ml-1 opacity-50" />
    }
    return sortDirection === "asc" 
      ? <ArrowUp className="w-4 h-4 ml-1 text-neon-blue" />
      : <ArrowDown className="w-4 h-4 ml-1 text-neon-blue" />
  }

  return (
    <div className="rounded-xl border border-border bg-card/60 backdrop-blur-sm overflow-hidden">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-display font-bold text-neon-blue text-glow-blue">
          Crypto Radar
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Real-time intelligence on trending assets
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/30">
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort("name")}
                  className="flex items-center hover:text-foreground transition-colors"
                >
                  Asset
                  <SortIcon field="name" />
                </button>
              </th>
              <th className="text-right p-4 text-sm font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort("price")}
                  className="flex items-center justify-end hover:text-foreground transition-colors ml-auto"
                >
                  Price
                  <SortIcon field="price" />
                </button>
              </th>
              <th className="text-right p-4 text-sm font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort("change24h")}
                  className="flex items-center justify-end hover:text-foreground transition-colors ml-auto"
                >
                  24h
                  <SortIcon field="change24h" />
                </button>
              </th>
              <th className="text-right p-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">
                <button
                  onClick={() => handleSort("volume24h")}
                  className="flex items-center justify-end hover:text-foreground transition-colors ml-auto"
                >
                  Volume
                  <SortIcon field="volume24h" />
                </button>
              </th>
              <th className="text-right p-4 text-sm font-medium text-muted-foreground hidden xl:table-cell">
                <button
                  onClick={() => handleSort("mentions")}
                  className="flex items-center justify-end hover:text-foreground transition-colors ml-auto"
                >
                  Mentions
                  <SortIcon field="mentions" />
                </button>
              </th>
              <th className="text-right p-4 text-sm font-medium text-muted-foreground hidden md:table-cell">
                <button
                  onClick={() => handleSort("sentiment")}
                  className="flex items-center justify-end hover:text-foreground transition-colors ml-auto"
                >
                  Sentiment
                  <SortIcon field="sentiment" />
                </button>
              </th>
              <th className="text-center p-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">
                <button
                  onClick={() => handleSort("hypePhase")}
                  className="flex items-center justify-center hover:text-foreground transition-colors mx-auto"
                >
                  Phase
                  <SortIcon field="hypePhase" />
                </button>
              </th>
              <th className="p-4 text-sm font-medium text-muted-foreground min-w-[180px]">
                <button
                  onClick={() => handleSort("trendScore")}
                  className="flex items-center hover:text-foreground transition-colors"
                >
                  Trend Score
                  <SortIcon field="trendScore" />
                </button>
              </th>
              <th className="p-4 text-sm font-medium text-muted-foreground w-10"></th>
            </tr>
          </thead>
          <tbody>
            {sortedAssets.map((asset, index) => (
              <tr
                key={asset.id}
                onClick={() => onSelectAsset(asset)}
                className={cn(
                  "border-b border-border/50 hover:bg-muted/20 transition-colors cursor-pointer group",
                  asset.pumpSignal && "bg-signal-red/5"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-xl bg-muted/50",
                      asset.pumpSignal && "animate-pulse glow-red"
                    )}>
                      {asset.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{asset.name}</span>
                        {asset.pumpSignal && (
                          <span className="px-1.5 py-0.5 text-[10px] font-bold bg-signal-red/20 text-signal-red rounded animate-pulse">
                            PUMP
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">{asset.symbol}</span>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-right font-mono">
                  {formatPrice(asset.price)}
                </td>
                <td className={cn(
                  "p-4 text-right font-medium",
                  asset.change24h >= 0 ? "text-signal-green" : "text-signal-red"
                )}>
                  {asset.change24h >= 0 ? "+" : ""}{asset.change24h}%
                </td>
                <td className="p-4 text-right text-muted-foreground hidden lg:table-cell">
                  {formatNumber(asset.volume24h)}
                </td>
                <td className="p-4 text-right text-muted-foreground hidden xl:table-cell">
                  {formatNumber(asset.mentions)}
                </td>
                <td className={cn(
                  "p-4 text-right font-medium hidden md:table-cell",
                  asset.sentiment >= 70 ? "text-signal-green" : asset.sentiment >= 50 ? "text-signal-yellow" : "text-signal-red"
                )}>
                  {asset.sentiment}%
                </td>
                <td className="p-4 text-center hidden lg:table-cell">
                  <HypePhaseBadge phase={asset.hypePhase} />
                </td>
                <td className="p-4">
                  <TrendScoreBar score={asset.trendScore} />
                </td>
                <td className="p-4">
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-neon-blue transition-colors" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export type { CryptoAsset }
