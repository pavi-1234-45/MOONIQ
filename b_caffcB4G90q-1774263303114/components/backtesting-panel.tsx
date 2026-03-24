"use client"

import { BarChart3, TrendingUp, Target, Percent } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

interface ModelMetrics {
  name: string
  accuracy: number
  precision: number
  recall: number
  f1Score: number
  color: string
}

const models: ModelMetrics[] = [
  {
    name: "Random Model",
    accuracy: 52,
    precision: 48,
    recall: 51,
    f1Score: 49,
    color: "#6B7280",
  },
  {
    name: "Price-only Model",
    accuracy: 64,
    precision: 61,
    recall: 58,
    f1Score: 59,
    color: "#FFD166",
  },
  {
    name: "Social + ML Model",
    accuracy: 84,
    precision: 82,
    recall: 79,
    f1Score: 80,
    color: "#00D1FF",
  },
]

const chartData = models.map((model) => ({
  name: model.name.split(" ")[0],
  Accuracy: model.accuracy,
  Precision: model.precision,
  Recall: model.recall,
  F1: model.f1Score,
  color: model.color,
}))

function MetricComparison({ metric, values }: { metric: string; values: { name: string; value: number; color: string }[] }) {
  const maxValue = Math.max(...values.map(v => v.value))

  return (
    <div className="space-y-2">
      <div className="text-xs text-muted-foreground">{metric}</div>
      {values.map((item) => (
        <div key={item.name} className="flex items-center gap-2">
          <div className="w-20 text-xs text-muted-foreground truncate">{item.name.split(" ")[0]}</div>
          <div className="flex-1 h-4 bg-muted/30 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${item.value}%`,
                backgroundColor: item.color,
                boxShadow: item.value === maxValue ? `0 0 10px ${item.color}` : "none",
              }}
            />
          </div>
          <div className="w-10 text-xs font-medium text-right" style={{ color: item.color }}>
            {item.value}%
          </div>
        </div>
      ))}
    </div>
  )
}

export function BacktestingPanel() {
  return (
    <div className="rounded-xl border border-border bg-card/60 backdrop-blur-sm overflow-hidden">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-neon-blue" />
          <h2 className="text-lg font-display font-bold text-neon-blue text-glow-blue">
            Backtesting Lab
          </h2>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Model performance comparison
        </p>
      </div>

      <div className="p-4">
        {/* Chart */}
        <div className="h-48 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barGap={8}>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 11 }}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111827',
                  border: '1px solid #1F2937',
                  borderRadius: '8px',
                  color: '#E8EAED',
                }}
              />
              <Bar dataKey="Accuracy" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Metric Comparisons */}
        <div className="space-y-4">
          <MetricComparison
            metric="Accuracy"
            values={models.map(m => ({ name: m.name, value: m.accuracy, color: m.color }))}
          />
          <MetricComparison
            metric="Precision"
            values={models.map(m => ({ name: m.name, value: m.precision, color: m.color }))}
          />
          <MetricComparison
            metric="Recall"
            values={models.map(m => ({ name: m.name, value: m.recall, color: m.color }))}
          />
          <MetricComparison
            metric="F1 Score"
            values={models.map(m => ({ name: m.name, value: m.f1Score, color: m.color }))}
          />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-border/50">
          {models.map((model) => (
            <div key={model.name} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: model.color }}
              />
              <span className="text-xs text-muted-foreground">{model.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
