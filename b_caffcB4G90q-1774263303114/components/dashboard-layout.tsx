"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useAuth } from "@/lib/auth-context"

const DataGridBackground = dynamic(() => import("@/components/data-grid-background").then(mod => ({ default: mod.DataGridBackground })), { 
  ssr: false 
})

export function DashboardLayout({ 
  children, 
  title, 
  subtitle 
}: { 
  children: React.ReactNode, 
  title?: React.ReactNode, 
  subtitle?: string 
}) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth")
    }
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-[#00D1FF] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm tracking-wider uppercase">Loading MOONIQ…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B1426] relative overflow-hidden flex flex-col">
      <DataGridBackground />
      <Navbar />
      <main className="relative z-10 pt-24 pb-8 flex-1 flex flex-col">
        <div className="max-w-[1800px] w-full mx-auto px-4 lg:px-6 flex-1 flex flex-col">
          {(title || subtitle) && (
             <div className="mb-8">
               {title && <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">{title}</h1>}
               {subtitle && <p className="text-muted-foreground text-lg">{subtitle}</p>}
             </div>
          )}
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}
