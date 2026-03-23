import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingUp, BarChart3, MessageCircle, Zap, Activity } from "lucide-react";
import { LineChart, Line, AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

interface CryptoAsset {
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  volume: string;
  mentions: number;
  sentiment: number;
  hype: number;
  virality: number;
  hypePhase: string;
  trendScore: number;
  pumpSignal: boolean;
}

interface Props {
  asset: CryptoAsset | null;
  onClose: () => void;
}

const generateChartData = (base: number, volatility: number, points = 24) =>
  Array.from({ length: points }, (_, i) => ({
    t: `${i}h`,
    value: Math.max(0, base + (Math.random() - 0.5) * volatility * 2 + Math.sin(i / 3) * volatility * 0.5),
  }));

const MiniChart = ({ data, color, filled = false }: { data: { t: string; value: number }[]; color: string; filled?: boolean }) => (
  <ResponsiveContainer width="100%" height={120}>
    {filled ? (
      <AreaChart data={data}>
        <defs>
          <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="t" tick={{ fontSize: 9, fill: "hsl(215 15% 55%)" }} axisLine={false} tickLine={false} />
        <YAxis hide />
        <Tooltip
          contentStyle={{ background: "hsl(222 40% 10%)", border: "1px solid hsl(222 20% 18%)", borderRadius: 8, fontSize: 11 }}
          labelStyle={{ color: "hsl(200 20% 90%)" }}
        />
        <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill={`url(#grad-${color})`} />
      </AreaChart>
    ) : (
      <LineChart data={data}>
        <XAxis dataKey="t" tick={{ fontSize: 9, fill: "hsl(215 15% 55%)" }} axisLine={false} tickLine={false} />
        <YAxis hide />
        <Tooltip
          contentStyle={{ background: "hsl(222 40% 10%)", border: "1px solid hsl(222 20% 18%)", borderRadius: 8, fontSize: 11 }}
          labelStyle={{ color: "hsl(200 20% 90%)" }}
        />
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
      </LineChart>
    )}
  </ResponsiveContainer>
);

const phaseTimeline = ["Calm", "Emerging", "Peak", "Cooling"];
const phaseColors: Record<string, string> = {
  Calm: "bg-neon-green",
  Emerging: "bg-neon-yellow",
  Peak: "bg-destructive",
  Cooling: "bg-primary",
};

const AssetDetailPanel = ({ asset, onClose }: Props) => (
  <AnimatePresence>
    {asset && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40"
          onClick={onClose}
        />
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="fixed right-0 top-0 h-full w-full max-w-lg z-50 glass border-l border-border/30 overflow-y-auto"
        >
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center font-heading text-sm font-bold text-primary">
                  {asset.symbol.slice(0, 2)}
                </div>
                <div>
                  <h2 className="font-heading text-lg font-bold">{asset.name}</h2>
                  <span className="text-sm text-muted-foreground">{asset.symbol}</span>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Metric cards */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Trend Score", value: `${asset.trendScore}%`, icon: TrendingUp, color: "text-neon-green" },
                { label: "Hype Score", value: `${asset.hype}%`, icon: Zap, color: "text-neon-yellow" },
                { label: "Virality", value: `${asset.virality}%`, icon: BarChart3, color: "text-secondary" },
                { label: "Sentiment", value: `${asset.sentiment}%`, icon: MessageCircle, color: "text-primary" },
              ].map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className="glass rounded-lg p-3"
                >
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <m.icon size={12} className={m.color} />
                    {m.label}
                  </div>
                  <div className={`font-heading text-xl font-bold ${m.color}`}>{m.value}</div>
                </motion.div>
              ))}
            </div>

            {/* Price chart */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="glass rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Price (24h)</span>
                <span className={`text-sm font-bold ${asset.change24h >= 0 ? "text-neon-green" : "text-destructive"}`}>
                  {asset.change24h >= 0 ? "+" : ""}{asset.change24h}%
                </span>
              </div>
              <MiniChart data={generateChartData(asset.price, asset.price * 0.05)} color="#00D1FF" filled />
            </motion.div>

            {/* Sentiment chart */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="glass rounded-lg p-4">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Sentiment Trend</span>
              <MiniChart data={generateChartData(asset.sentiment, 15)} color="#00FFB3" />
            </motion.div>

            {/* Mentions chart */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="glass rounded-lg p-4">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Mentions Growth</span>
              <MiniChart data={generateChartData(asset.mentions / 1000, asset.mentions / 5000)} color="#9B5CFF" filled />
            </motion.div>

            {/* Virality chart */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="glass rounded-lg p-4">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Virality Score</span>
              <MiniChart data={generateChartData(asset.virality, 20)} color="#FF4D6D" />
            </motion.div>

            {/* Hype Phase Timeline */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="glass rounded-lg p-4">
              <span className="text-xs text-muted-foreground uppercase tracking-wider mb-3 block">Hype Phase Timeline</span>
              <div className="flex items-center gap-1">
                {phaseTimeline.map((phase) => (
                  <div key={phase} className="flex-1 flex flex-col items-center gap-1.5">
                    <div
                      className={`h-2 w-full rounded-full transition-all ${
                        phase === asset.hypePhase
                          ? `${phaseColors[phase]} shadow-[0_0_10px_currentColor]`
                          : "bg-muted/40"
                      }`}
                    />
                    <span className={`text-[10px] ${phase === asset.hypePhase ? "text-foreground font-bold" : "text-muted-foreground"}`}>
                      {phase}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Pump signal */}
            {asset.pumpSignal && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 flex items-center gap-3"
              >
                <Activity size={20} className="text-destructive animate-pulse-glow" />
                <div>
                  <div className="text-sm font-heading font-bold text-destructive">🚀 Active Pump Signal</div>
                  <p className="text-xs text-muted-foreground mt-0.5">Hype, virality, sentiment and volume are spiking simultaneously.</p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

export default AssetDetailPanel;
