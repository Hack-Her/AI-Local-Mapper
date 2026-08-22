import React from 'react';
import { Star, MapPin, CheckCircle2, Heart, ExternalLink, Sparkles } from 'lucide-react';
import MatchScore from './MatchScore';

const PlaceCard = ({ place, isSelected, onSelect, onToggleFavorite, isFavorite }) => {
  return (
    <div
      onClick={onSelect}
      className={`group relative bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all border cursor-pointer ${
        isSelected
          ? 'border-blue-500 ring-2 ring-blue-500/20 dark:border-blue-500'
          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-gray-600'
      }`}
    >
      {/* Hidden gem banner */}
      {place.isHiddenGem && (
        <div className="absolute -top-3 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full shadow-sm flex items-center space-x-1">
          <Sparkles className="w-3 h-3" />
          <span>Potential Hidden Gem</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        {/* Thumbnail Image */}
        <div className="relative w-full sm:w-32 h-32 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 shrink-0">
          <img
            src={place.photos?.[0] || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80'}
            alt={place.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onToggleFavorite) onToggleFavorite(place);
            }}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm text-gray-600 dark:text-gray-300 hover:text-rose-500 transition-colors"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>

        {/* Info Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {place.rank ? `${place.rank}. ` : ''}{place.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{place.address}</p>
            </div>
            <MatchScore score={place.matchScore} />
          </div>

          {/* Metrics bar */}
          <div className="flex items-center space-x-3 text-xs text-gray-600 dark:text-gray-300 mt-2">
            <div className="flex items-center space-x-1 font-semibold text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{place.rating}</span>
              <span className="text-gray-400 font-normal">({place.reviewCount})</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
              <MapPin className="w-3.5 h-3.5 text-blue-500" />
              <span>{place.distanceKm || '1.2'} km away</span>
            </div>
            {place.priceLevel && (
              <>
                <span>•</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{place.priceLevel}</span>
              </>
            )}
          </div>

          {/* AI Tags */}
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {(place.tags || ['Quiet', 'Wi-Fi', 'Work Friendly']).slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/50"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* AI Match Reason snippet */}
          {place.reasons && place.reasons.length > 0 && (
            <div className="mt-2 text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg border border-gray-100 dark:border-gray-800">
              <div className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{place.reasons[0]}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaceCard;
