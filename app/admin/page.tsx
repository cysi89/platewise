"use client"
import { useState, useEffect, useRef } from "react"
import { supabase } from "@/lib/supabase"

const ADMIN_PASSWORD = "genie2025admin"

type Recipe = {
  id: string
  name: string
  name_it: string
  description: string
  description_it: string
  image_url: string
  cook_time: number
  servings: number
  calories: number
  protein: number
  carbs: number
  fat: number
  tags: string[]
  is_vegetarian: boolean
  is_vegan: boolean
  is_gluten_free: boolean
  diet_types: string[]
}

type Ingredient = {
  id?: string
  name: string
  amount: number
  unit: string
  category: string
}

type Step = {
  id?: string
  step_number: number
  instruction: string
  instruction_it: string
}

const emptyRecipe: Omit<Recipe, "id"> = {
  name: "", name_it: "", description: "", description_it: "",
  image_url: "", cook_time: 30, servings: 2,
  calories: 0, protein: 0, carbs: 0, fat: 0,
  tags: [], is_vegetarian: false, is_vegan: false, is_gluten_free: false,
  diet_types: ["omnivore"]
}

// ── QUICK ADD TEMPLATE ────────────────────────────────────────────────────────
const QUICK_ADD_TEMPLATE = `NAME_EN: 
NAME_IT: 
DESC_EN: 
DESC_IT: 
COOK_TIME: 
SERVINGS: 2
CALORIES: 
PROTEIN: 
CARBS: 
FAT: 
TAGS: 
DIET_TYPES: omnivore
IS_VEGETARIAN: false
IS_VEGAN: false
IS_GLUTEN_FREE: false
IMAGE_URL: 

INGREDIENTS:
name | amount | unit | category
 |  | g | protein
 |  | g | vegetable
 |  | g | pantry

STEPS_EN:
1. 
2. 
3. 
4. 
5. 

STEPS_IT:
1. 
2. 
3. 
4. 
5. `

function parseQuickAdd(text: string): { recipe: Omit<Recipe,"id">, ingredients: Ingredient[], steps: Step[], errors: string[] } {
  const errors: string[] = []
  const lines = text.split("\n").map(l => l.trim())

  const get = (key: string) => {
    const line = lines.find(l => l.startsWith(key + ":"))
    return line ? line.slice(key.length + 1).trim() : ""
  }

  const recipe: Omit<Recipe,"id"> = {
    name: get("NAME_EN"),
    name_it: get("NAME_IT"),
    description: get("DESC_EN"),
    description_it: get("DESC_IT"),
    image_url: get("IMAGE_URL"),
    cook_time: parseInt(get("COOK_TIME")) || 30,
    servings: parseInt(get("SERVINGS")) || 2,
    calories: parseInt(get("CALORIES")) || 0,
    protein: parseInt(get("PROTEIN")) || 0,
    carbs: parseInt(get("CARBS")) || 0,
    fat: parseInt(get("FAT")) || 0,
    tags: get("TAGS").split(",").map(t => t.trim()).filter(Boolean),
    is_vegetarian: get("IS_VEGETARIAN") === "true",
    is_vegan: get("IS_VEGAN") === "true",
    is_gluten_free: get("IS_GLUTEN_FREE") === "true",
    diet_types: get("DIET_TYPES").split(",").map(t => t.trim()).filter(Boolean),
  }

  if (!recipe.name) errors.push("NAME_EN is required")
  if (!recipe.calories) errors.push("CALORIES is required")

  // Parse ingredients
  const ingStart = lines.findIndex(l => l === "INGREDIENTS:")
  const stepsEnStart = lines.findIndex(l => l === "STEPS_EN:")
  const stepsItStart = lines.findIndex(l => l === "STEPS_IT:")

  const ingredients: Ingredient[] = []
  if (ingStart >= 0) {
    const ingEnd = stepsEnStart > ingStart ? stepsEnStart : lines.length
    for (let i = ingStart + 2; i < ingEnd; i++) {
      const parts = lines[i].split("|").map(p => p.trim())
      if (parts.length >= 3 && parts[0]) {
        ingredients.push({
          name: parts[0],
          amount: parseFloat(parts[1]) || 0,
          unit: parts[2] || "g",
          category: parts[3] || "pantry"
        })
      }
    }
  }

  // Parse EN steps
  const stepsEn: string[] = []
  if (stepsEnStart >= 0) {
    const end = stepsItStart > stepsEnStart ? stepsItStart : lines.length
    for (let i = stepsEnStart + 1; i < end; i++) {
      const match = lines[i].match(/^\d+\.\s*(.+)/)
      if (match && match[1].trim()) stepsEn.push(match[1].trim())
    }
  }

  // Parse IT steps
  const stepsIt: string[] = []
  if (stepsItStart >= 0) {
    for (let i = stepsItStart + 1; i < lines.length; i++) {
      const match = lines[i].match(/^\d+\.\s*(.+)/)
      if (match && match[1].trim()) stepsIt.push(match[1].trim())
    }
  }

  const steps: Step[] = stepsEn.map((instruction, i) => ({
    step_number: i + 1,
    instruction,
    instruction_it: stepsIt[i] || ""
  }))

  return { recipe, ingredients, steps, errors }
}

