import React, { useState, useEffect, useContext } from 'react';
import {
  Dumbbell,
  Flame,
  Clock,
  ChevronRight,
  CheckCircle2,
  Zap,
  Trash2,
  RotateCcw
} from 'lucide-react';
import ExerciseSession from './ExerciseSession';
import { AuthContext } from '../context/AuthContext';

const workoutPlans = [
  {
    id: 'chest-power',
    title: 'Chest & Triceps Power',
    category: 'Upper Body',
    duration: '45 mins',
    durationNum: 45,
    calories: '380 kcal',
    caloriesNum: 380,
    level: 'Intermediate',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80',
    exercises: [
      { name: 'Barbell Bench Press', sets: 4, reps: 10, timeSec: 60, desc: 'Keep chest high and lower bar under control to mid-chest.' },
      { name: 'Incline Dumbbell Flyes', sets: 3, reps: 12, timeSec: 45, desc: 'Slight bend in elbows, feel stretch across pectoral muscles.' },
      { name: 'Triceps Rope Pushdowns', sets: 4, reps: 15, timeSec: 45, desc: 'Lock elbows at sides and flare rope at bottom.' }
    ]
  },
  {
    id: 'back-biceps',
    title: 'Back & Biceps Hypertrophy',
    category: 'Upper Body',
    duration: '50 mins',
    durationNum: 50,
    calories: '420 kcal',
    caloriesNum: 420,
    level: 'Advanced',
    image: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=600&q=80',
    exercises: [
      { name: 'Wide-Grip Lat Pulldowns', sets: 4, reps: 12, timeSec: 60, desc: 'Pull down to upper chest, squeeze lats at lower point.' },
      { name: 'Bent-Over Barbell Rows', sets: 4, reps: 10, timeSec: 60, desc: 'Keep back flat at 45 degree angle, pull into belly button.' },
      { name: 'Standing Bicep Barbell Curls', sets: 3, reps: 12, timeSec: 45, desc: 'Avoid swinging torso, squeeze biceps at top.' }
    ]
  },
  {
    id: 'leg-glute-power',
    title: 'Lower Body Leg Destruction',
    category: 'Lower Body',
    duration: '55 mins',
    durationNum: 55,
    calories: '510 kcal',
    caloriesNum: 510,
    level: 'Advanced',
    image: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=600&q=80',
    exercises: [
      { name: 'Barbell Back Squats', sets: 4, reps: 8, timeSec: 90, desc: 'Squat parallel or lower, drive upward through heels.' },
      { name: 'Romanian Deadlifts', sets: 4, reps: 10, timeSec: 60, desc: 'Hinge hips backward feeling deep hamstring stretch.' },
      { name: 'Seated Leg Press', sets: 3, reps: 15, timeSec: 45, desc: 'Full range of motion without unlocking lower back.' }
    ]
  },
  {
    id: 'abs-core-shred',
    title: 'Core & Abdominal Sculpt',
    category: 'Core',
    duration: '25 mins',
    durationNum: 25,
    calories: '230 kcal',
    caloriesNum: 230,
    level: 'Beginner',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80',
    exercises: [
      { name: 'Hanging Leg Raises', sets: 3, reps: 15, timeSec: 30, desc: 'Raise knees or straight legs without momentum.' },
      { name: 'Plank Hold', sets: 3, reps: 1, timeSec: 60, desc: 'Maintain flat spine, contract abdominal wall tight.' },
      { name: 'Russian Twists', sets: 3, reps: 20, timeSec: 30, desc: 'Twist torso side to side touching ground with weight.' }
    ]
  },
  {
    id: 'hiit-cardio-burn',
    title: 'HIIT Explosive Cardio',
    category: 'Cardio',
    duration: '30 mins',
    durationNum: 30,
    calories: '450 kcal',
    caloriesNum: 450,
    level: 'Intermediate',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
    exercises: [
      { name: 'Burpees with Pushup', sets: 4, reps: 15, timeSec: 45, desc: 'Explosive jump at top followed by controlled pushup.' },
      { name: 'Mountain Climbers', sets: 4, reps: 30, timeSec: 30, desc: 'Rapid leg drives in high plank position.' },
      { name: 'Jump Rope High Knees', sets: 4, reps: 50, timeSec: 45, desc: 'Fast feet cadence staying light on toes.' }
    ]
  },
  {
    id: 'full-body-fat-melt',
    title: 'Full Body Conditioning',
    category: 'Full Body',
    duration: '40 mins',
    durationNum: 40,
    calories: '400 kcal',
    caloriesNum: 400,
    level: 'Beginner',
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80',
    exercises: [
      { name: 'Dumbbell Thrusters', sets: 3, reps: 12, timeSec: 45, desc: 'Full squat into overhead dumbbell shoulder press.' },
      { name: 'Kettlebell Swings', sets: 4, reps: 15, timeSec: 45, desc: 'Explosive hip hinge driving bell to eye level.' },
      { name: 'Bodyweight Pushups', sets: 3, reps: 15, timeSec: 30, desc: 'Chest touches floor with tight core plank.' }
    ]
  }
];

