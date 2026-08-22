export const formatCurrency = (amount, currency = 'INR') => {
  if (!amount) return 'Free';
  const symbol = currency === 'USD' ? '$' : '₹';
  return `${symbol}${amount}`;
};

export const getScoreBadgeColor = (score) => {
  if (score >= 90) return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-300';
  if (score >= 80) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-300';
  if (score >= 70) return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-300';
  return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-300';
};
