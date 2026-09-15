import React, { useState, useEffect } from 'react';
import { Cpu, ShieldCheck, Key, RefreshCw, CheckCircle2 } from 'lucide-react';
import { getHealthApi } from '../services/api';

const Settings = () => {
  const [provider, setProvider] = useState(() => {
    return localStorage.getItem('selected_provider') || 'custom';
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getHealthApi()
      .then((data) => {
        if (data && data.searchProvider) {
          setProvider('custom');
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('selected_provider', provider);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl transition-colors">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Cpu className="w-6 h-6 text-sky-500" />
          <span>Ranking Engine & Provider Settings</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Configure search provider adapters, custom web scrapers, and environment settings.
        </p>
      </div>

      {/* Provider Selection Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6 transition-colors">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>Search Ranking Provider Architecture</span>
        </h3>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Custom Google Scraper Provider Option */}
            <div
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                provider === 'custom'
                  ? 'bg-sky-500/10 border-sky-500 ring-2 ring-sky-500/20'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 opacity-80 hover:opacity-100'
              }`}
              onClick={() => setProvider('custom')}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  Custom Google Scraper (Live SERP)
                </span>
                <span
                  className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                    provider === 'custom'
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {provider === 'custom' ? 'CUSTOM API ACTIVE' : 'LIVE SCRAPER'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Fetches live organic Google Search results directly using custom backend Web Scraper. 100% custom code, no 3rd party API keys required.
              </p>
            </div>

            {/* Demo Provider Card Option */}
            <div
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                provider === 'demo'
                  ? 'bg-sky-500/10 border-sky-500 ring-2 ring-sky-500/20'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 opacity-80 hover:opacity-100'
              }`}
              onClick={() => setProvider('demo')}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  Demo Provider (Simulated SERP)
                </span>
                <span
                  className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                    provider === 'demo'
                      ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {provider === 'demo' ? 'DEMO ACTIVE' : 'SIMULATED'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Generates realistic simulated search engine results. Recommended for offline testing.
              </p>
            </div>
          </div>

          {/* API Key Instructions */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs space-y-3">
            <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 font-semibold">
              <Key className="w-4 h-4 text-sky-500" />
              <span>Environment Variable Configuration</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400">
              API backend architecture is fully custom. Zero 3rd party API keys required.
            </p>
            <div className="font-mono bg-slate-900 text-slate-200 p-3 rounded-xl overflow-x-auto text-[11px]">
              SEARCH_PROVIDER=custom<br />
              SEARCH_ENGINE=google_live_scraper<br />
              # 100% Custom Scraper - Zero 3rd Party API Key
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs shadow-md shadow-sky-600/20 transition-all flex items-center space-x-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Save Configuration</span>
            </button>

            {saved && (
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Configuration Saved</span>
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Security & Replaceability Architecture Summary */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-4 transition-colors">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          <span>Pluggable Adapter Architecture</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          RankCheck uses the Adapter Pattern with an abstract <code className="text-sky-500 font-mono">BaseSearchProvider</code> interface. Switching to Google Search, Google Maps/Local ranking, or custom SERP web scrapers requires zero frontend code modifications.
        </p>
      </div>
    </div>
  );
};

export default Settings;
