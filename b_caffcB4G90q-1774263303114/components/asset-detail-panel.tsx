"use client"

import dynamic from "next/dynamic"
import { X, TrendingUp, TrendingDown, MessageCircle, Zap, BarChart3, Clock, Sparkles } from "lucide-react"

// Dynamically import 3D components to avoid SSR issues
const PriceChart3D = dynamic(() => import("./three-charts").then(mod => ({ default: mod.PriceChart3D })), { 
  ssr: false,
  loading: () => <div className="w-full h-64 bg-card/50 rounded-xl animate-pulse" />
})
const SentimentSphere3D = dynamic(() => import("./three-charts").then(mod => ({ default: mod.SentimentSphere3D })), { 
  ssr: false,
  loading: () => <div className="w-full h-48 bg-card/50 rounded-xl animate-pulse" />
})
const ViralityNetwork3D = dynamic(() => import("./three-charts").then(mod => ({ default: mod.ViralityNetwork3D })), { 
  ssr: false,
  loading: () => <div className="w-full h-48 bg-card/50 rounded-xl animate-pulse" />
})
const EngagementHeatmap3D = dynamic(() => import("./three-charts").then(mod => ({ default: mod.EngagementHeatmap3D })), { 
  ssr: false,
  loading: () => <div className="w-full h-48 bg-card/50 rounded-xl animate-pulse" />
})
import { cn } from "@/lib/utils"
import type { CryptoAsset } from "./crypto-radar-table"
import { motion, AnimatePresence } from "framer-motion"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"


interface AssetDetailPanelProps {
  asset: CryptoAsset | null
  onClose: () => void
}

// Generate mock chart data
function generateChartData(baseValue: number, points: number, variance: number) {
  const data = []
  let value = baseValue
  for (let i = 0; i < points; i++) {
    value = value + (Math.random() - 0.5) * variance
    data.push({
      time: `${i}h`,
      value: Math.max(0, value),
      label: `${i}h`
    })
  }
  return data
}

function MetricCard({ label, value, change, icon: Icon, color, delay = 0 }: {
  label: string
  value: string | number
  change?: number
  icon: React.ElementType
  color: "blue" | "purple" | "green" | "yellow" | "red"
  delay?: number
}) {
  const colorMap = {
    blue: "text-neon-blue bg-neon-blue/10 border-neon-blue/30",
    purple: "text-electric-purple bg-electric-purple/10 border-electric-purple/30",
    green: "text-signal-green bg-signal-green/10 border-signal-green/30",
    yellow: "text-signal-yellow bg-signal-yellow/10 border-signal-yellow/30",
    red: "text-signal-red bg-signal-red/10 border-signal-red/30",
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: delay * 0.1, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className={cn("p-4 rounded-xl border-2 backdrop-blur-sm", colorMap[color])}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className={cn("w-4 h-4", `text-${color === "blue" ? "neon-blue" : color === "purple" ? "electric-purple" : `signal-${color}`}`)} />
        <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold font-display">{value}</span>
        {change !== undefined && (
          <span className={cn(
            "text-sm font-medium flex items-center gap-1",
            change >= 0 ? "text-signal-green" : "text-signal-red"
          )}>
            {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {change >= 0 ? "+" : ""}{change}%
          </span>
        )}
      </div>
    </motion.div>
  )
}

function ChartSection({ title, data, color, type = "line", delay = 0 }: {
  title: string
  data: { time: string; value: number }[]
  color: string
  type?: "line" | "area"
  delay?: number
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="p-4 rounded-xl bg-muted/20 border border-border/50 backdrop-blur-sm"
    >
      <h4 className="text-sm font-medium text-muted-foreground mb-3">{title}</h4>
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          {type === "area" ? (
            <AreaChart data={data}>
              <defs>
                <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 10 }} />
              <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(11, 15, 26, 0.95)',
                  border: '1px solid rgba(0, 209, 255, 0.3)',
                  borderRadius: '12px',
                  color: '#E8EAED',
                  backdropFilter: 'blur(10px)'
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                fill={`url(#gradient-${title})`}
                strokeWidth={2}
              />
            </AreaChart>
          ) : (
            <LineChart data={data}>
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 10 }} />
              <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(11, 15, 26, 0.95)',
                  border: '1px solid rgba(0, 209, 255, 0.3)',
                  borderRadius: '12px',
                  color: '#E8EAED',
                  backdropFilter: 'blur(10px)'
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}

