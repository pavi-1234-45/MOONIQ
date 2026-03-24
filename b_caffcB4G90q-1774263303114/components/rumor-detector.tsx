"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, Radio, TrendingUp, Shield, Flame, Eye, Clock, ExternalLink, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "react-i18next"

interface RumorAlert {
  id: string
  coin: string
  rumor: string
  rumor_type: string
  confidence: number
  sources: string[]
  source_mentions?: Record<string, number>
  first_detected: string
  last_updated: string
  status: string
}

const RUMOR_TYPE_CONFIG: Record<string, { icon: typeof TrendingUp; label: string; color: string }> = {
  exchange_listing: { icon: TrendingUp, label: "Exchange Listing", color: "text-signal-green" },
  partnership: { icon: Shield, label: "Partnership", color: "text-neon-blue" },
  token_burn: { icon: Flame, label: "Token Burn", color: "text-signal-red" },
  insider_leak: { icon: Eye, label: "Insider Leak", color: "text-signal-yellow" },
  etf_rumor: { icon: TrendingUp, label: "ETF Rumor", color: "text-electric-purple" },
  major_announcement: { icon: Radio, label: "Major Announcement", color: "text-neon-blue" },
  general_hype: { icon: Flame, label: "General Hype", color: "text-signal-yellow" },
}

function getTimeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "Just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function ConfidenceBar({ value }: { value: number }) {
  const getColor = () => {
    if (value >= 70) return "bg-signal-red"
    if (value >= 50) return "bg-signal-yellow"
    return "bg-signal-green"
  }

  return (
    <div className="w-full h-1.5 bg-muted/30 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={cn("h-full rounded-full", getColor())}
      />
    </div>
  )
}

function SourceBadge({ platform, count }: { platform: string; count?: number }) {
  const colors: Record<string, string> = {
    Twitter: "bg-[#1DA1F2]/15 text-[#1DA1F2] border-[#1DA1F2]/30",
    Telegram: "bg-[#0088CC]/15 text-[#0088CC] border-[#0088CC]/30",
    Reddit: "bg-[#FF4500]/15 text-[#FF4500] border-[#FF4500]/30",
    Discord: "bg-[#5865F2]/15 text-[#5865F2] border-[#5865F2]/30",
  }

  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full border uppercase tracking-wider",
      colors[platform] || "bg-muted/20 text-muted-foreground border-border/50"
    )}>
      {platform}
      {count !== undefined && <span className="opacity-70">({count})</span>}
    </span>
  )
}

