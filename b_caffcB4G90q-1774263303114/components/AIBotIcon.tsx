"use client"

import { useState } from "react"
import Image from "next/image"
import { AIChatModal } from "@/components/AIChatModal"

export default function AIBotIcon() {
  const [chatOpen, setChatOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setChatOpen(true)}
        className="relative group"
        title="MOONIQ AI Assistant"
      >
        <div className="w-8 h-8 rounded-full overflow-hidden border border-neon-blue/40 shadow-[0_0_10px_rgba(0,255,255,0.4)] animate-[aiPulse_2s_ease-in-out_infinite] group-hover:scale-105 transition-transform duration-200">
          <Image
            src="/icons/mooniq-bot.png"
            alt="MOONIQ AI Bot"
            width={32}
            height={32}
            className="w-full h-full object-cover"
          />
        </div>
      </button>
      <AIChatModal open={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  )
}
