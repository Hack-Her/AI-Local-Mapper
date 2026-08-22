/**
 * AI Service for Natural Language Query Parsing & Requirement Extraction
 * Handles Google Gemini API calls, response sanitization, structured JSON schema validation,
 * and graceful keyword heuristic fallback parsing.
 */

// Schema validator to ensure AI output matches expected contract
const validateAIResponse = (data) => {
  if (!data || typeof data !== 'object') return false;

  const validPlaceTypes = ['cafe', 'restaurant', 'library', 'park', 'coworking space', 'shopping mall', 'place'];
  const placeType = typeof data.placeType === 'string' ? data.placeType.toLowerCase() : 'place';

  const preferences = data.preferences && typeof data.preferences === 'object' ? data.preferences : {};
  const environment = Array.isArray(preferences.environment) ? preferences.environment : [];
  const amenities = Array.isArray(preferences.amenities) ? preferences.amenities : [];
  const foodPreferences = Array.isArray(preferences.foodPreferences) ? preferences.foodPreferences : [];

  const budget = data.budget && typeof data.budget === 'object' ? data.budget : {};
  const maxBudget = typeof budget.max === 'number' ? budget.max : null;
  const currency = typeof budget.currency === 'string' ? budget.currency : 'INR';

  return {
    placeType: validPlaceTypes.includes(placeType) ? placeType : 'place',
    preferences: {
      environment,
      amenities,
      foodPreferences
    },
    budget: {
      max: maxBudget,
      currency
    },
    duration: typeof data.duration === 'string' ? data.duration : null,
    occasion: typeof data.occasion === 'string' ? data.occasion : null
  };
};

// Heuristic keyword parser used when AI API key is unavailable or fails
const parseQueryFallback = (query = '') => {
  const q = query.toLowerCase();

  let placeType = 'place';
  if (q.includes('cafe') || q.includes('coffee')) placeType = 'cafe';
  else if (q.includes('restaurant') || q.includes('dinner') || q.includes('food') || q.includes('eat')) placeType = 'restaurant';
  else if (q.includes('library')) placeType = 'library';
  else if (q.includes('park')) placeType = 'park';
  else if (q.includes('coworking') || q.includes('workspace')) placeType = 'coworking space';
  else if (q.includes('mall') || q.includes('shopping')) placeType = 'shopping mall';

  const environment = [];
  if (q.includes('quiet') || q.includes('peaceful') || q.includes('calm')) environment.push('quiet');
  if (q.includes('work') || q.includes('laptop') || q.includes('study')) environment.push('work-friendly');
  if (q.includes('romantic') || q.includes('date')) environment.push('romantic');
  if (q.includes('family') || q.includes('kids')) environment.push('family-friendly');
  if (q.includes('group') || q.includes('friends')) environment.push('group-friendly');

  const amenities = [];
  if (q.includes('wifi') || q.includes('internet')) amenities.push('wifi');
  if (q.includes('plug') || q.includes('charge') || q.includes('charging') || q.includes('outlet')) amenities.push('charging');
  if (q.includes('park') || q.includes('parking')) amenities.push('parking');
  if (q.includes('ac') || q.includes('air condition')) amenities.push('air conditioning');

  const foodPreferences = [];
  if (q.includes('coffee')) foodPreferences.push('good coffee');
  if (q.includes('vegan') || q.includes('vegetarian')) foodPreferences.push('vegan/vegetarian');
  if (q.includes('dessert') || q.includes('cake')) foodPreferences.push('desserts');

  let maxBudget = null;
  const budgetMatch = q.match(/(?:under|below|budget|₹|\$)\s*(\d+)/i);
  if (budgetMatch) {
    maxBudget = parseInt(budgetMatch[1], 10);
  }

  let duration = null;
  const durationMatch = q.match(/(\d+)\s*(?:hour|hrs|hr)/i);
  if (durationMatch) {
    duration = `${durationMatch[1]} hours`;
  }

  return {
    placeType,
    preferences: {
      environment: environment.length > 0 ? environment : ['pleasant'],
      amenities: amenities.length > 0 ? amenities : ['standard amenities'],
      foodPreferences
    },
    budget: {
      max: maxBudget,
      currency: q.includes('$') ? 'USD' : 'INR'
    },
    duration,
    occasion: q.includes('birthday') ? 'birthday' : q.includes('date') ? 'romantic date' : null
  };
};

const extractRequirementsFromQuery = async (userQuery) => {
  if (!userQuery || typeof userQuery !== 'string' || !userQuery.trim()) {
    return validateAIResponse(parseQueryFallback('popular places nearby'));
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.log('[AI Service] No valid Gemini API key configured. Using heuristic AI parser.');
    return validateAIResponse(parseQueryFallback(userQuery));
  }

  try {
    const prompt = `You are a location requirement extraction AI.
Extract structured search criteria from this user query: "${userQuery}".

Return strictly a single raw JSON object matching this schema, without any markdown formatting or extra text:
{
  "placeType": "cafe | restaurant | park | library | coworking space | shopping mall",
  "preferences": {
    "environment": ["quiet", "work-friendly", "romantic", "family-friendly"],
    "amenities": ["wifi", "charging", "parking"],
    "foodPreferences": ["good coffee"]
  },
  "budget": {
    "max": 500,
    "currency": "INR"
  },
  "duration": "3 hours",
  "occasion": "work | romantic date | casual | family"
}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error response status: ${response.status}`);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Sanitize raw text to extract clean JSON object
    const cleanJson = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    const unvalidatedParsed = JSON.parse(cleanJson);
    const validated = validateAIResponse(unvalidatedParsed);

    if (!validated) {
      throw new Error('AI response failed schema validation check');
    }

    return validated;
  } catch (error) {
    console.warn('[AI Service] Gemini extraction error / fallback triggered:', error.message);
    return validateAIResponse(parseQueryFallback(userQuery));
  }
};

module.exports = { extractRequirementsFromQuery, parseQueryFallback, validateAIResponse };
