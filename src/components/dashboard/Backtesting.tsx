import { motion } from "framer-motion";
import { FlaskConical } from "lucide-react";

const models = [
  { name: "Random", accuracy: 32, precision: 28, recall: 35, f1: 31, color: "bg-muted-foreground" },
  { name: "Price-Only", accuracy: 58, precision: 55, recall: 52, f1: 53, color: "bg-primary" },
  { name: "Social + ML", accuracy: 84, precision: 82, recall: 79, f1: 80, color: "bg-neon-green" },
];

const metrics = ["accuracy", "precision", "recall", "f1"] as const;

const Backtesting = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 1 }}
    className="glass rounded-xl p-5"
  >
    <h2 className="font-heading text-sm font-semibold text-secondary tracking-wider mb-4 flex items-center gap-2">
      <FlaskConical size={16} />
      BACKTESTING
    </h2>
    <div className="space-y-4">
      {metrics.map((metric) => (
        <div key={metric}>
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{metric}</div>
          <div className="space-y-1.5">
            {models.map((m, i) => (
              <div key={m.name} className="flex items-center gap-3">
                <span className="text-[11px] w-20 text-muted-foreground">{m.name}</span>
                <div className="flex-1 h-3 bg-muted/30 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${m[metric]}%` }}
                    transition={{ duration: 1, delay: 1.1 + i * 0.1 }}
                    className={`h-full rounded-full ${m.color}`}
                  />
                </div>
                <span className="text-[11px] font-mono w-8">{m[metric]}%</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

export default Backtesting;
