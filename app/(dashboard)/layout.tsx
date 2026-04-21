"use client"
import { useState } from "react"
import { DAYS, DaySelection, Menu, Ingredient } from "@/lib/types"
import { MOCK_MENUS } from "@/lib/mockMenus"
import MenuCard from "@/components/MenuCard"
import RecipeModal from "@/components/RecipeModal"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const today = new Date()
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7))

  const [selections, setSelections] = useState<DaySelection[]>(
    DAYS.map((day, i) => {
      const d = new Date(monday)
      d.setDate(monday.getDate() + i)
      return { day, date: d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }), menu: null, skipped: false }
    })
  )
  const [tab, setTab] = useState(0)
  const tabs = ["This Week", "Ingredients", "Nutrition", "Recipes"]

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)" }}>
      <header style={{
        background: "var(--green)", padding: "0 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 64, position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 2px 12px rgba(0,0,0,0.15)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>Plate</span>
          <span style={{ fontFamily: "Playfair Display, serif", color: "#fff", fontSize: 22, fontWeight: 700 }}>Wise</span>
        </div>
        <nav style={{ display: "flex", gap: 4 }}>
          {tabs.map((t, i) => (
            <button key={i} onClick={() => setTab(i)} style={{
              background: tab === i ? "rgba(255,255,255,0.2)" : "transparent",
              border: tab === i ? "1px solid rgba(255,255,255,0.4)" : "1px solid transparent",
              color: "#fff", padding: "8px 18px", borderRadius: 999,
              cursor: "pointer", fontSize: 14, fontWeight: 500, transition: "all 0.15s"
            }}>{t}</button>
          ))}
        </nav>
        <div style={{
          background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)",
          borderRadius: 999, padding: "6px 16px", color: "#fff", fontSize: 13
        }}>
          Week of {monday.toLocaleDateString("en-GB", { day: "numeric", month: "long" })}
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
        {tab === 0 && <WeeklyTab selections={selections} setSelections={setSelections} />}
        {tab === 1 && <IngredientsTab selections={selections} />}
        {tab === 2 && <NutritionTab selections={selections} />}
        {tab === 3 && <RecipesTab selections={selections} />}
      </main>
    </div>
  )
}

