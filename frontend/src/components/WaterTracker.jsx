import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Dumbbell, CheckCircle } from 'lucide-react';

export default function WorkoutTracker() {
  const { user } = useContext(AuthContext);
  const [workouts, setWorkouts] = useState([]);

  const today = new Date().toISOString().split('T')[0];

  const fetchWorkouts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/workouts', {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setWorkouts(res.data);
    } catch (err) {
      console.error('Error fetching workouts:', err);
    }
  };

  useEffect(() => {
    if (user) fetchWorkouts();
  }, [user]);

  const toggleWorkoutLog = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/workouts/${id}/log`,
        {},
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      fetchWorkouts();
    } catch (err) {
      console.error('Error logging workout:', err);
    }
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800/80 mb-8">
      <h2 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
        <Dumbbell className="text-emerald-400" /> Workout Tracker
      </h2>

      {workouts.length === 0 ? (
        <p className="text-xs text-slate-500">No active workouts logged for today.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workouts.map((w) => {
            const isLoggedToday = w.completedDates?.includes(today);
            return (
              <div key={w._id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-white text-sm">{w.title}</h4>
                </div>
                <button
                  onClick={() => toggleWorkoutLog(w._id)}
                  className={`p-2 rounded-lg transition ${
                    isLoggedToday ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <CheckCircle size={18} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}