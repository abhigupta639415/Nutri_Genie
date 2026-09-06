const { resolveMealImage, DISH_IMAGES, SLOT_DEFAULTS } = require('../frontend/src/utils/mealImageResolver.js');
const { generateFallbackPlan } = require('../backend/utils/fallbackGenerator.js');
const { validateAndFixPlan } = require('../backend/controllers/geminiDietController.js');
const { getMealsByPreference } = require('../backend/utils/mealDatabase.js');

console.log('=== TEST SUITE: Meal Variety & Meal-Image Matching System ===\n');

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ ${message}`);
  } else {
    console.error(`  ✗ FAIL: ${message}`);
  }
}

// ─── Test Group 1: Exact Dish-to-Image Matching ────────────────────────────
console.log('1. Testing Exact Dish-to-Image Matching:');

const exactMatches = [
  ['Besan Chilla with Mint Chutney', 'breakfast', DISH_IMAGES.besan_chilla, 'Besan Chilla -> chilla photo'],
  ['Moong Dal Cheela with Tomato Chutney', 'breakfast', DISH_IMAGES.besan_chilla, 'Moong Dal Cheela -> chilla photo'],
  ['Rajma Masala, Brown Rice, Salad, Raita', 'lunch', DISH_IMAGES.rajma, 'Rajma Masala -> rajma photo'],
  ['Baked Sweet Potato Chips', 'snacks', DISH_IMAGES.sweet_potato, 'Sweet Potato -> sweet potato photo'],
  ['Dal Makhani, Rice, Roti', 'lunch', DISH_IMAGES.dal_makhani, 'Dal Makhani -> dal makhani photo'],
  ['Dal Tadka, Jeera Rice, Roti', 'lunch', DISH_IMAGES.dal_tadka, 'Dal Tadka -> dal tadka photo'],
  ['Palak Paneer, Roti (2), Jeera Rice', 'lunch', DISH_IMAGES.palak_paneer, 'Palak Paneer -> palak paneer photo'],
  ['Paneer Butter Masala, Naan, Dal Fry', 'lunch', DISH_IMAGES.paneer_butter_masala, 'Paneer Butter Masala -> paneer butter masala photo'],
  ['Matar Paneer, Pulao, Raita', 'lunch', DISH_IMAGES.matar_paneer, 'Matar Paneer -> matar paneer photo'],
  ['Aloo Paratha with Curd & Pickle', 'breakfast', DISH_IMAGES.aloo_paratha, 'Aloo Paratha -> aloo paratha photo'],
  ['Methi Thepla with Curd', 'breakfast', DISH_IMAGES.thepla_roti, 'Thepla -> thepla photo'],
  ['Chole Bhature with Onion & Pickle', 'lunch', DISH_IMAGES.chole, 'Chole -> chole photo'],
  ['Roasted Chana (Chickpeas) - 1 cup', 'snacks', DISH_IMAGES.roasted_chana, 'Roasted Chana -> roasted chana photo'],
  ['Roasted Makhana (Fox Nuts) - 1 bowl', 'snacks', DISH_IMAGES.makhana_nuts, 'Makhana -> makhana photo'],
  ['Sprouted Moong Salad with Lemon', 'snacks', DISH_IMAGES.sprouts_salad, 'Sprouts -> sprouts photo'],
  ['Idli Sambar with Tomato Chutney', 'breakfast', DISH_IMAGES.idli_sambar, 'Idli -> idli photo'],
  ['Masala Dosa with Sambar & Coconut Chutney', 'breakfast', DISH_IMAGES.masala_dosa, 'Dosa -> dosa photo'],
  ['Poha with Peanuts & Lemon', 'breakfast', DISH_IMAGES.poha, 'Poha -> poha photo'],
  ['Upma with Vegetables & Curry Leaves', 'breakfast', DISH_IMAGES.upma, 'Upma -> upma photo'],
  ['Moong Dal Khichdi with Curd', 'dinner', DISH_IMAGES.khichdi, 'Khichdi -> khichdi photo'],
  ['Dhokla (3 pcs) with Green Chutney', 'breakfast', DISH_IMAGES.dhokla, 'Dhokla -> dhokla photo'],
  ['Vegetable Biryani with Raita', 'lunch', DISH_IMAGES.biryani, 'Biryani -> biryani photo'],
  ['Fish Curry with Steamed Rice', 'dinner', DISH_IMAGES.fish_curry, 'Fish Curry -> fish curry photo'],
  ['Butter Chicken with Naan', 'dinner', DISH_IMAGES.butter_chicken, 'Butter Chicken -> butter chicken photo'],
  ['Egg Bhurji with Toast', 'breakfast', DISH_IMAGES.egg_bhurji, 'Egg Bhurji -> egg bhurji photo'],
];

exactMatches.forEach(([dish, slot, expected, desc]) => {
  const result = resolveMealImage(dish, slot);
  assert(result === expected, desc);
});

// ─── Test Group 2: Weekly Meal Rotation in Fallback Plan ───────────────────
console.log('\n2. Testing Fallback Plan Weekly Meal Rotation:');
const plan = generateFallbackPlan(4, 2000, { protein: 120, carbs: 230, fats: 65 }, 'vegetarian');
assert(plan.weeks.length === 4, 'Generated exactly 4 weeks');

const week1Breakfasts = plan.weeks[0].days.map(d => d.meals.breakfast.name);
const week2Breakfasts = plan.weeks[1].days.map(d => d.meals.breakfast.name);
const week3Breakfasts = plan.weeks[2].days.map(d => d.meals.breakfast.name);
const week4Breakfasts = plan.weeks[3].days.map(d => d.meals.breakfast.name);

// Check that no week shares any breakfast with any other week
const bOverlap1_2 = week1Breakfasts.filter(m => week2Breakfasts.includes(m)).length;
const bOverlap1_3 = week1Breakfasts.filter(m => week3Breakfasts.includes(m)).length;
const bOverlap2_3 = week2Breakfasts.filter(m => week3Breakfasts.includes(m)).length;
const bOverlap3_4 = week3Breakfasts.filter(m => week4Breakfasts.includes(m)).length;

assert(bOverlap1_2 === 0, 'Week 1 and Week 2 have 0 overlapping breakfasts');
assert(bOverlap1_3 === 0, 'Week 1 and Week 3 have 0 overlapping breakfasts');
assert(bOverlap2_3 === 0, 'Week 2 and Week 3 have 0 overlapping breakfasts');
assert(bOverlap3_4 === 0, 'Week 3 and Week 4 have 0 overlapping breakfasts');

const allBreakfasts = [...week1Breakfasts, ...week2Breakfasts, ...week3Breakfasts, ...week4Breakfasts];
assert(new Set(allBreakfasts).size === 28, 'All 28 breakfasts in 4-week plan are completely unique (28/28)');

const allLunches = plan.weeks.flatMap(w => w.days.map(d => d.meals.lunch.name));
assert(new Set(allLunches).size === 28, 'All 28 lunches in 4-week plan are completely unique (28/28)');

const allDinners = plan.weeks.flatMap(w => w.days.map(d => d.meals.dinner.name));
assert(new Set(allDinners).size === 28, 'All 28 dinners in 4-week plan are completely unique (28/28)');

const allSnacks = plan.weeks.flatMap(w => w.days.map(d => d.meals.snacks.name));
assert(new Set(allSnacks).size === 28, 'All 28 snacks in 4-week plan are completely unique (28/28)');

// ─── Test Group 3: Supplemental Week Generation (No Cloning) ───────────────
console.log('\n3. Testing Supplemental Week Generation (when Gemini returns < requested weeks):');

const partialGemini = {
  weeks: [
    {
      weekNumber: 1,
      days: [
        {
          dayNumber: 1,
          dayName: 'Monday',
          meals: {
            breakfast: { name: 'Besan Chilla with Mint Chutney', calories: 350, protein: 12, carbs: 45, fats: 8 },
            lunch: { name: 'Rajma Masala with Steamed Rice', calories: 550, protein: 22, carbs: 65, fats: 12 },
            dinner: { name: 'Palak Paneer with 2 Rotis', calories: 420, protein: 18, carbs: 50, fats: 10 },
            snacks: { name: 'Roasted Makhana', calories: 150, protein: 5, carbs: 20, fats: 4 }
          },
          totalCalories: 1470
        }
      ]
    }
  ]
};

const fixed = validateAndFixPlan(partialGemini, 4, 2000, { protein: 120, carbs: 230, fats: 65 }, 'vegetarian');
assert(fixed.weeks.length === 4, 'validateAndFixPlan expands 1-week Gemini response to 4 weeks');

const w1B = fixed.weeks[0].days[0].meals.breakfast.name;
const w2B = fixed.weeks[1].days[0].meals.breakfast.name;
const w3B = fixed.weeks[2].days[0].meals.breakfast.name;
const w4B = fixed.weeks[3].days[0].meals.breakfast.name;

assert(w1B !== w2B, `Week 1 (${w1B}) != Week 2 (${w2B})`);
assert(w2B !== w3B, `Week 2 (${w2B}) != Week 3 (${w3B})`);
assert(w3B !== w4B, `Week 3 (${w3B}) != Week 4 (${w4B})`);

// ─── Test Group 4: All 480 Meals in Database Resolve to Images ──────────────
console.log('\n4. Testing All 480 Database Meals Image Resolution:');
const prefs = ['vegetarian', 'non_vegetarian', 'vegan', 'diabetic_friendly'];
const slots = ['breakfast', 'lunch', 'dinner', 'snacks'];

let dbTotal = 0;
let validImageUrls = 0;

for (const p of prefs) {
  const db = getMealsByPreference(p);
  for (const s of slots) {
    const list = db[s] || [];
    for (const m of list) {
      dbTotal++;
      const img = resolveMealImage(m.name, s);
      if (img && img.startsWith('https://images.unsplash.com/photo-')) {
        validImageUrls++;
      }
    }
  }
}

assert(dbTotal === 480, `480 database meals inspected (${dbTotal}/480)`);
assert(validImageUrls === 480, `100% of database meals resolved to verified Unsplash photos (${validImageUrls}/480)`);

// ─── Final Summary ────────────────────────────────────────────────────────
console.log(`\n============================================================`);
console.log(`TEST SUMMARY: ${passedTests}/${totalTests} tests passed (${((passedTests/totalTests)*100).toFixed(1)}%)`);
console.log(`============================================================\n`);

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
