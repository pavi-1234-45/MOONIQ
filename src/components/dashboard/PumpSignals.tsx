import { motion } from "framer-motion";
import { Rocket, TrendingUp, BarChart3, MessageCircle } from "lucide-react";

const pumpSignals = [
  { name: "BONK", symbol: "BONK", hype: 88, virality: 91, sentiment: 85, volume: "+340%", score: 92 },
  { name: "Pepe", symbol: "PEPE", hype: 91, virality: 94, sentiment: 82, volume: "+180%", score: 88 },
  { name: "Shiba Inu", symbol: "SHIB", hype: 78, virality: 82, sentiment: 71, volume: "+120%", score: 76 },
];

const PumpSignals = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.6 }}
    className="glass rounded-xl p-5"
  >
    <h2 className="font-heading text-sm font-semibold text-destructive tracking-wider mb-4 flex items-center gap-2">
      <Rocket size={16} />
      PUMP SIGNAL DETECTOR
    </h2>
    <div className="space-y-3">
      {pumpSignals.map((s, i) => (
        <motion.div
          key={s.symbol}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 + i * 0.1 }}
          whileHover={{ scale: 1.02 }}
          className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 cursor-pointer hover:border-destructive/40 transition-all"
          style={{ boxShadow: "0 0 20px rgba(255,77,109,0.1)" }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-destructive/30 to-secondary/30 flex items-center justify-center text-xs font-heading font-bold text-destructive">
                {s.symbol.slice(0, 2)}
              </div>
              <div>
                <div className="font-medium text-sm">{s.name}</div>
                <div className="text-xs text-muted-foreground">{s.symbol}</div>
              </div>
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-destructive/20 text-destructive font-heading font-bold animate-pulse-glow">
              Score: {s.score}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2 text-[11px]">
            <div className="flex items-center gap-1"><TrendingUp size={10} className="text-neon-green" /> Hype {s.hype}%</div>
            <div className="flex items-center gap-1"><BarChart3 size={10} className="text-primary" /> Virality {s.virality}%</div>
            <div className="flex items-center gap-1"><MessageCircle size={10} className="text-secondary" /> Sent. {s.sentiment}%</div>
            <div className="flex items-center gap-1"><BarChart3 size={10} className="text-neon-green" /> Vol {s.volume}</div>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

export default PumpSignals;
