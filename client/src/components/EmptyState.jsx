import React from 'react';
import { Search } from 'lucide-react';

const EmptyState = ({ title = 'No data found', description = 'There are no records to display right now.', icon: Icon = Search, action }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 text-center max-w-lg mx-auto my-6 transition-colors">
      <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="w-7 h-7" />
      </div>

      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
        {title}
      </h3>

      <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
        {description}
      </p>

      {action && (
        <div className="flex justify-center">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
