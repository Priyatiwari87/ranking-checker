import React from 'react';
import { SearchX, RotateCcw, ArrowUpRight, Search } from 'lucide-react';

const NotFoundState = ({ businessName, websiteUrl, searchQuery, depth, onTryAgain, onIncreaseDepth }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 shadow-xl text-center max-w-2xl mx-auto my-6">
      <div className="w-16 h-16 bg-rose-500/10 dark:bg-rose-500/20 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-5">
        <SearchX className="w-8 h-8" />
      </div>

      <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2">
        Website not found in checked results
      </h3>

      <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
        Your website <strong className="text-slate-700 dark:text-slate-200">{websiteUrl}</strong> did not appear within the top <strong>{depth}</strong> search results for query "<strong className="text-slate-700 dark:text-slate-200">{searchQuery}</strong>".
      </p>

      {/* Summary Box */}
      <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-left text-xs space-y-2 mb-8 max-w-md mx-auto">
        <div className="flex justify-between">
          <span className="text-slate-400">Business Name:</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">{businessName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Website URL:</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">{websiteUrl}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Search Query:</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">{searchQuery}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Checked Depth:</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">Top {depth} results</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onTryAgain}
          className="w-full sm:w-auto px-6 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Try Again</span>
        </button>

        {depth < 100 && (
          <button
            onClick={onIncreaseDepth}
            className="w-full sm:w-auto px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-sky-600/20 transition-all"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Increase Search Depth to Top 100</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default NotFoundState;
