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
        // Already logged in â€” save prefs and go to app
        await supabase.from("user_preferences").upsert({
          user_id: user.id,
          ...prefs,
          language: lang,
          onboarding_complete: true,
          updated_at: new Date().toISOString()
        }, { onConflict: "user_id" })
        window.location.href = "/weekly"
      } else {
        // Not logged in â€” store prefs in sessionStorage and go to signup
        sessionStorage.setItem("genie-onboarding-prefs", JSON.stringify({ ...prefs, language: lang }))
        window.location.href = "/signup"
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  // â”€â”€ STYLES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
      {step > 1 && <button onClick={back} style={s.backBtn}>â†</button>}
      <button
        onClick={onNext || next}
        disabled={!canNext}
        style={{ ...s.nextBtn, opacity: canNext ? 1 : 0.4, cursor: canNext ? "pointer" : "not-allowed" }}
      >
        {nextLabel || (it ? "Continua â†’" : "Continue â†’")}
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
          <img src="/genie-logo.png" alt="Genie" style={{ height: 32, objectFit: "contain" }}
            onError={e => { (e.target as HTMLImageElement).style.display = "none" }} />
          <span style={{ fontFamily: "Playfair Display, serif", fontSize: 20, fontWeight: 700, color: "#2d5a27" }}>Genie</span>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <a href="/login" style={{ fontSize: 13, color: "#888", textDecoration: "none", fontFamily: "DM Sans, sans-serif" }}>
            {it ? "Hai giÃ  un account? Accedi" : "Already have an account? Sign in"}
          </a>
          <button onClick={toggleLang} style={{
            background: "#eef4ed", border: "none", borderRadius: 999,
            padding: "6px 14px", fontSize: 12, fontWeight: 700,
            cursor: "pointer", color: "#2d5a27", fontFamily: "DM Sans, sans-serif"
          }}>
            {lang === "en" ? "ðŸ‡®ðŸ‡¹ Italiano" : "ðŸ‡¬ðŸ‡§ English"}
          </button>
        </div>
      </div>

      <div style={s.card}>
        {/* Progress bar */}
        <div style={s.progress}>
          <div style={s.progressBar} />
        </div>

        {/* â”€â”€ STEP 1: Household size â”€â”€ */}
        {step === 1 && (
          <div>
            <Q n={1} en="How many people are you planning dinners for?" it="Per quante persone stai pianificando le cene?" />
            <Hint en="This helps us adjust ingredient quantities." it="Questo ci aiuta a regolare le quantita degli ingredienti." />
            <div style={s.optionGrid}>
              {[
                { val: 1, en: "ðŸ™‹ Just me", it: "ðŸ™‹ Solo io" },
                { val: 2, en: "ðŸ‘« 2 people", it: "ðŸ‘« 2 persone" },
                { val: 4, en: "ðŸ‘¨â€ðŸ‘©â€ðŸ‘§ 3â€“4 people", it: "ðŸ‘¨â€ðŸ‘©â€ðŸ‘§ 3â€“4 persone" },
                { val: 5, en: "ðŸ‘¨â€ðŸ‘©â€ðŸ‘§â€ðŸ‘¦ 5 or more", it: "ðŸ‘¨â€ðŸ‘©â€ðŸ‘§â€ðŸ‘¦ 5 o piÃ¹" },
              ].map(opt => (
                <button key={opt.val} style={s.option(prefs.household_size === opt.val)}
                  onClick={() => { setPrefs(p => ({ ...p, household_size: opt.val })); next() }}>
                  {it ? opt.it : opt.en}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* â”€â”€ STEP 2: Children â”€â”€ */}
        {step === 2 && (
          <div>
            <Q n={2} en="Do you have children eating with you?" it="Ci sono bambini che mangiano con voi?" />
            <Hint en="Helps us suggest kid-friendly recipes and adjust spice levels." it="Ci aiuta a suggerire ricette adatte ai bambini e regolare il piccante." />
            <div style={s.optionGrid}>
              {[
                { val: false, ages: "none", en: "ðŸ‘¨â€ðŸ’¼ No, adults only", it: "ðŸ‘¨â€ðŸ’¼ No, solo adulti" },
                { val: true, ages: "young", en: "ðŸ‘¶ Yes, young children (under 10)", it: "ðŸ‘¶ SÃ¬, bambini piccoli (sotto i 10 anni)" },
                { val: true, ages: "teens", en: "ðŸ§‘ Yes, teenagers", it: "ðŸ§‘ SÃ¬, adolescenti" },
                { val: true, ages: "mixed", en: "ðŸ‘¨â€ðŸ‘©â€ðŸ‘§â€ðŸ‘¦ Mixed ages", it: "ðŸ‘¨â€ðŸ‘©â€ðŸ‘§â€ðŸ‘¦ EtÃ  miste" },
              ].map(opt => (
                <button key={opt.ages} style={s.option(prefs.children_ages === opt.ages)}
                  onClick={() => { setPrefs(p => ({ ...p, has_children: opt.val, children_ages: opt.ages })); next() }}>
                  {it ? opt.it : opt.en}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* â”€â”€ STEP 3: Diet type â”€â”€ */}
        {step === 3 && (
          <div>
            <Q n={3} en="How would you describe your household's diet?" it="Come descriveresti la dieta della tua famiglia?" />
            <Hint en="We'll use this to filter recipes by default." it="Lo useremo per filtrare le ricette di default." />
            <div style={s.optionGrid}>
              {[
                { val: "omnivore", en: "ðŸ¥© We eat everything", it: "ðŸ¥© Mangiamo di tutto" },
                { val: "pescatarian", en: "ðŸŸ Fish but not meat", it: "ðŸŸ Pesce ma non carne" },
                { val: "vegetarian", en: "ðŸ¥¦ Vegetarian", it: "ðŸ¥¦ Vegetariani" },
                { val: "vegan", en: "ðŸŒ± Vegan", it: "ðŸŒ± Vegani" },
                { val: "mixed", en: "ðŸ”€ Mixed â€” different people eat differently", it: "ðŸ”€ Misto â€” persone con diete diverse" },
              ].map(opt => (
                <button key={opt.val} style={s.option(prefs.diet_type === opt.val)}
                  onClick={() => { setPrefs(p => ({ ...p, diet_type: opt.val, diet_mixed: opt.val === "mixed" })); next() }}>
                  {it ? opt.it : opt.en}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* â”€â”€ STEP 4: Intolerances â”€â”€ */}
        {step === 4 && (
          <div>
            <Q n={4} en="Any dietary restrictions or allergies?" it="Ci sono intolleranze o allergie alimentari?" />
            <Hint en="Select all that apply. We'll exclude recipes with these ingredients." it="Seleziona tutto cio che si applica. Escluderemo le ricette con questi ingredienti." />
            <div style={s.optionGrid2}>
              {[
                { val: "gluten-free", en: "ðŸŒ¾ Gluten-free", it: "ðŸŒ¾ Senza glutine" },
                { val: "dairy-free", en: "ðŸ¥› Dairy-free", it: "ðŸ¥› Senza latticini" },
                { val: "nut-free", en: "ðŸ¥œ Nut allergy", it: "ðŸ¥œ Allergia alle noci" },
                { val: "egg-free", en: "ðŸ¥š Egg-free", it: "ðŸ¥š Senza uova" },
                { val: "shellfish-free", en: "ðŸ¦ Shellfish allergy", it: "ðŸ¦ Allergia ai crostacei" },
                { val: "soy-free", en: "ðŸ«˜ Soy-free", it: "ðŸ«˜ Senza soia" },
              ].map(opt => (
                <button key={opt.val} style={s.pill(prefs.intolerances.includes(opt.val))}
                  onClick={() => setPrefs(p => ({ ...p, intolerances: toggle(p.intolerances, opt.val) }))}>
                  {it ? opt.it : opt.en}
                </button>
              ))}
            </div>
            <button onClick={() => setPrefs(p => ({ ...p, intolerances: [] }))}
              style={{ ...s.pill(prefs.intolerances.length === 0), marginTop: 10, width: "100%" }}>
              {it ? "âœ“ Nessuna restrizione" : "âœ“ None â€” no restrictions"}
            </button>
            <NavRow showSkip />
          </div>
        )}

        {/* â”€â”€ STEP 5: Health goals â”€â”€ */}
        {step === 5 && (
          <div>
            <Q n={5} en="What's most important when planning your dinners?" it="Cosa e piu importante per te nel pianificare le cene?" />
            <Hint en="Select all that apply." it="Seleziona tutto cio che si applica." />
            <div style={s.optionGrid}>
              {[
                { val: "weight-loss", en: "âš–ï¸ Losing weight / lower calories", it: "âš–ï¸ Perdere peso / meno calorie" },
                { val: "high-protein", en: "ðŸ’ª High protein / building muscle", it: "ðŸ’ª Alto contenuto proteico" },
                { val: "heart-healthy", en: "â¤ï¸ Heart healthy / low fat", it: "â¤ï¸ Sano per il cuore / pochi grassi" },
                { val: "more-veg", en: "ðŸŒ¿ Eating more vegetables", it: "ðŸŒ¿ Mangiare piu verdure" },
                { val: "balanced", en: "ðŸ˜Œ Just easy, tasty meals", it: "ðŸ˜Œ Solo pasti facili e gustosi" },
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

        {/* â”€â”€ STEP 6: Calories â”€â”€ */}
        {step === 6 && (
          <div>
            <Q n={6} en="Would you like to see calorie information?" it="Vuoi vedere le informazioni sulle calorie?" />
            <Hint en="You can always change this later in settings." it="Puoi sempre cambiarlo in seguito nelle impostazioni." />
            <div style={s.optionGrid}>
              {[
                { val: true, en: "ðŸ”¥ Yes, always show calories", it: "ðŸ”¥ SÃ¬, mostra sempre le calorie" },
                { val: "totals", en: "ðŸ“Š Yes, but only weekly totals", it: "ðŸ“Š SÃ¬, ma solo i totali settimanali" },
                { val: false, en: "ðŸ™ˆ No, I prefer not to focus on numbers", it: "ðŸ™ˆ No, preferisco non concentrarmi sui numeri" },
              ].map(opt => (
                <button key={String(opt.val)} style={s.option(prefs.show_calories === opt.val)}
                  onClick={() => { setPrefs(p => ({ ...p, show_calories: opt.val as any })); next() }}>
                  {it ? opt.it : opt.en}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* â”€â”€ STEP 7: Cook time â”€â”€ */}
        {step === 7 && (
          <div>
            <Q n={7} en="How long are you happy to cook on a weeknight?" it="Quanto tempo sei disposto a cucinare nei giorni feriali?" />
            <Hint en="We'll prioritise recipes that fit your schedule." it="Daremo priorita alle ricette che si adattano ai tuoi tempi." />
            <div style={s.optionGrid}>
              {[
                { val: 20, en: "âš¡ Under 20 minutes", it: "âš¡ Meno di 20 minuti" },
                { val: 30, en: "ðŸ• 20â€“30 minutes", it: "ðŸ• 20â€“30 minuti" },
                { val: 45, en: "ðŸ•‘ 30â€“45 minutes", it: "ðŸ•‘ 30â€“45 minuti" },
                { val: 60, en: "ðŸ•“ Up to an hour â€” I enjoy cooking", it: "ðŸ•“ Fino a un'ora â€” mi piace cucinare" },
              ].map(opt => (
                <button key={opt.val} style={s.option(prefs.cook_time_pref === opt.val)}
                  onClick={() => { setPrefs(p => ({ ...p, cook_time_pref: opt.val })); next() }}>
                  {it ? opt.it : opt.en}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* â”€â”€ STEP 8: Cuisines â”€â”€ */}
        {step === 8 && (
          <div>
            <Q n={8} en="Which cuisines do you enjoy most?" it="Quali cucine ti piacciono di piu?" />
            <Hint en="Pick up to 3. We'll suggest these more often." it="Scegline fino a 3. Le suggeriremo piu spesso." />
            <div style={s.optionGrid2}>
              {[
                { val: "italian", en: "ðŸ‡®ðŸ‡¹ Italian", it: "ðŸ‡®ðŸ‡¹ Italiana" },
                { val: "asian", en: "ðŸŒ Asian", it: "ðŸŒ Asiatica" },
                { val: "indian", en: "ðŸ‡®ðŸ‡³ Indian", it: "ðŸ‡®ðŸ‡³ Indiana" },
                { val: "mediterranean", en: "ðŸŒŠ Mediterranean", it: "ðŸŒŠ Mediterranea" },
                { val: "mexican", en: "ðŸŒ® Mexican", it: "ðŸŒ® Messicana" },
                { val: "comfort", en: "ðŸ  Comfort food", it: "ðŸ  Comfort food" },
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

        {/* â”€â”€ STEP 9: Budget â”€â”€ */}
        {step === 9 && (
          <div>
            <Q n={9} en="What's your weekly dinner budget?" it="Qual e il tuo budget settimanale per le cene?" />
            <Hint en="We'll flag recipes that are expensive or suggest budget alternatives." it="Segnaleremo ricette costose o suggeriremo alternative economiche." />
            <div style={s.optionGrid}>
              {[
                { val: "low", en: "ðŸ’š Under â‚¬50 per week", it: "ðŸ’š Meno di â‚¬50 a settimana" },
                { val: "medium", en: "ðŸ’› â‚¬50â€“â‚¬100 per week", it: "ðŸ’› â‚¬50â€“â‚¬100 a settimana" },
                { val: "high", en: "ðŸŸ  â‚¬100â€“â‚¬150 per week", it: "ðŸŸ  â‚¬100â€“â‚¬150 a settimana" },
                { val: "unlimited", en: "ðŸ”´ Not worried about budget", it: "ðŸ”´ Il budget non e un problema" },
              ].map(opt => (
                <button key={opt.val} style={s.option(prefs.budget_range === opt.val)}
                  onClick={() => { setPrefs(p => ({ ...p, budget_range: opt.val })); next() }}>
                  {it ? opt.it : opt.en}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* â”€â”€ STEP 10: Variety â”€â”€ */}
        {step === 10 && (
          <div>
            <Q n={10} en="When it comes to weekly meals, you prefer:" it="Per quanto riguarda i pasti settimanali, preferisci:" />
            <Hint en="This shapes how we suggest recipes week to week." it="Questo determina come suggeriamo le ricette settimana dopo settimana." />
            <div style={s.optionGrid}>
              {[
                { val: "variety", en: "ðŸ”„ Lots of variety â€” something different every week", it: "ðŸ”„ Molta varieta â€” qualcosa di diverso ogni settimana" },
                { val: "mixed", en: "â­ A mix â€” some favourites, some new dishes", it: "â­ Un mix â€” alcuni preferiti e qualche novita" },
                { val: "routine", en: "ðŸ  Mostly familiar â€” we like what we know", it: "ðŸ  Prevalentemente familiare â€” ci piace cio che conosciamo" },
                { val: "adventurous", en: "ðŸ§ª Adventurous â€” always trying new cuisines", it: "ðŸ§ª Avventurosi â€” sempre nuove cucine da scoprire" },
              ].map(opt => (
                <button key={opt.val} style={s.option(prefs.variety_pref === opt.val)}
                  onClick={() => setPrefs(p => ({ ...p, variety_pref: opt.val }))}>
                  {it ? opt.it : opt.en}
                </button>
              ))}
            </div>
            <div style={s.btnRow}>
              <button onClick={back} style={s.backBtn}>â†</button>
              <button onClick={finish} disabled={saving || !prefs.variety_pref}
                style={{ ...s.nextBtn, opacity: saving || !prefs.variety_pref ? 0.5 : 1, background: "#e86c2f" }}>
                {saving
                  ? (it ? "Salvataggio..." : "Saving...")
                  : (it ? "ðŸŽ‰ Inizia a pianificare!" : "ðŸŽ‰ Start planning!")}
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
