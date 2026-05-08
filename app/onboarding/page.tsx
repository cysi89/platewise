"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useTranslation } from "react-i18next"
import "@/lib/i18n"

type Prefs = {
  household_size: number
  has_children: boolean
  children_ages: string
  diet_type: string
  diet_mixed: boolean
  intolerances: string[]
  health_goals: string[]
  show_calories: boolean
  cook_time_pref: number
  cuisine_prefs: string[]
  budget_range: string
  variety_pref: string
}

const defaultPrefs: Prefs = {
  household_size: 2,
  has_children: false,
  children_ages: "none",
  diet_type: "omnivore",
  diet_mixed: false,
  intolerances: [],
  health_goals: [],
  show_calories: true,
  cook_time_pref: 30,
  cuisine_prefs: [],
  budget_range: "medium",
  variety_pref: "mixed",
}

export default function OnboardingPage() {
  const { i18n } = useTranslation()
  const [step, setStep] = useState(1)
  const [prefs, setPrefs] = useState<Prefs>(defaultPrefs)
  const [saving, setSaving] = useState(false)
  const [lang, setLang] = useState("en")
  const [mounted, setMounted] = useState(false)

  const TOTAL_STEPS = 10

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("genie-language") || "en"
    setLang(saved)
    i18n.changeLanguage(saved)
  }, [])

  const toggleLang = () => {
    const newLang = lang === "en" ? "it" : "en"
    setLang(newLang)
    i18n.changeLanguage(newLang)
    localStorage.setItem("genie-language", newLang)
  }

  const it = lang === "it"

  const toggle = (arr: string[], val: string): string[] =>
    arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]

  const next = () => setStep(s => Math.min(s + 1, TOTAL_STEPS))
  const back = () => setStep(s => Math.max(s - 1, 1))

  const finish = async () => {
    setSaving(true)
    try {
      // Check if already logged in
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Already logged in — save prefs and go to app
        await supabase.from("user_preferences").upsert({
          user_id: user.id,
          ...prefs,
          language: lang,
          onboarding_complete: true,
          updated_at: new Date().toISOString()
        }, { onConflict: "user_id" })
        window.location.href = "/weekly"
      } else {
        // Not logged in — store prefs in sessionStorage and go to signup
        sessionStorage.setItem("genie-onboarding-prefs", JSON.stringify({ ...prefs, language: lang }))
        window.location.href = "/signup"
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  // ── STYLES ──────────────────────────────────────────────────────────────────
  const s = {
    page: { minHeight: "100vh", background: "linear-gradient(160deg, #faf8f3 0%, #eef4ed 100%)", display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", padding: "24px 16px", fontFamily: "DM Sans, sans-serif" },
    card: { background: "#fff", borderRadius: 24, padding: "40px 40px 32px", width: "100%", maxWidth: 520, boxShadow: "0 8px 48px rgba(0,0,0,0.10)", border: "1px solid #e5e5e5" },
    progress: { height: 4, background: "#e5e5e5", borderRadius: 999, marginBottom: 36, overflow: "hidden" },
    progressBar: { height: "100%", borderRadius: 999, background: "var(--green, #2d5a27)", transition: "width 0.4s ease", width: `${(step / TOTAL_STEPS) * 100}%` },
    stepLabel: { fontSize: 12, fontWeight: 700, color: "#2d5a27", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 8 },
    question: { fontFamily: "Playfair Display, serif", fontSize: 24, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.3, marginBottom: 8 },
    hint: { fontSize: 14, color: "#888", marginBottom: 28, lineHeight: 1.5 },
    optionGrid: { display: "grid", gap: 10 },
    option: (active: boolean) => ({
      padding: "14px 18px", borderRadius: 12, cursor: "pointer", textAlign: "left" as const,
      border: active ? "2px solid #2d5a27" : "2px solid #e5e5e5",
      background: active ? "#eef4ed" : "#fff",
      fontFamily: "DM Sans, sans-serif", fontSize: 15,
      fontWeight: active ? 700 : 400, color: active ? "#2d5a27" : "#333",
      transition: "all 0.15s", display: "flex", alignItems: "center", gap: 10,
      width: "100%"
    }),
    optionGrid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
    pill: (active: boolean) => ({
      padding: "10px 16px", borderRadius: 999, cursor: "pointer", textAlign: "center" as const,
      border: active ? "2px solid #2d5a27" : "2px solid #e5e5e5",
      background: active ? "#2d5a27" : "#fff",
      fontFamily: "DM Sans, sans-serif", fontSize: 13,
      fontWeight: 600, color: active ? "#fff" : "#555",
      transition: "all 0.15s"
    }),
    btnRow: { display: "flex", gap: 10, marginTop: 32, alignItems: "center" },
    nextBtn: { background: "#2d5a27", color: "#fff", border: "none", borderRadius: 999, padding: "13px 28px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "DM Sans, sans-serif", flex: 1 },
    backBtn: { background: "transparent", color: "#888", border: "2px solid #e5e5e5", borderRadius: 999, padding: "13px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif" },
    skipBtn: { background: "transparent", border: "none", color: "#aaa", fontSize: 13, cursor: "pointer", fontFamily: "DM Sans, sans-serif", padding: "4px 8px" },
  }

  const Q = ({ n, en, it: itText }: { n: number, en: string, it: string }) => (
    <div>
      <p style={s.stepLabel}>{it ? `Domanda ${n} di ${TOTAL_STEPS}` : `Question ${n} of ${TOTAL_STEPS}`}</p>
      <p style={s.question}>{it ? itText : en}</p>
    </div>
  )

  const Hint = ({ en, it: itText }: { en: string, it: string }) => (
    <p style={s.hint}>{it ? itText : en}</p>
  )

  const NavRow = ({ onNext, nextLabel, canNext = true, showSkip = false }: { onNext?: () => void, nextLabel?: string, canNext?: boolean, showSkip?: boolean }) => (
    <div style={s.btnRow}>
      {step > 1 && <button onClick={back} style={s.backBtn}>←</button>}
      <button
        onClick={onNext || next}
        disabled={!canNext}
        style={{ ...s.nextBtn, opacity: canNext ? 1 : 0.4, cursor: canNext ? "pointer" : "not-allowed" }}
      >
        {nextLabel || (it ? "Continua →" : "Continue →")}
      </button>
      {showSkip && (
        <button onClick={next} style={s.skipBtn}>{it ? "Salta" : "Skip"}</button>
      )}
    </div>
  )

  if (!mounted) return null

  return (
    <div style={s.page}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", maxWidth: 520, marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img src="/images/genie-logo.png" alt="Genie" style={{ height: 32, objectFit: "contain" }}
            onError={e => { (e.target as HTMLImageElement).style.display = "none" }} />
          <span style={{ fontFamily: "Playfair Display, serif", fontSize: 20, fontWeight: 700, color: "#2d5a27" }}>Genie</span>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <a href="/login" style={{ fontSize: 13, color: "#888", textDecoration: "none", fontFamily: "DM Sans, sans-serif" }}>
            {it ? "Hai già un account? Accedi" : "Already have an account? Sign in"}
          </a>
          <button onClick={toggleLang} style={{
            background: "#eef4ed", border: "none", borderRadius: 999,
            padding: "6px 14px", fontSize: 12, fontWeight: 700,
            cursor: "pointer", color: "#2d5a27", fontFamily: "DM Sans, sans-serif"
          }}>
            {lang === "en" ? "🇮🇹 Italiano" : "🇬🇧 English"}
          </button>
        </div>
      </div>

      <div style={s.card}>
        {/* Progress bar */}
        <div style={s.progress}>
          <div style={s.progressBar} />
        </div>

        {/* ── STEP 1: Household size ── */}
        {step === 1 && (
          <div>
            <Q n={1} en="How many people are you planning dinners for?" it="Per quante persone stai pianificando le cene?" />
            <Hint en="This helps us adjust ingredient quantities." it="Questo ci aiuta a regolare le quantita degli ingredienti." />
            <div style={s.optionGrid}>
              {[
                { val: 1, en: "🙋 Just me", it: "🙋 Solo io" },
                { val: 2, en: "👫 2 people", it: "👫 2 persone" },
                { val: 4, en: "👨‍👩‍👧 3–4 people", it: "👨‍👩‍👧 3–4 persone" },
                { val: 5, en: "👨‍👩‍👧‍👦 5 or more", it: "👨‍👩‍👧‍👦 5 o più" },
              ].map(opt => (
                <button key={opt.val} style={s.option(prefs.household_size === opt.val)}
                  onClick={() => { setPrefs(p => ({ ...p, household_size: opt.val })); next() }}>
                  {it ? opt.it : opt.en}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 2: Children ── */}
        {step === 2 && (
          <div>
            <Q n={2} en="Do you have children eating with you?" it="Ci sono bambini che mangiano con voi?" />
            <Hint en="Helps us suggest kid-friendly recipes and adjust spice levels." it="Ci aiuta a suggerire ricette adatte ai bambini e regolare il piccante." />
            <div style={s.optionGrid}>
              {[
                { val: false, ages: "none", en: "👨‍💼 No, adults only", it: "👨‍💼 No, solo adulti" },
                { val: true, ages: "young", en: "👶 Yes, young children (under 10)", it: "👶 Sì, bambini piccoli (sotto i 10 anni)" },
                { val: true, ages: "teens", en: "🧑 Yes, teenagers", it: "🧑 Sì, adolescenti" },
                { val: true, ages: "mixed", en: "👨‍👩‍👧‍👦 Mixed ages", it: "👨‍👩‍👧‍👦 Età miste" },
              ].map(opt => (
                <button key={opt.ages} style={s.option(prefs.children_ages === opt.ages)}
                  onClick={() => { setPrefs(p => ({ ...p, has_children: opt.val, children_ages: opt.ages })); next() }}>
                  {it ? opt.it : opt.en}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 3: Diet type ── */}
        {step === 3 && (
          <div>
            <Q n={3} en="How would you describe your household's diet?" it="Come descriveresti la dieta della tua famiglia?" />
            <Hint en="We'll use this to filter recipes by default." it="Lo useremo per filtrare le ricette di default." />
            <div style={s.optionGrid}>
              {[
                { val: "omnivore", en: "🥩 We eat everything", it: "🥩 Mangiamo di tutto" },
                { val: "pescatarian", en: "🐟 Fish but not meat", it: "🐟 Pesce ma non carne" },
                { val: "vegetarian", en: "🥦 Vegetarian", it: "🥦 Vegetariani" },
                { val: "vegan", en: "🌱 Vegan", it: "🌱 Vegani" },
                { val: "mixed", en: "🔀 Mixed — different people eat differently", it: "🔀 Misto — persone con diete diverse" },
              ].map(opt => (
                <button key={opt.val} style={s.option(prefs.diet_type === opt.val)}
                  onClick={() => { setPrefs(p => ({ ...p, diet_type: opt.val, diet_mixed: opt.val === "mixed" })); next() }}>
                  {it ? opt.it : opt.en}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 4: Intolerances ── */}
        {step === 4 && (
          <div>
            <Q n={4} en="Any dietary restrictions or allergies?" it="Ci sono intolleranze o allergie alimentari?" />
            <Hint en="Select all that apply. We'll exclude recipes with these ingredients." it="Seleziona tutto cio che si applica. Escluderemo le ricette con questi ingredienti." />
            <div style={s.optionGrid2}>
              {[
                { val: "gluten-free", en: "🌾 Gluten-free", it: "🌾 Senza glutine" },
                { val: "dairy-free", en: "🥛 Dairy-free", it: "🥛 Senza latticini" },
                { val: "nut-free", en: "🥜 Nut allergy", it: "🥜 Allergia alle noci" },
                { val: "egg-free", en: "🥚 Egg-free", it: "🥚 Senza uova" },
                { val: "shellfish-free", en: "🦐 Shellfish allergy", it: "🦐 Allergia ai crostacei" },
                { val: "soy-free", en: "🫘 Soy-free", it: "🫘 Senza soia" },
              ].map(opt => (
                <button key={opt.val} style={s.pill(prefs.intolerances.includes(opt.val))}
                  onClick={() => setPrefs(p => ({ ...p, intolerances: toggle(p.intolerances, opt.val) }))}>
                  {it ? opt.it : opt.en}
                </button>
              ))}
            </div>
            <button onClick={() => setPrefs(p => ({ ...p, intolerances: [] }))}
              style={{ ...s.pill(prefs.intolerances.length === 0), marginTop: 10, width: "100%" }}>
              {it ? "✓ Nessuna restrizione" : "✓ None — no restrictions"}
            </button>
            <NavRow showSkip />
          </div>
        )}

        {/* ── STEP 5: Health goals ── */}
        {step === 5 && (
          <div>
            <Q n={5} en="What's most important when planning your dinners?" it="Cosa e piu importante per te nel pianificare le cene?" />
            <Hint en="Select all that apply." it="Seleziona tutto cio che si applica." />
            <div style={s.optionGrid}>
              {[
                { val: "weight-loss", en: "⚖️ Losing weight / lower calories", it: "⚖️ Perdere peso / meno calorie" },
                { val: "high-protein", en: "💪 High protein / building muscle", it: "💪 Alto contenuto proteico" },
                { val: "heart-healthy", en: "❤️ Heart healthy / low fat", it: "❤️ Sano per il cuore / pochi grassi" },
                { val: "more-veg", en: "🌿 Eating more vegetables", it: "🌿 Mangiare piu verdure" },
                { val: "balanced", en: "😌 Just easy, tasty meals", it: "😌 Solo pasti facili e gustosi" },
              ].map(opt => (
                <button key={opt.val} style={s.option(prefs.health_goals.includes(opt.val))}
                  onClick={() => setPrefs(p => ({ ...p, health_goals: toggle(p.health_goals, opt.val) }))}>
                  {it ? opt.it : opt.en}
                </button>
              ))}
            </div>
            <NavRow showSkip />
          </div>
        )}

        {/* ── STEP 6: Calories ── */}
        {step === 6 && (
          <div>
            <Q n={6} en="Would you like to see calorie information?" it="Vuoi vedere le informazioni sulle calorie?" />
            <Hint en="You can always change this later in settings." it="Puoi sempre cambiarlo in seguito nelle impostazioni." />
            <div style={s.optionGrid}>
              {[
                { val: true, en: "🔥 Yes, always show calories", it: "🔥 Sì, mostra sempre le calorie" },
                { val: "totals", en: "📊 Yes, but only weekly totals", it: "📊 Sì, ma solo i totali settimanali" },
                { val: false, en: "🙈 No, I prefer not to focus on numbers", it: "🙈 No, preferisco non concentrarmi sui numeri" },
              ].map(opt => (
                <button key={String(opt.val)} style={s.option(prefs.show_calories === opt.val)}
                  onClick={() => { setPrefs(p => ({ ...p, show_calories: opt.val as any })); next() }}>
                  {it ? opt.it : opt.en}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 7: Cook time ── */}
        {step === 7 && (
          <div>
            <Q n={7} en="How long are you happy to cook on a weeknight?" it="Quanto tempo sei disposto a cucinare nei giorni feriali?" />
            <Hint en="We'll prioritise recipes that fit your schedule." it="Daremo priorita alle ricette che si adattano ai tuoi tempi." />
            <div style={s.optionGrid}>
              {[
                { val: 20, en: "⚡ Under 20 minutes", it: "⚡ Meno di 20 minuti" },
                { val: 30, en: "🕐 20–30 minutes", it: "🕐 20–30 minuti" },
                { val: 45, en: "🕑 30–45 minutes", it: "🕑 30–45 minuti" },
                { val: 60, en: "🕓 Up to an hour — I enjoy cooking", it: "🕓 Fino a un'ora — mi piace cucinare" },
              ].map(opt => (
                <button key={opt.val} style={s.option(prefs.cook_time_pref === opt.val)}
                  onClick={() => { setPrefs(p => ({ ...p, cook_time_pref: opt.val })); next() }}>
                  {it ? opt.it : opt.en}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 8: Cuisines ── */}
        {step === 8 && (
          <div>
            <Q n={8} en="Which cuisines do you enjoy most?" it="Quali cucine ti piacciono di piu?" />
            <Hint en="Pick up to 3. We'll suggest these more often." it="Scegline fino a 3. Le suggeriremo piu spesso." />
            <div style={s.optionGrid2}>
              {[
                { val: "italian", en: "🇮🇹 Italian", it: "🇮🇹 Italiana" },
                { val: "asian", en: "🌏 Asian", it: "🌏 Asiatica" },
                { val: "indian", en: "🇮🇳 Indian", it: "🇮🇳 Indiana" },
                { val: "mediterranean", en: "🌊 Mediterranean", it: "🌊 Mediterranea" },
                { val: "mexican", en: "🌮 Mexican", it: "🌮 Messicana" },
                { val: "comfort", en: "🏠 Comfort food", it: "🏠 Comfort food" },
              ].map(opt => (
                <button key={opt.val}
                  style={s.pill(prefs.cuisine_prefs.includes(opt.val))}
                  onClick={() => {
                    if (prefs.cuisine_prefs.includes(opt.val)) {
                      setPrefs(p => ({ ...p, cuisine_prefs: toggle(p.cuisine_prefs, opt.val) }))
                    } else if (prefs.cuisine_prefs.length < 3) {
                      setPrefs(p => ({ ...p, cuisine_prefs: toggle(p.cuisine_prefs, opt.val) }))
                    }
                  }}>
                  {it ? opt.it : opt.en}
                </button>
              ))}
            </div>
            <NavRow showSkip />
          </div>
        )}

        {/* ── STEP 9: Budget ── */}
        {step === 9 && (
          <div>
            <Q n={9} en="What's your weekly dinner budget?" it="Qual e il tuo budget settimanale per le cene?" />
            <Hint en="We'll flag recipes that are expensive or suggest budget alternatives." it="Segnaleremo ricette costose o suggeriremo alternative economiche." />
            <div style={s.optionGrid}>
              {[
                { val: "low", en: "💚 Under €50 per week", it: "💚 Meno di €50 a settimana" },
                { val: "medium", en: "💛 €50–€100 per week", it: "💛 €50–€100 a settimana" },
                { val: "high", en: "🟠 €100–€150 per week", it: "🟠 €100–€150 a settimana" },
                { val: "unlimited", en: "🔴 Not worried about budget", it: "🔴 Il budget non e un problema" },
              ].map(opt => (
                <button key={opt.val} style={s.option(prefs.budget_range === opt.val)}
                  onClick={() => { setPrefs(p => ({ ...p, budget_range: opt.val })); next() }}>
                  {it ? opt.it : opt.en}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 10: Variety ── */}
        {step === 10 && (
          <div>
            <Q n={10} en="When it comes to weekly meals, you prefer:" it="Per quanto riguarda i pasti settimanali, preferisci:" />
            <Hint en="This shapes how we suggest recipes week to week." it="Questo determina come suggeriamo le ricette settimana dopo settimana." />
            <div style={s.optionGrid}>
              {[
                { val: "variety", en: "🔄 Lots of variety — something different every week", it: "🔄 Molta varieta — qualcosa di diverso ogni settimana" },
                { val: "mixed", en: "⭐ A mix — some favourites, some new dishes", it: "⭐ Un mix — alcuni preferiti e qualche novita" },
                { val: "routine", en: "🏠 Mostly familiar — we like what we know", it: "🏠 Prevalentemente familiare — ci piace cio che conosciamo" },
                { val: "adventurous", en: "🧪 Adventurous — always trying new cuisines", it: "🧪 Avventurosi — sempre nuove cucine da scoprire" },
              ].map(opt => (
                <button key={opt.val} style={s.option(prefs.variety_pref === opt.val)}
                  onClick={() => setPrefs(p => ({ ...p, variety_pref: opt.val }))}>
                  {it ? opt.it : opt.en}
                </button>
              ))}
            </div>
            <div style={s.btnRow}>
              <button onClick={back} style={s.backBtn}>←</button>
              <button onClick={finish} disabled={saving || !prefs.variety_pref}
                style={{ ...s.nextBtn, opacity: saving || !prefs.variety_pref ? 0.5 : 1, background: "#e86c2f" }}>
                {saving
                  ? (it ? "Salvataggio..." : "Saving...")
                  : (it ? "🎉 Inizia a pianificare!" : "🎉 Start planning!")}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Step dots */}
      <div style={{ display: "flex", gap: 6, marginTop: 20 }}>
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div key={i} style={{
            width: i + 1 === step ? 20 : 8, height: 8, borderRadius: 999,
            background: i + 1 <= step ? "#2d5a27" : "#ddd",
            transition: "all 0.3s"
          }} />
        ))}
      </div>

      <p style={{ marginTop: 16, fontSize: 12, color: "#aaa" }}>
        {it ? "Puoi modificare queste preferenze in seguito" : "You can change these preferences later"}
      </p>
    </div>
  )
}
