"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { CryptoRadarTable, type CryptoAsset } from "@/components/crypto-radar-table"
import { PumpSignals } from "@/components/pump-signals"
import { AssetDetailPanel } from "@/components/asset-detail-panel"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "react-i18next"

export default function CryptoRadarPage() {
  const [selectedAsset, setSelectedAsset] = useState<CryptoAsset | null>(null)
  const { t } = useTranslation()

  return (
    <DashboardLayout 
       title={<span className="text-electric-purple text-glow-purple">{t("crypto_radar")}</span>}
       subtitle={t("crypto_radar_subtitle")}
    >
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1 h-full">
        <div className="xl:col-span-2 relative h-[700px] xl:h-auto">
          <CryptoRadarTable onSelectAsset={setSelectedAsset} />
        </div>
        <div className="space-y-6">
          <PumpSignals />
        </div>
      </div>
      
      <AnimatePresence>
      {selectedAsset && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setSelectedAsset(null)}
          />
          <AssetDetailPanel
            asset={selectedAsset}
            onClose={() => setSelectedAsset(null)}
          />
        </>
      )}
      </AnimatePresence>
    </DashboardLayout>
  )
}
