"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { MetricCards3D } from "@/components/metric-cards-3d"
import { RumorDetector } from "@/components/rumor-detector"
import { useAuth } from "@/lib/auth-context"
import { useTranslation } from "react-i18next"

export default function Dashboard() {
  const { user } = useAuth()
  const { t } = useTranslation()
  
  return (
    <DashboardLayout>
      <div className="mb-8">
         <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-3">
           <span className="text-neon-blue text-glow-blue">MOONIQ</span> {t("dashboard")}
         </h1>
         <p className="text-muted-foreground text-lg">
           {t("welcome_back")} <span className="text-[#00D1FF]">{user?.displayName || user?.email}</span> — {t("click_card_analytics")}
         </p>
      </div>

      <MetricCards3D />

      {/* AI Rumor Detector */}
      <div className="mt-8">
        <RumorDetector />
      </div>
    </DashboardLayout>
  )
}
