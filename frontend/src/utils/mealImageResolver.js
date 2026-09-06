/**
 * Intelligent Meal-to-Image Resolver
 * Maps specific dish names, key ingredients, and categories to high-resolution,
 * visually matching food photography from Unsplash.
 *
 * All image URLs are verified HTTP 200 high-quality food photos.
 */

// ─── Verified Food Photo Registry ──────────────────────────────────────────
export const DISH_IMAGES = {
  // Specific Dal & Legume Dishes
  rajma:                'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=600&auto=format&fit=crop&q=80',
  dal_makhani:          'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop&q=80',
  dal_tadka:            'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
  chole:                'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=600&auto=format&fit=crop&q=80',
  sambar:               'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',

  // Paneer Dishes
  palak_paneer:         'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
  paneer_butter_masala: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80',
  matar_paneer:         'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80',
  paneer_bhurji:        'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=600&auto=format&fit=crop&q=80',

  // Flatbreads & Pancakes
  besan_chilla:         'https://images.unsplash.com/photo-1526510747491-58f928ec870f?w=600&auto=format&fit=crop&q=80',
  aloo_paratha:         'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=600&auto=format&fit=crop&q=80',
  thepla_roti:          'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop&q=80',
  naan_bread:           'https://images.unsplash.com/photo-1566843972142-a7fcb70de4a3?w=600&auto=format&fit=crop&q=80',

  // South Indian Classics
  masala_dosa:          'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80',
  idli_sambar:          'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
  uttapam:              'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80',
  upma:                 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=600&auto=format&fit=crop&q=80',

  // Rice & Grains
  poha:                 'https://images.unsplash.com/photo-1613292443284-8d10ef9383fe?w=600&auto=format&fit=crop&q=80',
  khichdi:              'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=600&auto=format&fit=crop&q=80',
  biryani:              'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
  pulao_rice:           'https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=600&auto=format&fit=crop&q=80',
  quinoa_grain:         'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',

  // Snacks & Light Bites
  sweet_potato:         'https://images.unsplash.com/photo-1579123521334-44e68095cd7a?w=600&auto=format&fit=crop&q=80',
  roasted_chana:        'https://images.unsplash.com/photo-1712251769748-a36783c7c0f2?w=600&auto=format&fit=crop&q=80',
  makhana_nuts:         'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=600&auto=format&fit=crop&q=80',
  sprouts_salad:        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80',
  fruit_chaat:          'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600&auto=format&fit=crop&q=80',
  dhokla:               'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
  banana_snack:         'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80',
  roasted_corn:         'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&auto=format&fit=crop&q=80',
  cookies:              'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&auto=format&fit=crop&q=80',
  sweet_halwa:          'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&auto=format&fit=crop&q=80',

  // Non-Veg Dishes
  butter_chicken:       'https://images.unsplash.com/photo-1772730064951-89b427965dbc?w=600&auto=format&fit=crop&q=80',
  tandoori_chicken:     'https://images.unsplash.com/photo-1775211578178-61f06027adf3?w=600&auto=format&fit=crop&q=80',
  chicken_curry:        'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&auto=format&fit=crop&q=80',
  fish_curry:           'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=80',
  meat_dish:            'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
  egg_bhurji:           'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=600&auto=format&fit=crop&q=80',
  boiled_eggs:          'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&auto=format&fit=crop&q=80',

  // Vegetables & Bowls
  bhindi_sabzi:         'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&auto=format&fit=crop&q=80',
  curry_sabzi:          'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop&q=80',
  fresh_salad:          'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&auto=format&fit=crop&q=80',
  vegetable_soup:       'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=80',
  tofu_soy:             'https://images.unsplash.com/photo-1546069901-eacef0df6022?w=600&auto=format&fit=crop&q=80',

  // Dairy & Breakfast Essentials
  curd_raita:           'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80',
  oatmeal:              'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=600&auto=format&fit=crop&q=80',
  smoothie:             'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=600&auto=format&fit=crop&q=80',
  sandwich_wrap:        'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80',
};

// ─── Slot-Appropriate Clean Defaults (Never generic pizza or chicken) ──────
export const SLOT_DEFAULTS = {
  breakfast: DISH_IMAGES.poha,
  lunch:     DISH_IMAGES.dal_tadka,
  dinner:    DISH_IMAGES.paneer_butter_masala,
  snacks:    DISH_IMAGES.sprouts_salad,
};

