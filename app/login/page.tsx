"use client"
import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useTranslation } from "react-i18next"
import "@/lib/i18n"
import LanguageToggle from "@/components/LanguageToggle"

export default function LoginPage() {
  const { t } = useTranslation()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  const handleAuth = async () => {
    setLoading(true)
    setError("")
    setMessage("")
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else setMessage("Check your email to confirm your account.")
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else window.location.href = "/weekly"
    }
    setLoading(false)
  }

  return (
    <div suppressHydrationWarning style={{
      minHeight: "100vh", background: "var(--cream)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "24px"
    }}>
      <div style={{
        background: "var(--white)", borderRadius: 24, padding: "48px 40px",
        width: "100%", maxWidth: 420,
        boxShadow: "0 8px 48px rgba(0,0,0,0.10)", border: "1px solid var(--border)"
      }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <img src="/images/genie-logo.png" alt="Genie"
            style={{ height: 80, marginBottom: 16, objectFit: "contain" }}
            onError={e => { (e.target as HTMLImageElement).style.display = "none" }} />
          <h1 style={{
            fontFamily: "Playfair Display, serif", fontSize: 36, fontWeight: 700,
            color: "var(--green)", letterSpacing: "-0.02em", marginBottom: 8
          }}>Genie</h1>
          <p suppressHydrationWarning style={{ color: "var(--text-muted)", fontSize: 15, marginBottom: 16 }}>
            {t("login.tagline")}
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <LanguageToggle />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label suppressHydrationWarning style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", display: "block", marginBottom: 6 }}>
              {t("login.email")}
            </label>
            <input suppressHydrationWarning type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                width: "100%", padding: "12px 16px", borderRadius: 12,
                border: "1.5px solid var(--border)", fontSize: 15,
                fontFamily: "DM Sans, sans-serif", outline: "none",
                background: "var(--cream)", color: "var(--text)", boxSizing: "border-box"
              }} />
          </div>
          <div>
            <label suppressHydrationWarning style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", display: "block", marginBottom: 6 }}>
              {t("login.password")}
            </label>
            <input suppressHydrationWarning type="password" value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              onKeyDown={e => e.key === "Enter" && handleAuth()}
              style={{
                width: "100%", padding: "12px 16px", borderRadius: 12,
                border: "1.5px solid var(--border)", fontSize: 15,
                fontFamily: "DM Sans, sans-serif", outline: "none",
                background: "var(--cream)", color: "var(--text)", boxSizing: "border-box"
              }} />
          </div>

          {error && <p style={{ color: "#dc2626", fontSize: 13, background: "#fef2f2", padding: "10px 14px", borderRadius: 8 }}>{error}</p>}
          {message && <p style={{ color: "var(--green)", fontSize: 13, background: "var(--green-pale)", padding: "10px 14px", borderRadius: 8 }}>{message}</p>}

          <button suppressHydrationWarning onClick={handleAuth} disabled={loading || !email || !password} style={{
            background: "var(--green)", color: "#fff", border: "none", borderRadius: 12,
            padding: "14px", fontSize: 16, fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading || !email || !password ? 0.7 : 1,
            transition: "all 0.15s", marginTop: 4, fontFamily: "DM Sans, sans-serif"
          }}>
            {loading ? t("login.pleaseWait") : isSignUp ? t("login.createAccount") : t("login.signIn")}
          </button>

          <button suppressHydrationWarning onClick={() => { setIsSignUp(!isSignUp); setError(""); setMessage("") }} style={{
            background: "transparent", border: "none", color: "var(--text-muted)",
            fontSize: 14, cursor: "pointer", padding: "4px", fontFamily: "DM Sans, sans-serif"
          }}>
            {isSignUp ? t("login.alreadyAccount") : t("login.noAccount")}
          </button>
        </div>
      </div>
    </div>
  )
}