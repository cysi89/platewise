import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

const en = {
  nav: {
    thisWeek: "This Week",
    ingredients: "Ingredients",
    nutrition: "Nutrition",
    recipes: "Recipes",
    signOut: "Sign out"
  },
  header: { weekOf: "Week of" },
  login: {
    tagline: "Your smart dinner planning assistant",
    email: "Email",
    password: "Password",
    signIn: "Sign in",
    createAccount: "Create account",
    noAccount: "No account? Create one",
    alreadyAccount: "Already have an account? Sign in",
    pleaseWait: "Please wait..."
  },
  loading: "Loading your plan...",
  weekly: {
    title: "Weekly planner",
    subtitle: "Plan your next 3 weeks. Complete week 1 to unlock week 2.",
    thisWeek: "This week",
    nextWeek: "Next week",
    weekAfter: "Week after",
    confirmed: "Confirmed — tap to view or edit",
    completePrevious: "Complete previous week first",
    mealsSelected: "meals selected",
    confirmWeek: "Confirm week",
    saveChanges: "Save changes",
    editWeek: "Edit week",
    cancel: "Cancel",
    skip: "Skip",
    clear: "Clear",
    skipped: "Skipped",
    notPlanned: "Not planned",
    pickRecipe: "Pick a recipe below",
    ready: "ready!",
    daysPlanned: "days planned",
    editing: "Editing — make your changes then re-confirm",
    editingBanner: "Editing confirmed week — changes save when you re-confirm",
    mealsPlanned: "meals planned",
    noMealsYet: "No meals planned yet",
    view: "View",
    meals: "meals",
    skippedDays: "skipped"
  },
  filters: {
    all: "All",
    quick: "quick",
    vegetarian: "vegetarian",
    vegan: "vegan",
    chicken: "chicken",
    fish: "fish",
    healthy: "healthy"
  },
  days: {
    Monday: "Monday", Tuesday: "Tuesday", Wednesday: "Wednesday",
    Thursday: "Thursday", Friday: "Friday", Saturday: "Saturday", Sunday: "Sunday"
  },
  ingredients: {
    title: "Shopping list",
    selectWeeks: "Select weeks to shop for:",
    noMealsPlanned: "No meals planned for the selected week(s) yet.",
    selectWeekPrompt: "Select one or more weeks above to generate your shopping list.",
    combinedList: "Combined list for {{count}} weeks — duplicate ingredients have been summed up",
    mealsCount: "meals planned",
    noMealsYet: "No meals planned yet",
    categories: {
      protein: "protein", vegetable: "vegetable",
      pantry: "pantry", dairy: "dairy", grain: "grain"
    }
  },
  nutrition: {
    title: "Nutrition",
    subtitle: "Based on {{count}} planned dinners",
    totalCalories: "Total calories",
    avgPerDinner: "Avg per dinner",
    totalProtein: "Total protein",
    totalCarbs: "Total carbs",
    dayByDay: "Day by day",
    noData: "No data yet",
    noDataSubtitle: "Select some meals to see your nutrition breakdown."
  },
  recipes: {
    title: "Recipes",
    subtitle: "Browse all recipes or find tonight dinner",
    tonight: "Tonight",
    viewRecipe: "View recipe",
    searchPlaceholder: "Search recipes...",
    ingredients: "Ingredients",
    method: "Method",
    min: "min",
    kcal: "kcal",
    servings: "servings",
    protein: "Protein", carbs: "Carbs", fat: "Fat", calories: "Calories"
  },
  emptyStates: {
    shoppingCart: "Select one or more weeks above to generate your shopping list.",
    noMealsPlanned: "No meals planned for the selected week(s) yet.",
    loadingRecipes: "Loading recipes...",
    noRecipesFilter: "No recipes match this filter."
  }
}