function RumorCard({ alert, index }: { alert: RumorAlert; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const typeConfig = RUMOR_TYPE_CONFIG[alert.rumor_type] || RUMOR_TYPE_CONFIG.general_hype
  const TypeIcon = typeConfig.icon

  const isHighConfidence = alert.confidence >= 70
  const isMediumConfidence = alert.confidence >= 50

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className={cn(
        "relative p-4 rounded-xl border bg-card/60 backdrop-blur-sm transition-all duration-300 cursor-pointer",
        isHighConfidence
          ? "border-signal-red/40 hover:border-signal-red/70 hover:shadow-[0_0_20px_rgba(255,77,109,0.15)]"
          : isMediumConfidence
          ? "border-signal-yellow/30 hover:border-signal-yellow/60 hover:shadow-[0_0_20px_rgba(255,209,102,0.1)]"
          : "border-border/50 hover:border-neon-blue/40"
      )}
      onClick={() => setExpanded(!expanded)}
    >
      {/* High confidence pulse */}
      {isHighConfidence && (
        <div className="absolute top-3 right-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal-red opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-signal-red" />
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className={cn("p-2 rounded-lg bg-card/80 border border-border/50", typeConfig.color)}>
          <TypeIcon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-signal-red">
              🚨 {typeConfig.label}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-foreground leading-tight pr-6">
            {alert.rumor}
          </h3>
        </div>
      </div>

      {/* Coin + Confidence */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-neon-blue/10 border border-neon-blue/30 text-neon-blue font-mono font-bold text-sm">
            {alert.coin}
          </span>
          <div className="flex gap-1">
            {alert.sources.map((src) => (
              <SourceBadge key={src} platform={src} />
            ))}
          </div>
        </div>
        <div className="text-right">
          <div className={cn(
            "text-lg font-bold font-mono",
            isHighConfidence ? "text-signal-red" : isMediumConfidence ? "text-signal-yellow" : "text-signal-green"
          )}>
            {alert.confidence}%
          </div>
        </div>
      </div>

      {/* Confidence bar */}
      <ConfidenceBar value={alert.confidence} />

      {/* Timestamp + expand */}
      <div className="flex items-center justify-between mt-2">
        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {getTimeAgo(alert.first_detected)}
        </span>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-3 pt-3 border-t border-border/50 space-y-2">
              {alert.source_mentions && (
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(alert.source_mentions).map(([platform, count]) => (
                    <div key={platform} className="flex items-center justify-between p-2 bg-muted/20 rounded-lg">
                      <SourceBadge platform={platform} />
                      <span className="text-xs font-mono text-foreground/80">{count} mentions</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span>First detected: {new Date(alert.first_detected).toLocaleString()}</span>
                <span>Updated: {getTimeAgo(alert.last_updated)}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function RumorDetector() {
  const [alerts, setAlerts] = useState<RumorAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)
  const { t } = useTranslation()

  const fetchAlerts = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/rumor-alerts")
      if (!res.ok) return
      const data = await res.json()
      if (data && data.length > 0) {
        setAlerts(data)
      }
    } catch (err) {
      console.error("Failed to fetch rumor alerts:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAlerts()
    const interval = setInterval(fetchAlerts, 60000 * 2) // Refresh every 2 min
    return () => clearInterval(interval)
  }, [])

  const displayedAlerts = showAll ? alerts : alerts.slice(0, 4)
  const highConfidence = alerts.filter((a) => a.confidence >= 70).length

  return (
    <div className="rounded-xl border border-border bg-card/60 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-signal-red/10 border border-signal-red/30">
              <AlertTriangle className="w-5 h-5 text-signal-red" />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold text-foreground flex items-center gap-2">
                AI Rumor Detector
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal-green opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-signal-green" />
                </span>
              </h2>
              <p className="text-xs text-muted-foreground">
                Real-time social intelligence • {alerts.length} active rumors
              </p>
            </div>
          </div>

          {highConfidence > 0 && (
            <div className="px-3 py-1.5 rounded-full bg-signal-red/10 border border-signal-red/30 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-signal-red" />
              <span className="text-xs font-bold text-signal-red">{highConfidence} High Alert</span>
            </div>
          )}
        </div>
      </div>

      {/* Rumor Cards */}
      <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-neon-blue/20 scrollbar-track-transparent">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-8 h-8 border-2 border-signal-red/30 border-t-signal-red rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Scanning social platforms...</p>
          </div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="w-12 h-12 text-signal-green mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground text-sm">No significant rumors detected</p>
            <p className="text-muted-foreground/60 text-xs mt-1">Markets appear calm</p>
          </div>
        ) : (
          displayedAlerts.map((alert, i) => (
            <RumorCard key={alert.id} alert={alert} index={i} />
          ))
        )}
      </div>

      {/* View More */}
      {!showAll && alerts.length > 4 && (
        <div className="p-3 border-t border-border bg-card/60">
          <button
            onClick={() => setShowAll(true)}
            className="w-full text-center text-sm font-medium text-signal-red hover:text-signal-red/80 hover:bg-signal-red/5 py-2.5 rounded-lg transition-all border border-transparent hover:border-signal-red/20"
          >
            View all {alerts.length} rumor alerts
          </button>
        </div>
      )}
    </div>
  )
}