export default function Workouts() {
  const [activePlan, setActivePlan] = useState(null);
  const [filter, setFilter] = useState('All');
  const { user } = useContext(AuthContext) || {};

  // Unique storage key based on user email to prevent old user data bleeding into new user sessions
  const storageKey = user?.email ? `userWorkouts_${user.email}` : 'userWorkouts_default';

  const [userLogs, setUserLogs] = useState(() => {
    return JSON.parse(localStorage.getItem(storageKey) || '[]');
  });

  const [customTitle, setCustomTitle] = useState('');
  const [customCategory, setCustomCategory] = useState('Strength');
  const [customDuration, setCustomDuration] = useState('');
  const [customCalories, setCustomCalories] = useState('');

  const [completedMsg, setCompletedMsg] = useState(false);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(userLogs));
  }, [userLogs, storageKey]);

  const handleSessionComplete = (entry) => {
    setUserLogs([entry, ...userLogs]);
    setActivePlan(null);
    setCompletedMsg(true);
    setTimeout(() => setCompletedMsg(false), 3000);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customTitle || !customDuration || !customCalories) return;

    const newEntry = {
      id: Date.now(),
      title: customTitle,
      category: customCategory,
      duration: Number(customDuration),
      calories: Number(customCalories),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      completed: true,
    };

    setUserLogs([newEntry, ...userLogs]);
    setCustomTitle('');
    setCustomDuration('');
    setCustomCalories('');
    setCompletedMsg(true);
    setTimeout(() => setCompletedMsg(false), 3000);
  };

  const deleteLog = (id) => {
    setUserLogs(userLogs.filter(item => item.id !== id));
  };

  const clearAllLogs = () => {
    if (window.confirm('Are you sure you want to clear all workout history?')) {
      setUserLogs([]);
      localStorage.removeItem(storageKey);
    }
  };

  const filteredPlans = filter === 'All'
    ? workoutPlans
    : workoutPlans.filter(p => p.category === filter);

  if (activePlan) {
    return (
      <ExerciseSession
        plan={activePlan}
        onClose={() => setActivePlan(null)}
        onComplete={handleSessionComplete}
      />
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-65px)] bg-paper dark:bg-ink-dark text-ink dark:text-paper-dark px-6 lg:px-12 py-8 transition-colors">
      <div className="w-full space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-line dark:border-line-dark">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-semibold flex items-center gap-2.5">
              <Dumbbell className="text-flame" size={26} /> Workout routines
            </h1>
            <p className="text-sm text-ink-soft dark:text-ink-soft-dark mt-1">
              Pick a body-part routine to run exercises, or log a custom session.
            </p>
          </div>

          <div className="flex flex-wrap gap-1 bg-paper-raised dark:bg-surface-dark p-1 rounded-lg border border-line dark:border-line-dark">
            {['All', 'Upper Body', 'Lower Body', 'Core', 'Cardio', 'Full Body'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                  filter === cat
                    ? 'bg-flame text-white'
                    : 'text-ink-soft dark:text-ink-soft-dark hover:text-ink dark:hover:text-paper-dark'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {completedMsg && (
          <div className="p-4 bg-moss-soft dark:bg-moss-soft-dark border border-moss/30 rounded-lg font-mono text-xs text-moss font-semibold flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} /> Workout session logged &amp; synced with Dashboard &amp; Analytics!
            </span>
          </div>
        )}

        {/* Workout Plan Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className="bg-paper-raised dark:bg-surface-dark border border-line dark:border-line-dark rounded-xl overflow-hidden hover:border-ink/25 dark:hover:border-paper-dark/25 transition flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={plan.image}
                    alt={plan.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-ink/85 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded">
                    {plan.category}
                  </span>
                  <span className="absolute top-3 right-3 bg-flame text-white text-[10px] font-bold px-2.5 py-1 rounded">
                    {plan.level}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-display font-semibold text-base group-hover:text-flame transition">
                    {plan.title}
                  </h3>

                  <div className="flex items-center gap-4 font-mono text-xs text-ink-soft dark:text-ink-soft-dark">
                    <span className="flex items-center gap-1"><Clock size={13} /> {plan.duration}</span>
                    <span className="flex items-center gap-1"><Flame size={13} className="text-flame" /> {plan.calories}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => setActivePlan(plan)}
                  className="w-full bg-paper dark:bg-ink-dark hover:bg-flame hover:text-white border border-line dark:border-line-dark hover:border-flame text-ink dark:text-paper-dark font-semibold py-2.5 rounded-md text-xs flex items-center justify-center gap-1.5 transition"
                >
                  Explore routine <ChevronRight size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Workout & History */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6 border-t border-line dark:border-line-dark">

          <div className="bg-paper-raised dark:bg-surface-dark border border-line dark:border-line-dark p-6 rounded-xl space-y-4">
            <h2 className="font-display font-semibold text-base flex items-center gap-2">
              <Zap size={18} className="text-flame" /> Quick Log Custom Exercise
            </h2>

            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-mono font-semibold text-ink-soft dark:text-ink-soft-dark">Exercise Title</label>
                <input
                  type="text"
                  placeholder="e.g. Swimming or Treadmill"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full mt-1 bg-paper dark:bg-ink-dark border border-line dark:border-line-dark px-3 py-2 rounded-md text-sm focus:outline-none focus:border-flame"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-mono font-semibold text-ink-soft dark:text-ink-soft-dark">Category</label>
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full mt-1 bg-paper dark:bg-ink-dark border border-line dark:border-line-dark px-3 py-2 rounded-md text-sm font-mono"
                >
                  <option value="Strength">Strength</option>
                  <option value="Cardio">Cardio</option>
                  <option value="Core">Core</option>
                  <option value="Full Body">Full Body</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono font-semibold text-ink-soft dark:text-ink-soft-dark">Duration (mins)</label>
                  <input
                    type="number"
                    placeholder="30"
                    value={customDuration}
                    onChange={(e) => setCustomDuration(e.target.value)}
                    className="w-full mt-1 bg-paper dark:bg-ink-dark border border-line dark:border-line-dark px-3 py-2 rounded-md text-sm focus:outline-none focus:border-flame"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-mono font-semibold text-ink-soft dark:text-ink-soft-dark">Calories (kcal)</label>
                  <input
                    type="number"
                    placeholder="250"
                    value={customCalories}
                    onChange={(e) => setCustomCalories(e.target.value)}
                    className="w-full mt-1 bg-paper dark:bg-ink-dark border border-line dark:border-line-dark px-3 py-2 rounded-md text-sm focus:outline-none focus:border-flame"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-flame hover:bg-flame/90 text-white font-semibold py-2.5 rounded-md text-sm transition"
              >
                Log Workout
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-paper-raised dark:bg-surface-dark border border-line dark:border-line-dark p-6 rounded-xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-line dark:border-line-dark">
              <div className="flex items-center gap-3">
                <h2 className="font-display font-semibold text-base">Completed Workout History</h2>
                <span className="font-mono text-xs text-ink-soft dark:text-ink-soft-dark">{userLogs.length} Logged</span>
              </div>
              {userLogs.length > 0 && (
                <button
                  onClick={clearAllLogs}
                  className="flex items-center gap-1 text-xs font-mono text-flame hover:underline"
                >
                  <RotateCcw size={13} /> Clear History
                </button>
              )}
            </div>

            {userLogs.length === 0 ? (
              <div className="text-center py-12 font-mono text-xs text-ink-soft dark:text-ink-soft-dark border border-dashed border-line dark:border-line-dark rounded-lg">
                No workouts completed yet. Explore a routine card above or log a custom session!
              </div>
            ) : (
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {userLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 bg-paper dark:bg-ink-dark border border-line dark:border-line-dark rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-flame-soft dark:bg-flame-soft-dark text-flame rounded">
                        <Dumbbell size={18} />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold">{log.title}</h4>
                        <p className="font-mono text-[11px] text-ink-soft dark:text-ink-soft-dark mt-0.5">
                          {log.category} • {log.date}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 font-mono">
                      <div className="text-right">
                        <p className="text-xs font-bold text-flame">{log.calories} kcal</p>
                        <p className="text-[11px] text-ink-soft dark:text-ink-soft-dark">{log.duration} mins</p>
                      </div>
                      <button
                        onClick={() => deleteLog(log.id)}
                        className="text-ink-soft dark:text-ink-soft-dark hover:text-flame transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}