const it = {
  nav: {
    thisWeek: "Questa Settimana",
    ingredients: "Ingredienti",
    nutrition: "Nutrizione",
    recipes: "Ricette",
    signOut: "Esci"
  },
  header: { weekOf: "Settimana del" },
  login: {
    tagline: "Il tuo assistente intelligente per la cena",
    email: "Email",
    password: "Password",
    signIn: "Accedi",
    createAccount: "Crea account",
    noAccount: "Non hai un account? Creane uno",
    alreadyAccount: "Hai gia un account? Accedi",
    pleaseWait: "Attendere..."
  },
  loading: "Caricamento piano in corso...",
  weekly: {
    title: "Pianificatore settimanale",
    subtitle: "Pianifica le prossime 3 settimane. Completa la settimana 1 per sbloccare la 2.",
    thisWeek: "Questa settimana",
    nextWeek: "Settimana prossima",
    weekAfter: "Settimana dopo",
    confirmed: "Confermata — tocca per vedere o modificare",
    completePrevious: "Completa prima la settimana precedente",
    mealsSelected: "pasti selezionati",
    confirmWeek: "Conferma settimana",
    saveChanges: "Salva modifiche",
    editWeek: "Modifica settimana",
    cancel: "Annulla",
    skip: "Salta",
    clear: "Cancella",
    skipped: "Saltato",
    notPlanned: "Non pianificato",
    pickRecipe: "Scegli una ricetta",
    ready: "pronto!",
    daysPlanned: "giorni pianificati",
    editing: "Modifica in corso — effettua le modifiche e poi riconferma",
    editingBanner: "Modifica settimana confermata — le modifiche vengono salvate alla riconferma",
    mealsPlanned: "pasti pianificati",
    noMealsYet: "Nessun pasto pianificato",
    view: "Vedi",
    meals: "pasti",
    skippedDays: "saltati"
  },
  filters: {
    all: "Tutti",
    quick: "veloce",
    vegetarian: "vegetariano",
    vegan: "vegano",
    chicken: "pollo",
    fish: "pesce",
    healthy: "sano"
  },
  days: {
    Monday: "Lunedi", Tuesday: "Martedi", Wednesday: "Mercoledi",
    Thursday: "Giovedi", Friday: "Venerdi", Saturday: "Sabato", Sunday: "Domenica"
  },
  ingredients: {
    title: "Lista della spesa",
    selectWeeks: "Seleziona settimane per fare la spesa:",
    noMealsPlanned: "Nessun pasto pianificato per le settimane selezionate.",
    selectWeekPrompt: "Seleziona una o piu settimane per generare la lista della spesa.",
    combinedList: "Lista combinata per {{count}} settimane — ingredienti duplicati sommati",
    mealsCount: "pasti pianificati",
    noMealsYet: "Nessun pasto pianificato",
    categories: {
      protein: "proteine", vegetable: "verdure",
      pantry: "dispensa", dairy: "latticini", grain: "cereali"
    }
  },
  nutrition: {
    title: "Nutrizione",
    subtitle: "Basato su {{count}} cene pianificate",
    totalCalories: "Calorie totali",
    avgPerDinner: "Media per cena",
    totalProtein: "Proteine totali",
    totalCarbs: "Carboidrati totali",
    dayByDay: "Giorno per giorno",
    noData: "Nessun dato",
    noDataSubtitle: "Seleziona alcuni pasti per vedere il riepilogo nutrizionale."
  },
  recipes: {
    title: "Ricette",
    subtitle: "Sfoglia tutte le ricette o trova la cena di stasera",
    tonight: "Stasera",
    viewRecipe: "Vedi ricetta",
    searchPlaceholder: "Cerca ricette...",
    ingredients: "Ingredienti",
    method: "Procedimento",
    min: "min",
    kcal: "kcal",
    servings: "porzioni",
    protein: "Proteine", carbs: "Carboidrati", fat: "Grassi", calories: "Calorie"
  },
  emptyStates: {
    shoppingCart: "Seleziona una o piu settimane per generare la lista della spesa.",
    noMealsPlanned: "Nessun pasto pianificato per le settimane selezionate.",
    loadingRecipes: "Caricamento ricette...",
    noRecipesFilter: "Nessuna ricetta corrisponde al filtro."
  }
}

const savedLang = typeof window !== "undefined"
  ? localStorage.getItem("genie-language") || "en"
  : "en"

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: en },
      it: { common: it }
    },
    lng: savedLang,
    fallbackLng: "en",
    defaultNS: "common",
    ns: ["common"],
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage"],
      caches: ["localStorage"],
      lookupLocalStorage: "genie-language",
    },
  })

export default i18n