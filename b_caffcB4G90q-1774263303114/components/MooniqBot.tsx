"use client"

import { useState } from "react"
import Image from "next/image"
import { AIChatModal } from "@/components/AIChatModal"

export default function MooniqBot() {
  const [chatOpen, setChatOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 z-[9999] group"
        title="MOONIQ AI Assistant"
        style={{ animation: "floatBot 3s ease-in-out infinite" }}
      >
        <div className="relative w-[110px] h-auto hover:scale-105 transition-transform duration-200 cursor-pointer drop-shadow-[0_0_15px_rgba(0,255,255,0.4)]">
          <Image
            src="/icons/mooniq-bot.png"
            alt="MOONIQ Bot"
            width={110}
            height={110}
            className="w-full h-auto"
            priority
          />
        </div>
      </button>
      <AIChatModal open={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  )
}
