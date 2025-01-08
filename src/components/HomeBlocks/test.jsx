import React from 'react';

const Banner = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Fullscreen Responsive Image */}
      <img
        src="/src/assets/Banner image 4 1.png" // Replace with your image path
        alt="Pizza"
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      {/* Left-Side Content */}
      <div className="absolute inset-0 flex items-center justify-start px-6 md:px-12">
        <div className="p-4 md:p-6 lg:p-8 rounded-lg space-y-4 max-w-xs md:max-w-lg">
          {/* Heading */}
          <h1 className="text-2xl md:text-4xl font-bold leading-tight">
            Taste the <br />
            <span className="text-black font-bold">Best Kebab & Pizza!</span>
          </h1>

          {/* Subtext */}
          <p
            className="text-sm md:text-base leading-5 md:leading-6 text-gray-600"
            style={{ fontFamily: "'Noto Sans', sans-serif" }}
          >
            Where two culinary traditions meet perfection.
          </p>

          {/* Discount and Delivery */}
          <p className="text-sm md:text-base text-gray-800">
            Get <span className="text-red-500 font-bold">10% discount</span> on order above <span className="font-bold">£16</span>
          </p>

          {/* Delivery Info */}
          <div className="flex items-center bg-orange-100 px-4 py-2 rounded-lg">
            <img
              src="/src/assets/delivery.png" // Replace with your PNG file path
              alt="Delivery Icon"
              className="w-5 h-5"
            />
            <span className="ml-2 text-sm md:text-base text-orange-600 font-bold">
              Delivery Time 30 min
            </span>
          </div>

          {/* Button */}
          <button className="bg-red-500 text-white px-6 py-2 rounded-lg text-sm md:text-base mt-4 hover:bg-red-600 transition">
            Check our Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;
