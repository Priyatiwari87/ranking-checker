import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/StatCard';
import { RankingBadge, TrendBadge } from '../components/Badges';
import EmptyState from '../components/EmptyState';
import { getAnalyticsApi } from '../services/api';
import { BarChart3, CheckCircle2, SearchX, Hash, Search, ArrowRight, RefreshCw, Trophy, Award } from 'lucide-react';

const Overview = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAnalyticsApi();
      if (res.success) {
        setData(res);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const metrics = data?.metrics || {
    totalChecks: 0,
    successfulChecks: 0,
    notFound: 0,
    averageRank: null
  };

  const recentChecks = data?.recentChecks || [];
  const trendData = data?.trendData || [];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-sky-900 via-indigo-900 to-slate-900 text-white rounded-3xl shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <span className="text-[10px] font-bold tracking-widest text-sky-400 uppercase bg-sky-950/80 border border-sky-800/50 px-2 py-0.5 rounded">
            Executive Summary
          </span>
          <h2 className="text-2xl font-bold mt-2">
            Search Ranking Analytics Dashboard
          </h2>
          <p className="text-xs text-slate-300 max-w-xl mt-1">
            Real-time insights and search position tracking for your business websites.
          </p>
        </div>
        <button
          onClick={() => navigate('/check')}
          className="relative z-10 px-5 py-3 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-sky-500/30 transition-all shrink-0"
        >
          <Search className="w-4 h-4" />
          <span>Run New Check</span>
        </button>
      </div>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Checks"
          value={metrics.totalChecks}
          icon={BarChart3}
          description="Total searches executed"
          color="sky"
        />
        <StatCard
          title="Successful Checks"
          value={metrics.successfulChecks}
          icon={CheckCircle2}
          description="Rankings successfully matched"
          badgeText={metrics.totalChecks > 0 ? `${Math.round((metrics.successfulChecks / metrics.totalChecks) * 100)}% Rate` : null}
          color="emerald"
        />
        <StatCard
          title="Not Found"
          value={metrics.notFound}
          icon={SearchX}
          description="Unranked within check depth"
          color="rose"
        />
        <StatCard
          title="Average Rank"
          value={metrics.averageRank ? `#${metrics.averageRank}` : '—'}
          icon={Hash}
          description="Mean rank for matched sites"
          color="amber"
        />
      </div>

      {/* Ranking Trend Chart Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl transition-colors">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Ranking Position Trend
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Historical position changes derived strictly from real stored checks
            </p>
          </div>
          <button
            onClick={fetchAnalytics}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {trendData.length >= 2 ? (
          <div className="space-y-4">
            <div className="h-48 flex items-end justify-between gap-2 pt-6 px-4 border-b border-slate-200 dark:border-slate-800">
              {trendData.map((item) => {
                // Lower rank number is better (max visual bar height for rank 1)
                const heightPercentage = Math.max(15, 100 - (item.avgRank * 3));
                return (
                  <div key={item.date} className="flex-1 flex flex-col items-center gap-2 group">
                    <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      #{item.avgRank}
                    </span>
                    <div
                      className="w-full max-w-[36px] bg-gradient-to-t from-sky-600 to-indigo-500 rounded-t-lg transition-all group-hover:from-sky-500 group-hover:to-indigo-400"
                      style={{ height: `${heightPercentage}%` }}
                    />
                    <span className="text-[10px] text-slate-400 truncate max-w-full">
                      {item.date.slice(5)}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-400 text-center italic">
              Note: Taller bars represent better (top) search rankings.
            </p>
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-200/60 dark:border-slate-800">
            <BarChart3 className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Not enough data to display a trend
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Run multiple ranking checks over time to generate real historical trend analytics.
            </p>
          </div>
        )}
      </div>

      {/* Recent Ranking Checks Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl transition-colors">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Recent Ranking Checks
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Latest business ranking queries executed
            </p>
          </div>
          <button
            onClick={() => navigate('/history')}
            className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
          >
            <span>View All History</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {recentChecks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4">Business</th>
                  <th className="py-3 px-4">Website</th>
                  <th className="py-3 px-4">Search Query</th>
                  <th className="py-3 px-4">Ranking</th>
                  <th className="py-3 px-4">Checked At</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {recentChecks.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100">
                      {item.businessName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {item.domain || item.websiteUrl}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      {item.searchQuery}
                    </td>
                    <td className="py-3.5 px-4">
                      <RankingBadge rank={item.ranking} found={item.found} />
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {new Date(item.checkedAt).toLocaleDateString()} {new Date(item.checkedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => navigate('/check', { state: { recheck: item } })}
                        className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 hover:bg-sky-500/20 transition-colors"
                      >
                        Recheck
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No recent ranking checks"
            description="You haven't run any business search ranking checks yet."
            action={
              <button
                onClick={() => navigate('/check')}
                className="px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-semibold hover:bg-sky-500"
              >
                Run First Ranking Check
              </button>
            }
          />
        )}
      </div>
    </div>
  );
};

export default Overview;
