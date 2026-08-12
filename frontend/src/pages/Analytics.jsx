import React, { useState, useEffect, useContext } from 'react';
import { BarChart3, TrendingUp, Scale, Activity, Dumbbell, Clock, Flame, ChevronDown, ChevronUp } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { AuthContext } from '../context/AuthContext';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('Weekly');
  const [logs, setLogs] = useState([]);
  const [savedWorkoutsList, setSavedWorkoutsList] = useState([]);
  const [weightHistory, setWeightHistory] = useState([]);
  const [profile, setProfile] = useState(null);
  const [isWorkoutExpanded, setIsWorkoutExpanded] = useState(false);

  const { user } = useContext(AuthContext) || {};

  // FIX: same sanitized key as Profile.jsx (previously raw email was used here,
  // which contains '@' and '.' — Profile.jsx strips those, so keys never matched)
  const userKey = user?.email ? user.email.replace(/[^a-zA-Z0-9]/g, '_') : 'guest';

  const workoutStorageKey = `userWorkouts_${userKey}`;
  const habitsStorageKey = `userHabits_${userKey}`;
  const weightStorageKey = `userWeightHistory_${userKey}`;
  const profileStorageKey = `userProfileData_${userKey}`;

  useEffect(() => {
    const savedWorkouts = JSON.parse(localStorage.getItem(workoutStorageKey) || '[]');
    const savedHabits = JSON.parse(localStorage.getItem(habitsStorageKey) || '[]');
    const history = JSON.parse(localStorage.getItem(weightStorageKey) || '[]');
    const userProf = JSON.parse(localStorage.getItem(profileStorageKey) || '{}');

    setSavedWorkoutsList(savedWorkouts);
    setLogs([...savedWorkouts, ...savedHabits]);
    setWeightHistory(history);
    setProfile(userProf);
  }, [workoutStorageKey, habitsStorageKey, weightStorageKey, profileStorageKey]);

  const calculateStats = () => {
    if (!logs || logs.length === 0) {
      return {
        completionRate: '0%',
        caloriesBurned: '0 kcal',
        workoutHours: '0 hrs',
        daysActive: '0 of 7 days',
        bars: [
          { label: 'Mon', height: '0%' },
          { label: 'Tue', height: '0%' },
          { label: 'Wed', height: '0%' },
          { label: 'Thu', height: '0%' },
          { label: 'Fri', height: '0%' },
          { label: 'Sat', height: '0%' },
          { label: 'Sun', height: '0%' },
        ]
      };
    }

    const totalCalories = logs.reduce((sum, item) => sum + (Number(item.calories) || 0), 0);
    const totalMinutes = logs.reduce((sum, item) => sum + (Number(item.duration) || 0), 0);
    const completedTasks = logs.filter(item => item.completed).length;
    const rate = Math.round((completedTasks / logs.length) * 100) || 0;

    return {
      completionRate: `${rate}%`,
      caloriesBurned: `${totalCalories} kcal`,
      workoutHours: `${(totalMinutes / 60).toFixed(1)} hrs`,
      daysActive: `1 of 7 days`,
      bars: [
        { label: 'Mon', height: `${rate}%` },
        { label: 'Tue', height: '0%' },
        { label: 'Wed', height: '0%' },
        { label: 'Thu', height: '0%' },
        { label: 'Fri', height: '0%' },
        { label: 'Sat', height: '0%' },
        { label: 'Sun', height: '0%' },
      ]
    };
  };

  const currentStats = calculateStats();

  const kpis = [
    { label: 'Completion rate', value: currentStats.completionRate, accent: 'text-moss' },
    { label: 'Calories burned', value: currentStats.caloriesBurned, accent: 'text-flame' },
    { label: 'Total workout time', value: currentStats.workoutHours, accent: 'text-ink dark:text-paper-dark' },
    { label: 'Consistency', value: currentStats.daysActive, accent: 'text-ocean' },
  ];

  // Weight Difference Calculation
  const initialWeight = weightHistory[0]?.weight || profile?.weight || 0;
  const latestWeight = weightHistory[weightHistory.length - 1]?.weight || profile?.weight || 0;
  const weightDiff = (latestWeight - initialWeight).toFixed(1);

  // Limit workouts to 3 unless expanded
  const displayedWorkouts = isWorkoutExpanded ? savedWorkoutsList : savedWorkoutsList.slice(0, 3);

  return (
    <div className="w-full min-h-[calc(100vh-65px)] bg-paper dark:bg-ink-dark text-ink dark:text-paper-dark px-6 lg:px-12 py-8 transition-colors">
      <div className="w-full space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-line dark:border-line-dark pb-6">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-semibold flex items-center gap-2.5">
              <BarChart3 className="text-flame" size={26} /> Analytics
            </h1>
            <p className="text-sm text-ink-soft dark:text-ink-soft-dark mt-1">
              Habit trends, body weight progress, and detailed activity logs.
            </p>
          </div>

          <div className="flex bg-paper-raised dark:bg-surface-dark p-1 rounded-lg border border-line dark:border-line-dark">
            {['Weekly', 'Monthly', 'Yearly'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-md text-xs font-semibold transition ${
                  timeRange === range
                    ? 'bg-flame text-white'
                    : 'text-ink-soft dark:text-ink-soft-dark hover:text-ink dark:hover:text-paper-dark'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpis.map((k) => (
            <div key={k.label} className="bg-paper-raised dark:bg-surface-dark border border-line dark:border-line-dark p-4 rounded-xl">
              <span className="text-[10px] font-semibold text-ink-soft dark:text-ink-soft-dark uppercase tracking-wide">
                {k.label}
              </span>
              <div className={`font-mono text-2xl font-semibold mt-1 ${k.accent}`}>
                {k.value}
              </div>
            </div>
          ))}
        </div>

        {/* Activity Volume Bar Chart */}
        <div className="bg-paper-raised dark:bg-surface-dark border border-line dark:border-line-dark p-6 rounded-xl space-y-6">
          <h2 className="font-display font-semibold text-base flex items-center gap-2">
            <TrendingUp size={18} className="text-flame" /> Activity volume — {timeRange}
          </h2>

          <div className="flex items-end justify-between gap-3 h-44 pt-6 border-b border-line dark:border-line-dark pb-2">
            {currentStats.bars.map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div
                  className={`w-full max-w-[40px] rounded-t-md transition-all duration-500 ${
                    bar.height === '0%' ? 'bg-line dark:bg-line-dark' : 'bg-flame'
                  }`}
                  style={{ height: bar.height === '0%' ? '4px' : bar.height }}
                />
                <span className="font-mono text-[11px] font-semibold text-ink-soft dark:text-ink-soft-dark">
                  {bar.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* WORKOUT HISTORY & EXERCISE LOGS (Max 3 + Expand) */}
        <div className="bg-paper-raised dark:bg-surface-dark border border-line dark:border-line-dark p-6 rounded-xl space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-display font-semibold text-base flex items-center gap-2">
              <Dumbbell size={18} className="text-flame" /> Workout History &amp; Exercise Logs
            </h2>
            <span className="text-xs font-mono font-semibold text-ink-soft dark:text-ink-soft-dark">
              Total Logged: {savedWorkoutsList.length}
            </span>
          </div>

          {savedWorkoutsList.length === 0 ? (
            <div className="text-center py-8 font-mono text-xs text-ink-soft dark:text-ink-soft-dark border border-dashed border-line dark:border-line-dark rounded-lg flex flex-col items-center gap-2">
              <Activity size={20} className="text-flame" />
              <span>No workouts recorded yet. Complete a workout to see your exercise history here!</span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                {displayedWorkouts.map((item, index) => (
                  <div 
                    key={index} 
                    className="bg-paper dark:bg-ink-dark border border-line dark:border-line-dark p-4 rounded-xl flex flex-col justify-between gap-3 shadow-2xs"
                  >
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-flame bg-flame-soft/20 px-2 py-0.5 rounded">
                        {item.category || item.type || 'Workout'}
                      </span>
                      <h3 className="font-display font-bold text-sm mt-1.5 line-clamp-1">
                        {item.name || item.title || 'Custom Exercise'}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-line dark:border-line-dark text-xs font-mono text-ink-soft dark:text-ink-soft-dark">
                      <div className="flex items-center gap-1">
                        <Clock size={13} />
                        <span>{item.duration || 0} mins</span>
                      </div>
                      <div className="flex items-center gap-1 font-bold text-flame">
                        <Flame size={13} />
                        <span>{item.calories || 0} kcal</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {savedWorkoutsList.length > 3 && (
                <div className="flex justify-center pt-2">
                  <button
                    onClick={() => setIsWorkoutExpanded(!isWorkoutExpanded)}
                    className="flex items-center gap-1.5 text-xs font-mono font-semibold text-flame bg-flame-soft/10 hover:bg-flame-soft/20 border border-flame/30 px-4 py-2 rounded-xl transition cursor-pointer"
                  >
                    {isWorkoutExpanded ? (
                      <>Show Less <ChevronUp size={15} /></>
                    ) : (
                      <>View All ({savedWorkoutsList.length}) <ChevronDown size={15} /></>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* LINE AREA GRAPH for Weight Progress */}
        <div className="bg-paper-raised dark:bg-surface-dark border border-line dark:border-line-dark p-6 rounded-xl space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-display font-semibold text-base flex items-center gap-2">
                <Scale size={18} className="text-flame" /> Weight Journey Line Area Graph
              </h2>
              <p className="text-xs text-ink-soft dark:text-ink-soft-dark mt-0.5">
                Target Weight: <span className="font-mono font-bold text-flame">{profile?.goalWeight || '--'} kg</span>
              </p>
            </div>
            {weightHistory.length > 1 && (
              <span className={`font-mono text-xs font-bold px-3 py-1 rounded-md border ${
                Number(weightDiff) <= 0 ? 'bg-moss-soft text-moss border-moss/30' : 'bg-flame-soft text-flame border-flame/30'
              }`}>
                {weightDiff > 0 ? `+${weightDiff}` : weightDiff} kg overall
              </span>
            )}
          </div>

          {weightHistory.length === 0 ? (
            <div className="text-center py-12 font-mono text-xs text-ink-soft dark:text-ink-soft-dark border border-dashed border-line dark:border-line-dark rounded-lg flex flex-col items-center gap-2">
              <Activity size={20} className="text-flame" />
              <span>No weight history logs available yet. Update your weight in Profile to see the graph!</span>
            </div>
          ) : (
            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weightHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="date" 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }} 
                  />
                  <YAxis 
                    domain={['dataMin - 2', 'dataMax + 2']} 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      borderColor: '#334155', 
                      borderRadius: '8px', 
                      color: '#fff', 
                      fontSize: '12px',
                      fontFamily: 'monospace'
                    }} 
                  />
                  <Area
                    type="monotone"
                    dataKey="weight"
                    stroke="#f97316"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#weightGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}