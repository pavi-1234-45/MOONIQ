"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { BacktestingPanel } from "@/components/backtesting-panel"
import { useTranslation } from "react-i18next"

export default function BacktestingPage() {
  const { t } = useTranslation()
  
  return (
    <DashboardLayout 
       title={<span className="text-signal-yellow text-glow-yellow">{t("backtesting_hub")}</span>}
       subtitle={t("backtesting_subtitle")}
    >
      <div className="max-w-6xl mx-auto w-full">
         <BacktestingPanel />
      </div>
    </DashboardLayout>
  )
}
