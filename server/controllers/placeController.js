const recommendationService = require('../services/recommendationService');
const placesService = require('../services/placesService');

// @desc    Search places using AI natural language query or filters
// @route   POST /api/places/search
// @access  Public
const searchPlaces = async (req, res, next) => {
  try {
    const { query, latitude, longitude, city, filters } = req.body;
    
    if (!query && (!latitude || !longitude) && !city) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide a search query or a location (latitude/longitude or city).' 
      });
    }

    const results = await recommendationService.getRecommendations({
      query: query || '',
      location: { latitude, longitude, city },
      filters: filters || {}
    });

    res.json({
      success: true,
      extractedRequirements: results.extractedRequirements,
      total: results.places.length,
      places: results.places,
      fallbackUsed: results.fallbackUsed || false,
      notice: results.notice || null
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single place details by ID
// @route   GET /api/places/:placeId
// @access  Public
const getPlaceDetails = async (req, res, next) => {
  try {
    const { placeId } = req.params;
    const place = await placesService.getPlaceDetails(placeId);
    
    if (!place) {
      return res.status(404).json({ success: false, message: 'Place not found' });
    }

    res.json({ success: true, place });
  } catch (error) {
    next(error);
  }
};

module.exports = { searchPlaces, getPlaceDetails };
