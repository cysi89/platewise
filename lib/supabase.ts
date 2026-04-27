import { createClient } from "@supabase/supabase-js"
import { Menu, Ingredient } from "./types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

import { SupabaseClient } from "@supabase/supabase-js"

declare global {
  var _supabaseClient: SupabaseClient | undefined
}

export const supabase = globalThis._supabaseClient ??
  (globalThis._supabaseClient = createClient(supabaseUrl, supabaseKey))

// ─── HELPERS ──────────────────────────────────────────────────────────────────

export function getMondayDate(weekOffset: number = 0): string {
  const now = new Date()
  const day = now.getDay()
  const diff = (day === 0 ? -6 : 1) - day
  const monday = new Date(now)
  monday.setDate(now.getDate() + diff + weekOffset * 7)
  monday.setHours(0, 0, 0, 0)
  // Return as YYYY-MM-DD string
  return monday.toISOString().split("T")[0]
}

// ─── RECIPE FETCHING ───────────────────────────────────────────────────────────

export async function fetchAllRecipes(lang: string = "en"): Promise<Menu[]> {
  const { data: recipes, error } = await supabase
    .from("recipes")
    .select("*")
    .order("id")

  if (error) { console.error("fetchAllRecipes error:", error); return [] }
  if (!recipes || recipes.length === 0) return []

  const ids = recipes.map(r => r.id)

  const { data: ingredients } = await supabase
    .from("recipe_ingredients")
    .select("*")
    .in("recipe_id", ids)

  const { data: steps } = await supabase
    .from("recipe_steps")
    .select("*")
    .in("recipe_id", ids)
    .order("step_number")

  return recipes.map(r => ({
    id: r.id,
    name: lang === "it" && r.name_it ? r.name_it : r.name,
    description: lang === "it" && r.description_it ? r.description_it : r.description,
    image_url: r.image_url,
    cook_time: r.cook_time,
    servings: r.servings,
    calories: r.calories,
    protein: r.protein,
    carbs: r.carbs,
    fat: r.fat,
    tags: r.tags || [],
    recipe_steps: (steps || [])
      .filter(s => s.recipe_id === r.id)
      .sort((a, b) => a.step_number - b.step_number)
      .map(s => lang === "it" && s.instruction_it ? s.instruction_it : s.instruction),
    ingredients: (ingredients || [])
      .filter(i => i.recipe_id === r.id)
      .map(i => ({
        name: i.name,
        amount: i.amount,
        unit: i.unit,
        category: i.category as Ingredient["category"]
      }))
  }))
}

// ─── WEEK SELECTIONS — stored by actual calendar date ─────────────────────────

export async function saveWeekSelections(
  userId: string,
  weekOffset: number,
  selections: { menu_id: string | null; skipped: boolean; day_index: number }[],
  confirmed: boolean
) {
  const weekStartDate = getMondayDate(weekOffset)

  const rows = selections.map(s => ({
    user_id: userId,
    week_offset: weekOffset,
    week_start_date: weekStartDate,
    day_index: s.day_index,
    menu_id: s.menu_id,
    skipped: s.skipped,
    confirmed,
    updated_at: new Date().toISOString(),
  }))

  const { error } = await supabase
    .from("weekly_selections")
    .upsert(rows, { onConflict: "user_id,week_start_date,day_index" })

  if (error) {
    // Fallback to old constraint name if new one not yet applied
    const { error: error2 } = await supabase
      .from("weekly_selections")
      .upsert(rows, { onConflict: "user_id,week_offset,day_index" })
    if (error2) console.error("saveWeekSelections error:", error2)
  }
}

export async function loadWeekSelections(userId: string) {
  // Load the 3 weeks we currently show (this week + next 2)
  const weekDates = [0, 1, 2].map(offset => getMondayDate(offset))

  // Try loading by week_start_date first (new system)
  const { data: byDate, error: errorByDate } = await supabase
    .from("weekly_selections")
    .select("*")
    .eq("user_id", userId)
    .in("week_start_date", weekDates)
    .order("week_start_date", { ascending: true })
    .order("day_index", { ascending: true })

  if (!errorByDate && byDate && byDate.length > 0) {
    // Map week_start_date back to current week_offset
    return byDate.map((row: any) => ({
      ...row,
      week_offset: weekDates.indexOf(row.week_start_date)
    }))
  }

  // Fallback: load by week_offset (old system — for existing data)
  const { data, error } = await supabase
    .from("weekly_selections")
    .select("*")
    .eq("user_id", userId)
    .in("week_offset", [0, 1, 2])
    .order("week_offset", { ascending: true })
    .order("day_index", { ascending: true })

  if (error) { console.error("loadWeekSelections error:", error); return [] }
  return data || []
}

// ─── CLEANUP OLD DATA ──────────────────────────────────────────────────────────

export async function cleanupOldSelections(userId: string) {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - 14)

  await supabase
    .from("weekly_selections")
    .delete()
    .eq("user_id", userId)
    .lt("updated_at", cutoff.toISOString())
}
