import { motion } from "framer-motion";
import { Activity, Cpu, RefreshCw, Zap } from "lucide-react";
import { useEffect, useState } from "react";

const coins = ["BTC", "ETH", "SOL", "PEPE", "DOGE", "BONK", "SHIB", "ADA", "AVAX", "MATIC"];

const AIActivityPanel = () => {
  const [currentCoin, setCurrentCoin] = useState(0);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCoin((c) => (c + 1) % coins.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((t) => (t <= 0 ? 30 : t - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.1 }}
      className="glass rounded-xl p-5"
    >
      <h2 className="font-heading text-sm font-semibold text-primary tracking-wider mb-4 flex items-center gap-2">
        <Cpu size={16} className="animate-pulse-glow" />
        AI ACTIVITY
      </h2>
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <Activity size={16} className="text-primary animate-pulse-glow" />
          <div className="flex-1">
            <div className="text-xs text-muted-foreground">Currently analyzing</div>
            <motion.div
              key={currentCoin}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-heading text-sm font-bold text-primary"
            >
              {coins[currentCoin]}
            </motion.div>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-neon-green/5 border border-neon-green/20">
          <Zap size={16} className="text-neon-green" />
          <div>
            <div className="text-xs text-muted-foreground">Signals detected</div>
            <div className="font-heading text-sm font-bold text-neon-green">14 signals</div>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/5 border border-secondary/20">
          <RefreshCw size={16} className="text-secondary animate-spin-slow" />
          <div>
            <div className="text-xs text-muted-foreground">Next refresh</div>
            <div className="font-heading text-sm font-bold text-secondary">{timer}s</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AIActivityPanel;
