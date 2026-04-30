import { createClient, SupabaseClient } from "@supabase/supabase-js"
import { Menu, Ingredient } from "./types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

declare global {
  var _supabaseClient: SupabaseClient | undefined
}

export const supabase = globalThis._supabaseClient ??
  (globalThis._supabaseClient = createClient(supabaseUrl, supabaseKey))

// ─── HELPERS ──────────────────────────────────────────────────────────────────

export function getMondayDate(weekOffset: number = 0): string {
  const now = new Date()
  const day = now.getDay() // 0=Sun, 1=Mon, 2=Tue ... 6=Sat
  const daysToMonday = day === 0 ? 6 : day - 1 // days to subtract to reach Monday
  const monday = new Date(now)
  monday.setDate(now.getDate() - daysToMonday + weekOffset * 7)
  monday.setHours(0, 0, 0, 0)
  return monday.toISOString().split("T")[0] // YYYY-MM-DD
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

  if (error) console.error("saveWeekSelections error:", error)
}

export async function loadWeekSelections(userId: string) {
  const weekDates = [0, 1, 2].map(offset => getMondayDate(offset))

  const { data, error } = await supabase
    .from("weekly_selections")
    .select("*")
    .eq("user_id", userId)
    .in("week_start_date", weekDates)
    .order("week_start_date", { ascending: true })
    .order("day_index", { ascending: true })

  if (error) { console.error("loadWeekSelections error:", error); return [] }
  if (!data || data.length === 0) return []

  // Map week_start_date back to current week_offset position
  return data.map((row: any) => ({
    ...row,
    week_offset: weekDates.indexOf(row.week_start_date)
  }))
}

// ─── CLEANUP OLD DATA ──────────────────────────────────────────────────────────

export async function cleanupOldSelections(userId: string) {
  // Delete anything older than 21 days (3 full weeks back)
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - 21)

  await supabase
    .from("weekly_selections")
    .delete()
    .eq("user_id", userId)
    .lt("updated_at", cutoff.toISOString())
}