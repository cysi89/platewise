import requests
import os
import time
import base64

# ─── CONFIG ───────────────────────────────────────────────────────────────────
GEMINI_API_KEY = "AIzaSyBg6l7-XElnVHOpplP9wBH-KeSSAYscIgs"
OUTPUT_FOLDER = r"C:\Users\Cyril\platewise\public\images"
# ──────────────────────────────────────────────────────────────────────────────

RECIPES = [
    # ── ITALIAN MEAT & FISH (21-40) ──────────────────────────────────────────
    ("dish-21-pollo-cacciatora.png",
     "Professional food photography, overhead shot, Italian hunter chicken stew in a rustic terracotta pot, bone-in chicken pieces in rich tomato sauce with olives, capers, rosemary and white wine, steam rising, warm Italian kitchen light"),
    ("dish-22-scaloppine-limone.png",
     "Professional food photography, 45-degree angle, thin veal escalopes in golden lemon butter sauce, capers scattered, fresh parsley, served on white ceramic plate, elegant Italian restaurant lighting"),
    ("dish-23-salmone-capperi.png",
     "Professional food photography, overhead shot, baked salmon fillet with caper and tomato sauce, fresh dill, lemon slices, on a white baking dish, bright natural light"),
    ("dish-24-spiedini-pollo.png",
     "Professional food photography, close-up, grilled chicken and vegetable skewers on a wooden board, charred courgette peppers and onion, chimichurri drizzle, rustic Italian outdoor setting"),
    ("dish-25-trota-mandorle.png",
     "Professional food photography, 45-degree angle, pan-fried trout fillet with toasted almond butter sauce, green beans on the side, lemon wedge, elegant white plate, soft warm lighting"),
    ("dish-26-polpette-sugo.png",
     "Professional food photography, overhead shot, Italian beef meatballs in rich tomato sauce in a deep cast iron pan, fresh basil leaves, grated parmesan, rustic wooden table"),
    ("dish-27-petto-pollo-pomodorini.png",
     "Professional food photography, overhead flat lay, golden chicken breast with burst cherry tomatoes and fresh basil, olive oil drizzle, white plate, bright Mediterranean light"),
    ("dish-28-gamberoni-aglio.png",
     "Professional food photography, 45-degree angle, king prawns sauteed in garlic olive oil and white wine, fresh parsley, lemon, served in a wide shallow pan, Italian coastal restaurant atmosphere"),
    ("dish-29-tonno-fagioli.png",
     "Professional food photography, overhead shot, Italian tuna and borlotti bean salad with red onion, fresh parsley, olive oil dressing, on a white plate, bright natural light"),
    ("dish-30-salsiccia-lenticchie.png",
     "Professional food photography, 45-degree angle, Italian sausage and green lentil stew in a terracotta pot, rosemary, garlic, rich earthy tones, rustic Italian farmhouse setting"),
    ("dish-31-merluzzo-olive.png",
     "Professional food photography, overhead shot, baked cod fillet with black olives cherry tomatoes and capers in olive oil, fresh parsley, white baking dish, Mediterranean light"),
    ("dish-32-straccetti-rucola.png",
     "Professional food photography, close-up 45-degree, thin beef strips on a bed of fresh rocket with shaved parmesan, cherry tomatoes, balsamic glaze, elegant white plate"),
    ("dish-33-pollo-marsala.png",
     "Professional food photography, 45-degree angle, chicken breast in golden Marsala wine sauce with mushrooms, cream sauce, fresh sage, served in a copper pan, warm Italian restaurant lighting"),
    ("dish-34-calamari-piselli.png",
     "Professional food photography, overhead shot, sauteed squid rings with fresh peas and cherry tomatoes in white wine and garlic, fresh parsley, white ceramic bowl, bright coastal light"),
    ("dish-35-tacchino-salvia.png",
     "Professional food photography, overhead shot, turkey escalopes with crispy fried sage leaves in lemon butter, white asparagus on side, elegant white plate, soft natural light"),
    ("dish-36-sgombro-erbe.png",
     "Professional food photography, 45-degree angle, whole baked mackerel with fresh herbs thyme rosemary and lemon slices, on parchment paper, rustic wooden board, Mediterranean setting"),
    ("dish-37-cotoletta-milanese.png",
     "Professional food photography, overhead shot, classic Milanese breaded chicken cutlet, golden crispy breadcrumbs, fresh rocket and cherry tomatoes on top, lemon wedge, white plate"),
    ("dish-38-acciughe-patate.png",
     "Professional food photography, overhead shot, roasted golden potatoes with anchovy fillets melted over top, fresh parsley, olive oil, rustic Italian earthenware dish, warm light"),
    ("dish-39-pollo-peperoni.png",
     "Professional food photography, overhead shot, chicken with colourful roasted red and yellow peppers in tomato sauce, fresh basil, cast iron pan, vibrant Mediterranean colours"),
    ("dish-40-bocconcini-rosmarino.png",
     "Professional food photography, 45-degree angle, small beef bites with crispy rosemary in red wine reduction, roasted potatoes on side, dark rustic plate, warm Italian trattoria lighting"),

    # ── ITALIAN VEGETARIAN (41-60) ────────────────────────────────────────────
    ("dish-41-pasta-ceci.png",
     "Professional food photography, overhead shot, Italian pasta e ceci, thick creamy chickpea soup with small pasta, rosemary oil drizzle, red chili flakes, rustic white bowl, warm Italian home kitchen light"),
    ("dish-42-risotto-pomodoro.png",
     "Professional food photography, 45-degree angle, creamy fresh tomato risotto in a wide white bowl, basil oil drizzle, parmesan shavings, vibrant red colour, elegant Italian restaurant setting"),
    ("dish-43-frittata-zucchine-menta.png",
     "Professional food photography, overhead shot, golden baked courgette and mint frittata in cast iron skillet, fresh mint leaves on top, light and airy morning kitchen atmosphere"),
    ("dish-44-gnocchi-gorgonzola.png",
     "Professional food photography, 45-degree angle, pillowy potato gnocchi in creamy gorgonzola sauce, toasted walnuts, fresh thyme, wide white bowl, soft warm Italian lighting"),
    ("dish-45-panzanella.png",
     "Professional food photography, overhead flat lay, Tuscan panzanella bread salad with ripe tomatoes cucumber red onion basil and golden croutons, olive oil dressing, rustic terracotta bowl"),
    ("dish-46-pasta-norma.png",
     "Professional food photography, overhead shot, pasta alla norma with fried aubergine in tomato sauce, ricotta salata shaved on top, fresh basil, rustic Sicilian ceramic bowl, Mediterranean light"),
    ("dish-47-zuppa-lenticchie.png",
     "Professional food photography, 45-degree angle, red lentil and carrot soup in a terracotta bowl, cumin oil drizzle, fresh coriander, crusty bread on side, warm rustic Italian kitchen"),
    ("dish-48-farro-verdure.png",
     "Professional food photography, overhead flat lay, farro grain salad with grilled courgette peppers and aubergine, fresh herbs, lemon dressing, white ceramic plate, bright natural light"),
    ("dish-49-crespelle-spinaci.png",
     "Professional food photography, 45-degree angle, Italian crepes filled with spinach and ricotta, baked with bechamel sauce, golden top, fresh parsley, white baking dish, warm light"),
    ("dish-50-fagioli-uccelletto.png",
     "Professional food photography, overhead shot, Tuscan cannellini beans in rich tomato sage sauce, in a terracotta pot, drizzle of olive oil, rustic wooden table, warm Florentine kitchen light"),
    ("dish-51-parmigiana-veloce.png",
     "Professional food photography, overhead shot, quick aubergine parmigiana layers of fried aubergine tomato sauce mozzarella and parmesan, bubbling and golden, cast iron pan, Italian home cooking"),
    ("dish-52-pasta-pesto-rucola.png",
     "Professional food photography, overhead shot, pasta with vibrant green rocket and walnut pesto, parmesan, lemon zest, white bowl, bright natural light, fresh and elegant"),
    ("dish-53-zucchine-ripiene.png",
     "Professional food photography, overhead shot, courgettes stuffed with quinoa and feta cheese, baked golden, fresh herbs, on a white baking tray, Mediterranean light"),
    ("dish-54-bruschetta-cannellini.png",
     "Professional food photography, close-up 45-degree, thick rustic bruschetta topped with cannellini beans and sauteed cavolo nero, olive oil drizzle, on a wooden board, Italian wine bar atmosphere"),
    ("dish-55-insalata-lenticchie.png",
     "Professional food photography, overhead flat lay, green lentil salad with crumbled feta pomegranate seeds fresh parsley and lemon dressing, vibrant colours, white plate, bright natural light"),
    ("dish-56-risotto-radicchio.png",
     "Professional food photography, 45-degree angle, creamy radicchio and taleggio risotto in wide white bowl, deep purple and cream colours, walnut garnish, elegant Italian restaurant lighting"),
    ("dish-57-peperonata-uova.png",
     "Professional food photography, overhead shot, Italian peperonata pepper stew with eggs poached on top, fresh parsley, vibrant red yellow orange colours, cast iron skillet, rustic Italian kitchen"),
    ("dish-58-pasta-broccoli-olive.png",
     "Professional food photography, overhead shot, pasta with broccoli and black olives in garlic olive oil, chili flakes, toasted breadcrumbs on top, white bowl, bright Italian kitchen light"),
    ("dish-59-polenta-funghi.png",
     "Professional food photography, 45-degree angle, creamy yellow polenta in a wide bowl topped with sauteed mixed wild mushrooms, fresh thyme, parmesan, truffle oil drizzle, rustic Italian setting"),
    ("dish-60-caprese-avocado.png",
     "Professional food photography, overhead flat lay, caprese salad with buffalo mozzarella ripe tomatoes and sliced avocado, fresh basil, olive oil drizzle, elegant white plate, bright Mediterranean light"),

    # ── INTERNATIONAL NON-VEG (61-70) ────────────────────────────────────────
    ("dish-61-chicken-shawarma-bowl.png",
     "Professional food photography, overhead flat lay, Middle Eastern chicken shawarma bowl, spiced chicken strips over fragrant rice, cucumber yogurt sauce, pickled vegetables, fresh parsley, vibrant colours"),
    ("dish-62-gyudon-beef-bowl.png",
     "Professional food photography, 45-degree angle, Japanese gyudon beef bowl, tender soy-glazed beef and onions over steamed rice in a ceramic donburi bowl, soft boiled egg, pickled ginger, elegant Japanese styling"),
    ("dish-63-dakgalbi-korean.png",
     "Professional food photography, overhead shot, Korean dakgalbi spicy stir-fried chicken with gochujang sauce, cabbage and spring onions in a wide pan, vibrant red colour, sesame seeds"),
    ("dish-64-moroccan-chicken-lemon.png",
     "Professional food photography, 45-degree angle, Moroccan chicken with preserved lemon and olives over couscous, fresh coriander, warm spice tones, terracotta tagine, North African styling"),
    ("dish-65-thai-green-curry-prawns.png",
     "Professional food photography, overhead shot, Thai green curry with king prawns in coconut milk, fresh basil, lime leaf, jasmine rice on side, vibrant green colour, dark ceramic bowl"),
    ("dish-66-chicken-burrito-bowl.png",
     "Professional food photography, overhead flat lay, Mexican chicken burrito bowl with seasoned rice, black beans, grilled corn, sliced avocado, lime crema, fresh coriander, vibrant Mexican colours"),
    ("dish-67-souvlaki-pork.png",
     "Professional food photography, close-up, Greek pork souvlaki skewers on a wooden board, tzatziki in a small bowl, warm pitta bread, sliced tomato and onion, Mediterranean styling"),
    ("dish-68-butter-chicken.png",
     "Professional food photography, 45-degree angle, Indian butter chicken in rich creamy tomato sauce, basmati rice, fresh coriander, naan bread, warm golden orange colour, dark background"),
    ("dish-69-vietnamese-lemongrass-chicken.png",
     "Professional food photography, overhead shot, Vietnamese lemongrass chicken stir-fry over vermicelli noodles, fresh herbs, chili, lime wedge, vibrant fresh colours, clean white bowl"),
    ("dish-70-turkish-kofte.png",
     "Professional food photography, 45-degree angle, Turkish kofte meatballs on flatbread with yogurt sauce, sliced cucumber tomato and red onion, fresh parsley, sumac dusting, warm Middle Eastern styling"),

    # ── INTERNATIONAL VEG (71-80) ─────────────────────────────────────────────
    ("dish-71-miso-soup-tofu.png",
     "Professional food photography, overhead shot, Japanese miso soup with silken tofu cubes and wakame seaweed in a dark ceramic bowl, spring onion garnish, steam rising, minimalist Japanese styling"),
    ("dish-72-chana-masala.png",
     "Professional food photography, 45-degree angle, Indian chana masala spiced chickpea curry in a dark bowl, fresh coriander, red onion, warm toasted spice colours, naan bread beside"),
    ("dish-73-black-bean-quesadilla.png",
     "Professional food photography, overhead shot, Mexican black bean and cheese quesadillas cut into triangles on a wooden board, sour cream, fresh salsa, guacamole in small bowls"),
    ("dish-74-fattoush-halloumi.png",
     "Professional food photography, overhead flat lay, Lebanese fattoush salad with golden pan-fried halloumi, tomatoes cucumber radish sumac and crispy flatbread pieces, lemon dressing, vibrant fresh colours"),
    ("dish-75-moroccan-veg-couscous.png",
     "Professional food photography, overhead shot, Moroccan vegetable couscous with roasted courgette carrot chickpeas and harissa, fresh coriander, terracotta bowl, warm North African colours"),
    ("dish-76-bibimbap.png",
     "Professional food photography, overhead shot, Korean bibimbap in a stone bowl, colourful arranged vegetables spinach carrot mushroom over rice, fried egg on top, gochujang sauce, sesame seeds, vibrant"),
    ("dish-77-thai-peanut-noodles.png",
     "Professional food photography, 45-degree angle, Thai peanut noodles with rice noodles in rich peanut sauce, spring onions, lime, crushed peanuts, sesame seeds, dark ceramic bowl, Southeast Asian styling"),
    ("dish-78-spanakopita-frittata.png",
     "Professional food photography, overhead shot, Greek-style spinach and feta frittata baked golden in cast iron skillet, dill garnish, warm Greek kitchen atmosphere, rustic linen"),
    ("dish-79-saag-paneer.png",
     "Professional food photography, 45-degree angle, Indian saag paneer, creamy spiced spinach with golden paneer cubes, basmati rice, fresh ginger, naan bread, vibrant green and gold colours"),
    ("dish-80-shakshuka.png",
     "Professional food photography, overhead shot, Middle Eastern shakshuka, eggs poached in vibrant spiced tomato and pepper sauce in a cast iron skillet, fresh parsley, feta crumbles, crusty bread beside, warm morning light"),
]

