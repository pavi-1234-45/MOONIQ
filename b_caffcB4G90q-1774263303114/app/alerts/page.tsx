"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { CryptoAlertSystem } from "@/components/crypto-alert-system"
import { BotAlerts } from "@/components/bot-alerts"
import { useTranslation } from "react-i18next"

export default function AlertsPage() {
  const { t } = useTranslation()
  
  return (
    <DashboardLayout 
       title={<span className="text-signal-red text-glow-red">{t("alert_control_center")}</span>}
       subtitle={t("alerts_subtitle")}
    >
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
         <CryptoAlertSystem />
         <BotAlerts />
      </div>
    </DashboardLayout>
  )
}
