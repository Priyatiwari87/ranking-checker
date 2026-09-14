import React from 'react';
import { Trophy, Award, SearchX, Hash, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export const RankingBadge = ({ rank, found = true }) => {
  if (!found || rank === null || rank === undefined) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
        <SearchX className="w-3.5 h-3.5" />
        Not Found
      </span>
    );
  }

  if (rank >= 1 && rank <= 3) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 shadow-sm">
        <Trophy className="w-3.5 h-3.5 text-amber-500" />
        Top 3 (#{rank})
      </span>
    );
  }

  if (rank >= 4 && rank <= 10) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
        <Award className="w-3.5 h-3.5 text-sky-500" />
        Top 10 (#{rank})
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-500/10 text-slate-700 dark:text-slate-300 border border-slate-500/20">
      <Hash className="w-3.5 h-3.5 text-slate-400" />
      Rank #{rank}
    </span>
  );
};

export const TrendBadge = ({ change, previousRanking, currentRanking }) => {
  if (change === null || change === undefined || previousRanking === null) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-slate-400 font-medium">
        <Minus className="w-3 h-3" />
        First check
      </span>
    );
  }

  if (change > 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
        <ArrowUpRight className="w-3.5 h-3.5" />
        #{previousRanking} → #{currentRanking} (+{change})
      </span>
    );
  }

  if (change < 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
        <ArrowDownRight className="w-3.5 h-3.5" />
        #{previousRanking} → #{currentRanking} ({change})
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-500/10 px-2 py-0.5 rounded border border-slate-500/20">
      <Minus className="w-3.5 h-3.5" />
      #{currentRanking} (No change)
    </span>
  );
};
