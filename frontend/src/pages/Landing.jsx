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
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button, Card, Badge } from '../components/ui';

const capabilityPillars = [
  {
    icon: Utensils,
    title: '100% Indian Ingredients',
    sub: 'From Rotis, Dals & Sabzis to Regional Thalis & Millets',
  },
  {
    icon: Target,
    title: 'Macro-Balanced Plans',
    sub: 'Pure Veg, Vegan, Non-Veg & Diabetic-Friendly',
  },
  {
    icon: ShieldCheck,
    title: 'Dietitian Guardrails',
    sub: 'Anti-carb stacking, daily variety & protein adequacy',
  },
  {
    icon: Activity,
    title: 'AI Plate Scanner & NutriBot',
    sub: 'Instant photo analysis & 24/7 nutrition coaching',
  },
];

const features = [
  {
    icon: Utensils,
    title: 'Authentic Indian Nutrition AI',
    description:
      'Unlike western apps, NutriGenie accurately calculates calories & macros for rotis, parathas, paneer bhurji, sambar, biryani, and regional dishes.',
    badge: 'Indian Cuisine',
    gradient: 'from-cyan-500 to-teal-500',
  },
  {
    icon: Dumbbell,
    title: 'Adaptive Home & Gym Workouts',
    description:
      'Personalized 7-day training cycles combining Yoga asanas, HIIT cardio, and progressive hypertrophy routines tailored to your fitness level.',
    badge: 'Hybrid Training',
    gradient: 'from-teal-500 to-emerald-500',
  },
  {
    icon: Scan,
    title: 'Smart Food Scanner',
    description:
      'Snap a photo of your plate. Our computer vision model identifies the food item, estimates portion size, and logs calories automatically.',
    badge: 'Computer Vision',
    gradient: 'from-blue-500 to-indigo-500',
  },
  {
    icon: Bot,
    title: 'NutriBot 24/7 Companion',
    description:
      'Have queries about intermittent fasting, late-night Indian snacks, or pre-workout carbs? NutriBot offers evidence-backed coaching anytime.',
    badge: 'Gemini AI Powered',
    gradient: 'from-indigo-500 to-purple-500',
  },
  {
    icon: LineChart,
    title: 'Bio-Metric Progress Analytics',
    description:
      'Interactive trend charts track weight trajectories, weekly calorie deficits, water hydration habits, and mood correlations.',
    badge: 'Data-Driven',
    gradient: 'from-emerald-500 to-cyan-500',
  },
  {
    icon: Target,
    title: 'Dietary Lifestyle Flexibility',
    description:
      'Full support for Pure Vegetarian, Jain, Eggetarian, Non-Veg, High-Protein, and Diabetic-friendly Indian meal compositions.',
    badge: 'Personalized',
    gradient: 'from-amber-500 to-rose-500',
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
    name: 'Priya Sharma',
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
    <div className="relative overflow-hidden">
      {/* ─── HERO SECTION ──────────────────────────────────────────────── */}
      <section className="relative pt-12 sm:pt-20 pb-20 sm:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300 text-xs sm:text-sm font-semibold shadow-sm">
              <Sparkles className="w-4 h-4 text-cyan-500 animate-pulse" />
              <span>India's #1 AI Diet & Fitness Platform</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-slate-900 dark:text-white">
              Smarter Nutrition,{' '}
              <span className="bg-gradient-to-r from-cyan-500 via-teal-400 to-indigo-600 bg-clip-text text-transparent">
                Rooted in Indian Food
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed mx-auto lg:mx-0">
              Personalized Indian diet plans, calorie & macro tracking, adaptive home/gym workouts, and 24/7 AI health coaching — designed specifically for your lifestyle and taste.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link to={user ? '/dashboard' : '/register'} className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  rightIcon={ArrowRight}
                  className="w-full sm:w-auto text-base shadow-lg shadow-cyan-500/25"
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
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                No credit card required
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                Veg, Non-Veg, Jain & Eggetarian
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                Instant Gemini AI Analysis
              </span>
            </div>
          </motion.div>

          {/* Right Hero Visual Card */}
          <div className="lg:col-span-5 relative">
            {/* Ambient Backlight Glow */}
            <div className="absolute -inset-2 bg-gradient-to-tr from-cyan-500/25 via-teal-500/20 to-indigo-500/30 rounded-3xl blur-2xl -z-10" />

            {/* Interactive Preview Glass Card */}
            <div className="glass-panel rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 border border-slate-200/80 dark:border-white/15">
              {/* Card Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                    NG
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                      Daily Health Snapshot
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Target: 1,850 kcal • High Protein
                    </p>
                  </div>
                </div>
                <Badge variant="accent" size="sm" dot>
                  On Track
                </Badge>
              </div>

              {/* Nutrition Architecture Row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-2xl bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-white/5">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Daily Energy</p>
                  <p className="text-lg font-extrabold text-cyan-600 dark:text-cyan-400 mt-0.5">1,850</p>
                  <p className="text-[10px] text-slate-400">kcal • 4 Slots</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-white/5">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Protein Target</p>
                  <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">110g</p>
                  <p className="text-[10px] text-slate-400">Goal Calibrated</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-white/5">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Diet Style</p>
                  <p className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400 mt-0.5">Regional</p>
                  <p className="text-[10px] text-slate-400">Indian Cuisine</p>
                </div>
              </div>

              {/* Sample Indian Meal Slot */}
              <div className="p-4 rounded-2xl bg-slate-100/60 dark:bg-slate-800/40 border border-slate-200/70 dark:border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-200">☀️ Balanced Lunch Thali</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">520 kcal</span>
                </div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  Paneer Bhurji (150g) + 2 Phulkas + Sprouted Moong Salad
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 font-medium">P: 28g</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 font-medium">C: 45g</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-300 font-medium">F: 16g</span>
                </div>
              </div>

              {/* Workout recommendation chip */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 border border-cyan-500/20 text-xs font-semibold">
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                  <Dumbbell className="w-4 h-4 text-cyan-500" />
                  <span>Today's Routine: Upper Body Hypertrophy & Yoga</span>
                </div>
                <span className="text-cyan-600 dark:text-cyan-400 font-bold">45 min</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CAPABILITIES STRIP ─────────────────────────────────────────── */}
      <section className="py-10 border-y border-slate-200/80 dark:border-white/10 bg-slate-100/50 dark:bg-slate-900/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {capabilityPillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-white/40 dark:bg-white/[0.02] border border-slate-200/40 dark:border-white/5"
                >
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      {pillar.title}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
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
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge variant="brand" size="md">
            Complete Health Ecosystem
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Engineered for Indian Bodies & Palates
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
            Nutrition isn't one-size-fits-all. NutriGenie understands the cultural nuances of Indian meals, festivals, fasting, and everyday home-cooked recipes.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
              >
                <Card hoverEffect glow="cyan" className="h-full flex flex-col p-6 sm:p-7">
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white shadow-md shadow-cyan-500/20`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant="neutral" size="sm">
                      {feature.badge}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2.5">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed flex-1">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ─── HOW IT WORKS SECTION ──────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-white/10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge variant="accent" size="md">
            Simple 3-Step Process
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            How NutriGenie Works
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
            From onboarding to your daily meals in under two minutes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {howItWorks.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.15 }}
                className="relative"
              >
                <div className="glass-panel rounded-3xl p-7 sm:p-8 h-full flex flex-col relative overflow-hidden">
                  <span className="text-5xl font-black text-cyan-500/20 dark:text-cyan-400/15 absolute top-5 right-6">
                    {step.step}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ─── TESTIMONIALS SECTION ──────────────────────────────────────── */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-white/10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge variant="purple" size="md">
            Real Transformations
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Loved by Fitness Enthusiasts Across India
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
            Real people achieving sustainable results without giving up their favorite foods.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
            >
              <Card className="h-full flex flex-col p-6 sm:p-7 relative">
                <Quote className="w-8 h-8 text-cyan-500/20 absolute top-6 right-6" />
                <div className="flex items-center space-x-1 text-amber-400 mb-4">
                  {[...Array(t.rating)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 italic mb-6 flex-1 leading-relaxed">
                  "{t.text}"
                </p>
                <div className="pt-4 border-t border-slate-200/80 dark:border-white/10">
                  <div className="font-bold text-slate-900 dark:text-white text-base">
                    {t.name}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {t.role}
                  </div>
                  <div className="mt-2 inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    {t.change}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── FINAL CONVERSION CTA ───────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden glass-panel p-8 sm:p-14 text-center space-y-6 border border-cyan-500/30 shadow-2xl">
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-gradient-to-br from-cyan-500/30 to-indigo-600/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-tr from-teal-500/30 to-emerald-500/30 rounded-full blur-3xl pointer-events-none" />

          <Badge variant="brand" size="md">
            Start Your Journey Today
          </Badge>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight max-w-2xl mx-auto">
            Ready to Transform Your Body with Food You Actually Love?
          </h2>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
            Join thousands of Indians achieving their health and fitness goals with personalized AI guidance.
          </p>

          <div className="pt-2">
            <Link to={user ? '/dashboard' : '/register'}>
              <Button variant="primary" size="lg" rightIcon={ArrowRight} className="text-base shadow-xl">
                {user ? 'Go to Your Dashboard' : 'Create Your Free Account'}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-200/80 dark:border-white/10 py-12 px-4 sm:px-6 lg:px-8 bg-slate-100/40 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
              NG
            </div>
            <span className="font-bold text-slate-800 dark:text-white">NutriGenie</span>
            <span>• AI Diet & Fitness Platform</span>
          </div>

          <div className="flex items-center space-x-6">
            <Link to="/login" className="hover:text-cyan-500 transition-colors">
              Login
            </Link>
            <Link to="/register" className="hover:text-cyan-500 transition-colors">
              Register
            </Link>
            <a href="#how-it-works" className="hover:text-cyan-500 transition-colors">
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