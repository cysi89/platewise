"use client"
import { useState } from "react"
import { Menu } from "@/lib/types"
import RecipeModal from "./RecipeModal"

interface Props {
  menu: Menu
  selected: boolean
  onSelect: () => void
  onDeselect: () => void
}

export default function MenuCard({ menu, selected, onSelect, onDeselect }: Props) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      {showModal && <RecipeModal menu={menu} onClose={() => setShowModal(false)} />}
      <div style={{
        background: selected ? "var(--green)" : "var(--white)",
        border: selected ? "2px solid var(--green)" : "2px solid var(--border)",
        borderRadius: "var(--radius)", overflow: "hidden",
        transition: "all 0.2s ease",
        transform: selected ? "scale(1.02)" : "scale(1)",
        boxShadow: selected ? "0 8px 32px rgba(45,90,39,0.25)" : "var(--shadow)",
      }}>
        <div
          onClick={selected ? onDeselect : onSelect}
          style={{ position: "relative", height: 140, cursor: "pointer" }}
        >
          <img src={menu.image_url} alt={menu.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          {selected && (
            <div style={{
              position: "absolute", top: 10, right: 10,
              background: "var(--orange)", color: "#fff",
              borderRadius: 999, width: 28, height: 28,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 700
            }}>ok</div>
          )}
          <div style={{
            position: "absolute", bottom: 8, left: 8,
            display: "flex", gap: 4, flexWrap: "wrap"
          }}>
            {menu.tags.slice(0, 2).map(tag => (
              <span key={tag} style={{
                background: "rgba(0,0,0,0.55)", color: "#fff",
                fontSize: 10, padding: "2px 8px", borderRadius: 999,
                textTransform: "uppercase", letterSpacing: "0.05em"
              }}>{tag}</span>
            ))}
          </div>
        </div>

        <div style={{ padding: "12px 14px" }}>
          <p
            onClick={selected ? onDeselect : onSelect}
            style={{
              fontFamily: "Playfair Display, serif",
              fontSize: 14, fontWeight: 600, cursor: "pointer",
              color: selected ? "#fff" : "var(--text)",
              marginBottom: 6, lineHeight: 1.3
            }}>{menu.name}</p>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 10 }}>
              <span style={{ fontSize: 12, color: selected ? "rgba(255,255,255,0.75)" : "var(--text-muted)" }}>
                {menu.cook_time} min
              </span>
              <span style={{ fontSize: 12, color: selected ? "rgba(255,255,255,0.75)" : "var(--text-muted)" }}>
                {menu.calories} kcal
              </span>
            </div>
            <button
              onClick={e => { e.stopPropagation(); setShowModal(true) }}
              style={{
                background: selected ? "rgba(255,255,255,0.2)" : "var(--green-pale)",
                border: "none", borderRadius: 999,
                padding: "4px 10px", fontSize: 11, fontWeight: 600,
                color: selected ? "#fff" : "var(--green)",
                cursor: "pointer", transition: "all 0.15s"
              }}
            >View</button>
          </div>
        </div>
      </div>
    </>
  )
}