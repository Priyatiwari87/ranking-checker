import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const ErrorState = ({ title = 'Something went wrong', message, onRetry }) => {
  return (
    <div className="bg-rose-500/10 dark:bg-rose-500/15 border border-rose-500/30 rounded-3xl p-6 md:p-8 text-center max-w-xl mx-auto my-6">
      <div className="w-12 h-12 bg-rose-500/20 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="w-6 h-6" />
      </div>

      <h3 className="text-lg font-bold text-rose-700 dark:text-rose-400 mb-2">
        {title}
      </h3>

      <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 mb-6">
        {message || 'An error occurred while processing your request. Please check your connection and try again.'}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-md transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Request</span>
        </button>
      )}
    </div>
  );
};

export default ErrorState;
