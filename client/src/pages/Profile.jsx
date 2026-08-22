import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, Save, ShieldAlert, Heart, History, Sparkles } from 'lucide-react';
import API from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import Loading from '../components/Loading';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [name, setName] = useState(user?.name || 'Demo Explorer');
  const [email] = useState(user?.email || 'user@example.com');
  const [stats, setStats] = useState({ totalSearches: 0, savedPlacesCount: 0 });
  const [preferences, setPreferences] = useState({
    budgetPreference: 'moderate',
    favoritePlaceTypes: ['cafe', 'restaurant'],
    preferredEnvironment: ['quiet', 'work-friendly']
  });
  const [loading, setLoading] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/users/profile');
        if (res.data.success) {
          setName(res.data.user.name);
          if (res.data.user.preferences) {
            setPreferences(prev => ({ ...prev, ...res.data.user.preferences }));
          }
          if (res.data.stats) {
            setStats(res.data.stats);
          }
        }
      } catch (err) {
        console.error('Fetch profile error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put('/users/profile', { name, preferences });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Update profile error:', err);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action is irreversible.')) {
      try {
        await API.delete('/users/profile');
        logout();
        navigate('/');
      } catch (err) {
        console.error('Delete account error:', err);
      }
    }
  };

  if (loading) return <Loading message="Loading profile settings..." />;

  return (
    <div className="space-y-6 py-6 max-w-3xl mx-auto">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold flex items-center justify-center text-2xl shadow-md">
            {name[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{name}</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">{email}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center space-x-4 text-center">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/50 rounded-2xl border border-blue-100 dark:border-blue-900/50">
            <span className="block text-lg font-extrabold text-blue-600 dark:text-blue-400">{stats.totalSearches}</span>
            <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">Total Searches</span>
          </div>
          <div className="p-3 bg-rose-50 dark:bg-rose-950/50 rounded-2xl border border-rose-100 dark:border-rose-900/50">
            <span className="block text-lg font-extrabold text-rose-600 dark:text-rose-400">{stats.savedPlacesCount}</span>
            <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">Saved Places</span>
          </div>
        </div>
      </div>

      {/* Profile Preferences Form */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
        <div className="flex items-center space-x-2 text-sm font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3">
          <Settings className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Personal Preferences & Account</span>
        </div>

        {savedSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
            Preferences updated successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full p-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-400 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Default Budget Preference</label>
            <select
              value={preferences.budgetPreference}
              onChange={(e) => setPreferences({ ...preferences, budgetPreference: e.target.value })}
              className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-900 dark:text-white"
            >
              <option value="affordable">Affordable ($ / under ₹500)</option>
              <option value="moderate">Moderate ($$ / ₹500 - ₹1500)</option>
              <option value="premium">Premium ($$$ / ₹1500+)</option>
            </select>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="submit"
              className="flex items-center space-x-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Preferences</span>
            </button>

            <button
              type="button"
              onClick={handleDeleteAccount}
              className="flex items-center space-x-1 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Delete Account</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
