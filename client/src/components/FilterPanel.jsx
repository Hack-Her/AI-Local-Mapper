import React from 'react';
import { Filter, SlidersHorizontal, Sparkles } from 'lucide-react';

const FilterPanel = ({ filters, onChange, onReset }) => {
  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm font-bold text-gray-900 dark:text-white">
          <SlidersHorizontal className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Refine & Filter</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          Reset All
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        {/* Place Type */}
        <div>
          <label className="block text-gray-500 dark:text-gray-400 font-medium mb-1">Place Type</label>
          <select
            value={filters.placeType || ''}
            onChange={(e) => handleChange('placeType', e.target.value)}
            className="w-full p-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-800 dark:text-gray-200"
          >
            <option value="">All Types</option>
            <option value="cafe">Cafe</option>
            <option value="restaurant">Restaurant</option>
            <option value="park">Park</option>
            <option value="coworking space">Coworking Space</option>
          </select>
        </div>

        {/* Minimum Rating */}
        <div>
          <label className="block text-gray-500 dark:text-gray-400 font-medium mb-1">Min Rating</label>
          <select
            value={filters.minRating || ''}
            onChange={(e) => handleChange('minRating', e.target.value)}
            className="w-full p-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-800 dark:text-gray-200"
          >
            <option value="">Any Rating</option>
            <option value="4.5">4.5+ Stars</option>
            <option value="4.0">4.0+ Stars</option>
          </select>
        </div>

        {/* Max Distance */}
        <div>
          <label className="block text-gray-500 dark:text-gray-400 font-medium mb-1">Max Distance</label>
          <select
            value={filters.maxDistance || ''}
            onChange={(e) => handleChange('maxDistance', e.target.value)}
            className="w-full p-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-800 dark:text-gray-200"
          >
            <option value="">Any Distance</option>
            <option value="2">Within 2 km</option>
            <option value="5">Within 5 km</option>
            <option value="10">Within 10 km</option>
          </select>
        </div>

        {/* Hidden Gems Toggle */}
        <div className="flex items-end">
          <label className="flex items-center space-x-2 cursor-pointer p-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 w-full">
            <input
              type="checkbox"
              checked={!!filters.hiddenGemsOnly}
              onChange={(e) => handleChange('hiddenGemsOnly', e.target.checked)}
              className="rounded text-amber-600 focus:ring-amber-500"
            />
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300">Hidden Gems</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
