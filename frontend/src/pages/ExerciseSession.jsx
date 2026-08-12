import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowLeft,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  CheckCircle2,
  XCircle,
  Flame,
  Clock,
  Dumbbell,
} from 'lucide-react';

const SET_REST_SEC = 15;
const EXERCISE_REST_SEC = 25;

export default function ExerciseSession({ plan, onClose, onComplete }) {
  const exercises = plan.exercises;
  const totalExercises = exercises.length;

  const [exerciseIdx, setExerciseIdx] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  // phase: 'get-ready' | 'exercise' | 'set-rest' | 'exercise-rest' | 'summary'
  const [phase, setPhase] = useState('get-ready');
  const [timeLeft, setTimeLeft] = useState(exercises[0]?.timeSec || 30);
  const [isPaused, setIsPaused] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);

  const [statusMap, setStatusMap] = useState({}); // { [idx]: 'done' | 'skipped' }

  const voiceOnRef = useRef(voiceOn);
  useEffect(() => { voiceOnRef.current = voiceOn; }, [voiceOn]);

  const currentExercise = exercises[exerciseIdx];

  const speak = useCallback((text) => {
    if (!voiceOnRef.current) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.98;
    utter.pitch = 1;
    window.speechSynthesis.speak(utter);
  }, []);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (phase === 'get-ready') {
      speak(`Get ready for ${currentExercise.name}`);
    } else if (phase === 'exercise') {
      if (currentSet === 1) {
        speak(`${currentExercise.name}. ${currentExercise.desc}`);
      } else {
        speak(`Set ${currentSet}. Go.`);
      }
    } else if (phase === 'set-rest') {
      speak(`Rest. Next set coming up.`);
    } else if (phase === 'exercise-rest') {
      speak(`Nice work. Rest, then on to the next exercise.`);
    } else if (phase === 'summary') {
      speak(`Workout complete. Great job.`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, exerciseIdx, currentSet]);

  useEffect(() => {
    if (phase === 'summary' || phase === 'get-ready' || isPaused) return undefined;
    if (timeLeft <= 0) {
      advancePhase();
      return undefined;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, isPaused, phase]);

  const markResolved = (idx, status) => {
    setStatusMap((prev) => ({ ...prev, [idx]: status }));
  };

  // Called when a timer naturally reaches 0
  const advancePhase = () => {
    if (phase === 'exercise') {
      if (currentSet < currentExercise.sets) {
        setPhase('set-rest');
        setTimeLeft(SET_REST_SEC);
      } else {
        markResolved(exerciseIdx, 'done');
        goToNextExerciseOrEnd();
      }
    } else if (phase === 'set-rest') {
      setCurrentSet((s) => s + 1);
      setPhase('exercise');
      setTimeLeft(currentExercise.timeSec);
    } else if (phase === 'exercise-rest') {
      moveToExercise(exerciseIdx + 1);
    }
  };

  const goToNextExerciseOrEnd = () => {
    if (exerciseIdx >= totalExercises - 1) {
      setPhase('summary');
      return;
    }
    setPhase('exercise-rest');
    setTimeLeft(EXERCISE_REST_SEC);
  };

  const moveToExercise = (nextIdx) => {
    if (nextIdx >= totalExercises) {
      setPhase('summary');
      return;
    }
    setExerciseIdx(nextIdx);
    setCurrentSet(1);
    setPhase('get-ready');
  };

  const startExercise = () => {
    setPhase('exercise');
    setTimeLeft(currentExercise.timeSec);
  };

  const handleSkipExercise = () => {
    markResolved(exerciseIdx, 'skipped');
    goToNextExerciseOrEnd();
  };

  const handleSkipRest = () => {
    advancePhase();
  };

  const handlePrevious = () => {
    if (exerciseIdx === 0) return;
    setExerciseIdx((i) => i - 1);
    setCurrentSet(1);
    setPhase('get-ready');
  };

  const handlePauseToggle = () => {
    setIsPaused((p) => {
      const next = !p;
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        if (next) window.speechSynthesis.pause();
        else window.speechSynthesis.resume();
      }
      return next;
    });
  };

  const completedCount = Object.values(statusMap).filter((s) => s === 'done').length;
  const caloriesPerExercise = plan.caloriesNum / totalExercises;
  const durationPerExercise = plan.durationNum / totalExercises;
  const earnedCalories = Math.round(caloriesPerExercise * completedCount);
  const earnedDuration = Math.max(1, Math.round(durationPerExercise * completedCount));

  const handleSaveWorkout = () => {
    const entry = {
      id: Date.now(),
      title: plan.title,
      category: plan.category,
      duration: earnedDuration,
      calories: earnedCalories,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      completed: true,
    };
    onComplete(entry);
  };

  const fmt = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  // ---------- Summary screen ----------
  if (phase === 'summary') {
    return (
      <div className="w-full min-h-[calc(100vh-65px)] bg-paper dark:bg-ink-dark text-ink dark:text-paper-dark px-6 lg:px-12 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <CheckCircle2 className="mx-auto text-moss" size={48} />
            <h1 className="font-display text-2xl font-semibold">Session complete</h1>
            <p className="text-sm text-ink-soft dark:text-ink-soft-dark">
              {plan.title} — {completedCount} of {totalExercises} exercises completed
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-paper-raised dark:bg-surface-dark border border-line dark:border-line-dark rounded-xl p-5 text-center">
              <Flame className="mx-auto text-flame mb-1" size={20} />
              <p className="font-mono text-2xl font-semibold">{earnedCalories}</p>
              <p className="text-xs text-ink-soft dark:text-ink-soft-dark">kcal earned</p>
            </div>
            <div className="bg-paper-raised dark:bg-surface-dark border border-line dark:border-line-dark rounded-xl p-5 text-center">
              <Clock className="mx-auto text-ocean mb-1" size={20} />
              <p className="font-mono text-2xl font-semibold">{earnedDuration}</p>
              <p className="text-xs text-ink-soft dark:text-ink-soft-dark">mins credited</p>
            </div>
          </div>

          <div className="space-y-2">
            {exercises.map((ex, idx) => {
              const status = statusMap[idx];
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-paper-raised dark:bg-surface-dark border border-line dark:border-line-dark rounded-lg"
                >
                  <span className="text-sm font-medium">{ex.name}</span>
                  {status === 'done' ? (
                    <span className="flex items-center gap-1 text-xs font-semibold text-moss">
                      <CheckCircle2 size={14} /> Completed
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-semibold text-ink-soft dark:text-ink-soft-dark">
                      <XCircle size={14} /> Skipped — no calories
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 border border-line dark:border-line-dark text-ink-soft dark:text-ink-soft-dark font-semibold py-3 rounded-lg text-sm transition hover:text-ink dark:hover:text-paper-dark"
            >
              Discard
            </button>
            <button
              onClick={handleSaveWorkout}
              disabled={completedCount === 0}
              className="flex-1 bg-flame hover:bg-flame/90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg text-sm transition"
            >
              Save & log workout
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isRest = phase === 'set-rest' || phase === 'exercise-rest';
  const nextExercise = phase === 'exercise-rest' ? exercises[exerciseIdx + 1] : null;

  // ---------- Top bar (shared) ----------
  const TopBar = (
    <div className="flex items-center justify-between">
      <button
        onClick={onClose}
        className="flex items-center gap-1.5 text-sm font-semibold text-ink-soft dark:text-ink-soft-dark hover:text-ink dark:hover:text-paper-dark transition"
      >
        <ArrowLeft size={16} /> Exit
      </button>
      <span className="font-mono text-xs text-ink-soft dark:text-ink-soft-dark">
        Exercise {exerciseIdx + 1} / {totalExercises}
      </span>
      <button
        onClick={() => setVoiceOn((v) => !v)}
        className="p-2 rounded-md border border-line dark:border-line-dark text-ink-soft dark:text-ink-soft-dark hover:text-ink dark:hover:text-paper-dark transition"
        title={voiceOn ? 'Mute voice cues' : 'Unmute voice cues'}
      >
        {voiceOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
      </button>
    </div>
  );

  const ProgressStrip = (
    <div className="flex gap-1.5">
      {exercises.map((_, idx) => {
        let color = 'bg-line dark:bg-line-dark';
        if (idx === exerciseIdx) color = 'bg-flame';
        else if (statusMap[idx] === 'done') color = 'bg-moss';
        else if (statusMap[idx] === 'skipped') color = 'bg-ink-soft dark:bg-ink-soft-dark';
        return <div key={idx} className={`h-1.5 flex-1 rounded-full ${color}`} />;
      })}
    </div>
  );

  // ---------- Get ready screen ----------
  if (phase === 'get-ready') {
    return (
      <div className="w-full min-h-[calc(100vh-65px)] bg-paper dark:bg-ink-dark text-ink dark:text-paper-dark px-6 lg:px-12 py-8">
        <div className="max-w-md mx-auto space-y-6">
          {TopBar}
          {ProgressStrip}

          <div className="w-full aspect-square rounded-xl overflow-hidden bg-paper-raised dark:bg-surface-dark border border-line dark:border-line-dark">
            <img
              src={currentExercise.image || plan.image}
              alt={currentExercise.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="text-center space-y-2 pt-2">
            <p className="font-mono text-xs font-semibold text-flame uppercase tracking-widest">
              Get ready for
            </p>
            <h1 className="font-display text-2xl font-semibold">
              {currentExercise.name} · {currentExercise.timeSec}s
            </h1>
          </div>

          <div className="flex items-center gap-3 pt-2">
            {exerciseIdx > 0 && (
              <button
                onClick={handlePrevious}
                className="border border-line dark:border-line-dark text-ink-soft dark:text-ink-soft-dark hover:text-ink dark:hover:text-paper-dark font-semibold px-5 py-3 rounded-lg text-sm flex items-center gap-2 transition"
              >
                <SkipBack size={16} /> Previous
              </button>
            )}
            <button
              onClick={startExercise}
              className="flex-1 bg-flame hover:bg-flame/90 text-white font-semibold py-3 rounded-lg text-sm transition"
            >
              I'm ready
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- Active exercise / rest screen — split layout on desktop ----------
  return (
    <div className="w-full min-h-[calc(100vh-65px)] bg-paper dark:bg-ink-dark text-ink dark:text-paper-dark px-6 lg:px-12 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {TopBar}
        {ProgressStrip}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

          {/* Left: media */}
          <div className="lg:sticky lg:top-8">
            <div className="relative w-full aspect-video lg:aspect-square rounded-xl overflow-hidden bg-ink border border-line dark:border-line-dark">
              {currentExercise.video ? (
                <video
                  key={currentExercise.video}
                  src={currentExercise.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={currentExercise.image || plan.image}
                  alt={currentExercise.name}
                  className={`w-full h-full object-cover transition-transform duration-1000 ${isPaused ? '' : 'animate-pulse'}`}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent lg:hidden" />
              <div className="absolute bottom-4 left-4 right-4 lg:hidden">
                <h2 className="font-display text-xl font-semibold text-white">
                  {isRest
                    ? (phase === 'exercise-rest' ? 'Rest' : `Rest before set ${currentSet}`)
                    : currentExercise.name}
                </h2>
              </div>
            </div>
          </div>

          {/* Right: timer, description, controls */}
          <div className="space-y-6">
            <div className="hidden lg:block">
              <span className="font-mono text-xs font-semibold text-flame uppercase tracking-widest">
                {isRest
                  ? (phase === 'exercise-rest' ? 'Rest' : `Rest before set ${currentSet}`)
                  : `Set ${currentSet} of ${currentExercise.sets}`}
              </span>
              <h2 className="font-display text-2xl font-semibold mt-1">
                {isRest ? (phase === 'exercise-rest' ? 'Take a breather' : 'Quick rest') : currentExercise.name}
              </h2>
              {!isRest && (
                <p className="text-sm text-ink-soft dark:text-ink-soft-dark mt-2 max-w-md">
                  {currentExercise.desc}
                </p>
              )}
              {phase === 'exercise-rest' && nextExercise && (
                <p className="text-sm text-ink-soft dark:text-ink-soft-dark mt-2">
                  Up next: <span className="font-semibold text-ink dark:text-paper-dark">{nextExercise.name}</span>
                </p>
              )}
            </div>

            <div className="bg-flame-soft dark:bg-flame-soft-dark border border-flame/20 rounded-xl p-6 flex flex-col items-center gap-4">
              <span className="lg:hidden font-mono text-[11px] font-semibold text-flame uppercase tracking-widest">
                {isRest ? 'Rest' : `Set ${currentSet} of ${currentExercise.sets}`}
              </span>
              <div className="font-mono text-6xl font-semibold tracking-wider">{fmt(timeLeft)}</div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handlePauseToggle}
                  className="bg-flame hover:bg-flame/90 text-white font-semibold px-5 py-2.5 rounded-md text-sm flex items-center gap-2 transition"
                >
                  {isPaused ? <Play size={16} /> : <Pause size={16} />} {isPaused ? 'Resume' : 'Pause'}
                </button>

                {isRest ? (
                  <button
                    onClick={handleSkipRest}
                    className="border border-line dark:border-line-dark text-ink-soft dark:text-ink-soft-dark hover:text-ink dark:hover:text-paper-dark font-semibold px-5 py-2.5 rounded-md text-sm flex items-center gap-2 transition"
                  >
                    <SkipForward size={16} /> Skip rest
                  </button>
                ) : (
                  <button
                    onClick={handleSkipExercise}
                    className="border border-line dark:border-line-dark text-ink-soft dark:text-ink-soft-dark hover:text-ink dark:hover:text-paper-dark font-semibold px-5 py-2.5 rounded-md text-sm flex items-center gap-2 transition"
                  >
                    <SkipForward size={16} /> Skip exercise
                  </button>
                )}
              </div>

              {!isRest && (
                <p className="font-mono text-[11px] text-ink-soft dark:text-ink-soft-dark">
                  Target: {currentExercise.reps} reps per set
                </p>
              )}

              {currentSet === 1 && !isRest && exerciseIdx > 0 && (
                <button
                  onClick={handlePrevious}
                  className="text-xs font-semibold text-ink-soft dark:text-ink-soft-dark hover:text-ink dark:hover:text-paper-dark flex items-center gap-1.5 transition"
                >
                  <SkipBack size={13} /> Previous exercise
                </button>
              )}
            </div>

            {/* Instructions block, visible on desktop under the timer too */}
            {!isRest && (
              <div className="bg-paper-raised dark:bg-surface-dark border border-line dark:border-line-dark rounded-xl p-5">
                <h3 className="font-mono text-[11px] font-semibold text-ink-soft dark:text-ink-soft-dark uppercase tracking-widest mb-2">
                  How to do it
                </h3>
                <p className="text-sm">{currentExercise.desc}</p>
              </div>
            )}

            {/* Up-next strip */}
            <div className="space-y-2">
              <h3 className="font-mono text-[11px] font-semibold text-ink-soft dark:text-ink-soft-dark uppercase tracking-widest">
                Routine order
              </h3>
              <div className="flex flex-col gap-2">
                {exercises.map((ex, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 p-2.5 rounded-lg border text-sm ${
                      idx === exerciseIdx
                        ? 'border-flame bg-flame-soft dark:bg-flame-soft-dark font-semibold'
                        : 'border-line dark:border-line-dark text-ink-soft dark:text-ink-soft-dark'
                    }`}
                  >
                    <Dumbbell size={14} />
                    <span className="flex-1">{ex.name}</span>
                    {statusMap[idx] === 'done' && <CheckCircle2 size={14} className="text-moss" />}
                    {statusMap[idx] === 'skipped' && <XCircle size={14} />}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}