function HypePhaseTimeline({ currentPhase }: { currentPhase: string }) {
  const phases = ["Calm", "Emerging", "Peak", "Cooling"]
  const currentIndex = phases.indexOf(currentPhase)

  const phaseColors = {
    Calm: "signal-green",
    Emerging: "signal-yellow",
    Peak: "signal-red",
    Cooling: "neon-blue"
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="p-4 rounded-xl bg-muted/20 border border-border/50 backdrop-blur-sm"
    >
      <h4 className="text-sm font-medium text-muted-foreground mb-4">Hype Phase Timeline</h4>
      <div className="relative">
        <div className="flex justify-between mb-2">
          {phases.map((phase, index) => (
            <motion.div 
              key={phase} 
              className="flex flex-col items-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1, type: "spring" }}
            >
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-xs font-medium border-2 transition-all",
                index < currentIndex && "bg-signal-green/20 border-signal-green text-signal-green",
                index === currentIndex && `bg-${phaseColors[phase as keyof typeof phaseColors]}/20 border-${phaseColors[phase as keyof typeof phaseColors]} text-${phaseColors[phase as keyof typeof phaseColors]} animate-pulse`,
                index > currentIndex && "bg-muted/50 border-border text-muted-foreground"
              )}>
                {index + 1}
              </div>
              <span className={cn(
                "text-xs mt-2",
                index === currentIndex ? "text-foreground font-medium" : "text-muted-foreground"
              )}>
                {phase}
              </span>
            </motion.div>
          ))}
        </div>
        <div className="absolute top-5 left-5 right-5 h-0.5 bg-border -z-10">
          <motion.div
            className="h-full bg-gradient-to-r from-signal-green via-signal-yellow to-signal-red"
            initial={{ width: 0 }}
            animate={{ width: `${(currentIndex / (phases.length - 1)) * 100}%` }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>
  )
}

