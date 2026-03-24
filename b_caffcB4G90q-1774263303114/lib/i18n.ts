import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

import en from "@/locales/en/common.json"
import ta from "@/locales/ta/common.json"
import hi from "@/locales/hi/common.json"
import fr from "@/locales/fr/common.json"
import es from "@/locales/es/common.json"
import de from "@/locales/de/common.json"
import ja from "@/locales/ja/common.json"
import ko from "@/locales/ko/common.json"
import zh from "@/locales/zh/common.json"
import ar from "@/locales/ar/common.json"
import pt from "@/locales/pt/common.json"
import ru from "@/locales/ru/common.json"
import it from "@/locales/it/common.json"
import te from "@/locales/te/common.json"
import ml from "@/locales/ml/common.json"
import kn from "@/locales/kn/common.json"
import bn from "@/locales/bn/common.json"

const resources = {
  en: { translation: en },
  ta: { translation: ta },
  hi: { translation: hi },
  fr: { translation: fr },
  es: { translation: es },
  de: { translation: de },
  ja: { translation: ja },
  ko: { translation: ko },
  zh: { translation: zh },
  ar: { translation: ar },
  pt: { translation: pt },
  ru: { translation: ru },
  it: { translation: it },
  te: { translation: te },
  ml: { translation: ml },
  kn: { translation: kn },
  bn: { translation: bn },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "language",
    },
  })

export default i18n
