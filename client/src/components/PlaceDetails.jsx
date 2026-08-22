import React from 'react';
import { X, Star, MapPin, Clock, Phone, CheckCircle2, AlertTriangle, Sparkles, Heart } from 'lucide-react';
import MatchScore from './MatchScore';

const PlaceDetails = ({ place, onClose, onToggleFavorite, isFavorite }) => {
  if (!place) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700">
        
        {/* Header Image */}
        <div className="relative h-56 w-full bg-gray-200 dark:bg-gray-700">
          <img
            src={place.photos?.[0] || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80'}
            alt={place.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white hover:bg-black/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <button
            onClick={() => onToggleFavorite && onToggleFavorite(place)}
            className="absolute top-4 right-16 p-2 rounded-full bg-black/40 text-white hover:text-rose-500 transition-colors"
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>

          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white drop-shadow-md">{place.name}</h2>
              <MatchScore score={place.matchScore} />
            </div>
            <p className="text-sm text-gray-200 flex items-center space-x-1 mt-1">
              <MapPin className="w-4 h-4 text-blue-400" />
              <span>{place.address}</span>
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Quick Metrics */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center space-x-1 text-amber-500 font-bold">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{place.rating}</span>
              <span className="text-xs text-gray-400 font-normal">({place.reviewCount} reviews)</span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-semibold text-blue-600 dark:text-blue-400">{place.distanceKm} km</span> away
            </div>
            <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              {place.priceLevel || 'Moderate'}
            </div>
          </div>

          {/* AI Recommendation Insights */}
          <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 space-y-3">
            <div className="flex items-center space-x-2 text-blue-800 dark:text-blue-300 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>AI Recommendation Insights</span>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Why recommended:</span>
              <ul className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300">
                {(place.reasons || ['Matches your requirement profile', 'Great coffee & Wi-Fi environment']).map((reason, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            {place.concerns && place.concerns.length > 0 && (
              <div className="space-y-1 pt-2 border-t border-blue-100 dark:border-blue-900/50">
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Possible concerns:</span>
                <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                  {place.concerns.map((concern, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span>{concern}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Crowd Insights */}
          {place.crowdInsights && (
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Crowd Insights</h4>
              <p className="text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                {place.crowdInsights}
              </p>
            </div>
          )}

          {/* Opening Hours */}
          {place.openingHours && (
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Opening Hours</h4>
              <div className="flex items-center space-x-2 text-xs text-gray-700 dark:text-gray-300">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>{place.openingHours.join(', ')}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaceDetails;
