"use client"

import { AlertTriangle } from "lucide-react"
import { useTranslation } from "react-i18next"

export function Footer() {
  const { t } = useTranslation()
  
  return (
    <footer className="mt-12 py-6 border-t border-border bg-card/30">
      <div className="max-w-[1800px] mx-auto px-4 lg:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="https://image2url.com/r2/default/images/1774258386636-e58b3cf4-24f1-466d-b82f-3f8a2624d165.png"
              alt="MOONIQ Logo"
              className="w-8 h-8 opacity-50"
            />
            <span className="font-display text-sm text-muted-foreground">
              MOONIQ
            </span>
          </div>

          <div className="flex items-start gap-2 max-w-2xl">
            <AlertTriangle className="w-4 h-4 text-signal-yellow flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground text-center md:text-left">
              {t("disclaimer")}
            </p>
          </div>

          <div className="text-xs text-muted-foreground">
            {t("copyright")}
          </div>
        </div>
      </div>
    </footer>
  )
}
