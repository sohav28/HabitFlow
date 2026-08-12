import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  LayoutDashboard,
  Dumbbell,
  BarChart3,
  User,
  LogOut,
  Sun,
  Moon,
  Menu,
  X
} from 'lucide-react';
import Logo from './Logo';

export default function Navbar() {
  const { user, logout, theme, toggleTheme } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const useNavigateInstance = useNavigate();

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Workouts', path: '/workouts', icon: Dumbbell },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  if (['/login', '/register'].includes(location.pathname)) {
    return null;
  }

  return (
    <header className="w-full bg-paper/95 dark:bg-ink-dark/95 backdrop-blur-md border-b border-line dark:border-line-dark sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-20 flex items-center justify-between">

        {/* Brand Logo & Tag */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <Logo size={28} />
          </Link>
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-paper-raised dark:bg-surface-dark border border-line dark:border-line-dark text-[11px] font-mono text-ink-soft dark:text-ink-soft-dark">
            <span className="w-2 h-2 rounded-full bg-moss animate-pulse"></span>
            System Online
          </div>
        </div>

        {/* Center Navigation Links (desktop/tablet only) */}
        <nav className="hidden md:flex items-center gap-1.5 bg-paper-raised dark:bg-surface-dark p-1.5 rounded-xl border border-line dark:border-line-dark shadow-xs">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-flame text-white shadow-xs'
                    : 'text-ink-soft dark:text-ink-soft-dark hover:text-ink dark:hover:text-paper-dark hover:bg-paper dark:hover:bg-ink-dark'
                }`}
              >
                <Icon size={15} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Actions & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* User Minimal Pill (Visible on small screens and up) */}
          {user && (
            <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-paper-raised dark:bg-surface-dark border border-line dark:border-line-dark">
              <div className="w-7 h-7 rounded-lg bg-flame/10 text-flame flex items-center justify-center font-bold text-xs uppercase font-mono border border-flame/20">
                {user.name ? user.name[0] : 'U'}
              </div>
              <div className="hidden sm:block text-left font-mono text-xs">
                <p className="font-semibold text-ink dark:text-paper-dark leading-tight">{user.name || 'Athlete'}</p>
              </div>
            </div>
          )}

          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            className="p-2 sm:p-2.5 rounded-xl bg-paper-raised dark:bg-surface-dark border border-line dark:border-line-dark text-ink-soft dark:text-ink-soft-dark hover:text-ink dark:hover:text-paper-dark hover:border-ink/30 transition cursor-pointer shadow-xs"
            title="Toggle theme"
          >
            {theme === 'light' ? <Moon size={17} /> : <Sun size={17} className="text-flame" />}
          </button>

          {/* Logout Button (Desktop) */}
          {user && (
            <button
              onClick={() => {
                logout();
                useNavigateInstance('/login');
              }}
              className="hidden sm:flex items-center gap-2 bg-paper-raised dark:bg-surface-dark border border-line dark:border-line-dark hover:border-flame/40 text-ink-soft dark:text-ink-soft-dark hover:text-flame px-3.5 py-2.5 rounded-xl text-xs font-mono font-semibold transition cursor-pointer shadow-xs"
              title="Logout session"
            >
              <LogOut size={15} />
              <span>Logout</span>
            </button>
          )}

          {/* Hamburger button - mobile only */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl bg-paper-raised dark:bg-surface-dark border border-line dark:border-line-dark text-ink-soft dark:text-ink-soft-dark hover:text-ink dark:hover:text-paper-dark hover:border-ink/30 transition cursor-pointer shadow-xs"
            title="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden flex flex-col gap-2 p-4 bg-paper-raised dark:bg-surface-dark border-t border-line dark:border-line-dark shadow-lg">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-flame text-white'
                    : 'text-ink-soft dark:text-ink-soft-dark hover:bg-paper dark:hover:bg-ink-dark hover:text-ink dark:hover:text-paper-dark'
                }`}
              >
                <Icon size={16} />
                <span>{link.name}</span>
              </Link>
            );
          })}

          {/* Logout option inside mobile menu */}
          {user && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                logout();
                useNavigateInstance('/login');
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-xs font-semibold text-flame hover:bg-flame/10 transition mt-2 border-t border-line dark:border-line-dark pt-3"
            >
              <LogOut size={16} />
              <span>Logout Session</span>
            </button>
          )}
        </nav>
      )}
    </header>
  );
}