"use client"
import { useTranslation } from "react-i18next"

export default function LanguageToggle() {
  const { i18n } = useTranslation()
  const current = i18n.language?.startsWith("it") ? "it" : "en"

  const toggle = (lang: string) => {
    i18n.changeLanguage(lang)
    localStorage.setItem("genie-language", lang)
  }

  return (
    <div style={{
      display: "flex", background: "rgba(255,255,255,0.15)",
      borderRadius: 999, padding: 2, border: "1px solid rgba(255,255,255,0.25)"
    }}>
      {["en", "it"].map(lang => (
        <button
          key={lang}
          onClick={() => toggle(lang)}
          style={{
            background: current === lang ? "#fff" : "transparent",
            color: current === lang ? "var(--green)" : "#fff",
            border: "none", borderRadius: 999,
            padding: "4px 10px", fontSize: 12, fontWeight: 700,
            cursor: "pointer", transition: "all 0.15s",
            textTransform: "uppercase", letterSpacing: "0.05em"
          }}
        >
          {lang}
        </button>
      ))}
    </div>
  )
}