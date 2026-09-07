import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Utensils,
  Dumbbell,
  LineChart,
  Bot,
  Scan,
  Activity,
  Quote,
  Star,
  Target,
  TrendingUp,
  Award,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button, Card, Badge } from '../components/ui';

const capabilityPillars = [
  {
    icon: Utensils,
    title: '100% Indian Ingredients',
    sub: 'From Rotis, Dals & Sabzis to Regional Thalis & Millets',
    accent: 'text-[#34D399] bg-[#34D399]/10',
  },
  {
    icon: Target,
    title: 'Macro-Balanced Plans',
    sub: 'Pure Veg, Vegan, Non-Veg & Diabetic-Friendly',
    accent: 'text-[#7C6FF0] bg-[#7C6FF0]/10',
  },
  {
    icon: ShieldCheck,
    title: 'Dietitian Guardrails',
    sub: 'Anti-carb stacking, daily variety & protein adequacy',
    accent: 'text-[#34D399] bg-[#34D399]/10',
  },
  {
    icon: Activity,
    title: 'AI Plate Scanner & NutriBot',
    sub: 'Instant photo analysis & 24/7 nutrition coaching',
    accent: 'text-[#7C6FF0] bg-[#7C6FF0]/10',
  },
];

const features = [
  {
    icon: Utensils,
    title: 'Authentic Indian Nutrition AI',
    description:
      'Accurately calculates calories & macros for rotis, parathas, paneer bhurji, dal tadka, biryani, and regional dishes without forcing western substitutes.',
    badge: 'Indian Cuisine',
    badgeVariant: 'nutrition',
    iconColor: 'text-[#34D399] bg-[#34D399]/10',
  },
  {
    icon: Dumbbell,
    title: 'Adaptive Home & Gym Workouts',
    description:
      'Personalized 7-day training cycles combining Yoga asanas, HIIT cardio, and progressive hypertrophy routines tailored to your fitness level.',
    badge: 'Hybrid Training',
    badgeVariant: 'violet',
    iconColor: 'text-[#7C6FF0] bg-[#7C6FF0]/10',
  },
  {
    icon: Scan,
    title: 'Smart Food Scanner',
    description:
      'Snap a photo of your plate. Computer vision identifies the dish, estimates portion size, and logs calories & macros automatically.',
    badge: 'Computer Vision',
    badgeVariant: 'violet',
    iconColor: 'text-[#7C6FF0] bg-[#7C6FF0]/10',
  },
  {
    icon: Bot,
    title: 'NutriBot 24/7 Companion',
    description:
      'Ask queries about intermittent fasting, late-night Indian snacks, or pre-workout carbs. NutriBot provides evidence-backed coaching anytime.',
    badge: 'Gemini AI Powered',
    badgeVariant: 'violet',
    iconColor: 'text-[#7C6FF0] bg-[#7C6FF0]/10',
  },
  {
    icon: LineChart,
    title: 'Bio-Metric Progress Analytics',
    description:
      'Interactive trend charts track weight trajectories, weekly calorie deficits, water hydration habits, and mood correlations over time.',
    badge: 'Data-Driven',
    badgeVariant: 'nutrition',
    iconColor: 'text-[#34D399] bg-[#34D399]/10',
  },
  {
    icon: Target,
    title: 'Dietary Lifestyle Flexibility',
    description:
      'Full support for Pure Vegetarian, Jain (no root veggies), Eggetarian, Non-Veg, High-Protein, and Diabetic-friendly Indian meal compositions.',
    badge: 'Personalized',
    badgeVariant: 'nutrition',
    iconColor: 'text-[#34D399] bg-[#34D399]/10',
  },
];

const howItWorks = [
  {
    step: '01',
    title: 'Input Your Bio-Metrics & Cuisine Preference',
    description:
      'Set your age, weight, height, daily activity level, and dietary style (Vegetarian, Jain, Eggetarian, Non-Veg).',
    icon: Activity,
  },
  {
    step: '02',
    title: 'AI Crafts Your Custom Routine',
    description:
      'Our nutrition engine generates target calories, macros, and scheduled meal slots using wholesome Indian ingredients.',
    icon: Sparkles,
  },
  {
    step: '03',
    title: 'Execute, Track & Celebrate Milestones',
    description:
      'Check off meals, log workout days, scan your meals on the go, and watch your body transform week after week.',
    icon: ShieldCheck,
  },
];

