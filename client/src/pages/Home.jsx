import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, MapPin, Search, Bot, Star, ShieldCheck, AlertCircle, Building } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import { useLocation, CITIES_DATABASE } from '../hooks/useLocation';

const SUGGESTIONS = [
  { icon: '☕', label: 'Quiet cafe for work', query: 'Find a peaceful cafe where I can work for 4 hours with Wi-Fi and good coffee' },
  { icon: '❤️', label: 'Romantic dinner', query: 'Find an affordable romantic restaurant for dinner with parking nearby' },
  { icon: '🎉', label: 'Birthday celebration', query: 'Spacious restaurant for 8 friends with great food and good music' },
  { icon: '👨‍👩‍👧', label: 'Family restaurant', query: 'Family-friendly restaurant with outdoor seating and parking' },
  { icon: '💻', label: 'Work-friendly space', query: 'Quiet coworking space or coffee shop with fast internet and charging sockets' },
  { icon: '🌿', label: 'Peaceful place to relax', query: 'Calm lakeside park or quiet tea shop to relax on a weekend afternoon' }
];

const Home = () => {
  const navigate = useNavigate();
  const { location, loading: isLocating, error: locationError, requestLocation, setManualLocation } = useLocation();
  const [showCityPicker, setShowCityPicker] = useState(false);

  const handleSearch = (searchQuery) => {
    if (!searchQuery.trim()) return;
    navigate('/explore', {
      state: {
        query: searchQuery,
        location
      }
    });
  };

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="relative text-center space-y-8 max-w-4xl mx-auto px-4 pt-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-blue-500 animate-spin" />
          <span>Next-Generation Location Intelligence</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
          Discover Places the Way You <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">Think.</span>
        </h1>

        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Describe what you're looking for, and AI will find the places that match your needs.
        </p>

        {/* Main AI Search Box */}
        <SearchBar
          onSearch={handleSearch}
          onUseLocation={requestLocation}
          isLocating={isLocating}
        />

        {/* Location Status & Manual City Picker */}
        <div className="flex flex-col items-center space-y-2">
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
            <MapPin className="w-3.5 h-3.5 text-blue-500" />
            <span>Active Location: <strong className="text-gray-800 dark:text-gray-200 font-bold">{location.city}</strong></span>
            <button
              onClick={() => setShowCityPicker(!showCityPicker)}
              className="ml-1 text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              Change City
            </button>
          </div>

          {locationError && (
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs font-medium border border-amber-200 dark:border-amber-900/50 max-w-md">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
              <span>{locationError}</span>
            </div>
          )}

          {showCityPicker && (
            <div className="flex flex-wrap justify-center gap-2 pt-2 animate-fade-in">
              {CITIES_DATABASE.map((c) => (
                <button
                  key={c.name}
                  onClick={() => {
                    setManualLocation(c.name, c.latitude, c.longitude);
                    setShowCityPicker(false);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                    location.city === c.name
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:border-blue-400'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Clickable Quick Prompt Cards */}
      <section className="max-w-6xl mx-auto px-4">
        <h2 className="text-center text-xs font-bold uppercase tracking-wider text-gray-400 mb-6">
          Clickable Example Searches
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {SUGGESTIONS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSearch(item.query)}
              className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition-all text-center space-y-2 group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">{item.icon}</span>
              <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-6xl mx-auto px-4 py-8 bg-white dark:bg-gray-800/50 rounded-3xl border border-gray-200/80 dark:border-gray-800">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">How It Works</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Four simple steps to intelligent place discovery</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 font-extrabold flex items-center justify-center text-lg">
              1
            </div>
            <h3 className="font-bold text-base text-gray-900 dark:text-white">1. Describe your perfect place.</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Type naturally in your own words with budget, duration, or amenity needs.</p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 font-extrabold flex items-center justify-center text-lg">
              2
            </div>
            <h3 className="font-bold text-base text-gray-900 dark:text-white">2. AI understands your needs.</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Gemini AI breaks down your prompt into structured place criteria and preferences.</p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-300 font-extrabold flex items-center justify-center text-lg">
              3
            </div>
            <h3 className="font-bold text-base text-gray-900 dark:text-white">3. Places are analyzed.</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Calculates weighted match scores based on reviews, location, and amenity tags.</p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300 font-extrabold flex items-center justify-center text-lg">
              4
            </div>
            <h3 className="font-bold text-base text-gray-900 dark:text-white">4. Get personalized recommendations.</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">View ranked places on an interactive map with clear AI reasons and concerns.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
