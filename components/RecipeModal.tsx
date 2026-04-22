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
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.6)",
      display: "flex", alignItems: "flex-end",
      justifyContent: "center", padding: "0"
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "var(--white)",
        borderRadius: "20px 20px 0 0",
        width: "100%", maxWidth: 680,
        maxHeight: "92vh", overflowY: "auto",
        boxShadow: "0 -8px 40px rgba(0,0,0,0.2)"
      }}>
        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}>
          <div style={{ width: 40, height: 4, borderRadius: 999, background: "var(--border)" }} />
        </div>

        <div style={{ position: "relative", height: 220 }}>
          <img src={menu.image_url} alt={menu.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <button onClick={onClose} style={{
            position: "absolute", top: 12, right: 12,
            background: "rgba(0,0,0,0.5)", border: "none", color: "#fff",
            width: 34, height: 34, borderRadius: 999, cursor: "pointer",
            fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center"
          }}>x</button>
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
            padding: "32px 20px 16px"
          }}>
            <h2 style={{
              fontFamily: "Playfair Display, serif", color: "#fff",
              fontSize: 22, fontWeight: 700, marginBottom: 4
            }}>{menu.name}</h2>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 13 }}>{menu.cook_time} min</span>
              <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 13 }}>{menu.calories} kcal</span>
              <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 13 }}>{menu.servings} servings</span>
            </div>
          </div>
        </div>

        <div style={{ padding: "20px 20px 32px" }}>
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>
            {menu.description}
          </p>

          {/* Macro row */}
          <div style={{ display: "flex", gap: 8, marginBottom: 24, overflowX: "auto" }}>
            {[
              { label: "Protein", value: menu.protein + "g", color: "#3b82f6" },
              { label: "Carbs", value: menu.carbs + "g", color: "#f59e0b" },
              { label: "Fat", value: menu.fat + "g", color: "#10b981" },
              { label: "Calories", value: menu.calories + " kcal", color: "var(--orange)" },
            ].map(m => (
              <div key={m.label} style={{
                background: "var(--cream)", borderRadius: 10,
                padding: "10px 14px", flex: "1", minWidth: 70, textAlign: "center", flexShrink: 0
              }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: m.color }}>{m.value}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{m.label}</div>
              </div>
            ))}
          </div>

          {/* Ingredients */}
          <h3 style={{
            fontFamily: "Playfair Display, serif", fontSize: 17,
            fontWeight: 700, marginBottom: 12, color: "var(--green)"
          }}>Ingredients</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 24 }}>
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
                <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>
                  {ing.amount} {ing.unit}
                </span>
              </div>
            ))}
          </div>

          {/* Method */}
          <h3 style={{
            fontFamily: "Playfair Display, serif", fontSize: 17,
            fontWeight: 700, marginBottom: 12, color: "var(--green)"
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
  )
}