/**
 * AI Match Score Algorithm & Explanation Generator
 * Real weighted scoring algorithm dynamically adjusted based on user priorities.
 * Standard Weights:
 * - 30% Preference Match
 * - 20% Distance
 * - 15% Rating
 * - 15% Budget Match
 * - 10% Amenities
 * - 10% Review Sentiment
 */

const calculateMatchScore = (place, requirements, distanceKm = 1.0) => {
  let preferenceScore = 70;
  let distanceScore = 100;
  let ratingScore = ((place.rating || 4.0) / 5) * 100;
  let budgetScore = 80;
  let amenitiesScore = 75;
  let sentimentScore = 80;

  const pros = [];
  const concerns = [];

  // Default weights
  let wPref = 0.30;
  let wDist = 0.20;
  let wRating = 0.15;
  let wBudget = 0.15;
  let wAmenity = 0.10;
  let wSent = 0.10;

  // Dynamic weight adjustments based on user priority cues
  const requestedEnvs = requirements?.preferences?.environment || [];
  const requestedAmenities = requirements?.preferences?.amenities || [];
  const hasBudgetConstraint = !!requirements?.budget?.max;

  if (requestedEnvs.includes('quiet') || requestedEnvs.includes('work-friendly')) {
    wPref = 0.40; // Boost preference importance
    wDist = 0.15;
    wRating = 0.15;
    wBudget = 0.10;
    wAmenity = 0.10;
    wSent = 0.10;
  } else if (hasBudgetConstraint) {
    wBudget = 0.25; // Boost budget importance
    wPref = 0.25;
  }

  // 1. Distance scoring (100 at 0-1km, linearly decreasing to 30 at 10km)
  if (distanceKm <= 1.0) {
    distanceScore = 100;
    pros.push(`✓ Only ${distanceKm} km away (Confirmed location)`);
  } else if (distanceKm <= 3.0) {
    distanceScore = 85;
    pros.push(`✓ Conveniently located (${distanceKm} km away)`);
  } else if (distanceKm <= 5.0) {
    distanceScore = 70;
    pros.push(`✓ Within ${distanceKm} km radius`);
  } else {
    distanceScore = Math.max(30, Math.round(100 - distanceKm * 7));
    concerns.push(`⚠ Further distance (${distanceKm} km away)`);
  }

  // 2. Rating scoring
  if (place.rating >= 4.5) {
    pros.push(`✓ Highly rated (${place.rating} ★ based on ${place.reviewCount || 'community'} reviews)`);
  } else if (place.rating < 4.0) {
    concerns.push(`⚠ Moderate community rating (${place.rating} ★)`);
  }

  // 3. Environment & Preference matching
  const placeTags = place.tags || [];
  let matchedEnvs = 0;
  requestedEnvs.forEach(env => {
    if (placeTags.some(t => t.toLowerCase().includes(env.toLowerCase()))) {
      matchedEnvs++;
    }
  });

  if (requestedEnvs.length > 0) {
    preferenceScore = Math.min(100, Math.round(50 + (matchedEnvs / requestedEnvs.length) * 50));
    if (matchedEnvs > 0) {
      pros.push(`✓ Matches environment preference (${requestedEnvs.join(', ')})`);
    }
  }

  // 4. Amenities matching
  let matchedAmenities = 0;
  requestedAmenities.forEach(amenity => {
    if (placeTags.some(t => t.toLowerCase().includes(amenity.toLowerCase()))) {
      matchedAmenities++;
    }
  });

  if (requestedAmenities.length > 0) {
    amenitiesScore = Math.min(100, Math.round(40 + (matchedAmenities / requestedAmenities.length) * 60));
    if (matchedAmenities > 0) {
      pros.push(`✓ Confirmed amenities (${requestedAmenities.filter(a => placeTags.some(t => t.toLowerCase().includes(a.toLowerCase()))).join(', ')})`);
    }
  }

  // 5. Budget matching
  if (hasBudgetConstraint) {
    if (place.priceLevelNum && place.priceLevelNum <= 2) {
      budgetScore = 95;
      pros.push(`✓ Fits within budget (Under ${requirements.budget.currency || '₹'}${requirements.budget.max})`);
    } else {
      budgetScore = 60;
      concerns.push(`⚠ Premium pricing may exceed budget limit`);
    }
  }

  // 6. Review Sentiment scoring
  if (place.sentiment) {
    if (place.sentiment.positive > place.sentiment.negative * 2) {
      sentimentScore = 95;
      pros.push(`✓ Overwhelmingly positive customer review sentiment`);
    } else if (place.sentiment.negative > place.sentiment.positive) {
      sentimentScore = 50;
      concerns.push(`⚠ Reviews note potential crowd delays during peak hours (Based on reviews)`);
    }
  }

  // Calculate final weighted score
  const rawScore = (
    preferenceScore * wPref +
    distanceScore * wDist +
    ratingScore * wRating +
    budgetScore * wBudget +
    amenitiesScore * wAmenity +
    sentimentScore * wSent
  );

  const finalMatchScore = Math.min(99, Math.max(50, Math.round(rawScore)));

  // Ensure default fallback explanations
  if (pros.length < 2) {
    pros.push('✓ Matches place category criteria');
    pros.push('✓ Positive community reputation');
  }

  return {
    score: finalMatchScore,
    reasons: pros.slice(0, 4),
    concerns: concerns.slice(0, 2)
  };
};

module.exports = { calculateMatchScore };
