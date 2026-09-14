import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, Search, Sparkles } from 'lucide-react';

const steps = [
  'Preparing search query',
  'Fetching search results',
  'Analyzing rankings',
  'Matching target domain',
  'Preparing report'
];

const LoadingState = ({ message = 'Checking search ranking...' }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 450);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 md:p-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-lg mx-auto text-center my-8">
      {/* Animated Spinner Icon */}
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-full bg-sky-500/10 dark:bg-sky-500/20 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-sky-600 dark:text-sky-400 animate-spin" />
        </div>
        <div className="absolute -top-1 -right-1 p-1 bg-indigo-600 text-white rounded-full">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
        {message}
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
        Analyzing search engine position and matching domain records...
      </p>

      {/* Progress Steps */}
      <div className="w-full space-y-2.5 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 text-left">
        {steps.map((step, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={step}
              className={`flex items-center space-x-3 text-xs font-medium transition-all duration-300 ${
                isDone
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : isCurrent
                  ? 'text-sky-600 dark:text-sky-400 font-semibold scale-[1.02]'
                  : 'text-slate-400 dark:text-slate-600'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-4 h-4 text-sky-500 animate-spin shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700 shrink-0 flex items-center justify-center text-[10px]">
                  {idx + 1}
                </div>
              )}
              <span>{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LoadingState;
