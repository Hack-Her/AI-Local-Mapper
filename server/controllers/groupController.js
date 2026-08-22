const GroupPlan = require('../models/GroupPlan');
const { calculateCentroid } = require('../utils/distanceCalculator');
const recommendationService = require('../services/recommendationService');

const findCentralLocation = async (req, res, next) => {
  try {
    const { members } = req.body;
    if (!members || !Array.isArray(members) || members.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide at least one group member location.' });
    }

    const center = calculateCentroid(members);
    res.json({
      success: true,
      center,
      message: `Calculated central meeting area for ${members.length} members.`,
      explanation: 'This area minimizes the average travel distance for all group members.'
    });
  } catch (error) {
    next(error);
  }
};

const searchGroupPlaces = async (req, res, next) => {
  try {
    const { members, query, preferences } = req.body;
    if (!members || !Array.isArray(members) || members.length === 0) {
      return res.status(400).json({ success: false, message: 'Members array is required' });
    }

    const center = calculateCentroid(members);
    
    // Construct group-optimized prompt
    const groupQuery = `${query || 'Group friendly restaurant or hangout'} for ${members.length} people with good parking and seating capacity`;

    const searchResult = await recommendationService.getRecommendations({
      query: groupQuery,
      location: { latitude: center.latitude, longitude: center.longitude },
      filters: preferences || {}
    });

    // Save group plan to database if user is authenticated
    if (req.user && req.user.id) {
      await GroupPlan.create({
        user: req.user.id,
        members,
        preferences: preferences || {},
        recommendedPlaces: searchResult.places.slice(0, 5)
      }).catch(() => null);
    }

    res.json({
      success: true,
      centerLocation: center,
      extractedRequirements: searchResult.extractedRequirements,
      places: searchResult.places,
      explanation: `This area (Center Lat: ${center.latitude.toFixed(4)}, Lng: ${center.longitude.toFixed(4)}) minimizes the average travel distance for all ${members.length} group members.`
    });
  } catch (error) {
    next(error);
  }
};

const getGroupPlans = async (req, res, next) => {
  try {
    const plans = await GroupPlan.find({ user: req.user.id }).sort({ createdAt: -1 }).catch(() => []);
    res.json({ success: true, plans });
  } catch (error) {
    next(error);
  }
};

module.exports = { findCentralLocation, searchGroupPlaces, getGroupPlans };
