"use client"
import { useState, useEffect, useRef } from "react"

export default function LandingPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [count, setCount] = useState(73)
  const [scrollY, setScrollY] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
    setCount(prev => prev - 1)
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#faf8f3", color: "#1a1a1a", overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600;1,700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --green: #2d5a27;
          --green-light: #4a7c42;
          --green-pale: #eef4ed;
          --cream: #faf8f3;
          --cream-dark: #f0ebe0;
          --orange: #e86c2f;
          --text: #1a1a1a;
          --text-muted: #6b6b6b;
          --white: #ffffff;
          --border: #e0d9cc;
        }
        html { scroll-behavior: smooth; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50% { transform: translateY(-12px) rotate(2deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes countDown {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }

        .fade-up { animation: fadeUp 0.7s ease forwards; }
        .fade-up-d1 { animation: fadeUp 0.7s 0.1s ease forwards; opacity: 0; }
        .fade-up-d2 { animation: fadeUp 0.7s 0.2s ease forwards; opacity: 0; }
        .fade-up-d3 { animation: fadeUp 0.7s 0.3s ease forwards; opacity: 0; }
        .fade-up-d4 { animation: fadeUp 0.7s 0.4s ease forwards; opacity: 0; }
        .fade-up-d5 { animation: fadeUp 0.7s 0.5s ease forwards; opacity: 0; }
        .fade-up-d6 { animation: fadeUp 0.7s 0.6s ease forwards; opacity: 0; }

        .float-card { animation: float 6s ease-in-out infinite; }
        .float-card-d { animation: float 6s 1.5s ease-in-out infinite; }

        .cta-btn {
          background: var(--orange);
          color: #fff;
          border: none;
          border-radius: 999px;
          padding: 16px 36px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 20px rgba(232, 108, 47, 0.35);
        }
        .cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(232, 108, 47, 0.45);
          background: #d45e22;
        }

        .card-hover {
          transition: all 0.25s ease;
        }
        .card-hover:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 48px rgba(0,0,0,0.1) !important;
        }

        .section-tag {
          display: inline-block;
          background: var(--green-pale);
          color: var(--green);
          border-radius: 999px;
          padding: 6px 16px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 16px;
        }

        .shimmer-text {
          background: linear-gradient(90deg, var(--green) 0%, #7ab870 40%, var(--green) 80%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }

        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .dishes-grid { grid-template-columns: 1fr 1fr !important; }
          .stats-row { grid-template-columns: 1fr 1fr !important; }
          .hide-mobile { display: none !important; }
          .hero-title { font-size: 40px !important; }
          .section-title { font-size: 32px !important; }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: "rgba(250,248,243,0.92)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)", padding: "0 24px",
        height: 64, display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/images/genie-logo.png" alt="Genie" style={{ height: 36, objectFit: "contain" }}
            onError={e => { (e.target as HTMLImageElement).style.display = "none" }} />
          <span style={{ fontFamily: "Playfair Display, serif", fontSize: 22, fontWeight: 700, color: "var(--green)" }}>Genie</span>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <a href="#how-it-works" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: 14, fontWeight: 500 }} className="hide-mobile">How it works</a>
          <a href="#dishes" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: 14, fontWeight: 500 }} className="hide-mobile">100 Dishes</a>
          <a href="#early-bird" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: 14, fontWeight: 500 }} className="hide-mobile">Early Bird</a>
          <a href="/login" style={{
            background: "var(--green)", color: "#fff", textDecoration: "none",
            borderRadius: 999, padding: "8px 20px", fontSize: 14, fontWeight: 600
          }}>Get Started →</a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        minHeight: "100vh", paddingTop: 64,
        background: "linear-gradient(160deg, #faf8f3 0%, #eef4ed 50%, #faf8f3 100%)",
        display: "flex", alignItems: "center", overflow: "hidden", position: "relative"
      }}>
        {/* Background decorative blobs */}
        <div style={{
          position: "absolute", top: "15%", right: "-5%", width: 500, height: 500,
          borderRadius: "50%", background: "radial-gradient(circle, rgba(45,90,39,0.08) 0%, transparent 70%)",
          pointerEvents: "none"
        }} />
        <div style={{
          position: "absolute", bottom: "10%", left: "-8%", width: 400, height: 400,
          borderRadius: "50%", background: "radial-gradient(circle, rgba(232,108,47,0.06) 0%, transparent 70%)",
          pointerEvents: "none"
        }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px", width: "100%" }}>
          <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>

            {/* Left */}
            <div>
              <div className="fade-up-d1 section-tag">🧞 Your Dinner Genie</div>
              <h1 className="fade-up-d2 hero-title" style={{
                fontFamily: "Playfair Display, serif",
                fontSize: 56, fontWeight: 800, lineHeight: 1.1,
                marginBottom: 24, letterSpacing: "-0.02em"
              }}>
                Stop stressing about{" "}
                <span className="shimmer-text">what's for dinner</span>
              </h1>
              <p className="fade-up-d3" style={{
                fontSize: 18, color: "var(--text-muted)", lineHeight: 1.7,
                marginBottom: 36, maxWidth: 480
              }}>
                Genie plans your family's weekly dinners, builds your shopping list automatically, tracks calories and budget — so you can focus on actually living your life.
              </p>

              <div className="fade-up-d4" style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 40 }}>
                <a href="#early-bird">
                  <button className="cta-btn">
                    Claim your free year →
                  </button>
                </a>
                <a href="/login" style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  color: "var(--green)", textDecoration: "none", fontWeight: 600,
                  fontSize: 16, padding: "16px 24px", borderRadius: 999,
                  border: "2px solid var(--green)", transition: "all 0.2s"
                }}>
                  Try the app
                </a>
              </div>

              <div className="fade-up-d5" style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                {[
                  { value: "100+", label: "Recipes" },
                  { value: "5 min", label: "Weekly setup" },
                  { value: "Free", label: "For early birds" },
                ].map(stat => (
                  <div key={stat.label}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: "var(--green)", fontFamily: "Playfair Display, serif" }}>{stat.value}</div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — floating app mockup cards */}
            <div className="fade-up-d3 hide-mobile" style={{ position: "relative", height: 520 }}>
              {/* Main card */}
              <div className="float-card" style={{
                position: "absolute", top: 40, left: "5%", right: "5%",
                background: "var(--white)", borderRadius: 24,
                boxShadow: "0 24px 80px rgba(0,0,0,0.12)",
                overflow: "hidden", border: "1px solid var(--border)"
              }}>
                <div style={{ background: "var(--green)", padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
                  <img src="/images/genie-logo.png" alt="" style={{ height: 28, objectFit: "contain" }}
                    onError={e => { (e.target as HTMLImageElement).style.display = "none" }} />
                  <span style={{ color: "#fff", fontWeight: 700, fontFamily: "Playfair Display, serif", fontSize: 16 }}>Genie</span>
                  <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
                    {["📅", "🛒", "📊"].map(icon => (
                      <span key={icon} style={{ background: "rgba(255,255,255,0.15)", borderRadius: 6, padding: "4px 8px", fontSize: 12 }}>{icon}</span>
                    ))}
                  </div>
                </div>
                <div style={{ padding: "20px" }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>This week</p>
                  {[
                    { day: "Mon", dish: "Lemon Herb Chicken", time: "38 min", cal: "520 kcal", img: "/images/dish-01-lemon-herb-chicken.png" },
                    { day: "Tue", dish: "Miso Glazed Salmon", time: "20 min", cal: "480 kcal", img: "/images/dish-02-miso-salmon.png" },
                    { day: "Wed", dish: "Buddha Bowl", time: "30 min", cal: "440 kcal", img: "/images/dish-12-buddha-bowl.png" },
                  ].map(item => (
                    <div key={item.day} style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "10px 0", borderBottom: "1px solid var(--border)"
                    }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", width: 28, textTransform: "uppercase" }}>{item.day}</span>
                      <img src={item.img} alt={item.dish} style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover" }}
                        onError={e => { (e.target as HTMLImageElement).style.opacity = "0" }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{item.dish}</div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{item.time} · {item.cal}</div>
                      </div>
                      <div style={{ width: 8, height: 8, borderRadius: 999, background: "var(--green)" }} />
                    </div>
                  ))}
                  <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end" }}>
                    <span style={{ background: "var(--green)", color: "#fff", borderRadius: 999, padding: "6px 16px", fontSize: 12, fontWeight: 600 }}>3/7 planned</span>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="float-card-d" style={{
                position: "absolute", bottom: 20, right: "0%",
                background: "var(--white)", borderRadius: 16,
                boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
                padding: "14px 18px", border: "1px solid var(--border)",
                display: "flex", alignItems: "center", gap: 10
              }}>
                <span style={{ fontSize: 28 }}>🛒</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>Shopping list ready</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>21 items · ~€48 est.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section style={{ padding: "100px 24px", background: "var(--white)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 64px" }}>
            <div className="section-tag">The Problem</div>
            <h2 className="section-title" style={{
              fontFamily: "Playfair Display, serif", fontSize: 42,
              fontWeight: 700, lineHeight: 1.2, marginBottom: 20
            }}>
              Sound familiar?
            </h2>
            <p style={{ fontSize: 17, color: "var(--text-muted)", lineHeight: 1.7 }}>
              It's 6pm. You're exhausted. The family is hungry. And nobody can agree on what to eat — or whether you even have the ingredients.
            </p>
          </div>

          <div className="features-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[
              {
                emoji: "😩",
                title: "Decision fatigue every single day",
                desc: "The average person makes 35,000 decisions a day. Don't waste mental energy on \"what's for dinner\" — that question should answer itself.",
                color: "#fff3f0",
                border: "#ffd5c8"
              },
              {
                emoji: "🛒",
                title: "Last-minute supermarket chaos",
                desc: "Mid-recipe discoveries of missing ingredients. Duplicate buys. Food waste because you bought without a plan. Sound familiar?",
                color: "#fff8f0",
                border: "#ffe5c2"
              },
              {
                emoji: "⚖️",
                title: "No idea what you're actually eating",
                desc: "Takeaways creep in. Vegetables disappear. Nobody's tracking calories or whether the family's eating a balanced diet — until it's too late.",
                color: "#f0f5ff",
                border: "#c2d4ff"
              },
              {
                emoji: "👨‍👩‍👧",
                title: "Impossible to coordinate as a family",
                desc: "Everyone has different tastes, schedules, dietary needs. Getting four people to agree on seven dinners is a negotiation nobody wants.",
                color: "#f0fff4",
                border: "#c2f0d4"
              },
              {
                emoji: "💸",
                title: "Food spending out of control",
                desc: "Unplanned meals mean expensive last-minute shops, food delivery apps, and expensive restaurants on tired weeknights.",
                color: "#fdfff0",
                border: "#e8f5c2"
              },
              {
                emoji: "🔁",
                title: "The same 5 dishes on repeat",
                desc: "When there's no plan, you default. Pasta again. Pizza again. The same uninspiring rotation — because it's safe, not because it's good.",
                color: "#fff0fc",
                border: "#f5c2ee"
              },
            ].map(card => (
              <div key={card.title} className="card-hover" style={{
                background: card.color, borderRadius: 20,
                border: `1px solid ${card.border}`,
                padding: "28px 28px 24px"
              }}>
                <div style={{ fontSize: 36, marginBottom: 14 }}>{card.emoji}</div>
                <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: 18, fontWeight: 700, marginBottom: 10, lineHeight: 1.3 }}>{card.title}</h3>
                <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.7 }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOLUTION ── */}
      <section id="how-it-works" style={{
        padding: "100px 24px",
        background: "linear-gradient(170deg, var(--green-pale) 0%, #faf8f3 100%)"
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 72px" }}>
            <div className="section-tag">The Solution</div>
            <h2 className="section-title" style={{
              fontFamily: "Playfair Display, serif", fontSize: 42,
              fontWeight: 700, lineHeight: 1.2, marginBottom: 20
            }}>
              Meet Genie — your family's dinner planner
            </h2>
            <p style={{ fontSize: 17, color: "var(--text-muted)", lineHeight: 1.7 }}>
              One app. Shared with your whole family. Plans your week, builds your shopping list, tracks your nutrition and budget — all in under 5 minutes.
            </p>
          </div>

          {/* How it works steps */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 32, marginBottom: 72 }}>
            {[
              { step: "01", icon: "🎯", title: "Tell us your preferences", desc: "Diet type, cooking time, allergies, household size. Takes 2 minutes once." },
              { step: "02", icon: "📅", title: "Pick your week's dinners", desc: "Browse 100+ recipes filtered for your family. Select 7, skip some, confirm." },
              { step: "03", icon: "🛒", title: "Get your shopping list", desc: "Automatic ingredient list, quantities summed across the week, estimated cost." },
              { step: "04", icon: "🍽️", title: "Cook with confidence", desc: "Full recipes with step-by-step instructions, timings, and nutritional info." },
            ].map((step, i) => (
              <div key={step.step} style={{ position: "relative" }}>
                <div style={{
                  background: "var(--white)", borderRadius: 20,
                  border: "1px solid var(--border)", padding: "32px 28px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                  height: "100%"
                }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: "var(--green)", color: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 20, marginBottom: 16
                  }}>{step.icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--orange)", letterSpacing: "0.1em", marginBottom: 8 }}>STEP {step.step}</div>
                  <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: 20, fontWeight: 700, marginBottom: 10, lineHeight: 1.3 }}>{step.title}</h3>
                  <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.7 }}>{step.desc}</p>
                </div>
                {i < 3 && (
                  <div className="hide-mobile" style={{
                    position: "absolute", right: -20, top: "50%",
                    transform: "translateY(-50%)", fontSize: 20, color: "var(--border)", zIndex: 1
                  }}>→</div>
                )}
              </div>
            ))}
          </div>

          {/* Key benefits */}
          <div style={{
            background: "var(--green)", borderRadius: 28,
            padding: "48px 40px", color: "#fff"
          }}>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: 30, fontWeight: 700, marginBottom: 12 }}>
                Everything your family needs in one place
              </h3>
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 16 }}>Shared across all family members, accessible on any device</p>
            </div>
            <div className="stats-row" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
              {[
                { icon: "📊", title: "Nutrition tracking", desc: "Calories, protein, carbs and fat per dinner, per week" },
                { icon: "💰", title: "Budget estimates", desc: "Rough cost per shopping list so you stay on budget" },
                { icon: "🌍", title: "EN & IT support", desc: "Full Italian and English interface including recipes" },
                { icon: "📱", title: "Mobile ready", desc: "Works beautifully on phone, tablet and desktop" },
              ].map(b => (
                <div key={b.title} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>{b.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{b.title}</div>
                  <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, lineHeight: 1.5 }}>{b.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── DISHES ── */}
      <section id="dishes" style={{ padding: "100px 24px", background: "var(--white)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 56px" }}>
            <div className="section-tag">The Menu</div>
            <h2 className="section-title" style={{
              fontFamily: "Playfair Display, serif", fontSize: 42,
              fontWeight: 700, lineHeight: 1.2, marginBottom: 20
            }}>
              100 dishes. All under 40 minutes.
            </h2>
            <p style={{ fontSize: 17, color: "var(--text-muted)", lineHeight: 1.7 }}>
              From Italian classics to international favourites — every dish is nutritionally balanced, uses ingredients you can find in any supermarket, and is ready in under 40 minutes. Growing to 100 dishes across all dietary needs.
            </p>
          </div>

          {/* Diet type pills */}
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 48 }}>
            {[
              { label: "🥩 Omnivore", active: true },
              { label: "🥦 Vegetarian", active: false },
              { label: "🌱 Vegan", active: false },
              { label: "🐟 Pescatarian", active: false },
              { label: "🌾 Gluten-free", active: false },
            ].map(tag => (
              <span key={tag.label} style={{
                padding: "8px 20px", borderRadius: 999,
                background: tag.active ? "var(--green)" : "var(--cream-dark)",
                color: tag.active ? "#fff" : "var(--text-muted)",
                fontSize: 14, fontWeight: tag.active ? 700 : 500,
                border: `1px solid ${tag.active ? "var(--green)" : "var(--border)"}`
              }}>{tag.label}</span>
            ))}
          </div>

          {/* Dish grid */}
          <div className="dishes-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 40 }}>
            {[
              { name: "Lemon Herb Chicken", time: "38 min", cal: "520 kcal", img: "/images/dish-01-lemon-herb-chicken.png", tag: "chicken" },
              { name: "Miso Glazed Salmon", time: "20 min", cal: "480 kcal", img: "/images/dish-02-miso-salmon.png", tag: "fish" },
              { name: "Buddha Bowl", time: "30 min", cal: "440 kcal", img: "/images/dish-12-buddha-bowl.png", tag: "vegan" },
              { name: "Mushroom Risotto", time: "38 min", cal: "510 kcal", img: "/images/dish-13-mushroom-risotto.png", tag: "vegetarian" },
              { name: "Thai Beef Stir-fry", time: "20 min", cal: "490 kcal", img: "/images/dish-03-thai-beef-basil.png", tag: "quick" },
              { name: "Chickpea Curry", time: "28 min", cal: "420 kcal", img: "/images/dish-19-chickpea-tomato-curry.png", tag: "vegan" },
              { name: "Halloumi Salad", time: "15 min", cal: "420 kcal", img: "/images/dish-18-greek-halloumi-salad.png", tag: "vegetarian" },
              { name: "Prawn Paella", time: "38 min", cal: "550 kcal", img: "/images/dish-05-prawn-chorizo-paella.png", tag: "seafood" },
            ].map(dish => (
              <div key={dish.name} className="card-hover" style={{
                borderRadius: 16, overflow: "hidden",
                border: "1px solid var(--border)",
                background: "var(--white)",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)"
              }}>
                <div style={{ position: "relative", height: 140 }}>
                  <img src={dish.img} alt={dish.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={e => {
                      const el = e.target as HTMLImageElement
                      el.style.background = "var(--green-pale)"
                      el.style.display = "block"
                    }} />
                  <span style={{
                    position: "absolute", top: 8, right: 8,
                    background: "rgba(0,0,0,0.55)", color: "#fff",
                    borderRadius: 999, padding: "2px 8px", fontSize: 10,
                    textTransform: "uppercase", fontWeight: 600
                  }}>{dish.tag}</span>
                </div>
                <div style={{ padding: "12px 14px" }}>
                  <p style={{ fontFamily: "Playfair Display, serif", fontWeight: 600, fontSize: 14, marginBottom: 4, lineHeight: 1.3 }}>{dish.name}</p>
                  <div style={{ display: "flex", gap: 10 }}>
                    <span style={{ fontSize: 11, color: "var(--text-muted)" }}>⏱ {dish.time}</span>
                    <span style={{ fontSize: 11, color: "var(--text-muted)" }}>🔥 {dish.cal}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center" }}>
            <p style={{ color: "var(--text-muted)", fontSize: 15, marginBottom: 20 }}>
              Showing 8 of <strong>23 dishes</strong> — growing to <strong>100+</strong> by launch
            </p>
            <a href="/login">
              <button className="cta-btn">Browse all recipes →</button>
            </a>
          </div>
        </div>
      </section>

      {/* ── EARLY BIRD ── */}
      <section id="early-bird" style={{
        padding: "100px 24px",
        background: "linear-gradient(160deg, #1a3318 0%, var(--green) 60%, #3d7a35 100%)",
        position: "relative", overflow: "hidden"
      }}>
        {/* Background decorations */}
        <div style={{
          position: "absolute", top: "-20%", right: "-10%",
          width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)",
          pointerEvents: "none"
        }} />
        <div style={{
          position: "absolute", bottom: "-20%", left: "-5%",
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(232,108,47,0.15) 0%, transparent 70%)",
          pointerEvents: "none"
        }} />

        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <div style={{
            display: "inline-block",
            background: "rgba(232,108,47,0.2)", border: "1px solid rgba(232,108,47,0.5)",
            borderRadius: 999, padding: "6px 20px", fontSize: 12, fontWeight: 700,
            color: "#ffb088", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 24
          }}>🐦 Early Bird Offer</div>

          <h2 style={{
            fontFamily: "Playfair Display, serif", fontSize: 48, fontWeight: 800,
            color: "#fff", lineHeight: 1.15, marginBottom: 20, letterSpacing: "-0.02em"
          }}>
            First 100 families get<br />
            <span style={{ color: "#ffb088" }}>1 full year for free</span>
          </h2>

          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.8)", lineHeight: 1.7, marginBottom: 48 }}>
            Genie is launching soon. We're giving the first 100 families a full year of premium access — completely free. No credit card. No catch. Just dinner, sorted.
          </p>

          {/* Counter */}
          <div style={{
            background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 20, padding: "24px 32px", marginBottom: 40,
            display: "inline-flex", alignItems: "center", gap: 20
          }}>
            <div>
              <div style={{
                fontSize: 56, fontWeight: 800, color: "#ffb088",
                fontFamily: "Playfair Display, serif", lineHeight: 1,
                animation: "countDown 0.5s ease"
              }}>{count}</div>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginTop: 4 }}>spots remaining</div>
            </div>
            <div style={{ width: 1, height: 60, background: "rgba(255,255,255,0.2)" }} />
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>out of 100</div>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginTop: 4 }}>early bird spots</div>
            </div>
            <div style={{ width: 1, height: 60, background: "rgba(255,255,255,0.2)" }} />
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>1 year</div>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginTop: 4 }}>completely free</div>
            </div>
          </div>

          {/* Signup form */}
          {!submitted ? (
            <form onSubmit={handleSubmit} style={{ maxWidth: 480, margin: "0 auto" }}>
              <div style={{
                display: "flex", gap: 0,
                background: "var(--white)", borderRadius: 999,
                padding: 6, boxShadow: "0 8px 40px rgba(0,0,0,0.2)"
              }}>
                <input
                  suppressHydrationWarning
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  style={{
                    flex: 1, border: "none", outline: "none",
                    padding: "12px 20px", fontSize: 15, borderRadius: 999,
                    fontFamily: "DM Sans, sans-serif", color: "var(--text)",
                    background: "transparent"
                  }}
                />
                <button type="submit" className="cta-btn" style={{ margin: 0, padding: "12px 24px", fontSize: 14 }}>
                  Claim my spot →
                </button>
              </div>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, marginTop: 12 }}>
                No spam. No credit card. Unsubscribe any time.
              </p>
            </form>
          ) : (
            <div style={{
              background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: 20, padding: "32px 40px", maxWidth: 480, margin: "0 auto"
            }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
              <h3 style={{ color: "#fff", fontFamily: "Playfair Display, serif", fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
                You're on the list!
              </h3>
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 15, lineHeight: 1.6 }}>
                We'll email you at <strong style={{ color: "#fff" }}>{email}</strong> when Genie launches. You've secured your free year.
              </p>
            </div>
          )}

          {/* What's included */}
          <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap", marginTop: 48 }}>
            {[
              "✓ 100+ recipes",
              "✓ Weekly planner",
              "✓ Shopping lists",
              "✓ Nutrition tracking",
              "✓ Budget estimates",
              "✓ EN & IT language",
            ].map(item => (
              <span key={item} style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: 500 }}>{item}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        background: "#111", color: "rgba(255,255,255,0.5)",
        padding: "40px 24px", textAlign: "center"
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/images/genie-logo.png" alt="Genie" style={{ height: 28, objectFit: "contain", opacity: 0.7 }}
              onError={e => { (e.target as HTMLImageElement).style.display = "none" }} />
            <span style={{ fontFamily: "Playfair Display, serif", color: "rgba(255,255,255,0.7)", fontSize: 18, fontWeight: 700 }}>Genie</span>
          </div>
          <p style={{ fontSize: 13 }}>© 2025 Genie. Your smart dinner planning assistant.</p>
          <div style={{ display: "flex", gap: 20 }}>
            <a href="/login" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: 13 }}>App</a>
            <a href="mailto:hello@thegenie.life" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: 13 }}>Contact</a>
            <a href="https://thegenie.life" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: 13 }}>thegenie.life</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
