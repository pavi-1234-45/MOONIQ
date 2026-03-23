import { motion } from "framer-motion";
import { Brain, Sparkles, AlertTriangle } from "lucide-react";

const insights = [
  {
    coin: "PEPE",
    text: "PEPE mentions increased 4x compared to baseline, sentiment is strongly positive at 82%, and engagement has surged across Twitter and Reddit. Social velocity indicates early pump phase.",
    confidence: 88,
    type: "bullish" as const,
  },
  {
    coin: "BONK",
    text: "BONK is showing classic pump pattern: simultaneous spike in volume (+340%), mentions, and whale activity. Historical pattern match suggests 72% probability of continued upward movement.",
    confidence: 76,
    type: "bullish" as const,
  },
  {
    coin: "ETH",
    text: "Ethereum sentiment declining as network fees surge. Social engagement dropping 15% week-over-week. Institutional flow data shows neutral positioning.",
    confidence: 65,
    type: "bearish" as const,
  },
];

const AIInsights = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.8 }}
    className="glass rounded-xl p-5"
  >
    <h2 className="font-heading text-sm font-semibold text-secondary tracking-wider mb-4 flex items-center gap-2">
      <Brain size={16} />
      AI INSIGHTS
      <span className="ml-auto flex items-center gap-1 text-[10px] text-primary animate-pulse-glow">
        <Sparkles size={10} /> Live Analysis
      </span>
    </h2>
    <div className="space-y-3">
      {insights.map((ins, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9 + i * 0.1 }}
          className={`rounded-lg p-4 border ${ins.type === "bullish" ? "border-neon-green/20 bg-neon-green/5" : "border-destructive/20 bg-destructive/5"}`}
        >
          <div className="flex items-center gap-2 mb-2">
            {ins.type === "bullish" ? (
              <Sparkles size={14} className="text-neon-green" />
            ) : (
              <AlertTriangle size={14} className="text-destructive" />
            )}
            <span className="font-heading text-xs font-bold">{ins.coin}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded ${ins.type === "bullish" ? "bg-neon-green/20 text-neon-green" : "bg-destructive/20 text-destructive"}`}>
              Confidence: {ins.confidence}%
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{ins.text}</p>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

export default AIInsights;
