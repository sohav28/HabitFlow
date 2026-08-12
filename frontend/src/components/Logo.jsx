import React from 'react';

export default function Logo({ size = 26 }) {
  return (
    <div className="flex items-center gap-2 font-display font-extrabold tracking-tight select-none">
      {/* Flame & Bars Icon */}
      <div className="relative flex items-end">
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Bar 1 - Light in Dark mode, Dark in Light mode */}
          <rect
            x="3"
            y="12"
            width="3"
            height="8"
            rx="1.5"
            className="fill-slate-400 dark:fill-slate-500"
          />
          {/* Bar 2 */}
          <rect
            x="8.5"
            y="8"
            width="3"
            height="12"
            rx="1.5"
            className="fill-slate-600 dark:fill-slate-300"
          />
          {/* Flame Icon */}
          <path
            d="M17.5 3C17.5 3 13.5 7.5 13.5 12C13.5 14.2091 15.2909 16 17.5 16C19.7091 16 21.5 14.2091 21.5 12C21.5 7.5 17.5 3 17.5 3Z"
            className="fill-flame"
          />
        </svg>
      </div>

      {/* Brand Name Text */}
      <span className="text-xl md:text-2xl font-black tracking-tight">
        {/* "Habit" -> Light Mode me Dark (`text-ink`), Dark Mode me White (`dark:text-paper-dark` / `dark:text-white`) */}
        <span className="text-ink dark:text-white transition-colors duration-200">
          Habit
        </span>
        {/* "Flow" -> Dono themes me Flame Orange rahega */}
        <span className="text-flame">
          Flow
        </span>
      </span>
    </div>
  );
}