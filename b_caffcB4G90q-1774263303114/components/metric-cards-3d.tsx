"use client"

import { API_BASE } from "@/lib/api"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { TrendingUp, Flame, Zap, Rocket, Dog, Activity } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useTranslation } from "react-i18next"

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  color: "blue" | "purple" | "green" | "red" | "yellow"
  sparklineData?: number[]
  delay?: number
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  
  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 100
      const y = 100 - ((value - min) / range) * 100
      return `${x},${y}`
    })
    .join(" ")

  return (
    <svg viewBox="0 0 100 100" className="w-full h-12" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`sparkline-3d-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <polygon
        fill={`url(#sparkline-3d-${color})`}
        points={`0,100 ${points} 100,100`}
      />
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        points={points}
        filter="url(#glow)"
      />
    </svg>
  )
}

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const duration = 2000
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setDisplayValue(Math.round(value * easeOutQuart))
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [value])

  return <span>{displayValue.toLocaleString()}{suffix}</span>
}

function MetricCard3D({ title, value, subtitle, icon, color, sparklineData, delay = 0 }: MetricCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 300, damping: 30 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) / rect.width)
    y.set((e.clientY - centerY) / rect.height)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const colorMap = {
    blue: {
      border: "border-neon-blue/40",
      glow: "shadow-[0_0_30px_rgba(0,209,255,0.3)]",
      text: "text-neon-blue",
      bg: "bg-neon-blue/15",
      gradient: "from-neon-blue/20 via-transparent to-transparent",
      sparkline: "#00D1FF",
    },
    purple: {
      border: "border-electric-purple/40",
      glow: "shadow-[0_0_30px_rgba(155,92,255,0.3)]",
      text: "text-electric-purple",
      bg: "bg-electric-purple/15",
      gradient: "from-electric-purple/20 via-transparent to-transparent",
      sparkline: "#9B5CFF",
    },
    green: {
      border: "border-signal-green/40",
      glow: "shadow-[0_0_30px_rgba(0,255,179,0.3)]",
      text: "text-signal-green",
      bg: "bg-signal-green/15",
      gradient: "from-signal-green/20 via-transparent to-transparent",
      sparkline: "#00FFB3",
    },
    red: {
      border: "border-signal-red/40",
      glow: "shadow-[0_0_30px_rgba(255,77,109,0.3)]",
      text: "text-signal-red",
      bg: "bg-signal-red/15",
      gradient: "from-signal-red/20 via-transparent to-transparent",
      sparkline: "#FF4D6D",
    },
    yellow: {
      border: "border-signal-yellow/40",
      glow: "shadow-[0_0_30px_rgba(255,209,102,0.3)]",
      text: "text-signal-yellow",
      bg: "bg-signal-yellow/15",
      gradient: "from-signal-yellow/20 via-transparent to-transparent",
      sparkline: "#FFD166",
    },
  }

  const colors = colorMap[color]

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: delay * 0.1,
        type: "spring",
        stiffness: 100
      }}
      style={{ 
        rotateX, 
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative p-6 rounded-2xl border-2 bg-card/60 backdrop-blur-xl cursor-pointer",
        "transition-shadow duration-500 hover:border-opacity-100",
        colors.border
      )}
      whileHover={{ 
        scale: 1.02,
        boxShadow: colors.glow.replace("shadow-", "").replace("[", "").replace("]", "")
      }}
    >
      {/* Animated gradient border */}
      <div className={cn(
        "absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 transition-opacity duration-500",
        colors.gradient,
        "group-hover:opacity-100"
      )} />
      
      {/* Glowing border effect */}
      <div className={cn(
        "absolute -inset-[1px] rounded-2xl bg-gradient-to-r opacity-0 blur-sm transition-opacity duration-500 -z-10",
        `from-${color === 'blue' ? 'neon-blue' : color === 'purple' ? 'electric-purple' : `signal-${color}`}/50 to-transparent`
      )} />

      <div className="relative z-10" style={{ transform: "translateZ(30px)" }}>
        <div className="flex items-start justify-between mb-4">
          <motion.div 
            className={cn("p-3 rounded-xl", colors.bg)}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className={colors.text}>{icon}</div>
          </motion.div>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</span>
        </div>

        <motion.div 
          className={cn("text-4xl font-bold mb-2 font-display", colors.text)}
          style={{ textShadow: `0 0 20px ${colors.sparkline}40` }}
        >
          {typeof value === "number" ? (
            <AnimatedNumber 
              value={value} 
              suffix={title.includes("Sentiment") || title.includes("Virality") ? "%" : ""} 
            />
          ) : (
            value
          )}
        </motion.div>

        {subtitle && (
          <p className="text-sm text-muted-foreground font-medium">{subtitle}</p>
        )}

        {sparklineData && (
          <motion.div 
            className="mt-4"
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ delay: delay * 0.1 + 0.3, duration: 0.5 }}
          >
            <Sparkline data={sparklineData} color={colors.sparkline} />
          </motion.div>
        )}
      </div>

      {/* Corner accents */}
      <div className={cn("absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 rounded-tl-2xl", colors.border)} />
      <div className={cn("absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 rounded-tr-2xl", colors.border)} />
      <div className={cn("absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 rounded-bl-2xl", colors.border)} />
      <div className={cn("absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 rounded-br-2xl", colors.border)} />
    </motion.div>
  )
}

