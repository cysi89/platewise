import { createClient } from "@supabase/supabase-js"
import { Menu, Ingredient } from "./types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// ─── RECIPES ──────────────────────────────────────────────────────────────────

export async function fetchAllRecipes(): Promise<Menu[]> {
  const { data: recipes, error: recipeError } = await supabase
    .from("recipes")
    .select("*")
    .order("id")

  if (recipeError) { console.error("fetchAllRecipes error:", recipeError); return [] }

  const { data: ingredients, error: ingError } = await supabase
    .from("recipe_ingredients")
    .select("*")

  if (ingError) { console.error("fetchAllRecipes ingredients error:", ingError); return [] }

  const { data: steps, error: stepsError } = await supabase
    .from("recipe_steps")
    .select("*")
    .order("step_number")

  if (stepsError) { console.error("fetchAllRecipes steps error:", stepsError); return [] }

  return recipes.map((r: any) => ({
    id: r.id,
    name: r.name,
    description: r.description,
    image_url: r.image_url,
    cook_time: r.cook_time,
    servings: r.servings,
    calories: r.calories,
    protein: r.protein,
    carbs: r.carbs,
    fat: r.fat,
    tags: r.tags || [],
    is_vegetarian: r.is_vegetarian,
    is_vegan: r.is_vegan,
    is_gluten_free: r.is_gluten_free,
    recipe_steps: steps
      .filter((s: any) => s.recipe_id === r.id)
      .sort((a: any, b: any) => a.step_number - b.step_number)
      .map((s: any) => s.instruction),
    ingredients: ingredients
      .filter((i: any) => i.recipe_id === r.id)
      .map((i: any) => ({
        name: i.name,
        amount: i.amount,
        unit: i.unit,
        category: i.category,
      })),
  }))
}

// ─── WEEK SELECTIONS ──────────────────────────────────────────────────────────

export async function saveWeekSelections(
  userId: string,
  weekOffset: number,
  selections: { menu_id: string | null; skipped: boolean; day_index: number }[],
  confirmed: boolean
) {
  const rows = selections.map((s) => ({
    user_id: userId,
    week_offset: weekOffset,
    day_index: s.day_index,
    menu_id: s.menu_id,
    skipped: s.skipped,
    confirmed,
    updated_at: new Date().toISOString(),
  }))

  const { error } = await supabase
    .from("weekly_selections")
    .upsert(rows, { onConflict: "user_id,week_offset,day_index" })

  if (error) console.error("saveWeekSelections error:", error)
}

export async function loadWeekSelections(userId: string) {
  const { data, error } = await supabase
    .from("weekly_selections")
    .select("*")
    .eq("user_id", userId)
    .order("week_offset", { ascending: true })
    .order("day_index", { ascending: true })

  if (error) { console.error("loadWeekSelections error:", error); return [] }
  return data || []
}
export async function cleanupOldSelections(userId: string) {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - 14)

  await supabase
    .from("weekly_selections")
    .delete()
    .eq("user_id", userId)
    .lt("updated_at", cutoff.toISOString())
}
