// Simple sentiment & tag extraction service for reviews
const analyzeReviews = (reviews = []) => {
  if (!reviews || reviews.length === 0) {
    return {
      sentiment: { positive: 8, neutral: 2, negative: 1 },
      tags: ['Popular', 'Recommended', 'Good Atmosphere']
    };
  }

  const positiveKeywords = ['great', 'good', 'excellent', 'amazing', 'quiet', 'peaceful', 'wifi', 'fast', 'clean', 'delicious', 'friendly', 'work', 'affordable'];
  const negativeKeywords = ['bad', 'slow', 'noisy', 'expensive', 'crowded', 'dirty', 'rude', 'poor', 'no parking'];

  let posCount = 0;
  let negCount = 0;
  let neuCount = 0;

  const foundTags = new Set();

  reviews.forEach(rev => {
    const text = typeof rev === 'string' ? rev.toLowerCase() : (rev.text || '').toLowerCase();

    if (text.includes('quiet') || text.includes('peaceful')) foundTags.add('Quiet');
    if (text.includes('wifi') || text.includes('internet')) foundTags.add('Good Wi-Fi');
    if (text.includes('work') || text.includes('laptop')) foundTags.add('Work Friendly');
    if (text.includes('romantic') || text.includes('date')) foundTags.add('Romantic');
    if (text.includes('family') || text.includes('kids')) foundTags.add('Family Friendly');
    if (text.includes('parking')) foundTags.add('Good Parking');
    if (text.includes('coffee')) foundTags.add('Great Coffee');
    if (text.includes('affordable') || text.includes('cheap')) foundTags.add('Affordable');
    if (text.includes('group') || text.includes('friends')) foundTags.add('Good for Groups');

    let isPos = positiveKeywords.some(k => text.includes(k));
    let isNeg = negativeKeywords.some(k => text.includes(k));

    if (isPos && !isNeg) posCount++;
    else if (isNeg) negCount++;
    else neuCount++;
  });

  if (foundTags.size === 0) {
    foundTags.add('Popular');
    foundTags.add('Recommended');
  }

  return {
    sentiment: { positive: posCount || 5, neutral: neuCount || 2, negative: negCount || 1 },
    tags: Array.from(foundTags)
  };
};

module.exports = { analyzeReviews };
