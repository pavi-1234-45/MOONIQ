import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowUpDown, Filter } from "lucide-react";
import AssetDetailPanel from "./AssetDetailPanel";

type HypePhase = "Calm" | "Emerging" | "Peak" | "Cooling";

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
  hypePhase: HypePhase;
  trendScore: number;
  pumpSignal: boolean;
}

const mockAssets: CryptoAsset[] = [
  { name: "Pepe", symbol: "PEPE", price: 0.00001234, change24h: 18.5, volume: "$1.2B", mentions: 45200, sentiment: 82, hype: 91, virality: 94, hypePhase: "Emerging", trendScore: 72, pumpSignal: true },
  { name: "Dogecoin", symbol: "DOGE", price: 0.1523, change24h: 5.2, volume: "$890M", mentions: 32100, sentiment: 68, hype: 65, virality: 58, hypePhase: "Calm", trendScore: 55, pumpSignal: false },
  { name: "Bitcoin", symbol: "BTC", price: 67432.0, change24h: 2.1, volume: "$28B", mentions: 120000, sentiment: 75, hype: 42, virality: 35, hypePhase: "Calm", trendScore: 48, pumpSignal: false },
  { name: "Ethereum", symbol: "ETH", price: 3521.0, change24h: -1.3, volume: "$14B", mentions: 85000, sentiment: 60, hype: 38, virality: 30, hypePhase: "Cooling", trendScore: 42, pumpSignal: false },
  { name: "Solana", symbol: "SOL", price: 178.45, change24h: 8.7, volume: "$3.2B", mentions: 28000, sentiment: 78, hype: 72, virality: 68, hypePhase: "Emerging", trendScore: 67, pumpSignal: false },
  { name: "Shiba Inu", symbol: "SHIB", price: 0.0000245, change24h: 12.3, volume: "$650M", mentions: 22000, sentiment: 71, hype: 78, virality: 82, hypePhase: "Peak", trendScore: 74, pumpSignal: true },
  { name: "Bonk", symbol: "BONK", price: 0.0000321, change24h: 25.1, volume: "$420M", mentions: 18500, sentiment: 85, hype: 88, virality: 91, hypePhase: "Peak", trendScore: 82, pumpSignal: true },
  { name: "Cardano", symbol: "ADA", price: 0.645, change24h: -0.8, volume: "$780M", mentions: 15000, sentiment: 52, hype: 30, virality: 22, hypePhase: "Cooling", trendScore: 35, pumpSignal: false },
];

const phaseColors: Record<HypePhase, string> = {
  Calm: "text-neon-green border-neon-green/30 bg-neon-green/10",
  Emerging: "text-neon-yellow border-neon-yellow/30 bg-neon-yellow/10",
  Peak: "text-destructive border-destructive/30 bg-destructive/10",
  Cooling: "text-primary border-primary/30 bg-primary/10",
};

const TrendBar = ({ score }: { score: number }) => {
  const color = score >= 65 ? "bg-neon-green" : score >= 40 ? "bg-neon-yellow" : "bg-destructive";
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full rounded-full ${color}`}
          style={{ boxShadow: score >= 65 ? "0 0 8px hsl(160 100% 50%)" : score >= 40 ? "0 0 8px hsl(42 100% 70%)" : "0 0 8px hsl(348 100% 65%)" }}
        />
      </div>
      <span className="text-xs font-mono w-8">{score}%</span>
    </div>
  );
};

const CryptoRadarTable = () => {
  const [sortKey, setSortKey] = useState<keyof CryptoAsset>("trendScore");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [filterPhase, setFilterPhase] = useState<HypePhase | "All">("All");
  const [selectedAsset, setSelectedAsset] = useState<CryptoAsset | null>(null);

  const sorted = [...mockAssets]
    .filter((a) => filterPhase === "All" || a.hypePhase === filterPhase)
    .sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      if (typeof av === "number" && typeof bv === "number") return sortDir === "desc" ? bv - av : av - bv;
      return 0;
    });

  const handleSort = (key: keyof CryptoAsset) => {
    if (sortKey === key) setSortDir(sortDir === "desc" ? "asc" : "desc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const headers: { label: string; key: keyof CryptoAsset }[] = [
    { label: "Asset", key: "name" },
    { label: "Price", key: "price" },
    { label: "24h", key: "change24h" },
    { label: "Volume", key: "volume" },
    { label: "Mentions", key: "mentions" },
    { label: "Sentiment", key: "sentiment" },
    { label: "Hype", key: "hype" },
    { label: "Virality", key: "virality" },
    { label: "Phase", key: "hypePhase" },
    { label: "Trend", key: "trendScore" },
    { label: "Pump", key: "pumpSignal" },
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-border/30">
          <h2 className="font-heading text-sm font-semibold text-primary tracking-wider">CRYPTO RADAR</h2>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-muted-foreground" />
            {(["All", "Calm", "Emerging", "Peak", "Cooling"] as const).map((phase) => (
              <button
                key={phase}
                onClick={() => setFilterPhase(phase)}
                className={`text-xs px-2 py-1 rounded-md transition-colors ${filterPhase === phase ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                {phase}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/20">
                {headers.map((h) => (
                  <th
                    key={h.key}
                    onClick={() => handleSort(h.key)}
                    className="px-4 py-3 text-left text-xs text-muted-foreground font-medium cursor-pointer hover:text-foreground transition-colors"
                  >
                    <span className="flex items-center gap-1">
                      {h.label}
                      <ArrowUpDown size={10} />
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((asset, i) => (
                <motion.tr
                  key={asset.symbol}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedAsset(asset)}
                  className="border-b border-border/10 hover:bg-muted/30 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center text-[10px] font-heading font-bold text-primary">
                        {asset.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-medium">{asset.name}</div>
                        <div className="text-xs text-muted-foreground">{asset.symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">${asset.price < 1 ? asset.price.toFixed(8) : asset.price.toLocaleString()}</td>
                  <td className={`px-4 py-3 text-xs font-medium ${asset.change24h >= 0 ? "text-neon-green" : "text-destructive"}`}>
                    {asset.change24h >= 0 ? "+" : ""}{asset.change24h}%
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{asset.volume}</td>
                  <td className="px-4 py-3 text-xs">{asset.mentions.toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs">{asset.sentiment}%</td>
                  <td className="px-4 py-3 text-xs">{asset.hype}%</td>
                  <td className="px-4 py-3 text-xs">{asset.virality}%</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium animate-pulse-glow ${phaseColors[asset.hypePhase]}`}>
                      {asset.hypePhase}
                    </span>
                  </td>
                  <td className="px-4 py-3"><TrendBar score={asset.trendScore} /></td>
                  <td className="px-4 py-3">
                    {asset.pumpSignal && (
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-destructive/20 text-destructive border border-destructive/30 animate-pulse-glow">
                        🚀 PUMP
                      </span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
      <AssetDetailPanel asset={selectedAsset} onClose={() => setSelectedAsset(null)} />
    </>
  );
};

export default CryptoRadarTable;
