export interface Menu {
  id: string
  name: string
  description: string
  image_url: string
  cook_time: number
  servings: number
  calories: number
  protein: number
  carbs: number
  fat: number
  tags: string[]
  recipe_steps: string[]
  ingredients: Ingredient[]
}

export interface Ingredient {
  name: string
  amount: number
  unit: string
  category: "protein" | "vegetable" | "pantry" | "dairy" | "grain"
}

export interface DaySelection {
  day: string
  date: string
  menu: Menu | null
  skipped: boolean
}

export interface UserPrefs {
  household_size: number
  diet_type: string
  cook_time_pref: number
  allergies: string[]
}

export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]