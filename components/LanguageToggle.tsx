"use client"
import { useTranslation } from "react-i18next"
import { useEffect, useState } from "react"

export default function LanguageToggle() {
  const { i18n } = useTranslation()
  const [current, setCurrent] = useState("en")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Only runs on client after hydration is complete
    setMounted(true)
    const saved = localStorage.getItem("genie-language") || "en"
    setCurrent(saved)
    if (i18n.language !== saved) {
      i18n.changeLanguage(saved)
    }
  }, [])

  const toggle = (lang: string) => {
    i18n.changeLanguage(lang)
    localStorage.setItem("genie-language", lang)
    setCurrent(lang)
  }

  // Render placeholder during SSR and initial hydration
  if (!mounted) {
    return (
      <div style={{
        display: "flex", background: "rgba(255,255,255,0.15)",
        borderRadius: 999, padding: 2, border: "1px solid rgba(255,255,255,0.25)",
        opacity: 0
      }}>
        <button style={{ padding: "4px 10px", fontSize: 12, background: "transparent", border: "none", color: "#fff" }}>EN</button>
        <button style={{ padding: "4px 10px", fontSize: 12, background: "transparent", border: "none", color: "#fff" }}>IT</button>
      </div>
    )
  }

  return (
    <div style={{
      display: "flex", background: "rgba(255,255,255,0.15)",
      borderRadius: 999, padding: 2, border: "1px solid rgba(255,255,255,0.25)"
    }}>
      {["en", "it"].map(lang => (
        <button key={lang} onClick={() => toggle(lang)} style={{
          background: current === lang ? "#fff" : "transparent",
          color: current === lang ? "var(--green)" : "#fff",
          border: "none", borderRadius: 999,
          padding: "4px 10px", fontSize: 12, fontWeight: 700,
          cursor: "pointer", transition: "all 0.15s",
          textTransform: "uppercase", letterSpacing: "0.05em"
        }}>{lang}</button>
      ))}
    </div>
  )
}