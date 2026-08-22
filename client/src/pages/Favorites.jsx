import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MapPin, Trash2, Map } from 'lucide-react';
import API from '../api/axios';
import PlaceCard from '../components/PlaceCard';
import PlaceDetails from '../components/PlaceDetails';
import EmptyState from '../components/EmptyState';
import Loading from '../components/Loading';

const Favorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const res = await API.get('/favorites');
      if (res.data.success) {
        setFavorites(res.data.favorites.map(f => f.placeData || f));
      }
    } catch (err) {
      console.error('Fetch favorites error:', err);
      // Local demo fallback if backend offline
      setFavorites([
        {
          id: 'place_101',
          name: 'Artisan Roasters & Workspace',
          rating: 4.7,
          reviewCount: 420,
          priceLevel: '$$',
          address: '45 Creative Square, City Center',
          latitude: 21.1465,
          longitude: 79.0890,
          matchScore: 94,
          distanceKm: 1.1,
          tags: ['Quiet', 'Good Wi-Fi', 'Work Friendly'],
          reasons: ['Peaceful environment for focused work', 'Fast Wi-Fi & outlets at every desk'],
          photos: ['https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemove = async (placeId) => {
    try {
      await API.delete(`/favorites/${placeId}`);
    } catch (err) {
      console.error('Delete favorite error:', err);
    }
    setFavorites(prev => prev.filter(f => (f.id || f.placeId) !== placeId));
  };

  const handleOpenOnMap = (place) => {
    navigate('/explore', {
      state: {
        query: place.name,
        location: { latitude: place.latitude, longitude: place.longitude, city: place.address }
      }
    });
  };

  return (
    <div className="space-y-6 py-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
            <Heart className="w-6 h-6 fill-rose-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your Saved Favorites</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Quick access to your bookmarked places</p>
          </div>
        </div>
      </div>

      {loading ? (
        <Loading message="Loading saved favorites..." />
      ) : favorites.length === 0 ? (
        <EmptyState
          title="No saved places yet"
          description="Click the heart icon on any place card during your search to save it to your favorites."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {favorites.map((place) => (
            <div key={place.id || place.placeId} className="relative group">
              <PlaceCard
                place={place}
                isFavorite={true}
                onSelect={() => setSelectedPlace(place)}
                onToggleFavorite={() => handleRemove(place.id || place.placeId)}
              />
              <button
                onClick={() => handleOpenOnMap(place)}
                className="absolute bottom-4 right-4 flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 text-xs font-semibold hover:bg-blue-100 transition-colors"
              >
                <Map className="w-3.5 h-3.5" />
                <span>Open on Map</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedPlace && (
        <PlaceDetails
          place={selectedPlace}
          onClose={() => setSelectedPlace(null)}
          isFavorite={true}
          onToggleFavorite={() => handleRemove(selectedPlace.id || selectedPlace.placeId)}
        />
      )}
    </div>
  );
};

export default Favorites;
