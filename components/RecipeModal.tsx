"use client"
import { Menu } from "@/lib/types"

interface Props {
  menu: Menu
  onClose: () => void
}

export default function RecipeModal({ menu, onClose }: Props) {
  const catEmoji: Record<string, string> = {
    protein: "🥩", vegetable: "🥦", pantry: "🫙", dairy: "🧀", grain: "🌾"
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px"
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "var(--white)", borderRadius: 20,
          maxWidth: 680, width: "100%", maxHeight: "90vh",
          overflowY: "auto", boxShadow: "0 24px 80px rgba(0,0,0,0.3)"
        }}
      >
        <div style={{ position: "relative", height: 260 }}>
          <img src={menu.image_url} alt={menu.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "20px 20px 0 0" }} />
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: 16, right: 16,
              background: "rgba(0,0,0,0.5)", border: "none", color: "#fff",
              width: 36, height: 36, borderRadius: 999, cursor: "pointer",
              fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center"
            }}
          >x</button>
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
            padding: "40px 28px 20px", borderRadius: "0 0 0 0"
          }}>
            <h2 style={{
              fontFamily: "Playfair Display, serif", color: "#fff",
              fontSize: 26, fontWeight: 700, marginBottom: 6
            }}>{menu.name}</h2>
            <div style={{ display: "flex", gap: 16 }}>
              {[
                { label: menu.cook_time + " min", icon: "clock" },
                { label: menu.calories + " kcal", icon: "fire" },
                { label: menu.servings + " servings", icon: "people" },
              ].map(item => (
                <span key={item.label} style={{
                  color: "rgba(255,255,255,0.9)", fontSize: 13, fontWeight: 500
                }}>{item.label}</span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ padding: "24px 28px 32px" }}>
          <p style={{ color: "var(--text-muted)", fontSize: 15, marginBottom: 24, lineHeight: 1.6 }}>
            {menu.description}
          </p>

          <div style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap" }}>
            {[
              { label: "Protein", value: menu.protein + "g", color: "#3b82f6" },
              { label: "Carbs", value: menu.carbs + "g", color: "#f59e0b" },
              { label: "Fat", value: menu.fat + "g", color: "#10b981" },
              { label: "Calories", value: menu.calories + " kcal", color: "var(--orange)" },
            ].map(m => (
              <div key={m.label} style={{
                background: "var(--cream)", borderRadius: 10,
                padding: "10px 16px", flex: "1", minWidth: 100, textAlign: "center"
              }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: m.color }}>{m.value}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{m.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
            <div>
              <h3 style={{
                fontFamily: "Playfair Display, serif", fontSize: 18,
                fontWeight: 700, marginBottom: 14, color: "var(--green)"
              }}>Ingredients</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {menu.ingredients.map(ing => (
                  <div key={ing.name} style={{
                    display: "flex", alignItems: "center",
                    justifyContent: "space-between", padding: "8px 12px",
                    background: "var(--cream)", borderRadius: 8
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 14 }}>{catEmoji[ing.category]}</span>
                      <span style={{ fontSize: 14, fontWeight: 500 }}>{ing.name}</span>
                    </div>
                    <span style={{
                      fontSize: 13, color: "var(--text-muted)", fontWeight: 600
                    }}>{ing.amount} {ing.unit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 style={{
                fontFamily: "Playfair Display, serif", fontSize: 18,
                fontWeight: 700, marginBottom: 14, color: "var(--green)"
              }}>Method</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {menu.recipe_steps.map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: 12 }}>
                    <div style={{
                      minWidth: 24, height: 24, borderRadius: 999,
                      background: "var(--green)", color: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 700, marginTop: 1, flexShrink: 0
                    }}>{i + 1}</div>
                    <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text)", margin: 0 }}>{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}