def generate_image(prompt, filename):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key={GEMINI_API_KEY}"
    
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"responseModalities": ["TEXT", "IMAGE"]}
    }
    
    response = requests.post(url, json=payload, timeout=60)
    
    if response.status_code != 200:
        print(f"  ERROR {response.status_code}: {response.text[:200]}")
        return False
    
    data = response.json()
    
    try:
        parts = data["candidates"][0]["content"]["parts"]
        for part in parts:
            if "inlineData" in part:
                image_data = base64.b64decode(part["inlineData"]["data"])
                filepath = os.path.join(OUTPUT_FOLDER, filename)
                with open(filepath, "wb") as f:
                    f.write(image_data)
                print(f"  Saved: {filename}")
                return True
        print(f"  No image in response for {filename}")
        return False
    except (KeyError, IndexError) as e:
        print(f"  Parse error: {e}")
        return False

def main():
    print(f"\nGenie Recipe Image Generator")
    print(f"Output folder: {OUTPUT_FOLDER}")
    print(f"Total images to generate: {len(RECIPES)}\n")
    
    if GEMINI_API_KEY == "PASTE_YOUR_API_KEY_HERE":
        print("ERROR: Please paste your Gemini API key at the top of this script!")
        return
    
    if not os.path.exists(OUTPUT_FOLDER):
        os.makedirs(OUTPUT_FOLDER)
        print(f"Created folder: {OUTPUT_FOLDER}")
    
    success = 0
    failed = []
    
    for i, (filename, prompt) in enumerate(RECIPES, 1):
        filepath = os.path.join(OUTPUT_FOLDER, filename)
        
        # Skip if already exists
        if os.path.exists(filepath):
            print(f"[{i:02d}/{len(RECIPES)}] SKIP (exists): {filename}")
            success += 1
            continue
        
        print(f"[{i:02d}/{len(RECIPES)}] Generating: {filename}")
        
        ok = generate_image(prompt, filename)
        
        if ok:
            success += 1
        else:
            failed.append(filename)
        
        # Wait between requests to respect rate limits
        if i < len(RECIPES):
            time.sleep(3)
    
    print(f"\nDone! {success}/{len(RECIPES)} images generated successfully.")
    if failed:
        print(f"\nFailed ({len(failed)}):")
        for f in failed:
            print(f"  - {f}")
        print("\nRe-run the script to retry failed images (existing ones are skipped automatically).")

if __name__ == "__main__":
    main()
