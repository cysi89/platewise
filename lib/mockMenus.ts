import { Menu } from './types'

export const MOCK_MENUS: Menu[] = [
  {
    id: '1', name: 'Lemon Herb Roasted Chicken',
    description: 'Juicy chicken thighs with roasted cherry tomatoes and crispy potatoes. A family classic ready in under 40 minutes.',
    image_url: '/images/dish-01-lemon-herb-chicken.png',
    cook_time: 38, servings: 2, calories: 520, protein: 42, carbs: 38, fat: 18,
    tags: ['chicken', 'gluten-free', 'family'],
    recipe_steps: [
      'Preheat oven to 200C. Cut potatoes into wedges and toss with olive oil, salt and pepper.',
      'Score chicken thighs and rub with lemon zest, garlic, thyme and olive oil.',
      'Place chicken and potatoes on a baking tray. Roast for 25 minutes.',
      'Add cherry tomatoes to the tray, roast a further 10 minutes until chicken is golden.',
      'Rest 5 minutes, squeeze fresh lemon juice over and serve.'
    ],
    ingredients: [
      { name: 'Chicken thighs', amount: 400, unit: 'g', category: 'protein' },
      { name: 'Cherry tomatoes', amount: 200, unit: 'g', category: 'vegetable' },
      { name: 'Potatoes', amount: 300, unit: 'g', category: 'vegetable' },
      { name: 'Lemon', amount: 1, unit: 'pcs', category: 'vegetable' },
      { name: 'Olive oil', amount: 3, unit: 'tbsp', category: 'pantry' },
      { name: 'Garlic', amount: 3, unit: 'cloves', category: 'pantry' },
    ]
  },
  {
    id: '2', name: 'Miso Glazed Salmon',
    description: 'Pan-seared salmon fillet with bok choy and a warming miso butter sauce. Light, fast and full of umami.',
    image_url: '/images/dish-02-miso-salmon.png',
    cook_time: 20, servings: 2, calories: 480, protein: 38, carbs: 22, fat: 24,
    tags: ['fish', 'low-carb', 'quick'],
    recipe_steps: [
      'Mix miso paste, soy sauce, ginger and a splash of water into a glaze.',
      'Pat salmon dry and coat with half the glaze. Leave 5 minutes.',
      'Heat pan over high heat. Sear salmon skin-side up for 3 minutes, flip and cook 2 more.',
      'In the same pan, wilt bok choy with remaining glaze and butter for 3 minutes.',
      'Plate bok choy, place salmon on top and drizzle pan juices over.'
    ],
    ingredients: [
      { name: 'Salmon fillets', amount: 320, unit: 'g', category: 'protein' },
      { name: 'Bok choy', amount: 250, unit: 'g', category: 'vegetable' },
      { name: 'Miso paste', amount: 2, unit: 'tbsp', category: 'pantry' },
      { name: 'Butter', amount: 20, unit: 'g', category: 'dairy' },
      { name: 'Soy sauce', amount: 2, unit: 'tbsp', category: 'pantry' },
      { name: 'Ginger', amount: 1, unit: 'tsp', category: 'pantry' },
    ]
  },
  {
    id: '3', name: 'Thai Beef Basil Stir-fry',
    description: 'Spicy minced beef with holy basil, chili and jasmine rice. Street food at home in 20 minutes.',
    image_url: '/images/dish-03-thai-beef-basil.png',
    cook_time: 20, servings: 2, calories: 490, protein: 35, carbs: 48, fat: 16,
    tags: ['beef', 'spicy', 'quick'],
    recipe_steps: [
      'Cook jasmine rice according to packet instructions.',
      'Heat wok until smoking. Add oil, garlic and chili, fry 30 seconds.',
      'Add minced beef, breaking it up. Cook 4 minutes until browned.',
      'Add oyster sauce and fish sauce. Toss to coat.',
      'Remove from heat, fold in fresh basil. Serve over rice.'
    ],
    ingredients: [
      { name: 'Minced beef', amount: 300, unit: 'g', category: 'protein' },
      { name: 'Jasmine rice', amount: 180, unit: 'g', category: 'grain' },
      { name: 'Fresh basil', amount: 20, unit: 'g', category: 'vegetable' },
      { name: 'Red chili', amount: 2, unit: 'pcs', category: 'vegetable' },
      { name: 'Oyster sauce', amount: 2, unit: 'tbsp', category: 'pantry' },
      { name: 'Fish sauce', amount: 1, unit: 'tbsp', category: 'pantry' },
    ]
  },
  {
    id: '4', name: 'Harissa Lamb Flatbreads',
    description: 'Spiced lamb mince on warm flatbreads with cooling yogurt, cucumber and fresh mint.',
    image_url: '/images/dish-04-harissa-lamb-flatbreads.png',
    cook_time: 25, servings: 2, calories: 580, protein: 36, carbs: 52, fat: 22,
    tags: ['lamb', 'quick', 'family'],
    recipe_steps: [
      'Mix harissa into minced lamb. Dice cucumber and mix with yogurt and salt.',
      'Cook lamb in a hot dry pan for 6-8 minutes, breaking up as it browns.',
      'Warm flatbreads in the same pan or oven for 2 minutes.',
      'Tear mint leaves. Slice flatbreads in half if large.',
      'Layer yogurt, lamb and cucumber on flatbreads. Top with mint and serve.'
    ],
    ingredients: [
      { name: 'Minced lamb', amount: 300, unit: 'g', category: 'protein' },
      { name: 'Flatbreads', amount: 2, unit: 'pcs', category: 'grain' },
      { name: 'Greek yogurt', amount: 150, unit: 'g', category: 'dairy' },
      { name: 'Cucumber', amount: 1, unit: 'pcs', category: 'vegetable' },
      { name: 'Harissa paste', amount: 2, unit: 'tbsp', category: 'pantry' },
      { name: 'Fresh mint', amount: 10, unit: 'g', category: 'vegetable' },
    ]
  },
  {
    id: '5', name: 'Prawn and Chorizo Paella',
    description: 'Spanish saffron rice with king prawns, chorizo and roasted peppers. Weekend worthy, weeknight fast.',
    image_url: '/images/dish-05-prawn-chorizo-paella.png',
    cook_time: 38, servings: 2, calories: 550, protein: 32, carbs: 60, fat: 18,
    tags: ['seafood', 'spanish', 'family'],
    recipe_steps: [
      'Fry chorizo in a wide pan until oils release, about 3 minutes. Remove and set aside.',
      'Add diced onion and garlic to same pan. Cook 3 minutes.',
      'Add paella rice, stir to coat in oils. Add saffron and hot stock.',
      'Simmer uncovered 15 minutes without stirring. Add prawns and peppers on top.',
      'Cook 5 more minutes until prawns are pink and liquid absorbed. Rest 3 minutes and serve.'
    ],
    ingredients: [
      { name: 'King prawns', amount: 250, unit: 'g', category: 'protein' },
      { name: 'Chorizo', amount: 120, unit: 'g', category: 'protein' },
      { name: 'Paella rice', amount: 200, unit: 'g', category: 'grain' },
      { name: 'Roasted peppers', amount: 150, unit: 'g', category: 'vegetable' },
      { name: 'Saffron', amount: 1, unit: 'pinch', category: 'pantry' },
      { name: 'Chicken stock', amount: 600, unit: 'ml', category: 'pantry' },
    ]
  },
  {
    id: '6', name: 'Teriyaki Chicken Bowl',
    description: 'Sticky teriyaki chicken thighs over steamed rice with sesame broccoli. Better than takeaway.',
    image_url: '/images/dish-06-teriyaki-chicken-bowl.png',
    cook_time: 30, servings: 2, calories: 510, protein: 40, carbs: 55, fat: 14,
    tags: ['chicken', 'japanese', 'quick'],
    recipe_steps: [
      'Cook rice. Mix soy sauce, honey, mirin and garlic into teriyaki sauce.',
      'Cut chicken into chunks. Cook in oil over medium-high heat 5 minutes each side.',
      'Pour teriyaki sauce over chicken. Cook 3 minutes until sticky and caramelised.',
      'Steam broccoli 4 minutes. Toss with sesame oil and seeds.',
      'Serve chicken and broccoli over rice. Drizzle extra sauce over the top.'
    ],
    ingredients: [
      { name: 'Chicken thighs', amount: 350, unit: 'g', category: 'protein' },
      { name: 'Jasmine rice', amount: 180, unit: 'g', category: 'grain' },
      { name: 'Broccoli', amount: 250, unit: 'g', category: 'vegetable' },
      { name: 'Soy sauce', amount: 3, unit: 'tbsp', category: 'pantry' },
      { name: 'Honey', amount: 2, unit: 'tbsp', category: 'pantry' },
      { name: 'Sesame seeds', amount: 1, unit: 'tbsp', category: 'pantry' },
    ]
  },
  {
    id: '7', name: 'Tuna Nicoise Salad',
    description: 'Classic French salad with seared tuna, green beans, soft eggs and olives. Elegant and effortless.',
    image_url: '/images/dish-07-tuna-nicoise.png',
    cook_time: 25, servings: 2, calories: 420, protein: 38, carbs: 18, fat: 20,
    tags: ['fish', 'low-carb', 'healthy'],
    recipe_steps: [
      'Boil eggs for 7 minutes. Cool in cold water, peel and halve.',
      'Blanch green beans in boiling salted water for 3 minutes. Drain and refresh.',
      'Season tuna steaks. Sear in hot oiled pan 2 minutes each side. Rest and slice.',
      'Arrange lettuce, beans, tomatoes, olives and eggs on plates.',
      'Place tuna on top. Dress with olive oil, lemon juice, Dijon mustard and season well.'
    ],
    ingredients: [
      { name: 'Tuna steaks', amount: 300, unit: 'g', category: 'protein' },
      { name: 'Eggs', amount: 4, unit: 'pcs', category: 'protein' },
      { name: 'Green beans', amount: 150, unit: 'g', category: 'vegetable' },
      { name: 'Cherry tomatoes', amount: 150, unit: 'g', category: 'vegetable' },
      { name: 'Black olives', amount: 60, unit: 'g', category: 'pantry' },
      { name: 'Dijon mustard', amount: 1, unit: 'tbsp', category: 'pantry' },
    ]
  },
  {
    id: '8', name: 'Pork and Ginger Noodles',
    description: 'Quick Asian-style pork mince with egg noodles, spring onions and fresh ginger. Big flavours, fast.',
    image_url: '/images/dish-08-pork-ginger-noodles.png',
    cook_time: 20, servings: 2, calories: 500, protein: 34, carbs: 52, fat: 16,
    tags: ['pork', 'quick', 'asian'],
    recipe_steps: [
      'Cook egg noodles per packet. Drain and toss with a little sesame oil.',
      'Fry ginger and garlic in oil 1 minute. Add pork mince.',
      'Cook pork 5 minutes until browned. Add soy sauce, rice vinegar and chili flakes.',
      'Toss noodles through the pork. Stir fry together 2 minutes.',
      'Plate and top with sliced spring onions and a drizzle of sesame oil.'
    ],
    ingredients: [
      { name: 'Pork mince', amount: 300, unit: 'g', category: 'protein' },
      { name: 'Egg noodles', amount: 180, unit: 'g', category: 'grain' },
      { name: 'Spring onions', amount: 4, unit: 'pcs', category: 'vegetable' },
      { name: 'Fresh ginger', amount: 20, unit: 'g', category: 'pantry' },
      { name: 'Soy sauce', amount: 3, unit: 'tbsp', category: 'pantry' },
      { name: 'Sesame oil', amount: 1, unit: 'tbsp', category: 'pantry' },
    ]
  },
  {
    id: '9', name: 'Baked Cod with Salsa Verde',
    description: 'Flaky oven-baked cod over white beans with a vibrant herb salsa verde. Light and satisfying.',
    image_url: '/images/dish-09-baked-cod-salsa-verde.png',
    cook_time: 25, servings: 2, calories: 410, protein: 40, carbs: 24, fat: 14,
    tags: ['fish', 'healthy', 'gluten-free'],
    recipe_steps: [
      'Preheat oven to 200C. Season cod fillets with olive oil, salt and pepper.',
      'Bake cod on a lined tray for 15 minutes until just flaking.',
      'Blend parsley, capers, anchovies, lemon juice and olive oil into salsa verde.',
      'Warm cannellini beans in a pan with garlic and a splash of stock.',
      'Serve cod over beans. Spoon salsa verde generously over the fish.'
    ],
    ingredients: [
      { name: 'Cod fillets', amount: 320, unit: 'g', category: 'protein' },
      { name: 'Cannellini beans', amount: 400, unit: 'g', category: 'protein' },
      { name: 'Fresh parsley', amount: 30, unit: 'g', category: 'vegetable' },
      { name: 'Capers', amount: 2, unit: 'tbsp', category: 'pantry' },
      { name: 'Lemon', amount: 1, unit: 'pcs', category: 'vegetable' },
      { name: 'Olive oil', amount: 4, unit: 'tbsp', category: 'pantry' },
    ]
  },
  {
    id: '10', name: 'Turkish Chicken Pilaf',
    description: 'Spiced chicken with fragrant rice, toasted pine nuts and dried apricots. One pan, big impact.',
    image_url: '/images/dish-10-turkish-chicken-pilaf.png',
    cook_time: 35, servings: 2, calories: 540, protein: 38, carbs: 58, fat: 16,
    tags: ['chicken', 'family', 'one-pan'],
    recipe_steps: [
      'Brown chicken thighs in oil in a wide pan 4 minutes each side. Remove.',
      'Toast pine nuts in same pan 2 minutes. Add onion and cook 4 minutes.',
      'Add rice, cinnamon, cumin and chopped apricots. Stir to coat.',
      'Return chicken on top. Pour over hot stock. Cover and simmer 20 minutes.',
      'Rest 5 minutes, fluff rice with fork and scatter fresh herbs to serve.'
    ],
    ingredients: [
      { name: 'Chicken thighs', amount: 380, unit: 'g', category: 'protein' },
      { name: 'Basmati rice', amount: 180, unit: 'g', category: 'grain' },
      { name: 'Pine nuts', amount: 30, unit: 'g', category: 'pantry' },
      { name: 'Dried apricots', amount: 60, unit: 'g', category: 'pantry' },
      { name: 'Chicken stock', amount: 400, unit: 'ml', category: 'pantry' },
      { name: 'Cinnamon', amount: 1, unit: 'tsp', category: 'pantry' },
    ]
  },
  {
    id: '11', name: 'Tuscan White Bean Pasta',
    description: 'Creamy cannellini beans with rigatoni, sun-dried tomatoes and spinach. Vegetarian comfort at its best.',
    image_url: '/images/dish-11-tuscan-white-bean-pasta.png',
    cook_time: 25, servings: 2, calories: 560, protein: 22, carbs: 72, fat: 14,
    tags: ['vegetarian', 'pasta', 'quick'],
    recipe_steps: [
      'Cook rigatoni in salted boiling water until al dente. Reserve a cup of pasta water.',
      'Fry garlic in olive oil 1 minute. Add sun-dried tomatoes and beans.',
      'Add a ladleful of pasta water. Simmer 3 minutes until slightly saucy.',
      'Drain pasta and toss into the beans. Add spinach and stir until wilted.',
      'Finish with grated parmesan, black pepper and a drizzle of good olive oil.'
    ],
    ingredients: [
      { name: 'Rigatoni', amount: 200, unit: 'g', category: 'grain' },
      { name: 'Cannellini beans', amount: 400, unit: 'g', category: 'protein' },
      { name: 'Baby spinach', amount: 100, unit: 'g', category: 'vegetable' },
      { name: 'Sun-dried tomatoes', amount: 80, unit: 'g', category: 'pantry' },
      { name: 'Parmesan', amount: 40, unit: 'g', category: 'dairy' },
      { name: 'Garlic', amount: 2, unit: 'cloves', category: 'pantry' },
    ]
  },
  {
    id: '12', name: 'Roasted Veggie Buddha Bowl',
    description: 'Quinoa with roasted sweet potato, crispy chickpeas, avocado and tahini dressing. Vegan and vibrant.',
    image_url: '/images/dish-12-buddha-bowl.png',
    cook_time: 30, servings: 2, calories: 440, protein: 18, carbs: 58, fat: 16,
    tags: ['vegan', 'gluten-free', 'healthy'],
    recipe_steps: [
      'Preheat oven to 200C. Cube sweet potato and toss with oil and cumin. Roast 20 minutes.',
      'Drain chickpeas, pat dry, roast on same tray for final 15 minutes until crispy.',
      'Cook quinoa in vegetable stock until fluffy, about 12 minutes.',
      'Make dressing: whisk tahini, lemon juice, garlic and water until smooth.',
      'Build bowls: quinoa base, sweet potato, chickpeas, sliced avocado. Drizzle with tahini.'
    ],
    ingredients: [
      { name: 'Quinoa', amount: 160, unit: 'g', category: 'grain' },
      { name: 'Sweet potato', amount: 300, unit: 'g', category: 'vegetable' },
      { name: 'Chickpeas', amount: 240, unit: 'g', category: 'protein' },
      { name: 'Avocado', amount: 1, unit: 'pcs', category: 'vegetable' },
      { name: 'Tahini', amount: 3, unit: 'tbsp', category: 'pantry' },
      { name: 'Lemon', amount: 1, unit: 'pcs', category: 'vegetable' },
    ]
  },
  {
    id: '13', name: 'Creamy Mushroom Risotto',
    description: 'Arborio rice slow-cooked with mixed mushrooms, white wine and parmesan. Italian soul food.',
    image_url: '/images/dish-13-mushroom-risotto.png',
    cook_time: 38, servings: 2, calories: 510, protein: 16, carbs: 68, fat: 18,
    tags: ['vegetarian', 'italian', 'comfort'],
    recipe_steps: [
      'Warm stock in a separate pan. Fry shallots in butter until soft, 4 minutes.',
      'Add mushrooms, cook until golden, 5 minutes. Add rice and stir to toast 2 minutes.',
      'Add white wine, stir until absorbed. Add stock one ladle at a time, stirring constantly.',
      'Continue adding stock for 18-20 minutes until rice is creamy and just cooked.',
      'Remove from heat. Stir in remaining butter and parmesan. Rest 2 minutes and serve.'
    ],
    ingredients: [
      { name: 'Arborio rice', amount: 200, unit: 'g', category: 'grain' },
      { name: 'Mixed mushrooms', amount: 300, unit: 'g', category: 'vegetable' },
      { name: 'White wine', amount: 100, unit: 'ml', category: 'pantry' },
      { name: 'Parmesan', amount: 50, unit: 'g', category: 'dairy' },
      { name: 'Vegetable stock', amount: 800, unit: 'ml', category: 'pantry' },
      { name: 'Shallots', amount: 2, unit: 'pcs', category: 'vegetable' },
    ]
  },
  {
    id: '14', name: 'Teriyaki Tofu Rice Bowl',
    description: 'Crispy baked tofu glazed in teriyaki with edamame and sesame rice. Vegan protein powerhouse.',
    image_url: '/images/dish-14-teriyaki-tofu-bowl.png',
    cook_time: 30, servings: 2, calories: 430, protein: 24, carbs: 54, fat: 12,
    tags: ['vegan', 'healthy', 'japanese'],
    recipe_steps: [
      'Press tofu between paper towels 10 minutes. Cube and bake at 200C for 20 minutes until crispy.',
      'Make teriyaki: combine soy sauce, honey, garlic and cornstarch.',
      'Cook rice. Defrost edamame in boiling water 3 minutes.',
      'Toss baked tofu in teriyaki sauce. Heat in pan 2 minutes to caramelise.',
      'Serve rice topped with tofu, edamame, spring onions and sesame seeds.'
    ],
    ingredients: [
      { name: 'Firm tofu', amount: 400, unit: 'g', category: 'protein' },
      { name: 'Jasmine rice', amount: 180, unit: 'g', category: 'grain' },
      { name: 'Edamame', amount: 120, unit: 'g', category: 'vegetable' },
      { name: 'Teriyaki sauce', amount: 4, unit: 'tbsp', category: 'pantry' },
      { name: 'Sesame seeds', amount: 1, unit: 'tbsp', category: 'pantry' },
      { name: 'Spring onions', amount: 3, unit: 'pcs', category: 'vegetable' },
    ]
  },
  {
    id: '15', name: 'Black Bean Tacos',
    description: 'Smoky spiced black beans in corn tortillas with fresh mango salsa and lime crema.',
    image_url: '/images/dish-15-black-bean-tacos.png',
    cook_time: 20, servings: 2, calories: 410, protein: 16, carbs: 62, fat: 10,
    tags: ['vegan', 'mexican', 'quick'],
    recipe_steps: [
      'Dice mango, red onion and coriander. Mix with lime juice for salsa.',
      'Drain and rinse black beans. Fry with cumin, smoked paprika and garlic for 4 minutes.',
      'Mash half the beans roughly for texture. Season well.',
      'Warm tortillas in a dry pan or oven 1 minute each side.',
      'Fill tortillas with beans, mango salsa and a dollop of sour cream or yogurt.'
    ],
    ingredients: [
      { name: 'Black beans', amount: 400, unit: 'g', category: 'protein' },
      { name: 'Corn tortillas', amount: 6, unit: 'pcs', category: 'grain' },
      { name: 'Mango', amount: 1, unit: 'pcs', category: 'vegetable' },
      { name: 'Red onion', amount: 1, unit: 'pcs', category: 'vegetable' },
      { name: 'Sour cream', amount: 100, unit: 'g', category: 'dairy' },
      { name: 'Lime', amount: 2, unit: 'pcs', category: 'vegetable' },
    ]
  },
  {
    id: '16', name: 'Spinach and Feta Frittata',
    description: 'Oven-baked Italian egg dish with spinach, feta and roasted peppers. High protein, low fuss.',
    image_url: '/images/dish-16-spinach-feta-frittata.png',
    cook_time: 25, servings: 2, calories: 380, protein: 26, carbs: 8, fat: 22,
    tags: ['vegetarian', 'gluten-free', 'quick'],
    recipe_steps: [
      'Preheat oven to 180C. Whisk 6 eggs with salt, pepper and a splash of milk.',
      'Wilt spinach in an ovenproof frying pan with a little oil, 2 minutes.',
      'Add roasted peppers to the pan. Pour egg mixture over.',
      'Crumble feta on top. Cook on hob 3 minutes until edges set.',
      'Transfer to oven for 10 minutes until golden and just set in the centre.'
    ],
    ingredients: [
      { name: 'Eggs', amount: 6, unit: 'pcs', category: 'protein' },
      { name: 'Baby spinach', amount: 150, unit: 'g', category: 'vegetable' },
      { name: 'Feta cheese', amount: 100, unit: 'g', category: 'dairy' },
      { name: 'Roasted peppers', amount: 120, unit: 'g', category: 'vegetable' },
      { name: 'Olive oil', amount: 2, unit: 'tbsp', category: 'pantry' },
      { name: 'Milk', amount: 50, unit: 'ml', category: 'dairy' },
    ]
  },
  {
    id: '17', name: 'Lentil and Coconut Dhal',
    description: 'Warming red lentil dhal with coconut milk, tomatoes and toasted cumin. Vegan comfort in a bowl.',
    image_url: '/images/dish-17-lentil-coconut-dhal.png',
    cook_time: 30, servings: 2, calories: 450, protein: 20, carbs: 60, fat: 14,
    tags: ['vegan', 'gluten-free', 'healthy'],
    recipe_steps: [
      'Fry onion, garlic and ginger in oil until softened, 5 minutes.',
      'Add cumin, turmeric and coriander. Toast spices 1 minute.',
      'Add rinsed red lentils, chopped tomatoes and coconut milk.',
      'Simmer 20 minutes, stirring occasionally, until lentils are soft.',
      'Season with salt and lemon juice. Serve with naan or rice, topped with fresh coriander.'
    ],
    ingredients: [
      { name: 'Red lentils', amount: 180, unit: 'g', category: 'protein' },
      { name: 'Coconut milk', amount: 200, unit: 'ml', category: 'pantry' },
      { name: 'Chopped tomatoes', amount: 400, unit: 'g', category: 'vegetable' },
      { name: 'Onion', amount: 1, unit: 'pcs', category: 'vegetable' },
      { name: 'Cumin', amount: 2, unit: 'tsp', category: 'pantry' },
      { name: 'Turmeric', amount: 1, unit: 'tsp', category: 'pantry' },
    ]
  },
  {
    id: '18', name: 'Greek Halloumi Salad',
    description: 'Pan-fried halloumi with cucumber, olives, tomatoes and a lemony oregano dressing. Mediterranean in minutes.',
    image_url: '/images/dish-18-greek-halloumi-salad.png',
    cook_time: 15, servings: 2, calories: 420, protein: 24, carbs: 14, fat: 28,
    tags: ['vegetarian', 'gluten-free', 'quick'],
    recipe_steps: [
      'Slice halloumi into 1cm slices. Pat dry.',
      'Fry halloumi in a dry non-stick pan over high heat, 2 minutes each side until golden.',
      'Chop cucumber, halve tomatoes, slice red onion and pit olives.',
      'Make dressing: whisk olive oil, lemon juice, dried oregano and black pepper.',
      'Toss salad ingredients together. Top with warm halloumi and drizzle dressing over.'
    ],
    ingredients: [
      { name: 'Halloumi', amount: 250, unit: 'g', category: 'dairy' },
      { name: 'Cucumber', amount: 1, unit: 'pcs', category: 'vegetable' },
      { name: 'Cherry tomatoes', amount: 200, unit: 'g', category: 'vegetable' },
      { name: 'Kalamata olives', amount: 80, unit: 'g', category: 'pantry' },
      { name: 'Red onion', amount: 1, unit: 'pcs', category: 'vegetable' },
      { name: 'Lemon', amount: 1, unit: 'pcs', category: 'vegetable' },
    ]
  },
  {
    id: '19', name: 'Chickpea and Tomato Curry',
    description: 'Rich tomato-based curry with chickpeas, spinach and warming spices. Vegan, filling and made for leftovers.',
    image_url: '/images/dish-19-chickpea-tomato-curry.png',
    cook_time: 28, servings: 2, calories: 420, protein: 18, carbs: 56, fat: 12,
    tags: ['vegan', 'gluten-free', 'healthy'],
    recipe_steps: [
      'Fry diced onion in oil 5 minutes. Add garlic, ginger, cumin, garam masala and chili.',
      'Cook spices 2 minutes. Add chopped tomatoes and simmer 5 minutes.',
      'Add chickpeas. Simmer 10 minutes until sauce thickens.',
      'Stir in spinach and cook until just wilted, 2 minutes.',
      'Finish with a squeeze of lemon and fresh coriander. Serve with rice or naan.'
    ],
    ingredients: [
      { name: 'Chickpeas', amount: 480, unit: 'g', category: 'protein' },
      { name: 'Chopped tomatoes', amount: 400, unit: 'g', category: 'vegetable' },
      { name: 'Baby spinach', amount: 120, unit: 'g', category: 'vegetable' },
      { name: 'Onion', amount: 1, unit: 'pcs', category: 'vegetable' },
      { name: 'Garam masala', amount: 2, unit: 'tsp', category: 'pantry' },
      { name: 'Basmati rice', amount: 180, unit: 'g', category: 'grain' },
    ]
  },
  {
    id: '20', name: 'Courgette and Pea Fritters',
    description: 'Crispy grated courgette and pea fritters with herbed yogurt and a simple tomato salad.',
    image_url: '/images/dish-20-courgette-pea-fritters.png',
    cook_time: 25, servings: 2, calories: 360, protein: 18, carbs: 32, fat: 14,
    tags: ['vegetarian', 'quick', 'healthy'],
    recipe_steps: [
      'Grate courgette and squeeze out excess moisture with a clean cloth.',
      'Mix courgette with peas, egg, flour, parmesan, salt and pepper to form a batter.',
      'Fry spoonfuls of batter in oil over medium heat, 3 minutes each side until golden.',
      'Mix yogurt with lemon zest, garlic and chopped mint for the dipping sauce.',
      'Serve fritters with herbed yogurt and a simple tomato and basil salad.'
    ],
    ingredients: [
      { name: 'Courgette', amount: 300, unit: 'g', category: 'vegetable' },
      { name: 'Frozen peas', amount: 150, unit: 'g', category: 'vegetable' },
      { name: 'Eggs', amount: 2, unit: 'pcs', category: 'protein' },
      { name: 'Plain flour', amount: 60, unit: 'g', category: 'grain' },
      { name: 'Greek yogurt', amount: 150, unit: 'g', category: 'dairy' },
      { name: 'Parmesan', amount: 30, unit: 'g', category: 'dairy' },
    ]
  }
]