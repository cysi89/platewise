"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import "@/lib/i18n"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [done, setDone] = useState(false)
  const [lang, setLang] = useState("en")

  const it = lang === "it"

  useEffect(() => {
    const saved = localStorage.getItem("genie-language") || "en"
    setLang(saved)
  }, [])

  const handleSignup = async () => {
    setError("")
    if (password !== confirm) {
      setError(it ? "Le password non coincidono" : "Passwords do not match")
      return
    }
    if (password.length < 6) {
      setError(it ? "La password deve avere almeno 6 caratteri" : "Password must be at least 6 characters")
      return
    }
    setLoading(true)
    try {
      const { data, error: signupError } = await supabase.auth.signUp({ email, password })
      if (signupError) { setError(signupError.message); return }

      // Save onboarding prefs from sessionStorage
      const savedPrefs = sessionStorage.getItem("genie-onboarding-prefs")
      if (savedPrefs && data.user) {
        const prefs = JSON.parse(savedPrefs)
        await supabase.from("user_preferences").upsert({
          user_id: data.user.id,
          ...prefs,
          onboarding_complete: true,
          updated_at: new Date().toISOString()
        }, { onConflict: "user_id" })
        sessionStorage.removeItem("genie-onboarding-prefs")
      }

      setDone(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div suppressHydrationWarning style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #faf8f3 0%, #eef4ed 100%)",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "24px 16px",
      fontFamily: "DM Sans, sans-serif"
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", maxWidth: 480, marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img src="/genie-logo.png" alt="Genie" style={{ height: 32, objectFit: "contain" }}
            onError={e => { (e.target as HTMLImageElement).style.display = "none" }} />
          <span style={{ fontFamily: "Playfair Display, serif", fontSize: 20, fontWeight: 700, color: "#2d5a27" }}>Genie</span>
        </div>
        <a href="/login" style={{ fontSize: 13, color: "#888", textDecoration: "none" }}>
          {it ? "Hai già un account? Accedi" : "Already have an account? Sign in"}
        </a>
      </div>

      <div style={{
        background: "#fff", borderRadius: 24, padding: "40px",
        width: "100%", maxWidth: 480,
        boxShadow: "0 8px 48px rgba(0,0,0,0.10)", border: "1px solid #e5e5e5"
      }}>
        {done ? (
          /* ── SUCCESS STATE ── */
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
            <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 26, fontWeight: 700, color: "#2d5a27", marginBottom: 12 }}>
              {it ? "Account creato!" : "Account created!"}
            </h2>
            <p style={{ fontSize: 15, color: "#555", lineHeight: 1.6, marginBottom: 24 }}>
              {it
                ? `Abbiamo inviato un link di conferma a ${email}. Controlla la tua email e clicca il link per iniziare.`
                : `We've sent a confirmation link to ${email}. Check your inbox and click the link to get started.`}
            </p>
            <a href="/login" style={{
              display: "inline-block", background: "#2d5a27", color: "#fff",
              borderRadius: 999, padding: "13px 32px", fontSize: 15, fontWeight: 700,
              textDecoration: "none"
            }}>
              {it ? "Vai al login →" : "Go to login →"}
            </a>
          </div>
        ) : (
          /* ── FORM ── */
          <div>
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 40, height: 40, borderRadius: 999, background: "#eef4ed", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🧞</div>
                <div>
                  <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: 22, fontWeight: 700, color: "#1a1a1a", marginBottom: 2 }}>
                    {it ? "Crea il tuo account" : "Create your account"}
                  </h1>
                  <p style={{ fontSize: 13, color: "#888" }}>
                    {it ? "Le tue preferenze sono state salvate" : "Your preferences have been saved"}
                  </p>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#555", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {it ? "Email" : "Email"}
                </label>
                <input
                  suppressHydrationWarning
                  type="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={{
                    width: "100%", padding: "12px 16px", borderRadius: 12,
                    border: "1.5px solid #ddd", fontSize: 15,
                    fontFamily: "DM Sans, sans-serif", outline: "none",
                    background: "#fafafa", boxSizing: "border-box"
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#555", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {it ? "Password" : "Password"}
                </label>
                <input
                  suppressHydrationWarning
                  type="password" value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: "100%", padding: "12px 16px", borderRadius: 12,
                    border: "1.5px solid #ddd", fontSize: 15,
                    fontFamily: "DM Sans, sans-serif", outline: "none",
                    background: "#fafafa", boxSizing: "border-box"
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#555", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {it ? "Conferma password" : "Confirm password"}
                </label>
                <input
                  suppressHydrationWarning
                  type="password" value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  onKeyDown={e => e.key === "Enter" && handleSignup()}
                  style={{
                    width: "100%", padding: "12px 16px", borderRadius: 12,
                    border: "1.5px solid #ddd", fontSize: 15,
                    fontFamily: "DM Sans, sans-serif", outline: "none",
                    background: "#fafafa", boxSizing: "border-box"
                  }}
                />
              </div>

              {error && (
                <p style={{ color: "#dc2626", fontSize: 13, background: "#fef2f2", padding: "10px 14px", borderRadius: 8 }}>
                  {error}
                </p>
              )}

              <button
                onClick={handleSignup}
                disabled={loading || !email || !password || !confirm}
                style={{
                  background: "#e86c2f", color: "#fff", border: "none",
                  borderRadius: 12, padding: "14px", fontSize: 16, fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading || !email || !password || !confirm ? 0.6 : 1,
                  transition: "all 0.15s", fontFamily: "DM Sans, sans-serif",
                  marginTop: 4
                }}
              >
                {loading
                  ? (it ? "Creazione account..." : "Creating account...")
                  : (it ? "🎉 Crea account" : "🎉 Create account")}
              </button>

              {/* Terms note */}
              <p style={{ fontSize: 12, color: "#aaa", textAlign: "center", lineHeight: 1.5 }}>
                {it
                  ? "Creando un account accetti i nostri termini di servizio e la nostra privacy policy."
                  : "By creating an account you agree to our terms of service and privacy policy."}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Back to onboarding */}
      <a href="/onboarding" style={{ marginTop: 16, fontSize: 13, color: "#aaa", textDecoration: "none" }}>
        ← {it ? "Modifica preferenze" : "Change my preferences"}
      </a>
    </div>
  )
}
