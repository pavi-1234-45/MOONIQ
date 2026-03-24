"use client"

import { useState } from "react"
import { Search, Bell, Activity, User, Menu, X, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { auth, signOut } from "@/lib/firebase"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import { LanguageSelector } from "@/components/LanguageSelector"

const navItems = [
  { labelKey: "dashboard", href: "/dashboard" },
  { labelKey: "crypto_radar", href: "/crypto-radar" },
  { labelKey: "assets", href: "/assets" },
  { labelKey: "trending", href: "/trending" },
  { labelKey: "feeds", href: "/feeds" },
  { labelKey: "news", href: "/news" },
  { labelKey: "backtesting", href: "/backtesting" },
  { labelKey: "alerts", href: "/alerts" },
  { labelKey: "ai_insights", href: "/ai-insights" },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const { t } = useTranslation()
  
  const { user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push("/auth")
    } catch (error) {
      console.error("Logout failed", error)
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="max-w-[1800px] mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="https://image2url.com/r2/default/images/1774258386636-e58b3cf4-24f1-466d-b82f-3f8a2624d165.png"
                alt="MOONIQ Logo"
                className="w-10 h-10 animate-glow-pulse rounded-full"
              />
              <div className="absolute inset-0 bg-neon-blue/20 blur-xl rounded-full" />
            </div>
            <span className="font-display text-xl font-bold text-neon-blue text-glow-blue tracking-wider">
              MOONIQ
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.labelKey}
                  href={item.href}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300",
                    isActive
                      ? "text-neon-blue bg-neon-blue/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {t(item.labelKey)}
                </Link>
              )
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className={cn(
              "hidden md:flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-300",
              searchFocused 
                ? "border-neon-blue bg-neon-blue/5 glow-blue" 
                : "border-border bg-muted/30"
            )}>
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={t("search_assets")}
                className="bg-transparent border-none outline-none text-sm w-40 placeholder:text-muted-foreground"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </div>

            {/* Language Selector */}
            <LanguageSelector />

            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-signal-red rounded-full animate-pulse" />
            </button>

            {/* AI Activity Indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon-blue/10 border border-neon-blue/30">
              <Activity className="w-4 h-4 text-neon-blue animate-pulse" />
              <span className="text-xs text-neon-blue font-medium">{t("ai_active")}</span>
            </div>

            {/* User Avatar */}
            <div className="relative">
              <button 
                className="p-1 rounded-full border-2 border-electric-purple/50 hover:border-electric-purple transition-colors"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <User className="w-6 h-6 text-muted-foreground" />
              </button>

              {/* Profile Dropdown */}
              {profileOpen && user && (
                <div className="absolute right-0 mt-2 w-64 bg-[#111827]/95 backdrop-blur-xl rounded-xl border border-border shadow-xl shadow-electric-purple/10 overflow-hidden transform origin-top-right transition-all animate-in fade-in slide-in-from-top-2">
                  <div className="p-4 border-b border-border/50 bg-gradient-to-b from-white/5 to-transparent">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-electric-purple/20 flex items-center justify-center border border-electric-purple/50">
                        <span className="text-electric-purple font-bold text-lg">
                          {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-semibold text-foreground truncate">{user.displayName || "User"}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-signal-red hover:bg-signal-red/10 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      {t("log_out")}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.labelKey}
                    href={item.href}
                    className={cn(
                      "px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300",
                      isActive
                        ? "text-neon-blue bg-neon-blue/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t(item.labelKey)}
                  </Link>
                )
              })}
            </div>
            {/* Mobile Search */}
            <div className="mt-4 flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-muted/30">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={t("search_assets")}
                className="bg-transparent border-none outline-none text-sm flex-1 placeholder:text-muted-foreground"
              />
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
