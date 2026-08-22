/**
 * Recommendation Engine
 * Full orchestration flow:
 * User Query -> AI Extraction -> Geolocation -> Places Search -> Review Analysis -> Weighted Match Score -> Ranking
 */

const { extractRequirementsFromQuery } = require('./aiService');
const { searchNearbyPlaces } = require('./placesService');
const { calculateDistance } = require('../utils/distanceCalculator');
const { calculateMatchScore } = require('../utils/matchScore');

const getRecommendations = async ({ query, location, filters = {} }) => {
  const userLat = location?.latitude || 21.1458;
  const userLng = location?.longitude || 79.0882;

  // 1. AI Requirement Extraction
  const requirements = await extractRequirementsFromQuery(query);

  // 2. Nearby Places Search
  const rawPlaces = await searchNearbyPlaces({
    latitude: userLat,
    longitude: userLng,
    placeType: filters.placeType || requirements.placeType,
    keyword: query
  });

  // 3. Process each place: calculate distance, match score, reasons & concerns
  let processedPlaces = rawPlaces.map((place) => {
    const distanceKm = calculateDistance(userLat, userLng, place.latitude, place.longitude);
    const { score, reasons, concerns } = calculateMatchScore(place, requirements, distanceKm);

    // Potential Hidden Gem logic: high rating (>= 4.5), low review count (< 350)
    const isHiddenGem = place.rating >= 4.5 && place.reviewCount < 350;

    return {
      ...place,
      distanceKm,
      matchScore: score,
      reasons,
      concerns,
      isHiddenGem
    };
  });

  // 4. Apply manual user filters if specified
  if (filters.openNow) {
    processedPlaces = processedPlaces.filter(p => p.openingHours && p.openingHours.length > 0);
  }

  if (filters.minRating) {
    processedPlaces = processedPlaces.filter(p => p.rating >= Number(filters.minRating));
  }

  if (filters.maxDistance) {
    processedPlaces = processedPlaces.filter(p => p.distanceKm <= Number(filters.maxDistance));
  }

  if (filters.hiddenGemsOnly) {
    processedPlaces = processedPlaces.filter(p => p.isHiddenGem);
  }

  // 5. Rank places by matchScore in descending order
  processedPlaces.sort((a, b) => b.matchScore - a.matchScore);

  // Attach explicit rank integer (1, 2, 3...)
  const rankedPlaces = processedPlaces.map((p, idx) => ({
    ...p,
    rank: idx + 1
  }));

  return {
    extractedRequirements: requirements,
    total: rankedPlaces.length,
    places: rankedPlaces,
    fallbackUsed: !process.env.GEMINI_API_KEY,
    notice: !process.env.GEMINI_API_KEY ? 'AI requirement extraction operating with smart heuristic parser.' : null
  };
};

module.exports = { getRecommendations };
