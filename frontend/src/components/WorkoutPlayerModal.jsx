import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, CheckCircle, X } from 'lucide-react';

export default function WorkoutPlayerModal({ exercise, onClose }) {
  const [currentSet, setCurrentSet] = useState(1);
  const [timeLeft, setTimeLeft] = useState(exercise.defaultRestTimerSec || 60);
  const [isResting, setIsResting] = useState(false);

  useEffect(() => {
    let timer;
    if (isResting && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsResting(false);
      setTimeLeft(exercise.defaultRestTimerSec || 60);
    }
    return () => clearInterval(timer);
  }, [isResting, timeLeft]);

  const handleSetComplete = () => {
    if (currentSet < exercise.targetSets) {
      setCurrentSet((prev) => prev + 1);
      setIsResting(true); // Start rest timer
    } else {
      alert('Workout Exercise Completed!');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X size={20} />
        </button>

        <img
          src={exercise.imageUrl}
          alt={exercise.title}
          className="w-full h-56 object-cover rounded-xl mb-4 border border-slate-800"
        />

        <h3 className="text-xl font-extrabold text-white">{exercise.title}</h3>
        <p className="text-xs text-emerald-400 mb-4">{exercise.category} • Target: {exercise.targetSets} Sets x {exercise.targetReps} Reps</p>

        {/* Live Set & Rest Control */}
        <div className="bg-slate-950 p-4 rounded-xl text-center border border-slate-800 mb-4">
          {isResting ? (
            <div>
              <p className="text-xs text-amber-400 font-semibold uppercase">Rest Timer Active</p>
              <h2 className="text-4xl font-black text-amber-400 my-1">{timeLeft}s</h2>
              <p className="text-[11px] text-slate-500">Catch your breath before Set {currentSet}</p>
            </div>
          ) : (
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Current Progress</p>
              <h2 className="text-3xl font-black text-white my-1">Set {currentSet} of {exercise.targetSets}</h2>
              <p className="text-xs text-slate-400">Perform {exercise.targetReps} Reps</p>
            </div>
          )}
        </div>

        <button
          onClick={handleSetComplete}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-3 rounded-xl flex items-center justify-center gap-2 transition"
        >
          <CheckCircle size={18} />
          {isResting ? 'Skip Rest & Start Next Set' : `Complete Set ${currentSet}`}
        </button>
      </div>
    </div>
  );
}