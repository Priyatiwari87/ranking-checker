import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchForm from '../components/SearchForm';
import LoadingState from '../components/LoadingState';
import RankingCard from '../components/RankingCard';
import ResultsTable from '../components/ResultsTable';
import NotFoundState from '../components/NotFoundState';
import ErrorState from '../components/ErrorState';
import { checkRankingApi } from '../services/api';
import { Sparkles, Info, ShieldCheck } from 'lucide-react';

const CheckRanking = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [lastPayload, setLastPayload] = useState(null);

  // Check if navigate state includes recheck request
  useEffect(() => {
    if (location.state?.recheck) {
      const item = location.state.recheck;
      handleCheck({
        businessName: item.businessName,
        websiteUrl: item.websiteUrl,
        location: item.location || '',
        depth: item.depth || 50
      });
      // Clear state so page reload doesn't trigger loop
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleCheck = async (payload) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setLastPayload(payload);

    try {
      const data = await checkRankingApi(payload);
      if (data.success) {
        setResult(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleIncreaseDepth = () => {
    if (lastPayload) {
      handleCheck({ ...lastPayload, depth: 100 });
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Centered Hero Section */}
      <div className="text-center max-w-2xl mx-auto pt-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Search Engine SERP Position Inspector</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Check Your Search Ranking
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          Find where your business website appears in organic search engine results.
        </p>
      </div>

      {/* Main Search Card Form */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-10 shadow-xl transition-colors">
        <SearchForm onSubmit={handleCheck} isLoading={loading} />
      </div>

      {/* Provider & Security Banner */}
      <div className="p-4 bg-slate-100/70 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 rounded-2xl flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
        <div className="flex items-center space-x-2">
          <Info className="w-4 h-4 text-sky-500 shrink-0" />
          <span>
            Search queries are evaluated through a clean, replaceable ranking API provider layer.
          </span>
        </div>
        <div className="flex items-center space-x-1 font-semibold text-slate-700 dark:text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Zero Secret Leakage</span>
        </div>
      </div>

      {/* Loading State Animation */}
      {loading && <LoadingState message="Checking search ranking..." />}

      {/* Error Alert Box */}
      {error && !loading && (
        <ErrorState
          title="Search Check Failed"
          message={error}
          onRetry={lastPayload ? () => handleCheck(lastPayload) : null}
        />
      )}

      {/* Results View */}
      {result && !loading && (
        <div className="space-y-8 animate-fadeIn">
          {result.isBatch ? (
            <BatchResultsContainer result={result} onIncreaseDepth={handleIncreaseDepth} />
          ) : (
            <>
              {/* Main Ranking Card */}
              <RankingCard result={result} />

              {/* Not Found View or Results Table */}
              {result.found ? (
                <ResultsTable results={result.results} targetDomain={result.domain} />
              ) : (
                <NotFoundState
                  businessName={result.businessName}
                  websiteUrl={result.websiteUrl}
                  searchQuery={result.searchQuery}
                  depth={result.depth}
                  onTryAgain={() => setResult(null)}
                  onIncreaseDepth={handleIncreaseDepth}
                />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

const BatchResultsContainer = ({ result, onIncreaseDepth }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const currentResult = result.batchResults[activeIndex] || result.batchResults[0];

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white">
            Batch Search Results ({result.totalKeywords} Keywords Tested)
          </h3>
          <p className="text-xs text-slate-400">
            Target Website: <span className="font-mono text-sky-400">{result.domain}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {result.batchResults.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeIndex === idx
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              #{idx + 1} {item.businessName} {item.found ? `(Rank #${item.ranking})` : '(Not Found)'}
            </button>
          ))}
        </div>
      </div>

      <RankingCard result={currentResult} />

      {currentResult.found ? (
        <ResultsTable results={currentResult.results} targetDomain={currentResult.domain} />
      ) : (
        <NotFoundState
          businessName={currentResult.businessName}
          websiteUrl={currentResult.websiteUrl}
          searchQuery={currentResult.searchQuery}
          depth={currentResult.depth}
          onTryAgain={() => {}}
          onIncreaseDepth={onIncreaseDepth}
        />
      )}
    </div>
  );
};

export default CheckRanking;
