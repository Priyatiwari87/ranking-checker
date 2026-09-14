import React from 'react';
import { RankingBadge, TrendBadge } from './Badges';
import { Globe, Search, Clock, Cpu, Info, CheckCircle2, AlertCircle } from 'lucide-react';

const RankingCard = ({ result }) => {
  if (!result) return null;

  const {
    businessName,
    websiteUrl,
    domain,
    searchQuery,
    ranking,
    found,
    provider,
    isDemo,
    checkedAt,
    previousRanking,
    rankingChange
  } = result;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden transition-colors">
      {/* Accent Header Glow */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-500" />

      {/* Top Meta Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
              {businessName}
            </h2>
            <RankingBadge rank={ranking} found={found} />
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
            <Globe className="w-3.5 h-3.5" />
            <a
              href={websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline font-medium text-sky-600 dark:text-sky-400"
            >
              {domain || websiteUrl}
            </a>
          </div>
        </div>

        {/* Demo Mode Notice Badge */}
        {isDemo && (
          <div className="inline-flex items-center space-x-1.5 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-xl text-amber-600 dark:text-amber-400 text-xs font-semibold">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>Demo Mode (Simulated Results)</span>
          </div>
        )}
      </div>

      {/* Main Ranking Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-slate-100 dark:border-slate-800 items-center">
        {/* Prominent Ranking Box */}
        <div className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            Current Ranking Position
          </span>
          <div className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight my-1">
            {found ? `#${ranking}` : '—'}
          </div>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {found ? (ranking <= 3 ? 'Top 3 Position' : ranking <= 10 ? 'Top 10 Position' : 'Organic Ranking') : 'Not Found in Depth'}
          </span>
        </div>

        {/* Status Interpretation */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-start space-x-3">
            {found ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                {found ? `Website found at rank #${ranking}` : 'Website not found in checked results'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {found
                  ? `Target domain (${domain}) matched search results for query "${searchQuery}".`
                  : `Your website (${domain}) was not found in the search results checked for query "${searchQuery}".`}
              </p>
            </div>
          </div>

          {/* Historical Trend */}
          <div className="p-3 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Historical Position Change:
            </span>
            <TrendBadge
              change={rankingChange}
              previousRanking={previousRanking}
              currentRanking={ranking}
            />
          </div>
        </div>
      </div>

      {/* Details Footer */}
      <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div>
          <span className="text-slate-400 block mb-0.5 font-medium">Search Query</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
            <Search className="w-3 h-3 text-slate-400" />
            {searchQuery}
          </span>
        </div>

        <div>
          <span className="text-slate-400 block mb-0.5 font-medium">Search Engine Engine</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
            <Cpu className="w-3 h-3 text-slate-400" />
            {provider || 'Configured Provider'}
          </span>
        </div>

        <div>
          <span className="text-slate-400 block mb-0.5 font-medium">Status</span>
          <span className={`font-bold flex items-center gap-1 ${found ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
            {found ? 'Found' : 'Not Found'}
          </span>
        </div>

        <div>
          <span className="text-slate-400 block mb-0.5 font-medium">Checked</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            {checkedAt ? new Date(checkedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RankingCard;
