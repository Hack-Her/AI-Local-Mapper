import React from 'react';
import { getScoreBadgeColor } from '../utils/helpers';

const MatchScore = ({ score = 85, showLabel = true }) => {
  const badgeStyle = getScoreBadgeColor(score);

  return (
    <div className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold border ${badgeStyle}`}>
      <span>{score}%</span>
      {showLabel && <span>AI Match</span>}
    </div>
  );
};

export default MatchScore;
