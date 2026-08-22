import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import MatchScore from './MatchScore';

// Helper component to center map dynamically when selected place changes
const MapRecenter = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center.lat && center.lng) {
      map.flyTo([center.lat, center.lng], 14, { duration: 1.0 });
    }
  }, [center, map]);
  return null;
};

// Create custom pin icon with rank integer and match score color
const createCustomPinIcon = (rank, score, isSelected) => {
  const bgColor = isSelected ? '#2563eb' : '#1e293b';
  const ringColor = isSelected ? '0 0 0 4px rgba(37, 99, 235, 0.4)' : 'none';

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: ${bgColor};
        color: white;
        font-weight: 800;
        font-size: 11px;
        padding: 4px 8px;
        border-radius: 9999px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2), ${ringColor};
        border: 2px solid white;
        white-space: nowrap;
        cursor: pointer;
        transition: transform 0.2s ease;
      ">
        <span style="margin-right: 4px;">#${rank}</span>
        <span style="
          background-color: rgba(255,255,255,0.2);
          padding: 1px 4px;
          border-radius: 4px;
          font-size: 10px;
        ">${score}%</span>
      </div>
    `,
    iconSize: [65, 28],
    iconAnchor: [32, 28],
    popupAnchor: [0, -28]
  });
};

const MapComponent = ({ places = [], selectedPlace, onSelectPlace, userLocation }) => {
  const defaultCenter = [
    userLocation?.latitude || 21.1458,
    userLocation?.longitude || 79.0882
  ];

  const targetCenter = selectedPlace
    ? { lat: selectedPlace.latitude, lng: selectedPlace.longitude }
    : { lat: defaultCenter[0], lng: defaultCenter[1] };

  return (
    <div className="w-full h-full min-h-[400px] rounded-2xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-700 relative z-0">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapRecenter center={targetCenter} />

        {/* User Current Location Pin */}
        {userLocation && (
          <Marker position={[userLocation.latitude, userLocation.longitude]}>
            <Popup>
              <div className="p-1 text-center">
                <span className="text-xs font-bold text-blue-600">📍 You are here</span>
                <p className="text-[11px] text-gray-500 mt-0.5">{userLocation.city || 'Current Location'}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Recommended Places Custom Pins */}
        {places.map((place) => {
          const isSelected = selectedPlace?.id === place.id;
          const customIcon = createCustomPinIcon(place.rank || 1, place.matchScore, isSelected);

          return (
            <Marker
              key={place.id}
              position={[place.latitude, place.longitude]}
              icon={customIcon}
              eventHandlers={{
                click: () => onSelectPlace && onSelectPlace(place)
              }}
            >
              <Popup>
                <div className="p-2 max-w-xs space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-sm text-gray-900 leading-snug">{place.name}</h4>
                    <MatchScore score={place.matchScore} showLabel={false} />
                  </div>
                  <p className="text-xs text-gray-500 truncate">{place.address}</p>
                  <div className="flex items-center space-x-2 text-xs font-semibold">
                    <span className="text-amber-500">⭐ {place.rating}</span>
                    <span className="text-gray-400">({place.reviewCount} reviews)</span>
                    <span className="text-blue-600">• {place.distanceKm} km</span>
                  </div>
                  <button
                    onClick={() => onSelectPlace && onSelectPlace(place)}
                    className="w-full py-1.5 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    View Details & AI Insights
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