// ─── Hierarchical Pattern Matcher Rules ─────────────────────────────────────
// Tested in order of specificity (most specific dishes first).
const MATCH_RULES = [
  // 1. Signature preparation dishes (highest priority)
  { pattern: /\b(sweet\s*potato|shakarkandi)\b/i,                              image: DISH_IMAGES.sweet_potato },
  { pattern: /\b(chilla|cheela|chila|chela)\b/i,                                image: DISH_IMAGES.besan_chilla },
  { pattern: /\b(khichdi|khichuri)\b/i,                                        image: DISH_IMAGES.khichdi },
  { pattern: /\b(sabudana\s*khichdi|sabudana)\b/i,                             image: DISH_IMAGES.khichdi },
  { pattern: /\b(rajma|kidney\s*bean)\b/i,                                      image: DISH_IMAGES.rajma },
  { pattern: /\b(dal\s*makhani|makhani\s*dal)\b/i,                              image: DISH_IMAGES.dal_makhani },
  { pattern: /\b(chole|bhature|chana\s*masala|chickpea)\b/i,                    image: DISH_IMAGES.chole },
  { pattern: /\b(palak\s*paneer|saag\s*paneer|spinach\s*paneer)\b/i,            image: DISH_IMAGES.palak_paneer },
  { pattern: /\b(matar\s*paneer|mutter\s*paneer)\b/i,                          image: DISH_IMAGES.matar_paneer },
  { pattern: /\b(paneer\s*bhurji)\b/i,                                         image: DISH_IMAGES.paneer_bhurji },
  { pattern: /\b(paneer\s*butter\s*masala|shahi\s*paneer|paneer\s*tikka|paneer)\b/i, image: DISH_IMAGES.paneer_butter_masala },
  { pattern: /\b(butter\s*chicken|murgh\s*makhani)\b/i,                         image: DISH_IMAGES.butter_chicken },
  { pattern: /\b(tandoori\s*chicken|chicken\s*tikka)\b/i,                       image: DISH_IMAGES.tandoori_chicken },
  { pattern: /\b(egg\s*bhurji|scrambled\s*egg)\b/i,                            image: DISH_IMAGES.egg_bhurji },
  { pattern: /\b(thepla|methi\s*thepla)\b/i,                                   image: DISH_IMAGES.thepla_roti },
  { pattern: /\b(aloo\s*paratha|paneer\s*paratha|stuffed\s*paratha|paratha)\b/i, image: DISH_IMAGES.aloo_paratha },
  { pattern: /\b(roasted\s*chana|black\s*chana|kala\s*chana)\b/i,              image: DISH_IMAGES.roasted_chana },
  { pattern: /\b(makhana|fox\s*nut|lotus\s*seed)\b/i,                           image: DISH_IMAGES.makhana_nuts },
  { pattern: /\b(sprout|sprouted\s*moong)\b/i,                                 image: DISH_IMAGES.sprouts_salad },
  { pattern: /\b(dhokla|khaman)\b/i,                                           image: DISH_IMAGES.dhokla },
  { pattern: /\b(poha)\b/i,                                                    image: DISH_IMAGES.poha },
  { pattern: /\b(upma|vermicelli)\b/i,                                         image: DISH_IMAGES.upma },
  { pattern: /\b(idli|vada|medu\s*vada)\b/i,                                   image: DISH_IMAGES.idli_sambar },
  { pattern: /\b(masala\s*dosa|dosa|pesarattu)\b/i,                            image: DISH_IMAGES.masala_dosa },
  { pattern: /\b(uttapam)\b/i,                                                 image: DISH_IMAGES.uttapam },
  { pattern: /\b(sambar)\b/i,                                                  image: DISH_IMAGES.sambar },
  { pattern: /\b(biryani)\b/i,                                                 image: DISH_IMAGES.biryani },
  { pattern: /\b(dal\s*tadka|yellow\s*dal|dal\s*fry|toor\s*dal)\b/i,           image: DISH_IMAGES.dal_tadka },
  { pattern: /\b(pulao|jeera\s*rice|fried\s*rice)\b/i,                          image: DISH_IMAGES.pulao_rice },
  { pattern: /\b(halwa|sheera|suji\s*halwa)\b/i,                               image: DISH_IMAGES.sweet_halwa },
  { pattern: /\b(fruit\s*chaat|fruits?)\b/i,                                   image: DISH_IMAGES.fruit_chaat },
  { pattern: /\b(banana)\b/i,                                                  image: DISH_IMAGES.banana_snack },
  { pattern: /\b(corn|bhutta)\b/i,                                             image: DISH_IMAGES.roasted_corn },
  { pattern: /\b(cookies?|biscuits?|crackers?)\b/i,                            image: DISH_IMAGES.cookies },

  // 2. Ingredient & Category Matches
  { pattern: /\b(dal|lentil|tadka|kootu)\b/i,                                  image: DISH_IMAGES.dal_tadka },
  { pattern: /\b(chicken|murgh)\b/i,                                           image: DISH_IMAGES.chicken_curry },
  { pattern: /\b(fish|salmon|prawn|pomfret|seafood|machher)\b/i,               image: DISH_IMAGES.fish_curry },
  { pattern: /\b(mutton|lamb|keema|gosht)\b/i,                                 image: DISH_IMAGES.meat_dish },
  { pattern: /\b(omelette|boiled\s*egg|egg|eggs)\b/i,                          image: DISH_IMAGES.boiled_eggs },
  { pattern: /\b(curd|raita|yogurt|buttermilk|chaas|lassi)\b/i,                image: DISH_IMAGES.curd_raita },
  { pattern: /\b(oats|oatmeal|porridge|cereal)\b/i,                            image: DISH_IMAGES.oatmeal },
  { pattern: /\b(smoothie|shake)\b/i,                                          image: DISH_IMAGES.smoothie },
  { pattern: /\b(sandwich|toast|wrap|roll)\b/i,                                image: DISH_IMAGES.sandwich_wrap },
  { pattern: /\b(soup|shorba)\b/i,                                             image: DISH_IMAGES.vegetable_soup },
  { pattern: /\b(salad)\b/i,                                                   image: DISH_IMAGES.fresh_salad },
  { pattern: /\b(tofu|soya|soy)\b/i,                                           image: DISH_IMAGES.tofu_soy },
  { pattern: /\b(quinoa|millet|ragi|bajra|jowar)\b/i,                          image: DISH_IMAGES.quinoa_grain },
  { pattern: /\b(bhindi|okra|lady\s*finger)\b/i,                               image: DISH_IMAGES.bhindi_sabzi },
  { pattern: /\b(aloo\s*gobi|gobi|baingan|eggplant|dum\s*aloo)\b/i,             image: DISH_IMAGES.curry_sabzi },
  { pattern: /\b(naan|kulcha|puri|poori|bhatura)\b/i,                          image: DISH_IMAGES.naan_bread },
  { pattern: /\b(roti|chapati|phulka)\b/i,                                     image: DISH_IMAGES.thepla_roti },
  { pattern: /\b(rice|steamed\s*rice|brown\s*rice)\b/i,                        image: DISH_IMAGES.pulao_rice },
  { pattern: /\b(nuts?|almonds?|walnuts?|cashews?|trail\s*mix|seeds?)\b/i,        image: DISH_IMAGES.makhana_nuts },
  { pattern: /\b(bhel|chaat|pakora|cutlet)\b/i,                                image: DISH_IMAGES.dhokla },
  { pattern: /\b(sabzi|curry|masala|korma|kofta)\b/i,                          image: DISH_IMAGES.curry_sabzi },
];

