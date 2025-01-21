import React from "react";
import { motion } from "framer-motion";

const SkeletonBlock = ({ className }) => (
  <motion.div
    className={`bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 ${className}`}
    initial={{ backgroundPosition: "200% 0" }}
    animate={{ backgroundPosition: "-200% 0" }}
    transition={{
      duration: 2.5, // Slow and smooth
      repeat: Infinity,
      ease: "easeInOut",
    }}
    style={{
      backgroundSize: "400% 100%",
    }}
  ></motion.div>
);

const BannerSkeleton = () => {
  return (
    <div className="bg-gray-50">
      {/* Desktop and Tablet Skeleton */}
      <div className="hidden md:block">
        <div className="relative w-full h-screen overflow-hidden">
          {/* Fullscreen Placeholder Image */}
          <SkeletonBlock className="absolute top-0 left-0 w-full h-full" />

          {/* Left-Side Content */}
          <div className="absolute inset-0 flex items-center justify-start px-8">
            <div className="space-y-6 max-w-xs md:max-w-lg">
              {/* Title Skeleton */}
              <SkeletonBlock className="w-3/4 h-8 rounded-md" />
              <SkeletonBlock className="w-1/2 h-8 rounded-md" />

              {/* Subtext Skeleton */}
              <SkeletonBlock className="w-full h-4 rounded-md" />
              <SkeletonBlock className="w-3/4 h-4 rounded-md" />

              {/* Highlight Skeleton */}
              <SkeletonBlock className="w-2/3 h-6 rounded-md" />

              {/* Delivery Skeleton */}
              <div className="flex items-center space-x-4">
                <SkeletonBlock className="w-10 h-10 rounded-full" />
                <SkeletonBlock className="w-1/2 h-4 rounded-md" />
              </div>

              {/* Button Skeleton */}
              <SkeletonBlock className="w-1/3 h-10 rounded-md" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Skeleton */}
      <div className="block md:hidden">
        <div className="relative w-full h-[50vh] sm:h-[60vh] overflow-hidden">
          {/* Fullscreen Placeholder Image */}
          <SkeletonBlock className="absolute top-0 left-0 w-full h-full" />

          {/* Left-Side Content */}
          <div className="absolute inset-0 flex flex-col justify-center items-start px-4 space-y-4">
            {/* Title Skeleton */}
            <SkeletonBlock className="w-2/3 h-8 rounded-md" />
            <SkeletonBlock className="w-1/2 h-8 rounded-md" />

            {/* Subtext Skeleton */}
            <SkeletonBlock className="w-full h-4 rounded-md" />
            <SkeletonBlock className="w-3/4 h-4 rounded-md" />

            {/* Highlight Skeleton */}
            <SkeletonBlock className="w-3/4 h-6 rounded-md" />

            {/* Delivery Skeleton */}
            <div className="flex items-center space-x-4">
              <SkeletonBlock className="w-8 h-8 rounded-full" />
              <SkeletonBlock className="w-1/2 h-4 rounded-md" />
            </div>

            {/* Button Skeleton */}
            <SkeletonBlock className="w-1/2 h-10 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerSkeleton;
