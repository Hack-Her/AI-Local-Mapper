import { useState, useCallback } from 'react';

export const CITIES_DATABASE = [
  { name: 'Nagpur', latitude: 21.1458, longitude: 79.0882 },
  { name: 'Mumbai', latitude: 19.0760, longitude: 72.8777 },
  { name: 'Delhi', latitude: 28.6139, longitude: 77.2090 },
  { name: 'Bangalore', latitude: 12.9716, longitude: 77.5946 },
  { name: 'Pune', latitude: 18.5204, longitude: 73.8567 },
  { name: 'Hyderabad', latitude: 17.3850, longitude: 78.4867 }
];

export const useLocation = () => {
  const [location, setLocation] = useState({
    latitude: 21.1458,
    longitude: 79.0882,
    city: 'Nagpur',
    isDefault: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          city: 'Your Current Location',
          isDefault: false
        });
        setLoading(false);
      },
      (err) => {
        console.warn('Geolocation permission denied or error:', err.message);
        setError('Location permission denied. You can select a city manually below.');
        setLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, []);

  const setManualLocation = useCallback((cityName, lat, lng) => {
    const found = CITIES_DATABASE.find(c => c.name.toLowerCase() === cityName.toLowerCase());
    setLocation({
      latitude: lat || (found ? found.latitude : 21.1458),
      longitude: lng || (found ? found.longitude : 79.0882),
      city: cityName || 'Selected Location',
      isDefault: false
    });
    setError(null);
  }, []);

  return { location, loading, error, requestLocation, setManualLocation };
};
