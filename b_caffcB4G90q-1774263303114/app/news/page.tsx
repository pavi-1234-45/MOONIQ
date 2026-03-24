"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { NewsPanel } from "@/components/news-panel"
import { useTranslation } from "react-i18next"

export default function NewsPage() {
  const { t } = useTranslation()
  
  return (
    <DashboardLayout 
       title={<span className="text-neon-blue text-glow-blue">{t("crypto_news_hub")}</span>}
       subtitle={t("news_subtitle")}
    >
      <div className="max-w-5xl mx-auto w-full">
         <NewsPanel />
      </div>
    </DashboardLayout>
  )
}
