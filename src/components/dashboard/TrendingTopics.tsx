import { motion } from "framer-motion";
import { TrendingUp, Hash } from "lucide-react";

const topics = [
  { tag: "#PEPE", mentions: 45200, growth: "+320%", sentiment: 82, virality: 94 },
  { tag: "#Memecoin", mentions: 38100, growth: "+180%", sentiment: 71, virality: 78 },
  { tag: "#BitcoinETF", mentions: 120000, growth: "+45%", sentiment: 75, virality: 52 },
  { tag: "#AIcrypto", mentions: 28000, growth: "+210%", sentiment: 80, virality: 85 },
  { tag: "#DOGE", mentions: 32100, growth: "+65%", sentiment: 68, virality: 58 },
  { tag: "#Solana", mentions: 28000, growth: "+95%", sentiment: 78, virality: 68 },
];

const TrendingTopics = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5 }}
    className="glass rounded-xl p-5"
  >
    <h2 className="font-heading text-sm font-semibold text-primary tracking-wider mb-4 flex items-center gap-2">
      <Hash size={16} />
      TRENDING TOPICS
    </h2>
    <div className="flex flex-wrap gap-2">
      {topics.map((t, i) => (
        <motion.div
          key={t.tag}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6 + i * 0.08, type: "spring" }}
          whileHover={{ scale: 1.08 }}
          className="glass glass-hover rounded-lg px-4 py-3 cursor-pointer"
        >
          <div className="font-heading text-sm font-bold text-secondary">{t.tag}</div>
          <div className="flex items-center gap-2 mt-1">
            <TrendingUp size={12} className="text-neon-green" />
            <span className="text-xs text-neon-green">{t.growth}</span>
            <span className="text-xs text-muted-foreground">{t.mentions.toLocaleString()} mentions</span>
          </div>
          <div className="flex gap-3 mt-1.5 text-[10px] text-muted-foreground">
            <span>Sentiment: <span className="text-foreground">{t.sentiment}%</span></span>
            <span>Virality: <span className="text-foreground">{t.virality}%</span></span>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

export default TrendingTopics;
