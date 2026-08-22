// Haversine formula to calculate distance between two lat/lng coordinates in kilometers
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return parseFloat(distance.toFixed(2));
};

// Calculate central geographic midpoint (centroid) for group of locations
const calculateCentroid = (locations) => {
  if (!locations || locations.length === 0) {
    return { latitude: 21.1458, longitude: 79.0882 }; // Default center
  }

  let totalLat = 0;
  let totalLng = 0;

  locations.forEach((loc) => {
    totalLat += Number(loc.latitude || 0);
    totalLng += Number(loc.longitude || 0);
  });

  return {
    latitude: parseFloat((totalLat / locations.length).toFixed(4)),
    longitude: parseFloat((totalLng / locations.length).toFixed(4))
  };
};

module.exports = { calculateDistance, calculateCentroid };
