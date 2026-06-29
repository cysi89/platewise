"use client"
import { useState } from "react"

export default function LandingPageIT() {
  const [count, setCount] = useState(73)



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
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          50% { transform: translateY(-14px) rotate(1deg); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .fade-up-d1 { animation: fadeUp 0.7s 0.1s ease forwards; opacity: 0; }
        .fade-up-d2 { animation: fadeUp 0.7s 0.2s ease forwards; opacity: 0; }
        .fade-up-d3 { animation: fadeUp 0.7s 0.3s ease forwards; opacity: 0; }
        .fade-up-d4 { animation: fadeUp 0.7s 0.4s ease forwards; opacity: 0; }
        .fade-up-d5 { animation: fadeUp 0.7s 0.5s ease forwards; opacity: 0; }
        .float-card { animation: float 6s ease-in-out infinite; }
        .float-card-d { animation: float 6s 1.5s ease-in-out infinite; }
        .cta-btn {
          background: var(--orange); color: #fff; border: none;
          border-radius: 999px; padding: 16px 36px; font-size: 16px;
          font-weight: 700; cursor: pointer; font-family: "DM Sans", sans-serif;
          transition: all 0.2s ease; display: inline-flex; align-items: center;
          gap: 8px; box-shadow: 0 4px 20px rgba(232,108,47,0.35); text-decoration: none;
        }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(232,108,47,0.45); background: #d45e22; }
        .card-hover { transition: all 0.25s ease; }
        .card-hover:hover { transform: translateY(-6px); box-shadow: 0 16px 48px rgba(0,0,0,0.1) !important; }
        .section-tag {
          display: inline-block; background: var(--green-pale); color: var(--green);
          border-radius: 999px; padding: 6px 16px; font-size: 12px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 16px;
        }
        .shimmer-text {
          background: linear-gradient(90deg, var(--green) 0%, #7ab870 40%, var(--green) 80%);
          background-size: 200% auto; -webkit-background-clip: text;
          -webkit-text-fill-color: transparent; background-clip: text;
          animation: shimmer 3s linear infinite;
        }
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .dishes-grid { grid-template-columns: 1fr 1fr !important; }
          .stats-row { grid-template-columns: 1fr 1fr !important; }
          .hide-mobile { display: none !important; }
          .hero-title { font-size: 38px !important; }
          .section-title { font-size: 30px !important; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: "rgba(250,248,243,0.92)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)", padding: "0 24px",
        height: 64, display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/genie-logo.png" alt="Genie" style={{ height: 36, objectFit: "contain" }}
            onError={e => { (e.target as HTMLImageElement).style.display = "none" }} />
          <span style={{ fontFamily: "Playfair Display, serif", fontSize: 22, fontWeight: 700, color: "var(--green)" }}>Genie</span>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <a href="#come-funziona" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: 14, fontWeight: 500 }} className="hide-mobile">Come funziona</a>
          <a href="#piatti" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: 14, fontWeight: 500 }} className="hide-mobile">100 Piatti</a>
          <a href="#early-bird" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: 14, fontWeight: 500 }} className="hide-mobile">Early Bird</a>
          <a href="/landing" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: 13, fontWeight: 600 }} className="hide-mobile">EN English</a>
          <a href="/login" style={{
            color: "var(--green)", textDecoration: "none", borderRadius: 999,
            padding: "8px 16px", fontSize: 14, fontWeight: 600, border: "2px solid var(--green)"
          }}>Accedi</a>
          <a href="/onboarding" style={{
            background: "var(--green)", color: "#fff", textDecoration: "none",
            borderRadius: 999, padding: "8px 20px", fontSize: 14, fontWeight: 600
          }}>Inizia ora</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: "100vh", paddingTop: 64,
        background: "linear-gradient(160deg, #faf8f3 0%, #eef4ed 50%, #faf8f3 100%)",
        display: "flex", alignItems: "center", overflow: "hidden", position: "relative"
      }}>
        <div style={{
          position: "absolute", top: "15%", right: "-5%", width: 500, height: 500,
          borderRadius: "50%", background: "radial-gradient(circle, rgba(45,90,39,0.08) 0%, transparent 70%)",
          pointerEvents: "none"
        }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px", width: "100%" }}>
          <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
            {/* Left */}
            <div>
              <div className="fade-up-d1 section-tag">Il tuo genio della cena</div>
              <h1 className="fade-up-d2 hero-title" style={{
                fontFamily: "Playfair Display, serif", fontSize: 52, fontWeight: 800,
                lineHeight: 1.1, marginBottom: 24, letterSpacing: "-0.02em"
              }}>
                Basta stress per{" "}
                <span className="shimmer-text">cosa cucinare stasera</span>
              </h1>
              <p className="fade-up-d3" style={{ fontSize: 18, color: "var(--text-muted)", lineHeight: 1.7, marginBottom: 36, maxWidth: 480 }}>
                Genie pianifica le cene settimanali della tua famiglia, crea automaticamente la lista della spesa, tiene traccia delle calorie e del budget â€” cosi puoi concentrarti su cio che conta davvero.
              </p>
              <div className="fade-up-d4" style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 40 }}>
                <a href="#early-bird" className="cta-btn">Prenota il tuo anno gratuito</a>
                <a href="/weekly" style={{
                  display: "inline-flex", alignItems: "center",
                  color: "var(--green)", textDecoration: "none", fontWeight: 600,
                  fontSize: 16, padding: "16px 24px", borderRadius: 999,
                  border: "2px solid var(--green)", transition: "all 0.2s"
                }}>Accedi</a>
              </div>
              <div className="fade-up-d5" style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                {[{ value: "100+", label: "Ricette" }, { value: "5 min", label: "Setup settimanale" }, { value: "Gratis", label: "Per i primi iscritti" }].map(stat => (
                  <div key={stat.label}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: "var(--green)", fontFamily: "Playfair Display, serif" }}>{stat.value}</div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right â€” app mockup */}
            <div className="fade-up-d3 hide-mobile" style={{ position: "relative", height: 520 }}>
              <div className="float-card" style={{
                position: "absolute", top: 40, left: "5%", right: "5%",
                background: "var(--white)", borderRadius: 24,
                boxShadow: "0 24px 80px rgba(0,0,0,0.12)",
                overflow: "hidden", border: "1px solid var(--border)", zIndex: 1
              }}>
                <div style={{ background: "var(--green)", padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
                  <img src="/genie-logo.png" alt="" style={{ height: 28, objectFit: "contain" }}
                    onError={e => { (e.target as HTMLImageElement).style.display = "none" }} />
                  <span style={{ color: "#fff", fontWeight: 700, fontFamily: "Playfair Display, serif", fontSize: 16 }}>Genie</span>
                  <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
                    {["Settimana", "Spesa", "Nutriz."].map(label => (
                      <span key={label} style={{ background: "rgba(255,255,255,0.15)", borderRadius: 6, padding: "4px 8px", fontSize: 11, color: "#fff" }}>{label}</span>
                    ))}
                  </div>
                </div>
                <div style={{ padding: "20px" }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Questa settimana</p>
                  {[
                    { day: "Lun", dish: "Pollo alle Erbe e Limone", time: "38 min", cal: "520 kcal", img: "/images/dish-01-lemon-herb-chicken.png" },
                    { day: "Mar", dish: "Salmone Glassato al Miso", time: "20 min", cal: "480 kcal", img: "/images/dish-02-miso-salmon.png" },
                    { day: "Mer", dish: "Buddha Bowl di Verdure", time: "30 min", cal: "440 kcal", img: "/images/dish-12-buddha-bowl.png" },
                  ].map(item => (
                    <div key={item.day} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", width: 28, textTransform: "uppercase" }}>{item.day}</span>
                      <img src={item.img} alt={item.dish} style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover" }}
                        onError={e => { (e.target as HTMLImageElement).style.opacity = "0" }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{item.dish}</div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{item.time} Â· {item.cal}</div>
                      </div>
                      <div style={{ width: 8, height: 8, borderRadius: 999, background: "var(--green)" }} />
                    </div>
                  ))}
                  <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end" }}>
                    <span style={{ background: "var(--green)", color: "#fff", borderRadius: 999, padding: "6px 16px", fontSize: 12, fontWeight: 600 }}>3/7 pianificati</span>
                  </div>
                </div>
              </div>

              <div className="float-card-d" style={{
                position: "absolute", bottom: 20, right: "-5%",
                background: "var(--white)", borderRadius: 16,
                boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
                padding: "14px 18px", border: "1px solid var(--border)",
                display: "flex", alignItems: "center", gap: 10, zIndex: 2
              }}>
                <span style={{ fontSize: 28 }}>ðŸ›’</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>Lista della spesa pronta</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>21 ingredienti Â· ~â‚¬48 stimati</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEMA */}
      <section style={{ padding: "100px 24px", background: "var(--white)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 64px" }}>
            <div className="section-tag">Il Problema</div>
            <h2 className="section-title" style={{ fontFamily: "Playfair Display, serif", fontSize: 42, fontWeight: 700, lineHeight: 1.2, marginBottom: 20 }}>
              Ti suona familiare?
            </h2>
            <p style={{ fontSize: 17, color: "var(--text-muted)", lineHeight: 1.7 }}>
              Sono le 18:30. Sei esausto. La famiglia ha fame. E nessuno riesce a decidere cosa mangiare.
            </p>
          </div>
          <div className="features-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[
              { emoji: "ðŸ˜©", title: "L'eterna domanda: cosa cucino stasera?", desc: "Una persona media prende 35.000 decisioni al giorno. Non sprecare energia mentale sul menu serale.", color: "#fff3f0", border: "#ffd5c8" },
              { emoji: "ðŸ›’", title: "Caos al supermercato all'ultimo minuto", desc: "Ingredienti mancanti a meta ricetta. Acquisti doppi. Sprechi alimentari perche si compra senza un piano.", color: "#fff8f0", border: "#ffe5c2" },
              { emoji: "âš–ï¸", title: "Non sai cosa stai mangiando davvero", desc: "Il take-away si insinua nella routine. Nessuno tiene traccia delle calorie o dell'equilibrio nutrizionale.", color: "#f0f5ff", border: "#c2d4ff" },
              { emoji: "ðŸ‘¨â€ðŸ‘©â€ðŸ‘§", title: "Impossibile coordinarsi in famiglia", desc: "Gusti diversi, orari diversi, esigenze diverse. Mettere d'accordo quattro persone su sette cene e una trattativa che nessuno vuole fare.", color: "#f0fff4", border: "#c2f0d4" },
              { emoji: "ðŸ’¸", title: "Spese alimentari fuori controllo", desc: "Senza pianificazione si finisce per fare spese d'emergenza costose, ordinare a domicilio, o mangiare fuori.", color: "#fdfff0", border: "#e8f5c2" },
              { emoji: "ðŸ”", title: "Gli stessi 5 piatti che si ripetono", desc: "Senza un piano, si va sul sicuro. Pasta ancora. Pizza ancora. La stessa rotazione noiosa.", color: "#fff0fc", border: "#f5c2ee" },
            ].map(card => (
              <div key={card.title} className="card-hover" style={{ background: card.color, borderRadius: 20, border: `1px solid ${card.border}`, padding: "28px 28px 24px" }}>
                <div style={{ fontSize: 36, marginBottom: 14 }}>{card.emoji}</div>
                <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: 18, fontWeight: 700, marginBottom: 10, lineHeight: 1.3 }}>{card.title}</h3>
                <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.7 }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUZIONE */}
      <section id="come-funziona" style={{ padding: "100px 24px", background: "linear-gradient(170deg, var(--green-pale) 0%, #faf8f3 100%)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 72px" }}>
            <div className="section-tag">La Soluzione</div>
            <h2 className="section-title" style={{ fontFamily: "Playfair Display, serif", fontSize: 42, fontWeight: 700, lineHeight: 1.2, marginBottom: 20 }}>
              Ecco Genie â€” il pianificatore di cene per la tua famiglia
            </h2>
            <p style={{ fontSize: 17, color: "var(--text-muted)", lineHeight: 1.7 }}>
              Un'unica app. Condivisa con tutta la famiglia. Pianifica la settimana, crea la lista della spesa, tiene traccia di nutrizione e budget â€” in meno di 5 minuti.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 32, marginBottom: 72 }}>
            {[
              { step: "01", icon: "ðŸŽ¯", title: "Dici le tue preferenze", desc: "Tipo di dieta, tempo di cottura, allergie, numero di persone. Ci vuole 2 minuti, una volta sola." },
              { step: "02", icon: "ðŸ“…", title: "Scegli le cene della settimana", desc: "Sfoglia oltre 100 ricette filtrate per la tua famiglia. Seleziona 7, salta qualche giorno, conferma." },
              { step: "03", icon: "ðŸ›’", title: "Ricevi la lista della spesa", desc: "Lista ingredienti automatica, quantita sommate per tutta la settimana, costo stimato incluso." },
              { step: "04", icon: "ðŸ½ï¸", title: "Cucina senza pensieri", desc: "Ricette complete con istruzioni passo-passo, tempi di cottura e valori nutrizionali." },
            ].map((step) => (
              <div key={step.step} style={{ background: "var(--white)", borderRadius: 20, border: "1px solid var(--border)", padding: "32px 28px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "var(--green)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 16 }}>{step.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--orange)", letterSpacing: "0.1em", marginBottom: 8 }}>PASSO {step.step}</div>
                <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: 20, fontWeight: 700, marginBottom: 10 }}>{step.title}</h3>
                <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.7 }}>{step.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ background: "var(--green)", borderRadius: 28, padding: "48px 40px", color: "#fff" }}>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: 30, fontWeight: 700, marginBottom: 12 }}>Tutto cio di cui la tua famiglia ha bisogno, in un'unica app</h3>
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 16 }}>Condivisa tra tutti i membri della famiglia, accessibile da qualsiasi dispositivo</p>
            </div>
            <div className="stats-row" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
              {[
                { icon: "ðŸ“Š", title: "Monitoraggio nutrizionale", desc: "Calorie, proteine, carboidrati e grassi per cena e per settimana" },
                { icon: "ðŸ’°", title: "Stima del budget", desc: "Costo approssimativo della lista della spesa per restare nei limiti" },
                { icon: "ðŸŒ", title: "Italiano e inglese", desc: "Interfaccia e ricette disponibili in italiano e inglese" },
                { icon: "ðŸ“±", title: "Ottimizzato per mobile", desc: "Funziona perfettamente su smartphone, tablet e desktop" },
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

      {/* PIATTI */}
      <section id="piatti" style={{ padding: "100px 24px", background: "var(--white)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 56px" }}>
            <div className="section-tag">Il Menu</div>
            <h2 className="section-title" style={{ fontFamily: "Playfair Display, serif", fontSize: 42, fontWeight: 700, lineHeight: 1.2, marginBottom: 20 }}>
              100 piatti. Tutti pronti in 40 minuti.
            </h2>
            <p style={{ fontSize: 17, color: "var(--text-muted)", lineHeight: 1.7 }}>
              Dai classici italiani ai piatti internazionali â€” ogni ricetta e bilanciata, usa ingredienti di supermercato ed e pronta in meno di 40 minuti.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 48 }}>
            {[
              { label: "Onnivori", active: true },
              { label: "Vegetariani", active: false },
              { label: "Vegani", active: false },
              { label: "Pescatariani", active: false },
              { label: "Senza glutine", active: false },
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
          <div className="dishes-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 40 }}>
            {[
              { name: "Pollo alle Erbe e Limone", time: "38 min", cal: "520 kcal", img: "/images/dish-01-lemon-herb-chicken.png", tag: "pollo" },
              { name: "Salmone Glassato al Miso", time: "20 min", cal: "480 kcal", img: "/images/dish-02-miso-salmon.png", tag: "pesce" },
              { name: "Buddha Bowl di Verdure", time: "30 min", cal: "440 kcal", img: "/images/dish-12-buddha-bowl.png", tag: "vegano" },
              { name: "Risotto ai Funghi", time: "38 min", cal: "510 kcal", img: "/images/dish-13-mushroom-risotto.png", tag: "vegetariano" },
              { name: "Saltato di Manzo Tailandese", time: "20 min", cal: "490 kcal", img: "/images/dish-03-thai-beef-basil.png", tag: "veloce" },
              { name: "Curry di Ceci e Pomodoro", time: "28 min", cal: "420 kcal", img: "/images/dish-19-chickpea-tomato-curry.png", tag: "vegano" },
              { name: "Insalata con Halloumi", time: "15 min", cal: "420 kcal", img: "/images/dish-18-greek-halloumi-salad.png", tag: "vegetariano" },
              { name: "Paella di Gamberi", time: "38 min", cal: "550 kcal", img: "/images/dish-05-prawn-chorizo-paella.png", tag: "pesce" },
            ].map(dish => (
              <div key={dish.name} className="card-hover" style={{ borderRadius: 16, overflow: "hidden", border: "1px solid var(--border)", background: "var(--white)", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <div style={{ position: "relative", height: 140 }}>
                  <img src={dish.img} alt={dish.name} style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={e => { (e.target as HTMLImageElement).style.background = "var(--green-pale)" }} />
                  <span style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.55)", color: "#fff", borderRadius: 999, padding: "2px 8px", fontSize: 10, fontWeight: 600 }}>{dish.tag}</span>
                </div>
                <div style={{ padding: "12px 14px" }}>
                  <p style={{ fontFamily: "Playfair Display, serif", fontWeight: 600, fontSize: 14, marginBottom: 4, lineHeight: 1.3 }}>{dish.name}</p>
                  <div style={{ display: "flex", gap: 10 }}>
                    <span style={{ fontSize: 11, color: "var(--text-muted)" }}>â± {dish.time}</span>
                    <span style={{ fontSize: 11, color: "var(--text-muted)" }}>ðŸ”¥ {dish.cal}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "var(--text-muted)", fontSize: 15, marginBottom: 20 }}>
              Mostrando 8 di <strong>24 piatti</strong> â€” in crescita fino a <strong>100+</strong> al lancio
            </p>
            <a href="/onboarding" className="cta-btn">Inizia gratis</a>
          </div>
        </div>
      </section>

      {/* EARLY BIRD */}
      <section id="early-bird" style={{
        padding: "100px 24px",
        background: "linear-gradient(160deg, #1a3318 0%, var(--green) 60%, #3d7a35 100%)",
        position: "relative", overflow: "hidden"
      }}>
        <div style={{ position: "absolute", top: "-20%", right: "-10%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <div style={{ display: "inline-block", background: "rgba(232,108,47,0.2)", border: "1px solid rgba(232,108,47,0.5)", borderRadius: 999, padding: "6px 20px", fontSize: 12, fontWeight: 700, color: "#ffb088", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 24 }}>
            Offerta Early Bird
          </div>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 48, fontWeight: 800, color: "#fff", lineHeight: 1.15, marginBottom: 20 }}>
            Le prime 100 famiglie ottengono<br />
            <span style={{ color: "#ffb088" }}>1 anno intero gratis</span>
          </h2>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.8)", lineHeight: 1.7, marginBottom: 48 }}>
            Genie sta per lanciare. Stiamo offrendo alle prime 100 famiglie un anno completo di accesso premium â€” completamente gratuito. Nessuna carta di credito. Nessuna sorpresa.
          </p>
          <div style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 20, padding: "24px 32px", marginBottom: 40, display: "inline-flex", alignItems: "center", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
            <div>
              <div style={{ fontSize: 56, fontWeight: 800, color: "#ffb088", fontFamily: "Playfair Display, serif", lineHeight: 1 }}>{count}</div>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginTop: 4 }}>posti rimasti</div>
            </div>
            <div style={{ width: 1, height: 60, background: "rgba(255,255,255,0.2)" }} />
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>su 100</div>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginTop: 4 }}>posti early bird</div>
            </div>
            <div style={{ width: 1, height: 60, background: "rgba(255,255,255,0.2)" }} />
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>1 anno</div>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginTop: 4 }}>completamente gratuito</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/onboarding" style={{
              background: "var(--orange)", color: "#fff", textDecoration: "none",
              borderRadius: 999, padding: "16px 40px", fontSize: 17, fontWeight: 700,
              boxShadow: "0 4px 24px rgba(232,108,47,0.4)", transition: "all 0.2s",
              display: "inline-flex", alignItems: "center", gap: 8
            }}>
              Inizia gratis â€” 1 anno omaggio
            </a>
            <a href="/login" style={{
              background: "rgba(255,255,255,0.15)", color: "#fff", textDecoration: "none",
              borderRadius: 999, padding: "16px 32px", fontSize: 17, fontWeight: 600,
              border: "2px solid rgba(255,255,255,0.4)", transition: "all 0.2s",
              display: "inline-flex", alignItems: "center", gap: 8
            }}>
              Hai gia un account? Accedi
            </a>
          </div>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, marginTop: 16 }}>
            Nessuna carta di credito. Cancellazione in qualsiasi momento.
          </p>
          <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap", marginTop: 48 }}>
            {["100+ ricette", "Pianificatore settimanale", "Lista della spesa", "Monitoraggio nutrizionale", "Stima del budget", "Italiano e inglese"].map(item => (
              <span key={item} style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: 500 }}>âœ“ {item}</span>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#111", color: "rgba(255,255,255,0.5)", padding: "40px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/genie-logo.png" alt="Genie" style={{ height: 28, objectFit: "contain", opacity: 0.7 }}
              onError={e => { (e.target as HTMLImageElement).style.display = "none" }} />
            <span style={{ fontFamily: "Playfair Display, serif", color: "rgba(255,255,255,0.7)", fontSize: 18, fontWeight: 700 }}>Genie</span>
          </div>
          <p style={{ fontSize: 13 }}>Â© 2025 Genie. Il tuo assistente intelligente per le cene.</p>
          <div style={{ display: "flex", gap: 20 }}>
            <a href="/login" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: 13 }}>Accedi</a>
            <a href="/landing" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: 13 }}>EN English</a>
            <a href="mailto:hello@thegenie.life" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: 13 }}>Contatti</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