export function AssetDetailPanel({ asset, onClose }: AssetDetailPanelProps) {
  if (!asset) return null

  const priceData = generateChartData(asset.price * 0.9, 24, asset.price * 0.05)
  const sentimentData = generateChartData(asset.sentiment - 10, 24, 8)
  const mentionsData = generateChartData(asset.mentions * 0.8, 24, asset.mentions * 0.1)
  const viralityData = generateChartData(asset.viralityScore - 15, 24, 10)

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed inset-y-0 right-0 w-full max-w-2xl bg-background/95 backdrop-blur-xl border-l border-border shadow-2xl z-50 overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 p-4 border-b border-border bg-background/90 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center text-3xl bg-gradient-to-br from-muted/80 to-muted/30 border border-border/50",
                  asset.pumpSignal && "animate-pulse border-signal-red shadow-[0_0_20px_rgba(255,77,109,0.3)]"
                )}
              >
                {asset.icon}
              </motion.div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-display font-bold">{asset.name}</h2>
                  <span className="text-muted-foreground">{asset.symbol}</span>
                  {asset.pumpSignal && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="px-2 py-0.5 text-xs font-bold bg-signal-red/20 text-signal-red rounded-full border border-signal-red/50 animate-pulse"
                    >
                      PUMP SIGNAL
                    </motion.span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm mt-1">
                  <span className="font-mono text-lg">${asset.price.toLocaleString(undefined, { maximumFractionDigits: 8 })}</span>
                  <span className={cn(
                    "font-medium px-2 py-0.5 rounded-full text-xs",
                    asset.change24h >= 0 ? "text-signal-green bg-signal-green/10" : "text-signal-red bg-signal-red/10"
                  )}>
                    {asset.change24h >= 0 ? "+" : ""}{asset.change24h}%
                  </span>
                </div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-muted/50 transition-colors border border-border/50"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        <div className="p-4 space-y-5">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <MetricCard
              label="Trend Score"
              value={`${asset.trendScore}%`}
              change={5.2}
              icon={TrendingUp}
              color="blue"
              delay={0}
            />
            <MetricCard
              label="Hype Score"
              value={`${asset.hypeScore}%`}
              change={12.8}
              icon={Zap}
              color="purple"
              delay={1}
            />
            <MetricCard
              label="Virality"
              value={`${asset.viralityScore}%`}
              change={8.4}
              icon={MessageCircle}
              color="green"
              delay={2}
            />
            <MetricCard
              label="Sentiment"
              value={`${asset.sentiment}%`}
              change={asset.sentiment >= 50 ? 3.2 : -2.1}
              icon={BarChart3}
              color={asset.sentiment >= 70 ? "green" : asset.sentiment >= 50 ? "yellow" : "red"}
              delay={3}
            />
          </div>

          {/* Hype Phase Timeline */}
          <HypePhaseTimeline currentPhase={asset.hypePhase} />

          {/* 3D Visualizations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="w-4 h-4 text-electric-purple" />
              <span className="font-medium">3D Data Visualizations</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground mb-2">Price Chart 3D</p>
                <PriceChart3D data={priceData} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Sentiment Sphere</p>
                <SentimentSphere3D sentiment={asset.sentiment} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Virality Network</p>
                <ViralityNetwork3D />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Engagement Heatmap</p>
                <EngagementHeatmap3D />
              </div>
            </div>
          </motion.div>

          {/* Traditional Charts */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>24h Analysis</span>
            </div>

            <ChartSection
              title="Price Movement"
              data={priceData}
              color="#00D1FF"
              type="area"
              delay={0.5}
            />

            <div className="grid grid-cols-2 gap-3">
              <ChartSection
                title="Sentiment Trend"
                data={sentimentData}
                color="#00FFB3"
                delay={0.6}
              />
              <ChartSection
                title="Virality Score"
                data={viralityData}
                color="#9B5CFF"
                delay={0.7}
              />
            </div>

            <ChartSection
              title="Mentions Growth"
              data={mentionsData}
              color="#FFD166"
              type="area"
              delay={0.8}
            />
          </div>

          {/* AI Analysis */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="p-5 rounded-xl border-2 border-electric-purple/30 bg-gradient-to-br from-electric-purple/10 to-transparent"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-electric-purple/20">
                <Sparkles className="w-4 h-4 text-electric-purple" />
              </div>
              <span className="font-medium text-electric-purple font-display">AI Analysis</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {asset.name} is showing <span className="text-foreground font-medium">{asset.hypePhase.toLowerCase()}</span> phase characteristics with 
              <span className={cn(
                "font-medium",
                asset.sentiment >= 70 ? " text-signal-green" : asset.sentiment >= 50 ? " text-signal-yellow" : " text-signal-red"
              )}>
                {asset.sentiment >= 70 ? " strongly positive" : asset.sentiment >= 50 ? " moderately positive" : " mixed"}
              </span> sentiment. 
              Social mentions are <span className="text-neon-blue font-medium">{asset.hypeScore >= 80 ? "surging" : asset.hypeScore >= 60 ? "increasing" : "stable"}</span> with 
              <span className="text-electric-purple font-medium">{asset.viralityScore >= 85 ? " exceptional" : asset.viralityScore >= 70 ? " high" : " moderate"}</span> virality scores.
              {asset.pumpSignal && <span className="text-signal-red font-medium"> Strong pump signal detected - coordinated spikes across multiple metrics.</span>}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
