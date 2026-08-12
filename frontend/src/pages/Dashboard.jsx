import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Droplets, Plus, RotateCcw, CheckCircle2, Circle, 
  Flame, Trophy, Calendar, Trash2, Zap, Dumbbell, ArrowUpRight,
  Timer, Play, Pause, RotateCw, Moon, Utensils, Sparkles, Activity
} from 'lucide-react';

export default function Dashboard() {
  const { user, theme } = useContext(AuthContext);
  const navigate = useNavigate();

  const isDarkMode = theme === 'dark';

  const getTodayDateKey = () => new Date().toISOString().slice(0, 10);
  const todayKey = getTodayDateKey();

  const userKey = user?.email ? user.email.replace(/[^a-zA-Z0-9]/g, '_') : 'guest';
  const lastActiveDateKey = `userLastActiveDate_${userKey}`;
  const waterStorageKey = `userWater_${userKey}_${todayKey}`;
  const habitsStorageKey = `userHabits_${userKey}_${todayKey}`;
  const workoutsStorageKey = `userWorkouts_${userKey}`;
  const macrosStorageKey = `userMacros_${userKey}_${todayKey}`;
  const sleepStorageKey = `userSleep_${userKey}_${todayKey}`;
  const streakStorageKey = `userStreak_${userKey}`;

  useEffect(() => {
    const lastActive = localStorage.getItem(lastActiveDateKey);
    if (lastActive && lastActive !== todayKey) {
      localStorage.removeItem(`userWater_${userKey}_${lastActive}`);
      localStorage.removeItem(`userHabits_${userKey}_${lastActive}`);
      localStorage.removeItem(`userMacros_${userKey}_${lastActive}`);
      localStorage.removeItem(`userSleep_${userKey}_${lastActive}`);
    }
    localStorage.setItem(lastActiveDateKey, todayKey);
  }, [userKey, todayKey]);

  const [waterMl, setWaterMl] = useState(() => Number(localStorage.getItem(waterStorageKey)) || 0);
  const waterGoal = 3000;

  const [workouts, setWorkouts] = useState(() => {
    const saved = localStorage.getItem(workoutsStorageKey);
    try { return saved ? JSON.parse(saved) : []; } catch (e) { return []; }
  });

  useEffect(() => {
    const handleWorkoutSync = () => {
      const saved = localStorage.getItem(workoutsStorageKey);
      try {
        setWorkouts(saved ? JSON.parse(saved) : []);
      } catch (e) {
        setWorkouts([]);
      }
    };

    window.addEventListener('storage', handleWorkoutSync);
    window.addEventListener('workoutUpdated', handleWorkoutSync);

    return () => {
      window.removeEventListener('storage', handleWorkoutSync);
      window.removeEventListener('workoutUpdated', handleWorkoutSync);
    };
  }, [workoutsStorageKey]);

  const calorieGoal = 600;
  const totalWorkoutCalories = workouts.reduce((acc, curr) => acc + (Number(curr.calories) || 0), 0);

  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem(habitsStorageKey);
    try { 
      return saved ? JSON.parse(saved) : [
        { id: 1, title: 'Morning Hydration & Stretches', category: 'Health', done: false },
        { id: 2, title: '45 Mins High-Intensity Training', category: 'Fitness', done: false },
        { id: 3, title: 'Deep Work / Skill Building Block', category: 'Mindset', done: false },
      ]; 
    } catch (e) { return []; }
  });
  const [newHabit, setNewHabit] = useState('');
  const [category, setCategory] = useState('General');
  const [filterCategory, setFilterCategory] = useState('All');

  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState('work');

  const [macros, setMacros] = useState(() => {
    const saved = localStorage.getItem(macrosStorageKey);
    try { return saved ? JSON.parse(saved) : { protein: 0, carbs: 0, fats: 0 }; } catch (e) { return { protein: 0, carbs: 0, fats: 0 }; }
  });
  const macroGoals = { protein: 150, carbs: 200, fats: 65 };

  const [sleepLog, setSleepLog] = useState(() => {
    const saved = localStorage.getItem(sleepStorageKey);
    try { return saved ? JSON.parse(saved) : { hours: 0, quality: 'Not Logged' }; } catch (e) { return { hours: 0, quality: 'Not Logged' }; }
  });
  const [isEditingSleep, setIsEditingSleep] = useState(false);
  const [tempHours, setTempHours] = useState(7.5);
  const [tempQuality, setTempQuality] = useState('Optimal');

  const [streak, setStreak] = useState(() => {
    const savedStreak = localStorage.getItem(streakStorageKey);
    const lastDate = localStorage.getItem(lastActiveDateKey);
    if (!savedStreak) return 1;
    
    if (lastDate && lastDate !== todayKey) {
      const last = new Date(lastDate);
      const current = new Date(todayKey);
      const diffTime = Math.abs(current - last);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        return Number(savedStreak) + 1;
      } else if (diffDays > 1) {
        return 1;
      }
    }
    return Number(savedStreak) || 1;
  });

  useEffect(() => { localStorage.setItem(habitsStorageKey, JSON.stringify(habits)); }, [habits, habitsStorageKey]);
  useEffect(() => { localStorage.setItem(waterStorageKey, waterMl.toString()); }, [waterMl, waterStorageKey]);
  useEffect(() => { localStorage.setItem(macrosStorageKey, JSON.stringify(macros)); }, [macros, macrosStorageKey]);
  useEffect(() => { localStorage.setItem(sleepStorageKey, JSON.stringify(sleepLog)); }, [sleepLog, sleepStorageKey]);
  useEffect(() => { localStorage.setItem(streakStorageKey, streak.toString()); }, [streak, streakStorageKey]);

  useEffect(() => {
    let timer = null;
    if (isTimerRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, timeLeft]);

  const formatTimer = (secs) => `${Math.floor(secs / 60).toString().padStart(2, '0')}:${(secs % 60).toString().padStart(2, '0')}`;

  const toggleHabit = (id) => setHabits(habits.map(h => h.id === id ? { ...h, done: !h.done } : h));
  const deleteHabit = (id, e) => { e.stopPropagation(); setHabits(habits.filter(h => h.id !== id)); };

  const addHabit = (e) => {
    e.preventDefault();
    if (!newHabit.trim()) return;
    setHabits([...habits, { id: Date.now(), title: newHabit.trim(), category, done: false }]);
    setNewHabit('');
  };

  const completedCount = habits.filter(h => h.done).length;
  const habitRate = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;
  const waterPercent = Math.min(100, Math.round((waterMl / waterGoal) * 100));
  const caloriePercent = Math.min(100, Math.round((totalWorkoutCalories / calorieGoal) * 100));

  const filteredHabits = filterCategory === 'All' ? habits : habits.filter(h => h.category === filterCategory);

  return (
    <div className={`w-full min-h-screen px-4 sm:px-8 lg:px-12 py-8 transition-colors duration-200 ${
      isDarkMode ? 'bg-ink dark text-paper-dark' : 'bg-paper text-ink'
    }`}>
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className={`relative overflow-hidden border rounded-3xl p-6 sm:p-8 shadow-sm transition-colors duration-200 ${
          isDarkMode ? 'bg-ink-dark border-line-dark' : 'bg-paper-raised border-line'
        }`}>
          <div className={`absolute -right-10 -top-10 w-60 h-60 rounded-full blur-3xl pointer-events-none ${
            isDarkMode ? 'bg-surface-dark' : 'bg-line/40'
          }`}></div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className={`inline-flex items-center gap-2 border px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase font-mono ${
                isDarkMode ? 'bg-surface-dark border-line-dark text-ink-soft-dark' : 'bg-paper border-line text-ink-soft'
              }`}>
                <Sparkles size={13} className="text-flame" /> Elite Performance Hub
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                Welcome back, <span className="text-flame">{user?.name || user?.email?.split('@')[0] || 'User1'}</span>
              </h1>
              <p className={`text-sm font-mono ${isDarkMode ? 'text-ink-soft-dark' : 'text-ink-soft'}`}>Your metrics are synced and ready for today. Let's dominate.</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 border px-4 py-2.5 rounded-2xl shadow-2xs font-mono ${
                isDarkMode ? 'bg-surface-dark border-line-dark text-paper-dark' : 'bg-paper border-line text-ink'
              }`}>
                <Trophy size={16} className="text-amber-500 dark:text-amber-400" />
                <span className="text-xs font-bold">
                  Streak: <span className="text-flame">{streak} Day{streak > 1 ? 's' : ''}</span>
                </span>
              </div>
              <div className={`flex items-center gap-3 border px-4 py-2.5 rounded-2xl shadow-2xs font-mono ${
                isDarkMode ? 'bg-surface-dark border-line-dark text-ink-soft-dark' : 'bg-paper border-line text-ink-soft'
              }`}>
                <Calendar size={16} className={isDarkMode ? 'text-ink-soft-dark' : 'text-ink-soft'} />
                <span className="text-xs font-medium">
                  {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Active Burn', val: `${totalWorkoutCalories} kcal`, icon: <Flame size={22} className="text-flame" /> },
            { label: 'Hydration', val: `${waterMl} ml`, icon: <Droplets size={22} className="text-cyan-500 dark:text-cyan-400" /> },
            { label: 'Execution Rate', val: `${habitRate}%`, icon: <Trophy size={22} className="text-amber-500 dark:text-amber-400" /> },
            { label: 'Focus Index', val: 'Active', icon: <Zap size={22} className="text-emerald-500 dark:text-emerald-400" /> }
          ].map((stat, idx) => (
            <div key={idx} className={`border p-5 rounded-2xl transition-all shadow-2xs flex items-center justify-between group ${
              isDarkMode ? 'bg-ink-dark border-line-dark hover:border-line' : 'bg-paper-raised border-line hover:border-ink/20'
            }`}>
              <div className="space-y-1">
                <p className={`text-xs font-bold font-mono uppercase tracking-wider ${isDarkMode ? 'text-ink-soft-dark' : 'text-ink-soft'}`}>{stat.label}</p>
                <h3 className="text-2xl font-black font-mono">{stat.val}</h3>
              </div>
              <div className={`p-3.5 rounded-2xl transition-transform group-hover:scale-105 border ${
                isDarkMode ? 'bg-surface-dark border-line-dark' : 'bg-paper border-line'
              }`}>{stat.icon}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className={`lg:col-span-2 border rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm transition-colors duration-200 ${
            isDarkMode ? 'bg-ink-dark border-line-dark' : 'bg-paper-raised border-line'
          }`}>
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b ${
              isDarkMode ? 'border-line-dark' : 'border-line'
            }`}>
              <h2 className="text-lg font-bold flex items-center gap-2.5">
                <Activity size={20} className={isDarkMode ? 'text-paper-dark' : 'text-ink'} /> Daily Habits & Protocols
              </h2>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {['All', 'Health', 'Fitness', 'Mindset', 'General'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`text-xs font-mono font-semibold px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                      filterCategory === cat 
                        ? 'bg-flame text-white shadow-2xs' 
                        : isDarkMode ? 'bg-surface-dark text-ink-soft-dark hover:text-paper-dark hover:bg-ink' : 'bg-paper text-ink-soft hover:text-ink hover:bg-paper-raised'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={addHabit} className="flex flex-col sm:flex-row gap-2.5">
              <input 
                type="text" 
                placeholder="Add new performance protocol..."
                value={newHabit}
                onChange={(e) => setNewHabit(e.target.value)}
                className={`flex-1 border px-4 py-3 rounded-2xl text-sm font-mono focus:outline-none focus:border-flame transition-all ${
                  isDarkMode ? 'bg-surface-dark border-line-dark text-paper-dark placeholder:text-ink-soft-dark' : 'bg-paper border-line text-ink placeholder:text-ink-soft'
                }`}
              />
              <div className="flex gap-2.5">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`flex-1 sm:flex-none border px-4 py-3 rounded-2xl text-xs font-mono font-semibold focus:outline-none focus:border-flame cursor-pointer ${
                    isDarkMode ? 'bg-surface-dark border-line-dark text-paper-dark' : 'bg-paper border-line text-ink'
                  }`}
                >
                  <option value="General">General</option>
                  <option value="Health">Health</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Mindset">Mindset</option>
                </select>
                <button type="submit" className="bg-flame hover:bg-flame/90 text-white px-6 py-3 rounded-2xl text-sm font-mono font-semibold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer whitespace-nowrap">
                  <Plus size={16} /> Add
                </button>
              </div>
            </form>

            <div className="space-y-3">
              {filteredHabits.length === 0 ? (
                <div className={`text-center py-12 text-xs font-mono border border-dashed rounded-2xl ${
                  isDarkMode ? 'text-ink-soft-dark border-line-dark' : 'text-ink-soft border-line'
                }`}>
                  No habits tracked under this category.
                </div>
              ) : (
                filteredHabits.map((h) => (
                  <div 
                    key={h.id}
                    onClick={() => toggleHabit(h.id)}
                    className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                      h.done 
                        ? isDarkMode ? 'bg-surface-dark/40 border-line-dark opacity-50' : 'bg-paper border-line opacity-60'
                        : isDarkMode ? 'bg-surface-dark border-line-dark hover:border-line' : 'bg-paper border-line hover:border-ink/20'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      {h.done ? <CheckCircle2 size={20} className="text-flame" /> : <Circle size={20} className={isDarkMode ? 'text-ink-soft-dark' : 'text-ink-soft'} />}
                      <span className={`text-sm font-mono font-medium ${h.done ? 'line-through text-ink-soft' : isDarkMode ? 'text-paper-dark' : 'text-ink'}`}>
                        {h.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg border uppercase tracking-wider ${
                        isDarkMode ? 'bg-ink-dark border-line-dark text-ink-soft-dark' : 'bg-paper-raised border-line text-ink-soft'
                      }`}>
                        {h.category}
                      </span>
                      <button onClick={(e) => deleteHabit(h.id, e)} className="text-ink-soft hover:text-flame p-1.5 transition-colors cursor-pointer">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="space-y-6">
            
            <div className={`border rounded-3xl p-6 space-y-4 shadow-sm transition-colors duration-200 ${
              isDarkMode ? 'bg-ink-dark border-line-dark' : 'bg-paper-raised border-line'
            }`}>
              <div className={`flex justify-between items-center pb-3 border-b ${isDarkMode ? 'border-line-dark' : 'border-line'}`}>
                <div className="flex items-center gap-2">
                  <Dumbbell size={18} className={isDarkMode ? 'text-paper-dark' : 'text-ink'} />
                  <h3 className="text-sm font-bold">Workout Burn Target</h3>
                </div>
                <span className="text-xs font-black font-mono text-flame">{caloriePercent}%</span>
              </div>

              <div className={`relative w-full h-40 border rounded-2xl overflow-hidden shadow-xs ${
                isDarkMode ? 'border-line-dark bg-surface-dark' : 'border-line bg-paper'
              }`}>
                <img 
                  src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000&auto=format&fit=crop" 
                  alt="Exercise Workout" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
                  <span className="text-[10px] font-mono font-bold text-white uppercase tracking-wider bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/20">
                    Active Training Session
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-2xl font-black">{totalWorkoutCalories} <span className={`text-xs font-normal ${isDarkMode ? 'text-ink-soft-dark' : 'text-ink-soft'}`}>/ {calorieGoal} kcal</span></span>
                </div>
                <div className={`border rounded-full h-2.5 overflow-hidden p-0.5 ${isDarkMode ? 'bg-surface-dark border-line-dark' : 'bg-paper border-line'}`}>
                  <div className="bg-flame h-full rounded-full transition-all duration-500" style={{ width: `${caloriePercent}%` }}></div>
                </div>
              </div>

              <button 
                onClick={() => navigate('/workouts')}
                className={`w-full border text-xs font-mono font-semibold py-3 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs ${
                  isDarkMode ? 'bg-surface-dark border-line-dark hover:border-line text-paper-dark' : 'bg-paper border-line hover:border-ink/20 text-ink'
                }`}
              >
                Open Workouts Module <ArrowUpRight size={14} />
              </button>
            </div>

            <div className={`border rounded-3xl p-6 space-y-4 shadow-sm transition-colors duration-200 ${
              isDarkMode ? 'bg-ink-dark border-line-dark' : 'bg-paper-raised border-line'
            }`}>
              <div className={`flex justify-between items-center pb-3 border-b ${isDarkMode ? 'border-line-dark' : 'border-line'}`}>
                <div className="flex items-center gap-2">
                  <Droplets size={18} className="text-cyan-500 dark:text-cyan-400" />
                  <h3 className="text-sm font-bold">Hydration Tracker</h3>
                </div>
                <button onClick={() => setWaterMl(0)} className="text-ink-soft hover:text-flame transition-colors cursor-pointer" title="Reset">
                  <RotateCcw size={14} />
                </button>
              </div>

              <div className={`relative w-full h-32 border rounded-2xl overflow-hidden shadow-xs ${
                isDarkMode ? 'border-line-dark bg-surface-dark' : 'border-line bg-paper'
              }`}>
                <img 
                  src="https://images.unsplash.com/photo-1548839140-29a749e1cf4d?q=80&w=1000&auto=format&fit=crop" 
                  alt="Water Hydration" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-3">
                  <span className="text-[10px] font-mono font-bold text-white uppercase tracking-wider bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/20">
                    Stay Hydrated
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-2xl font-black">{waterMl} <span className={`text-xs font-normal ${isDarkMode ? 'text-ink-soft-dark' : 'text-ink-soft'}`}>/ {waterGoal} ml</span></span>
                  <span className={`font-bold ${isDarkMode ? 'text-ink-soft-dark' : 'text-ink-soft'}`}>{waterPercent}%</span>
                </div>
                <div className={`border rounded-full h-2.5 overflow-hidden p-0.5 ${isDarkMode ? 'bg-surface-dark border-line-dark' : 'bg-paper border-line'}`}>
                  <div className="bg-cyan-500 dark:bg-cyan-400 h-full rounded-full transition-all duration-500" style={{ width: `${waterPercent}%` }}></div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[250, 500, 750].map((amt) => (
                  <button key={amt} onClick={() => setWaterMl(p => Math.min(waterGoal, p + amt))} className={`border text-xs font-mono font-semibold py-2 rounded-xl transition-all cursor-pointer ${
                    isDarkMode ? 'bg-surface-dark border-line-dark hover:border-line text-paper-dark' : 'bg-paper border-line hover:border-ink/20 text-ink'
                  }`}>+{amt}ml</button>
                ))}
              </div>
            </div>

          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className={`border rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-sm transition-colors duration-200 ${
            isDarkMode ? 'bg-ink-dark border-line-dark' : 'bg-paper-raised border-line'
          }`}>
            <div className={`flex justify-between items-center pb-3 border-b ${isDarkMode ? 'border-line-dark' : 'border-line'}`}>
              <div className="flex items-center gap-2">
                <Timer size={18} className="text-emerald-500 dark:text-emerald-400" />
                <h3 className="text-sm font-bold">Focus Timer</h3>
              </div>
              <div className={`flex gap-1 border p-1 rounded-xl ${isDarkMode ? 'bg-surface-dark border-line-dark' : 'bg-paper border-line'}`}>
                <button onClick={() => { setIsTimerRunning(false); setTimerMode('work'); setTimeLeft(25*60); }} className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${timerMode === 'work' ? 'bg-flame text-white' : isDarkMode ? 'text-ink-soft-dark' : 'text-ink-soft'}`}>Work</button>
                <button onClick={() => { setIsTimerRunning(false); setTimerMode('break'); setTimeLeft(5*60); }} className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${timerMode === 'break' ? 'bg-flame text-white' : isDarkMode ? 'text-ink-soft-dark' : 'text-ink-soft'}`}>Break</button>
              </div>
            </div>

            <div className="text-center py-4 font-mono">
              <div className="text-4xl font-black tracking-tight">{formatTimer(timeLeft)}</div>
              <p className={`text-[10px] font-bold uppercase tracking-widest mt-1.5 ${isDarkMode ? 'text-ink-soft-dark' : 'text-ink-soft'}`}>{timerMode} interval active</p>
            </div>

            <div className="flex items-center gap-2.5">
              <button onClick={() => setIsTimerRunning(!isTimerRunning)} className={`flex-1 py-3 rounded-2xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
                isTimerRunning 
                  ? isDarkMode ? 'bg-surface-dark border border-line-dark text-paper-dark' : 'bg-paper border border-line text-ink' 
                  : 'bg-flame text-white shadow-xs'
              }`}>
                {isTimerRunning ? <><Pause size={15} /> Pause Session</> : <><Play size={15} /> Start Session</>}
              </button>
              <button onClick={() => { setIsTimerRunning(false); setTimeLeft(timerMode === 'work' ? 25*60 : 5*60); }} className={`border p-3 rounded-2xl transition-colors cursor-pointer ${
                isDarkMode ? 'bg-surface-dark border-line-dark text-ink-soft-dark hover:text-paper-dark' : 'bg-paper border-line text-ink-soft hover:text-ink'
              }`}>
                <RotateCw size={15} />
              </button>
            </div>
          </div>

          <div className={`border rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-sm transition-colors duration-200 ${
            isDarkMode ? 'bg-ink-dark border-line-dark' : 'bg-paper-raised border-line'
          }`}>
            <div className={`flex justify-between items-center pb-3 border-b ${isDarkMode ? 'border-line-dark' : 'border-line'}`}>
              <div className="flex items-center gap-2">
                <Utensils size={18} className="text-amber-500 dark:text-amber-400" />
                <h3 className="text-sm font-bold">Macro Nutrition</h3>
              </div>
              <span className={`text-[10px] font-mono font-bold border px-2.5 py-0.5 rounded-full ${
                isDarkMode ? 'text-ink-soft-dark bg-surface-dark border-line-dark' : 'text-ink-soft bg-paper border-line'
              }`}>Fuel Your Body</span>
            </div>

            <div className={`relative w-full h-28 border rounded-2xl overflow-hidden shadow-xs ${
              isDarkMode ? 'border-line-dark bg-surface-dark' : 'border-line bg-paper'
            }`}>
              <img 
                src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=1000&auto=format&fit=crop" 
                alt="Healthy Food Nutrition" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-2.5">
                <span className="text-[10px] font-mono font-bold text-white uppercase tracking-wider bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/20">
                  Clean Nutrition
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs font-mono">
              {[
                { label: 'Protein', current: macros.protein, goal: macroGoals.protein, barColor: 'bg-flame' },
                { label: 'Carbs', current: macros.carbs, goal: macroGoals.carbs, barColor: 'bg-amber-500 dark:text-amber-400' },
                { label: 'Fats', current: macros.fats, goal: macroGoals.fats, barColor: 'bg-cyan-500 dark:text-cyan-400' }
              ].map((macro, idx) => (
                <div key={idx}>
                  <div className={`flex justify-between mb-1 font-semibold ${isDarkMode ? 'text-ink-soft-dark' : 'text-ink-soft'}`}>
                    <span>{macro.label}</span>
                    <span className={`font-bold ${isDarkMode ? 'text-paper-dark' : 'text-ink'}`}>{macro.current} / {macro.goal}g</span>
                  </div>
                  <div className={`border h-2 rounded-full overflow-hidden p-0.5 ${isDarkMode ? 'bg-surface-dark border-line-dark' : 'bg-paper border-line'}`}>
                    <div className={`${macro.barColor} h-full rounded-full transition-all`} style={{ width: `${Math.min(100, (macro.current / macro.goal) * 100)}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => setMacros(m => ({ ...m, protein: m.protein + 10 }))} className={`border text-xs font-mono font-semibold py-2 rounded-2xl transition-all cursor-pointer ${
                isDarkMode ? 'bg-surface-dark border-line-dark hover:border-line text-flame' : 'bg-paper border-line hover:border-ink/20 text-flame'
              }`}>+10P</button>
              <button onClick={() => setMacros(m => ({ ...m, carbs: m.carbs + 15 }))} className={`border text-xs font-mono font-semibold py-2 rounded-2xl transition-all cursor-pointer ${
                isDarkMode ? 'bg-surface-dark border-line-dark hover:border-line text-amber-500 dark:text-amber-400' : 'bg-paper border-line hover:border-ink/20 text-amber-600'
              }`}>+15C</button>
              <button onClick={() => setMacros(m => ({ ...m, fats: m.fats + 5 }))} className={`border text-xs font-mono font-semibold py-2 rounded-2xl transition-all cursor-pointer ${
                isDarkMode ? 'bg-surface-dark border-line-dark hover:border-line text-cyan-400' : 'bg-paper border-line hover:border-ink/20 text-cyan-600'
              }`}>+5F</button>
            </div>
          </div>

          <div className={`border rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-sm transition-colors duration-200 ${
            isDarkMode ? 'bg-ink-dark border-line-dark' : 'bg-paper-raised border-line'
          }`}>
            <div className={`flex justify-between items-center pb-3 border-b ${isDarkMode ? 'border-line-dark' : 'border-line'}`}>
              <div className="flex items-center gap-2">
                <Moon size={18} className="text-indigo-500 dark:text-indigo-400" />
                <h3 className="text-sm font-bold">Sleep & Recovery</h3>
              </div>
              <button onClick={() => setIsEditingSleep(!isEditingSleep)} className={`text-xs font-mono font-semibold cursor-pointer ${isDarkMode ? 'text-ink-soft-dark hover:text-paper-dark' : 'text-ink-soft hover:text-ink'}`}>
                {isEditingSleep ? 'Close' : 'Update Log'}
              </button>
            </div>

            {!isEditingSleep ? (
              <div className="space-y-3 py-2 font-mono">
                <div className={`flex justify-between items-center border p-3.5 rounded-2xl ${isDarkMode ? 'bg-surface-dark border-line-dark' : 'bg-paper border-line'}`}>
                  <span className={`text-xs ${isDarkMode ? 'text-ink-soft-dark' : 'text-ink-soft'}`}>Duration</span>
                  <span className="text-sm font-bold">{sleepLog.hours} Hours</span>
                </div>
                <div className={`flex justify-between items-center border p-3.5 rounded-2xl ${isDarkMode ? 'bg-surface-dark border-line-dark' : 'bg-paper border-line'}`}>
                  <span className={`text-xs ${isDarkMode ? 'text-ink-soft-dark' : 'text-ink-soft'}`}>Quality Score</span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-xl border ${
                    isDarkMode ? 'bg-ink-dark border-line-dark text-paper-dark' : 'bg-paper-raised border-line text-ink'
                  }`}>{sleepLog.quality}</span>
                </div>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSleepLog({ hours: Number(tempHours), quality: tempQuality }); setIsEditingSleep(false); }} className="space-y-3 text-xs font-mono">
                <div>
                  <label className={`block mb-1.5 font-semibold ${isDarkMode ? 'text-ink-soft-dark' : 'text-ink-soft'}`}>Hours Logged: {tempHours}h</label>
                  <input type="range" min="0" max="12" step="0.5" value={tempHours} onChange={(e) => setTempHours(e.target.value)} className="w-full accent-flame cursor-pointer" />
                </div>
                <div>
                  <select value={tempQuality} onChange={(e) => setTempQuality(e.target.value)} className={`w-full border p-2.5 rounded-xl cursor-pointer text-xs font-mono font-semibold ${
                    isDarkMode ? 'bg-surface-dark border-line-dark text-paper-dark' : 'bg-paper border-line text-ink'
                  }`}>
                    <option value="Optimal">Optimal</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>
                <button type="submit" className="w-full bg-flame hover:bg-flame/90 text-white font-bold py-2.5 rounded-xl transition-all cursor-pointer shadow-xs">Save Recovery Log</button>
              </form>
            )}

            <div className="text-center">
              <span className={`text-[10px] font-mono font-semibold tracking-wide uppercase ${isDarkMode ? 'text-ink-soft-dark' : 'text-ink-soft'}`}>Recovery metrics secured.</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}