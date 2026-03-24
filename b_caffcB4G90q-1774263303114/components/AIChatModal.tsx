"use client"

import { API_BASE } from "@/lib/api"

import { useState, useRef, useEffect } from "react"
import { X, Send, Bot, User, Loader2, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface AIChatModalProps {
  open: boolean
  onClose: () => void
}

export function AIChatModal({ open, onClose }: AIChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm the MOONIQ AI Assistant powered by GPT. Ask me anything about crypto markets, predictions, trading strategies, or platform features.",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch(`${API_BASE}/api/ai-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content }),
      })

      const data = await res.json()

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply || "I couldn't process that. Please try again.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMsg])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Connection error. Please ensure the backend is running.",
          timestamp: new Date(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 h-[600px] max-h-[80vh] flex flex-col bg-[#0a0e1a]/95 backdrop-blur-xl rounded-2xl border border-neon-blue/20 shadow-2xl shadow-neon-blue/10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/30 bg-gradient-to-r from-neon-blue/5 to-electric-purple/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-neon-blue/40 shadow-[0_0_12px_rgba(0,255,255,0.3)]">
              <img
                src="/icons/mooniq-bot.png"
                alt="MOONIQ AI"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                MOONIQ AI
                <Sparkles className="w-3.5 h-3.5 text-neon-blue" />
              </h3>
              <p className="text-[11px] text-neon-blue/70">GPT-OSS-20B • Online</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex gap-3",
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center shrink-0",
                  msg.role === "user"
                    ? "bg-electric-purple/20 border border-electric-purple/40"
                    : "bg-neon-blue/20 border border-neon-blue/40"
                )}
              >
                {msg.role === "user" ? (
                  <User className="w-3.5 h-3.5 text-electric-purple" />
                ) : (
                  <Bot className="w-3.5 h-3.5 text-neon-blue" />
                )}
              </div>
              <div
                className={cn(
                  "max-w-[80%] px-3.5 py-2.5 rounded-xl text-sm leading-relaxed",
                  msg.role === "user"
                    ? "bg-electric-purple/15 border border-electric-purple/20 text-foreground"
                    : "bg-muted/30 border border-border/30 text-foreground/90"
                )}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-neon-blue/20 border border-neon-blue/40 flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5 text-neon-blue" />
              </div>
              <div className="px-3.5 py-2.5 rounded-xl bg-muted/30 border border-border/30">
                <Loader2 className="w-4 h-4 text-neon-blue animate-spin" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border/30 bg-black/20">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask MOONIQ AI anything..."
              className="flex-1 bg-muted/20 border border-border/40 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-neon-blue/50 focus:shadow-[0_0_10px_rgba(0,255,255,0.1)] transition-all placeholder:text-muted-foreground"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-xl bg-neon-blue/20 border border-neon-blue/30 hover:bg-neon-blue/30 disabled:opacity-40 transition-all"
            >
              <Send className="w-4 h-4 text-neon-blue" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