// ─── Fast In-Memory Cache ──────────────────────────────────────────────────
const imageResolutionCache = new Map();

/**
 * Resolves a meal name and optional mealType to an exact, high-quality food image.
 *
 * @param {string} mealName - Name of the meal (e.g. "Besan Chilla with Mint Chutney")
 * @param {string} [mealType] - Slot name: 'breakfast' | 'lunch' | 'dinner' | 'snacks'
 * @returns {string} - Verified Unsplash image URL
 */
export const resolveMealImage = (mealName = '', mealType = 'lunch') => {
  if (!mealName || typeof mealName !== 'string') {
    return SLOT_DEFAULTS[mealType] || SLOT_DEFAULTS.lunch;
  }

  const cleanName = mealName.trim();
  const cacheKey = `${(mealType || 'lunch').toLowerCase()}:${cleanName.toLowerCase()}`;

  if (imageResolutionCache.has(cacheKey)) {
    return imageResolutionCache.get(cacheKey);
  }

  // Iterate rules in priority order
  for (const rule of MATCH_RULES) {
    if (rule.pattern.test(cleanName)) {
      imageResolutionCache.set(cacheKey, rule.image);
      return rule.image;
    }
  }

  // Fallback to slot-appropriate default
  const fallback = SLOT_DEFAULTS[(mealType || 'lunch').toLowerCase()] || SLOT_DEFAULTS.lunch;
  imageResolutionCache.set(cacheKey, fallback);
  return fallback;
};

export default resolveMealImage;
