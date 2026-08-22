import React, { useState, useEffect, useRef } from 'react';
import { useLocation as useRouterLocation } from 'react-router-dom';
import { Map, List, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import API from '../api/axios';
import SearchBar from '../components/SearchBar';
import PlaceCard from '../components/PlaceCard';
import MapComponent from '../components/MapComponent';
import PlaceDetails from '../components/PlaceDetails';
import FilterPanel from '../components/FilterPanel';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { useLocation } from '../hooks/useLocation';

const Explore = () => {
  const routerLocation = useRouterLocation();
  const initialQuery = routerLocation.state?.query || 'Quiet cafe for working with Wi-Fi';
  
  const { location, loading: isLocating, requestLocation } = useLocation();
  const [query, setQuery] = useState(initialQuery);
  const [places, setPlaces] = useState([]);
  const [extractedRequirements, setExtractedRequirements] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [activeModalPlace, setActiveModalPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [viewMode, setViewMode] = useState('split');
  const [filters, setFilters] = useState({});
  const [notice, setNotice] = useState(null);

  const cardListRef = useRef(null);

  const fetchPlaces = async (searchQuery, appliedFilters = {}) => {
    setLoading(true);
    try {
      const res = await API.post('/places/search', {
        query: searchQuery,
        latitude: location.latitude,
        longitude: location.longitude,
        filters: appliedFilters
      });

      if (res.data.success) {
        const returnedPlaces = res.data.places || [];
        setPlaces(returnedPlaces);
        setExtractedRequirements(res.data.extractedRequirements);
        setNotice(res.data.notice);
        if (returnedPlaces.length > 0) {
          setSelectedPlace(returnedPlaces[0]);
        }
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces(query, filters);
  }, []);

  const handleSearch = (newQuery) => {
    setQuery(newQuery);
    fetchPlaces(newQuery, filters);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchPlaces(query, newFilters);
  };

  const handleSelectPlaceFromMap = (place) => {
    setSelectedPlace(place);
    setActiveModalPlace(place);
  };

  const handleToggleFavorite = (place) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === place.id);
      if (exists) return prev.filter((f) => f.id !== place.id);
      return [...prev, place];
    });
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Search & Refine Filters Section */}
      <div className="space-y-4">
        <SearchBar
          onSearch={handleSearch}
          initialQuery={query}
          onUseLocation={requestLocation}
          isLocating={isLocating}
        />

        <FilterPanel
          filters={filters}
          onChange={handleFilterChange}
          onReset={() => { setFilters({}); fetchPlaces(query, {}); }}
        />
      </div>

      {/* AI Extraction Banner */}
      {extractedRequirements && (
        <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-100 dark:border-blue-900/40 text-xs">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="text-gray-700 dark:text-gray-200">
              AI Criteria: <strong className="text-blue-700 dark:text-blue-300 capitalize">{extractedRequirements.placeType || 'Places'}</strong>
              {extractedRequirements.preferences?.environment?.length > 0 && ` • ${extractedRequirements.preferences.environment.join(', ')}`}
              {extractedRequirements.budget?.max && ` • Under ${extractedRequirements.budget.currency || '₹'}${extractedRequirements.budget.max}`}
            </span>
          </div>
          {notice && (
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium flex items-center space-x-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{notice}</span>
            </span>
          )}
        </div>
      )}

      {/* Mobile Toggle Controls */}
      <div className="flex md:hidden justify-center space-x-2">
        <button
          onClick={() => setViewMode('list')}
          className={`flex items-center space-x-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            viewMode === 'list' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
          }`}
        >
          <List className="w-3.5 h-3.5" />
          <span>List View ({places.length})</span>
        </button>
        <button
          onClick={() => setViewMode('map')}
          className={`flex items-center space-x-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            viewMode === 'map' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
          }`}
        >
          <Map className="w-3.5 h-3.5" />
          <span>Map View</span>
        </button>
      </div>

      {/* Main Explore Split Screen */}
      {loading ? (
        <Loading />
      ) : places.length === 0 ? (
        <EmptyState onReset={() => { setFilters({}); fetchPlaces(query, {}); }} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[calc(100vh-270px)] min-h-[500px]">
          {/* Left Side: Places List */}
          <div
            ref={cardListRef}
            className={`md:col-span-6 lg:col-span-5 space-y-3 overflow-y-auto pr-1 ${
              viewMode === 'map' ? 'hidden md:block' : 'block'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-semibold text-gray-500 dark:text-gray-400 px-1 sticky top-0 bg-gray-50 dark:bg-gray-900 py-1 z-10">
              <span>{places.length} Places Found</span>
              <span>Sorted by AI Match Score</span>
            </div>

            {places.map((place) => (
              <div key={place.id} onClick={() => setSelectedPlace(place)}>
                <PlaceCard
                  place={place}
                  isSelected={selectedPlace?.id === place.id}
                  onSelect={() => setSelectedPlace(place)}
                  onToggleFavorite={handleToggleFavorite}
                  isFavorite={favorites.some((f) => f.id === place.id)}
                />
              </div>
            ))}
          </div>

          {/* Right Side: Interactive Leaflet Map */}
          <div
            className={`md:col-span-6 lg:col-span-7 h-full ${
              viewMode === 'list' ? 'hidden md:block' : 'block'
            }`}
          >
            <MapComponent
              places={places}
              selectedPlace={selectedPlace}
              onSelectPlace={handleSelectPlaceFromMap}
              userLocation={location}
            />
          </div>
        </div>
      )}

      {/* Modal Place Details View */}
      {activeModalPlace && (
        <PlaceDetails
          place={activeModalPlace}
          onClose={() => setActiveModalPlace(null)}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={favorites.some((f) => f.id === activeModalPlace.id)}
        />
      )}
    </div>
  );
};

export default Explore;
