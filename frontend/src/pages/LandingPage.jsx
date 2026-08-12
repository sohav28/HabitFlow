import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Dumbbell,
  BarChart3,
  Droplets,
  Flame,
  Award,
  ShieldCheck,
  Activity,
  HeartPulse,
  Timer,
} from 'lucide-react';
import Logo from '../components/Logo';

const heroStreak = [
  'done','done','done','empty','done','done','done',
  'done','done','empty','done','done','done','done',
  'empty','done','done','done','done','done','done',
  'done','empty','done','done','done','done','done',
  'done','done','done','empty','done','done','today',
];

const stats = [
  { label: 'Active Streak Record', value: '28 Days' },
  { label: 'Hydration Logged', value: '500k L' },
  { label: 'Workouts Crushed', value: '1.2M+' },
];

const workoutPlans = [
  {
    title: 'Chest & Triceps Hypertrophy',
    category: 'Upper Body',
    duration: '45 mins',
    exercises: '6 exercises',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80',
    desc: 'Heavy compound presses combined with targeted isolation supersets for max chest growth.'
  },
  {
    title: 'Back & Biceps Power Matrix',
    category: 'Pull Power',
    duration: '50 mins',
    exercises: '7 exercises',
    image: 'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?auto=format&fit=crop&w=600&q=80',
    desc: 'Build width and thickness with structured pull-up progressions and rowing variations.'
  },
  {
    title: 'Core & Lower Body Engine',
    category: 'Lower & Abs',
    duration: '55 mins',
    exercises: '8 exercises',
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80',
    desc: 'Explosive leg drive matched with deep core stability circuits to protect your lower back.'
  }
];

const features = [
  {
    icon: Dumbbell,
    accent: 'flame',
    title: 'Targeted Body Workouts',
    desc: 'Chest, back, core, and legs — structured sets and reps with a live rest timer built right in.',
  },
  {
    icon: Droplets,
    accent: 'ocean',
    title: 'One-Tap Hydration Tracker',
    desc: 'Quick-add 250, 500, or 750ml and watch your daily progress ring close instantly.',
  },
  {
    icon: Flame,
    accent: 'flame',
    title: 'Streak Freeze Protection',
    desc: 'A rest day or unexpected hiccup shouldn’t erase weeks of hard-earned momentum.',
  },
  {
    icon: BarChart3,
    accent: 'moss',
    title: 'Deep Fitness Analytics',
    desc: 'Visualize weekly, monthly, and yearly consistency trends, calories, and active output.',
  },
  {
    icon: Award,
    accent: 'ocean',
    title: 'Milestone Achievement Badges',
    desc: 'Unlock special badges at 7, 30, and 100 days to celebrate your physical milestones.',
  },
  {
    icon: ShieldCheck,
    accent: 'moss',
    title: 'Secure & Private Profile',
    desc: 'Your routine history, weight metrics, and personal goals stay fully encrypted behind JWT auth.',
  },
];

const accentClasses = {
  flame: 'bg-flame-soft dark:bg-flame-soft-dark text-flame',
  ocean: 'bg-ocean-soft dark:bg-ocean-soft-dark text-ocean',
  moss: 'bg-moss-soft dark:bg-moss-soft-dark text-moss',
};

const testimonials = [
  {
    quote: "The streak freeze feature saved my consistency when I caught the flu. It's the ultimate fitness accountability partner.",
    name: "Marcus Vance",
    role: "CrossFit Athlete"
  },
  {
    quote: "One-tap water logging and structured body-part splits completely streamlined my daily gym routine.",
    name: "Priya Sharma",
    role: "Fitness Coach"
  }
];

