"use client"
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import "@/lib/i18n"
import { DAYS, DaySelection, Menu, Ingredient } from "@/lib/types"
import MenuCard from "@/components/MenuCard"
import RecipeModal from "@/components/RecipeModal"
import LanguageToggle from "@/components/LanguageToggle"
import { supabase, saveWeekSelections, loadWeekSelections, fetchAllRecipes, cleanupOldSelections } from "@/lib/supabase"

function getMondayForOffset(weekOffset: number): Date {
  const now = new Date()
  const day = now.getDay()
  const diff = (day === 0 ? -6 : 1) - day
  const thisMonday = new Date(now)
  thisMonday.setDate(now.getDate() + diff)
  thisMonday.setHours(0, 0, 0, 0)
  const target = new Date(thisMonday)
  target.setDate(thisMonday.getDate() + weekOffset * 7)
  return target
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" })
}

function getMondayForOffsetLabel(offset: number, t: any): string {
  if (offset === 0) return t("weekly.thisWeek")
  if (offset === 1) return t("weekly.nextWeek")
  return t("weekly.weekAfter")
}

function getWeekDateRange(weekOffset: number): string {
  const monday = getMondayForOffset(weekOffset)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  return `${formatDate(monday)} - ${formatDate(sunday)}`
}

function makeWeek(weekOffset: number): DaySelection[] {
  const monday = getMondayForOffset(weekOffset)
  return DAYS.map((day, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return { day, date: formatDate(d), menu: null, skipped: false }
  })
}

type Week = {
  id: number
  weekOffset: number
  label: string
  dateRange: string
  selections: DaySelection[]
  confirmed: boolean
  expanded: boolean
  editing: boolean
}

