import React from 'react';
import { MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <MapPin className="w-4 h-4" />
            </div>
            <span className="text-base font-bold text-gray-900 dark:text-white">AI Local Mapper</span>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
            Intelligent AI location discovery platform &copy; {new Date().getFullYear()}
          </p>

          <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
            <span>Powered by Gemini AI</span>
            <span>•</span>
            <span>React Leaflet</span>
            <span>•</span>
            <span>Express</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
