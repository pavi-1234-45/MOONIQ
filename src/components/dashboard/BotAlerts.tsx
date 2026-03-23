import { motion } from "framer-motion";
import { Bell, ToggleLeft, ToggleRight } from "lucide-react";
import { useState } from "react";

const alerts = [
  { coin: "PEPE", message: "Entering Emerging Phase", trendScore: 72, time: "2m ago", active: true },
  { coin: "BONK", message: "Pump Signal Detected", trendScore: 82, time: "5m ago", active: true },
  { coin: "SHIB", message: "Hype Score Above 75%", trendScore: 74, time: "12m ago", active: false },
  { coin: "SOL", message: "Sentiment Spike +15%", trendScore: 67, time: "18m ago", active: true },
];

const BotAlerts = () => {
  const [toggledAlerts, setToggledAlerts] = useState<Record<number, boolean>>(
    Object.fromEntries(alerts.map((a, i) => [i, a.active]))
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 }}
      className="glass rounded-xl p-5"
    >
      <h2 className="font-heading text-sm font-semibold text-primary tracking-wider mb-4 flex items-center gap-2">
        <Bell size={16} />
        BOT ALERTS
      </h2>
      <div className="space-y-2">
        {alerts.map((a, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 + i * 0.08 }}
            className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/20"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-heading text-xs font-bold text-primary">{a.coin}</span>
                <span className="text-xs">{a.message}</span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                <span>Trend Score: <span className="text-neon-green">{a.trendScore}%</span></span>
                <span>{a.time}</span>
              </div>
            </div>
            <button onClick={() => setToggledAlerts({ ...toggledAlerts, [i]: !toggledAlerts[i] })}>
              {toggledAlerts[i] ? (
                <ToggleRight size={24} className="text-primary" />
              ) : (
                <ToggleLeft size={24} className="text-muted-foreground" />
              )}
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default BotAlerts;