function generateGeminiPrompt(recipe: Omit<Recipe,"id">): string {
  if (!recipe.name) return ""
  const isVeg = recipe.is_vegan ? "vegan " : recipe.is_vegetarian ? "vegetarian " : ""
  const tags = recipe.tags.slice(0, 3).join(", ")
  return `Professional food photography, overhead shot, ${isVeg}${recipe.name.toLowerCase()}, ${recipe.description ? recipe.description.toLowerCase().slice(0, 80) + ", " : ""}beautifully plated, styled on a wooden farmhouse table, warm Italian kitchen light, shallow depth of field, appetising and fresh${tags ? ", " + tags : ""}`
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState("")
  const [pwError, setPwError] = useState(false)
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)
  const [view, setView] = useState<"list" | "edit" | "new" | "quick">("list")
  const [selected, setSelected] = useState<Recipe | null>(null)
  const [form, setForm] = useState<Omit<Recipe, "id">>(emptyRecipe)
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [steps, setSteps] = useState<Step[]>([])
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState("")
  const [uploadingImage, setUploadingImage] = useState(false)
  const [tagInput, setTagInput] = useState("")
  const [quickText, setQuickText] = useState(QUICK_ADD_TEMPLATE)
  const [quickParsed, setQuickParsed] = useState<{recipe: Omit<Recipe,"id">, ingredients: Ingredient[], steps: Step[], errors: string[]} | null>(null)
  const [quickSaving, setQuickSaving] = useState(false)
  const [quickMsg, setQuickMsg] = useState("")
  const [copiedPrompt, setCopiedPrompt] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const login = () => {
    if (pw === ADMIN_PASSWORD) { setAuthed(true); setPwError(false) }
    else { setPwError(true) }
  }

  const loadRecipes = async () => {
    setLoading(true)
    const { data } = await supabase.from("recipes").select("*").order("id")
    setRecipes(data || [])
    setLoading(false)
  }

  useEffect(() => { if (authed) loadRecipes() }, [authed])

  const loadRecipeDetails = async (recipe: Recipe) => {
    const { data: ings } = await supabase.from("recipe_ingredients").select("*").eq("recipe_id", recipe.id)
    const { data: stps } = await supabase.from("recipe_steps").select("*").eq("recipe_id", recipe.id).order("step_number")
    setIngredients(ings || [])
    setSteps(stps || [])
    setSelected(recipe)
    setForm({ ...recipe })
    setImagePreview(recipe.image_url || "")
    setView("edit")
  }

  const startNew = () => {
    setSelected(null)
    setForm({ ...emptyRecipe })
    setIngredients([{ name: "", amount: 0, unit: "g", category: "protein" }])
    setSteps([{ step_number: 1, instruction: "", instruction_it: "" }])
    setImagePreview("")
    setImageFile(null)
    setView("new")
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const uploadImage = async (recipeId: string): Promise<string> => {
    if (!imageFile) return form.image_url
    setUploadingImage(true)
    try {
      const ext = imageFile.name.split(".").pop()
      const path = `dish-${recipeId}-${Date.now()}.${ext}`
      const { error } = await supabase.storage.from("recipe-images").upload(path, imageFile, { upsert: true })
      if (error) return `/images/${path}`
      const { data } = supabase.storage.from("recipe-images").getPublicUrl(path)
      return data.publicUrl
    } finally {
      setUploadingImage(false)
    }
  }

  const addIngredient = () => setIngredients(prev => [...prev, { name: "", amount: 0, unit: "g", category: "protein" }])
  const removeIngredient = (i: number) => setIngredients(prev => prev.filter((_, idx) => idx !== i))
  const updateIngredient = (i: number, field: string, value: any) => {
    setIngredients(prev => prev.map((ing, idx) => idx === i ? { ...ing, [field]: value } : ing))
  }
  const addStep = () => setSteps(prev => [...prev, { step_number: prev.length + 1, instruction: "", instruction_it: "" }])
  const removeStep = (i: number) => setSteps(prev => prev.filter((_, idx) => idx !== i).map((s, idx) => ({ ...s, step_number: idx + 1 })))
  const updateStep = (i: number, field: string, value: string) => {
    setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s))
  }
  const addTag = () => {
    if (!tagInput.trim()) return
    setForm(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim().toLowerCase()] }))
    setTagInput("")
  }
  const removeTag = (tag: string) => setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))
  const toggleDietType = (type: string) => {
    setForm(prev => ({
      ...prev,
      diet_types: prev.diet_types.includes(type) ? prev.diet_types.filter(t => t !== type) : [...prev.diet_types, type]
    }))
  }

  const saveRecipe = async (recipeForm: Omit<Recipe,"id">, ings: Ingredient[], stps: Step[], recipeId?: string, imgFile?: File | null, currentImageUrl?: string) => {
    let id = recipeId
    if (!id) {
      const { data: existing } = await supabase.from("recipes").select("id").order("id", { ascending: false }).limit(1)
      const lastId = existing?.[0]?.id ? parseInt(existing[0].id) : 0
      id = String(lastId + 1)
    }

    let imageUrl = recipeForm.image_url || currentImageUrl || ""
    if (imgFile) {
      setUploadingImage(true)
      try {
        const ext = imgFile.name.split(".").pop()
        const path = `dish-${id}-${Date.now()}.${ext}`
        const { error } = await supabase.storage.from("recipe-images").upload(path, imgFile, { upsert: true })
        if (!error) {
          const { data } = supabase.storage.from("recipe-images").getPublicUrl(path)
          imageUrl = data.publicUrl
        } else {
          imageUrl = `/images/dish-${id}-${recipeForm.name.toLowerCase().replace(/\s+/g, "-")}.png`
        }
      } finally {
        setUploadingImage(false)
      }
    }

    const recipeData = { ...recipeForm, image_url: imageUrl }

    if (recipeId) {
      await supabase.from("recipes").update(recipeData).eq("id", id)
    } else {
      await supabase.from("recipes").insert({ id, ...recipeData })
    }

    await supabase.from("recipe_ingredients").delete().eq("recipe_id", id)
    await supabase.from("recipe_steps").delete().eq("recipe_id", id)

    const cleanIngs = ings.filter(i => i.name.trim()).map(({ id: _, ...rest }) => ({ ...rest, recipe_id: id }))
    if (cleanIngs.length > 0) await supabase.from("recipe_ingredients").insert(cleanIngs)

    const cleanStps = stps.filter(s => s.instruction.trim()).map(({ id: _, ...rest }) => ({ ...rest, recipe_id: id }))
    if (cleanStps.length > 0) await supabase.from("recipe_steps").insert(cleanStps)

    return id
  }

  const save = async () => {
    setSaving(true); setSaveMsg("")
    try {
      await saveRecipe(form, ingredients, steps, selected?.id, imageFile, selected?.image_url)
      setSaveMsg("✓ Saved!")
      await loadRecipes()
      setTimeout(() => setSaveMsg(""), 3000)
    } catch (err: any) {
      setSaveMsg("✗ " + err.message)
    } finally {
      setSaving(false) }
  }

  const quickPreview = () => {
    const result = parseQuickAdd(quickText)
    setQuickParsed(result)
  }

  const quickSave = async () => {
    if (!quickParsed || quickParsed.errors.length > 0) return
    setQuickSaving(true); setQuickMsg("")
    try {
      const id = await saveRecipe(quickParsed.recipe, quickParsed.ingredients, quickParsed.steps)
      setQuickMsg(`✓ Recipe #${id} saved! Image file should be named: dish-${id}-${quickParsed.recipe.name.toLowerCase().replace(/\s+/g, "-")}.png`)
      setQuickText(QUICK_ADD_TEMPLATE)
      setQuickParsed(null)
      await loadRecipes()
    } catch (err: any) {
      setQuickMsg("✗ " + err.message)
    } finally {
      setQuickSaving(false)
    }
  }

  const copyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt)
    setCopiedPrompt(true)
    setTimeout(() => setCopiedPrompt(false), 2000)
  }

  const deleteRecipe = async (id: string) => {
    if (!confirm(`Delete recipe #${id}? This cannot be undone.`)) return
    await supabase.from("recipe_ingredients").delete().eq("recipe_id", id)
    await supabase.from("recipe_steps").delete().eq("recipe_id", id)
    await supabase.from("recipes").delete().eq("id", id)
    await loadRecipes()
    setView("list")
  }

  // ── STYLES ───────────────────────────────────────────────────────────────────
  const s = {
    label: { fontSize: 12, fontWeight: 700, color: "#555", display: "block" as const, marginBottom: 4, textTransform: "uppercase" as const, letterSpacing: "0.05em" },
    input: { width: "100%", padding: "9px 12px", borderRadius: 8, border: "1.5px solid #ddd", fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" as const },
    textarea: { width: "100%", padding: "9px 12px", borderRadius: 8, border: "1.5px solid #ddd", fontSize: 14, fontFamily: "inherit", outline: "none", resize: "vertical" as const, minHeight: 80, boxSizing: "border-box" as const },
    select: { padding: "9px 12px", borderRadius: 8, border: "1.5px solid #ddd", fontSize: 14, fontFamily: "inherit", outline: "none", background: "#fff" },
    btn: { padding: "9px 18px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "inherit" },
    card: { background: "#fff", borderRadius: 12, border: "1px solid #e5e5e5", padding: "20px 24px", marginBottom: 16 },
    green: { background: "#2d5a27", color: "#fff" },
    orange: { background: "#e86c2f", color: "#fff" },
    red: { background: "#dc2626", color: "#fff" },
    grey: { background: "#f0f0f0", color: "#333" },
    blue: { background: "#1d4ed8", color: "#fff" },
    grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
    sectionTitle: { fontSize: 16, fontWeight: 700, marginBottom: 16, color: "#2d5a27", borderBottom: "2px solid #eef4ed", paddingBottom: 8 },
    flag: { fontSize: 18, marginRight: 6 },
  }

  // ── NAV HEADER ───────────────────────────────────────────────────────────────
  const Header = ({ subtitle }: { subtitle: string }) => (
    <div style={{ background: "#2d5a27", padding: "0 32px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky" as const, top: 0, zIndex: 100 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ color: "#fff", fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700 }}>🧞 Genie Admin</span>
        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>{subtitle}</span>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {view !== "list" && (
          <button onClick={() => { setView("list"); setSaveMsg(""); setQuickMsg(""); setQuickParsed(null) }}
            style={{ ...s.btn, ...s.grey, fontSize: 13 }}>← Back</button>
        )}
        {view === "list" && (
          <>
            <button onClick={() => setView("quick")} style={{ ...s.btn, background: "#e86c2f", color: "#fff", fontSize: 13 }}>⚡ Quick Add</button>
            <button onClick={startNew} style={{ ...s.btn, background: "rgba(255,255,255,0.2)", color: "#fff", fontSize: 13 }}>+ Manual Add</button>
            <a href="/weekly" style={{ ...s.btn, background: "transparent", color: "rgba(255,255,255,0.6)", fontSize: 13, textDecoration: "none", display: "inline-flex", alignItems: "center" }}>← App</a>
          </>
        )}
        {(view === "edit" || view === "new") && (
          <>
            {saveMsg && <span style={{ color: saveMsg.startsWith("✓") ? "#7dff7d" : "#ff7d7d", fontSize: 13, fontWeight: 600, alignSelf: "center" }}>{saveMsg}</span>}
            <button onClick={save} disabled={saving} style={{ ...s.btn, ...s.green, opacity: saving ? 0.7 : 1 }}>
              {saving ? "Saving..." : (view === "new" ? "Create ✓" : "Save ✓")}
            </button>
          </>
        )}
      </div>
    </div>
  )

  // ── LOGIN ─────────────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: "48px 40px", width: 360, boxShadow: "0 8px 40px rgba(0,0,0,0.1)" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>🧞</div>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: 28, color: "#2d5a27", marginBottom: 4 }}>Genie Admin</h1>
            <p style={{ fontSize: 14, color: "#888" }}>Recipe management portal</p>
          </div>
          <label style={s.label}>Password</label>
          <input type="password" value={pw} onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === "Enter" && login()} placeholder="Enter admin password"
            style={{ ...s.input, marginBottom: 12, border: pwError ? "1.5px solid #dc2626" : "1.5px solid #ddd" }} />
          {pwError && <p style={{ color: "#dc2626", fontSize: 13, marginBottom: 12 }}>Incorrect password</p>}
          <button onClick={login} style={{ ...s.btn, ...s.green, width: "100%", padding: "12px" }}>Sign in →</button>
        </div>
      </div>
    )
  }

  // ── QUICK ADD VIEW ────────────────────────────────────────────────────────────
  if (view === "quick") {
    const geminiPrompt = quickParsed ? generateGeminiPrompt(quickParsed.recipe) : ""
    const nextId = recipes.length > 0 ? Math.max(...recipes.map(r => parseInt(r.id) || 0)) + 1 : 1

    return (
      <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
        <Header subtitle="⚡ Quick Add" />
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>

          {/* Instructions */}
          <div style={{ background: "#fff8f0", border: "1px solid #e86c2f", borderRadius: 12, padding: "16px 20px", marginBottom: 24, display: "flex", gap: 12, alignItems: "flex-start" }}>
            <span style={{ fontSize: 24, flexShrink: 0 }}>⚡</span>
            <div>
              <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 6, color: "#e86c2f" }}>Quick Add — paste all recipe details in one go</p>
              <p style={{ fontSize: 14, color: "#555", lineHeight: 1.6 }}>
                Fill in the template below, click <strong>Preview</strong> to check it parsed correctly, then <strong>Save to database</strong>. The Gemini image prompt is generated automatically — copy it and paste into <a href="https://gemini.google.com" target="_blank" style={{ color: "#2d5a27" }}>gemini.google.com</a> to create your dish photo.
              </p>
              <p style={{ fontSize: 13, color: "#888", marginTop: 6 }}>
                Next recipe will be <strong>#{nextId}</strong> — image file should be named <strong>dish-{nextId}-name-of-dish.png</strong>
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: 24 }}>

            {/* LEFT — paste area */}
            <div>
              <div style={s.card}>
                <p style={s.sectionTitle}>📋 Recipe Template — fill in all fields</p>
                <p style={{ fontSize: 12, color: "#888", marginBottom: 12 }}>
                  Keep the format exactly as shown. For ingredients use: <code style={{ background: "#f5f5f5", padding: "1px 6px", borderRadius: 4 }}>name | amount | unit | category</code>
                </p>
                <textarea
                  value={quickText}
                  onChange={e => { setQuickText(e.target.value); setQuickParsed(null); setQuickMsg("") }}
                  style={{
                    ...s.textarea, minHeight: 600, fontFamily: "monospace", fontSize: 13,
                    lineHeight: 1.6, background: "#fafafa", border: "2px solid #e5e5e5"
                  }}
                />
                <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                  <button onClick={quickPreview} style={{ ...s.btn, ...s.blue, flex: 1 }}>
                    👁 Preview parsed data
                  </button>
                  <button onClick={() => { setQuickText(QUICK_ADD_TEMPLATE); setQuickParsed(null); setQuickMsg("") }}
                    style={{ ...s.btn, ...s.grey }}>
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT — preview + actions */}
            <div>

              {/* Gemini prompt box — always visible once name is typed */}
              {quickParsed && quickParsed.recipe.name && (
                <div style={{ background: "#1a1a2e", borderRadius: 12, padding: "18px 20px", marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <p style={{ color: "#a78bfa", fontWeight: 700, fontSize: 14 }}>🎨 Gemini Image Prompt</p>
                    <button onClick={() => copyPrompt(geminiPrompt)} style={{
                      ...s.btn, background: copiedPrompt ? "#16a34a" : "#7c3aed", color: "#fff",
                      padding: "6px 14px", fontSize: 12
                    }}>
                      {copiedPrompt ? "✓ Copied!" : "Copy prompt"}
                    </button>
                  </div>
                  <p style={{ color: "#e2e8f0", fontSize: 13, lineHeight: 1.6, fontFamily: "monospace", wordBreak: "break-word" as const }}>
                    {geminiPrompt}
                  </p>
                  <a href="https://gemini.google.com" target="_blank"
                    style={{ display: "inline-block", marginTop: 10, color: "#a78bfa", fontSize: 12, textDecoration: "none" }}>
                    → Open Gemini to generate image ↗
                  </a>
                  <p style={{ color: "#666", fontSize: 11, marginTop: 6 }}>
                    Image filename: <strong style={{ color: "#a78bfa" }}>dish-{nextId}-{quickParsed.recipe.name.toLowerCase().replace(/\s+/g, "-")}.png</strong>
                  </p>
                </div>
              )}

              {/* Validation errors */}
              {quickParsed && quickParsed.errors.length > 0 && (
                <div style={{ background: "#fef2f2", border: "1px solid #dc2626", borderRadius: 12, padding: "14px 18px", marginBottom: 16 }}>
                  <p style={{ fontWeight: 700, color: "#dc2626", marginBottom: 8, fontSize: 14 }}>⚠ Fix these before saving:</p>
                  {quickParsed.errors.map((e, i) => <p key={i} style={{ color: "#dc2626", fontSize: 13 }}>• {e}</p>)}
                </div>
              )}

              {/* Parsed preview */}
              {quickParsed && quickParsed.errors.length === 0 && (
                <div style={s.card}>
                  <p style={s.sectionTitle}>✅ Preview — looks good?</p>

                  {/* Recipe basics */}
                  <div style={{ marginBottom: 16 }}>
                    <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 2 }}>{quickParsed.recipe.name}</p>
                    {quickParsed.recipe.name_it && <p style={{ fontSize: 13, color: "#888", marginBottom: 6 }}>🇮🇹 {quickParsed.recipe.name_it}</p>}
                    <p style={{ fontSize: 13, color: "#555", lineHeight: 1.5, marginBottom: 8 }}>{quickParsed.recipe.description}</p>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                      {[
                        { label: "⏱", val: `${quickParsed.recipe.cook_time}min` },
                        { label: "🔥", val: `${quickParsed.recipe.calories}kcal` },
                        { label: "💪", val: `${quickParsed.recipe.protein}g protein` },
                        { label: "🌾", val: `${quickParsed.recipe.carbs}g carbs` },
                      ].map(item => (
                        <span key={item.label} style={{ fontSize: 12, color: "#555", background: "#f5f5f5", padding: "3px 8px", borderRadius: 6 }}>{item.label} {item.val}</span>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  {quickParsed.recipe.tags.length > 0 && (
                    <div style={{ marginBottom: 14 }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: "#999", textTransform: "uppercase", marginBottom: 6 }}>Tags</p>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {quickParsed.recipe.tags.map(tag => (
                          <span key={tag} style={{ background: "#eef4ed", color: "#2d5a27", borderRadius: 999, padding: "2px 10px", fontSize: 12, fontWeight: 600 }}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Ingredients */}
                  <div style={{ marginBottom: 14 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "#999", textTransform: "uppercase", marginBottom: 6 }}>
                      Ingredients ({quickParsed.ingredients.length})
                    </p>
                    {quickParsed.ingredients.map((ing, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 0", borderBottom: "1px solid #f5f5f5" }}>
                        <span>{ing.name}</span>
                        <span style={{ color: "#888" }}>{ing.amount} {ing.unit} <span style={{ color: "#bbb" }}>({ing.category})</span></span>
                      </div>
                    ))}
                  </div>

                  {/* Steps */}
                  <div style={{ marginBottom: 16 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "#999", textTransform: "uppercase", marginBottom: 6 }}>
                      Steps ({quickParsed.steps.length})
                    </p>
                    {quickParsed.steps.map(step => (
                      <div key={step.step_number} style={{ marginBottom: 8 }}>
                        <p style={{ fontSize: 12, fontWeight: 700, color: "#2d5a27" }}>Step {step.step_number}</p>
                        <p style={{ fontSize: 12, color: "#555" }}>🇬🇧 {step.instruction}</p>
                        {step.instruction_it && <p style={{ fontSize: 12, color: "#888" }}>🇮🇹 {step.instruction_it}</p>}
                      </div>
                    ))}
                  </div>

                  {/* Save button */}
                  <button onClick={quickSave} disabled={quickSaving}
                    style={{ ...s.btn, ...s.green, width: "100%", padding: "13px", fontSize: 15, opacity: quickSaving ? 0.7 : 1 }}>
                    {quickSaving ? "Saving to database..." : "✓ Save to database"}
                  </button>
                  {quickMsg && (
                    <p style={{ fontSize: 13, marginTop: 10, color: quickMsg.startsWith("✓") ? "#2d5a27" : "#dc2626", fontWeight: 600, lineHeight: 1.5 }}>
                      {quickMsg}
                    </p>
                  )}
                </div>
              )}

              {/* Placeholder before preview */}
              {!quickParsed && (
                <div style={{ ...s.card, textAlign: "center", padding: "40px 24px", color: "#aaa" }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>👁</div>
                  <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Fill in the template</p>
                  <p style={{ fontSize: 13 }}>Then click "Preview parsed data" to check everything before saving</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── LIST VIEW ─────────────────────────────────────────────────────────────────
  if (view === "list") {
    return (
      <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
        <Header subtitle={`${recipes.length} recipes`} />
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>All Recipes</h2>
              <p style={{ color: "#888", fontSize: 14 }}>{recipes.length} dishes · click to edit</p>
            </div>
          </div>
          {loading ? (
            <p style={{ color: "#888", textAlign: "center", padding: 40 }}>Loading...</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {recipes.map(recipe => (
                <div key={recipe.id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e5e5", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                  <div style={{ position: "relative", height: 130 }}>
                    <img src={recipe.image_url} alt={recipe.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={e => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23eef4ed' width='100' height='100'/%3E%3Ctext y='55' x='50' text-anchor='middle' font-size='30'%3E🍽%3C/text%3E%3C/svg%3E" }} />
                    <span style={{ position: "absolute", top: 8, left: 8, background: "rgba(0,0,0,0.6)", color: "#fff", borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>#{recipe.id}</span>
                    {recipe.name_it && <span style={{ position: "absolute", top: 8, right: 8, fontSize: 16 }}>🇮🇹</span>}
                  </div>
                  <div style={{ padding: "12px 14px" }}>
                    <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{recipe.name}</p>
                    {recipe.name_it && <p style={{ fontSize: 11, color: "#888", marginBottom: 6 }}>🇮🇹 {recipe.name_it}</p>}
                    <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                      <span style={{ fontSize: 11, color: "#888" }}>⏱ {recipe.cook_time}m</span>
                      <span style={{ fontSize: 11, color: "#888" }}>🔥 {recipe.calories}kcal</span>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => loadRecipeDetails(recipe)} style={{ ...s.btn, ...s.green, flex: 1, padding: "7px 10px", fontSize: 12 }}>Edit</button>
                      <button onClick={() => deleteRecipe(recipe.id)} style={{ ...s.btn, ...s.red, padding: "7px 10px", fontSize: 12 }}>Del</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── EDIT / NEW VIEW ───────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <Header subtitle={view === "new" ? "New Recipe" : `Editing #${selected?.id} — ${selected?.name}`} />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}>
          <div>
            <div style={s.card}>
              <p style={s.sectionTitle}>📋 Basic Information</p>
              <div style={{ ...s.grid2, marginBottom: 16 }}>
                <div>
                  <label style={s.label}><span style={s.flag}>🇬🇧</span>Name (English)</label>
                  <input style={s.input} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Lemon Herb Chicken" />
                </div>
                <div>
                  <label style={s.label}><span style={s.flag}>🇮🇹</span>Nome (Italiano)</label>
                  <input style={s.input} value={form.name_it} onChange={e => setForm(p => ({ ...p, name_it: e.target.value }))} placeholder="es. Pollo alle Erbe e Limone" />
                </div>
              </div>
              <div style={s.grid2}>
                <div>
                  <label style={s.label}><span style={s.flag}>🇬🇧</span>Description (English)</label>
                  <textarea style={s.textarea} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
                </div>
                <div>
                  <label style={s.label}><span style={s.flag}>🇮🇹</span>Descrizione (Italiano)</label>
                  <textarea style={s.textarea} value={form.description_it} onChange={e => setForm(p => ({ ...p, description_it: e.target.value }))} />
                </div>
              </div>
            </div>

            <div style={s.card}>
              <p style={s.sectionTitle}>🥦 Ingredients</p>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 80px 80px 120px 32px", gap: 8, marginBottom: 8 }}>
                {["Name", "Amount", "Unit", "Category", ""].map(h => (
                  <span key={h} style={{ fontSize: 11, fontWeight: 700, color: "#999", textTransform: "uppercase" as const }}>{h}</span>
                ))}
              </div>
              {ingredients.map((ing, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 80px 80px 120px 32px", gap: 8, marginBottom: 8 }}>
                  <input style={s.input} value={ing.name} onChange={e => updateIngredient(i, "name", e.target.value)} placeholder="Name" />
                  <input style={s.input} type="number" value={ing.amount || ""} onChange={e => updateIngredient(i, "amount", parseFloat(e.target.value) || 0)} />
                  <select style={s.select} value={ing.unit} onChange={e => updateIngredient(i, "unit", e.target.value)}>
                    {["g","kg","ml","l","tsp","tbsp","cup","pcs","cloves","pinch"].map(u => <option key={u}>{u}</option>)}
                  </select>
                  <select style={s.select} value={ing.category} onChange={e => updateIngredient(i, "category", e.target.value)}>
                    {["protein","vegetable","pantry","dairy","grain"].map(c => <option key={c}>{c}</option>)}
                  </select>
                  <button onClick={() => removeIngredient(i)} style={{ ...s.btn, ...s.red, padding: "4px 8px", fontSize: 16 }}>×</button>
                </div>
              ))}
              <button onClick={addIngredient} style={{ ...s.btn, ...s.grey, marginTop: 8, fontSize: 13 }}>+ Add ingredient</button>
            </div>

            <div style={s.card}>
              <p style={s.sectionTitle}>👨‍🍳 Cooking Steps</p>
              {steps.map((step, i) => (
                <div key={i} style={{ marginBottom: 20, paddingBottom: 20, borderBottom: i < steps.length - 1 ? "1px solid #f0f0f0" : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: "#2d5a27" }}>Step {step.step_number}</span>
                    <button onClick={() => removeStep(i)} style={{ ...s.btn, ...s.red, padding: "3px 10px", fontSize: 12 }}>Remove</button>
                  </div>
                  <div style={s.grid2}>
                    <div>
                      <label style={s.label}><span style={s.flag}>🇬🇧</span>English</label>
                      <textarea style={s.textarea} value={step.instruction} onChange={e => updateStep(i, "instruction", e.target.value)} />
                    </div>
                    <div>
                      <label style={s.label}><span style={s.flag}>🇮🇹</span>Italiano</label>
                      <textarea style={s.textarea} value={step.instruction_it} onChange={e => updateStep(i, "instruction_it", e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={addStep} style={{ ...s.btn, ...s.grey, fontSize: 13 }}>+ Add step</button>
            </div>
          </div>

          <div>
            <div style={s.card}>
              <p style={s.sectionTitle}>📸 Photo</p>
              {imagePreview && (
                <img src={imagePreview} alt="Preview" style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 8, marginBottom: 12 }}
                  onError={e => { (e.target as HTMLImageElement).style.display = "none" }} />
              )}
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
              <button onClick={() => fileRef.current?.click()} style={{ ...s.btn, ...s.grey, width: "100%", marginBottom: 10, fontSize: 13 }}>
                {imagePreview ? "Change photo" : "Upload photo"}
              </button>
              <label style={s.label}>Or paste image URL / path</label>
              <input style={s.input} value={form.image_url} placeholder="/images/dish-01-name.png"
                onChange={e => { setForm(p => ({ ...p, image_url: e.target.value })); setImagePreview(e.target.value) }} />
              {uploadingImage && <p style={{ fontSize: 12, color: "#888", marginTop: 6 }}>Uploading...</p>}
            </div>

            <div style={s.card}>
              <p style={s.sectionTitle}>📊 Nutrition (per serving)</p>
              {[
                { key: "cook_time", label: "Cook time (min)", emoji: "⏱" },
                { key: "servings", label: "Servings", emoji: "👥" },
                { key: "calories", label: "Calories (kcal)", emoji: "🔥" },
                { key: "protein", label: "Protein (g)", emoji: "💪" },
                { key: "carbs", label: "Carbs (g)", emoji: "🌾" },
                { key: "fat", label: "Fat (g)", emoji: "🫙" },
              ].map(field => (
                <div key={field.key} style={{ marginBottom: 10 }}>
                  <label style={s.label}>{field.emoji} {field.label}</label>
                  <input type="number" style={s.input} value={(form as any)[field.key] || ""}
                    onChange={e => setForm(p => ({ ...p, [field.key]: parseInt(e.target.value) || 0 }))} />
                </div>
              ))}
            </div>

            <div style={s.card}>
              <p style={s.sectionTitle}>🏷️ Tags</p>
              <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6, marginBottom: 10 }}>
                {form.tags.map(tag => (
                  <span key={tag} style={{ background: "#eef4ed", color: "#2d5a27", borderRadius: 999, padding: "3px 10px", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                    {tag} <span onClick={() => removeTag(tag)} style={{ cursor: "pointer", fontWeight: 700 }}>×</span>
                  </span>
                ))}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <input style={{ ...s.input, flex: 1 }} value={tagInput} onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addTag()} placeholder="chicken, quick..." />
                <button onClick={addTag} style={{ ...s.btn, ...s.green, padding: "9px 14px" }}>+</button>
              </div>
            </div>

            <div style={s.card}>
              <p style={s.sectionTitle}>🥗 Dietary Info</p>
              <div style={{ marginBottom: 14 }}>
                <label style={{ ...s.label, marginBottom: 8 }}>Diet types</label>
                {["omnivore","vegetarian","vegan","pescatarian"].map(type => (
                  <label key={type} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, cursor: "pointer", fontSize: 14 }}>
                    <input type="checkbox" checked={form.diet_types.includes(type)} onChange={() => toggleDietType(type)} />
                    <span style={{ textTransform: "capitalize" }}>{type}</span>
                  </label>
                ))}
              </div>
              {[{ key: "is_vegetarian", label: "Vegetarian 🥦" }, { key: "is_vegan", label: "Vegan 🌱" }, { key: "is_gluten_free", label: "Gluten-free 🌾" }].map(flag => (
                <label key={flag.key} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, cursor: "pointer", fontSize: 14 }}>
                  <input type="checkbox" checked={(form as any)[flag.key]} onChange={e => setForm(p => ({ ...p, [flag.key]: e.target.checked }))} />
                  {flag.label}
                </label>
              ))}
            </div>

            <button onClick={save} disabled={saving} style={{ ...s.btn, ...s.green, width: "100%", padding: "14px", fontSize: 16, opacity: saving ? 0.7 : 1 }}>
              {saving ? "Saving..." : (view === "new" ? "Create recipe ✓" : "Save changes ✓")}
            </button>
            {saveMsg && <p style={{ textAlign: "center", marginTop: 10, fontSize: 14, fontWeight: 600, color: saveMsg.startsWith("✓") ? "#2d5a27" : "#dc2626" }}>{saveMsg}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
