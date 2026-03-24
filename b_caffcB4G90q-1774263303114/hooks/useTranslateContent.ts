"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useTranslation } from "react-i18next"

const translationCache = new Map<string, string>()

async function translateText(text: string, targetLang: string): Promise<string> {
  const cacheKey = `${targetLang}:${text.slice(0, 100)}`
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!
  }

  try {
    const res = await fetch("http://127.0.0.1:8000/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, target_language: targetLang }),
    })
    if (!res.ok) return text
    const data = await res.json()
    const translated = data.translated_text || text
    translationCache.set(cacheKey, translated)
    return translated
  } catch {
    return text
  }
}

/**
 * Hook to translate an array of strings dynamically.
 * Coin names (BTC, ETH, DOGE, etc.) are preserved in English.
 * Results are cached to avoid repeated API calls.
 */
export function useTranslateContent(texts: string[]): string[] {
  const { i18n } = useTranslation()
  const [translated, setTranslated] = useState<string[]>(texts)
  const lang = i18n.language?.split("-")[0] || "en"
  const prevTextsRef = useRef<string>("")
  const prevLangRef = useRef<string>(lang)

  const textsKey = texts.join("|||")

  useEffect(() => {
    if (lang === "en") {
      setTranslated(texts)
      return
    }

    if (textsKey === prevTextsRef.current && lang === prevLangRef.current) {
      return
    }

    prevTextsRef.current = textsKey
    prevLangRef.current = lang

    let cancelled = false

    const doTranslate = async () => {
      const results = await Promise.all(
        texts.map((t) => {
          if (!t || t.trim().length === 0) return Promise.resolve(t)
          return translateText(t, lang)
        })
      )
      if (!cancelled) {
        setTranslated(results)
      }
    }

    doTranslate()

    return () => { cancelled = true }
  }, [textsKey, lang])

  return lang === "en" ? texts : translated
}

/**
 * Hook to translate a single string dynamically.
 */
export function useTranslateSingle(text: string): string {
  const results = useTranslateContent([text])
  return results[0]
}
