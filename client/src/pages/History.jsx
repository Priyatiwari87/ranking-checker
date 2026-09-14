import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHistoryApi, deleteHistoryApi } from '../services/api';
import { RankingBadge, TrendBadge } from '../components/Badges';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import { Search, History as HistoryIcon, Trash2, RotateCcw, Filter, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

const History = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Pagination States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  // Detail Modal State
  const [selectedRecord, setSelectedRecord] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getHistoryApi({
        search: searchTerm,
        status: statusFilter,
        page,
        limit: 15
      });

      if (res.success) {
        setItems(res.data || []);
        setPagination(res.pagination || { total: 0, pages: 1 });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [searchTerm, statusFilter, page]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this check record from history?')) return;

    try {
      await deleteHistoryApi(id);
      fetchHistory();
    } catch (err) {
      alert('Failed to delete record: ' + err.message);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl transition-colors">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HistoryIcon className="w-6 h-6 text-sky-500" />
            <span>Search Ranking History</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Historical log of all business ranking queries stored in database.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              placeholder="Search business or domain..."
              className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="found">Status: Found Only</option>
              <option value="not_found">Status: Not Found Only</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <ErrorState
          title="Could not load search history"
          message={error}
          onRetry={fetchHistory}
        />
      )}

      {/* History Table */}
      {!error && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl transition-colors">
          {items.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="py-3 px-4">Business</th>
                      <th className="py-3 px-4">Website</th>
                      <th className="py-3 px-4">Search Query</th>
                      <th className="py-3 px-4">Ranking</th>
                      <th className="py-3 px-4">Position Change</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                    {items.map((item) => (
                      <tr
                        key={item._id}
                        className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                      >
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
                        <td className="py-3.5 px-4">
                          <TrendBadge
                            change={item.rankingChange}
                            previousRanking={item.previousRanking}
                            currentRanking={item.ranking}
                          />
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                          {new Date(item.checkedAt).toLocaleDateString()} {new Date(item.checkedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          <button
                            onClick={() => setSelectedRecord(item)}
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                            title="View Full SERP Detail"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => navigate('/check', { state: { recheck: item } })}
                            className="p-1.5 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 hover:bg-sky-500/20 transition-colors"
                            title="Recheck Ranking"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => handleDelete(item._id, e)}
                            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500">
                  <span>
                    Page {pagination.page} of {pagination.pages} ({pagination.total} records)
                  </span>
                  <div className="flex space-x-2">
                    <button
                      disabled={page <= 1}
                      onClick={() => setPage(prev => prev - 1)}
                      className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      disabled={page >= pagination.pages}
                      onClick={() => setPage(prev => prev + 1)}
                      className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <EmptyState
              title="No ranking checks yet"
              description="Run your first ranking check to see results and historical logs stored here."
              action={
                <button
                  onClick={() => navigate('/check')}
                  className="px-5 py-2.5 bg-sky-600 text-white rounded-xl text-xs font-semibold hover:bg-sky-500 shadow-md shadow-sky-600/20"
                >
                  Run First Ranking Check
                </button>
              }
            />
          )}
        </div>
      )}

      {/* Record SERP Results Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6 md:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  SERP Snapshot: {selectedRecord.businessName}
                </h3>
                <p className="text-xs text-slate-400">
                  Domain: {selectedRecord.domain} | Query: {selectedRecord.searchQuery}
                </p>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold hover:bg-slate-200 text-slate-700 dark:text-slate-300"
              >
                Close
              </button>
            </div>

            {/* Results Snapshot */}
            <div className="space-y-2 text-xs">
              {selectedRecord.results && selectedRecord.results.length > 0 ? (
                selectedRecord.results.map((r) => (
                  <div
                    key={r.position}
                    className={`p-3 rounded-xl border ${
                      r.matched
                        ? 'bg-sky-500/10 border-sky-500/30 text-sky-900 dark:text-sky-200 font-semibold'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span>#{r.position} - {r.title}</span>
                      {r.matched && <span className="text-[10px] bg-sky-500 text-white px-2 py-0.5 rounded font-bold">Matched Your Site</span>}
                    </div>
                    <p className="text-[11px] font-mono text-slate-400">{r.url}</p>
                  </div>
                ))
              ) : (
                <p className="text-slate-400">No snapshot results stored for this record.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
