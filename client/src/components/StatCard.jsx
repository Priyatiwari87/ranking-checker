import React from 'react';

const StatCard = ({ title, value, icon: Icon, description, trend, badgeText, color = 'sky' }) => {
  const colorMap = {
    sky: 'from-sky-500/10 to-indigo-500/5 text-sky-600 dark:text-sky-400 border-sky-500/20',
    emerald: 'from-emerald-500/10 to-teal-500/5 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    rose: 'from-rose-500/10 to-pink-500/5 text-rose-600 dark:text-rose-400 border-rose-500/20',
    amber: 'from-amber-500/10 to-orange-500/5 text-amber-600 dark:text-amber-400 border-amber-500/20'
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className={`p-2.5 rounded-xl border bg-gradient-to-br ${colorMap[color] || colorMap.sky}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <div className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {value !== null && value !== undefined ? value : '—'}
        </div>
        {badgeText && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {badgeText}
          </span>
        )}
      </div>

      {description && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {description}
        </p>
      )}
    </div>
  );
};

export default StatCard;
