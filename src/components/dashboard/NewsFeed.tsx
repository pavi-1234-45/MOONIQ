import { motion } from "framer-motion";
import { Newspaper, ExternalLink } from "lucide-react";

const news = [
  { headline: "PEPE surges 200% amid viral meme campaign", asset: "PEPE", sentiment: "Bullish", source: "CoinDesk", time: "2m ago" },
  { headline: "Bitcoin ETF inflows hit record $1.2B in single day", asset: "BTC", sentiment: "Bullish", source: "Bloomberg", time: "15m ago" },
  { headline: "Solana DEX volume surpasses Ethereum for first time", asset: "SOL", sentiment: "Bullish", source: "The Block", time: "32m ago" },
  { headline: "SEC signals potential crackdown on meme coins", asset: "MARKET", sentiment: "Bearish", source: "Reuters", time: "1h ago" },
  { headline: "AI crypto tokens rally as OpenAI announces partnerships", asset: "AI", sentiment: "Bullish", source: "Decrypt", time: "2h ago" },
];

const sentimentColor: Record<string, string> = {
  Bullish: "text-neon-green bg-neon-green/10 border-neon-green/30",
  Bearish: "text-destructive bg-destructive/10 border-destructive/30",
  Neutral: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
};

const NewsFeed = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.7 }}
    className="glass rounded-xl p-5"
  >
    <h2 className="font-heading text-sm font-semibold text-primary tracking-wider mb-4 flex items-center gap-2">
      <Newspaper size={16} />
      LIVE NEWS
    </h2>
    <div className="space-y-2">
      {news.map((n, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 + i * 0.08 }}
          whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.03)" }}
          className="flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all border border-transparent hover:border-border/30"
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium leading-snug">{n.headline}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-medium">{n.asset}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${sentimentColor[n.sentiment]}`}>{n.sentiment}</span>
              <span className="text-[10px] text-muted-foreground">{n.source}</span>
              <span className="text-[10px] text-muted-foreground">{n.time}</span>
            </div>
          </div>
          <ExternalLink size={14} className="text-muted-foreground mt-1 flex-shrink-0" />
        </motion.div>
      ))}
    </div>
  </motion.div>
);

export default NewsFeed;