export default function LandingPage() {
  const [hoveredCell, setHoveredCell] = useState(null);

  return (
    <div className="min-h-screen bg-paper dark:bg-ink-dark text-ink dark:text-paper-dark selection:bg-flame selection:text-white">

      {/* Nav */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-paper/80 dark:bg-ink-dark/80 border-b border-line dark:border-line-dark">
        <div className="max-w-6xl mx-auto w-full px-6 py-4 flex justify-between items-center">
          <Logo size={26} />
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-semibold text-ink-soft dark:text-ink-soft-dark hover:text-ink dark:hover:text-paper-dark transition px-3 py-2"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="bg-flame hover:bg-flame/90 text-white px-5 py-2.5 rounded-md text-sm font-semibold transition shadow-md shadow-flame/20"
            >
              Get started free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main>
        <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 grid lg:grid-cols-[1.1fr_0.9fr] gap-14 items-center">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider bg-flame/10 text-flame px-3.5 py-1.5 rounded-full border border-flame/25">
              <Activity size={14} className="animate-pulse" /> Elite Fitness &amp; Habit Tracker
            </div>

            <h1 className="font-display text-4xl md:text-6xl font-semibold leading-[1.08] tracking-tight">
              Build unstoppable power,<br />one <span className="text-flame">active day</span> at a time.
            </h1>

            <p className="text-ink-soft dark:text-ink-soft-dark text-base md:text-lg leading-relaxed max-w-lg">
              HabitFlow combines heavy-duty workout routines, intelligent hydration tracking, 
              and visual streak grids to transform your raw effort into long-term habits.
            </p>

            <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
              <Link
                to="/register"
                className="bg-flame hover:bg-flame/90 text-white px-7 py-3.5 rounded-md text-sm font-semibold flex items-center justify-center gap-2 transition shadow-lg shadow-flame/30 hover:-translate-y-0.5"
              >
                Start Training Free <ArrowRight size={17} />
              </Link>
              <Link
                to="/login"
                className="border border-line dark:border-line-dark hover:border-ink/40 dark:hover:border-paper-dark/40 px-7 py-3.5 rounded-md text-sm font-semibold transition flex items-center justify-center hover:bg-line/20"
              >
                Explore Live Demo
              </Link>
            </div>

            {/* Clean Athletic Stat Callouts */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-line dark:border-line-dark font-mono">
              {stats.map((s) => (
                <div key={s.label} className="p-4 rounded-xl bg-line/10 dark:bg-surface-dark border border-line dark:border-line-dark shadow-sm">
                  <div className="text-lg md:text-2xl font-bold text-ink dark:text-paper-dark">{s.value}</div>
                  <div className="text-[11px] text-ink-soft dark:text-ink-soft-dark mt-1 uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Streak Grid Card */}
          <div className="bg-ink dark:bg-surface-dark text-paper-dark rounded-2xl p-6 sm:p-8 shadow-2xl border border-line-dark relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-flame/15 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between mb-5">
              <span className="font-mono text-xs text-ink-soft-dark uppercase tracking-wider flex items-center gap-1.5">
                <HeartPulse size={14} className="text-flame" /> 35-Day Performance Matrix
              </span>
              <span className="flex items-center gap-1.5 text-flame font-mono text-xs font-semibold bg-flame/20 px-3 py-1 rounded-full border border-flame/30">
                <Flame size={13} /> 12 Day Streak
              </span>
            </div>

            <div className="grid grid-cols-7 gap-2.5">
              {heroStreak.map((s, i) => (
                <div
                  key={i}
                  onMouseEnter={() => setHoveredCell(s)}
                  onMouseLeave={() => setHoveredCell(null)}
                  className={
                    'aspect-square rounded-[6px] transition-all duration-200 cursor-pointer hover:scale-110 ' +
                    (s === 'done' ? 'bg-flame shadow-sm shadow-flame/50' : s === 'today' ? 'border-2 border-flame bg-flame/30 animate-pulse' : 'bg-white/10 hover:bg-white/20')
                  }
                  title={s === 'today' ? 'Today' : s === 'done' ? 'Completed' : 'Missed'}
                />
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
              <span className="text-ink-soft-dark">
                {hoveredCell ? `Status: ${hoveredCell.toUpperCase()}` : 'Hover grid blocks to inspect'}
              </span>
              <span className="text-flame font-semibold">94% Output Rate</span>
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-6">
          <div className="border-t border-line dark:border-line-dark" />
        </div>

        {/* Exercise Plans Section with Images */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="space-y-3">
              <span className="font-mono text-xs uppercase tracking-wider text-flame font-semibold">Targeted Routines</span>
              <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">Structured Exercise Plans</h2>
              <p className="text-sm text-ink-soft dark:text-ink-soft-dark max-w-lg">
                Engineered body-part splits with built-in rest timers and progression tracking designed for maximum physical gains.
              </p>
            </div>
            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-flame hover:underline"
            >
              View all routines <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {workoutPlans.map((plan, idx) => (
              <div 
                key={idx}
                className="rounded-2xl border border-line dark:border-line-dark bg-paper dark:bg-surface-dark overflow-hidden hover:border-flame/50 transition-all duration-300 hover:shadow-xl flex flex-col group"
              >
                <div className="relative h-48 overflow-hidden bg-line/20">
                  <img 
                    src={plan.image} 
                    alt={plan.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-3 left-3 bg-ink/80 backdrop-blur-md text-white text-[11px] font-mono px-2.5 py-1 rounded-md uppercase tracking-wider">
                    {plan.category}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-display font-semibold text-lg text-ink dark:text-paper-dark group-hover:text-flame transition-colors">
                      {plan.title}
                    </h3>
                    <p className="text-xs text-ink-soft dark:text-ink-soft-dark leading-relaxed">
                      {plan.desc}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-line dark:border-line-dark flex items-center justify-between text-xs font-mono text-ink-soft dark:text-ink-soft-dark">
                    <span className="flex items-center gap-1"><Timer size={13} className="text-flame" /> {plan.duration}</span>
                    <span className="flex items-center gap-1"><Dumbbell size={13} className="text-flame" /> {plan.exercises}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-6">
          <div className="border-t border-line dark:border-line-dark" />
        </div>

        {/* Features Grid */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="max-w-xl mb-14 space-y-3">
            <span className="font-mono text-xs uppercase tracking-wider text-flame font-semibold">Built For Performance</span>
            <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">Everything your routine demands</h2>
            <p className="text-sm text-ink-soft dark:text-ink-soft-dark">Designed to eliminate friction so you can focus entirely on your physical progression.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div 
                  key={f.title} 
                  className="p-6 rounded-2xl border border-line dark:border-line-dark bg-paper dark:bg-surface-dark hover:border-flame/60 transition-all duration-300 hover:shadow-xl space-y-4 group"
                >
                  <div className={`p-3 w-fit rounded-xl ${accentClasses[f.accent]} group-hover:scale-110 transition-transform`}>
                    <Icon size={22} />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-ink dark:text-paper-dark">{f.title}</h3>
                  <p className="text-sm text-ink-soft dark:text-ink-soft-dark leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-6">
          <div className="border-t border-line dark:border-line-dark" />
        </div>

        {/* Testimonials */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center max-w-lg mx-auto mb-12 space-y-2">
            <span className="font-mono text-xs uppercase tracking-wider text-flame font-semibold">Athlete Verified</span>
            <h2 className="font-display text-2xl md:text-3xl font-semibold">Trusted by serious trainers</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((t, idx) => (
              <div key={idx} className="p-7 rounded-2xl border border-line dark:border-line-dark bg-line/10 dark:bg-surface-dark/60 space-y-4 shadow-sm">
                <p className="text-sm italic text-ink dark:text-paper-dark leading-relaxed">"{t.quote}"</p>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-ink-soft dark:text-ink-soft-dark font-mono mt-0.5">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA Banner */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="rounded-3xl bg-ink dark:bg-surface-dark text-paper-dark p-10 md:p-14 text-center space-y-6 relative overflow-hidden shadow-2xl border border-line-dark">
            <div className="absolute inset-0 bg-gradient-to-r from-flame/10 via-transparent to-ocean/15 pointer-events-none" />
            <div className="inline-flex p-3 bg-flame/20 text-flame rounded-2xl mb-1 border border-flame/30">
              <Flame size={28} />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight relative z-10">
              Ready to build your ultimate streak?
            </h2>
            <p className="text-ink-soft-dark max-w-md mx-auto text-sm relative z-10">
              Join athletes worldwide tracking workouts, crushing hydration goals, and building unbreakable routines.
            </p>
            <div className="pt-2 relative z-10">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-flame hover:bg-flame/90 text-white px-8 py-4 rounded-xl text-sm font-semibold transition shadow-lg shadow-flame/40 hover:-translate-y-0.5"
              >
                Get Started For Free <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Modern Fitness Footer */}
      <footer className="border-t border-line dark:border-line-dark py-12 text-xs text-ink-soft dark:text-ink-soft-dark font-mono bg-line/5 dark:bg-ink-dark">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3 md:col-span-2">
            <Logo size={24} />
            <p className="text-ink-soft dark:text-ink-soft-dark max-w-xs text-xs leading-relaxed">
              HabitFlow is your high-performance fitness and habit tracking ecosystem designed for absolute consistency.
            </p>
          </div>
          <div className="space-y-2">
            <div className="font-semibold text-ink dark:text-paper-dark uppercase tracking-wider text-[11px]">Platform</div>
            <div><Link to="/login" className="hover:text-flame transition">Sign In</Link></div>
            <div><Link to="/register" className="hover:text-flame transition">Create Account</Link></div>
          </div>
          <div className="space-y-2">
            <div className="font-semibold text-ink dark:text-paper-dark uppercase tracking-wider text-[11px]">Security &amp; Legal</div>
            <div className="hover:text-flame transition cursor-pointer">JWT Secured</div>
            <div className="hover:text-flame transition cursor-pointer">Privacy Policy</div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 pt-6 border-t border-line dark:border-line-dark flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>© {new Date().getFullYear()} HabitFlow — routines, kept.</div>
          <div className="text-flame flex items-center gap-1.5 font-semibold">
            <Flame size={13} /> Built for unstoppable momentum
          </div>
        </div>
      </footer>
    </div>
  );
}