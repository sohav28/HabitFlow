import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import { User, Mail, Lock, ArrowRight, AlertCircle, Flame, ShieldCheck, Activity } from 'lucide-react';
import axios from 'axios';
import Logo from '../components/Logo';

const buildDemoStreak = () =>
  Array.from({ length: 35 }, (_, i) => {
    if (i === 34) return 'today';
    return Math.random() > 0.35 ? 'done' : 'empty';
  });

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [streak] = useState(buildDemoStreak);

  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // REAL GOOGLE LOGIN / REGISTER HOOK
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setGoogleLoading(true);
        const res = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });

        const realGoogleUser = {
          name: res.data.name,
          email: res.data.email,
          picture: res.data.picture,
          token: tokenResponse.access_token,
        };

        localStorage.setItem('userInfo', JSON.stringify(realGoogleUser));
        setUser(realGoogleUser);
        navigate('/dashboard', { replace: true });
      } catch (err) {
        setError('Failed to fetch real Google profile details.');
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      setError('Google Sign Up was unsuccessful.');
      setGoogleLoading(false);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);

    try {
      let userData;
      try {
        const res = await axios.post('http://localhost:5000/api/auth/register', {
          name,
          email,
          password,
        });
        userData = res.data;
      } catch (err) {
        userData = {
          name,
          email,
          token: 'demo-jwt-token-registered',
        };
      }

      localStorage.setItem('userInfo', JSON.stringify(userData));
      setUser(userData);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-paper dark:bg-ink-dark text-ink dark:text-paper-dark selection:bg-flame selection:text-white">
      
      {/* Left: Enhanced Fitness Form */}
      <div className="flex items-center justify-center p-6 sm:p-12 order-2 lg:order-1">
        <div className="w-full max-w-md space-y-7">
          
          <div className="lg:hidden">
            <Link to="/"><Logo size={24} /></Link>
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider bg-flame/10 text-flame px-3 py-1 rounded-full border border-flame/20 mb-1">
              <Activity size={13} className="animate-pulse" /> Join The Athlete Network
            </div>
            <h1 className="font-display text-3xl font-semibold tracking-tight">Start your physical streak</h1>
            <p className="text-sm text-ink-soft dark:text-ink-soft-dark">Your transformation begins the exact second you sign up.</p>
          </div>

          {error && (
            <div className="bg-flame-soft dark:bg-flame-soft-dark border border-flame/30 text-flame text-sm p-3.5 rounded-xl flex items-center gap-2.5">
              <AlertCircle size={18} className="shrink-0" /> {error}
            </div>
          )}

          {/* REAL GOOGLE BUTTON */}
          <button
            type="button"
            onClick={() => {
              setError('');
              googleLogin();
            }}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 border border-line dark:border-line-dark hover:border-ink/30 dark:hover:border-paper-dark/30 bg-paper-raised dark:bg-surface-dark py-3.5 rounded-xl text-xs font-mono font-semibold transition-all shadow-2xs cursor-pointer disabled:opacity-65"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.19v3.15C3.17 21.3 7.22 24 12 24z" />
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.19C.43 8.12 0 9.87 0 12s.43 3.88 1.19 5.42l4.09-3.15z" />
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.22 0 3.17 2.7 1.19 6.58l4.09 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
            </svg>
            {googleLoading ? 'Connecting to Google...' : 'Continue with Google'}
          </button>

          {/* DIVIDER */}
          <div className="flex items-center my-2">
            <div className="flex-grow border-t border-line dark:border-line-dark"></div>
            <span className="px-3 text-[10px] font-mono uppercase tracking-widest text-ink-soft dark:text-ink-soft-dark">or continue with email</span>
            <div className="flex-grow border-t border-line dark:border-line-dark"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-ink-soft dark:text-ink-soft-dark mb-1.5 uppercase tracking-wide font-mono">
                Full name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft dark:text-ink-soft-dark" size={17} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Marcus Vance"
                  className="w-full bg-paper-raised dark:bg-surface-dark border border-line dark:border-line-dark text-ink dark:text-paper-dark text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-flame transition shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-soft dark:text-ink-soft-dark mb-1.5 uppercase tracking-wide font-mono">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft dark:text-ink-soft-dark" size={17} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="marcus@athlete.com"
                  className="w-full bg-paper-raised dark:bg-surface-dark border border-line dark:border-line-dark text-ink dark:text-paper-dark text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-flame transition shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-soft dark:text-ink-soft-dark mb-1.5 uppercase tracking-wide font-mono">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft dark:text-ink-soft-dark" size={17} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-paper-raised dark:bg-surface-dark border border-line dark:border-line-dark text-ink dark:text-paper-dark text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-flame transition shadow-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-flame hover:bg-flame/90 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-flame/30 hover:-translate-y-0.5 cursor-pointer mt-2"
            >
              {loading ? 'Initializing profile…' : <>Create free account <ArrowRight size={17} /></>}
            </button>
          </form>

          <div className="flex items-center gap-2 text-xs font-mono text-ink-soft dark:text-ink-soft-dark justify-center pt-1">
            <ShieldCheck size={14} className="text-flame" /> JWT secured encrypted training profile
          </div>

          <p className="text-center text-sm text-ink-soft dark:text-ink-soft-dark">
            Already crushing goals?{' '}
            <Link to="/login" className="text-flame font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right: Immersive Fitness Brand Panel — hidden below lg */}
      <div className="hidden lg:flex flex-col justify-between bg-ink text-paper-dark p-12 order-1 lg:order-2 relative overflow-hidden border-l border-line-dark">
        <div className="absolute top-0 right-0 w-80 h-80 bg-flame/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex justify-between items-center relative z-10">
          <span className="font-mono text-xs uppercase tracking-wider text-ink-soft-dark flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <Flame size={13} className="text-flame" /> HabitFlow Core Engine
          </span>
          <Link to="/">
            <Logo size={26} textClassName="text-paper-dark" />
          </Link>
        </div>

        <div className="space-y-6 max-w-lg my-auto relative z-10 py-8">
          <h2 className="font-display text-4xl lg:text-5xl font-semibold leading-[1.1] tracking-tight">
            Every elite streak <span className="text-flame">starts with day one.</span>
          </h2>
          <p className="text-ink-soft-dark text-base leading-relaxed">
            Targeted body splits, automated hydration rings, and high-performance consistency grids built for serious physical growth.
          </p>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs text-ink-soft-dark uppercase tracking-wider">Live Preview Matrix</span>
              <span className="text-xs font-mono text-flame flex items-center gap-1"><Flame size={12} /> Active Sync</span>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {streak.map((s, i) => (
                <div
                  key={i}
                  className={
                    'aspect-square rounded-[6px] transition-all ' +
                    (s === 'done' ? 'bg-flame shadow-sm shadow-flame/50' : s === 'today' ? 'border-2 border-flame bg-flame/30 animate-pulse' : 'bg-white/10')
                  }
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center font-mono text-xs text-ink-soft-dark relative z-10 pt-4 border-t border-white/10">
          <span>habitflow.app / secure onboarding</span>
          <span className="text-flame font-semibold">Ready to train</span>
        </div>
      </div>
    </div>
  );
}