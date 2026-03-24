"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { CryptoRadarTable, type CryptoAsset } from "@/components/crypto-radar-table"
import { AssetDetailPanel } from "@/components/asset-detail-panel"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "react-i18next"

export default function AssetsPage() {
  const [selectedAsset, setSelectedAsset] = useState<CryptoAsset | null>(null)
  const { t } = useTranslation()

  return (
    <DashboardLayout 
       title={<span className="text-neon-blue text-glow-blue">{t("asset_explorer")}</span>}
       subtitle={t("asset_explorer_subtitle")}
    >
      <div className="flex-1 w-full bg-card/40 rounded-xl overflow-hidden border border-border/50">
        <CryptoRadarTable onSelectAsset={setSelectedAsset} />
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