function buildWeeks(t: any): Week[] {
  return [0, 1, 2].map(offset => ({
    id: offset,
    weekOffset: offset,
    label: getMondayForOffsetLabel(offset, t),
    dateRange: getWeekDateRange(offset),
    selections: makeWeek(offset),
    confirmed: false,
    expanded: false,
    editing: false,
  }))
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation()
  const [tab, setTab] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [weeks, setWeeks] = useState<Week[]>(() => buildWeeks(t))
  const [menus, setMenus] = useState<Menu[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const tabs = [
    t("nav.thisWeek"),
    t("nav.ingredients"),
    t("nav.nutrition"),
    t("nav.recipes"),
  ]

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = "/login"; return }
      setUserId(user.id)

      const recipes = await fetchAllRecipes()
      if (recipes.length > 0) setMenus(recipes)

      const saved = await loadWeekSelections(user.id)
      if (saved.length > 0) {
        setWeeks(prev => prev.map(week => {
          const weekRows = saved.filter((r: any) => r.week_offset === week.weekOffset)
          if (weekRows.length === 0) return week
          const confirmed = weekRows.some((r: any) => r.confirmed)
          const selections = week.selections.map((s, i) => {
            const row = weekRows.find((r: any) => r.day_index === i)
            if (!row) return s
            const menu = row.menu_id ? recipes.find(m => m.id === row.menu_id) || null : null
            return { ...s, menu, skipped: row.skipped }
          })
          return { ...week, selections, confirmed }
        }))
      }

      await cleanupOldSelections(user.id)
      setLoading(false)
    }
    init()

    const interval = setInterval(() => {
      const now = new Date()
      if (now.getDay() === 1 && now.getHours() === 0 && now.getMinutes() === 0) {
        setWeeks(buildWeeks(t))
      }
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const updateWeek = (weekId: number, selections: DaySelection[]) => {
    setWeeks(prev => prev.map(w => w.id === weekId ? { ...w, selections } : w))
    if (userId) {
      saveWeekSelections(
        userId, weekId,
        selections.map((s, i) => ({ menu_id: s.menu?.id || null, skipped: s.skipped, day_index: i })),
        false
      )
    }
  }

  const confirmWeek = async (weekId: number) => {
    const week = weeks.find(w => w.id === weekId)
    if (!week || !userId) return
    await saveWeekSelections(
      userId, weekId,
      week.selections.map((s, i) => ({ menu_id: s.menu?.id || null, skipped: s.skipped, day_index: i })),
      true
    )
    setWeeks(prev => prev.map(w => w.id === weekId
      ? { ...w, confirmed: true, expanded: false, editing: false }
      : w
    ))
  }

  const startEditing = (weekId: number) => {
    setWeeks(prev => prev.map(w => w.id === weekId
      ? { ...w, editing: true, expanded: true }
      : { ...w, expanded: false }
    ))
  }

  const cancelEditing = async (weekId: number) => {
    if (!userId) return
    const saved = await loadWeekSelections(userId)
    setWeeks(prev => prev.map(week => {
      if (week.id !== weekId) return week
      const weekRows = saved.filter((r: any) => r.week_offset === week.weekOffset)
      const selections = week.selections.map((s, i) => {
        const row = weekRows.find((r: any) => r.day_index === i)
        if (!row) return { ...s, menu: null, skipped: false }
        const menu = row.menu_id ? menus.find(m => m.id === row.menu_id) || null : null
        return { ...s, menu, skipped: row.skipped }
      })
      return { ...week, selections, editing: false, expanded: true }
    }))
  }

  const toggleExpand = (weekId: number) => {
    const week = weeks.find(w => w.id === weekId)
    if (!week) return
    if (weekId > 0 && !weeks[weekId - 1].confirmed) return
    if (week.editing) return
    setWeeks(prev => prev.map(w => w.id === weekId
      ? { ...w, expanded: !w.expanded }
      : { ...w, expanded: false }
    ))
  }

  const allSelections = weeks.flatMap(w => w.selections)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = "/login"
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <img src="/images/genie-logo.png" alt="Genie" style={{ height: 60, marginBottom: 16, opacity: 0.7 }}
            onError={e => { (e.target as HTMLImageElement).style.display = "none" }} />
          <p style={{ color: "var(--text-muted)", fontFamily: "DM Sans, sans-serif" }}>{t("loading")}</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)" }}>
      <header style={{
        background: "var(--green)", padding: "0 16px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 60, position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 2px 12px rgba(0,0,0,0.15)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img src="/images/genie-logo.png" alt="Genie"
            style={{ height: 32, objectFit: "contain" }}
            onError={e => { (e.target as HTMLImageElement).style.display = "none" }} />
          <span style={{ fontFamily: "Playfair Display, serif", color: "#fff", fontSize: 20, fontWeight: 700 }}>Genie</span>
        </div>

        <nav style={{ display: "flex", gap: 4 }} className="desktop-nav">
          {tabs.map((tab_label, i) => (
            <button key={i} onClick={() => setTab(i)} style={{
              background: tab === i ? "rgba(255,255,255,0.2)" : "transparent",
              border: tab === i ? "1px solid rgba(255,255,255,0.4)" : "1px solid transparent",
              color: "#fff", padding: "7px 14px", borderRadius: 999,
              cursor: "pointer", fontSize: 13, fontWeight: 500, transition: "all 0.15s", whiteSpace: "nowrap"
            }}>{tab_label}</button>
          ))}
        </nav>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <LanguageToggle />
          <button onClick={handleSignOut} style={{
            background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: 999, padding: "6px 12px", color: "#fff", fontSize: 12,
            cursor: "pointer", fontFamily: "DM Sans, sans-serif", whiteSpace: "nowrap"
          }}>{t("nav.signOut")}</button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: 8, padding: "6px 10px", color: "#fff", fontSize: 18,
              cursor: "pointer", display: "none"
            }} className="hamburger">☰</button>
        </div>
      </header>

      {mobileMenuOpen && (
        <div style={{
          position: "fixed", top: 60, left: 0, right: 0, zIndex: 99,
          background: "var(--green)", padding: "12px 16px",
          display: "flex", flexDirection: "column", gap: 4,
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
        }}>
          {tabs.map((tab_label, i) => (
            <button key={i} onClick={() => { setTab(i); setMobileMenuOpen(false) }} style={{
              background: tab === i ? "rgba(255,255,255,0.2)" : "transparent",
              border: "none", color: "#fff", padding: "12px 16px", borderRadius: 10,
              cursor: "pointer", fontSize: 15, fontWeight: tab === i ? 600 : 400, textAlign: "left"
            }}>{tab_label}</button>
          ))}
        </div>
      )}

      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 99,
        background: "var(--white)", borderTop: "1px solid var(--border)",
        display: "none", padding: "8px 0 12px"
      }} className="mobile-bottom-nav">
        {tabs.map((tab_label, i) => {
          const icons = ["📅", "🛒", "📊", "📖"]
          return (
            <button key={i} onClick={() => setTab(i)} style={{
              flex: 1, background: "none", border: "none", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "4px 0"
            }}>
              <span style={{ fontSize: 20 }}>{icons[i]}</span>
              <span style={{ fontSize: 10, fontWeight: tab === i ? 700 : 400, color: tab === i ? "var(--green)" : "var(--text-muted)" }}>{tab_label}</span>
            </button>
          )
        })}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: block !important; }
          .mobile-bottom-nav { display: flex !important; }
        }
      `}</style>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 16px 80px" }}>
        {tab === 0 && <WeeklyTab weeks={weeks} menus={menus} updateWeek={updateWeek} confirmWeek={confirmWeek} toggleExpand={toggleExpand} startEditing={startEditing} cancelEditing={cancelEditing} />}
        {tab === 1 && <IngredientsTab weeks={weeks} />}
        {tab === 2 && <NutritionTab selections={allSelections} />}
        {tab === 3 && <RecipesTab selections={weeks[0].selections} menus={menus} />}
      </main>
    </div>
  )
}

function WeeklyTab({ weeks, menus, updateWeek, confirmWeek, toggleExpand, startEditing, cancelEditing }: {
  weeks: Week[]
  menus: Menu[]
  updateWeek: (id: number, s: DaySelection[]) => void
  confirmWeek: (id: number) => void
  toggleExpand: (id: number) => void
  startEditing: (id: number) => void
  cancelEditing: (id: number) => void
}) {
  const { t } = useTranslation()

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 4 }}>{t("weekly.title")}</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>{t("weekly.subtitle")}</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {weeks.map((week, idx) => {
          const locked = idx > 0 && !weeks[idx - 1].confirmed
          const selectedCount = week.selections.filter(s => s.menu).length
          const skippedCount = week.selections.filter(s => s.skipped).length
          const isComplete = selectedCount + skippedCount === 7

          return (
            <div key={week.id} style={{
              background: "var(--white)", borderRadius: "var(--radius)",
              border: week.editing ? "2px solid var(--orange)" : week.confirmed ? "2px solid var(--green)" : "1px solid var(--border)",
              overflow: "hidden", opacity: locked ? 0.5 : 1, transition: "all 0.2s"
            }}>
              <div onClick={() => !locked && !week.editing && toggleExpand(week.id)} style={{
                padding: "16px 20px", display: "flex", alignItems: "center",
                justifyContent: "space-between",
                cursor: locked || week.editing ? "default" : "pointer",
                background: week.editing ? "#fff8f4" : week.confirmed ? "var(--green-pale)" : "var(--white)"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 999, flexShrink: 0,
                    background: week.editing ? "var(--orange)" : week.confirmed ? "var(--green)" : locked ? "var(--border)" : "var(--cream-dark)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 16, fontWeight: 700,
                    color: week.editing || week.confirmed ? "#fff" : "var(--text-muted)"
                  }}>
                    {week.editing ? "✏️" : week.confirmed ? "✓" : locked ? "🔒" : idx + 1}
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 1 }}>
                      {week.label}
                      <span style={{ fontWeight: 400, fontSize: 12, color: "var(--text-muted)", marginLeft: 8 }}>{week.dateRange}</span>
                    </p>
                    <p style={{ fontSize: 12, color: week.editing ? "var(--orange)" : "var(--text-muted)" }}>
                      {week.editing
                        ? t("weekly.editing")
                        : week.confirmed
                          ? t("weekly.confirmed")
                          : locked
                            ? t("weekly.completePrevious")
                            : `${selectedCount}/7 ${t("weekly.mealsSelected")}`}
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ display: "flex", gap: 3, flexWrap: "wrap", maxWidth: 80 }}>
                    {week.selections.map((s, i) => (
                      <div key={i} style={{
                        width: 8, height: 8, borderRadius: 999,
                        background: s.menu ? "var(--green)" : s.skipped ? "var(--orange)" : "var(--border)"
                      }} />
                    ))}
                  </div>
                  {!locked && !week.editing && (
                    <span style={{ fontSize: 16, color: "var(--text-muted)" }}>{week.expanded ? "▲" : "▼"}</span>
                  )}
                </div>
              </div>

              {week.expanded && week.confirmed && !week.editing && (
                <div style={{ borderTop: "1px solid var(--border)", padding: "16px" }}>
                  <WeekReadOnly week={week} onEdit={() => startEditing(week.id)} />
                </div>
              )}

              {week.editing && (
                <div style={{ borderTop: "2px solid var(--orange)", padding: "16px" }}>
                  <div style={{
                    background: "#fff8f4", border: "1px solid var(--orange)",
                    borderRadius: 10, padding: "10px 16px", marginBottom: 16,
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12
                  }}>
                    <p style={{ fontSize: 13, color: "var(--orange)", fontWeight: 600 }}>{t("weekly.editingBanner")}</p>
                    <button onClick={() => cancelEditing(week.id)} style={{
                      background: "transparent", border: "1px solid var(--orange)",
                      color: "var(--orange)", borderRadius: 999, padding: "5px 14px",
                      fontSize: 12, cursor: "pointer", fontWeight: 600, flexShrink: 0
                    }}>{t("weekly.cancel")}</button>
                  </div>
                  <WeekEditor week={week} menus={menus} onUpdate={(s) => updateWeek(week.id, s)} onConfirm={() => confirmWeek(week.id)} isComplete={isComplete} isEditing={true} />
                </div>
              )}

              {week.expanded && !week.confirmed && !week.editing && (
                <div style={{ borderTop: "1px solid var(--border)", padding: "16px" }}>
                  <WeekEditor week={week} menus={menus} onUpdate={(s) => updateWeek(week.id, s)} onConfirm={() => confirmWeek(week.id)} isComplete={isComplete} isEditing={false} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function WeekReadOnly({ week, onEdit }: { week: Week; onEdit: () => void }) {
  const { t } = useTranslation()
  const [selectedRecipe, setSelectedRecipe] = useState<Menu | null>(null)

  return (
    <div>
      {selectedRecipe && <RecipeModal menu={selectedRecipe} onClose={() => setSelectedRecipe(null)} />}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
          {week.selections.filter(s => s.menu).length} {t("weekly.meals")} · {week.selections.filter(s => s.skipped).length} {t("weekly.skippedDays")}
        </p>
        <button onClick={onEdit} style={{
          background: "var(--white)", border: "1.5px solid var(--green)",
          color: "var(--green)", borderRadius: 999, padding: "7px 18px",
          fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex",
          alignItems: "center", gap: 6, transition: "all 0.15s"
        }}>✏️ {t("weekly.editWeek")}</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {week.selections.map((s, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
            background: s.menu ? "var(--green-pale)" : s.skipped ? "#f5f0e8" : "var(--cream)",
            borderRadius: 10, border: "1px solid var(--border)"
          }}>
            <div style={{ minWidth: 60 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>{s.day.slice(0, 3)}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{s.date}</div>
            </div>
            {s.menu ? (
              <>
                <img src={s.menu.image_url} alt={s.menu.name} style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 1 }}>{s.menu.name}</p>
                  <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{s.menu.cook_time} {t("recipes.min")} · {s.menu.calories} {t("recipes.kcal")}</p>
                </div>
                <button onClick={() => setSelectedRecipe(s.menu)} style={{
                  background: "var(--green)", color: "#fff", border: "none",
                  borderRadius: 999, padding: "5px 12px", fontSize: 11,
                  fontWeight: 600, cursor: "pointer", flexShrink: 0
                }}>{t("weekly.view")}</button>
              </>
            ) : s.skipped ? (
              <div style={{ flex: 1 }}><p style={{ fontSize: 13, color: "var(--text-muted)", fontStyle: "italic" }}>{t("weekly.skipped")}</p></div>
            ) : (
              <div style={{ flex: 1 }}><p style={{ fontSize: 13, color: "var(--border)" }}>{t("weekly.notPlanned")}</p></div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function WeekEditor({ week, menus, onUpdate, onConfirm, isComplete, isEditing }: {
  week: Week; menus: Menu[]; onUpdate: (s: DaySelection[]) => void; onConfirm: () => void; isComplete: boolean; isEditing: boolean
}) {
  const { t } = useTranslation()
  const [activeDay, setActiveDay] = useState(0)
  const [filter, setFilter] = useState("all")

  const filterKeys = ["all", "quick", "vegetarian", "vegan", "chicken", "fish", "healthy"]
  const filtered = filter === "all" ? menus : menus.filter(m => m.tags.includes(filter))

  const selectMenu = (menu: Menu) => {
    const updated = [...week.selections]
    updated[activeDay] = { ...updated[activeDay], menu, skipped: false }
    onUpdate(updated)
  }
  const skipDay = () => {
    const updated = [...week.selections]
    updated[activeDay] = { ...updated[activeDay], menu: null, skipped: true }
    onUpdate(updated)
  }
  const clearDay = () => {
    const updated = [...week.selections]
    updated[activeDay] = { ...updated[activeDay], menu: null, skipped: false }
    onUpdate(updated)
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
        {week.selections.map((s, i) => (
          <button key={i} onClick={() => setActiveDay(i)} style={{
            minWidth: 72, padding: "8px 4px", borderRadius: 10, cursor: "pointer",
            border: activeDay === i ? "2px solid var(--green)" : "2px solid var(--border)",
            background: s.skipped ? "#f5f0e8" : s.menu ? "var(--green-pale)" : "var(--white)",
            transition: "all 0.15s", textAlign: "center", flexShrink: 0
          }}>
            <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>{s.day.slice(0, 3)}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text)", margin: "1px 0" }}>{s.date}</div>
            <div style={{ fontSize: 11, color: s.menu ? "var(--green)" : s.skipped ? "var(--orange)" : "var(--text-muted)" }}>
              {s.skipped ? t("weekly.skip").toLowerCase() : s.menu ? "ok" : "-"}
            </div>
          </button>
        ))}
      </div>

      <div style={{
        background: "var(--cream)", borderRadius: 10, padding: "12px 14px", marginBottom: 16,
        display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{ fontWeight: 700, fontSize: 15 }}>{week.selections[activeDay].day}</span>
          <span style={{ color: "var(--text-muted)", marginLeft: 6, fontSize: 13 }}>{week.selections[activeDay].date}</span>
          {week.selections[activeDay].menu && (
            <p style={{ color: "var(--green)", fontWeight: 600, marginTop: 2, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {week.selections[activeDay].menu!.name}
            </p>
          )}
          {week.selections[activeDay].skipped && <p style={{ color: "var(--text-muted)", marginTop: 2, fontSize: 13 }}>{t("weekly.skipped")}</p>}
          {!week.selections[activeDay].menu && !week.selections[activeDay].skipped && (
            <p style={{ color: "var(--text-muted)", marginTop: 2, fontSize: 13 }}>{t("weekly.pickRecipe")}</p>
          )}
        </div>
        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          <button onClick={skipDay} style={{ padding: "6px 12px", borderRadius: 999, border: "1px solid var(--border)", background: "var(--white)", cursor: "pointer", fontSize: 12, color: "var(--text-muted)" }}>
            {t("weekly.skip")}
          </button>
          {(week.selections[activeDay].menu || week.selections[activeDay].skipped) && (
            <button onClick={clearDay} style={{ padding: "6px 12px", borderRadius: 999, border: "1px solid var(--border)", background: "var(--white)", cursor: "pointer", fontSize: 12, color: "var(--text-muted)" }}>
              {t("weekly.clear")}
            </button>
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 14, overflowX: "auto", paddingBottom: 4 }}>
        {filterKeys.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "5px 12px", borderRadius: 999, cursor: "pointer", fontSize: 12,
            border: filter === f ? "none" : "1px solid var(--border)",
            background: filter === f ? "var(--orange)" : "var(--white)",
            color: filter === f ? "#fff" : "var(--text)",
            fontWeight: filter === f ? 600 : 400, textTransform: "capitalize", flexShrink: 0, whiteSpace: "nowrap"
          }}>{t(`filters.${f}`)}</button>
        ))}
      </div>

      {menus.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)" }}>{t("emptyStates.loadingRecipes")}</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)" }}>{t("emptyStates.noRecipesFilter")}</div>
      ) : (
        <div className="grid-auto" style={{ marginBottom: 20 }}>
          {filtered.map(menu => (
            <MenuCard key={menu.id} menu={menu}
              selected={week.selections[activeDay].menu?.id === menu.id}
              onSelect={() => selectMenu(menu)}
              onDeselect={clearDay}
            />
          ))}
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 14, borderTop: "1px solid var(--border)", gap: 12, flexWrap: "wrap" }}>
        <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
          {week.selections.filter(s => s.menu || s.skipped).length}/7 {t("weekly.daysPlanned")}{isComplete && ` — ${t("weekly.ready")}`}
        </p>
        <button onClick={onConfirm} disabled={!isComplete} style={{
          background: isComplete ? (isEditing ? "var(--orange)" : "var(--green)") : "var(--border)",
          color: isComplete ? "#fff" : "var(--text-muted)",
          border: "none", borderRadius: 999, padding: "11px 24px",
          fontSize: 14, fontWeight: 700, cursor: isComplete ? "pointer" : "not-allowed", transition: "all 0.2s"
        }}>
          {isEditing ? t("weekly.saveChanges") : t("weekly.confirmWeek")}
        </button>
      </div>
    </div>
  )
}

function IngredientsTab({ weeks }: { weeks: Week[] }) {
  const { t } = useTranslation()
  const [selectedWeekIds, setSelectedWeekIds] = useState<number[]>([0])

  const toggleWeek = (id: number) => {
    setSelectedWeekIds(prev => prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id].sort())
  }

  const selectedWeeks = weeks.filter(w => selectedWeekIds.includes(w.id))
  const selections = selectedWeeks.flatMap(w => w.selections)
  const selectedMenus = selections.filter(s => s.menu).map(s => s.menu!)

  const merged: Record<string, Ingredient & { days: string[]; weekLabel: string }> = {}
  selectedWeeks.forEach(week => {
    week.selections.forEach(s => {
      if (!s.menu) return
      s.menu.ingredients.forEach(ing => {
        const key = ing.name.toLowerCase()
        if (merged[key]) {
          merged[key].amount += ing.amount
          merged[key].days.push(`${s.day.slice(0, 3)} (${week.label.split(" ")[0]})`)
        } else {
          merged[key] = { ...ing, days: [`${s.day.slice(0, 3)} (${week.label.split(" ")[0]})`], weekLabel: week.label }
        }
      })
    })
  })

  const categories: Record<string, (Ingredient & { days: string[]; weekLabel: string })[]> = {}
  Object.values(merged).forEach(ing => {
    if (!categories[ing.category]) categories[ing.category] = []
    categories[ing.category].push(ing)
  })

  const catEmoji: Record<string, string> = { protein: "🥩", vegetable: "🥦", pantry: "🫙", dairy: "🧀", grain: "🌾" }
  const totalItems = Object.values(merged).length

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 4 }}>{t("ingredients.title")}</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
          {selectedWeekIds.length === 0
            ? t("ingredients.selectWeekPrompt")
            : `${selectedMenus.length} ${t("weekly.meals")} · ${totalItems} ${t("nav.ingredients").toLowerCase()}`}
        </p>
      </div>

      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 10 }}>{t("ingredients.selectWeeks")}</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {weeks.map(week => {
            const weekMenuCount = week.selections.filter(s => s.menu).length
            const isSelected = selectedWeekIds.includes(week.id)
            const hasData = weekMenuCount > 0
            return (
              <button key={week.id} onClick={() => toggleWeek(week.id)} disabled={!hasData} style={{
                padding: "10px 18px", borderRadius: 12, cursor: hasData ? "pointer" : "not-allowed",
                border: isSelected ? "2px solid var(--green)" : "2px solid var(--border)",
                background: isSelected ? "var(--green)" : "var(--white)",
                color: isSelected ? "#fff" : hasData ? "var(--text)" : "var(--text-muted)",
                opacity: hasData ? 1 : 0.5, transition: "all 0.15s", textAlign: "left", minWidth: 160
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: 4,
                    border: isSelected ? "none" : "2px solid var(--border)",
                    background: isSelected ? "rgba(255,255,255,0.3)" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                  }}>
                    {isSelected && <span style={{ fontSize: 12, color: "#fff", fontWeight: 700 }}>✓</span>}
                  </div>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{week.label}</span>
                </div>
                <div style={{ fontSize: 11, color: isSelected ? "rgba(255,255,255,0.8)" : "var(--text-muted)", paddingLeft: 26 }}>{week.dateRange}</div>
                <div style={{ fontSize: 11, color: isSelected ? "rgba(255,255,255,0.8)" : "var(--text-muted)", paddingLeft: 26, marginTop: 2 }}>
                  {hasData ? `${weekMenuCount} ${t("ingredients.mealsCount")}` : t("ingredients.noMealsYet")}
                </div>
              </button>
            )
          })}
        </div>

        {selectedWeekIds.length > 1 && (
          <div style={{ marginTop: 12, padding: "10px 16px", background: "var(--green-pale)", borderRadius: 10, border: "1px solid var(--green)", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16 }}>🛒</span>
            <span style={{ fontSize: 13, color: "var(--green)", fontWeight: 600 }}>
              {t("ingredients.combinedList", { count: selectedWeekIds.length })}
            </span>
          </div>
        )}
      </div>

      {selectedWeekIds.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
          <p style={{ color: "var(--text-muted)", fontSize: 15 }}>{t("emptyStates.shoppingCart")}</p>
        </div>
      ) : selectedMenus.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📅</div>
          <p style={{ color: "var(--text-muted)", fontSize: 15 }}>{t("emptyStates.noMealsPlanned")}</p>
        </div>
      ) : (
        <div className="grid-ingredients">
          {Object.entries(categories).map(([cat, items]) => (
            <div key={cat} style={{ background: "var(--white)", borderRadius: "var(--radius)", border: "1px solid var(--border)", overflow: "hidden" }}>
              <div style={{ background: "var(--green-pale)", padding: "12px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 18 }}>{catEmoji[cat] || "📦"}</span>
                <span style={{ fontWeight: 700, textTransform: "capitalize", fontSize: 15 }}>{t(`ingredients.categories.${cat}`)}</span>
                <span style={{ marginLeft: "auto", background: "var(--green)", color: "#fff", borderRadius: 999, padding: "2px 10px", fontSize: 12 }}>{items.length}</span>
              </div>
              {items.map(ing => (
                <div key={ing.name} style={{ padding: "10px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                  <div style={{ minWidth: 0 }}>
                    <span style={{ fontWeight: 500, fontSize: 14 }}>{ing.name}</span>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>{ing.days.join(", ")}</div>
                  </div>
                  <span style={{ background: "var(--cream-dark)", borderRadius: 8, padding: "3px 10px", fontSize: 12, fontWeight: 600, flexShrink: 0 }}>{ing.amount} {ing.unit}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function NutritionTab({ selections }: { selections: DaySelection[] }) {
  const { t } = useTranslation()
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
      <div style={{ textAlign: "center", padding: "60px 0" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>📊</div>
        <h2 style={{ fontSize: 22, marginBottom: 8 }}>{t("nutrition.noData")}</h2>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>{t("nutrition.noDataSubtitle")}</p>
      </div>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 4 }}>{t("nutrition.title")}</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>{t("nutrition.subtitle", { count: selectedDays.length })}</p>
      </div>
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[
          { label: t("nutrition.totalCalories"), value: totals.calories, unit: t("recipes.kcal"), color: "var(--orange)", emoji: "🔥" },
          { label: t("nutrition.avgPerDinner"), value: avgCal, unit: t("recipes.kcal"), color: "var(--green)", emoji: "📈" },
          { label: t("nutrition.totalProtein"), value: totals.protein, unit: "g", color: "#3b82f6", emoji: "💪" },
          { label: t("nutrition.totalCarbs"), value: totals.carbs, unit: "g", color: "#f59e0b", emoji: "🌾" },
        ].map(card => (
          <div key={card.label} style={{ background: "var(--white)", borderRadius: "var(--radius)", border: "1px solid var(--border)", padding: "16px" }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>{card.emoji}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: card.color }}>
              {card.value}<span style={{ fontSize: 12, fontWeight: 400, color: "var(--text-muted)", marginLeft: 3 }}>{card.unit}</span>
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 3 }}>{card.label}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "var(--white)", borderRadius: "var(--radius)", border: "1px solid var(--border)", overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", fontWeight: 700, fontSize: 16 }}>{t("nutrition.dayByDay")}</div>
        {selectedDays.map(s => {
          const m = s.menu!
          const maxCal = Math.max(...selectedDays.map(x => x.menu?.calories || 0))
          const barWidth = Math.round((m.calories / maxCal) * 100)
          return (
            <div key={s.day + s.date} style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <div>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{s.day.slice(0, 3)}</span>
                  <span style={{ color: "var(--text-muted)", fontSize: 12, marginLeft: 6 }}>{s.date}</span>
                  <p style={{ fontSize: 13, fontWeight: 500, marginTop: 2 }}>{m.name}</p>
                </div>
                <div style={{ fontWeight: 700, color: "var(--orange)", fontSize: 15, textAlign: "right", flexShrink: 0 }}>
                  {m.calories}<span style={{ fontSize: 11, fontWeight: 400 }}> {t("recipes.kcal")}</span>
                </div>
              </div>
              <div style={{ background: "var(--cream-dark)", borderRadius: 999, height: 6, overflow: "hidden", marginBottom: 4 }}>
                <div style={{ height: "100%", borderRadius: 999, width: barWidth + "%", background: "var(--green)", transition: "width 0.4s ease" }} />
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>P: {m.protein}g</span>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>C: {m.carbs}g</span>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>F: {m.fat}g</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function RecipesTab({ selections, menus }: { selections: DaySelection[], menus: Menu[] }) {
  const { t } = useTranslation()
  const [search, setSearch] = useState("")
  const [selectedRecipe, setSelectedRecipe] = useState<Menu | null>(null)
  const todayIndex = Math.min(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1, 6)
  const todaySelection = selections[todayIndex]

  const searchResults = search.length > 1
    ? menus.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.tags.some(tag => tag.includes(search.toLowerCase())) ||
        m.ingredients.some(i => i.name.toLowerCase().includes(search.toLowerCase()))
      )
    : []

  return (
    <div>
      {selectedRecipe && <RecipeModal menu={selectedRecipe} onClose={() => setSelectedRecipe(null)} />}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 4 }}>{t("recipes.title")}</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>{t("recipes.subtitle")}</p>
      </div>

      {todaySelection?.menu && (
        <div style={{
          background: "var(--green)", borderRadius: "var(--radius)", padding: "18px 20px",
          marginBottom: 24, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap"
        }}>
          <img src={todaySelection.menu.image_url} alt={todaySelection.menu.name}
            style={{ width: 70, height: 70, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>{t("recipes.tonight")}</p>
            <h2 style={{ color: "#fff", fontFamily: "Playfair Display, serif", fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{todaySelection.menu.name}</h2>
            <div style={{ display: "flex", gap: 12 }}>
              <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}>{todaySelection.menu.cook_time} {t("recipes.min")}</span>
              <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}>{todaySelection.menu.calories} {t("recipes.kcal")}</span>
            </div>
          </div>
          <button onClick={() => setSelectedRecipe(todaySelection.menu)} style={{
            background: "#fff", color: "var(--green)", border: "none",
            borderRadius: 999, padding: "10px 18px", fontWeight: 700, fontSize: 13, cursor: "pointer", flexShrink: 0
          }}>{t("recipes.viewRecipe")}</button>
        </div>
      )}

      <div style={{ marginBottom: 20 }}>
        <input type="text" placeholder={t("recipes.searchPlaceholder")}
          value={search} onChange={e => setSearch(e.target.value)}
          style={{
            width: "100%", padding: "12px 18px", borderRadius: 999,
            border: "2px solid var(--border)", fontSize: 15,
            background: "var(--white)", outline: "none",
            fontFamily: "DM Sans, sans-serif", color: "var(--text)"
          }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
        {(search.length > 1 ? searchResults : menus).map(menu => (
          <div key={menu.id} style={{
            background: "var(--white)", borderRadius: "var(--radius)", border: "1px solid var(--border)",
            overflow: "hidden", display: "flex", cursor: "pointer"
          }} onClick={() => setSelectedRecipe(menu)}>
            <img src={menu.image_url} alt={menu.name} style={{ width: 90, height: 90, objectFit: "cover", flexShrink: 0 }} />
            <div style={{ padding: "12px 14px", minWidth: 0 }}>
              <p style={{ fontFamily: "Playfair Display, serif", fontWeight: 600, fontSize: 14, marginBottom: 3 }}>{menu.name}</p>
              <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{menu.cook_time} {t("recipes.min")}</span>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{menu.calories} {t("recipes.kcal")}</span>
              </div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {menu.tags.slice(0, 2).map(tag => (
                  <span key={tag} style={{
                    background: "var(--green-pale)", color: "var(--green)",
                    fontSize: 10, padding: "2px 7px", borderRadius: 999, textTransform: "capitalize", fontWeight: 600
                  }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
