import React from 'react';

const Shimmer = () => (
  <div className="flex items-center justify-center h-screen w-screen bg-gray-100">
    <div className="w-full max-w-lg space-y-4">
      {/* Simulated gradient shimmer */}
      <div className="h-12 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-shimmer rounded"></div>
      <div className="h-8 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-shimmer rounded"></div>
      <div className="h-10 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-shimmer rounded"></div>
      <div className="h-8 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-shimmer rounded"></div>
    </div>
  </div>
);

export default Shimmer;