const testimonials = [
  {
    name: 'Ankit Yadav',
    role: 'Software Engineer, Bengaluru',
    change: 'Lost 14 kg in 4 Months',
    text: 'Every other fitness app told me to eat oatmeal and bland chicken breast. NutriGenie built my deficit around paneer parathas, dal tadka, and curd. I lost 14 kg without ever feeling deprived.',
    rating: 5,
  },
  {
    name: 'Rahul Verma',
    role: 'Product Manager, Delhi NCR',
    change: 'Gained 7 kg Lean Muscle',
    text: 'Getting enough vegetarian protein on an Indian diet was tough until NutriGenie mapped out high-protein soya, sattu, sprouted moong, and whey combos. The workout recommendations are spot on.',
    rating: 5,
  },
  {
    name: 'Anjali Patel',
    role: 'Architect, Ahmedabad',
    change: 'Reversed Pre-Diabetes & Toned Up',
    text: 'The Jain diet option is amazing. Finding an app that actually respects no-root-vegetables while maintaining perfect nutritional balance was life-changing. Highly recommend to everyone.',
    rating: 5,
  },
];

const Landing = () => {
  const { user } = useAuth();

  return (
    <div className="relative overflow-hidden bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-[#F3F4F6] transition-colors duration-300">
      {/* ─── HERO SECTION (FIRST FOLD) ─────────────────────────────────── */}
      <section className="relative pt-10 sm:pt-16 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#7C6FF0]/10 border border-[#7C6FF0]/25 text-[#6355DE] dark:text-[#C7D2FE] text-xs sm:text-sm font-semibold shadow-sm">
              <Sparkles className="w-4 h-4 text-[#7C6FF0] dark:text-[#A5B4FC] animate-pulse" />
              <span>AI-Powered Nutrition & Fitness</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] text-slate-900 dark:text-[#F3F4F6]">
              Transform Your Health,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C6FF0] via-indigo-400 to-[#34D399]">
                Rooted in Indian Nutrition
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-slate-600 dark:text-[#9CA3AF] max-w-2xl leading-relaxed mx-auto lg:mx-0">
              Personalized Indian diet plans, calorie & macro tracking, adaptive home/gym workouts, and 24/7 AI health coaching — calibrated for your favorite dishes and daily routine.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link to={user ? '/dashboard' : '/register'} className="w-full sm:w-auto">
                <Button
                  variant="violet"
                  size="lg"
                  rightIcon={ArrowRight}
                  className="w-full sm:w-auto text-base shadow-lg shadow-[#7C6FF0]/20"
                >
                  {user ? 'Open Dashboard' : 'Get Started Free'}
                </Button>
              </Link>
              <a href="#how-it-works" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto text-base">
                  See How It Works
                </Button>
              </a>
            </div>

            {/* Social proof bullet points */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs sm:text-sm text-slate-500 dark:text-[#9CA3AF]">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#34D399] shrink-0" />
                No credit card required
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#34D399] shrink-0" />
                Veg, Non-Veg, Jain & Eggetarian
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#34D399] shrink-0" />
                Mifflin-St Jeor Calibrated
              </span>
            </div>

            {/* Grounded Capability Highlights Bar (No fake user stats) */}
            <div className="pt-4 grid grid-cols-3 gap-3 border-t border-slate-200/80 dark:border-white/[0.08]">
              <div className="p-3 rounded-2xl bg-white/70 dark:bg-[#161B2E] border border-slate-200/60 dark:border-white/[0.08] text-center lg:text-left">
                <div className="text-base sm:text-lg font-bold text-[#7C6FF0] dark:text-[#A5B4FC]">100% Indian</div>
                <div className="text-[11px] sm:text-xs text-slate-500 dark:text-[#9CA3AF] mt-0.5">Rotis, Dals & Thalis</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/70 dark:bg-[#161B2E] border border-slate-200/60 dark:border-white/[0.08] text-center lg:text-left">
                <div className="text-base sm:text-lg font-bold text-[#34D399]">Clinical BMR</div>
                <div className="text-[11px] sm:text-xs text-slate-500 dark:text-[#9CA3AF] mt-0.5">Mifflin-St Jeor Precision</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/70 dark:bg-[#161B2E] border border-slate-200/60 dark:border-white/[0.08] text-center lg:text-left">
                <div className="text-base sm:text-lg font-bold text-[#7C6FF0] dark:text-[#A5B4FC]">Gemini 1.5</div>
                <div className="text-[11px] sm:text-xs text-slate-500 dark:text-[#9CA3AF] mt-0.5">Plate Scanner & Coaching</div>
              </div>
            </div>
          </motion.div>

          {/* Right Hero Visual: Food & Fitness Composition (First Fold Prominence) */}
          <div className="lg:col-span-5 relative">
            {/* Ambient Low-Opacity Glow (Calm Dark) */}
            <div className="absolute -inset-2 bg-gradient-to-tr from-[#7C6FF0]/15 via-transparent to-[#34D399]/15 rounded-3xl blur-2xl -z-10 pointer-events-none" />

            {/* Main Visual Container */}
            <div className="relative rounded-3xl overflow-hidden bg-white/80 dark:bg-[#161B2E] border border-slate-200/80 dark:border-white/[0.08] shadow-2xl p-4 sm:p-5 space-y-4">
              
              {/* Image Collage / Split: Rich Indian Food Thali + Active Lifestyle */}
              <div className="grid grid-cols-12 gap-3 relative">
                {/* Primary Food Image (7 cols) */}
                <div className="col-span-7 relative rounded-2xl overflow-hidden shadow-md group">
                  <img
                    src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"
                    alt="Nutritious High-Protein Meal with Fresh Greens & Sprouts"
                    className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-xs">
                    <span className="font-semibold drop-shadow">Fresh High-Protein Thali</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#34D399] text-slate-950 font-bold text-[11px]">
                      520 kcal
                    </span>
                  </div>
                </div>

                {/* Secondary Workout / Training Image (5 cols) */}
                <div className="col-span-5 relative rounded-2xl overflow-hidden shadow-md group">
                  <img
                    src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80"
                    alt="Active strength & mobility workout"
                    className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-xs">
                    <span className="font-semibold drop-shadow">Hybrid Training</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#7C6FF0] text-white font-bold text-[11px]">
                      45 min
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating "Today's Meal Plan" Mini-Card (Nutrition prominent) */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1B2138] border border-slate-200/70 dark:border-white/[0.08] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=120&q=80"
                      alt="Lunch dish thumbnail"
                      className="w-8 h-8 rounded-lg object-cover shrink-0 shadow-sm border border-white/20"
                    />
                    <span className="text-xs font-bold text-slate-800 dark:text-[#F3F4F6]">
                      Today's Lunch: Paneer Bhurji & Moong Sprouts
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#34D399]">
                    520 kcal
                  </span>
                </div>
                {/* Calorie & Macro Pills */}
                <div className="flex items-center gap-2 pt-0.5">
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#34D399]/15 text-emerald-700 dark:text-[#34D399] font-semibold">
                    Protein: 28g
                  </span>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#7C6FF0]/15 text-[#6355DE] dark:text-[#A5B4FC] font-semibold">
                    Carbs: 45g
                  </span>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 font-semibold">
                    Fats: 16g
                  </span>
                </div>
              </div>

              {/* Daily Progress Overlay Bar */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1B2138] border border-slate-200/70 dark:border-white/[0.08] space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#7C6FF0]" />
                    <span className="font-semibold text-slate-700 dark:text-[#F3F4F6]">Daily Progress Snapshot</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#34D399]/15 text-emerald-700 dark:text-[#34D399] text-[11px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
                    On Track
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                  <div className="p-2 rounded-xl bg-white/60 dark:bg-[#161B2E] border border-slate-200/50 dark:border-white/[0.05]">
                    <div className="text-[10px] text-slate-500 dark:text-[#9CA3AF]">Energy</div>
                    <div className="font-bold text-slate-800 dark:text-[#F3F4F6] mt-0.5">1,850</div>
                    <div className="text-[9px] text-[#34D399]">kcal target</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white/60 dark:bg-[#161B2E] border border-slate-200/50 dark:border-white/[0.05]">
                    <div className="text-[10px] text-slate-500 dark:text-[#9CA3AF]">Protein</div>
                    <div className="font-bold text-slate-800 dark:text-[#F3F4F6] mt-0.5">110g</div>
                    <div className="text-[9px] text-[#34D399]">goal met</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white/60 dark:bg-[#161B2E] border border-slate-200/50 dark:border-white/[0.05]">
                    <div className="text-[10px] text-slate-500 dark:text-[#9CA3AF]">Hydration</div>
                    <div className="font-bold text-slate-800 dark:text-[#F3F4F6] mt-0.5">2.8 L</div>
                    <div className="text-[9px] text-[#7C6FF0]">optimal</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CAPABILITIES STRIP ─────────────────────────────────────────── */}
      <section className="py-8 border-y border-slate-200/80 dark:border-white/[0.08] bg-slate-100/50 dark:bg-[#161B2E]/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {capabilityPillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-white/60 dark:bg-[#161B2E] border border-slate-200/60 dark:border-white/[0.08]"
                >
                  <div className={`p-2.5 rounded-xl ${pillar.accent} shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-slate-900 dark:text-[#F3F4F6]">
                      {pillar.title}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-[#9CA3AF] leading-relaxed">
                      {pillar.sub}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── FEATURE GRID SECTION ──────────────────────────────────────── */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge variant="violet" size="md">
            Complete Health Ecosystem
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-[#F3F4F6] tracking-tight">
            Engineered for Indian Bodies & Palates
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-[#9CA3AF]">
            Nutrition isn't one-size-fits-all. NutriGenie respects the cultural nuances of Indian meals, festivals, fasting, and everyday home-cooked recipes.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="h-full"
              >
                <Card hoverEffect className="h-full flex flex-col p-6 sm:p-7 bg-white dark:bg-[#161B2E] border-slate-200/80 dark:border-white/[0.08]">
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-2xl ${feature.iconColor} flex items-center justify-center`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant={feature.badgeVariant} size="sm">
                      {feature.badge}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-[#F3F4F6] mb-2.5">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-[#9CA3AF] leading-relaxed flex-1">
                    {feature.description}
                  </p>
                </Card>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── TRACK EVERY MILESTONE SECTION ─────────────────────────────── */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-white/[0.08]">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Text & Milestones */}
          <div className="lg:col-span-6 space-y-6">
            <Badge variant="violet" size="md">
              Progress & Habit Tracking
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-[#F3F4F6] tracking-tight leading-tight">
              Track Every{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C6FF0] to-[#34D399]">
                Milestone
              </span>
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-[#9CA3AF] leading-relaxed">
              Sustainable health happens when you see clear feedback. NutriGenie calculates daily calorie deficits based on your real logged weight and provides transparent charts for weekly trends.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-[#161B2E] border border-slate-200/70 dark:border-white/[0.08]">
                <div className="p-2.5 rounded-xl bg-[#7C6FF0]/10 text-[#7C6FF0] shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-[#F3F4F6]">Daily Weight & Deficit Sync</h4>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-[#9CA3AF] mt-0.5">
                    Logging your morning weight automatically updates your BMR, TDEE, and calorie deficit without resetting your customized meal plan.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-[#161B2E] border border-slate-200/70 dark:border-white/[0.08]">
                <div className="p-2.5 rounded-xl bg-[#34D399]/10 text-[#34D399] shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-[#F3F4F6]">Macro Compliance Guardrails</h4>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-[#9CA3AF] mt-0.5">
                    Keep carbs and proteins in balance. NutriGenie flags excessive carb-stacking and ensures adequate vegetarian protein daily.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-[#161B2E] border border-slate-200/70 dark:border-white/[0.08]">
                <div className="p-2.5 rounded-xl bg-[#7C6FF0]/10 text-[#7C6FF0] shrink-0">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-[#F3F4F6]">Consistency Streaks</h4>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-[#9CA3AF] mt-0.5">
                    Build lifelong habits with daily checklists for meals, hydration glasses, and training sessions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Showcase Image */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#161B2E]">
              <img
                src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop&q=80"
                alt="Fitness training and progress monitoring"
                className="w-full h-80 sm:h-96 object-cover"
              />
              {/* Floating Milestone Card */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/90 dark:bg-[#161B2E]/95 backdrop-blur-md border border-slate-200/70 dark:border-white/[0.1] shadow-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-[#F3F4F6]">
                    Weekly Milestone Reached
                  </span>
                  <Badge variant="nutrition" size="sm" dot>
                    Verified
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-slate-100/70 dark:bg-[#1B2138]">
                    <div className="text-[10px] text-slate-500 dark:text-[#9CA3AF]">Weight Trend</div>
                    <div className="font-bold text-[#34D399] mt-0.5">-0.8 kg</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-100/70 dark:bg-[#1B2138]">
                    <div className="text-[10px] text-slate-500 dark:text-[#9CA3AF]">Avg Deficit</div>
                    <div className="font-bold text-[#7C6FF0] mt-0.5">420 kcal</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-100/70 dark:bg-[#1B2138]">
                    <div className="text-[10px] text-slate-500 dark:text-[#9CA3AF]">Consistency</div>
                    <div className="font-bold text-slate-800 dark:text-[#F3F4F6] mt-0.5">7 / 7 Days</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── NUTRITION MADE DELICIOUS SECTION ──────────────────────────── */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-white/[0.08]">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Showcase Food Image */}
          <div className="lg:col-span-6 relative order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#161B2E]">
              <img
                src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=600&fit=crop&q=80"
                alt="Nutritious wholesome Indian cuisine bowls"
                className="w-full h-80 sm:h-96 object-cover"
              />
              {/* Floating Dish Pill */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/90 dark:bg-[#161B2E]/95 backdrop-blur-md border border-slate-200/70 dark:border-white/[0.1] shadow-xl">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-[#F3F4F6] mb-1">
                  <span>Authentic Home Food • Zero Deprivation</span>
                  <span className="text-[#34D399]">Curated Macros</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-[#9CA3AF]">
                  Dal Tadka, Paneer Bhurji, Sambar, Poha & Phulkas tailored to your daily calorie goals.
                </p>
              </div>
            </div>
          </div>

          {/* Right Text Content */}
          <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
            <Badge variant="nutrition" size="md">
              Authentic Indian Food
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-[#F3F4F6] tracking-tight leading-tight">
              Nutrition Made{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#34D399] to-teal-400">
                Delicious
              </span>
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-[#9CA3AF] leading-relaxed">
              Enjoy authentic Indian meals while consistently hitting your fitness goals. Forget tasteless boiled chicken breasts or imported kale. NutriGenie crafts high-protein, calorie-calibrated plans around foods you genuinely love.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white dark:bg-[#161B2E] border border-slate-200/70 dark:border-white/[0.08]">
                <div className="text-2xl mb-1">🍛</div>
                <div className="text-base font-bold text-slate-900 dark:text-[#F3F4F6]">100+ Regional Dishes</div>
                <div className="text-xs text-slate-500 dark:text-[#9CA3AF] mt-0.5">Accurate macro breakdowns for local recipes</div>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-[#161B2E] border border-slate-200/70 dark:border-white/[0.08]">
                <div className="text-2xl mb-1">🥗</div>
                <div className="text-base font-bold text-slate-900 dark:text-[#F3F4F6]">Pure Veg & Jain</div>
                <div className="text-xs text-slate-500 dark:text-[#9CA3AF] mt-0.5">Root-veg-free & high-protein vegetarian</div>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-[#161B2E] border border-slate-200/70 dark:border-white/[0.08]">
                <div className="text-2xl mb-1">⚖️</div>
                <div className="text-base font-bold text-slate-900 dark:text-[#F3F4F6]">Balanced Thalis</div>
                <div className="text-xs text-slate-500 dark:text-[#9CA3AF] mt-0.5">Anti-carb stacking & high satiety</div>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-[#161B2E] border border-slate-200/70 dark:border-white/[0.08]">
                <div className="text-2xl mb-1">📷</div>
                <div className="text-base font-bold text-slate-900 dark:text-[#F3F4F6]">AI Plate Scanner</div>
                <div className="text-xs text-slate-500 dark:text-[#9CA3AF] mt-0.5">Snap and log calories in seconds</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS SECTION ──────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-white/[0.08]">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge variant="violet" size="md">
            Simple 3-Step Process
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-[#F3F4F6] tracking-tight">
            How NutriGenie Works
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-[#9CA3AF]">
            From onboarding to your daily meals in under two minutes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {howItWorks.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className="relative h-full"
              >
                <div className="rounded-3xl p-7 sm:p-8 h-full flex flex-col relative overflow-hidden bg-white dark:bg-[#161B2E] border border-slate-200/80 dark:border-white/[0.08] shadow-sm">
                  <span className="text-5xl font-black text-[#7C6FF0]/20 dark:text-[#7C6FF0]/15 absolute top-5 right-6">
                    {step.step}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-[#7C6FF0]/10 text-[#7C6FF0] dark:text-[#A5B4FC] flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-[#F3F4F6] mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-[#9CA3AF] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── TESTIMONIALS SECTION ──────────────────────────────────────── */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-white/[0.08]">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge variant="violet" size="md">
            Real Transformations
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-[#F3F4F6] tracking-tight">
            Loved by Fitness Enthusiasts Across India
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-[#9CA3AF]">
            Real people achieving sustainable results without giving up their favorite foods.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="h-full"
            >
              <Card className="h-full flex flex-col p-6 sm:p-7 relative bg-white dark:bg-[#161B2E] border-slate-200/80 dark:border-white/[0.08] shadow-sm">
                <Quote className="w-8 h-8 text-[#7C6FF0]/20 absolute top-6 right-6" />
                <div className="flex items-center space-x-1 text-amber-400 mb-4">
                  {[...Array(t.rating)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-slate-600 dark:text-[#F3F4F6] italic mb-6 flex-1 leading-relaxed">
                  "{t.text}"
                </p>
                <div className="pt-4 border-t border-slate-200/80 dark:border-white/[0.08]">
                  <div className="font-bold text-slate-900 dark:text-[#F3F4F6] text-base">
                    {t.name}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-[#9CA3AF]">
                    {t.role}
                  </div>
                  <div className="mt-2 inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#34D399]/15 text-emerald-700 dark:text-[#34D399]">
                    {t.change}
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FINAL CONVERSION CTA (CONTAINED CARD, CALM DARK PALETTE) ───── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-14 text-center space-y-6 bg-white dark:bg-[#161B2E] border border-slate-200/80 dark:border-white/[0.08] shadow-2xl">
          {/* Subtle low-opacity glow wash (15-20%) - Not full bleed */}
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#7C6FF0]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-[#34D399]/15 rounded-full blur-3xl pointer-events-none" />

          <Badge variant="violet" size="md">
            Start Your Journey Today
          </Badge>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-[#F3F4F6] tracking-tight max-w-2xl mx-auto">
            Ready to Transform Your Body with Food You Actually Love?
          </h2>

          <p className="text-base sm:text-lg text-slate-600 dark:text-[#9CA3AF] max-w-xl mx-auto">
            Join thousands of Indians achieving their health and fitness goals with personalized AI guidance.
          </p>

          <div className="pt-2">
            <Link to={user ? '/dashboard' : '/register'}>
              <Button variant="violet" size="lg" rightIcon={ArrowRight} className="text-base shadow-xl shadow-[#7C6FF0]/25">
                {user ? 'Go to Your Dashboard' : 'Create Your Free Account'}
              </Button>
            </Link>
          </div>

          <p className="text-xs text-slate-500 dark:text-[#9CA3AF] pt-2">
            No credit card required • Pure Veg, Jain, Eggetarian & Non-Veg friendly
          </p>
        </div>
      </section>

      {/* ─── FOOTER ────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-200/80 dark:border-white/[0.08] py-12 px-4 sm:px-6 lg:px-8 bg-slate-100/50 dark:bg-[#0B0F19]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-500 dark:text-[#9CA3AF]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#7C6FF0] flex items-center justify-center text-white font-bold text-xs">
              NG
            </div>
            <span className="font-bold text-slate-800 dark:text-[#F3F4F6]">NutriGenie</span>
            <span>• AI Nutrition & Fitness Platform</span>
          </div>

          <div className="flex items-center space-x-6">
            <Link to="/login" className="hover:text-[#7C6FF0] dark:hover:text-[#A5B4FC] transition-colors">
              Login
            </Link>
            <Link to="/register" className="hover:text-[#7C6FF0] dark:hover:text-[#A5B4FC] transition-colors">
              Register
            </Link>
            <a href="#how-it-works" className="hover:text-[#7C6FF0] dark:hover:text-[#A5B4FC] transition-colors">
              How it works
            </a>
          </div>

          <p className="text-xs">
            © {new Date().getFullYear()} NutriGenie. Designed for Indian health & wellness.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;