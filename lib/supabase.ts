import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function saveWeekSelections(
  userId: string,
  weekOffset: number,
  selections: { menu_id: string | null; skipped: boolean; day_index: number }[],
  confirmed: boolean
) {
  const rows = selections.map((s, i) => ({
    user_id: userId,
    week_offset: weekOffset,
    day_index: i,
    menu_id: s.menu_id,
    skipped: s.skipped,
    confirmed,
    updated_at: new Date().toISOString(),
  }))

  const { error } = await supabase
    .from("weekly_selections")
    .upsert(rows, { onConflict: "user_id,week_offset,day_index" })

  if (error) console.error("Save error:", error)
}

export async function loadWeekSelections(userId: string) {
  const { data, error } = await supabase
    .from("weekly_selections")
    .select("*")
    .eq("user_id", userId)
    .order("week_offset", { ascending: true })
    .order("day_index", { ascending: true })

  if (error) console.error("Load error:", error)
  return data || []
}