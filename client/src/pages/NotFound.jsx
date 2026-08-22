import React from 'react';
import { Link } from 'react-router-dom';
import { MapPinOff, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center px-4 space-y-4">
      <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
        <MapPinOff className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">404 — Off The Map</h1>
      <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm">
        The page or location parameter you are looking for doesn't exist or has moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center space-x-2 px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-sm"
      >
        <Home className="w-4 h-4" />
        <span>Return to Home</span>
      </Link>
    </div>
  );
};

export default NotFound;