function WeeklyTab({ selections, setSelections }: { selections: DaySelection[], setSelections: (s: DaySelection[]) => void }) {
  const [activeDay, setActiveDay] = useState(0)
  const [filter, setFilter] = useState("all")
  const filters = ["all", "quick", "vegetarian", "vegan", "chicken", "fish", "healthy"]
  const filtered = filter === "all" ? MOCK_MENUS : MOCK_MENUS.filter(m => m.tags.includes(filter))
  const selectMenu = (menu: Menu) => {
    const updated = [...selections]
    updated[activeDay] = { ...updated[activeDay], menu, skipped: false }
    setSelections(updated)
  }
  const skipDay = () => {
    const updated = [...selections]
    updated[activeDay] = { ...updated[activeDay], menu: null, skipped: true }
    setSelections(updated)
  }
  const clearDay = () => {
    const updated = [...selections]
    updated[activeDay] = { ...updated[activeDay], menu: null, skipped: false }
    setSelections(updated)
  }
  const selectedCount = selections.filter(s => s.menu).length
  return (
    <div>
      <div style={{ marginBottom: 28, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 4 }}>Plan your week</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 15 }}>{selectedCount} of 7 dinners planned</p>
        </div>
        <div style={{ background: "var(--green)", color: "#fff", borderRadius: 999, padding: "10px 24px", fontSize: 15, fontWeight: 600 }}>
          {selectedCount}/7 meals
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 28, overflowX: "auto", paddingBottom: 4 }}>
        {selections.map((s, i) => (
          <button key={i} onClick={() => setActiveDay(i)} style={{
            minWidth: 90, padding: "12px 8px", borderRadius: 12, cursor: "pointer",
            border: activeDay === i ? "2px solid var(--green)" : "2px solid var(--border)",
            background: s.skipped ? "#f5f0e8" : s.menu ? "var(--green-pale)" : "var(--white)",
            transition: "all 0.15s", textAlign: "center"
          }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {s.day.slice(0, 3)}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", margin: "2px 0" }}>{s.date}</div>
            <div style={{ fontSize: 13, marginTop: 2 }}>{s.skipped ? "skip" : s.menu ? "done" : "-"}</div>
          </button>
        ))}
      </div>

      <div style={{
        background: "var(--white)", borderRadius: "var(--radius)", padding: 20, marginBottom: 24,
        border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <div>
          <span style={{ fontWeight: 700, fontSize: 18 }}>{selections[activeDay].day}</span>
          <span style={{ color: "var(--text-muted)", marginLeft: 8 }}>{selections[activeDay].date}</span>
          {selections[activeDay].menu && (
            <p style={{ color: "var(--green)", fontWeight: 600, marginTop: 4 }}>Selected: {selections[activeDay].menu!.name}</p>
          )}
          {selections[activeDay].skipped && <p style={{ color: "var(--text-muted)", marginTop: 4 }}>Skipped</p>}
          {!selections[activeDay].menu && !selections[activeDay].skipped && (
            <p style={{ color: "var(--text-muted)", marginTop: 4 }}>Pick a recipe below</p>
          )}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={skipDay} style={{
            padding: "8px 16px", borderRadius: 999, border: "1px solid var(--border)",
            background: "var(--white)", cursor: "pointer", fontSize: 13, color: "var(--text-muted)"
          }}>Skip day</button>
          {(selections[activeDay].menu || selections[activeDay].skipped) && (
            <button onClick={clearDay} style={{
              padding: "8px 16px", borderRadius: 999, border: "1px solid var(--border)",
              background: "var(--white)", cursor: "pointer", fontSize: 13, color: "var(--text-muted)"
            }}>Clear</button>
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "6px 16px", borderRadius: 999, cursor: "pointer", fontSize: 13,
            border: filter === f ? "none" : "1px solid var(--border)",
            background: filter === f ? "var(--orange)" : "var(--white)",
            color: filter === f ? "#fff" : "var(--text)",
            fontWeight: filter === f ? 600 : 400, transition: "all 0.15s", textTransform: "capitalize"
          }}>{f === "all" ? "All recipes" : f}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
        {filtered.map(menu => (
          <MenuCard key={menu.id} menu={menu}
            selected={selections[activeDay].menu?.id === menu.id}
            onSelect={() => selectMenu(menu)}
            onDeselect={clearDay}
          />
        ))}
      </div>
    </div>
  )
}

function IngredientsTab({ selections }: { selections: DaySelection[] }) {
  const selectedMenus = selections.filter(s => s.menu).map(s => s.menu!)
  if (selectedMenus.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "80px 0" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
        <h2 style={{ fontSize: 24, marginBottom: 8 }}>No meals planned yet</h2>
        <p style={{ color: "var(--text-muted)" }}>Head to This Week and select some dinners first.</p>
      </div>
    )
  }
  const merged: Record<string, Ingredient & { days: string[] }> = {}
  selections.forEach(s => {
    if (!s.menu) return
    s.menu.ingredients.forEach(ing => {
      const key = ing.name.toLowerCase()
      if (merged[key]) { merged[key].amount += ing.amount; merged[key].days.push(s.day.slice(0, 3)) }
      else merged[key] = { ...ing, days: [s.day.slice(0, 3)] }
    })
  })
  const categories: Record<string, (Ingredient & { days: string[] })[]> = {}
  Object.values(merged).forEach(ing => {
    if (!categories[ing.category]) categories[ing.category] = []
    categories[ing.category].push(ing)
  })
  const catEmoji: Record<string, string> = { protein: "🥩", vegetable: "🥦", pantry: "🫙", dairy: "🧀", grain: "🌾" }
  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 4 }}>Shopping list</h1>
        <p style={{ color: "var(--text-muted)" }}>For {selectedMenus.length} meals this week</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
        {Object.entries(categories).map(([cat, items]) => (
          <div key={cat} style={{ background: "var(--white)", borderRadius: "var(--radius)", border: "1px solid var(--border)", overflow: "hidden" }}>
            <div style={{ background: "var(--green-pale)", padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 20 }}>{catEmoji[cat] || "📦"}</span>
              <span style={{ fontWeight: 700, textTransform: "capitalize", fontSize: 16 }}>{cat}</span>
              <span style={{ marginLeft: "auto", background: "var(--green)", color: "#fff", borderRadius: 999, padding: "2px 10px", fontSize: 12 }}>{items.length}</span>
            </div>
            {items.map(ing => (
              <div key={ing.name} style={{ padding: "12px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <span style={{ fontWeight: 500 }}>{ing.name}</span>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{ing.days.join(", ")}</div>
                </div>
                <span style={{ background: "var(--cream-dark)", borderRadius: 8, padding: "4px 10px", fontSize: 13, fontWeight: 600 }}>{ing.amount} {ing.unit}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function NutritionTab({ selections }: { selections: DaySelection[] }) {
  const selectedDays = selections.filter(s => s.menu)
  const totals = selectedDays.reduce((acc, s) => ({
    calories: acc.calories + (s.menu?.calories || 0),
    protein: acc.protein + (s.menu?.protein || 0),
    carbs: acc.carbs + (s.menu?.carbs || 0),
    fat: acc.fat + (s.menu?.fat || 0),
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 })
  const avgCal = selectedDays.length ? Math.round(totals.calories / selectedDays.length) : 0
  if (selectedDays.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "80px 0" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>📊</div>
        <h2 style={{ fontSize: 24, marginBottom: 8 }}>No data yet</h2>
        <p style={{ color: "var(--text-muted)" }}>Select some meals to see your nutrition breakdown.</p>
      </div>
    )
  }
  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 4 }}>Nutrition overview</h1>
        <p style={{ color: "var(--text-muted)" }}>Based on {selectedDays.length} planned dinners</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Total calories", value: totals.calories, unit: "kcal", color: "var(--orange)", emoji: "🔥" },
          { label: "Avg per dinner", value: avgCal, unit: "kcal", color: "var(--green)", emoji: "📈" },
          { label: "Total protein", value: totals.protein, unit: "g", color: "#3b82f6", emoji: "💪" },
          { label: "Total carbs", value: totals.carbs, unit: "g", color: "#f59e0b", emoji: "🌾" },
        ].map(card => (
          <div key={card.label} style={{ background: "var(--white)", borderRadius: "var(--radius)", border: "1px solid var(--border)", padding: "20px 24px" }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{card.emoji}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: card.color }}>
              {card.value}<span style={{ fontSize: 14, fontWeight: 400, color: "var(--text-muted)", marginLeft: 4 }}>{card.unit}</span>
            </div>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>{card.label}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "var(--white)", borderRadius: "var(--radius)", border: "1px solid var(--border)", overflow: "hidden" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)", fontWeight: 700, fontSize: 18 }}>Day by day</div>
        {selectedDays.map(s => {
          const m = s.menu!
          const maxCal = Math.max(...selectedDays.map(x => x.menu?.calories || 0))
          const barWidth = Math.round((m.calories / maxCal) * 100)
          return (
            <div key={s.day} style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)", display: "grid", gridTemplateColumns: "100px 1fr 80px", alignItems: "center", gap: 16 }}>
              <div>
                <div style={{ fontWeight: 600 }}>{s.day.slice(0, 3)}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{s.date}</div>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 6 }}>{m.name}</div>
                <div style={{ background: "var(--cream-dark)", borderRadius: 999, height: 8, overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 999, width: barWidth + "%", background: "var(--green)", transition: "width 0.4s ease" }} />
                </div>
                <div style={{ display: "flex", gap: 16, marginTop: 6 }}>
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>P: {m.protein}g</span>
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>C: {m.carbs}g</span>
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>F: {m.fat}g</span>
                </div>
              </div>
              <div style={{ fontWeight: 700, color: "var(--orange)", textAlign: "right" }}>
                {m.calories}<span style={{ fontSize: 11, fontWeight: 400 }}> kcal</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function RecipesTab({ selections }: { selections: DaySelection[] }) {
  const [search, setSearch] = useState("")
  const [selectedRecipe, setSelectedRecipe] = useState<Menu | null>(null)
  const todayIndex = Math.min(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1, 6)
  const todaySelection = selections[todayIndex]

  const searchResults = search.length > 1
    ? MOCK_MENUS.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.tags.some(t => t.includes(search.toLowerCase())) ||
        m.ingredients.some(i => i.name.toLowerCase().includes(search.toLowerCase()))
      )
    : []

  return (
    <div>
      {selectedRecipe && <RecipeModal menu={selectedRecipe} onClose={() => setSelectedRecipe(null)} />}

      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 4 }}>Recipes</h1>
        <p style={{ color: "var(--text-muted)" }}>Browse all recipes or find tonight's dinner details</p>
      </div>

      {todaySelection?.menu && (
        <div style={{
          background: "var(--green)", borderRadius: "var(--radius)",
          padding: "24px 28px", marginBottom: 32, display: "flex",
          alignItems: "center", justifyContent: "space-between", gap: 20
        }}>
          <div style={{ display: "flex", gap: 20, alignItems: "center", flex: 1 }}>
            <img src={todaySelection.menu.image_url} alt={todaySelection.menu.name}
              style={{ width: 80, height: 80, borderRadius: 12, objectFit: "cover", flexShrink: 0 }} />
            <div>
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
                Tonight — {todaySelection.day}
              </p>
              <h2 style={{ color: "#fff", fontFamily: "Playfair Display, serif", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>
                {todaySelection.menu.name}
              </h2>
              <div style={{ display: "flex", gap: 16 }}>
                <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>{todaySelection.menu.cook_time} min</span>
                <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>{todaySelection.menu.calories} kcal</span>
                <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>{todaySelection.menu.protein}g protein</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setSelectedRecipe(todaySelection.menu)}
            style={{
              background: "#fff", color: "var(--green)", border: "none",
              borderRadius: 999, padding: "12px 24px", fontWeight: 700,
              fontSize: 14, cursor: "pointer", flexShrink: 0
            }}>View full recipe</button>
        </div>
      )}

      {!todaySelection?.menu && (
        <div style={{
          background: "var(--white)", borderRadius: "var(--radius)", padding: "24px 28px",
          border: "1px solid var(--border)", marginBottom: 32, textAlign: "center"
        }}>
          <p style={{ color: "var(--text-muted)", fontSize: 15 }}>
            No dinner planned for today. Go to <strong>This Week</strong> to select one.
          </p>
        </div>
      )}

      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 14 }}>Search all recipes</h2>
        <input
          type="text"
          placeholder="Search by name, ingredient or tag..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: "100%", padding: "14px 20px", borderRadius: 999,
            border: "2px solid var(--border)", fontSize: 15,
            background: "var(--white)", outline: "none",
            fontFamily: "DM Sans, sans-serif", color: "var(--text)"
          }}
        />
      </div>

      {search.length > 1 && (
        <div>
          <p style={{ color: "var(--text-muted)", marginBottom: 16, fontSize: 14 }}>
            {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for "{search}"
          </p>
          {searchResults.length === 0 ? (
            <p style={{ color: "var(--text-muted)" }}>No recipes found. Try a different search.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {searchResults.map(menu => (
                <div key={menu.id} style={{
                  background: "var(--white)", borderRadius: "var(--radius)",
                  border: "1px solid var(--border)", overflow: "hidden",
                  display: "flex", gap: 0, cursor: "pointer"
                }} onClick={() => setSelectedRecipe(menu)}>
                  <img src={menu.image_url} alt={menu.name}
                    style={{ width: 100, height: 100, objectFit: "cover", flexShrink: 0 }} />
                  <div style={{ padding: "14px 16px" }}>
                    <p style={{ fontFamily: "Playfair Display, serif", fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{menu.name}</p>
                    <div style={{ display: "flex", gap: 10 }}>
                      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{menu.cook_time} min</span>
                      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{menu.calories} kcal</span>
                    </div>
                    <div style={{ display: "flex", gap: 4, marginTop: 8, flexWrap: "wrap" }}>
                      {menu.tags.slice(0, 2).map(t => (
                        <span key={t} style={{
                          background: "var(--green-pale)", color: "var(--green)",
                          fontSize: 10, padding: "2px 8px", borderRadius: 999,
                          textTransform: "capitalize", fontWeight: 600
                        }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {search.length <= 1 && (
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>All recipes</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {MOCK_MENUS.map(menu => (
              <div key={menu.id} style={{
                background: "var(--white)", borderRadius: "var(--radius)",
                border: "1px solid var(--border)", overflow: "hidden",
                display: "flex", cursor: "pointer", transition: "all 0.15s"
              }} onClick={() => setSelectedRecipe(menu)}>
                <img src={menu.image_url} alt={menu.name}
                  style={{ width: 100, height: 100, objectFit: "cover", flexShrink: 0 }} />
                <div style={{ padding: "14px 16px" }}>
                  <p style={{ fontFamily: "Playfair Display, serif", fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{menu.name}</p>
                  <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{menu.cook_time} min</span>
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{menu.calories} kcal</span>
                  </div>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {menu.tags.slice(0, 2).map(t => (
                      <span key={t} style={{
                        background: "var(--green-pale)", color: "var(--green)",
                        fontSize: 10, padding: "2px 8px", borderRadius: 999,
                        textTransform: "capitalize", fontWeight: 600
                      }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}