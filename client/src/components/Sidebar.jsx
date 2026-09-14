import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Search, History, Settings, ShieldCheck, X } from 'lucide-react';

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const navItems = [
    { name: 'Overview', path: '/', icon: LayoutDashboard },
    { name: 'Check Ranking', path: '/check', icon: Search },
    { name: 'Search History', path: '/history', icon: History },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const content = (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 text-slate-300 w-64 px-4 py-6">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-2 mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-tr from-sky-500 to-indigo-600 rounded-xl shadow-lg shadow-sky-500/20 text-white">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              RankCheck
            </h1>
            <span className="text-[10px] font-semibold tracking-wider text-sky-400 uppercase bg-sky-950/80 border border-sky-800/50 px-1.5 py-0.5 rounded">
              SaaS v1.0
            </span>
          </div>
        </div>
        {mobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white md:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                    : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Provider Status Indicator */}
      <div className="pt-4 border-t border-slate-800/80 px-2">
        <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span>Provider Engine</span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Demo Active
            </span>
          </div>
          <p className="text-[11px] text-slate-400 truncate">
            Pluggable Provider Architecture Ready
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block fixed inset-y-0 left-0 z-30">
        {content}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {content}
      </div>
    </>
  );
};

export default Sidebar;
