import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { History as HistoryIcon, Search, Trash2, ArrowRight } from 'lucide-react';
import API from '../api/axios';
import EmptyState from '../components/EmptyState';
import Loading from '../components/Loading';

const History = () => {
  const navigate = useNavigate();
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await API.get('/history');
      if (res.data.success) {
        setHistoryItems(res.data.history);
      }
    } catch (err) {
      console.error('Fetch history error:', err);
      // Demo fallback data
      setHistoryItems([
        {
          _id: 'h_1',
          query: 'Quiet cafe with Wi-Fi where I can work for 4 hours',
          searchedAt: 'Today at 2:30 PM'
        },
        {
          _id: 'h_2',
          query: 'Affordable romantic restaurant for dinner with parking',
          searchedAt: 'Yesterday at 7:15 PM'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleRepeatSearch = (query) => {
    navigate('/explore', { state: { query } });
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/history/${id}`);
    } catch (err) {
      console.error('Delete history error:', err);
    }
    setHistoryItems(prev => prev.filter(item => item._id !== id));
  };

  return (
    <div className="space-y-6 py-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
            <HistoryIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Search History</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">View and re-run your previous AI searches</p>
          </div>
        </div>
      </div>

      {loading ? (
        <Loading message="Loading search history..." />
      ) : historyItems.length === 0 ? (
        <EmptyState
          title="No search history"
          description="Your natural language searches will appear here for easy repeating."
        />
      ) : (
        <div className="space-y-3">
          {historyItems.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:border-blue-300 dark:hover:border-gray-600 transition-all"
            >
              <div className="flex items-start space-x-3 min-w-0">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
                  <Search className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                    "{item.query}"
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : item.searchedAt}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0 ml-4">
                <button
                  onClick={() => handleRepeatSearch(item.query)}
                  className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all"
                >
                  <span>Re-search</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-2 text-gray-400 hover:text-rose-500 rounded-xl transition-colors"
                  title="Delete entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
