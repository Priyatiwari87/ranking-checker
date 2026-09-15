import React, { useState } from 'react';
import { Search, Globe, MapPin, Layers, ArrowRight } from 'lucide-react';

const SearchForm = ({ onSubmit, isLoading }) => {
  const [businessName, setBusinessName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [location, setLocation] = useState('');
  const [depth, setDepth] = useState(50);

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!businessName || businessName.trim().length < 2) {
      newErrors.businessName = 'Please enter a business or store name.';
    }

    if (!websiteUrl || websiteUrl.trim().length < 3) {
      newErrors.websiteUrl = 'Please enter a website URL.';
    } else {
      // Robust URL format validation
      const pattern = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/i;
      // Also allow common user entries like domain.com, sub.domain.co, etc.
      if (!pattern.test(websiteUrl.trim()) && !websiteUrl.trim().includes('.')) {
        newErrors.websiteUrl = 'Please enter a valid website URL (e.g. abccafe.com or https://abccafe.com).';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        businessName: businessName.trim(),
        websiteUrl: websiteUrl.trim(),
        location: location.trim(),
        depth: parseInt(depth, 10)
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-5">
        {/* Business Name / Keywords Input (Textarea) */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Keywords / Business Names <span className="text-rose-500">*</span>{' '}
            <span className="text-slate-400 font-normal lowercase">(enter up to 10 keywords, one per line or comma-separated)</span>
          </label>
          <div className="relative">
            <div className="absolute top-3.5 left-3.5 flex items-start pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <textarea
              rows={3}
              value={businessName}
              onChange={(e) => {
                setBusinessName(e.target.value);
                if (errors.businessName) setErrors((prev) => ({ ...prev, businessName: null }));
              }}
              placeholder={'e.g.\nABC Cafe\nBest Coffee in Delhi\nTop Cafe Near Me'}
              disabled={isLoading}
              className={`w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all resize-y ${
                errors.businessName
                  ? 'border-rose-500 ring-rose-500/20'
                  : 'border-slate-200 dark:border-slate-800 focus:ring-sky-500/30 focus:border-sky-500'
              }`}
            />
          </div>
          {errors.businessName && (
            <p className="mt-1.5 text-xs text-rose-500 font-medium">
              {errors.businessName}
            </p>
          )}
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Website URL <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Globe className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={websiteUrl}
              onChange={(e) => {
                setWebsiteUrl(e.target.value);
                if (errors.websiteUrl) setErrors((prev) => ({ ...prev, websiteUrl: null }));
              }}
              placeholder="e.g. https://abccafe.com"
              disabled={isLoading}
              className={`w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                errors.websiteUrl
                  ? 'border-rose-500 ring-rose-500/20'
                  : 'border-slate-200 dark:border-slate-800 focus:ring-sky-500/30 focus:border-sky-500'
              }`}
            />
          </div>
          {errors.websiteUrl && (
            <p className="mt-1.5 text-xs text-rose-500 font-medium">
              {errors.websiteUrl}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
        {/* Optional Location */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Location <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <MapPin className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Delhi, New York, London"
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all"
            />
          </div>
        </div>

        {/* Search Depth Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Search Depth
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Layers className="w-4 h-4" />
            </div>
            <select
              value={depth}
              onChange={(e) => setDepth(e.target.value)}
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all cursor-pointer appearance-none"
            >
              <option value={10}>Top 10 Results</option>
              <option value={20}>Top 20 Results</option>
              <option value={50}>Top 50 Results</option>
              <option value={100}>Top 100 Results</option>
            </select>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 focus:ring-2 focus:ring-sky-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 text-sm"
        >
          <span>Check Ranking</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};

export default SearchForm;
