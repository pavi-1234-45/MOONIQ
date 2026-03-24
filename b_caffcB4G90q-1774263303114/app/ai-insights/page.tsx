"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { AIInsights } from "@/components/ai-insights"
import { AIActivity } from "@/components/ai-activity"
import { useTranslation } from "react-i18next"

export default function AIInsightsPage() {
  const { t } = useTranslation()
  
  return (
    <DashboardLayout 
       title={<span className="text-neon-blue text-glow-blue">{t("ai_insights_engine")}</span>}
       subtitle={t("ai_insights_subtitle")}
    >
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
         <div className="xl:col-span-2">
            <AIInsights />
         </div>
         <div>
            <AIActivity />
         </div>
      </div>
    </DashboardLayout>
  )
}
