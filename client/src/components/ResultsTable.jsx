import React from 'react';
import { Check, ExternalLink } from 'lucide-react';

const ResultsTable = ({ results = [], targetDomain = '' }) => {
  if (!results || results.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl transition-colors">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Search Engine Results Page (SERP)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Full position list highlighting matched target website
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          {results.length} Results
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th className="py-3 px-3 w-16 text-center">Position</th>
              <th className="py-3 px-4">Title & Snippet</th>
              <th className="py-3 px-4">URL</th>
              <th className="py-3 px-3 text-right">Matched</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
            {results.map((item) => {
              const isMatch = item.matched;

              return (
                <tr
                  key={item.position}
                  className={`transition-colors ${
                    isMatch
                      ? 'bg-sky-500/10 dark:bg-sky-500/15 font-medium border-l-4 border-l-sky-500'
                      : 'hover:bg-slate-50/70 dark:hover:bg-slate-800/40'
                  }`}
                >
                  {/* Position */}
                  <td className="py-3.5 px-3 text-center">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold ${
                        isMatch
                          ? 'bg-sky-500 text-white shadow-sm'
                          : item.position <= 3
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {item.position}
                    </span>
                  </td>

                  {/* Title & Snippet */}
                  <td className="py-3.5 px-4 max-w-md">
                    <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-1.5">
                      <span>{item.title}</span>
                    </div>
                    {item.snippet && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 font-normal">
                        {item.snippet}
                      </p>
                    )}
                  </td>

                  {/* URL */}
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 dark:text-slate-400 max-w-xs truncate">
                    <a
                      href={item.url.startsWith('http') ? item.url : `https://${item.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline hover:text-sky-500 inline-flex items-center gap-1"
                    >
                      <span className="truncate">{item.url}</span>
                      <ExternalLink className="w-3 h-3 shrink-0 text-slate-400" />
                    </a>
                  </td>

                  {/* Matched Indicator */}
                  <td className="py-3.5 px-3 text-right">
                    {isMatch ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-500 text-white shadow-sm">
                        <Check className="w-3 h-3" />
                        Your Website
                      </span>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-600 text-sm">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsTable;
