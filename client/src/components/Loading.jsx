import React, { useState, useEffect } from 'react';
import { Bot, MapPin, Star, BrainCircuit } from 'lucide-react';

const LOADING_STEPS = [
  { icon: Bot, text: '🤖 Understanding your request...' },
  { icon: MapPin, text: '📍 Finding nearby places...' },
  { icon: Star, text: '⭐ Analyzing ratings and reviews...' },
  { icon: BrainCircuit, text: '🧠 Calculating your best matches...' }
];

const Loading = ({ message }) => {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 700);
    return () => clearInterval(timer);
  }, []);

  const CurrentIcon = LOADING_STEPS[stepIndex].icon;

  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-6">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/30 animate-pulse">
          <CurrentIcon className="w-8 h-8" />
        </div>
        <div className="absolute -inset-2 rounded-3xl bg-blue-500/20 blur-xl -z-10 animate-ping" />
      </div>

      <div className="text-center space-y-2">
        <p className="text-base font-semibold text-gray-800 dark:text-gray-200">
          {message || LOADING_STEPS[stepIndex].text}
        </p>
        <p className="text-xs text-gray-400">Filtering criteria & review sentiments</p>
      </div>

      {/* Progress dots */}
      <div className="flex space-x-2">
        {LOADING_STEPS.map((_, idx) => (
          <div
            key={idx}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              idx === stepIndex ? 'bg-blue-600 w-6' : 'bg-gray-300 dark:bg-gray-700'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Loading;