export function MetricCards3D() {
  const router = useRouter()
  const [gasData, setGasData] = useState<{fast: string, base: string} | null>(null)
  const { t } = useTranslation()

  useEffect(() => {
    const fetchGas = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/etherscan")
        if (!res.ok) return
        const data = await res.json()
        if (data && data.FastGasPrice) {
          setGasData({
            fast: data.FastGasPrice,
            base: data.suggestBaseFee || data.SafeGasPrice
          })
        }
      } catch (err) {
        console.error("Failed to fetch Etherscan Gas:", err)
      }
    }
    fetchGas()
    const interval = setInterval(fetchGas, 30000)
    return () => clearInterval(interval)
  }, [])

  const metrics = [
    {
      title: t("total_sentiment"),
      value: 72,
      subtitle: t("from_yesterday"),
      icon: <TrendingUp className="w-6 h-6" />,
      color: "blue" as const,
      sparklineData: [45, 52, 48, 61, 55, 67, 72, 68, 75, 72],
    },
    {
      title: t("top_trending"),
      value: "PEPE",
      subtitle: `4.2M ${t("mentions")}`,
      icon: <Flame className="w-6 h-6" />,
      color: "purple" as const,
      sparklineData: [20, 35, 42, 38, 55, 72, 85, 92, 88, 95],
    },
    {
      title: t("highest_virality"),
      value: 94,
      subtitle: `DOGE ${t("leading")}`,
      icon: <Zap className="w-6 h-6" />,
      color: "green" as const,
      sparklineData: [60, 65, 72, 78, 82, 88, 91, 89, 93, 94],
    },
    {
      title: t("pump_signal"),
      value: `3 ${t("coins")}`,
      subtitle: t("potential_breakouts"),
      icon: <Rocket className="w-6 h-6" />,
      color: "red" as const,
      sparklineData: [10, 15, 12, 25, 35, 42, 55, 48, 62, 70],
    },
    {
      title: t("top_meme_coin"),
      value: "DOGE",
      subtitle: "$0.0842 (+12.4%)",
      icon: <Dog className="w-6 h-6" />,
      color: "yellow" as const,
      sparklineData: [30, 35, 32, 40, 45, 52, 58, 62, 68, 72],
    },
  ]

  if (gasData) {
    metrics[4] = {
      title: t("eth_fast_gas"),
      value: gasData.fast,
      subtitle: `${t("base_fee")}: ${gasData.base} Gwei`,
      icon: <Activity className="w-6 h-6" />,
      color: "purple" as const,
      sparklineData: [45, 42, 48, 55, 51, 62, 59, 68, 70, parseFloat(gasData.fast) || 72],
    }
  }

  const handleCardClick = (idx: number) => {
    if (idx === 0) router.push("/ai-insights")
    else if (idx === 1) router.push("/trending")
    else if (idx === 2) router.push("/trending")
    else if (idx === 3) router.push("/crypto-radar")
    else if (idx === 4) router.push("/assets")
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
      {metrics.map((metric, index) => (
        <div key={index} onClick={() => handleCardClick(index)}>
          <MetricCard3D {...metric} delay={index} />
        </div>
      ))}
    </div>
  )
}
