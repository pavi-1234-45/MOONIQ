import { motion } from "framer-motion";
import { TrendingUp, Flame, Zap, Rocket, Dog } from "lucide-react";
import { useEffect, useState } from "react";

const AnimatedCounter = ({ target, prefix = "", suffix = "" }: { target: number; prefix?: string; suffix?: string }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 30);
    return () => clearInterval(timer);
  }, [target]);
  return <span className="animate-counter">{prefix}{count.toLocaleString()}{suffix}</span>;
};

const Sparkline = ({ data, color }: { data: number[]; color: string }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80, h = 28;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
  return (
    <svg width={w} height={h} className="opacity-60">
      <polyline fill="none" stroke={color} strokeWidth="1.5" points={points} />
    </svg>
  );
};

const cards = [
  { title: "Total Sentiment", value: 72, suffix: "%", icon: TrendingUp, color: "neon-green", glow: "glow-green", sparkline: [40, 55, 48, 60, 58, 72, 68, 75, 72] },
  { title: "Top Trending", value: 0, label: "PEPE", icon: Flame, color: "primary", glow: "glow-blue", sparkline: [20, 35, 50, 45, 65, 80, 75, 90, 85] },
  { title: "Highest Virality", value: 94, suffix: "%", icon: Zap, color: "secondary", glow: "glow-purple", sparkline: [30, 45, 60, 55, 70, 85, 80, 94, 90] },
  { title: "Pump Signal", value: 3, suffix: " coins", icon: Rocket, color: "destructive", glow: "glow-red", sparkline: [10, 15, 12, 25, 20, 30, 35, 28, 40] },
  { title: "Top Meme Coin", value: 0, label: "DOGE", icon: Dog, color: "neon-green", glow: "glow-green", sparkline: [50, 55, 60, 58, 65, 70, 68, 75, 72] },
];

const OverviewCards = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
    {cards.map((card, i) => (
      <motion.div
        key={card.title}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1, duration: 0.4 }}
        whileHover={{ scale: 1.03, y: -4 }}
        className={`glass glass-hover rounded-xl p-4 cursor-pointer`}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">{card.title}</span>
          <card.icon size={16} className={`text-${card.color}`} />
        </div>
        <div className={`text-2xl font-heading font-bold text-${card.color}`}>
          {card.label ? card.label : <AnimatedCounter target={card.value} suffix={card.suffix} />}
        </div>
        <div className="mt-2">
          <Sparkline data={card.sparkline} color={card.color === "primary" ? "#00D1FF" : card.color === "secondary" ? "#9B5CFF" : card.color === "neon-green" ? "#00FFB3" : card.color === "destructive" ? "#FF4D6D" : "#00D1FF"} />
        </div>
      </motion.div>
    ))}
  </div>
);

export default OverviewCards;
