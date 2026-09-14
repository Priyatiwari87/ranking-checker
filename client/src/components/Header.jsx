import React from 'react';
import { Menu, Moon, Sun, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Header = ({ title, subtitle, onMobileMenuToggle }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 py-4 transition-colors">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left Side: Mobile Menu Button & Page Title */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onMobileMenuToggle}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden transition-colors"
            aria-label="Open Mobile Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Theme Toggle & User Avatar Placeholder */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* User Profile Placeholder */}
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 p-0.5 shadow-sm">
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[10px] flex items-center justify-center">
                <User className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              </div>
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                Priya Tiwari
              </p>
              <p className="text-[10px] text-sky-500 dark:text-sky-400 font-medium">
                SEO Admin
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
