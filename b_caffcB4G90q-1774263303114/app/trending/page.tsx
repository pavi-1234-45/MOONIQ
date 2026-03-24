"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { TrendingTopics } from "@/components/trending-topics"
import { useTranslation } from "react-i18next"

export default function TrendingPage() {
  const { t } = useTranslation()
  
  return (
    <DashboardLayout 
       title={<span className="text-electric-purple text-glow-purple">{t("trending_topics")}</span>}
       subtitle={t("trending_subtitle")}
    >
      <div className="max-w-5xl mx-auto w-full">
         <TrendingTopics />
      </div>
    </DashboardLayout>
  )
}
